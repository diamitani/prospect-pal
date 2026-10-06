/**
 * Vector Store for RAG DAL
 *
 * Manages vector embeddings and similarity search using Supabase pgvector.
 * Implements CRUD operations for knowledge entries with semantic search capabilities.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import {
  KnowledgeEntry,
  KnowledgeIngestion,
  StorageError,
  SourceTier,
  SourceType,
} from './types';

export class VectorStore {
  private client: SupabaseClient;
  private serviceClient?: SupabaseClient; // For privileged operations

  constructor() {
    // Use public client for RLS-enforced operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new StorageError('Supabase environment variables not configured');
    }

    this.client = createClient(supabaseUrl, supabaseAnonKey);

    // Service client for admin operations (bypasses RLS)
    if (supabaseServiceKey) {
      this.serviceClient = createClient(supabaseUrl, supabaseServiceKey);
    }
  }

  /**
   * Insert or update a knowledge entry
   */
  async upsertEntry(
    ingestion: KnowledgeIngestion,
    embedding: number[]
  ): Promise<string> {
    // Calculate content hash for deduplication
    const content_hash = this.hashContent(ingestion.content);

    // Check if entry already exists
    const existing = await this.getByHash(ingestion.workspace_id, content_hash);

    if (existing) {
      // Update existing entry
      await this.updateEntry(existing.id, {
        summary: ingestion.summary,
        embedding,
        topics: ingestion.topics || existing.topics,
        entities: ingestion.entities || existing.entities,
        phase: ingestion.phase || existing.phase,
      });
      return existing.id;
    }

    // Insert new entry
    const entry = {
      workspace_id: ingestion.workspace_id,
      project_id: ingestion.project_id,
      content: ingestion.content,
      summary: ingestion.summary,
      content_hash,
      source_type: ingestion.source_type,
      source_tier: ingestion.source_tier,
      credibility_score: this.calculateCredibility(ingestion.source_tier, ingestion.source_type),
      embedding: JSON.stringify(embedding), // pgvector expects JSON array
      topics: ingestion.topics || [],
      entities: ingestion.entities || [],
      phase: ingestion.phase,
      content_date: ingestion.content_date?.toISOString(),
    };

    const { data, error } = await this.client
      .from('rostr_knowledge_base')
      .insert(entry)
      .select()
      .single();

    if (error) {
      throw new StorageError('Failed to insert knowledge entry', { error, content_hash });
    }

    return data.id;
  }

  /**
   * Perform similarity search on knowledge base
   */
  async similaritySearch(
    embedding: number[],
    workspace_id: string,
    options: {
      top_k?: number;
      min_similarity?: number;
      source_tiers?: SourceTier[];
      source_types?: SourceType[];
      project_id?: string;
      topics?: string[];
      phases?: string[];
    } = {}
  ): Promise<(KnowledgeEntry & { similarity: number })[]> {
    const {
      top_k = 10,
      min_similarity = 0.7,
      source_tiers = [1, 2, 3],
      source_types,
      project_id,
      topics,
      phases,
    } = options;

    // Use the stored function for optimized vector search
    const client = this.serviceClient || this.client;

    const { data, error } = await client.rpc('search_knowledge', {
      query_embedding: JSON.stringify(embedding),
      target_workspace_id: workspace_id,
      target_project_id: project_id || null,
      tier_filter: source_tiers,
      top_k,
      min_similarity,
    });

    if (error) {
      throw new StorageError('Similarity search failed', { error, workspace_id });
    }

    // Post-filter by source_types, topics, phases if specified
    let results = data || [];

    if (source_types && source_types.length > 0) {
      results = results.filter((r: any) => source_types.includes(r.source_type));
    }

    if (topics && topics.length > 0) {
      results = results.filter((r: any) =>
        r.topics?.some((t: string) => topics.includes(t))
      );
    }

    if (phases && phases.length > 0) {
      results = results.filter((r: any) => phases.includes(r.phase));
    }

    // Transform to KnowledgeEntry format
    return results.map((r: any) => ({
      id: r.id,
      workspace_id,
      project_id: project_id || undefined,
      content: r.content,
      summary: r.summary,
      content_hash: '', // Not returned by search function
      source_type: r.source_type,
      source_tier: r.source_tier,
      credibility_score: parseFloat(r.credibility_score),
      embedding: [], // Don't return full embedding (large)
      topics: r.topics || [],
      entities: r.entities || [],
      phase: r.phase,
      content_date: r.content_date ? new Date(r.content_date) : undefined,
      created_at: new Date(r.created_at),
      updated_at: new Date(r.updated_at),
      similarity: parseFloat(r.similarity),
    }));
  }

  /**
   * Get knowledge entry by ID
   */
  async getById(id: string): Promise<KnowledgeEntry | null> {
    const { data, error } = await this.client
      .from('rostr_knowledge_base')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new StorageError('Failed to get entry by ID', { error, id });
    }

    return this.transformEntry(data);
  }

  /**
   * Get knowledge entry by content hash (deduplication)
   */
  async getByHash(
    workspace_id: string,
    content_hash: string
  ): Promise<KnowledgeEntry | null> {
    const { data, error } = await this.client
      .from('rostr_knowledge_base')
      .select('*')
      .eq('workspace_id', workspace_id)
      .eq('content_hash', content_hash)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new StorageError('Failed to get entry by hash', { error, content_hash });
    }

    return this.transformEntry(data);
  }

  /**
   * Update existing knowledge entry
   */
  async updateEntry(
    id: string,
    updates: Partial<Pick<KnowledgeEntry, 'summary' | 'embedding' | 'topics' | 'entities' | 'phase'>>
  ): Promise<void> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.summary !== undefined) updateData.summary = updates.summary;
    if (updates.embedding !== undefined) updateData.embedding = JSON.stringify(updates.embedding);
    if (updates.topics !== undefined) updateData.topics = updates.topics;
    if (updates.entities !== undefined) updateData.entities = updates.entities;
    if (updates.phase !== undefined) updateData.phase = updates.phase;

    const { error } = await this.client
      .from('rostr_knowledge_base')
      .update(updateData)
      .eq('id', id);

    if (error) {
      throw new StorageError('Failed to update entry', { error, id });
    }
  }

  /**
   * Delete knowledge entry by ID
   */
  async deleteById(id: string): Promise<void> {
    const { error } = await this.client
      .from('rostr_knowledge_base')
      .delete()
      .eq('id', id);

    if (error) {
      throw new StorageError('Failed to delete entry', { error, id });
    }
  }

  /**
   * Delete all knowledge entries for a project
   */
  async deleteByProject(project_id: string): Promise<number> {
    const { data, error } = await this.client
      .from('rostr_knowledge_base')
      .delete()
      .eq('project_id', project_id)
      .select('id');

    if (error) {
      throw new StorageError('Failed to delete project entries', { error, project_id });
    }

    return data?.length || 0;
  }

  /**
   * Delete all knowledge entries for a workspace
   */
  async deleteByWorkspace(workspace_id: string): Promise<number> {
    const { data, error } = await this.client
      .from('rostr_knowledge_base')
      .delete()
      .eq('workspace_id', workspace_id)
      .select('id');

    if (error) {
      throw new StorageError('Failed to delete workspace entries', { error, workspace_id });
    }

    return data?.length || 0;
  }

  /**
   * Get knowledge base statistics
   */
  async getStats(workspace_id: string): Promise<any> {
    const { data, error } = await this.client
      .from('rostr_knowledge_base')
      .select('source_tier, source_type, phase, credibility_score, created_at')
      .eq('workspace_id', workspace_id);

    if (error) {
      throw new StorageError('Failed to get stats', { error, workspace_id });
    }

    const entries = data || [];

    // Calculate statistics
    const stats = {
      total_entries: entries.length,
      entries_by_tier: { 1: 0, 2: 0, 3: 0 } as Record<SourceTier, number>,
      entries_by_source: {} as Record<SourceType, number>,
      entries_by_phase: {} as Record<string, number>,
      avg_credibility: 0,
      oldest_entry: null as Date | null,
      newest_entry: null as Date | null,
    };

    if (entries.length === 0) return stats;

    let credibilitySum = 0;
    let oldestDate = new Date(entries[0].created_at);
    let newestDate = new Date(entries[0].created_at);

    for (const entry of entries) {
      // Tier distribution
      stats.entries_by_tier[entry.source_tier as SourceTier]++;

      // Source type distribution
      const sourceType = entry.source_type as SourceType;
      stats.entries_by_source[sourceType] =
        (stats.entries_by_source[sourceType] || 0) + 1;

      // Phase distribution
      if (entry.phase) {
        const phase = entry.phase as string;
        stats.entries_by_phase[phase] = (stats.entries_by_phase[phase] || 0) + 1;
      }

      // Credibility average
      credibilitySum += typeof entry.credibility_score === 'number'
        ? entry.credibility_score
        : parseFloat(entry.credibility_score || '0');

      // Date range
      const entryDate = new Date(entry.created_at);
      if (entryDate < oldestDate) oldestDate = entryDate;
      if (entryDate > newestDate) newestDate = entryDate;
    }

    stats.avg_credibility = credibilitySum / entries.length;
    stats.oldest_entry = oldestDate;
    stats.newest_entry = newestDate;

    return stats;
  }

  /**
   * Calculate credibility score based on tier and source type
   */
  private calculateCredibility(tier: SourceTier, sourceType: SourceType): number {
    const tierScore = tier === 1 ? 1.0 : tier === 2 ? 0.75 : 0.40;

    // Boost credibility for specific source types
    const typeBoost = {
      project_doc: 0.0,
      decision: 0.0,
      artifact: -0.05,
      org_context: -0.05,
      chat: -0.10,
    }[sourceType] || 0;

    return Math.max(0, Math.min(1, tierScore + typeBoost));
  }

  /**
   * Hash content for deduplication
   */
  private hashContent(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Transform database row to KnowledgeEntry
   */
  private transformEntry(row: any): KnowledgeEntry {
    return {
      id: row.id,
      workspace_id: row.workspace_id,
      project_id: row.project_id,
      content: row.content,
      summary: row.summary,
      content_hash: row.content_hash,
      source_type: row.source_type,
      source_tier: row.source_tier,
      credibility_score: parseFloat(row.credibility_score),
      embedding: typeof row.embedding === 'string' ? JSON.parse(row.embedding) : row.embedding,
      topics: row.topics || [],
      entities: row.entities || [],
      phase: row.phase,
      content_date: row.content_date ? new Date(row.content_date) : undefined,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }
}

/**
 * Singleton instance for app-wide use
 */
let globalVectorStore: VectorStore | null = null;

export function getVectorStore(): VectorStore {
  if (!globalVectorStore) {
    globalVectorStore = new VectorStore();
  }
  return globalVectorStore;
}
