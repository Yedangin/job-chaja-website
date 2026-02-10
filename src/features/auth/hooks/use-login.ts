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
      const response = await authApi.login(data);

      // sessionId 저장
      localStorage.setItem('sessionId', response.sessionId);

      // 성공 메시지 (기존 코드에서는 console.log만 있었음)
      console.log('Login successful:', response);

      // 홈으로 리다이렉트
      router.push('/');
    } catch (err: any) {
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
