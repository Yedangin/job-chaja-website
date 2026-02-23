'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import LanguageSwitcher from '@/components/language-switcher';
import {
  // 공통 레이아웃 / Common layout
  LayoutDashboard, Home, Plus, Bell, User, Menu, X, LogOut, ChevronDown,
  // 기업 관리 / Company management
  Building2, ShieldCheck, UserCog, Users,
  // 채용공고 / Job posting
  FilePlus, ClipboardList, UserCheck, Calendar,
  // 인재채용관 / Talent pool
  Search, Eye, Bookmark, MessageSquare,
  // 결제/정산 / Payment & accounting
  ShoppingBag, Receipt, Tag, CreditCard, FileCheck,
  // 계정 설정 / Account settings
  Lock, ShieldAlert, Link2, Mail, UserX,
  // 고객지원 / Customer support
  Megaphone, HelpCircle, MessageCircle, BookOpen, FileText,
  // 인증 배너 아이콘 / Verification banner icons
  Shield, AlertCircle,
} from 'lucide-react';

/**
 * 사이드바 하위 메뉴 항목 타입 / Sidebar sub-item type
 */
type NavSubItem = {
  href: string;
  label: string;
};

/**
 * 사이드바 메뉴 항목 타입 / Sidebar nav item type
 */
type NavItem = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  /** 정확한 경로 일치 여부 (하위 경로 활성화 방지) / Exact path match */
  exact?: boolean;
  /** 하위 메뉴 (공고 작성 등) / Sub-menu items */
  subItems?: NavSubItem[];
};

/**
 * 사이드바 섹션 타입 / Sidebar section type
 */
type NavSection = {
  title?: string;
  items: NavItem[];
};

/**
 * 기업회원 전용 레이아웃 / Company member layout
 * - 모바일: 상단 GNB + 하단 5탭 + 드로어 사이드바
 * - 웹: 상단 GNB + 좌측 고정 사이드바 (로그아웃 항상 노출)
 *
 * 구조: h-screen overflow-hidden → 사이드바/메인 독립 스크롤
 * Structure: h-screen overflow-hidden → sidebar/main scroll independently
 */
