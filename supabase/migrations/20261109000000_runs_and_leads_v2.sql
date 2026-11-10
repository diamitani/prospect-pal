-- WARNING: Do not apply this file to the shared Enably Supabase project.
-- Enably already has public.runs / public.workspaces / public.artifacts
-- (incompatible schema). Use 20261110000000_ppal_namespaced_tables.sql instead.
--
-- Prospect Pal by Salesgency — Phase 1: runs + expanded leads
-- Apply in Supabase SQL editor or via CLI. Read-only deploy note: user runs this manually.

-- ---------------------------------------------------------------------------
-- RUNS (job queue)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  current_step TEXT,
  brief TEXT NOT NULL,
  enrichment_mode TEXT NOT NULL DEFAULT 'free'
    CHECK (enrichment_mode IN ('free', 'byok', 'dual')),
  plan JSONB,
  artifacts JSONB DEFAULT '{}'::jsonb,
  progress JSONB DEFAULT '[]'::jsonb,
  notes TEXT[] DEFAULT ARRAY[]::TEXT[],
  error TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_runs_workspace_id ON runs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_runs_status ON runs(status);
CREATE INDEX IF NOT EXISTS idx_runs_created_at ON runs(created_at DESC);

-- ---------------------------------------------------------------------------
-- LEADS — expand schema (additive; keep legacy columns)
-- ---------------------------------------------------------------------------
ALTER TABLE leads ADD COLUMN IF NOT EXISTS run_id UUID REFERENCES runs(id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS profile_url TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS signal TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS signal_event_date DATE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_urls JSONB DEFAULT '[]'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS provenance TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS dns_status TEXT DEFAULT 'unknown';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'not_checked';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS disposition TEXT DEFAULT 'needs_review';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS score_breakdown JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tier TEXT CHECK (tier IS NULL OR tier IN ('A', 'B', 'C'));
ALTER TABLE leads ADD COLUMN IF NOT EXISTS blockers TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Soften email NOT NULL if present (unknown emails allowed)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'email' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE leads ALTER COLUMN email DROP NOT NULL;
  END IF;
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;

-- Backfill contact_name from name when present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'name'
  ) THEN
    UPDATE leads SET contact_name = name WHERE contact_name IS NULL AND name IS NOT NULL;
  END IF;
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_leads_run_id ON leads(run_id);
CREATE INDEX IF NOT EXISTS idx_leads_disposition ON leads(disposition);
CREATE INDEX IF NOT EXISTS idx_leads_tier ON leads(tier);

-- ---------------------------------------------------------------------------
-- CRM WRITE PREVIEWS (HubSpot preview → approve → write)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crm_write_previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'hubspot',
  lead_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'applied', 'failed')),
  result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  decided_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_crm_previews_status ON crm_write_previews(status);

-- updated_at trigger for runs
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS runs_updated_at ON runs;
CREATE TRIGGER runs_updated_at
  BEFORE UPDATE ON runs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
