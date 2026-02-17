'use client';

// KOR: AR 카메라 스타일 비자 진단 페이지 (Design #91)
// ENG: AR Camera style visa diagnosis page (Design #91)
// KOR: Apple Vision Pro, Snapchat AR, Google Lens 레퍼런스 기반
// ENG: Inspired by Apple Vision Pro, Snapchat AR, Google Lens

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
  Camera,
  Scan,
  Target,
  Zap,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Circle,
  Globe,
  GraduationCap,
  DollarSign,
  Flag,
  Star,
  X,
  RefreshCw,
  Eye,
  Layers,
  Radio,
  Crosshair,
  TrendingUp,
  Clock,
  Shield,
} from 'lucide-react';

// KOR: 단계 정의 타입 / ENG: Step definition type
type StepKey =
  | 'nationality'
  | 'age'
  | 'educationLevel'
  | 'availableAnnualFund'
  | 'finalGoal'
  | 'priorityPreference';

// KOR: 각 단계 메타 정보 / ENG: Metadata for each step
interface StepMeta {
  key: StepKey;
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  hint: string;
}

// KOR: 스캔 상태 정의 / ENG: Scan state definition
type ScanState = 'idle' | 'scanning' | 'locked' | 'analyzing' | 'done';

// KOR: AR 오버레이 파티클 타입 / ENG: AR overlay particle type
interface ARParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

// KOR: 단계 메타데이터 배열 / ENG: Array of step metadata
const STEPS: StepMeta[] = [
  {
    key: 'nationality',
    label: '국적',
    labelEn: 'Nationality',
    icon: <Globe className="w-5 h-5" />,
    hint: '카메라로 여권을 스캔하거나 국적을 선택하세요',
  },
  {
    key: 'age',
    label: '나이',
    labelEn: 'Age',
    icon: <Target className="w-5 h-5" />,
    hint: '신분증을 스캔하거나 나이를 입력하세요',
  },
  {
    key: 'educationLevel',
    label: '학력',
    labelEn: 'Education',
    icon: <GraduationCap className="w-5 h-5" />,
    hint: '학위증을 스캔하거나 학력을 선택하세요',
  },
  {
    key: 'availableAnnualFund',
    label: '가용 자금',
    labelEn: 'Available Fund',
    icon: <DollarSign className="w-5 h-5" />,
    hint: '연간 사용 가능한 자금 범위를 선택하세요',
  },
  {
    key: 'finalGoal',
    label: '최종 목표',
    labelEn: 'Final Goal',
    icon: <Flag className="w-5 h-5" />,
    hint: '한국에서의 최종 목표를 선택하세요',
  },
  {
    key: 'priorityPreference',
    label: '우선순위',
    labelEn: 'Priority',
    icon: <Star className="w-5 h-5" />,
    hint: '가장 중요한 요소를 선택하세요',
  },
];

// KOR: AR 마커 코너 컴포넌트 / ENG: AR marker corner component
function ARCorner({
  position,
  active,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br';
  active: boolean;
}) {
  const corners = {
    tl: 'top-0 left-0 border-t-2 border-l-2 rounded-tl-sm',
    tr: 'top-0 right-0 border-t-2 border-r-2 rounded-tr-sm',
    bl: 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-sm',
    br: 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-sm',
  };

  return (
    <div
      className={`absolute w-6 h-6 ${corners[position]} transition-all duration-300 ${
        active ? 'border-cyan-400 opacity-100' : 'border-white/40 opacity-60'
      }`}
    />
  );
}

