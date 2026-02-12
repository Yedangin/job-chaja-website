'use client';

import { User } from 'lucide-react';
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
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSessionId = params.get('sessionId');
    if (urlSessionId) {
      localStorage.setItem('sessionId', urlSessionId);
      window.history.replaceState({}, '', window.location.pathname);
    }

    const checkSession = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
          setIsLoggedIn(false);
          setUserType(null);
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/auth/profile', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionId}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          if (data.user?.role === 3) setUserType('INDIVIDUAL');
          else if (data.user?.role === 4) setUserType('CORPORATE');
          else if (data.user?.role === 5) setUserType('ADMIN');
        } else {
          localStorage.removeItem('sessionId');
          setIsLoggedIn(false);
          setUserType(null);
        }
      } catch {
        localStorage.removeItem('sessionId');
        setIsLoggedIn(false);
        setUserType(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const logoutHandler = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionId}` },
        });
      }
      localStorage.removeItem('sessionId');
      setIsLoggedIn(false);
      setUserType(null);
      router.push('/login');
      toast.success('로그아웃되었습니다');
    } catch {
      localStorage.removeItem('sessionId');
      toast.error('로그아웃 중 오류가 발생했습니다');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
        {/* Left: Logo + Nav */}
        <div className="flex items-center">
          <Link href="/" className="text-lg font-bold text-gray-900 hover:opacity-80 transition" onClick={onLogoClick}>
            JobChaja
          </Link>

          <nav className="hidden md:flex items-center ml-8 gap-1 text-sm">
            <Link href="/alba" className="px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition">알바채용관</Link>
            <Link href="/fulltime" className="px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition">정규채용관</Link>
            <Link href="/recruit-info" className="px-3 py-2 text-gray-600 hover:text-blue-600 font-medium transition">채용정보</Link>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="ml-auto flex items-center gap-1 text-sm">
          {isLoading ? (
            <div className="w-20 h-8"></div>
          ) : !isLoggedIn ? (
            <>
              <Link href="/login" className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-medium transition">로그인</Link>
              <Link href="/login" className="px-3 py-1.5 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition">회원가입</Link>
            </>
          ) : userType === 'INDIVIDUAL' ? (
            <>
              <Link href="/profile" className="px-2 py-1.5 text-gray-600 hover:text-blue-600 transition flex items-center gap-1">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">프로필</span>
              </Link>
              <Link href="/resume" className="px-2 py-1.5 text-gray-600 hover:text-blue-600 font-medium transition">이력서</Link>
              <button onClick={logoutHandler} className="px-2 py-1.5 text-gray-400 hover:text-gray-600 transition">로그아웃</button>
            </>
          ) : userType === 'CORPORATE' ? (
            <>
              <Link href="/profile" className="px-2 py-1.5 text-gray-600 hover:text-blue-600 transition flex items-center gap-1">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">프로필</span>
              </Link>
              <Link href="/biz" className="px-2 py-1.5 text-gray-600 hover:text-blue-600 font-medium transition">기업서비스</Link>
              <button onClick={logoutHandler} className="px-2 py-1.5 text-gray-400 hover:text-gray-600 transition">로그아웃</button>
            </>
          ) : userType === 'ADMIN' ? (
            <>
              <Link href="/admin" className="px-2 py-1.5 text-gray-600 hover:text-blue-600 font-medium transition">관리자</Link>
              <button onClick={logoutHandler} className="px-2 py-1.5 text-gray-400 hover:text-gray-600 transition">로그아웃</button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
