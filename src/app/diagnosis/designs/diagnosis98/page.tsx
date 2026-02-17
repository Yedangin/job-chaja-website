'use client';

// KOR: 비자 진단 페이지 - DNA 분석 스타일 (디자인 #98)
// ENG: Visa diagnosis page - DNA Analysis style (Design #98)
// 참고: 23andMe, AncestryDNA, MyHeritage, Nebula Genomics, Color Health
// Reference: 23andMe, AncestryDNA, MyHeritage, Nebula Genomics, Color Health

import { useState, useEffect, useCallback } from 'react';
import {
  Dna,
  FlaskConical,
  Microscope,
  Activity,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  TrendingUp,
  AlertCircle,
  Globe,
  GraduationCap,
  Target,
  Zap,
  BarChart3,
  Beaker,
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

// KOR: 단계 정의 타입
// ENG: Step definition type
type StepKey =
  | 'nationality'
  | 'age'
  | 'educationLevel'
  | 'availableAnnualFund'
  | 'finalGoal'
  | 'priorityPreference';

// KOR: 분석 단계 상태 타입
// ENG: Analysis phase state type
type Phase = 'input' | 'analyzing' | 'result';

// KOR: DNA 염기 타입 (시각적 표현용)
// ENG: DNA base type (for visual representation)
type DnaBase = 'A' | 'T' | 'C' | 'G';

// KOR: 유전자 마커 - 각 입력 필드를 DNA 마커로 표현
// ENG: Gene markers - represent each input field as DNA markers
const GENE_MARKERS: Record<StepKey, { label: string; labelEn: string; gene: string; color: string }> = {
  nationality: { label: '국적 유전자', labelEn: 'Nationality Gene', gene: 'NAT-1', color: 'text-emerald-400' },
  age: { label: '연령 마커', labelEn: 'Age Marker', gene: 'AGE-2', color: 'text-violet-400' },
  educationLevel: { label: '학력 염색체', labelEn: 'Education Chromosome', gene: 'EDU-3', color: 'text-teal-400' },
  availableAnnualFund: { label: '자금 시퀀스', labelEn: 'Fund Sequence', gene: 'FND-4', color: 'text-purple-400' },
  finalGoal: { label: '목표 발현', labelEn: 'Goal Expression', gene: 'GOL-5', color: 'text-green-400' },
  priorityPreference: { label: '우선순위 코드', labelEn: 'Priority Code', gene: 'PRI-6', color: 'text-fuchsia-400' },
};

// KOR: 분석 로그 메시지 목록
// ENG: Analysis log message list
const ANALYSIS_LOGS: string[] = [
  'DNA 샘플 추출 중... / Extracting DNA sample...',
  '유전자 시퀀싱 시작... / Starting gene sequencing...',
  '국적 마커 분석 완료 / Nationality marker analyzed',
  '학력 염색체 스캔 중... / Scanning education chromosome...',
  '비자 호환성 배열 매핑... / Mapping visa compatibility array...',
  '이중 나선 구조 정렬... / Aligning double helix structure...',
  '이민 경로 유전자 발현 확인... / Confirming immigration pathway gene expression...',
  '실현 가능성 점수 계산 중... / Calculating feasibility scores...',
  '최적 비자 경로 분리 완료 / Optimal visa pathway isolated',
  'DNA 리포트 생성 중... / Generating DNA report...',
];

// KOR: DNA 나선 시각화를 위한 염기쌍 생성
// ENG: Generate base pairs for DNA helix visualization
function generateDnaPairs(): { left: DnaBase; right: DnaBase }[] {
  const pairs: [DnaBase, DnaBase][] = [
    ['A', 'T'],
    ['T', 'A'],
    ['C', 'G'],
    ['G', 'C'],
  ];
  return Array.from({ length: 12 }, (_, i) => {
    const pair = pairs[i % pairs.length];
    return { left: pair[0], right: pair[1] };
  });
}

// KOR: 염기 색상 반환 함수
// ENG: Return base color function
function getBaseColor(base: DnaBase): string {
  const colors: Record<DnaBase, string> = {
    A: 'bg-emerald-400',
    T: 'bg-violet-400',
    C: 'bg-teal-400',
    G: 'bg-purple-400',
  };
  return colors[base];
}

// KOR: DNA 나선 시각화 컴포넌트
// ENG: DNA helix visualization component
function DnaHelixVisual({ animated = true }: { animated?: boolean }) {
  const pairs = generateDnaPairs();

  return (
    <div className="relative flex flex-col items-center gap-1 py-2">
      {pairs.map((pair, i) => (
        <div
          key={i}
          className="flex items-center gap-1"
          style={{
            transform: `translateX(${Math.sin((i / pairs.length) * Math.PI * 2) * 20}px)`,
            transition: animated ? `transform 0.3s ease ${i * 0.05}s` : 'none',
          }}
        >
          {/* KOR: 왼쪽 염기 / ENG: Left base */}
          <div
            className={`w-6 h-4 rounded-full ${getBaseColor(pair.left)} flex items-center justify-center text-white text-xs font-bold shrink-0`}
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          >
            {pair.left}
          </div>

          {/* KOR: 중간 연결선 / ENG: Middle connector */}
          <div
            className="w-8 h-0.5 bg-linear-to-br from-emerald-300/60 to-violet-300/60 rounded-full"
            style={{
              opacity: 0.4 + Math.abs(Math.sin((i / pairs.length) * Math.PI)) * 0.6,
            }}
          />

          {/* KOR: 오른쪽 염기 / ENG: Right base */}
          <div
            className={`w-6 h-4 rounded-full ${getBaseColor(pair.right)} flex items-center justify-center text-white text-xs font-bold shrink-0`}
          >
            {pair.right}
          </div>
        </div>
      ))}
    </div>
  );
}

// KOR: 분석 진행 바 컴포넌트
// ENG: Analysis progress bar component
function AnalysisProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-emerald-900/50">
      <div
        className="h-full bg-linear-to-br from-emerald-400 to-violet-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
        style={{ width: `${progress}%` }}
      >
        {/* KOR: 스캔 효과 / ENG: Scan effect */}
        <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent animate-pulse" />
      </div>
    </div>
  );
}

