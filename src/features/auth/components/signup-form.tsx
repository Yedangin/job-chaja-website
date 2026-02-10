import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useSignup } from '../hooks/use-signup';
import { useEmailVerification } from '../hooks/use-email-verification';
import { EmailVerification } from './email-verification';
import { TermsAgreementComponent } from './terms-agreement';
import { TermsModal } from './terms-modal';
import type { ViewType } from '../types/auth.types';

interface SignupFormProps {
  onSwitchView: (view: ViewType) => void;
}

export function SignupForm({ onSwitchView }: SignupFormProps) {
  const { t } = useLanguage();
  const {
    form,
    isLoading,
    error,
    terms,
    isAllRequiredChecked,
    isAllChecked,
    handleTermChange,
    handleAllTermsChange,
    onSubmit,
  } = useSignup();

  const emailVerification = useEmailVerification();
  const [activeModalTerm, setActiveModalTerm] = useState<string | null>(null);

  // form 객체에서 필요한 함수들 추출
  const { register, formState: { errors }, watch, setValue, clearErrors, setError } = form;

  // 실시간 값 감시
  const password = watch('password');
  const passwordConfirm = watch('passwordConfirm');
  const email = watch('email');

  // 비밀번호 일치 여부 실시간 검증
  useEffect(() => {
    if (passwordConfirm && password) {
      if (passwordConfirm !== password) {
        setError('passwordConfirm', {
          type: 'manual',
          message: 'errPwMatch'
        });
      } else {
        clearErrors('passwordConfirm');
      }
    }
  }, [password, passwordConfirm, setError, clearErrors]);

  return (
    <>
      <TermsModal activeTerm={activeModalTerm} onClose={() => setActiveModalTerm(null)} />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full overflow-y-auto">
        <button
          type="button"
          onClick={() => onSwitchView('login')}
          className="mb-4 text-slate-400 hover:text-slate-800 flex items-center gap-1 text-sm font-medium w-fit"
        >
          {t('backLogin')}
        </button>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          {t('createAccount')}
        </h1>
        <p className="text-slate-500 text-sm mb-6">{t('createSub')}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit((data) =>
              onSubmit(data, emailVerification.isAuthVerified)
            )();
          }}
          className="space-y-4"
        >
          {/* 1. Basic Info Section */}
          <div className="space-y-3">
            {/* Name */}
            <div>
              <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">
                {t('labelName')}
              </label>
              <input
                type="text"
                placeholder="Full Name (Passport Name)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm"
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 ml-1 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email & Auth */}
            <div>
              <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">
                {t('labelEmail')}
              </label>
              <EmailVerification
                email={email || ''}
                authCode={emailVerification.authCode}
                onEmailChange={(value) => {
                  // 입력 시에는 검증을 끄고(shouldValidate: false), 기존 에러를 지웁니다.
                  setValue('email', value, { shouldValidate: false, shouldDirty: true });
                  if (errors.email) clearErrors('email');
                }}
                onAuthCodeChange={emailVerification.setAuthCode}
                onSendOtp={(email) => emailVerification.sendOtp(email)}
                onVerifyOtp={(email, code) => emailVerification.verifyOtp(email, code)}
                isAuthSent={emailVerification.isAuthSent}
                isAuthVerified={emailVerification.isAuthVerified}
                isSending={emailVerification.isSending}
                isVerifying={emailVerification.isVerifying}
                timeLeft={emailVerification.timeLeft}
                formatTime={emailVerification.formatTime}
              />
              {/* React Hook Form 에러 메시지 */}
              {errors.email && (
                <p className="text-xs text-red-500 ml-1 mt-1">
                  {t(errors.email.message as any)}
                </p>
              )}
            </div>

            {/* Password & Confirmation */}
            <div>
              <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">
                {t('labelPw')}
              </label>
              <input
                type="password"
                placeholder={t('pwRulePh')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm mb-2"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-500 ml-1 mt-1">
                  {t(errors.password.message as any)}
                </p>
              )}

              <input
                type="password"
                placeholder={t('pwConfirmPh')}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm ${
                  errors.passwordConfirm
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-slate-200 focus:border-sky-500'
                }`}
                {...register('passwordConfirm')}
              />

              {/* register의 validate에서 자동으로 검증된 에러 메시지 */}
              {errors.passwordConfirm && (
                <p className="text-xs text-red-500 ml-1 mt-1">
                  {t(errors.passwordConfirm.message as any)}
                </p>
              )}
            </div>
          </div>

          {/* 2. Terms Agreement Section */}
          <div className="pt-4 border-t border-slate-100">
            <TermsAgreementComponent
              terms={terms}
              onTermChange={handleTermChange}
              onAllTermsChange={handleAllTermsChange}
              onViewTerm={setActiveModalTerm}
              isAllChecked={isAllChecked}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center pt-1">{error}</p>
          )}

          {/* Complete Registration Button */}
          <Button
            type="submit"
            disabled={
              isLoading ||
              !emailVerification.isAuthVerified ||
              !isAllRequiredChecked ||
              password !== passwordConfirm
            }
            className="w-full h-12 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl mt-4 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isLoading ? t('registerLoading') : t('btnComplete')}
          </Button>
        </form>
      </div>
    </>
  );
}