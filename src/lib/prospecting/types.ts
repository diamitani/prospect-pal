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

/**
 * Harness steps (Phase A). `email_research` / `mx_verify` are kept for
 * backwards compatibility with runs recorded before the harness landed.
 */
export type RunStep =
  | "plan"
  | "discover"
  | "enrich"
  | "verify"
  | "guard"
  | "score"
  | "artifacts"
  | "email_research"
  | "mx_verify";

export const HARNESS_STEPS: RunStep[] = [
  "plan",
  "discover",
  "enrich",
  "verify",
  "guard",
  "score",
  "artifacts",
];

export type RunEventLevel = "info" | "warn" | "error";

/** One durable step record persisted to ppal_run_events. */
export interface RunEvent {
  id?: string;
  run_id: string | null;
  step: RunStep;
  level: RunEventLevel;
  message: string;
  meta: Record<string, unknown>;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  error: string | null;
  created_at?: string;
}

export type SuppressionKind = "email" | "domain";

export interface Suppression {
  id?: string;
  workspace_id?: string | null;
  user_id?: string | null;
  kind: SuppressionKind;
  value: string;
  reason?: string | null;
  created_at?: string;
}

export type EnrichmentSource = "apollo" | "hunter" | "free" | "none";

/** Per-lead record of which enrichment path produced (or failed to produce) data. */
export interface LeadEnrichment {
  mode: EnrichmentMode;
  source: EnrichmentSource;
  attempted: string[];
  notes: string[];
}

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
  enrichment?: LeadEnrichment | null;
  created_by?: string | null;
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
