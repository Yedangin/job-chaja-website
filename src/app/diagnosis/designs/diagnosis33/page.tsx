'use client';
// CRM 파이프라인 스타일 비자 진단 페이지 / CRM Pipeline Style Visa Diagnosis Page
// 세일즈포스/허브스팟 스타일 칸반 보드로 비자 경로를 표시

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
  ChevronRight,
  ChevronLeft,
  BarChart2,
  Clock,
  DollarSign,
  Star,
  Globe,
  GraduationCap,
  Target,
  Zap,
  ArrowRight,
  LayoutGrid,
  TrendingUp,
  CheckCircle,
  Circle,
  Info,
  Filter,
  Award,
  Users,
  ArrowUpDown,
  X,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type StepKey = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

interface StageColumn {
  id: string;
  // 단계 레이블 / Stage label
  labelKo: string;
  labelEn: string;
  // 단계 색상 / Stage color
  color: string;
  bgColor: string;
  borderColor: string;
  headerBg: string;
}

// CRM 파이프라인 단계 정의 / CRM pipeline stage definitions
const PIPELINE_STAGES: StageColumn[] = [
  {
    id: 'qualifying',
    labelKo: '적격 심사',
    labelEn: 'Qualifying',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    headerBg: 'bg-slate-100',
  },
  {
    id: 'analysis',
    labelKo: '분석 중',
    labelEn: 'Analysis',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    headerBg: 'bg-blue-100',
  },
  {
    id: 'processing',
    labelKo: '처리 진행',
    labelEn: 'Processing',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    headerBg: 'bg-indigo-100',
  },
  {
    id: 'review',
    labelKo: '최종 검토',
    labelEn: 'Review',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    headerBg: 'bg-violet-100',
  },
  {
    id: 'closed',
    labelKo: '경로 확정',
    labelEn: 'Closed Won',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    headerBg: 'bg-emerald-100',
  },
];

// ============================================================
// 경로를 파이프라인 단계에 배치 / Assign pathways to pipeline stages
// RecommendedPathway 원시 타입에서 단계 계산 / Stage calculation from raw RecommendedPathway
// ============================================================
function getRawPathwayStage(raw: RecommendedPathway): string {
  // 원시 경로 점수 기반 단계 / Raw pathway score-based stage
  if (raw.finalScore >= 50) return 'closed';
  if (raw.finalScore >= 30) return 'review';
  if (raw.finalScore >= 15) return 'processing';
  if (raw.finalScore >= 8) return 'analysis';
  return 'qualifying';
}

function getStageForPathway(pathway: CompatPathway, index: number): string {
  const stages = PIPELINE_STAGES.map((s) => s.id);
  // 점수 기반 단계 배정 / Score-based stage assignment
  if (pathway.finalScore >= 50) return stages[4]; // closed won
  if (pathway.finalScore >= 30) return stages[3]; // review
  if (pathway.finalScore >= 15) return stages[2]; // processing
  if (pathway.finalScore >= 8) return stages[1];  // analysis
  return stages[0]; // qualifying
}

// ============================================================
// 원화 포맷 유틸 / KRW format utility
// ============================================================
function formatKRW(manWon: number): string {
  if (manWon === 0) return '무료';
  if (manWon >= 10000) return `${(manWon / 10000).toFixed(1)}억원`;
  return `${manWon.toLocaleString()}만원`;
}

// ============================================================
// 전환율 계산 / Conversion rate calculation
// ============================================================
function getConversionRate(stageIndex: number, totalPathways: number): number {
  // 파이프라인 단계별 전환율 / Conversion rate by pipeline stage
  const rates = [100, 80, 60, 40, 20];
  return rates[stageIndex] || 20;
}

// ============================================================
// 딜 금액 합계 계산 / Deal amount calculation
// ============================================================
function getStageTotalCost(pathways: CompatPathway[]): number {
  return pathways.reduce((sum, p) => sum + p.estimatedCostWon, 0);
}

// ============================================================
// 진단 입력 단계 상수 / Diagnosis input step constants
// ============================================================
const INPUT_STEPS: StepKey[] = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
];

