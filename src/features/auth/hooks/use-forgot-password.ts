import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/i18n/LanguageProvider';
import { emailSchema, type EmailFormData } from '../schemas/auth.schema';
import { toast } from '@/lib/toast';

/**
 * 비밀번호 찾기 로직
 */
export function useForgotPassword() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // react-hook-form 설정
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  /**
   * 비밀번호 초기화 요청
   */
  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // TODO: 백엔드 API 구현 후 연결
      // await authApi.requestPasswordReset(data.email);

      // 임시: 성공 메시지
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      toast.success('비밀번호 초기화 링크가 이메일로 전송되었습니다.');
    } catch (err: any) {
      const message = err.message || '비밀번호 초기화 요청에 실패했습니다.';
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
    isSuccess,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
