/**
 * BYOK / Dual enrichment waterfall.
 *
 * Providers run through Composio on the user's own connected accounts
 * (Apollo, Hunter). This module is pure: the Composio executor is injected so
 * the waterfall can be unit-tested and never imports composio-core into a
 * client bundle.
 *
 * Honesty rules:
 * - Only names/emails returned by a provider are used. Nothing is invented.
 * - Provider "verified" claims are recorded as provenance, and catch-all /
 *   accept_all is never treated as valid.
 */

import type { EnrichmentMode, VerificationStatus } from "./types";

export type EnrichmentProviderId = "apollo" | "hunter";

export interface ContactCandidate {
  contact_name: string | null;
  title: string | null;
  email: string | null;
  profile_url: string | null;
  source: EnrichmentProviderId;
  /** e.g. "apollo:people_search" or "hunter:domain_search(confidence=91)" */
  provenance: string;
  verification_status: VerificationStatus;
}

export interface ProviderResult {
  contacts: ContactCandidate[];
  error?: string;
  note?: string;
}

export interface EnrichmentProvider {
  id: EnrichmentProviderId;
  enrichDomain(domain: string, roles: string[], limit: number): Promise<ProviderResult>;
}

/** Shape of `executeComposioAction` from `@/lib/composio`. */
export type ComposioExecutor = (
  action: string,
  params: Record<string, unknown>,
  userId: string
) => Promise<{ data: unknown } | { error: string }>;

export const ENRICHMENT_APPS: EnrichmentProviderId[] = ["apollo", "hunter"];

export const COMPOSIO_ACTIONS = {
  apollo: process.env.COMPOSIO_APOLLO_PEOPLE_ACTION || "APOLLO_PEOPLE_SEARCH",
  hunter: process.env.COMPOSIO_HUNTER_DOMAIN_ACTION || "HUNTER_DOMAIN_SEARCH",
} as const;

// ---------------------------------------------------------------------------
// Response parsing (defensive — Composio wraps provider payloads differently
// across versions: {data:{...}}, {data:{data:{...}}}, {response_data:{...}}).
// ---------------------------------------------------------------------------

type Json = Record<string, unknown>;

