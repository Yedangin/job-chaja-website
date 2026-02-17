'use client';

// 비자 진단 페이지 - 프로젝트 관리 디자인 (Design #35)
// Visa diagnosis page - Project Manager design (Design #35)
// 컨셉: Asana/Linear/Notion 스타일의 프로젝트 보드 + 간트 차트
// Concept: Asana/Linear/Notion-style project board + Gantt chart

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
  ChevronDown,
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  Tag,
  Flag,
  Layers,
  BarChart2,
  Calendar,
  User,
  Globe,
  BookOpen,
  Target,
  Zap,
  Plus,
  X,
  ArrowRight,
  ListChecks,
  Kanban,
  GanttChart,
  AlertCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';
type ViewMode = 'board' | 'gantt' | 'list';

const STEPS: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'];

// 라벨 색상 매핑 / Label color mapping
const LABEL_COLORS: Record<string, string> = {
  '매우높음': 'bg-violet-100 text-violet-700 border-violet-200',
  '높음': 'bg-blue-100 text-blue-700 border-blue-200',
  '보통': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  '낮음': 'bg-orange-100 text-orange-700 border-orange-200',
  '매우낮음': 'bg-red-100 text-red-700 border-red-200',
};

// 우선순위 색상 / Priority colors
const PRIORITY_COLORS: Record<string, string> = {
  speed: 'text-orange-500',
  stability: 'text-blue-500',
  cost: 'text-green-500',
  income: 'text-violet-500',
};

// 점수 → 배경색 / Score to background color
function getScoreBg(score: number): string {
  if (score >= 70) return 'bg-violet-600';
  if (score >= 50) return 'bg-blue-500';
  if (score >= 30) return 'bg-yellow-500';
  return 'bg-red-400';
}

// 점수 → 텍스트 색상 / Score to text color
function getScoreTextColor(score: number): string {
  if (score >= 70) return 'text-violet-600';
  if (score >= 50) return 'text-blue-500';
  if (score >= 30) return 'text-yellow-500';
  return 'text-red-400';
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================

export default function Diagnosis35Page() {
  // 입력 상태 / Input state
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<RecommendedPathway | null>(null);

  const stepKey = STEPS[currentStep];

  // 다음 단계로 이동 / Move to next step
  function handleNext() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // 진단 실행 / Run diagnosis
      setResult(mockDiagnosisResult);
      setIsSubmitted(true);
    }
  }

  // 이전 단계로 이동 / Go back to previous step
  function handleBack() {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  }

  // 값이 선택되었는지 확인 / Check if value is selected
  function hasValue(): boolean {
    const val = input[stepKey as keyof DiagnosisInput];
    if (val === undefined || val === null || val === '') return false;
    return true;
  }

  // 다시 시작 / Restart
  function handleRestart() {
    setCurrentStep(0);
    setInput({});
    setIsSubmitted(false);
    setResult(null);
    setExpandedPathway(null);
    setSelectedPathway(null);
  }

  if (isSubmitted && result) {
    return (
      <ResultView
        result={result}
        input={input}
        viewMode={viewMode}
        setViewMode={setViewMode}
        expandedPathway={expandedPathway}
        setExpandedPathway={setExpandedPathway}
        selectedPathway={selectedPathway}
        setSelectedPathway={setSelectedPathway}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <InputView
      currentStep={currentStep}
      stepKey={stepKey}
      input={input}
      setInput={setInput}
      hasValue={hasValue}
      handleNext={handleNext}
      handleBack={handleBack}
    />
  );
}

// ============================================================
// 입력 화면 / Input view (이슈 생성 폼 스타일)
// Issue creation form style
// ============================================================

interface InputViewProps {
  currentStep: number;
  stepKey: Step;
  input: Partial<DiagnosisInput>;
  setInput: React.Dispatch<React.SetStateAction<Partial<DiagnosisInput>>>;
  hasValue: () => boolean;
  handleNext: () => void;
  handleBack: () => void;
}

