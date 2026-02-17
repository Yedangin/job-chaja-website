'use client';

// KOR: 상품 비교 스타일 비자 진단 페이지 (디자인 #71) — Amazon/Coupang/Best Buy 스타일
// ENG: Product Compare-style visa diagnosis page (Design #71) — Amazon/Coupang/Best Buy style

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
  Star,
  StarHalf,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Award,
  Clock,
  DollarSign,
  TrendingUp,
  Filter,
  Search,
  ShoppingCart,
  Zap,
  Globe,
  GraduationCap,
  Target,
  AlertCircle,
  ChevronRight,
  BarChart2,
  Bookmark,
  Share2,
  RefreshCcw,
  Info,
  ArrowRight,
} from 'lucide-react';

// KOR: 단계 타입 정의 — 입력 단계와 결과 단계
// ENG: Step type definition — input steps and result step
type Step = 'nationality' | 'age' | 'education' | 'fund' | 'goal' | 'priority' | 'result';

// KOR: 비자별 프로/콘 데이터 (상품 비교 스타일)
// ENG: Pro/Con data per visa (product compare style)
const visaProsCons: Record<string, { pros: string[]; cons: string[] }> = {
  'path-1': {
    pros: ['높은 취업 성공률', '장기 체류 가능', '전문직 커리어 개발', '영주권 연계 가능'],
    cons: ['초기 비용 높음', '학업 기간 필요', 'TOPIK 요구', '경쟁률 높음'],
  },
  'path-2': {
    pros: ['한국어 실력 향상', '안정적인 유학 경로', '다양한 대학 선택', '사회 적응 유리'],
    cons: ['총 기간 5년 이상', '비용 가장 높음', '취업 보장 없음', '졸업 후 변경 필요'],
  },
  'path-3': {
    pros: ['초기 비용 최소', '즉시 입국 가능', '거주권 전환 가능', '현장 기술 습득'],
    cons: ['업종 제한 있음', '사업장 이동 제한', '장기 소요', '한국어 필수'],
  },
};

// KOR: 별점을 렌더링하는 함수 (100점 만점 → 5점 척도)
// ENG: Function to render star rating (100-point scale → 5-star scale)
function renderStars(score: number): React.ReactNode {
  const stars = (score / 100) * 5;
  const fullStars = Math.floor(stars);
  const hasHalf = stars - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-orange-400 text-orange-400" />
      ))}
      {hasHalf && <StarHalf className="w-4 h-4 fill-orange-400 text-orange-400" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-orange-200" />
      ))}
    </div>
  );
}

// KOR: 점수를 5점 척도 문자열로 변환
// ENG: Convert score to 5-star scale string
function getStarRating(score: number): string {
  return ((score / 100) * 5).toFixed(1);
}

