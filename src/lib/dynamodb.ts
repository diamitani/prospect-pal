/**
 * Database Client & Operations
 * Powered by Supabase PostgreSQL (Zero AWS dependencies)
 * Tables: projects, sessions, artifacts
 */

import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

// Local in-memory store fallback when Supabase is not directly connected
const memoryProjects = new Map<string, Project>();
const memorySessions = new Map<string, Session>();
const memoryArtifacts = new Map<string, Artifact>();

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icpConfig: Record<string, unknown>;
  toolStack: Record<string, unknown>;
  palOutput?: Record<string, unknown>;
  status: "draft" | "configured" | "deployed";
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  projectId?: string;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
  }>;
  state: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Artifact {
  id: string;
  projectId: string;
  type: string;
  filename: string;
  s3Key?: string;
  content?: string;
  version: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export async function createProject(
  userId: string,
  name: string,
  description?: string,
  icpConfig: Record<string, unknown> = {},
  toolStack: Record<string, unknown> = {}
): Promise<Project> {
  const project: Project = {
    id: uuidv4(),
    userId,
    name,
    description,
    icpConfig,
    toolStack,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const client = supabase.client;
    if (client) {
      const { error } = await client.from("projects").insert({
        id: project.id,
        user_id: userId,
        name,
        description,
        icp_config: icpConfig,
        tool_stack: toolStack,
        status: project.status,
        created_at: project.createdAt,
        updated_at: project.updatedAt,
      });

      if (!error) return project;
    }
  } catch (err) {
    console.warn("[DB] Supabase insert failed, storing in memory:", err);
  }

  memoryProjects.set(project.id, project);
  return project;
}

export async function getProject(projectId: string): Promise<Project | null> {
  try {
    const client = supabase.client;
    if (client) {
      const { data, error } = await client
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          name: data.name,
          description: data.description,
          icpConfig: data.icp_config || {},
          toolStack: data.tool_stack || {},
          palOutput: data.pal_output,
          status: data.status,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    }
  } catch {
    // fallback
  }

  return memoryProjects.get(projectId) || null;
}

export async function listProjects(userId: string): Promise<Project[]> {
  try {
    const client = supabase.client;
    if (client) {
      const { data, error } = await client
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          name: d.name,
          description: d.description,
          icpConfig: d.icp_config || {},
          toolStack: d.tool_stack || {},
          palOutput: d.pal_output,
          status: d.status,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    }
  } catch {
    // fallback
  }

  return Array.from(memoryProjects.values()).filter((p) => p.userId === userId);
}

export async function updateProject(
  projectId: string,
  updates: Partial<Omit<Project, "id" | "userId" | "createdAt">>
): Promise<Project | null> {
  const existing = await getProject(projectId);
  if (!existing) return null;

  const updated: Project = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    const client = supabase.client;
    if (client) {
      await client
        .from("projects")
        .update({
          name: updated.name,
          description: updated.description,
          icp_config: updated.icpConfig,
          tool_stack: updated.toolStack,
          pal_output: updated.palOutput,
          status: updated.status,
          updated_at: updated.updatedAt,
        })
        .eq("id", projectId);
    }
  } catch {
    // fallback
  }

  memoryProjects.set(projectId, updated);
  return updated;
}

export async function createSession(
  userId: string,
  projectId?: string
): Promise<Session> {
  const session: Session = {
    id: uuidv4(),
    userId,
    projectId,
    messages: [],
    state: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memorySessions.set(session.id, session);
  return session;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  return memorySessions.get(sessionId) || null;
}

export async function saveSessionMessages(
  sessionId: string,
  messages: Session["messages"],
  state?: Record<string, unknown>
): Promise<void> {
  const session = memorySessions.get(sessionId);
  if (session) {
    session.messages = messages;
    if (state) session.state = state;
    session.updatedAt = new Date().toISOString();
  }
}

export async function saveArtifact(
  projectId: string,
  type: string,
  filename: string,
  content?: string,
  s3Key?: string,
  metadata: Record<string, unknown> = {}
): Promise<Artifact> {
  const artifact: Artifact = {
    id: uuidv4(),
    projectId,
    type,
    filename,
    content,
    s3Key,
    version: 1,
    metadata,
    createdAt: new Date().toISOString(),
  };

  memoryArtifacts.set(artifact.id, artifact);
  return artifact;
}

export async function getArtifact(artifactId: string): Promise<Artifact | null> {
  return memoryArtifacts.get(artifactId) || null;
}

export async function listArtifacts(projectId: string): Promise<Artifact[]> {
  return Array.from(memoryArtifacts.values()).filter((a) => a.projectId === projectId);
}
