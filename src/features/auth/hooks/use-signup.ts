import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/i18n/LanguageProvider';
import { authApi } from '../api/auth.api';
import { signupSchema, type SignupFormData } from '../schemas/auth.schema';
import { toast } from '@/lib/toast';
import type { TermsAgreement, MemberType } from '../types/auth.types';
import { CURRENT_POLICY_VERSION } from '@/lib/legal';
import { getPostAuthRoute } from '../lib/post-auth-route';

/**
 * 회원가입 로직 및 상태 관리
 */
export function useSignup(memberType: MemberType = 'seeker') {
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
    term5: false,
  });

  // react-hook-form 설정
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange', // 타자 칠 때마다 실시간 검증
    defaultValues: {
      fullName: '',
      birthDate: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  // 약관 체크 관련
  const isAllRequiredChecked = terms.term1 && terms.term2 && terms.term3 && terms.term5;
  const isAllChecked = isAllRequiredChecked;

  const handleTermChange = (key: keyof TermsAgreement) => {
    setTerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAllTermsChange = (checked: boolean) => {
    setTerms({
      term1: checked,
      term2: checked,
      term3: checked,
      term4: false,
      term5: checked,
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
        birthDate: data.birthDate,
        role: memberType === 'company' ? 'CORPORATE' : 'INDIVIDUAL',
        termsConsent: true,
        privacyConsent: true,
        internationalTransferConsent: true,
        marketingConsent: terms.term4,
        ageConfirmed: true,
        policyVersion: CURRENT_POLICY_VERSION,
        consentChannel: 'WEB_SIGNUP',
      });

      toast.success(t('registerSuccess'));

      const params = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search);
      const returnTo = getPostAuthRoute({
        explicitPath: params?.get('returnTo') || params?.get('redirect'),
        memberType,
        isNewAccount: true,
      });
      setTimeout(() => {
        router.push(returnTo);
      }, 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('registerFail');
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