// KOR: 가능성 레이블을 한국어 배지 색상으로 변환
// ENG: Convert feasibility label to badge color
function getFeasibilityBadgeClass(label: RecommendedPathway['feasibilityLabel']): string {
  switch (label) {
    case '매우 높음': return 'bg-green-100 text-green-800 border border-green-300';
    case '높음': return 'bg-blue-100 text-blue-800 border border-blue-300';
    case '보통': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case '낮음': return 'bg-orange-100 text-orange-800 border border-orange-300';
    case '매우 낮음': return 'bg-red-100 text-red-800 border border-red-300';
    default: return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
}

// KOR: 메인 페이지 컴포넌트
// ENG: Main page component
export default function Diagnosis71Page() {
  // KOR: 현재 단계 상태
  // ENG: Current step state
  const [step, setStep] = useState<Step>('nationality');

  // KOR: 사용자 입력 상태 (초기값: mockInput)
  // ENG: User input state (initial value: mockInput)
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });

  // KOR: 나이 임시 입력값
  // ENG: Temporary age input value
  const [ageInput, setAgeInput] = useState<string>(String(mockInput.age));

  // KOR: 진단 결과 상태
  // ENG: Diagnosis result state
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 비자 비교 선택 목록 (최대 3개)
  // ENG: Selected visa comparison list (max 3)
  const [compareList, setCompareList] = useState<string[]>([]);

  // KOR: 비교 테이블 모드 활성화 여부
  // ENG: Whether compare table mode is active
  const [showCompareTable, setShowCompareTable] = useState<boolean>(false);

  // KOR: 각 비자 카드의 펼침/접힘 상태
  // ENG: Expand/collapse state for each visa card
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // KOR: 정렬 기준 상태
  // ENG: Sort criteria state
  const [sortBy, setSortBy] = useState<'score' | 'cost' | 'duration'>('score');

  // KOR: 진단 결과를 시뮬레이션하여 설정
  // ENG: Simulate and set diagnosis result
  const handleDiagnose = () => {
    const diagResult: DiagnosisResult = {
      ...mockDiagnosisResult,
      userInput: input,
    };
    setResult(diagResult);
    setStep('result');
  };

  // KOR: 비자 비교 목록 토글 (최대 3개)
  // ENG: Toggle visa comparison list (max 3)
  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  // KOR: 카드 펼침/접힘 토글
  // ENG: Toggle card expand/collapse
  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // KOR: 정렬된 비자 목록 반환
  // ENG: Return sorted visa list
  const getSortedPathways = (pathways: RecommendedPathway[]): RecommendedPathway[] => {
    return [...pathways].sort((a, b) => {
      if (sortBy === 'score') return b.feasibilityScore - a.feasibilityScore;
      if (sortBy === 'cost') return ((a as any).estimatedCostUSD ?? a.estimatedCostWon ?? 0) - ((b as any).estimatedCostUSD ?? b.estimatedCostWon ?? 0);
      if (sortBy === 'duration') return a.totalDurationMonths - b.totalDurationMonths;
      return 0;
    });
  };

  // KOR: 비교 대상 비자 목록 반환
  // ENG: Return pathways selected for comparison
  const getComparePathways = (pathways: RecommendedPathway[]): RecommendedPathway[] => {
    return pathways.filter(p => compareList.includes(p.id));
  };

  // ────────────────────────────────────────────────────
  // KOR: 입력 단계 렌더링 함수들
  // ENG: Input step render functions
  // ────────────────────────────────────────────────────

  // KOR: 국적 선택 단계
  // ENG: Nationality selection step
  const renderNationality = () => (
    <div className="space-y-4">
      {/* KOR: 단계 제목 / ENG: Step title */}
      <div className="flex items-center gap-2 mb-6">
        <Globe className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-bold text-gray-800">국적 선택 / Select Nationality</h2>
      </div>

      {/* KOR: 검색창 스타일 안내 / ENG: Search bar style prompt */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="국가를 검색하세요... / Search country..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
          readOnly
        />
      </div>

      {/* KOR: 인기 국가 그리드 / ENG: Popular countries grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {popularCountries.map(country => (
          <button
            key={country.code}
            onClick={() => setInput(prev => ({ ...prev, nationality: country.name }))}
            className={`flex items-center gap-2 px-3 py-2.5 rounded border text-sm font-medium transition-all ${
              input.nationality === country.name
                ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            <span className="text-xl">{country.flag}</span>
            <span className="truncate">{country.name}</span>
            {input.nationality === country.name && (
              <Check className="w-3.5 h-3.5 text-orange-500 ml-auto shrink-0" />
            )}
          </button>
        ))}
      </div>

      <button
        disabled={!input.nationality}
        onClick={() => setStep('age')}
        className="w-full mt-2 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded transition-colors"
      >
        다음 / Next <ChevronRight className="inline w-4 h-4" />
      </button>
    </div>
  );

  // KOR: 나이 입력 단계
  // ENG: Age input step
  const renderAge = () => (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-bold text-gray-800">나이 입력 / Enter Age</h2>
      </div>

      {/* KOR: 나이 입력 필드 / ENG: Age input field */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-48">
          <input
            type="number"
            min={18}
            max={60}
            value={ageInput}
            onChange={e => {
              setAgeInput(e.target.value);
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) setInput(prev => ({ ...prev, age: val }));
            }}
            className="w-full text-center text-3xl font-bold py-4 border-2 border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-800"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">세</span>
        </div>
        <p className="text-sm text-gray-500">18세 ~ 60세 사이로 입력하세요</p>
      </div>

      {/* KOR: 나이 범위 퀵 선택 / ENG: Age range quick select */}
      <div className="grid grid-cols-4 gap-2">
        {[20, 25, 30, 35].map(age => (
          <button
            key={age}
            onClick={() => { setAgeInput(String(age)); setInput(prev => ({ ...prev, age })); }}
            className={`py-2 rounded border text-sm font-medium transition-all ${
              input.age === age
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
            }`}
          >
            {age}세
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setStep('nationality')} className="flex-1 py-3 border border-gray-300 text-gray-600 font-medium rounded hover:bg-gray-50 transition-colors">
          이전 / Back
        </button>
        <button onClick={() => setStep('education')} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded transition-colors">
          다음 / Next <ChevronRight className="inline w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // KOR: 학력 선택 단계
  // ENG: Education selection step
  const renderEducation = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <GraduationCap className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-bold text-gray-800">학력 선택 / Education Level</h2>
      </div>

      <div className="space-y-2">
        {educationOptions.map(opt => (
          <button
            key={opt}
            onClick={() => setInput(prev => ({ ...prev, educationLevel: opt }))}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded border text-sm font-medium text-left transition-all ${
              input.educationLevel === opt
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
              input.educationLevel === opt ? 'border-orange-500' : 'border-gray-300'
            }`}>
              {input.educationLevel === opt && <div className="w-2 h-2 rounded-full bg-orange-500" />}
            </div>
            {opt}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setStep('age')} className="flex-1 py-3 border border-gray-300 text-gray-600 font-medium rounded hover:bg-gray-50 transition-colors">이전</button>
        <button disabled={!input.educationLevel} onClick={() => setStep('fund')} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded transition-colors">
          다음 <ChevronRight className="inline w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // KOR: 자금 선택 단계
  // ENG: Fund selection step
  const renderFund = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-bold text-gray-800">연간 가용 자금 / Annual Budget</h2>
      </div>

      <p className="text-sm text-gray-500">비자 비용, 생활비, 학비 등을 포함한 예상 연간 예산입니다.</p>

      <div className="space-y-2">
        {fundOptions.map(opt => (
          <button
            key={opt}
            onClick={() => setInput(prev => ({ ...prev, availableAnnualFund: opt }))}
            className={`w-full flex items-center justify-between px-4 py-3 rounded border text-sm font-medium transition-all ${
              input.availableAnnualFund === opt
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
            }`}
          >
            <span>{opt}</span>
            {input.availableAnnualFund === opt && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setStep('education')} className="flex-1 py-3 border border-gray-300 text-gray-600 font-medium rounded hover:bg-gray-50 transition-colors">이전</button>
        <button disabled={!input.availableAnnualFund} onClick={() => setStep('goal')} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded transition-colors">
          다음 <ChevronRight className="inline w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // KOR: 최종 목표 선택 단계
  // ENG: Final goal selection step
  const renderGoal = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-bold text-gray-800">최종 목표 / Final Goal</h2>
      </div>

      <div className="space-y-2">
        {goalOptions.map((opt, i) => (
          <button
            key={opt}
            onClick={() => setInput(prev => ({ ...prev, finalGoal: opt }))}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded border text-sm font-medium text-left transition-all ${
              input.finalGoal === opt
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
            }`}
          >
            <span className="text-lg">{['🌏', '💼', '🏢', '🎓', '🏅'][i]}</span>
            <span>{opt}</span>
            {input.finalGoal === opt && <Check className="w-4 h-4 text-orange-500 ml-auto shrink-0" />}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setStep('fund')} className="flex-1 py-3 border border-gray-300 text-gray-600 font-medium rounded hover:bg-gray-50 transition-colors">이전</button>
        <button disabled={!input.finalGoal} onClick={() => setStep('priority')} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded transition-colors">
          다음 <ChevronRight className="inline w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // KOR: 우선순위 선택 단계
  // ENG: Priority selection step
  const renderPriority = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-bold text-gray-800">우선순위 / Priority</h2>
      </div>

      <p className="text-sm text-gray-500">비자 경로를 추천할 때 가장 중요하게 생각하는 기준을 선택하세요.</p>

      <div className="grid grid-cols-1 gap-2">
        {priorityOptions.map((opt, i) => (
          <button
            key={opt}
            onClick={() => setInput(prev => ({ ...prev, priorityPreference: opt }))}
            className={`flex items-center gap-3 px-4 py-4 rounded border text-sm font-medium text-left transition-all ${
              input.priorityPreference === opt
                ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            <span className="text-xl">{['⚡', '💰', '✅', '🎯'][i]}</span>
            <div>
              <p className="font-semibold">{opt}</p>
              <p className="text-xs text-gray-400 mt-0.5">{['최단 기간으로 비자 취득', '비용 최소화 경로 추천', '성공 확률이 높은 경로', '분야별 맞춤 경로'][i]}</p>
            </div>
            {input.priorityPreference === opt && <Check className="w-4 h-4 text-orange-500 ml-auto shrink-0" />}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setStep('goal')} className="flex-1 py-3 border border-gray-300 text-gray-600 font-medium rounded hover:bg-gray-50 transition-colors">이전</button>
        <button
          disabled={!input.priorityPreference}
          onClick={handleDiagnose}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded transition-colors"
        >
          비자 비교 분석 시작 <Zap className="inline w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );

  // ────────────────────────────────────────────────────
  // KOR: 결과 화면 — 상품 비교 테이블 스타일
  // ENG: Result screen — Product compare table style
  // ────────────────────────────────────────────────────
  const renderResult = () => {
    if (!result) return null;
    const sorted = getSortedPathways(result.pathways);
    const bestPath = sorted[0];
    const comparePathways = getComparePathways(result.pathways);

    return (
      <div className="space-y-5">

        {/* KOR: 결과 상단 헤더 바 / ENG: Result header bar */}
        <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-orange-100 text-xs font-medium">비자 비교 분석 결과 / Visa Comparison Results</p>
              <h2 className="text-xl font-bold mt-0.5">{result.pathways.length}개 비자 경로 발견</h2>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
              <p className="text-2xl font-black">{result.pathways.length}</p>
              <p className="text-orange-100 text-xs">옵션</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-medium">
              {input.nationality}
            </span>
            <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-medium">
              {input.age}세
            </span>
            <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-medium">
              {input.educationLevel}
            </span>
            <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-medium">
              {input.finalGoal}
            </span>
          </div>
        </div>

        {/* KOR: Best Buy 스타일 에디터 추천 배너 / ENG: Best Buy-style editor's pick banner */}
        <div className="border-2 border-orange-400 rounded-xl bg-orange-50 p-4">
          <div className="flex items-start gap-3">
            <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shrink-0">
              BEST PICK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-orange-600 font-medium mb-0.5">잡차자 AI 추천 / JobChaja AI Pick</p>
              <p className="font-bold text-gray-800 text-sm">{bestPath.name}</p>
              <div className="flex items-center gap-2 mt-1.5">
                {renderStars(bestPath.feasibilityScore)}
                <span className="text-sm font-bold text-orange-600">{getStarRating(bestPath.feasibilityScore)}</span>
                <span className="text-xs text-gray-400">({bestPath.feasibilityScore}점)</span>
              </div>
            </div>
            <Award className="w-8 h-8 text-orange-400 shrink-0" />
          </div>
        </div>

        {/* KOR: 정렬 + 필터 바 / ENG: Sort + filter bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-gray-500 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> 정렬:
          </span>
          {(['score', 'cost', 'duration'] as const).map(key => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                sortBy === key
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
              }`}
            >
              {{ score: '추천순', cost: '비용 낮은순', duration: '기간 짧은순' }[key]}
            </button>
          ))}
        </div>

        {/* KOR: 비교 모드 토글 배너 / ENG: Compare mode toggle banner */}
        {compareList.length > 0 && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">
                {compareList.length}개 선택됨 (최대 3개)
              </span>
            </div>
            <button
              onClick={() => setShowCompareTable(v => !v)}
              className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors"
            >
              {showCompareTable ? '카드 보기' : '비교 테이블 보기'}
            </button>
          </div>
        )}

        {/* KOR: 비교 테이블 (선택한 비자끼리 나란히 비교) / ENG: Compare table (side-by-side comparison) */}
        {showCompareTable && comparePathways.length >= 2 && (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm min-w-max">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold border-b border-gray-200 w-32">
                    비교 항목
                  </th>
                  {comparePathways.map((p, i) => (
                    <th key={p.id} className="px-4 py-3 border-b border-gray-200 text-center min-w-40">
                      <div className="flex flex-col items-center gap-1">
                        {i === 0 && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                            BEST
                          </span>
                        )}
                        <span className="font-bold text-gray-800 text-xs leading-tight">{p.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* KOR: 별점 행 / ENG: Star rating row */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 font-medium">별점</td>
                  {comparePathways.map(p => (
                    <td key={p.id} className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {renderStars(p.feasibilityScore)}
                        <span className="text-orange-600 font-bold">{getStarRating(p.feasibilityScore)}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                {/* KOR: 가능성 행 / ENG: Feasibility row */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 font-medium">가능성</td>
                  {comparePathways.map(p => (
                    <td key={p.id} className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getFeasibilityBadgeClass(p.feasibilityLabel)}`}>
                        {getFeasibilityEmoji(p.feasibilityLabel)} {p.feasibilityLabel}
                      </span>
                    </td>
                  ))}
                </tr>
                {/* KOR: 소요 기간 행 / ENG: Duration row */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 font-medium">소요 기간</td>
                  {comparePathways.map(p => (
                    <td key={p.id} className="px-4 py-3 text-center font-semibold text-gray-700">
                      {p.totalDurationMonths}개월
                    </td>
                  ))}
                </tr>
                {/* KOR: 예상 비용 행 / ENG: Cost row */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 font-medium">예상 비용</td>
                  {comparePathways.map(p => (
                    <td key={p.id} className="px-4 py-3 text-center font-semibold text-gray-700">
                      ${((p as any).estimatedCostUSD ?? p.estimatedCostWon ?? 0).toLocaleString()}
                    </td>
                  ))}
                </tr>
                {/* KOR: 비자 체인 행 / ENG: Visa chain row */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 font-medium">비자 체인</td>
                  {comparePathways.map(p => (
                    <td key={p.id} className="px-4 py-3 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {(Array.isArray(p.visaChain) ? p.visaChain : []).map((v, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                            {v.visa}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                {/* KOR: 장점 행 / ENG: Pros row */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 font-medium align-top">장점</td>
                  {comparePathways.map(p => (
                    <td key={p.id} className="px-4 py-3 text-left align-top">
                      <ul className="space-y-1">
                        {(visaProsCons[p.id]?.pros ?? []).slice(0, 3).map((pro, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                            <Check className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                {/* KOR: 단점 행 / ENG: Cons row */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 font-medium align-top">단점</td>
                  {comparePathways.map(p => (
                    <td key={p.id} className="px-4 py-3 text-left align-top">
                      <ul className="space-y-1">
                        {(visaProsCons[p.id]?.cons ?? []).slice(0, 3).map((con, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                            <X className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                {/* KOR: 액션 버튼 행 / ENG: Action button row */}
                <tr>
                  <td className="px-4 py-3" />
                  {comparePathways.map((p, i) => (
                    <td key={p.id} className="px-4 py-3 text-center">
                      <button className={`w-full py-2 rounded font-bold text-xs transition-colors ${
                        i === 0
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'border border-orange-500 text-orange-600 hover:bg-orange-50'
                      }`}>
                        {i === 0 ? '이 경로 선택 / Select' : '상세 보기 / Detail'}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* KOR: 비자 상품 카드 목록 (Amazon 상품 리스트 스타일) / ENG: Visa product card list (Amazon product list style) */}
        {!showCompareTable && (
          <div className="space-y-3">
            {sorted.map((pathway, index) => {
              const isExpanded = expandedCards[pathway.id] ?? false;
              const isInCompare = compareList.includes(pathway.id);
              const prosCons = visaProsCons[pathway.id] ?? { pros: [], cons: [] };

              return (
                <div
                  key={pathway.id}
                  className={`border rounded-xl overflow-hidden transition-all ${
                    index === 0
                      ? 'border-orange-400 shadow-md'
                      : 'border-gray-200 shadow-sm'
                  } bg-white`}
                >
                  {/* KOR: 상품 카드 헤더 — Amazon 상품 리스팅처럼 / ENG: Card header — like Amazon product listing */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* KOR: 순위 번호 / ENG: Rank number */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                        index === 0 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* KOR: 배지 + 제목 / ENG: Badge + title */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          {index === 0 && (
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded border border-orange-300">
                              BEST PICK
                            </span>
                          )}
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getFeasibilityBadgeClass(pathway.feasibilityLabel)}`}>
                            {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
                          </span>
                        </div>

                        <h3 className="font-bold text-gray-800 text-sm leading-tight">{pathway.name}</h3>

                        {/* KOR: 별점 행 / ENG: Star rating row */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {renderStars(pathway.feasibilityScore)}
                          <span className="text-sm font-bold text-orange-600">{getStarRating(pathway.feasibilityScore)}</span>
                          <span className="text-xs text-gray-400">({pathway.feasibilityScore}점)</span>
                        </div>

                        {/* KOR: 핵심 지표 (Best Buy 스펙 요약처럼) / ENG: Key metrics (like Best Buy spec summary) */}
                        <div className="flex flex-wrap gap-3 mt-2.5">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-medium">{pathway.totalDurationMonths}개월</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-medium">${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-medium">{(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length}단계</span>
                          </div>
                        </div>

                        {/* KOR: 비자 체인 태그 / ENG: Visa chain tags */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                            <React.Fragment key={i}>
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium border border-gray-200">
                                {v.visa}
                              </span>
                              {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                                <ArrowRight className="w-3 h-3 text-gray-400 self-center" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* KOR: 카드 우측 액션 버튼 / ENG: Card right-side action buttons */}
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => toggleCompare(pathway.id)}
                          className={`px-2.5 py-1.5 rounded text-xs font-medium border transition-all ${
                            isInCompare
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-500'
                          }`}
                        >
                          {isInCompare ? '✓ 비교중' : '+ 비교'}
                        </button>
                        <button className="px-2.5 py-1.5 rounded text-xs font-medium border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700 transition-all">
                          <Bookmark className="w-3 h-3 mx-auto" />
                        </button>
                      </div>
                    </div>

                    {/* KOR: 짧은 설명 / ENG: Short description */}
                    <p className="text-xs text-gray-500 mt-3 leading-relaxed">{pathway.description}</p>

                    {/* KOR: 즉시 구매 버튼 (Amazon CTA 스타일) / ENG: Instant select button (Amazon CTA style) */}
                    <div className="flex gap-2 mt-3">
                      <button className={`flex-1 py-2.5 rounded font-bold text-sm transition-colors ${
                        index === 0
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-orange-400 hover:bg-orange-500 text-white'
                      }`}>
                        이 경로 선택하기 / Select This Path
                      </button>
                      <button
                        onClick={() => toggleCard(pathway.id)}
                        className="px-3 py-2.5 border border-gray-300 rounded text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* KOR: 펼침 상세 섹션 (Wirecutter/RTINGS 상세 비교 스타일) / ENG: Expanded detail section (Wirecutter/RTINGS detail style) */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-4">

                      {/* KOR: 프로/콘 섹션 / ENG: Pro/Con section */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-green-100">
                          <h4 className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> 장점 / Pros
                          </h4>
                          <ul className="space-y-1.5">
                            {prosCons.pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                                <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-red-100">
                          <h4 className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> 단점 / Cons
                          </h4>
                          <ul className="space-y-1.5">
                            {prosCons.cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                                <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* KOR: 마일스톤 타임라인 / ENG: Milestone timeline */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-orange-500" /> 단계별 로드맵 / Step Roadmap
                        </h4>
                        <div className="space-y-2">
                          {pathway.milestones.map((m, i) => (
                            <div key={i} className="flex items-start gap-2.5 bg-white rounded-lg p-2.5 border border-gray-100">
                              <div className="w-7 h-7 bg-orange-50 border border-orange-200 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-sm">{m.emoji}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-800">{m.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{m.description}</p>
                              </div>
                              <span className="shrink-0 text-xs font-bold text-orange-500 bg-orange-50 rounded-full w-5 h-5 flex items-center justify-center border border-orange-200">
                                {i + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* KOR: 비자 체인 상세 / ENG: Visa chain detail */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-1">
                          <ArrowRight className="w-3.5 h-3.5 text-orange-500" /> 비자 체인 상세 / Visa Chain Detail
                        </h4>
                        <div className="flex flex-wrap gap-2 items-center">
                          {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                            <React.Fragment key={i}>
                              <div className="bg-white border border-orange-200 rounded-lg px-3 py-2 text-center min-w-20 shadow-xs">
                                <p className="text-sm font-bold text-orange-600">{v.visa}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{v.duration}</p>
                              </div>
                              {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                                <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* KOR: 최저가 알림 (Amazon 가격 알림 스타일) / ENG: Price alert (Amazon price alert style) */}
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-amber-700">비용 절감 알림 / Cost Save Alert</p>
                          <p className="text-xs text-amber-600 mt-0.5">
                            이 경로의 예상 비용은 <strong>${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</strong> 입니다.
                            장학금/지원금 신청 시 최대 30% 절감 가능합니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* KOR: 하단 액션 바 / ENG: Bottom action bar */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => { setStep('nationality'); setResult(null); setCompareList([]); setShowCompareTable(false); }}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> 다시 진단 / Retry
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Share2 className="w-3.5 h-3.5" /> 공유
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-colors">
            <ShoppingCart className="w-3.5 h-3.5" /> 상담 신청 / Apply Consult
          </button>
        </div>
      </div>
    );
  };

  // ────────────────────────────────────────────────────
  // KOR: 진행 상태 표시 바 계산
  // ENG: Progress bar calculation
  // ────────────────────────────────────────────────────
  const stepOrder: Step[] = ['nationality', 'age', 'education', 'fund', 'goal', 'priority', 'result'];
  const currentIndex = stepOrder.indexOf(step);
  const progressPct = step === 'result' ? 100 : Math.round((currentIndex / 6) * 100);

  // KOR: 단계 레이블 맵
  // ENG: Step label map
  const stepLabels: Record<Step, string> = {
    nationality: '국적',
    age: '나이',
    education: '학력',
    fund: '예산',
    goal: '목표',
    priority: '우선순위',
    result: '결과',
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* KOR: Amazon 스타일 상단 헤더 / ENG: Amazon-style top header */}
      <header className="bg-gray-900 text-white px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-xs text-gray-400 leading-none">잡차자</p>
              <p className="text-sm font-bold text-orange-400 leading-tight">비자 비교 / Visa Compare</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              #71
            </span>
            <Search className="w-5 h-5 text-gray-300" />
          </div>
        </div>
      </header>

      {/* KOR: Amazon 스타일 오렌지 배너 / ENG: Amazon-style orange banner */}
      <div className="bg-orange-500 text-white text-center text-xs font-medium py-1.5">
        상품 비교 스타일 비자 진단 | Product Compare Style Visa Diagnosis
      </div>

      {/* KOR: 진행 바 / ENG: Progress bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">진행도 / Progress</span>
            <span className="text-xs font-bold text-orange-600">{progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {/* KOR: 단계 표시 도트 / ENG: Step indicator dots */}
          <div className="flex justify-between mt-1.5">
            {stepOrder.slice(0, -1).map((s, i) => (
              <span
                key={s}
                className={`text-xs ${
                  i <= currentIndex - 1 ? 'text-orange-500 font-bold' : 'text-gray-400'
                }`}
              >
                {stepLabels[s]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* KOR: 메인 콘텐츠 / ENG: Main content */}
      <main className="max-w-2xl mx-auto px-4 py-5 pb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          {step === 'nationality' && renderNationality()}
          {step === 'age' && renderAge()}
          {step === 'education' && renderEducation()}
          {step === 'fund' && renderFund()}
          {step === 'goal' && renderGoal()}
          {step === 'priority' && renderPriority()}
          {step === 'result' && renderResult()}
        </div>

        {/* KOR: 하단 안내 문구 / ENG: Bottom notice */}
        <div className="flex items-start gap-2 mt-4 px-1">
          <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            비자 비교 결과는 참고용이며, 실제 비자 심사는 출입국관리사무소의 판단에 따릅니다.
            Results are for reference only; actual visa decisions are made by immigration authorities.
          </p>
        </div>
      </main>
    </div>
  );
}
