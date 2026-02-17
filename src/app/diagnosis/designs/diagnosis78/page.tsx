'use client';

// KOR: 비자 진단 페이지 - 디자인 #78 "중고거래(Marketplace)" 컨셉
// ENG: Visa diagnosis page - Design #78 "Marketplace" concept (Karrot/Daangn style)
// 참고: 당근마켓, 번개장터, Mercari, OfferUp, Depop 스타일
// Ref: Karrot (Daangn), Bungaejangter, Mercari, OfferUp, Depop styles

import { useState, useEffect } from 'react';
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
  Search,
  MapPin,
  Heart,
  MessageCircle,
  Share2,
  ChevronRight,
  ChevronLeft,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  Filter,
  Bell,
  Home,
  Grid,
  User,
  ArrowLeft,
  Bookmark,
  RefreshCw,
  Check,
  AlertCircle,
  Tag,
  Package,
  Zap,
  Eye,
  ThumbsUp,
  ChevronDown,
  X,
  Plus,
} from 'lucide-react';

// KOR: 현재 화면 단계 타입 정의
// ENG: Current screen step type definition
type Step = 'search' | 'input' | 'loading' | 'results';

// KOR: 입력 필드 단계 순서 정의 (DiagnosisInput 필드 순서)
// ENG: Input field step order (DiagnosisInput field order)
type InputField = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

const INPUT_STEPS: InputField[] = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
];

// KOR: 입력 단계 라벨 (한국어/영어)
// ENG: Input step labels (Korean/English)
const STEP_LABELS: Record<InputField, { ko: string; en: string }> = {
  nationality: { ko: '국적', en: 'Nationality' },
  age: { ko: '나이', en: 'Age' },
  educationLevel: { ko: '학력', en: 'Education' },
  availableAnnualFund: { ko: '연간 예산', en: 'Annual Budget' },
  finalGoal: { ko: '최종 목표', en: 'Goal' },
  priorityPreference: { ko: '우선순위', en: 'Priority' },
};

// KOR: 매물 카드 로컬 거리 정보 (마켓플레이스 감성)
// ENG: Local distance info for listing cards (marketplace feel)
const DISTANCES = ['도보 3분', '0.5km', '1.2km', '2km', '3.5km'];

// KOR: 매물 조회수 목업 데이터
// ENG: Mock listing view counts
const VIEW_COUNTS = [142, 89, 234, 67, 198];

// KOR: 찜 수 목업 데이터
// ENG: Mock like/bookmark counts
const LIKE_COUNTS = [28, 15, 43, 9, 37];

// KOR: 경로 인덱스별 썸네일 이모지
// ENG: Thumbnail emoji by pathway index
const PATHWAY_THUMBS = ['🎓', '🏫', '🏭', '🌏', '🏙️'];

// KOR: 경로 인덱스별 카드 배경 그라디언트 클래스
// ENG: Card background gradient class by pathway index
const CARD_GRADIENTS = [
  'from-blue-100 to-blue-200',
  'from-green-100 to-green-200',
  'from-purple-100 to-purple-200',
  'from-amber-100 to-amber-200',
  'from-rose-100 to-rose-200',
];

// KOR: 실현 가능성 레이블에 따른 "매물 상태" 정보
// ENG: "Listing status" info based on feasibility label
const getFeasibilityStatus = (label: string): { text: string; color: string; bgColor: string } => {
  if (label === '높음') return { text: '즉시 진행 가능', color: 'text-green-700', bgColor: 'bg-green-100' };
  if (label === '보통') return { text: '조건 충족 가능', color: 'text-blue-700', bgColor: 'bg-blue-100' };
  if (label === '낮음') return { text: '추가 준비 필요', color: 'text-orange-700', bgColor: 'bg-orange-100' };
  return { text: '난이도 높음', color: 'text-red-700', bgColor: 'bg-red-100' };
};

// KOR: 비용(만원 단위)을 한국 표기 형식으로 변환
// ENG: Format cost (in 10k KRW) to Korean notation
const formatCost = (won10k: number): string => {
  if (won10k === 0) return '무료 (장학금)';
  if (won10k >= 1000) return `${(won10k / 100).toFixed(0)}천만원`;
  return `${won10k}만원`;
};

// KOR: 기간(월)을 연/월 표기로 변환
// ENG: Convert duration (months) to year/month notation
const formatDuration = (months: number): string => {
  if (months >= 12) {
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0 ? `${years}년 ${rem}개월` : `${years}년`;
  }
  return `${months}개월`;
};

