import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { Review } from '../types/auth.types';

interface AuthLayoutProps {
  children: React.ReactNode;
  isSignupView?: boolean;
}

/**
 * 인증 페이지 레이아웃 (좌우 분할)
 * 좌측: 브랜드 정보 + 리뷰 캐러셀
 * 우측: 로그인/회원가입 폼
 */
export function AuthLayout({ children, isSignupView = false }: AuthLayoutProps) {
  const { t } = useLanguage();
  const [reviewIndex, setReviewIndex] = useState(0);

  const reviews: Review[] = [
    {
      text: t('review1Text'),
      author: t('review1Author'),
      initial: 'K',
      color: 'bg-green-500',
    },
    {
      text: t('review3Text'),
      author: t('review3Author'),
      initial: 'P',
      color: 'bg-blue-500',
    },
    {
      text: t('review2Text'),
      author: t('review2Author'),
      initial: 'S',
      color: 'bg-purple-500',
    },
  ];

  // 리뷰 자동 전환 (4초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 font-sans relative">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[750px] relative transition-all duration-500">
        {/* --- LEFT SIDE --- */}
        <div
          className={`hidden md:flex md:w-1/2 relative flex-col justify-between p-12 text-white overflow-hidden transition-colors duration-700 ${
            isSignupView ? 'bg-sky-900' : 'bg-slate-900'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-lg">
                ✈
              </div>
              <span className="text-xl font-bold tracking-tight">{t('brand')}</span>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <h2
              className="text-4xl font-bold leading-tight"
              dangerouslySetInnerHTML={{
                __html: isSignupView ? t('signupSlogan') : t('slogan'),
              }}
            />
            <p
              className="text-slate-300 font-light text-lg leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: isSignupView ? t('signupSub') : t('subSlogan'),
              }}
            />

            {/* 리뷰 캐러셀 */}
            <div className="mt-8 bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10 flex items-center gap-4 h-[100px]">
              <div
                className={`w-10 h-10 rounded-full ${reviews[reviewIndex].color} flex items-center justify-center font-bold text-white text-sm shrink-0 transition-transform duration-500`}
              >
                {reviews[reviewIndex].initial}
              </div>
              <div className="flex flex-col overflow-hidden">
                <p
                  key={`text-${reviewIndex}`}
                  className="text-sm font-medium text-white italic animate-in fade-in duration-500 line-clamp-2"
                >
                  "{reviews[reviewIndex].text}"
                </p>
                <span
                  key={`author-${reviewIndex}`}
                  className="text-xs text-slate-300 mt-1 animate-in fade-in duration-500"
                >
                  – {reviews[reviewIndex].author}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE --- */}
        {children}
      </div>
    </div>
  );
}
