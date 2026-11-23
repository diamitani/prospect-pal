-- Prospect Pal — Outbound agent harness, Phase A.
--
-- ENABLY-SAFE: touches ONLY ppal_* objects. Never creates, alters, or drops
-- unprefixed public.runs / public.workspaces / public.users / public.artifacts.
-- Requires 20261110000000_ppal_namespaced_tables.sql to have been applied.
-- Idempotent: safe to re-run.

-- ---------------------------------------------------------------------------
-- 1. Lead ownership + enrichment provenance
-- ---------------------------------------------------------------------------
ALTER TABLE public.ppal_leads
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.ppal_leads
  ADD COLUMN IF NOT EXISTS enrichment JSONB;

-- Backfill owner from the parent run.
UPDATE public.ppal_leads l
   SET created_by = r.created_by
  FROM public.ppal_runs r
 WHERE l.run_id = r.id
   AND l.created_by IS NULL
   AND r.created_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ppal_leads_created_by ON public.ppal_leads(created_by);
CREATE INDEX IF NOT EXISTS idx_ppal_leads_workspace_id ON public.ppal_leads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ppal_leads_email_lower ON public.ppal_leads(lower(email));
CREATE INDEX IF NOT EXISTS idx_ppal_leads_domain_lower ON public.ppal_leads(lower(domain));
CREATE INDEX IF NOT EXISTS idx_ppal_runs_workspace_id ON public.ppal_runs(workspace_id);

-- ---------------------------------------------------------------------------
-- 2. Durable run events (one row per harness step)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ppal_run_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES public.ppal_runs(id) ON DELETE CASCADE,
  step TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warn', 'error')),
  message TEXT NOT NULL DEFAULT '',
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ppal_run_events_run ON public.ppal_run_events(run_id, started_at);

-- ---------------------------------------------------------------------------
-- 3. Suppression / do-not-contact list
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ppal_suppressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('email', 'domain')),
  value TEXT NOT NULL CHECK (value = lower(value) AND length(value) > 0),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ppal_suppressions_user_kind_value_key UNIQUE (user_id, kind, value)
);

CREATE INDEX IF NOT EXISTS idx_ppal_suppressions_workspace ON public.ppal_suppressions(workspace_id);

-- ---------------------------------------------------------------------------
-- 4. RLS — owner-scoped (service role bypasses RLS; API routes scope too)
-- ---------------------------------------------------------------------------
ALTER TABLE public.ppal_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppal_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppal_run_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppal_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppal_crm_write_previews ENABLE ROW LEVEL SECURITY;

-- Runs: only the creator.
DROP POLICY IF EXISTS "ppal_runs_owner" ON public.ppal_runs;
CREATE POLICY "ppal_runs_owner" ON public.ppal_runs
  FOR ALL TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Leads: replaces the wide-open USING (true) policy.
DROP POLICY IF EXISTS "ppal_leads_auth_read" ON public.ppal_leads;
DROP POLICY IF EXISTS "ppal_leads_owner" ON public.ppal_leads;
CREATE POLICY "ppal_leads_owner" ON public.ppal_leads
  FOR ALL TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.ppal_runs r
       WHERE r.id = ppal_leads.run_id AND r.created_by = auth.uid()
    )
  )
  WITH CHECK (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.ppal_runs r
       WHERE r.id = ppal_leads.run_id AND r.created_by = auth.uid()
    )
  );

-- Run events: readable by the run owner; writes are service-role only.
DROP POLICY IF EXISTS "ppal_run_events_owner_read" ON public.ppal_run_events;
CREATE POLICY "ppal_run_events_owner_read" ON public.ppal_run_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ppal_runs r
       WHERE r.id = ppal_run_events.run_id AND r.created_by = auth.uid()
    )
  );

-- Suppressions: only the owner.
DROP POLICY IF EXISTS "ppal_suppressions_owner" ON public.ppal_suppressions;
CREATE POLICY "ppal_suppressions_owner" ON public.ppal_suppressions
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- CRM previews: drop the "created_by IS NULL" escape hatch.
DROP POLICY IF EXISTS "ppal_crm_previews_owner" ON public.ppal_crm_write_previews;
CREATE POLICY "ppal_crm_previews_owner" ON public.ppal_crm_write_previews
  FOR ALL TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());