// KOR: visaChain 배열을 코드 문자열 배열로 추출
// ENG: Extract visa code strings from visaChain array
const getVisaCodes = (pathway: CompatPathway): string[] =>
  (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v) => v.code);

export default function Diagnosis78Page() {
  // KOR: 현재 화면 단계 상태
  // ENG: Current screen step state
  const [currentStep, setCurrentStep] = useState<Step>('search');

  // KOR: 현재 입력 필드 단계 인덱스
  // ENG: Current input field step index
  const [inputStepIdx, setInputStepIdx] = useState<number>(0);

  // KOR: 사용자 입력 데이터 상태 (nationalit는 문자열, age는 숫자, availableAnnualFund는 숫자)
  // ENG: User input data state (nationality: string, age: number, availableAnnualFund: number)
  const [userInput, setUserInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 연령 입력 문자열 상태 (input 값 추적용)
  // ENG: Age input string state (for tracking input value)
  const [ageInput, setAgeInput] = useState<string>('');

  // KOR: 진단 결과 상태
  // ENG: Diagnosis result state
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 찜한 경로 ID 목록
  // ENG: Bookmarked pathway ID set
  const [likedPaths, setLikedPaths] = useState<Set<string>>(new Set());

  // KOR: 현재 열린 채팅 패널의 경로 ID
  // ENG: Currently open chat panel pathway ID
  const [chatPathId, setChatPathId] = useState<string | null>(null);

  // KOR: 검색 입력 상태
  // ENG: Search input state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // KOR: 활성화된 필터 태그
  // ENG: Active filter tag
  const [activeFilter, setActiveFilter] = useState<string>('전체');

  // KOR: 확장된 카드 ID (마일스톤 상세 보기)
  // ENG: Expanded card pathway ID (milestone detail view)
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // KOR: 로딩 진행률 (0~100)
  // ENG: Loading progress (0~100)
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  // KOR: 로딩 상태 메시지 인덱스
  // ENG: Loading status message index
  const [loadingMsgIdx, setLoadingMsgIdx] = useState<number>(0);

  // KOR: 로딩 중 표시할 메시지 목록 (당근 분위기)
  // ENG: Loading messages list (Karrot marketplace vibe)
  const LOADING_MESSAGES = [
    '🔍 내 동네 비자 매물 탐색 중...',
    '📦 최적 경로 박스 포장 중...',
    '💬 전문가에게 문의 중...',
    '🏷️ 가격표 붙이는 중...',
    '✅ 매물 목록 완성!',
  ];

  // KOR: 필터 옵션 목록
  // ENG: Filter options list
  const FILTER_OPTIONS = ['전체', '즉시 가능', '취업', '유학', '장기체류', '저비용'];

  // KOR: 현재 입력 단계 필드명
  // ENG: Current input step field name
  const currentField = INPUT_STEPS[inputStepIdx];

  // KOR: 로딩 애니메이션 처리 (useEffect)
  // ENG: Loading animation effect
  useEffect(() => {
    if (currentStep !== 'loading') return;

    setLoadingProgress(0);
    setLoadingMsgIdx(0);

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setResult(mockDiagnosisResult);
          setCurrentStep('results');
          return 100;
        }
        const newVal = prev + 4;
        const msgIdx = Math.min(Math.floor(newVal / 20), LOADING_MESSAGES.length - 1);
        setLoadingMsgIdx(msgIdx);
        return newVal;
      });
    }, 80);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // KOR: 입력값 업데이트 핸들러 (string 또는 number 타입)
  // ENG: Input value update handler (string or number type)
  const handleInputUpdate = (field: InputField, value: string | number) => {
    setUserInput((prev) => ({ ...prev, [field]: value }));
  };

  // KOR: 다음 입력 단계로 이동 (마지막이면 로딩 시작)
  // ENG: Move to next input step (start loading if last)
  const handleNextInputStep = () => {
    if (inputStepIdx < INPUT_STEPS.length - 1) {
      setInputStepIdx((prev) => prev + 1);
    } else {
      setCurrentStep('loading');
    }
  };

  // KOR: 이전 입력 단계로 이동 (첫 단계면 검색 화면으로)
  // ENG: Move to previous input step (go to search if first)
  const handlePrevInputStep = () => {
    if (inputStepIdx > 0) {
      setInputStepIdx((prev) => prev - 1);
    } else {
      setCurrentStep('search');
    }
  };

  // KOR: 현재 입력 단계 유효성 검사
  // ENG: Validate current input step
  const isCurrentStepValid = (): boolean => {
    const field = currentField;
    if (field === 'nationality') return !!userInput.nationality;
    if (field === 'age') return typeof userInput.age === 'number' && userInput.age > 0;
    if (field === 'educationLevel') return !!userInput.educationLevel;
    if (field === 'availableAnnualFund') return typeof userInput.availableAnnualFund === 'number';
    if (field === 'finalGoal') return !!userInput.finalGoal;
    if (field === 'priorityPreference') return !!userInput.priorityPreference;
    return false;
  };

  // KOR: 찜하기 토글 핸들러
  // ENG: Toggle bookmark handler
  const toggleLike = (pathId: string) => {
    setLikedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(pathId)) {
        next.delete(pathId);
      } else {
        next.add(pathId);
      }
      return next;
    });
  };

  // KOR: 처음부터 다시 시작
  // ENG: Restart from beginning
  const handleReset = () => {
    setCurrentStep('search');
    setInputStepIdx(0);
    setUserInput({});
    setAgeInput('');
    setResult(null);
    setLikedPaths(new Set());
    setChatPathId(null);
    setExpandedCard(null);
    setSearchQuery('');
  };

  // ─── KOR: 검색/메인 화면 렌더링 ─────────────────────────────────────
  // ─── ENG: Render search/main screen ─────────────────────────────────
  const renderSearchScreen = () => (
    <div className="min-h-screen bg-gray-50">
      {/* KOR: 당근 스타일 상단 헤더 / ENG: Karrot-style top header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* KOR: 동네 위치 선택 버튼 / ENG: Neighborhood location button */}
          <button className="flex items-center gap-1 font-bold text-gray-900 text-lg">
            <MapPin className="w-5 h-5 text-orange-500" />
            <span>강남구 역삼동</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          <div className="flex-1" />
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Search className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* KOR: 검색 입력 바 / ENG: Search input bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="비자 경로 검색 (예: E-7, 유학, 취업...)"
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </header>

      {/* KOR: 오렌지 배너 섹션 / ENG: Orange banner section */}
      <div className="bg-linear-to-br from-orange-400 to-orange-500 px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🥕</span>
            <span className="text-white font-bold text-xs bg-orange-300/40 px-2 py-0.5 rounded-full">
              비자 매물 장터
            </span>
          </div>
          <h1 className="text-white font-bold text-2xl leading-tight mb-1">
            내 조건에 맞는<br />비자 경로 찾기
          </h1>
          <p className="text-orange-100 text-sm mb-4">
            당근처럼 쉽게 — 내 동네 비자 경로를 탐색해요
          </p>
          <button
            onClick={() => setCurrentStep('input')}
            className="bg-white text-orange-500 font-bold text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            내 조건으로 탐색 시작 →
          </button>
        </div>
      </div>

      {/* KOR: 빠른 카테고리 필터 탭 / ENG: Quick category filter tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
          <button className="shrink-0 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            필터
          </button>
        </div>
      </div>

      {/* KOR: 인기 매물 미리보기 섹션 / ENG: Popular listings preview section */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900 text-base">🔥 인기 비자 경로</h2>
          <button className="text-sm text-orange-500 font-medium">더보기</button>
        </div>

        {/* KOR: 호환 경로 미리보기 카드 (mockPathways 사용)
            ENG: Compatible pathway preview cards (using mockPathways) */}
        <div className="space-y-3">
          {mockPathways.slice(0, 3).map((pathway: CompatPathway, idx: number) => (
            <div
              key={pathway.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex p-4 gap-4">
                {/* KOR: 썸네일 아이콘 / ENG: Thumbnail icon */}
                <div className="w-20 h-20 rounded-xl bg-linear-to-br from-orange-100 to-orange-200 flex items-center justify-center shrink-0">
                  <span className="text-3xl">{PATHWAY_THUMBS[idx]}</span>
                </div>

                {/* KOR: 매물 정보 / ENG: Listing info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                      {pathway.nameKo}
                    </h3>
                    <button className="shrink-0 p-1">
                      <Heart className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>

                  {/* KOR: 비자 체인 태그 / ENG: Visa chain tags */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {getVisaCodes(pathway).slice(0, 3).map((code: string) => (
                      <span
                        key={code}
                        className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full"
                      >
                        {code}
                      </span>
                    ))}
                  </div>

                  {/* KOR: 거리/조회수/찜 수 / ENG: Distance/views/likes */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {DISTANCES[idx]}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {VIEW_COUNTS[idx]}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {LIKE_COUNTS[idx]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* KOR: 진단 시작 CTA 카드 / ENG: Start diagnosis CTA card */}
        <div
          onClick={() => setCurrentStep('input')}
          className="mt-4 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl p-5 cursor-pointer active:scale-98 transition-transform shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base">내 조건으로 정밀 분석</p>
              <p className="text-orange-100 text-sm">국적·학력·예산 입력 후 맞춤 매물 확인</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70 ml-auto shrink-0" />
          </div>
        </div>
      </div>

      {/* KOR: 하단 탭 네비게이션 / ENG: Bottom tab navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center">
        {[
          { icon: Home, label: '홈', active: true },
          { icon: Grid, label: '카테고리', active: false },
          { icon: Tag, label: '내 경로', active: false },
          { icon: MessageCircle, label: '채팅', active: false },
          { icon: User, label: 'MY', active: false },
        ].map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`flex-1 flex flex-col items-center py-2 ${
              active ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-0.5 font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {/* KOR: 하단 네비 여백 / ENG: Bottom nav spacer */}
      <div className="h-16" />
    </div>
  );

  // ─── KOR: 입력 화면 렌더링 ──────────────────────────────────────────
  // ─── ENG: Render input screen ───────────────────────────────────────
  const renderInputScreen = () => {
    const progress = ((inputStepIdx + 1) / INPUT_STEPS.length) * 100;
    const stepLabel = STEP_LABELS[currentField];

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* KOR: 입력 화면 헤더 / ENG: Input screen header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={handlePrevInputStep} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-gray-400 font-medium">
              {inputStepIdx + 1} / {INPUT_STEPS.length} — {stepLabel.en}
            </p>
            <p className="font-bold text-gray-900 text-sm">{stepLabel.ko} 입력</p>
          </div>
          <button onClick={handleReset} className="text-gray-400 text-xs">
            처음으로
          </button>
        </header>

        {/* KOR: 진행 바 (당근 오렌지) / ENG: Progress bar (Karrot orange) */}
        <div className="bg-white h-1.5">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* KOR: 입력 영역 / ENG: Input area */}
        <div className="flex-1 px-4 py-6">
          {/* KOR: 단계 안내 타이틀 카드 / ENG: Step guide title card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-sm">{inputStepIdx + 1}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400">매물 검색 조건</p>
                <h2 className="font-bold text-gray-900">{stepLabel.ko}을(를) 알려주세요</h2>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-11">
              더 정확한 비자 매물을 찾아드려요 🥕
            </p>
          </div>

          {/* KOR: 국적 선택 — popularCountries는 { code, flag, nameKo, nameEn }
              ENG: Nationality selection — popularCountries has { code, flag, nameKo, nameEn } */}
          {currentField === 'nationality' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {popularCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleInputUpdate('nationality', country.nameEn)}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                      userInput.nationality === country.nameEn
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-100 bg-white hover:border-orange-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">{country.flag}</span>
                    <span className="text-xs text-gray-700 font-medium truncate w-full text-center">
                      {country.nameKo}
                    </span>
                  </button>
                ))}
              </div>
              {userInput.nationality && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-700 font-medium">
                    {userInput.nationality} 선택됨
                  </span>
                </div>
              )}
            </div>
          )}

          {/* KOR: 나이 직접 입력 / ENG: Age direct input */}
          {currentField === 'age' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <label className="block text-sm text-gray-600 mb-2 font-medium">만 나이</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={ageInput}
                  onChange={(e) => {
                    setAgeInput(e.target.value);
                    const num = parseInt(e.target.value, 10);
                    if (!isNaN(num) && num > 0) {
                      handleInputUpdate('age', num);
                    }
                  }}
                  placeholder="예: 25"
                  min={18}
                  max={65}
                  className="flex-1 text-3xl font-bold text-gray-900 text-center outline-none border-b-2 border-orange-300 focus:border-orange-500 pb-1 bg-transparent"
                />
                <span className="text-gray-500 font-medium">세</span>
              </div>
              {/* KOR: 빠른 선택 버튼 / ENG: Quick select buttons */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {[20, 25, 28, 30, 35, 40].map((age) => (
                  <button
                    key={age}
                    onClick={() => {
                      setAgeInput(String(age));
                      handleInputUpdate('age', age);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      userInput.age === age
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                    }`}
                  >
                    {age}세
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* KOR: 학력 선택 — educationOptions는 { value, labelKo, labelEn, emoji }
              ENG: Education level selection — educationOptions has { value, labelKo, labelEn, emoji } */}
          {currentField === 'educationLevel' && (
            <div className="space-y-2">
              {educationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputUpdate('educationLevel', option.value)}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl border-2 text-left transition-all ${
                    userInput.educationLevel === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-100 bg-white hover:border-orange-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{option.emoji}</span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{option.labelKo}</p>
                      <p className="text-xs text-gray-400">{option.labelEn}</p>
                    </div>
                  </div>
                  {userInput.educationLevel === option.value && (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* KOR: 연간 예산 선택 — fundOptions는 { value(number), labelKo, labelEn, bracket }
              ENG: Annual budget selection — fundOptions has { value (number), labelKo, labelEn, bracket } */}
          {currentField === 'availableAnnualFund' && (
            <div className="space-y-2">
              {fundOptions.map((option) => (
                <button
                  key={option.bracket}
                  onClick={() => handleInputUpdate('availableAnnualFund', option.value)}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl border-2 text-left transition-all ${
                    userInput.availableAnnualFund === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-100 bg-white hover:border-orange-200'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{option.labelKo}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{option.labelEn}</p>
                  </div>
                  <DollarSign
                    className={`w-4 h-4 shrink-0 ${
                      userInput.availableAnnualFund === option.value
                        ? 'text-orange-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}

          {/* KOR: 최종 목표 선택 — goalOptions는 { value, labelKo, labelEn, emoji, descKo }
              ENG: Final goal selection — goalOptions has { value, labelKo, labelEn, emoji, descKo } */}
          {currentField === 'finalGoal' && (
            <div className="space-y-2">
              {goalOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputUpdate('finalGoal', option.value)}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-2 text-left transition-all ${
                    userInput.finalGoal === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-100 bg-white hover:border-orange-200'
                  }`}
                >
                  <span className="text-xl shrink-0">{option.emoji}</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{option.labelKo}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{option.descKo}</p>
                  </div>
                  {userInput.finalGoal === option.value && (
                    <Check className="w-4 h-4 text-orange-500 ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* KOR: 우선순위 선택 — priorityOptions는 { value, labelKo, labelEn, emoji, descKo }
              ENG: Priority selection — priorityOptions has { value, labelKo, labelEn, emoji, descKo } */}
          {currentField === 'priorityPreference' && (
            <div className="space-y-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputUpdate('priorityPreference', option.value)}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-2 text-left transition-all ${
                    userInput.priorityPreference === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-100 bg-white hover:border-orange-200'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl ${
                      userInput.priorityPreference === option.value
                        ? 'bg-orange-500'
                        : 'bg-gray-100'
                    }`}
                  >
                    {option.emoji}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{option.labelKo}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{option.descKo}</p>
                  </div>
                  {userInput.priorityPreference === option.value && (
                    <Check className="w-4 h-4 text-orange-500 ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* KOR: 하단 다음 버튼 / ENG: Bottom next button */}
        <div className="bg-white border-t border-gray-100 px-4 py-4">
          <button
            onClick={handleNextInputStep}
            disabled={!isCurrentStepValid()}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
              isCurrentStepValid()
                ? 'bg-orange-500 text-white active:scale-98 shadow-lg shadow-orange-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {inputStepIdx === INPUT_STEPS.length - 1 ? '🥕 매물 탐색 시작!' : '다음'}
          </button>
        </div>
      </div>
    );
  };

  // ─── KOR: 로딩 화면 렌더링 ─────────────────────────────────────────
  // ─── ENG: Render loading screen ────────────────────────────────────
  const renderLoadingScreen = () => (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-6">
      {/* KOR: 당근 아이콘 로딩 애니메이션 / ENG: Karrot icon loading animation */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
          <span className="text-5xl">🥕</span>
        </div>
        {/* KOR: 궤도 회전 점 / ENG: Rotating orbit dot */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2.5 h-2.5 bg-orange-300 rounded-full" />
        </div>
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: '2s', animationDirection: 'reverse' }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-orange-200 rounded-full" />
        </div>
      </div>

      <h2 className="font-bold text-gray-900 text-xl mb-2 text-center">
        맞춤 비자 매물 탐색 중
      </h2>
      <p className="text-orange-600 text-sm font-medium mb-6 text-center">
        {LOADING_MESSAGES[loadingMsgIdx]}
      </p>

      {/* KOR: 오렌지 진행 바 / ENG: Orange progress bar */}
      <div className="w-full max-w-xs bg-orange-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-100"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      <p className="text-gray-400 text-xs mt-2">{Math.round(loadingProgress)}%</p>

      {/* KOR: 입력 요약 미니 카드 / ENG: Input summary mini card */}
      <div className="mt-8 bg-white rounded-2xl border border-orange-100 shadow-sm p-4 w-full max-w-xs">
        <p className="text-xs text-gray-400 mb-2 font-medium">검색 조건 요약</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {(
            [
              ['국적', userInput.nationality ?? '-'],
              ['나이', userInput.age != null ? `${userInput.age}세` : '-'],
              ['학력', userInput.educationLevel ?? '-'],
              ['예산', userInput.availableAnnualFund != null ? `${userInput.availableAnnualFund}만원+` : '-'],
            ] as [string, string][]
          ).map(([key, val]) => (
            <div key={key} className="flex flex-col">
              <span className="text-gray-400">{key}</span>
              <span className="font-semibold text-gray-700 truncate">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── KOR: 결과 화면 렌더링 ─────────────────────────────────────────
  // ─── ENG: Render results screen ────────────────────────────────────
  const renderResultsScreen = () => {
    if (!result) return null;

    // KOR: mockPathways(CompatPathway[])를 결과 카드로 사용 (RecommendedPathway 대신)
    // ENG: Use mockPathways (CompatPathway[]) for result cards (instead of RecommendedPathway)
    const pathways: CompatPathway[] = mockPathways;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* KOR: 결과 화면 헤더 / ENG: Result screen header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={handleReset} className="p-1">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1">
              <p className="text-xs text-gray-400">비자 매물 탐색 결과</p>
              <p className="font-bold text-gray-900 text-sm">
                {pathways.length}개 경로 발견됨
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-orange-500 text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              재탐색
            </button>
          </div>

          {/* KOR: 검색 조건 요약 배너 / ENG: Search conditions summary banner */}
          <div className="mx-4 mb-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
            <p className="text-xs text-orange-700 truncate">
              <span className="font-bold">{userInput.nationality ?? '선택 국적'}</span>
              {' · '}
              <span>{userInput.educationLevel ?? '학력'}</span>
              {' · '}
              <span>{userInput.availableAnnualFund != null ? `${userInput.availableAnnualFund}만원+` : '예산'}</span>
            </p>
          </div>
        </header>

        {/* KOR: 정렬/필터 바 / ENG: Sort/filter bar */}
        <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-3">
          <button className="flex items-center gap-1 text-sm text-gray-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            성공률순
            <ChevronDown className="w-3 h-3" />
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <button className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="w-3.5 h-3.5" />
            기간순
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <button className="flex items-center gap-1 text-sm text-gray-600">
            <DollarSign className="w-3.5 h-3.5" />
            비용순
          </button>
        </div>

        {/* KOR: 매물 카드 목록 / ENG: Listing card list */}
        <div className="px-4 py-4 space-y-4 pb-24">
          {pathways.map((pathway: CompatPathway, idx: number) => {
            const status = getFeasibilityStatus(pathway.feasibilityLabel);
            const isLiked = likedPaths.has(pathway.id);
            const isExpanded = expandedCard === pathway.id;
            const isChatOpen = chatPathId === pathway.id;
            const dist = DISTANCES[idx] ?? '1km';
            const views = VIEW_COUNTS[idx] ?? 100;
            const likes = LIKE_COUNTS[idx] ?? 10;
            const scoreColor = getScoreColor(pathway.finalScore);
            const feasEmoji = getFeasibilityEmoji(pathway.feasibilityLabel);
            const visaCodes = getVisaCodes(pathway);
            const gradient = CARD_GRADIENTS[idx] ?? CARD_GRADIENTS[0];

            return (
              <div
                key={pathway.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* KOR: 카드 상단 이미지 영역 / ENG: Card top image area */}
                <div
                  className={`relative h-36 bg-linear-to-br ${gradient} flex items-center justify-center`}
                >
                  {/* KOR: 이모지 썸네일 / ENG: Emoji thumbnail */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-5xl">{feasEmoji}</span>
                    <span className="text-3xl">{PATHWAY_THUMBS[idx]}</span>
                  </div>

                  {/* KOR: 매물 상태 배지 / ENG: Listing status badge */}
                  <div
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bgColor} ${status.color}`}
                  >
                    {status.text}
                  </div>

                  {/* KOR: 찜하기 버튼 / ENG: Bookmark button */}
                  <button
                    onClick={() => toggleLike(pathway.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                    />
                  </button>

                  {/* KOR: 점수 배지 / ENG: Score badge */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: scoreColor }}
                    />
                    <span className="text-xs font-bold text-gray-700">
                      {pathway.finalScore}점
                    </span>
                  </div>

                  {/* KOR: 플랫폼 지원 배지 / ENG: Platform support badge */}
                  {pathway.platformSupport === 'full_support' && (
                    <div className="absolute bottom-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      잡차자 지원
                    </div>
                  )}
                </div>

                {/* KOR: 카드 본문 / ENG: Card body */}
                <div className="p-4">
                  {/* KOR: 비자 체인 코드 태그 / ENG: Visa chain code tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {visaCodes.map((code: string) => (
                      <span
                        key={code}
                        className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-medium"
                      >
                        #{code}
                      </span>
                    ))}
                  </div>

                  {/* KOR: 경로 이름 (한국어) / ENG: Pathway name (Korean) */}
                  <h3 className="font-bold text-gray-900 text-base leading-snug mb-1">
                    {pathway.nameKo}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2">{pathway.nameEn}</p>

                  {/* KOR: 설명 / ENG: Description */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">
                    {pathway.description}
                  </p>

                  {/* KOR: 핵심 정보 그리드 (비용·기간·거리) / ENG: Key info grid (cost·duration·distance) */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <DollarSign className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">예상 비용</p>
                      <p className="font-bold text-gray-900 text-xs">
                        {formatCost(pathway.estimatedCostWon)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">소요 기간</p>
                      <p className="font-bold text-gray-900 text-xs">
                        {formatDuration(pathway.estimatedMonths)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <MapPin className="w-4 h-4 text-green-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">내 동네</p>
                      <p className="font-bold text-gray-900 text-xs">{dist}</p>
                    </div>
                  </div>

                  {/* KOR: 비자 체인 시각화 / ENG: Visa chain visualization */}
                  <div className="bg-orange-50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-orange-700 font-semibold mb-2">비자 경로</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {visaCodes.map((code: string, codeIdx: number) => (
                        <div key={`${code}-${codeIdx}`} className="flex items-center gap-1">
                          <div className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {code}
                          </div>
                          {codeIdx < visaCodes.length - 1 && (
                            <ChevronRight className="w-3 h-3 text-orange-400" />
                          )}
                        </div>
                      ))}
                    </div>
                    {pathway.visaChainStr && (
                      <p className="text-xs text-orange-500 mt-1.5 font-mono">{pathway.visaChainStr}</p>
                    )}
                  </div>

                  {/* KOR: 마일스톤 상세 (확장 시) / ENG: Milestone detail (when expanded) */}
                  {isExpanded && (
                    <div className="mb-3 space-y-2">
                      <p className="text-xs font-bold text-gray-700 mb-2">📋 단계별 로드맵</p>
                      {pathway.milestones.map((ms) => (
                        <div
                          key={ms.order}
                          className="flex gap-3 items-start bg-gray-50 rounded-xl p-3"
                        >
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {ms.order}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{ms.nameKo}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {ms.visaStatus !== 'none' && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                                  {ms.visaStatus}
                                </span>
                              )}
                              {ms.canWorkPartTime && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  아르바이트 {ms.weeklyHours}h/주
                                </span>
                              )}
                              {ms.estimatedMonthlyIncome > 0 && (
                                <span className="text-xs text-gray-500">
                                  월 ~{ms.estimatedMonthlyIncome}만원
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{ms.monthFromStart}개월 차</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* KOR: 다음 액션 힌트 (확장 시) / ENG: Next action hints (when expanded) */}
                  {isExpanded && pathway.nextSteps.length > 0 && (
                    <div className="mb-3 bg-blue-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-blue-700 mb-2">💡 지금 할 일</p>
                      {pathway.nextSteps.map((step, si) => (
                        <div key={si} className="flex items-start gap-2 mb-1.5 last:mb-0">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">{si + 1}</span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-800">{step.nameKo}</p>
                            <p className="text-xs text-gray-500">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* KOR: 하단 메타 정보 + 액션 버튼 / ENG: Bottom meta info + action buttons */}
                  <div className="flex items-center justify-between">
                    {/* KOR: 조회수 / 찜 수 표시 / ENG: View count / like count display */}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {isLiked ? likes + 1 : likes}
                      </span>
                    </div>

                    {/* KOR: 상세보기 / 채팅 버튼 / ENG: Detail / chat buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setExpandedCard(isExpanded ? null : pathway.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                      >
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                        {isExpanded ? '접기' : '상세보기'}
                      </button>
                      <button
                        onClick={() => setChatPathId(isChatOpen ? null : pathway.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-sm"
                      >
                        <MessageCircle className="w-3 h-3" />
                        채팅문의
                      </button>
                    </div>
                  </div>

                  {/* KOR: 채팅 문의 패널 / ENG: Chat inquiry panel */}
                  {isChatOpen && (
                    <div className="mt-3 border-t border-orange-100 pt-3">
                      <div className="bg-orange-50 rounded-xl p-3">
                        {/* KOR: 전문가 프로필 / ENG: Expert profile */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            잡
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">잡차자 비자 전문가</p>
                            <p className="text-xs text-green-600">● 온라인</p>
                          </div>
                          <button
                            onClick={() => setChatPathId(null)}
                            className="ml-auto p-1"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>

                        {/* KOR: 자동 안내 메시지 / ENG: Auto guidance message */}
                        <div className="bg-white rounded-xl p-3 text-xs text-gray-700 shadow-sm">
                          <p>
                            안녕하세요!{' '}
                            <span className="font-semibold text-orange-600">{pathway.nameKo}</span>{' '}
                            경로에 대해 궁금한 점이 있으신가요? 무엇이든 물어보세요 😊
                          </p>
                          {pathway.note && (
                            <p className="mt-1.5 text-gray-500 italic">
                              💡 참고: {pathway.note}
                            </p>
                          )}
                        </div>

                        {/* KOR: 채팅 입력창 / ENG: Chat input */}
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="메시지를 입력하세요..."
                            className="flex-1 bg-white rounded-full px-3 py-1.5 text-xs outline-none border border-orange-200 focus:border-orange-400"
                          />
                          <button className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-white" />
                          </button>
                        </div>

                        {/* KOR: 빠른 질문 버튼 / ENG: Quick question buttons */}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {['자격 요건이 궁금해요', '서류가 어렵나요?', '기간을 줄일 수 있나요?'].map(
                            (q) => (
                              <button
                                key={q}
                                className="text-xs bg-white text-orange-600 border border-orange-200 rounded-full px-2.5 py-1 hover:bg-orange-50"
                              >
                                {q}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* KOR: 추가 탐색 안내 카드 / ENG: Additional exploration guide card */}
          <div className="bg-white rounded-2xl border border-dashed border-orange-300 p-5 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-orange-500" />
            </div>
            <p className="font-bold text-gray-900 mb-1">더 많은 비자 경로 보기</p>
            <p className="text-xs text-gray-500 mb-3">
              전문 상담사와 1:1 매칭으로 맞춤 경로를 더 찾아드려요
            </p>
            <button className="bg-orange-500 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-orange-600 transition-all">
              전문가 상담 신청
            </button>
          </div>

          {/* KOR: 찜한 경로 안내 배너 / ENG: Bookmarked pathways guide banner */}
          {likedPaths.size > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
              <Heart className="w-5 h-5 text-red-400 fill-red-400 shrink-0" />
              <div>
                <p className="font-bold text-gray-800 text-sm">
                  {likedPaths.size}개 경로를 찜했어요
                </p>
                <p className="text-xs text-gray-500">
                  MY 탭에서 찜한 경로를 한번에 비교해보세요
                </p>
              </div>
            </div>
          )}
        </div>

        {/* KOR: 하단 고정 액션 바 / ENG: Bottom fixed action bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-3 rounded-xl border-2 border-orange-500 text-orange-500 font-bold text-sm hover:bg-orange-50 transition-all"
          >
            조건 수정
          </button>
          <button className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-md shadow-orange-200">
            결과 공유하기
          </button>
        </div>

        {/* KOR: 하단 바 여백 / ENG: Bottom bar spacer */}
        <div className="h-20" />
      </div>
    );
  };

  // ─── KOR: 메인 화면 분기 렌더링 ───────────────────────────────────
  // ─── ENG: Main render branch ──────────────────────────────────────
  return (
    <div className="max-w-sm mx-auto">
      {currentStep === 'search' && renderSearchScreen()}
      {currentStep === 'input' && renderInputScreen()}
      {currentStep === 'loading' && renderLoadingScreen()}
      {currentStep === 'results' && renderResultsScreen()}
    </div>
  );
}
