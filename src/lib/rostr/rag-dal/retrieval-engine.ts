/**
 * Retrieval Engine for RAG DAL
 *
 * Implements multi-pass retrieval algorithm:
 * - Pass 1: Broad sweep (5 query variants, all tiers)
 * - Pass 2: Gap fill (target low-confidence topics)
 * - Pass 3: Deep verification (Tier 1 only for remaining gaps)
 *
 * Continues until confidence threshold met or max passes reached.
 */

import {
  RetrievalQuery,
  RetrievalResult,
  PassResult,
  MultiPassConfig,
  KnowledgeEntry,
  RetrievalError,
} from './types';
import { getEmbeddingService, EmbeddingService } from './embedding-service';
import { getVectorStore, VectorStore } from './vector-store';
import {
  calculateConfidence,
  identifyGaps,
  calculateOverallCoverage,
  meetsConfidenceThreshold,
  extractTopicsFromQuery,
} from './confidence-scorer';

export class RetrievalEngine {
  private embeddingService: EmbeddingService;
  private vectorStore: VectorStore;
  private config: Required<MultiPassConfig>;

  constructor(config: Partial<MultiPassConfig> = {}) {
    this.embeddingService = getEmbeddingService();
    this.vectorStore = getVectorStore();

    // Merge with defaults
    this.config = {
      pass1_broad_queries: config.pass1_broad_queries ?? 5,
      pass2_gap_queries: config.pass2_gap_queries ?? 2,
      max_passes: config.max_passes ?? 3,
      confidence_target: config.confidence_target ?? 0.8,
      enable_cache: config.enable_cache ?? true,
    };
  }

  /**
   * Main retrieval method with multi-pass algorithm
   */
  async retrieve(query: RetrievalQuery): Promise<RetrievalResult> {
    const startTime = Date.now();

    console.log(`[RetrievalEngine] Starting retrieval for: "${query.text}"`);

    // Initialize result
    let allEntries: (KnowledgeEntry & { similarity: number })[] = [];
    let passesExecuted = 0;
    let currentConfidence = 0;

    // Pass 1: Broad Sweep
    console.log('[RetrievalEngine] Pass 1: Broad sweep');
    const pass1Result = await this.pass1BroadSweep(query);
    allEntries = this.mergeAndDeduplicate(allEntries, pass1Result.entries);
    passesExecuted++;

    // Check confidence
    currentConfidence = calculateConfidence(allEntries);
    console.log(`[RetrievalEngine] Pass 1 confidence: ${currentConfidence.toFixed(2)}`);

    if (currentConfidence >= this.config.confidence_target) {
      return this.buildResult(allEntries, passesExecuted, startTime, query.text);
    }

    // Pass 2: Gap Fill (if needed)
    if (passesExecuted < this.config.max_passes) {
      const gaps = identifyGaps(allEntries, query.text, this.config.confidence_target);

      if (gaps.length > 0) {
        console.log(`[RetrievalEngine] Pass 2: Gap fill for ${gaps.length} topics`);
        const pass2Result = await this.pass2GapFill(query, gaps);
        allEntries = this.mergeAndDeduplicate(allEntries, pass2Result.entries);
        passesExecuted++;

        currentConfidence = calculateConfidence(allEntries);
        console.log(`[RetrievalEngine] Pass 2 confidence: ${currentConfidence.toFixed(2)}`);

        if (currentConfidence >= this.config.confidence_target) {
          return this.buildResult(allEntries, passesExecuted, startTime, query.text);
        }
      }
    }

    // Pass 3: Deep Verification (if still needed)
    if (passesExecuted < this.config.max_passes) {
      const remainingGaps = identifyGaps(allEntries, query.text, this.config.confidence_target);

      if (remainingGaps.length > 0) {
        console.log(`[RetrievalEngine] Pass 3: Deep verification for ${remainingGaps.length} topics`);
        const pass3Result = await this.pass3DeepVerification(query, remainingGaps);
        allEntries = this.mergeAndDeduplicate(allEntries, pass3Result.entries);
        passesExecuted++;

        currentConfidence = calculateConfidence(allEntries);
        console.log(`[RetrievalEngine] Pass 3 confidence: ${currentConfidence.toFixed(2)}`);
      }
    }

    return this.buildResult(allEntries, passesExecuted, startTime, query.text);
  }

