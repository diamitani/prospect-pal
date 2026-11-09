/**
 * Lead / run contracts aligned with prospector-skill CSV + scoring rubric.
 */

export type EnrichmentMode = "free" | "byok" | "dual";

export type DnsStatus =
  | "mx_ok"
  | "null_mx"
  | "nxdomain"
  | "implicit_mx_possible"
  | "no_route"
  | "unknown"
  | "timeout";

export type VerificationStatus =
  | "not_checked"
  | "valid"
  | "invalid"
  | "accept_all"
  | "unknown"
  | "approval_required"
  | "quota_exhausted";

export type Disposition =
  | "sure"
  | "needs_review"
  | "rejected"
  | "excluded"
  | "draft_queued";

export type LeadTier = "A" | "B" | "C";

export type RunStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type RunStep =
  | "plan"
  | "discover"
  | "email_research"
  | "mx_verify"
  | "score"
  | "artifacts";

export interface ScoreBreakdown {
  confirmed_icp_fit: number;
  targeting_relevance: number;
  evidence_recency: number;
  confirmed_contact_role_fit: number;
  source_quality: number;
  email_evidence: number;
  total: number;
}

export interface SourceRef {
  url: string;
  excerpt?: string | null;
  retrieved_at?: string | null;
  event_date?: string | null;
}

export interface ProspectLead {
  id: string;
  run_id?: string | null;
  workspace_id?: string | null;
  company: string;
  domain: string | null;
  contact_name: string | null;
  title: string | null;
  profile_url: string | null;
  email: string | null;
  signal: string | null;
  signal_event_date: string | null;
  source_urls: SourceRef[];
  provenance: string | null;
  dns_status: DnsStatus;
  verification_status: VerificationStatus;
  disposition: Disposition;
  score_breakdown: ScoreBreakdown | null;
  icp_score: number | null;
  tier: LeadTier | null;
  blockers: string[];
  status: string;
  outreach_subject?: string | null;
  outreach_body?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProspectingPlan {
  offer?: string;
  icp: string;
  roles: string[];
  geography?: string;
  signals: string[];
  exclusions?: string[];
  quantity_companies: number;
  contacts_per_company: number;
  freshness_days: number;
  mode: "signal-driven" | "icp-only";
  enrichment_mode: EnrichmentMode;
  output: string[];
}

export interface RunArtifacts {
  plan?: ProspectingPlan;
  leads_csv?: string;
  sure_list_csv?: string;
  review_list_csv?: string;
  rejected_csv?: string;
  run_report_md?: string;
}

export interface CreateRunRequest {
  brief: string;
  plan?: Partial<ProspectingPlan>;
  enrichment_mode?: EnrichmentMode;
  workspace_id?: string;
}
