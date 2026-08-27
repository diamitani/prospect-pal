/**
 * Dashboard Layout
 * Auth and onboarding checks
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

  if (!session.onboardingCompleted) {
    redirect('/onboarding');
  }

  return <>{children}</>;
}
