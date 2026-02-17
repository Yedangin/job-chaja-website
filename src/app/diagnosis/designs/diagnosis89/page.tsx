'use client';

// 인테리어 디자인 스타일 비자 진단 페이지 / Interior Design Style Visa Diagnosis Page
// Houzz, Havenly, RoomSketcher 등 인테리어 앱 레퍼런스 / References: Houzz, Havenly, RoomSketcher
// 비자 경로를 방(room)으로, 조건을 가구(furniture)로 표현 / Visa paths as rooms, conditions as furniture

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
  getScoreColor,
  getFeasibilityEmoji,
  mockPathways,
  CompatPathway,
} from '../_mock/diagnosis-mock-data';
import {
  ChevronRight,
  ChevronLeft,
  Home,
  Layers,
  Palette,
  Clock,
  CheckCircle,
  ArrowRight,
  BookOpen,
  LayoutGrid,
  Heart,
  Share2,
  Download,
  Sparkles,
  Target,
  Map,
  ZoomIn,
  RotateCcw,
  Plus,
  Minus,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';
type ViewMode = 'floorplan' | '3d' | 'moodboard';

// ============================================================
// 단계 메타 / Step metadata
// ============================================================

const STEPS: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'];

const STEP_META: Record<Step, { title: string; titleEn: string; icon: string; furniture: string }> = {
  nationality: { title: '국적 선택', titleEn: 'Nationality', icon: '🌍', furniture: '소파' },
  age: { title: '나이 입력', titleEn: 'Age', icon: '🪑', furniture: '의자' },
  educationLevel: { title: '학력 선택', titleEn: 'Education', icon: '📚', furniture: '책장' },
  availableAnnualFund: { title: '가용 자금', titleEn: 'Available Fund', icon: '💰', furniture: '화분' },
  finalGoal: { title: '최종 목표', titleEn: 'Goal', icon: '🎯', furniture: '조명' },
  priorityPreference: { title: '우선순위', titleEn: 'Priority', icon: '⭐', furniture: '러그' },
};

// ============================================================
// 경로 색상 팔레트 (웜 베이지 + 모던 그레이) / Room color palette
// ============================================================

const ROOM_COLORS = [
  { bg: 'bg-amber-50', border: 'border-amber-300', accent: 'bg-amber-400', text: 'text-amber-800', tag: 'bg-amber-100' },
  { bg: 'bg-stone-50', border: 'border-stone-300', accent: 'bg-stone-400', text: 'text-stone-800', tag: 'bg-stone-100' },
  { bg: 'bg-orange-50', border: 'border-orange-300', accent: 'bg-orange-400', text: 'text-orange-800', tag: 'bg-orange-100' },
  { bg: 'bg-yellow-50', border: 'border-yellow-300', accent: 'bg-yellow-400', text: 'text-yellow-800', tag: 'bg-yellow-100' },
  { bg: 'bg-neutral-50', border: 'border-neutral-300', accent: 'bg-neutral-400', text: 'text-neutral-800', tag: 'bg-neutral-100' },
];

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================

export default function Diagnosis89Page() {
  // 현재 단계 / Current step
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // 입력값 / Input values
  const [input, setInput] = useState<DiagnosisInput>(mockInput);
  // 진단 완료 여부 / Diagnosis completed
  const [showResult, setShowResult] = useState(false);
  // 선택된 경로 / Selected pathway
  const [selectedPathway, setSelectedPathway] = useState<CompatPathway | null>(null);
  // 뷰 모드 / View mode
  const [viewMode, setViewMode] = useState<ViewMode>('floorplan');
  // 찜 목록 / Saved pathways
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  // 확장된 마일스톤 / Expanded milestone
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);

  const currentStep = STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === STEPS.length - 1;

  // 다음 단계 / Go to next step
  const handleNext = () => {
    if (isLastStep) {
      setShowResult(true);
      setSelectedPathway(mockPathways[0]);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  // 이전 단계 / Go to previous step
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // 찜 토글 / Toggle saved
  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 처음으로 돌아가기 / Reset to beginning
  const handleReset = () => {
    setShowResult(false);
    setSelectedPathway(null);
    setCurrentStepIndex(0);
    setInput(mockInput);
    setViewMode('floorplan');
  };

  // ============================================================
  // 결과 화면 렌더링 / Render result screen
  // ============================================================

  if (showResult) {
    return (
      <ResultScreen
        pathways={mockPathways}
        selectedPathway={selectedPathway}
        onSelectPathway={setSelectedPathway}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        savedIds={savedIds}
        onToggleSaved={toggleSaved}
        expandedMilestone={expandedMilestone}
        onExpandMilestone={setExpandedMilestone}
        onReset={handleReset}
        input={input}
      />
    );
  }

  // ============================================================
  // 입력 화면 렌더링 / Render input screen
  // ============================================================

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0ea', fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* 상단 헤더 / Top header */}
      <header className="sticky top-0 z-50 border-b border-stone-200" style={{ backgroundColor: '#f5f0ea' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ backgroundColor: '#c8a882' }}>
              <Home className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-stone-800 font-semibold text-sm tracking-widest uppercase">Visa Planner</span>
              <span className="text-stone-400 text-xs ml-2">by JobChaJa</span>
            </div>
          </div>
          {/* 진행률 표시 / Progress indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className="flex items-center gap-1"
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < currentStepIndex
                      ? 'w-4'
                      : i === currentStepIndex
                      ? 'w-3 h-3'
                      : ''
                  }`}
                  style={{
                    backgroundColor: i <= currentStepIndex ? '#c8a882' : '#d6cfc5',
                  }}
                />
              </div>
            ))}
            <span className="text-stone-500 text-xs ml-2">{currentStepIndex + 1} / {STEPS.length}</span>
          </div>
        </div>
      </header>

      {/* 메인 레이아웃 / Main layout */}
      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-8">
        {/* 좌측: 평면도 미리보기 / Left: Floor plan preview */}
        <div className="hidden lg:block w-64 shrink-0">
          <MiniFloorPlan currentStepIndex={currentStepIndex} input={input} />
        </div>

        {/* 우측: 입력 패널 / Right: Input panel */}
        <div className="flex-1">
          {/* 단계 제목 / Step title */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{STEP_META[currentStep].icon}</span>
              <span className="text-xs tracking-widest uppercase text-stone-400 font-medium">
                {STEP_META[currentStep].titleEn}
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-stone-800 mb-1">
              {STEP_META[currentStep].title}
            </h1>
            <p className="text-stone-500 text-sm">
              {/* 가구 배치 힌트 / Furniture placement hint */}
              방에 <strong style={{ color: '#c8a882' }}>"{STEP_META[currentStep].furniture}"</strong>를 놓아 나만의 공간을 완성하세요
              <span className="text-stone-400 ml-1">/ Place your {STEP_META[currentStep].furniture} to build your space</span>
            </p>
          </div>

          {/* 입력 카드 / Input card */}
          <div className="rounded-2xl border border-stone-200 overflow-hidden" style={{ backgroundColor: '#faf8f5' }}>
            {/* 카드 상단 장식 / Card top decoration */}
            <div className="h-1.5" style={{ background: 'linear-gradient(to right, #c8a882, #e8d5bf, #c8a882)' }} />

            <div className="p-8">
              <StepContent
                step={currentStep}
                input={input}
                onInputChange={(key, value) => setInput((prev) => ({ ...prev, [key]: value }))}
              />
            </div>
          </div>

          {/* 네비게이션 버튼 / Navigation buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-stone-300 text-stone-600 text-sm hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              이전 / Back
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-7 py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: '#c8a882' }}
            >
              {isLastStep ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  공간 완성 / Render Room
                </>
              ) : (
                <>
                  다음 / Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 하단 무드보드 힌트 / Bottom moodboard hint */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="rounded-xl p-4 flex items-center gap-4 border border-stone-200" style={{ backgroundColor: '#f0ebe3' }}>
          <Palette className="w-5 h-5 shrink-0" style={{ color: '#c8a882' }} />
          <p className="text-stone-600 text-sm">
            모든 조건을 입력하면 비자 경로를 <strong>인테리어 평면도</strong>로 시각화합니다 /
            After all inputs, your visa pathway renders as an <strong>interior floor plan</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 단계별 입력 컴포넌트 / Step input component
// ============================================================

interface StepContentProps {
  step: Step;
  input: DiagnosisInput;
  onInputChange: (key: keyof DiagnosisInput, value: DiagnosisInput[keyof DiagnosisInput]) => void;
}

function StepContent({ step, input, onInputChange }: StepContentProps) {
  // 국적 선택 / Nationality selection
  if (step === 'nationality') {
    return (
      <div>
        <p className="text-stone-500 text-sm mb-4">어느 나라에서 오셨나요? / Where are you from?</p>
        <div className="grid grid-cols-3 gap-3">
          {popularCountries.map((c) => (
            <button
              key={c.code}
              onClick={() => onInputChange('nationality', c.code)}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left hover:scale-105 ${
                input.nationality === c.code
                  ? 'border-amber-400 shadow-md'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
              style={{ backgroundColor: input.nationality === c.code ? '#fef3c7' : '#faf8f5' }}
            >
              <span className="text-xl">{c.flag}</span>
              <span className="text-xs text-stone-700 font-medium">{c.nameKo}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 나이 입력 / Age input
  if (step === 'age') {
    return (
      <div>
        <p className="text-stone-500 text-sm mb-6">현재 나이를 입력하세요 / Enter your current age</p>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => onInputChange('age', Math.max(16, input.age - 1))}
            className="w-12 h-12 rounded-full border-2 border-stone-300 flex items-center justify-center text-stone-600 hover:border-amber-400 transition-all"
          >
            <Minus className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div
              className="text-6xl font-bold mb-1"
              style={{ color: '#c8a882', fontFamily: 'Georgia, serif' }}
            >
              {input.age}
            </div>
            <span className="text-stone-500 text-sm">세 / years old</span>
          </div>
          <button
            onClick={() => onInputChange('age', Math.min(65, input.age + 1))}
            className="w-12 h-12 rounded-full border-2 border-stone-300 flex items-center justify-center text-stone-600 hover:border-amber-400 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {/* 나이 슬라이더 / Age slider */}
        <div className="mt-6 px-4">
          <input
            type="range"
            min={16}
            max={65}
            value={input.age}
            onChange={(e) => onInputChange('age', parseInt(e.target.value))}
            className="w-full accent-amber-400"
          />
          <div className="flex justify-between text-xs text-stone-400 mt-1">
            <span>16세</span><span>40세</span><span>65세</span>
          </div>
        </div>
      </div>
    );
  }

  // 학력 선택 / Education selection
  if (step === 'educationLevel') {
    return (
      <div>
        <p className="text-stone-500 text-sm mb-4">최종 학력을 선택하세요 / Select your highest education</p>
        <div className="space-y-2">
          {educationOptions.map((e) => (
            <button
              key={e.value}
              onClick={() => onInputChange('educationLevel', e.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                input.educationLevel === e.value
                  ? 'border-amber-400 shadow-sm'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
              style={{ backgroundColor: input.educationLevel === e.value ? '#fef3c7' : '#faf8f5' }}
            >
              <span className="text-2xl w-8 text-center">{e.emoji}</span>
              <div>
                <div className="text-stone-800 font-medium text-sm">{e.labelKo}</div>
                <div className="text-stone-400 text-xs">{e.labelEn}</div>
              </div>
              {input.educationLevel === e.value && (
                <CheckCircle className="w-5 h-5 ml-auto shrink-0" style={{ color: '#c8a882' }} />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 자금 범위 선택 / Fund range selection
  if (step === 'availableAnnualFund') {
    return (
      <div>
        <p className="text-stone-500 text-sm mb-4">연간 가용 자금을 선택하세요 / Select your annual available fund</p>
        <div className="grid grid-cols-2 gap-3">
          {fundOptions.map((f) => (
            <button
              key={f.value}
              onClick={() => onInputChange('availableAnnualFund', f.value)}
              className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left ${
                input.availableAnnualFund === f.value
                  ? 'border-amber-400 shadow-sm'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
              style={{ backgroundColor: input.availableAnnualFund === f.value ? '#fef3c7' : '#faf8f5' }}
            >
              <span className="text-lg mb-1">💰</span>
              <div className="text-stone-800 font-medium text-sm">{f.labelKo}</div>
              <div className="text-stone-400 text-xs">{f.labelEn}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 목표 선택 / Goal selection
  if (step === 'finalGoal') {
    return (
      <div>
        <p className="text-stone-500 text-sm mb-4">한국에서의 최종 목표는? / What is your final goal in Korea?</p>
        <div className="grid grid-cols-2 gap-4">
          {goalOptions.map((g) => (
            <button
              key={g.value}
              onClick={() => onInputChange('finalGoal', g.value)}
              className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                input.finalGoal === g.value
                  ? 'border-amber-400 shadow-md scale-105'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
              style={{ backgroundColor: input.finalGoal === g.value ? '#fef3c7' : '#faf8f5' }}
            >
              <span className="text-4xl mb-3">{g.emoji}</span>
              <div className="text-stone-800 font-semibold text-sm mb-1">{g.labelKo}</div>
              <div className="text-stone-400 text-xs text-center">{g.descKo}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 우선순위 선택 / Priority selection
  if (step === 'priorityPreference') {
    return (
      <div>
        <p className="text-stone-500 text-sm mb-4">가장 중요한 것을 선택하세요 / Select your top priority</p>
        <div className="grid grid-cols-2 gap-4">
          {priorityOptions.map((p) => (
            <button
              key={p.value}
              onClick={() => onInputChange('priorityPreference', p.value)}
              className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                input.priorityPreference === p.value
                  ? 'border-amber-400 shadow-md scale-105'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
              style={{ backgroundColor: input.priorityPreference === p.value ? '#fef3c7' : '#faf8f5' }}
            >
              <span className="text-3xl mb-3">{p.emoji}</span>
              <div className="text-stone-800 font-semibold text-sm mb-1">{p.labelKo}</div>
              <div className="text-stone-400 text-xs text-center">{p.descKo}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ============================================================
// 미니 평면도 컴포넌트 (입력 중 진행 미리보기) / Mini floor plan during input
// ============================================================

interface MiniFloorPlanProps {
  currentStepIndex: number;
  input: DiagnosisInput;
}

function MiniFloorPlan({ currentStepIndex, input }: MiniFloorPlanProps) {
  // 단계별로 배치되는 가구 / Furniture placed per step
  const furnitureItems = [
    { icon: '🛋️', label: '국적', x: 20, y: 25, placed: currentStepIndex >= 0 },
    { icon: '🪑', label: '나이', x: 55, y: 20, placed: currentStepIndex >= 1 },
    { icon: '📚', label: '학력', x: 70, y: 55, placed: currentStepIndex >= 2 },
    { icon: '🪴', label: '자금', x: 20, y: 65, placed: currentStepIndex >= 3 },
    { icon: '💡', label: '목표', x: 45, y: 60, placed: currentStepIndex >= 4 },
    { icon: '🧶', label: '우선순위', x: 35, y: 40, placed: currentStepIndex >= 5 },
  ];

  return (
    <div className="sticky top-24">
      <div className="text-xs uppercase tracking-widest text-stone-400 mb-3 font-medium">
        평면도 / Floor Plan
      </div>
      {/* 방 컨테이너 / Room container */}
      <div
        className="relative rounded-2xl overflow-hidden border-2 border-stone-300"
        style={{ height: '280px', backgroundColor: '#f0e8d8' }}
      >
        {/* 방 벽 / Room walls */}
        <div className="absolute inset-3 border-2 border-stone-400 rounded-xl">
          {/* 바닥 패턴 / Floor pattern */}
          <div
            className="absolute inset-0 rounded-xl opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #a07850 0, #a07850 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #a07850 0, #a07850 1px, transparent 1px, transparent 20px)',
            }}
          />

          {/* 가구 배치 / Furniture placement */}
          {furnitureItems.map((item, i) => (
            <div
              key={i}
              className="absolute transition-all duration-500"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                opacity: item.placed ? 1 : 0.2,
                transform: item.placed ? 'scale(1)' : 'scale(0.5)',
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-xl">{item.icon}</span>
                {item.placed && (
                  <span className="text-xs text-stone-600 mt-0.5 font-medium" style={{ fontSize: '9px' }}>
                    {item.label}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* 진행률 텍스트 / Progress text */}
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <span className="text-xs text-stone-500">
              {currentStepIndex + 1}/{STEPS.length} 배치됨
            </span>
          </div>
        </div>
      </div>

      {/* 무드보드 팔레트 / Moodboard palette */}
      <div className="mt-4">
        <div className="text-xs uppercase tracking-widest text-stone-400 mb-2 font-medium">무드 / Mood</div>
        <div className="flex gap-2">
          {['#c8a882', '#e8d5bf', '#8b7355', '#d4c4a8', '#f5f0ea'].map((color, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full border border-stone-300 shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <p className="text-xs text-stone-500 mt-2">웜 베이지 + 모던 그레이 / Warm Beige + Modern Gray</p>
      </div>
    </div>
  );
}

// ============================================================
// 결과 화면 / Result screen
// ============================================================

interface ResultScreenProps {
  pathways: CompatPathway[];
  selectedPathway: CompatPathway | null;
  onSelectPathway: (p: CompatPathway) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  savedIds: Set<string>;
  onToggleSaved: (id: string) => void;
  expandedMilestone: number | null;
  onExpandMilestone: (i: number | null) => void;
  onReset: () => void;
  input: DiagnosisInput;
}

function ResultScreen({
  pathways,
  selectedPathway,
  onSelectPathway,
  viewMode,
  onViewModeChange,
  savedIds,
  onToggleSaved,
  expandedMilestone,
  onExpandMilestone,
  onReset,
  input,
}: ResultScreenProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0ea' }}>
      {/* 상단 헤더 / Top header */}
      <header className="sticky top-0 z-50 border-b border-stone-200 shadow-sm" style={{ backgroundColor: '#f5f0ea' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ backgroundColor: '#c8a882' }}>
              <Home className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-stone-800 font-semibold text-sm tracking-widest uppercase">Visa Planner</span>
              <span className="text-stone-400 text-xs ml-2">— 완성 렌더링 / Final Render</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* 뷰 모드 전환 / View mode toggle */}
            <div className="flex rounded-lg overflow-hidden border border-stone-300" style={{ backgroundColor: '#f0ebe3' }}>
              {([
                { mode: 'floorplan' as ViewMode, icon: LayoutGrid, label: '평면도' },
                { mode: '3d' as ViewMode, icon: Layers, label: '3D 뷰' },
                { mode: 'moodboard' as ViewMode, icon: Palette, label: '무드보드' },
              ] as { mode: ViewMode; icon: typeof LayoutGrid; label: string }[]).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs transition-all ${
                    viewMode === mode
                      ? 'text-white'
                      : 'text-stone-600 hover:text-stone-800'
                  }`}
                  style={{ backgroundColor: viewMode === mode ? '#c8a882' : 'transparent' }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 text-stone-600 text-xs hover:bg-stone-100 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              다시 / Reset
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 결과 요약 배너 / Result summary banner */}
        <div className="rounded-2xl p-6 mb-8 border border-amber-200 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #f5f0ea 50%, #fde68a 100%)' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5" style={{ color: '#c8a882' }} />
              <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Interior Render Complete</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-800 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              {pathways.length}개의 비자 공간이 완성되었습니다
            </h1>
            <p className="text-stone-600 text-sm">
              {pathways.length} visa pathways rendered as your personal space / 나만의 비자 경로 인테리어
            </p>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-5xl mb-1">🏠</div>
            <div className="text-xs text-stone-500">총 {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 분석</div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* 좌측: 경로 카탈로그 / Left: Pathway catalog */}
          <div className="w-72 shrink-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-widest">
                가구 카탈로그 / Catalog
              </h2>
              <span className="text-xs text-stone-400">{pathways.length}개 경로</span>
            </div>

            <div className="space-y-3">
              {pathways.map((pathway, i) => {
                const colors = ROOM_COLORS[i % ROOM_COLORS.length];
                const isSelected = selectedPathway?.id === pathway.id;
                const isSaved = savedIds.has(pathway.id);

                return (
                  <button
                    key={pathway.id}
                    onClick={() => onSelectPathway(pathway)}
                    className={`w-full text-left rounded-xl border-2 overflow-hidden transition-all hover:shadow-md ${
                      isSelected ? 'border-amber-400 shadow-lg scale-100' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* 카드 상단 컬러바 / Card top color bar */}
                    <div className={`h-1.5 ${colors.accent}`} />
                    <div className={`p-4 ${isSelected ? 'bg-amber-50' : 'bg-white'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-stone-800 font-semibold text-sm leading-tight">
                            {pathway.nameKo}
                          </div>
                          <div className="text-stone-400 text-xs mt-0.5">{pathway.nameEn}</div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleSaved(pathway.id); }}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Heart
                            className="w-4 h-4"
                            style={{ color: isSaved ? '#ef4444' : '#d1d5db' }}
                            fill={isSaved ? '#ef4444' : 'none'}
                          />
                        </button>
                      </div>

                      {/* 점수 + 기간 / Score + duration */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getScoreColor(pathway.finalScore) }}
                          />
                          <span className="text-xs text-stone-600 font-medium">{pathway.feasibilityLabel}</span>
                        </div>
                        <div className="flex items-center gap-1 text-stone-400">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{pathway.estimatedMonths}개월</span>
                        </div>
                      </div>

                      {/* 비자 체인 태그 / Visa chain tags */}
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).slice(0, 3).map((v, vi) => (
                          <span
                            key={vi}
                            className="px-1.5 py-0.5 rounded text-xs font-mono"
                            style={{ backgroundColor: '#f0e8d8', color: '#8b7355' }}
                          >
                            {v.code}
                          </span>
                        ))}
                        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length > 3 && (
                          <span className="text-xs text-stone-400">+{(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 3}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 우측: 메인 렌더링 / Right: Main rendering */}
          <div className="flex-1 min-w-0">
            {selectedPathway ? (
              <>
                {/* 뷰 모드별 렌더링 / View mode rendering */}
                {viewMode === 'floorplan' && (
                  <FloorPlanView pathway={selectedPathway} />
                )}
                {viewMode === '3d' && (
                  <ThreeDView pathway={selectedPathway} />
                )}
                {viewMode === 'moodboard' && (
                  <MoodboardView pathway={selectedPathway} />
                )}

                {/* 마일스톤 섹션 / Milestone section */}
                <div className="mt-6 rounded-2xl overflow-hidden border border-stone-200" style={{ backgroundColor: '#faf8f5' }}>
                  <div className="px-6 py-4 border-b border-stone-200 flex items-center gap-2">
                    <Map className="w-4 h-4" style={{ color: '#c8a882' }} />
                    <h3 className="text-stone-800 font-semibold text-sm uppercase tracking-widest">
                      시공 일정 / Construction Timeline
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {selectedPathway.milestones.map((m, mi) => (
                        <div key={mi}>
                          <button
                            onClick={() => onExpandMilestone(expandedMilestone === mi ? null : mi)}
                            className="w-full flex items-center gap-4 text-left hover:bg-amber-50 rounded-xl p-3 transition-all"
                          >
                            {/* 타임라인 점 / Timeline dot */}
                            <div className="flex flex-col items-center shrink-0">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: '#c8a882' }}
                              >
                                {m.order}
                              </div>
                              {mi < selectedPathway.milestones.length - 1 && (
                                <div className="w-0.5 h-4 mt-1" style={{ backgroundColor: '#e8d5bf' }} />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-stone-800 font-medium text-sm">{m.nameKo}</span>
                                {m.visaStatus && m.visaStatus !== 'none' && (
                                  <span
                                    className="px-2 py-0.5 rounded text-xs font-mono"
                                    style={{ backgroundColor: '#f0e8d8', color: '#8b7355' }}
                                  >
                                    {m.visaStatus}
                                  </span>
                                )}
                              </div>
                              <div className="text-stone-400 text-xs">
                                {m.monthFromStart}개월째 / Month {m.monthFromStart}
                                {m.canWorkPartTime && (
                                  <span className="ml-2 text-green-600">아르바이트 가능 ✓</span>
                                )}
                              </div>
                            </div>

                            <ChevronRight
                              className={`w-4 h-4 text-stone-400 transition-transform shrink-0 ${
                                expandedMilestone === mi ? 'rotate-90' : ''
                              }`}
                            />
                          </button>

                          {/* 마일스톤 상세 / Milestone detail */}
                          {expandedMilestone === mi && (
                            <div className="ml-12 mt-2 p-3 rounded-xl border border-amber-200 bg-amber-50">
                              <div className="text-xs text-stone-600 space-y-1">
                                <div><strong>요건:</strong> {Array.isArray(m.requirements) ? m.requirements.join(', ') : m.requirements}</div>
                                {m.estimatedMonthlyIncome > 0 && (
                                  <div><strong>예상 수입:</strong> 월 {m.estimatedMonthlyIncome}만원</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 다음 단계 / Next steps */}
                {selectedPathway.nextSteps.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-stone-200 p-6" style={{ backgroundColor: '#faf8f5' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-4 h-4" style={{ color: '#c8a882' }} />
                      <h3 className="text-stone-800 font-semibold text-sm uppercase tracking-widest">
                        즉시 행동 / Next Steps
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {selectedPathway.nextSteps.map((ns, nsi) => (
                        <div key={nsi} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                          <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#c8a882' }} />
                          <div>
                            <div className="text-stone-800 font-medium text-sm">{ns.nameKo}</div>
                            <div className="text-stone-500 text-xs mt-0.5">{ns.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-64 rounded-2xl border-2 border-dashed border-stone-300">
                <div className="text-center text-stone-400">
                  <Home className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">좌측에서 경로를 선택하세요 / Select a pathway on the left</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 평면도 뷰 / Floor plan view
// ============================================================

interface PathwayViewProps {
  pathway: CompatPathway;
}

function FloorPlanView({ pathway }: PathwayViewProps) {
  // 비자 체인 → 방 배치 / Visa chain → room layout
  const visas = pathway.visaChain;

  return (
    <div className="rounded-2xl overflow-hidden border border-stone-300" style={{ backgroundColor: '#e8ddd0' }}>
      {/* 평면도 헤더 / Floor plan header */}
      <div className="px-6 py-4 border-b border-stone-300 flex items-center justify-between" style={{ backgroundColor: '#d4c4a8' }}>
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-stone-600" />
          <span className="text-stone-700 font-semibold text-sm uppercase tracking-widest">
            {pathway.nameKo} — 평면도
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span>1 : 100</span>
          <ZoomIn className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 평면도 캔버스 / Floor plan canvas */}
      <div className="relative p-6" style={{ minHeight: '320px' }}>
        {/* 격자 패턴 / Grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #a07850 0, #a07850 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, #a07850 0, #a07850 1px, transparent 1px, transparent 30px)',
          }}
        />

        {/* 방 배치 (비자 단계별) / Room layout per visa step */}
        <div className="relative z-10 flex flex-col gap-0">
          {visas.map((visa, vi) => {
            const milestone = pathway.milestones[vi];
            const roomColors = ['#f5e6d3', '#ede0d0', '#e8d8c8', '#f0e4d0', '#e4d4c0'];
            const roomColor = roomColors[vi % roomColors.length];

            return (
              <div key={vi} className="flex items-stretch">
                {/* 방 (비자 유형) / Room (visa type) */}
                <div
                  className="relative rounded-lg border-2 border-stone-400 p-4 flex-1 transition-all hover:shadow-md"
                  style={{ backgroundColor: roomColor, minHeight: '80px' }}
                >
                  {/* 방 번호 + 비자 코드 / Room number + visa code */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-sm flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: '#a07850' }}
                      >
                        {vi + 1}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                        style={{ backgroundColor: '#8b7355', color: 'white' }}
                      >
                        {visa.code}
                      </span>
                    </div>
                    {milestone?.canWorkPartTime && (
                      <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        근로 가능
                      </span>
                    )}
                  </div>

                  {/* 방 이름 (마일스톤) / Room name (milestone) */}
                  <div className="text-stone-700 font-medium text-sm mb-1">
                    {milestone?.nameKo || visa.name}
                  </div>
                  {milestone && (
                    <div className="text-stone-500 text-xs">
                      {milestone.monthFromStart}개월째
                      {milestone.estimatedMonthlyIncome > 0 && ` • 월 ${milestone.estimatedMonthlyIncome}만원`}
                    </div>
                  )}

                  {/* 방 장식 아이콘 / Room decorative icons */}
                  <div className="absolute bottom-3 right-3 flex gap-1 opacity-40">
                    <span className="text-lg">
                      {vi === 0 ? '🛋️' : vi === 1 ? '📚' : vi === 2 ? '💡' : vi === 3 ? '🪴' : '⭐'}
                    </span>
                  </div>
                </div>

                {/* 통로 화살표 / Corridor arrow */}
                {vi < visas.length - 1 && (
                  <div className="flex items-center justify-center w-8 shrink-0">
                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-4 bg-stone-400" />
                      <ChevronRight className="w-4 h-4 text-stone-500 rotate-90" />
                      <div className="w-0.5 h-4 bg-stone-400" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 범례 / Legend */}
        <div className="relative z-10 mt-4 flex flex-wrap gap-4 pt-4 border-t border-stone-400 border-opacity-50">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm border-2 border-stone-400" style={{ backgroundColor: '#f5e6d3' }} />
            <span className="text-xs text-stone-500">비자 단계 / Visa Stage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-stone-500">근로 가능 / Work Allowed</span>
          </div>
          <div className="text-xs text-stone-500 ml-auto">
            총 {pathway.estimatedMonths}개월 / {pathway.estimatedCostWon > 0 ? `${pathway.estimatedCostWon.toLocaleString()}만원` : '무료'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 3D 뷰 (공간감 있는 카드) / 3D View
// ============================================================

function ThreeDView({ pathway }: PathwayViewProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-stone-300" style={{ backgroundColor: '#1a1612' }}>
      {/* 3D 헤더 / 3D header */}
      <div className="px-6 py-4 border-b border-stone-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="text-amber-200 font-semibold text-sm uppercase tracking-widest">
            {pathway.nameKo} — 3D 투시도
          </span>
        </div>
        <div className="text-xs text-stone-500">Interior Perspective</div>
      </div>

      {/* 3D 공간 시뮬레이션 / 3D space simulation */}
      <div className="p-8">
        {/* 원근법 방 / Perspective room */}
        <div
          className="relative mx-auto rounded-xl overflow-hidden"
          style={{
            height: '280px',
            background: 'linear-gradient(180deg, #2d261e 0%, #3d3228 40%, #c8a882 40%, #f0e8d8 100%)',
            maxWidth: '500px',
          }}
        >
          {/* 천장 조명 / Ceiling light */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-amber-300 shadow-lg" style={{ boxShadow: '0 0 20px 8px rgba(251,191,36,0.4)' }} />

          {/* 경로 카드들 (투시 효과) / Pathway cards with perspective */}
          <div className="absolute bottom-6 left-6 right-6 flex gap-3">
            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((visa, vi) => (
              <div
                key={vi}
                className="flex-1 rounded-lg p-3 text-center border border-amber-200"
                style={{
                  backgroundColor: 'rgba(245, 230, 210, 0.9)',
                  transform: `perspective(400px) rotateX(${5 + vi}deg)`,
                  marginTop: `${vi * 4}px`,
                }}
              >
                <div
                  className="text-xs font-mono font-bold mb-1"
                  style={{ color: '#8b7355' }}
                >
                  {visa.code}
                </div>
                <div className="text-stone-600 text-xs">{pathway.milestones[vi]?.nameKo || ''}</div>
              </div>
            ))}
          </div>

          {/* 벽 장식 / Wall decoration */}
          <div className="absolute top-12 left-8 text-4xl opacity-20">🖼️</div>
          <div className="absolute top-12 right-8 text-2xl opacity-20">🪴</div>
        </div>

        {/* 점수 패널 / Score panel */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: '실현가능성', labelEn: 'Feasibility', value: `${getFeasibilityEmoji(pathway.feasibilityLabel)} ${pathway.feasibilityLabel}` },
            { label: '소요 기간', labelEn: 'Duration', value: `${pathway.estimatedMonths}개월` },
            { label: '예상 비용', labelEn: 'Est. Cost', value: pathway.estimatedCostWon > 0 ? `${pathway.estimatedCostWon}만원` : '무료' },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-4 text-center border border-stone-700"
              style={{ backgroundColor: '#2d261e' }}
            >
              <div className="text-amber-400 font-bold text-lg mb-1">{item.value}</div>
              <div className="text-stone-400 text-xs">{item.label}</div>
              <div className="text-stone-600 text-xs">{item.labelEn}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 무드보드 뷰 / Moodboard view
// ============================================================

function MoodboardView({ pathway }: PathwayViewProps) {
  const moodColors = ['#c8a882', '#e8d5bf', '#8b7355', '#d4c4a8', '#f5f0ea', '#a07850', '#f0e4d0', '#6b5540'];

  return (
    <div className="rounded-2xl overflow-hidden border border-stone-300" style={{ backgroundColor: '#faf8f5' }}>
      {/* 무드보드 헤더 / Moodboard header */}
      <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between" style={{ backgroundColor: '#f0ebe3' }}>
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" style={{ color: '#c8a882' }} />
          <span className="text-stone-700 font-semibold text-sm uppercase tracking-widest">
            {pathway.nameKo} — 무드보드
          </span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 transition-colors">
            <Share2 className="w-3.5 h-3.5" />공유
          </button>
          <button className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 transition-colors">
            <Download className="w-3.5 h-3.5" />저장
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* 컬러 팔레트 / Color palette */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-stone-400 mb-3 font-medium">컬러 팔레트 / Colour Palette</div>
          <div className="flex gap-2">
            {moodColors.map((color, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full aspect-square rounded-lg border border-stone-200 shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-stone-400 font-mono" style={{ fontSize: '8px' }}>{color}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 텍스처 + 키워드 / Texture + keywords */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* 텍스처 카드 / Texture cards */}
          <div>
            <div className="text-xs uppercase tracking-widest text-stone-400 mb-3 font-medium">재질 / Materials</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: '원목', icon: '🪵', color: '#c8a882' },
                { name: '린넨', icon: '🧵', color: '#e8d5bf' },
                { name: '대리석', icon: '🪨', color: '#d4d0cc' },
                { name: '황동', icon: '✨', color: '#b8972c' },
                { name: '도자기', icon: '🏺', color: '#d4c4a8' },
                { name: '면직', icon: '🌿', color: '#a8c4a0' },
              ].map((mat, mi) => (
                <div
                  key={mi}
                  className="aspect-square rounded-lg flex flex-col items-center justify-center border border-stone-200"
                  style={{ backgroundColor: mat.color + '33' }}
                >
                  <span className="text-lg">{mat.icon}</span>
                  <span className="text-xs text-stone-600 mt-0.5">{mat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 비자 정보 카드 / Visa info card */}
          <div>
            <div className="text-xs uppercase tracking-widest text-stone-400 mb-3 font-medium">경로 정보 / Path Info</div>
            <div className="rounded-xl border border-stone-200 overflow-hidden" style={{ backgroundColor: '#f5f0ea' }}>
              <div className="h-2" style={{ backgroundColor: '#c8a882' }} />
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">비자 경로</span>
                  <span className="text-stone-800 font-medium font-mono text-xs">{pathway.visaChainStr}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">소요 기간</span>
                  <span className="text-stone-800 font-medium">{pathway.estimatedMonths}개월</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">예상 비용</span>
                  <span className="text-stone-800 font-medium">
                    {pathway.estimatedCostWon > 0 ? `${pathway.estimatedCostWon.toLocaleString()}만원` : '무료'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">가능성</span>
                  <span className="font-medium" style={{ color: getScoreColor(pathway.finalScore) }}>
                    {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 비자 체인 무드보드 카드 / Visa chain moodboard cards */}
        <div>
          <div className="text-xs uppercase tracking-widest text-stone-400 mb-3 font-medium">경로 무드 / Pathway Mood</div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((visa, vi) => {
              const bgColors = ['#f5e6d3', '#ede0d0', '#e8d8c8', '#f0e4d0', '#e4d4c0'];
              return (
                <div
                  key={vi}
                  className="shrink-0 w-36 rounded-xl border border-stone-200 overflow-hidden"
                  style={{ backgroundColor: bgColors[vi % bgColors.length] }}
                >
                  {/* 방 일러스트 / Room illustration */}
                  <div
                    className="h-20 flex items-center justify-center text-4xl"
                    style={{ backgroundColor: bgColors[vi % bgColors.length] + 'cc' }}
                  >
                    {vi === 0 ? '🛋️' : vi === 1 ? '📚' : vi === 2 ? '💡' : vi === 3 ? '🪴' : '⭐'}
                  </div>
                  <div className="p-3">
                    <div
                      className="text-xs font-mono font-bold mb-1"
                      style={{ color: '#8b7355' }}
                    >
                      {visa.code}
                    </div>
                    <div className="text-stone-600 text-xs leading-tight">
                      {pathway.milestones[vi]?.nameKo || visa.name}
                    </div>
                    <div className="text-stone-400 text-xs mt-1">
                      {pathway.milestones[vi]?.monthFromStart}개월
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 노트 / Note */}
        {pathway.note && (
          <div className="mt-4 p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-start gap-2">
            <BookOpen className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#c8a882' }} />
            <p className="text-stone-600 text-sm">{pathway.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
