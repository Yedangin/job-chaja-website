import { useState } from 'react';
import LanguageSwitcher from '@/components/language-switcher';
import { useLanguage } from '@/i18n/LanguageProvider';
import { AuthLayout } from './auth-layout';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';
import { ForgotPasswordForm } from './forgot-password-form';
import type { ViewType } from '../types/auth.types';

/**
 * 로그인 뷰 컨테이너
 * login / signup / forgot-password 뷰 전환 관리
 */
export function LoginView() {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<ViewType>('login');

  return (
    <AuthLayout isSignupView={currentView === 'signup'}>
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
        {/* 언어 스위처 */}
        <div className="absolute top-6 right-6 z-20">
          <LanguageSwitcher />
        </div>

        {/* 뷰 전환 */}
        {currentView === 'login' && <LoginForm onSwitchView={setCurrentView} />}
        {currentView === 'signup' && <SignupForm onSwitchView={setCurrentView} />}
        {currentView === 'forgot-password' && (
          <ForgotPasswordForm onSwitchView={setCurrentView} />
        )}

        {/* Footer: 로그인 뷰에만 표시 */}
        {currentView === 'login' && (
          <div className="mt-8 text-center text-[10px] text-slate-400 leading-relaxed">
            {t('termLoginPrefix')}{' '}
            <span className="underline cursor-pointer">{t('termService')}</span>{' '}
            {t('termAnd')}{' '}
            <span className="underline cursor-pointer">{t('termPrivacy')}</span>
            {t('termSuffix')}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
