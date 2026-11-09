/**
 * Free-path prospecting runner: plan → discover → email research → MX → score → artifacts.
 * Never fabricates leads/emails. Unknown stays null with blockers noted.
 * BYOK path can enrich later via Composio; free path works with zero paid keys.
 */

import { randomUUID } from "node:crypto";
import { buildPlanFromBrief } from "./plan";
import { freeDiscover } from "./free-search";
import { guessBusinessEmails } from "./email-patterns";
import { lookupMx, shouldSkipVerification } from "./mx";
import {
  classifyDisposition,
  computeScore,
  tierFromScore,
} from "./scoring";
import { leadsToCsv, validateLeads } from "./validator";
import type {
  CreateRunRequest,
  ProspectLead,
  ProspectingPlan,
  RunArtifacts,
  RunStep,
  ScoreBreakdown,
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
  notes: string[];
  validation_ok: boolean;
}

function extractDomainCandidates(hits: { url: string; title: string; snippet: string }[]): {
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
      if (
        /duckduckgo|google\.|bing\.|yahoo\.|x\.com|twitter\.|linkedin\.|facebook\./i.test(
          host
        )
      ) {
        continue;
      }
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
  opts?: { runId?: string; onProgress?: (p: RunnerProgress) => void }
): Promise<RunnerResult> {
  const progress: RunnerProgress[] = [];
  const notes: string[] = [];
  const mark = (step: RunStep, message: string) => {
    const p = { step, message, at: new Date().toISOString() };
    progress.push(p);
    opts?.onProgress?.(p);
  };

  // 1. Plan
  mark("plan", "Building plan.json from brief");
  const plan = buildPlanFromBrief(req.brief, {
    ...req.plan,
    enrichment_mode: req.enrichment_mode ?? req.plan?.enrichment_mode ?? "free",
  });

  // 2. Discover (free path)
  mark("discover", "Free discovery via DuckDuckGo + X public search");
  const queries = [
    `${plan.icp} ${plan.signals[0] || "hiring"}`,
    ...(plan.roles.slice(0, 2).map((r) => `${plan.icp} ${r}`)),
  ];
  const allHits = [];
  for (const q of queries.slice(0, 3)) {
    const { hits, notes: n } = await freeDiscover(q);
    notes.push(...n.map((x) => `[${q}] ${x}`));
    allHits.push(...hits);
  }

  const companies = extractDomainCandidates(allHits).slice(
    0,
    plan.quantity_companies
  );

  if (companies.length === 0) {
    notes.push(
      "No company domains resolved from search hits. Returning empty lead set (not fabricated)."
    );
  }

  // 3. Email research + 4. MX + 5. Score
  mark("email_research", "Pattern research (guesses labeled UNVERIFIED)");
  mark("mx_verify", "DNS/MX lookups per unique domain");
  const mxCache = new Map<string, Awaited<ReturnType<typeof lookupMx>>>();
  const leads: ProspectLead[] = [];

  for (const c of companies) {
    let mx = mxCache.get(c.domain);
    if (!mx) {
      try {
        mx = await lookupMx(c.domain);
      } catch (err) {
        mx = {
          domain: c.domain,
          status: "unknown",
          mx: [],
          hasA: false,
          hasAAAA: false,
          checked_at: new Date().toISOString(),
          error: err instanceof Error ? err.message : String(err),
        };
      }
      mxCache.set(c.domain, mx);
    }

    // Without a named contact from permitted sources, keep contact_name null
    const contactName: string | null = null;
    const title: string | null = null;
    const blockers: string[] = [];

    if (!c.signal && plan.mode === "signal-driven") {
      blockers.push("no_observed_signal");
    }
    if (shouldSkipVerification(mx.status)) {
      blockers.push(`dns_${mx.status}_skip_verify`);
    }

    let email: string | null = null;
    let provenance: string | null = null;
    let emailEvidence: "exact_valid" | "published_unverified" | "guessed" | "none" =
      "none";

    // Free path: only guess if we had a named contact (we don't fabricate names)
    if (contactName) {
      const guesses = guessBusinessEmails(contactName, c.domain);
      if (guesses[0] && !shouldSkipVerification(mx.status)) {
        email = guesses[0].email;
        provenance = `guessed:${guesses[0].pattern}`;
        emailEvidence = "guessed";
        blockers.push("email_unverified_guess");
      }
    } else {
      blockers.push("no_named_contact_from_permitted_sources");
    }

    const scoreInput = {
      icpConfirmed: false, // free path cannot confirm without stronger evidence
      targetingRelevant: Boolean(c.signal),
      evidenceAgeDays: null as number | null,
      freshnessWindowDays: plan.freshness_days,
      roleConfirmed: false,
      sourceQuality: (c.source_urls.length ? "secondary" : "insufficient") as
        | "primary"
        | "secondary"
        | "insufficient",
      emailEvidence,
      isCatchAll: false,
      mode: plan.mode,
    };

    const breakdown: ScoreBreakdown = computeScore(scoreInput);
    const tier = tierFromScore(breakdown.total);
    const verification_status = shouldSkipVerification(mx.status)
      ? ("not_checked" as const)
      : email
        ? ("not_checked" as const)
        : ("not_checked" as const);

    const disposition = classifyDisposition({
      score: breakdown,
      verificationStatus: verification_status,
      icpConfirmed: scoreInput.icpConfirmed,
      roleConfirmed: scoreInput.roleConfirmed,
      excluded: mx.status === "null_mx" || mx.status === "nxdomain",
    });

    leads.push({
      id: `lead_${randomUUID().slice(0, 8)}`,
      run_id: opts?.runId ?? null,
      company: c.company,
      domain: c.domain,
      contact_name: contactName,
      title,
      profile_url: null,
      email,
      signal: c.signal,
      signal_event_date: null,
      source_urls: c.source_urls,
      provenance,
      dns_status: mx.status,
      verification_status,
      disposition:
        mx.status === "null_mx" || mx.status === "nxdomain"
          ? "excluded"
          : disposition,
      score_breakdown: breakdown,
      icp_score: breakdown.total,
      tier,
      blockers,
      status: "ready",
    });
  }

  mark("score", `Scored ${leads.length} leads`);
  mark("artifacts", "Building CSV + run_report");

  const validation = validateLeads(leads);
  const sure = leads.filter((l) => l.disposition === "sure");
  const review = leads.filter((l) => l.disposition === "needs_review");
  const rejected = leads.filter(
    (l) => l.disposition === "rejected" || l.disposition === "excluded"
  );

  const report = [
    `# Prospect Pal run report`,
    ``,
    `- Generated: ${new Date().toISOString()}`,
    `- Enrichment mode: ${plan.enrichment_mode}`,
    `- Companies resolved: ${companies.length}`,
    `- Leads: ${leads.length} (sure=${sure.length}, review=${review.length}, rejected/excluded=${rejected.length})`,
    `- Validation: ${validation.ok ? "ok" : "issues"}`,
    ``,
    `## Notes`,
    ...notes.map((n) => `- ${n}`),
    ``,
    `## Honesty`,
    `- No leads or emails were fabricated.`,
    `- Named contacts require permitted public evidence; absent contacts stay null.`,
    `- MX confirms mail routing only, not mailbox existence.`,
    `- Catch-all / accept_all is never treated as valid.`,
    ``,
    validation.ok
      ? ""
      : `## Validation issues\n${validation.issues.map((i) => `- ${i.path}: ${i.message}`).join("\n")}`,
  ].join("\n");

  const artifacts: RunArtifacts = {
    plan,
    leads_csv: leadsToCsv(leads),
    sure_list_csv: leadsToCsv(sure),
    review_list_csv: leadsToCsv(review),
    rejected_csv: leadsToCsv(rejected),
    run_report_md: report,
  };

  return {
    plan,
    leads,
    artifacts,
    progress,
    notes,
    validation_ok: validation.ok,
  };
}
