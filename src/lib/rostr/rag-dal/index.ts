/**
 * RAG DAL (Retrieval Augmented Generation - Dynamic Acquisition Layer)
 *
 * Main entry point for semantic retrieval with three-tier credibility architecture.
 *
 * ## Usage
 *
 * ```typescript
 * import { ingestKnowledge, retrieveKnowledge } from '@/lib/rostr/rag-dal';
 *
 * // Ingest knowledge
 * await ingestKnowledge({
 *   workspace_id: 'workspace-123',
 *   project_id: 'project-456',
 *   content: 'DevOps campaigns should highlight security and 30% faster deploys',
 *   source_type: 'decision',
 *   source_tier: 1,
 *   topics: ['devops', 'campaigns', 'messaging'],
 * });
 *
 * // Retrieve relevant knowledge
 * const result = await retrieveKnowledge({
 *   text: 'Build campaign for DevOps leaders',
 *   workspace_id: 'workspace-123',
 *   confidence_threshold: 0.8,
 * });
 *
 * console.log(`Found ${result.entries.length} entries with confidence ${result.confidence}`);
 * ```
 */

// Export types
export type {
  KnowledgeEntry,
  KnowledgeIngestion,
  RetrievalQuery,
  RetrievalResult,
  PassResult,
  MultiPassConfig,
  SourceType,
  SourceTier,
  Phase,
  TopicCoverage,
  ConfidenceWeights,
  KnowledgeBaseStats,
  CachedRetrieval,
} from './types';

// Export error classes
export { RAGDALError, EmbeddingError, RetrievalError, StorageError } from './types';

// Export services
export { EmbeddingService, getEmbeddingService } from './embedding-service';
export type { EmbeddingProvider, EmbeddingConfig } from './embedding-service';

export { VectorStore, getVectorStore } from './vector-store';

export { RetrievalEngine, getRetrievalEngine } from './retrieval-engine';

// Export utilities
export {
  calculateCredibility,
  isAuthoritative,
  isCommunity,
  getRecommendedTier,
  validateTierAssignment,
  weightedAverageCredibility,
  hasSufficientCredibility,
  getTierRequirements,
  checkTierDistribution,
  TIER_CREDIBILITY,
  DEFAULT_SOURCE_TIERS,
} from './source-tier';

export {
  calculateConfidence,
  calculateSourceCountScore,
  calculateConsistencyScore,
  calculateTierDistributionScore,
  calculateRecencyScore,
  assessTopicCoverage,
  identifyGaps,
  extractTopicsFromQuery,
  calculateOverallCoverage,
  meetsConfidenceThreshold,
  DEFAULT_CONFIDENCE_WEIGHTS,
} from './confidence-scorer';

// ===========================================================================
// High-Level API
// ===========================================================================

import { getEmbeddingService } from './embedding-service';
import { getVectorStore } from './vector-store';
import { getRetrievalEngine } from './retrieval-engine';
import type {
  KnowledgeIngestion,
  RetrievalQuery,
  RetrievalResult,
  KnowledgeBaseStats,
} from './types';

/**
 * Ingest knowledge into the vector database
 *
 * @param ingestion - Knowledge entry to ingest
 * @returns ID of the created/updated entry
 */
export async function ingestKnowledge(ingestion: KnowledgeIngestion): Promise<string> {
  const embeddingService = getEmbeddingService();
  const vectorStore = getVectorStore();

  // Generate embedding
  const embedding = await embeddingService.embed(ingestion.content);

  // Store in vector database
  const id = await vectorStore.upsertEntry(ingestion, embedding);

  return id;
}

/**
 * Ingest multiple knowledge entries in batch
 *
 * @param ingestions - Array of knowledge entries
 * @returns Array of created/updated IDs
 */
export async function ingestKnowledgeBatch(ingestions: KnowledgeIngestion[]): Promise<string[]> {
  const embeddingService = getEmbeddingService();
  const vectorStore = getVectorStore();

  // Generate embeddings in batch
  const contents = ingestions.map(i => i.content);
  const embeddings = await embeddingService.embedBatch(contents);

  // Store all entries
  const ids: string[] = [];
  for (let i = 0; i < ingestions.length; i++) {
    const id = await vectorStore.upsertEntry(ingestions[i], embeddings[i]);
    ids.push(id);
  }

  return ids;
}

/**
 * Retrieve relevant knowledge using multi-pass semantic search
 *
 * @param query - Retrieval query with text and filters
 * @returns Retrieval result with entries and confidence metrics
 */
export async function retrieveKnowledge(query: RetrievalQuery): Promise<RetrievalResult> {
  const retrievalEngine = getRetrievalEngine({
    confidence_target: query.confidence_threshold || 0.8,
  });

  return await retrievalEngine.retrieve(query);
}

/**
 * Get statistics about the knowledge base
 *
 * @param workspace_id - Workspace ID
 * @returns Knowledge base statistics
 */
export async function getKnowledgeBaseStats(workspace_id: string): Promise<KnowledgeBaseStats> {
  const vectorStore = getVectorStore();
  const stats = await vectorStore.getStats(workspace_id);
  return stats as KnowledgeBaseStats;
}

/**
 * Delete knowledge entries for a project
 *
 * @param project_id - Project ID
 * @returns Number of entries deleted
 */
export async function deleteProjectKnowledge(project_id: string): Promise<number> {
  const vectorStore = getVectorStore();
  return await vectorStore.deleteByProject(project_id);
}

/**
 * Delete all knowledge for a workspace
 *
 * @param workspace_id - Workspace ID
 * @returns Number of entries deleted
 */
export async function deleteWorkspaceKnowledge(workspace_id: string): Promise<number> {
  const vectorStore = getVectorStore();
  return await vectorStore.deleteByWorkspace(workspace_id);
}

/**
 * Health check for RAG DAL system
 *
 * @returns Health status of all components
 */
export async function healthCheck(): Promise<{
  healthy: boolean;
  components: {
    embedding: { healthy: boolean; provider: string; error?: string };
    vectorStore: { healthy: boolean; error?: string };
  };
}> {
  const embeddingService = getEmbeddingService();

  // Check embedding service
  const embeddingHealth = await embeddingService.healthCheck();

  // Check vector store (attempt a basic query)
  let vectorStoreHealthy = true;
  let vectorStoreError: string | undefined;
  try {
    const vectorStore = getVectorStore();
    // Just verify we can instantiate (connection check happens on first real query)
  } catch (error) {
    vectorStoreHealthy = false;
    vectorStoreError = error instanceof Error ? error.message : 'Unknown error';
  }

  const healthy = embeddingHealth.healthy && vectorStoreHealthy;

  return {
    healthy,
    components: {
      embedding: embeddingHealth,
      vectorStore: {
        healthy: vectorStoreHealthy,
        error: vectorStoreError,
      },
    },
  };
}
