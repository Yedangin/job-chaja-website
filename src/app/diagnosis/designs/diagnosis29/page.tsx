'use client';

// 탐험 지도 비자 진단 페이지 / Explorer Map Visa Diagnosis Page
// Design #29: 보물 지도를 따라가며 숨겨진 비자 경로를 발견
// Design #29: Discover hidden visa routes by following a treasure map

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
  MapPin,
  Compass,
  Map,
  Navigation,
  Star,
  Trophy,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Flag,
  Anchor,
  Mountain,
  Gem,
  Scroll,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Circle,
  ArrowRight,
  Globe,
  BookOpen,
  Home,
  Briefcase,
} from 'lucide-react';

// ============================================================
// 입력 단계 타입 / Input step type
// ============================================================
type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference' | 'result';

// ============================================================
// 지도 핀 좌표 (시각적 배치) / Map pin coordinates (visual layout)
// ============================================================
const MAP_PINS: Record<Step, { x: number; y: number; label: string; labelKo: string }> = {
  nationality: { x: 12, y: 75, label: 'Origin', labelKo: '출발지' },
  age: { x: 25, y: 50, label: 'Age Ridge', labelKo: '나이 능선' },
  educationLevel: { x: 42, y: 35, label: 'Scholar Peak', labelKo: '학력 봉우리' },
  availableAnnualFund: { x: 58, y: 55, label: 'Treasure Cove', labelKo: '자금 항구' },
  finalGoal: { x: 73, y: 32, label: 'Goal Castle', labelKo: '목표 성' },
  priorityPreference: { x: 88, y: 55, label: 'Priority Beacon', labelKo: '우선순위 등대' },
  result: { x: 95, y: 30, label: 'Treasure X', labelKo: '보물 X' },
};

// 단계 순서 / Step order
const STEPS: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'];

// 각 단계의 지형 아이콘 / Terrain icon per step
const STEP_ICONS: Record<Step, React.ReactNode> = {
  nationality: <Globe size={20} />,
  age: <Mountain size={20} />,
  educationLevel: <BookOpen size={20} />,
  availableAnnualFund: <Anchor size={20} />,
  finalGoal: <Flag size={20} />,
  priorityPreference: <Compass size={20} />,
  result: <Gem size={20} />,
};

