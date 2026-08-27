-- Prospect PAL Database Schema for Supabase
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER PROFILES & WORKSPACES
-- ============================================================================

-- Users table (extends auth.users with profile data)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT CHECK (plan IN ('free', 'diy', 'pro', 'core', 'agency')) DEFAULT 'free',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT CHECK (plan IN ('free', 'diy', 'pro', 'core', 'agency')) DEFAULT 'free',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON workspaces(slug);

-- Workspace members table (for future team features)
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icp_config JSONB DEFAULT '{}'::jsonb,
  tool_stack JSONB DEFAULT '{}'::jsonb,
  pal_output JSONB,
  status TEXT CHECK (status IN ('draft', 'configured', 'deployed')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id and workspace_id for efficient queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_workspace_id ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content TEXT NOT NULL,
  pal_stage TEXT,
  artifacts TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Artifacts Table
CREATE TABLE IF NOT EXISTS artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('n8n_json', 'skill_md', 'deploy_guide', 'build_prompt', 'pal_config')) NOT NULL,
  name TEXT NOT NULL,
  s3_key TEXT,
  content TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_artifacts_project_id ON artifacts(project_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_type ON artifacts(type);
CREATE INDEX IF NOT EXISTS idx_artifacts_created_at ON artifacts(created_at DESC);

-- Automation Workflows Table (for workflow-orchestrator)
CREATE TABLE IF NOT EXISTS automation_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed', 'paused')) DEFAULT 'pending',
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 12,
  inputs JSONB NOT NULL,
  artifacts JSONB DEFAULT '{}'::jsonb,
  step_results JSONB[] DEFAULT ARRAY[]::JSONB[],
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create indexes for automation workflows
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON automation_workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_workspace_id ON automation_workflows(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON automation_workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflows_created_at ON automation_workflows(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_workflows ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES FOR USERS
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES FOR WORKSPACES
-- ============================================================================

-- Users can view workspaces they own or are members of
CREATE POLICY "Users can view workspaces they own or are members of"
  ON workspaces FOR SELECT
  USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Users can insert their own workspaces
CREATE POLICY "Users can insert their own workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Workspace owners can update their workspaces
CREATE POLICY "Workspace owners can update their workspaces"
  ON workspaces FOR UPDATE
  USING (auth.uid() = owner_id);

-- Workspace owners can delete their workspaces
CREATE POLICY "Workspace owners can delete their workspaces"
  ON workspaces FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================================
-- RLS POLICIES FOR WORKSPACE MEMBERS
-- ============================================================================

-- Users can view workspace members for their workspaces
CREATE POLICY "Users can view workspace members for their workspaces"
  ON workspace_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_members.workspace_id
      AND (workspaces.owner_id = auth.uid() OR
           EXISTS (SELECT 1 FROM workspace_members wm2
                  WHERE wm2.workspace_id = workspaces.id
                  AND wm2.user_id = auth.uid()))
    )
  );

-- Workspace owners can insert members
CREATE POLICY "Workspace owners can insert members"
  ON workspace_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_members.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

-- Workspace owners can delete members
CREATE POLICY "Workspace owners can delete members"
  ON workspace_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_members.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES FOR PROJECTS
-- ============================================================================

-- Users can view projects in their workspaces
CREATE POLICY "Users can view projects in their workspaces"
  ON projects FOR SELECT
  USING (
    auth.uid()::text = user_id OR
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = projects.workspace_id
      AND (workspaces.owner_id = auth.uid() OR
           EXISTS (SELECT 1 FROM workspace_members
                  WHERE workspace_members.workspace_id = workspaces.id
                  AND workspace_members.user_id = auth.uid()))
    )
  );

-- Users can insert projects in their workspaces
CREATE POLICY "Users can insert projects in their workspaces"
  ON projects FOR INSERT
  WITH CHECK (
    auth.uid()::text = user_id AND
    (workspace_id IS NULL OR
     EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = projects.workspace_id
      AND (workspaces.owner_id = auth.uid() OR
           EXISTS (SELECT 1 FROM workspace_members
                  WHERE workspace_members.workspace_id = workspaces.id
                  AND workspace_members.user_id = auth.uid()))
    ))
  );

