'use client';

// KOR: 비자 진단 디자인 #86 — 패션쇼 런웨이 스타일
// ENG: Visa Diagnosis Design #86 — Fashion Runway Style
// 참조: Vogue, SSENSE, Net-a-Porter, Farfetch, Highsnobiety
// Reference: Vogue, SSENSE, Net-a-Porter, Farfetch, Highsnobiety

import { useState, useEffect, useRef } from 'react';
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
  Star,
  Clock,
  DollarSign,
  Sparkles,
  ArrowRight,
  Play,
  Eye,
  Award,
  Zap,
  Circle,
  Check,
  X,
  Crown,
  Gem,
} from 'lucide-react';

// KOR: 각 입력 단계 타입 정의
// ENG: Input step type definition
type InputStep = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

// KOR: 단계 순서 배열
// ENG: Step order array
const STEPS: InputStep[] = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
];

// KOR: 각 단계의 레이블 (한/영)
// ENG: Labels for each step (Korean/English)
const STEP_LABELS: Record<InputStep, { ko: string; en: string; season: string }> = {
  nationality: { ko: '국적', en: 'Nationality', season: 'SS25 Collection Origin' },
  age: { ko: '나이', en: 'Age', season: 'Season / Vintage' },
  educationLevel: { ko: '학력', en: 'Education', season: 'Academic Credentials' },
  availableAnnualFund: { ko: '연간 가용 자금', en: 'Annual Budget', season: 'Investment Portfolio' },
  finalGoal: { ko: '최종 목표', en: 'Final Destination', season: 'Collection Theme' },
  priorityPreference: { ko: '우선순위', en: 'Priority Style', season: 'Style Direction' },
};

// KOR: 실현 가능성 점수에 따른 골드 그레이딩 반환
// ENG: Return gold grading based on feasibility score
const getRunwayGrade = (score: number): { label: string; color: string; textColor: string } => {
  if (score >= 80) return { label: 'HAUTE COUTURE', color: 'from-yellow-400 to-amber-500', textColor: 'text-amber-400' };
  if (score >= 65) return { label: 'PRÊT-À-PORTER', color: 'from-amber-300 to-yellow-500', textColor: 'text-yellow-400' };
  if (score >= 50) return { label: 'DIFFUSION', color: 'from-stone-400 to-stone-500', textColor: 'text-stone-400' };
  return { label: 'SAMPLE', color: 'from-zinc-500 to-zinc-600', textColor: 'text-zinc-400' };
};

// KOR: 카운트다운 연도 배열 생성 (나이 옵션용)
// ENG: Generate age array for selection
const AGE_OPTIONS: number[] = Array.from({ length: 53 }, (_, i) => i + 18);

