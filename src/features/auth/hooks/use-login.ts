import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/auth-context';
import { authApi } from '../api/auth.api';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { toast } from '@/lib/toast';
import type { MemberType } from '../types/auth.types';

/**
 * 로그인 로직 및 상태 관리 / Login logic and state management
 */
export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { refreshAuth, loginWithUser } = useAuth();
  const [memberType, setMemberType] = useState<MemberType>('seeker');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // react-hook-form 설정 / react-hook-form config
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * 로그인 제출 핸들러 / Login submit handler
   */
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ ...data, memberType });

      // 로그인 응답 데이터로 즉시 AuthContext 상태 업데이트 (refreshAuth 경쟁 조건 방지)
      // Immediately update AuthContext from login response (avoids refreshAuth race condition)
      const loginUser = response.user;
      if (loginUser) {
        loginWithUser({
          id: loginUser.id || '',
          email: loginUser.email || '',
          role: loginUser.role || 0,
        });
      }

      // 하위호환: localStorage에도 sessionId 저장 (직접 fetch 사용하는 페이지용)
      // Backward compat: store sessionId in localStorage (for pages using direct fetch)
      const token = response.sessionId ?? response.accessToken;
      if (token) {
        localStorage.setItem('sessionId', token);
      }

      // 백그라운드에서 프로필 재조회 (fullName, verificationStatus 등 완전한 정보 업데이트)
      // Background profile refresh for complete data (fullName, verificationStatus, etc.)
      refreshAuth();

      // redirect 파라미터가 있으면 해당 경로로, 없으면 role 기반 기본 경로로 이동
      // If redirect param exists, use it; otherwise fall back to role-based default
      const redirectTo = searchParams.get('redirect');
      // 상대 경로만 허용, '/'는 무시 (메인은 기본 경로) / Only allow relative paths, ignore '/' (main is default)
      if (redirectTo && redirectTo !== '/' && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
        router.push(redirectTo);
      } else {
        // 관리자만 관리자 페이지, 나머지는 메인페이지 / Admin → admin page, others → main
        const userRole = loginUser?.role;
        if (userRole === 5) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('loginFail');
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    error,
    onSubmit: form.handleSubmit(onSubmit),
    memberType,
    setMemberType,
    redirectTo: searchParams.get('redirect') ?? undefined,
  };
}