const STEP_LABELS: Record<StepKey, { ko: string; en: string; icon: React.ReactNode }> = {
  nationality: { ko: '국적', en: 'Nationality', icon: <Globe size={16} /> },
  age: { ko: '나이', en: 'Age', icon: <Users size={16} /> },
  educationLevel: { ko: '학력', en: 'Education', icon: <GraduationCap size={16} /> },
  availableAnnualFund: { ko: '자금', en: 'Budget', icon: <DollarSign size={16} /> },
  finalGoal: { ko: '목표', en: 'Goal', icon: <Target size={16} /> },
  priorityPreference: { ko: '우선순위', en: 'Priority', icon: <Zap size={16} /> },
};

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function Diagnosis33Page() {
  // 단계 관리 / Step management
  const [phase, setPhase] = useState<'input' | 'result'>('input');
  const [currentStep, setCurrentStep] = useState(0);

  // 입력 상태 / Input state
  const [input, setInput] = useState<DiagnosisInput>({
    nationality: '',
    age: 0,
    educationLevel: '',
    availableAnnualFund: 0,
    finalGoal: '',
    priorityPreference: '',
  });
  const [ageInput, setAgeInput] = useState('');

  // 결과 상태 / Result state — mockInput 기본값 참조 / reference mockInput defaults
  const _defaultInput: DiagnosisInput = mockInput;
  const [result] = useState<DiagnosisResult>(mockDiagnosisResult);
  // 총 평가 경로 수 표시용 / For displaying total evaluated pathways count
  const totalEvaluated: number = result.meta.totalPathwaysEvaluated;
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // 경로를 단계별로 그룹화 / Group pathways by stage
  const [stageMap, setStageMap] = useState<Record<string, string>>({});

  // ──────────────────────────────────────────────────────────
  // 입력 핸들러 / Input handlers
  // ──────────────────────────────────────────────────────────

  function handleSelectNationality(code: string) {
    setInput((prev) => ({ ...prev, nationality: code }));
    setTimeout(() => setCurrentStep(1), 300);
  }

  function handleAgeNext() {
    const parsed = parseInt(ageInput, 10);
    if (!isNaN(parsed) && parsed >= 18 && parsed <= 65) {
      setInput((prev) => ({ ...prev, age: parsed }));
      setCurrentStep(2);
    }
  }

  function handleSelectEducation(value: string) {
    setInput((prev) => ({ ...prev, educationLevel: value }));
    setTimeout(() => setCurrentStep(3), 300);
  }

  function handleSelectFund(value: number) {
    setInput((prev) => ({ ...prev, availableAnnualFund: value }));
    setTimeout(() => setCurrentStep(4), 300);
  }

  function handleSelectGoal(value: string) {
    setInput((prev) => ({ ...prev, finalGoal: value }));
    setTimeout(() => setCurrentStep(5), 300);
  }

  function handleSelectPriority(value: string) {
    setInput((prev) => ({ ...prev, priorityPreference: value }));
    // 초기 스테이지 맵 구성 / Build initial stage map
    // RecommendedPathway 원시 데이터 기반 stage 배정 / Stage assignment from raw RecommendedPathway data
    const initial: Record<string, string> = {};
    mockDiagnosisResult.pathways.forEach((rawP: RecommendedPathway) => {
      initial[rawP.pathwayId] = getRawPathwayStage(rawP);
    });
    setStageMap(initial);
    setTimeout(() => setPhase('result'), 400);
  }

  // ──────────────────────────────────────────────────────────
  // 드래그 핸들러 / Drag handlers
  // ──────────────────────────────────────────────────────────

  function handleDragStart(pathwayId: string) {
    setDraggedId(pathwayId);
  }

  function handleDragEnd() {
    setDraggedId(null);
  }

  function handleDropOnStage(stageId: string) {
    if (!draggedId) return;
    setStageMap((prev) => ({ ...prev, [draggedId]: stageId }));
    setDraggedId(null);
  }

  // ──────────────────────────────────────────────────────────
  // 파이프라인 데이터 / Pipeline data
  // ──────────────────────────────────────────────────────────
  function getPathwaysForStage(stageId: string): CompatPathway[] {
    return mockPathways.filter((p) => (stageMap[p.pathwayId] || getStageForPathway(p, 0)) === stageId);
  }

  const selectedPathway = selectedPathwayId
    ? mockPathways.find((p) => p.pathwayId === selectedPathwayId) ?? null
    : null;

  // ──────────────────────────────────────────────────────────
  // 렌더링: 입력 화면 / Render: Input phase
  // ──────────────────────────────────────────────────────────
  if (phase === 'input') {
    return (
      <div className="min-h-screen bg-white font-sans">
        {/* 헤더 / Header */}
        <header className="bg-[#0176d3] text-white px-6 py-4 flex items-center gap-3 shadow-md">
          <LayoutGrid size={22} className="shrink-0" />
          <div>
            <h1 className="text-lg font-bold tracking-tight">잡차자 비자 파이프라인</h1>
            <p className="text-blue-200 text-xs">Visa Pathway CRM · Powered by JobChaja</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-blue-100 text-sm">
            <span>딜 파이프라인</span>
            <ArrowRight size={14} />
          </div>
        </header>

        {/* 진행 바 / Progress bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-1 mb-2">
              {INPUT_STEPS.map((step, idx) => (
                <React.Fragment key={step}>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full transition-all ${
                      idx < currentStep
                        ? 'bg-[#0176d3] text-white'
                        : idx === currentStep
                        ? 'bg-blue-100 text-[#0176d3] border border-[#0176d3]'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {idx < currentStep ? (
                      <CheckCircle size={12} />
                    ) : (
                      STEP_LABELS[step].icon
                    )}
                    <span className="hidden sm:inline">{STEP_LABELS[step].ko}</span>
                  </div>
                  {idx < INPUT_STEPS.length - 1 && (
                    <div className={`h-px flex-1 transition-all ${idx < currentStep ? 'bg-[#0176d3]' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              스텝 {currentStep + 1} / {INPUT_STEPS.length} — {STEP_LABELS[INPUT_STEPS[currentStep]].ko} 선택
            </p>
          </div>
        </div>

        {/* 입력 컨텐츠 / Input content */}
        <main className="max-w-2xl mx-auto px-6 py-8">
          {/* ── 스텝 0: 국적 / Step 0: Nationality ── */}
          {currentStep === 0 && (
            <div>
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#0176d3] uppercase tracking-widest mb-1">
                  Lead Qualification · 리드 자격 심사
                </p>
                <h2 className="text-2xl font-bold text-gray-900">국적을 선택하세요</h2>
                <p className="text-gray-500 text-sm mt-1">Select your nationality</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {popularCountries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleSelectNationality(c.code)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all hover:border-[#0176d3] hover:bg-blue-50 ${
                      input.nationality === c.code
                        ? 'border-[#0176d3] bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{c.flag}</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{c.nameKo}</p>
                      <p className="text-gray-400 text-xs">{c.nameEn}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── 스텝 1: 나이 / Step 1: Age ── */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#0176d3] uppercase tracking-widest mb-1">
                  Account Info · 고객 정보
                </p>
                <h2 className="text-2xl font-bold text-gray-900">나이를 입력하세요</h2>
                <p className="text-gray-500 text-sm mt-1">Enter your age (18–65)</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min={18}
                    max={65}
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAgeNext()}
                    placeholder="예: 24"
                    className="w-32 text-3xl font-bold text-center border-b-2 border-[#0176d3] bg-transparent outline-none py-2 text-gray-900"
                  />
                  <span className="text-gray-500 text-lg">세 / years old</span>
                </div>
                <p className="text-xs text-gray-400 mt-3">18세 이상 65세 이하만 진단 가능</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <ChevronLeft size={16} />
                  이전
                </button>
                <button
                  onClick={handleAgeNext}
                  disabled={!ageInput || parseInt(ageInput, 10) < 18 || parseInt(ageInput, 10) > 65}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#0176d3] text-white font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  다음 <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── 스텝 2: 학력 / Step 2: Education ── */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#0176d3] uppercase tracking-widest mb-1">
                  Qualification · 자격 조건
                </p>
                <h2 className="text-2xl font-bold text-gray-900">최종 학력을 선택하세요</h2>
                <p className="text-gray-500 text-sm mt-1">Select your highest education level</p>
              </div>
              <div className="space-y-2">
                {educationOptions.map((edu) => (
                  <button
                    key={edu.value}
                    onClick={() => handleSelectEducation(edu.value)}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all hover:border-[#0176d3] hover:bg-blue-50 ${
                      input.educationLevel === edu.value
                        ? 'border-[#0176d3] bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span className="text-xl shrink-0">{edu.emoji || '📄'}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{edu.labelKo}</p>
                      <p className="text-gray-400 text-xs">{edu.labelEn}</p>
                    </div>
                    {input.educationLevel === edu.value && (
                      <CheckCircle size={18} className="ml-auto text-[#0176d3]" />
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 px-4 py-2 mt-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm"
              >
                <ChevronLeft size={14} /> 이전
              </button>
            </div>
          )}

          {/* ── 스텝 3: 자금 / Step 3: Fund ── */}
          {currentStep === 3 && (
            <div>
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#0176d3] uppercase tracking-widest mb-1">
                  Deal Value · 딜 규모
                </p>
                <h2 className="text-2xl font-bold text-gray-900">연간 가용 자금을 선택하세요</h2>
                <p className="text-gray-500 text-sm mt-1">Select your annual available budget</p>
              </div>
              <div className="space-y-2">
                {fundOptions.map((fund) => (
                  <button
                    key={fund.value}
                    onClick={() => handleSelectFund(fund.value)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border-2 text-left transition-all hover:border-[#0176d3] hover:bg-blue-50 ${
                      input.availableAnnualFund === fund.value
                        ? 'border-[#0176d3] bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{fund.labelKo}</p>
                      <p className="text-gray-400 text-xs">{fund.labelEn}</p>
                    </div>
                    {input.availableAnnualFund === fund.value && (
                      <CheckCircle size={18} className="text-[#0176d3]" />
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 px-4 py-2 mt-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm"
              >
                <ChevronLeft size={14} /> 이전
              </button>
            </div>
          )}

          {/* ── 스텝 4: 목표 / Step 4: Goal ── */}
          {currentStep === 4 && (
            <div>
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#0176d3] uppercase tracking-widest mb-1">
                  Close Stage · 최종 목표
                </p>
                <h2 className="text-2xl font-bold text-gray-900">한국에서의 최종 목표는?</h2>
                <p className="text-gray-500 text-sm mt-1">What is your final goal in Korea?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => handleSelectGoal(goal.value)}
                    className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all hover:border-[#0176d3] hover:bg-blue-50 ${
                      input.finalGoal === goal.value
                        ? 'border-[#0176d3] bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span className="text-3xl mb-2">{goal.emoji}</span>
                    <p className="font-bold text-gray-800">{goal.labelKo}</p>
                    <p className="text-gray-500 text-xs mt-1">{goal.descKo}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 px-4 py-2 mt-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm"
              >
                <ChevronLeft size={14} /> 이전
              </button>
            </div>
          )}

          {/* ── 스텝 5: 우선순위 / Step 5: Priority ── */}
          {currentStep === 5 && (
            <div>
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#0176d3] uppercase tracking-widest mb-1">
                  Win Criteria · 성공 기준
                </p>
                <h2 className="text-2xl font-bold text-gray-900">가장 중요한 것은?</h2>
                <p className="text-gray-500 text-sm mt-1">What matters most to you?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {priorityOptions.map((priority) => (
                  <button
                    key={priority.value}
                    onClick={() => handleSelectPriority(priority.value)}
                    className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all hover:border-[#0176d3] hover:bg-blue-50 ${
                      input.priorityPreference === priority.value
                        ? 'border-[#0176d3] bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span className="text-2xl mb-2">{priority.emoji}</span>
                    <p className="font-bold text-gray-800">{priority.labelKo}</p>
                    <p className="text-gray-500 text-xs mt-1">{priority.descKo}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-2 px-4 py-2 mt-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm"
              >
                <ChevronLeft size={14} /> 이전
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────
  // 렌더링: 결과 화면 (CRM 파이프라인) / Render: Result phase (CRM Pipeline)
  // ──────────────────────────────────────────────────────────

  const totalDeals = mockPathways.length;
  const totalCost = mockPathways.reduce((s, p) => s + p.estimatedCostWon, 0);
  // 사용되지 않은 변수를 명시적 사용 / Explicit usage of required variables
  void _defaultInput;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* GNB / Global navigation bar */}
      <header className="bg-[#0176d3] text-white px-4 py-3 flex items-center gap-3 shadow-md shrink-0">
        <LayoutGrid size={20} className="shrink-0" />
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold truncate">비자 경로 파이프라인</h1>
          <p className="text-blue-200 text-xs">Visa Pathway Pipeline · {totalDeals} Deals</p>
        </div>
        {/* 파이프라인 요약 통계 / Pipeline summary stats */}
        <div className="hidden sm:flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-blue-100 text-xs">총 평가</p>
            <p className="font-bold">{totalEvaluated}개</p>
          </div>
          <div className="w-px h-8 bg-blue-400" />
          <div className="text-center">
            <p className="text-blue-100 text-xs">예상 비용 합계</p>
            <p className="font-bold">{formatKRW(totalCost)}</p>
          </div>
          <div className="w-px h-8 bg-blue-400" />
          <div className="text-center">
            <p className="text-blue-100 text-xs">최고 점수</p>
            <p className="font-bold">{Math.max(...mockPathways.map((p) => p.finalScore))}점</p>
          </div>
        </div>
        <button
          onClick={() => { setPhase('input'); setCurrentStep(0); setSelectedPathwayId(null); }}
          className="ml-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition"
        >
          재진단
        </button>
      </header>

      {/* 전환 퍼널 바 / Conversion funnel bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto">
          {PIPELINE_STAGES.map((stage, idx) => {
            const stagePathways = getPathwaysForStage(stage.id);
            const rate = getConversionRate(idx, totalDeals);
            return (
              <React.Fragment key={stage.id}>
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${stage.headerBg} ${stage.color}`}>
                    {stage.labelKo}
                  </div>
                  <span className="text-xs text-gray-500">{stagePathways.length}건</span>
                  <span className="text-xs text-gray-400">({rate}%)</span>
                </div>
                {idx < PIPELINE_STAGES.length - 1 && (
                  <ChevronRight size={14} className="text-gray-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
          <div className="ml-auto shrink-0 flex items-center gap-1 text-xs text-gray-400">
            <TrendingUp size={12} />
            <span>드래그로 단계 이동 가능</span>
          </div>
        </div>
      </div>

      {/* 메인 레이아웃 / Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* 칸반 보드 / Kanban board */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-3 p-4 h-full min-w-max">
            {PIPELINE_STAGES.map((stage, stageIdx) => {
              const stagePathways = getPathwaysForStage(stage.id);
              const stageCost = getStageTotalCost(stagePathways);
              return (
                <div
                  key={stage.id}
                  className="w-64 flex flex-col rounded-xl border-2 border-gray-200 bg-white overflow-hidden shrink-0"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDropOnStage(stage.id)}
                >
                  {/* 컬럼 헤더 / Column header */}
                  <div className={`px-3 py-3 ${stage.headerBg} border-b border-gray-200`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${stage.color}`}>{stage.labelKo}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white ${stage.color}`}>
                        {stagePathways.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <DollarSign size={10} />
                      <span>{formatKRW(stageCost)}</span>
                    </div>
                    {/* 퍼널 진행바 / Funnel progress bar */}
                    <div className="mt-2 h-1 rounded-full bg-gray-200">
                      <div
                        className="h-1 rounded-full bg-[#0176d3] transition-all"
                        style={{
                          width: `${(stagePathways.length / Math.max(totalDeals, 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* 카드 목록 / Card list */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {stagePathways.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-300">
                        <Circle size={28} />
                        <p className="text-xs mt-2">경로 없음</p>
                      </div>
                    )}
                    {stagePathways.map((pathway) => (
                      <DealCard
                        key={pathway.pathwayId}
                        pathway={pathway}
                        isSelected={selectedPathwayId === pathway.pathwayId}
                        isDragging={draggedId === pathway.pathwayId}
                        onSelect={() =>
                          setSelectedPathwayId(
                            selectedPathwayId === pathway.pathwayId ? null : pathway.pathwayId
                          )
                        }
                        onDragStart={() => handleDragStart(pathway.pathwayId)}
                        onDragEnd={handleDragEnd}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 딜 상세 패널 / Deal detail panel */}
        {selectedPathway && (
          <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto shrink-0 flex flex-col">
            <DealDetailPanel
              pathway={selectedPathway}
              onClose={() => setSelectedPathwayId(null)}
            />
          </div>
        )}
      </div>

      {/* 하단 전환 퍼널 요약 / Bottom funnel summary */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 shrink-0">
        <div className="flex items-center gap-6 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500 shrink-0">
            <BarChart2 size={14} className="text-[#0176d3]" />
            <span className="font-semibold text-gray-700">파이프라인 요약</span>
          </div>
          {PIPELINE_STAGES.map((stage) => {
            const count = getPathwaysForStage(stage.id).length;
            return (
              <div key={stage.id} className="flex items-center gap-1.5 shrink-0">
                <div className={`w-2 h-2 rounded-full ${stage.headerBg.replace('bg-', 'bg-').replace('-100', '-400')}`} />
                <span className="text-xs text-gray-500">{stage.labelKo}</span>
                <span className={`text-xs font-bold ${stage.color}`}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 딜 카드 컴포넌트 / Deal Card component
// ============================================================
interface DealCardProps {
  pathway: CompatPathway;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function DealCard({ pathway, isSelected, isDragging, onSelect, onDragStart, onDragEnd }: DealCardProps) {
  const scoreColor = getScoreColor(pathway.finalScore);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onSelect}
      className={`rounded-lg border-2 p-3 cursor-pointer transition-all select-none ${
        isDragging
          ? 'opacity-40 scale-95 border-blue-400 shadow-lg'
          : isSelected
          ? 'border-[#0176d3] bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      {/* 카드 헤더 / Card header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-800 truncate leading-snug">{pathway.nameKo}</p>
          <p className="text-xs text-gray-400 truncate">{pathway.nameEn}</p>
        </div>
        <span className="text-base shrink-0">{emoji}</span>
      </div>

      {/* 비자 체인 / Visa chain */}
      <div className="flex items-center gap-1 mb-2 flex-wrap">
        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).slice(0, 3).map((v, i) => (
          <React.Fragment key={`${v.code}-${i}`}>
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">
              {v.code}
            </span>
            {i < Math.min((Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1, 2) && (
              <ArrowRight size={8} className="text-gray-300" />
            )}
          </React.Fragment>
        ))}
        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length > 3 && (
          <span className="text-xs text-gray-400">+{(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 3}</span>
        )}
      </div>

      {/* 딜 메트릭 / Deal metrics */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock size={10} />
          <span>{pathway.estimatedMonths}개월</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign size={10} />
          <span>{formatKRW(pathway.estimatedCostWon)}</span>
        </div>
        {/* 점수 인디케이터 / Score indicator */}
        <div
          className="text-xs font-bold px-1.5 py-0.5 rounded"
          style={{ color: scoreColor, backgroundColor: `${scoreColor}18` }}
        >
          {pathway.finalScore}점
        </div>
      </div>

      {/* 드래그 힌트 / Drag hint */}
      <div className="mt-2 flex items-center gap-1 text-gray-300">
        <ArrowUpDown size={9} />
        <span className="text-xs">드래그로 단계 이동</span>
      </div>
    </div>
  );
}

// ============================================================
// 딜 상세 패널 컴포넌트 / Deal detail panel component
// ============================================================
interface DealDetailPanelProps {
  pathway: CompatPathway;
  onClose: () => void;
}

function DealDetailPanel({ pathway, onClose }: DealDetailPanelProps) {
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);
  const scoreColor = getScoreColor(pathway.finalScore);

  return (
    <>
      {/* 패널 헤더 / Panel header */}
      <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{emoji}</span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ color: scoreColor, backgroundColor: `${scoreColor}18` }}
              >
                {pathway.feasibilityLabel}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm leading-snug">{pathway.nameKo}</h3>
            <p className="text-xs text-gray-400">{pathway.nameEn}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 핵심 지표 / Key metrics */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={<Star size={14} style={{ color: scoreColor }} />}
            label="적합도 점수"
            value={`${pathway.finalScore}점`}
            valueColor={scoreColor}
          />
          <MetricCard
            icon={<Clock size={14} className="text-blue-500" />}
            label="예상 기간"
            value={`${pathway.estimatedMonths}개월`}
          />
          <MetricCard
            icon={<DollarSign size={14} className="text-emerald-500" />}
            label="예상 비용"
            value={formatKRW(pathway.estimatedCostWon)}
          />
          <MetricCard
            icon={<Award size={14} className="text-violet-500" />}
            label="플랫폼 지원"
            value={pathway.platformSupport === 'full_support' ? '전체지원' : '정보제공'}
          />
        </div>

        {/* 비자 체인 / Visa chain */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            비자 경로 / Visa Chain
          </h4>
          <div className="flex items-center gap-1 flex-wrap">
            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
              <React.Fragment key={`detail-${v.code}-${i}`}>
                <span className="text-sm font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">
                  {v.code}
                </span>
                {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                  <ArrowRight size={12} className="text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 점수 분석 / Score breakdown */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            점수 분석 / Score Analysis
          </h4>
          <div className="space-y-2">
            <ScoreBar label="기본 점수" value={pathway.scoreBreakdown.base} max={100} />
            <ScoreBar label="나이 가중치" value={Math.round(pathway.scoreBreakdown.ageMultiplier * 100)} max={100} suffix="%" />
            <ScoreBar label="국적 가중치" value={Math.round(pathway.scoreBreakdown.nationalityMultiplier * 100)} max={100} suffix="%" />
            <ScoreBar label="자금 가중치" value={Math.round(pathway.scoreBreakdown.fundMultiplier * 100)} max={100} suffix="%" />
            <ScoreBar label="학력 가중치" value={Math.round(pathway.scoreBreakdown.educationMultiplier * 100)} max={100} suffix="%" />
          </div>
        </div>

        {/* 마일스톤 / Milestones */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            진행 단계 / Milestones
          </h4>
          <div className="relative">
            {/* 세로 라인 / Vertical line */}
            <div className="absolute left-3 top-3 bottom-3 w-px bg-blue-200" />
            <div className="space-y-3 pl-8">
              {pathway.milestones.map((ms) => (
                <div key={ms.order} className="relative">
                  {/* 도트 / Dot */}
                  <div className="absolute -left-5 w-2.5 h-2.5 rounded-full bg-[#0176d3] border-2 border-white shadow-sm" />
                  <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-gray-800">{ms.nameKo}</p>
                      <span className="text-xs text-gray-400">+{ms.monthFromStart}개월</span>
                    </div>
                    {ms.visaStatus && ms.visaStatus !== 'none' && (
                      <span className="inline-block text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">
                        {ms.visaStatus}
                      </span>
                    )}
                    {ms.canWorkPartTime && (
                      <p className="text-xs text-emerald-600 mt-1">
                        ✓ 파트타임 가능 ({ms.weeklyHours}h/week)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 다음 단계 / Next steps */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            다음 액션 / Next Steps
          </h4>
          <div className="space-y-2">
            {pathway.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-5 h-5 rounded-full bg-[#0176d3] text-white text-xs flex items-center justify-center shrink-0 font-bold">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{step.nameKo}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 노트 / Note */}
        {pathway.note && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">{pathway.note}</p>
          </div>
        )}
      </div>

      {/* 액션 버튼 / Action button */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 shrink-0">
        <button className="w-full bg-[#0176d3] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <CheckCircle size={15} />
          이 경로로 진행하기
        </button>
      </div>
    </>
  );
}

// ============================================================
// 보조 컴포넌트: 메트릭 카드 / Helper: Metric card
// ============================================================
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}

function MetricCard({ icon, label, value, valueColor }: MetricCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <p className="text-sm font-bold" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </p>
    </div>
  );
}

// ============================================================
// 보조 컴포넌트: 점수 바 / Helper: Score bar
// ============================================================
interface ScoreBarProps {
  label: string;
  value: number;
  max: number;
  suffix?: string;
}

function ScoreBar({ label, value, max, suffix = '' }: ScoreBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-0.5">
        <span>{label}</span>
        <span className="font-semibold text-gray-700">{value}{suffix}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-200">
        <div
          className="h-1.5 rounded-full bg-[#0176d3] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
