'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SpiritualHomepage from '@/components/SpiritualHomepage';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-900">
        <div className="animate-spin h-16 w-16 border-8 border-white rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  return <SpiritualHomepage />;
}
