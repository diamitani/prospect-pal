/**
 * Confidence Scorer for RAG DAL Retrieval
 *
 * Calculates confidence scores for retrieved knowledge based on:
 * - Source count (more sources = higher confidence)
 * - Consistency (agreement across sources)
 * - Tier distribution (presence of authoritative sources)
 * - Recency (how recent the information is)
 */

import { KnowledgeEntry, TopicCoverage, ConfidenceWeights } from './types';

/**
 * Default weights for confidence calculation
 */
export const DEFAULT_CONFIDENCE_WEIGHTS: ConfidenceWeights = {
  source_count: 0.35,
  consistency: 0.30,
  tier_distribution: 0.25,
  recency: 0.10,
};

/**
 * Calculate overall confidence score for a set of retrieved entries
 */
export function calculateConfidence(
  entries: (KnowledgeEntry & { similarity: number })[],
  weights: ConfidenceWeights = DEFAULT_CONFIDENCE_WEIGHTS
): number {
  if (entries.length === 0) return 0;

  const sourceCountScore = calculateSourceCountScore(entries.length);
  const consistencyScore = calculateConsistencyScore(entries);
  const tierScore = calculateTierDistributionScore(entries);
  const recencyScore = calculateRecencyScore(entries);

  const confidence =
    sourceCountScore * weights.source_count +
    consistencyScore * weights.consistency +
    tierScore * weights.tier_distribution +
    recencyScore * weights.recency;

  return Math.max(0, Math.min(1, confidence));
}

/**
 * Calculate confidence score based on number of sources
 *
 * Scoring:
 * - 1 source: 0.3
 * - 2 sources: 0.6
 * - 3+ sources: 0.8
 * - 5+ sources: 1.0
 */
export function calculateSourceCountScore(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 0.3;
  if (count === 2) return 0.6;
  if (count === 3) return 0.8;
  if (count === 4) return 0.9;
  return 1.0; // 5+
}

/**
 * Calculate consistency score based on similarity agreement
 *
 * Measures how much the sources agree (similar similarity scores = high consistency)
 */
export function calculateConsistencyScore(
  entries: (KnowledgeEntry & { similarity: number })[]
): number {
  if (entries.length === 0) return 0;
  if (entries.length === 1) return 1.0; // Single source is consistent with itself

  const similarities = entries.map(e => e.similarity);
  const avgSimilarity = similarities.reduce((sum, s) => sum + s, 0) / similarities.length;

  // Calculate variance of similarities
  const variance =
    similarities.reduce((sum, s) => sum + Math.pow(s - avgSimilarity, 2), 0) / similarities.length;

  // Low variance = high consistency
  // Normalize variance to 0-1 score (lower variance = higher score)
  const consistencyScore = Math.max(0, 1 - variance * 10);

  return consistencyScore;
}

/**
 * Calculate tier distribution score
 *
 * Higher score for presence of Tier 1 (authoritative) sources
 */
export function calculateTierDistributionScore(entries: KnowledgeEntry[]): number {
  if (entries.length === 0) return 0;

  const tier1Count = entries.filter(e => e.source_tier === 1).length;
  const tier2Count = entries.filter(e => e.source_tier === 2).length;
  const tier3Count = entries.filter(e => e.source_tier === 3).length;

  const total = entries.length;

  // Weighted score based on tier distribution
  const tier1Ratio = tier1Count / total;
  const tier2Ratio = tier2Count / total;
  const tier3Ratio = tier3Count / total;

  // Ideal: Mix of Tier 1 and Tier 2, minimal Tier 3
  const score = tier1Ratio * 1.0 + tier2Ratio * 0.7 + tier3Ratio * 0.4;

  return Math.max(0, Math.min(1, score));
}

/**
 * Calculate recency score
 *
 * More recent entries get higher scores
 */
