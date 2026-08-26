-- Prospect PAL Database Schema for Supabase
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icp_config JSONB DEFAULT '{}'::jsonb,
  tool_stack JSONB DEFAULT '{}'::jsonb,
  pal_output JSONB,
  status TEXT CHECK (status IN ('draft', 'configured', 'deployed')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for efficient queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
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
CREATE INDEX IF NOT EXISTS idx_workflows_status ON automation_workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflows_created_at ON automation_workflows(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_workflows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Projects
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid()::text = user_id);

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

-- RLS Policies for Automation Workflows
CREATE POLICY "Users can view their own workflows"
  ON automation_workflows FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own workflows"
  ON automation_workflows FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own workflows"
  ON automation_workflows FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON automation_workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
