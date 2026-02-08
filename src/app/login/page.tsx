'use client';
import axios from 'axios';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageProvider';
import LanguageSwitcher from '@/components/language-switcher';
import { X } from 'lucide-react'; // For close icon (Replaced with text 'X' if not available)

type MemberType = 'seeker' | 'company';
type ViewType = 'login' | 'signup' | 'forgot-password';

// Dummy data for terms content (In production, fetch from server or manage via file)
const termContents: Record<string, string> = {
  term1: `제1조 (목적) 본 약관은 JobChaja 서비스의 이용조건 및 절차... (서비스 이용약관 상세 내용이 들어갑니다.)\n\n제2조 (용어의 정의)...`,
  term2: `1. 수집하는 개인정보 항목: 이름, 이메일, 비밀번호...\n2. 수집 목적: 회원 식별 및 서비스 제공...`,
  term3: `개인정보를 국외로 이전하거나 제3자에게 제공하는 경우에 대한 동의 내용입니다...`,
  term4: `이벤트, 혜택 등 마케팅 정보를 수신하는 것에 동의합니다. (선택 항목)`,
};

export default function LoginPage() {
  const { t } = useLanguage();

  // --- State Management ---
  const [currentType, setCurrentType] = useState<MemberType>('seeker');
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [reviewIndex, setReviewIndex] = useState(0);
  
  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Common State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Registration Form State
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  // Extended Registration Features State
  const [authCode, setAuthCode] = useState('');
  const [isAuthSent, setIsAuthSent] = useState(false);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [authMsg, setAuthMsg] = useState<string | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // Terms Agreement State
  const [terms, setTerms] = useState({
    term1: false, term2: false, term3: false, term4: false,
  });

  // [Added] Modal (Popup) State: Key of the currently open term (null if closed)
  const [activeModalTerm, setActiveModalTerm] = useState<string | null>(null);

  const isAllRequiredChecked = terms.term1 && terms.term2 && terms.term3;
  const isAllChecked = Object.values(terms).every((v) => v);

  // --- Review Data ---
  const reviews = [
    { text: t('review1Text'), author: t('review1Author'), initial: "K", color: "bg-green-500" },
    { text: t('review3Text'), author: t('review3Author'), initial: "P", color: "bg-blue-500" },
    { text: t('review2Text'), author: t('review2Author'), initial: "S", color: "bg-purple-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  // --- Handler Functions ---
  const KAKAO_LOGIN_URL = 'http://jobchaja.com:8000/auth/kakao';
  const GOOGLE_LOGIN_URL = 'http://jobchaja.com:8000/auth/google';

  // 1. Login Logic
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://jobchaja.com:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('loginFail'));
      }

      console.log('Login successful:', data);
      window.location.href = 'http://jobchaja.com';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // [Modified] 2. Auth Code Sending Request (Added Validation + Try/Catch)
  const handleSendAuthCode = async () => {
    // (1) Check for empty value
    if (!registerEmail) {
      alert(t('errEmailRequired')); // 'Please enter your email address'
      return;
    }

    // (2) Format check (Works now that validateEmail function exists)
    if (!validateEmail(registerEmail)) {
      alert(t('errEmailFormat')); // 'Invalid email format'
      return;
    }

    setAuthMsg(null);
    setIsLoading(true); // Start loading

   try {
      // 🔴 axios.post를 사용하여 Gateway(8000) 호출
      const response = await axios.post('http://jobchaja.com:8000/auth/send-otp', {
        email: registerEmail,
      });

      // axios는 결과가 response.data에 바로 담깁니다.
      setIsAuthSent(true);
      setAuthMsg(t('authSent'));
      
    } catch (error: any) {
      console.error(error);
      // 🔴 백엔드에서 보낸 에러 메시지(1분 제한 등) 추출
      const message = error.response?.data?.message || t('errAuthSendFail');
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Auth Code Verification Simulation
  const handleVerifyAuthCode = async () => {
    if (!authCode || authCode.length !== 6) {
      alert('인증번호 6자리를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://jobchaja.com:8000/auth/verify-otp', {
        email: registerEmail,
        code: authCode,
      });

      setIsAuthVerified(true);
      setAuthMsg('OK'); 
      alert('이메일 인증이 완료되었습니다.');
      
    } catch (error: any) {
      const message = error.response?.data?.message || '인증 실패';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Terms Change Handler
  const handleTermChange = (key: keyof typeof terms) => {
    setTerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAllTermsChange = (checked: boolean) => {
    setTerms({ term1: checked, term2: checked, term3: checked, term4: checked });
  };

  // 5. Registration Logic
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isAuthVerified) {
      setError(t('errAuth'));
      return;
    }
    if (registerPassword !== passwordConfirm) {
      setError(t('errPwMatch'));
      return;
    }
    if (!isAllRequiredChecked) {
      setError(t('errTerms'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://jobchaja.com:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          fullName: registerFullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('registerFail'));
      }

      console.log('Registration successful:', data);
      alert(t('registerSuccess'));
      setCurrentView('login');
      
      setRegisterFullName(''); setRegisterEmail(''); setRegisterPassword('');
      setAuthCode(''); setIsAuthSent(false); setIsAuthVerified(false);
      setTerms({ term1: false, term2: false, term3: false, term4: false });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 font-sans relative">
      
      {/* ================= Terms Modal (Layer Popup) ================= */}
      {activeModalTerm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModalTerm(null)} // Close on background click
        >
          <div 
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {t(activeModalTerm as any)}
              </h3>
              <button 
                onClick={() => setActiveModalTerm(null)} 
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                {/* Close Icon (Lucide X icon or text) */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            {/* Modal Content (Scrollable) */}
            <div className="p-6 overflow-y-auto text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {termContents[activeModalTerm] || "약관 내용이 없습니다."}
            </div>

          </div>
        </div>
      )}


      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[750px] relative transition-all duration-500">
        
        {/* --- LEFT SIDE --- */}
        <div className={`hidden md:flex md:w-1/2 relative flex-col justify-between p-12 text-white overflow-hidden transition-colors duration-700 ${currentView === 'signup' ? 'bg-sky-900' : 'bg-slate-900'}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-lg">✈</div>
              <span className="text-xl font-bold tracking-tight">{t('brand')}</span>
            </div>
          </div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-bold leading-tight" dangerouslySetInnerHTML={{ __html: currentView === 'signup' ? t('signupSlogan') : t('slogan') }} />
            <p className="text-slate-300 font-light text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: currentView === 'signup' ? t('signupSub') : t('subSlogan') }} />
            
            <div className="mt-8 bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10 flex items-center gap-4 h-[100px]">
              <div className={`w-10 h-10 rounded-full ${reviews[reviewIndex].color} flex items-center justify-center font-bold text-white text-sm shrink-0 transition-transform duration-500`}>
                {reviews[reviewIndex].initial}
              </div>
              <div className="flex flex-col overflow-hidden">
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
          
          <div className="absolute top-6 right-6 z-20">
             <LanguageSwitcher />
          </div>

          {/* ================= LOGIN VIEW ================= */}
          {currentView === 'login' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{t('welcome')}</h1>
                <p className="text-slate-500 text-sm">{t('welcomeSub')}</p>
              </div>

              <div className="flex p-1 bg-gray-100 rounded-xl mb-6 relative">
                <div className={`absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ${currentType === 'company' ? 'translate-x-[calc(100%+8px)]' : ''}`}></div>
                <button onClick={() => setCurrentType('seeker')} className={`relative z-10 w-1/2 py-3 text-sm font-bold ${currentType === 'seeker' ? 'text-slate-900' : 'text-slate-400'}`}>{t('tabSeeker')}</button>
                <button onClick={() => setCurrentType('company')} className={`relative z-10 w-1/2 py-3 text-sm font-bold ${currentType === 'company' ? 'text-slate-900' : 'text-slate-400'}`}>{t('tabCompany')}</button>
              </div>

              <form onSubmit={handleLogin} className="space-y-3 mb-4">
                <input 
                  type="email" 
                  placeholder={t('labelEmail')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input 
                  type="password" 
                  placeholder={t('pwPh')} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && <p className="text-xs text-red-500 text-center pt-1">{error}</p>}
                <Button type="submit" disabled={isLoading} className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg disabled:bg-slate-400">
                  {isLoading ? t('loginLoading') : t('btnLogin')}
                </Button>
              </form>

              <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
                <button onClick={() => setCurrentView('forgot-password')} className="hover:text-slate-800">{t('forgotPw')}</button>
                {currentType === 'seeker' ? (
                  <button onClick={() => { setError(null); setCurrentView('signup'); }} className="text-sky-600 font-bold hover:text-sky-700">{t('signupLink')}</button>
                ) : (
                  <Link href="/register" className="text-sky-600 font-bold hover:text-sky-700">{t('tabCompany').replace('🏢 ', '')} 가입</Link>
                )}
              </div>

              <div className="relative py-4 mb-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">{t('orSocial')}</span></div>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD835] text-[#3c1e1e] font-bold rounded-xl flex items-center justify-center gap-2 border-none">
                  <a href={KAKAO_LOGIN_URL}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C5.925 3 1 6.925 1 11.775c0 3.325 2.275 6.225 5.675 7.7-.2 1.45-1.125 4.125-1.3 4.8 0 0-.1.2.1.275.2.075.425.025.425.025 2.75-1.925 5.75-4.025 6.6-4.625.5.075 1.025.125 1.5.125 6.075 0 11-3.925 11-8.775S17.075 3 12 3z"/></svg>
                    {t('kakaoBtn')}
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full h-12 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2">
                  <a href={GOOGLE_LOGIN_URL}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    {t('googleBtn')}
                  </a>
                </Button>
              </div>
            </div>
          )}
          
          {/* ================= SIGN UP VIEW ================= */}
          {currentView === 'signup' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full overflow-y-auto">
              <button onClick={() => { setError(null); setCurrentView('login'); }} className="mb-4 text-slate-400 hover:text-slate-800 flex items-center gap-1 text-sm font-medium w-fit">
                {t('backLogin')}
              </button>
              
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{t('createAccount')}</h1>
              <p className="text-slate-500 text-sm mb-6">{t('createSub')}</p>
              
              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* 1. Basic Info Section */}
                <div className="space-y-3">
                    {/* Name */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">
                            {t('labelName')}
                        </label>
                        <input 
                          type="text" 
                          placeholder="Full Name (Passport Name)" 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm"
                          value={registerFullName}
                          onChange={(e) => setRegisterFullName(e.target.value)}
                        />
                    </div>

                    {/* Email & Auth Request */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">{t('labelEmail')}</label>
                        <div className="flex gap-2">
                            <input 
                              type="email" 
                              placeholder={t('emailPh')} 
                              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-500"
                              value={registerEmail}
                              onChange={(e) => setRegisterEmail(e.target.value)}
                              disabled={isAuthVerified}
                            />
                            <button 
                              type="button" 
                              onClick={handleSendAuthCode}
                              disabled={isAuthVerified}
                              className="px-3 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl whitespace-nowrap hover:bg-slate-800 transition-colors disabled:bg-slate-400"
                            >
                                {t('btnAuth')}
                            </button>
                        </div>
                        {authMsg && (
                           <p className={`text-xs mt-1 font-bold ${isAuthVerified ? 'text-sky-600' : 'text-green-600'}`}>
                             {authMsg}
                           </p>
                        )}
                    </div>

                    {/* Auth Code Input */}
                    {isAuthSent && !isAuthVerified && (
                        <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <input 
                              type="text" 
                              placeholder="123456" 
                              maxLength={6} 
                              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm text-center tracking-widest bg-slate-50"
                              value={authCode}
                              onChange={(e) => setAuthCode(e.target.value)}
                            />
                            <button 
                              type="button" 
                              onClick={handleVerifyAuthCode}
                              className="px-3 py-3 bg-sky-100 text-sky-700 text-xs font-bold rounded-xl whitespace-nowrap hover:bg-sky-200 transition-colors"
                            >
                                {t('btnConfirm')}
                            </button>
                        </div>
                    )}

                    {/* Password & Confirmation */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">{t('labelPw')}</label>
                        <input 
                          type="password" 
                          placeholder={t('pwRulePh')}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm mb-2"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                        />
                        <input 
                          type="password" 
                          placeholder={t('pwConfirmPh')}
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm ${
                            passwordConfirm && registerPassword !== passwordConfirm ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-sky-500'
                          }`}
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                         {passwordConfirm && registerPassword !== passwordConfirm && (
                           <p className="text-[10px] text-red-500 mt-1 ml-1">비밀번호가 일치하지 않습니다.</p>
                         )}
                    </div>
                </div>

                {/* 2. Terms Agreement Section (Modal Trigger) */}
                <div className="pt-4 border-t border-slate-100">
                    <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors mb-3">
                        <input 
                          type="checkbox" 
                          checked={isAllChecked}
                          onChange={(e) => handleAllTermsChange(e.target.checked)}
                          className="w-5 h-5 rounded border-slate-300 accent-sky-600"
                        />
                        <span className="text-sm font-bold text-slate-800">{t('agreeAll')}</span>
                    </label>
                    
                    <div className="space-y-2 px-2">
                        {[
                          { key: 'term1', label: t('term1') },
                          { key: 'term2', label: t('term2') },
                          { key: 'term3', label: t('term3') },
                          { key: 'term4', label: t('term4') }
                        ].map((term) => (
                          <div key={term.key} className="flex items-center justify-between">
                              <label className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={terms[term.key as keyof typeof terms]}
                                    onChange={() => handleTermChange(term.key as keyof typeof terms)}
                                    className="w-4 h-4 rounded border-slate-300 accent-sky-600"
                                  />
                                  <span className="text-xs text-slate-600">{term.label}</span>
                              </label>
                              {/* Changed to button opening modal instead of new window link */}
                              <button 
                                type="button"
                                onClick={() => setActiveModalTerm(term.key)}
                                className="text-xs text-slate-400 underline hover:text-slate-600 cursor-pointer p-1"
                              >
                                {t('view')}
                              </button>
                          </div>
                        ))} 
                    </div>
                </div>

                {error && <p className="text-xs text-red-500 text-center pt-1">{error}</p>}
                
                {/* Complete Registration Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading || !isAuthVerified || !isAllRequiredChecked || registerPassword !== passwordConfirm} 
                  className="w-full h-12 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl mt-4 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? t('registerLoading') : t('btnComplete')}
                </Button>
              </form>
            </div>
          )}

          {/* ================= FORGOT PASSWORD VIEW ================= */}
          {currentView === 'forgot-password' && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center justify-center h-full">
               <div className="w-full max-w-lg">
                   <button onClick={() => setCurrentView('login')} className="mb-8 text-slate-400 hover:text-slate-800 flex items-center gap-1 text-sm font-medium">
                     {t('backLogin')}
                   </button>
                   <div className="text-center mb-8">
                     <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔐</div>
                     <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('findPw')}</h1>
                     <p className="text-slate-500 text-sm px-8" dangerouslySetInnerHTML={{ __html: t('findPwSub') }} />
                   </div>
                   <div className="space-y-4 w-full">
                     <div>
                         <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">{t('labelEmail')}</label>
                         <input type="email" placeholder={t('labelEmail')} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm" />
                     </div>
                     <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg">
                         {t('btnSendLink')}
                     </Button>
                   </div>
               </div>
             </div>
          )}

          {/* Footer: Display only on Login View */}
          {currentView === 'login' && (
            <div className="mt-8 text-center text-[10px] text-slate-400 leading-relaxed">
              {t('termLoginPrefix')} <span className="underline cursor-pointer">{t('termService')}</span> {t('termAnd')} <span className="underline cursor-pointer">{t('termPrivacy')}</span>{t('termSuffix')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}