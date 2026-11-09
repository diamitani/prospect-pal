/**
 * Structural validator for prospecting outputs (port of validate_output.py).
 * Guards shape/contracts — not proof of source truth or approvals.
 */

import type {
  Disposition,
  DnsStatus,
  LeadTier,
  ProspectLead,
  VerificationStatus,
} from "./types";

const DNS: DnsStatus[] = [
  "mx_ok",
  "null_mx",
  "nxdomain",
  "implicit_mx_possible",
  "no_route",
  "unknown",
  "timeout",
];

const VERIFY: VerificationStatus[] = [
  "not_checked",
  "valid",
  "invalid",
  "accept_all",
  "unknown",
  "approval_required",
  "quota_exhausted",
];

const DISPOSITION: Disposition[] = [
  "sure",
  "needs_review",
  "rejected",
  "excluded",
  "draft_queued",
];

const TIERS: LeadTier[] = ["A", "B", "C"];

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  issues: ValidationIssue[];
}

function issue(path: string, message: string): ValidationIssue {
  return { path, message };
}

/** Neutralize spreadsheet formula injection (=, +, -, @) */
export function neutralizeFormulaCell(
  value: string | null | undefined
): string {
  if (value == null) return "";
  const s = String(value);
  if (/^[=+\-@]/.test(s)) return `'${s}`;
  return s;
}

export function validateLead(
  lead: Partial<ProspectLead>,
  index = 0
): ValidationIssue[] {
  const path = `leads[${index}]`;
  const issues: ValidationIssue[] = [];

  if (!lead.id) issues.push(issue(`${path}.id`, "required"));
  if (!lead.company) issues.push(issue(`${path}.company`, "required"));

  if (lead.email != null && lead.email !== "") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
      issues.push(issue(`${path}.email`, "invalid email format"));
    }
  }

  if (lead.dns_status && !DNS.includes(lead.dns_status)) {
    issues.push(
      issue(`${path}.dns_status`, `unknown status ${lead.dns_status}`)
    );
  }
  if (lead.verification_status && !VERIFY.includes(lead.verification_status)) {
    issues.push(
      issue(
        `${path}.verification_status`,
        `unknown ${lead.verification_status}`
      )
    );
  }
  if (lead.disposition && !DISPOSITION.includes(lead.disposition)) {
    issues.push(
      issue(`${path}.disposition`, `unknown ${lead.disposition}`)
    );
  }
  if (lead.tier && !TIERS.includes(lead.tier)) {
    issues.push(issue(`${path}.tier`, `unknown ${lead.tier}`));
  }

  if (
    lead.verification_status === "accept_all" &&
    lead.disposition === "sure"
  ) {
    issues.push(
      issue(`${path}.disposition`, "accept_all can never be disposition sure")
    );
  }

  if (lead.dns_status === "null_mx" && lead.verification_status === "valid") {
    issues.push(
      issue(`${path}.verification_status`, "null_mx domain cannot be valid")
    );
  }

  return issues;
}

export function validateLeads(
  leads: Partial<ProspectLead>[]
): ValidationResult {
  const issues = leads.flatMap((l, i) => validateLead(l, i));
  const ids = leads.map((l) => l.id).filter(Boolean) as string[];
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) issues.push(issue("leads", `duplicate id ${id}`));
    seen.add(id);
  }
  return { ok: issues.length === 0, issues };
}

export function leadsToCsv(leads: ProspectLead[]): string {
  const headers = [
    "lead_id",
    "company",
    "domain",
    "signal",
    "signal_event_date",
    "contact_name",
    "title",
    "profile_url",
    "email",
    "provenance",
    "dns_status",
    "verification_status",
    "disposition",
    "tier",
    "icp_score",
    "blockers",
    "source_urls",
  ];
  const rows = leads.map((l) =>
    [
      l.id,
      l.company,
      l.domain ?? "",
      l.signal ?? "",
      l.signal_event_date ?? "",
      l.contact_name ?? "",
      l.title ?? "",
      l.profile_url ?? "",
      l.email ?? "",
      l.provenance ?? "",
      l.dns_status,
      l.verification_status,
      l.disposition,
      l.tier ?? "",
      l.icp_score ?? "",
      (l.blockers || []).join("|"),
      (l.source_urls || []).map((s) => s.url).join("|"),
    ]
      .map((c) => {
        const n = neutralizeFormulaCell(String(c));
        return `"${n.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}
