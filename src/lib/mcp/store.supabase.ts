import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ApiKeyRecord, ApprovalRecord, Store } from "./types";

export function createSupabaseStore(client?: SupabaseClient): Store {
  const sb =
    client ??
    createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        auth: { persistSession: false },
      }
    );

  return {
    async findApiKeyByHash(hash) {
      const { data, error } = await sb
        .from("rostr_api_keys")
        .select("id, user_id, key_hash, key_prefix, name, revoked_at")
        .eq("key_hash", hash)
        .maybeSingle();
      if (error) throw error;
      return data
        ? {
            id: data.id,
            userId: data.user_id,
            keyHash: data.key_hash,
            keyPrefix: data.key_prefix,
            name: data.name,
            revokedAt: data.revoked_at,
          }
        : null;
    },

    async touchApiKey(id) {
      await sb
        .from("rostr_api_keys")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", id);
    },

    async insertApiKey(rec) {
      const { data, error } = await sb
        .from("rostr_api_keys")
        .insert({
          user_id: rec.userId,
          key_hash: rec.keyHash,
          key_prefix: rec.keyPrefix,
          name: rec.name,
        })
        .select("id, user_id, key_hash, key_prefix, name, revoked_at")
        .single();
      if (error) throw error;
      return {
        id: data.id,
        userId: data.user_id,
        keyHash: data.key_hash,
        keyPrefix: data.key_prefix,
        name: data.name,
        revokedAt: data.revoked_at,
      };
    },

    async hasEntitlement(userId, agentSlug) {
      const { data, error } = await sb
        .from("rostr_entitlements")
        .select("active")
        .eq("user_id", userId)
        .eq("agent_slug", agentSlug)
        .maybeSingle();
      if (error) throw error;
      return Boolean(data?.active);
    },

    async grantEntitlement(userId, agentSlug) {
      const { error } = await sb
        .from("rostr_entitlements")
        .upsert({ user_id: userId, agent_slug: agentSlug, active: true });
      if (error) throw error;
    },

    async createApproval(a) {
      const { data, error } = await sb
        .from("rostr_approvals")
        .insert({
          user_id: a.userId,
          agent_slug: a.agentSlug,
          tool_name: a.toolName,
          input: a.input,
          status: "pending",
        })
        .select("id, user_id, agent_slug, tool_name, input, status, created_at, decided_at")
        .single();
      if (error) throw error;
      return {
        id: data.id,
        userId: data.user_id,
        agentSlug: data.agent_slug,
        toolName: data.tool_name,
        input: data.input,
        status: data.status,
        createdAt: data.created_at,
        decidedAt: data.decided_at,
      };
    },

    async getApproval(id): Promise<ApprovalRecord | null> {
      const { data, error } = await sb
        .from("rostr_approvals")
        .select("id, user_id, agent_slug, tool_name, input, status, created_at, decided_at")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data
        ? {
            id: data.id,
            userId: data.user_id,
            agentSlug: data.agent_slug,
            toolName: data.tool_name,
            input: data.input,
            status: data.status,
            createdAt: data.created_at,
            decidedAt: data.decided_at,
          }
        : null;
    },

    async decideApproval(id, decision) {
      const { data, error } = await sb
        .from("rostr_approvals")
        .update({ status: decision, decided_at: new Date().toISOString() })
        .eq("id", id)
        .eq("status", "pending")
        .select("id, user_id, agent_slug, tool_name, input, status, created_at, decided_at")
        .maybeSingle();
      if (error) throw error;
      return data
        ? {
            id: data.id,
            userId: data.user_id,
            agentSlug: data.agent_slug,
            toolName: data.tool_name,
            input: data.input,
            status: data.status,
            createdAt: data.created_at,
            decidedAt: data.decided_at,
          }
        : null;
    },

    async markApprovalExecuted(id) {
      const { data, error } = await sb
        .from("rostr_approvals")
        .update({ status: "executed" })
        .eq("id", id)
        .eq("status", "approved")
        .select("id")
        .maybeSingle();
      if (error) throw error;
      return Boolean(data);
    },

    async logUsage(e) {
      await sb.from("rostr_usage").insert({
        user_id: e.userId,
        tool_name: e.toolName,
        ok: e.ok,
      });
    },
  };
}

