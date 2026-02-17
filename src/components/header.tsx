'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { useAuth, getRoleHomePath } from '@/contexts/auth-context';
import LanguageSwitcher from '@/components/language-switcher';

/**
 * 공용 헤더 (메인 페이지, 로그인 전 등에서 사용) / Public header
 * 로그인 후에는 역할별 레이아웃 헤더가 사용됨
 */
export default function Header() {
  const { user, isLoggedIn, isLoading, role, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
        {/* 좌측: 로고 + 네비 / Left: Logo + Nav */}
        <div className="flex items-center">
          <Link href="/" className="text-lg font-bold text-gray-900 hover:opacity-80 transition">
            JobChaja
          </Link>

          <nav className="hidden md:flex items-center ml-8 gap-1 text-sm">
            <Link href="/diagnosis" className="px-3 py-2 text-blue-600 hover:text-blue-700 font-semibold transition">비자진단</Link>
            <Link href="/alba" className="px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition">알바채용관</Link>
            <Link href="/fulltime" className="px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition">정규채용관</Link>
            <Link href="/recruit-info" className="px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition">채용정보</Link>
          </nav>
        </div>

        {/* 우측: 액션 / Right: Actions */}
        <div className="ml-auto flex items-center gap-2 text-sm">
          <LanguageSwitcher />

          {isLoading ? (
            <div className="w-20 h-8" />
          ) : !isLoggedIn ? (
            <>
              <Link href="/login" className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-medium transition">로그인</Link>
              <Link href="/login" className="px-3 py-1.5 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition">회원가입</Link>
            </>
          ) : role === 'INDIVIDUAL' ? (
            <>
              <Link href="/worker/mypage" className="px-2 py-1.5 text-gray-600 hover:text-blue-600 transition flex items-center gap-1">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">마이페이지</span>
              </Link>
              <Link href="/worker/dashboard" className="px-2 py-1.5 text-gray-600 hover:text-blue-600 font-medium transition">대시보드</Link>
              <button onClick={logout} className="px-2 py-1.5 text-gray-400 hover:text-gray-600 transition">로그아웃</button>
            </>
          ) : role === 'CORPORATE' ? (
            <>
              <Link href="/company/dashboard" className="px-2 py-1.5 text-gray-600 hover:text-blue-600 font-medium transition">기업 대시보드</Link>
              <button onClick={logout} className="px-2 py-1.5 text-gray-400 hover:text-gray-600 transition">로그아웃</button>
            </>
          ) : role === 'ADMIN' ? (
            <>
              <Link href="/admin" className="px-2 py-1.5 text-gray-600 hover:text-blue-600 font-medium transition">관리자</Link>
              <button onClick={logout} className="px-2 py-1.5 text-gray-400 hover:text-gray-600 transition">로그아웃</button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
