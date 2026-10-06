/**
 * Storage Client & Operations
 * Powered by Supabase Storage (Zero AWS dependencies)
 * Stores large artifacts (n8n JSON, skill files, deploy guides)
 */

import { supabase } from "./supabase";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "prospect-pal-artifacts";

// In-memory fallback cache if Supabase storage is unconfigured
const memoryStorage = new Map<string, string>();

export async function uploadArtifact(
  projectId: string,
  artifactType: string,
  filename: string,
  content: string,
  contentType = "application/json"
): Promise<string> {
  const key = `projects/${projectId}/${artifactType}/${filename}`;

  try {
    const client = supabase.client;
    if (client) {
      const { error } = await client.storage
        .from(BUCKET)
        .upload(key, content, {
          contentType,
          upsert: true,
        });

      if (!error) return key;
    }
  } catch (err) {
    console.warn("[Storage] Supabase storage upload fallback to local memory:", err);
  }

  memoryStorage.set(key, content);
  return key;
}

export async function getArtifactUrl(key: string, _expiresIn = 3600): Promise<string> {
  try {
    const client = supabase.client;
    if (client) {
      const { data } = client.storage.from(BUCKET).getPublicUrl(key);
      if (data?.publicUrl) return data.publicUrl;
    }
  } catch {
    // fallback
  }

  return `/api/artifacts?key=${encodeURIComponent(key)}`;
}

export async function getArtifactContent(key: string): Promise<string> {
  try {
    const client = supabase.client;
    if (client) {
      const { data, error } = await client.storage.from(BUCKET).download(key);
      if (!error && data) {
        return await data.text();
      }
    }
  } catch (err) {
    console.warn("[Storage] Download failed, checking memory store:", err);
  }

  return memoryStorage.get(key) || "";
}

export async function listProjectArtifacts(projectId: string): Promise<string[]> {
  try {
    const client = supabase.client;
    if (client) {
      const { data, error } = await client.storage
        .from(BUCKET)
        .list(`projects/${projectId}`);

      if (!error && data) {
        return data.map((item: any) => `projects/${projectId}/${item.name}`);
      }
    }
  } catch {
    // fallback
  }

  const prefix = `projects/${projectId}/`;
  return Array.from(memoryStorage.keys()).filter((k) => k.startsWith(prefix));
}
