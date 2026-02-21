'use client';

import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useAuth, getRoleHomePath } from '@/contexts/auth-context';
import LanguageSwitcher from '@/components/language-switcher';

/**
 * 공용 헤더 (메인 페이지, 로그인 전 등에서 사용) / Public header
 * 로그인 후에는 역할별 레이아웃 헤더가 사용됨
 */
export default function Header() {
  const { user, isLoggedIn, isLoading, role, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기 / Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // 드롭다운 링크 클릭 시 닫기 / Close dropdown on link click
  const closeDropdown = () => setOpenDropdown(null);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
        {/* 좌측: 로고 + 네비 / Left: Logo + Nav */}
        <div className="flex items-center" ref={dropdownRef}>
          <Link href="/" className="text-lg font-bold text-gray-900 hover:opacity-80 transition">
            JobChaja
          </Link>

          <nav className="hidden md:flex items-center ml-8 gap-1 text-sm">
            {/* 비자진단 / Visa Diagnosis */}
            <Link href="/diagnosis" className="px-3 py-2 text-blue-600 hover:text-blue-700 font-semibold transition">
              비자진단
            </Link>

            {/* 구직자(개인) 드롭다운 / Worker dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('worker')}
                className="px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1"
              >
                구직자
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'worker' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'worker' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                  <Link href="/worker/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    대시보드
                  </Link>
                  <Link href="/worker/jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    채용공고
                  </Link>
                  <Link href="/worker/alba" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    알바공고
                  </Link>
                  <Link href="/worker/resume" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    이력서
                  </Link>
                  <Link href="/worker/visa" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    비자관리
                  </Link>
                  <Link href="/worker/visa-verification" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    비자인증
                  </Link>
                  <Link href="/worker/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    알림
                  </Link>
                  <Link href="/worker/mypage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    마이페이지
                  </Link>
                </div>
              )}
            </div>

            {/* 기업 드롭다운 / Company dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('company')}
                className="px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1"
              >
                기업
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'company' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'company' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50 max-h-[70vh] overflow-y-auto">
                  <Link href="/company/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    대시보드
                  </Link>
                  <Link href="/company/alba" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    알바채용관
                  </Link>
                  <Link href="/company/alba/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    알바 공고등록
                  </Link>
                  <Link href="/company/fulltime/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    정규직 공고등록
                  </Link>
                  <Link href="/company/jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    공고관리
                  </Link>
                  <Link href="/company/applicants" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    지원자관리
                  </Link>
                  <Link href="/company/talents" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    인재탐색
                  </Link>
                  <Link href="/company/interviews" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    면접관리
                  </Link>
                  <Link href="/company/visa-status" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    비자현황
                  </Link>
                  <Link href="/company/visa-guide" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    비자가이드
                  </Link>
                  <Link href="/company/verification" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    기업인증
                  </Link>
                  <Link href="/company/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    기업프로필
                  </Link>
                  <Link href="/company/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    알림
                  </Link>
                  <Link href="/company/mypage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    마이페이지
                  </Link>
                </div>
              )}
            </div>

            {/* 시안 모음 드롭다운 / Design Mockups dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('designs')}
                className="px-3 py-2 text-orange-500 hover:text-orange-600 font-medium transition flex items-center gap-1"
              >
                시안 모음
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'designs' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'designs' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border py-1 z-50 max-h-[70vh] overflow-y-auto">
                  <p className="px-4 py-1.5 text-xs text-gray-400 font-semibold uppercase">기업 대시보드</p>
                  <div className="flex gap-1 px-4 py-1.5">
                    {['e'].map((v) => (
                      <Link
                        key={v}
                        href={`/company/dashboard/variants/${v}`}
                        className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 font-medium"
                        onClick={closeDropdown}
                      >
                        {v.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                  <p className="px-4 py-1.5 text-xs text-gray-400 font-semibold uppercase mt-1">알바채용관</p>
                  <div className="flex gap-1 px-4 py-1.5">
                    {['a', 'b', 'c', 'd', 'e'].map((v) => (
                      <Link
                        key={v}
                        href={`/company/alba/variants/${v}`}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium"
                        onClick={closeDropdown}
                      >
                        {v.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                  <p className="px-4 py-1.5 text-xs text-gray-400 font-semibold uppercase mt-1">알바 공고등록</p>
                  <div className="flex gap-1 px-4 py-1.5">
                    {['a', 'b', 'c', 'd', 'e'].map((v) => (
                      <Link
                        key={v}
                        href={`/company/alba/create/variants/${v}`}
                        className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 font-medium"
                        onClick={closeDropdown}
                      >
                        {v.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                  <p className="px-4 py-1.5 text-xs text-gray-400 font-semibold uppercase mt-1">개인 알바채용관</p>
                  <div className="flex gap-1 px-4 py-1.5">
                    {['a', 'b', 'c', 'd', 'e'].map((v) => (
                      <Link
                        key={v}
                        href={`/worker/alba/variants/${v}`}
                        className="px-2 py-1 text-xs bg-purple-50 text-purple-600 rounded hover:bg-purple-100 font-medium"
                        onClick={closeDropdown}
                      >
                        {v.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                  <hr className="my-1" />
                  <Link href="/job-cards/designs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    채용카드 디자인 시안
                  </Link>
                  <Link href="/job-cards/designs-gemini" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    채용카드 Gemini 시안
                  </Link>
                  <Link href="/diagnosis/designs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    비자진단 디자인 시안
                  </Link>
                  <hr className="my-1" />
                  <p className="px-4 py-1.5 text-xs text-gray-400 font-semibold uppercase">개인 프로필 위자드</p>
                  <div className="flex gap-1 px-4 py-1.5">
                    {['a', 'b', 'c', 'd', 'e'].map((v) => (
                      <Link
                        key={v}
                        href={`/worker/wizard/variants/${v}`}
                        className="px-2 py-1 text-xs bg-orange-50 text-orange-600 rounded hover:bg-orange-100 font-medium"
                        onClick={closeDropdown}
                      >
                        {v.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 관리자 / Admin */}
            <Link href="/admin" className="px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition">
              관리자
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
