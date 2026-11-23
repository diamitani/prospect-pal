import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";

/**
 * Service-role client when configured (queries MUST be owner-scoped by the
 * caller), otherwise the cookie-bound user client (RLS applies).
 */
export async function getDb(): Promise<SupabaseClient | null> {
  const admin = createAdminClient();
  if (admin) return admin;
  try {
    return (await createClient()) as unknown as SupabaseClient;
  } catch {
    return null;
  }
}
