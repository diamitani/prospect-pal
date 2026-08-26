/**
 * Supabase Client & Database Operations
 * Replaces DynamoDB with Supabase PostgreSQL
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables not configured');
  }

  _supabase = createClient(supabaseUrl, supabaseKey);
  return _supabase;
}

export const supabase = { get client() { return getSupabase(); } };

// ===========================================================================
// PROJECT OPERATIONS
// ===========================================================================

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  icp_config: Record<string, unknown>;
  tool_stack: Record<string, unknown>;
  pal_output?: Record<string, unknown>;
  status: 'draft' | 'configured' | 'deployed';
  created_at: string;
  updated_at: string;
}

export async function createProject(
  userId: string,
  name: string,
  description?: string,
  icpConfig?: Record<string, unknown>,
  toolStack?: Record<string, unknown>
): Promise<Project> {
  const project = {
    id: uuidv4(),
    user_id: userId,
    name,
    description,
    icp_config: icpConfig || {},
    tool_stack: toolStack || {},
    status: 'draft' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.client
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw new Error(`Failed to create project: ${error.message}`);
  return data as Project;
}

export async function getProjectsByUser(userId: string): Promise<Project[]> {
  const { data, error } = await supabase.client
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
  return (data as Project[]) || [];
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase.client
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch project: ${error.message}`);
  }
  return data as Project | null;
}

export async function updateProject(
  id: string,
  updates: Partial<Omit<Project, 'id' | 'created_at'>>
): Promise<void> {
  const { error } = await supabase.client
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(`Failed to update project: ${error.message}`);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.client
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete project: ${error.message}`);
}

// ===========================================================================
// CHAT SESSION OPERATIONS
// ===========================================================================

export interface ChatMessage {
  id: string;
  project_id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  pal_stage?: string;
  artifacts?: string[];
  created_at: string;
}

export async function saveChatMessage(
  projectId: string,
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  palStage?: string
): Promise<ChatMessage> {
  const message = {
    id: uuidv4(),
    project_id: projectId,
    session_id: sessionId,
    role,
    content,
    pal_stage: palStage,
    artifacts: [],
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.client
    .from('chat_messages')
    .insert(message)
    .select()
    .single();

  if (error) throw new Error(`Failed to save chat message: ${error.message}`);
  return data as ChatMessage;
}

export async function getChatHistory(
  projectId: string,
  sessionId: string
): Promise<ChatMessage[]> {
  const { data, error } = await supabase.client
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch chat history: ${error.message}`);
  return (data as ChatMessage[]) || [];
}

// ===========================================================================
// ARTIFACT OPERATIONS
// ===========================================================================

export interface Artifact {
  id: string;
  project_id: string;
  type: 'n8n_json' | 'skill_md' | 'deploy_guide' | 'build_prompt' | 'pal_config';
  name: string;
  s3_key?: string;
  content?: string;
  version: number;
  created_at: string;
}

export async function saveArtifact(
  projectId: string,
  type: Artifact['type'],
  name: string,
  content: string,
  s3Key?: string
): Promise<Artifact> {
  const artifact = {
    id: uuidv4(),
    project_id: projectId,
    type,
    name,
    content,
    s3_key: s3Key,
    version: 1,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.client
    .from('artifacts')
    .insert(artifact)
    .select()
    .single();

  if (error) throw new Error(`Failed to save artifact: ${error.message}`);
  return data as Artifact;
}

export async function getArtifactsByProject(projectId: string): Promise<Artifact[]> {
  const { data, error } = await supabase.client
    .from('artifacts')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch artifacts: ${error.message}`);
  return (data as Artifact[]) || [];
}

export async function getArtifact(id: string): Promise<Artifact | null> {
  const { data, error } = await supabase.client
    .from('artifacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch artifact: ${error.message}`);
  }
  return data as Artifact | null;
}
