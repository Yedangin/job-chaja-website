import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/i18n/LanguageProvider';
import { authApi } from '../api/auth.api';
import { signupSchema, type SignupFormData } from '../schemas/auth.schema';
import { toast } from '@/lib/toast';
import type { TermsAgreement } from '../types/auth.types';

/**
 * 회원가입 로직 및 상태 관리
 */
export function useSignup() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 약관 동의 상태
  const [terms, setTerms] = useState<TermsAgreement>({
    term1: false,
    term2: false,
    term3: false,
    term4: false,
  });

  // react-hook-form 설정
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange', // 타자 칠 때마다 실시간 검증
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  // 약관 체크 관련
  const isAllRequiredChecked = terms.term1 && terms.term2 && terms.term3;
  const isAllChecked = Object.values(terms).every((v) => v);

  const handleTermChange = (key: keyof TermsAgreement) => {
    setTerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAllTermsChange = (checked: boolean) => {
    setTerms({
      term1: checked,
      term2: checked,
      term3: checked,
      term4: checked,
    });
  };

  /**
   * 회원가입 제출 핸들러
   */
  const onSubmit = async (data: SignupFormData, isAuthVerified: boolean) => {
    // 이메일 인증 확인
    if (!isAuthVerified) {
      setError(t('errAuth'));
      toast.error(t('errAuth'));
      return;
    }

    // 약관 동의 확인
    if (!isAllRequiredChecked) {
      setError(t('errTerms'));
      toast.error(t('errTerms'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authApi.register({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });

      toast.success(t('registerSuccess'));

      // 로그인 페이지로 이동 (기존 동작 유지)
      router.push('/login');
    } catch (err: any) {
      const message = err.message || t('registerFail');
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
    terms,
    isAllRequiredChecked,
    isAllChecked,
    handleTermChange,
    handleAllTermsChange,
    onSubmit,
  };
}
