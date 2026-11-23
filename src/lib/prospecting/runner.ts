/**
 * Outbound agent harness runner (Phase A):
 *   plan → discover → enrich → verify → guard → score → artifacts
 *
 * - discover: free path (DuckDuckGo + X public search) for company domains.
 * - enrich: branches on enrichment_mode — free | byok (Composio Apollo/Hunter,
 *   first hit wins) | dual (all providers merged, free pattern fallback).
 * - verify: DNS/MX per domain (mail routing only, not mailbox existence).
 * - guard: suppression list + cross-run dedupe (flagged, never re-queued).
 * Never fabricates leads, names or emails. Unknown stays null with blockers.
 */

import { randomUUID } from "node:crypto";
import { buildPlanFromBrief } from "./plan";
import { freeDiscover } from "./free-search";
import { guessBusinessEmails } from "./email-patterns";
import { lookupMx, shouldSkipVerification } from "./mx";
import {
  runEnrichmentWaterfall,
  type ContactCandidate,
  type EnrichmentProvider,
} from "./enrichment";
import { applyGuard, checkLeadGuard, type GuardIndex } from "./guardrails";
import { RunEventRecorder, type RunEventSink } from "./run-events";
import {
  classifyDisposition,
  computeScore,
  tierFromScore,
} from "./scoring";
import { leadsToCsv, validateLeads } from "./validator";
import type {
  CreateRunRequest,
  EnrichmentMode,
  LeadEnrichment,
  ProspectLead,
  ProspectingPlan,
  RunArtifacts,
  RunEvent,
  RunStep,
  ScoreBreakdown,
  VerificationStatus,
} from "./types";

export interface RunnerProgress {
  step: RunStep;
  message: string;
  at: string;
}

export interface RunnerResult {
  plan: ProspectingPlan;
  leads: ProspectLead[];
  artifacts: RunArtifacts;
  progress: RunnerProgress[];
  events: RunEvent[];
  notes: string[];
  validation_ok: boolean;
}

export interface RunnerDeps {
  discover?: typeof freeDiscover;
  lookupMx?: typeof lookupMx;
  /** Connected BYOK providers (Composio Apollo/Hunter). Empty = none connected. */
  providers?: EnrichmentProvider[];
  /** Suppression + prior-lead index for the run owner. */
  guard?: GuardIndex;
}

export interface RunnerOptions {
  runId?: string;
  /** Called with the new entry AND the full accumulated log (never overwrite). */
  onProgress?: (p: RunnerProgress, all: RunnerProgress[]) => void | Promise<void>;
  onEvent?: RunEventSink;
  deps?: RunnerDeps;
}

function roleMatches(title: string | null, roles: string[]): boolean {
  if (!title) return false;
  const t = title.toLowerCase();
  return roles.some((r) => {
    const rl = r.toLowerCase().trim();
    if (!rl) return false;
    if (t.includes(rl)) return true;
    const words = rl.split(/\s+/).filter((w) => w.length > 2 && !["of", "and", "the"].includes(w));
    return words.length > 0 && words.every((w) => t.includes(w));
  });
}

type EmailEvidence = "exact_valid" | "published_unverified" | "guessed" | "none";

/** Search engines / social hosts that are never a prospect's company domain. */
const NOISE_HOSTS = [
  "duckduckgo.com",
  "x.com",
  "twitter.com",
  "linkedin.com",
  "facebook.com",
  "bing.com",
  "yahoo.com",
];

export function isNoiseHost(host: string): boolean {
  const h = host.toLowerCase();
  if (/(^|\.)google\.[a-z.]+$/.test(h)) return true;
  return NOISE_HOSTS.some((n) => h === n || h.endsWith(`.${n}`));
}

export function extractDomainCandidates(hits: { url: string; title: string; snippet: string }[]): {
  company: string;
  domain: string;
  source_urls: { url: string; excerpt?: string }[];
  signal: string | null;
}[] {
  const out: {
    company: string;
    domain: string;
    source_urls: { url: string; excerpt?: string }[];
    signal: string | null;
  }[] = [];
  const seen = new Set<string>();

  for (const h of hits) {
    try {
      const u = new URL(h.url);
      const host = u.hostname.replace(/^www\./, "");
      // Skip search engines / social noise for "company domain"
      if (isNoiseHost(host)) continue;
      if (seen.has(host)) continue;
      seen.add(host);
      const companyGuess =
        h.title.split(/[-–|·]/)[0]?.trim() ||
        host.split(".")[0];
      const signal = /hiring|fund|series|launch|expand/i.test(
        `${h.title} ${h.snippet}`
      )
        ? (h.snippet || h.title).slice(0, 240)
        : null;
      out.push({
        company: companyGuess,
        domain: host,
        source_urls: [{ url: h.url, excerpt: h.snippet?.slice(0, 280) }],
        signal,
      });
    } catch {
      /* skip bad URL */
    }
  }
  return out;
}