export default function DiagnosisRunwayPage() {
  // KOR: 현재 진단 단계 (입력 vs 결과)
  // ENG: Current diagnosis phase (input vs result)
  const [phase, setPhase] = useState<'intro' | 'input' | 'show' | 'result'>('intro');

  // KOR: 현재 입력 단계 인덱스
  // ENG: Current input step index
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // KOR: 사용자 입력 데이터
  // ENG: User input data
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 진단 결과 데이터
  // ENG: Diagnosis result data
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 선택된 런웨이 경로 인덱스
  // ENG: Selected runway pathway index
  const [selectedPathway, setSelectedPathway] = useState<number>(0);

  // KOR: 쇼 입장 애니메이션 상태
  // ENG: Show entrance animation state
  const [showAnim, setShowAnim] = useState(false);

  // KOR: 런웨이 워크 애니메이션 상태 (경로 카드 전환)
  // ENG: Runway walk animation state (pathway card transition)
  const [walkAnim, setWalkAnim] = useState(false);

  // KOR: 에디터 노트 확장 상태
  // ENG: Editor note expanded state
  const [editorNoteOpen, setEditorNoteOpen] = useState(false);

  const runwayRef = useRef<HTMLDivElement>(null);

  // KOR: 현재 단계 키
  // ENG: Current step key
  const currentStep = STEPS[currentStepIndex];

  // KOR: 다음 단계로 이동
  // ENG: Move to next step
  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // KOR: 마지막 단계 — 쇼 시작 시퀀스
      // ENG: Last step — begin show sequence
      setPhase('show');
      setShowAnim(true);
      setTimeout(() => {
        setResult(mockDiagnosisResult);
        setPhase('result');
        setShowAnim(false);
      }, 3200);
    }
  };

  // KOR: 이전 단계로 이동
  // ENG: Move to previous step
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      setPhase('intro');
    }
  };

  // KOR: 단일 값 선택 핸들러
  // ENG: Single value selection handler
  const handleSelect = (field: InputStep, value: string | number) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  // KOR: 현재 단계에 값이 선택되었는지 확인
  // ENG: Check if current step has a selected value
  const hasCurrentValue = input[currentStep] !== undefined && input[currentStep] !== '';

  // KOR: 런웨이 경로 전환 (애니메이션 포함)
  // ENG: Switch runway pathway (with animation)
  const switchPathway = (index: number) => {
    setWalkAnim(true);
    setTimeout(() => {
      setSelectedPathway(index);
      setWalkAnim(false);
    }, 400);
  };

  // KOR: 결과 페이지 렌더링
  // ENG: Render result page
  // KOR: 현재 선택된 비자 경로 (RecommendedPathway 타입으로 명시)
  // ENG: Currently selected visa pathway (typed as RecommendedPathway)
  const currentPathway: RecommendedPathway | undefined = result?.pathways[selectedPathway];
  const grade = currentPathway ? getRunwayGrade(currentPathway.feasibilityScore) : null;

  // ──────────────────────────────────────────────────────────────
  // KOR: 인트로 화면 렌더링
  // ENG: Intro screen rendering
  // ──────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
        {/* KOR: 배경 런웨이 라이트 효과 / ENG: Background runway light effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-linear-to-b from-amber-400/60 via-amber-400/20 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-x-8 w-px h-full bg-linear-to-b from-amber-400/20 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 translate-x-8 w-px h-full bg-linear-to-b from-amber-400/20 via-transparent to-transparent" />
          {/* KOR: 좌우 스포트라이트 / ENG: Side spotlights */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-900/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-900/20 rounded-full blur-2xl" />
        </div>

        {/* KOR: 헤더 로고 / ENG: Header logo */}
        <div className="relative z-10 text-center px-6 max-w-2xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-amber-400" />
            <span className="text-amber-400 text-xs tracking-[0.4em] uppercase font-light">JobChaja Presents</span>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-amber-400" />
          </div>

          <h1 className="text-6xl md:text-8xl font-thin tracking-[-0.02em] text-white mb-4 leading-none">
            VISA
          </h1>
          <h2 className="text-6xl md:text-8xl font-black tracking-[-0.02em] text-amber-400 mb-6 leading-none">
            RUNWAY
          </h2>
          <p className="text-stone-400 text-sm tracking-[0.2em] uppercase mb-2 font-light">
            Spring / Summer 2025 Collection
          </p>
          <p className="text-stone-500 text-xs tracking-[0.15em] mb-12 font-light">
            비자 경로를 런웨이처럼 — Your Visa Path, Curated
          </p>

          {/* KOR: 구분선 / ENG: Divider */}
          <div className="flex items-center gap-4 mb-12 justify-center">
            <div className="h-px flex-1 bg-stone-800" />
            <Crown className="w-4 h-4 text-amber-400" />
            <div className="h-px flex-1 bg-stone-800" />
          </div>

          <p className="text-stone-400 text-sm leading-relaxed mb-12 font-light">
            패션쇼처럼, 당신의 비자 경로가 런웨이를 걷습니다.<br />
            <span className="text-stone-500 text-xs">Like a fashion show, your visa pathway walks the runway.</span>
          </p>

          <button
            onClick={() => setPhase('input')}
            className="group relative px-12 py-4 bg-amber-400 text-black font-semibold text-sm tracking-[0.2em] uppercase hover:bg-amber-300 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Play className="w-4 h-4" />
              ENTER THE SHOW
            </span>
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
          </button>

          {/* KOR: 하단 컬렉션 정보 / ENG: Bottom collection info */}
          <div className="mt-16 grid grid-cols-3 gap-6 text-center">
            {[
              { num: '31', label: 'Visa Types' },
              { num: '5', label: 'Pathways' },
              { num: '100%', label: 'Auto-Matched' },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-amber-400 text-2xl font-thin">{item.num}</div>
                <div className="text-stone-600 text-xs tracking-[0.15em] uppercase mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          {/* KOR: 샘플 프로파일 미리보기 (mockInput 기반) / ENG: Sample profile preview (based on mockInput) */}
          <div className="mt-8 flex items-center gap-2 justify-center text-stone-700 text-xs tracking-widest">
            <Circle className="w-2 h-2 text-amber-400/30 fill-amber-400/30" />
            <span>Sample: {mockInput.nationality} · Age {mockInput.age} · {mockInput.educationLevel?.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // KOR: 쇼 시작 로딩 화면 (분석 중)
  // ENG: Show loading screen (analyzing)
  // ──────────────────────────────────────────────────────────────
  if (phase === 'show') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-linear-to-b from-amber-400 via-amber-400/30 to-transparent animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-400 rounded-full animate-bounce"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '1.2s',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border border-amber-400/40 rounded-full flex items-center justify-center mx-auto mb-8 animate-spin" style={{ animationDuration: '3s' }}>
            <Crown className="w-6 h-6 text-amber-400" />
          </div>
          <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-4 animate-pulse">
            Curating Your Collection
          </p>
          <h2 className="text-4xl font-thin tracking-widest text-white mb-2">
            THE SHOW
          </h2>
          <h3 className="text-4xl font-black text-amber-400">
            BEGINS
          </h3>
          <p className="text-stone-600 text-xs mt-8 tracking-[0.2em]">
            분석 중 — Analyzing your visa runway...
          </p>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // KOR: 입력 화면 렌더링
  // ENG: Input screen rendering
  // ──────────────────────────────────────────────────────────────
  if (phase === 'input') {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* KOR: 런웨이 배경 라인 / ENG: Runway background lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-linear-to-b from-amber-400/40 via-amber-400/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-400/30 to-transparent" />
        </div>

        {/* KOR: 헤더 네비게이션 / ENG: Header navigation */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-stone-900">
          <button onClick={handleBack} className="flex items-center gap-2 text-stone-500 hover:text-amber-400 transition-colors text-xs tracking-[0.1em] uppercase">
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-amber-400 text-xs tracking-[0.3em] uppercase font-light">
            VISA RUNWAY — SS25
          </span>
          <span className="text-stone-600 text-xs tracking-widest">
            {currentStepIndex + 1} / {STEPS.length}
          </span>
        </div>

        {/* KOR: 프로그레스 런웨이 바 / ENG: Progress runway bar */}
        <div className="relative h-1 bg-stone-900">
          <div
            className="h-full bg-linear-to-r from-amber-600 to-amber-400 transition-all duration-700"
            style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-400 rounded-full shadow-lg shadow-amber-400/60 transition-all duration-700"
            style={{ left: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* KOR: 컨텐츠 영역 / ENG: Content area */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 pt-16 pb-32">
          {/* KOR: 단계 레이블 (패션 시즌) / ENG: Step label (fashion season) */}
          <div className="text-center mb-12">
            <span className="text-stone-600 text-xs tracking-[0.3em] uppercase block mb-2">
              {STEP_LABELS[currentStep].season}
            </span>
            <h2 className="text-4xl font-thin text-white tracking-tight">
              {STEP_LABELS[currentStep].en}
            </h2>
            <p className="text-amber-400/60 text-sm mt-1 tracking-widest">
              {STEP_LABELS[currentStep].ko}
            </p>
            {/* KOR: 장식 구분선 / ENG: Decorative divider */}
            <div className="flex items-center gap-3 justify-center mt-6">
              <div className="h-px w-8 bg-stone-800" />
              <Gem className="w-3 h-3 text-amber-400/50" />
              <div className="h-px w-8 bg-stone-800" />
            </div>
          </div>

          {/* KOR: 국적 선택 / ENG: Nationality selection */}
          {currentStep === 'nationality' && (
            <div>
              <div className="grid grid-cols-2 gap-3">
                {popularCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleSelect('nationality', country.name)}
                    className={`group flex items-center gap-3 px-4 py-3 border transition-all duration-200 text-left ${
                      input.nationality === country.name
                        ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                        : 'border-stone-800 hover:border-stone-600 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xl shrink-0">{country.flag}</span>
                    <span className="text-xs tracking-wider font-light">{country.name}</span>
                    {input.nationality === country.name && (
                      <Check className="w-3 h-3 ml-auto text-amber-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* KOR: 나이 입력 / ENG: Age selection */}
          {currentStep === 'age' && (
            <div>
              <div className="text-center mb-8">
                <span className="text-amber-400 text-7xl font-thin">
                  {input.age ?? '--'}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {AGE_OPTIONS.map((age) => (
                  <button
                    key={age}
                    onClick={() => handleSelect('age', age)}
                    className={`py-2 text-xs font-light tracking-wider border transition-all duration-150 ${
                      input.age === age
                        ? 'border-amber-400 bg-amber-400 text-black font-semibold'
                        : 'border-stone-800 text-stone-500 hover:border-stone-600 hover:text-white'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* KOR: 학력 선택 / ENG: Education level selection */}
          {currentStep === 'educationLevel' && (
            <div className="space-y-3">
              {educationOptions.map((edu, idx) => (
                <button
                  key={edu}
                  onClick={() => handleSelect('educationLevel', edu)}
                  className={`w-full flex items-center justify-between px-5 py-4 border transition-all duration-200 ${
                    input.educationLevel === edu
                      ? 'border-amber-400 bg-amber-400/10'
                      : 'border-stone-800 hover:border-stone-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xs tracking-[0.2em] font-thin ${
                      input.educationLevel === edu ? 'text-amber-400' : 'text-stone-600'
                    }`}>
                      0{idx + 1}
                    </span>
                    <span className={`text-sm font-light tracking-wide ${
                      input.educationLevel === edu ? 'text-amber-400' : 'text-stone-300'
                    }`}>
                      {edu}
                    </span>
                  </div>
                  {input.educationLevel === edu && (
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* KOR: 연간 자금 선택 / ENG: Annual fund selection */}
          {currentStep === 'availableAnnualFund' && (
            <div className="space-y-3">
              {fundOptions.map((fund, idx) => {
                const tiers = ['SAMPLE', 'DIFFUSION', 'PRÊT', 'RTW', 'HAUTE COUTURE'];
                return (
                  <button
                    key={fund}
                    onClick={() => handleSelect('availableAnnualFund', fund)}
                    className={`w-full flex items-center justify-between px-5 py-4 border transition-all duration-200 ${
                      input.availableAnnualFund === fund
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-xs tracking-widest font-thin ${
                        input.availableAnnualFund === fund ? 'text-amber-400' : 'text-stone-700'
                      }`}>
                        {tiers[idx]}
                      </span>
                      <span className={`text-sm font-light ${
                        input.availableAnnualFund === fund ? 'text-amber-400' : 'text-stone-300'
                      }`}>
                        {fund}
                      </span>
                    </div>
                    {input.availableAnnualFund === fund && (
                      <Gem className="w-3 h-3 text-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* KOR: 최종 목표 선택 / ENG: Final goal selection */}
          {currentStep === 'finalGoal' && (
            <div className="space-y-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleSelect('finalGoal', goal)}
                  className={`w-full flex items-center gap-4 px-5 py-4 border text-left transition-all duration-200 ${
                    input.finalGoal === goal
                      ? 'border-amber-400 bg-amber-400/10'
                      : 'border-stone-800 hover:border-stone-600'
                  }`}
                >
                  <div className={`w-5 h-5 border flex items-center justify-center shrink-0 ${
                    input.finalGoal === goal ? 'border-amber-400 bg-amber-400' : 'border-stone-700'
                  }`}>
                    {input.finalGoal === goal && <Check className="w-3 h-3 text-black" />}
                  </div>
                  <span className={`text-sm font-light tracking-wide ${
                    input.finalGoal === goal ? 'text-amber-400' : 'text-stone-300'
                  }`}>
                    {goal}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* KOR: 우선순위 선택 / ENG: Priority preference selection */}
          {currentStep === 'priorityPreference' && (
            <div className="grid grid-cols-1 gap-4">
              {priorityOptions.map((priority, idx) => {
                const icons = [Zap, DollarSign, Star, Award];
                const IconComp = icons[idx];
                const styleNames = ['SPEED EDIT', 'BUDGET LOOK', 'GUARANTEED FIT', 'SIGNATURE PIECE'];
                return (
                  <button
                    key={priority}
                    onClick={() => handleSelect('priorityPreference', priority)}
                    className={`group relative px-5 py-5 border text-left transition-all duration-300 overflow-hidden ${
                      input.priorityPreference === priority
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 border flex items-center justify-center shrink-0 ${
                        input.priorityPreference === priority
                          ? 'border-amber-400 bg-amber-400/20'
                          : 'border-stone-800 group-hover:border-stone-700'
                      }`}>
                        <IconComp className={`w-4 h-4 ${
                          input.priorityPreference === priority ? 'text-amber-400' : 'text-stone-600'
                        }`} />
                      </div>
                      <div>
                        <div className={`text-xs tracking-[0.2em] uppercase mb-1 font-light ${
                          input.priorityPreference === priority ? 'text-amber-400/60' : 'text-stone-700'
                        }`}>
                          {styleNames[idx]}
                        </div>
                        <div className={`text-sm font-light ${
                          input.priorityPreference === priority ? 'text-amber-400' : 'text-stone-300'
                        }`}>
                          {priority}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* KOR: 하단 고정 CTA / ENG: Bottom fixed CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-black via-black to-transparent pt-12 pb-8 px-6 z-20">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleNext}
              disabled={!hasCurrentValue}
              className={`w-full flex items-center justify-center gap-3 py-4 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300 ${
                hasCurrentValue
                  ? 'bg-amber-400 text-black hover:bg-amber-300'
                  : 'bg-stone-900 text-stone-700 cursor-not-allowed border border-stone-800'
              }`}
            >
              {currentStepIndex === STEPS.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  START THE SHOW
                </>
              ) : (
                <>
                  NEXT LOOK
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // KOR: 결과 화면 — 런웨이 쇼 형태
  // ENG: Result screen — Runway show format
  // ──────────────────────────────────────────────────────────────
  if (phase === 'result' && result) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* KOR: 결과 헤더 — 쇼 제목 / ENG: Result header — Show title */}
        <div className="relative border-b border-stone-900 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-amber-950/30 to-transparent" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-amber-400/60 text-xs tracking-[0.4em] uppercase block mb-2">
                  JobChaja Runway — SS25 Results
                </span>
                <h1 className="text-3xl md:text-4xl font-thin tracking-tight text-white">
                  YOUR <span className="font-black text-amber-400">COLLECTION</span>
                </h1>
                <p className="text-stone-500 text-xs mt-2 tracking-widest">
                  {result.pathways.length}개 경로가 런웨이를 걸었습니다 — {result.pathways.length} Pathways Walked the Runway
                </p>
              </div>
              <button
                onClick={() => { setPhase('intro'); setInput({}); setCurrentStepIndex(0); setSelectedPathway(0); }}
                className="text-stone-600 hover:text-amber-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* KOR: 컬렉션 요약 통계 / ENG: Collection summary stats */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400/60" />
                <span className="text-stone-400 text-xs tracking-wider">
                  {result.userInput.nationality} · {result.userInput.educationLevel?.split(' ')[0]}
                </span>
              </div>
              <div className="h-3 w-px bg-stone-800" />
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400/60" />
                <span className="text-stone-400 text-xs tracking-wider">
                  Top Score: {Math.max(...result.pathways.map((p) => p.feasibilityScore))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* KOR: 런웨이 경로 탭 셀렉터 / ENG: Runway pathway tab selector */}
          <div className="mb-8">
            <p className="text-stone-600 text-xs tracking-[0.3em] uppercase mb-4">Select Look</p>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {result.pathways.map((pathway, idx) => {
                const g = getRunwayGrade(pathway.feasibilityScore);
                return (
                  <button
                    key={pathway.id}
                    onClick={() => switchPathway(idx)}
                    className={`shrink-0 flex flex-col gap-1 px-4 py-3 border transition-all duration-200 min-w-[120px] ${
                      selectedPathway === idx
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <span className={`text-xs tracking-widest font-thin ${g.textColor}`}>
                      LOOK {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-xs font-light ${
                      selectedPathway === idx ? 'text-white' : 'text-stone-500'
                    }`}>
                      {pathway.feasibilityScore}%
                    </span>
                    <div className={`h-px mt-1 ${selectedPathway === idx ? 'bg-amber-400' : 'bg-stone-800'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* KOR: 메인 런웨이 카드 / ENG: Main runway card */}
          {currentPathway && grade && (
            <div
              ref={runwayRef}
              className={`transition-all duration-400 ${walkAnim ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}
            >
              {/* KOR: 경로 헤더 / ENG: Pathway header */}
              <div className="border border-stone-800 mb-6 overflow-hidden">
                <div className={`h-1 bg-linear-to-r ${grade.color}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className={`text-xs tracking-[0.3em] uppercase mb-2 font-light ${grade.textColor}`}>
                        {grade.label} · LOOK {String(selectedPathway + 1).padStart(2, '0')}
                      </div>
                      <h2 className="text-xl font-light text-white tracking-tight leading-tight">
                        {currentPathway.name}
                      </h2>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className={`text-3xl font-black ${grade.textColor}`}>
                        {currentPathway.feasibilityScore}
                      </div>
                      <div className="text-stone-600 text-xs tracking-widest">SCORE</div>
                    </div>
                  </div>

                  <p className="text-stone-400 text-sm font-light leading-relaxed border-l-2 border-amber-400/30 pl-4 mb-6">
                    {currentPathway.description}
                  </p>

                  {/* KOR: 핵심 지표 3개 / ENG: 3 key metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      {
                        icon: Clock,
                        label: 'Duration',
                        value: `${currentPathway.totalDurationMonths}mo`,
                        sub: `${Math.floor(currentPathway.totalDurationMonths / 12)}년 ${currentPathway.totalDurationMonths % 12}개월`,
                      },
                      {
                        icon: DollarSign,
                        label: 'Investment',
                        value: `$${(((currentPathway as any).estimatedCostUSD ?? currentPathway.estimatedCostWon ?? 0) / 1000).toFixed(0)}K`,
                        sub: `USD ${((currentPathway as any).estimatedCostUSD ?? currentPathway.estimatedCostWon ?? 0).toLocaleString()}`,
                      },
                      {
                        icon: Star,
                        label: 'Feasibility',
                        value: currentPathway.feasibilityLabel,
                        sub: getFeasibilityEmoji(currentPathway.feasibilityLabel),
                      },
                    ].map((metric) => (
                      <div key={metric.label} className="text-center py-4 border border-stone-900">
                        <metric.icon className="w-4 h-4 text-amber-400/60 mx-auto mb-2" />
                        <div className="text-xs text-stone-600 tracking-wider uppercase mb-1">{metric.label}</div>
                        <div className="text-sm font-semibold text-white">{metric.value}</div>
                        <div className="text-xs text-stone-600 mt-0.5">{metric.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KOR: 비자 체인 — 런웨이 워크 시각화 / ENG: Visa chain — Runway walk visualization */}
              <div className="border border-stone-800 p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-stone-800" />
                  <span className="text-xs text-amber-400 tracking-[0.3em] uppercase font-light">Runway Walk</span>
                  <div className="h-px flex-1 bg-stone-800" />
                </div>

                {/* KOR: 중앙 런웨이 라인 + 비자 스테이션 / ENG: Center runway line + visa stations */}
                <div className="relative">
                  {/* KOR: 런웨이 중앙 라인 / ENG: Runway center line */}
                  <div className="absolute top-6 left-0 right-0 h-px bg-linear-to-r from-amber-400/80 via-amber-400/40 to-amber-400/10" />

                  <div className="flex items-start justify-between relative z-10">
                    {(Array.isArray(currentPathway.visaChain) ? currentPathway.visaChain : []).map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-3 flex-1">
                        {/* KOR: 비자 스테이션 원 / ENG: Visa station circle */}
                        <div className={`w-12 h-12 border-2 flex items-center justify-center ${
                          idx === 0
                            ? 'border-amber-400 bg-amber-400/20'
                            : 'border-stone-700 bg-black'
                        }`}>
                          <span className="text-xs font-bold text-amber-400">{idx + 1}</span>
                        </div>
                        {/* KOR: 비자 코드 / ENG: Visa code */}
                        <div className="text-center">
                          <div className="text-xs font-semibold text-white tracking-wider">{step.visa}</div>
                          <div className="text-xs text-stone-600 mt-0.5">{step.duration}</div>
                        </div>
                      </div>
                    ))}
                    {/* KOR: 최종 도착지 / ENG: Final destination */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-2 border-amber-400 bg-amber-400 flex items-center justify-center">
                        <Crown className="w-5 h-5 text-black" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-semibold text-amber-400 tracking-wider">GOAL</div>
                        <div className="text-xs text-stone-600 mt-0.5">장기체류</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* KOR: 마일스톤 — 컬렉션 룩북 / ENG: Milestones — Collection lookbook */}
              <div className="border border-stone-800 p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-stone-800" />
                  <span className="text-xs text-amber-400 tracking-[0.3em] uppercase font-light">Lookbook</span>
                  <div className="h-px flex-1 bg-stone-800" />
                </div>

                <div className="space-y-4">
                  {currentPathway.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="shrink-0 flex flex-col items-center">
                        <div className="w-8 h-8 border border-stone-800 group-hover:border-amber-400/50 flex items-center justify-center text-base transition-colors">
                          {milestone.emoji}
                        </div>
                        {idx < currentPathway.milestones.length - 1 && (
                          <div className="w-px flex-1 bg-stone-900 mt-2 min-h-4" />
                        )}
                      </div>
                      <div className="pt-1 pb-4">
                        <div className="text-xs text-stone-600 tracking-widest uppercase mb-1">
                          LOOK {String(idx + 1).padStart(2, '0')}
                        </div>
                        <div className="text-sm font-light text-white mb-1">{milestone.title}</div>
                        <div className="text-xs text-stone-500 leading-relaxed font-light">
                          {milestone.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KOR: 에디터 노트 (접힘/펼침) / ENG: Editor note (collapsible) */}
              <div className="border border-stone-800 overflow-hidden mb-6">
                <button
                  onClick={() => setEditorNoteOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-stone-950 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-amber-400/60" />
                    <span className="text-xs tracking-[0.3em] uppercase text-stone-400 font-light">
                      Editor&apos;s Note
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-stone-600 transition-transform duration-300 ${editorNoteOpen ? 'rotate-90' : ''}`} />
                </button>
                {editorNoteOpen && (
                  <div className="px-6 pb-6 border-t border-stone-900">
                    <div className="pt-4 space-y-3">
                      <p className="text-stone-400 text-sm font-light leading-relaxed italic">
                        &ldquo;이 시즌 가장 주목받는 컬렉션. 기술과 열정이 만나는 지점에서, 당신의 한국 생활이 시작됩니다.&rdquo;
                      </p>
                      <p className="text-stone-600 text-xs font-light leading-relaxed">
                        &ldquo;The most attention-grabbing collection this season. Where technology meets passion, your life in Korea begins.&rdquo;
                      </p>
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-stone-900">
                        <div className="h-px flex-1 bg-stone-900" />
                        <span className="text-stone-700 text-xs tracking-widest">— JobChaja Visa Editor</span>
                      </div>
                      {/* KOR: 호환 경로 태그 / ENG: Compat pathway tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {mockPathways.map((mp: CompatPathway) => (
                          <span key={mp.id} className="px-3 py-1 border border-stone-800 text-stone-600 text-xs tracking-wider font-light">
                            {mp.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* KOR: 전체 경로 그리드 (미니 카드) / ENG: All pathways grid (mini cards) */}
              <div className="mb-8">
                <p className="text-stone-600 text-xs tracking-[0.3em] uppercase mb-4">Full Collection</p>
                <div className="space-y-3">
                  {result.pathways.map((pathway, idx) => {
                    const g = getRunwayGrade(pathway.feasibilityScore);
                    const scoreColorClass = getScoreColor(pathway.feasibilityLabel);
                    return (
                      <button
                        key={pathway.id}
                        onClick={() => switchPathway(idx)}
                        className={`w-full flex items-center gap-4 px-4 py-3 border text-left transition-all duration-200 ${
                          selectedPathway === idx
                            ? 'border-amber-400 bg-amber-400/5'
                            : 'border-stone-900 hover:border-stone-800'
                        }`}
                      >
                        <div className={`w-1 self-stretch ${selectedPathway === idx ? 'bg-amber-400' : 'bg-stone-800'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-xs tracking-widest font-thin ${g.textColor}`}>
                              LOOK {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full text-white ${scoreColorClass}`}>
                              {pathway.feasibilityLabel}
                            </span>
                          </div>
                          <div className="text-sm font-light text-stone-300 truncate">{pathway.name}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-lg font-bold ${g.textColor}`}>{pathway.feasibilityScore}</div>
                          <div className="text-stone-700 text-xs">{getFeasibilityEmoji(pathway.feasibilityLabel)}</div>
                        </div>
                        <ArrowRight className={`w-4 h-4 shrink-0 ${selectedPathway === idx ? 'text-amber-400' : 'text-stone-800'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* KOR: 하단 CTA — 재진단 또는 상담 / ENG: Bottom CTA — Rediagnose or consult */}
              <div className="border border-stone-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-stone-800" />
                  <Crown className="w-3 h-3 text-amber-400/50" />
                  <div className="h-px flex-1 bg-stone-800" />
                </div>
                <p className="text-stone-500 text-xs text-center mb-5 leading-relaxed tracking-wider">
                  더 정확한 맞춤 컨설팅을 원하시나요?<br />
                  <span className="text-stone-700">Looking for a personalized consultation?</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setPhase('intro'); setInput({}); setCurrentStepIndex(0); setSelectedPathway(0); }}
                    className="py-3 border border-stone-800 text-stone-400 text-xs tracking-[0.2em] uppercase hover:border-stone-600 hover:text-white transition-all duration-200"
                  >
                    NEW SHOW
                  </button>
                  <button className="py-3 bg-amber-400 text-black text-xs tracking-[0.2em] uppercase font-semibold hover:bg-amber-300 transition-colors flex items-center justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    CONSULT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // KOR: 폴백 (도달하지 않아야 함) / ENG: Fallback (should not be reached)
  return null;
}
