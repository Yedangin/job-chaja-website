'use client';

// KOR: 핀터레스트 보드 스타일 비자 진단 페이지 (#66)
// ENG: Pinterest Board style visa diagnosis page (#66)

import { useState } from 'react';
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
  Pin,
  PlusCircle,
  Heart,
  Share2,
  Search,
  ChevronRight,
  ChevronLeft,
  Grid,
  Bookmark,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  X,
  ArrowRight,
  Sparkles,
  Globe,
  GraduationCap,
  Target,
  Star,
  MoreHorizontal,
  Download,
} from 'lucide-react';

// KOR: 입력 단계 타입 정의
// ENG: Input step type definition
type InputStep =
  | 'nationality'
  | 'age'
  | 'educationLevel'
  | 'availableAnnualFund'
  | 'finalGoal'
  | 'priorityPreference';

// KOR: 앱 뷰 타입 정의 — 입력 단계 또는 결과 단계
// ENG: App view type definition — input stage or results stage
type AppView = 'input' | 'results';

// KOR: 핀 카드에 고정된 색상 팔레트 (핀터레스트 스타일)
// ENG: Fixed color palette for pin cards (Pinterest style)
const PIN_CARD_COLORS = [
  'bg-red-50',
  'bg-rose-50',
  'bg-pink-50',
  'bg-orange-50',
  'bg-amber-50',
  'bg-yellow-50',
  'bg-lime-50',
  'bg-green-50',
  'bg-teal-50',
  'bg-sky-50',
  'bg-blue-50',
  'bg-indigo-50',
  'bg-violet-50',
  'bg-purple-50',
];

// KOR: 핀 카드에 고정된 높이 팔레트 (메이슨리 느낌 연출)
// ENG: Fixed height variants for pin cards to simulate masonry feel
const PIN_HEIGHTS = [
  'min-h-48',
  'min-h-56',
  'min-h-64',
  'min-h-72',
  'min-h-44',
  'min-h-80',
  'min-h-52',
  'min-h-60',
];

