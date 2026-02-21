'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import LanguageSwitcher from '@/components/language-switcher';
import Footer from '@/components/footer';
import {
  Home,
  Search,
  Shield,
  Bell,
  User,
  LogOut,
  ChevronDown,
  FileText,
  Briefcase,
} from 'lucide-react';
import { useState } from 'react';

/**
 * 개인회원(구직자) 전용 레이아웃 / Worker/Job seeker layout
 * - 모바일: 하단 5탭 (홈, 공고검색, 비자센터, 알림, MY)
 * - 웹: 상단 GNB
 */
export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [profileDropdown, setProfileDropdown] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

  // GNB 메뉴 (웹) / GNB menu items (desktop)
  const gnbItems = [
    { href: '/diagnosis', label: '비자진단', labelEn: 'Visa Diagnosis' },
    { href: '/worker/jobs', label: '공고검색', labelEn: 'Job Search' },
    { href: '/worker/visa', label: '비자센터', labelEn: 'Visa Center' },
    { href: '/worker/mypage', label: '마이페이지', labelEn: 'My Page' },
  ];

  // 모바일 하단 탭 / Mobile bottom tabs
  const bottomTabs = [
    { href: '/worker/dashboard', icon: Home, label: '홈' },
    { href: '/worker/jobs', icon: Search, label: '공고검색' },
    { href: '/worker/visa', icon: Shield, label: '비자센터' },
    { href: '/worker/notifications', icon: Bell, label: '알림' },
    { href: '/worker/mypage', icon: User, label: 'MY' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* === 상단 GNB / Top GNB === */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          {/* 좌측: 로고 + 메뉴 / Left: Logo + Menu */}
          <div className="flex items-center">
            <Link href="/" className="text-lg font-bold text-gray-900 hover:opacity-80 transition">
              JobChaja
            </Link>

            <nav className="hidden md:flex items-center ml-8 gap-1 text-sm">
              {gnbItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 font-medium transition rounded-md ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* 우측: 알림 + 언어 + 프로필 / Right: Notifications + Language + Profile */}
          <div className="ml-auto flex items-center gap-2">
            <Link href="/worker/notifications" className="relative p-2 text-gray-500 hover:text-gray-700 transition">
              <Bell className="w-5 h-5" />
            </Link>
            <LanguageSwitcher />
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-700 hover:text-gray-900 transition"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline font-medium truncate max-w-[120px]">
                  {user?.fullName || '프로필'}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {profileDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                  <Link
                    href="/worker/mypage"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    onClick={() => setProfileDropdown(false)}
                  >
                    <User className="w-3.5 h-3.5" /> MY 페이지
                  </Link>
                  <Link
                    href="/worker/resume"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    onClick={() => setProfileDropdown(false)}
                  >
                    <FileText className="w-3.5 h-3.5" /> 이력서 관리
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => { setProfileDropdown(false); logout(); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* === 메인 컨텐츠 / Main content === */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* === 푸터 (웹만) / Footer (desktop only) === */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* === 하단 5탭 (모바일) / Bottom 5 tabs (mobile) === */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {bottomTabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1 px-3 ${
                  active ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`text-[10px] mt-0.5 ${active ? 'font-semibold' : ''}`}>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
