-- Prospect Pal tables namespaced for the shared Enably Supabase project.
--
-- Enably already owns public.workspaces, public.workspace_members, public.runs,
-- and public.artifacts (see diamitani/enablygtm supabase/migrations/0001_enably_gtm.sql)
-- with a DIFFERENT schema (text ids, GTM architect run manifests).
--
-- DO NOT apply 20261109000000_runs_and_leads_v2.sql or supabase-schema.sql
-- against the Enably project — CREATE/ALTER on `runs` / `workspaces` would
-- collide or corrupt Enably data.
--
-- Safe on Enably: this file only, plus 001_rostr_mcp.sql (rostr_* names).
-- `public.leads` is not an Enably table, but we still use ppal_leads to keep
-- the app fully namespaced.

CREATE TABLE IF NOT EXISTS public.ppal_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID,
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

CREATE INDEX IF NOT EXISTS idx_ppal_runs_status ON public.ppal_runs(status);
CREATE INDEX IF NOT EXISTS idx_ppal_runs_created_at ON public.ppal_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ppal_runs_created_by ON public.ppal_runs(created_by);

CREATE TABLE IF NOT EXISTS public.ppal_leads (
  id TEXT PRIMARY KEY,
  workspace_id UUID,
  run_id UUID REFERENCES public.ppal_runs(id) ON DELETE SET NULL,
  name TEXT,
  contact_name TEXT,
  title TEXT,
  company TEXT NOT NULL,
  domain TEXT,
  email TEXT,
  email_status TEXT DEFAULT 'unknown',
  icp_score INTEGER,
  status TEXT DEFAULT 'ready',
  location TEXT,
  employee_count TEXT,
  funding TEXT,
  tech_stack TEXT[] DEFAULT ARRAY[]::TEXT[],
  outreach_subject TEXT,
  outreach_body TEXT,
  last_contacted_at TIMESTAMPTZ,
  signal TEXT,
  signal_event_date DATE,
  source_urls JSONB DEFAULT '[]'::jsonb,
  provenance TEXT,
  dns_status TEXT DEFAULT 'unknown',
  verification_status TEXT DEFAULT 'not_checked',
  disposition TEXT DEFAULT 'needs_review',
  score_breakdown JSONB,
  tier TEXT CHECK (tier IS NULL OR tier IN ('A', 'B', 'C')),
  blockers TEXT[] DEFAULT ARRAY[]::TEXT[],
  profile_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ppal_leads_run_id ON public.ppal_leads(run_id);
CREATE INDEX IF NOT EXISTS idx_ppal_leads_disposition ON public.ppal_leads(disposition);
CREATE INDEX IF NOT EXISTS idx_ppal_leads_tier ON public.ppal_leads(tier);

CREATE TABLE IF NOT EXISTS public.ppal_crm_write_previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID,
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

CREATE INDEX IF NOT EXISTS idx_ppal_crm_previews_status ON public.ppal_crm_write_previews(status);

CREATE OR REPLACE FUNCTION public.set_ppal_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ppal_runs_updated_at ON public.ppal_runs;
CREATE TRIGGER ppal_runs_updated_at
  BEFORE UPDATE ON public.ppal_runs
  FOR EACH ROW EXECUTE FUNCTION public.set_ppal_updated_at();

DROP TRIGGER IF EXISTS ppal_leads_updated_at ON public.ppal_leads;
CREATE TRIGGER ppal_leads_updated_at
  BEFORE UPDATE ON public.ppal_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_ppal_updated_at();

ALTER TABLE public.ppal_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppal_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppal_crm_write_previews ENABLE ROW LEVEL SECURITY;

-- Owner-scoped policies (service role bypasses RLS).
DROP POLICY IF EXISTS "ppal_runs_owner" ON public.ppal_runs;
CREATE POLICY "ppal_runs_owner" ON public.ppal_runs
  FOR ALL TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by IS NULL OR created_by = auth.uid());

DROP POLICY IF EXISTS "ppal_leads_auth_read" ON public.ppal_leads;
CREATE POLICY "ppal_leads_auth_read" ON public.ppal_leads
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "ppal_crm_previews_owner" ON public.ppal_crm_write_previews;
CREATE POLICY "ppal_crm_previews_owner" ON public.ppal_crm_write_previews
  FOR ALL TO authenticated
  USING (created_by IS NULL OR created_by = auth.uid())
  WITH CHECK (created_by IS NULL OR created_by = auth.uid());