function InputView({ currentStep, stepKey, input, setInput, hasValue, handleNext, handleBack }: InputViewProps) {
  const totalSteps = STEPS.length;
  const progress = ((currentStep) / totalSteps) * 100;

  // 라벨 / Labels
  const stepLabels: Record<Step, string> = {
    nationality: '국적',
    age: '나이',
    educationLevel: '학력',
    availableAnnualFund: '준비 자금',
    finalGoal: '최종 목표',
    priorityPreference: '우선순위',
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 상단 헤더 - 프로젝트 관리 툴 스타일 / Top header - PM tool style */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-sm">JobChaja</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">비자 진단</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700 font-medium">새 진단 시작</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* 이슈 생성 카드 / Issue creation card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* 카드 헤더 / Card header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">New Diagnosis Issue</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">비자 경로 진단</h1>
            <p className="text-sm text-gray-500">아래 정보를 입력하면 최적의 비자 경로를 자동 분석합니다.</p>

            {/* 진행률 바 / Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">진행률</span>
                <span className="text-xs text-violet-600 font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* 사이드바 + 콘텐츠 레이아웃 / Sidebar + content layout */}
          <div className="flex">
            {/* 좌측 필드 목록 / Left field list */}
            <div className="w-40 border-r border-gray-100 bg-gray-50 py-4">
              {STEPS.map((step, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs ${
                      isCurrent
                        ? 'bg-violet-50 border-r-2 border-violet-500 text-violet-700 font-semibold'
                        : isDone
                        ? 'text-gray-500'
                        : 'text-gray-300'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                    ) : isCurrent ? (
                      <Circle className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    )}
                    {stepLabels[step]}
                  </div>
                );
              })}
            </div>

            {/* 우측 입력 영역 / Right input area */}
            <div className="flex-1 p-6">
              <StepContent stepKey={stepKey} input={input} setInput={setInput} />
            </div>
          </div>

          {/* 카드 푸터 / Card footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border transition-colors ${
                currentStep === 0
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              이전
            </button>
            <button
              onClick={handleNext}
              disabled={!hasValue()}
              className={`flex items-center gap-1.5 text-sm px-5 py-2 rounded-lg font-medium transition-colors ${
                hasValue()
                  ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === STEPS.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  분석 시작
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
      </div>
    </div>
  );
}

// ============================================================
// 단계별 입력 컴포넌트 / Step-by-step input component
// ============================================================

interface StepContentProps {
  stepKey: Step;
  input: Partial<DiagnosisInput>;
  setInput: React.Dispatch<React.SetStateAction<Partial<DiagnosisInput>>>;
}

function StepContent({ stepKey, input, setInput }: StepContentProps) {
  // 국적 / Nationality
  if (stepKey === 'nationality') {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-violet-500" />
          국적을 선택하세요
        </label>
        <div className="grid grid-cols-3 gap-2">
          {popularCountries.map((c) => (
            <button
              key={c.code}
              onClick={() => setInput((prev) => ({ ...prev, nationality: c.code }))}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                input.nationality === c.code
                  ? 'border-violet-500 bg-violet-50 text-violet-700 font-medium'
                  : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-700'
              }`}
            >
              <span className="text-base">{c.flag}</span>
              <span className="text-xs truncate">{c.nameKo}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 나이 / Age
  if (stepKey === 'age') {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-violet-500" />
          나이를 입력하세요
        </label>
        <input
          type="number"
          min={18}
          max={60}
          value={input.age ?? ''}
          onChange={(e) => setInput((prev) => ({ ...prev, age: Number(e.target.value) }))}
          placeholder="예: 25"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-lg font-semibold"
        />
        <p className="text-xs text-gray-400 mt-2">만 나이 기준 (18 ~ 60세)</p>
      </div>
    );
  }

  // 학력 / Education
  if (stepKey === 'educationLevel') {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-violet-500" />
          최종 학력을 선택하세요
        </label>
        <div className="space-y-2">
          {educationOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setInput((prev) => ({ ...prev, educationLevel: opt.value }))}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-all text-left ${
                input.educationLevel === opt.value
                  ? 'border-violet-500 bg-violet-50 text-violet-700 font-medium'
                  : 'border-gray-200 hover:border-violet-300 text-gray-700'
              }`}
            >
              <span className="text-lg">{opt.emoji}</span>
              <div>
                <div className="font-medium text-sm">{opt.labelKo}</div>
                <div className="text-xs text-gray-400">{opt.labelEn}</div>
              </div>
              {input.educationLevel === opt.value && (
                <CheckCircle2 className="w-4 h-4 text-violet-500 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 자금 / Fund
  if (stepKey === 'availableAnnualFund') {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-violet-500" />
          준비 가능한 자금 (연간)
        </label>
        <div className="space-y-2">
          {fundOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setInput((prev) => ({ ...prev, availableAnnualFund: opt.value }))}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all ${
                input.availableAnnualFund === opt.value
                  ? 'border-violet-500 bg-violet-50 text-violet-700 font-medium'
                  : 'border-gray-200 hover:border-violet-300 text-gray-700'
              }`}
            >
              <span>{opt.labelKo}</span>
              <span className="text-xs text-gray-400">{opt.labelEn}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 목표 / Goal
  if (stepKey === 'finalGoal') {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-violet-500" />
          한국에서의 최종 목표
        </label>
        <div className="grid grid-cols-2 gap-3">
          {goalOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setInput((prev) => ({ ...prev, finalGoal: opt.value }))}
              className={`flex flex-col items-start gap-1 px-4 py-4 rounded-lg border text-sm transition-all ${
                input.finalGoal === opt.value
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-violet-300'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="font-semibold text-gray-800">{opt.labelKo}</span>
              <span className="text-xs text-gray-400">{opt.descKo}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 우선순위 / Priority
  if (stepKey === 'priorityPreference') {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Flag className="w-4 h-4 text-violet-500" />
          어떤 방향을 우선시하나요?
        </label>
        <div className="space-y-2">
          {priorityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setInput((prev) => ({ ...prev, priorityPreference: opt.value }))}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-all ${
                input.priorityPreference === opt.value
                  ? 'border-violet-500 bg-violet-50 text-violet-700 font-medium'
                  : 'border-gray-200 hover:border-violet-300 text-gray-700'
              }`}
            >
              <span className="text-xl">{opt.emoji}</span>
              <div>
                <div className="font-medium">{opt.labelKo}</div>
                <div className="text-xs text-gray-400">{opt.descKo}</div>
              </div>
              {input.priorityPreference === opt.value && (
                <CheckCircle2 className="w-4 h-4 text-violet-500 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ============================================================
// 결과 화면 / Result view (프로젝트 보드 + 간트 차트)
// Project board + Gantt chart
// ============================================================

interface ResultViewProps {
  result: DiagnosisResult;
  input: Partial<DiagnosisInput>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  expandedPathway: string | null;
  setExpandedPathway: (id: string | null) => void;
  selectedPathway: RecommendedPathway | null;
  setSelectedPathway: (p: RecommendedPathway | null) => void;
  onRestart: () => void;
}

function ResultView({
  result,
  input,
  viewMode,
  setViewMode,
  expandedPathway,
  setExpandedPathway,
  selectedPathway,
  setSelectedPathway,
  onRestart,
}: ResultViewProps) {
  const pathways = result.pathways;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 상단 GNB / Top GNB */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-sm">JobChaja</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">비자 진단</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700 font-medium">분석 결과</span>
        </div>
        <div className="flex items-center gap-2">
          {/* 뷰 전환 버튼 / View toggle buttons */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'board' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              보드
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'gantt' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <GanttChart className="w-3.5 h-3.5" />
              간트
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              목록
            </button>
          </div>
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg bg-white"
          >
            <Plus className="w-3.5 h-3.5" />
            새 진단
          </button>
        </div>
      </header>

      {/* 스프린트 요약 바 / Sprint summary bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-2.5 flex items-center gap-6 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <BarChart2 className="w-3.5 h-3.5 text-violet-500" />
          <strong className="text-gray-700">{result.meta.totalPathwaysEvaluated}</strong>개 경로 평가
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          <strong className="text-gray-700">{pathways.length}</strong>개 추천
        </span>
        <span className="flex items-center gap-1.5">
          <X className="w-3.5 h-3.5 text-red-400" />
          <strong className="text-gray-700">{result.meta.hardFilteredOut}</strong>개 제외
        </span>
        <span className="ml-auto text-gray-400">
          스프린트: 비자 경로 탐색 v1.0
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 보드 뷰 / Board view */}
        {viewMode === 'board' && (
          <BoardView
            pathways={pathways}
            selectedPathway={selectedPathway}
            setSelectedPathway={setSelectedPathway}
          />
        )}

        {/* 간트 뷰 / Gantt view */}
        {viewMode === 'gantt' && <GanttView pathways={pathways} />}

        {/* 목록 뷰 / List view */}
        {viewMode === 'list' && (
          <ListView
            pathways={pathways}
            expandedPathway={expandedPathway}
            setExpandedPathway={setExpandedPathway}
          />
        )}
      </div>

      {/* 사이드 패널 / Side panel */}
      {selectedPathway && (
        <SidePanel pathway={selectedPathway} onClose={() => setSelectedPathway(null)} />
      )}
    </div>
  );
}

