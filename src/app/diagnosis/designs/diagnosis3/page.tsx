'use client';

import { useState, useEffect, useRef } from 'react';
import {
  popularCountries,
  educationOptions,
  goalOptions,
  priorityOptions,
  fundOptions,
  mockDiagnosisResult,
  mockInput,
  DiagnosisInput,
  DiagnosisResult,
  RecommendedPathway,
  getScoreColor,
  getFeasibilityEmoji,
  mockPathways,
  CompatPathway,
} from '../_mock/diagnosis-mock-data';
import {
  User,
  Bot,
  Clock,
  GraduationCap,
  Wallet,
  Target,
  Trophy,
  FileText,
  Download,
  CheckCircle,
  BarChart2,
  DollarSign,
  Route,
  Sparkles,
  ArrowRight,
  Landmark,
  Globe,
  Calendar,
  Shield,
  ChevronDown,
  ChevronUp,
  Star,
  MapPin,
} from 'lucide-react';

// ============================================================
// 채팅 메시지 타입 / Chat message type
// ============================================================
interface ChatMessage {
  sender: 'ai' | 'user';
  content: React.ReactNode;
  timestamp: string;
}

// ============================================================
// 상담 단계 타입 / Consultation step type
// ============================================================
interface ConsultationStep {
  id: number;
  name: string;
  nameEn: string;
  icon: React.ReactNode;
}

