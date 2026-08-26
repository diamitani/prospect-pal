import { getSession } from '@/lib/auth';
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

  // Check onboarding status (implement this in auth library later)
  // const onboardingCompleted = await checkOnboardingStatus(session.id);
  // if (!onboardingCompleted) {
  //   redirect('/onboarding');
  // }

  return <>{children}</>;
}
