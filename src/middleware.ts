/**
 * Next.js Middleware
 * Protects routes and refreshes Supabase sessions
 */
import { updateSession } from '@/lib/supabase-middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Update session cookies
  const response = await updateSession(request);

  // Protected routes: /dashboard and /onboarding
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set() {}, // Not needed in middleware check
          remove() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check onboarding for dashboard routes
    if (pathname.startsWith('/dashboard')) {
      const { data: profile } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (!profile?.onboarding_completed) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*'],
};