export function calculateRecencyScore(entries: KnowledgeEntry[]): number {
  if (entries.length === 0) return 0;

  const now = new Date();
  const scores: number[] = [];

  for (const entry of entries) {
    const date = entry.content_date || entry.created_at;
    const ageInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    // Scoring based on age:
    // < 7 days: 1.0
    // < 30 days: 0.9
    // < 90 days: 0.7
    // < 180 days: 0.5
    // > 180 days: 0.3
    let recencyScore: number;
    if (ageInDays < 7) recencyScore = 1.0;
    else if (ageInDays < 30) recencyScore = 0.9;
    else if (ageInDays < 90) recencyScore = 0.7;
    else if (ageInDays < 180) recencyScore = 0.5;
    else recencyScore = 0.3;

    scores.push(recencyScore);
  }

  // Return average recency score
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

/**
 * Assess topic coverage from retrieved entries
 */
export function assessTopicCoverage(
  topic: string,
  entries: (KnowledgeEntry & { similarity: number })[]
): TopicCoverage {
  const relevantEntries = entries.filter(e => e.topics.includes(topic));

  if (relevantEntries.length === 0) {
    return {
      topic,
      confidence: 0,
      source_count: 0,
      tier_distribution: { 1: 0, 2: 0, 3: 0 },
      consistency_score: 0,
      recency_score: 0,
    };
  }

  // Calculate tier distribution
  const tier_distribution = {
    1: relevantEntries.filter(e => e.source_tier === 1).length,
    2: relevantEntries.filter(e => e.source_tier === 2).length,
    3: relevantEntries.filter(e => e.source_tier === 3).length,
  };

  // Calculate component scores
  const source_count = relevantEntries.length;
  const consistency_score = calculateConsistencyScore(relevantEntries);
  const recency_score = calculateRecencyScore(relevantEntries);

  // Calculate overall confidence for this topic
  const confidence = calculateConfidence(relevantEntries);

  return {
    topic,
    confidence,
    source_count,
    tier_distribution,
    consistency_score,
    recency_score,
  };
}

/**
 * Identify low-confidence topics (gaps)
 */
export function identifyGaps(
  entries: (KnowledgeEntry & { similarity: number })[],
  query: string,
  confidenceThreshold: number = 0.8
): string[] {
  // Extract unique topics from all entries
  const allTopics = new Set<string>();
  entries.forEach(e => e.topics.forEach(t => allTopics.add(t)));

  // Assess coverage for each topic
  const gaps: string[] = [];
  for (const topic of allTopics) {
    const coverage = assessTopicCoverage(topic, entries);
    if (coverage.confidence < confidenceThreshold) {
      gaps.push(topic);
    }
  }

  // Also check if query contains topics not in retrieved entries
  const queryTopics = extractTopicsFromQuery(query);
  for (const topic of queryTopics) {
    if (!allTopics.has(topic)) {
      gaps.push(topic);
    }
  }

  return [...new Set(gaps)]; // Deduplicate
}

/**
 * Extract potential topics from a query string
 *
 * Simple keyword extraction (can be enhanced with NLP)
 */
export function extractTopicsFromQuery(query: string): string[] {
  // Remove common words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'how', 'what', 'when', 'where', 'why', 'which', 'who', 'this', 'that',
  ]);

  const words = query
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));

  // Return unique words as potential topics
  return [...new Set(words)];
}

/**
 * Calculate coverage across multiple topics
 */
export function calculateOverallCoverage(
  entries: (KnowledgeEntry & { similarity: number })[],
  requiredTopics: string[]
): {
  overall_confidence: number;
  topic_coverages: TopicCoverage[];
  high_confidence_topics: string[];
  low_confidence_topics: string[];
  missing_topics: string[];
} {
  const topic_coverages: TopicCoverage[] = [];
  const high_confidence_topics: string[] = [];
  const low_confidence_topics: string[] = [];
  const missing_topics: string[] = [];

  for (const topic of requiredTopics) {
    const coverage = assessTopicCoverage(topic, entries);
    topic_coverages.push(coverage);

    if (coverage.confidence >= 0.8) {
      high_confidence_topics.push(topic);
    } else if (coverage.confidence >= 0.5) {
      low_confidence_topics.push(topic);
    } else {
      missing_topics.push(topic);
    }
  }

  // Overall confidence is average of topic confidences
  const overall_confidence =
    topic_coverages.length > 0
      ? topic_coverages.reduce((sum, tc) => sum + tc.confidence, 0) / topic_coverages.length
      : 0;

  return {
    overall_confidence,
    topic_coverages,
    high_confidence_topics,
    low_confidence_topics,
    missing_topics,
  };
}

/**
 * Determine if retrieval meets confidence threshold
 */
export function meetsConfidenceThreshold(
  entries: (KnowledgeEntry & { similarity: number })[],
  threshold: number = 0.8
): { meets: boolean; confidence: number; reason?: string } {
  const confidence = calculateConfidence(entries);

  if (confidence >= threshold) {
    return { meets: true, confidence };
  }

  // Identify why threshold wasn't met
  let reason = 'Unknown';
  if (entries.length < 2) {
    reason = 'Insufficient sources (need at least 2)';
  } else if (calculateTierDistributionScore(entries) < 0.6) {
    reason = 'Insufficient authoritative sources (need more Tier 1/2)';
  } else if (calculateConsistencyScore(entries) < 0.6) {
    reason = 'Low consistency across sources';
  } else if (calculateRecencyScore(entries) < 0.5) {
    reason = 'Information is outdated';
  }

  return { meets: false, confidence, reason };
}
