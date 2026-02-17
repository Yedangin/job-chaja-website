'use client';

// KOR: 네온사인 스타일 비자 진단 페이지 (디자인 #90)
// ENG: Neon Sign style visa diagnosis page (Design #90)

import { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Zap,
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  Circle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
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

// KOR: 네온 색상 팔레트 정의
// ENG: Neon color palette definition
const NEON_COLORS = [
  { id: 'cyan', label: 'Cyan', hex: '#00ffff', glow: 'shadow-[0_0_20px_#00ffff,0_0_40px_#00ffff]', text: 'text-cyan-400', border: 'border-cyan-400', bg: 'bg-cyan-400' },
  { id: 'pink', label: 'Pink', hex: '#ff00ff', glow: 'shadow-[0_0_20px_#ff00ff,0_0_40px_#ff00ff]', text: 'text-fuchsia-400', border: 'border-fuchsia-400', bg: 'bg-fuchsia-400' },
  { id: 'green', label: 'Green', hex: '#00ff88', glow: 'shadow-[0_0_20px_#00ff88,0_0_40px_#00ff88]', text: 'text-emerald-400', border: 'border-emerald-400', bg: 'bg-emerald-400' },
  { id: 'yellow', label: 'Yellow', hex: '#ffff00', glow: 'shadow-[0_0_20px_#ffff00,0_0_40px_#ffff00]', text: 'text-yellow-300', border: 'border-yellow-300', bg: 'bg-yellow-300' },
  { id: 'orange', label: 'Orange', hex: '#ff6600', glow: 'shadow-[0_0_20px_#ff6600,0_0_40px_#ff6600]', text: 'text-orange-400', border: 'border-orange-400', bg: 'bg-orange-400' },
  { id: 'purple', label: 'Purple', hex: '#bf00ff', glow: 'shadow-[0_0_20px_#bf00ff,0_0_40px_#bf00ff]', text: 'text-violet-400', border: 'border-violet-400', bg: 'bg-violet-400' },
];

// KOR: 비자 경로별 네온 색상 매핑
// ENG: Neon color mapping per pathway
const PATHWAY_NEON = ['cyan', 'pink', 'green', 'yellow', 'orange'];

// KOR: 입력 단계 정의 (6단계)
// ENG: Input step definitions (6 steps)
const STEPS = [
  { id: 1, label: '국적', labelEn: 'NATIONALITY', icon: '🌍' },
  { id: 2, label: '나이', labelEn: 'AGE', icon: '🎂' },
  { id: 3, label: '학력', labelEn: 'EDUCATION', icon: '🎓' },
  { id: 4, label: '자금', labelEn: 'BUDGET', icon: '💰' },
  { id: 5, label: '목표', labelEn: 'GOAL', icon: '🎯' },
  { id: 6, label: '우선순위', labelEn: 'PRIORITY', icon: '⚡' },
];

// KOR: 네온 텍스트 글로우 스타일 생성 함수
// ENG: Function to generate neon text glow style
function getNeonTextStyle(color: string): React.CSSProperties {
  return {
    color: color,
    textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`,
  };
}

// KOR: 네온 박스 글로우 스타일 생성 함수
// ENG: Function to generate neon box glow style
function getNeonBoxStyle(color: string): React.CSSProperties {
  return {
    borderColor: color,
    boxShadow: `0 0 10px ${color}, 0 0 20px ${color}40, inset 0 0 10px ${color}10`,
  };
}

// KOR: 메인 컴포넌트
// ENG: Main component
export default function Diagnosis90Page() {
  // KOR: 현재 단계 상태
  // ENG: Current step state
  const [currentStep, setCurrentStep] = useState<number>(1);

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 선택된 네온 색상 ID
  // ENG: Selected neon color ID
  const [selectedColorId, setSelectedColorId] = useState<string>('cyan');

  // KOR: 결과 표시 여부
  // ENG: Whether to show results
  const [showResult, setShowResult] = useState<boolean>(false);

  // KOR: 결과 데이터
  // ENG: Result data
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 확장된 경로 ID 세트
  // ENG: Set of expanded pathway IDs
  const [expandedPathways, setExpandedPathways] = useState<Set<string>>(new Set(['path-1']));

  // KOR: 연령 입력값 (문자열)
  // ENG: Age input value (string)
  const [ageInput, setAgeInput] = useState<string>('');

  // KOR: 현재 선택된 네온 색상 객체
  // ENG: Currently selected neon color object
  const selectedColor = NEON_COLORS.find((c) => c.id === selectedColorId) ?? NEON_COLORS[0];

  // KOR: 진단 실행 함수
  // ENG: Function to run diagnosis
  const handleDiagnose = () => {
    const finalInput: DiagnosisInput = {
      nationality: input.nationality ?? mockInput.nationality,
      age: input.age ?? mockInput.age,
      educationLevel: input.educationLevel ?? mockInput.educationLevel,
      availableAnnualFund: input.availableAnnualFund ?? mockInput.availableAnnualFund,
      finalGoal: input.finalGoal ?? mockInput.finalGoal,
      priorityPreference: input.priorityPreference ?? mockInput.priorityPreference,
    };
    setResult({ ...mockDiagnosisResult, userInput: finalInput });
    setShowResult(true);
  };

  // KOR: 다음 단계로 이동 함수
  // ENG: Function to move to next step
  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleDiagnose();
    }
  };

  // KOR: 이전 단계로 이동 함수
  // ENG: Function to move to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // KOR: 경로 토글 함수
  // ENG: Function to toggle pathway expansion
  const togglePathway = (id: string) => {
    setExpandedPathways((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // KOR: 초기화 함수
  // ENG: Reset function
  const handleReset = () => {
    setCurrentStep(1);
    setInput({});
    setAgeInput('');
    setShowResult(false);
    setResult(null);
    setExpandedPathways(new Set(['path-1']));
    setSelectedColorId('cyan');
  };

  // KOR: 현재 단계 완료 여부 확인
  // ENG: Check if current step is complete
  const isStepComplete = (): boolean => {
    switch (currentStep) {
      case 1: return !!input.nationality;
      case 2: return !!input.age && input.age > 0;
      case 3: return !!input.educationLevel;
      case 4: return !!input.availableAnnualFund;
      case 5: return !!input.finalGoal;
      case 6: return !!input.priorityPreference;
      default: return false;
    }
  };

  return (
    // KOR: 다크 배경 - 벽돌벽 질감을 CSS로 표현
    // ENG: Dark background - brick wall texture expressed via CSS
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: '#0a0a0a',
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 29px,
            #1a1a1a 29px,
            #1a1a1a 30px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 59px,
            #1a1a1a 59px,
            #1a1a1a 60px
          )
        `,
      }}
    >
      {/* KOR: 네온 배경 글로우 효과 */}
      {/* ENG: Neon background glow effects */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: selectedColor.hex }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: '#ff00ff' }}
        />
        <div
          className="absolute top-1/2 left-0 w-48 h-48 rounded-full blur-3xl opacity-5"
          style={{ backgroundColor: '#00ff88' }}
        />
      </div>

      {/* KOR: 메인 컨테이너 */}
      {/* ENG: Main container */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">

        {/* KOR: 헤더 - 네온사인 간판 스타일 */}
        {/* ENG: Header - neon sign board style */}
        <div className="text-center mb-8">
          <div
            className="inline-block px-8 py-4 border-2 rounded-lg mb-4"
            style={getNeonBoxStyle(selectedColor.hex)}
          >
            <p className="text-xs font-mono tracking-widest mb-1" style={{ color: '#888' }}>
              VISA DIAGNOSIS STUDIO
            </p>
            <h1
              className="text-4xl font-black tracking-wider font-mono"
              style={getNeonTextStyle(selectedColor.hex)}
            >
              네온 비자
            </h1>
            <h2
              className="text-2xl font-bold tracking-widest font-mono"
              style={getNeonTextStyle('#ffffff')}
            >
              NEON VISA
            </h2>
          </div>
          <p className="text-gray-500 text-sm font-mono">
            // 당신의 비자 경로를 네온사인으로 디자인하세요 //
          </p>
        </div>

        {/* KOR: 네온 색상 선택 팔레트 */}
        {/* ENG: Neon color selector palette */}
        <div className="mb-6">
          <p className="text-gray-500 text-xs font-mono mb-3 text-center tracking-widest">
            SELECT NEON COLOR / 네온 색상 선택
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {NEON_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColorId(color.id)}
                className="w-10 h-10 rounded-full border-2 transition-all duration-300 shrink-0"
                style={{
                  backgroundColor: color.hex + '33',
                  borderColor: selectedColorId === color.id ? color.hex : '#333',
                  boxShadow: selectedColorId === color.id
                    ? `0 0 15px ${color.hex}, 0 0 30px ${color.hex}80`
                    : 'none',
                }}
                title={color.label}
                aria-label={`Select ${color.label} neon color`}
              >
                <span
                  className="block w-full h-full rounded-full"
                  style={{ backgroundColor: color.hex + '88' }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* KOR: 결과 화면 */}
        {/* ENG: Result screen */}
        {showResult && result ? (
          <ResultDisplay
            result={result}
            expandedPathways={expandedPathways}
            togglePathway={togglePathway}
            onReset={handleReset}
            selectedColor={selectedColor}
            pathwayNeonColors={PATHWAY_NEON}
            allColors={NEON_COLORS}
          />
        ) : (
          /* KOR: 입력 단계 화면 */
          /* ENG: Input step screen */
          <InputFlow
            currentStep={currentStep}
            input={input}
            setInput={setInput}
            ageInput={ageInput}
            setAgeInput={setAgeInput}
            onNext={handleNext}
            onBack={handleBack}
            isStepComplete={isStepComplete}
            selectedColor={selectedColor}
            getNeonTextStyle={getNeonTextStyle}
            getNeonBoxStyle={getNeonBoxStyle}
          />
        )}
      </div>
    </div>
  );
}

