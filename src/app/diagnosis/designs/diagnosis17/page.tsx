'use client';

// Design #17: 체크리스트 (Checklist) 비자 진단 페이지
// Design #17: Checklist-style visa diagnosis page
// Concept: Todoist/Things 3 inspired — check conditions one by one, see results as checklist
// Color theme: Red accent + White

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
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Flag,
  Clock,
  DollarSign,
  Tag,
  Star,
  ArrowRight,
  RotateCcw,
  ListChecks,
  User,
  GraduationCap,
  Wallet,
  Target,
  Zap,
  Check,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

const STEPS: Step[] = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
];

interface StepMeta {
  id: Step;
  labelKo: string;
  labelEn: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

// 우선순위 색상 / Priority colors
const PRIORITY_COLORS: Record<string, string> = {
  high: 'text-red-500 bg-red-50 border-red-200',
  medium: 'text-amber-500 bg-amber-50 border-amber-200',
  low: 'text-blue-500 bg-blue-50 border-blue-200',
};

const PRIORITY_LABELS: Record<string, string> = {
  high: '긴급 High',
  medium: '보통 Medium',
  low: '낮음 Low',
};

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function Diagnosis17Page() {
  // 현재 진행 단계 인덱스 / Current step index
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  // 완료된 입력 값 / Completed input values
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // 결과 표시 여부 / Whether to show results
  const [showResult, setShowResult] = useState<boolean>(false);
  // 로딩 상태 / Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 결과 데이터 / Result data
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  // 아코디언 열린 경로 인덱스 / Open accordion pathway indices
  const [openPathways, setOpenPathways] = useState<Set<number>>(new Set([0]));
  // 열린 마일스톤 인덱스 / Open milestone accordion indices
  const [openMilestones, setOpenMilestones] = useState<Set<string>>(new Set());

  // 각 단계 메타 정보 / Step metadata
  const stepMeta: StepMeta[] = [
    { id: 'nationality', labelKo: '국적 선택', labelEn: 'Select Nationality', icon: <User size={16} />, priority: 'high' },
    { id: 'age', labelKo: '나이 입력', labelEn: 'Enter Age', icon: <User size={16} />, priority: 'high' },
    { id: 'educationLevel', labelKo: '학력 선택', labelEn: 'Select Education', icon: <GraduationCap size={16} />, priority: 'high' },
    { id: 'availableAnnualFund', labelKo: '연간 자금 입력', labelEn: 'Available Annual Fund', icon: <Wallet size={16} />, priority: 'medium' },
    { id: 'finalGoal', labelKo: '최종 목표 선택', labelEn: 'Select Final Goal', icon: <Target size={16} />, priority: 'medium' },
    { id: 'priorityPreference', labelKo: '우선순위 설정', labelEn: 'Set Priority', icon: <Zap size={16} />, priority: 'low' },
  ];

  // 현재 단계 / Current step
  const currentStep: Step = STEPS[currentStepIdx];

  // 진행률 계산 / Calculate completion rate
  const completedCount = Object.keys(input).length;
  const totalCount = STEPS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // 아코디언 토글 / Toggle accordion
  const togglePathway = (idx: number) => {
    setOpenPathways((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleMilestone = (key: string) => {
    setOpenMilestones((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // 값 선택 핸들러 / Value selection handler
  const handleSelect = (field: Step, value: string | number) => {
    const updatedInput = { ...input, [field]: value };
    setInput(updatedInput);

    // 다음 단계로 이동 / Move to next step
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      // 마지막 단계 완료 → 진단 실행 / Last step done → run diagnosis
      runDiagnosis(updatedInput);
    }
  };

  // 나이 제출 핸들러 / Age submit handler
  const [ageInput, setAgeInput] = useState<string>('');
  const handleAgeSubmit = () => {
    const age = parseInt(ageInput, 10);
    if (isNaN(age) || age < 15 || age > 80) return;
    handleSelect('age', age);
    setAgeInput('');
  };

  // 진단 실행 / Run diagnosis
  const runDiagnosis = (finalInput: Partial<DiagnosisInput>) => {
    setIsLoading(true);
    // 목업 데이터 사용 / Use mock data
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setShowResult(true);
      setIsLoading(false);
    }, 1200);
  };

  // 재시작 / Restart
  const handleRestart = () => {
    setCurrentStepIdx(0);
    setInput({});
    setShowResult(false);
    setResult(null);
    setOpenPathways(new Set([0]));
    setAgeInput('');
  };

  // 단계별 레이블 표시 / Display step label value
  const getStepValueLabel = (step: Step): string | null => {
    const val = input[step];
    if (val === undefined || val === null) return null;
    switch (step) {
      case 'nationality': {
        const c = popularCountries.find((x) => x.code === val);
        return c ? `${c.flag} ${c.nameKo}` : String(val);
      }
      case 'age':
        return `${val}세 / Age ${val}`;
      case 'educationLevel': {
        const e = educationOptions.find((x) => x.value === val);
        return e ? `${e.emoji} ${e.labelKo}` : String(val);
      }
      case 'availableAnnualFund': {
        const f = fundOptions.find((x) => x.value === val);
        return f ? f.labelKo : String(val);
      }
      case 'finalGoal': {
        const g = goalOptions.find((x) => x.value === val);
        return g ? `${g.emoji} ${g.labelKo}` : String(val);
      }
      case 'priorityPreference': {
        const p = priorityOptions.find((x) => x.value === val);
        return p ? `${p.emoji} ${p.labelKo}` : String(val);
      }
      default:
        return String(val);
    }
  };

  // ============================================================
  // 렌더링 / Rendering
  // ============================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        {/* 로딩 화면 / Loading screen */}
        <div className="flex flex-col items-center gap-6 px-8">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <Loader2 size={32} className="text-red-500 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 mb-1">분석 중...</p>
            <p className="text-sm text-gray-500">Analyzing your visa pathways</p>
          </div>
          {/* 진행 중인 체크리스트 / In-progress checklist */}
          <div className="w-full max-w-sm space-y-2 mt-4">
            {[
              '31개 비자 유형 검토 중 / Reviewing 31 visa types',
              '자격 요건 매칭 중 / Matching requirements',
              '비용 · 기간 계산 중 / Calculating cost & duration',
              '최적 경로 선별 중 / Selecting optimal pathways',
            ].map((label, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <Loader2 size={14} className="text-red-400 animate-spin shrink-0" />
                <span className="text-sm text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResult && result) {
    return <ResultView result={result} onRestart={handleRestart} openPathways={openPathways} togglePathway={togglePathway} openMilestones={openMilestones} toggleMilestone={toggleMilestone} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 / Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
              <ListChecks size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">비자 진단</p>
              <p className="text-xs text-gray-400">Visa Diagnosis</p>
            </div>
          </div>
          {/* 완료율 배지 / Completion rate badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{completedCount}/{totalCount} 완료</span>
            <div className="w-20 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-red-500">{progressPercent}%</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* 체크리스트 섹션 헤더 / Checklist section header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            비자 적합 경로 찾기
          </h1>
          <p className="text-sm text-gray-500">Find your visa pathway — check all items below</p>
        </div>

        {/* 섹션: 완료된 항목 / Section: Completed items */}
        {completedCount > 0 && (
          <div className="mb-4">
            <CompletedSection stepMeta={stepMeta} input={input} getStepValueLabel={getStepValueLabel} STEPS={STEPS} />
          </div>
        )}

        {/* 섹션: 현재 항목 / Section: Current active item */}
        <ActiveStepCard
          step={currentStep}
          stepMeta={stepMeta}
          stepIdx={currentStepIdx}
          ageInput={ageInput}
          setAgeInput={setAgeInput}
          handleSelect={handleSelect}
          handleAgeSubmit={handleAgeSubmit}
        />

        {/* 섹션: 남은 항목 / Section: Remaining items */}
        {currentStepIdx < STEPS.length - 1 && (
          <div className="mt-4">
            <RemainingSection stepMeta={stepMeta} currentStepIdx={currentStepIdx} />
          </div>
        )}
      </main>
    </div>
  );
}

// ============================================================
// 완료된 항목 섹션 / Completed items section
// ============================================================
function CompletedSection({
  stepMeta,
  input,
  getStepValueLabel,
  STEPS,
}: {
  stepMeta: StepMeta[];
  input: Partial<DiagnosisInput>;
  getStepValueLabel: (step: Step) => string | null;
  STEPS: Step[];
}) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const completedSteps = STEPS.filter((s) => input[s] !== undefined);

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
      {/* 섹션 헤더 / Section header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-500" />
          <span className="text-sm font-semibold text-gray-700">
            완료된 항목 / Completed ({completedSteps.length})
          </span>
        </div>
        {collapsed ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
      </button>

      {!collapsed && (
        <div className="px-4 pb-3 space-y-2">
          {completedSteps.map((step) => {
            const meta = stepMeta.find((m) => m.id === step);
            const val = getStepValueLabel(step);
            return (
              <div key={step} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100">
                {/* 체크 아이콘 / Check icon */}
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Check size={13} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 leading-none mb-0.5">{meta?.labelKo} / {meta?.labelEn}</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{val}</p>
                </div>
                {/* 우선순위 태그 / Priority tag */}
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${PRIORITY_COLORS[meta?.priority ?? 'low']}`}>
                  {PRIORITY_LABELS[meta?.priority ?? 'low']}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 현재 활성 단계 카드 / Active step card
// ============================================================
function ActiveStepCard({
  step,
  stepMeta,
  stepIdx,
  ageInput,
  setAgeInput,
  handleSelect,
  handleAgeSubmit,
}: {
  step: Step;
  stepMeta: StepMeta[];
  stepIdx: number;
  ageInput: string;
  setAgeInput: (v: string) => void;
  handleSelect: (field: Step, value: string | number) => void;
  handleAgeSubmit: () => void;
}) {
  const meta = stepMeta.find((m) => m.id === step);

  return (
    <div className="rounded-2xl border-2 border-red-400 bg-white shadow-lg shadow-red-50 overflow-hidden">
      {/* 카드 헤더 / Card header */}
      <div className="bg-red-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 미완성 원형 체크박스 / Unchecked circle */}
          <div className="w-6 h-6 rounded-full border-2 border-white/70 flex items-center justify-center shrink-0">
            <div className="w-2 h-2 rounded-full bg-white/50" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">{meta?.labelKo}</p>
            <p className="text-xs text-red-100">{meta?.labelEn}</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-white/20 text-white rounded-full">
          {stepIdx + 1} / {STEPS.length}
        </span>
      </div>

      {/* 카드 콘텐츠 / Card content */}
      <div className="p-4">
        {step === 'nationality' && (
          <NationalityStep handleSelect={handleSelect} />
        )}
        {step === 'age' && (
          <AgeStep ageInput={ageInput} setAgeInput={setAgeInput} handleAgeSubmit={handleAgeSubmit} />
        )}
        {step === 'educationLevel' && (
          <EducationStep handleSelect={handleSelect} />
        )}
        {step === 'availableAnnualFund' && (
          <FundStep handleSelect={handleSelect} />
        )}
        {step === 'finalGoal' && (
          <GoalStep handleSelect={handleSelect} />
        )}
        {step === 'priorityPreference' && (
          <PriorityStep handleSelect={handleSelect} />
        )}
      </div>
    </div>
  );
}

// ============================================================
// 남은 항목 섹션 / Remaining items section
// ============================================================
function RemainingSection({ stepMeta, currentStepIdx }: { stepMeta: StepMeta[]; currentStepIdx: number }) {
  const remaining = STEPS.slice(currentStepIdx + 1);
  if (remaining.length === 0) return null;

  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-dashed border-gray-100">
        <span className="text-sm font-semibold text-gray-400">남은 항목 / Remaining ({remaining.length})</span>
      </div>
      <div className="px-4 py-3 space-y-2">
        {remaining.map((step) => {
          const meta = stepMeta.find((m) => m.id === step);
          return (
            <div key={step} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              {/* 빈 원형 체크박스 / Empty circle */}
              <Circle size={20} className="text-gray-300 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-400">{meta?.labelKo} / {meta?.labelEn}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${PRIORITY_COLORS[meta?.priority ?? 'low']}`}>
                {PRIORITY_LABELS[meta?.priority ?? 'low']}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// 국적 선택 단계 / Nationality step
// ============================================================
function NationalityStep({ handleSelect }: { handleSelect: (f: Step, v: string | number) => void }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">국적을 선택하세요 / Select your nationality</p>
      <div className="grid grid-cols-3 gap-2">
        {popularCountries.map((c) => (
          <button
            key={c.code}
            onClick={() => handleSelect('nationality', c.code)}
            className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-red-300 hover:bg-red-50 hover:shadow-sm transition-all active:scale-95"
          >
            <span className="text-2xl">{c.flag}</span>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">{c.nameKo}</span>
            <span className="text-xs text-gray-400">{c.nameEn}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 나이 입력 단계 / Age step
// ============================================================
function AgeStep({
  ageInput,
  setAgeInput,
  handleAgeSubmit,
}: {
  ageInput: string;
  setAgeInput: (v: string) => void;
  handleAgeSubmit: () => void;
}) {
  const age = parseInt(ageInput, 10);
  const isValid = !isNaN(age) && age >= 15 && age <= 80;

  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">나이를 입력하세요 / Enter your age (15–80)</p>
      <div className="flex gap-3">
        <input
          type="number"
          min={15}
          max={80}
          value={ageInput}
          onChange={(e) => setAgeInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && isValid) handleAgeSubmit(); }}
          placeholder="예: 24"
          className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-red-400 transition-colors"
        />
        <button
          onClick={handleAgeSubmit}
          disabled={!isValid}
          className="px-5 py-3 rounded-xl bg-red-500 text-white font-semibold disabled:opacity-40 hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <Check size={18} />
          확인
        </button>
      </div>
      {ageInput && !isValid && (
        <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
          <AlertCircle size={12} />
          15세에서 80세 사이로 입력하세요
        </p>
      )}
    </div>
  );
}

// ============================================================
// 학력 선택 단계 / Education step
// ============================================================
function EducationStep({ handleSelect }: { handleSelect: (f: Step, v: string | number) => void }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">최종 학력을 선택하세요 / Select your education level</p>
      <div className="space-y-2">
        {educationOptions.map((e) => (
          <button
            key={e.value}
            onClick={() => handleSelect('educationLevel', e.value)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-red-300 hover:bg-red-50 transition-all text-left active:scale-[0.99]"
          >
            <Circle size={18} className="text-gray-300 shrink-0" />
            <span className="text-lg shrink-0">{e.emoji || '📄'}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{e.labelKo}</p>
              <p className="text-xs text-gray-400">{e.labelEn}</p>
            </div>
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 자금 선택 단계 / Fund step
// ============================================================
function FundStep({ handleSelect }: { handleSelect: (f: Step, v: string | number) => void }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">연간 사용 가능 자금 / Available annual fund</p>
      <div className="space-y-2">
        {fundOptions.map((f) => (
          <button
            key={f.value}
            onClick={() => handleSelect('availableAnnualFund', f.value)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-red-300 hover:bg-red-50 transition-all text-left active:scale-[0.99]"
          >
            <Circle size={18} className="text-gray-300 shrink-0" />
            <DollarSign size={16} className="text-gray-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{f.labelKo}</p>
              <p className="text-xs text-gray-400">{f.labelEn}</p>
            </div>
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 목표 선택 단계 / Goal step
// ============================================================
function GoalStep({ handleSelect }: { handleSelect: (f: Step, v: string | number) => void }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">최종 목표는 무엇인가요? / What is your final goal?</p>
      <div className="grid grid-cols-2 gap-3">
        {goalOptions.map((g) => (
          <button
            key={g.value}
            onClick={() => handleSelect('finalGoal', g.value)}
            className="flex flex-col items-start gap-2 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-red-300 hover:bg-red-50 transition-all text-left active:scale-95"
          >
            <span className="text-2xl">{g.emoji}</span>
            <div>
              <p className="text-sm font-bold text-gray-800">{g.labelKo}</p>
              <p className="text-xs text-gray-400">{g.labelEn}</p>
              <p className="text-xs text-gray-500 mt-1">{g.descKo}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 우선순위 선택 단계 / Priority step
// ============================================================
function PriorityStep({ handleSelect }: { handleSelect: (f: Step, v: string | number) => void }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">무엇을 가장 중요하게 여기나요? / What matters most to you?</p>
      <div className="space-y-2">
        {priorityOptions.map((p) => (
          <button
            key={p.value}
            onClick={() => handleSelect('priorityPreference', p.value)}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-red-300 hover:bg-red-50 transition-all text-left active:scale-[0.99]"
          >
            <span className="text-2xl shrink-0">{p.emoji}</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">{p.labelKo}</p>
              <p className="text-xs text-gray-500">{p.descKo}</p>
            </div>
            <span className="text-xs text-gray-400 shrink-0">{p.labelEn}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 결과 뷰 / Result view
// ============================================================
function ResultView({
  result,
  onRestart,
  openPathways,
  togglePathway,
  openMilestones,
  toggleMilestone,
}: {
  result: DiagnosisResult;
  onRestart: () => void;
  openPathways: Set<number>;
  togglePathway: (idx: number) => void;
  openMilestones: Set<string>;
  toggleMilestone: (key: string) => void;
}) {
  const pathways = result.pathways;
  const completedCount = pathways.length;

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 / Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
              <ListChecks size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">진단 결과</p>
              <p className="text-xs text-gray-400">Diagnosis Result</p>
            </div>
          </div>
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium"
          >
            <RotateCcw size={14} />
            다시 진단
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-5">
        {/* 완료 배너 / Completion banner */}
        <div className="rounded-2xl bg-red-500 p-5 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-lg leading-none">체크리스트 완료!</p>
              <p className="text-red-100 text-sm">All items checked</p>
            </div>
          </div>
          {/* 전체 완료율 바 / Overall completion bar */}
          <div className="bg-white/20 rounded-full h-2.5 mb-2">
            <div className="bg-white h-2.5 rounded-full w-full" />
          </div>
          <p className="text-sm text-red-100">
            6/6 조건 확인 완료 · {result.meta.totalPathwaysEvaluated}개 경로 분석 · {completedCount}개 추천
          </p>
        </div>

        {/* 결과 체크리스트 섹션 헤더 / Results checklist section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            <h2 className="text-base font-bold text-gray-900">
              추천 경로 / Recommended Pathways ({completedCount})
            </h2>
          </div>
          <span className="text-xs text-gray-400">점수순 / By Score</span>
        </div>

        {/* 경로 체크리스트 / Pathway checklist */}
        <div className="space-y-3">
          {pathways.map((pathway, idx) => (
            <PathwayCheckItem
              key={pathway.pathwayId}
              pathway={pathway}
              idx={idx}
              isOpen={openPathways.has(idx)}
              onToggle={() => togglePathway(idx)}
              openMilestones={openMilestones}
              toggleMilestone={toggleMilestone}
            />
          ))}
        </div>

        {/* 하드 필터 정보 / Hard filter info */}
        <div className="rounded-xl border border-dashed border-gray-200 p-4 flex items-center gap-3">
          <X size={18} className="text-gray-300 shrink-0" />
          <div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">{result.meta.hardFilteredOut}개 경로</span>가 자격 요건 미달로 제외되었습니다
            </p>
            <p className="text-xs text-gray-400">{result.meta.hardFilteredOut} pathways filtered out due to hard requirements</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// 경로 체크 아이템 / Pathway check item
// ============================================================
function PathwayCheckItem({
  pathway,
  idx,
  isOpen,
  onToggle,
  openMilestones,
  toggleMilestone,
}: {
  pathway: RecommendedPathway;
  idx: number;
  isOpen: boolean;
  onToggle: () => void;
  openMilestones: Set<string>;
  toggleMilestone: (key: string) => void;
}) {
  const score = pathway.finalScore;
  const scoreColor = getScoreColor(score);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  // 점수 기반 우선순위 태그 / Priority tag based on score
  const priority: 'high' | 'medium' | 'low' = score >= 51 ? 'high' : score >= 31 ? 'medium' : 'low';
  const priorityLabel = { high: '높음 High', medium: '보통 Medium', low: '낮음 Low' }[priority];

  // 비자 체인 파싱 / Parse visa chain
  const visaChainParts = pathway.visaChain.split(' → ');

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* 항목 헤더 (클릭으로 아코디언 토글) / Item header (click to toggle accordion) */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        {/* 체크 아이콘 / Check icon */}
        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <Check size={15} className="text-green-600" />
        </div>

        {/* 경로 정보 / Pathway info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-base">{emoji}</span>
            <p className="text-sm font-bold text-gray-900 truncate">{pathway.nameKo}</p>
          </div>
          <p className="text-xs text-gray-400 truncate">{pathway.nameEn}</p>
        </div>

        {/* 오른쪽: 점수 + 우선순위 + 아코디언 화살표 / Right: score + priority + chevron */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORITY_COLORS[priority]}`}>
            {priorityLabel}
          </span>
          <div className="text-center">
            <p className="text-lg font-black leading-none" style={{ color: scoreColor }}>{score}</p>
            <p className="text-xs text-gray-400">점</p>
          </div>
          {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {/* 아코디언 상세 / Accordion detail */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-gray-50">
          {/* 요약 배지 행 / Summary badge row */}
          <div className="flex flex-wrap gap-2 px-4 py-3">
            <span className="flex items-center gap-1 text-xs bg-white border border-gray-100 rounded-full px-2.5 py-1 text-gray-600">
              <Clock size={11} className="text-red-400" />
              {pathway.estimatedMonths}개월
            </span>
            <span className="flex items-center gap-1 text-xs bg-white border border-gray-100 rounded-full px-2.5 py-1 text-gray-600">
              <DollarSign size={11} className="text-red-400" />
              {pathway.estimatedCostWon.toLocaleString()}만원
            </span>
            <span className="flex items-center gap-1 text-xs bg-white border border-gray-100 rounded-full px-2.5 py-1 text-gray-600">
              <Flag size={11} className="text-red-400" />
              {pathway.feasibilityLabel}
            </span>
          </div>

          {/* 비자 체인 / Visa chain */}
          <div className="px-4 pb-3">
            <p className="text-xs font-semibold text-gray-500 mb-2">비자 경로 / Visa Chain</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {visaChainParts.map((visa, vi) => (
                <React.Fragment key={vi}>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-100 text-red-700 border border-red-200">
                    {visa}
                  </span>
                  {vi < visaChainParts.length - 1 && (
                    <ArrowRight size={12} className="text-gray-300" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 마일스톤 체크리스트 (아코디언) / Milestone checklist (accordion) */}
          <div className="px-4 pb-3">
            <button
              onClick={() => toggleMilestone(pathway.pathwayId)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors mb-2"
            >
              {openMilestones.has(pathway.pathwayId) ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
              단계별 체크리스트 / Step-by-step checklist ({pathway.milestones.length})
            </button>

            {openMilestones.has(pathway.pathwayId) && (
              <div className="space-y-2">
                {pathway.milestones.map((m, mi) => (
                  <div key={mi} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-gray-100">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-400">{m.order}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 leading-tight">{m.nameKo}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{m.monthFromStart}개월차</span>
                        {m.visaStatus && m.visaStatus !== 'none' && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium">
                            {m.visaStatus}
                          </span>
                        )}
                        {m.canWorkPartTime && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-600">
                            아르바이트 가능
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 다음 단계 / Next steps */}
          {pathway.nextSteps.length > 0 && (
            <div className="px-4 pb-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">즉시 할 일 / Immediate Actions</p>
              <div className="space-y-1.5">
                {pathway.nextSteps.map((ns, ni) => (
                  <div key={ni} className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-gray-100">
                    <div className="w-4 h-4 rounded border-2 border-red-300 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{ns.nameKo}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{ns.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 노트 / Note */}
          {pathway.note && (
            <div className="mx-4 mb-4 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2">
              <Star size={13} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">{pathway.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
