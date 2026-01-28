'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type MemberType = 'seeker' | 'company';
type ViewType = 'login' | 'signup' | 'forgot-password';

export default function LoginPage() {
  const [currentType, setCurrentType] = useState<MemberType>('seeker');
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [reviewIndex, setReviewIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // စာသားတွေပြောင်းလဲမှုကို သေသပ်စေရန် Fixed Height နှင့် Refined Language သုံးထားသည်
  const reviews = [
    { 
      text: "비자 문제 없이 바로 취업했어요!", 
      author: "Kevin, E-9 비자 근로자", 
      initial: "K", 
      color: "bg-green-500" 
    },
    { 
      text: "한국어 소통이 가능한 인재를 찾기가 정말 쉬워졌어요!", 
      author: "Park, HR Manager", 
      initial: "P", 
      color: "bg-blue-500" 
    },
    { 
      text: "JobChaja 덕분에 꿈을 이뤘습니다. 정말 감사합니다.", 
      author: "Maria, Specialized Worker", 
      initial: "M", 
      color: "bg-purple-500" 
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const KAKAO_LOGIN_URL = 'http://jobchaja.com:8000/auth/kakao';
  const GOOGLE_LOGIN_URL = 'http://jobchaja.com:8000/auth/google';

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://jobchaja.com:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }

      // Handle successful login: redirect to the main page.
      console.log('Login successful:', data);
      // TODO: Save token if necessary, e.g., localStorage.setItem('token', data.accessToken);
      window.location.href = 'http://jobchaja.com';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://jobchaja.com:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          fullName: registerFullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
      }

      // On success
      console.log('Registration successful:', data);
      alert('회원가입에 성공했습니다! 이제 로그인할 수 있습니다.');
      setCurrentView('login'); // Switch back to login view
      // Clear registration form fields
      setRegisterFullName('');
      setRegisterEmail('');
      setRegisterPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[750px] relative transition-all duration-500">
        
        {/* --- LEFT SIDE --- */}
        <div className={`hidden md:flex md:w-1/2 relative flex-col justify-between p-12 text-white overflow-hidden transition-colors duration-700 ${currentView === 'signup' ? 'bg-sky-900' : 'bg-slate-900'}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-lg">✈</div>
              <span className="text-xl font-bold tracking-tight">JobChaja</span>
            </div>
          </div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Global Talent,<br />Korea Opportunity.
            </h2>
            <p className="text-slate-300 font-light text-lg leading-relaxed">
              국경 없는 채용의 시작.<br />검증된 기업과 인재를 안전하게 연결합니다.
            </p>
            
            {/* Review Carousel - Fixed Height to prevent shifting */}
            <div className="mt-8 bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10 flex items-center gap-4 h-[100px]">
              <div className={`w-10 h-10 rounded-full ${reviews[reviewIndex].color} flex items-center justify-center font-bold text-white text-sm shrink-0 transition-transform duration-500`}>
                {reviews[reviewIndex].initial}
              </div>
              <div className="flex flex-col overflow-hidden">
                {/* transition key ensures smooth fade-in for the text content */}
                <p key={`text-${reviewIndex}`} className="text-sm font-medium text-white italic animate-in fade-in duration-500 line-clamp-2">
                  "{reviews[reviewIndex].text}"
                </p>
                <p key={`author-${reviewIndex}`} className="text-xs text-slate-400 mt-1 animate-in fade-in duration-700">
                  {reviews[reviewIndex].author}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          
          {/* LOGIN VIEW */}
          {currentView === 'login' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">환영합니다! 👋</h1>
                <p className="text-slate-500 text-sm">3초 만ေ 시작하고 맞춤 일자리를 찾으세요.</p>
              </div>

              {/* Tabs with 12px rounding (rounded-xl) */}
              <div className="flex p-1 bg-gray-100 rounded-xl mb-6 relative">
                <div className={`absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ${currentType === 'company' ? 'translate-x-[calc(100%+8px)]' : ''}`}></div>
                <button onClick={() => setCurrentType('seeker')} className={`relative z-10 w-1/2 py-3 text-sm font-bold ${currentType === 'seeker' ? 'text-slate-900' : 'text-slate-400'}`}>👤 개인 회원</button>
                <button onClick={() => setCurrentType('company')} className={`relative z-10 w-1/2 py-3 text-sm font-bold ${currentType === 'company' ? 'text-slate-900' : 'text-slate-400'}`}>🏢 기업 회원</button>
              </div>

              <form onSubmit={handleLogin} className="space-y-3 mb-4">
                {/* All inputs and buttons set to 12px radius (rounded-xl) */}
                <input 
                  type="email" 
                  placeholder="이메일 주소" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input 
                  type="password" 
                  placeholder="비밀번호" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && <p className="text-xs text-red-500 text-center pt-1">{error}</p>}
                <Button type="submit" disabled={isLoading} className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg disabled:bg-slate-400">
                  {isLoading ? '로그인 중...' : '로그인'}
                </Button>
              </form>

              <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
                <button onClick={() => setCurrentView('forgot-password')} className="hover:text-slate-800">비밀번호 찾기</button>
                {currentType === 'seeker' ? (
                  <button onClick={() => { setError(null); setCurrentView('signup'); }} className="text-sky-600 font-bold hover:text-sky-700">이메일로 회원가입</button>
                ) : (
                  <Link href="/register" className="text-sky-600 font-bold hover:text-sky-700">기업 회원가입</Link>
                )}
              </div>

              <div className="relative py-4 mb-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">또는 소셜 계정으로 로그인</span></div>
              </div>

              {/* Social Login Buttons - All 12px radius */}
              <div className="space-y-3">
                <Button asChild className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD835] text-[#3c1e1e] font-bold rounded-xl flex items-center justify-center gap-2 border-none">
                  <a href={KAKAO_LOGIN_URL}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C5.925 3 1 6.925 1 11.775c0 3.325 2.275 6.225 5.675 7.7-.2 1.45-1.125 4.125-1.3 4.8 0 0-.1.2.1.275.2.075.425.025.425.025 2.75-1.925 5.75-4.025 6.6-4.625.5.075 1.025.125 1.5.125 6.075 0 11-3.925 11-8.775S17.075 3 12 3z"/></svg>
                    카카오로 시작하기
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full h-12 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2">
                  <a href={GOOGLE_LOGIN_URL}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google로 계속하기
                  </a>
                </Button>
              </div>
            </div>
          )}
          
          {/* Sign Up View also inherits the 12px rounding for its buttons */}
          {currentView === 'signup' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
              <button onClick={() => { setError(null); setCurrentView('login'); }} className="mb-6 text-slate-400 hover:text-slate-800 flex items-center gap-1 text-sm font-medium w-fit">
                ← 로그인으로 돌아가기
              </button>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">개인회원 가입</h1>
              <p className="text-slate-500 text-sm mb-6">정보를 입력하고 바로 시작하세요.</p>
              <form onSubmit={handleRegister} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="이름 (Full Name)" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm" 
                  value={registerFullName}
                  onChange={(e) => setRegisterFullName(e.target.value)}
                  required
                />
                <input 
                  type="email" 
                  placeholder="이메일 주소" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm" 
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
                <input 
                  type="password" 
                  placeholder="비밀번호" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm" 
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
                {error && <p className="text-xs text-red-500 text-center pt-1">{error}</p>}
                <Button type="submit" disabled={isLoading} className="w-full h-12 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl mt-4 disabled:bg-sky-300">
                  {isLoading ? '가입 중...' : '가입 완료하기'}
                </Button>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-[10px] text-slate-400 leading-relaxed">
            로그인 시 <span className="underline cursor-pointer">이용약관</span> 및 <span className="underline cursor-pointer">개인정보처리방침</span>에 동의하게 됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}