import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/i18n/LanguageProvider';
import { authApi } from '../api/auth.api';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { toast } from '@/lib/toast';
import type { MemberType } from '../types/auth.types';

/**
 * 로그인 로직 및 상태 관리
 */
export function useLogin() {
  const router = useRouter();
  const { t } = useLanguage();
  const [memberType, setMemberType] = useState<MemberType>('seeker');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // react-hook-form 설정
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * 로그인 제출 핸들러
   */
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ ...data, memberType });

      if (!response.sessionId) {
        setError('서버에서 세션ID를 받지 못했습니다');
        return;
      }

      // sessionId 저장 / Store sessionId
      localStorage.setItem('sessionId', response.sessionId);

      // role에 따라 리디렉트 / Redirect based on role
      const userRole = response.user?.role;
      if (userRole === 5) {
        router.push('/admin');
      } else if (userRole === 4) {
        router.push('/company/dashboard');
      } else if (userRole === 3) {
        router.push('/worker/dashboard');
      } else {
        router.push('/');
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
  };
}
