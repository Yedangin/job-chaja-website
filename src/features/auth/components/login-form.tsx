import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useLogin } from '../hooks/use-login';
import { MemberTypeTabs } from './member-type-tabs';
import { SocialLoginButtons } from './social-login-buttons';
import type { ViewType } from '../types/auth.types';

interface LoginFormProps {
  onSwitchView: (view: ViewType) => void;
}

/**
 * 로그인 폼 UI
 */
export function LoginForm({ onSwitchView }: LoginFormProps) {
  const { t } = useLanguage();
  const { form, isLoading, error, onSubmit, memberType, setMemberType } = useLogin();

  const { register, formState: { errors } } = form;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          {t('welcome')}
        </h1>
        <p className="text-slate-500 text-sm">{t('welcomeSub')}</p>
      </div>

      <MemberTypeTabs value={memberType} onChange={setMemberType} />

      <form onSubmit={onSubmit} className="space-y-3 mb-4">
        <input
          type="email"
          placeholder={t('labelEmail')}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-500 ml-1">
            {t(errors.email.message as string)}
          </p>
        )}

        <input
          type="password"
          placeholder={t('pwPh')}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-red-500 ml-1">
            {errors.password.message}
          </p>
        )}

        {error && (
          <p className="text-xs text-red-500 text-center pt-1">{error}</p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg disabled:bg-slate-400"
        >
          {isLoading ? t('loginLoading') : t('btnLogin')}
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
        <button
          type="button"
          onClick={() => onSwitchView('forgot-password')}
          className="hover:text-slate-800"
        >
          {t('forgotPw')}
        </button>
        {memberType === 'seeker' ? (
          <button
            type="button"
            onClick={() => onSwitchView('signup')}
            className="text-sky-600 font-bold hover:text-sky-700"
          >
            {t('signupLink')}
          </button>
        ) : (
          <Link
            href="/register"
            className="text-sky-600 font-bold hover:text-sky-700"
          >
            {t('tabCompany').replace('🏢 ', '')} 가입
          </Link>
        )}
      </div>

      <div className="relative py-4 mb-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-400">{t('orSocial')}</span>
        </div>
      </div>

      <SocialLoginButtons />
    </div>
  );
}