  /**
   * Pass 1: Broad Sweep
   * Generate multiple query variants and search across all tiers
   */
  private async pass1BroadSweep(query: RetrievalQuery): Promise<PassResult> {
    // Generate query variants
    const queryVariants = this.generateQueryVariants(query.text, this.config.pass1_broad_queries);

    // Embed all variants
    const embeddings = await this.embeddingService.embedBatch(queryVariants);

    // Search with each embedding
    const allResults: (KnowledgeEntry & { similarity: number })[] = [];

    for (const embedding of embeddings) {
      const results = await this.vectorStore.similaritySearch(embedding, query.workspace_id, {
        top_k: query.top_k || 10,
        min_similarity: query.min_similarity || 0.7,
        source_tiers: query.source_tiers || [1, 2, 3],
        source_types: query.source_types,
        project_id: query.project_id,
        topics: query.topics,
        phases: query.phases,
      });

      allResults.push(...results);
    }

    // Deduplicate and sort by similarity
    const uniqueResults = this.deduplicateEntries(allResults);

    return {
      entries: uniqueResults,
      query_variants: queryVariants,
      coverage_per_topic: {},
    };
  }

  /**
   * Pass 2: Gap Fill
   * Target specific low-confidence topics with focused queries
   */
  private async pass2GapFill(query: RetrievalQuery, gaps: string[]): Promise<PassResult> {
    const allResults: (KnowledgeEntry & { similarity: number })[] = [];

    // Generate focused queries for each gap
    for (const gap of gaps) {
      const focusedQueries = this.generateGapFocusedQueries(query.text, gap, this.config.pass2_gap_queries);

      // Embed and search
      const embeddings = await this.embeddingService.embedBatch(focusedQueries);

      for (const embedding of embeddings) {
        const results = await this.vectorStore.similaritySearch(embedding, query.workspace_id, {
          top_k: 5, // Fewer results per gap query
          min_similarity: 0.6, // Lower threshold for gaps
          source_tiers: [1, 2], // Focus on verified sources
          project_id: query.project_id,
          topics: [gap], // Filter to this specific topic
        });

        allResults.push(...results);
      }
    }

    const uniqueResults = this.deduplicateEntries(allResults);

    return {
      entries: uniqueResults,
      query_variants: gaps,
      coverage_per_topic: {},
    };
  }

  /**
   * Pass 3: Deep Verification
   * Tier 1 (authoritative) sources only for remaining gaps
   */
  private async pass3DeepVerification(query: RetrievalQuery, gaps: string[]): Promise<PassResult> {
    const allResults: (KnowledgeEntry & { similarity: number })[] = [];

    // Very focused queries for each remaining gap
    for (const gap of gaps) {
      const verificationQueries = this.generateVerificationQueries(query.text, gap);

      const embeddings = await this.embeddingService.embedBatch(verificationQueries);

      for (const embedding of embeddings) {
        const results = await this.vectorStore.similaritySearch(embedding, query.workspace_id, {
          top_k: 3,
          min_similarity: 0.5, // Even lower threshold - we need any Tier 1 info
          source_tiers: [1], // ONLY authoritative sources
          project_id: query.project_id,
          topics: [gap],
        });

        allResults.push(...results);
      }
    }

    const uniqueResults = this.deduplicateEntries(allResults);

    return {
      entries: uniqueResults,
      query_variants: gaps,
      coverage_per_topic: {},
    };
  }