// KOR: 개별 비자 경로를 핀 카드로 렌더링하는 컴포넌트
// ENG: Component that renders an individual visa pathway as a pin card
function PathwayPinCard({
  pathway,
  index,
  isSaved,
  onSave,
}: {
  pathway: RecommendedPathway;
  index: number;
  isSaved: boolean;
  onSave: (id: string) => void;
}) {
  // KOR: 호버 상태 관리
  // ENG: Hover state management
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const likeCount = 42 + index * 17;

  // KOR: 카드 배경색 및 높이를 인덱스 기반으로 결정
  // ENG: Determine card background color and height based on index
  const cardColor = PIN_CARD_COLORS[index % PIN_CARD_COLORS.length];
  const cardHeight = PIN_HEIGHTS[index % PIN_HEIGHTS.length];
  const scoreColorClass = getScoreColor(pathway.feasibilityLabel);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${isHovered ? 'shadow-2xl -translate-y-1' : 'shadow-md'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* KOR: 핀 카드 상단 컬러 배너 영역 / ENG: Pin card top color banner area */}
      <div className={`${cardHeight} ${cardColor} flex flex-col justify-between p-4 relative`}>
        {/* KOR: 호버 시 저장 버튼 오버레이 / ENG: Save button overlay on hover */}
        <div
          className={`absolute inset-0 bg-black/20 flex items-start justify-end p-3 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(pathway.id);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${isSaved ? 'bg-white text-red-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            <Pin className="w-3.5 h-3.5" />
            {isSaved ? '저장됨' : '저장'}
          </button>
        </div>

        {/* KOR: 상단 — 실현 가능성 점수 배지 / ENG: Top — feasibility score badge */}
        <div className="flex items-center justify-between">
          <span
            className={`${scoreColorClass} text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1`}
          >
            {emoji} {pathway.feasibilityScore}점
          </span>
          <span className="text-xs text-gray-500 bg-white/80 px-2 py-0.5 rounded-full">
            {pathway.feasibilityLabel}
          </span>
        </div>

        {/* KOR: 중앙 — 비자 체인 시각화 / ENG: Center — visa chain visualization */}
        <div className="flex flex-col gap-1.5">
          {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="bg-white/90 text-red-700 text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
                {v.visa}
              </span>
              <span className="text-gray-500 text-xs">{v.duration}</span>
              {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* KOR: 하단 — 통계 요약 / ENG: Bottom — stats summary */}
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
            {pathway.totalDurationMonths}개월
          </span>
          <span className="flex items-center gap-0.5">
            <DollarSign className="w-3 h-3" />
            ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* KOR: 핀 카드 하단 정보 영역 / ENG: Pin card bottom info area */}
      <div className="bg-white p-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
          {pathway.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{pathway.description}</p>

        {/* KOR: 좋아요 및 저장 액션 / ENG: Like and save actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            {likeCount + (isLiked ? 1 : 0)}
          </button>
          <div className="flex items-center gap-1">
            {pathway.milestones.slice(0, 3).map((m, i) => (
              <span key={i} className="text-sm" title={m.title}>
                {m.emoji}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// KOR: 메이슨리 그리드 레이아웃 컴포넌트
// ENG: Masonry grid layout component
function MasonryGrid({ pathways, savedPins, onSave }: {
  pathways: RecommendedPathway[];
  savedPins: Set<string>;
  onSave: (id: string) => void;
}) {
  // KOR: CSS 컬럼 방식으로 메이슨리 레이아웃 구현
  // ENG: Implement masonry layout using CSS columns
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {pathways.map((pathway, index) => (
        <div key={pathway.id} className="break-inside-avoid mb-4">
          <PathwayPinCard
            pathway={pathway}
            index={index}
            isSaved={savedPins.has(pathway.id)}
            onSave={onSave}
          />
        </div>
      ))}
    </div>
  );
}

// KOR: 추천 핀 카드 컴포넌트 (메이슨리에 추가되는 장식용 카드)
// ENG: Recommended pin card component (decorative cards added to masonry)
function SuggestedPinCard({ compat, index }: { compat: CompatPathway; index: number }) {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const bgColors = ['bg-linear-to-br from-red-100 to-pink-200', 'bg-linear-to-br from-orange-100 to-red-200', 'bg-linear-to-br from-rose-100 to-red-300'];
  const heights = ['min-h-36', 'min-h-44', 'min-h-40'];

  return (
    <div
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${hovered ? 'shadow-xl -translate-y-0.5' : 'shadow-md'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* KOR: 호버 오버레이 / ENG: Hover overlay */}
      <div className={`absolute inset-0 bg-black/20 flex items-start justify-end p-2 transition-opacity z-10 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${saved ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}
        >
          <Pin className="w-3 h-3" />
          {saved ? '저장됨' : '저장'}
        </button>
      </div>
      <div className={`${heights[index % heights.length]} ${bgColors[index % bgColors.length]} p-3 flex flex-col justify-between`}>
        <div className="flex flex-wrap gap-1">
          {((compat as any).tags ?? compat.highlights ?? []).map((tag: string) => (
            <span key={tag} className="text-xs bg-white/70 text-red-700 px-1.5 py-0.5 rounded-full font-medium">
              #{tag}
            </span>
          ))}
        </div>
        <span className="text-sm font-bold text-gray-800">{compat.name}</span>
      </div>
      <div className="bg-white px-3 py-2 text-xs text-gray-500">추천 경로 탐색</div>
    </div>
  );
}

