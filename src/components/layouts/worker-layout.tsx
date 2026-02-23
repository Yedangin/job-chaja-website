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
  LayoutDashboard,
  Menu,
  X,
  UserCircle,
  Bookmark,
  ClipboardList,
  Calendar,
  Lock,
  UserX,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { useState } from 'react';

// 사이드바 아이템 타입 / Sidebar item type
interface SidebarItem {
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  danger?: boolean; // 위험 동작 (회원 탈퇴 등) / Destructive action styling
}

// 사이드바 섹션 타입 / Sidebar section type
interface SidebarSection {
  title?: string; // 섹션 헤더 레이블 / Section header label
  items: SidebarItem[];
}

/**
 * 개인회원(구직자) 전용 레이아웃 / Worker/Job seeker layout
 * - 모바일: 하단 5탭 (홈, 공고탐색, 지원현황, 알림, MY)
 * - 웹: 상단 GNB + 좌측 섹션형 사이드바
 */
export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  // 사이드바 아이템 활성 여부 판별
  // Active check: 대시보드는 정확히 일치, 나머지는 startsWith
  // Dashboard uses exact match; others use prefix match
  const isItemActive = (href: string) => {
    if (href === '/worker/mypage') return pathname === '/worker/mypage';
    return pathname.startsWith(href);
  };

  // GNB 메뉴 항목 / GNB menu items
  const gnbItems = [
    { href: '/diagnosis', label: '비자진단' },
    { href: '/worker/alba', label: '알바채용관' },
    { href: '/worker/regular', label: '정규채용관' },
  ];

  // ── 사이드바 섹션 구조 / Sidebar section structure ──────────────────────────
  const sidebarSections: SidebarSection[] = [
    // 대시보드 (섹션 헤더 없음 / No section header)
    {
      items: [
        { href: '/worker/mypage', icon: LayoutDashboard, label: '대시보드' },
      ],
    },
    // 구직 활동 섹션 / Job search activity section
    {
      title: '구직 활동',
      items: [
        { href: '/worker/jobs', icon: Search, label: '공고 탐색' },
        { href: '/worker/scraps', icon: Bookmark, label: '스크랩한 공고' },
        { href: '/worker/applications', icon: ClipboardList, label: '지원 현황' },
        { href: '/worker/interviews', icon: Calendar, label: '면접 일정' },
      ],
    },
    // 내 채용 프로필 섹션 (기업이 열람하는 프로필)
    // My recruitment profile (viewed by companies in talent search)
    {
      title: '내 채용 프로필',
      items: [
        { href: '/worker/resume', icon: FileText, label: '이력서 관리' },
        { href: '/worker/visa', icon: Shield, label: '비자 정보 수정' },
      ],
    },
    // 계정 설정 섹션 / Account settings section
    {
      title: '계정 설정',
      items: [
        { href: '/worker/settings/notifications', icon: Bell, label: '알림 설정' },
        { href: '/worker/settings/password', icon: Lock, label: '비밀번호 변경' },
        { href: '/worker/settings/withdraw', icon: UserX, label: '회원 탈퇴', danger: true },
      ],
    },
    // 고객지원 섹션 / Customer support section
    {
      title: '고객지원',
      items: [
        { href: '/worker/support/contact', icon: MessageSquare, label: '1:1 고객 문의' },
        { href: '/worker/support/terms', icon: BookOpen, label: '약관 및 정책' },
      ],
    },
  ];

  // 모바일 하단 5탭 / Mobile bottom 5 tabs
  // 홈: 대시보드(정확 매칭), 공고탐색, 지원현황, 알림, MY(이력서)
  const bottomTabs = [
    { href: '/worker/mypage', icon: Home, label: '홈', exact: true },
    { href: '/worker/jobs', icon: Search, label: '공고탐색' },
    { href: '/worker/applications', icon: ClipboardList, label: '지원현황' },
    { href: '/worker/notifications', icon: Bell, label: '알림' },
    { href: '/worker/resume', icon: User, label: 'MY' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* === 상단 GNB / Top GNB === */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          {/* 좌측: 햄버거(모바일) + 로고 + GNB / Left: Hamburger + Logo + GNB */}
          <div className="flex items-center">
            <button
              className="md:hidden mr-2 p-1.5 text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="text-lg font-bold text-gray-900 hover:opacity-80 transition">
              JobChaja
            </Link>

            <nav className="hidden md:flex items-center ml-8 gap-1 text-sm">
              {gnbItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 font-medium transition rounded-md ${
                    pathname.startsWith(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* 우측: 알림 + 언어 + 프로필 드롭다운 / Right: Bell + Language + Profile dropdown */}
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
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileDropdown(false)}
                  >
                    <User className="w-3.5 h-3.5" /> MY 페이지
                  </Link>
                  <Link
                    href="/worker/resume"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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

      <div className="flex flex-1">
        {/* === 좌측 사이드바 (웹) / Left sidebar (desktop) ===
            fixed 사용: sticky는 배너 높이만큼 계산이 어긋나 하단이 잘림
            Using fixed: sticky breaks when banner shifts height calculation */}
        <aside className={`
          ${sidebarOpen ? 'flex' : 'hidden'} md:flex flex-col
          w-64 bg-white border-r border-gray-200
          fixed top-14 h-[calc(100vh-3.5rem)] z-40
        `}>

          {/* ── [상단 고정] 프로필 카드 / [TOP FIXED] Profile card (클릭 시 프로필 편집) ── */}
          <Link
            href="/worker/profile"
            onClick={() => setSidebarOpen(false)}
            className="shrink-0 px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition group block"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName || '사용자'}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 -rotate-90 shrink-0" />
            </div>
          </Link>

          {/* ── [중단 스크롤] 섹션형 메뉴 / [MIDDLE SCROLL] Sectioned nav ──
              flex-1 min-h-0: 스크롤 영역이 상하 고정 영역 사이 공간만 차지
              flex-1 min-h-0: scroll area fills only remaining space between fixed top/bottom */}
          <nav className="flex-1 min-h-0 p-3 overflow-y-auto">
            {sidebarSections.map((section, sectionIdx) => (
              <div key={sectionIdx} className={sectionIdx > 0 ? 'mt-5' : ''}>
                {/* 섹션 구분선 (대시보드 이후부터) / Section divider (after dashboard) */}
                {sectionIdx > 0 && (
                  <div className="border-t border-gray-100 -mx-3 mb-4" />
                )}

                {/* 섹션 헤더 레이블 / Section header label */}
                {section.title && (
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1.5">
                    {section.title}
                  </p>
                )}

                {/* 섹션 아이템 목록 / Section items */}
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                        item.danger
                          ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
                          : isItemActive(item.href)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* ── [하단 고정] 로그아웃 / [BOTTOM FIXED] Logout ── */}
          <div className="shrink-0 px-3 py-3 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              로그아웃
            </button>
          </div>
        </aside>

        {/* 사이드바 오버레이 (모바일) / Sidebar backdrop overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/20 z-30 top-14"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* === 메인 컨텐츠 / Main content ===
            md:ml-64: fixed 사이드바(256px) 너비만큼 좌측 여백 확보
            md:ml-64: offset for fixed sidebar width (256px = w-64) */}
        <main className="flex-1 pb-20 md:pb-0 md:ml-64">
          {/* 프로필 작성 유도 배너 (main 안으로 이동 → 사이드바 높이 계산 영향 없음)
              Profile CTA banner moved inside main to not affect sidebar height */}
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCircle className="w-5 h-5 text-blue-600 shrink-0" />
              <span className="text-base font-medium text-blue-900">프로필을 완성하여 나에게 맞는 공고를 만나보세요</span>
            </div>
            <Link
              href="/worker/wizard/variants/a"
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shrink-0 ml-4"
            >
              프로필 등록 →
            </Link>
          </div>
          {children}
        </main>
      </div>

      {/* === 푸터 (웹만) / Footer (desktop only) === */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* === 하단 5탭 (모바일) / Bottom 5 tabs (mobile) === */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {bottomTabs.map((tab) => {
            // 홈 탭은 정확 일치, 나머지는 prefix 매칭
            // Home tab uses exact match; others use prefix match
            const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.label}
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