// KOR: 입력 플로우 컴포넌트 Props 인터페이스
// ENG: Input flow component Props interface
interface InputFlowProps {
  currentStep: number;
  input: Partial<DiagnosisInput>;
  setInput: (val: Partial<DiagnosisInput>) => void;
  ageInput: string;
  setAgeInput: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
  isStepComplete: () => boolean;
  selectedColor: typeof NEON_COLORS[0];
  getNeonTextStyle: (color: string) => React.CSSProperties;
  getNeonBoxStyle: (color: string) => React.CSSProperties;
}

// KOR: 입력 플로우 서브 컴포넌트
// ENG: Input flow sub-component
function InputFlow({
  currentStep,
  input,
  setInput,
  ageInput,
  setAgeInput,
  onNext,
  onBack,
  isStepComplete,
  selectedColor,
  getNeonTextStyle,
  getNeonBoxStyle,
}: InputFlowProps) {

  const stepInfo = STEPS[currentStep - 1];
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div>
      {/* KOR: 단계 진행률 바 - 네온 튜브 스타일 */}
      {/* ENG: Step progress bar - neon tube style */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-mono text-gray-600 mb-2">
          <span>STEP {currentStep} / {STEPS.length}</span>
          <span>{Math.round(progress)}% COMPLETE</span>
        </div>
        <div
          className="h-2 rounded-full border"
          style={{ borderColor: '#333', backgroundColor: '#111' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: selectedColor.hex,
              boxShadow: `0 0 10px ${selectedColor.hex}, 0 0 20px ${selectedColor.hex}80`,
            }}
          />
        </div>
      </div>

      {/* KOR: 단계 아이콘 탭 */}
      {/* ENG: Step icon tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className="flex-1 text-center py-2 px-1 border rounded text-xs font-mono transition-all duration-300 min-w-[40px] shrink-0"
            style={
              step.id === currentStep
                ? { ...getNeonBoxStyle(selectedColor.hex), color: selectedColor.hex }
                : step.id < currentStep
                ? { borderColor: '#00ff8840', color: '#00ff8880', backgroundColor: '#00ff8810' }
                : { borderColor: '#333', color: '#555' }
            }
          >
            <div className="text-base">{step.icon}</div>
            <div className="hidden sm:block text-[10px] leading-tight mt-0.5">{step.labelEn}</div>
          </div>
        ))}
      </div>

      {/* KOR: 현재 단계 입력 카드 - 네온 간판 스타일 */}
      {/* ENG: Current step input card - neon signboard style */}
      <div
        className="border-2 rounded-xl p-6 mb-6 relative"
        style={{
          ...getNeonBoxStyle(selectedColor.hex),
          backgroundColor: '#080808',
        }}
      >
        {/* KOR: 단계 라벨 */}
        {/* ENG: Step label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{stepInfo.icon}</span>
          <div>
            <p className="text-[10px] font-mono tracking-widest text-gray-600">{stepInfo.labelEn}</p>
            <h3
              className="text-xl font-bold font-mono"
              style={getNeonTextStyle(selectedColor.hex)}
            >
              {stepInfo.label}
            </h3>
          </div>
        </div>

        {/* KOR: 단계별 입력 UI */}
        {/* ENG: Step-specific input UI */}
        <StepContent
          step={currentStep}
          input={input}
          setInput={setInput}
          ageInput={ageInput}
          setAgeInput={setAgeInput}
          selectedColor={selectedColor}
          getNeonTextStyle={getNeonTextStyle}
          getNeonBoxStyle={getNeonBoxStyle}
        />
      </div>

      {/* KOR: 네비게이션 버튼 */}
      {/* ENG: Navigation buttons */}
      <div className="flex gap-3">
        {currentStep > 1 && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-3 border rounded-lg font-mono text-sm transition-all duration-300"
            style={{ borderColor: '#444', color: '#888' }}
          >
            <ChevronLeft size={16} />
            BACK
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!isStepComplete()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-mono font-bold text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          style={isStepComplete() ? {
            backgroundColor: selectedColor.hex + '22',
            borderWidth: 2,
            borderColor: selectedColor.hex,
            color: selectedColor.hex,
            boxShadow: `0 0 15px ${selectedColor.hex}60`,
          } : {
            backgroundColor: '#111',
            borderWidth: 2,
            borderColor: '#333',
            color: '#555',
          }}
        >
          {currentStep < STEPS.length ? (
            <>NEXT <ChevronRight size={16} /></>
          ) : (
            <><Zap size={16} /> DIAGNOSE NOW</>
          )}
        </button>
      </div>
    </div>
  );
}

// KOR: 단계별 콘텐츠 Props
// ENG: Step content Props
interface StepContentProps {
  step: number;
  input: Partial<DiagnosisInput>;
  setInput: (val: Partial<DiagnosisInput>) => void;
  ageInput: string;
  setAgeInput: (val: string) => void;
  selectedColor: typeof NEON_COLORS[0];
  getNeonTextStyle: (color: string) => React.CSSProperties;
  getNeonBoxStyle: (color: string) => React.CSSProperties;
}

// KOR: 단계별 입력 콘텐츠 컴포넌트
// ENG: Step-by-step input content component
function StepContent({ step, input, setInput, ageInput, setAgeInput, selectedColor, getNeonTextStyle, getNeonBoxStyle }: StepContentProps) {

  // KOR: 네온 옵션 버튼 공통 스타일 헬퍼
  // ENG: Common style helper for neon option buttons
  const optionStyle = (isSelected: boolean): React.CSSProperties => isSelected
    ? { ...getNeonBoxStyle(selectedColor.hex), backgroundColor: selectedColor.hex + '22', color: selectedColor.hex }
    : { borderColor: '#333', backgroundColor: '#0d0d0d', color: '#666' };

  switch (step) {
    // KOR: 1단계 - 국적 선택
    // ENG: Step 1 - Nationality selection
    case 1:
      return (
        <div>
          <p className="text-gray-600 text-xs font-mono mb-4">SELECT YOUR NATIONALITY / 국적을 선택하세요</p>
          <div className="grid grid-cols-2 gap-2">
            {popularCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => setInput({ ...input, nationality: country.name })}
                className="flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm font-mono transition-all duration-200"
                style={optionStyle(input.nationality === country.name)}
              >
                <span className="text-lg shrink-0">{country.flag}</span>
                <span className="truncate">{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      );

    // KOR: 2단계 - 나이 입력
    // ENG: Step 2 - Age input
    case 2:
      return (
        <div>
          <p className="text-gray-600 text-xs font-mono mb-4">ENTER YOUR AGE / 나이를 입력하세요</p>
          <div className="flex flex-col items-center gap-4">
            <div
              className="text-7xl font-black font-mono min-w-[180px] text-center py-4 border-2 rounded-xl"
              style={getNeonBoxStyle(selectedColor.hex)}
            >
              <span style={getNeonTextStyle(selectedColor.hex)}>
                {ageInput || '??'}
              </span>
            </div>
            <p className="text-gray-600 text-xs font-mono">YEARS OLD</p>
            <div className="grid grid-cols-5 gap-2 w-full max-w-xs">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    const newVal = ageInput.length < 2 ? ageInput + num : ageInput;
                    setAgeInput(newVal);
                    const parsed = parseInt(newVal, 10);
                    if (!isNaN(parsed) && parsed > 0) {
                      setInput({ ...input, age: parsed });
                    }
                  }}
                  className="py-3 border rounded-lg font-mono font-bold text-lg transition-all duration-200"
                  style={{ borderColor: '#444', color: '#ccc', backgroundColor: '#111' }}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => {
                  const newVal = ageInput.slice(0, -1);
                  setAgeInput(newVal);
                  const parsed = parseInt(newVal, 10);
                  if (!isNaN(parsed) && parsed > 0) {
                    setInput({ ...input, age: parsed });
                  } else {
                    const { age: _, ...rest } = input;
                    setInput(rest);
                  }
                }}
                className="py-3 border rounded-lg font-mono font-bold text-sm transition-all duration-200 col-start-5"
                style={{ borderColor: '#444', color: '#ff6666', backgroundColor: '#111' }}
              >
                ⌫
              </button>
            </div>
          </div>
        </div>
      );

    // KOR: 3단계 - 학력 선택
    // ENG: Step 3 - Education level selection
    case 3:
      return (
        <div>
          <p className="text-gray-600 text-xs font-mono mb-4">SELECT EDUCATION / 학력을 선택하세요</p>
          <div className="flex flex-col gap-2">
            {educationOptions.map((edu) => (
              <button
                key={edu}
                onClick={() => setInput({ ...input, educationLevel: edu })}
                className="px-4 py-3 border rounded-lg text-sm font-mono text-left transition-all duration-200"
                style={optionStyle(input.educationLevel === edu)}
              >
                {edu}
              </button>
            ))}
          </div>
        </div>
      );

    // KOR: 4단계 - 자금 선택
    // ENG: Step 4 - Budget selection
    case 4:
      return (
        <div>
          <p className="text-gray-600 text-xs font-mono mb-4">ANNUAL BUDGET / 연간 가용 자금</p>
          <div className="flex flex-col gap-2">
            {fundOptions.map((fund) => (
              <button
                key={fund}
                onClick={() => setInput({ ...input, availableAnnualFund: fund })}
                className="flex items-center gap-3 px-4 py-3 border rounded-lg text-sm font-mono transition-all duration-200"
                style={optionStyle(input.availableAnnualFund === fund)}
              >
                <DollarSign size={16} className="shrink-0" />
                {fund}
              </button>
            ))}
          </div>
        </div>
      );

    // KOR: 5단계 - 최종 목표 선택
    // ENG: Step 5 - Final goal selection
    case 5:
      return (
        <div>
          <p className="text-gray-600 text-xs font-mono mb-4">FINAL GOAL / 최종 목표</p>
          <div className="flex flex-col gap-2">
            {goalOptions.map((goal) => (
              <button
                key={goal}
                onClick={() => setInput({ ...input, finalGoal: goal })}
                className="px-4 py-3 border rounded-lg text-sm font-mono text-left transition-all duration-200"
                style={optionStyle(input.finalGoal === goal)}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      );

    // KOR: 6단계 - 우선순위 선택
    // ENG: Step 6 - Priority selection
    case 6:
      return (
        <div>
          <p className="text-gray-600 text-xs font-mono mb-4">TOP PRIORITY / 우선순위</p>
          <div className="flex flex-col gap-2">
            {priorityOptions.map((priority) => (
              <button
                key={priority}
                onClick={() => setInput({ ...input, priorityPreference: priority })}
                className="flex items-center gap-3 px-4 py-3 border rounded-lg text-sm font-mono transition-all duration-200"
                style={optionStyle(input.priorityPreference === priority)}
              >
                <Zap size={16} className="shrink-0" />
                {priority}
              </button>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

// KOR: 결과 화면 Props
// ENG: Result display Props
interface ResultDisplayProps {
  result: DiagnosisResult;
  expandedPathways: Set<string>;
  togglePathway: (id: string) => void;
  onReset: () => void;
  selectedColor: typeof NEON_COLORS[0];
  pathwayNeonColors: string[];
  allColors: typeof NEON_COLORS;
}

// KOR: 결과 화면 컴포넌트 - 완성된 네온사인 = 비자 경로
// ENG: Result display component - completed neon sign = visa pathway
function ResultDisplay({
  result,
  expandedPathways,
  togglePathway,
  onReset,
  selectedColor,
  pathwayNeonColors,
  allColors,
}: ResultDisplayProps) {

  // KOR: 각 경로에 네온 색상 할당 헬퍼
  // ENG: Helper to assign neon color to each pathway
  const getPathwayColor = (index: number) => {
    const colorId = pathwayNeonColors[index % pathwayNeonColors.length];
    return allColors.find((c) => c.id === colorId) ?? allColors[0];
  };

  return (
    <div>
      {/* KOR: 결과 헤더 - 완성된 네온사인 간판 */}
      {/* ENG: Result header - completed neon sign board */}
      <div
        className="border-2 rounded-xl p-6 mb-6 text-center relative overflow-hidden"
        style={{
          borderColor: selectedColor.hex,
          backgroundColor: '#050505',
          boxShadow: `0 0 30px ${selectedColor.hex}40, inset 0 0 30px ${selectedColor.hex}05`,
        }}
      >
        {/* KOR: 배경 스캔라인 효과 */}
        {/* ENG: Background scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)',
            backgroundSize: '100% 3px',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={16} style={{ color: selectedColor.hex }} />
            <span className="text-xs font-mono tracking-widest" style={{ color: selectedColor.hex }}>
              VISA PATHWAYS ILLUMINATED
            </span>
            <Sparkles size={16} style={{ color: selectedColor.hex }} />
          </div>
          <h2
            className="text-3xl font-black font-mono mb-1"
            style={{
              color: selectedColor.hex,
              textShadow: `0 0 10px ${selectedColor.hex}, 0 0 30px ${selectedColor.hex}, 0 0 60px ${selectedColor.hex}`,
            }}
          >
            {result.pathways.length}개 경로
          </h2>
          <p className="text-gray-500 text-sm font-mono">비자 경로가 네온사인으로 완성되었습니다</p>

          {/* KOR: 사용자 입력 요약 태그 */}
          {/* ENG: User input summary tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {[
              result.userInput.nationality,
              `${result.userInput.age}세`,
              result.userInput.educationLevel,
              result.userInput.availableAnnualFund,
            ].map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-xs font-mono border"
                style={{ borderColor: '#333', color: '#888' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* KOR: 비자 경로 목록 - 각각 다른 네온 색상의 간판 */}
      {/* ENG: Visa pathway list - each as a different color neon sign */}
      <div className="flex flex-col gap-4 mb-6">
        {result.pathways.map((pathway, index) => {
          const pathColor = getPathwayColor(index);
          const isExpanded = expandedPathways.has(pathway.id);

          return (
            <PathwayCard
              key={pathway.id}
              pathway={pathway}
              rank={index + 1}
              pathColor={pathColor}
              isExpanded={isExpanded}
              onToggle={() => togglePathway(pathway.id)}
            />
          );
        })}
      </div>

      {/* KOR: 하단 액션 버튼 */}
      {/* ENG: Bottom action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 py-3 border rounded-lg font-mono text-sm transition-all duration-300"
          style={{
            borderColor: '#444',
            color: '#888',
            backgroundColor: '#0d0d0d',
          }}
        >
          <RotateCcw size={16} />
          다시 진단하기
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-lg font-mono font-bold text-sm transition-all duration-300"
          style={{
            borderColor: selectedColor.hex,
            color: selectedColor.hex,
            backgroundColor: selectedColor.hex + '15',
            boxShadow: `0 0 15px ${selectedColor.hex}40`,
          }}
        >
          <Lightbulb size={16} />
          상담 신청하기
        </button>
      </div>
    </div>
  );
}

// KOR: 경로 카드 Props
// ENG: Pathway card Props
interface PathwayCardProps {
  pathway: RecommendedPathway;
  rank: number;
  pathColor: typeof NEON_COLORS[0];
  isExpanded: boolean;
  onToggle: () => void;
}

// KOR: 개별 비자 경로 카드 - 네온사인 패널 스타일
// ENG: Individual visa pathway card - neon sign panel style
function PathwayCard({ pathway, rank, pathColor, isExpanded, onToggle }: PathwayCardProps) {

  // KOR: 실현가능성 점수에 따른 네온 바 너비 계산
  // ENG: Calculate neon bar width based on feasibility score
  const barWidth = `${pathway.feasibilityScore}%`;

  return (
    <div
      className="border-2 rounded-xl overflow-hidden transition-all duration-300"
      style={{
        borderColor: pathColor.hex,
        backgroundColor: '#060606',
        boxShadow: isExpanded
          ? `0 0 20px ${pathColor.hex}30, 0 0 40px ${pathColor.hex}10`
          : `0 0 10px ${pathColor.hex}20`,
      }}
    >
      {/* KOR: 카드 헤더 - 네온 간판 상단 */}
      {/* ENG: Card header - neon sign top bar */}
      <button
        className="w-full text-left"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        {/* KOR: 순위 표시 네온 스트립 */}
        {/* ENG: Rank display neon strip */}
        <div
          className="h-1 w-full"
          style={{
            backgroundColor: pathColor.hex,
            boxShadow: `0 0 10px ${pathColor.hex}`,
          }}
        />

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* KOR: 순위 배지 */}
              {/* ENG: Rank badge */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-black font-mono text-sm shrink-0 border-2"
                style={{
                  borderColor: pathColor.hex,
                  color: pathColor.hex,
                  backgroundColor: pathColor.hex + '20',
                }}
              >
                {rank}
              </div>

              <div className="flex-1 min-w-0">
                {/* KOR: 경로명 - 네온 글자 */}
                {/* ENG: Pathway name - neon text */}
                <h3
                  className="font-bold font-mono text-sm leading-tight mb-1"
                  style={{
                    color: pathColor.hex,
                    textShadow: `0 0 8px ${pathColor.hex}`,
                  }}
                >
                  {pathway.name}
                </h3>

                {/* KOR: 메타 정보 한 줄 */}
                {/* ENG: Meta info single line */}
                <div className="flex items-center gap-3 text-xs font-mono text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {pathway.totalDurationMonths}개월
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={10} />
                    ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* KOR: 실현가능성 + 토글 */}
            {/* ENG: Feasibility + toggle */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className="text-lg"
                title={pathway.feasibilityLabel}
              >
                {getFeasibilityEmoji(pathway.feasibilityLabel)}
              </span>
              <span
                className="text-xs font-mono font-bold"
                style={{ color: pathColor.hex }}
              >
                {pathway.feasibilityScore}%
              </span>
              <span className="text-gray-700 text-xs font-mono">
                {isExpanded ? '▲' : '▼'}
              </span>
            </div>
          </div>

          {/* KOR: 실현가능성 네온 진행 바 */}
          {/* ENG: Feasibility neon progress bar */}
          <div className="mt-3 h-1.5 rounded-full" style={{ backgroundColor: '#111' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: barWidth,
                backgroundColor: pathColor.hex,
                boxShadow: `0 0 8px ${pathColor.hex}`,
              }}
            />
          </div>

          {/* KOR: 비자 체인 미니 표시 */}
          {/* ENG: Visa chain mini display */}
          <div className="flex items-center gap-1 mt-3 flex-wrap">
            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span
                  className="px-2 py-0.5 rounded text-xs font-mono border"
                  style={{
                    borderColor: pathColor.hex + '60',
                    color: pathColor.hex + 'cc',
                    backgroundColor: pathColor.hex + '10',
                  }}
                >
                  {item.visa}
                </span>
                {idx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                  <ArrowRight size={10} style={{ color: pathColor.hex + '60' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </button>

      {/* KOR: 확장 상세 정보 */}
      {/* ENG: Expanded detail info */}
      {isExpanded && (
        <div
          className="border-t px-4 pb-4"
          style={{ borderColor: pathColor.hex + '30' }}
        >
          {/* KOR: 경로 설명 */}
          {/* ENG: Pathway description */}
          <p className="text-gray-500 text-xs font-mono leading-relaxed mt-4 mb-4">
            {pathway.description}
          </p>

          {/* KOR: 비자 체인 상세 */}
          {/* ENG: Visa chain detail */}
          <div className="mb-4">
            <p
              className="text-[10px] font-mono tracking-widest mb-2"
              style={{ color: pathColor.hex + '80' }}
            >
              VISA CHAIN / 비자 경로
            </p>
            <div className="flex flex-col gap-2">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-16 text-center py-1 rounded border text-xs font-mono font-bold shrink-0"
                    style={{
                      borderColor: pathColor.hex,
                      color: pathColor.hex,
                      backgroundColor: pathColor.hex + '15',
                    }}
                  >
                    {item.visa}
                  </div>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: pathColor.hex + '40' }}
                  />
                  <span className="text-gray-600 text-xs font-mono shrink-0">
                    {item.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* KOR: 마일스톤 */}
          {/* ENG: Milestones */}
          <div>
            <p
              className="text-[10px] font-mono tracking-widest mb-2"
              style={{ color: pathColor.hex + '80' }}
            >
              MILESTONES / 주요 단계
            </p>
            <div className="flex flex-col gap-2">
              {pathway.milestones.map((milestone, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs border shrink-0 mt-0.5"
                    style={{
                      borderColor: pathColor.hex + '60',
                      backgroundColor: pathColor.hex + '10',
                    }}
                  >
                    {milestone.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-mono font-semibold text-gray-300 leading-tight">
                      {milestone.title}
                    </p>
                    <p className="text-xs font-mono text-gray-600 leading-relaxed mt-0.5">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
