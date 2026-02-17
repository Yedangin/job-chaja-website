'use client';

// KOR: 비자 진단 디자인 #94 — AI 어시스턴트 스타일
// ENG: Visa Diagnosis Design #94 — AI Assistant Style
// Concept: AI 에이전트가 자율적으로 분석하고 최적 경로를 제안
// Concept: AI agent autonomously analyzes and suggests optimal pathways
// References: Claude, ChatGPT, Perplexity, Copilot, Gemini

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
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  Globe,
  GraduationCap,
  DollarSign,
  Target,
  Star,
  Loader2,
  CheckCircle2,
  BarChart2,
  FileText,
  Zap,
  ArrowRight,
  MessageCircle,
  RefreshCw,
  Info,
  TrendingUp,
  Clock,
  Shield,
} from 'lucide-react';

// KOR: 스텝 정의 타입 / ENG: Step definition type
type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

// KOR: 스트리밍 텍스트 훅 — AI 타이핑 효과 시뮬레이션
// ENG: Streaming text hook — simulates AI typing effect
function useStreamingText(text: string, isActive: boolean, speed: number = 18): string {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!isActive) { setDisplayed(''); return; }
    setDisplayed('');
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, isActive, speed]);

  return displayed;
}

// KOR: 신뢰도 바 컴포넌트 / ENG: Confidence bar component
function ConfidenceBar({ score, label, color }: { score: number; label: string; color: string }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-xs font-bold text-violet-700">{score}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

// KOR: AI 사고 과정 표시 컴포넌트 / ENG: AI thinking process display component
function ThinkingDots() {
  return (
    <span className="inline-flex gap-0.5 items-center ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

// KOR: 소스 인용 배지 컴포넌트 / ENG: Source citation badge component
function SourceBadge({ source }: { source: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs rounded-full font-medium">
      <FileText className="w-3 h-3 shrink-0" />
      {source}
    </span>
  );
}

// KOR: 경로 카드 컴포넌트 / ENG: Pathway card component
function PathwayCard({ pathway, index, isExpanded, onToggle }: {
  pathway: RecommendedPathway;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const scoreColorMap: Record<string, string> = {
    'bg-blue-500': 'from-blue-500 to-violet-500',
    'bg-green-500': 'from-green-500 to-emerald-400',
    'bg-yellow-500': 'from-yellow-500 to-orange-400',
    'bg-orange-500': 'from-orange-500 to-red-400',
    'bg-red-500': 'from-red-500 to-rose-400',
  };

  const bgColor = getScoreColor(pathway.feasibilityLabel);
  const gradientColor = scoreColorMap[bgColor] || 'from-gray-400 to-gray-500';
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        isExpanded
          ? 'border-violet-300 shadow-lg shadow-violet-100'
          : 'border-gray-200 hover:border-violet-200 hover:shadow-md'
      } bg-white`}
    >
      {/* KOR: 카드 헤더 / ENG: Card header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        {/* KOR: 순위 배지 / ENG: Rank badge */}
        <div className={`shrink-0 w-8 h-8 rounded-xl bg-linear-to-br ${gradientColor} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold text-gray-900 leading-tight">{pathway.name}</span>
            <span className="text-base">{emoji}</span>
          </div>

          {/* KOR: 신뢰도 바 (인라인) / ENG: Confidence bar (inline) */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-linear-to-r ${gradientColor}`}
                style={{ width: `${pathway.feasibilityScore}%` }}
              />
            </div>
            <span className="text-xs font-bold text-violet-700 shrink-0">
              {pathway.feasibilityScore}% {pathway.feasibilityLabel}
            </span>
          </div>

          {/* KOR: 요약 정보 칩 / ENG: Summary info chips */}
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3 shrink-0" />
              {pathway.totalDurationMonths}개월
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
              <DollarSign className="w-3 h-3 shrink-0" />
              ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
        )}
      </button>

      {/* KOR: 확장 콘텐츠 / ENG: Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-3">
          {/* KOR: AI 설명 텍스트 / ENG: AI description text */}
          <p className="text-sm text-gray-600 leading-relaxed">{pathway.description}</p>

          {/* KOR: 비자 체인 / ENG: Visa chain */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">비자 경로 체인</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="flex flex-col items-center">
                    <span className="px-2.5 py-1 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-sm">
                      {v.visa}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">{v.duration}</span>
                  </div>
                  {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-violet-300 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* KOR: 마일스톤 / ENG: Milestones */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">단계별 로드맵</p>
            <div className="space-y-2">
              {pathway.milestones.map((m, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="text-base shrink-0 mt-0.5">{m.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{m.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KOR: 소스 인용 / ENG: Source citations */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">분석 근거</p>
            <div className="flex flex-wrap gap-1.5">
              <SourceBadge source="출입국관리법 시행규칙" />
              <SourceBadge source="고용허가제 지침 2025" />
              <SourceBadge source="비자 가이드 DB" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// KOR: 팔로업 질문 컴포넌트 / ENG: Follow-up question component
function FollowUpQuestions({ onReset }: { onReset: () => void }) {
  const questions = [
    '가장 빠른 경로를 자세히 알려줘',
    'E-7 비자 준비 서류가 뭐야?',
    '비용을 줄이려면 어떻게 해야 해?',
    '영주권까지 걸리는 시간은?',
  ];

  return (
    <div className="mt-4">
      <p className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-1">
        <MessageCircle className="w-3 h-3 shrink-0" />
        팔로업 질문 제안
      </p>
      <div className="flex flex-wrap gap-2">
        {questions.map((q, i) => (
          <button
            key={i}
            className="text-xs text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3 py-1.5 rounded-full transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
      <button
        onClick={onReset}
        className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        <RefreshCw className="w-3 h-3 shrink-0" />
        처음부터 다시 분석하기
      </button>
    </div>
  );
}

// KOR: 메인 페이지 컴포넌트 / ENG: Main page component
export default function Diagnosis94Page() {
  // KOR: 현재 스텝 및 입력 상태 / ENG: Current step and input state
  const [step, setStep] = useState<Step>('nationality');
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  const [phase, setPhase] = useState<'input' | 'analyzing' | 'result'>('input');

  // KOR: 분석 단계 추적 (0~5) / ENG: Analysis phase tracking (0~5)
  const [analysisStage, setAnalysisStage] = useState(0);

  // KOR: 확장된 경로 인덱스 / ENG: Expanded pathway index
  const [expandedPath, setExpandedPath] = useState<number>(0);

  // KOR: 스트리밍 분석 텍스트 활성화 여부 / ENG: Whether streaming analysis text is active
  const [streamActive, setStreamActive] = useState(false);

  // KOR: 인사이트 카드 표시 여부 / ENG: Whether insight cards are shown
  const [showInsights, setShowInsights] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // KOR: 스텝 순서 정의 / ENG: Step order definition
  const steps: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'];

  const currentStepIndex = steps.indexOf(step);

  // KOR: 스텝 메타데이터 / ENG: Step metadata
  const stepMeta: Record<Step, { label: string; labelEn: string; icon: React.ReactNode; prompt: string }> = {
    nationality: {
      label: '국적',
      labelEn: 'Nationality',
      icon: <Globe className="w-4 h-4" />,
      prompt: '먼저 국적을 알려주세요. 국가별 비자 협정과 쿼터를 분석합니다.',
    },
    age: {
      label: '나이',
      labelEn: 'Age',
      icon: <User className="w-4 h-4" />,
      prompt: '나이를 입력해주세요. 연령에 따라 점수제 비자 가산점이 달라집니다.',
    },
    educationLevel: {
      label: '학력',
      labelEn: 'Education',
      icon: <GraduationCap className="w-4 h-4" />,
      prompt: '최종 학력을 선택해주세요. 전문인력 비자 자격 요건에 영향을 줍니다.',
    },
    availableAnnualFund: {
      label: '연간 자금',
      labelEn: 'Annual Fund',
      icon: <DollarSign className="w-4 h-4" />,
      prompt: '연간 가용 자금 범위를 선택해주세요. 유학 비자와 생활비 계획에 활용됩니다.',
    },
    finalGoal: {
      label: '최종 목표',
      labelEn: 'Final Goal',
      icon: <Target className="w-4 h-4" />,
      prompt: '한국 체류의 최종 목표는 무엇인가요? 장기 경로를 설계합니다.',
    },
    priorityPreference: {
      label: '우선순위',
      labelEn: 'Priority',
      icon: <Star className="w-4 h-4" />,
      prompt: '어떤 것을 가장 중요하게 생각하시나요? 최적 경로를 선별합니다.',
    },
  };

  // KOR: 분석 스테이지 메시지 / ENG: Analysis stage messages
  const analysisMessages = [
    '국적 · 나이 · 학력 데이터 파싱 중...',
    '출입국관리법 시행규칙 2025 조회 중...',
    '31개 비자 유형 적합성 매칭 중...',
    '5개 최적 경로 시뮬레이션 중...',
    '비용 · 기간 · 성공률 계산 중...',
    'AI 리포트 생성 완료 ✓',
  ];

  // KOR: 스트리밍 AI 분석 텍스트 / ENG: Streaming AI analysis text
  const analysisResultText =
    `${mockInput.nationality} 국적, ${mockInput.age}세, ${mockInput.educationLevel} 기준으로 ` +
    `총 ${mockDiagnosisResult.pathways.length}개의 최적 비자 경로를 발견했습니다. ` +
    `현재 조건에서 D-2-7 유학 후 E-7-R 전환 경로의 실현 가능성이 가장 높으며 (${mockDiagnosisResult.pathways[0].feasibilityScore}%), ` +
    `예상 소요 기간은 ${mockDiagnosisResult.pathways[0].totalDurationMonths}개월입니다. ` +
    `아래에서 각 경로의 상세 로드맵을 확인하세요.`;

  const streamedText = useStreamingText(analysisResultText, streamActive, 20);

  // KOR: 분석 진행 시뮬레이션 / ENG: Analysis progress simulation
  useEffect(() => {
    if (phase !== 'analyzing') return;

    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      setAnalysisStage(stage);
      if (stage >= analysisMessages.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setPhase('result');
          setStreamActive(true);
          setTimeout(() => setShowInsights(true), 1800);
        }, 600);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [phase]);

  // KOR: 스텝 진행 핸들러 / ENG: Step advance handler
  function handleSelect(value: string | number) {
    const updated = { ...input, [step]: value };
    setInput(updated);

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    } else {
      // KOR: 모든 입력 완료 → 분석 시작 / ENG: All inputs complete → start analysis
      setPhase('analyzing');
      setAnalysisStage(0);
    }
  }

  // KOR: 이전 스텝으로 이동 / ENG: Go to previous step
  function handleBack() {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    }
  }

  // KOR: 초기화 / ENG: Reset
  function handleReset() {
    setStep('nationality');
    setInput({});
    setPhase('input');
    setAnalysisStage(0);
    setExpandedPath(0);
    setStreamActive(false);
    setShowInsights(false);
  }

  // KOR: 인사이트 데이터 / ENG: Insight data
  const insights = [
    {
      icon: <TrendingUp className="w-4 h-4 text-violet-600" />,
      title: '최고 성공률 경로',
      value: mockDiagnosisResult.pathways[0].name,
      sub: `${mockDiagnosisResult.pathways[0].feasibilityScore}% 실현 가능성`,
      color: 'border-violet-200 bg-violet-50',
    },
    {
      icon: <Clock className="w-4 h-4 text-blue-600" />,
      title: '최단 경로',
      value: `${Math.min(...mockDiagnosisResult.pathways.map((p) => p.totalDurationMonths))}개월`,
      sub: '빠른 취업 트랙',
      color: 'border-blue-200 bg-blue-50',
    },
    {
      icon: <Shield className="w-4 h-4 text-green-600" />,
      title: '비용 최소 경로',
      value: `$${Math.min(...mockDiagnosisResult.pathways.map((p) => (p as any).estimatedCostUSD ?? p.estimatedCostWon ?? 0)).toLocaleString()}`,
      sub: '경제적 경로',
      color: 'border-green-200 bg-green-50',
    },
    {
      icon: <Zap className="w-4 h-4 text-amber-600" />,
      title: '분석된 경로',
      value: `${mockDiagnosisResult.pathways.length}개`,
      sub: '31개 비자 매칭 결과',
      color: 'border-amber-200 bg-amber-50',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* KOR: 헤더 / ENG: Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">AI 어시스턴트</p>
              <p className="text-xs text-violet-600 leading-tight">비자 경로 자동 분석</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            분석 준비됨
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* ─────────────────────────────────────────────── */}
        {/* KOR: 입력 페이즈 / ENG: Input phase             */}
        {/* ─────────────────────────────────────────────── */}
        {phase === 'input' && (
          <>
            {/* KOR: 진행 상태 표시 / ENG: Progress indicator */}
            <div className="flex items-center gap-1 mb-2">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all duration-400 ${
                    i < currentStepIndex
                      ? 'bg-violet-600'
                      : i === currentStepIndex
                      ? 'bg-violet-400'
                      : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>

            {/* KOR: AI 인사 말풍선 / ENG: AI greeting bubble */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-600 to-purple-700 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {stepMeta[step].prompt}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-xs text-violet-600 font-medium">
                    {stepMeta[step].icon}
                  </span>
                  <span className="text-xs text-violet-700 font-semibold">
                    {stepMeta[step].label} ({currentStepIndex + 1}/{steps.length})
                  </span>
                </div>
              </div>
            </div>

            {/* KOR: 이전에 입력한 값 채팅 형태로 표시 / ENG: Previously entered values shown as chat */}
            {steps.slice(0, currentStepIndex).map((s) => (
              <div key={s} className="flex gap-3 items-start justify-end">
                <div className="bg-violet-600 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-xs">
                  <p className="font-medium leading-snug">{String(input[s])}</p>
                  <p className="text-xs text-violet-200 mt-0.5">{stepMeta[s].label}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            ))}

            {/* ─── 국적 선택 / Nationality ─── */}
            {step === 'nationality' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {popularCountries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleSelect(c.name)}
                      className="flex flex-col items-center gap-1 p-3 border border-gray-200 rounded-xl hover:border-violet-400 hover:bg-violet-50 transition-all group"
                    >
                      <span className="text-2xl">{c.flag}</span>
                      <span className="text-xs text-gray-600 group-hover:text-violet-700 font-medium leading-tight text-center">
                        {c.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── 나이 입력 / Age ─── */}
            {step === 'age' && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  {[20, 22, 24, 25, 27, 30, 33, 35, 40].map((a) => (
                    <button
                      key={a}
                      onClick={() => handleSelect(a)}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 transition-all"
                    >
                      {a}세
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-400">위 나이 중 선택하거나 직접 아래 버튼을 사용하세요</p>
                <div className="flex justify-center gap-4">
                  {[18, 45].map((a) => (
                    <button
                      key={a}
                      onClick={() => handleSelect(a)}
                      className="px-4 py-2 rounded-lg border border-dashed border-gray-300 text-xs text-gray-500 hover:border-violet-300 hover:text-violet-600 transition-all"
                    >
                      {a}세
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── 학력 / Education ─── */}
            {step === 'educationLevel' && (
              <div className="space-y-2">
                {educationOptions.map((edu) => (
                  <button
                    key={edu}
                    onClick={() => handleSelect(edu)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-violet-400 hover:bg-violet-50 transition-all group text-left"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-violet-700 font-medium">{edu}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-400" />
                  </button>
                ))}
              </div>
            )}

            {/* ─── 자금 / Fund ─── */}
            {step === 'availableAnnualFund' && (
              <div className="space-y-2">
                {fundOptions.map((f) => (
                  <button
                    key={f}
                    onClick={() => handleSelect(f)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-violet-400 hover:bg-violet-50 transition-all group text-left"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-violet-700 font-medium">{f}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-400" />
                  </button>
                ))}
              </div>
            )}

            {/* ─── 목표 / Goal ─── */}
            {step === 'finalGoal' && (
              <div className="space-y-2">
                {goalOptions.map((g) => (
                  <button
                    key={g}
                    onClick={() => handleSelect(g)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-violet-400 hover:bg-violet-50 transition-all group text-left"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-violet-700 font-medium">{g}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-400" />
                  </button>
                ))}
              </div>
            )}

            {/* ─── 우선순위 / Priority ─── */}
            {step === 'priorityPreference' && (
              <div className="space-y-2">
                {priorityOptions.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSelect(p)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-violet-400 hover:bg-violet-50 transition-all group text-left"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-violet-700 font-medium">{p}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-400" />
                  </button>
                ))}
              </div>
            )}

            {/* KOR: 뒤로 가기 버튼 / ENG: Back button */}
            {currentStepIndex > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mt-2"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
                이전 질문으로
              </button>
            )}
          </>
        )}

        {/* ─────────────────────────────────────────────── */}
        {/* KOR: 분석 중 페이즈 / ENG: Analyzing phase      */}
        {/* ─────────────────────────────────────────────── */}
        {phase === 'analyzing' && (
          <div className="py-8 space-y-6">
            {/* KOR: AI 아이콘 + 로딩 / ENG: AI icon + loading */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-violet-500 to-purple-700 animate-pulse opacity-30" />
                <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-xl">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <Loader2 className="w-3 h-3 text-white animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">AI가 분석 중입니다</p>
                <p className="text-sm text-gray-500 mt-1">31개 비자 유형 · 2,629개 규칙 조회</p>
              </div>
            </div>

            {/* KOR: 분석 단계 로그 / ENG: Analysis stage log */}
            <div className="bg-gray-950 rounded-2xl p-4 font-mono space-y-2">
              {analysisMessages.slice(0, analysisStage + 1).map((msg, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i < analysisStage ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  ) : (
                    <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin shrink-0" />
                  )}
                  <span className={`text-xs ${i < analysisStage ? 'text-green-400' : 'text-violet-300'}`}>
                    {msg}
                  </span>
                </div>
              ))}
            </div>

            {/* KOR: 신뢰도 바 (스켈레톤) / ENG: Confidence bars (skeleton) */}
            <div className="space-y-3 px-2">
              <ConfidenceBar score={85} label="D-2-7 → E-7-R 경로 적합도" color="bg-linear-to-r from-violet-500 to-purple-600" />
              <ConfidenceBar score={75} label="D-4-1 → D-2 유학 경로" color="bg-linear-to-r from-blue-500 to-cyan-400" />
              <ConfidenceBar score={60} label="E-9 → F-2-6 숙련기능인력" color="bg-linear-to-r from-amber-400 to-yellow-400" />
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────── */}
        {/* KOR: 결과 페이즈 / ENG: Result phase            */}
        {/* ─────────────────────────────────────────────── */}
        {phase === 'result' && (
          <>
            {/* KOR: AI 완료 메시지 말풍선 / ENG: AI completion message bubble */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-600 to-purple-700 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 bg-gray-50 border border-violet-200 rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-gray-700 leading-relaxed min-h-[3rem]">
                  {streamedText}
                  {streamedText.length < analysisResultText.length && (
                    <span className="inline-block w-0.5 h-4 bg-violet-500 animate-pulse ml-0.5 align-middle" />
                  )}
                </p>
                {/* KOR: 소스 인용 / ENG: Sources */}
                {showInsights && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-200">
                    <SourceBadge source="출입국관리법 2025" />
                    <SourceBadge source="비자 가이드 DB v3.1" />
                    <SourceBadge source="고용허가제 지침" />
                  </div>
                )}
              </div>
            </div>

            {/* KOR: 인사이트 카드 그리드 / ENG: Insight card grid */}
            {showInsights && (
              <div className="grid grid-cols-2 gap-2">
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    className={`border ${insight.color} rounded-2xl p-3 space-y-1`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-center gap-1.5">
                      {insight.icon}
                      <span className="text-xs font-semibold text-gray-600">{insight.title}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 leading-snug">{insight.value}</p>
                    <p className="text-xs text-gray-500">{insight.sub}</p>
                  </div>
                ))}
              </div>
            )}

            {/* KOR: 신뢰도 바 섹션 / ENG: Confidence bar section */}
            {showInsights && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart2 className="w-4 h-4 text-violet-600 shrink-0" />
                  <p className="text-sm font-bold text-gray-800">경로별 AI 신뢰도</p>
                </div>
                {mockDiagnosisResult.pathways.map((p) => (
                  <ConfidenceBar
                    key={p.id}
                    score={p.feasibilityScore}
                    label={p.name}
                    color={`${getScoreColor(p.feasibilityLabel)}`}
                  />
                ))}
              </div>
            )}

            {/* KOR: 경로 카드 목록 / ENG: Pathway card list */}
            {showInsights && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-violet-600 rounded-full" />
                  <p className="text-sm font-bold text-gray-900">추천 비자 경로 ({mockDiagnosisResult.pathways.length}개)</p>
                  <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>

                {mockDiagnosisResult.pathways.map((pathway, i) => (
                  <PathwayCard
                    key={pathway.id}
                    pathway={pathway}
                    index={i}
                    isExpanded={expandedPath === i}
                    onToggle={() => setExpandedPath(expandedPath === i ? -1 : i)}
                  />
                ))}
              </div>
            )}

            {/* KOR: 팔로업 질문 + 리셋 / ENG: Follow-up questions + reset */}
            {showInsights && (
              <FollowUpQuestions onReset={handleReset} />
            )}
          </>
        )}

        <div ref={bottomRef} />
      </div>

      {/* KOR: 하단 AI 브랜딩 / ENG: Bottom AI branding */}
      <div className="max-w-2xl mx-auto px-4 pb-8 pt-2">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
          <Sparkles className="w-3 h-3 shrink-0" />
          <span>잡차자 AI · JobChaJa Visa Intelligence</span>
        </div>
      </div>
    </div>
  );
}
