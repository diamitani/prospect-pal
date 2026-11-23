/**
 * Suppression list + cross-run dedupe guardrails.
 * Leads that hit a suppression or were already found in a prior run are
 * flagged (never silently dropped, never re-queued).
 */

import type { ProspectLead, Suppression, SuppressionKind } from "./types";

export function normalizeEmail(v: string | null | undefined): string | null {
  if (!v) return null;
  const e = v.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null;
}

export function normalizeDomain(v: string | null | undefined): string | null {
  if (!v) return null;
  let d = v.trim().toLowerCase();
  if (d.includes("@")) d = d.split("@").pop() || "";
  d = d.replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[/?#:]/)[0];
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(d) ? d : null;
}

export function normalizeSuppressionValue(kind: SuppressionKind, value: string): string | null {
  return kind === "email" ? normalizeEmail(value) : normalizeDomain(value);
}

export interface PriorLeadRef {
  id?: string;
  email?: string | null;
  domain?: string | null;
  run_id?: string | null;
  contact_name?: string | null;
}

export interface GuardIndex {
  emails: Set<string>;
  domains: Set<string>;
  priorEmails: Map<string, string | null>;
  /** Company-level (no contact) prior leads, keyed by domain */
  priorDomainsNoContact: Map<string, string | null>;
  priorDomainContacts: Set<string>;
}

export function buildGuardIndex(
  suppressions: Suppression[],
  priorLeads: PriorLeadRef[],
  currentRunId?: string | null
): GuardIndex {
  const idx: GuardIndex = {
    emails: new Set(),
    domains: new Set(),
    priorEmails: new Map(),
    priorDomainsNoContact: new Map(),
    priorDomainContacts: new Set(),
  };
  for (const s of suppressions) {
    const v = normalizeSuppressionValue(s.kind, s.value);
    if (!v) continue;
    (s.kind === "email" ? idx.emails : idx.domains).add(v);
  }
  for (const p of priorLeads) {
    if (currentRunId && p.run_id === currentRunId) continue;
    const e = normalizeEmail(p.email);
    const d = normalizeDomain(p.domain);
    if (e) idx.priorEmails.set(e, p.run_id ?? null);
    if (d && !e && !p.contact_name) idx.priorDomainsNoContact.set(d, p.run_id ?? null);
    if (d && p.contact_name) idx.priorDomainContacts.add(`${d}|${p.contact_name.toLowerCase()}`);
  }
  return idx;
}

export type GuardVerdict =
  | { flag: null }
  | { flag: "suppressed"; reason: string }
  | { flag: "duplicate_prior_run"; reason: string };

export function checkLeadGuard(
  lead: Pick<ProspectLead, "email" | "domain" | "contact_name">,
  idx: GuardIndex
): GuardVerdict {
  const e = normalizeEmail(lead.email);
  const d = normalizeDomain(lead.domain) || (e ? normalizeDomain(e) : null);

  if (e && idx.emails.has(e)) return { flag: "suppressed", reason: `suppressed:email:${e}` };
  if (d && idx.domains.has(d)) return { flag: "suppressed", reason: `suppressed:domain:${d}` };

  if (e && idx.priorEmails.has(e)) {
    return { flag: "duplicate_prior_run", reason: `duplicate_prior_run:email:${idx.priorEmails.get(e) ?? "unknown"}` };
  }
  if (d && lead.contact_name && idx.priorDomainContacts.has(`${d}|${lead.contact_name.toLowerCase()}`)) {
    return { flag: "duplicate_prior_run", reason: `duplicate_prior_run:contact:${d}` };
  }
  if (d && !e && !lead.contact_name && idx.priorDomainsNoContact.has(d)) {
    return { flag: "duplicate_prior_run", reason: `duplicate_prior_run:domain:${idx.priorDomainsNoContact.get(d) ?? "unknown"}` };
  }
  return { flag: null };
}

/** Apply guard verdict to a lead in place: excluded + blocker + status, never re-queued. */
export function applyGuard(lead: ProspectLead, verdict: GuardVerdict): ProspectLead {
  if (!verdict.flag) return lead;
  return {
    ...lead,
    disposition: "excluded",
    status: verdict.flag,
    blockers: Array.from(new Set([...(lead.blockers || []), verdict.reason])),
  };
}
