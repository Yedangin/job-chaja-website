'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import LanguageSwitcher from '@/components/language-switcher';

/**
 * 공용 헤더 (메인 페이지, 로그인 전 등에서 사용) / Public header
 * 로그인 후에는 역할별 레이아웃 헤더가 사용됨
 */
export default function Header() {
  const { isLoggedIn, isLoading, role, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
        {/* 좌측: 로고 + 네비 / Left: Logo + Nav */}
        <div className="flex items-center">
          <Link href="/" className="text-lg font-bold text-gray-900 hover:opacity-80 transition">
            JobChaja
          </Link>

          <nav className="hidden md:flex items-center ml-8 gap-1 text-sm">
            <Link href="/visa-planner" className="px-3 py-2 text-sky-600 hover:text-sky-700 font-semibold transition">
              Visa Planner
            </Link>
            <Link href="/worker/jobs" className="px-3 py-2 text-gray-600 hover:text-sky-600 font-medium transition">
              Jobs
            </Link>
            <Link href="/international" className="px-3 py-2 text-gray-600 hover:text-sky-600 font-medium transition">
              Start in Korea
            </Link>
            <Link href="/register" className="px-3 py-2 text-gray-600 hover:text-sky-600 font-medium transition">
              For Employers
            </Link>
          </nav>
        </div>

        {/* 우측: 액션 / Right: Actions */}
        <div className="ml-auto flex items-center gap-2 text-sm">
          <LanguageSwitcher />

          {isLoading ? (
            <div className="w-20 h-8" />
          ) : !isLoggedIn ? (
            <>
              <Link href={pathname === '/' ? '/login' : `/login?redirect=${encodeURIComponent(pathname)}`} className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-medium transition">Log In</Link>
              <Link href={pathname === '/' ? '/login' : `/login?redirect=${encodeURIComponent(pathname)}`} className="px-3 py-1.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition">Get Started</Link>
            </>
          ) : role === 'INDIVIDUAL' ? (
            <>
              <Link href="/worker/mypage" className="px-2 py-1.5 text-gray-600 hover:text-sky-600 transition flex items-center gap-1">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">My Page</span>
              </Link>
              <Link href="/worker/dashboard" className="px-2 py-1.5 text-gray-600 hover:text-sky-600 font-medium transition">Dashboard</Link>
              <button onClick={logout} className="px-2 py-1.5 text-gray-400 hover:text-gray-600 transition">Log Out</button>
            </>
          ) : role === 'CORPORATE' ? (
            <>
              <Link href="/company/dashboard" className="px-2 py-1.5 text-gray-600 hover:text-sky-600 font-medium transition">Company Dashboard</Link>
              <button onClick={logout} className="px-2 py-1.5 text-gray-400 hover:text-gray-600 transition">Log Out</button>
            </>
          ) : role === 'ADMIN' ? (
            <>
              <Link href="/admin" className="px-2 py-1.5 text-gray-600 hover:text-sky-600 font-medium transition">Admin</Link>
              <button onClick={logout} className="px-2 py-1.5 text-gray-400 hover:text-gray-600 transition">Log Out</button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
