/**
 * Dashboard Layout
 * Auth and onboarding checks are handled by middleware
 */
import { getSession } from '@/lib/auth-supabase';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login?redirectTo=/dashboard');
  }

  // Onboarding check is handled in middleware
  // Middleware redirects to /onboarding if not completed

  return <>{children}</>;
}
