'use client';

// KOR: 비자 진단 디자인 #48 — 등산 코스 (Hiking Trail) 테마
// ENG: Visa Diagnosis Design #48 — Hiking Trail theme
// 참고: AllTrails, Strava, Komoot, Gaia GPS, PeakVisor
// Reference: AllTrails, Strava, Komoot, Gaia GPS, PeakVisor

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
  Mountain,
  MapPin,
  Flag,
  Compass,
  TrendingUp,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Check,
  Star,
  Wind,
  Sun,
  TreePine,
  Navigation,
  Activity,
  Award,
} from 'lucide-react';

// KOR: 등산 단계 정의 (총 6단계 입력 단계)
// ENG: Define hiking steps (6 total input steps)
const STEPS = [
  { id: 1, label: '출발지', labelEn: 'Nationality', icon: MapPin, desc: '국적 선택' },
  { id: 2, label: '등산객 정보', labelEn: 'Age', icon: Wind, desc: '나이 입력' },
  { id: 3, label: '장비 수준', labelEn: 'Education', icon: Award, desc: '학력 선택' },
  { id: 4, label: '준비 예산', labelEn: 'Budget', icon: DollarSign, desc: '자금 범위' },
  { id: 5, label: '정상 목표', labelEn: 'Final Goal', icon: Flag, desc: '최종 목표' },
  { id: 6, label: '등반 전략', labelEn: 'Priority', icon: Compass, desc: '우선순위' },
];