  /**
   * Generate query variants for broad sweep
   */
  private generateQueryVariants(query: string, count: number): string[] {
    const variants: string[] = [query]; // Original query first

    // Strategy 1: Add context keywords
    variants.push(`${query} context background`);
    variants.push(`${query} implementation details`);

    // Strategy 2: Rephrase as question
    if (!query.includes('?')) {
      variants.push(`How to ${query}?`);
      variants.push(`What is ${query}?`);
    }

    // Strategy 3: Extract key terms
    const keyTerms = extractTopicsFromQuery(query);
    if (keyTerms.length > 0) {
      variants.push(keyTerms.join(' '));
    }

    // Return up to 'count' variants
    return variants.slice(0, count);
  }

  /**
   * Generate gap-focused queries
   */
  private generateGapFocusedQueries(originalQuery: string, gap: string, count: number): string[] {
    return [
      `${gap} in context of ${originalQuery}`,
      `${gap} specifically`,
      `${gap} details`,
    ].slice(0, count);
  }

  /**
   * Generate verification queries for deep pass
   */
  private generateVerificationQueries(originalQuery: string, gap: string): string[] {
    return [
      `authoritative source on ${gap}`,
      `${gap} documentation`,
      `official ${gap} specification`,
    ];
  }

  /**
   * Merge and deduplicate entries
   */
  private mergeAndDeduplicate(
    existing: (KnowledgeEntry & { similarity: number })[],
    newEntries: (KnowledgeEntry & { similarity: number })[]
  ): (KnowledgeEntry & { similarity: number })[] {
    const merged = [...existing, ...newEntries];
    return this.deduplicateEntries(merged);
  }

  /**
   * Deduplicate entries by ID, keeping highest similarity
   */
  private deduplicateEntries(
    entries: (KnowledgeEntry & { similarity: number })[]
  ): (KnowledgeEntry & { similarity: number })[] {
    const seen = new Map<string, KnowledgeEntry & { similarity: number }>();

    for (const entry of entries) {
      const existing = seen.get(entry.id);
      if (!existing || entry.similarity > existing.similarity) {
        seen.set(entry.id, entry);
      }
    }

    // Sort by similarity descending
    return Array.from(seen.values()).sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Build final retrieval result
   */
  private buildResult(
    entries: (KnowledgeEntry & { similarity: number })[],
    passesExecuted: number,
    startTime: number,
    queryText: string
  ): RetrievalResult {
    const confidence = calculateConfidence(entries);
    const gaps = identifyGaps(entries, queryText, this.config.confidence_target);
    const requiredTopics = extractTopicsFromQuery(queryText);
    const coverage = calculateOverallCoverage(entries, requiredTopics);

    const result: RetrievalResult = {
      entries,
      confidence,
      coverage: {
        total_queries: passesExecuted,
        high_confidence_topics: coverage.high_confidence_topics,
        low_confidence_topics: coverage.low_confidence_topics,
        gaps,
      },
      passes_executed: passesExecuted,
      execution_time_ms: Date.now() - startTime,
    };

    // Log final status
    const meetsThreshold = meetsConfidenceThreshold(entries, this.config.confidence_target);
    console.log(
      `[RetrievalEngine] Complete: ${entries.length} entries, ` +
        `confidence ${confidence.toFixed(2)}, ` +
        `${passesExecuted} passes, ` +
        `${meetsThreshold.meets ? 'PASS' : 'FAIL'}`
    );

    if (!meetsThreshold.meets) {
      console.warn(`[RetrievalEngine] Did not meet confidence threshold: ${meetsThreshold.reason}`);
    }

    return result;
  }
}

/**
 * Singleton instance for app-wide use
 */
let globalRetrievalEngine: RetrievalEngine | null = null;

export function getRetrievalEngine(config?: Partial<MultiPassConfig>): RetrievalEngine {
  if (!globalRetrievalEngine || config) {
    globalRetrievalEngine = new RetrievalEngine(config);
  }
  return globalRetrievalEngine;
}
