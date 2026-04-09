'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PremiumVerifyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/visa-planner/profile');
  }, [router]);

  return null;
}
