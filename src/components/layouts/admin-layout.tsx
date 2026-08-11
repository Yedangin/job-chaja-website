'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import LanguageSwitcher from '@/components/language-switcher';
import BrandLogo from '@/components/brand-logo';
import { FileText, LayoutDashboard, LogOut, MonitorUp, ShieldCheck } from 'lucide-react';

/**
 * 어드민 전용 레이아웃 / Admin-only layout
 * - 최소 상단 바 (로고, 언어 전환, 로그아웃)
 * - 기존 admin/page.tsx가 내부 탭/사이드바를 이미 포함하므로 프레임만 제공
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* 상단 바 / Top bar */}
      <header className="sticky top-0 z-50 bg-gray-900 text-white border-b border-gray-700">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          {/* 좌측: 로고 / Left: Logo */}
          <Link href="/" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="JobChaja home">
            <BrandLogo inverse admin />
          </Link>

          <nav className="ml-3 flex min-w-0 flex-1 items-center gap-1" aria-label="Admin">
            <Link href="/admin" title="Dashboard" className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white">
              <LayoutDashboard className="h-4 w-4" /><span className="hidden lg:inline">Dashboard</span>
            </Link>
            <Link href="/admin/guide" title="Notices" className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white">
              <FileText className="h-4 w-4" /><span className="hidden lg:inline">Notices</span>
            </Link>
            <Link href="/admin/slider" title="Home slider" className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white">
              <MonitorUp className="h-4 w-4" /><span className="hidden lg:inline">Slider</span>
            </Link>
            <Link href="/admin/visa-policy-studio" title="Visa policy studio" className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white">
              <ShieldCheck className="h-4 w-4" /><span className="hidden lg:inline">Visa Policy</span>
            </Link>
          </nav>

          {/* 우측: 언어 + 로그아웃 / Right: Language + Logout */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher compactOnMobile />
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition px-2 py-1 rounded hover:bg-gray-800"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 / Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