// ============================================================
// 메인 페이지 컴포넌트 / Main page component
// ============================================================
export default function Diagnosis3Page() {
  // 사용자 입력 데이터 / User input data
  const [userInput, setUserInput] = useState<Partial<DiagnosisInput>>({});
  // 현재 상담 단계 / Current consultation step
  const [currentStep, setCurrentStep] = useState<number>(0);
  // 채팅 메시지 목록 / Chat message list
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // 결과 화면 표시 여부 / Show result screen
  const [showResult, setShowResult] = useState<boolean>(false);
  // AI 입력 중 표시 / AI typing indicator
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  // 결과 경로 펼침 상태 / Expanded pathway cards
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  // 분석 로딩 상태 / Analysis loading state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 상담 타임라인 단계 / Consultation timeline steps
  const steps: ConsultationStep[] = [
    { id: 0, name: '상담 시작', nameEn: 'Start', icon: <Sparkles size={16} /> },
    { id: 1, name: '국적', nameEn: 'Nationality', icon: <Globe size={16} /> },
    { id: 2, name: '나이', nameEn: 'Age', icon: <User size={16} /> },
    { id: 3, name: '학력', nameEn: 'Education', icon: <GraduationCap size={16} /> },
    { id: 4, name: '자금', nameEn: 'Funds', icon: <Wallet size={16} /> },
    { id: 5, name: '목표', nameEn: 'Goal', icon: <Target size={16} /> },
    { id: 6, name: '우선순위', nameEn: 'Priority', icon: <Trophy size={16} /> },
    { id: 7, name: '분석 중', nameEn: 'Analyzing', icon: <BarChart2 size={16} /> },
  ];

  // 현재 시간 포맷 / Format current time
  const getTimestamp = (): string => {
    return new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // AI 메시지 추가 / Add AI message
  const addAiMessage = (content: React.ReactNode, delay: number = 600) => {
    setIsAiTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', content, timestamp: getTimestamp() },
      ]);
      setIsAiTyping(false);
    }, delay);
  };

  // 유저 메시지 추가 / Add user message
  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        content: <p>{text}</p>,
        timestamp: getTimestamp(),
      },
    ]);
  };

  // 메시지 스크롤 / Scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // 단계별 AI 질문 / Step-based AI questions
  useEffect(() => {
    if (currentStep === 0) {
      // 인사 메시지 / Greeting message
      addAiMessage(
        <div>
          <p className="font-semibold text-yellow-300">
            안녕하세요! 잡차자 AI 이민 전문 상담사입니다.
          </p>
          <p className="mt-1 text-sm text-blue-200">
            Hello! I am JobChaJa AI Immigration Specialist.
          </p>
          <p className="mt-2 text-sm">
            몇 가지 질문을 통해 귀하에게 최적의 비자 경로를 분석해드리겠습니다.
            준비되셨으면 시작 버튼을 눌러주세요.
          </p>
          <button
            onClick={() => {
              addUserMessage('상담을 시작하겠습니다.');
              setCurrentStep(1);
            }}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-bold text-blue-950 shadow-lg transition-all hover:bg-yellow-400 hover:scale-105"
          >
            상담 시작하기 <ArrowRight size={16} />
          </button>
        </div>,
        800,
      );
    } else if (currentStep === 1) {
      // 국적 질문 / Nationality question
      addAiMessage(
        <div>
          <p className="font-semibold">어느 나라 국적을 가지고 계신가요?</p>
          <p className="text-xs text-blue-300">What is your nationality?</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {popularCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleNationalitySelect(country.code, country.nameKo)}
                className="rounded-lg border border-blue-600/50 bg-blue-800/60 p-2 text-sm text-white transition-all hover:border-yellow-500 hover:bg-blue-700"
              >
                {country.flag} {country.nameKo}
              </button>
            ))}
          </div>
        </div>,
      );
    } else if (currentStep === 2) {
      // 나이 질문 / Age question
      addAiMessage(
        <div>
          <p className="font-semibold">만 나이가 어떻게 되시나요?</p>
          <p className="text-xs text-blue-300">How old are you?</p>
          <div className="mt-3 flex items-center gap-2">
            <input
              id="age-input"
              type="number"
              min={16}
              max={65}
              placeholder="예: 28"
              className="w-24 rounded-lg border border-blue-600/50 bg-blue-800/60 px-3 py-2 text-white placeholder-blue-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = parseInt((e.target as HTMLInputElement).value);
                  if (!isNaN(val) && val >= 16 && val <= 65) {
                    handleAgeSelect(val);
                  }
                }
              }}
            />
            <span className="text-sm text-blue-300">세</span>
            <button
              onClick={() => {
                const el = document.getElementById('age-input') as HTMLInputElement | null;
                if (el) {
                  const val = parseInt(el.value);
                  if (!isNaN(val) && val >= 16 && val <= 65) {
                    handleAgeSelect(val);
                  }
                }
              }}
              className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-blue-950 transition-all hover:bg-yellow-400"
            >
              확인
            </button>
          </div>
        </div>,
      );
    } else if (currentStep === 3) {
      // 학력 질문 / Education question
      addAiMessage(
        <div>
          <p className="font-semibold">최종 학력이 어떻게 되시나요?</p>
          <p className="text-xs text-blue-300">What is your highest education level?</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {educationOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleEducationSelect(opt.value, opt.labelKo)}
                className="rounded-lg border border-blue-600/50 bg-blue-800/60 p-2.5 text-left text-sm text-white transition-all hover:border-yellow-500 hover:bg-blue-700"
              >
                {opt.emoji} {opt.labelKo}
                <span className="ml-1 text-xs text-blue-300">({opt.labelEn})</span>
              </button>
            ))}
          </div>
        </div>,
      );
    } else if (currentStep === 4) {
      // 자금 질문 / Fund question
      addAiMessage(
        <div>
          <p className="font-semibold">연간 가용 자금은 어느 정도이신가요?</p>
          <p className="text-xs text-blue-300">What is your available annual fund?</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {fundOptions.map((opt) => (
              <button
                key={opt.bracket}
                onClick={() => handleFundSelect(opt.value, opt.labelKo)}
                className="rounded-lg border border-blue-600/50 bg-blue-800/60 p-2.5 text-left text-sm text-white transition-all hover:border-yellow-500 hover:bg-blue-700"
              >
                <DollarSign size={14} className="mr-1 inline text-yellow-400" />
                {opt.labelKo}
              </button>
            ))}
          </div>
        </div>,
      );
    } else if (currentStep === 5) {
      // 목표 질문 / Goal question
      addAiMessage(
        <div>
          <p className="font-semibold">한국에서의 최종 목표는 무엇인가요?</p>
          <p className="text-xs text-blue-300">What is your final goal in Korea?</p>
          <div className="mt-3 flex flex-col gap-2">
            {goalOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleGoalSelect(opt.value, opt.labelKo)}
                className="flex items-center gap-3 rounded-lg border border-blue-600/50 bg-blue-800/60 p-3 text-left text-sm text-white transition-all hover:border-yellow-500 hover:bg-blue-700"
              >
                <span className="text-xl">{opt.emoji}</span>
                <div>
                  <p className="font-medium">{opt.labelKo}</p>
                  <p className="text-xs text-blue-300">{opt.descKo}</p>
                </div>
              </button>
            ))}
          </div>
        </div>,
      );
    } else if (currentStep === 6) {
      // 우선순위 질문 / Priority question
      addAiMessage(
        <div>
          <p className="font-semibold">비자 경로에서 가장 중요하게 생각하시는 점은?</p>
          <p className="text-xs text-blue-300">What is your top priority for the visa pathway?</p>
          <div className="mt-3 flex flex-col gap-2">
            {priorityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handlePrioritySelect(opt.value, opt.labelKo)}
                className="flex items-center gap-3 rounded-lg border border-blue-600/50 bg-blue-800/60 p-3 text-left text-sm text-white transition-all hover:border-yellow-500 hover:bg-blue-700"
              >
                <span className="text-xl">{opt.emoji}</span>
                <div>
                  <p className="font-medium">{opt.labelKo}</p>
                  <p className="text-xs text-blue-300">{opt.descKo}</p>
                </div>
              </button>
            ))}
          </div>
        </div>,
      );
    } else if (currentStep === 7) {
      // 분석 중 메시지 / Analyzing message
      setIsAnalyzing(true);
      addAiMessage(
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
          <div>
            <p className="font-semibold">모든 정보를 바탕으로 최적 경로를 분석 중입니다...</p>
            <p className="text-xs text-blue-300">Analyzing optimal pathways based on your information...</p>
          </div>
        </div>,
        800,
      );
      // 3초 후 결과 표시 / Show result after 3 seconds
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResult(true);
      }, 3500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // ============================================================
  // 선택 핸들러들 / Selection handlers
  // ============================================================

  const handleNationalitySelect = (code: string, nameKo: string) => {
    setUserInput((prev) => ({ ...prev, nationality: code }));
    addUserMessage(`${nameKo} (${code})`);
    setTimeout(() => setCurrentStep(2), 300);
  };

  const handleAgeSelect = (age: number) => {
    setUserInput((prev) => ({ ...prev, age }));
    addUserMessage(`${age}세`);
    setTimeout(() => setCurrentStep(3), 300);
  };

  const handleEducationSelect = (value: string, labelKo: string) => {
    setUserInput((prev) => ({ ...prev, educationLevel: value }));
    addUserMessage(labelKo);
    setTimeout(() => setCurrentStep(4), 300);
  };

  const handleFundSelect = (value: number, labelKo: string) => {
    setUserInput((prev) => ({ ...prev, availableAnnualFund: value }));
    addUserMessage(labelKo);
    setTimeout(() => setCurrentStep(5), 300);
  };

  const handleGoalSelect = (value: string, labelKo: string) => {
    setUserInput((prev) => ({ ...prev, finalGoal: value }));
    addUserMessage(labelKo);
    setTimeout(() => setCurrentStep(6), 300);
  };

  const handlePrioritySelect = (value: string, labelKo: string) => {
    setUserInput((prev) => ({ ...prev, priorityPreference: value }));
    addUserMessage(labelKo);
    setTimeout(() => setCurrentStep(7), 300);
  };

  // 카드 펼침/접힘 토글 / Toggle card expand/collapse
  const toggleCard = (pathwayId: string) => {
    setExpandedCards((prev) => ({ ...prev, [pathwayId]: !prev[pathwayId] }));
  };

  // 입력값에서 한글 라벨 찾기 / Find Korean label from input value
  const getCountryName = (): string => {
    const c = popularCountries.find((x) => x.code === userInput.nationality);
    return c ? `${c.flag} ${c.nameKo}` : '-';
  };
  const getEducationLabel = (): string => {
    const e = educationOptions.find((x) => x.value === userInput.educationLevel);
    return e ? e.labelKo : '-';
  };
  const getFundLabel = (): string => {
    const f = fundOptions.find((x) => x.value === userInput.availableAnnualFund);
    return f ? f.labelKo : '-';
  };
  const getGoalLabel = (): string => {
    const g = goalOptions.find((x) => x.value === userInput.finalGoal);
    return g ? `${g.emoji} ${g.labelKo}` : '-';
  };
  const getPriorityLabel = (): string => {
    const p = priorityOptions.find((x) => x.value === userInput.priorityPreference);
    return p ? `${p.emoji} ${p.labelKo}` : '-';
  };

  // ============================================================
  // 상담 화면 렌더링 / Render consultation screen
  // ============================================================
  const renderConsultation = () => (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white">
      {/* 좌측 타임라인 사이드바 / Left timeline sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-blue-800/50 bg-blue-950/60 p-6 lg:flex">
        {/* 상담사 미니 프로필 / Counselor mini profile */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-lg font-bold text-blue-950">
              AI
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-blue-950 bg-green-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">AI 상담사</p>
            <p className="text-xs text-yellow-400">Online</p>
          </div>
        </div>

        {/* 타임라인 진행 표시 / Timeline progress */}
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-yellow-500">
          상담 진행
        </h3>
        <p className="mb-4 text-[10px] text-blue-400">Consultation Progress</p>
        <nav className="flex flex-col gap-1">
          {steps.map((s, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={s.id} className="flex items-center gap-3">
                {/* 타임라인 라인 + 노드 / Timeline line + node */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
                      isCompleted
                        ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400'
                        : isCurrent
                          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500 shadow-lg shadow-yellow-500/20'
                          : 'border-blue-700 text-blue-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle size={14} /> : s.icon}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-4 w-0.5 ${
                        isCompleted ? 'bg-yellow-400/50' : 'bg-blue-800'
                      }`}
                    />
                  )}
                </div>
                <div>
                  <p
                    className={`text-xs font-medium ${
                      isCompleted
                        ? 'text-yellow-400'
                        : isCurrent
                          ? 'text-white'
                          : 'text-blue-500'
                    }`}
                  >
                    {s.name}
                  </p>
                  <p className="text-[10px] text-blue-600">{s.nameEn}</p>
                </div>
              </div>
            );
          })}
        </nav>

        {/* 진행률 바 / Progress bar */}
        <div className="mt-6">
          <div className="mb-1 flex justify-between text-[10px] text-blue-400">
            <span>진행률</span>
            <span>{Math.round((currentStep / (steps.length - 1)) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-blue-800">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </aside>

      {/* 메인 채팅 영역 / Main chat area */}
      <main className="flex flex-1 flex-col">
        {/* 상단 상담사 프로필 카드 / Top counselor profile card */}
        <header className="border-b border-blue-800/50 bg-blue-950/40 p-4">
          <div className="mx-auto flex max-w-3xl items-center gap-4">
            {/* 비디오 프레임 스타일 아바타 / Video-frame style avatar */}
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-yellow-500/50 bg-gradient-to-br from-blue-900 to-blue-800 shadow-lg shadow-yellow-500/10">
                <Bot size={32} className="text-yellow-400" />
              </div>
              {/* 라이브 표시 / Live indicator */}
              <div className="absolute -right-1 -top-1 flex items-center gap-1 rounded-full bg-green-500 px-1.5 py-0.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                <span className="text-[8px] font-bold text-white">LIVE</span>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AI 비자 전문 상담사</h1>
              <p className="text-xs text-yellow-400">AI Visa Specialist Counselor</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-blue-800/60 px-2 py-0.5 text-[10px] text-blue-300">
                  <Shield size={10} /> 자격번호 AI-VISA-2024-001
                </span>
                <span className="flex items-center gap-1 rounded-full bg-blue-800/60 px-2 py-0.5 text-[10px] text-blue-300">
                  <Star size={10} className="text-yellow-400" /> 4.9 (1,247 상담)
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 채팅 메시지 영역 / Chat message area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* AI 아바타 / AI avatar */}
                {msg.sender === 'ai' && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600">
                    <Bot size={16} className="text-blue-950" />
                  </div>
                )}
                {/* 메시지 버블 / Message bubble */}
                <div
                  className={`max-w-sm rounded-2xl px-4 py-3 shadow-md sm:max-w-md ${
                    msg.sender === 'ai'
                      ? 'rounded-bl-sm bg-blue-800/80 backdrop-blur-sm'
                      : 'rounded-br-sm bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-950'
                  }`}
                >
                  <div className="text-sm">{msg.content}</div>
                  <div
                    className={`mt-1 text-right text-[10px] ${
                      msg.sender === 'ai' ? 'text-blue-400' : 'text-blue-900/60'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {/* 유저 아바타 / User avatar */}
                {msg.sender === 'user' && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-700">
                    <User size={16} className="text-blue-200" />
                  </div>
                )}
              </div>
            ))}

            {/* AI 타이핑 인디케이터 / AI typing indicator */}
            {isAiTyping && (
              <div className="flex items-end gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600">
                  <Bot size={16} className="text-blue-950" />
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-blue-800/80 px-4 py-3 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-yellow-400" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-yellow-400" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-yellow-400" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* 모바일 단계 표시 / Mobile step indicator */}
        <div className="border-t border-blue-800/50 bg-blue-950/40 p-3 lg:hidden">
          <div className="flex items-center justify-between text-xs text-blue-400">
            <span>
              단계 {currentStep + 1} / {steps.length}
            </span>
            <div className="h-1 w-32 overflow-hidden rounded-full bg-blue-800">
              <div
                className="h-full rounded-full bg-yellow-500 transition-all duration-500"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // ============================================================
  // 결과 리포트 렌더링 / Render result report
  // ============================================================
  const renderResult = () => (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        {/* 리포트 컨테이너 (PDF 스타일) / Report container (PDF style) */}
        <div className="overflow-hidden rounded-lg bg-white shadow-2xl">
          {/* 리포트 헤더 / Report header */}
          <div className="bg-gradient-to-r from-blue-950 to-blue-900 p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <FileText size={24} className="text-yellow-400" />
                  <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs font-semibold text-yellow-400">
                    CONFIDENTIAL
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  AI 비자 진단 리포트
                </h1>
                <p className="mt-1 text-sm text-blue-300">
                  AI Visa Diagnosis Report
                </p>
              </div>
              <Sparkles size={36} className="text-yellow-500" />
            </div>

            {/* 리포트 메타 정보 / Report meta info */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-blue-900/50 p-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs text-blue-400">발급일 / Date</p>
                <p className="font-medium text-white">
                  {new Date().toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-400">리포트 ID</p>
                <p className="font-medium text-white">
                  RPT-{Date.now().toString().slice(-8)}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-400">분석 경로 수</p>
                <p className="font-medium text-white">
                  {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 평가 / {mockDiagnosisResult.pathways.length}개 추천
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-400">상담사 / Counselor</p>
                <p className="font-medium text-white">AI 비자 전문 상담사</p>
              </div>
            </div>
          </div>

          {/* 상담 요약 / Consultation summary */}
          <div className="border-b border-gray-200 p-6 sm:p-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-950">
              <User size={20} className="text-yellow-500" />
              상담 요약 (Consultation Summary)
            </h2>
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs text-gray-500">국적 / Nationality</p>
                <p className="font-medium text-gray-900">{getCountryName()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">나이 / Age</p>
                <p className="font-medium text-gray-900">{userInput.age ?? '-'}세</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">학력 / Education</p>
                <p className="font-medium text-gray-900">{getEducationLabel()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">연간 자금 / Annual Fund</p>
                <p className="font-medium text-gray-900">{getFundLabel()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">목표 / Goal</p>
                <p className="font-medium text-gray-900">{getGoalLabel()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">우선순위 / Priority</p>
                <p className="font-medium text-gray-900">{getPriorityLabel()}</p>
              </div>
            </div>
          </div>

          {/* 추천 비자 경로 / Recommended visa pathways */}
          <div className="p-6 sm:p-8">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-blue-950">
              <Route size={20} className="text-yellow-500" />
              추천 비자 경로 (Recommended Visa Pathways)
            </h2>

            <div className="space-y-4">
              {mockDiagnosisResult.pathways.map(
                (pathway: RecommendedPathway, index: number) => {
                  const isExpanded = expandedCards[pathway.pathwayId] ?? false;
                  const scoreColor = getScoreColor(pathway.finalScore);
                  const feasEmoji = getFeasibilityEmoji(pathway.feasibilityLabel);

                  return (
                    <div
                      key={pathway.pathwayId}
                      className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg"
                    >
                      {/* 경로 카드 헤더 / Pathway card header */}
                      <button
                        onClick={() => toggleCard(pathway.pathwayId)}
                        className="flex w-full items-center justify-between bg-gradient-to-r from-blue-950 to-blue-900 p-4 text-left text-white transition-all hover:from-blue-900 hover:to-blue-800"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                            style={{ backgroundColor: scoreColor + '30', color: scoreColor }}
                          >
                            #{index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold">{pathway.nameKo}</h3>
                            <p className="text-xs text-blue-300">{pathway.nameEn}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {/* 점수 배지 / Score badge */}
                          <div
                            className="rounded-full px-3 py-1 text-sm font-bold"
                            style={{ backgroundColor: scoreColor + '30', color: scoreColor }}
                          >
                            {pathway.finalScore}점
                          </div>
                          {isExpanded ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </div>
                      </button>

                      {/* 경로 카드 요약 (항상 표시) / Pathway summary (always shown) */}
                      <div className="grid grid-cols-2 gap-3 border-b border-gray-100 bg-gray-50 p-4 sm:grid-cols-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">실현 가능성</p>
                          <p className="mt-1 font-semibold text-gray-800">
                            {feasEmoji} {pathway.feasibilityLabel}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">예상 기간</p>
                          <p className="mt-1 font-semibold text-gray-800">
                            {pathway.estimatedMonths}개월
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">예상 비용</p>
                          <p className="mt-1 font-semibold text-gray-800">
                            {pathway.estimatedCostWon === 0
                              ? '무료'
                              : `${pathway.estimatedCostWon.toLocaleString()}만원`}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">비자 체인</p>
                          <p className="mt-1 text-xs font-semibold text-blue-700">
                            {pathway.visaChain}
                          </p>
                        </div>
                      </div>

                      {/* 경로 상세 (펼침) / Pathway detail (expanded) */}
                      {isExpanded && (
                        <div className="p-4">
                          {/* 마일스톤 타임라인 / Milestone timeline */}
                          <h4 className="mb-3 text-sm font-bold text-gray-700">
                            <Calendar size={14} className="mr-1 inline" />
                            마일스톤 타임라인 (Milestone Timeline)
                          </h4>
                          <div className="mb-4 space-y-3">
                            {pathway.milestones.map((ms, mIdx) => (
                              <div key={mIdx} className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                      ms.type === 'final_goal'
                                        ? 'bg-yellow-500 text-blue-950'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}
                                  >
                                    {ms.order}
                                  </div>
                                  {mIdx < pathway.milestones.length - 1 && (
                                    <div className="h-6 w-0.5 bg-gray-200" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-gray-800">
                                      {ms.nameKo}
                                    </p>
                                    {ms.visaStatus !== 'none' && (
                                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                                        {ms.visaStatus}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {ms.monthFromStart}개월 후
                                    {ms.canWorkPartTime &&
                                      ` | 주 ${ms.weeklyHours > 0 ? ms.weeklyHours + '시간' : '제한없음'} 근무 가능`}
                                    {ms.estimatedMonthlyIncome > 0 &&
                                      ` | 예상 월 ${ms.estimatedMonthlyIncome}만원`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* 다음 단계 / Next steps */}
                          {pathway.nextSteps.length > 0 && (
                            <div className="rounded-lg bg-yellow-50 p-3">
                              <h4 className="mb-2 text-sm font-bold text-yellow-800">
                                <ArrowRight size={14} className="mr-1 inline" />
                                다음 단계 (Next Steps)
                              </h4>
                              <ul className="space-y-1">
                                {pathway.nextSteps.map((ns, nsIdx) => (
                                  <li key={nsIdx} className="text-sm text-yellow-900">
                                    <span className="font-medium">{ns.nameKo}</span>
                                    <span className="ml-1 text-xs text-yellow-700">
                                      — {ns.description}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* 참고사항 / Note */}
                          {pathway.note && (
                            <p className="mt-3 text-xs text-gray-500">
                              * {pathway.note}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* 리포트 하단 / Report footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-6 sm:p-8">
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-600">
                본 리포트는 AI 기반 분석 결과이며, 실제 비자 심사 결과와 다를 수 있습니다.
              </p>
              <p className="text-xs text-gray-400">
                This report is AI-based analysis and may differ from actual visa assessment results.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 font-bold text-blue-950 shadow-lg transition-all hover:from-yellow-400 hover:to-yellow-500 hover:shadow-xl">
                <Download size={18} />
                리포트 저장하기 (Save Report)
              </button>
              <button
                onClick={() => {
                  setShowResult(false);
                  setCurrentStep(0);
                  setMessages([]);
                  setUserInput({});
                  setExpandedCards({});
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-900 px-6 py-3 font-medium text-blue-900 transition-all hover:bg-blue-50"
              >
                다시 상담하기 (Restart)
              </button>
            </div>
          </div>
        </div>

        {/* 저작권 / Copyright */}
        <p className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} JobChaJa. All rights reserved.
        </p>
      </div>
    </div>
  );

  // ============================================================
  // 메인 렌더 / Main render
  // ============================================================
  return showResult ? renderResult() : renderConsultation();
}
