'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight, Paperclip as PaperPlane } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface HeaderProps {
  isCompanyMode: boolean;
  onToggleMode: () => void;
  onLogoClick: () => void;
}

export default function Header({ isCompanyMode, onToggleMode, onLogoClick }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'INDIVIDUAL' | 'CORPORATE' | 'ADMIN' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()

  // 페이지 로드 시 세션 확인
  useEffect(() => {
    // 소셜 로그인 콜백: URL에서 sessionId 감지 → localStorage 저장
    const params = new URLSearchParams(window.location.search);
    const urlSessionId = params.get('sessionId');
    if (urlSessionId) {
      console.log('[Header] 소셜 로그인 sessionId 감지 (URL)');
      localStorage.setItem('sessionId', urlSessionId);
      window.history.replaceState({}, '', window.location.pathname);
    }

    const checkSession = async () => {
      try {
        console.log('[Header] 세션 확인 시작...');

        // LocalStorage에서 sessionId 가져오기
        const sessionId = localStorage.getItem('sessionId');
        console.log('[Header] LocalStorage sessionId:', sessionId ? sessionId.substring(0, 20) + '...' : 'null');

        if (!sessionId) {
          console.log('[Header] sessionId 없음 - 비로그인 상태');
          setIsLoggedIn(false);
          setUserType(null);
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/auth/profile', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionId}`, // Authorization 헤더에 sessionId 추가
          },
        });

        console.log('[Header] 응답 상태:', response.status, response.statusText);

        if (response.ok) {
          const data = await response.json();
          console.log('[Header] 프로필 데이터:', data);
          setIsLoggedIn(true);

          // Proto UserRole enum: INDIVIDUAL=3, CORPORATE=4, ADMIN=5
          if (data.user?.role === 3) {
            setUserType('INDIVIDUAL');
            console.log('[Header] 사용자 타입: INDIVIDUAL');
          } else if (data.user?.role === 4) {
            setUserType('CORPORATE');
            console.log('[Header] 사용자 타입: CORPORATE');
          } else if (data.user?.role === 5) {
            setUserType('ADMIN');
            console.log('[Header] 사용자 타입: ADMIN, 리디렉션...');
            router.push('/admin');
          }
        } else {
          console.log('[Header] 세션 만료 - 로그아웃 처리');
          localStorage.removeItem('sessionId');
          setIsLoggedIn(false);
          setUserType(null);
        }
      } catch (error) {
        console.error('[Header] 세션 확인 실패:', error);
        localStorage.removeItem('sessionId');
        setIsLoggedIn(false);
        setUserType(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [])

  // LogoutFn
  const logoutHandler = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');

      if (sessionId) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionId}`,
          },
        });
      }

      // LocalStorage 정리
      localStorage.removeItem('sessionId');
      setIsLoggedIn(false);
      setUserType(null);
      router.push("/login");
      toast.success("로그아웃되었습니다");
    } catch (error) {
      console.error('로그아웃 실패:', error);
      localStorage.removeItem('sessionId');
      toast.error("로그아웃 중 오류가 발생했습니다");
    }
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={"/"}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          onClick={onLogoClick}
        >
          <div className="w-8 h-8 bg-[#0ea5e9] rounded-lg flex items-center justify-center text-white">
            <PaperPlane size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">JobChaja</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-32 h-8"></div>
          ) : !isLoggedIn ? (
            // 비로그인 상태
            <>
              <Button asChild variant="ghost" className="text-slate-600 font-medium text-sm px-2">
                <Link href="/login">로그인</Link>
              </Button>
              <Button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200" asChild>
                <Link href="/login">
                  회원가입
                </Link>
              </Button>
              <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
              <Button asChild variant="ghost" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100">
                <Link href="/biz">
                  <span>비즈서비스</span>
                  <ChevronRight size={14} />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100">
                <Link href="/payment">
                  <span>기업서비스</span>
                  <ChevronRight size={14} />
                </Link>
              </Button>
            </>
          ) : userType === 'INDIVIDUAL' ? (
            // 개인 회원 로그인 상태
            <div className='flex justify-center items-center gap-2'>
              <Button asChild variant="ghost" className="text-slate-600 font-medium text-sm px-2">
                <Link href="/profile">프로필</Link>
              </Button>
              <Button asChild variant="ghost" className="text-slate-600 font-medium text-sm px-2">
                <Link href="/resume">이력서</Link>
              </Button>
              <Button onClick={logoutHandler} variant="ghost" className="text-slate-600 font-medium text-sm px-2">
                로그아웃
              </Button>
            </div>
          ) : userType === 'CORPORATE' ? (
            // 기업 회원 로그인 상태
            <div className='flex justify-center items-center gap-2'>
              <Button asChild variant="ghost" className="text-slate-600 font-medium text-sm px-2">
                <Link href="/payment">기업서비스</Link>
              </Button>
              <Button asChild variant="ghost" className="text-slate-600 font-medium text-sm px-2">
                <Link href="/profile">프로필</Link>
              </Button>
              <Button onClick={logoutHandler} variant="ghost" className="text-slate-600 font-medium text-sm px-2">
                로그아웃
              </Button>
            </div>
          ) : userType === 'ADMIN' ? (
            // 관리자 로그인 상태 (자동 리디렉션됨)
            <div className='flex justify-center items-center gap-2'>
              <Button asChild variant="ghost" className="text-slate-600 font-medium text-sm px-2">
                <Link href="/admin">관리자 패널</Link>
              </Button>
              <Button onClick={logoutHandler} variant="ghost" className="text-slate-600 font-medium text-sm px-2">
                로그아웃
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