// KOR: 스캔 라인 컴포넌트 / ENG: Scan line component
function ScanLine({ active }: { active: boolean }) {
  return (
    <div
      className={`absolute left-0 right-0 h-px transition-all duration-300 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: active
          ? 'linear-gradient(90deg, transparent, rgba(34,211,238,0.8), rgba(34,211,238,1), rgba(34,211,238,0.8), transparent)'
          : 'transparent',
        animation: active ? 'scanMove 2s linear infinite' : 'none',
        top: '50%',
      }}
    />
  );
}

// KOR: AR 데이터 태그 컴포넌트 / ENG: AR data tag component
function ARDataTag({
  label,
  value,
  x,
  y,
  delay,
}: {
  label: string;
  value: string;
  x: string;
  y: string;
  delay: string;
}) {
  return (
    <div
      className="absolute flex items-center gap-2 opacity-0"
      style={{
        left: x,
        top: y,
        animation: `fadeInTag 0.5s ease-out ${delay} forwards`,
      }}
    >
      {/* KOR: 연결선 / ENG: Connector line */}
      <div className="w-8 h-px bg-cyan-400/60" />
      <div className="bg-black/70 border border-cyan-400/40 rounded px-2 py-1 backdrop-blur-sm">
        <div className="text-cyan-400/80 text-xs font-mono">{label}</div>
        <div className="text-white text-xs font-semibold">{value}</div>
      </div>
    </div>
  );
}

// KOR: 비자 결과 AR 카드 컴포넌트 / ENG: Visa result AR card component
function ARResultCard({
  pathway,
  index,
  isSelected,
  onClick,
}: {
  pathway: RecommendedPathway;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  // KOR: 실현가능성 점수에 따른 색상 / ENG: Color based on feasibility score
  const scoreColorMap: Record<string, string> = {
    '매우 높음': 'from-cyan-500 to-blue-500',
    높음: 'from-green-400 to-teal-500',
    보통: 'from-yellow-400 to-orange-400',
    낮음: 'from-orange-400 to-red-400',
    '매우 낮음': 'from-red-500 to-red-700',
  };

  const gradientClass =
    scoreColorMap[pathway.feasibilityLabel] || 'from-gray-400 to-gray-600';

  return (
    <div
      className={`relative cursor-pointer transition-all duration-500 group`}
      style={{
        animation: `slideInCard 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s both`,
      }}
      onClick={onClick}
    >
      {/* KOR: AR 홀로그램 배경 / ENG: AR hologram background */}
      <div
        className={`relative rounded-xl overflow-hidden border transition-all duration-300 ${
          isSelected
            ? 'border-cyan-400 shadow-lg shadow-cyan-400/30'
            : 'border-white/10 hover:border-white/30'
        }`}
        style={{
          background: isSelected
            ? 'linear-gradient(135deg, rgba(8,145,178,0.15), rgba(0,0,0,0.6))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(0,0,0,0.5))',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* KOR: 상단 스트라이프 / ENG: Top stripe */}
        <div className={`h-1 w-full bg-linear-to-r ${gradientClass}`} />

        <div className="p-4">
          {/* KOR: 헤더 행 / ENG: Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              {/* KOR: 비자 체인 배지들 / ENG: Visa chain badges */}
              <div className="flex flex-wrap gap-1 mb-2">
                {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-2 py-0.5 rounded-full border border-cyan-400/30 text-cyan-300 bg-cyan-950/40"
                  >
                    {v.visa}
                  </span>
                ))}
              </div>
              <h3 className="text-white font-semibold text-sm leading-snug">
                {pathway.name}
              </h3>
            </div>

            {/* KOR: 점수 원형 / ENG: Score circle */}
            <div className="shrink-0 relative w-12 h-12">
              <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(pathway.feasibilityScore / 100) * 94.2} 94.2`}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {pathway.feasibilityScore}
                </span>
              </div>
            </div>
          </div>

          {/* KOR: 통계 행 / ENG: Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <Clock className="w-3 h-3 text-cyan-400 mx-auto mb-0.5" />
              <div className="text-white text-xs font-bold">
                {pathway.totalDurationMonths}개월
              </div>
              <div className="text-white/40 text-xs">기간</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <DollarSign className="w-3 h-3 text-green-400 mx-auto mb-0.5" />
              <div className="text-white text-xs font-bold">
                ${(((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0) / 1000).toFixed(0)}K
              </div>
              <div className="text-white/40 text-xs">비용</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <TrendingUp className="w-3 h-3 text-purple-400 mx-auto mb-0.5" />
              <div className="text-white text-xs font-bold">
                {getFeasibilityEmoji(pathway.feasibilityLabel)}
              </div>
              <div className="text-white/40 text-xs">{pathway.feasibilityLabel}</div>
            </div>
          </div>

          {/* KOR: 선택된 카드의 세부 정보 / ENG: Detail view for selected card */}
          {isSelected && (
            <div
              className="border-t border-white/10 pt-3 space-y-2"
              style={{ animation: 'fadeInDetail 0.3s ease-out forwards' }}
            >
              <p className="text-white/60 text-xs leading-relaxed">
                {pathway.description}
              </p>
              <div className="space-y-1.5">
                {pathway.milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {/* KOR: AR 마일스톤 도트 / ENG: AR milestone dot */}
                    <div className="shrink-0 w-5 h-5 rounded-full bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center mt-0.5">
                      <span className="text-xs">{m.emoji}</span>
                    </div>
                    <div>
                      <div className="text-white/80 text-xs font-medium">{m.title}</div>
                      <div className="text-white/40 text-xs">{m.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* KOR: AR 호버 효과 라인 / ENG: AR hover effect line */}
        {isSelected && (
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(34,211,238,0.6), transparent)',
            }}
          />
        )}
      </div>
    </div>
  );
}

