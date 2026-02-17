'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import LanguageSwitcher from '@/components/language-switcher';
import {
  Home,
  ClipboardList,
  Plus,
  Bell,
  User,
  Search,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  FileText,
  Shield,
  AlertCircle,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

/**
 * 기업회원 전용 레이아웃 / Company member layout
 * - 모바일: 하단 5탭 (홈, 공고관리, +FAB, 알림, MY)
 * - 웹: 상단 GNB + 좌측 사이드바
 */
export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, verificationStatus } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  // 현재 활성 탭 판별 / Determine active tab
  const isActive = (path: string) => pathname.startsWith(path);

  // 인증 상태 배너 / Verification status banner
  const VerificationBanner = () => {
    if (!verificationStatus || verificationStatus === 'NONE' || verificationStatus === 'PENDING') {
      return (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2.5 text-sm text-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>기업인증을 완료하고 모든 서비스를 이용하세요</span>
          </div>
          <Link href="/company/verification" className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition">
            인증 시작
          </Link>
        </div>
      );
    }
    if (verificationStatus === 'SUBMITTED') {
      return (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2.5 text-sm text-yellow-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-yellow-600" />
            <span>기업인증 심사 중입니다 (영업일 1~2일 소요)</span>
          </div>
          <Link href="/company/verification" className="text-yellow-700 underline font-medium text-xs">
            제출 내역 확인
          </Link>
        </div>
      );
    }
    if (verificationStatus === 'REJECTED') {
      return (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 text-sm text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>기업인증이 반려되었습니다. 서류를 다시 제출해주세요.</span>
          </div>
          <Link href="/company/verification" className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700 transition">
            재제출하기
          </Link>
        </div>
      );
    }
    return null;
  };

  // GNB 메뉴 항목 / GNB menu items
  const gnbItems = [
    { href: '/company/jobs', label: '공고관리', labelEn: 'Job Mgmt' },
    { href: '/company/talents', label: '인재검색', labelEn: 'Talent Search' },
    { href: '/company/visa-guide', label: '비자가이드', labelEn: 'Visa Guide' },
    { href: '/company/payments', label: '요금안내', labelEn: 'Pricing' },
  ];

  // 사이드바 메뉴 / Sidebar menu items
  const sidebarItems = [
    { href: '/company/dashboard', icon: LayoutDashboard, label: '대시보드' },
    { href: '/company/jobs', icon: Briefcase, label: '전체 공고' },
    { href: '/company/applicants', icon: Users, label: '지원자 관리' },
    { href: '/company/interviews', icon: Calendar, label: '면접 일정' },
    { href: '/company/talents', icon: Search, label: '인재풀' },
    { href: '/company/visa-status', icon: Shield, label: '비자 현황' },
  ];

  // 모바일 하단 탭 / Mobile bottom tabs
  const bottomTabs = [
    { href: '/company/dashboard', icon: Home, label: '홈' },
    { href: '/company/jobs', icon: ClipboardList, label: '공고관리' },
    { href: '/company/jobs/create', icon: Plus, label: '등록', isFab: true },
    { href: '/company/notifications', icon: Bell, label: '알림' },
    { href: '/company/mypage', icon: User, label: 'MY' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* === 상단 GNB (웹) / Top GNB (desktop) === */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          {/* 좌측: 로고 + 메뉴 / Left: Logo + Menu */}
          <div className="flex items-center">
            {/* 모바일 햄버거 / Mobile hamburger */}
            <button
              className="md:hidden mr-2 p-1.5 text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/company/dashboard" className="text-lg font-bold text-gray-900 hover:opacity-80 transition">
              JobChaja
            </Link>

            {/* 웹 GNB / Desktop GNB */}
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
            <Link href="/company/notifications" className="relative p-2 text-gray-500 hover:text-gray-700 transition">
              <Bell className="w-5 h-5" />
            </Link>
            <LanguageSwitcher />
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-700 hover:text-gray-900 transition"
              >
                <span className="hidden sm:inline font-medium truncate max-w-[120px]">
                  {user?.companyName || '기업'}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {profileDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                  <Link
                    href="/company/mypage"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileDropdown(false)}
                  >
                    MY 페이지
                  </Link>
                  <Link
                    href="/company/profile/edit"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileDropdown(false)}
                  >
                    기업정보 수정
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

        {/* 인증 상태 배너 / Verification status banner */}
        <VerificationBanner />
      </header>

      <div className="flex flex-1">
        {/* === 좌측 사이드바 (웹) / Left sidebar (desktop) === */}
        <aside className={`
          ${sidebarOpen ? 'block' : 'hidden'} md:block
          w-56 bg-white border-r border-gray-200
          fixed md:sticky top-14 h-[calc(100vh-3.5rem)] z-40
          overflow-y-auto
        `}>
          <nav className="p-3 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* 사이드바 오버레이 (모바일) / Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/20 z-30 top-14"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* === 메인 컨텐츠 / Main content === */}
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* === 하단 5탭 (모바일) / Bottom 5 tabs (mobile) === */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {bottomTabs.map((tab) => {
            const active = tab.isFab ? false : isActive(tab.href);
            if (tab.isFab) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex flex-col items-center justify-center -mt-5"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] mt-0.5 text-gray-500">{tab.label}</span>
                </Link>
              );
            }
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
