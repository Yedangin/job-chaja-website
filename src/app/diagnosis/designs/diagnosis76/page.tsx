'use client';

// KOR: 비자 진단 페이지 - 부동산 매물 스타일 (디자인 #76)
// ENG: Visa Diagnosis Page - Real Estate Property Listing Style (Design #76)
// Concept: 비자를 부동산 매물처럼 검색·비교 (Zillow, Redfin, Zigbang 참조)
// Concept: Browse and compare visas like real estate listings (Zillow, Redfin, Zigbang reference)

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
  MapPin,
  Search,
  SlidersHorizontal,
  Heart,
  Share2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Home,
  DollarSign,
  Clock,
  Star,
  Filter,
  Grid3X3,
  List,
  ArrowRight,
  Building2,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Maximize2,
  Phone,
  Calendar,
  BarChart3,
  Globe,
  GraduationCap,
  Target,
  Banknote,
  User,
} from 'lucide-react';

// KOR: 입력 단계 타입 정의
// ENG: Input step type definition
type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

// KOR: 뷰 모드 타입 (그리드/리스트)
// ENG: View mode type (grid/list)
type ViewMode = 'grid' | 'list';

// KOR: 지도 핀 데이터 타입
// ENG: Map pin data type
interface MapPin {
  id: string;
  x: number;
  y: number;
  label: string;
  score: number;
  active: boolean;
}

// KOR: 지도 핀 목업 데이터 (비자별 위치)
// ENG: Map pin mock data (visa locations)
const mapPins: MapPin[] = [
  { id: 'path-1', x: 65, y: 30, label: 'D-2-7→E-7-R', score: 85, active: true },
  { id: 'path-2', x: 25, y: 55, label: 'D-4-1→D-2', score: 75, active: false },
  { id: 'path-3', x: 80, y: 65, label: 'E-9→F-2-6', score: 60, active: false },
];

// KOR: 필터 옵션 타입
// ENG: Filter option type
interface FilterState {
  minScore: number;
  maxCost: number;
  maxDuration: number;
  feasibilityLabel: string;
}