-- Users can update projects in their workspaces
CREATE POLICY "Users can update projects in their workspaces"
  ON projects FOR UPDATE
  USING (
    auth.uid()::text = user_id OR
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = projects.workspace_id
      AND (workspaces.owner_id = auth.uid() OR
           EXISTS (SELECT 1 FROM workspace_members
                  WHERE workspace_members.workspace_id = workspaces.id
                  AND workspace_members.user_id = auth.uid()))
    )
  );

-- Workspace owners can delete projects
CREATE POLICY "Workspace owners can delete projects"
  ON projects FOR DELETE
  USING (
    auth.uid()::text = user_id OR
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = projects.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

-- RLS Policies for Chat Messages
CREATE POLICY "Users can view chat messages for their projects"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = chat_messages.project_id
      AND projects.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert chat messages for their projects"
  ON chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = chat_messages.project_id
      AND projects.user_id = auth.uid()::text
    )
  );

-- RLS Policies for Artifacts
CREATE POLICY "Users can view artifacts for their projects"
  ON artifacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = artifacts.project_id
      AND projects.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert artifacts for their projects"
  ON artifacts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = artifacts.project_id
      AND projects.user_id = auth.uid()::text
    )
  );

-- ============================================================================
-- RLS POLICIES FOR AUTOMATION WORKFLOWS
-- ============================================================================

-- Users can view workflows in their workspaces
CREATE POLICY "Users can view workflows in their workspaces"
  ON automation_workflows FOR SELECT
  USING (
    auth.uid()::text = user_id OR
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = automation_workflows.workspace_id
      AND (workspaces.owner_id = auth.uid() OR
           EXISTS (SELECT 1 FROM workspace_members
                  WHERE workspace_members.workspace_id = workspaces.id
                  AND workspace_members.user_id = auth.uid()))
    )
  );

-- Users can insert workflows in their workspaces
CREATE POLICY "Users can insert workflows in their workspaces"
  ON automation_workflows FOR INSERT
  WITH CHECK (
    auth.uid()::text = user_id AND
    (workspace_id IS NULL OR
     EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = automation_workflows.workspace_id
      AND (workspaces.owner_id = auth.uid() OR
           EXISTS (SELECT 1 FROM workspace_members
                  WHERE workspace_members.workspace_id = workspaces.id
                  AND workspace_members.user_id = auth.uid()))
    ))
  );

-- Users can update workflows in their workspaces
CREATE POLICY "Users can update workflows in their workspaces"
  ON automation_workflows FOR UPDATE
  USING (
    auth.uid()::text = user_id OR
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = automation_workflows.workspace_id
      AND (workspaces.owner_id = auth.uid() OR
           EXISTS (SELECT 1 FROM workspace_members
                  WHERE workspace_members.workspace_id = workspaces.id
                  AND workspace_members.user_id = auth.uid()))
    )
  );

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Function to auto-create user profile and workspace on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_workspace_id UUID;
  workspace_slug TEXT;
BEGIN
  -- Create user profile
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Generate workspace slug from email
  workspace_slug := LOWER(SPLIT_PART(NEW.email, '@', 1)) || '-' || SUBSTRING(NEW.id::TEXT FROM 1 FOR 8);

  -- Create default workspace
  INSERT INTO public.workspaces (owner_id, name, slug, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)) || '''s Workspace',
    workspace_slug,
    'free'
  )
  RETURNING id INTO new_workspace_id;

  -- Add user as workspace owner
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile and workspace
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON automation_workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- LEADS & SDR ACTIVITY (Autonomous Core SDR Agent)
-- ============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT NOT NULL,
  domain TEXT,
  email TEXT NOT NULL,
  email_status TEXT DEFAULT 'verified',
  icp_score INTEGER DEFAULT 90,
  status TEXT CHECK (status IN ('ready', 'queued', 'sent', 'replied', 'bounced')) DEFAULT 'ready',
  location TEXT,
  employee_count TEXT,
  funding TEXT,
  tech_stack TEXT[] DEFAULT ARRAY[]::TEXT[],
  outreach_subject TEXT,
  outreach_body TEXT,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_workspace_id ON leads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_icp_score ON leads(icp_score DESC);

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
