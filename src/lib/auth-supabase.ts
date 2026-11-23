/**
 * Supabase Authentication Library
 * Replaces AWS Cognito with Supabase Auth
 */
import { createClient as createServerClient } from '@/lib/supabase-server';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "agency";
  workspaceId: string;
  workspaceName: string;
  onboardingCompleted: boolean;
}

/**
 * Get current session with user profile and default workspace
 * Returns null if not authenticated
 */
export async function getSession(): Promise<SessionUser | null> {
  const supabase = await createServerClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Enably-safe: unprefixed `users` / `workspaces` may be missing, have a
  // different schema, or have no row for this user. Never let that break
  // login — fall back to auth metadata + user-only scoping.
  let profile: { full_name?: string | null; plan?: SessionUser['plan'] | null; onboarding_completed?: boolean | null } | null = null;
  try {
    const { data } = await supabase
      .from('users')
      .select('full_name, plan, onboarding_completed')
      .eq('id', user.id)
      .maybeSingle();
    profile = data;
  } catch {
    profile = null;
  }

  let workspace: { id?: string | null; name?: string | null } | null = null;
  try {
    const { data } = await supabase
      .from('workspaces')
      .select('id, name')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    workspace = data;
  } catch {
    workspace = null;
  }

  const metaName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined);
  const email = user.email || '';

  return {
    id: user.id,
    email,
    name: profile?.full_name || metaName || email.split('@')[0] || 'User',
    plan: profile?.plan || 'free',
    workspaceId: workspace?.id ? String(workspace.id) : '',
    workspaceName: workspace?.name || '',
    onboardingCompleted: profile?.onboarding_completed || false,
  };
}

/**
 * Sign out current user
 */
export async function signOut() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
}
