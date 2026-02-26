'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * 사용자 역할 / User role enum
 * 3=INDIVIDUAL, 4=CORPORATE, 5=ADMIN (backend role values)
 */
export type UserRole = 'INDIVIDUAL' | 'CORPORATE' | 'ADMIN' | null;

/**
 * 기업 인증 상태 / Company verification status
 */
export type VerificationStatus = 'NONE' | 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | null;

/**
 * 인증 사용자 정보 / Authenticated user info
 */
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  roleNumber: number;
  verificationStatus?: VerificationStatus;
  companyName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  role: UserRole;
  verificationStatus: VerificationStatus;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * 역할 번호 → 문자열 변환 / Convert role number to string
 */
function roleNumberToString(role: number): UserRole {
  if (role === 3) return 'INDIVIDUAL';
  if (role === 4) return 'CORPORATE';
  if (role === 5) return 'ADMIN';
  return null;
}

/**
 * 역할별 홈 경로 / Home path per role
 */
export function getRoleHomePath(role: UserRole): string {
  switch (role) {
    case 'CORPORATE': return '/company/dashboard';
    case 'INDIVIDUAL': return '/worker/dashboard';
    case 'ADMIN': return '/admin';
    default: return '/';
  }
}

/**
 * 인증 컨텍스트 Provider / Auth context provider
 * httpOnly 쿠키 기반 인증 / httpOnly cookie-based authentication
 * localStorage는 하위호환용 fallback / localStorage kept as backward-compat fallback
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 소셜 로그인 OAuth 콜백 처리: session_init 쿠키에서 sessionId 읽기
  // Handle social login OAuth callback: read sessionId from session_init cookie
  // httpOnly 쿠키는 이미 백엔드에서 설정됨 / httpOnly cookie already set by backend
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // session_init 쿠키에서 sessionId 추출 (하위호환용 localStorage 저장)
    // Extract sessionId from session_init cookie (store in localStorage for backward compat)
    const sessionInitCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('session_init='));

    if (sessionInitCookie) {
      const cookieSessionId = decodeURIComponent(sessionInitCookie.split('=')[1]);
      if (cookieSessionId) {
        // 하위호환: 직접 fetch 사용하는 페이지들을 위해 localStorage에도 저장
        // Backward compat: store in localStorage for pages using direct fetch
        localStorage.setItem('sessionId', cookieSessionId);
      }
      // 쿠키 즉시 삭제 (1회성) / Clear cookie immediately (one-time use)
      document.cookie = 'session_init=; path=/; max-age=0';

      // 소셜 로그인 전에 저장한 pending_redirect 쿠키 확인 후 이동
      // Check pending_redirect cookie set before social login OAuth flow
      const pendingRedirectCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('pending_redirect='));
      if (pendingRedirectCookie) {
        const pendingRedirect = decodeURIComponent(pendingRedirectCookie.split('=')[1]);
        document.cookie = 'pending_redirect=; path=/; max-age=0';
        // 상대 경로만 허용 (open redirect 방지) / Only allow relative paths (prevent open redirect)
        if (pendingRedirect.startsWith('/') && !pendingRedirect.startsWith('//')) {
          router.push(pendingRedirect);
        } else {
          router.push('/');
        }
      }
    }
  }, [router]);

  const refreshAuth = useCallback(async () => {
    try {
      // httpOnly 쿠키 기반: localStorage 체크 없이 항상 프로필 API 호출
      // httpOnly cookie-based: always call profile API (cookie auto-sent)
      const res = await fetch('/api/auth/profile', {
        credentials: 'include',
      });

      if (!res.ok) {
        // 인증 실패 시 localStorage도 정리 / Clean up localStorage on auth failure
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sessionId');
        }
        setUser(null);
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      const roleStr = roleNumberToString(data.user?.role);

      let verificationStatus: VerificationStatus = 'NONE';

      // 기업회원인 경우 인증 상태 조회 / Check verification status for corporate users
      if (roleStr === 'CORPORATE') {
        try {
          const verifyRes = await fetch('/api/auth/corporate-verify', {
            credentials: 'include',
          });
          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            verificationStatus = verifyData.verificationStatus || verifyData.status || 'NONE';
          }
        } catch {
          // 인증 상태 조회 실패 시 NONE 유지 / Keep NONE on failure
        }
      }

      setUser({
        id: data.user?.id || '',
        email: data.user?.email || '',
        fullName: data.user?.fullName || '',
        role: roleStr,
        roleNumber: data.user?.role || 0,
        verificationStatus,
        companyName: data.user?.companyName || data.user?.fullName || '',
      });
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sessionId');
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    try {
      // httpOnly 쿠키 기반 로그아웃: credentials: 'include'로 쿠키 자동 전송
      // httpOnly cookie-based logout: auto-send cookie via credentials: 'include'
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // 로그아웃 실패 무시 / Ignore logout failure
    } finally {
      // 하위호환: localStorage도 정리 / Backward compat: clean up localStorage too
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sessionId');
      }
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        role: user?.role || null,
        verificationStatus: user?.verificationStatus || null,
        refreshAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 인증 컨텍스트 훅 / Auth context hook
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