// KOR: 퍼센티지 링 차트 컴포넌트
// ENG: Percentage ring chart component
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // KOR: 점수에 따른 색상 결정 / ENG: Determine color based on score
  const strokeColor = score >= 80 ? '#34d399' : score >= 60 ? '#a78bfa' : score >= 40 ? '#fbbf24' : '#f87171';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* KOR: 배경 링 / ENG: Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1f2937"
          strokeWidth={6}
        />
        {/* KOR: 점수 링 / ENG: Score ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      {/* KOR: 중앙 점수 텍스트 / ENG: Center score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-white leading-none">{score}</span>
        <span className="text-xs text-gray-400">%</span>
      </div>
    </div>
  );
}

// KOR: 유전자 맵 컴포넌트 (입력 완료된 조건들을 유전자 코드처럼 표시)
// ENG: Genome map component (display completed conditions as genetic codes)
function GenomeMap({ input }: { input: Partial<DiagnosisInput> }) {
  const steps: StepKey[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'];

  return (
    <div className="bg-gray-900/80 border border-emerald-900/40 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Dna className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">유전자 맵 / Genome Map</span>
      </div>
      <div className="space-y-2">
        {steps.map((step) => {
          const marker = GENE_MARKERS[step];
          const value = input[step];
          const isComplete = value !== undefined && value !== '';

          return (
            <div key={step} className="flex items-center gap-3">
              {/* KOR: 유전자 코드 레이블 / ENG: Gene code label */}
              <span className={`text-xs font-mono font-bold w-16 shrink-0 ${marker.color}`}>
                {marker.gene}
              </span>
              {/* KOR: 진행 바 / ENG: Progress bar */}
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                {isComplete && (
                  <div className={`h-full rounded-full bg-linear-to-br from-emerald-400 to-violet-500 w-full transition-all duration-500`} />
                )}
              </div>
              {/* KOR: 값 표시 / ENG: Value display */}
              <span className="text-xs text-gray-400 w-24 truncate text-right">
                {isComplete
                  ? typeof value === 'number'
                    ? String(value)
                    : String(value).substring(0, 12)
                  : '---'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// KOR: 경로 카드 컴포넌트 - DNA 리포트 스타일
// ENG: Pathway card component - DNA report style
function PathwayCard({ pathway, index }: { pathway: RecommendedPathway; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="bg-gray-900 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-emerald-700/50 transition-all duration-300">
      {/* KOR: 카드 헤더 / ENG: Card header */}
      <div
        className="p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* KOR: 점수 링 / ENG: Score ring */}
            <div className="shrink-0">
              <ScoreRing score={pathway.feasibilityScore} size={72} />
            </div>

            {/* KOR: 경로 정보 / ENG: Pathway info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                  PATH-{String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-xs text-gray-400">{getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}</span>
              </div>
              <h3 className="text-white font-bold text-base mb-1 leading-tight">{pathway.name}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{pathway.description}</p>
            </div>
          </div>

          {/* KOR: 펼치기/접기 버튼 / ENG: Expand/collapse button */}
          <div className="shrink-0 text-gray-500 mt-1">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        {/* KOR: 통계 요약 / ENG: Stats summary */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5 text-violet-400" />
            <span>{pathway.totalDurationMonths}개월</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>비자 {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length}단계</span>
          </div>
        </div>
      </div>

      {/* KOR: 확장 상세 내용 / ENG: Expanded detail content */}
      {expanded && (
        <div className="border-t border-gray-800 p-5 space-y-5">
          {/* KOR: 비자 체인 / ENG: Visa chain */}
          <div>
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              비자 시퀀스 / Visa Sequence
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="bg-gray-800 border border-emerald-900/40 rounded-lg px-3 py-2 text-center">
                    <div className="text-white font-bold text-sm">{item.visa}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{item.duration}</div>
                  </div>
                  {idx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* KOR: 마일스톤 / ENG: Milestones */}
          <div>
            <h4 className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" />
              발현 단계 / Expression Stages
            </h4>
            <div className="space-y-3">
              {pathway.milestones.map((milestone, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="shrink-0 w-7 h-7 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-sm">
                    {milestone.emoji}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{milestone.title}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{milestone.description}</div>
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

// KOR: 메인 페이지 컴포넌트
// ENG: Main page component
export default function Diagnosis98Page() {
  // KOR: 현재 단계 (입력 흐름)
  // ENG: Current step (input flow)
  const [currentStep, setCurrentStep] = useState<number>(0);

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 분석 단계 (입력 → 분석중 → 결과)
  // ENG: Analysis phase (input → analyzing → result)
  const [phase, setPhase] = useState<Phase>('input');

  // KOR: 분석 진행률
  // ENG: Analysis progress percentage
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);

  // KOR: 현재 로그 메시지 인덱스
  // ENG: Current log message index
  const [logIndex, setLogIndex] = useState<number>(0);

  // KOR: 분석 로그 목록
  // ENG: Analysis log list
  const [logs, setLogs] = useState<string[]>([]);

  // KOR: 결과 데이터
  // ENG: Result data
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 나이 입력값 (문자열로 관리)
  // ENG: Age input value (managed as string)
  const [ageInput, setAgeInput] = useState<string>('');

  // KOR: 입력 단계 정의
  // ENG: Input step definitions
  const steps: StepKey[] = [
    'nationality',
    'age',
    'educationLevel',
    'availableAnnualFund',
    'finalGoal',
    'priorityPreference',
  ];

  const totalSteps = steps.length;
  const currentStepKey = steps[currentStep];

  // KOR: 분석 시뮬레이션 실행
  // ENG: Run analysis simulation
  const runAnalysis = useCallback(() => {
    setPhase('analyzing');
    setAnalysisProgress(0);
    setLogIndex(0);
    setLogs([]);

    let progress = 0;
    let logIdx = 0;

    const interval = setInterval(() => {
      // KOR: 진행률 증가
      // ENG: Increase progress
      progress += Math.random() * 12 + 4;
      if (progress >= 100) progress = 100;
      setAnalysisProgress(Math.min(progress, 100));

      // KOR: 로그 추가
      // ENG: Add log
      if (logIdx < ANALYSIS_LOGS.length) {
        setLogs((prev) => [...prev, ANALYSIS_LOGS[logIdx]]);
        logIdx++;
        setLogIndex(logIdx);
      }

      // KOR: 분석 완료 시
      // ENG: When analysis is complete
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setResult(mockDiagnosisResult);
          setPhase('result');
        }, 800);
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  // KOR: 다음 단계로 이동
  // ENG: Move to next step
  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // KOR: 마지막 단계 완료 → 분석 시작
      // ENG: Last step complete → start analysis
      runAnalysis();
    }
  }, [currentStep, totalSteps, runAnalysis]);

  // KOR: 옵션 선택 핸들러
  // ENG: Option selection handler
  const handleSelect = useCallback(
    (key: StepKey, value: string | number) => {
      setInput((prev) => ({ ...prev, [key]: value }));
      // KOR: 나이 단계인 경우 문자열 상태도 업데이트
      // ENG: Update string state if age step
      if (key === 'age') setAgeInput(String(value));
    },
    []
  );

  // KOR: 처음부터 다시 시작
  // ENG: Restart from beginning
  const handleReset = useCallback(() => {
    setPhase('input');
    setCurrentStep(0);
    setInput({});
    setAgeInput('');
    setResult(null);
    setAnalysisProgress(0);
    setLogs([]);
  }, []);

  // KOR: 현재 단계에 값이 선택되어 있는지 확인
  // ENG: Check if current step has a value selected
  const hasCurrentValue = (() => {
    if (currentStepKey === 'age') return ageInput !== '' && !isNaN(Number(ageInput)) && Number(ageInput) > 0;
    return input[currentStepKey] !== undefined && input[currentStepKey] !== '';
  })();

  // KOR: 진행률 계산 (입력 단계)
  // ENG: Calculate progress (input phase)
  const inputProgress = Math.round(((currentStep + (hasCurrentValue ? 1 : 0)) / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* KOR: 배경 DNA 패턴 오버레이 */}
      {/* ENG: Background DNA pattern overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-emerald-400 font-mono text-xs opacity-30 select-none"
              style={{
                top: `${i * 14}%`,
                left: `${(i % 3) * 35}%`,
                transform: `rotate(${i * 15}deg)`,
              }}
            >
              ATCGATCGATCG
            </div>
          ))}
        </div>
      </div>

      {/* KOR: 헤더 / ENG: Header */}
      <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* KOR: DNA 아이콘 + 로고 / ENG: DNA icon + logo */}
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-600 to-violet-700 flex items-center justify-center">
                <Dna className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div>
              <span className="text-white font-bold text-base">DNA 비자 분석</span>
              <div className="text-emerald-400 text-xs font-mono">Visa DNA Analysis</div>
            </div>
          </div>

          {/* KOR: 디자인 배지 / ENG: Design badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500 bg-gray-900 border border-gray-800 px-2 py-1 rounded-lg">
              #98 DNA
            </span>
            {phase !== 'input' && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                재분석
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* ================================================================ */}
        {/* KOR: 입력 단계 화면 / ENG: Input phase screen */}
        {/* ================================================================ */}
        {phase === 'input' && (
          <div className="space-y-6">
            {/* KOR: 히어로 섹션 / ENG: Hero section */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/50 rounded-full px-4 py-1.5 text-sm text-emerald-400">
                <FlaskConical className="w-4 h-4" />
                <span>DNA 샘플 제출 / Submit DNA Sample</span>
              </div>
              <h1 className="text-3xl font-black text-white leading-tight">
                당신의 비자 유전자를
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-br from-emerald-400 to-violet-500">
                  분석합니다
                </span>
              </h1>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                23andMe처럼 당신의 조건(유전자)을 분석하여<br />
                최적의 비자 경로를 발견합니다
              </p>
            </div>

            {/* KOR: DNA 나선 + 진행률 / ENG: DNA helix + progress */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
              <div className="flex gap-6 items-center">
                {/* KOR: DNA 나선 시각화 / ENG: DNA helix visualization */}
                <div className="shrink-0">
                  <DnaHelixVisual animated />
                </div>

                {/* KOR: 진행 정보 / ENG: Progress info */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 font-medium">샘플 수집 진행 / Sample Collection</span>
                    <span className="text-emerald-400 font-mono font-bold">{inputProgress}%</span>
                  </div>
                  <AnalysisProgressBar progress={inputProgress} />
                  <div className="text-xs text-gray-500">
                    마커 {currentStep}/{totalSteps} 수집됨 · Marker {currentStep}/{totalSteps} collected
                  </div>
                </div>
              </div>
            </div>

            {/* KOR: 유전자 맵 / ENG: Genome map */}
            <GenomeMap input={input} />

            {/* KOR: 현재 입력 단계 카드 / ENG: Current input step card */}
            <div className="bg-gray-900 border border-gray-700/50 rounded-2xl overflow-hidden">
              {/* KOR: 단계 헤더 / ENG: Step header */}
              <div className="bg-linear-to-br from-emerald-950/80 to-violet-950/80 border-b border-gray-800 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                      {currentStep + 1}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${GENE_MARKERS[currentStepKey].color}`}>
                        {GENE_MARKERS[currentStepKey].gene}
                      </div>
                      <div className="text-white font-semibold text-base">
                        {GENE_MARKERS[currentStepKey].label}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {currentStep + 1} / {totalSteps}
                  </div>
                </div>
              </div>

              {/* KOR: 단계별 입력 UI / ENG: Step-specific input UI */}
              <div className="p-5">
                {/* Step 1: 국적 / Nationality */}
                {currentStepKey === 'nationality' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span>국적을 선택하세요 / Select your nationality</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {popularCountries.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => handleSelect('nationality', country.name)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 ${
                            input.nationality === country.name
                              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                              : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-emerald-700/50 hover:bg-gray-800'
                          }`}
                        >
                          <span className="text-xl shrink-0">{country.flag}</span>
                          <span className="text-xs font-medium truncate">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: 나이 / Age */}
                {currentStepKey === 'age' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Activity className="w-4 h-4 text-violet-400" />
                      <span>연령 마커를 입력하세요 / Enter your age marker</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={ageInput}
                        onChange={(e) => {
                          setAgeInput(e.target.value);
                          const num = parseInt(e.target.value, 10);
                          if (!isNaN(num) && num > 0) {
                            setInput((prev) => ({ ...prev, age: num }));
                          }
                        }}
                        placeholder="예: 25"
                        min={18}
                        max={70}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white text-2xl font-bold text-center focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 placeholder-gray-600"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">세</div>
                    </div>
                    {/* KOR: 나이별 비자 힌트 / ENG: Age-based visa hint */}
                    {ageInput && Number(ageInput) >= 18 && Number(ageInput) <= 30 && (
                      <div className="flex items-start gap-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 rounded-lg p-3">
                        <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>워킹홀리데이(H-1) 비자 적격 연령입니다 / Eligible age for Working Holiday (H-1) visa</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: 학력 / Education Level */}
                {currentStepKey === 'educationLevel' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
                      <GraduationCap className="w-4 h-4 text-teal-400" />
                      <span>학력 염색체를 선택하세요 / Select your education chromosome</span>
                    </div>
                    {educationOptions.map((option) => (
                      <button
                        key={String(option.value)}
                        onClick={() => handleSelect('educationLevel', option.value)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                          input.educationLevel === option.value
                            ? 'bg-teal-950/60 border-teal-500 text-teal-300'
                            : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-teal-700/50 hover:bg-gray-800'
                        }`}
                      >
                        <span className="text-sm font-medium">{option.labelKo}</span>
                        {input.educationLevel === option.value && (
                          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 4: 연간 자금 / Annual Fund */}
                {currentStepKey === 'availableAnnualFund' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
                      <DollarSign className="w-4 h-4 text-purple-400" />
                      <span>자금 시퀀스를 선택하세요 / Select your fund sequence</span>
                    </div>
                    {fundOptions.map((option) => (
                      <button
                        key={String(option.value)}
                        onClick={() => handleSelect('availableAnnualFund', option.value)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                          input.availableAnnualFund === option.value
                            ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                            : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-700/50 hover:bg-gray-800'
                        }`}
                      >
                        <span className="text-sm font-mono font-medium">{option.labelKo}</span>
                        {input.availableAnnualFund === option.value && (
                          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 5: 최종 목표 / Final Goal */}
                {currentStepKey === 'finalGoal' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
                      <Target className="w-4 h-4 text-green-400" />
                      <span>목표 발현을 선택하세요 / Select your goal expression</span>
                    </div>
                    {goalOptions.map((option) => (
                      <button
                        key={String(option.value)}
                        onClick={() => handleSelect('finalGoal', option.value)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                          input.finalGoal === option.value
                            ? 'bg-green-950/60 border-green-500 text-green-300'
                            : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-green-700/50 hover:bg-gray-800'
                        }`}
                      >
                        <span className="text-sm font-medium">{option.labelKo}</span>
                        {input.finalGoal === option.value && (
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 6: 우선순위 / Priority */}
                {currentStepKey === 'priorityPreference' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
                      <BarChart3 className="w-4 h-4 text-fuchsia-400" />
                      <span>우선순위 코드를 선택하세요 / Select your priority code</span>
                    </div>
                    {priorityOptions.map((option) => (
                      <button
                        key={String(option.value)}
                        onClick={() => handleSelect('priorityPreference', option.value)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                          input.priorityPreference === option.value
                            ? 'bg-fuchsia-950/60 border-fuchsia-500 text-fuchsia-300'
                            : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-fuchsia-700/50 hover:bg-gray-800'
                        }`}
                      >
                        <span className="text-sm font-medium">{option.labelKo}</span>
                        {input.priorityPreference === option.value && (
                          <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* KOR: 다음 버튼 / ENG: Next button */}
              <div className="px-5 pb-5">
                <button
                  onClick={handleNext}
                  disabled={!hasCurrentValue}
                  className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                    hasCurrentValue
                      ? 'bg-linear-to-br from-emerald-500 to-violet-600 text-white hover:from-emerald-400 hover:to-violet-500 shadow-lg shadow-emerald-900/30'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {currentStep < totalSteps - 1 ? (
                    <>
                      <span>다음 마커 / Next Marker</span>
                      <ChevronRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <Microscope className="w-5 h-5" />
                      <span>DNA 분석 시작 / Start DNA Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* KOR: 단계 인디케이터 / ENG: Step indicator dots */}
            <div className="flex justify-center gap-2">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx < currentStep
                      ? 'w-6 bg-emerald-500'
                      : idx === currentStep
                      ? 'w-8 bg-linear-to-br from-emerald-400 to-violet-500'
                      : 'w-1.5 bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* KOR: 분석 중 화면 / ENG: Analyzing screen */}
        {/* ================================================================ */}
        {phase === 'analyzing' && (
          <div className="space-y-8 py-8">
            {/* KOR: 분석 중 헤더 / ENG: Analyzing header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-violet-950/60 border border-violet-800/50 rounded-full px-4 py-1.5 text-sm text-violet-400 animate-pulse">
                <Beaker className="w-4 h-4" />
                <span>유전자 시퀀싱 중 / Sequencing in Progress</span>
              </div>
              <h2 className="text-2xl font-black text-white">
                DNA 분석 진행 중
              </h2>
              <p className="text-gray-400 text-sm">비자 호환성 유전자를 분석하고 있습니다</p>
            </div>

            {/* KOR: 대형 DNA 나선 + 진행률 / ENG: Large DNA helix + progress */}
            <div className="bg-gray-900/80 border border-emerald-900/40 rounded-2xl p-8">
              <div className="flex flex-col items-center gap-6">
                {/* KOR: 중앙 DNA 나선 / ENG: Center DNA helix */}
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl scale-150" />
                  <div className="relative bg-gray-950/80 rounded-2xl p-4 border border-emerald-900/40">
                    <DnaHelixVisual animated />
                  </div>
                  {/* KOR: 회전 링 효과 / ENG: Rotating ring effect */}
                  <div className="absolute inset-0 -m-4 rounded-full border-2 border-dashed border-emerald-700/30 animate-spin" style={{ animationDuration: '8s' }} />
                </div>

                {/* KOR: 진행률 텍스트 + 바 / ENG: Progress text + bar */}
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">유전자 시퀀싱 / Gene Sequencing</span>
                    <span className="text-emerald-400 font-mono font-bold">{Math.round(analysisProgress)}%</span>
                  </div>
                  <AnalysisProgressBar progress={analysisProgress} />
                </div>
              </div>
            </div>

            {/* KOR: 분석 로그 터미널 / ENG: Analysis log terminal */}
            <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="bg-gray-900 border-b border-gray-800 px-4 py-2.5 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xs text-gray-500 ml-2 font-mono">dna-analyzer.sh</span>
              </div>
              <div className="p-4 space-y-1.5 min-h-40">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-mono">
                    <span className="text-emerald-500 shrink-0">{'>'}</span>
                    <span className={idx === logs.length - 1 ? 'text-white' : 'text-gray-400'}>{log}</span>
                  </div>
                ))}
                {/* KOR: 커서 / ENG: Cursor */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-emerald-500">{'>'}</span>
                  <span className="w-2 h-3.5 bg-emerald-400 animate-pulse inline-block" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* KOR: 결과 화면 / ENG: Result screen */}
        {/* ================================================================ */}
        {phase === 'result' && result && (
          <div className="space-y-6">
            {/* KOR: 결과 헤더 / ENG: Result header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-700/50 rounded-full px-4 py-1.5 text-sm text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>분석 완료 / Analysis Complete</span>
              </div>
              <h2 className="text-2xl font-black text-white">
                DNA 비자 리포트
                <span className="block text-lg font-normal text-gray-400 mt-1">
                  Visa DNA Report
                </span>
              </h2>
            </div>

            {/* KOR: 리포트 요약 카드 / ENG: Report summary card */}
            <div className="bg-linear-to-br from-emerald-950/60 to-violet-950/60 border border-emerald-800/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-600 to-violet-700 flex items-center justify-center">
                  <Dna className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-mono">REPORT ID: {result.id}</div>
                  <div className="text-white font-bold">
                    {result.pathways.length}개 비자 경로 발견
                  </div>
                </div>
              </div>

              {/* KOR: 적합도 분포 차트 / ENG: Feasibility distribution chart */}
              <div className="space-y-3">
                <div className="text-xs text-gray-400 mb-3">경로별 적합도 분포 / Feasibility Distribution</div>
                {result.pathways.map((pathway, idx) => (
                  <div key={pathway.id} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-500 w-8 shrink-0">
                      P{String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pathway.feasibilityScore >= 80
                            ? 'bg-linear-to-br from-emerald-400 to-emerald-600'
                            : pathway.feasibilityScore >= 60
                            ? 'bg-linear-to-br from-violet-400 to-violet-600'
                            : 'bg-linear-to-br from-yellow-400 to-orange-500'
                        } transition-all duration-1000`}
                        style={{ width: `${pathway.feasibilityScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-white w-10 text-right shrink-0">
                      {pathway.feasibilityScore}%
                    </span>
                    <span className="text-xs text-gray-500 shrink-0">{getFeasibilityEmoji(pathway.feasibilityLabel)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KOR: 분석된 입력 데이터 요약 / ENG: Analyzed input data summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Microscope className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-semibold text-teal-400">분석된 유전자 프로파일 / Analyzed Gene Profile</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: '국적', value: result.userInput.nationality, icon: '🌏' },
                  { key: '연령', value: `${result.userInput.age}세`, icon: '📅' },
                  { key: '학력', value: result.userInput.educationLevel, icon: '🎓' },
                  { key: '자금', value: result.userInput.availableAnnualFund, icon: '💰' },
                  { key: '목표', value: result.userInput.finalGoal, icon: '🎯' },
                  { key: '우선순위', value: result.userInput.priorityPreference, icon: '⚡' },
                ] as { key: string; value: string; icon: string }[]).map((item) => (
                  <div key={item.key} className="bg-gray-800/50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <span>{item.icon}</span>
                      <span>{item.key}</span>
                    </div>
                    <div className="text-white text-xs font-medium leading-tight">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* KOR: 경고 배너 / ENG: Warning banner */}
            <div className="flex items-start gap-3 bg-amber-950/30 border border-amber-800/40 rounded-xl p-4">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-300/80">
                이 결과는 AI 기반 참고 정보입니다. 최종 비자 결정은 반드시 전문 행정사와 상담하세요.
                <span className="block text-amber-400/60 mt-0.5">
                  This result is AI-based reference only. Consult a professional immigration attorney for final decisions.
                </span>
              </p>
            </div>

            {/* KOR: 경로 카드 목록 / ENG: Pathway card list */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                발견된 비자 경로 / Discovered Visa Pathways
              </h3>
              {result.pathways.map((pathway, idx) => (
                <PathwayCard key={pathway.id} pathway={pathway} index={idx} />
              ))}
            </div>

            {/* KOR: 재분석 CTA / ENG: Re-analysis CTA */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center space-y-4">
              <div className="text-sm text-gray-400">
                다른 조건으로 분석하고 싶으신가요?
                <br />
                <span className="text-gray-500 text-xs">Want to analyze with different conditions?</span>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 bg-linear-to-br from-emerald-600 to-violet-700 text-white font-bold px-6 py-3 rounded-xl hover:from-emerald-500 hover:to-violet-600 transition-all duration-200 shadow-lg shadow-emerald-900/30"
              >
                <RotateCcw className="w-4 h-4" />
                새 DNA 샘플 제출 / New DNA Sample
              </button>
            </div>
          </div>
        )}
      </main>

      {/* KOR: 푸터 / ENG: Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-8 border-t border-gray-800 mt-8">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-mono">DNA Visa Analysis v98.0</span>
          <div className="flex items-center gap-1">
            <Dna className="w-3 h-3 text-emerald-700" />
            <span>잡차자 © 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
