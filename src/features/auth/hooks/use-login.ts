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
      console.log('[Login] === 로그인 시도 ===', { email: data.email, memberType });
      const response = await authApi.login({ ...data, memberType });
      console.log('[Login] API 응답:', JSON.stringify(response, null, 2));

      if (!response.sessionId) {
        console.error('[Login] FAIL: sessionId가 응답에 없음');
        setError('서버에서 세션ID를 받지 못했습니다');
        return;
      }

      // sessionId 저장
      localStorage.setItem('sessionId', response.sessionId);
      console.log('[Login] sessionId 저장 완료:', response.sessionId.substring(0, 30) + '...');

      // 저장 확인
      const saved = localStorage.getItem('sessionId');
      console.log('[Login] localStorage 확인:', saved ? saved.substring(0, 30) + '...' : 'EMPTY');

      // role에 따라 리디렉트
      const userRole = response.user?.role;
      console.log('[Login] user role:', userRole);

      if (userRole === 5) {
        console.log('[Login] ADMIN 감지 → /admin 이동');
        router.push('/admin');
      } else {
        console.log('[Login] 일반 사용자 → / 이동');
        router.push('/');
      }
    } catch (err: any) {
      console.error('[Login] ERROR:', err);
      const message = err.message || t('loginFail');
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
