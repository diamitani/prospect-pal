/**
 * RAG DAL (Retrieval Augmented Generation - Dynamic Acquisition Layer) Types
 *
 * Defines interfaces for vector-based semantic retrieval with three-tier credibility architecture.
 * Implements multi-pass retrieval with confidence scoring and coverage validation.
 */

/**
 * Source type classification for knowledge entries
 */
export type SourceType =
  | 'project_doc'    // CLAUDE.md, AGENTS.md, committed documentation
  | 'artifact'       // Generated n8n JSON, deploy guides, skill outputs
  | 'decision'       // Explicit decisions made during planning/execution
  | 'chat'          // Chat messages with valuable context
  | 'org_context';   // Organization-level context (ICP, brand, messaging)

/**
 * Source tier for credibility weighting
 * Tier 1 (1.0): Authoritative - project docs, committed decisions
 * Tier 2 (0.75): Verified - approved artifacts, project data
 * Tier 3 (0.40): Community - chat messages, draft artifacts, user feedback
 */
export type SourceTier = 1 | 2 | 3;

/**
 * ROSTR 5D Phase classification
 */
export type Phase = 'PreD' | 'Design' | 'Development' | 'Deployment' | 'Debugging';

/**
 * Knowledge entry stored in vector database
 */
export interface KnowledgeEntry {
  id: string;
  workspace_id: string;
  project_id?: string;

  // Content
  content: string;
  summary?: string;
  content_hash: string; // SHA-256 for deduplication

  // Source metadata
  source_type: SourceType;
  source_tier: SourceTier;
  credibility_score: number; // 0.0-1.0

  // Vector embedding (1536 dimensions)
  embedding: number[];

  // Context tags
  topics: string[];
  entities: string[]; // Named entities (companies, people, tools)
  phase?: Phase;

  // Timestamps
  content_date?: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * Query for retrieval from knowledge base
 */
export interface RetrievalQuery {
  text: string;
  workspace_id: string;
  project_id?: string;

  // Filters
  source_tiers?: SourceTier[]; // Default [1, 2, 3]
  source_types?: SourceType[];
  phases?: Phase[];
  topics?: string[];

  // Retrieval parameters
  top_k?: number;              // Default 10
  min_similarity?: number;     // Default 0.7
  confidence_threshold?: number; // Default 0.8
}

/**
 * Result from a single retrieval pass
 */
export interface PassResult {
  entries: (KnowledgeEntry & { similarity: number })[];
  query_variants: string[]; // Alternative query formulations used
  coverage_per_topic: Record<string, number>; // Confidence per sub-topic
}

/**
 * Final retrieval result after multi-pass execution
 */
export interface RetrievalResult {
  entries: (KnowledgeEntry & { similarity: number })[];
  confidence: number; // Overall confidence score (0-1)
  coverage: {
    total_queries: number;
    high_confidence_topics: string[];
    low_confidence_topics: string[];
    gaps: string[]; // Topics with insufficient coverage
  };
  passes_executed: number;
  execution_time_ms: number;
}

/**
 * Configuration for multi-pass retrieval algorithm
 */
export interface MultiPassConfig {
  pass1_broad_queries: number;    // Default 5
  pass2_gap_queries: number;      // Default 2 per gap
  max_passes: number;             // Default 3
  confidence_target: number;      // Default 0.8
  enable_cache: boolean;          // Default true
}

/**
 * Entry for ingestion into knowledge base
 */
export interface KnowledgeIngestion {
  workspace_id: string;
  project_id?: string;

  content: string;
  summary?: string;

  source_type: SourceType;
  source_tier: SourceTier;

  topics?: string[];
  entities?: string[];
  phase?: Phase;

  content_date?: Date;
}

/**
 * Cached retrieval result
 */
export interface CachedRetrieval {
  id: string;
  query_hash: string;
  results: RetrievalResult;
  confidence: number;
  created_at: Date;
  expires_at: Date;
}

/**
 * Statistics for knowledge base health
 */
export interface KnowledgeBaseStats {
  total_entries: number;
  entries_by_tier: Record<SourceTier, number>;
  entries_by_source: Record<SourceType, number>;
  entries_by_phase: Record<Phase, number>;
  avg_credibility: number;
  total_topics: number;
  total_entities: number;
  oldest_entry: Date;
  newest_entry: Date;
}

/**
 * Confidence scoring weights
 */
export interface ConfidenceWeights {
  source_count: number;     // Default 0.35
  consistency: number;      // Default 0.30
  tier_distribution: number; // Default 0.25
  recency: number;          // Default 0.10
}

/**
 * Topic coverage assessment
 */
export interface TopicCoverage {
  topic: string;
  confidence: number;
  source_count: number;
  tier_distribution: Record<SourceTier, number>;
  consistency_score: number; // 0-1, based on agreement across sources
  recency_score: number;     // 0-1, based on how recent the entries are
}

/**
 * Error types for RAG DAL operations
 */
export class RAGDALError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'RAGDALError';
  }
}

export class EmbeddingError extends RAGDALError {
  constructor(message: string, details?: any) {
    super(message, 'EMBEDDING_ERROR', details);
    this.name = 'EmbeddingError';
  }
}

export class RetrievalError extends RAGDALError {
  constructor(message: string, details?: any) {
    super(message, 'RETRIEVAL_ERROR', details);
    this.name = 'RetrievalError';
  }
}

export class StorageError extends RAGDALError {
  constructor(message: string, details?: any) {
    super(message, 'STORAGE_ERROR', details);
    this.name = 'StorageError';
  }
}
