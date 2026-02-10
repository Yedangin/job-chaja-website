import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useForgotPassword } from '../hooks/use-forgot-password';
import type { ViewType } from '../types/auth.types';

interface ForgotPasswordFormProps {
  onSwitchView: (view: ViewType) => void;
}

/**
 * 비밀번호 찾기 폼
 */
export function ForgotPasswordForm({ onSwitchView }: ForgotPasswordFormProps) {
  const { t } = useLanguage();
  const { form, isLoading, isSuccess, onSubmit } = useForgotPassword();

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-lg">
        <button
          onClick={() => onSwitchView('login')}
          className="mb-8 text-slate-400 hover:text-slate-800 flex items-center gap-1 text-sm font-medium"
        >
          {t('backLogin')}
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            🔐
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('findPw')}</h1>
          <p
            className="text-slate-500 text-sm px-8"
            dangerouslySetInnerHTML={{ __html: t('findPwSub') }}
          />
        </div>

        {!isSuccess ? (
          <form onSubmit={onSubmit} className="space-y-4 w-full">
            <div>
              <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">
                {t('labelEmail')}
              </label>
              <input
                type="email"
                placeholder={t('labelEmail')}
                {...form.register('email')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500 mt-1 ml-1">
                  {t(form.formState.errors.email.message as string)}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              {isLoading ? t('sending') : t('btnSendLink')}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-medium">✓ {t('resetLinkSent')}</p>
            <Button
              onClick={() => onSwitchView('login')}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
            >
              {t('backLogin')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
