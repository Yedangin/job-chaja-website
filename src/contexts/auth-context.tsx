'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // URL에서 accessToken 추출하여 localStorage에 저장 (소셜 로그인 OAuth 콜백 처리)
  // Extract accessToken from URL after OAuth callback and handle pending redirect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    // 백엔드가 accessToken 또는 sessionId를 반환할 수 있음
    const urlToken = params.get('accessToken') || params.get('sessionId');
    if (urlToken) {
      localStorage.setItem('accessToken', urlToken);
      window.history.replaceState({}, '', window.location.pathname);

      // 소셜 로그인 전에 저장한 pending_redirect 쿠키 확인 후 이동
      // Check pending_redirect cookie set before social login OAuth flow
      const pendingRedirectCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('pending_redirect='));
      if (pendingRedirectCookie) {
        const pendingRedirect = decodeURIComponent(pendingRedirectCookie.split('=')[1]);
        // 쿠키 즉시 삭제 / Clear cookie immediately
        document.cookie = 'pending_redirect=; path=/; max-age=0';
        router.push(pendingRedirect);
      }
    }
  }, [router]);

  const refreshAuth = useCallback(async () => {
    try {
      const accessToken = typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

      console.log('[AuthContext] refreshAuth - accessToken:', accessToken ? 'EXISTS' : 'NULL');

      if (!accessToken) {
        console.log('[AuthContext] No accessToken, setting user to null');
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log('[AuthContext] Fetching /api/auth/profile...');
      const res = await fetch('/api/auth/profile', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('[AuthContext] Response status:', res.status);

      if (!res.ok) {
        console.log('[AuthContext] Profile fetch failed, removing accessToken');
        localStorage.removeItem('accessToken');
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
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
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
      localStorage.removeItem('accessToken');
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
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      }
    } catch {
      // 로그아웃 실패 무시 / Ignore logout failure
    } finally {
      localStorage.removeItem('accessToken');
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
