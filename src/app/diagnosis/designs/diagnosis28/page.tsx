'use client';

// 레이싱 트랙 진단 페이지 / Racing Track Diagnosis Page
// Design #28: F1 레이싱 트랙 컨셉으로 비자 진단 경험 제공
// Design #28: F1 racing track concept for visa diagnosis experience

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
  Flag,
  Gauge,
  Trophy,
  Timer,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Zap,
  MapPin,
  Star,
  AlertCircle,
  CheckCircle,
  Circle,
  ArrowRight,
  RotateCcw,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
} from 'lucide-react';

// 진단 단계 타입 / Diagnosis step type
type DiagnosisStep =
  | 'nationality'
  | 'age'
  | 'educationLevel'
  | 'availableAnnualFund'
  | 'finalGoal'
  | 'priorityPreference'
  | 'result';

// 체크포인트 순서 / Checkpoint order
const STEPS: DiagnosisStep[] = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
];

// 체크포인트 레이블 / Checkpoint labels
const STEP_LABELS: Record<DiagnosisStep, { ko: string; en: string; icon: string }> = {
  nationality: { ko: '국적', en: 'Nationality', icon: '🏁' },
  age: { ko: '나이', en: 'Age', icon: '⚡' },
  educationLevel: { ko: '학력', en: 'Education', icon: '🎓' },
  availableAnnualFund: { ko: '자금', en: 'Budget', icon: '💰' },
  finalGoal: { ko: '목표', en: 'Goal', icon: '🏆' },
  priorityPreference: { ko: '우선순위', en: 'Priority', icon: '⚙️' },
  result: { ko: '결과', en: 'Result', icon: '🏆' },
};

// 속도 게이지 계산 / Speed gauge calculation (0-100)
function calcGaugePercent(currentStep: DiagnosisStep): number {
  const idx = STEPS.indexOf(currentStep);
  if (idx === -1) return 100;
  return Math.round(((idx + 1) / STEPS.length) * 100);
}

// 랩타임 포맷 / Lap time format
function formatLapTime(months: number): string {
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem}개월`;
  if (rem === 0) return `${years}년`;
  return `${years}년 ${rem}개월`;
}

// 비용 포맷 / Cost format
function formatCost(won: number): string {
  if (won === 0) return '무료';
  if (won >= 10000) return `${(won / 10000).toFixed(0)}억원`;
  if (won >= 1000) return `${(won / 1000).toFixed(1)}천만원`;
  return `${won}만원`;
}

// 순위 색상 / Rank color
function getRankColor(idx: number): string {
  if (idx === 0) return 'text-yellow-400';
  if (idx === 1) return 'text-gray-300';
  if (idx === 2) return 'text-amber-600';
  return 'text-gray-500';
}

// 순위 배경 / Rank background
function getRankBg(idx: number): string {
  if (idx === 0) return 'border-yellow-500/50 bg-yellow-500/10';
  if (idx === 1) return 'border-gray-400/50 bg-gray-400/10';
  if (idx === 2) return 'border-amber-600/50 bg-amber-600/10';
  return 'border-gray-700/50 bg-gray-900/30';
}

// 속도 게이지 컴포넌트 / Speed gauge component
function SpeedGauge({ percent }: { percent: number }) {
  // 반원형 게이지 / Semicircle gauge
  const radius = 60;
  const circ = Math.PI * radius;
  const strokeDash = (percent / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="80" viewBox="0 0 140 80">
        {/* 배경 반원 / Background semicircle */}
        <path
          d="M 10 75 A 60 60 0 0 1 130 75"
          fill="none"
          stroke="#1f2937"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* 진행 반원 / Progress semicircle */}
        <path
          d="M 10 75 A 60 60 0 0 1 130 75"
          fill="none"
          stroke="#ef4444"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        {/* 눈금 / Tick marks */}
        {[0, 25, 50, 75, 100].map((v) => {
          const angle = -180 + (v / 100) * 180;
          const rad = (angle * Math.PI) / 180;
          const x1 = 70 + 48 * Math.cos(rad);
          const y1 = 75 + 48 * Math.sin(rad);
          const x2 = 70 + 56 * Math.cos(rad);
          const y2 = 75 + 56 * Math.sin(rad);
          return <line key={v} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="2" />;
        })}
        {/* 중앙 퍼센트 / Center percent */}
        <text x="70" y="68" textAnchor="middle" fill="#ef4444" fontSize="18" fontWeight="bold" fontFamily="monospace">
          {percent}
        </text>
        <text x="70" y="78" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="monospace">
          SPEED
        </text>
      </svg>
    </div>
  );
}

// 트랙 진행 바 / Track progress bar
function TrackProgress({ currentStep }: { currentStep: DiagnosisStep }) {
  const currentIdx = STEPS.indexOf(currentStep);

  return (
    <div className="w-full px-4 py-3">
      {/* 트랙 선 / Track line */}
      <div className="relative flex items-center justify-between">
        {/* 배경 선 / Background line */}
        <div className="absolute left-0 right-0 h-1 bg-gray-800 top-1/2 -translate-y-1/2 mx-4" />
        {/* 진행 선 / Progress line */}
        <div
          className="absolute h-1 bg-red-600 top-1/2 -translate-y-1/2 mx-4 transition-all duration-500"
          style={{
            width:
              currentIdx <= 0
                ? '0%'
                : `${(currentIdx / (STEPS.length - 1)) * (100 - (8 / STEPS.length) * 100)}%`,
          }}
        />
        {/* 체크포인트 깃발 / Checkpoint flags */}
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step} className="relative flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-red-600 border-red-500'
                    : isCurrent
                    ? 'bg-gray-900 border-red-500 shadow-lg shadow-red-500/50'
                    : 'bg-gray-900 border-gray-700'
                }`}
              >
                {isCompleted ? (
                  <Flag className="w-3.5 h-3.5 text-white" />
                ) : isCurrent ? (
                  <span className="text-xs">{STEP_LABELS[step].icon}</span>
                ) : (
                  <Circle className="w-3 h-3 text-gray-600" />
                )}
              </div>
              <span
                className={`mt-1 text-xs font-mono ${
                  isCurrent ? 'text-red-400' : isCompleted ? 'text-gray-400' : 'text-gray-700'
                }`}
              >
                {STEP_LABELS[step].ko}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 메인 컴포넌트 / Main component
