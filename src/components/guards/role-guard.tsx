'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, getRoleHomePath, type UserRole } from '@/contexts/auth-context';

interface RoleGuardProps {
  /** 허용 역할 / Allowed roles */
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

/**
 * 역할 기반 라우트 가드 / Role-based route guard
 * 허용된 역할이 아니면 해당 역할의 홈으로 리다이렉트
 * Redirects to role's home if not an allowed role
 */
export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isLoading, isLoggedIn, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // 미로그인 → 로그인 페이지 / Not logged in → login page
    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }

    // 역할 불일치 → 해당 역할 홈 / Role mismatch → role home
    if (!allowedRoles.includes(role)) {
      router.replace(getRoleHomePath(role));
    }
  }, [isLoading, isLoggedIn, role, allowedRoles, router]);

  // 로딩 중 / Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // 미로그인 또는 역할 불일치 / Not logged in or wrong role
  if (!isLoggedIn || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