// KOR: 난이도 라벨 → 색상 매핑 (등산 난이도 배지)
// ENG: Feasibility label → color mapping (hiking difficulty badge)
const DIFFICULTY_MAP: Record<string, { color: string; bg: string; border: string; trail: string }> = {
  '매우 높음': { color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-400', trail: '왕초보 코스' },
  '높음': { color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-400', trail: '초급 코스' },
  '보통': { color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-400', trail: '중급 코스' },
  '낮음': { color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-400', trail: '고급 코스' },
  '매우 낮음': { color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-400', trail: '전문가 코스' },
};

// KOR: 고도 프로필 SVG 데이터 생성 함수 (점수 기반)
// ENG: Generate altitude profile SVG path data based on score
function generateElevationPath(score: number, milestoneCount: number): string {
  const width = 400;
  const height = 80;
  const points: string[] = [];
  // KOR: 점수가 높을수록 완만한 오르막, 낮을수록 험한 경로
  // ENG: Higher score = gentler climb, lower score = steeper/rougher path
  const segments = milestoneCount + 1;
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const baseY = height - (score / 100) * (height * 0.7);
    const variance = ((100 - score) / 100) * 15;
    const noise = i === 0 ? 0 : (Math.sin(i * 2.5) * variance);
    const y = Math.max(5, Math.min(height - 5, baseY + noise - (i / segments) * (height * 0.5)));
    points.push(`${x},${y}`);
  }
  return `M ${points.join(' L ')}`;
}

// KOR: 체크포인트 아이콘 배열 (순서대로 표시)
// ENG: Array of checkpoint icons shown in order
const CHECKPOINT_ICONS = ['🏕️', '🪨', '🌄', '🏔️', '🚩'];

export default function Diagnosis48Page() {
  // KOR: 현재 단계, 입력값, 결과 상태 관리
  // ENG: Current step, input values, and result state management
  const [currentStep, setCurrentStep] = useState(1);
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [expandedPathway, setExpandedPathway] = useState<string | null>('path-1');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNationality, setSelectedNationality] = useState('');

  // KOR: 다음 단계로 이동 핸들러
  // ENG: Handler to advance to the next step
  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  // KOR: 이전 단계로 이동 핸들러
  // ENG: Handler to go back to the previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  // KOR: 진단 제출 핸들러 — 목업 결과 반환
  // ENG: Diagnosis submit handler — returns mock result
  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setIsLoading(false);
    }, 2000);
  };

  // KOR: 현재 단계의 입력값 유효성 검사
  // ENG: Validate current step's input value
  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1: return !!selectedNationality;
      case 2: return !!(input.age && input.age > 0);
      case 3: return !!input.educationLevel;
      case 4: return !!input.availableAnnualFund;
      case 5: return !!input.finalGoal;
      case 6: return !!input.priorityPreference;
      default: return false;
    }
  };

  // KOR: 진행률 계산 (퍼센트)
  // ENG: Calculate progress percentage
  const progressPercent = result ? 100 : ((currentStep - 1) / STEPS.length) * 100;

  // KOR: 로딩 화면 — 등산 중 애니메이션
  // ENG: Loading screen — climbing animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-900 via-stone-800 to-amber-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-8xl mb-6 animate-bounce">🥾</div>
          <h2 className="text-2xl font-bold mb-2">정상을 향해 오르는 중...</h2>
          <p className="text-green-200 text-sm">최적의 비자 등반 코스를 분석하고 있습니다</p>
          <p className="text-stone-300 text-xs mt-1">Analyzing your optimal visa climbing route...</p>
          <div className="mt-8 flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-green-400"
                style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // KOR: 결과 화면 렌더링
  // ENG: Render result screen
  if (result) {
    return (
      <div className="min-h-screen bg-stone-50">
        {/* KOR: 결과 헤더 — 산 배경 / ENG: Result header — mountain background */}
        <div className="bg-linear-to-br from-green-800 via-green-700 to-stone-600 text-white px-6 py-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
              <polygon points="0,120 80,40 160,80 240,20 320,60 400,10 400,120" fill="white" />
            </svg>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Mountain className="w-5 h-5 text-green-300" />
              <span className="text-green-300 text-sm font-medium">등반 코스 분석 완료 / Trail Analysis Complete</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">정상까지의 코스가 준비됐습니다!</h1>
            <p className="text-green-200 text-sm">Your visa hiking trails are ready to explore</p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="bg-white/20 rounded-full px-3 py-1">
                🌍 {selectedNationality || 'Vietnam'}
              </span>
              <span className="bg-white/20 rounded-full px-3 py-1">
                🏔️ {result.pathways.length}개 코스 발견
              </span>
            </div>
          </div>
        </div>

        {/* KOR: 코스 목록 / ENG: Trail list */}
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {result.pathways.map((pathway, index) => {
            const diff = DIFFICULTY_MAP[pathway.feasibilityLabel] ?? DIFFICULTY_MAP['보통'];
            const isExpanded = expandedPathway === pathway.id;
            const elevPath = generateElevationPath(pathway.feasibilityScore, pathway.milestones.length);

            return (
              <div
                key={pathway.id}
                className={`bg-white rounded-2xl border-2 ${diff.border} shadow-md overflow-hidden transition-all duration-300`}
              >
                {/* KOR: 코스 헤더 / ENG: Trail card header */}
                <button
                  className="w-full text-left"
                  onClick={() => setExpandedPathway(isExpanded ? null : pathway.id)}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-xl font-bold text-stone-600">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${diff.bg} ${diff.color} ${diff.border}`}>
                            {diff.trail}
                          </span>
                          <span className="text-xs text-stone-400">{getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}</span>
                        </div>
                        <h3 className="font-bold text-stone-800 text-base leading-tight">{pathway.name}</h3>
                        <p className="text-stone-500 text-xs mt-0.5 line-clamp-2">{pathway.description}</p>
                      </div>
                      <div className="shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-stone-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-stone-400" />
                        )}
                      </div>
                    </div>

                    {/* KOR: 코스 핵심 지표 3개 / ENG: 3 key trail metrics */}
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {/* KOR: 성공 가능성 / ENG: Feasibility score */}
                      <div className="text-center">
                        <div className="text-xs text-stone-400 mb-1">성공률</div>
                        <div className="relative h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getScoreColor(pathway.feasibilityLabel)}`}
                            style={{ width: `${pathway.feasibilityScore}%` }}
                          />
                        </div>
                        <div className={`text-sm font-bold mt-1 ${diff.color}`}>{pathway.feasibilityScore}%</div>
                      </div>
                      {/* KOR: 총 소요 기간 / ENG: Total duration */}
                      <div className="text-center">
                        <div className="text-xs text-stone-400 mb-1">소요 기간</div>
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span className="text-sm font-bold text-stone-700">{pathway.totalDurationMonths}개월</span>
                        </div>
                      </div>
                      {/* KOR: 예상 비용 / ENG: Estimated cost */}
                      <div className="text-center">
                        <div className="text-xs text-stone-400 mb-1">예상 비용</div>
                        <div className="flex items-center justify-center gap-1">
                          <DollarSign className="w-3 h-3 text-stone-400" />
                          <span className="text-sm font-bold text-stone-700">${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* KOR: 펼쳐진 상세 내용 / ENG: Expanded detail content */}
                {isExpanded && (
                  <div className="border-t border-stone-100 bg-stone-50">
                    {/* KOR: 고도 프로필 그래프 / ENG: Elevation profile graph */}
                    <div className="px-5 pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">고도 프로필 / Elevation Profile</span>
                      </div>
                      <div className="bg-white rounded-xl border border-stone-200 p-3 relative overflow-hidden">
                        <svg viewBox="0 0 400 80" className="w-full h-16" preserveAspectRatio="none">
                          {/* KOR: 그라디언트 배경 채우기 / ENG: Gradient fill background */}
                          <defs>
                            <linearGradient id={`grad-${pathway.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#16a34a" stopOpacity="0.05" />
                            </linearGradient>
                          </defs>
                          {/* KOR: 등반 경로 선 / ENG: Climb path line */}
                          <path
                            d={elevPath}
                            fill="none"
                            stroke="#16a34a"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* KOR: 정상 지점 마커 / ENG: Summit marker */}
                          <circle cx="395" cy="8" r="4" fill="#f59e0b" stroke="white" strokeWidth="2" />
                        </svg>
                        {/* KOR: 정상 라벨 / ENG: Summit label */}
                        <div className="absolute top-2 right-3 text-xs text-amber-600 font-bold">⛰️ 정상</div>
                        <div className="absolute bottom-2 left-3 text-xs text-stone-400">출발</div>
                      </div>
                    </div>

                    {/* KOR: 비자 체인 (루트 경유지) / ENG: Visa chain (route waypoints) */}
                    <div className="px-5 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Navigation className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">등반 루트 / Visa Route</span>
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                          <React.Fragment key={i}>
                            <div className="flex flex-col items-center">
                              <div className="bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                {v.visa}
                              </div>
                              <span className="text-xs text-stone-400 mt-1">{v.duration}</span>
                            </div>
                            {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                              <div className="flex items-center pb-4">
                                <div className="w-6 h-0.5 bg-stone-300" />
                                <TrendingUp className="w-3 h-3 text-stone-400" />
                                <div className="w-6 h-0.5 bg-stone-300" />
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                        {/* KOR: 최종 목적지 마커 / ENG: Final destination marker */}
                        <div className="flex flex-col items-center ml-1">
                          <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                            🏆 목표
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* KOR: 체크포인트 마일스톤 / ENG: Checkpoint milestones */}
                    <div className="px-5 pt-4 pb-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Flag className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">체크포인트 / Checkpoints</span>
                      </div>
                      <div className="relative">
                        {/* KOR: 수직 연결선 / ENG: Vertical connector line */}
                        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-stone-200" />
                        <div className="space-y-4">
                          {pathway.milestones.map((ms, i) => (
                            <div key={i} className="flex items-start gap-4 relative">
                              {/* KOR: 체크포인트 아이콘 / ENG: Checkpoint icon */}
                              <div className="shrink-0 w-10 h-10 rounded-full bg-white border-2 border-green-300 flex items-center justify-center text-lg shadow-sm z-10">
                                {CHECKPOINT_ICONS[i] ?? '📍'}
                              </div>
                              <div className="flex-1 bg-white rounded-xl border border-stone-200 p-3 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-base">{ms.emoji}</span>
                                  <span className="font-semibold text-stone-800 text-sm">{ms.title}</span>
                                </div>
                                <p className="text-xs text-stone-500 leading-relaxed">{ms.description}</p>
                              </div>
                            </div>
                          ))}
                          {/* KOR: 최종 정상 체크포인트 / ENG: Final summit checkpoint */}
                          <div className="flex items-start gap-4 relative">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-amber-500 border-2 border-amber-400 flex items-center justify-center text-lg shadow-sm z-10">
                              🏆
                            </div>
                            <div className="flex-1 bg-amber-50 rounded-xl border border-amber-200 p-3 shadow-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-amber-800 text-sm">정상 도달! Summit Reached!</span>
                              </div>
                              <p className="text-xs text-amber-600 mt-1">목표 달성 — 한국에서의 새 출발을 축하합니다!</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* KOR: 다시 진단하기 버튼 / ENG: Retry diagnosis button */}
          <button
            onClick={() => { setResult(null); setCurrentStep(1); setInput({}); setSelectedNationality(''); }}
            className="w-full py-3 rounded-2xl border-2 border-stone-300 text-stone-600 font-semibold text-sm hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            다른 코스로 다시 탐색 / Explore Different Routes
          </button>
        </div>
      </div>
    );
  }

  // KOR: 입력 단계 화면 렌더링
  // ENG: Render input step screen
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* KOR: 등산 앱 스타일 상단 헤더 / ENG: Hiking app style top header */}
      <div className="bg-linear-to-br from-green-900 via-green-800 to-stone-700 text-white px-5 pt-8 pb-16 relative overflow-hidden">
        {/* KOR: 산 실루엣 배경 / ENG: Mountain silhouette background */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="0,100 60,30 120,70 200,10 280,55 340,25 400,50 400,100" fill="white" />
          </svg>
        </div>

        <div className="relative max-w-md mx-auto">
          {/* KOR: 앱 타이틀 / ENG: App title */}
          <div className="flex items-center gap-2 mb-6">
            <Mountain className="w-6 h-6 text-green-300" />
            <span className="text-green-300 font-bold text-lg tracking-wide">JobChaJa 비자 트레일</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">정상을 향한 비자 코스</h1>
          <p className="text-green-200 text-sm">나만의 맞춤 등반 루트를 찾아드립니다</p>
          <p className="text-stone-300 text-xs mt-0.5">Find your personalized visa hiking trail</p>

          {/* KOR: 진행률 트레일 바 / ENG: Progress trail bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-green-300 mb-2">
              <span>출발지</span>
              <span>정상 {Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-green-400 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* KOR: 단계 마커 / ENG: Step markers */}
            <div className="flex justify-between mt-1">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step.id <= currentStep ? 'bg-green-400' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KOR: 단계 입력 카드 (산 위에 올려진 카드 느낌) / ENG: Step input card (card lifted above mountain) */}
      <div className="flex-1 px-4 -mt-10 max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* KOR: 카드 상단 — 현재 단계 표시 / ENG: Card top — current step display */}
          <div className="bg-stone-50 border-b border-stone-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
                {React.createElement(STEPS[currentStep - 1].icon, { className: 'w-5 h-5 text-green-700' })}
              </div>
              <div>
                <div className="text-xs text-stone-400 font-medium">체크포인트 {currentStep} / {STEPS.length}</div>
                <div className="font-bold text-stone-800">
                  {STEPS[currentStep - 1].label}
                  <span className="text-stone-400 font-normal text-sm ml-2">/ {STEPS[currentStep - 1].labelEn}</span>
                </div>
              </div>
            </div>
          </div>

          {/* KOR: 단계별 입력 콘텐츠 / ENG: Step-specific input content */}
          <div className="p-6">

            {/* KOR: STEP 1 — 국적 선택 (출발지) / ENG: STEP 1 — Nationality (Starting point) */}
            {currentStep === 1 && (
              <div>
                <p className="text-stone-600 text-sm mb-1">어느 나라에서 출발하시나요?</p>
                <p className="text-stone-400 text-xs mb-4">Which country are you starting from?</p>
                <div className="grid grid-cols-3 gap-2">
                  {popularCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => { setSelectedNationality(country.name); setInput({ ...input, nationality: country.name }); }}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                        selectedNationality === country.name
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <span className="text-2xl">{country.flag}</span>
                      <span className="text-xs text-stone-600 font-medium truncate w-full text-center">{country.name}</span>
                      {selectedNationality === country.name && (
                        <Check className="w-3 h-3 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: STEP 2 — 나이 입력 / ENG: STEP 2 — Age input */}
            {currentStep === 2 && (
              <div>
                <p className="text-stone-600 text-sm mb-1">등산객의 나이를 알려주세요</p>
                <p className="text-stone-400 text-xs mb-4">Tell us the hiker's age</p>
                <div className="relative">
                  <Wind className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="number"
                    min={1}
                    max={99}
                    placeholder="예: 25"
                    value={input.age ?? ''}
                    onChange={(e) => setInput({ ...input, age: parseInt(e.target.value) || undefined })}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-stone-200 focus:border-green-500 focus:outline-none text-stone-800 text-lg font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">세 / years</span>
                </div>
                {/* KOR: 나이별 힌트 / ENG: Age-based hint */}
                {input.age && input.age < 30 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-xl px-3 py-2">
                    <Sun className="w-4 h-4" />
                    <span>젊은 등산객은 더 많은 코스를 선택할 수 있습니다! Young hikers have more trail options!</span>
                  </div>
                )}
              </div>
            )}

            {/* KOR: STEP 3 — 학력 선택 (장비 수준) / ENG: STEP 3 — Education (Equipment level) */}
            {currentStep === 3 && (
              <div>
                <p className="text-stone-600 text-sm mb-1">등산 장비 수준 (학력) 을 선택하세요</p>
                <p className="text-stone-400 text-xs mb-4">Select your equipment level (education)</p>
                <div className="space-y-2">
                  {educationOptions.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => setInput({ ...input, educationLevel: opt })}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                        input.educationLevel === opt
                          ? 'border-green-500 bg-green-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {/* KOR: 난이도별 장비 아이콘 / ENG: Equipment icon by level */}
                      <span className="text-xl shrink-0">{['🥾', '🎒', '⛏️', '🧗', '🏔️'][i]}</span>
                      <div>
                        <div className="font-semibold text-stone-700 text-sm">{opt}</div>
                        <div className="text-xs text-stone-400">{['기초 장비', '중급 장비', '표준 장비', '전문 장비', '최고급 장비'][i]}</div>
                      </div>
                      {input.educationLevel === opt && (
                        <Check className="w-4 h-4 text-green-600 ml-auto shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: STEP 4 — 연간 예산 선택 / ENG: STEP 4 — Annual budget selection */}
            {currentStep === 4 && (
              <div>
                <p className="text-stone-600 text-sm mb-1">등반에 사용할 연간 예산은?</p>
                <p className="text-stone-400 text-xs mb-4">Annual budget for your climbing journey?</p>
                <div className="space-y-2">
                  {fundOptions.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => setInput({ ...input, availableAnnualFund: opt })}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                        input.availableAnnualFund === opt
                          ? 'border-green-500 bg-green-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <DollarSign className="w-5 h-5 text-stone-400 shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold text-stone-700 text-sm">{opt}</div>
                        <div className="text-xs text-stone-400">{['입문자 예산', '기초 코스 가능', '중급 코스 가능', '고급 코스 가능', '프리미엄 코스'][i]}</div>
                      </div>
                      {/* KOR: 예산 규모 시각화 / ENG: Budget size visualization */}
                      <div className="flex gap-0.5 shrink-0">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div
                            key={j}
                            className={`w-1.5 h-6 rounded-full ${j <= i ? 'bg-green-500' : 'bg-stone-200'}`}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: STEP 5 — 최종 목표 선택 (정상) / ENG: STEP 5 — Final goal (Summit) */}
            {currentStep === 5 && (
              <div>
                <p className="text-stone-600 text-sm mb-1">어떤 정상을 목표로 하시나요?</p>
                <p className="text-stone-400 text-xs mb-4">Which summit are you aiming for?</p>
                <div className="space-y-2">
                  {goalOptions.map((opt, i) => {
                    const summitIcons = ['🗣️', '⛺', '🏢', '🎓', '🏆'];
                    const summitEn = ['Learn Korean', 'Short-term Work', 'Long-term Work', 'Study Degree', 'Permanent Residency'];
                    return (
                      <button
                        key={opt}
                        onClick={() => setInput({ ...input, finalGoal: opt })}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                          input.finalGoal === opt
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{summitIcons[i]}</span>
                        <div>
                          <div className="font-semibold text-stone-700 text-sm">{opt}</div>
                          <div className="text-xs text-stone-400">{summitEn[i]}</div>
                        </div>
                        {input.finalGoal === opt && (
                          <Check className="w-4 h-4 text-amber-600 ml-auto shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* KOR: STEP 6 — 우선순위 (등반 전략) / ENG: STEP 6 — Priority (Climbing strategy) */}
            {currentStep === 6 && (
              <div>
                <p className="text-stone-600 text-sm mb-1">어떤 등반 전략을 선호하시나요?</p>
                <p className="text-stone-400 text-xs mb-4">Which climbing strategy do you prefer?</p>
                <div className="space-y-3">
                  {priorityOptions.map((opt, i) => {
                    const stratIcons = ['⚡', '💰', '🛡️', '🎯'];
                    const stratEn = ['Fastest route', 'Lowest cost', 'Highest success', 'Specific field'];
                    const stratDesc = ['빠른 경로 우선', '저비용 코스', '안전 우선', '직종 맞춤'];
                    return (
                      <button
                        key={opt}
                        onClick={() => setInput({ ...input, priorityPreference: opt })}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                          input.priorityPreference === opt
                            ? 'border-green-500 bg-green-50 shadow-sm'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{stratIcons[i]}</span>
                        <div className="flex-1">
                          <div className="font-bold text-stone-800 text-sm">{opt}</div>
                          <div className="text-xs text-stone-400">{stratDesc[i]} / {stratEn[i]}</div>
                        </div>
                        {input.priorityPreference === opt && (
                          <div className="shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* KOR: 입력 요약 카드 / ENG: Input summary card */}
                <div className="mt-5 bg-stone-50 rounded-2xl border border-stone-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TreePine className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">등반 프로필 요약 / Hiker Profile</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="text-stone-600 truncate">{selectedNationality || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="text-stone-600">{input.age ? `${input.age}세` : '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="text-stone-600 truncate">{input.educationLevel?.replace(' (4년제 대학)', '').replace(' (2-3년제 대학)', '') || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="text-stone-600 truncate">{input.availableAnnualFund || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Flag className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="text-stone-600 truncate">{input.finalGoal || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KOR: 네비게이션 버튼 / ENG: Navigation buttons */}
          <div className="px-6 pb-6 flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3.5 rounded-2xl border-2 border-stone-300 text-stone-600 font-semibold text-sm hover:bg-stone-50 transition-colors"
              >
                ← 이전 / Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                isStepValid()
                  ? 'bg-linear-to-r from-green-700 to-green-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-500'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              {currentStep === STEPS.length ? (
                <span className="flex items-center justify-center gap-2">
                  <Mountain className="w-4 h-4" />
                  코스 분석 시작 / Analyze Trail
                </span>
              ) : (
                '다음 체크포인트 → / Next'
              )}
            </button>
          </div>
        </div>

        {/* KOR: 하단 팁 — 등산 맥락 / ENG: Bottom tip — hiking context */}
        <div className="mt-4 pb-8 text-center">
          <p className="text-xs text-stone-400">
            🌲 입력한 정보는 최적의 비자 코스를 찾는 데만 사용됩니다
          </p>
          <p className="text-xs text-stone-400 mt-0.5">
            Your information is only used to find your best visa trail
          </p>
        </div>
      </div>
    </div>
  );
}
