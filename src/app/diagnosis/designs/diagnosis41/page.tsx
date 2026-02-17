'use client';

// 항공편 검색 컨셉 비자 진단 페이지 / Flight Search concept visa diagnosis page
// 출발지(현재)→도착지(목표)를 항공편처럼 검색하는 UX
// UX that searches departure(now) → destination(goal) like flight booking

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
  Plane,
  ArrowRight,
  ArrowLeftRight,
  Search,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  Circle,
  RotateCcw,
  Globe,
  Target,
  Wallet,
  GraduationCap,
  SlidersHorizontal,
  X,
  Info,
} from 'lucide-react';

// 입력 단계 타입 / Input step type
type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference' | 'results';

// 정렬 옵션 타입 / Sort option type
type SortOption = 'score' | 'duration' | 'cost';

// 필터 상태 타입 / Filter state type
interface FilterState {
  maxDuration: number;
  maxCost: number;
  feasibility: string[];
}

// 항공편 등급 레이블 / Airline class label helper
function getFlightClass(score: number): { label: string; color: string; bg: string } {
  if (score >= 71) return { label: '퍼스트 클래스', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' };
  if (score >= 51) return { label: '비즈니스 클래스', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' };
  if (score >= 31) return { label: '이코노미 클래스', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' };
  return { label: '대기 예약', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' };
}

// 비용을 만원 단위로 포맷 / Format cost in 10k KRW
function formatCostKRW(costWon: number): string {
  if (costWon === 0) return '무료';
  if (costWon < 100) return `${costWon}만원`;
  if (costWon < 10000) return `${(costWon / 100).toFixed(1)}백만원`;
  return `${(costWon / 1000).toFixed(1)}천만원`;
}

// 기간을 항공편 포맷으로 / Format duration like flight time
function formatDuration(months: number): string {
  if (months < 12) return `${months}개월`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years}년`;
  return `${years}년 ${rem}개월`;
}

// 목표 코드 → 한국어 / Goal code to Korean
function goalLabel(code: string): string {
  return goalOptions.find((g) => g.value === code)?.labelKo ?? code;
}

// 국가 코드 → 이름 / Country code to name
function countryLabel(code: string): string {
  const c = popularCountries.find((c) => c.code === code);
  return c ? `${c.flag} ${c.nameKo}` : code;
}

// 학력 코드 → 한국어 / Education code to Korean
function educationLabel(code: string): string {
  return educationOptions.find((e) => e.value === code)?.labelKo ?? code;
}

export default function Diagnosis41Page() {
  // 현재 단계 / Current step
  const [step, setStep] = useState<Step>('nationality');

  // 사용자 입력 상태 / User input state
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });

  // 나이 입력 문자열 / Age input string
  const [ageStr, setAgeStr] = useState<string>(String(mockInput.age));

  // 결과 상태 / Result state
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // 검색 중 상태 / Searching state
  const [isSearching, setIsSearching] = useState(false);

  // 선택된 경로 / Selected pathway
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);

  // 정렬 옵션 / Sort option
  const [sortBy, setSortBy] = useState<SortOption>('score');

  // 필터 패널 열림 / Filter panel open
  const [filterOpen, setFilterOpen] = useState(false);

  // 필터 상태 / Filter state
  const [filters, setFilters] = useState<FilterState>({
    maxDuration: 999,
    maxCost: 99999,
    feasibility: [],
  });

  // 확장된 마일스톤 카드 / Expanded milestone card
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

  // 다음 단계로 이동 / Move to next step
  function handleNext() {
    const steps: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference', 'results'];
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) {
      setStep(steps[idx + 1]);
    }
  }

  // 이전 단계로 / Move to previous step
  function handleBack() {
    const steps: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference', 'results'];
    const idx = steps.indexOf(step);
    if (idx > 0) {
      setStep(steps[idx - 1]);
    }
  }

  // 검색(결과) 실행 / Execute search (results)
  function handleSearch() {
    setIsSearching(true);
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setIsSearching(false);
      setStep('results');
    }, 1800);
  }

  // 처음으로 / Reset to start
  function handleReset() {
    setStep('nationality');
    setResult(null);
    setSelectedPathwayId(null);
    setInput({ ...mockInput });
    setAgeStr(String(mockInput.age));
  }

  // 필터/정렬 적용된 경로 목록 / Filtered and sorted pathways
  function getFilteredPathways(): RecommendedPathway[] {
    if (!result) return [];
    let paths = [...result.pathways];

    // 필터 적용 / Apply filters
    if (filters.maxDuration < 999) {
      paths = paths.filter((p) => p.estimatedMonths <= filters.maxDuration);
    }
    if (filters.maxCost < 99999) {
      paths = paths.filter((p) => p.estimatedCostWon <= filters.maxCost);
    }
    if (filters.feasibility.length > 0) {
      paths = paths.filter((p) => filters.feasibility.includes(p.feasibilityLabel));
    }

    // 정렬 / Sort
    if (sortBy === 'score') paths.sort((a, b) => b.finalScore - a.finalScore);
    if (sortBy === 'duration') paths.sort((a, b) => a.estimatedMonths - b.estimatedMonths);
    if (sortBy === 'cost') paths.sort((a, b) => a.estimatedCostWon - b.estimatedCostWon);

    return paths;
  }

  // 선택된 경로 객체 / Selected pathway object
  const selectedPathway = result?.pathways.find((p) => p.pathwayId === selectedPathwayId) ?? null;

  // 단계 진행률 / Step progress
  const stepProgress: Record<Step, number> = {
    nationality: 1,
    age: 2,
    educationLevel: 3,
    availableAnnualFund: 4,
    finalGoal: 5,
    priorityPreference: 6,
    results: 7,
  };
  const currentProgress = stepProgress[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 font-sans">
      {/* 헤더 / Header — 항공사 스타일 */}
      <header className="bg-white border-b border-sky-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-800 leading-tight">잡차자 비자 항공편</div>
              <div className="text-xs text-sky-500 font-medium">JobChaja Visa Flight Search</div>
            </div>
          </div>
          {step !== 'nationality' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-sky-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>새 검색</span>
            </button>
          )}
        </div>
      </header>

      {/* 진행 바 / Progress bar */}
      {step !== 'results' && (
        <div className="bg-white border-b border-sky-50">
          <div className="max-w-6xl mx-auto px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-sky-100 rounded-full h-1.5">
                <div
                  className="bg-linear-to-r from-sky-400 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(currentProgress / 6) * 100}%` }}
                />
              </div>
              <span className="text-xs text-sky-600 font-medium shrink-0">{currentProgress}/6 단계</span>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ================================================
            입력 단계 UI / Input step UI
            출발지 → 도착지 항공권 검색창 스타일
        ================================================ */}
        {step !== 'results' && (
          <div className="max-w-2xl mx-auto">
            {/* 항공편 검색 카드 / Flight search card */}
            <div className="bg-white rounded-3xl shadow-xl border border-sky-100 overflow-hidden">
              {/* 상단 항공사 배너 / Airline banner */}
              <div className="bg-linear-to-br from-sky-500 to-blue-600 px-8 py-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-semibold">현재 상황</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <div className="w-8 border-t border-dashed border-white/40" />
                    <Plane className="w-5 h-5" />
                    <div className="w-8 border-t border-dashed border-white/40" />
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
                    <Target className="w-4 h-4" />
                    <span className="text-sm font-semibold">목표 비자</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold mt-2">나에게 맞는 비자 경로 검색</h1>
                <p className="text-sky-100 text-sm mt-1">Find your best visa pathway</p>
              </div>

              {/* 입력 폼 영역 / Input form area */}
              <div className="px-8 py-6">
                {/* STEP 1: 국적 / Nationality */}
                {step === 'nationality' && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="w-5 h-5 text-sky-500" />
                      <h2 className="text-lg font-bold text-slate-800">출발 국가 (국적)</h2>
                      <span className="text-sm text-slate-400">Nationality</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">어느 나라에서 오셨나요? / Where are you from?</p>
                    <div className="grid grid-cols-3 gap-2">
                      {popularCountries.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => setInput({ ...input, nationality: c.code })}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                            input.nationality === c.code
                              ? 'border-sky-500 bg-sky-50 text-sky-700 font-semibold shadow-md'
                              : 'border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700'
                          }`}
                        >
                          <span className="text-xl shrink-0">{c.flag}</span>
                          <span className="text-sm font-medium">{c.nameKo}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: 나이 / Age */}
                {step === 'age' && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-sky-500" />
                      <h2 className="text-lg font-bold text-slate-800">탑승자 나이</h2>
                      <span className="text-sm text-slate-400">Passenger Age</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">만 나이를 입력해주세요 / Enter your age</p>
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <input
                          type="number"
                          min={16}
                          max={65}
                          value={ageStr}
                          onChange={(e) => {
                            setAgeStr(e.target.value);
                            const parsed = parseInt(e.target.value, 10);
                            if (!isNaN(parsed)) setInput({ ...input, age: parsed });
                          }}
                          className="w-48 text-center text-4xl font-bold text-sky-600 border-2 border-sky-300 rounded-2xl py-4 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        />
                        <span className="absolute right-4 bottom-4 text-lg text-slate-400 font-medium">세</span>
                      </div>
                      <div className="flex gap-2">
                        {[18, 20, 24, 28, 32, 36].map((a) => (
                          <button
                            key={a}
                            onClick={() => { setAgeStr(String(a)); setInput({ ...input, age: a }); }}
                            className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                              input.age === a
                                ? 'bg-sky-500 text-white border-sky-500 font-semibold'
                                : 'border-slate-200 text-slate-600 hover:border-sky-300'
                            }`}
                          >
                            {a}세
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: 학력 / Education */}
                {step === 'educationLevel' && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap className="w-5 h-5 text-sky-500" />
                      <h2 className="text-lg font-bold text-slate-800">학력 (좌석 등급 기준)</h2>
                      <span className="text-sm text-slate-400">Education Level</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">최종 학력을 선택하세요 / Select your education level</p>
                    <div className="space-y-2">
                      {educationOptions.map((e) => (
                        <button
                          key={e.value}
                          onClick={() => setInput({ ...input, educationLevel: e.value })}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                            input.educationLevel === e.value
                              ? 'border-sky-500 bg-sky-50 text-sky-700 font-semibold shadow-md'
                              : 'border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700'
                          }`}
                        >
                          <span className="text-xl shrink-0">{e.emoji || '📄'}</span>
                          <div>
                            <div className="font-semibold text-sm">{e.labelKo}</div>
                            <div className="text-xs text-slate-400">{e.labelEn}</div>
                          </div>
                          {input.educationLevel === e.value && (
                            <CheckCircle className="w-5 h-5 text-sky-500 ml-auto shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: 예산 / Budget */}
                {step === 'availableAnnualFund' && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Wallet className="w-5 h-5 text-sky-500" />
                      <h2 className="text-lg font-bold text-slate-800">여행 예산 (연간 가용 자금)</h2>
                      <span className="text-sm text-slate-400">Available Annual Fund</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">한국 생활에 사용할 수 있는 연간 자금 / Annual fund available for living in Korea</p>
                    <div className="space-y-2">
                      {fundOptions.map((f) => (
                        <button
                          key={f.value}
                          onClick={() => setInput({ ...input, availableAnnualFund: f.value })}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                            input.availableAnnualFund === f.value
                              ? 'border-sky-500 bg-sky-50 text-sky-700 font-semibold shadow-md'
                              : 'border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <DollarSign className="w-4 h-4 text-sky-400 shrink-0" />
                            <span className="font-medium text-sm">{f.labelKo}</span>
                          </div>
                          <span className="text-xs text-slate-400">{f.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: 목표 / Goal */}
                {step === 'finalGoal' && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-sky-500" />
                      <h2 className="text-lg font-bold text-slate-800">목적지 (최종 목표)</h2>
                      <span className="text-sm text-slate-400">Final Destination</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">한국에서 이루고 싶은 목표는? / What is your goal in Korea?</p>
                    <div className="grid grid-cols-2 gap-3">
                      {goalOptions.map((g) => (
                        <button
                          key={g.value}
                          onClick={() => setInput({ ...input, finalGoal: g.value })}
                          className={`flex flex-col items-center gap-2 px-4 py-5 rounded-2xl border-2 transition-all ${
                            input.finalGoal === g.value
                              ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-lg scale-105'
                              : 'border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700'
                          }`}
                        >
                          <span className="text-3xl">{g.emoji}</span>
                          <span className="font-bold text-sm">{g.labelKo}</span>
                          <span className="text-xs text-slate-500 text-center">{g.descKo}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: 우선순위 / Priority */}
                {step === 'priorityPreference' && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <SlidersHorizontal className="w-5 h-5 text-sky-500" />
                      <h2 className="text-lg font-bold text-slate-800">탑승 클래스 우선순위</h2>
                      <span className="text-sm text-slate-400">Priority Preference</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">어떤 경로를 선호하시나요? / What type of route do you prefer?</p>
                    <div className="space-y-3">
                      {priorityOptions.map((p) => (
                        <button
                          key={p.value}
                          onClick={() => setInput({ ...input, priorityPreference: p.value })}
                          className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border-2 transition-all text-left ${
                            input.priorityPreference === p.value
                              ? 'border-sky-500 bg-sky-50 shadow-lg'
                              : 'border-slate-200 hover:border-sky-300 hover:bg-sky-50'
                          }`}
                        >
                          <span className="text-2xl shrink-0">{p.emoji}</span>
                          <div className="flex-1">
                            <div className={`font-bold ${input.priorityPreference === p.value ? 'text-sky-700' : 'text-slate-800'}`}>
                              {p.labelKo}
                            </div>
                            <div className="text-sm text-slate-500">{p.descKo}</div>
                            <div className="text-xs text-slate-400">{p.labelEn}</div>
                          </div>
                          {input.priorityPreference === p.value && (
                            <CheckCircle className="w-6 h-6 text-sky-500 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 네비게이션 버튼 / Navigation buttons */}
                <div className="mt-8 flex items-center gap-3">
                  {step !== 'nationality' && (
                    <button
                      onClick={handleBack}
                      className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
                    >
                      이전
                    </button>
                  )}
                  {step !== 'priorityPreference' ? (
                    <button
                      onClick={handleNext}
                      className="flex-1 py-3 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 text-white font-bold shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      <span>다음</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="flex-1 py-3 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 text-white font-bold shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSearching ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>경로 탐색 중...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>비자 항공편 검색</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 입력 요약 칩 / Input summary chips */}
            {step !== 'nationality' && (
              <div className="mt-4 flex flex-wrap gap-2">
                {input.nationality && (
                  <div className="bg-white border border-sky-200 rounded-full px-3 py-1.5 text-sm text-sky-700 flex items-center gap-1 shadow-sm">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{countryLabel(input.nationality)}</span>
                  </div>
                )}
                {step !== 'age' && input.age && (
                  <div className="bg-white border border-sky-200 rounded-full px-3 py-1.5 text-sm text-sky-700 flex items-center gap-1 shadow-sm">
                    <Users className="w-3.5 h-3.5" />
                    <span>{input.age}세</span>
                  </div>
                )}
                {(step === 'availableAnnualFund' || step === 'finalGoal' || step === 'priorityPreference') && input.educationLevel && (
                  <div className="bg-white border border-sky-200 rounded-full px-3 py-1.5 text-sm text-sky-700 flex items-center gap-1 shadow-sm">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{educationLabel(input.educationLevel)}</span>
                  </div>
                )}
                {(step === 'finalGoal' || step === 'priorityPreference') && input.availableAnnualFund !== undefined && (
                  <div className="bg-white border border-sky-200 rounded-full px-3 py-1.5 text-sm text-sky-700 flex items-center gap-1 shadow-sm">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>{fundOptions.find((f) => f.value === input.availableAnnualFund)?.labelKo ?? '-'}</span>
                  </div>
                )}
                {step === 'priorityPreference' && input.finalGoal && (
                  <div className="bg-white border border-sky-200 rounded-full px-3 py-1.5 text-sm text-sky-700 flex items-center gap-1 shadow-sm">
                    <Target className="w-3.5 h-3.5" />
                    <span>{goalLabel(input.finalGoal)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================================================
            결과 화면 / Results screen
            항공편 검색 결과 목록 스타일
        ================================================ */}
        {step === 'results' && result && (
          <div className="space-y-6">
            {/* 검색 요약 바 / Search summary bar */}
            <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* 출발 → 도착 표시 / Departure → Arrival display */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="bg-sky-50 border border-sky-200 rounded-xl px-3 py-2 text-sm font-semibold text-sky-700 flex items-center gap-1.5">
                    <span>{countryLabel(input.nationality)}</span>
                    <span className="text-slate-400">·</span>
                    <span>{input.age}세</span>
                    <span className="text-slate-400">·</span>
                    <span>{educationLabel(input.educationLevel)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sky-400">
                    <div className="w-6 border-t border-dashed border-sky-300" />
                    <Plane className="w-4 h-4" />
                    <div className="w-6 border-t border-dashed border-sky-300" />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-sm font-semibold text-blue-700 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>{goalLabel(input.finalGoal)}</span>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-sky-50 transition-all border border-sky-200"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>조건 변경</span>
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-800">{result.pathways.length}개</span> 경로 발견
                  <span className="text-slate-400 ml-1">({result.meta.totalPathwaysEvaluated}개 중)</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="text-sm text-slate-500">
                  {result.meta.hardFilteredOut}개 필터됨
                </div>
              </div>
            </div>

            {/* 정렬 + 필터 바 / Sort + filter bar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white border border-sky-200 rounded-xl p-1 shadow-sm">
                {([
                  { key: 'score', label: '추천순', icon: Star },
                  { key: 'duration', label: '빠른 순', icon: Clock },
                  { key: 'cost', label: '저렴한 순', icon: DollarSign },
                ] as { key: SortOption; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      sortBy === key
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-sky-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all shadow-sm ${
                  filterOpen
                    ? 'bg-sky-500 text-white border-sky-500'
                    : 'bg-white text-slate-600 border-sky-200 hover:border-sky-400'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>필터</span>
              </button>
            </div>

            {/* 필터 패널 / Filter panel */}
            {filterOpen && (
              <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-sky-500" />
                    필터 옵션
                  </h3>
                  <button
                    onClick={() => {
                      setFilters({ maxDuration: 999, maxCost: 99999, feasibility: [] });
                    }}
                    className="text-sm text-sky-600 hover:text-sky-800 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    초기화
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-2 font-medium">최대 기간</label>
                    <select
                      value={filters.maxDuration}
                      onChange={(e) => setFilters({ ...filters, maxDuration: parseInt(e.target.value, 10) })}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400"
                    >
                      <option value={999}>제한 없음</option>
                      <option value={12}>12개월 이하</option>
                      <option value={24}>24개월 이하</option>
                      <option value={48}>48개월 이하</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-2 font-medium">최대 비용</label>
                    <select
                      value={filters.maxCost}
                      onChange={(e) => setFilters({ ...filters, maxCost: parseInt(e.target.value, 10) })}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400"
                    >
                      <option value={99999}>제한 없음</option>
                      <option value={100}>100만원 이하</option>
                      <option value={1000}>1,000만원 이하</option>
                      <option value={3000}>3,000만원 이하</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-2 font-medium">실현 가능성</label>
                    <div className="space-y-1">
                      {['보통', '낮음', '매우낮음'].map((f) => (
                        <label key={f} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.feasibility.includes(f)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters({ ...filters, feasibility: [...filters.feasibility, f] });
                              } else {
                                setFilters({ ...filters, feasibility: filters.feasibility.filter((x) => x !== f) });
                              }
                            }}
                            className="rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                          />
                          <span className="text-sm text-slate-600">{getFeasibilityEmoji(f)} {f}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 결과 목록 + 상세 패널 / Results list + detail panel */}
            <div className="flex gap-6">
              {/* 항공편 목록 / Flight list */}
              <div className={`space-y-4 ${selectedPathway ? 'flex-1 min-w-0' : 'w-full'}`}>
                {getFilteredPathways().map((pathway, idx) => {
                  const cls = getFlightClass(pathway.finalScore);
                  const isSelected = selectedPathwayId === pathway.pathwayId;
                  const scoreColor = getScoreColor(pathway.finalScore);
                  const visaStops = pathway.visaChain.split(' → ');

                  return (
                    <div
                      key={pathway.pathwayId}
                      onClick={() => setSelectedPathwayId(isSelected ? null : pathway.pathwayId)}
                      className={`bg-white rounded-2xl border-2 shadow-md cursor-pointer transition-all hover:shadow-lg ${
                        isSelected
                          ? 'border-sky-500 shadow-sky-100'
                          : 'border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      {/* 항공편 카드 상단 / Flight card top */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* 순위 배지 + 클래스 / Rank badge + class */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 text-sm font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </div>
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cls.bg} ${cls.color}`}>
                                {cls.label}
                              </span>
                              {idx === 0 && (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  추천
                                </span>
                              )}
                            </div>

                            {/* 경로 이름 / Pathway name */}
                            <h3 className="font-bold text-slate-800 text-base mb-1">{pathway.nameKo}</h3>
                            <p className="text-xs text-slate-400">{pathway.nameEn}</p>
                          </div>

                          {/* 점수 표시 / Score display */}
                          <div className="text-right shrink-0">
                            <div
                              className="text-3xl font-black"
                              style={{ color: scoreColor }}
                            >
                              {pathway.finalScore}
                            </div>
                            <div className="text-xs text-slate-400 font-medium">점수</div>
                            <div className="text-base mt-0.5">{getFeasibilityEmoji(pathway.feasibilityLabel)}</div>
                          </div>
                        </div>

                        {/* 비자 경로 시각화 / Visa chain visualization */}
                        <div className="mt-4 flex items-center gap-1 flex-wrap">
                          {visaStops.map((visa, vIdx) => (
                            <React.Fragment key={vIdx}>
                              <div className="bg-sky-50 border border-sky-200 rounded-lg px-2.5 py-1 text-xs font-bold text-sky-700">
                                {visa}
                              </div>
                              {vIdx < visaStops.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-sky-300 shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>

                        {/* 핵심 지표 / Key metrics */}
                        <div className="mt-4 grid grid-cols-3 gap-3">
                          <div className="bg-slate-50 rounded-xl p-3 text-center">
                            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="text-xs">소요 기간</span>
                            </div>
                            <div className="font-bold text-slate-800 text-sm">{formatDuration(pathway.estimatedMonths)}</div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 text-center">
                            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                              <DollarSign className="w-3.5 h-3.5" />
                              <span className="text-xs">예상 비용</span>
                            </div>
                            <div className="font-bold text-slate-800 text-sm">{formatCostKRW(pathway.estimatedCostWon)}</div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 text-center">
                            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="text-xs">경유지</span>
                            </div>
                            <div className="font-bold text-slate-800 text-sm">{visaStops.length}단계</div>
                          </div>
                        </div>

                        {/* 노트 / Note */}
                        <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-800">{pathway.note}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {getFilteredPathways().length === 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                    <div className="text-4xl mb-3">✈️</div>
                    <p className="text-slate-500 font-medium">필터 조건에 맞는 경로가 없습니다</p>
                    <button
                      onClick={() => setFilters({ maxDuration: 999, maxCost: 99999, feasibility: [] })}
                      className="mt-3 text-sky-600 hover:text-sky-800 text-sm font-medium underline"
                    >
                      필터 초기화
                    </button>
                  </div>
                )}
              </div>

              {/* 상세 패널 / Detail panel */}
              {selectedPathway && (
                <div className="w-96 shrink-0">
                  <div className="bg-white rounded-2xl border-2 border-sky-500 shadow-xl sticky top-20">
                    {/* 상세 헤더 / Detail header */}
                    <div className="bg-linear-to-br from-sky-500 to-blue-600 rounded-t-2xl p-5 text-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs text-sky-200 mb-1">선택된 경로</div>
                          <h3 className="font-bold text-lg leading-snug">{selectedPathway.nameKo}</h3>
                          <p className="text-sky-200 text-xs mt-0.5">{selectedPathway.nameEn}</p>
                        </div>
                        <button
                          onClick={() => setSelectedPathwayId(null)}
                          className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="text-4xl font-black">{selectedPathway.finalScore}</div>
                        <div>
                          <div className="text-sky-200 text-xs">적합도 점수</div>
                          <div className="text-white font-semibold">{selectedPathway.feasibilityLabel}</div>
                        </div>
                      </div>
                    </div>

                    {/* 마일스톤 / Milestones */}
                    <div className="p-5">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-sky-500" />
                        경유지 상세 일정
                      </h4>
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-sky-100" />
                        <div className="space-y-4">
                          {selectedPathway.milestones.map((m, mIdx) => (
                            <div key={mIdx} className="relative pl-10">
                              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-sky-400 bg-white" />
                              <button
                                onClick={() => setExpandedMilestone(expandedMilestone === `${selectedPathway.pathwayId}-${mIdx}` ? null : `${selectedPathway.pathwayId}-${mIdx}`)}
                                className="w-full text-left"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-xs text-sky-500 font-semibold">{m.monthFromStart}개월차</div>
                                    <div className="font-semibold text-slate-800 text-sm">{m.nameKo}</div>
                                  </div>
                                  {m.visaStatus && m.visaStatus !== 'none' && (
                                    <div className="bg-sky-50 border border-sky-200 rounded-lg px-2 py-0.5 text-xs font-bold text-sky-700 shrink-0">
                                      {m.visaStatus}
                                    </div>
                                  )}
                                </div>
                                {m.canWorkPartTime && (
                                  <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>아르바이트 가능 {m.weeklyHours > 0 ? `(주 ${m.weeklyHours}시간)` : ''}</span>
                                  </div>
                                )}
                              </button>

                              {expandedMilestone === `${selectedPathway.pathwayId}-${mIdx}` && (
                                <div className="mt-2 bg-slate-50 rounded-xl p-3">
                                  <div className="text-xs text-slate-600">
                                    <div className="font-semibold text-slate-700 mb-1">요건</div>
                                    <div>{m.requirements}</div>
                                  </div>
                                  {m.estimatedMonthlyIncome > 0 && (
                                    <div className="mt-2 text-xs text-emerald-700 font-semibold">
                                      월 예상 수입: {m.estimatedMonthlyIncome}만원
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 다음 단계 / Next steps */}
                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                          <Zap className="w-4 h-4 text-amber-500" />
                          즉시 할 수 있는 것
                        </h4>
                        <div className="space-y-2">
                          {selectedPathway.nextSteps.map((ns, nsIdx) => (
                            <div key={nsIdx} className="bg-sky-50 border border-sky-100 rounded-xl p-3">
                              <div className="font-semibold text-sky-800 text-sm">{ns.nameKo}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{ns.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="mt-5 w-full py-3 bg-linear-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all text-sm flex items-center justify-center gap-2">
                        <Plane className="w-4 h-4" />
                        이 경로로 시작하기
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 하단 가이드 / Bottom guide */}
            <div className="bg-white rounded-2xl border border-sky-100 shadow-md p-5">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-5 h-5 text-sky-500" />
                <h3 className="font-bold text-slate-800">비자 경로 이용 안내</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700">퍼스트 클래스</div>
                    <div className="text-xs text-slate-400">71점 이상, 매우 높은 가능성</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-sky-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700">비즈니스 클래스</div>
                    <div className="text-xs text-slate-400">51~70점, 충분히 도전 가능</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700">이코노미 클래스</div>
                    <div className="text-xs text-slate-400">31~50점, 노력이 필요</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>점수는 참고용입니다. 실제 비자 발급 가능 여부는 출입국 당국의 심사에 따릅니다. Scores are for reference only. Actual visa eligibility depends on immigration authority review.</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 푸터 / Footer */}
      <footer className="mt-12 border-t border-sky-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Plane className="w-4 h-4 text-sky-400" />
            <span>잡차자 비자 항공편 · JobChaja Visa Flight Search</span>
          </div>
          <div className="text-xs text-slate-400">Design #41 — 항공편 검색 컨셉 / Flight Search Concept</div>
        </div>
      </footer>
    </div>
  );
}