export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, verificationStatus } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  // 공고 작성 하위 메뉴 기본 펼침 여부 / Default expanded state for job create sub-menu
  const [jobCreateOpen, setJobCreateOpen] = useState(
    pathname.startsWith('/company/fulltime/create') ||
    pathname.startsWith('/company/alba/create') ||
    pathname.startsWith('/company/jobs/create'),
  );

  /**
   * 활성 경로 판별 / Determine if route is active
   * exact=true: 정확한 경로 일치만 / exact match only
   * exact=false: 하위 경로 포함 / includes sub-paths
   */
  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  // ── 기업인증 상태 배너 / Verification status banner ───────────────────
  const VerificationBanner = () => {
    if (verificationStatus === 'APPROVED') return null;

    if (!verificationStatus || verificationStatus === 'NONE' || verificationStatus === 'PENDING') {
      return (
        <div className="shrink-0 bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-sm font-medium text-blue-900">기업인증을 완료하고 모든 서비스를 이용하세요</span>
          </div>
          <Link
            href="/company/verification"
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-blue-700 transition shrink-0 ml-4"
          >
            인증 시작 →
          </Link>
        </div>
      );
    }
    if (verificationStatus === 'SUBMITTED') {
      return (
        <div className="shrink-0 bg-yellow-50 border-b border-yellow-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-yellow-600 shrink-0" />
            <span className="text-sm font-medium text-yellow-900">기업인증 심사 중입니다 (영업일 1~2일 소요)</span>
          </div>
          <Link
            href="/company/verification"
            className="text-yellow-700 underline font-semibold text-xs shrink-0 ml-4"
          >
            제출 내역 확인
          </Link>
        </div>
      );
    }
    if (verificationStatus === 'REJECTED') {
      return (
        <div className="shrink-0 bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="text-sm font-medium text-red-900">기업인증이 반려되었습니다. 서류를 다시 제출해주세요.</span>
          </div>
          <Link
            href="/company/verification"
            className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-700 transition shrink-0 ml-4"
          >
            재제출하기
          </Link>
        </div>
      );
    }
    return null;
  };

  // ── 상단 GNB 항목 / Top navigation items ─────────────────────────────
  const gnbItems = [
    { href: '/company/jobs', label: '공고관리' },
    { href: '/company/talents', label: '인재검색' },
    { href: '/company/visa-guide', label: '비자가이드' },
    { href: '/company/payments', label: '요금안내' },
  ];

  // ── 사이드바 섹션 / Sidebar navigation sections ───────────────────────
  const navSections: NavSection[] = [
    // 대시보드 (섹션 구분선 없음) / Dashboard (no section divider)
    {
      items: [
        { href: '/company/mypage', icon: LayoutDashboard, label: '마이페이지', exact: true },
      ],
    },

    // 기업 관리 / Company management
    {
      title: '기업 관리',
      items: [
        { href: '/company/profile', icon: Building2, label: '기업 프로필' },
        { href: '/company/verification', icon: ShieldCheck, label: '기업 인증' },
        { href: '/company/mypage/manager', icon: UserCog, label: '담당자 정보' },
        { href: '/company/mypage/team', icon: Users, label: '팀원/계정 관리' },
      ],
    },

    // 채용공고 / Job posting
    {
      title: '채용공고',
      items: [
        {
          href: '/company/jobs/create',
          icon: FilePlus,
          label: '공고 작성',
          subItems: [
            { href: '/company/fulltime/create', label: '정규 채용관' },
            { href: '/company/alba/create', label: '알바 채용관' },
          ],
        },
        { href: '/company/jobs', icon: ClipboardList, label: '공고 관리', exact: true },
        { href: '/company/applicants', icon: UserCheck, label: '지원자 관리' },
        { href: '/company/interviews', icon: Calendar, label: '면접 일정' },
      ],
    },

    // 인재채용관 / Talent recruitment
    {
      title: '인재채용관',
      items: [
        { href: '/company/talents', icon: Search, label: '인재 탐색', exact: true },
        { href: '/company/talents/viewed', icon: Eye, label: '열람 내역' },
        { href: '/company/talents/bookmarks', icon: Bookmark, label: '즐겨찾기' },
        { href: '/company/messages', icon: MessageSquare, label: '연락내역' },
      ],
    },

    // 결제 / 정산 / Payment & accounting
    {
      title: '결제 / 정산',
      items: [
        { href: '/company/payments', icon: ShoppingBag, label: '상품 구매', exact: true },
        { href: '/company/payments/history', icon: Receipt, label: '결제 내역' },
        { href: '/company/mypage/coupons', icon: Tag, label: '쿠폰함' },
        { href: '/company/payments/credits', icon: CreditCard, label: '열람권 현황' },
        { href: '/company/payments/tax', icon: FileCheck, label: '세금계산서' },
      ],
    },

    // 계정 설정 / Account settings
    {
      title: '계정 설정',
      items: [
        { href: '/company/settings/notifications', icon: Bell, label: '알림 설정' },
        { href: '/company/settings/password', icon: Lock, label: '비밀번호 변경' },
        { href: '/company/settings/security', icon: ShieldAlert, label: '보안 설정' },
        { href: '/company/settings/social', icon: Link2, label: '연결된 소셜 계정' },
        { href: '/company/settings/marketing', icon: Mail, label: '마케팅 수신 동의' },
        { href: '/company/settings/withdraw', icon: UserX, label: '회원 탈퇴' },
      ],
    },

    // 고객지원 / Customer support
    {
      title: '고객지원',
      items: [
        { href: '/company/support/notices', icon: Megaphone, label: '공지사항' },
        { href: '/company/support/faq', icon: HelpCircle, label: '자주 묻는 질문' },
        { href: '/company/support/inquiry', icon: MessageCircle, label: '1:1 고객 문의' },
        { href: '/company/support/guide', icon: BookOpen, label: '이용 가이드' },
        { href: '/company/support/terms', icon: FileText, label: '약관 및 정책' },
      ],
    },
  ];

  // ── 모바일 하단 탭 / Mobile bottom tabs ──────────────────────────────
  const bottomTabs = [
    { href: '/company/mypage', icon: Home, label: '홈', isFab: false },
    { href: '/company/jobs', icon: ClipboardList, label: '공고관리', isFab: false },
    { href: '/company/fulltime/create', icon: Plus, label: '등록', isFab: true },
    { href: '/company/notifications', icon: Bell, label: '알림', isFab: false },
    { href: '/company/mypage', icon: User, label: 'MY', isFab: false },
  ];

  // ── 사이드바 컨텐츠 컴포넌트 (데스크톱/모바일 공용) ─────────────────
  // Shared sidebar content component (desktop & mobile)
  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {/* ── 상단 프로필 카드 / TOP: profile card ──────────────────────── */}
      <div className="shrink-0 border-b border-gray-100 p-3">
        <Link
          href="/company/mypage"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition min-w-0 group"
        >
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.companyName || '기업'}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </Link>
      </div>

      {/* 스크롤 가능한 네비게이션 / Scrollable navigation */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-200">
        {navSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            {/* 섹션 타이틀 + 구분선 / Section title + divider */}
            {section.title ? (
              <div className="px-4 pt-4 pb-1.5 border-t border-gray-100 mt-1">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  {section.title}
                </span>
              </div>
            ) : null}

            {/* 섹션 항목들 / Section items */}
            <div className="px-2 space-y-0.5">
              {section.items.map((item) => {
                // 하위 메뉴 있는 항목 (공고 작성) / Item with sub-menu
                if (item.subItems) {
                  const isChildActive = item.subItems.some((s) =>
                    pathname.startsWith(s.href),
                  );
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => setJobCreateOpen((v) => !v)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isChildActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            jobCreateOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {/* 하위 메뉴 / Sub-menu */}
                      {jobCreateOpen && (
                        <div className="ml-4 pl-3 border-l-2 border-gray-100 mt-0.5 mb-1 space-y-0.5">
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={onNavigate}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                pathname.startsWith(sub.href)
                                  ? 'bg-blue-50 text-blue-700 font-medium'
                                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-50" />
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // 일반 메뉴 항목 / Regular nav item
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── 하단: 인증버튼 + 로그아웃 / BOTTOM: verification + logout ──── */}
      <div className="shrink-0 border-t border-gray-100 p-3 space-y-2">
        {/* 기업인증 미완료 시 인증 버튼 / Verification CTA when not approved */}
        {verificationStatus !== 'APPROVED' && (
          <Link
            href="/company/verification"
            onClick={onNavigate}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            기업인증 완료하기
          </Link>
        )}
        {/* 로그아웃 / Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          로그아웃
        </button>
      </div>
    </>
  );

  return (
    /**
     * h-screen + overflow-hidden: 전체 높이 고정, 스크롤은 내부 영역에서 처리
     * h-screen + overflow-hidden: fixed total height, scroll handled by inner sections
     * → 사이드바 하단 로그아웃 항상 노출 / → sidebar bottom logout always visible
     */
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">

      {/* ════ 상단 GNB / Top global navigation bar ════════════════════════ */}
      <header className="shrink-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center">

          {/* 좌측: 햄버거(모바일) + 로고 + GNB / Left: hamburger + logo + GNB */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-1.5 text-gray-500 hover:text-gray-700 rounded-md"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="메뉴 열기"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="text-lg font-bold text-gray-900 hover:opacity-80 transition">
              JobChaja
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm">
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

          {/* 우측: 알림 + 언어 + 프로필 드롭다운 / Right: notification + language + profile */}
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/company/notifications"
              className="relative p-2 text-gray-500 hover:text-gray-700 transition rounded-md"
            >
              <Bell className="w-5 h-5" />
            </Link>
            <LanguageSwitcher />

            {/* 프로필 드롭다운 / Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-700 hover:text-gray-900 transition rounded-md"
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
      </header>

      {/* ════ 본문 영역 (사이드바 + 메인) / Main content area ════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* 데스크톱 고정 사이드바 / Desktop fixed sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-gray-200">
          <SidebarContent />
        </aside>

        {/* 모바일 드로어 사이드바 / Mobile drawer sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* 드로어 패널 / Drawer panel */}
            <div className="w-72 bg-white flex flex-col shadow-2xl">
              {/* 드로어 헤더 / Drawer header */}
              <div className="shrink-0 flex items-center justify-between px-4 h-14 border-b border-gray-100">
                <Link
                  href="/"
                  className="text-base font-bold text-gray-900"
                  onClick={() => setSidebarOpen(false)}
                >
                  JobChaja
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent onNavigate={() => setSidebarOpen(false)} />
            </div>
            {/* 배경 딤 오버레이 / Dim background overlay */}
            <div
              className="flex-1 bg-black/30"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* 메인 컨텐츠 (독립 스크롤) / Main content (independent scroll) */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {/* ════ 기업인증 배너 / Verification banner ═══════════════════ */}
          <VerificationBanner />
          {children}
        </main>
      </div>

      {/* ════ 모바일 하단 5탭 / Mobile bottom navigation ════════════════ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {bottomTabs.map((tab) => {
            const active = tab.isFab ? false : isActive(tab.href);
            if (tab.isFab) {
              return (
                <Link
                  key={tab.label}
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
                key={tab.label}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1 px-3 ${
                  active ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`text-[10px] mt-0.5 ${active ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