// KOR: 메인 페이지 컴포넌트
// ENG: Main page component
export default function Diagnosis66Page() {
  // KOR: 뷰 상태 — 입력 단계 또는 결과 단계
  // ENG: View state — input stage or results stage
  const [view, setView] = useState<AppView>('input');

  // KOR: 현재 입력 단계
  // ENG: Current input step
  const [step, setStep] = useState<InputStep>('nationality');

  // KOR: 사용자 입력 데이터
  // ENG: User input data
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 진단 결과 상태
  // ENG: Diagnosis result state
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 저장된 핀 집합
  // ENG: Set of saved pins
  const [savedPins, setSavedPins] = useState<Set<string>>(new Set());

  // KOR: 보드 이름 (사용자 커스텀)
  // ENG: Board name (user customizable)
  const [boardName, setBoardName] = useState('내 비자 경로 보드');

  // KOR: 보드 이름 편집 상태
  // ENG: Board name editing state
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);

  // KOR: 분석 로딩 상태
  // ENG: Analysis loading state
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // KOR: 검색어 상태
  // ENG: Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // KOR: 활성 탭 — 전체 or 저장됨
  // ENG: Active tab — all or saved
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

  // KOR: 입력 단계 순서 정의
  // ENG: Definition of input step order
  const stepOrder: InputStep[] = [
    'nationality',
    'age',
    'educationLevel',
    'availableAnnualFund',
    'finalGoal',
    'priorityPreference',
  ];

  // KOR: 현재 단계의 인덱스
  // ENG: Index of the current step
  const currentStepIndex = stepOrder.indexOf(step);
  const progress = ((currentStepIndex + 1) / stepOrder.length) * 100;

  // KOR: 핀 저장/해제 토글 함수
  // ENG: Toggle function to save/unsave a pin
  const handleSavePin = (pathwayId: string) => {
    setSavedPins((prev) => {
      const next = new Set(prev);
      if (next.has(pathwayId)) {
        next.delete(pathwayId);
      } else {
        next.add(pathwayId);
      }
      return next;
    });
  };

  // KOR: 다음 단계로 이동 (국적 제외 — 별도 처리)
  // ENG: Move to next step (except nationality — handled separately)
  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      setStep(stepOrder[nextIndex]);
    } else {
      runDiagnosis();
    }
  };

  // KOR: 이전 단계로 이동
  // ENG: Move to previous step
  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(stepOrder[prevIndex]);
    }
  };

  // KOR: 진단 실행 (모킹)
  // ENG: Run diagnosis (mocked)
  const runDiagnosis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setIsAnalyzing(false);
      setView('results');
    }, 1800);
  };

  // KOR: 처음으로 돌아가기
  // ENG: Return to beginning
  const handleReset = () => {
    setView('input');
    setStep('nationality');
    setInput({});
    setResult(null);
    setSavedPins(new Set());
    setActiveTab('all');
    setSearchQuery('');
  };

  // KOR: 결과 페이지에서 표시할 경로 목록 (검색 및 탭 필터 적용)
  // ENG: List of pathways to display on results page (search and tab filter applied)
  const displayedPathways = result
    ? result.pathways
        .filter((p) => {
          if (activeTab === 'saved') return savedPins.has(p.id);
          if (searchQuery) return ((p as any).name ?? p.nameKo ?? '').includes(searchQuery) || ((p as any).description ?? p.note ?? '').includes(searchQuery);
          return true;
        })
    : [];

  // ==================== 분석 로딩 화면 ====================
  // ==================== Analysis loading screen ====================
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        {/* KOR: 핀터레스트 스타일 로고 / ENG: Pinterest style logo */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <Pin className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-red-600">JobChaJa</span>
        </div>

        {/* KOR: 메이슨리 로딩 애니메이션 / ENG: Masonry loading animation */}
        <div className="grid grid-cols-3 gap-3 w-72">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`bg-red-100 rounded-xl animate-pulse ${i % 3 === 0 ? 'h-24' : i % 3 === 1 ? 'h-16' : 'h-20'}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        <p className="text-gray-700 font-semibold text-lg">비자 경로를 보드에 핀 중...</p>
        <p className="text-gray-400 text-sm">Pinning visa pathways to your board...</p>
      </div>
    );
  }

  // ==================== 결과 화면 (Pinterest Board) ====================
  // ==================== Results screen (Pinterest Board) ====================
  if (view === 'results' && result) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* KOR: 핀터레스트 스타일 상단 헤더 / ENG: Pinterest style top header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
            {/* KOR: 로고 / ENG: Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <Pin className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-red-600 hidden sm:block">JobChaJa</span>
            </div>

            {/* KOR: 검색창 / ENG: Search bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="비자 경로 검색... / Search pathways..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* KOR: 오른쪽 액션 버튼들 / ENG: Right side action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-full transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:block">다시 진단</span>
              </button>
              <button className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-2 rounded-full transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:block">공유</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* KOR: 보드 헤더 영역 / ENG: Board header area */}
          <div className="flex flex-col items-center mb-8">
            {/* KOR: 보드 이름 편집 가능 / ENG: Editable board name */}
            <div className="flex items-center gap-2 mb-2">
              {isEditingBoardName ? (
                <input
                  autoFocus
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  onBlur={() => setIsEditingBoardName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingBoardName(false)}
                  className="text-3xl font-bold text-gray-900 border-b-2 border-red-400 outline-none text-center bg-transparent"
                />
              ) : (
                <h1
                  className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-red-600 transition-colors"
                  onClick={() => setIsEditingBoardName(true)}
                >
                  {boardName}
                </h1>
              )}
              <button onClick={() => setIsEditingBoardName(true)} className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* KOR: 보드 통계 요약 / ENG: Board stats summary */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Pin className="w-4 h-4 text-red-500" />
                {result.pathways.length}개 핀
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="w-4 h-4 text-red-500" />
                {savedPins.size}개 저장됨
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-red-500" />
                {result.userInput.nationality}
              </span>
            </div>

            {/* KOR: 필터 탭 / ENG: Filter tabs */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid className="w-3.5 h-3.5" />
                전체 보기
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'saved' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                저장한 핀
                {savedPins.size > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {savedPins.size}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* KOR: 저장 탭인데 저장된 핀이 없을 때 안내 / ENG: Empty state for saved tab */}
          {activeTab === 'saved' && savedPins.size === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Bookmark className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium text-gray-500">아직 저장된 핀이 없습니다</p>
              <p className="text-sm">No saved pins yet</p>
              <button
                onClick={() => setActiveTab('all')}
                className="mt-4 text-red-600 font-medium hover:underline text-sm"
              >
                핀 탐색하기 →
              </button>
            </div>
          )}

          {/* KOR: 결과가 없을 때 안내 / ENG: Empty search results state */}
          {activeTab === 'all' && searchQuery && displayedPathways.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Search className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium text-gray-500">'{searchQuery}' 검색 결과 없음</p>
              <p className="text-sm">No results for '{searchQuery}'</p>
            </div>
          )}

          {/* KOR: 메이슨리 그리드 — 분석된 비자 경로 핀 카드들 / ENG: Masonry grid — analyzed visa pathway pin cards */}
          {displayedPathways.length > 0 && (
            <MasonryGrid
              pathways={displayedPathways}
              savedPins={savedPins}
              onSave={handleSavePin}
            />
          )}

          {/* KOR: 구분선 / ENG: Divider */}
          {activeTab === 'all' && (
            <>
              <div className="flex items-center gap-3 my-8">
                <div className="flex-1 h-px bg-gray-200" />
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-red-400" />
                  추천 경로 탐색 / Recommended Explorations
                </div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* KOR: 추천 핀 메이슨리 그리드 (CompatPathway 기반) / ENG: Recommended pins masonry grid (CompatPathway based) */}
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                {mockPathways.map((compat, index) => (
                  <div key={compat.id} className="break-inside-avoid mb-4">
                    <SuggestedPinCard compat={compat} index={index} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* KOR: 하단 CTA / ENG: Bottom CTA */}
          <div className="mt-12 bg-linear-to-br from-red-50 to-pink-50 rounded-3xl p-8 text-center border border-red-100">
            <Pin className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              비자 보드를 완성했습니다!
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Your Visa Board is ready — Save and share your pathway pins
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-red-700 transition-colors text-sm">
                <Download className="w-4 h-4" />
                보드 저장하기
              </button>
              <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-full font-semibold hover:bg-gray-50 transition-colors text-sm">
                <Share2 className="w-4 h-4" />
                공유하기
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-5 py-2.5 rounded-full font-semibold hover:bg-red-50 transition-colors text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                다시 진단
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==================== 입력 화면 ====================
  // ==================== Input screen ====================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* KOR: 상단 헤더 / ENG: Top header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center">
              <Pin className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-red-600">JobChaJa Visa Board</p>
              <p className="text-xs text-gray-400">핀터레스트 스타일 비자 진단</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <Pin className="w-3 h-3 text-red-500" />
            {currentStepIndex + 1} / {stepOrder.length}
          </div>
        </div>

        {/* KOR: 진행 바 / ENG: Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* KOR: 메인 입력 영역 / ENG: Main input area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* ===== Step: 국적 / Nationality ===== */}
          {step === 'nationality' && (
            <div className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-7 h-7 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">어느 나라에서 오셨나요?</h2>
                <p className="text-gray-500 text-sm mt-1">Where are you from? Choose your country</p>
              </div>

              {/* KOR: 국가 핀 그리드 / ENG: Country pin grid */}
              <div className="grid grid-cols-3 gap-3">
                {popularCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setInput((prev) => ({ ...prev, nationality: country.name }));
                      setStep('age');
                    }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all hover:shadow-md ${input.nationality === country.name ? 'border-red-500 bg-red-50 shadow-md' : 'border-gray-100 bg-white hover:border-red-200'}`}
                  >
                    <span className="text-3xl">{country.flag}</span>
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight">{country.name}</span>
                  </button>
                ))}
              </div>

              {/* KOR: 직접 입력 옵션 / ENG: Direct input option */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="다른 나라 검색 / Search other country"
                  value={typeof input.nationality === 'string' && !popularCountries.find(c => c.name === input.nationality) ? input.nationality : ''}
                  onChange={(e) => setInput((prev) => ({ ...prev, nationality: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && input.nationality && goToNextStep()}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
                />
              </div>
              {input.nationality && !popularCountries.find((c) => c.name === input.nationality) && (
                <button
                  onClick={goToNextStep}
                  className="w-full bg-red-600 text-white py-3 rounded-2xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  선택 완료 <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* ===== Step: 나이 / Age ===== */}
          {step === 'age' && (
            <div className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-7 h-7 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">나이가 어떻게 되세요?</h2>
                <p className="text-gray-500 text-sm mt-1">How old are you? Age affects visa eligibility</p>
              </div>

              {/* KOR: 나이 핀 버튼 그리드 / ENG: Age pin button grid */}
              <div className="grid grid-cols-4 gap-2">
                {[18, 20, 22, 24, 26, 28, 30, 32, 35, 40, 45, 50].map((ageVal) => (
                  <button
                    key={ageVal}
                    onClick={() => {
                      setInput((prev) => ({ ...prev, age: ageVal }));
                      setStep('educationLevel');
                    }}
                    className={`py-3 rounded-2xl border-2 font-semibold text-sm transition-all hover:shadow-md ${input.age === ageVal ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 bg-white text-gray-700 hover:border-red-200'}`}
                  >
                    {ageVal}세
                  </button>
                ))}
              </div>

              {/* KOR: 나이 직접 입력 / ENG: Direct age input */}
              <div className="relative">
                <input
                  type="number"
                  placeholder="직접 입력 / Enter age"
                  min={15}
                  max={80}
                  value={input.age && ![18,20,22,24,26,28,30,32,35,40,45,50].includes(input.age) ? input.age : ''}
                  onChange={(e) => setInput((prev) => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
                  onKeyDown={(e) => e.key === 'Enter' && input.age && goToNextStep()}
                  className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 text-center"
                />
              </div>
              {input.age && ![18,20,22,24,26,28,30,32,35,40,45,50].includes(input.age) && (
                <button
                  onClick={goToNextStep}
                  className="w-full bg-red-600 text-white py-3 rounded-2xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  다음 <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* ===== Step: 학력 / Education ===== */}
          {step === 'educationLevel' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">최종 학력을 선택해주세요</h2>
                <p className="text-gray-500 text-sm mt-1">Select your highest education level</p>
              </div>

              {/* KOR: 학력 핀 카드 목록 / ENG: Education pin card list */}
              <div className="space-y-3">
                {educationOptions.map((edu) => (
                  <button
                    key={edu}
                    onClick={() => {
                      setInput((prev) => ({ ...prev, educationLevel: edu }));
                      setStep('availableAnnualFund');
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all hover:shadow-md ${input.educationLevel === edu ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-white hover:border-red-200'}`}
                  >
                    <span className={`font-medium ${input.educationLevel === edu ? 'text-red-700' : 'text-gray-700'}`}>
                      {edu}
                    </span>
                    {input.educationLevel === edu && <CheckCircle className="w-5 h-5 text-red-500 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== Step: 자금 / Fund ===== */}
          {step === 'availableAnnualFund' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">연간 가용 자금은?</h2>
                <p className="text-gray-500 text-sm mt-1">Annual available budget for your Korea journey</p>
              </div>

              {/* KOR: 자금 옵션 핀 그리드 / ENG: Fund option pin grid */}
              <div className="space-y-3">
                {fundOptions.map((fund) => (
                  <button
                    key={fund}
                    onClick={() => {
                      setInput((prev) => ({ ...prev, availableAnnualFund: fund }));
                      setStep('finalGoal');
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all hover:shadow-md ${input.availableAnnualFund === fund ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-white hover:border-red-200'}`}
                  >
                    <span className={`font-semibold text-lg ${input.availableAnnualFund === fund ? 'text-red-700' : 'text-gray-800'}`}>
                      {fund}
                    </span>
                    {input.availableAnnualFund === fund && <CheckCircle className="w-5 h-5 text-red-500 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== Step: 최종 목표 / Final Goal ===== */}
          {step === 'finalGoal' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-7 h-7 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">최종 목표는 무엇인가요?</h2>
                <p className="text-gray-500 text-sm mt-1">What is your final goal in Korea?</p>
              </div>

              {/* KOR: 목표 옵션 핀 카드들 / ENG: Goal option pin cards */}
              <div className="space-y-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => {
                      setInput((prev) => ({ ...prev, finalGoal: goal }));
                      setStep('priorityPreference');
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all hover:shadow-md ${input.finalGoal === goal ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-white hover:border-red-200'}`}
                  >
                    <span className={`font-medium ${input.finalGoal === goal ? 'text-red-700' : 'text-gray-700'}`}>
                      {goal}
                    </span>
                    {input.finalGoal === goal && <CheckCircle className="w-5 h-5 text-red-500 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== Step: 우선순위 / Priority ===== */}
          {step === 'priorityPreference' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-7 h-7 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">가장 중요한 우선순위는?</h2>
                <p className="text-gray-500 text-sm mt-1">What matters most to you? We'll pin the best paths</p>
              </div>

              {/* KOR: 우선순위 핀 카드들 / ENG: Priority pin cards */}
              <div className="grid grid-cols-2 gap-3">
                {priorityOptions.map((priority, idx) => {
                  const icons = [Clock, DollarSign, TrendingUp, Target];
                  const colors = ['bg-orange-50 border-orange-200 hover:border-orange-400', 'bg-green-50 border-green-200 hover:border-green-400', 'bg-blue-50 border-blue-200 hover:border-blue-400', 'bg-purple-50 border-purple-200 hover:border-purple-400'];
                  const selectedColors = ['border-red-500 bg-red-50', 'border-red-500 bg-red-50', 'border-red-500 bg-red-50', 'border-red-500 bg-red-50'];
                  const IconComponent = icons[idx];
                  return (
                    <button
                      key={priority}
                      onClick={() => {
                        setInput((prev) => ({ ...prev, priorityPreference: priority }));
                        runDiagnosis();
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:shadow-md ${input.priorityPreference === priority ? selectedColors[idx] : colors[idx]}`}
                    >
                      <IconComponent className={`w-6 h-6 ${input.priorityPreference === priority ? 'text-red-600' : 'text-gray-600'}`} />
                      <span className={`text-sm font-medium text-center leading-tight ${input.priorityPreference === priority ? 'text-red-700' : 'text-gray-700'}`}>
                        {priority}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* KOR: 보드 만들기 버튼 / ENG: Create board button */}
              {input.priorityPreference && (
                <button
                  onClick={runDiagnosis}
                  className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-base mt-2"
                >
                  <Pin className="w-5 h-5" />
                  비자 보드 만들기 / Create My Visa Board
                </button>
              )}
            </div>
          )}

          {/* KOR: 이전 단계 네비게이션 / ENG: Previous step navigation */}
          {step !== 'nationality' && (
            <div className="mt-6 flex justify-start">
              <button
                onClick={goToPrevStep}
                className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                이전으로 / Go back
              </button>
            </div>
          )}

          {/* KOR: 단계 인디케이터 도트 / ENG: Step indicator dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {stepOrder.map((s, i) => (
              <div
                key={s}
                className={`rounded-full transition-all ${i === currentStepIndex ? 'w-6 h-2 bg-red-500' : i < currentStepIndex ? 'w-2 h-2 bg-red-300' : 'w-2 h-2 bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* KOR: 하단 브랜드 푸터 / ENG: Bottom brand footer */}
      <footer className="bg-white border-t border-gray-100 py-3">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-center gap-2 text-gray-400 text-xs">
          <Pin className="w-3.5 h-3.5 text-red-400" />
          <span>JobChaJa Visa Board — 핀터레스트처럼 비자를 탐색하세요</span>
        </div>
      </footer>
    </div>
  );
}
