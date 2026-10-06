-- RAG DAL (Retrieval Augmented Generation - Dynamic Acquisition Layer) Schema
-- Implements vector-based semantic retrieval with three-tier credibility architecture

-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Vector knowledge base table
-- Stores content with embeddings for semantic retrieval
CREATE TABLE IF NOT EXISTS rostr_knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,

  -- Content
  content TEXT NOT NULL,
  summary TEXT,
  content_hash TEXT NOT NULL, -- SHA-256 hash for deduplication

  -- Source metadata
  source_type TEXT NOT NULL CHECK (source_type IN (
    'project_doc',    -- CLAUDE.md, AGENTS.md, etc.
    'artifact',       -- Generated n8n JSON, deploy guides
    'decision',       -- Explicit decisions made during planning
    'chat',          -- Chat messages with valuable context
    'org_context'    -- Organization-level context (ICP, brand)
  )),
  source_tier INTEGER NOT NULL CHECK (source_tier IN (1, 2, 3)),
  credibility_score DECIMAL(3, 2) NOT NULL CHECK (credibility_score >= 0 AND credibility_score <= 1),

  -- Vector embedding (1536 dimensions for OpenAI ada-002 or AWS Bedrock Titan)
  embedding VECTOR(1536),

  -- Context tags for filtering
  topics TEXT[] DEFAULT '{}',
  entities TEXT[] DEFAULT '{}',
  phase TEXT CHECK (phase IN ('PreD', 'Design', 'Development', 'Deployment', 'Debugging')),

  -- Timestamps
  content_date TIMESTAMP WITH TIME ZONE, -- When the content was originally created
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate content per workspace
  CONSTRAINT unique_workspace_content UNIQUE(workspace_id, content_hash)
);

-- Vector similarity search index using IVFFlat
-- IVFFlat is optimized for approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS idx_knowledge_embedding
  ON rostr_knowledge_base
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Standard lookup indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_workspace ON rostr_knowledge_base(workspace_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_project ON rostr_knowledge_base(project_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_tier ON rostr_knowledge_base(source_tier);
CREATE INDEX IF NOT EXISTS idx_knowledge_source_type ON rostr_knowledge_base(source_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_phase ON rostr_knowledge_base(phase);
CREATE INDEX IF NOT EXISTS idx_knowledge_created_at ON rostr_knowledge_base(created_at DESC);

-- GIN index for array fields (topics, entities)
CREATE INDEX IF NOT EXISTS idx_knowledge_topics ON rostr_knowledge_base USING GIN(topics);
CREATE INDEX IF NOT EXISTS idx_knowledge_entities ON rostr_knowledge_base USING GIN(entities);

-- Multi-pass retrieval query cache
-- Caches expensive retrieval operations for 1 hour
CREATE TABLE IF NOT EXISTS rag_retrieval_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_hash TEXT NOT NULL, -- SHA-256 of query text + filters
  results JSONB NOT NULL,   -- Cached retrieval results
  confidence DECIMAL(3, 2), -- Confidence score of cached results
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour'),

  -- Prevent duplicate cache entries
  CONSTRAINT unique_query_hash UNIQUE(query_hash)
);

CREATE INDEX IF NOT EXISTS idx_cache_query ON rag_retrieval_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON rag_retrieval_cache(expires_at);

-- Auto-cleanup expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM rag_retrieval_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Updated_at trigger for knowledge base
CREATE OR REPLACE FUNCTION update_knowledge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_knowledge_updated_at
  BEFORE UPDATE ON rostr_knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_updated_at();

-- Row Level Security (RLS) policies
ALTER TABLE rostr_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_retrieval_cache ENABLE ROW LEVEL SECURITY;

-- Knowledge base RLS: Users can only access knowledge from their workspace
CREATE POLICY knowledge_workspace_isolation ON rostr_knowledge_base
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Cache RLS: No direct user access to cache (accessed via service role only)
CREATE POLICY cache_service_role_only ON rag_retrieval_cache
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON rostr_knowledge_base TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON rag_retrieval_cache TO service_role;

-- Helper function: Calculate cosine similarity between query and knowledge entries
CREATE OR REPLACE FUNCTION search_knowledge(
  query_embedding VECTOR(1536),
  target_workspace_id UUID,
  target_project_id UUID DEFAULT NULL,
  tier_filter INTEGER[] DEFAULT ARRAY[1, 2, 3],
  top_k INTEGER DEFAULT 10,
  min_similarity DECIMAL DEFAULT 0.7
)
RETURNS TABLE(
  id UUID,
  content TEXT,
  summary TEXT,
  source_type TEXT,
  source_tier INTEGER,
  credibility_score DECIMAL,
  topics TEXT[],
  entities TEXT[],
  phase TEXT,
  similarity DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.content,
    kb.summary,
    kb.source_type,
    kb.source_tier,
    kb.credibility_score,
    kb.topics,
    kb.entities,
    kb.phase,
    (1 - (kb.embedding <=> query_embedding))::DECIMAL AS similarity
  FROM rostr_knowledge_base kb
  WHERE kb.workspace_id = target_workspace_id
    AND (target_project_id IS NULL OR kb.project_id = target_project_id)
    AND kb.source_tier = ANY(tier_filter)
    AND (1 - (kb.embedding <=> query_embedding)) >= min_similarity
  ORDER BY kb.embedding <=> query_embedding
  LIMIT top_k;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE rostr_knowledge_base IS 'Vector knowledge base for RAG DAL semantic retrieval with three-tier credibility architecture';
COMMENT ON TABLE rag_retrieval_cache IS 'Query cache for expensive multi-pass retrieval operations';
COMMENT ON COLUMN rostr_knowledge_base.source_tier IS 'Tier 1 (1.0): Authoritative sources, Tier 2 (0.75): Verified sources, Tier 3 (0.40): Community sources';
COMMENT ON COLUMN rostr_knowledge_base.credibility_score IS 'Normalized credibility score from 0.0 to 1.0 based on source tier and content quality';
COMMENT ON COLUMN rostr_knowledge_base.embedding IS '1536-dimensional vector embedding for semantic similarity search (OpenAI ada-002 or AWS Bedrock Titan)';
COMMENT ON FUNCTION search_knowledge IS 'Performs cosine similarity search on knowledge base with tier filtering and minimum similarity threshold';
