'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

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
  /** 로그인 직후 호출 — 로그인 응답 데이터로 즉시 상태 업데이트 (refreshAuth 경쟁 조건 방지) */
  loginWithUser: (data: { id: string; email: string; fullName?: string; role: number }) => void;
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
    case 'ADMIN': return '/admin';
    case 'CORPORATE': return '/';
    case 'INDIVIDUAL': return '/';
    default: return '/';
  }
}

/**
 * 인증 컨텍스트 Provider / Auth context provider
 * httpOnly 쿠키 기반 인증 / httpOnly cookie-based authentication
 * localStorage는 더 이상 사용하지 않음 / localStorage is NO LONGER used for auth
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 중복 호출 방지용 ref / Ref to prevent duplicate concurrent calls
  const isRefreshingRef = useRef(false);
  // 초기 마운트 여부 추적 / Track initial mount
  const hasMountedRef = useRef(false);

  // 소셜 로그인 OAuth 콜백 처리: session_init 쿠키 정리
  // Handle social login OAuth callback: clean up session_init cookie
  // httpOnly 쿠키는 이미 백엔드에서 설정됨 / httpOnly cookie already set by backend
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // session_init 쿠키 확인 (소셜 로그인 후 리다이렉트 처리용)
    // Check session_init cookie (for post-social-login redirect handling)
    const sessionInitCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('session_init='));

    if (sessionInitCookie) {
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

  // refreshAuth: httpOnly 쿠키만으로 인증 상태 확인 / Check auth state using httpOnly cookie only
  // useRef로 동시 호출 방지 / Prevent concurrent calls with useRef
  const refreshAuth = useCallback(async () => {
    // 동시 호출 방지: 이미 실행 중이면 스킵 (단, loginWithUser로 먼저 상태 업데이트 후 백그라운드 호출 시는 문제없음)
    // Prevent concurrent calls: skip if already running
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;

    // 429 재시도 시 isLoading을 false로 바꾸지 않기 위한 플래그
    // Flag to prevent setting isLoading=false during 429 retry (keeps showing loading UI)
    let shouldKeepLoading = false;

    try {
      // 캐시 버스팅: 타임스탬프 쿼리로 브라우저/프록시 캐시 완전 방지
      // Cache busting: timestamp query prevents browser/proxy from serving stale 401/200 responses
      const response = await apiClient.get(`/auth/profile?_t=${Date.now()}`, {
        _suppressAuthRedirect: true,
        validateStatus: () => true,
        headers: { 'Cache-Control': 'no-cache, no-store' },
      } as Record<string, unknown>);

      // 200: 인증 성공 → 사용자 정보 설정 / 200: Auth success → set user info
      if (response.status === 200 && response.data?.user) {
        const roleStr = roleNumberToString(response.data.user.role);

        let verificationStatus: VerificationStatus = 'NONE';

        // 기업회원인 경우 인증 상태 조회 / Check verification status for corporate users
        if (roleStr === 'CORPORATE') {
          try {
            const { data: verifyData } = await apiClient.get(`/auth/corporate-verify?_t=${Date.now()}`, {
              _suppressAuthRedirect: true,
              validateStatus: () => true,
              headers: { 'Cache-Control': 'no-cache, no-store' },
            } as Record<string, unknown>);
            if (verifyData?.verificationStatus || verifyData?.status) {
              verificationStatus = verifyData.verificationStatus || verifyData.status || 'NONE';
            }
          } catch {
            // 인증 상태 조회 실패 시 NONE 유지 / Keep NONE on failure
          }
        }

        setUser({
          id: response.data.user.id || '',
          email: response.data.user.email || '',
          fullName: response.data.user.fullName || '',
          role: roleStr,
          roleNumber: response.data.user.role || 0,
          verificationStatus,
          companyName: response.data.user.companyName || response.data.user.fullName || '',
        });
      } else if (response.status === 401) {
        // 401: httpOnly 쿠키가 없거나 만료됨 → 비로그인 상태
        // 401: httpOnly cookie missing or expired → not logged in
        setUser(null);
      } else if (response.status === 429) {
        // 429: rate limit — 로딩 상태 유지 + 2초 후 재시도
        // 429: rate limited — keep loading state + retry after 2 seconds
        // 이전: 초기 로드에서 429 시 user=null + isLoading=false → 로그인 버튼 표시 (잘못됨)
        // Before: on initial load 429 → user=null + isLoading=false → showed login button (wrong)
        shouldKeepLoading = true;
        setTimeout(() => {
          refreshAuth();
        }, 2000);
      }
      // 500(서버 에러) 등: 현재 상태 유지 (로그아웃하지 않음)
      // 500 (server error), etc.: keep current state (don't logout)
    } catch {
      // 네트워크 에러만 여기 도달 (서버 연결 불가 등)
      // Only network errors reach here (server unreachable, etc.)
      setUser((prev) => prev);
    } finally {
      if (!shouldKeepLoading) {
        setIsLoading(false);
      }
      isRefreshingRef.current = false;
    }
  }, []);

  // 마운트 시 1회만 호출 / Call only once on mount
  // useCallback([]) 의존성이 비어있으므로 refreshAuth는 절대 변경되지 않음
  // useCallback([]) empty deps means refreshAuth NEVER changes
  useEffect(() => {
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;
    refreshAuth();
  }, [refreshAuth]);

  const loginWithUser = useCallback((data: { id: string; email: string; fullName?: string; role: number }) => {
    const roleStr = roleNumberToString(data.role);
    setUser({
      id: data.id,
      email: data.email,
      fullName: data.fullName || data.email.split('@')[0] || '',
      role: roleStr,
      roleNumber: data.role,
    });
    setIsLoading(false);
  }, []);

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
        loginWithUser,
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
