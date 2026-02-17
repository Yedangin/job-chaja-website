'use client';
// KOR: 틱톡 릴스 스타일 비자 진단 페이지 - 숏폼 영상 피드 UX
// ENG: TikTok Reels style visa diagnosis page - Short-form video feed UX

import React, { useState } from 'react';
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
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music2,
  ChevronUp,
  ChevronDown,
  Play,
  ArrowRight,
  Star,
  Zap,
  Clock,
  DollarSign,
  CheckCircle,
  X,
  ChevronLeft,
} from 'lucide-react';

// KOR: 현재 화면 상태를 나타내는 타입
// ENG: Type representing the current screen state
type ScreenType = 'feed' | 'input' | 'result';

// KOR: 인풋 단계 타입
// ENG: Input step type
type InputStep = 'nationality' | 'age' | 'education' | 'fund' | 'goal' | 'priority';

// KOR: 릴스 카드 데이터 타입
// ENG: Reels card data type
interface ReelCard {
  id: string;
  type: 'intro' | 'tip' | 'visa' | 'cta';
  title: string;
  subtitle: string;
  body: string;
  tag: string;
  color: [string, string]; // gradient colors
  emoji: string;
  likes: number;
  comments: number;
  music: string;
}

// KOR: 릴스 피드 목업 데이터
// ENG: Reels feed mock data
const reelCards: ReelCard[] = [
  {
    id: 'r1',
    type: 'intro',
    title: '내 비자 경로는?',
    subtitle: 'AI가 최적 경로를 찾아줍니다',
    body: '30초 진단으로 당신에게 맞는 한국 비자 경로를 알아보세요. 수천 명이 이미 성공했어요!',
    tag: '#비자진단 #잡차자',
    color: ['#010101', '#1a1a2e'],
    emoji: '🇰🇷',
    likes: 48200,
    comments: 1340,
    music: 'JobChaja Official - Visa Beat',
  },
  {
    id: 'r2',
    type: 'tip',
    title: 'E-7 전문인력',
    subtitle: '취업 비자의 핵심!',
    body: 'IT·엔지니어링·전문직 종사자를 위한 비자. 학사 이상 + 관련 경력 1년이면 도전 가능해요!',
    tag: '#E7비자 #취업비자',
    color: ['#0a0a0a', '#1a1a3e'],
    emoji: '💼',
    likes: 32100,
    comments: 892,
    music: 'TrendyKorea - Work Hard',
  },
  {
    id: 'r3',
    type: 'visa',
    title: 'D-2 유학 비자',
    subtitle: '공부하면서 미래를 열자',
    body: '한국 대학교 학위 과정 재학생을 위한 비자. 졸업 후 E-7, F-2 등으로 전환 가능!',
    tag: '#유학비자 #D2비자',
    color: ['#050510', '#0d1b2a'],
    emoji: '🎓',
    likes: 27600,
    comments: 743,
    music: 'StudyVibes - Korea University',
  },
  {
    id: 'r4',
    type: 'tip',
    title: 'F-2-7 점수제 거주',
    subtitle: '영주권 가는 최단 경로',
    body: '나이·학력·한국어·소득·사회통합 점수로 평가. 80점 이상이면 장기 거주 비자 획득!',
    tag: '#거주비자 #영주권',
    color: ['#0a0208', '#1a0a1f'],
    emoji: '🌟',
    likes: 41800,
    comments: 1156,
    music: 'DreamKorea - Stay Forever',
  },
  {
    id: 'r5',
    type: 'cta',
    title: '지금 바로 진단!',
    subtitle: '나에게 맞는 비자는?',
    body: '국적·나이·학력·예산·목표만 입력하면 AI가 최적의 비자 경로 3가지를 추천해드려요.',
    tag: '#무료진단 #잡차자',
    color: ['#020010', '#0d0020'],
    emoji: '✨',
    likes: 93400,
    comments: 2871,
    music: 'JobChaja - Diagnose Me',
  },
];

// KOR: 숫자를 K, M 단위로 포맷하는 함수
// ENG: Function to format numbers in K, M units
function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

