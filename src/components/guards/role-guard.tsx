'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const { isLoading, isLoggedIn, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 개발 환경에서는 역할 체크 건너뜀 (로그인만 확인)
  // Skip role check in development (only require login)
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (isLoading) return;

    // 미로그인 → 현재 경로를 redirect 파라미터로 전달해 로그인 페이지로 이동
    // Not logged in → go to login with current path as redirect param
    if (!isLoggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // 역할 불일치 → 해당 역할 홈 (개발 환경에서는 건너뜀)
    // Role mismatch → role home (skipped in dev)
    if (!isDev && !allowedRoles.includes(role)) {
      router.replace(getRoleHomePath(role));
    }
  }, [isLoading, isLoggedIn, role, allowedRoles, router, isDev]);

  // 로딩 중 / Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // 미로그인 → 렌더링 안 함 / Not logged in → don't render
  // 프로덕션에서는 역할 불일치도 차단 / In production, also block role mismatch
  if (!isLoggedIn || (!isDev && !allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
}
