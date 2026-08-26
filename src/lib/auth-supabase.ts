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

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('full_name, plan, onboarding_completed')
    .eq('id', user.id)
    .single();

  // Fetch default workspace (first workspace owned by user)
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id, name')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  return {
    id: user.id,
    email: user.email!,
    name: profile?.full_name || user.email!.split('@')[0],
    plan: profile?.plan || 'free',
    workspaceId: workspace?.id || '',
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