// KOR: 단계 순서 배열
// ENG: Step order array
const INPUT_STEPS: InputStep[] = ['nationality', 'age', 'education', 'fund', 'goal', 'priority'];

export default function Diagnosis64Page() {
  // KOR: 현재 화면 상태
  // ENG: Current screen state
  const [screen, setScreen] = useState<ScreenType>('feed');

  // KOR: 현재 보이는 릴 인덱스
  // ENG: Currently visible reel index
  const [currentReel, setCurrentReel] = useState(0);

  // KOR: 좋아요 상태 추적
  // ENG: Like state tracking
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  // KOR: 북마크 상태 추적
  // ENG: Bookmark state tracking
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  // KOR: 입력 단계
  // ENG: Input step
  const [inputStep, setInputStep] = useState<number>(0);

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [userInput, setUserInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 결과 화면의 현재 경로 카드 인덱스
  // ENG: Current pathway card index in result screen
  const [resultIndex, setResultIndex] = useState(0);

  // KOR: 애니메이션 클래스 상태
  // ENG: Animation class state
  const [animDir, setAnimDir] = useState<'up' | 'down' | null>(null);

  // KOR: 현재 단계 키
  // ENG: Current step key
  const currentStepKey = INPUT_STEPS[inputStep];

  // KOR: 결과 데이터 (항상 mock 사용)
  // ENG: Result data (always use mock)
  const result: DiagnosisResult = {
    ...mockDiagnosisResult,
    userInput: { ...mockInput, ...userInput } as DiagnosisInput,
  };

  const pathways = result.pathways;

  // KOR: 릴 탐색 함수 (위/아래 스크롤)
  // ENG: Reel navigation function (up/down scroll)
  function navigateReel(dir: 'up' | 'down') {
    setAnimDir(dir);
    setTimeout(() => {
      setCurrentReel((prev) => {
        if (dir === 'up') return Math.max(0, prev - 1);
        return Math.min(reelCards.length - 1, prev + 1);
      });
      setAnimDir(null);
    }, 200);
  }

  // KOR: 결과 경로 탐색 함수
  // ENG: Result pathway navigation function
  function navigateResult(dir: 'up' | 'down') {
    setAnimDir(dir);
    setTimeout(() => {
      setResultIndex((prev) => {
        if (dir === 'up') return Math.max(0, prev - 1);
        return Math.min(pathways.length - 1, prev + 1);
      });
      setAnimDir(null);
    }, 200);
  }

  // KOR: 좋아요 토글
  // ENG: Toggle like
  function toggleLike(id: string) {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // KOR: 북마크 토글
  // ENG: Toggle bookmark
  function toggleBookmark(id: string) {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // KOR: 다음 입력 단계로 이동
  // ENG: Move to next input step
  function nextInputStep(value: string | number) {
    const key = currentStepKey;
    setUserInput((prev) => ({ ...prev, [key]: value }));
    if (inputStep < INPUT_STEPS.length - 1) {
      setInputStep((prev) => prev + 1);
    } else {
      // KOR: 모든 단계 완료 → 결과 화면
      // ENG: All steps complete → result screen
      setScreen('result');
    }
  }

  // KOR: 피드 화면 렌더링
  // ENG: Render feed screen
  if (screen === 'feed') {
    const reel = reelCards[currentReel];
    const isLiked = liked[reel.id] ?? false;
    const isBookmarked = bookmarked[reel.id] ?? false;

    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ background: '#000' }}
      >
        {/* KOR: 틱톡 스타일 풀스크린 컨테이너 */}
        {/* ENG: TikTok-style fullscreen container */}
        <div
          className="relative w-full max-w-sm mx-auto overflow-hidden"
          style={{ height: '100dvh', maxHeight: '100vh' }}
        >
          {/* KOR: 배경 그라디언트 카드 */}
          {/* ENG: Background gradient card */}
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              background: `linear-gradient(180deg, ${reel.color[0]} 0%, ${reel.color[1]} 50%, #000 100%)`,
              opacity: animDir ? 0 : 1,
            }}
          />

          {/* KOR: 상단 헤더 - 앱 타이틀 */}
          {/* ENG: Top header - app title */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-12 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg tracking-tight">잡차자</span>
              <span className="text-[#69C9D0] text-sm font-medium">비자진단</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#EE1D52] animate-pulse" />
              <span className="text-white text-xs font-medium">LIVE</span>
            </div>
          </div>

          {/* KOR: 중앙 콘텐츠 영역 */}
          {/* ENG: Center content area */}
          <div className="absolute inset-0 flex flex-col justify-end pb-24 px-4 z-10">
            {/* KOR: 이모지 + 태그 */}
            {/* ENG: Emoji + tag */}
            <div className="mb-4">
              <span className="text-5xl mb-3 block">{reel.emoji}</span>
              <span
                className="inline-block text-xs font-semibold px-2 py-1 rounded-full mb-2"
                style={{ background: 'rgba(105,201,208,0.15)', color: '#69C9D0', border: '1px solid rgba(105,201,208,0.3)' }}
              >
                {reel.tag}
              </span>
            </div>

            {/* KOR: 제목 + 부제목 */}
            {/* ENG: Title + subtitle */}
            <h1 className="text-white text-2xl font-extrabold leading-tight mb-1">
              {reel.title}
            </h1>
            <p
              className="text-sm font-semibold mb-2"
              style={{ color: '#EE1D52' }}
            >
              {reel.subtitle}
            </p>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              {reel.body}
            </p>

            {/* KOR: 뮤직 바 */}
            {/* ENG: Music bar */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full"
                style={{ background: 'linear-gradient(135deg, #EE1D52, #69C9D0)' }}
              >
                <Music2 size={14} className="text-white" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="whitespace-nowrap animate-[marquee_8s_linear_infinite] text-white/70 text-xs">
                  ♪ {reel.music} &nbsp;&nbsp;&nbsp;&nbsp; ♪ {reel.music}
                </div>
              </div>
              <div
                className="w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <Play size={10} className="text-white ml-0.5" />
              </div>
            </div>

            {/* KOR: CTA 버튼 (cta 타입이거나 마지막 릴일 때) */}
            {/* ENG: CTA button (for cta type or last reel) */}
            {(reel.type === 'cta' || currentReel === reelCards.length - 1) && (
              <button
                onClick={() => setScreen('input')}
                className="w-full py-3 rounded-2xl font-bold text-sm mt-2 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #EE1D52, #69C9D0)',
                  color: '#fff',
                  boxShadow: '0 4px 24px rgba(238,29,82,0.4)',
                }}
              >
                <Zap size={16} />
                무료 비자 진단 시작하기
                <ArrowRight size={16} />
              </button>
            )}
          </div>

          {/* KOR: 우측 액션 바 (좋아요, 댓글, 공유, 북마크) */}
          {/* ENG: Right action bar (like, comment, share, bookmark) */}
          <div className="absolute right-3 bottom-32 z-20 flex flex-col items-center gap-5">
            {/* KOR: 좋아요 버튼 */}
            {/* ENG: Like button */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => toggleLike(reel.id)}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <Heart
                  size={22}
                  fill={isLiked ? '#EE1D52' : 'none'}
                  stroke={isLiked ? '#EE1D52' : '#fff'}
                />
              </button>
              <span className="text-white text-xs font-semibold">
                {formatCount(reel.likes + (isLiked ? 1 : 0))}
              </span>
            </div>

            {/* KOR: 댓글 버튼 */}
            {/* ENG: Comment button */}
            <div className="flex flex-col items-center gap-1">
              <button
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <MessageCircle size={22} className="text-white" />
              </button>
              <span className="text-white text-xs font-semibold">
                {formatCount(reel.comments)}
              </span>
            </div>

            {/* KOR: 북마크 버튼 */}
            {/* ENG: Bookmark button */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => toggleBookmark(reel.id)}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <Bookmark
                  size={22}
                  fill={isBookmarked ? '#69C9D0' : 'none'}
                  stroke={isBookmarked ? '#69C9D0' : '#fff'}
                />
              </button>
              <span className="text-white text-xs font-semibold">저장</span>
            </div>

            {/* KOR: 공유 버튼 */}
            {/* ENG: Share button */}
            <div className="flex flex-col items-center gap-1">
              <button
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <Share2 size={22} className="text-white" />
              </button>
              <span className="text-white text-xs font-semibold">공유</span>
            </div>
          </div>

          {/* KOR: 위/아래 탐색 버튼 */}
          {/* ENG: Up/down navigation buttons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
            <button
              onClick={() => navigateReel('up')}
              disabled={currentReel === 0}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity"
              style={{
                background: 'rgba(255,255,255,0.1)',
                opacity: currentReel === 0 ? 0.3 : 1,
              }}
            >
              <ChevronUp size={18} className="text-white" />
            </button>
            <button
              onClick={() => navigateReel('down')}
              disabled={currentReel === reelCards.length - 1}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity"
              style={{
                background: 'rgba(255,255,255,0.1)',
                opacity: currentReel === reelCards.length - 1 ? 0.3 : 1,
              }}
            >
              <ChevronDown size={18} className="text-white" />
            </button>
          </div>

          {/* KOR: 인디케이터 점 */}
          {/* ENG: Indicator dots */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-20 flex gap-1.5">
            {reelCards.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentReel ? 16 : 6,
                  height: 6,
                  background: i === currentReel ? '#EE1D52' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>

          {/* KOR: 하단 탭 바 */}
          {/* ENG: Bottom tab bar */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-around py-2 pb-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
          >
            {['홈', '탐색', '진단', '알림', 'MY'].map((tab, i) => (
              <button
                key={tab}
                className="flex flex-col items-center gap-0.5 px-3 py-1"
                onClick={() => i === 2 && setScreen('input')}
              >
                {i === 2 ? (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #EE1D52, #69C9D0)' }}
                  >
                    <Zap size={16} className="text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                    <span className="text-white/50 text-xs">●</span>
                  </div>
                )}
                <span
                  className="text-xs font-medium"
                  style={{ color: i === 0 ? '#fff' : i === 2 ? '#EE1D52' : 'rgba(255,255,255,0.4)' }}
                >
                  {tab}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // KOR: 입력 화면 렌더링 (릴스 카드 스타일 입력)
  // ENG: Render input screen (reels card style input)
  if (screen === 'input') {
    const stepProgress = ((inputStep + 1) / INPUT_STEPS.length) * 100;

    // KOR: 현재 단계별 UI 렌더링
    // ENG: Render UI for each step
    function renderStepContent() {
      switch (currentStepKey) {
        case 'nationality':
          return (
            <div className="space-y-3">
              <p className="text-white/60 text-sm text-center mb-4">국적을 선택하세요</p>
              <div className="grid grid-cols-3 gap-2">
                {popularCountries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => nextInputStep(c.name)}
                    className="flex flex-col items-center gap-1 py-3 px-2 rounded-2xl transition-all duration-150 active:scale-95"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <span className="text-2xl">{c.flag}</span>
                    <span className="text-white/80 text-xs font-medium truncate w-full text-center">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );

        case 'age':
          return (
            <div className="space-y-4">
              <p className="text-white/60 text-sm text-center mb-2">나이를 입력하세요</p>
              <div className="grid grid-cols-4 gap-2">
                {[18, 20, 22, 24, 25, 27, 30, 35, 40, 45, 50, 55].map((a) => (
                  <button
                    key={a}
                    onClick={() => nextInputStep(a)}
                    className="py-3 rounded-2xl text-white font-bold text-sm transition-all duration-150 active:scale-95"
                    style={{
                      background: 'rgba(238,29,82,0.15)',
                      border: '1px solid rgba(238,29,82,0.3)',
                    }}
                  >
                    {a}세
                  </button>
                ))}
              </div>
            </div>
          );

        case 'education':
          return (
            <div className="space-y-3">
              <p className="text-white/60 text-sm text-center mb-2">최종 학력을 선택하세요</p>
              {educationOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => nextInputStep(opt)}
                  className="w-full py-3.5 px-4 rounded-2xl text-left text-white font-medium text-sm transition-all duration-150 active:scale-98 flex items-center gap-3"
                  style={{
                    background: 'rgba(105,201,208,0.1)',
                    border: '1px solid rgba(105,201,208,0.2)',
                  }}
                >
                  <span className="text-xl">🎓</span>
                  {opt}
                  <ArrowRight size={14} className="ml-auto text-white/40" />
                </button>
              ))}
            </div>
          );

        case 'fund':
          return (
            <div className="space-y-3">
              <p className="text-white/60 text-sm text-center mb-2">연간 가용 예산은?</p>
              {fundOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => nextInputStep(opt)}
                  className="w-full py-3.5 px-4 rounded-2xl text-left text-white font-medium text-sm transition-all duration-150 active:scale-98 flex items-center gap-3"
                  style={{
                    background: 'rgba(238,29,82,0.1)',
                    border: '1px solid rgba(238,29,82,0.2)',
                  }}
                >
                  <DollarSign size={18} className="text-[#EE1D52] shrink-0" />
                  {opt}
                  <ArrowRight size={14} className="ml-auto text-white/40" />
                </button>
              ))}
            </div>
          );

        case 'goal':
          return (
            <div className="space-y-3">
              <p className="text-white/60 text-sm text-center mb-2">한국에서의 최종 목표는?</p>
              {goalOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => nextInputStep(opt)}
                  className="w-full py-3.5 px-4 rounded-2xl text-left text-white font-medium text-sm transition-all duration-150 active:scale-98 flex items-center gap-3"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <Star size={18} className="text-yellow-400 shrink-0" />
                  {opt}
                  <ArrowRight size={14} className="ml-auto text-white/40" />
                </button>
              ))}
            </div>
          );

        case 'priority':
          return (
            <div className="space-y-3">
              <p className="text-white/60 text-sm text-center mb-2">가장 중요한 우선순위는?</p>
              {priorityOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => nextInputStep(opt)}
                  className="w-full py-3.5 px-4 rounded-2xl text-left text-white font-medium text-sm transition-all duration-150 active:scale-98 flex items-center gap-3"
                  style={{
                    background: 'rgba(105,201,208,0.1)',
                    border: '1px solid rgba(105,201,208,0.25)',
                  }}
                >
                  <Zap size={18} className="text-[#69C9D0] shrink-0" />
                  {opt}
                  <ArrowRight size={14} className="ml-auto text-white/40" />
                </button>
              ))}
            </div>
          );

        default:
          return null;
      }
    }

    // KOR: 단계별 제목 및 이모지
    // ENG: Step title and emoji per step
    const stepMeta: Record<InputStep, { title: string; emoji: string }> = {
      nationality: { title: '어느 나라에서 오셨나요?', emoji: '🌍' },
      age: { title: '현재 나이가 어떻게 되세요?', emoji: '🎂' },
      education: { title: '학력은 어떻게 되세요?', emoji: '🎓' },
      fund: { title: '연간 가용 예산은?', emoji: '💰' },
      goal: { title: '한국에서의 꿈은?', emoji: '⭐' },
      priority: { title: '가장 원하는 것은?', emoji: '🎯' },
    };

    const meta = stepMeta[currentStepKey];

    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#000' }}>
        <div
          className="relative w-full max-w-sm mx-auto overflow-hidden"
          style={{ height: '100dvh', maxHeight: '100vh' }}
        >
          {/* KOR: 배경 */}
          {/* ENG: Background */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, #0a0010 0%, #000 60%)' }}
          />

          {/* KOR: 상단 헤더 */}
          {/* ENG: Top header */}
          <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-12 pb-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  if (inputStep === 0) setScreen('feed');
                  else setInputStep((p) => p - 1);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <ChevronLeft size={18} className="text-white" />
              </button>
              <span className="text-white/60 text-sm font-medium">
                {inputStep + 1} / {INPUT_STEPS.length}
              </span>
              <button
                onClick={() => setScreen('feed')}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            {/* KOR: 프로그레스 바 */}
            {/* ENG: Progress bar */}
            <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${stepProgress}%`,
                  background: 'linear-gradient(90deg, #EE1D52, #69C9D0)',
                }}
              />
            </div>
          </div>

          {/* KOR: 메인 콘텐츠 */}
          {/* ENG: Main content */}
          <div className="absolute inset-0 flex flex-col justify-center px-5 pt-32 pb-12 z-10 overflow-y-auto">
            {/* KOR: 이모지 + 제목 */}
            {/* ENG: Emoji + title */}
            <div className="mb-6 text-center">
              <span className="text-5xl block mb-3">{meta.emoji}</span>
              <h2 className="text-white text-xl font-extrabold">{meta.title}</h2>
            </div>

            {/* KOR: 단계별 입력 UI */}
            {/* ENG: Step-specific input UI */}
            {renderStepContent()}
          </div>

          {/* KOR: 하단 뮤직 바 */}
          {/* ENG: Bottom music bar */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 px-4 py-3"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #EE1D52, #69C9D0)' }}
              >
                <Music2 size={13} className="text-white" />
              </div>
              <span className="text-white/50 text-xs">JobChaja - Find Your Visa</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // KOR: 결과 화면 렌더링 (릴스 스타일로 각 경로 카드를 스크롤)
  // ENG: Render result screen (scroll through each pathway card in reels style)
  const pathway = pathways[resultIndex];

  // KOR: 실현 가능성 색상 매핑
  // ENG: Feasibility color mapping
  const feasibilityColors: Record<string, string> = {
    '매우 높음': '#69C9D0',
    '높음': '#4ade80',
    '보통': '#facc15',
    '낮음': '#fb923c',
    '매우 낮음': '#EE1D52',
  };
  const feasColor = feasibilityColors[pathway.feasibilityLabel] ?? '#fff';

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#000' }}>
      <div
        className="relative w-full max-w-sm mx-auto overflow-hidden"
        style={{ height: '100dvh', maxHeight: '100vh' }}
      >
        {/* KOR: 결과 배경 */}
        {/* ENG: Result background */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: `linear-gradient(180deg, #050010 0%, #0a0020 40%, #000 100%)`,
            opacity: animDir ? 0 : 1,
          }}
        />

        {/* KOR: 상단 헤더 */}
        {/* ENG: Top header */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-12 pb-3 flex items-center justify-between">
          <button
            onClick={() => setScreen('feed')}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <X size={18} className="text-white" />
          </button>
          <div className="text-center">
            <span className="text-white font-bold text-sm">비자 진단 결과</span>
            <p className="text-white/40 text-xs">{resultIndex + 1} / {pathways.length}개 경로</p>
          </div>
          <button
            onClick={() => { setScreen('input'); setInputStep(0); setUserInput({}); }}
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(238,29,82,0.2)', color: '#EE1D52', border: '1px solid rgba(238,29,82,0.3)' }}
          >
            재진단
          </button>
        </div>

        {/* KOR: 메인 경로 카드 */}
        {/* ENG: Main pathway card */}
        <div
          className="absolute inset-0 flex flex-col justify-end pb-28 px-4 z-10 pt-28 overflow-y-auto"
          style={{ opacity: animDir ? 0 : 1, transition: 'opacity 0.2s' }}
        >
          {/* KOR: 점수 + 이모지 */}
          {/* ENG: Score + emoji */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{ background: `${feasColor}18`, border: `2px solid ${feasColor}40` }}
            >
              {getFeasibilityEmoji(pathway.feasibilityLabel)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-2xl font-black"
                  style={{ color: feasColor }}
                >
                  {pathway.feasibilityScore}점
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${feasColor}20`, color: feasColor }}
                >
                  {pathway.feasibilityLabel}
                </span>
              </div>
              <p className="text-white/40 text-xs">실현 가능성</p>
            </div>
          </div>

          {/* KOR: 경로 제목 */}
          {/* ENG: Pathway title */}
          <h2 className="text-white text-xl font-extrabold mb-1 leading-tight">
            {pathway.name}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            {pathway.description}
          </p>

          {/* KOR: 핵심 수치 카드 2개 */}
          {/* ENG: 2 key metric cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div
              className="rounded-2xl p-3 flex items-center gap-2"
              style={{ background: 'rgba(105,201,208,0.1)', border: '1px solid rgba(105,201,208,0.2)' }}
            >
              <Clock size={18} className="text-[#69C9D0] shrink-0" />
              <div>
                <p className="text-[#69C9D0] font-bold text-sm">{pathway.totalDurationMonths}개월</p>
                <p className="text-white/40 text-xs">예상 기간</p>
              </div>
            </div>
            <div
              className="rounded-2xl p-3 flex items-center gap-2"
              style={{ background: 'rgba(238,29,82,0.1)', border: '1px solid rgba(238,29,82,0.2)' }}
            >
              <DollarSign size={18} className="text-[#EE1D52] shrink-0" />
              <div>
                <p className="text-[#EE1D52] font-bold text-sm">${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</p>
                <p className="text-white/40 text-xs">예상 비용</p>
              </div>
            </div>
          </div>

          {/* KOR: 비자 체인 */}
          {/* ENG: Visa chain */}
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p className="text-white/50 text-xs font-semibold mb-3 uppercase tracking-wide">비자 경로</p>
            <div className="flex items-center gap-2 flex-wrap">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: 'rgba(105,201,208,0.2)', color: '#69C9D0' }}
                    >
                      {v.visa}
                    </span>
                    <span className="text-white/30 text-xs mt-1">{v.duration}</span>
                  </div>
                  {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ArrowRight size={14} className="text-white/30 shrink-0 mt-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* KOR: 마일스톤 */}
          {/* ENG: Milestones */}
          <div
            className="rounded-2xl p-4 mb-2"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-white/50 text-xs font-semibold mb-3 uppercase tracking-wide">주요 단계</p>
            <div className="space-y-3">
              {pathway.milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    {m.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight">{m.title}</p>
                    <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{m.description}</p>
                  </div>
                  <CheckCircle size={14} className="text-[#69C9D0] shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KOR: 우측 액션 바 */}
        {/* ENG: Right action bar */}
        <div className="absolute right-3 bottom-32 z-20 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <button
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(238,29,82,0.2)', border: '1px solid rgba(238,29,82,0.3)' }}
            >
              <Heart size={20} className="text-[#EE1D52]" />
            </button>
            <span className="text-white/50 text-xs">저장</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <Share2 size={20} className="text-white" />
            </button>
            <span className="text-white/50 text-xs">공유</span>
          </div>
        </div>

        {/* KOR: 위/아래 탐색 버튼 (경로 전환) */}
        {/* ENG: Up/down navigation buttons (switch pathways) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          <button
            onClick={() => navigateResult('up')}
            disabled={resultIndex === 0}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity"
            style={{
              background: 'rgba(255,255,255,0.1)',
              opacity: resultIndex === 0 ? 0.3 : 1,
            }}
          >
            <ChevronUp size={18} className="text-white" />
          </button>
          <button
            onClick={() => navigateResult('down')}
            disabled={resultIndex === pathways.length - 1}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity"
            style={{
              background: 'rgba(255,255,255,0.1)',
              opacity: resultIndex === pathways.length - 1 ? 0.3 : 1,
            }}
          >
            <ChevronDown size={18} className="text-white" />
          </button>
        </div>

        {/* KOR: 인디케이터 점 */}
        {/* ENG: Indicator dots */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-20 z-20 flex gap-1.5">
          {pathways.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === resultIndex ? 14 : 5,
                height: 5,
                background: i === resultIndex ? feasColor : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>

        {/* KOR: 하단 바 - 뮤직 + 진단 재시작 */}
        {/* ENG: Bottom bar - music + restart diagnosis */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #EE1D52, #69C9D0)' }}
            >
              <Music2 size={13} className="text-white" />
            </div>
            <span className="text-white/40 text-xs">JobChaja - Visa Found</span>
          </div>
          <button
            onClick={() => setScreen('feed')}
            className="text-xs font-bold px-4 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #EE1D52, #69C9D0)',
              color: '#fff',
            }}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