// 단계 제목 / Step titles
const STEP_TITLES: Record<Step, { ko: string; en: string }> = {
  nationality: { ko: '출신 국가를 핀으로 표시하세요', en: 'Mark your country of origin' },
  age: { ko: '나이 능선을 선택하세요', en: 'Choose your age ridge' },
  educationLevel: { ko: '학력 봉우리를 정복하세요', en: 'Conquer your education peak' },
  availableAnnualFund: { ko: '자금 항구를 설정하세요', en: 'Set your fund harbour' },
  finalGoal: { ko: '목표 성을 선택하세요', en: 'Choose your goal castle' },
  priorityPreference: { ko: '우선순위 등대를 켜세요', en: 'Light your priority beacon' },
  result: { ko: '탐험 완료 — 보물 발견!', en: 'Exploration complete — treasure found!' },
};

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function Diagnosis29Page() {
  // 현재 단계 / Current step
  const [currentStep, setCurrentStep] = useState<Step>('nationality');
  // 사용자 입력 / User input
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // 결과 / Result
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  // 선택된 경로 / Selected pathway
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  // 경로 확장 / Expanded pathway details
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null);
  // 나이 입력 임시값 / Age input temp value
  const [ageInput, setAgeInput] = useState('');

  // 완료된 단계 인덱스 / Completed step index
  const completedStepIndex = STEPS.indexOf(currentStep);

  // 경로 선 그리기를 위한 진행도 / Path drawing progress
  const pathProgress = currentStep === 'result' ? 100 : (completedStepIndex / (STEPS.length - 1)) * 100;

  // 단계 진행 / Advance step
  function advanceStep(step: Step, value: string | number) {
    const updated = { ...input, [step]: value } as Partial<DiagnosisInput>;
    setInput(updated);

    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1]);
    } else {
      // 결과 계산 / Calculate result
      setResult(mockDiagnosisResult);
      setCurrentStep('result');
    }
  }

  // 처음으로 / Reset to start
  function resetDiagnosis() {
    setCurrentStep('nationality');
    setInput({});
    setResult(null);
    setSelectedPathway(null);
    setExpandedPathway(null);
    setAgeInput('');
  }

  // 이전 단계로 / Go back
  function goBack() {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1]);
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #2C1810 0%, #1a2744 50%, #0f1a2e 100%)' }}
    >
      {/* 헤더 / Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-amber-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg">
            <Compass className="text-amber-900" size={22} />
          </div>
          <div>
            <h1 className="text-amber-300 font-bold text-lg tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
              VISA EXPLORER
            </h1>
            <p className="text-amber-700 text-xs">비자 탐험 지도 · 잡차자</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-amber-600 text-xs">
          <Map size={14} />
          <span>탐험 지도 v29</span>
        </div>
      </header>

      {/* 메인 레이아웃 / Main layout */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">

        {/* 지도 패널 / Map panel */}
        <div className="lg:w-1/2 relative overflow-hidden" style={{ minHeight: '340px' }}>
          {/* 빈티지 지도 배경 / Vintage map background */}
          <MapBackground />

          {/* 경로 선 / Path line */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* 배경 경로 (회색) / Background path (gray) */}
            <PathLine opacity={0.3} color="#8B7355" />
            {/* 진행 경로 (금색) / Progress path (gold) */}
            <PathLine opacity={1} color="#F59E0B" progress={pathProgress} />
          </svg>

          {/* 지도 핀들 / Map pins */}
          {(Object.entries(MAP_PINS) as [Step, typeof MAP_PINS[Step]][]).map(([step, pin]) => {
            if (step === 'result') return null;
            // 'result' 단계가 아닌 step만 여기에 도달 / Only non-result steps reach here
            const nonResultStep = step as Exclude<Step, 'result'>;
            const stepIdx = STEPS.indexOf(nonResultStep);
            const activeStep = currentStep === 'result' ? 'priorityPreference' : currentStep;
            const curIdx = STEPS.indexOf(activeStep as Exclude<Step, 'result'>);
            const isCompleted = stepIdx < curIdx || currentStep === 'result';
            const isCurrent = currentStep !== 'result' && (nonResultStep as string) === (currentStep as string);
            const isLocked = stepIdx > curIdx && currentStep !== 'result';

            return (
              <MapPinMarker
                key={step}
                pin={pin}
                step={step}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                isLocked={isLocked}
                icon={STEP_ICONS[step]}
              />
            );
          })}

          {/* 보물 X 마커 / Treasure X marker */}
          <div
            className="absolute"
            style={{ left: `${MAP_PINS.result.x}%`, top: `${MAP_PINS.result.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
                currentStep === 'result'
                  ? 'bg-amber-400 border-amber-300 shadow-lg shadow-amber-500/60 scale-110'
                  : 'bg-amber-900/40 border-amber-700/40'
              }`}
            >
              <span className="text-xl">{currentStep === 'result' ? '💎' : '✕'}</span>
            </div>
            <p className="text-center text-amber-400 text-xs mt-1 font-bold whitespace-nowrap">
              {MAP_PINS.result.labelKo}
            </p>
          </div>

          {/* 미니맵 범례 / Mini-map legend */}
          <div className="absolute bottom-4 left-4 bg-amber-950/80 border border-amber-800/60 rounded-lg p-3 text-xs backdrop-blur-sm">
            <p className="text-amber-400 font-bold mb-2">📍 범례</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-amber-300">완료 지점</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-300">현재 위치</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-900/60 border border-amber-700/40" />
                <span className="text-amber-300">미탐험</span>
              </div>
            </div>
          </div>

          {/* 나침반 / Compass rose */}
          <div className="absolute top-4 right-4 opacity-60">
            <div className="w-12 h-12 relative flex items-center justify-center">
              <Compass className="text-amber-400 animate-spin" size={40} style={{ animationDuration: '20s' }} />
            </div>
          </div>
        </div>

        {/* 입력/결과 패널 / Input/Result panel */}
        <div className="lg:w-1/2 flex flex-col">
          {currentStep !== 'result' ? (
            <InputPanel
              currentStep={currentStep}
              input={input}
              ageInput={ageInput}
              setAgeInput={setAgeInput}
              onAdvance={advanceStep}
              onBack={goBack}
              completedStepIndex={completedStepIndex}
            />
          ) : (
            <ResultPanel
              result={result!}
              pathways={mockPathways}
              selectedPathway={selectedPathway}
              setSelectedPathway={setSelectedPathway}
              expandedPathway={expandedPathway}
              setExpandedPathway={setExpandedPathway}
              onReset={resetDiagnosis}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 빈티지 지도 배경 / Vintage map background
// ============================================================
function MapBackground() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #3D2B1F 0%, #2C3E6B 60%, #1a2744 100%)' }}>
      {/* 지형 텍스처 레이어 / Terrain texture layer */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {/* 등고선 / Contour lines */}
        {[20, 40, 60, 80, 100, 120, 140].map((r, i) => (
          <ellipse key={i} cx="180" cy="130" rx={r + 20} ry={r} fill="none" stroke="#F59E0B" strokeWidth="0.5" opacity={0.6} />
        ))}
        {[15, 30, 50].map((r, i) => (
          <ellipse key={i} cx="320" cy="80" rx={r} ry={r * 0.7} fill="none" stroke="#F59E0B" strokeWidth="0.5" opacity={0.5} />
        ))}
        {/* 격자 / Grid */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 30} x2="400" y2={i * 30} stroke="#8B7355" strokeWidth="0.3" opacity={0.4} />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="300" stroke="#8B7355" strokeWidth="0.3" opacity={0.4} />
        ))}
        {/* 바다 물결 / Sea waves */}
        {[0, 10, 20].map((offset, i) => (
          <path key={i} d={`M0,${220 + offset} Q100,${210 + offset} 200,${225 + offset} Q300,${240 + offset} 400,${220 + offset}`}
            fill="none" stroke="#1a3a6b" strokeWidth="1" opacity={0.3} />
        ))}
      </svg>
      {/* 세피아 오버레이 / Sepia overlay */}
      <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #2C1810 100%)' }} />
    </div>
  );
}