function isObj(v: unknown): v is Json {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

/** Walk common wrapper keys and return the first array found under `key`. */
export function findArray(payload: unknown, keys: string[], depth = 0): Json[] {
  if (depth > 5 || payload == null) return [];
  if (isObj(payload)) {
    for (const k of keys) {
      const v = payload[k];
      if (Array.isArray(v)) return v.filter(isObj);
    }
    for (const wrap of ["data", "response_data", "result", "response", "body"]) {
      if (wrap in payload) {
        const found = findArray(payload[wrap], keys, depth + 1);
        if (found.length) return found;
      }
    }
  }
  return [];
}

function composioFailure(payload: unknown): string | null {
  if (!isObj(payload)) return null;
  const ok = payload.successful ?? payload.successfull ?? payload.success;
  if (ok === false) {
    return str(payload.error) || "provider_returned_unsuccessful";
  }
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanEmail(v: unknown, domain: string): string | null {
  const e = str(v)?.toLowerCase() ?? null;
  if (!e || !EMAIL_RE.test(e)) return null;
  // Apollo masks unrevealed emails (email_not_unlocked@domain.com)
  if (/not_unlocked|placeholder/i.test(e)) return null;
  const d = e.split("@")[1];
  if (d !== domain && !d.endsWith(`.${domain}`)) return null;
  return e;
}

export function mapApolloStatus(s: unknown): VerificationStatus {
  const v = String(s ?? "").toLowerCase();
  if (v === "verified") return "valid";
  if (v === "accept_all" || v === "catch_all" || v === "catchall") return "accept_all";
  if (v === "invalid" || v === "bounced") return "invalid";
  if (v) return "unknown";
  return "not_checked";
}

export function mapHunterStatus(s: unknown): VerificationStatus {
  const v = String(s ?? "").toLowerCase();
  if (v === "valid") return "valid";
  if (v === "accept_all") return "accept_all";
  if (v === "invalid") return "invalid";
  if (v) return "unknown";
  return "not_checked";
}

export function parseApolloPeople(payload: unknown, domain: string): ContactCandidate[] {
  return findArray(payload, ["people", "contacts"]).map((p) => {
    const name =
      str(p.name) ||
      [str(p.first_name), str(p.last_name)].filter(Boolean).join(" ") ||
      null;
    const email = cleanEmail(p.email, domain);
    return {
      contact_name: name,
      title: str(p.title),
      email,
      profile_url: str(p.linkedin_url),
      source: "apollo" as const,
      provenance: `apollo:people_search${p.email_status ? `(email_status=${String(p.email_status)})` : ""}`,
      verification_status: email ? mapApolloStatus(p.email_status) : "not_checked",
    };
  }).filter((c) => c.contact_name);
}

export function parseHunterEmails(payload: unknown, domain: string): ContactCandidate[] {
  return findArray(payload, ["emails"]).map((e) => {
    const name = [str(e.first_name), str(e.last_name)].filter(Boolean).join(" ") || null;
    const email = cleanEmail(e.value ?? e.email, domain);
    const verification = isObj(e.verification) ? e.verification.status : undefined;
    const confidence = typeof e.confidence === "number" ? e.confidence : null;
    return {
      contact_name: name,
      title: str(e.position),
      email,
      profile_url: str(e.linkedin),
      source: "hunter" as const,
      provenance: `hunter:domain_search${confidence != null ? `(confidence=${confidence})` : ""}`,
      verification_status: email ? mapHunterStatus(verification) : "not_checked",
    };
  }).filter((c) => c.email || c.contact_name);
}

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

export function createComposioProviders(
  userId: string,
  connectedApps: string[],
  execute: ComposioExecutor
): EnrichmentProvider[] {
  const providers: EnrichmentProvider[] = [];
  const connected = new Set(connectedApps.map((a) => a.toLowerCase()));

  if (connected.has("apollo")) {
    providers.push({
      id: "apollo",
      async enrichDomain(domain, roles, limit) {
        const r = await execute(
          COMPOSIO_ACTIONS.apollo,
          {
            q_organization_domains: domain,
            person_titles: roles,
            per_page: Math.max(1, Math.min(limit, 10)),
          },
          userId
        );
        if ("error" in r) return { contacts: [], error: r.error };
        const fail = composioFailure(r.data);
        if (fail) return { contacts: [], error: fail };
        return { contacts: parseApolloPeople(r.data, domain).slice(0, limit) };
      },
    });
  }

  if (connected.has("hunter")) {
    providers.push({
      id: "hunter",
      async enrichDomain(domain, _roles, limit) {
        const r = await execute(
          COMPOSIO_ACTIONS.hunter,
          { domain, limit: Math.max(1, Math.min(limit, 10)), type: "personal" },
          userId
        );
        if ("error" in r) return { contacts: [], error: r.error };
        const fail = composioFailure(r.data);
        if (fail) return { contacts: [], error: fail };
        return { contacts: parseHunterEmails(r.data, domain).slice(0, limit) };
      },
    });
  }

  return providers;
}

// ---------------------------------------------------------------------------
// Waterfall
// ---------------------------------------------------------------------------

export interface WaterfallOutcome {
  contacts: ContactCandidate[];
  attempted: string[];
  notes: string[];
  /** true when the free path should supply the (company-level) result */
  usedFreeFallback: boolean;
}

function nameKey(n: string | null): string {
  return (n || "").toLowerCase().replace(/[^a-z]/g, "");
}

/**
 * - free: never calls providers.
 * - byok: providers in order, stop at the first that returns contacts.
 *   No provider / no contacts → free fallback with an explicit note.
 * - dual: every provider runs; Hunter fills missing emails for Apollo names
 *   (matched by name), then remaining gaps fall back to the free path.
 */
export async function runEnrichmentWaterfall(opts: {
  mode: EnrichmentMode;
  domain: string;
  roles: string[];
  limit: number;
  providers: EnrichmentProvider[];
}): Promise<WaterfallOutcome> {
  const { mode, domain, roles, limit, providers } = opts;
  const attempted: string[] = [];
  const notes: string[] = [];

  if (mode === "free") {
    return { contacts: [], attempted: ["free"], notes: ["free_mode"], usedFreeFallback: true };
  }

  if (providers.length === 0) {
    notes.push(`${mode}_no_connected_provider: connect Apollo or Hunter in Settings → free path used`);
    return { contacts: [], attempted: ["free"], notes, usedFreeFallback: true };
  }

  let merged: ContactCandidate[] = [];

  for (const p of providers) {
    attempted.push(p.id);
    let res: ProviderResult;
    try {
      res = await p.enrichDomain(domain, roles, limit);
    } catch (err) {
      res = { contacts: [], error: err instanceof Error ? err.message : String(err) };
    }
    if (res.error) notes.push(`${p.id}_error: ${res.error.slice(0, 160)}`);
    if (res.note) notes.push(`${p.id}: ${res.note}`);
    if (!res.error && res.contacts.length === 0) notes.push(`${p.id}_no_contacts`);

    if (mode === "byok") {
      if (res.contacts.length) {
        merged = res.contacts;
        break;
      }
      continue;
    }

    // dual: merge — fill emails on existing names, append new people
    for (const c of res.contacts) {
      const existing = merged.find(
        (m) => (c.contact_name && nameKey(m.contact_name) === nameKey(c.contact_name)) ||
          (c.email && m.email === c.email)
      );
      if (existing) {
        if (!existing.email && c.email) {
          existing.email = c.email;
          existing.verification_status = c.verification_status;
          existing.provenance = `${existing.provenance}+${c.provenance}`;
        }
        if (!existing.title && c.title) existing.title = c.title;
        if (!existing.profile_url && c.profile_url) existing.profile_url = c.profile_url;
      } else {
        merged.push({ ...c });
      }
    }
  }

  merged = merged.slice(0, limit);
  const usedFreeFallback = merged.length === 0 || (mode === "dual" && merged.some((c) => !c.email));
  if (merged.length === 0) {
    attempted.push("free");
    notes.push(`${mode}_no_provider_contacts → free path used (company-level lead, contact stays null)`);
  } else if (usedFreeFallback) {
    attempted.push("free");
    notes.push("dual_free_pattern_fallback_for_missing_emails");
  }
  return { contacts: merged, attempted, notes, usedFreeFallback };
}