export default function Diagnosis76Page() {
  // KOR: 현재 입력 단계 상태
  // ENG: Current input step state
  const [currentStep, setCurrentStep] = useState<Step>('nationality');

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 결과 표시 여부
  // ENG: Whether to show results
  const [showResults, setShowResults] = useState(false);

  // KOR: 진단 결과 상태
  // ENG: Diagnosis result state
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 선택된 매물(비자 경로) 상태
  // ENG: Selected listing (visa pathway) state
  const [selectedPathway, setSelectedPathway] = useState<RecommendedPathway | null>(null);

  // KOR: 뷰 모드 상태 (그리드/리스트)
  // ENG: View mode state (grid/list)
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // KOR: 저장된 매물 목록 (즐겨찾기)
  // ENG: Saved listings (favorites)
  const [savedListings, setSavedListings] = useState<string[]>([]);

  // KOR: 필터 패널 표시 여부
  // ENG: Whether to show filter panel
  const [showFilters, setShowFilters] = useState(false);

  // KOR: 필터 상태
  // ENG: Filter state
  const [filters, setFilters] = useState<FilterState>({
    minScore: 0,
    maxCost: 100000,
    maxDuration: 120,
    feasibilityLabel: 'all',
  });

  // KOR: 지도 뷰 표시 여부
  // ENG: Whether to show map view
  const [showMap, setShowMap] = useState(false);

  // KOR: 활성 지도 핀
  // ENG: Active map pin
  const [activePin, setActivePin] = useState<string>('path-1');

  // KOR: 입력 단계 순서 정의
  // ENG: Input step order definition
  const steps: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'];

  // KOR: 현재 단계 인덱스
  // ENG: Current step index
  const stepIndex = steps.indexOf(currentStep);

  // KOR: 즐겨찾기 토글 함수
  // ENG: Toggle favorite function
  const toggleSave = (id: string) => {
    setSavedListings((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // KOR: 진단 실행 함수
  // ENG: Run diagnosis function
  const runDiagnosis = () => {
    setResult(mockDiagnosisResult);
    setShowResults(true);
    setSelectedPathway(null);
  };

  // KOR: 다음 단계로 이동
  // ENG: Move to next step
  const goNext = () => {
    const next = steps[stepIndex + 1];
    if (next) {
      setCurrentStep(next);
    } else {
      runDiagnosis();
    }
  };

  // KOR: 이전 단계로 이동
  // ENG: Move to previous step
  const goPrev = () => {
    const prev = steps[stepIndex - 1];
    if (prev) setCurrentStep(prev);
  };

  // KOR: 필터링된 경로 목록
  // ENG: Filtered pathway list
  const filteredPathways = result?.pathways.filter((p) => {
    if (p.feasibilityScore < filters.minScore) return false;
    if (((p as any).estimatedCostUSD ?? p.estimatedCostWon ?? 0) > filters.maxCost) return false;
    if (p.totalDurationMonths > filters.maxDuration) return false;
    if (filters.feasibilityLabel !== 'all' && p.feasibilityLabel !== filters.feasibilityLabel) return false;
    return true;
  }) ?? [];

  // KOR: 점수에 따른 가격 그래프 색상
  // ENG: Price graph color based on score
  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-blue-500';
    if (score >= 60) return 'bg-blue-400';
    return 'bg-blue-300';
  };

  // KOR: 비용을 달러 포맷으로 변환
  // ENG: Convert cost to dollar format
  const formatCost = (usd: number) =>
    usd >= 1000 ? `$${(usd / 1000).toFixed(0)}K` : `$${usd}`;

  // KOR: 단계별 아이콘 반환
  // ENG: Return icon per step
  const stepIcon = (step: Step) => {
    switch (step) {
      case 'nationality': return <Globe className="w-5 h-5" />;
      case 'age': return <User className="w-5 h-5" />;
      case 'educationLevel': return <GraduationCap className="w-5 h-5" />;
      case 'availableAnnualFund': return <Banknote className="w-5 h-5" />;
      case 'finalGoal': return <Target className="w-5 h-5" />;
      case 'priorityPreference': return <Star className="w-5 h-5" />;
    }
  };

  // KOR: 단계별 한국어 라벨
  // ENG: Korean label per step
  const stepLabel = (step: Step) => {
    switch (step) {
      case 'nationality': return '국적';
      case 'age': return '나이';
      case 'educationLevel': return '학력';
      case 'availableAnnualFund': return '연간 예산';
      case 'finalGoal': return '최종 목표';
      case 'priorityPreference': return '우선순위';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* KOR: 상단 헤더 - 부동산 앱 스타일 네비게이션 바 */}
      {/* ENG: Top header - real estate app style navigation bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* KOR: 로고 영역 */}
          {/* ENG: Logo area */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-blue-700 text-lg hidden sm:block">VisaZillow</span>
          </div>

          {/* KOR: 검색 바 - 매물 검색 스타일 */}
          {/* ENG: Search bar - property search style */}
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2 border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition-all">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-sm text-gray-500 truncate">
              {input.nationality ? `${input.nationality} — 비자 매물 검색` : '국적, 목표를 입력하세요...'}
            </span>
            <Search className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
          </div>

          {/* KOR: 헤더 우측 액션 버튼 */}
          {/* ENG: Header right action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:block">필터</span>
            </button>
            <button
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm transition-all ${showMap ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'}`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:block">지도</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* KOR: 메인 레이아웃 - 입력 패널 + 결과 패널 */}
        {/* ENG: Main layout - input panel + result panel */}
        <div className="flex gap-6">
          {/* KOR: 좌측 입력/필터 패널 */}
          {/* ENG: Left input/filter panel */}
          <aside className="w-80 shrink-0">
            {/* KOR: 진행 단계 표시바 (부동산 앱 스타일 스텝 인디케이터) */}
            {/* ENG: Progress step indicator (real estate app style) */}
            {!showResults && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-800 text-sm">비자 매물 찾기</h2>
                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                    {stepIndex + 1} / {steps.length}
                  </span>
                </div>

                {/* KOR: 단계 진행 바 */}
                {/* ENG: Step progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>

                {/* KOR: 단계 목록 */}
                {/* ENG: Step list */}
                <div className="space-y-2">
                  {steps.map((step, idx) => (
                    <div
                      key={step}
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                        step === currentStep
                          ? 'bg-blue-50 border border-blue-200'
                          : idx < stepIndex
                          ? 'opacity-60'
                          : 'opacity-40'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        idx < stepIndex ? 'bg-blue-500 text-white' : step === currentStep ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {idx < stepIndex ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          stepIcon(step)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-700 truncate">{stepLabel(step)}</div>
                        {idx < stepIndex && input[step as keyof DiagnosisInput] && (
                          <div className="text-xs text-blue-500 truncate">
                            {String(input[step as keyof DiagnosisInput])}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: 현재 단계 입력 카드 */}
            {/* ENG: Current step input card */}
            {!showResults && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-4">
                {/* 국적 선택 / Nationality selection */}
                {currentStep === 'nationality' && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <label className="text-sm font-bold text-gray-800">국적 선택</label>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">어느 나라에서 오셨나요? / Where are you from?</p>
                    <div className="grid grid-cols-3 gap-2">
                      {popularCountries.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => setInput((p) => ({ ...p, nationality: c.name }))}
                          className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all text-xs ${
                            input.nationality === c.name
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-600'
                          }`}
                        >
                          <span className="text-xl">{c.flag}</span>
                          <span className="truncate w-full text-center">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 나이 입력 / Age input */}
                {currentStep === 'age' && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-blue-500" />
                      <label className="text-sm font-bold text-gray-800">나이 입력</label>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">만 나이를 입력하세요 / Enter your age</p>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={18}
                        max={65}
                        value={input.age ?? ''}
                        onChange={(e) => setInput((p) => ({ ...p, age: parseInt(e.target.value) || undefined }))}
                        placeholder="예: 25"
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-center text-2xl font-bold text-blue-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      <span className="text-gray-500 text-sm">세</span>
                    </div>
                    {/* KOR: 나이 범위 버튼 빠른 선택 */}
                    {/* ENG: Quick age range buttons */}
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {[20, 25, 30, 35].map((age) => (
                        <button
                          key={age}
                          onClick={() => setInput((p) => ({ ...p, age }))}
                          className={`py-2 rounded-lg text-sm font-medium transition-all ${
                            input.age === age ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                          }`}
                        >
                          {age}세
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 학력 선택 / Education level selection */}
                {currentStep === 'educationLevel' && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="w-4 h-4 text-blue-500" />
                      <label className="text-sm font-bold text-gray-800">최종 학력</label>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">학력 수준을 선택하세요 / Select education level</p>
                    <div className="space-y-2">
                      {educationOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setInput((p) => ({ ...p, educationLevel: opt }))}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm ${
                            input.educationLevel === opt
                              ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                              : 'border-gray-200 hover:border-blue-300 text-gray-600'
                          }`}
                        >
                          <span>{opt}</span>
                          {input.educationLevel === opt && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 연간 예산 선택 / Annual budget selection */}
                {currentStep === 'availableAnnualFund' && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Banknote className="w-4 h-4 text-blue-500" />
                      <label className="text-sm font-bold text-gray-800">연간 가용 예산</label>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">연간 사용 가능한 비용 / Annual available budget</p>
                    <div className="space-y-2">
                      {fundOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setInput((p) => ({ ...p, availableAnnualFund: opt }))}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm ${
                            input.availableAnnualFund === opt
                              ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                              : 'border-gray-200 hover:border-blue-300 text-gray-600'
                          }`}
                        >
                          <span className="font-mono">{opt}</span>
                          {input.availableAnnualFund === opt && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 최종 목표 선택 / Final goal selection */}
                {currentStep === 'finalGoal' && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-blue-500" />
                      <label className="text-sm font-bold text-gray-800">최종 목표</label>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">한국에서의 목표 / Your goal in Korea</p>
                    <div className="space-y-2">
                      {goalOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setInput((p) => ({ ...p, finalGoal: opt }))}
                          className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border transition-all text-sm ${
                            input.finalGoal === opt
                              ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                              : 'border-gray-200 hover:border-blue-300 text-gray-600'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 ${
                            input.finalGoal === opt ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                          }`} />
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 우선순위 선택 / Priority selection */}
                {currentStep === 'priorityPreference' && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-blue-500" />
                      <label className="text-sm font-bold text-gray-800">우선순위</label>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">가장 중요한 조건은? / What matters most?</p>
                    <div className="space-y-2">
                      {priorityOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setInput((p) => ({ ...p, priorityPreference: opt }))}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm ${
                            input.priorityPreference === opt
                              ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                              : 'border-gray-200 hover:border-blue-300 text-gray-600'
                          }`}
                        >
                          <Star className={`w-4 h-4 shrink-0 ${input.priorityPreference === opt ? 'text-blue-500 fill-blue-500' : 'text-gray-300'}`} />
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* KOR: 이전/다음 네비게이션 버튼 */}
                {/* ENG: Prev/Next navigation buttons */}
                <div className="flex items-center gap-3 mt-5">
                  {stepIndex > 0 && (
                    <button
                      onClick={goPrev}
                      className="flex items-center gap-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:border-blue-400 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      이전
                    </button>
                  )}
                  <button
                    onClick={goNext}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
                  >
                    {stepIndex === steps.length - 1 ? (
                      <>
                        <Search className="w-4 h-4" />
                        비자 매물 검색
                      </>
                    ) : (
                      <>
                        다음
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* KOR: 결과 화면의 필터 패널 */}
            {/* ENG: Filter panel in results view */}
            {showResults && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-500" />
                    <h3 className="font-bold text-sm text-gray-800">매물 필터</h3>
                  </div>
                  <button
                    onClick={() => setFilters({ minScore: 0, maxCost: 100000, maxDuration: 120, feasibilityLabel: 'all' })}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    초기화
                  </button>
                </div>

                {/* KOR: 성공률 최소값 필터 */}
                {/* ENG: Minimum success rate filter */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-600 block mb-2">
                    최소 가능성 점수: <span className="text-blue-600 font-bold">{filters.minScore}점</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={filters.minScore}
                    onChange={(e) => setFilters((p) => ({ ...p, minScore: parseInt(e.target.value) }))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0점</span>
                    <span>100점</span>
                  </div>
                </div>

                {/* KOR: 최대 비용 필터 */}
                {/* ENG: Max cost filter */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-600 block mb-2">
                    최대 예산: <span className="text-blue-600 font-bold">{formatCost(filters.maxCost)}</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={1000}
                    value={filters.maxCost}
                    onChange={(e) => setFilters((p) => ({ ...p, maxCost: parseInt(e.target.value) }))}
                    className="w-full accent-blue-500"
                  />
                </div>

                {/* KOR: 최대 기간 필터 */}
                {/* ENG: Max duration filter */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-600 block mb-2">
                    최대 기간: <span className="text-blue-600 font-bold">{filters.maxDuration}개월</span>
                  </label>
                  <input
                    type="range"
                    min={6}
                    max={120}
                    step={6}
                    value={filters.maxDuration}
                    onChange={(e) => setFilters((p) => ({ ...p, maxDuration: parseInt(e.target.value) }))}
                    className="w-full accent-blue-500"
                  />
                </div>

                {/* KOR: 가능성 레이블 필터 */}
                {/* ENG: Feasibility label filter */}
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-2">가능성 수준</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', '매우 높음', '높음', '보통'].map((label) => (
                      <button
                        key={label}
                        onClick={() => setFilters((p) => ({ ...p, feasibilityLabel: label }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          filters.feasibilityLabel === label
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                        }`}
                      >
                        {label === 'all' ? '전체' : label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* KOR: 저장된 매물 (즐겨찾기) */}
            {/* ENG: Saved listings (favorites) */}
            {showResults && savedListings.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  <h3 className="font-bold text-sm text-gray-800">저장한 매물 ({savedListings.length})</h3>
                </div>
                <div className="space-y-2">
                  {savedListings.map((id) => {
                    const p = result?.pathways.find((pw) => pw.id === id);
                    if (!p) return null;
                    return (
                      <div key={id} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                        <span className="text-xs text-gray-700 flex-1 truncate">{p.name}</span>
                        <button onClick={() => toggleSave(id)}>
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* KOR: 우측 메인 콘텐츠 영역 */}
          {/* ENG: Right main content area */}
          <main className="flex-1 min-w-0">
            {/* KOR: 지도 뷰 영역 (결과 화면에서만 표시) */}
            {/* ENG: Map view area (shown only in results view) */}
            {showResults && showMap && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
                <div className="relative bg-blue-50 h-64">
                  {/* KOR: 가상 지도 배경 (격자 패턴) */}
                  {/* ENG: Virtual map background (grid pattern) */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'linear-gradient(#93c5fd 1px, transparent 1px), linear-gradient(90deg, #93c5fd 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                    }}
                  />
                  {/* KOR: 지도 도로 시뮬레이션 */}
                  {/* ENG: Road simulation on map */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 opacity-60" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-blue-200 opacity-60" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-blue-100 opacity-40" />
                    <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-blue-100 opacity-40" />
                  </div>

                  {/* KOR: 지도 핀 마커들 */}
                  {/* ENG: Map pin markers */}
                  {mapPins.map((pin) => {
                    const pathway = result?.pathways.find((p) => p.id === pin.id);
                    const isActive = activePin === pin.id;
                    return (
                      <button
                        key={pin.id}
                        onClick={() => {
                          setActivePin(pin.id);
                          if (pathway) setSelectedPathway(pathway);
                        }}
                        className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200"
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                      >
                        {/* KOR: 가격 버블 (부동산 앱 핀 스타일) */}
                        {/* ENG: Price bubble (real estate app pin style) */}
                        <div className={`px-2 py-1 rounded-full text-xs font-bold shadow-lg transition-all ${
                          isActive ? 'bg-blue-600 text-white scale-110' : 'bg-white text-blue-700 border border-blue-300'
                        }`}>
                          {pin.score}점
                        </div>
                        <div className={`w-2 h-2 mx-auto rounded-full ${isActive ? 'bg-blue-600' : 'bg-blue-400'}`} />

                        {/* KOR: 활성 핀의 툴팁 */}
                        {/* ENG: Active pin tooltip */}
                        {isActive && (
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-blue-200 p-3 w-48 text-left">
                            <div className="font-bold text-xs text-blue-700 mb-1">{pin.label}</div>
                            <div className="text-xs text-gray-500">
                              기간: {pathway?.totalDurationMonths}개월
                            </div>
                            <div className="text-xs text-gray-500">
                              비용: {formatCost((pathway as any)?.estimatedCostUSD ?? pathway?.estimatedCostWon ?? 0)}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}

                  {/* KOR: 지도 컨트롤 버튼 */}
                  {/* ENG: Map control buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1">
                    <button className="w-8 h-8 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
                      <span className="text-lg font-bold leading-none">+</span>
                    </button>
                    <button className="w-8 h-8 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
                      <span className="text-lg font-bold leading-none">−</span>
                    </button>
                  </div>

                  {/* KOR: 지도 레이블 */}
                  {/* ENG: Map label */}
                  <div className="absolute bottom-3 left-3 bg-white rounded-lg px-3 py-1.5 shadow border border-gray-200">
                    <span className="text-xs text-gray-500">비자 매물 지도</span>
                  </div>
                </div>
              </div>
            )}

            {/* KOR: 결과 없음 - 초기 안내 화면 */}
            {/* ENG: No results - initial guidance screen */}
            {!showResults && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Building2 className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">비자 매물을 찾아드립니다</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Zillow처럼 비자 경로를 검색하고 비교하세요.<br />
                  좌측 조건을 입력하면 딱 맞는 비자 경로를 찾아드립니다.
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                  {[
                    { icon: <MapPin className="w-5 h-5 text-blue-500" />, label: '지도 검색' },
                    { icon: <Filter className="w-5 h-5 text-blue-500" />, label: '필터 정렬' },
                    { icon: <BarChart3 className="w-5 h-5 text-blue-500" />, label: '비용 비교' },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-xl">
                      {item.icon}
                      <span className="text-xs text-gray-600 font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: 결과 헤더 (매물 수, 뷰 전환) */}
            {/* ENG: Results header (listing count, view toggle) */}
            {showResults && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-gray-800">
                      <span className="text-blue-600">{filteredPathways.length}개</span> 비자 매물 발견
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {input.nationality} · {input.educationLevel} · {input.finalGoal}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* KOR: 그리드/리스트 뷰 전환 버튼 */}
                    {/* ENG: Grid/list view toggle buttons */}
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* KOR: 매물 그리드/리스트 뷰 */}
                {/* ENG: Listing grid/list view */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6' : 'space-y-3 mb-6'}>
                  {filteredPathways.map((pathway) => {
                    const isSaved = savedListings.includes(pathway.id);
                    const isSelected = selectedPathway?.id === pathway.id;
                    const scoreColorClass = getScoreColor(pathway.feasibilityLabel);
                    const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

                    return (
                      <div
                        key={pathway.id}
                        onClick={() => setSelectedPathway(isSelected ? null : pathway)}
                        className={`bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                          isSelected ? 'border-blue-500 shadow-blue-100 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                        }`}
                      >
                        {/* KOR: 매물 카드 이미지 영역 (점수 그래프로 대체) */}
                        {/* ENG: Listing card image area (replaced with score graph) */}
                        <div className="relative h-32 bg-linear-to-br from-blue-50 to-blue-100 p-4 flex items-end">
                          {/* KOR: 가로 점수 막대 그래프 */}
                          {/* ENG: Horizontal score bar chart */}
                          <div className="w-full">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-blue-600 font-medium">가능성 지수</span>
                              <span className="text-2xl font-black text-blue-700">{pathway.feasibilityScore}점</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-3">
                              <div
                                className={`${getBarColor(pathway.feasibilityScore)} h-3 rounded-full transition-all duration-700`}
                                style={{ width: `${pathway.feasibilityScore}%` }}
                              />
                            </div>
                          </div>

                          {/* KOR: 즐겨찾기 버튼 */}
                          {/* ENG: Favorite button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSave(pathway.id); }}
                            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-all"
                          >
                            <Heart className={`w-4 h-4 ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                          </button>

                          {/* KOR: 가능성 레이블 배지 */}
                          {/* ENG: Feasibility label badge */}
                          <div className={`absolute top-3 left-3 ${scoreColorClass} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                            {emoji} {pathway.feasibilityLabel}
                          </div>
                        </div>

                        {/* KOR: 매물 카드 정보 영역 */}
                        {/* ENG: Listing card info area */}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1 truncate">
                            {pathway.name}
                          </h3>
                          <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                            {pathway.description}
                          </p>

                          {/* KOR: 비자 체인 태그 */}
                          {/* ENG: Visa chain tags */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((vc, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-mono"
                              >
                                {vc.visa}
                              </span>
                            ))}
                          </div>

                          {/* KOR: 주요 지표 3개 (기간, 비용, 단계) */}
                          {/* ENG: Three key metrics (duration, cost, steps) */}
                          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Clock className="w-3.5 h-3.5 text-blue-400" />
                              <span>{pathway.totalDurationMonths}개월</span>
                            </div>
                            <div className="w-px h-3 bg-gray-200" />
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <DollarSign className="w-3.5 h-3.5 text-blue-400" />
                              <span>{formatCost((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0)}</span>
                            </div>
                            <div className="w-px h-3 bg-gray-200" />
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                              <span>{pathway.milestones.length}단계</span>
                            </div>
                            <button className="ml-auto flex items-center gap-1 text-xs text-blue-500 font-medium hover:text-blue-700">
                              상세
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* KOR: 선택된 매물 상세 패널 (부동산 앱 상세 뷰 스타일) */}
                {/* ENG: Selected listing detail panel (real estate app detail view style) */}
                {selectedPathway && (
                  <div className="bg-white rounded-2xl border border-blue-300 shadow-lg overflow-hidden mb-6">
                    {/* KOR: 상세 패널 헤더 */}
                    {/* ENG: Detail panel header */}
                    <div className="bg-linear-to-br from-blue-600 to-blue-800 p-6 text-white relative">
                      <button
                        onClick={() => setSelectedPathway(null)}
                        className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
                          {getFeasibilityEmoji(selectedPathway.feasibilityLabel)}
                        </div>
                        <div>
                          <div className="text-xs text-blue-200 mb-1">비자 경로 상세 / Visa Pathway Detail</div>
                          <h3 className="font-bold text-lg leading-tight">{selectedPathway.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full">
                              {selectedPathway.feasibilityLabel}
                            </span>
                            <span className="text-blue-200 text-xs">점수: {selectedPathway.feasibilityScore}/100</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* KOR: 핵심 지표 카드 3개 */}
                      {/* ENG: Three key metric cards */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                          <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                          <div className="font-black text-blue-700 text-lg">{selectedPathway.totalDurationMonths}</div>
                          <div className="text-xs text-gray-500">개월</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                          <DollarSign className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                          <div className="font-black text-blue-700 text-lg">{formatCost((selectedPathway as any).estimatedCostUSD ?? selectedPathway.estimatedCostWon ?? 0)}</div>
                          <div className="text-xs text-gray-500">예상 비용</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                          <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                          <div className="font-black text-blue-700 text-lg">{selectedPathway.feasibilityScore}</div>
                          <div className="text-xs text-gray-500">가능성 점수</div>
                        </div>
                      </div>

                      {/* KOR: 비자 체인 (매물 갤러리 이미지처럼) */}
                      {/* ENG: Visa chain (like property gallery images) */}
                      <div className="mb-5">
                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          비자 체인 경로
                        </h4>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                          {(Array.isArray(selectedPathway.visaChain) ? selectedPathway.visaChain : []).map((vc, idx) => (
                            <div key={idx} className="flex items-center gap-2 shrink-0">
                              <div className="bg-blue-600 text-white rounded-xl px-4 py-2.5 text-center min-w-24">
                                <div className="font-bold text-sm font-mono">{vc.visa}</div>
                                <div className="text-xs text-blue-200 mt-0.5">{vc.duration}</div>
                              </div>
                              {idx < (Array.isArray(selectedPathway.visaChain) ? selectedPathway.visaChain : []).length - 1 && (
                                <ArrowRight className="w-4 h-4 text-blue-400 shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* KOR: 마일스톤 (부동산 투어 단계처럼) */}
                      {/* ENG: Milestones (like property tour steps) */}
                      <div className="mb-5">
                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          단계별 로드맵
                        </h4>
                        <div className="space-y-3">
                          {selectedPathway.milestones.map((ms, idx) => (
                            <div key={idx} className="flex gap-3">
                              <div className="flex flex-col items-center shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                                  {ms.emoji}
                                </div>
                                {idx < selectedPathway.milestones.length - 1 && (
                                  <div className="w-0.5 h-6 bg-blue-100 mt-1" />
                                )}
                              </div>
                              <div className="pb-3">
                                <div className="font-medium text-sm text-gray-800">{ms.title}</div>
                                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{ms.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* KOR: 중개사 연락 버튼 (행정사 상담 CTA) */}
                      {/* ENG: Agent contact buttons (administrative consultant CTA) */}
                      <div className="flex gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all">
                          <Phone className="w-4 h-4" />
                          비자 상담 예약
                        </button>
                        <button
                          onClick={() => toggleSave(selectedPathway.id)}
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                            savedListings.includes(selectedPathway.id)
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-300 hover:border-red-300'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${savedListings.includes(selectedPathway.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                        </button>
                        <button className="w-12 h-12 rounded-xl border border-gray-300 flex items-center justify-center hover:border-blue-300 transition-all">
                          <Share2 className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* KOR: 처음부터 다시 검색 버튼 */}
                {/* ENG: Start over search button */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setInput({});
                      setCurrentStep('nationality');
                      setSelectedPathway(null);
                    }}
                    className="text-sm text-gray-400 hover:text-blue-500 underline transition-all"
                  >
                    조건 변경하여 다시 검색
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* KOR: 하단 정보 배너 */}
      {/* ENG: Bottom info banner */}
      <div className="bg-blue-700 text-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-blue-300" />
            <span className="text-sm text-blue-100">
              비자 정보는 참고용이며, 최종 결정은 전문 행정사와 상담하세요.
            </span>
          </div>
          <span className="text-xs text-blue-300">Design #76 · Real Estate Style · VisaZillow</span>
        </div>
      </div>
    </div>
  );
}
