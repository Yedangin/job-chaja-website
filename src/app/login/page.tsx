'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

type MemberType = 'seeker' | 'company';

export default function LoginPage() {
  const [currentType, setCurrentType] = useState<MemberType>('seeker');

  const handleSwitchTab = (type: MemberType) => {
    setCurrentType(type);
  };

  const KAKAO_LOGIN_URL = 'http://jobchaja.com:8000/auth/kakao';
  const GOOGLE_LOGIN_URL = 'http://jobchaja.com:8000/auth/google';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-96 animate-in fade-in duration-500">

        {/* Left Side - Branding (Desktop Only) */}
        <div className="hidden md:flex md:w-1/2 bg-slate-900 relative flex-col justify-between p-12 text-white overflow-hidden">
          {/* Background Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500 rounded-full blur-3xl opacity-10"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                ✈
              </div>
              <span className="text-xl font-bold tracking-tight">JobChaja</span>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Global Talent,
              <br />
              Korea Opportunity.
            </h2>
            <p className="text-slate-300 font-light text-lg leading-relaxed">
              국경 없는 채용의 시작.
              <br />
              검증된 기업과 인재를 가장 안전하게 연결합니다.
            </p>

            {/* Review Card */}
            <div className="mt-8 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-white text-sm">
                K
              </div>
              <div>
                <p className="text-sm font-medium text-white">&quot;비자 문제 없이 바로 취업했어요!&quot;</p>
                <p className="text-xs text-slate-400">Kevin, E-9 비자 근로자</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">

          {/* Mobile Logo */}
          <div className="md:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-2 justify-center">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-sky-500/30">
                ✈
              </div>
              <span className="text-2xl font-bold text-slate-900">JobChaja</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              환영합니다! 👋
            </h1>
            <p className="text-slate-500 text-sm md:text-base">
              3초 만에 시작하고 맞춤 일자리를 찾으세요.
            </p>
          </div>

          {/* Member Type Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-2xl mb-8 relative">
            {/* Tab Indicator */}
            <div
              className={`absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ${currentType === 'company' ? 'translate-x-[calc(100%+8px)]' : ''
                }`}
            ></div>

            <button
              onClick={() => handleSwitchTab('seeker')}
              className={`relative z-10 w-1/2 py-3 text-sm font-bold transition-colors duration-300 ${currentType === 'seeker'
                ? 'text-slate-900'
                : 'text-slate-500'
                }`}
            >
              👤 개인 회원
            </button>
            <button
              onClick={() => handleSwitchTab('company')}
              className={`relative z-10 w-1/2 py-3 text-sm font-bold transition-colors duration-300 ${currentType === 'company'
                ? 'text-slate-900'
                : 'text-slate-500'
                }`}
            >
              🏢 기업 회원
            </button>
          </div>

          {/* Login Buttons */}
          <div className="space-y-4 max-w-sm mx-auto w-full">

            {/* Helper Text */}
            <p className="text-xs text-center text-slate-400 mb-4">
              {currentType === 'seeker'
                ? '개인 회원은 별도 가입 절차 없이 바로 시작하세요.'
                : '기업 회원은 로그인 후 사업자 인증이 필요합니다.'}
            </p>

            {/* Kakao Login */}
            <Button
              asChild
              className="w-full h-14 bg-yellow-300 hover:bg-yellow-400 text-yellow-900 font-bold rounded-2xl flex items-center justify-center gap-3"
            >
              <Link href={KAKAO_LOGIN_URL}>
                💬 카카오로 3초 만에 시작하기
              </Link>
            </Button>

            {/* Google Login */}
            <Button
              variant="outline"
              asChild
              className="w-full h-14 border border-gray-200 hover:bg-gray-50 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-3"
            >
              <Link href={GOOGLE_LOGIN_URL}>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>구글 계정으로 계속하기</span>
              </Link>
            </Button>
          </div>

          {/* Terms */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              로그인 시{' '}
              <a href="#" className="underline hover:text-slate-600">
                이용약관
              </a>{' '}
              및{' '}
              <a href="#" className="underline hover:text-slate-600">
                개인정보처리방침
              </a>
              에 동의하게 됩니다.
              <br />
              기업 회원은 최초 로그인 시{' '}
              <span className="text-sky-600 font-bold">사업자 인증</span> 절차가 진행됩니다.
            </p>
          </div>

          {/* Home Link */}
          <div className="mt-8 text-center md:hidden">
            <a href="#" className="text-sm text-slate-400 hover:text-slate-600">
              로그인 없이 둘러보기 →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