// ============================================================
// 경로 선 SVG / Path line SVG
// ============================================================
function PathLine({ opacity, color, progress = 100 }: { opacity: number; color: string; progress?: number }) {
  // 핀 좌표로 경로 포인트 생성 / Generate path points from pin coordinates
  const points = STEPS.map(s => MAP_PINS[s]);
  const totalLen = points.length - 1;
  const visibleSegments = Math.floor((progress / 100) * totalLen);
  const partialFraction = ((progress / 100) * totalLen) - visibleSegments;

  let d = '';
  for (let i = 0; i < Math.min(visibleSegments + 1, points.length - 1); i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const fraction = i < visibleSegments ? 1 : partialFraction;
    const mx = p1.x + (p2.x - p1.x) * fraction;
    const my = p1.y + (p2.y - p1.y) * fraction;
    if (i === 0) {
      d += `M ${p1.x} ${p1.y} `;
    }
    d += `L ${mx} ${my} `;
  }

  // 마지막 핀 → 보물 연결 / Connect last pin → treasure
  if (progress === 100) {
    const last = points[points.length - 1];
    const treasure = MAP_PINS.result;
    d += `L ${treasure.x} ${treasure.y}`;
  }

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="0.8"
      strokeDasharray="2 1"
      opacity={opacity}
      filter={opacity === 1 ? 'url(#glow)' : undefined}
    />
  );
}

