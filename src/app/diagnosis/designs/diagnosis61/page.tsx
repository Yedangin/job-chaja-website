'use client';

// KOR: SNS 피드 스타일 비자 진단 페이지 (디자인 #61)
// ENG: SNS Feed style visa diagnosis page (Design #61)
// References: Instagram, Twitter/X, Facebook, LinkedIn, Threads

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
  Send,
  Search,
  Bell,
  Home,
  PlusSquare,
  User,
  MoreHorizontal,
  ChevronRight,
  Hash,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Globe,
  TrendingUp,
  Award,
  Camera,
  X,
  RefreshCw,
} from 'lucide-react';

// KOR: 스텝 정의 타입
// ENG: Step definition type
type Step = 'feed' | 'nationality' | 'age' | 'education' | 'fund' | 'goal' | 'priority' | 'result';

// KOR: 스토리 링 컴포넌트 — 인스타그램 스토리 스타일
// ENG: Story ring component — Instagram story style
const StoryRing = ({
  label,
  emoji,
  active,
  onClick,
}: {
  label: string;
  emoji: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 shrink-0"
  >
    {/* KOR: 그라데이션 링 — 인스타 스타일 / ENG: Gradient ring — insta style */}
    <div
      className={`p-[2px] rounded-full ${
        active
          ? 'bg-linear-to-br from-yellow-400 via-pink-500 to-purple-600'
          : 'bg-gray-200'
      }`}
    >
      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl">
        {emoji}
      </div>
    </div>
    <span className="text-xs text-gray-600 max-w-[60px] text-center truncate">{label}</span>
  </button>
);

// KOR: 해시태그 배지 컴포넌트
// ENG: Hashtag badge component
const HashtagBadge = ({ tag }: { tag: string }) => (
  <span className="inline-flex items-center gap-0.5 text-xs text-purple-600 font-medium hover:text-pink-600 cursor-pointer transition-colors">
    <Hash size={11} />
    {tag}
  </span>
);

// KOR: 인스타 그라데이션 버튼
// ENG: Instagram gradient button
const GradientButton = ({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold rounded-xl px-6 py-3 hover:opacity-90 active:scale-95 transition-all ${className}`}
  >
    {children}
  </button>
);

// KOR: 포스트 카드 — 비자 경로를 SNS 포스트처럼 렌더링
// ENG: Post card — renders visa pathway as an SNS post
const VisaPostCard = ({
  pathway,
  index,
  userEmoji,
}: {
  pathway: RecommendedPathway;
  index: number;
  userEmoji: string;
}) => {
  // KOR: 좋아요 / 북마크 상태 관리
  // ENG: Like / bookmark state management
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // KOR: 랜덤 좋아요 수 생성 (시드 기반)
  // ENG: Generate pseudo-random like count (seed-based)
  const baseCount = pathway.feasibilityScore * 12 + index * 47;

  // KOR: 해시태그 생성 — 비자 체인에서 추출
  // ENG: Generate hashtags — extracted from visa chain
  const hashtags = [
    pathway.visaChain[0]?.visa.replace('-', ''),
    '한국비자',
    '비자진단',
    pathway.feasibilityLabel === '매우 높음' ? '추천경로' : '비자정보',
    '잡차자',
  ];

  return (
    <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* KOR: 포스트 헤더 — 프로필 + 팔로우 / ENG: Post header — profile + follow */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* KOR: 아바타 with 그라데이션 링 / ENG: Avatar with gradient ring */}
          <div className="p-[2px] rounded-full bg-linear-to-br from-yellow-400 via-pink-500 to-purple-600">
            <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-lg">
              {userEmoji}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{((pathway as any).name ?? pathway.nameKo ?? '').split(' ')[0]}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin size={10} />
              한국 이민 경로
            </p>
          </div>
        </div>
        {/* KOR: 더보기 메뉴 / ENG: More options menu */}
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* KOR: 포스트 이미지 — 그라데이션 비주얼 카드 / ENG: Post image — gradient visual card */}
      <div
        className={`relative h-52 bg-linear-to-br ${
          index === 0
            ? 'from-pink-400 via-rose-500 to-red-600'
            : index === 1
            ? 'from-purple-400 via-violet-500 to-indigo-600'
            : index === 2
            ? 'from-orange-400 via-amber-500 to-yellow-500'
            : index === 3
            ? 'from-teal-400 via-cyan-500 to-blue-600'
            : 'from-green-400 via-emerald-500 to-teal-600'
        } flex flex-col items-center justify-center text-white px-6 text-center`}
      >
        {/* KOR: 실현 가능성 이모지 / ENG: Feasibility emoji */}
        <div className="text-5xl mb-3">{getFeasibilityEmoji(pathway.feasibilityLabel)}</div>
        <h3 className="text-xl font-bold mb-1">{pathway.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          {/* KOR: 비자 체인 표시 / ENG: Visa chain display */}
          {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
            <React.Fragment key={i}>
              <span className="bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs font-bold">
                {v.visa}
              </span>
              {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && <ArrowRight size={12} className="opacity-70" />}
            </React.Fragment>
          ))}
        </div>
        {/* KOR: 실현 가능성 점수 배지 / ENG: Feasibility score badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <TrendingUp size={12} className="text-pink-500" />
          <span className="text-xs font-bold text-gray-800">{pathway.feasibilityScore}%</span>
        </div>
      </div>

      {/* KOR: 액션 버튼 행 — 인스타그램 스타일 / ENG: Action button row — Instagram style */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          {/* KOR: 좋아요 버튼 / ENG: Like button */}
          <button
            onClick={() => setLiked(!liked)}
            className={`transition-all active:scale-90 ${liked ? 'text-red-500 scale-110' : 'text-gray-600'}`}
          >
            <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
          </button>
          {/* KOR: 댓글 버튼 / ENG: Comment button */}
          <button
            onClick={() => setShowComment(!showComment)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <MessageCircle size={24} />
          </button>
          {/* KOR: 공유 버튼 / ENG: Share button */}
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <Send size={22} />
          </button>
        </div>
        {/* KOR: 북마크 버튼 / ENG: Bookmark button */}
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={`transition-all ${bookmarked ? 'text-gray-900' : 'text-gray-400'}`}
        >
          <Bookmark size={24} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* KOR: 좋아요 수 / ENG: Like count */}
      <div className="px-4 pb-1">
        <p className="text-sm font-semibold text-gray-900">
          좋아요 {(baseCount + (liked ? 1 : 0)).toLocaleString()}개
        </p>
      </div>

      {/* KOR: 포스트 본문 / ENG: Post body */}
      <div className="px-4 pb-2">
        <p className="text-sm text-gray-800">
          <span className="font-semibold mr-1">{((pathway as any).name ?? pathway.nameKo ?? '').split(' ')[0]}</span>
          <span className={expanded ? '' : 'line-clamp-2'}>{pathway.description}</span>
        </p>
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-gray-400 mt-0.5 hover:text-gray-600"
          >
            더 보기
          </button>
        )}
      </div>

      {/* KOR: 해시태그 / ENG: Hashtags */}
      <div className="px-4 pb-2 flex flex-wrap gap-2">
        {hashtags.map((tag, i) => (
          <HashtagBadge key={i} tag={tag} />
        ))}
      </div>

      {/* KOR: 통계 정보 행 / ENG: Stats info row */}
      <div className="mx-4 mb-3 p-3 bg-gray-50 rounded-xl grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center gap-0.5">
          <Clock size={14} className="text-purple-500" />
          <span className="text-xs font-bold text-gray-800">{pathway.totalDurationMonths}개월</span>
          <span className="text-[10px] text-gray-400">예상 기간</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <DollarSign size={14} className="text-pink-500" />
          <span className="text-xs font-bold text-gray-800">${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
          <span className="text-[10px] text-gray-400">예상 비용</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Award size={14} className="text-indigo-500" />
          <span className="text-xs font-bold text-gray-800">{pathway.feasibilityLabel}</span>
          <span className="text-[10px] text-gray-400">가능성</span>
        </div>
      </div>

      {/* KOR: 마일스톤 (펼침) / ENG: Milestones (expandable) */}
      {expanded && (
        <div className="mx-4 mb-3 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">주요 단계</p>
          {pathway.milestones.map((m, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
              <span className="text-lg shrink-0">{m.emoji}</span>
              <div>
                <p className="text-xs font-semibold text-gray-800">{m.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KOR: 댓글 입력창 / ENG: Comment input */}
      {showComment && (
        <div className="px-4 pb-3 flex items-center gap-2 border-t border-gray-100 pt-2">
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            나
          </div>
          <input
            type="text"
            placeholder="댓글 달기..."
            className="flex-1 text-sm bg-gray-100 rounded-full px-3 py-1.5 outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button className="text-purple-500 font-semibold text-sm">게시</button>
        </div>
      )}

      {/* KOR: 게시 시간 / ENG: Post time */}
      <div className="px-4 pb-3">
        <p className="text-xs text-gray-400">{index + 1}시간 전</p>
      </div>
    </article>
  );
};

// KOR: 입력 스텝 포스트 카드 — 질문을 SNS 포스트처럼 표시
// ENG: Input step post card — displays questions as SNS posts
const InputPostCard = ({
  step,
  question,
  emoji,
  children,
}: {
  step: number;
  question: string;
  emoji: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
    {/* KOR: 헤더 / ENG: Header */}
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
      <div className="p-[2px] rounded-full bg-linear-to-br from-yellow-400 via-pink-500 to-purple-600">
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-xl">
          {emoji}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">비자진단 Bot</p>
        <p className="text-xs text-gray-400">Step {step} / 6</p>
      </div>
      <div className="ml-auto">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-1 w-5 rounded-full transition-all ${
                s <= step
                  ? 'bg-linear-to-r from-pink-500 to-purple-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>

    {/* KOR: 질문 이미지 영역 / ENG: Question image area */}
    <div className="h-24 bg-linear-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
      <p className="text-base font-bold text-gray-800 text-center px-6">{question}</p>
    </div>

    {/* KOR: 입력 영역 / ENG: Input area */}
    <div className="p-4">{children}</div>
  </div>
);

// KOR: 메인 페이지 컴포넌트
// ENG: Main page component
export default function Diagnosis61Page() {
  // KOR: 현재 스텝 및 입력 상태 관리
  // ENG: Current step and input state management
  const [currentStep, setCurrentStep] = useState<Step>('feed');
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [activeStory, setActiveStory] = useState<number | null>(null);

  // KOR: 스토리 링 데이터 — 진단 카테고리
  // ENG: Story ring data — diagnosis categories
  const stories = [
    { label: '비자 진단', emoji: '🔍', step: 'nationality' as Step },
    { label: '취업비자', emoji: '💼', step: 'feed' as Step },
    { label: '유학비자', emoji: '🎓', step: 'feed' as Step },
    { label: '영주권', emoji: '🏠', step: 'feed' as Step },
    { label: '결혼이민', emoji: '💒', step: 'feed' as Step },
    { label: '점수제', emoji: '📊', step: 'feed' as Step },
  ];

  // KOR: 진단 시작 핸들러
  // ENG: Diagnosis start handler
  const handleStart = () => setCurrentStep('nationality');

  // KOR: 다음 스텝 이동 핸들러
  // ENG: Next step handler
  const handleNext = (field: keyof DiagnosisInput, value: string | number) => {
    const newInput = { ...input, [field]: value };
    setInput(newInput);

    // KOR: 스텝 진행 순서
    // ENG: Step progression order
    const stepOrder: Step[] = ['nationality', 'age', 'education', 'fund', 'goal', 'priority'];
    const currentIndex = stepOrder.indexOf(currentStep as Step);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      // KOR: 모든 입력 완료 → 결과 표시
      // ENG: All inputs complete → show result
      setResult(mockDiagnosisResult);
      setCurrentStep('result');
    }
  };

  // KOR: 다시 시작 핸들러
  // ENG: Restart handler
  const handleRestart = () => {
    setCurrentStep('feed');
    setInput({});
    setResult(null);
    setActiveStory(null);
  };

  // KOR: 트렌딩 해시태그 — 피드 화면용
  // ENG: Trending hashtags — for feed screen
  const trendingTags = [
    { tag: 'E7비자', count: '2.4만' },
    { tag: '한국취업', count: '1.8만' },
    { tag: 'F2비자', count: '1.2만' },
    { tag: '비자신청', count: '9,821' },
    { tag: 'D2유학', count: '7,443' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* KOR: 상단 네비게이션 바 — 인스타그램 스타일 / ENG: Top navigation bar — Instagram style */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* KOR: 로고 — 그라데이션 텍스트 / ENG: Logo — gradient text */}
          <h1 className="text-xl font-black bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            잡차자
          </h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-700 hover:text-pink-500 transition-colors">
              <Search size={22} />
            </button>
            <button className="text-gray-700 hover:text-pink-500 transition-colors relative">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-20">
        {/* KOR: 스토리 링 섹션 / ENG: Story ring section */}
        <section className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {/* KOR: 내 스토리 (새 진단 시작) / ENG: My story (start new diagnosis) */}
            <button
              onClick={handleStart}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center text-purple-400 bg-purple-50 relative">
                <Camera size={20} />
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-linear-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  +
                </span>
              </div>
              <span className="text-xs text-gray-600">진단 시작</span>
            </button>

            {/* KOR: 카테고리 스토리 링 / ENG: Category story rings */}
            {stories.map((story, i) => (
              <StoryRing
                key={i}
                label={story.label}
                emoji={story.emoji}
                active={activeStory === i}
                onClick={() => {
                  setActiveStory(i);
                  if (story.step === 'nationality') handleStart();
                }}
              />
            ))}
          </div>
        </section>

        {/* KOR: 피드 초기 화면 / ENG: Feed initial screen */}
        {currentStep === 'feed' && (
          <div className="space-y-4 px-4 pt-4">
            {/* KOR: 진단 시작 CTA 카드 / ENG: Diagnosis start CTA card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="h-48 bg-linear-to-br from-pink-400 via-rose-500 to-purple-700 flex flex-col items-center justify-center text-white text-center px-6">
                <Sparkles size={32} className="mb-2 opacity-90" />
                <h2 className="text-2xl font-black mb-1">비자 경로 진단</h2>
                <p className="text-sm opacity-90">6가지 질문으로 나에게 맞는<br />한국 비자 경로를 찾아드립니다</p>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <div className="p-[2px] rounded-full bg-linear-to-br from-yellow-400 via-pink-500 to-purple-600">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-base">🤖</div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">잡차자 비자봇</p>
                    <p className="text-xs text-gray-500">공식 계정 · 팔로워 24.5만명</p>
                  </div>
                  <button className="ml-auto text-xs font-semibold text-purple-600 border border-purple-300 rounded-lg px-3 py-1.5">
                    팔로우
                  </button>
                </div>
                <GradientButton onClick={handleStart} className="w-full text-center">
                  지금 진단 시작하기 →
                </GradientButton>
              </div>
            </div>

            {/* KOR: 트렌딩 해시태그 카드 / ENG: Trending hashtags card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-pink-500" />
                  지금 인기 해시태그
                </h3>
                <span className="text-xs text-gray-400">실시간</span>
              </div>
              <div className="space-y-2">
                {trendingTags.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                      <HashtagBadge tag={item.tag} />
                    </div>
                    <span className="text-xs text-gray-400">{item.count} 게시물</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KOR: 샘플 비자 포스트 카드 미리보기 / ENG: Sample visa post card preview */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-3">진단 후 이런 결과를 확인할 수 있어요</p>
              <div className="flex gap-2 justify-center">
                {['E-7', 'D-2', 'F-2'].map((visa, i) => (
                  <div
                    key={i}
                    className="flex-1 py-3 rounded-xl bg-linear-to-br from-purple-50 to-pink-50 border border-purple-100"
                  >
                    <p className="text-base font-black text-purple-700">{visa}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">비자 경로</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* KOR: 국적 선택 스텝 / ENG: Nationality selection step */}
        {currentStep === 'nationality' && (
          <div className="px-4 pt-4 space-y-4">
            <InputPostCard step={1} question="어느 나라에서 오셨나요? 🌏" emoji="🌍">
              <p className="text-xs text-gray-400 mb-3">국적을 선택해주세요</p>
              <div className="grid grid-cols-3 gap-2">
                {popularCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleNext('nationality', country.name)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-purple-300 hover:bg-purple-50 active:scale-95 transition-all"
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <span className="text-xs text-gray-700 font-medium">{country.name}</span>
                  </button>
                ))}
              </div>
              {/* KOR: 해시태그 / ENG: Hashtags */}
              <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                <HashtagBadge tag="국적선택" />
                <HashtagBadge tag="비자진단" />
                <HashtagBadge tag="한국이민" />
              </div>
            </InputPostCard>
          </div>
        )}

        {/* KOR: 나이 입력 스텝 / ENG: Age input step */}
        {currentStep === 'age' && (
          <div className="px-4 pt-4 space-y-4">
            <InputPostCard step={2} question="나이가 어떻게 되시나요? 🎂" emoji="🎯">
              <p className="text-xs text-gray-400 mb-3">해당하는 나이대를 선택해주세요</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '18 - 24세', value: 21 },
                  { label: '25 - 29세', value: 27 },
                  { label: '30 - 34세', value: 32 },
                  { label: '35 - 39세', value: 37 },
                  { label: '40 - 49세', value: 44 },
                  { label: '50세 이상', value: 55 },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleNext('age', option.value)}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-purple-300 hover:bg-purple-50 active:scale-95 transition-all text-sm font-medium text-gray-700"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                <HashtagBadge tag="나이" />
                <HashtagBadge tag="비자요건" />
              </div>
            </InputPostCard>
          </div>
        )}

        {/* KOR: 학력 선택 스텝 / ENG: Education selection step */}
        {currentStep === 'education' && (
          <div className="px-4 pt-4 space-y-4">
            <InputPostCard step={3} question="최종 학력은 어떻게 되나요? 🎓" emoji="📚">
              <p className="text-xs text-gray-400 mb-3">학력을 선택해주세요</p>
              <div className="space-y-2">
                {educationOptions.map((edu) => (
                  <button
                    key={edu}
                    onClick={() => handleNext('educationLevel', edu)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-purple-300 hover:bg-purple-50 active:scale-95 transition-all text-sm font-medium text-gray-700"
                  >
                    {edu}
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                <HashtagBadge tag="학력" />
                <HashtagBadge tag="E7비자" />
                <HashtagBadge tag="유학비자" />
              </div>
            </InputPostCard>
          </div>
        )}

        {/* KOR: 가용 자금 선택 스텝 / ENG: Available fund selection step */}
        {currentStep === 'fund' && (
          <div className="px-4 pt-4 space-y-4">
            <InputPostCard step={4} question="연간 가용 자금은 얼마인가요? 💰" emoji="💵">
              <p className="text-xs text-gray-400 mb-3">예산 범위를 선택해주세요</p>
              <div className="space-y-2">
                {fundOptions.map((fund) => (
                  <button
                    key={fund}
                    onClick={() => handleNext('availableAnnualFund', fund)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-purple-300 hover:bg-purple-50 active:scale-95 transition-all"
                  >
                    <DollarSign size={16} className="text-green-500 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{fund}</span>
                    <ChevronRight size={16} className="text-gray-400 ml-auto" />
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                <HashtagBadge tag="예산" />
                <HashtagBadge tag="비자비용" />
              </div>
            </InputPostCard>
          </div>
        )}

        {/* KOR: 최종 목표 선택 스텝 / ENG: Final goal selection step */}
        {currentStep === 'goal' && (
          <div className="px-4 pt-4 space-y-4">
            <InputPostCard step={5} question="한국에서의 최종 목표는? 🏆" emoji="🎯">
              <p className="text-xs text-gray-400 mb-3">목표를 선택해주세요</p>
              <div className="space-y-2">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleNext('finalGoal', goal)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-purple-300 hover:bg-purple-50 active:scale-95 transition-all"
                  >
                    <Globe size={16} className="text-blue-500 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{goal}</span>
                    <ChevronRight size={16} className="text-gray-400 ml-auto" />
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                <HashtagBadge tag="한국목표" />
                <HashtagBadge tag="영주권" />
                <HashtagBadge tag="장기체류" />
              </div>
            </InputPostCard>
          </div>
        )}

        {/* KOR: 우선순위 선택 스텝 / ENG: Priority selection step */}
        {currentStep === 'priority' && (
          <div className="px-4 pt-4 space-y-4">
            <InputPostCard step={6} question="어떤 것을 가장 중요하게 생각하나요? ⭐" emoji="✨">
              <p className="text-xs text-gray-400 mb-3">우선순위를 선택해주세요</p>
              <div className="space-y-2">
                {priorityOptions.map((priority) => (
                  <button
                    key={priority}
                    onClick={() => handleNext('priorityPreference', priority)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-purple-300 hover:bg-purple-50 active:scale-95 transition-all"
                  >
                    <Sparkles size={16} className="text-yellow-500 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{priority}</span>
                    <ChevronRight size={16} className="text-gray-400 ml-auto" />
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                <HashtagBadge tag="우선순위" />
                <HashtagBadge tag="비자전략" />
              </div>
            </InputPostCard>
          </div>
        )}

        {/* KOR: 결과 피드 화면 / ENG: Result feed screen */}
        {currentStep === 'result' && result && (
          <div className="space-y-4 px-4 pt-4">
            {/* KOR: 결과 요약 카드 — 프로필 헤더처럼 / ENG: Result summary card — like a profile header */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {/* KOR: 배경 커버 이미지 / ENG: Background cover image */}
              <div className="h-24 bg-linear-to-br from-pink-400 via-rose-500 to-purple-700" />
              <div className="px-4 pb-4">
                <div className="flex items-end justify-between -mt-10 mb-3">
                  {/* KOR: 아바타 / ENG: Avatar */}
                  <div className="p-[3px] rounded-full bg-white">
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-pink-400 to-purple-600 flex items-center justify-center text-3xl">
                      🎊
                    </div>
                  </div>
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-300 rounded-xl px-3 py-2 hover:border-purple-400 hover:text-purple-600 transition-colors"
                  >
                    <RefreshCw size={13} />
                    다시 진단
                  </button>
                </div>
                <h2 className="text-base font-black text-gray-900">진단 완료!</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {result.pathways.length}개의 비자 경로가 추천되었습니다
                </p>
                {/* KOR: 입력 요약 태그 / ENG: Input summary tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {input.nationality && (
                    <span className="text-xs bg-pink-50 text-pink-600 rounded-full px-2.5 py-1 font-medium">
                      🌍 {input.nationality}
                    </span>
                  )}
                  {input.educationLevel && (
                    <span className="text-xs bg-purple-50 text-purple-600 rounded-full px-2.5 py-1 font-medium">
                      🎓 {input.educationLevel}
                    </span>
                  )}
                  {input.finalGoal && (
                    <span className="text-xs bg-indigo-50 text-indigo-600 rounded-full px-2.5 py-1 font-medium">
                      🎯 {input.finalGoal}
                    </span>
                  )}
                </div>
                {/* KOR: 팔로워/팔로잉 스타일 통계 / ENG: Follower/following style stats */}
                <div className="flex gap-6 mt-3 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-base font-black text-gray-900">{result.pathways.length}</p>
                    <p className="text-xs text-gray-400">추천 경로</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-black text-gray-900">
                      {result.pathways[0]?.feasibilityScore ?? 0}%
                    </p>
                    <p className="text-xs text-gray-400">최고 적합도</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-black text-gray-900">
                      {result.pathways[0]?.totalDurationMonths ?? 0}mo
                    </p>
                    <p className="text-xs text-gray-400">최단 기간</p>
                  </div>
                </div>
              </div>
            </div>

            {/* KOR: 비자 경로 포스트 카드 목록 / ENG: Visa pathway post card list */}
            {result.pathways.map((pathway, index) => (
              <VisaPostCard
                key={pathway.id}
                pathway={pathway}
                index={index}
                userEmoji={['🚀', '💡', '🔧', '🌟', '💎'][index] ?? '✨'}
              />
            ))}

            {/* KOR: 상담 신청 CTA 카드 / ENG: Consultation CTA card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="h-32 bg-linear-to-br from-indigo-500 via-purple-600 to-pink-600 flex flex-col items-center justify-center text-white text-center px-6">
                <p className="text-lg font-black mb-1">전문가 상담 받기</p>
                <p className="text-xs opacity-90">비자 전문가와 1:1 상담으로 최적의 경로를 찾아보세요</p>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-[2px] rounded-full bg-linear-to-br from-yellow-400 via-pink-500 to-purple-600">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-xl">
                      👨‍💼
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">잡차자 비자 전문가</p>
                    <p className="text-xs text-gray-400">공인 비자 컨설턴트 · 응답률 99%</p>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5">
                    {'⭐'.repeat(5)}
                  </div>
                </div>
                <GradientButton className="w-full text-center">
                  무료 상담 신청 →
                </GradientButton>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* KOR: 하단 탭 네비게이션 — 인스타그램 스타일 / ENG: Bottom tab navigation — Instagram style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-50">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button className="flex flex-col items-center gap-0.5 text-gray-900">
            <Home size={22} />
            <span className="text-[10px]">홈</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-gray-400">
            <Search size={22} />
            <span className="text-[10px]">검색</span>
          </button>
          {/* KOR: 중앙 진단 시작 버튼 / ENG: Center diagnosis start button */}
          <button
            onClick={handleStart}
            className="w-12 h-12 rounded-2xl bg-linear-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg text-white active:scale-95 transition-all -mt-4"
          >
            <PlusSquare size={22} />
          </button>
          <button className="flex flex-col items-center gap-0.5 text-gray-400">
            <Globe size={22} />
            <span className="text-[10px]">비자</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-gray-400">
            <User size={22} />
            <span className="text-[10px]">MY</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
