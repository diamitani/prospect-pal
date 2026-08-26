/**
 * GET /api/auth/callback
 * OAuth callback handler - exchanges authorization code for session
 */
import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to error page if exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
