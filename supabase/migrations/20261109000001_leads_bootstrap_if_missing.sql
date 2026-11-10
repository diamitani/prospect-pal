-- WARNING: Do not apply this file to the shared Enably Supabase project.
-- Enably already has public.runs / public.workspaces / public.artifacts
-- (incompatible schema). Use 20261110000000_ppal_namespaced_tables.sql instead.
--
-- Ensure leads table exists for fresh projects before v2 alters
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  run_id UUID,
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
  tier TEXT,
  blockers TEXT[] DEFAULT ARRAY[]::TEXT[],
  profile_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