// ============================================================
// 보드 뷰 (칸반 스타일) / Board view (Kanban style)
// ============================================================

interface BoardViewProps {
  pathways: RecommendedPathway[];
  selectedPathway: RecommendedPathway | null;
  setSelectedPathway: (p: RecommendedPathway | null) => void;
}

function BoardView({ pathways, selectedPathway, setSelectedPathway }: BoardViewProps) {
  // 점수별로 컬럼 분류 / Classify by score into columns
  const columns = [
    { title: '강력 추천', subtitle: '70점 이상', color: 'bg-violet-500', items: pathways.filter((p) => p.finalScore >= 70) },
    { title: '추천', subtitle: '50~70점', color: 'bg-blue-500', items: pathways.filter((p) => p.finalScore >= 50 && p.finalScore < 70) },
    { title: '검토 가능', subtitle: '30~50점', color: 'bg-yellow-500', items: pathways.filter((p) => p.finalScore >= 30 && p.finalScore < 50) },
    { title: '난이도 높음', subtitle: '30점 미만', color: 'bg-red-400', items: pathways.filter((p) => p.finalScore < 30) },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col) => (
        <div key={col.title} className="w-72 shrink-0">
          {/* 컬럼 헤더 / Column header */}
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${col.color}`} />
            <span className="text-sm font-semibold text-gray-700">{col.title}</span>
            <span className="text-xs text-gray-400">({col.subtitle})</span>
            <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
              {col.items.length}
            </span>
          </div>

          {/* 이슈 카드 목록 / Issue card list */}
          <div className="space-y-2">
            {col.items.map((pathway) => (
              <IssueCard
                key={pathway.pathwayId}
                pathway={pathway}
                isSelected={selectedPathway?.pathwayId === pathway.pathwayId}
                onClick={() =>
                  setSelectedPathway(
                    selectedPathway?.pathwayId === pathway.pathwayId ? null : pathway
                  )
                }
              />
            ))}
            {col.items.length === 0 && (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-xs text-gray-400">
                해당 없음
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 이슈 카드 / Issue card
// ============================================================

interface IssueCardProps {
  pathway: RecommendedPathway;
  isSelected: boolean;
  onClick: () => void;
}

function IssueCard({ pathway, isSelected }: IssueCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`bg-white border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-violet-400 shadow-md ring-1 ring-violet-200' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => setOpen(!open)}
    >
      {/* 카드 상단 / Card top */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs text-gray-400 font-mono">{pathway.pathwayId}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
            LABEL_COLORS[pathway.feasibilityLabel] ?? 'bg-gray-100 text-gray-600 border-gray-200'
          }`}
        >
          {getFeasibilityEmoji(pathway.finalScore)} {pathway.feasibilityLabel}
        </span>
      </div>

      {/* 제목 / Title */}
      <h3 className="text-sm font-semibold text-gray-800 mb-1 leading-tight">{pathway.nameKo}</h3>
      <p className="text-xs text-gray-400 mb-3">{pathway.nameEn}</p>

      {/* 메타 정보 / Meta info */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {pathway.estimatedMonths}개월
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          {(pathway.estimatedCostWon / 10000).toFixed(0)}만원
        </span>
      </div>

      {/* 비자 체인 태그 / Visa chain tag */}
      <div className="flex items-center gap-1 mb-3">
        <Tag className="w-3 h-3 text-violet-400" />
        <span className="text-xs text-violet-600 font-mono bg-violet-50 px-1.5 py-0.5 rounded">
          {pathway.visaChain}
        </span>
      </div>

      {/* 점수 바 / Score bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${getScoreBg(pathway.finalScore)}`}
            style={{ width: `${pathway.finalScore}%` }}
          />
        </div>
        <span className={`text-xs font-bold ${getScoreTextColor(pathway.finalScore)}`}>
          {pathway.finalScore}
        </span>
      </div>

      {/* 펼치기 상세 / Expanded detail */}
      {open && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          <p className="text-xs text-gray-500">{pathway.note}</p>
          {pathway.nextSteps.slice(0, 2).map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <ArrowRight className="w-3 h-3 text-violet-400 mt-0.5 shrink-0" />
              <span>{step.nameKo}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 간트 차트 뷰 / Gantt chart view
// ============================================================

interface GanttViewProps {
  pathways: RecommendedPathway[];
}

function GanttView({ pathways }: GanttViewProps) {
  const maxMonths = Math.max(...pathways.map((p) => p.estimatedMonths));
  const months = Array.from({ length: maxMonths + 1 }, (_, i) => i);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <GanttChart className="w-4 h-4 text-violet-500" />
        <h2 className="text-sm font-semibold text-gray-800">비자 경로 타임라인</h2>
        <span className="text-xs text-gray-400">— 각 경로의 예상 소요 기간</span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* 월 헤더 / Month header */}
          <div className="flex border-b border-gray-100">
            <div className="w-56 shrink-0 px-4 py-2 text-xs font-semibold text-gray-500">경로</div>
            {months.map((m) => (
              <div
                key={m}
                className={`w-10 text-center py-2 text-xs ${
                  m % 6 === 0 ? 'font-semibold text-violet-600' : 'text-gray-400'
                }`}
              >
                {m % 6 === 0 ? `${m}M` : ''}
              </div>
            ))}
          </div>

          {/* 경로 행 / Pathway rows */}
          {pathways.map((pathway, idx) => (
            <div
              key={pathway.pathwayId}
              className={`flex items-center border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                idx % 2 === 0 ? '' : 'bg-gray-50/50'
              }`}
            >
              {/* 경로명 / Pathway name */}
              <div className="w-56 shrink-0 px-4 py-3">
                <div className="text-xs font-semibold text-gray-700 truncate">{pathway.nameKo}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      LABEL_COLORS[pathway.feasibilityLabel] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {pathway.feasibilityLabel}
                  </span>
                </div>
              </div>

              {/* 간트 바 / Gantt bar */}
              <div className="flex items-center relative" style={{ width: `${(maxMonths + 1) * 40}px`, height: '48px' }}>
                {/* 배경 그리드 / Background grid */}
                {months.map((m) => (
                  <div
                    key={m}
                    className={`absolute top-0 bottom-0 w-10 ${m % 6 === 0 ? 'border-l border-violet-100' : 'border-l border-gray-100'}`}
                    style={{ left: `${m * 40}px` }}
                  />
                ))}

                {/* 진행 바 / Progress bar */}
                <div
                  className={`absolute h-6 rounded-full flex items-center ${getScoreBg(pathway.finalScore)} opacity-80`}
                  style={{ left: '0px', width: `${pathway.estimatedMonths * 40}px` }}
                >
                  <span className="px-2 text-white text-xs font-medium truncate">
                    {pathway.estimatedMonths}개월
                  </span>
                </div>

                {/* 마일스톤 점 / Milestone dots */}
                {pathway.milestones.map((ms) => (
                  <div
                    key={ms.order}
                    className="absolute w-3 h-3 rounded-full bg-white border-2 border-violet-500 -top-1 z-10"
                    style={{ left: `${ms.monthFromStart * 40 - 6}px`, top: '18px' }}
                    title={ms.nameKo}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 목록 뷰 / List view
// ============================================================

interface ListViewProps {
  pathways: RecommendedPathway[];
  expandedPathway: string | null;
  setExpandedPathway: (id: string | null) => void;
}

function ListView({ pathways, expandedPathway, setExpandedPathway }: ListViewProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 테이블 헤더 / Table header */}
      <div className="grid grid-cols-12 px-6 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        <div className="col-span-1">ID</div>
        <div className="col-span-4">경로명</div>
        <div className="col-span-2">실현 가능성</div>
        <div className="col-span-1">점수</div>
        <div className="col-span-2">기간</div>
        <div className="col-span-2">예상 비용</div>
      </div>

      {pathways.map((pathway, idx) => (
        <div key={pathway.pathwayId}>
          {/* 행 / Row */}
          <div
            className={`grid grid-cols-12 px-6 py-3.5 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
              idx % 2 === 0 ? '' : 'bg-gray-50/30'
            }`}
            onClick={() =>
              setExpandedPathway(expandedPathway === pathway.pathwayId ? null : pathway.pathwayId)
            }
          >
            <div className="col-span-1 text-xs text-gray-400 font-mono flex items-center">
              {pathway.pathwayId}
            </div>
            <div className="col-span-4 flex items-center gap-2">
              {expandedPathway === pathway.pathwayId ? (
                <ChevronDown className="w-3.5 h-3.5 text-violet-500 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              )}
              <div>
                <div className="text-sm font-semibold text-gray-800">{pathway.nameKo}</div>
                <div className="text-xs text-gray-400">{pathway.nameEn}</div>
              </div>
            </div>
            <div className="col-span-2 flex items-center">
              <span
                className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                  LABEL_COLORS[pathway.feasibilityLabel] ?? 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {getFeasibilityEmoji(pathway.finalScore)} {pathway.feasibilityLabel}
              </span>
            </div>
            <div className="col-span-1 flex items-center">
              <span className={`text-sm font-bold ${getScoreTextColor(pathway.finalScore)}`}>
                {pathway.finalScore}
              </span>
            </div>
            <div className="col-span-2 flex items-center text-sm text-gray-600">
              <Clock className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
              {pathway.estimatedMonths}개월
            </div>
            <div className="col-span-2 flex items-center text-sm text-gray-600">
              <DollarSign className="w-3.5 h-3.5 text-gray-400 mr-1" />
              {pathway.estimatedCostWon >= 10000
                ? `${(pathway.estimatedCostWon / 10000).toFixed(0)}천만원`
                : `${pathway.estimatedCostWon}만원`}
            </div>
          </div>

          {/* 확장 상세 / Expanded detail */}
          {expandedPathway === pathway.pathwayId && (
            <div className="px-6 py-4 bg-violet-50/50 border-b border-violet-100">
              <div className="grid grid-cols-2 gap-6">
                {/* 마일스톤 / Milestones */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-violet-500" />
                    마일스톤
                  </h4>
                  <div className="space-y-2">
                    {pathway.milestones.map((ms) => (
                      <div key={ms.order} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-xs flex items-center justify-center shrink-0 font-semibold">
                          {ms.order}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-700">{ms.nameKo}</div>
                          <div className="text-xs text-gray-400">{ms.monthFromStart}개월차 · {ms.visaStatus}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 다음 단계 / Next steps */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-violet-500" />
                    다음 단계
                  </h4>
                  <div className="space-y-2">
                    {pathway.nextSteps.map((ns, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <ArrowRight className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-medium">{ns.nameKo}</div>
                          <div className="text-gray-400">{ns.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {pathway.note && (
                    <div className="mt-3 flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      {pathway.note}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 사이드 패널 / Side panel (이슈 상세)
// Issue detail side panel
// ============================================================

interface SidePanelProps {
  pathway: RecommendedPathway;
  onClose: () => void;
}

function SidePanel({ pathway, onClose }: SidePanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-30 overflow-y-auto">
      {/* 패널 헤더 / Panel header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">{pathway.pathwayId}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
              LABEL_COLORS[pathway.feasibilityLabel] ?? 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            {pathway.feasibilityLabel}
          </span>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* 제목 / Title */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight mb-1">{pathway.nameKo}</h2>
          <p className="text-sm text-gray-400">{pathway.nameEn}</p>
        </div>

        {/* 핵심 수치 / Key metrics */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard icon={<TrendingUp className="w-4 h-4 text-violet-500" />} label="적합도 점수" value={`${pathway.finalScore}점`} color={getScoreTextColor(pathway.finalScore)} />
          <MetricCard icon={<Clock className="w-4 h-4 text-blue-500" />} label="예상 기간" value={`${pathway.estimatedMonths}개월`} color="text-blue-600" />
          <MetricCard icon={<DollarSign className="w-4 h-4 text-green-500" />} label="예상 비용" value={pathway.estimatedCostWon >= 10000 ? `${(pathway.estimatedCostWon / 10000).toFixed(1)}천만원` : `${pathway.estimatedCostWon}만원`} color="text-green-600" />
          <MetricCard icon={<Tag className="w-4 h-4 text-orange-500" />} label="비자 체인" value={pathway.visaChain} color="text-orange-600" />
        </div>

        {/* 점수 분석 / Score breakdown */}
        <div>
          <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-violet-500" />
            점수 분석
          </h3>
          <div className="space-y-2">
            {[
              { label: '기본 점수', value: pathway.scoreBreakdown.base, max: 100 },
              { label: '나이 가중치', value: Math.round(pathway.scoreBreakdown.ageMultiplier * 100), max: 100 },
              { label: '국적 가중치', value: Math.round(pathway.scoreBreakdown.nationalityMultiplier * 100), max: 100 },
              { label: '자금 가중치', value: Math.round(pathway.scoreBreakdown.fundMultiplier * 100), max: 100 },
              { label: '학력 가중치', value: Math.round(pathway.scoreBreakdown.educationMultiplier * 100), max: 100 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-24 shrink-0">{item.label}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium w-8 text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 마일스톤 / Milestones */}
        <div>
          <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-violet-500" />
            마일스톤
          </h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-4 pl-8">
              {pathway.milestones.map((ms) => (
                <div key={ms.order} className="relative">
                  <div className="absolute -left-4 w-3 h-3 rounded-full bg-violet-500 border-2 border-white shadow-sm" />
                  <div className="text-xs font-semibold text-gray-700">{ms.nameKo}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{ms.monthFromStart}개월차 · {ms.visaStatus || '비자 없음'}</div>
                  {ms.canWorkPartTime && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 rounded px-1.5 py-0.5 mt-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      아르바이트 {ms.weeklyHours}시간/주 가능
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 다음 단계 / Next steps */}
        <div>
          <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-violet-500" />
            즉시 실행할 단계
          </h3>
          <div className="space-y-2">
            {pathway.nextSteps.map((ns, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-violet-50 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-xs flex items-center justify-center shrink-0 font-bold">
                  {i + 1}
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-800">{ns.nameKo}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{ns.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 유의사항 / Note */}
        {pathway.note && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">{pathway.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 메트릭 카드 / Metric card
// ============================================================

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function MetricCard({ icon, label, value, color }: MetricCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
      <div className="flex items-center gap-1.5 mb-1.5">{icon}<span className="text-xs text-gray-500">{label}</span></div>
      <div className={`text-sm font-bold ${color} leading-tight`}>{value}</div>
    </div>
  );
}
