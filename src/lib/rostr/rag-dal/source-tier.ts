/**
 * Source Tier and Credibility Scoring
 *
 * Implements three-tier source architecture with credibility weighting:
 * - Tier 1 (1.0): Authoritative sources
 * - Tier 2 (0.75): Verified sources
 * - Tier 3 (0.40): Community sources
 */

import { SourceType, SourceTier } from './types';

/**
 * Base credibility scores for each tier
 */
export const TIER_CREDIBILITY: Record<SourceTier, number> = {
  1: 1.0,   // Authoritative: Project docs, committed decisions
  2: 0.75,  // Verified: Approved artifacts, project data
  3: 0.40,  // Community: Chat messages, draft artifacts
};

/**
 * Source type to default tier mapping
 * Can be overridden at ingestion time
 */
export const DEFAULT_SOURCE_TIERS: Record<SourceType, SourceTier> = {
  project_doc: 1,     // CLAUDE.md, AGENTS.md, committed docs
  decision: 1,        // Explicit decisions made during planning
  artifact: 2,        // Generated artifacts (n8n JSON, guides)
  org_context: 2,     // Organization-level context (ICP, brand)
  chat: 3,            // Chat messages, draft content
};

/**
 * Credibility modifiers based on content characteristics
 */
interface CredibilityModifiers {
  has_citations?: boolean;      // +0.05 if references sources
  verified_by_human?: boolean;  // +0.10 if human-approved
  has_timestamps?: boolean;     // +0.02 if includes specific dates
  has_metrics?: boolean;        // +0.03 if includes quantitative data
  is_recent?: boolean;          // +0.05 if < 30 days old
  is_outdated?: boolean;        // -0.15 if > 180 days old
  is_draft?: boolean;           // -0.10 if marked as draft
  contradicts_tier1?: boolean;  // -0.30 if conflicts with authoritative source
}

/**
 * Calculate credibility score for a knowledge entry
 */
export function calculateCredibility(
  sourceTier: SourceTier,
  sourceType: SourceType,
  modifiers: CredibilityModifiers = {}
): number {
  // Start with base tier score
  let score = TIER_CREDIBILITY[sourceTier];

  // Apply source type adjustments
  const typeAdjustment = getSourceTypeAdjustment(sourceType);
  score += typeAdjustment;

  // Apply modifiers
  if (modifiers.has_citations) score += 0.05;
  if (modifiers.verified_by_human) score += 0.10;
  if (modifiers.has_timestamps) score += 0.02;
  if (modifiers.has_metrics) score += 0.03;
  if (modifiers.is_recent) score += 0.05;
  if (modifiers.is_outdated) score -= 0.15;
  if (modifiers.is_draft) score -= 0.10;
  if (modifiers.contradicts_tier1) score -= 0.30;

  // Clamp to [0, 1]
  return Math.max(0, Math.min(1, score));
}

/**
 * Get source type adjustment to base credibility
 */
function getSourceTypeAdjustment(sourceType: SourceType): number {
  switch (sourceType) {
    case 'project_doc':
      return 0.0;   // No adjustment (authoritative)
    case 'decision':
      return 0.0;   // No adjustment (explicit decisions)
    case 'artifact':
      return -0.05; // Slight decrease (generated, needs verification)
    case 'org_context':
      return -0.05; // Slight decrease (may evolve)
    case 'chat':
      return -0.10; // Moderate decrease (conversational, unverified)
    default:
      return 0.0;
  }
}

/**
 * Determine if a source type should be considered authoritative
 */
export function isAuthoritative(sourceTier: SourceTier, sourceType: SourceType): boolean {
  return sourceTier === 1 && (sourceType === 'project_doc' || sourceType === 'decision');
}

/**
 * Determine if a source type is from community/unverified sources
 */
export function isCommunity(sourceTier: SourceTier): boolean {
  return sourceTier === 3;
}

/**
 * Get recommended tier for a source type
 */
export function getRecommendedTier(sourceType: SourceType): SourceTier {
  return DEFAULT_SOURCE_TIERS[sourceType];
}

/**
 * Validate tier assignment for a source type
 * Returns warnings if tier seems inappropriate
 */
