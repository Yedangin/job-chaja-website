import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageProvider';
import { authApi } from '../api/auth.api';

interface SocialLoginButtonsProps {
  memberType?: string;
  /** 로그인 성공 후 돌아갈 경로 / Path to return to after login */
  redirectTo?: string;
}

/**
 * 소셜 로그인 버튼 (카카오, 구글)
 */
export function SocialLoginButtons({ memberType, redirectTo }: SocialLoginButtonsProps) {
  const { t } = useLanguage();
  const userType = memberType === 'company' ? 'CORPORATE' : 'INDIVIDUAL';

  const handleSocialLogin = (url: string) => {
    // OAuth 콜백(localhost:8000)에서 읽을 수 있도록 쿠키를 먼저 설정
    // Set cookies before OAuth redirect so callback can read them
    document.cookie = `pending_user_type=${userType}; path=/; max-age=300; SameSite=Lax`;
    // OAuth 완료 후 돌아갈 경로 저장 / Save return path for after OAuth completes
    if (redirectTo) {
      document.cookie = `pending_redirect=${encodeURIComponent(redirectTo)}; path=/; max-age=300; SameSite=Lax`;
    }
    window.location.href = url;
  };

  return (
    <div className="space-y-3">
      {/* 카카오 로그인 */}
      <Button
        type="button"
        className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] font-bold rounded-xl shadow-md"
        onClick={() => handleSocialLogin(authApi.getKakaoLoginUrl(userType))}
      >
        <svg
          className="w-5 h-5 mr-2"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.78 1.847 5.224 4.604 6.621-.195.72-.734 2.785-.85 3.217 0 0-.042.343.186.472.229.129.5.015.5.015.65-.09 3.757-2.45 4.352-2.85.396.055.802.085 1.208.085 5.523 0 10-3.477 10-7.75S17.523 3 12 3z" />
        </svg>
        {t('kakaoBtn')}
      </Button>

      {/* 구글 로그인 */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-md border border-slate-200"
        onClick={() => handleSocialLogin(authApi.getGoogleLoginUrl(userType))}
      >
        <svg
          className="w-5 h-5 mr-2"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {t('googleBtn')}
      </Button>
    </div>
  );
}
