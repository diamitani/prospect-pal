/**
 * Deterministic scoring from prospector-skill scoring.yaml (v0.3.0).
 * Scores are review-priority, not probability. Never invent evidence.
 */

import type { LeadTier, ScoreBreakdown, VerificationStatus } from "./types";

export const SCORING_RUBRIC = {
  rubric_version: "0.3.0",
  components: {
    confirmed_icp_fit: 25,
    targeting_relevance: 20,
    evidence_recency: 15,
    confirmed_contact_role_fit: 20,
    source_quality: 10,
    email_evidence: 10,
  },
  tiers: { A: 85, B: 70, C: 0 } as const,
} as const;

export interface ScoreInput {
  /** Confirmed ICP match with sourced company evidence */
  icpConfirmed: boolean;
  /** Observed relevant signal (signal-driven) or independently sourced need (icp-only) */
  targetingRelevant: boolean;
  /** Days since evidence event; null = unknown/undated */
  evidenceAgeDays: number | null;
  freshnessWindowDays: number;
  /** Current role confirmed with source evidence */
  roleConfirmed: boolean;
  /** primary | secondary | insufficient */
  sourceQuality: "primary" | "secondary" | "insufficient";
  /** Email evidence level */
  emailEvidence: "exact_valid" | "published_unverified" | "guessed" | "none";
  verificationStatus?: VerificationStatus;
  /** Catch-all / accept_all can never be treated as valid */
  isCatchAll?: boolean;
  mode?: "signal-driven" | "icp-only";
}

export function scoreRecency(
  evidenceAgeDays: number | null,
  freshnessWindowDays: number
): number {
  if (evidenceAgeDays == null || evidenceAgeDays < 0) return 0;
  if (evidenceAgeDays <= 30) return 15;
  if (evidenceAgeDays <= freshnessWindowDays) return 8;
  return 0;
}

export function scoreEmailEvidence(
  level: ScoreInput["emailEvidence"],
  isCatchAll?: boolean
): number {
  if (isCatchAll) return 0;
  if (level === "exact_valid") return 10;
  if (level === "published_unverified") return 4;
  return 0;
}

export function computeScore(input: ScoreInput): ScoreBreakdown {
  const confirmed_icp_fit = input.icpConfirmed ? 25 : 0;
  const targeting_relevance = input.targetingRelevant ? 20 : 0;
  const evidence_recency = scoreRecency(
    input.evidenceAgeDays,
    input.freshnessWindowDays
  );
  const confirmed_contact_role_fit = input.roleConfirmed ? 20 : 0;
  const source_quality =
    input.sourceQuality === "primary"
      ? 10
      : input.sourceQuality === "secondary"
        ? 5
        : 0;
  const email_evidence = scoreEmailEvidence(
    input.emailEvidence,
    input.isCatchAll
  );
  const total =
    confirmed_icp_fit +
    targeting_relevance +
    evidence_recency +
    confirmed_contact_role_fit +
    source_quality +
    email_evidence;

  return {
    confirmed_icp_fit,
    targeting_relevance,
    evidence_recency,
    confirmed_contact_role_fit,
    source_quality,
    email_evidence,
    total,
  };
}

export function tierFromScore(total: number): LeadTier {
  if (total >= SCORING_RUBRIC.tiers.A) return "A";
  if (total >= SCORING_RUBRIC.tiers.B) return "B";
  return "C";
}

/**
 * Catch-all is never valid. SURE requires exact-address valid + score>=85 + role/ICP confirmed.
 */
export function classifyDisposition(opts: {
  score: ScoreBreakdown;
  verificationStatus: VerificationStatus;
  isCatchAll?: boolean;
  icpConfirmed: boolean;
  roleConfirmed: boolean;
  excluded?: boolean;
}): "sure" | "needs_review" | "rejected" | "excluded" {
  if (opts.excluded) return "excluded";
  if (opts.isCatchAll || opts.verificationStatus === "accept_all") {
    return "needs_review";
  }
  if (opts.verificationStatus === "invalid") return "rejected";
  if (
    opts.score.total >= 85 &&
    opts.verificationStatus === "valid" &&
    opts.icpConfirmed &&
    opts.roleConfirmed &&
    !opts.isCatchAll
  ) {
    return "sure";
  }
  // Low-evidence / guessed / MX-only stay needs_review — never auto-reject unknowns
  return "needs_review";
}