// KOR: 메인 AR 카메라 진단 컴포넌트 / ENG: Main AR Camera diagnosis component
export default function Diagnosis91Page() {
  // KOR: 현재 단계 인덱스 / ENG: Current step index
  const [currentStep, setCurrentStep] = useState<number>(0);
  // KOR: 스캔 상태 / ENG: Scan state
  const [scanState, setScanState] = useState<ScanState>('idle');
  // KOR: 사용자 입력 / ENG: User input
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // KOR: 결과 표시 여부 / ENG: Whether to show results
  const [showResults, setShowResults] = useState<boolean>(false);
  // KOR: 선택된 결과 카드 인덱스 / ENG: Selected result card index
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  // KOR: 나이 임시 입력값 / ENG: Temporary age input value
  const [ageInput, setAgeInput] = useState<string>('');
  // KOR: 카메라 그리드 애니메이션용 틱 / ENG: Tick for camera grid animation
  const [tick, setTick] = useState<number>(0);

  // KOR: 화면 스캔 틱 타이머 / ENG: Screen scan tick timer
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(interval);
  }, []);

  // KOR: 스텝 변경 시 스캔 애니메이션 실행 / ENG: Run scan animation on step change
  const triggerScan = () => {
    setScanState('scanning');
    setTimeout(() => setScanState('locked'), 1200);
    setTimeout(() => setScanState('idle'), 2000);
  };

  // KOR: 다음 단계로 이동 / ENG: Move to next step
  const handleNext = () => {
    triggerScan();
    setTimeout(() => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        // KOR: 분석 상태로 전환 / ENG: Transition to analyzing state
        setScanState('analyzing');
        setTimeout(() => {
          setScanState('done');
          setShowResults(true);
        }, 2500);
      }
    }, 600);
  };

  // KOR: 이전 단계로 이동 / ENG: Move to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setScanState('idle');
    }
  };

  // KOR: 값 선택 처리 / ENG: Handle value selection
  const handleSelect = (key: StepKey, value: string | number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  // KOR: 현재 단계의 값이 선택되었는지 확인 / ENG: Check if current step has a value
  const currentKey = STEPS[currentStep]?.key;
  const currentValue = input[currentKey as keyof DiagnosisInput];
  const hasValue = currentValue !== undefined && currentValue !== '';

  // KOR: 진행률 계산 / ENG: Calculate progress
  const progress = showResults ? 100 : (currentStep / STEPS.length) * 100;

  // KOR: 데모 데이터로 채우기 / ENG: Fill with demo data
  const fillDemo = () => {
    setInput(mockInput);
  };

  // KOR: 초기화 / ENG: Reset
  const handleReset = () => {
    setInput({});
    setCurrentStep(0);
    setShowResults(false);
    setScanState('idle');
    setSelectedCard(null);
    setAgeInput('');
  };

  return (
    <>
      {/* KOR: 전역 AR 스타일 / ENG: Global AR styles */}
      <style>{`
        @keyframes scanMove {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
        @keyframes fadeInTag {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInCard {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInDetail {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 1; }
          70% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes arGrid {
          0% { opacity: 0.03; }
          50% { opacity: 0.08; }
          100% { opacity: 0.03; }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes analyzeBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes glitch {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-2px, 1px); }
          94% { transform: translate(2px, -1px); }
          96% { transform: translate(-1px, 2px); }
        }
      `}</style>

      {/* KOR: 메인 컨테이너 — 어두운 배경 / ENG: Main container — dark background */}
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* KOR: AR 배경 그리드 / ENG: AR background grid */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'arGrid 4s ease-in-out infinite',
          }}
        />

        {/* KOR: 상단 AR HUD 헤더 / ENG: Top AR HUD header */}
        <div
          className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}
        >
          <div className="max-w-lg mx-auto flex items-center justify-between">
            {/* KOR: 좌상단 — 앱 이름 / ENG: Top-left — app name */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Camera className="w-5 h-5 text-cyan-400" />
                {/* KOR: 펄스 링 / ENG: Pulse ring */}
                <div
                  className="absolute inset-0 rounded-full border border-cyan-400"
                  style={{ animation: 'pulse-ring 2s ease-out infinite' }}
                />
              </div>
              <div>
                <div className="text-white text-sm font-bold tracking-wider font-mono">
                  JOBCHAJA
                </div>
                <div className="text-cyan-400/60 text-xs font-mono">AR VISA SCAN v2.0</div>
              </div>
            </div>

            {/* KOR: 중앙 — 진행 상태 표시 / ENG: Center — progress display */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i < currentStep
                      ? 'bg-cyan-400 w-4'
                      : i === currentStep && !showResults
                      ? 'bg-cyan-400/80 w-6'
                      : showResults
                      ? 'bg-cyan-400 w-4'
                      : 'bg-white/15 w-3'
                  }`}
                />
              ))}
            </div>

            {/* KOR: 우상단 — 상태 표시기 / ENG: Top-right — status indicator */}
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full bg-cyan-400"
                style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
              />
              <span className="text-cyan-400 text-xs font-mono">LIVE</span>
            </div>
          </div>
        </div>

        {/* KOR: 분석 중 오버레이 / ENG: Analyzing overlay */}
        {scanState === 'analyzing' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="text-center space-y-6 px-8">
              {/* KOR: 회전하는 스캔 원 / ENG: Rotating scan circle */}
              <div className="relative w-32 h-32 mx-auto">
                <div
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/20"
                  style={{ animation: 'spin-slow 4s linear infinite' }}
                />
                <div
                  className="absolute inset-2 rounded-full border-2 border-cyan-400/40 border-t-cyan-400"
                  style={{ animation: 'spin-slow 2s linear infinite reverse' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Scan className="w-10 h-10 text-cyan-400" />
                </div>
              </div>
              <div>
                <div
                  className="text-cyan-400 text-xl font-mono font-bold mb-1"
                  style={{ animation: 'glitch 3s infinite' }}
                >
                  ANALYZING...
                </div>
                <div className="text-white/60 text-sm font-mono">비자 매칭 엔진 실행 중</div>
              </div>
              {/* KOR: 로딩 바 / ENG: Loading bar */}
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-cyan-400 to-blue-400 rounded-full"
                  style={{ animation: 'analyzeBar 2.5s ease-out forwards' }}
                />
              </div>
              <div className="text-white/40 text-xs font-mono">
                31개 비자 유형 × 14개 평가 규칙
              </div>
            </div>
          </div>
        )}

        {/* KOR: 콘텐츠 영역 / ENG: Content area */}
        <div className="pt-16 pb-8 px-4 max-w-lg mx-auto">
          {!showResults ? (
            /* KOR: 입력 화면 — AR 뷰파인더 스타일 / ENG: Input screen — AR viewfinder style */
            <div className="space-y-4 mt-4">
              {/* KOR: AR 뷰파인더 박스 / ENG: AR viewfinder box */}
              <div className="relative mx-auto" style={{ maxWidth: '340px' }}>
                {/* KOR: 카메라 시뮬레이션 배경 / ENG: Camera simulation background */}
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    height: '200px',
                    background:
                      'linear-gradient(135deg, rgba(8,145,178,0.08), rgba(59,130,246,0.06), rgba(0,0,0,0.7))',
                    border: '1px solid rgba(34,211,238,0.2)',
                  }}
                >
                  {/* KOR: 카메라 그리드 오버레이 / ENG: Camera grid overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)
                      `,
                      backgroundSize: '30px 30px',
                    }}
                  />

                  {/* KOR: AR 마커 코너 / ENG: AR marker corners */}
                  <ARCorner position="tl" active={scanState !== 'idle'} />
                  <ARCorner position="tr" active={scanState !== 'idle'} />
                  <ARCorner position="bl" active={scanState !== 'idle'} />
                  <ARCorner position="br" active={scanState !== 'idle'} />

                  {/* KOR: 스캔 라인 / ENG: Scan line */}
                  <ScanLine active={scanState === 'scanning'} />

                  {/* KOR: 중앙 크로스헤어 / ENG: Center crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <Crosshair
                        className={`w-10 h-10 transition-colors duration-300 ${
                          scanState === 'locked' ? 'text-green-400' : 'text-cyan-400/60'
                        }`}
                      />
                      {scanState === 'locked' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* KOR: 현재 단계 AR 태그 / ENG: Current step AR tag */}
                  {currentValue && (
                    <>
                      <ARDataTag
                        label={STEPS[currentStep]?.labelEn ?? ''}
                        value={String(currentValue)}
                        x="8px"
                        y="20%"
                        delay="0s"
                      />
                      <ARDataTag
                        label="STATUS"
                        value="CONFIRMED"
                        x="50%"
                        y="65%"
                        delay="0.2s"
                      />
                    </>
                  )}

                  {/* KOR: 상단 HUD 정보 / ENG: Top HUD info */}
                  <div className="absolute top-3 right-3 text-right">
                    <div className="text-cyan-400/60 text-xs font-mono">
                      STEP {currentStep + 1}/{STEPS.length}
                    </div>
                    <div className="text-white/40 text-xs font-mono">
                      {STEPS[currentStep]?.labelEn}
                    </div>
                  </div>

                  {/* KOR: 하단 HUD 힌트 / ENG: Bottom HUD hint */}
                  <div
                    className="absolute bottom-0 left-0 right-0 px-3 py-2"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Radio className="w-3 h-3 text-cyan-400/60 shrink-0" />
                      <span className="text-white/50 text-xs font-mono truncate">
                        {STEPS[currentStep]?.hint}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* KOR: 단계 제목 / ENG: Step title */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="text-cyan-400">{STEPS[currentStep]?.icon}</div>
                  <h2 className="text-white text-lg font-bold">
                    {STEPS[currentStep]?.label}
                  </h2>
                </div>
                <p className="text-white/40 text-sm">
                  {STEPS[currentStep]?.labelEn} Detection
                </p>
              </div>

              {/* KOR: 입력 옵션 패널 / ENG: Input options panel */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(34,211,238,0.12)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="p-4">
                  {/* KOR: 국적 선택 / ENG: Nationality selection */}
                  {currentKey === 'nationality' && (
                    <div className="grid grid-cols-3 gap-2">
                      {popularCountries.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => handleSelect('nationality', country.name)}
                          className={`flex items-center gap-1.5 px-2 py-2 rounded-xl transition-all duration-200 text-left ${
                            input.nationality === country.name
                              ? 'bg-cyan-500/20 border border-cyan-400/60 text-white'
                              : 'bg-white/4 border border-white/8 text-white/70 hover:border-white/20'
                          }`}
                        >
                          <span className="text-base shrink-0">{country.flag}</span>
                          <span className="text-xs font-medium truncate">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* KOR: 나이 입력 / ENG: Age input */}
                  {currentKey === 'age' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={ageInput}
                          onChange={(e) => {
                            setAgeInput(e.target.value);
                            const num = parseInt(e.target.value);
                            if (!isNaN(num) && num > 0 && num < 100) {
                              handleSelect('age', num);
                            }
                          }}
                          placeholder="나이 입력 (예: 25)"
                          className="flex-1 bg-white/5 border border-cyan-400/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-cyan-400/60 transition-colors"
                        />
                        <span className="text-white/50 text-sm font-mono">세</span>
                      </div>
                      {/* KOR: 빠른 선택 버튼 / ENG: Quick select buttons */}
                      <div className="flex flex-wrap gap-2">
                        {[20, 25, 30, 35, 40, 45].map((age) => (
                          <button
                            key={age}
                            onClick={() => {
                              setAgeInput(String(age));
                              handleSelect('age', age);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all duration-200 ${
                              input.age === age
                                ? 'bg-cyan-500/25 border border-cyan-400/60 text-cyan-300'
                                : 'bg-white/5 border border-white/10 text-white/60 hover:border-white/25'
                            }`}
                          >
                            {age}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KOR: 학력 선택 / ENG: Education selection */}
                  {currentKey === 'educationLevel' && (
                    <div className="space-y-2">
                      {educationOptions.map((option) => (
                        <button
                          key={String(option.value)}
                          onClick={() => handleSelect('educationLevel', option.value)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                            input.educationLevel === option.value
                              ? 'bg-cyan-500/20 border border-cyan-400/60 text-white'
                              : 'bg-white/4 border border-white/8 text-white/70 hover:border-white/20'
                          }`}
                        >
                          <span className="text-sm">{option.labelKo}</span>
                          {input.educationLevel === option.value && (
                            <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* KOR: 가용 자금 선택 / ENG: Available fund selection */}
                  {currentKey === 'availableAnnualFund' && (
                    <div className="space-y-2">
                      {fundOptions.map((option) => (
                        <button
                          key={String(option.value)}
                          onClick={() => handleSelect('availableAnnualFund', option.value)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                            input.availableAnnualFund === option.value
                              ? 'bg-cyan-500/20 border border-cyan-400/60 text-white'
                              : 'bg-white/4 border border-white/8 text-white/70 hover:border-white/20'
                          }`}
                        >
                          <span className="text-sm font-mono">{option.labelKo}</span>
                          {input.availableAnnualFund === option.value && (
                            <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* KOR: 최종 목표 선택 / ENG: Final goal selection */}
                  {currentKey === 'finalGoal' && (
                    <div className="space-y-2">
                      {goalOptions.map((option) => (
                        <button
                          key={String(option.value)}
                          onClick={() => handleSelect('finalGoal', option.value)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                            input.finalGoal === option.value
                              ? 'bg-cyan-500/20 border border-cyan-400/60 text-white'
                              : 'bg-white/4 border border-white/8 text-white/70 hover:border-white/20'
                          }`}
                        >
                          <span className="text-sm">{option.labelKo}</span>
                          {input.finalGoal === option.value && (
                            <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* KOR: 우선순위 선택 / ENG: Priority selection */}
                  {currentKey === 'priorityPreference' && (
                    <div className="grid grid-cols-2 gap-2">
                      {priorityOptions.map((option) => (
                        <button
                          key={String(option.value)}
                          onClick={() => handleSelect('priorityPreference', option.value)}
                          className={`flex items-center gap-2 px-3 py-3 rounded-xl transition-all duration-200 text-left ${
                            input.priorityPreference === option.value
                              ? 'bg-cyan-500/20 border border-cyan-400/60 text-white'
                              : 'bg-white/4 border border-white/8 text-white/70 hover:border-white/20'
                          }`}
                        >
                          {input.priorityPreference === option.value ? (
                            <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-white/20 shrink-0" />
                          )}
                          <span className="text-xs">{option.labelKo}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* KOR: 액션 버튼 행 / ENG: Action button row */}
              <div className="flex gap-3">
                {/* KOR: 뒤로 버튼 / ENG: Back button */}
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:border-white/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* KOR: 데모 채우기 버튼 / ENG: Fill demo button */}
                <button
                  onClick={fillDemo}
                  className="flex items-center justify-center gap-1.5 flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:border-white/25 text-xs font-mono transition-all duration-200"
                >
                  <Zap className="w-3.5 h-3.5" />
                  DEMO
                </button>

                {/* KOR: 스캔 / 다음 버튼 / ENG: Scan / Next button */}
                <button
                  onClick={handleNext}
                  disabled={!hasValue}
                  className={`flex items-center justify-center gap-2 flex-1 h-12 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    hasValue
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/30'
                      : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {currentStep < STEPS.length - 1 ? (
                    <>
                      <Scan className="w-4 h-4" />
                      SCAN & NEXT
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      ANALYZE
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* KOR: 결과 화면 — AR 카드 오버레이 스타일 / ENG: Results screen — AR card overlay style */
            <div className="mt-4 space-y-4">
              {/* KOR: 결과 헤더 HUD / ENG: Results header HUD */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(8,145,178,0.08)',
                  border: '1px solid rgba(34,211,238,0.25)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                        AR Visa Overlay
                      </span>
                    </div>
                    <h2 className="text-white text-lg font-bold">
                      비자 매칭 완료
                    </h2>
                    <p className="text-white/50 text-sm mt-0.5">
                      {mockDiagnosisResult.pathways.length}개 경로가 감지되었습니다
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:border-white/25 text-xs font-mono transition-all"
                  >
                    <RefreshCw className="w-3 h-3" />
                    재스캔
                  </button>
                </div>

                {/* KOR: 입력값 요약 태그들 / ENG: Input summary tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {input.nationality && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/25 text-cyan-300 text-xs font-mono">
                      {popularCountries.find((c) => c.name === input.nationality)?.flag}{' '}
                      {input.nationality}
                    </span>
                  )}
                  {input.age && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/25 text-cyan-300 text-xs font-mono">
                      {input.age}세
                    </span>
                  )}
                  {input.educationLevel && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/25 text-cyan-300 text-xs font-mono">
                      {input.educationLevel}
                    </span>
                  )}
                  {input.priorityPreference && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/25 text-cyan-300 text-xs font-mono">
                      {input.priorityPreference}
                    </span>
                  )}
                </div>
              </div>

              {/* KOR: AR 결과 카드 목록 / ENG: AR result card list */}
              <div className="space-y-3">
                {mockDiagnosisResult.pathways.map((pathway, index) => (
                  <ARResultCard
                    key={pathway.id}
                    pathway={pathway}
                    index={index}
                    isSelected={selectedCard === index}
                    onClick={() =>
                      setSelectedCard(selectedCard === index ? null : index)
                    }
                  />
                ))}
              </div>

              {/* KOR: 하단 AR 정보 패널 / ENG: Bottom AR info panel */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-cyan-400/60" />
                  <span className="text-white/40 text-xs font-mono uppercase tracking-wider">
                    Scan Metadata
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-white text-lg font-bold font-mono">31</div>
                    <div className="text-white/30 text-xs">비자 유형</div>
                  </div>
                  <div className="text-center border-x border-white/5">
                    <div className="text-white text-lg font-bold font-mono">14</div>
                    <div className="text-white/30 text-xs">평가 규칙</div>
                  </div>
                  <div className="text-center">
                    <div className="text-cyan-400 text-lg font-bold font-mono">
                      {mockDiagnosisResult.pathways.length}
                    </div>
                    <div className="text-white/30 text-xs">매칭 결과</div>
                  </div>
                </div>
              </div>

              {/* KOR: 호환 비자 경로 빠른 참조 / ENG: Compatible visa pathway quick reference */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-cyan-400/60" />
                  <span className="text-white/40 text-xs font-mono uppercase tracking-wider">
                    Compatible Pathways
                  </span>
                </div>
                <div className="space-y-2">
                  {mockPathways.map((pathway: CompatPathway) => (
                    <div
                      key={pathway.id}
                      className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <div className="text-white/70 text-sm">{pathway.name}</div>
                        <div className="flex gap-1 mt-0.5">
                          {((pathway as any).tags ?? (pathway as any).highlights ?? []).map((tag: string) => (
                            <span
                              key={tag}
                              className="text-xs text-white/30 font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
