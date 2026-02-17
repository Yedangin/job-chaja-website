'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Share2,
  Save,
  Clock,
  Wallet,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Send,
  Link2,
  MessageCircle,
} from 'lucide-react';

// Mock 데이터 임포트 / Mock data import
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

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

// 메시지 타입 / Message type
interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  content: React.ReactNode;
  timestamp: string;
  type: 'text' | 'card' | 'carousel';
}

// 대화 단계 / Conversation step
type ConversationStep =
  | 'idle'
  | 'nationality'
  | 'age'
  | 'education'
  | 'fund'
  | 'goal'
  | 'priority'
  | 'analyzing'
  | 'result';

// ============================================================
// 유틸 함수 / Utility functions
// ============================================================

// 현재 시간 포맷 / Format current time
const formatTime = (): string => {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

// 점수에 따른 Tailwind 배경색 클래스 / Score-based Tailwind bg class
const getScoreBgClass = (score: number): string => {
  if (score >= 71) return 'bg-green-500';
  if (score >= 51) return 'bg-blue-500';
  if (score >= 31) return 'bg-amber-500';
  if (score >= 1) return 'bg-red-400';
  return 'bg-gray-400';
};

// 점수에 따른 텍스트색 클래스 / Score-based text color class
const getScoreTextClass = (score: number): string => {
  if (score >= 71) return 'text-green-600';
  if (score >= 51) return 'text-blue-600';
  if (score >= 31) return 'text-amber-600';
  if (score >= 1) return 'text-red-500';
  return 'text-gray-500';
};

// 비용 포맷 (만원 단위) / Cost format (10K KRW unit)
const formatCost = (costWon: number): string => {
  if (costWon === 0) return '무료';
  if (costWon >= 10000) return `${(costWon / 10000).toFixed(0)}억원`;
  return `${costWon.toLocaleString()}만원`;
};

// ============================================================
// 메인 페이지 컴포넌트 / Main page component
// ============================================================
export default function Diagnosis5Page() {
  // 상태 관리 / State management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<ConversationStep>('idle');
  const [inputData, setInputData] = useState<Partial<DiagnosisInput>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [ageText, setAgeText] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);

  // 자동 스크롤 / Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 대화 시작 / Initiate conversation
  useEffect(() => {
    const timer = setTimeout(() => {
      addBotMessage('안녕하세요! 잡차자 비자진단 봇이에요 🤖\n한국에서의 최적 비자 경로를 찾아드릴게요!');
      setTimeout(() => {
        addBotMessage('먼저 국적을 선택해주세요.');
        setStep('nationality');
      }, 800);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================
  // 메시지 추가 함수 / Message add functions
  // ============================================================

  // 새 메시지 ID 생성 / Generate new message ID
  const nextId = (): number => {
    msgIdRef.current += 1;
    return msgIdRef.current;
  };

  // 봇 메시지 추가 (타이핑 애니메이션 포함) / Add bot message with typing animation
  const addBotMessage = (content: React.ReactNode, type: 'text' | 'card' | 'carousel' = 'text') => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nextId(), sender: 'bot', content, timestamp: formatTime(), type },
      ]);
    }, 600);
  };

  // 유저 메시지 추가 / Add user message
  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), sender: 'user', content, timestamp: formatTime(), type: 'text' },
    ]);
  };

  // ============================================================
  // 선택 핸들러 / Selection handlers
  // ============================================================

  // 국적 선택 / Nationality selection
  const handleNationality = (code: string, label: string) => {
    addUserMessage(label);
    setInputData((prev) => ({ ...prev, nationality: code }));
    setTimeout(() => {
      addBotMessage('나이를 알려주세요. (숫자로 입력)');
      setStep('age');
    }, 300);
  };

  // 나이 입력 제출 / Age input submit
  const handleAgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(ageText, 10);
    if (isNaN(age) || age < 15 || age > 65) {
      addBotMessage('15세~65세 사이의 나이를 입력해주세요.');
      return;
    }
    addUserMessage(`${age}세`);
    setInputData((prev) => ({ ...prev, age }));
    setAgeText('');
    setTimeout(() => {
      addBotMessage('최종 학력을 선택해주세요.');
      setStep('education');
    }, 300);
  };

  // 학력 선택 / Education selection
  const handleEducation = (value: string, label: string) => {
    addUserMessage(label);
    setInputData((prev) => ({ ...prev, educationLevel: value }));
    setTimeout(() => {
      addBotMessage('연간 활용 가능한 자금을 선택해주세요.');
      setStep('fund');
    }, 300);
  };

  // 자금 선택 / Fund selection
  const handleFund = (value: number, label: string) => {
    addUserMessage(label);
    setInputData((prev) => ({ ...prev, availableAnnualFund: value }));
    setTimeout(() => {
      addBotMessage('한국에서의 최종 목표를 선택해주세요.');
      setStep('goal');
    }, 300);
  };

  // 목표 선택 / Goal selection
  const handleGoal = (value: string, label: string) => {
    addUserMessage(label);
    setInputData((prev) => ({ ...prev, finalGoal: value }));
    setTimeout(() => {
      addBotMessage('가장 중요하게 생각하는 우선순위를 선택해주세요.');
      setStep('priority');
    }, 300);
  };

  // 우선순위 선택 → 분석 시작 / Priority selection → Start analysis
  const handlePriority = (value: string, label: string) => {
    addUserMessage(label);
    setInputData((prev) => ({ ...prev, priorityPreference: value }));
    setStep('analyzing');
    setTimeout(() => {
      addBotMessage('입력하신 정보를 분석 중입니다... 잠시만 기다려주세요!');
      // 분석 시뮬레이션 / Simulate analysis
      setTimeout(() => {
        setResult(mockDiagnosisResult);
        addBotMessage(
          `분석이 완료되었어요!\n총 ${mockDiagnosisResult.meta.totalPathwaysEvaluated}개 경로를 평가하여 ${mockDiagnosisResult.pathways.length}개의 추천 경로를 찾았습니다.`
        );
        setTimeout(() => {
          setStep('result');
        }, 800);
      }, 2000);
    }, 300);
  };

  // 다시 시작 / Restart diagnosis
  const handleRestart = () => {
    setMessages([]);
    setStep('idle');
    setInputData({});
    setResult(null);
    setCarouselIndex(0);
    msgIdRef.current = 0;
    setTimeout(() => {
      addBotMessage('다시 시작할게요! 국적을 선택해주세요.');
      setStep('nationality');
    }, 300);
  };

  // ============================================================
  // 하단 버튼 그리드 렌더링 / Render bottom button grid
  // ============================================================
  const renderBottomButtons = () => {
    switch (step) {
      case 'nationality':
        return (
          <div className="grid grid-cols-3 gap-2 p-3">
            {popularCountries.map((c) => (
              <button
                key={c.code}
                onClick={() => handleNationality(c.code, `${c.flag} ${c.nameKo}`)}
                className="flex items-center justify-center gap-1 px-2 py-2.5 bg-white rounded-xl text-sm font-medium shadow-sm hover:bg-yellow-50 active:scale-95 transition-all border border-gray-100"
              >
                <span className="text-lg">{c.flag}</span>
                <span className="truncate">{c.nameKo}</span>
              </button>
            ))}
          </div>
        );

      case 'age':
        return (
          <form onSubmit={handleAgeSubmit} className="flex items-center gap-2 p-3">
            <input
              type="number"
              value={ageText}
              onChange={(e) => setAgeText(e.target.value)}
              placeholder="나이를 입력하세요 (예: 24)"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              min={15}
              max={65}
            />
            <button
              type="submit"
              className="p-3 bg-yellow-400 rounded-xl hover:bg-yellow-500 active:scale-95 transition-all"
            >
              <Send className="w-5 h-5 text-gray-800" />
            </button>
          </form>
        );

      case 'education':
        return (
          <div className="grid grid-cols-2 gap-2 p-3">
            {educationOptions.map((o) => (
              <button
                key={o.value}
                onClick={() => handleEducation(o.value, `${o.emoji} ${o.labelKo}`)}
                className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl text-sm font-medium shadow-sm hover:bg-yellow-50 active:scale-95 transition-all border border-gray-100"
              >
                <span>{o.emoji}</span>
                <span className="truncate">{o.labelKo}</span>
              </button>
            ))}
          </div>
        );

      case 'fund':
        return (
          <div className="grid grid-cols-2 gap-2 p-3">
            {fundOptions.map((o) => (
              <button
                key={o.bracket}
                onClick={() => handleFund(o.value, o.labelKo)}
                className="px-3 py-2.5 bg-white rounded-xl text-sm font-medium shadow-sm hover:bg-yellow-50 active:scale-95 transition-all border border-gray-100"
              >
                {o.labelKo}
              </button>
            ))}
          </div>
        );

      case 'goal':
        return (
          <div className="grid grid-cols-2 gap-2 p-3">
            {goalOptions.map((o) => (
              <button
                key={o.value}
                onClick={() => handleGoal(o.value, `${o.emoji} ${o.labelKo}`)}
                className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl text-sm font-medium shadow-sm hover:bg-yellow-50 active:scale-95 transition-all border border-gray-100"
              >
                <span className="text-lg">{o.emoji}</span>
                <div className="text-left">
                  <div className="font-semibold">{o.labelKo}</div>
                  <div className="text-xs text-gray-500">{o.descKo}</div>
                </div>
              </button>
            ))}
          </div>
        );

      case 'priority':
        return (
          <div className="grid grid-cols-2 gap-2 p-3">
            {priorityOptions.map((o) => (
              <button
                key={o.value}
                onClick={() => handlePriority(o.value, `${o.emoji} ${o.labelKo}`)}
                className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl text-sm font-medium shadow-sm hover:bg-yellow-50 active:scale-95 transition-all border border-gray-100"
              >
                <span className="text-lg">{o.emoji}</span>
                <div className="text-left">
                  <div className="font-semibold">{o.labelKo}</div>
                  <div className="text-xs text-gray-500">{o.descKo}</div>
                </div>
              </button>
            ))}
          </div>
        );

      case 'result':
        return (
          <div className="flex items-center gap-2 p-3">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-400 rounded-xl font-semibold text-gray-800 hover:bg-yellow-500 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              다시 진단하기
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all">
              <Share2 className="w-4 h-4" />
              공유하기
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all">
              <Save className="w-4 h-4" />
              저장하기
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================
  // 결과 캐러셀 카드 렌더링 / Render result carousel card
  // ============================================================
  const renderResultCarousel = () => {
    if (!result) return null;
    const pathways = result.pathways;
    const current = pathways[carouselIndex];
    if (!current) return null;

    return (
      <div className="w-full max-w-sm">
        {/* 카드 카운터 / Card counter */}
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs text-gray-500">
            {carouselIndex + 1} / {pathways.length}
          </span>
          <div className="flex gap-1">
            {pathways.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === carouselIndex ? 'bg-yellow-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 캐러셀 카드 / Carousel card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          {/* 카드 헤더 / Card header */}
          <div
            className="p-4"
            style={{ backgroundColor: getScoreColor(current.finalScore) + '15' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-500">{current.pathwayId}</span>
              <span className="text-lg">{getFeasibilityEmoji(current.feasibilityLabel)}</span>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">{current.nameKo}</h3>
            <p className="text-xs text-gray-500">{current.nameEn}</p>
          </div>

          {/* 점수 바 / Score bar */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">적합도 점수</span>
              <span
                className="text-lg font-bold"
                style={{ color: getScoreColor(current.finalScore) }}
              >
                {current.finalScore}점
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${current.finalScore}%`,
                  backgroundColor: getScoreColor(current.finalScore),
                }}
              />
            </div>
            <div className="text-right mt-0.5">
              <span
                className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                style={{ backgroundColor: getScoreColor(current.finalScore) }}
              >
                {current.feasibilityLabel}
              </span>
            </div>
          </div>

          {/* 상세 정보 / Detail info */}
          <div className="px-4 pb-3 space-y-2">
            <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" /> 예상 기간
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {current.estimatedMonths}개월
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Wallet className="w-3.5 h-3.5" /> 예상 비용
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {formatCost(current.estimatedCostWon)}
              </span>
            </div>

            {/* 비자 체인 / Visa chain */}
            <div className="pt-1">
              <span className="text-xs text-gray-500 mb-1.5 block">
                <Link2 className="w-3.5 h-3.5 inline mr-1" />
                비자 경로
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {current.visaChain.split(' \u2192 ').map((visa, i, arr) => (
                  <React.Fragment key={i}>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-md">
                      {visa}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="text-gray-400 text-xs">&#8594;</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* 비고 / Note */}
          {current.note && (
            <div className="px-4 pb-3">
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <MessageCircle className="w-3 h-3 inline mr-1" />
                  {current.note}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 네비게이션 버튼 / Navigation buttons */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setCarouselIndex((prev) => Math.max(0, prev - 1))}
            disabled={carouselIndex === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> 이전
          </button>
          <button
            onClick={() =>
              setCarouselIndex((prev) => Math.min(pathways.length - 1, prev + 1))
            }
            disabled={carouselIndex === pathways.length - 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50 active:scale-95 transition-all"
          >
            다음 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // ============================================================
  // 렌더링 / Render
  // ============================================================
  return (
    <div className="flex flex-col h-screen bg-[#B2C7D9]">
      {/* 헤더 / Header - 카카오톡 스타일 */}
      <header className="flex items-center gap-3 px-4 py-3 bg-[#4A6FA5] shadow-sm">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow">
          <span className="text-xl">🤖</span>
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-white">잡차자 비자진단 봇</h1>
          <p className="text-xs text-blue-200">JobChaJa Visa Diagnosis Bot</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-300">온라인</span>
        </div>
      </header>

      {/* 채팅 영역 / Chat area */}
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* 날짜 구분선 / Date divider */}
        <div className="flex items-center justify-center">
          <span className="px-3 py-1 bg-black/10 rounded-full text-xs text-gray-600">
            오늘
          </span>
        </div>

        {/* 메시지 목록 / Message list */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* 봇 아바타 / Bot avatar */}
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <span className="text-sm">🤖</span>
              </div>
            )}

            <div
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* 발신자 이름 / Sender name */}
              {msg.sender === 'bot' && (
                <span className="text-xs text-gray-600 mb-0.5 ml-1 font-medium">
                  잡차자 봇
                </span>
              )}

              {/* 말풍선 / Chat bubble */}
              <div className="flex items-end gap-1">
                {msg.sender === 'user' && (
                  <span className="text-[10px] text-gray-500 mb-0.5">{msg.timestamp}</span>
                )}
                <div
                  className={`max-w-[280px] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'bot'
                      ? 'bg-yellow-300 text-gray-900 rounded-2xl rounded-tl-sm shadow-sm'
                      : 'bg-white text-gray-900 rounded-2xl rounded-tr-sm shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.sender === 'bot' && (
                  <span className="text-[10px] text-gray-500 mb-0.5">{msg.timestamp}</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* 결과 캐러셀 카드 영역 / Result carousel area */}
        {step === 'result' && result && (
          <div className="flex gap-2 justify-start">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shrink-0 mt-1 shadow-sm">
              <span className="text-sm">🤖</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-600 mb-0.5 ml-1 font-medium">잡차자 봇</span>
              {renderResultCarousel()}
            </div>
          </div>
        )}

        {/* 타이핑 인디케이터 / Typing indicator */}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-sm">🤖</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-600 mb-0.5 ml-1 font-medium">잡차자 봇</span>
              <div className="bg-yellow-300 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 스크롤 앵커 / Scroll anchor */}
        <div ref={chatEndRef} />
      </main>

      {/* 하단 버튼/입력 영역 / Bottom button/input area */}
      <footer className="bg-[#EFF2F5] border-t border-gray-200 shadow-inner">
        {/* 분석 중 프로그레스 바 / Analysis progress bar */}
        {step === 'analyzing' && (
          <div className="p-4 text-center">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-yellow-400 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
            <p className="text-xs text-gray-500">비자 경로를 분석하고 있습니다...</p>
          </div>
        )}

        {/* 버튼 그리드 / Button grid */}
        {renderBottomButtons()}
      </footer>
    </div>
  );
}