export async function executeProspectingRun(
  req: CreateRunRequest,
  opts: RunnerOptions = {}
): Promise<RunnerResult> {
  const progress: RunnerProgress[] = [];
  const notes: string[] = [];
  const deps = opts.deps || {};
  const discover = deps.discover || freeDiscover;
  const mxLookup = deps.lookupMx || lookupMx;
  const providers = deps.providers || [];
  const recorder = new RunEventRecorder(opts.runId ?? null, opts.onEvent);

  const mark = async (step: RunStep, message: string) => {
    const p = { step, message, at: new Date().toISOString() };
    progress.push(p);
    await opts.onProgress?.(p, [...progress]);
  };

  // 1. Plan
  await mark("plan", "Building plan.json from brief");
  const mode: EnrichmentMode = req.enrichment_mode ?? req.plan?.enrichment_mode ?? "free";
  const plan = await recorder.step("plan", "Plan built from brief", (meta) => {
    const p = buildPlanFromBrief(req.brief, { ...req.plan, enrichment_mode: mode });
    meta.icp = p.icp.slice(0, 200);
    meta.roles = p.roles;
    meta.enrichment_mode = p.enrichment_mode;
    meta.quantity_companies = p.quantity_companies;
    return p;
  });

  // 2. Discover (free path — always; BYOK providers enrich, not discover, in Phase A)
  await mark("discover", "Free discovery via DuckDuckGo + X public search");
  const companies = await recorder.step("discover", "Discovery complete", async (meta) => {
    const queries = [
      `${plan.icp} ${plan.signals[0] || "hiring"}`,
      ...plan.roles.slice(0, 2).map((r) => `${plan.icp} ${r}`),
    ].slice(0, 3);
    const allHits: { url: string; title: string; snippet: string }[] = [];
    for (const q of queries) {
      const { hits, notes: n } = await discover(q);
      notes.push(...n.map((x) => `[${q}] ${x}`));
      allHits.push(...hits);
    }
    const found = extractDomainCandidates(allHits).slice(0, plan.quantity_companies);
    meta.queries = queries;
    meta.hits = allHits.length;
    meta.companies = found.length;
    if (found.length === 0) {
      notes.push("No company domains resolved from search hits. Returning empty lead set (not fabricated).");
      meta.level = "warn";
      meta.message = "No company domains resolved (nothing fabricated)";
    }
    return found;
  });

  // 3. Enrich (mode-branching waterfall)
  await mark("enrich", `Enrichment waterfall (${mode})`);
  const enrichByDomain = await recorder.step("enrich", `Enrichment (${mode}) complete`, async (meta) => {
    const out = new Map<string, Awaited<ReturnType<typeof runEnrichmentWaterfall>>>();
    let providerContacts = 0;
    let fallbacks = 0;
    for (const c of companies) {
      const w = await runEnrichmentWaterfall({
        mode,
        domain: c.domain,
        roles: plan.roles,
        limit: plan.contacts_per_company,
        providers,
      });
      providerContacts += w.contacts.length;
      if (w.usedFreeFallback) fallbacks++;
      out.set(c.domain, w);
    }
    meta.mode = mode;
    meta.providers = providers.map((p) => p.id);
    meta.provider_contacts = providerContacts;
    meta.free_fallbacks = fallbacks;
    if (mode !== "free" && providers.length === 0) {
      notes.push(`${mode} mode requested but no Apollo/Hunter connection found in Composio — free path used for every company.`);
      meta.level = "warn";
      meta.message = `${mode}: no connected provider — free fallback`;
    }
    return out;
  });

  // 4. Verify (DNS/MX)
  await mark("verify", "DNS/MX lookups per unique domain");
  const mxByDomain = await recorder.step("verify", "DNS/MX verification complete", async (meta) => {
    const cache = new Map<string, Awaited<ReturnType<typeof lookupMx>>>();
    for (const c of companies) {
      if (cache.has(c.domain)) continue;
      try {
        cache.set(c.domain, await mxLookup(c.domain));
      } catch (err) {
        cache.set(c.domain, {
          domain: c.domain,
          status: "unknown",
          mx: [],
          hasA: false,
          hasAAAA: false,
          checked_at: new Date().toISOString(),
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
    const counts: Record<string, number> = {};
    for (const r of cache.values()) counts[r.status] = (counts[r.status] || 0) + 1;
    meta.dns = counts;
    return cache;
  });

  // Build leads
  const leads: ProspectLead[] = [];
  for (const c of companies) {
    const mx = mxByDomain.get(c.domain)!;
    const w = enrichByDomain.get(c.domain)!;
    const skipVerify = shouldSkipVerification(mx.status);
    const contacts: (ContactCandidate | null)[] = w.contacts.length ? w.contacts : [null];

    for (const contact of contacts) {
      const blockers: string[] = [];
      if (!c.signal && plan.mode === "signal-driven") blockers.push("no_observed_signal");
      if (skipVerify) blockers.push(`dns_${mx.status}_skip_verify`);

      const contactName = contact?.contact_name ?? null;
      const title = contact?.title ?? null;
      let email: string | null = contact?.email ?? null;
      let provenance: string | null = contact?.provenance ?? null;
      let verification_status: VerificationStatus = contact?.email
        ? contact.verification_status
        : "not_checked";
      let emailEvidence: EmailEvidence = "none";
      const enrichment: LeadEnrichment = {
        mode,
        source: contact ? contact.source : w.usedFreeFallback ? "free" : "none",
        attempted: w.attempted,
        notes: [...w.notes],
      };

      if (email) {
        if (skipVerify) {
          // Domain cannot receive mail — never treat provider claims as valid.
          verification_status = "not_checked";
          emailEvidence = "none";
        } else if (verification_status === "valid") {
          emailEvidence = "exact_valid";
        } else if (verification_status === "accept_all") {
          emailEvidence = "published_unverified";
          blockers.push("accept_all_never_valid");
        } else {
          emailEvidence = "published_unverified";
          blockers.push("email_provider_unverified");
        }
      } else if (contactName && (mode === "dual" || mode === "byok") && !skipVerify) {
        // Free pattern fallback on a provider-sourced (real) name only.
        const guesses = guessBusinessEmails(contactName, c.domain);
        if (guesses[0]) {
          email = guesses[0].email;
          provenance = `${provenance ? `${provenance}+` : ""}guessed:${guesses[0].pattern}`;
          emailEvidence = "guessed";
          verification_status = "not_checked";
          blockers.push("email_unverified_guess");
          enrichment.notes.push("free_pattern_guess_on_provider_name");
        }
      }

      if (!contactName) blockers.push("no_named_contact_from_permitted_sources");

      const roleConfirmed = contact ? roleMatches(title, plan.roles) : false;
      const isCatchAll = verification_status === "accept_all";
      const breakdown: ScoreBreakdown = computeScore({
        icpConfirmed: false, // ICP fit requires sourced company evidence (Phase B)
        targetingRelevant: Boolean(c.signal),
        evidenceAgeDays: null,
        freshnessWindowDays: plan.freshness_days,
        roleConfirmed,
        sourceQuality: c.source_urls.length || contact ? "secondary" : "insufficient",
        emailEvidence,
        isCatchAll,
        mode: plan.mode,
      });
      const excluded = mx.status === "null_mx" || mx.status === "nxdomain";
      const disposition = classifyDisposition({
        score: breakdown,
        verificationStatus: verification_status,
        isCatchAll,
        icpConfirmed: false,
        roleConfirmed,
        excluded,
      });

      leads.push({
        id: `lead_${randomUUID().replace(/-/g, "").slice(0, 16)}`,
        run_id: opts.runId ?? null,
        workspace_id: req.workspace_id ?? null,
        company: c.company,
        domain: c.domain,
        contact_name: contactName,
        title,
        profile_url: contact?.profile_url ?? null,
        email,
        signal: c.signal,
        signal_event_date: null,
        source_urls: c.source_urls,
        provenance,
        dns_status: mx.status,
        verification_status,
        disposition: excluded ? "excluded" : disposition,
        score_breakdown: breakdown,
        icp_score: breakdown.total,
        tier: tierFromScore(breakdown.total),
        blockers,
        status: "ready",
        enrichment,
      });
    }
  }

  // 5. Guard (suppression + cross-run dedupe)
  await mark("guard", "Suppression list + cross-run dedupe");
  const guarded = await recorder.step("guard", "Guardrails applied", (meta) => {
    if (!deps.guard) {
      meta.skipped = "no_guard_index";
      return leads;
    }
    let suppressed = 0;
    let duplicates = 0;
    const seenThisRun = new Set<string>();
    const out = leads.map((l) => {
      const verdict = checkLeadGuard(l, deps.guard!);
      if (verdict.flag === "suppressed") suppressed++;
      if (verdict.flag === "duplicate_prior_run") duplicates++;
      const key = l.email || `${l.domain}|${l.contact_name || ""}`;
      if (!verdict.flag && seenThisRun.has(key)) {
        return applyGuard(l, { flag: "duplicate_prior_run", reason: "duplicate_in_run" });
      }
      seenThisRun.add(key);
      return applyGuard(l, verdict);
    });
    meta.suppressed = suppressed;
    meta.duplicate_prior_run = duplicates;
    if (suppressed || duplicates) {
      notes.push(`Guardrails: ${suppressed} suppressed, ${duplicates} duplicate(s) from prior runs (flagged, not re-queued).`);
    }
    return out;
  });

  // 6. Score summary
  await mark("score", `Scored ${guarded.length} leads`);
  await recorder.step("score", `Scored ${guarded.length} leads`, (meta) => {
    const tiers: Record<string, number> = { A: 0, B: 0, C: 0 };
    for (const l of guarded) if (l.tier) tiers[l.tier]++;
    meta.tiers = tiers;
    meta.sure = guarded.filter((l) => l.disposition === "sure").length;
  });

  // 7. Artifacts
  await mark("artifacts", "Building CSV + run_report");
  const { artifacts, validation } = await recorder.step("artifacts", "Artifacts built", (meta) => {
    const validation = validateLeads(guarded);
    const sure = guarded.filter((l) => l.disposition === "sure");
    const review = guarded.filter((l) => l.disposition === "needs_review");
    const rejected = guarded.filter((l) => l.disposition === "rejected" || l.disposition === "excluded");
    const providerLeads = guarded.filter((l) => l.enrichment && ["apollo", "hunter"].includes(l.enrichment.source));
    const report = [
      `# Prospect Pal run report`,
      ``,
      `- Generated: ${new Date().toISOString()}`,
      `- Enrichment mode: ${plan.enrichment_mode}`,
      `- Providers connected: ${providers.map((p) => p.id).join(", ") || "none"}`,
      `- Companies resolved: ${companies.length}`,
      `- Leads: ${guarded.length} (sure=${sure.length}, review=${review.length}, rejected/excluded=${rejected.length})`,
      `- Provider-sourced contacts: ${providerLeads.length}`,
      `- Validation: ${validation.ok ? "ok" : "issues"}`,
      ``,
      `## Notes`,
      ...notes.map((n) => `- ${n}`),
      ``,
      `## Honesty`,
      `- No leads, names or emails were fabricated.`,
      `- Named contacts come only from connected providers (Apollo/Hunter via Composio) or permitted public evidence; absent contacts stay null.`,
      `- Pattern guesses are labeled guessed and unverified.`,
      `- MX confirms mail routing only, not mailbox existence.`,
      `- Catch-all / accept_all is never treated as valid.`,
      `- Suppressed and prior-run duplicates are flagged excluded, never re-queued.`,
      ``,
      validation.ok
        ? ""
        : `## Validation issues\n${validation.issues.map((i) => `- ${i.path}: ${i.message}`).join("\n")}`,
    ].join("\n");
    meta.validation_ok = validation.ok;
    const artifacts: RunArtifacts = {
      plan,
      leads_csv: leadsToCsv(guarded),
      sure_list_csv: leadsToCsv(sure),
      review_list_csv: leadsToCsv(review),
      rejected_csv: leadsToCsv(rejected),
      run_report_md: report,
    };
    return { artifacts, validation };
  });

  return {
    plan,
    leads: guarded,
    artifacts,
    progress,
    events: recorder.events,
    notes,
    validation_ok: validation.ok,
  };
}