// ============================================================
// 지도 핀 마커 / Map pin marker
// ============================================================
function MapPinMarker({
  pin,
  step,
  isCompleted,
  isCurrent,
  isLocked,
  icon,
}: {
  pin: { x: number; y: number; label: string; labelKo: string };
  step: Step;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -100%)' }}
    >
      {/* 핀 마커 / Pin marker */}
      <div
        className={`relative w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
          isCompleted
            ? 'bg-green-500 border-green-300 shadow-md shadow-green-500/50'
            : isCurrent
            ? 'bg-amber-400 border-amber-200 shadow-md shadow-amber-400/60 animate-pulse'
            : 'bg-amber-950/50 border-amber-800/40'
        }`}
      >
        <span className={`${isCompleted ? 'text-white' : isCurrent ? 'text-amber-900' : 'text-amber-700'}`}>
          {isCompleted ? <CheckCircle size={18} /> : icon}
        </span>
      </div>
      {/* 핀 꼬리 / Pin tail */}
      <div
        className={`w-0.5 h-3 ${isCompleted ? 'bg-green-400' : isCurrent ? 'bg-amber-400' : 'bg-amber-800/40'}`}
      />
      {/* 레이블 / Label */}
      <div
        className={`mt-1 px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap ${
          isCompleted
            ? 'bg-green-900/60 text-green-300'
            : isCurrent
            ? 'bg-amber-900/80 text-amber-300'
            : 'bg-amber-950/40 text-amber-700'
        }`}
      >
        {pin.labelKo}
      </div>
    </div>
  );
}

// ============================================================
// 입력 패널 / Input panel
// ============================================================
function InputPanel({
  currentStep,
  input,
  ageInput,
  setAgeInput,
  onAdvance,
  onBack,
  completedStepIndex,
}: {
  currentStep: Step;
  input: Partial<DiagnosisInput>;
  ageInput: string;
  setAgeInput: (v: string) => void;
  onAdvance: (step: Step, value: string | number) => void;
  onBack: () => void;
  completedStepIndex: number;
}) {
  return (
    <div className="flex flex-col h-full p-6">
      {/* 진행 표시줄 / Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-amber-400">
            {STEP_ICONS[currentStep]}
            <span className="font-bold text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              {STEP_TITLES[currentStep].ko}
            </span>
          </div>
          <span className="text-amber-600 text-xs">{completedStepIndex + 1} / {STEPS.length}</span>
        </div>
        <div className="h-1.5 bg-amber-950/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-br from-amber-400 to-amber-600 rounded-full transition-all duration-500"
            style={{ width: `${((completedStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-amber-700 text-xs mt-1">{STEP_TITLES[currentStep].en}</p>
      </div>

      {/* 단계별 입력 / Step input */}
      <div className="flex-1 overflow-y-auto">
        {currentStep === 'nationality' && (
          <NationalityStep onSelect={(v) => onAdvance('nationality', v)} />
        )}
        {currentStep === 'age' && (
          <AgeStep ageInput={ageInput} setAgeInput={setAgeInput} onSelect={(v) => onAdvance('age', v)} />
        )}
        {currentStep === 'educationLevel' && (
          <EducationStep onSelect={(v) => onAdvance('educationLevel', v)} />
        )}
        {currentStep === 'availableAnnualFund' && (
          <FundStep onSelect={(v) => onAdvance('availableAnnualFund', v)} />
        )}
        {currentStep === 'finalGoal' && (
          <GoalStep onSelect={(v) => onAdvance('finalGoal', v)} />
        )}
        {currentStep === 'priorityPreference' && (
          <PriorityStep onSelect={(v) => onAdvance('priorityPreference', v)} />
        )}
      </div>

      {/* 뒤로 버튼 / Back button */}
      {completedStepIndex > 0 && (
        <button
          onClick={onBack}
          className="mt-4 text-amber-600 hover:text-amber-400 text-sm flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={14} />
          이전 지점으로
        </button>
      )}
    </div>
  );
}

