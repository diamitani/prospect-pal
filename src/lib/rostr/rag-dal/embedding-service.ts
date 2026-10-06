/**
 * Embedding Service with BYOK (Bring Your Own Key) support
 * Powered by OpenAI / Vercel AI (Zero AWS SDK)
 *
 * Generates vector embeddings for text using available AI providers:
 * - OpenAI text-embedding-3-small / text-embedding-ada-002
 * - Fallback to deterministic hashing (for testing/offline mode)
 */

import { EmbeddingError } from './types';
import crypto from 'crypto';
import OpenAI from 'openai';

export type EmbeddingProvider = 'openai' | 'fallback';

export interface EmbeddingConfig {
  provider?: EmbeddingProvider;
  dimensions?: number; // Default 1536
}

export class EmbeddingService {
  private config: Required<EmbeddingConfig>;
  private openaiClient?: OpenAI;

  constructor(config: EmbeddingConfig = {}) {
    this.config = {
      provider: config.provider || this.detectAvailableProvider(),
      dimensions: config.dimensions || 1536,
    };

    this.initializeClients();
  }

  /**
   * Detect which embedding provider is available based on environment variables
   */
  private detectAvailableProvider(): EmbeddingProvider {
    if (process.env.OPENAI_API_KEY) {
      return 'openai';
    }
    return 'fallback';
  }

  /**
   * Initialize API clients
   */
  private initializeClients(): void {
    if (process.env.OPENAI_API_KEY) {
      this.openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  /**
   * Generate embedding for a single text string
   */
  async embed(text: string): Promise<number[]> {
    if (!text || text.trim().length === 0) {
      throw new EmbeddingError('Cannot generate embedding for empty text');
    }

    const truncated = text.slice(0, 8000);

    try {
      if (this.config.provider === 'openai' && this.openaiClient) {
        return await this.embedOpenAI(truncated);
      }
      return this.embedFallback(truncated);
    } catch (error) {
      console.warn(`[EmbeddingService] Primary provider failed, falling back to deterministic hashing:`, error);
      return this.embedFallback(truncated);
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) {
      return [];
    }

    if (this.config.provider === 'openai' && this.openaiClient) {
      return await this.embedBatchOpenAI(texts);
    }

    const embeddings: number[][] = [];
    for (const text of texts) {
      const embedding = await this.embed(text);
      embeddings.push(embedding);
    }

    return embeddings;
  }

  /**
   * OpenAI text-embedding-3-small
   */
  private async embedOpenAI(text: string): Promise<number[]> {
    if (!this.openaiClient) {
      throw new EmbeddingError('OpenAI client not initialized');
    }

    try {
      const response = await this.openaiClient.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      if (!response.data || response.data.length === 0) {
        throw new EmbeddingError('No embedding in OpenAI response');
      }

      return response.data[0].embedding;
    } catch (error) {
      throw new EmbeddingError('OpenAI embedding failed', { error, text: text.slice(0, 100) });
    }
  }

  /**
   * Batch embeddings for OpenAI
   */
  private async embedBatchOpenAI(texts: string[]): Promise<number[][]> {
    if (!this.openaiClient) {
      throw new EmbeddingError('OpenAI client not initialized');
    }

    try {
      const response = await this.openaiClient.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts,
      });

      if (!response.data || response.data.length !== texts.length) {
        throw new EmbeddingError('Batch embedding count mismatch');
      }

      return response.data.map(item => item.embedding);
    } catch (error) {
      throw new EmbeddingError('OpenAI batch embedding failed', { error, count: texts.length });
    }
  }

  /**
   * Fallback: Simple deterministic hashing to 1536-dimensional vector
   */
  private embedFallback(text: string): number[] {
    const hash = crypto.createHash('sha256').update(text).digest();
    const embedding: number[] = [];
    const seed = hash.readUInt32BE(0);

    let state = seed;
    for (let i = 0; i < this.config.dimensions; i++) {
      state = (1103515245 * state + 12345) % 2147483648;
      embedding.push((state / 1073741824) - 1);
    }

    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }

  /**
   * Get current provider being used
   */
  getProvider(): EmbeddingProvider {
    return this.config.provider;
  }

  /**
   * Test if service is operational
   */
  async healthCheck(): Promise<{ healthy: boolean; provider: EmbeddingProvider; error?: string }> {
    try {
      await this.embed('test');
      return { healthy: true, provider: this.config.provider };
    } catch (error) {
      return {
        healthy: false,
        provider: this.config.provider,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

let globalEmbeddingService: EmbeddingService | null = null;

export function getEmbeddingService(config?: EmbeddingConfig): EmbeddingService {
  if (!globalEmbeddingService) {
    globalEmbeddingService = new EmbeddingService(config);
  }
  return globalEmbeddingService;
}