export default function Diagnosis28Page() {
  // 입력 상태 / Input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // 현재 단계 / Current step
  const [currentStep, setCurrentStep] = useState<DiagnosisStep>('nationality');
  // 결과 표시 여부 / Show result
  const [showResult, setShowResult] = useState(false);
  // 선택된 경로 / Selected pathway
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  // 확장된 마일스톤 / Expanded milestone
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null);
  // 나이 입력 텍스트 / Age input text
  const [ageText, setAgeText] = useState('');
  // 애니메이션 / Animation
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 다음 단계로 이동 / Move to next step
  const goNext = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1]);
    } else {
      // 마지막 단계 → 분석 시작 / Last step → start analysis
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResult(true);
        setCurrentStep('result');
      }, 2200);
    }
  };

  // 이전 단계로 / Go to previous step
  const goPrev = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) setCurrentStep(STEPS[idx - 1]);
  };

  // 처음으로 / Reset to start
  const reset = () => {
    setInput({});
    setCurrentStep('nationality');
    setShowResult(false);
    setSelectedPathway(null);
    setExpandedPathway(null);
    setAgeText('');
    setIsAnalyzing(false);
  };

  // 현재 단계 유효 여부 / Current step validity
  const isCurrentValid = (): boolean => {
    switch (currentStep) {
      case 'nationality': return !!input.nationality;
      case 'age': return !!input.age && input.age >= 15 && input.age <= 65;
      case 'educationLevel': return !!input.educationLevel;
      case 'availableAnnualFund': return input.availableAnnualFund !== undefined;
      case 'finalGoal': return !!input.finalGoal;
      case 'priorityPreference': return !!input.priorityPreference;
      default: return false;
    }
  };

  const gaugePercent = showResult ? 100 : calcGaugePercent(currentStep);

  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'Courier New', monospace" }}>
      {/* 헤더 — 레이싱 HUD / Header — Racing HUD */}
      <header className="bg-black border-b border-red-900/50 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* 왼쪽 — 로고 / Left — Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <Flag className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-red-500 font-bold text-xs tracking-widest">JOBCHAJA</div>
              <div className="text-gray-400 text-xs">VISA GRAND PRIX</div>
            </div>
          </div>

          {/* 오른쪽 — 게이지 / Right — Gauge */}
          <div className="flex items-center gap-3">
            <Gauge className="w-4 h-4 text-red-500" />
            <div className="text-right">
              <div className="text-red-400 font-bold text-sm">{gaugePercent}%</div>
              <div className="text-gray-600 text-xs">PROGRESS</div>
            </div>
          </div>
        </div>

        {/* 트랙 진행바 (입력 중에만) / Track progress bar (only during input) */}
        {!showResult && !isAnalyzing && (
          <div className="max-w-2xl mx-auto border-t border-gray-900">
            <TrackProgress currentStep={currentStep} />
          </div>
        )}
      </header>

      {/* 분석 중 화면 / Analysis loading screen */}
      {isAnalyzing && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-8 px-4">
          {/* 레이싱 애니메이션 / Racing animation */}
          <div className="relative w-full max-w-sm h-32">
            {/* 트랙 / Track */}
            <div className="absolute bottom-8 left-0 right-0 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
            {/* 자동차 / Car */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 -translate-y-1 text-3xl animate-bounce">
              🏎️
            </div>
            {/* 속도선 / Speed lines */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute bottom-10 h-0.5 bg-red-600/40 rounded animate-pulse"
                style={{
                  left: `${10 + i * 20}%`,
                  width: `${15 + i * 5}%`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

          <div className="text-center space-y-2">
            <div className="text-red-500 font-bold text-xl tracking-widest animate-pulse">ANALYZING...</div>
            <div className="text-gray-400 text-sm">비자 경로 14개 Evaluator 분석 중</div>
            <div className="text-gray-500 text-xs">Running 2,629 test scenarios</div>
          </div>

          {/* 속도 게이지 / Speed gauge */}
          <SpeedGauge percent={100} />
        </div>
      )}

      {/* 입력 화면 / Input screen */}
      {!isAnalyzing && !showResult && (
        <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* 체크포인트 헤더 / Checkpoint header */}
          <div className="flex items-center gap-3 border-b border-red-900/40 pb-4">
            <div className="w-10 h-10 bg-red-600/20 border border-red-500/50 rounded flex items-center justify-center text-xl">
              {STEP_LABELS[currentStep].icon}
            </div>
            <div>
              <div className="text-xs text-red-400 font-mono tracking-widest uppercase">
                CHECKPOINT {STEPS.indexOf(currentStep) + 1}/{STEPS.length}
              </div>
              <div className="text-white font-bold text-lg">{STEP_LABELS[currentStep].ko}</div>
              <div className="text-gray-500 text-xs">{STEP_LABELS[currentStep].en}</div>
            </div>
            <div className="ml-auto">
              <SpeedGauge percent={gaugePercent} />
            </div>
          </div>

          {/* 단계별 입력 / Step-by-step input */}

          {/* STEP 1: 국적 / Nationality */}
          {currentStep === 'nationality' && (
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">어느 나라에서 오셨나요? / Where are you from?</p>
              <div className="grid grid-cols-2 gap-2">
                {popularCountries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setInput((p) => ({ ...p, nationality: c.code }))}
                    className={`flex items-center gap-2 px-3 py-3 rounded border transition-all duration-200 text-left ${
                      input.nationality === c.code
                        ? 'border-red-500 bg-red-600/20 text-white'
                        : 'border-gray-800 bg-gray-900/50 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-xl shrink-0">{c.flag}</span>
                    <div>
                      <div className="text-xs font-bold">{c.nameKo}</div>
                      <div className="text-xs text-gray-500">{c.nameEn}</div>
                    </div>
                    {input.nationality === c.code && (
                      <CheckCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: 나이 / Age */}
          {currentStep === 'age' && (
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">나이를 입력하세요 / Enter your age</p>
              <div className="relative">
                <input
                  type="number"
                  min={15}
                  max={65}
                  value={ageText}
                  onChange={(e) => {
                    setAgeText(e.target.value);
                    const n = parseInt(e.target.value, 10);
                    if (!isNaN(n)) setInput((p) => ({ ...p, age: n }));
                  }}
                  placeholder="예: 24"
                  className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-4 text-white text-2xl font-mono text-center focus:outline-none focus:border-red-500 transition-colors"
                />
                <div className="mt-2 text-center text-gray-500 text-xs">15세 ~ 65세 / Ages 15-65</div>
              </div>
              {/* 빠른 선택 / Quick select */}
              <div className="flex gap-2 flex-wrap">
                {[20, 24, 28, 32, 36, 40].map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      setAgeText(String(a));
                      setInput((p) => ({ ...p, age: a }));
                    }}
                    className={`px-3 py-1.5 rounded border text-sm font-mono transition-all ${
                      input.age === a
                        ? 'border-red-500 bg-red-600/20 text-red-300'
                        : 'border-gray-700 bg-gray-900/50 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {a}세
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: 학력 / Education */}
          {currentStep === 'educationLevel' && (
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">최종 학력을 선택하세요 / Select your education level</p>
              <div className="space-y-2">
                {educationOptions.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setInput((p) => ({ ...p, educationLevel: e.value }))}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded border transition-all duration-200 text-left ${
                      input.educationLevel === e.value
                        ? 'border-red-500 bg-red-600/20'
                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-xl shrink-0">{e.emoji || '📄'}</span>
                    <div className="flex-1">
                      <div className="text-white text-sm font-bold">{e.labelKo}</div>
                      <div className="text-gray-500 text-xs">{e.labelEn}</div>
                    </div>
                    {input.educationLevel === e.value && (
                      <Flag className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: 자금 / Fund */}
          {currentStep === 'availableAnnualFund' && (
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">연간 사용 가능한 자금은? / Available annual budget?</p>
              <div className="space-y-2">
                {fundOptions.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setInput((p) => ({ ...p, availableAnnualFund: f.value }))}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded border transition-all duration-200 text-left ${
                      input.availableAnnualFund === f.value
                        ? 'border-red-500 bg-red-600/20'
                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 text-red-400 shrink-0" />
                    <div className="flex-1">
                      <div className="text-white text-sm font-bold">{f.labelKo}</div>
                      <div className="text-gray-500 text-xs">{f.labelEn}</div>
                    </div>
                    {input.availableAnnualFund === f.value && (
                      <CheckCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: 목표 / Goal */}
          {currentStep === 'finalGoal' && (
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">한국에서의 최종 목표는? / What is your final goal in Korea?</p>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setInput((p) => ({ ...p, finalGoal: g.value }))}
                    className={`flex flex-col items-center gap-2 px-3 py-5 rounded border transition-all duration-200 ${
                      input.finalGoal === g.value
                        ? 'border-red-500 bg-red-600/20'
                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-3xl">{g.emoji}</span>
                    <div className="text-white text-sm font-bold">{g.labelKo}</div>
                    <div className="text-gray-500 text-xs text-center">{g.descKo}</div>
                    {input.finalGoal === g.value && (
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: 우선순위 / Priority */}
          {currentStep === 'priorityPreference' && (
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">가장 중요한 것은? / What matters most to you?</p>
              <div className="grid grid-cols-2 gap-3">
                {priorityOptions.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setInput((prev) => ({ ...prev, priorityPreference: p.value }))}
                    className={`flex flex-col items-center gap-2 px-3 py-5 rounded border transition-all duration-200 ${
                      input.priorityPreference === p.value
                        ? 'border-red-500 bg-red-600/20'
                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-3xl">{p.emoji}</span>
                    <div className="text-white text-sm font-bold">{p.labelKo}</div>
                    <div className="text-gray-500 text-xs text-center">{p.descKo}</div>
                    {input.priorityPreference === p.value && (
                      <Zap className="w-4 h-4 text-red-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 네비게이션 버튼 / Navigation buttons */}
          <div className="flex gap-3 pt-2">
            {STEPS.indexOf(currentStep) > 0 && (
              <button
                onClick={goPrev}
                className="flex items-center gap-2 px-4 py-3 rounded border border-gray-700 bg-gray-900/50 text-gray-400 hover:text-white hover:border-gray-500 transition-all text-sm"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                이전
              </button>
            )}
            <button
              onClick={goNext}
              disabled={!isCurrentValid()}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded font-bold text-sm tracking-wider transition-all duration-200 ${
                isCurrentValid()
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
              {STEPS.indexOf(currentStep) === STEPS.length - 1 ? (
                <>
                  <Flag className="w-4 h-4" />
                  RACE START!
                </>
              ) : (
                <>
                  다음 체크포인트
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </main>
      )}

      {/* 결과 화면 / Result screen */}
      {showResult && !isAnalyzing && (
        <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* 결과 헤더 / Result header */}
          <div className="text-center space-y-2 border-b border-red-900/40 pb-6">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-red-600/20 border-2 border-red-500 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className="text-red-400 font-mono text-xs tracking-widest uppercase">Race Result</div>
            <h1 className="text-white font-bold text-2xl">비자 레이스 결과</h1>
            <p className="text-gray-400 text-sm">
              {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 경로 분석 →{' '}
              <span className="text-red-400 font-bold">{mockDiagnosisResult.pathways.length}개</span> 경로 발견
            </p>
            {/* 속도 게이지 완료 / Gauge complete */}
            <div className="flex justify-center pt-2">
              <SpeedGauge percent={100} />
            </div>
          </div>

          {/* 순위표 (리더보드) / Leaderboard */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-bold text-sm font-mono tracking-wider">LEADERBOARD</span>
              <span className="text-gray-600 text-xs">/ 비자 경로 순위표</span>
            </div>

            <div className="space-y-3">
              {mockDiagnosisResult.pathways.map((pathway, idx) => {
                const isExpanded = expandedPathway === pathway.pathwayId;
                const isSelected = selectedPathway === pathway.pathwayId;

                return (
                  <div
                    key={pathway.pathwayId}
                    className={`border rounded-lg overflow-hidden transition-all duration-300 ${getRankBg(idx)} ${
                      isSelected ? 'ring-1 ring-red-500' : ''
                    }`}
                  >
                    {/* 카드 헤더 / Card header */}
                    <button
                      onClick={() => {
                        setSelectedPathway(isSelected ? null : pathway.pathwayId);
                        setExpandedPathway(isExpanded ? null : pathway.pathwayId);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    >
                      {/* 순위 / Rank */}
                      <div className={`text-2xl font-black font-mono shrink-0 ${getRankColor(idx)}`}>
                        P{idx + 1}
                      </div>

                      {/* 경로 이름 / Pathway name */}
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-bold truncate">{pathway.nameKo}</div>
                        <div className="text-gray-500 text-xs truncate">{pathway.nameEn}</div>
                        {/* 비자 체인 / Visa chain */}
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {pathway.visaChain.split(' → ').map((v, vi) => (
                            <React.Fragment key={vi}>
                              {vi > 0 && <ArrowRight className="w-2.5 h-2.5 text-gray-600" />}
                              <span className="bg-gray-800 text-red-300 text-xs px-1.5 py-0.5 rounded font-mono">
                                {v}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* 점수 + 랩타임 / Score + lap time */}
                      <div className="shrink-0 text-right space-y-1">
                        <div
                          className="text-lg font-black font-mono"
                          style={{ color: getScoreColor(pathway.finalScore) }}
                        >
                          {pathway.finalScore}
                          <span className="text-xs font-normal text-gray-600">pt</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Timer className="w-3 h-3" />
                          {formatLapTime(pathway.estimatedMonths)}
                        </div>
                        <div className="text-xs">
                          {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
                        </div>
                      </div>

                      {/* 확장 아이콘 / Expand icon */}
                      <div className="shrink-0 ml-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </button>

                    {/* 확장 패널 / Expanded panel */}
                    {isExpanded && (
                      <div className="border-t border-gray-800 px-4 py-4 space-y-4 bg-black/30">
                        {/* 통계 그리드 / Stats grid */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">
                              <Timer className="w-3 h-3 inline mr-1" />
                              기간
                            </div>
                            <div className="text-white text-sm font-bold">
                              {formatLapTime(pathway.estimatedMonths)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">
                              <DollarSign className="w-3 h-3 inline mr-1" />
                              비용
                            </div>
                            <div className="text-white text-sm font-bold">
                              {formatCost(pathway.estimatedCostWon)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">
                              <TrendingUp className="w-3 h-3 inline mr-1" />
                              점수
                            </div>
                            <div
                              className="text-sm font-bold"
                              style={{ color: getScoreColor(pathway.finalScore) }}
                            >
                              {pathway.finalScore}pt
                            </div>
                          </div>
                        </div>

                        {/* 마일스톤 — 랩 구간 / Milestones — Lap sectors */}
                        <div>
                          <div className="text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            Pit Stop Timeline / 랩 타임라인
                          </div>
                          <div className="space-y-2">
                            {pathway.milestones.map((m, mi) => (
                              <div key={mi} className="flex items-start gap-3">
                                {/* 랩 번호 / Lap number */}
                                <div className="shrink-0 w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                                  <span className="text-xs font-mono text-gray-400">L{mi + 1}</span>
                                </div>
                                {/* 내용 / Content */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white text-xs font-bold">{m.nameKo}</span>
                                    {m.visaStatus && m.visaStatus !== 'none' && (
                                      <span className="bg-red-900/50 text-red-300 text-xs px-1.5 py-0.5 rounded font-mono">
                                        {m.visaStatus}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-gray-500 text-xs mt-0.5">
                                    <Clock className="w-2.5 h-2.5 inline mr-1" />
                                    {m.monthFromStart === 0 ? '출발' : `+${m.monthFromStart}개월`}
                                    {m.canWorkPartTime && (
                                      <span className="ml-2 text-green-400">
                                        ✓ 아르바이트 가능 ({m.weeklyHours}h/주)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 다음 단계 / Next steps */}
                        {pathway.nextSteps.length > 0 && (
                          <div>
                            <div className="text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
                              <Zap className="w-3 h-3 inline mr-1" />
                              Next Steps / 다음 액션
                            </div>
                            <div className="space-y-2">
                              {pathway.nextSteps.map((ns, ni) => (
                                <div key={ni} className="flex items-start gap-2 bg-gray-900/50 rounded p-2">
                                  <ArrowRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-white text-xs font-bold">{ns.nameKo}</div>
                                    <div className="text-gray-500 text-xs">{ns.description}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 메모 / Note */}
                        {pathway.note && (
                          <div className="flex items-start gap-2 bg-gray-900/30 border border-gray-800 rounded p-2">
                            <AlertCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                            <span className="text-gray-400 text-xs">{pathway.note}</span>
                          </div>
                        )}

                        {/* 선택 버튼 / Select button */}
                        <button
                          onClick={() => setSelectedPathway(pathway.pathwayId)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all"
                        >
                          <Flag className="w-4 h-4" />
                          이 경로로 출발하기 / Choose This Path
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 선택된 경로 요약 / Selected pathway summary */}
          {selectedPathway && (
            <div className="border border-red-500/50 bg-red-600/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-white font-bold text-sm">선택된 레이싱 경로 / Selected Path</span>
              </div>
              {(() => {
                const pw = mockDiagnosisResult.pathways.find((p) => p.pathwayId === selectedPathway);
                if (!pw) return null;
                return (
                  <>
                    <div className="text-red-300 font-bold">{pw.nameKo}</div>
                    <div className="text-gray-400 text-xs">{pw.nameEn}</div>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>
                        <Timer className="w-3 h-3 inline mr-1" />
                        {formatLapTime(pw.estimatedMonths)}
                      </span>
                      <span>
                        <DollarSign className="w-3 h-3 inline mr-1" />
                        {formatCost(pw.estimatedCostWon)}
                      </span>
                      <span>{getFeasibilityEmoji(pw.feasibilityLabel)} {pw.feasibilityLabel}</span>
                    </div>
                    <button className="w-full py-2.5 rounded bg-white text-gray-900 font-bold text-sm hover:bg-gray-100 transition-all">
                      잡차자에서 시작하기 / Start with JobChaja →
                    </button>
                  </>
                );
              })()}
            </div>
          )}

          {/* 메타 정보 / Meta info */}
          <div className="text-center text-gray-700 text-xs font-mono space-y-1 border-t border-gray-900 pt-4">
            <div>총 {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 경로 분석</div>
            <div>{mockDiagnosisResult.meta.hardFilteredOut}개 필터링됨</div>
            <div className="text-gray-800">{mockDiagnosisResult.meta.timestamp}</div>
          </div>

          {/* 다시 시작 / Restart */}
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 py-3 rounded border border-gray-700 bg-gray-900/50 text-gray-400 hover:text-white hover:border-gray-500 transition-all text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            다시 진단하기 / Restart Diagnosis
          </button>
        </main>
      )}

      {/* 푸터 / Footer */}
      <footer className="border-t border-gray-900 py-4 mt-8">
        <div className="max-w-2xl mx-auto px-4 text-center text-gray-700 text-xs font-mono">
          <div>JOBCHAJA VISA GRAND PRIX — Design #28 Racing Track</div>
          <div className="mt-1">14 Evaluators · 31 Visa Types · 2,629 Test Scenarios</div>
        </div>
      </footer>
    </div>
  );
}