// ============================================================
// 국가 선택 단계 / Nationality selection step
// ============================================================
function NationalityStep({ onSelect }: { onSelect: (v: string) => void }) {
  return (
    <div>
      <p className="text-amber-500 text-sm mb-4 flex items-center gap-2">
        <MapPin size={14} />
        출발지 핀을 지도에 꽂으세요
      </p>
      <div className="grid grid-cols-2 gap-3">
        {popularCountries.map((c) => (
          <button
            key={c.code}
            onClick={() => onSelect(c.code)}
            className="flex items-center gap-3 p-3 rounded-xl border border-amber-800/40 bg-amber-950/30 hover:bg-amber-900/50 hover:border-amber-600 transition-all duration-200 text-left group"
          >
            <span className="text-2xl shrink-0">{c.flag}</span>
            <div>
              <p className="text-amber-200 font-semibold text-sm group-hover:text-amber-100">{c.nameKo}</p>
              <p className="text-amber-600 text-xs">{c.nameEn}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 나이 입력 단계 / Age input step
// ============================================================
function AgeStep({
  ageInput,
  setAgeInput,
  onSelect,
}: {
  ageInput: string;
  setAgeInput: (v: string) => void;
  onSelect: (v: number) => void;
}) {
  const age = parseInt(ageInput, 10);
  const isValid = !isNaN(age) && age >= 15 && age <= 65;

  return (
    <div className="flex flex-col items-center gap-6 pt-4">
      <div className="relative">
        <Mountain className="text-amber-700 opacity-40 absolute -top-8 left-1/2 -translate-x-1/2" size={64} />
      </div>
      <p className="text-amber-500 text-sm text-center">나이 능선의 높이를 입력하세요 (15~65)</p>
      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        <div className="relative w-full">
          <input
            type="number"
            value={ageInput}
            onChange={(e) => setAgeInput(e.target.value)}
            placeholder="나이 입력..."
            min={15}
            max={65}
            className="w-full px-5 py-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-100 text-2xl text-center font-bold placeholder-amber-800 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
        {isValid && (
          <div className="text-center">
            <div className="text-5xl font-bold text-amber-400 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              {age}
            </div>
            <p className="text-amber-600 text-xs">세</p>
          </div>
        )}
        <button
          disabled={!isValid}
          onClick={() => isValid && onSelect(age)}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isValid
              ? 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-lg shadow-amber-500/30'
              : 'bg-amber-950/40 text-amber-700 cursor-not-allowed'
          }`}
        >
          <Navigation size={16} />
          능선 등록하기
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 학력 선택 단계 / Education selection step
// ============================================================
function EducationStep({ onSelect }: { onSelect: (v: string) => void }) {
  return (
    <div>
      <p className="text-amber-500 text-sm mb-4 flex items-center gap-2">
        <Mountain size={14} />
        학력 봉우리 등급을 선택하세요
      </p>
      <div className="flex flex-col gap-2">
        {educationOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="flex items-center gap-3 p-3 rounded-xl border border-amber-800/40 bg-amber-950/30 hover:bg-amber-900/50 hover:border-amber-600 transition-all duration-200 text-left group"
          >
            <span className="text-xl w-7 text-center shrink-0">{opt.emoji}</span>
            <div>
              <p className="text-amber-200 font-semibold text-sm group-hover:text-amber-100">{opt.labelKo}</p>
              <p className="text-amber-600 text-xs">{opt.labelEn}</p>
            </div>
            <ChevronRight className="text-amber-700 ml-auto shrink-0 group-hover:text-amber-500 transition-colors" size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 자금 선택 단계 / Fund selection step
// ============================================================
function FundStep({ onSelect }: { onSelect: (v: number) => void }) {
  return (
    <div>
      <p className="text-amber-500 text-sm mb-4 flex items-center gap-2">
        <Anchor size={14} />
        자금 항구의 규모를 선택하세요
      </p>
      <div className="flex flex-col gap-2">
        {fundOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="flex items-center gap-3 p-3 rounded-xl border border-amber-800/40 bg-amber-950/30 hover:bg-amber-900/50 hover:border-amber-600 transition-all duration-200 text-left group"
          >
            <DollarSign className="text-amber-600 shrink-0" size={20} />
            <div>
              <p className="text-amber-200 font-semibold text-sm group-hover:text-amber-100">{opt.labelKo}</p>
              <p className="text-amber-600 text-xs">{opt.labelEn}</p>
            </div>
            <ChevronRight className="text-amber-700 ml-auto shrink-0 group-hover:text-amber-500 transition-colors" size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 목표 선택 단계 / Goal selection step
// ============================================================
function GoalStep({ onSelect }: { onSelect: (v: string) => void }) {
  return (
    <div>
      <p className="text-amber-500 text-sm mb-4 flex items-center gap-2">
        <Flag size={14} />
        도달할 목표 성을 선택하세요
      </p>
      <div className="grid grid-cols-2 gap-3">
        {goalOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-amber-800/40 bg-amber-950/30 hover:bg-amber-900/50 hover:border-amber-600 transition-all duration-200 text-center group"
          >
            <span className="text-3xl">{opt.emoji}</span>
            <p className="text-amber-200 font-bold text-sm group-hover:text-amber-100">{opt.labelKo}</p>
            <p className="text-amber-600 text-xs leading-tight">{opt.descKo}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 우선순위 선택 단계 / Priority selection step
// ============================================================
function PriorityStep({ onSelect }: { onSelect: (v: string) => void }) {
  return (
    <div>
      <p className="text-amber-500 text-sm mb-4 flex items-center gap-2">
        <Compass size={14} />
        탐험 방향 등대를 설정하세요
      </p>
      <div className="grid grid-cols-2 gap-3">
        {priorityOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-amber-800/40 bg-amber-950/30 hover:bg-amber-900/50 hover:border-amber-600 transition-all duration-200 text-center group"
          >
            <span className="text-3xl">{opt.emoji}</span>
            <p className="text-amber-200 font-bold text-sm group-hover:text-amber-100">{opt.labelKo}</p>
            <p className="text-amber-600 text-xs">{opt.descKo}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 결과 패널 / Result panel
// ============================================================
function ResultPanel({
  result,
  pathways,
  selectedPathway,
  setSelectedPathway,
  expandedPathway,
  setExpandedPathway,
  onReset,
}: {
  result: DiagnosisResult;
  pathways: CompatPathway[];
  selectedPathway: string | null;
  setSelectedPathway: (v: string | null) => void;
  expandedPathway: string | null;
  setExpandedPathway: (v: string | null) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      {/* 결과 헤더 / Result header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-amber-600/60 bg-amber-950/40 mb-3">
          <Trophy className="text-amber-400" size={24} />
          <div className="text-left">
            <p className="text-amber-300 font-bold text-base" style={{ fontFamily: 'Georgia, serif' }}>탐험 완료!</p>
            <p className="text-amber-600 text-xs">Exploration complete</p>
          </div>
          <Gem className="text-amber-400" size={24} />
        </div>
        <p className="text-amber-400 text-sm">
          {result.meta.totalPathwaysEvaluated}개 경로 분석 중{' '}
          <span className="text-amber-200 font-bold">{pathways.length}개 보물 경로</span> 발견
        </p>
      </div>

      {/* 경로 카드 목록 / Pathway card list */}
      <div className="flex flex-col gap-4">
        {pathways.map((pw, idx) => (
          <PathwayCard
            key={pw.pathwayId}
            pathway={pw}
            rank={idx + 1}
            isSelected={selectedPathway === pw.pathwayId}
            isExpanded={expandedPathway === pw.pathwayId}
            onSelect={() => setSelectedPathway(selectedPathway === pw.pathwayId ? null : pw.pathwayId)}
            onToggleExpand={() => setExpandedPathway(expandedPathway === pw.pathwayId ? null : pw.pathwayId)}
          />
        ))}
      </div>

      {/* 다시 탐험 버튼 / Re-explore button */}
      <button
        onClick={onReset}
        className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl border border-amber-800/60 bg-amber-950/30 hover:bg-amber-900/40 text-amber-500 hover:text-amber-300 transition-all duration-200 text-sm font-semibold"
      >
        <RotateCcw size={16} />
        새 탐험 시작하기 / Start New Exploration
      </button>
    </div>
  );
}

// ============================================================
// 경로 카드 / Pathway card
// ============================================================
function PathwayCard({
  pathway,
  rank,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
}: {
  pathway: CompatPathway;
  rank: number;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
}) {
  const scoreColor = getScoreColor(pathway.finalScore);
  const feasibilityEmoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  // 경로 색상 등급별 테마 / Color theme by rank
  const rankTheme = rank === 1
    ? 'border-amber-500/60 bg-amber-950/50'
    : rank === 2
    ? 'border-blue-800/60 bg-blue-950/30'
    : 'border-amber-900/40 bg-amber-950/20';

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${rankTheme} ${isSelected ? 'shadow-lg shadow-amber-900/40' : ''}`}>
      {/* 카드 헤더 / Card header */}
      <button
        onClick={onSelect}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/5 transition-colors"
      >
        {/* 순위 배지 / Rank badge */}
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          rank === 1 ? 'bg-amber-400 text-amber-950' : rank === 2 ? 'bg-blue-600 text-white' : 'bg-amber-900/60 text-amber-400'
        }`}>
          {rank === 1 ? <Star size={16} /> : rank}
        </div>

        <div className="flex-1 min-w-0">
          {/* 경로명 / Pathway name */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-amber-200 font-bold text-sm">{pathway.nameKo}</span>
            <span className="text-amber-600 text-xs">{feasibilityEmoji} {pathway.feasibilityLabel}</span>
          </div>
          <p className="text-amber-600 text-xs mt-0.5">{pathway.nameEn}</p>

          {/* 비자 체인 / Visa chain */}
          <div className="flex items-center gap-1 flex-wrap mt-2">
            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
              <React.Fragment key={i}>
                <span className="px-2 py-0.5 rounded bg-navy-900/60 border border-blue-800/40 text-blue-300 text-xs font-mono bg-blue-950/60">
                  {v.code}
                </span>
                {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                  <ArrowRight size={10} className="text-amber-700" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 점수 / Score */}
        <div className="shrink-0 text-right">
          <div className="text-2xl font-bold" style={{ color: scoreColor, fontFamily: 'Georgia, serif' }}>
            {pathway.finalScore}
          </div>
          <p className="text-amber-700 text-xs">점수</p>
        </div>
      </button>

      {/* 요약 스탯 / Summary stats */}
      <div className="flex items-center gap-4 px-4 pb-3 text-xs text-amber-600">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>{pathway.estimatedMonths}개월</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign size={12} />
          <span>{pathway.estimatedCostWon > 0 ? `${pathway.estimatedCostWon.toLocaleString()}만원` : '무료'}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp size={12} />
          <span>{pathway.milestones.length}단계</span>
        </div>
      </div>

      {/* 상세 보기 / Detail view toggle */}
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-center gap-1 py-2 border-t border-amber-900/30 text-amber-600 hover:text-amber-400 text-xs transition-colors hover:bg-white/5"
      >
        <Scroll size={12} />
        {isExpanded ? '경로 지도 접기' : '경로 지도 펼치기'}
        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {/* 확장 상세 / Expanded detail */}
      {isExpanded && (
        <div className="border-t border-amber-900/30 p-4">
          {/* 마일스톤 타임라인 / Milestone timeline */}
          <h4 className="text-amber-400 font-bold text-xs mb-3 flex items-center gap-1">
            <Map size={12} />
            탐험 경로 / Exploration Route
          </h4>
          <div className="relative pl-4">
            <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-amber-900/60" />
            {pathway.milestones.map((ms, i) => (
              <div key={i} className="relative mb-3 last:mb-0">
                <div className={`absolute -left-[11px] w-3 h-3 rounded-full border-2 ${
                  ms.type === 'final_goal'
                    ? 'bg-amber-400 border-amber-300'
                    : 'bg-amber-900 border-amber-700'
                }`} />
                <div className="pl-3">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-semibold text-xs">{ms.monthFromStart}개월차</span>
                    {ms.visaStatus && ms.visaStatus !== 'none' && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 text-blue-300 text-xs font-mono">
                        {ms.visaStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-amber-200 text-xs mt-0.5">{ms.nameKo}</p>
                  {ms.canWork && (
                    <p className="text-green-400 text-xs">
                      ✓ 주 {ms.weeklyHours}시간 근로 가능 · 월 {ms.estimatedMonthlyIncome}만원
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 다음 단계 / Next steps */}
          {pathway.nextSteps.length > 0 && (
            <div className="mt-4">
              <h4 className="text-amber-400 font-bold text-xs mb-2 flex items-center gap-1">
                <Flag size={12} />
                첫 번째 발걸음 / First Steps
              </h4>
              <div className="flex flex-col gap-2">
                {pathway.nextSteps.map((ns, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-amber-950/40 border border-amber-900/30">
                    <CheckCircle size={12} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-amber-300 text-xs font-semibold">{ns.nameKo}</p>
                      <p className="text-amber-600 text-xs">{ns.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 메모 / Note */}
          {pathway.note && (
            <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-amber-950/30 border border-amber-900/20">
              <Scroll size={12} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-amber-600 text-xs italic">{pathway.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