export function validateTierAssignment(
  sourceTier: SourceTier,
  sourceType: SourceType
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const recommendedTier = DEFAULT_SOURCE_TIERS[sourceType];

  // Check for obvious mismatches
  if (sourceType === 'project_doc' && sourceTier !== 1) {
    warnings.push(`Project docs should typically be Tier 1 (authoritative), not Tier ${sourceTier}`);
  }

  if (sourceType === 'chat' && sourceTier === 1) {
    warnings.push('Chat messages are rarely authoritative enough for Tier 1');
  }

  if (sourceType === 'artifact' && sourceTier === 1) {
    warnings.push('Generated artifacts should be verified before being considered Tier 1');
  }

  // More than 1 tier away from recommended
  if (Math.abs(sourceTier - recommendedTier) > 1) {
    warnings.push(
      `Tier ${sourceTier} is unusual for ${sourceType} (recommended: Tier ${recommendedTier})`
    );
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

/**
 * Calculate weighted average credibility across multiple sources
 */
export function weightedAverageCredibility(
  sources: Array<{ credibility: number; tier: SourceTier }>
): number {
  if (sources.length === 0) return 0;

  // Weight sources by their tier (Tier 1 sources count more)
  const tierWeights = { 1: 3.0, 2: 2.0, 3: 1.0 };

  let weightedSum = 0;
  let weightSum = 0;

  for (const source of sources) {
    const weight = tierWeights[source.tier];
    weightedSum += source.credibility * weight;
    weightSum += weight;
  }

  return weightSum > 0 ? weightedSum / weightSum : 0;
}

/**
 * Determine if source set has sufficient credibility for a confidence threshold
 */
export function hasSufficientCredibility(
  sources: Array<{ credibility: number; tier: SourceTier }>,
  threshold: number = 0.7
): boolean {
  if (sources.length === 0) return false;

  // Need at least one high-credibility source OR multiple medium sources
  const hasHighCredibility = sources.some(s => s.credibility >= 0.8);
  const hasMediumCredibility = sources.filter(s => s.credibility >= 0.6).length >= 2;

  const avgCredibility = weightedAverageCredibility(sources);

  return (hasHighCredibility || hasMediumCredibility) && avgCredibility >= threshold;
}

/**
 * Get tier distribution requirements for confident retrieval
 */
export function getTierRequirements(confidenceTarget: number): {
  minTier1: number;
  minTier2: number;
  minTotalSources: number;
} {
  if (confidenceTarget >= 0.9) {
    // Very high confidence: Need authoritative sources
    return { minTier1: 2, minTier2: 1, minTotalSources: 3 };
  } else if (confidenceTarget >= 0.8) {
    // High confidence: Need at least one authoritative
    return { minTier1: 1, minTier2: 2, minTotalSources: 3 };
  } else if (confidenceTarget >= 0.7) {
    // Medium confidence: Need verified sources
    return { minTier1: 0, minTier2: 2, minTotalSources: 2 };
  } else {
    // Low confidence: Any sources acceptable
    return { minTier1: 0, minTier2: 0, minTotalSources: 1 };
  }
}

/**
 * Check if tier distribution meets requirements
 */
export function checkTierDistribution(
  sources: Array<{ tier: SourceTier }>,
  requirements: { minTier1: number; minTier2: number; minTotalSources: number }
): { meets: boolean; gaps: string[] } {
  const tier1Count = sources.filter(s => s.tier === 1).length;
  const tier2Count = sources.filter(s => s.tier === 2).length;
  const totalCount = sources.length;

  const gaps: string[] = [];

  if (tier1Count < requirements.minTier1) {
    gaps.push(`Need ${requirements.minTier1 - tier1Count} more Tier 1 (authoritative) sources`);
  }

  if (tier2Count < requirements.minTier2) {
    gaps.push(`Need ${requirements.minTier2 - tier2Count} more Tier 2 (verified) sources`);
  }

  if (totalCount < requirements.minTotalSources) {
    gaps.push(`Need ${requirements.minTotalSources - totalCount} more sources total`);
  }

  return {
    meets: gaps.length === 0,
    gaps,
  };
}
