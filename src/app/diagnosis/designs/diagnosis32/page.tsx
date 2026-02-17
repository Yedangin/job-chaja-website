'use client';

// KOR: 비자 진단 디자인 #32 — 건강 진단서(Health Report) 콘셉트
// ENG: Visa Diagnosis Design #32 — Health Report concept (Apple Health / Fitbit style)

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
  Heart,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  User,
  GraduationCap,
  Target,
  DollarSign,
  Globe,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Star,
  RotateCcw,
  FileText,
} from 'lucide-react';

// KOR: 진단 단계 정의 / ENG: Diagnosis step definition
type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference' | 'result';

// KOR: 바이탈 사인 컬러 매핑 (점수 → 색상 토큰) / ENG: Vital sign color mapping (score → color token)
function getVitalColor(score: number): { ring: string; bar: string; text: string; bg: string; status: string } {
  if (score >= 80) {
    return { ring: 'stroke-green-400', bar: 'bg-green-400', text: 'text-green-600', bg: 'bg-green-50', status: '정상' };
  } else if (score >= 60) {
    return { ring: 'stroke-yellow-400', bar: 'bg-yellow-400', text: 'text-yellow-600', bg: 'bg-yellow-50', status: '주의' };
  } else {
    return { ring: 'stroke-red-400', bar: 'bg-red-400', text: 'text-red-500', bg: 'bg-red-50', status: '위험' };
  }
}

// KOR: 점수에 따른 Apple Health 그라데이션 / ENG: Apple Health gradient per score
function getAppleGradient(score: number): string {
  if (score >= 80) return 'from-green-400 to-emerald-500';
  if (score >= 60) return 'from-yellow-400 to-orange-400';
  return 'from-red-400 to-pink-500';
}

// KOR: SVG 링 차트를 그리는 컴포넌트 / ENG: Component rendering an SVG ring chart
interface RingChartProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

function RingChart({ score, size = 80, strokeWidth = 8 }: RingChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const vitalColor = getVitalColor(score);

  return (
    <svg width={size} height={size} className="-rotate-90">
      {/* KOR: 배경 링 / ENG: Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      {/* KOR: 점수 링 / ENG: Score ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className={vitalColor.ring}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
      />
    </svg>
  );
}

// KOR: 바이탈 사인 카드 컴포넌트 / ENG: Vital sign card component
interface VitalCardProps {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
}

function VitalCard({ label, value, unit, icon }: VitalCardProps) {
  const vitalColor = getVitalColor(value);
  return (
    <div className={`rounded-2xl p-4 ${vitalColor.bg} flex items-center gap-3`}>
      <div className="relative shrink-0">
        <RingChart score={value} size={60} strokeWidth={6} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${vitalColor.text}`}>{value}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className={`text-sm font-semibold ${vitalColor.text}`}>{value}{unit}</p>
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${vitalColor.text} bg-white/60`}>
          {vitalColor.status}
        </span>
      </div>
      <div className={`shrink-0 ${vitalColor.text} opacity-70`}>{icon}</div>
    </div>
  );
}

// KOR: 트렌드 바 차트 / ENG: Trend bar chart
function TrendBar({ score, label }: { score: number; label: string }) {
  const vitalColor = getVitalColor(score);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${vitalColor.bar} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-semibold w-8 text-right ${vitalColor.text}`}>{score}</span>
    </div>
  );
}

// KOR: 단계별 입력 컴포넌트 / ENG: Step-by-step input component
interface StepCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  stepNumber: number;
  totalSteps: number;
}

function StepCard({ title, subtitle, icon, children, stepNumber, totalSteps }: StepCardProps) {
  const progress = (stepNumber / totalSteps) * 100;
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      {/* KOR: 상단 헤더 / ENG: Top header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white">
          <Heart size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-400">잡차자 비자 건강 진단</p>
          <p className="text-sm font-semibold text-gray-800">문진표 작성</p>
        </div>
        <div className="ml-auto text-xs text-gray-400 font-medium">{stepNumber}/{totalSteps}</div>
      </div>

      {/* KOR: 진행 바 / ENG: Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* KOR: 본문 / ENG: Main content */}
      <div className="flex-1 flex flex-col px-6 py-8 max-w-lg mx-auto w-full">
        {/* KOR: 섹션 아이콘 + 제목 / ENG: Section icon + title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>

        {/* KOR: 구분선 / ENG: Divider */}
        <div className="h-px bg-gray-100 my-4" />

        {/* KOR: 입력 영역 / ENG: Input area */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

// KOR: 선택 버튼 / ENG: Selection button
interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  emoji?: string;
}

function OptionButton({ label, selected, onClick, emoji }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
        selected
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50/50'
      }`}
    >
      {emoji && <span className="text-xl shrink-0">{emoji}</span>}
      <span className="text-sm font-medium flex-1">{label}</span>
      {selected && <CheckCircle size={18} className="text-blue-500 shrink-0" />}
    </button>
  );
}

// KOR: 결과 경로 카드 / ENG: Result pathway card
interface PathwayCardProps {
  pathway: RecommendedPathway;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
}

function PathwayCard({ pathway, rank, expanded, onToggle }: PathwayCardProps) {
  const score = pathway.feasibilityScore;
  const vitalColor = getVitalColor(score);
  const gradient = getAppleGradient(score);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  // KOR: USD → KRW 환산 (대략 1350원) / ENG: USD → KRW conversion (approx 1350 KRW)
  const estimatedCostWon = ((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0) * 1350;
  const costFormatted = estimatedCostWon >= 10000000
    ? `${(estimatedCostWon / 10000000).toFixed(1)}천만원`
    : `${Math.round(estimatedCostWon / 10000).toLocaleString()}만원`;

  // KOR: 상위 3개 다음 단계 / ENG: Top 3 next steps from milestones
  const nextSteps = pathway.milestones.slice(0, 3).map((m) => m.title);

  return (
    <div className={`rounded-2xl overflow-hidden border-2 ${expanded ? 'border-blue-200' : 'border-gray-100'} bg-white shadow-sm`}>
      {/* KOR: 카드 헤더 / ENG: Card header */}
      <button
        className="w-full text-left"
        onClick={onToggle}
      >
        {/* KOR: 상단 색상 배너 / ENG: Top color banner */}
        <div className={`bg-linear-to-r ${gradient} px-4 py-2 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-semibold opacity-90">#{rank} 추천 경로</span>
            <span className="text-base">{emoji}</span>
          </div>
          <span className="text-white text-xs font-bold opacity-90">{score}점</span>
        </div>

        {/* KOR: 제목 영역 / ENG: Title area */}
        <div className="px-4 pt-3 pb-2 flex items-start gap-3">
          {/* KOR: 링 차트 / ENG: Ring chart */}
          <div className="relative shrink-0">
            <RingChart score={score} size={56} strokeWidth={5} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-bold ${vitalColor.text}`}>{score}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 leading-snug">{pathway.name}</h3>
            <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${vitalColor.bg} ${vitalColor.text}`}>
              <Activity size={10} />
              {pathway.feasibilityLabel}
            </div>
          </div>

          <div className="shrink-0 text-gray-400 mt-1">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>

        {/* KOR: 요약 메트릭 / ENG: Summary metrics */}
        <div className="px-4 pb-3 grid grid-cols-3 gap-2">
          <div className="text-center bg-gray-50 rounded-xl py-2">
            <p className="text-xs text-gray-400 mb-0.5">예상 기간</p>
            <p className="text-xs font-bold text-gray-800">{pathway.totalDurationMonths}개월</p>
          </div>
          <div className="text-center bg-gray-50 rounded-xl py-2">
            <p className="text-xs text-gray-400 mb-0.5">예상 비용</p>
            <p className="text-xs font-bold text-gray-800">{costFormatted}</p>
          </div>
          <div className="text-center bg-gray-50 rounded-xl py-2">
            <p className="text-xs text-gray-400 mb-0.5">비자 단계</p>
            <p className="text-xs font-bold text-gray-800">{(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length}단계</p>
          </div>
        </div>
      </button>

      {/* KOR: 펼침 상세 영역 / ENG: Expanded detail area */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 space-y-4">
          {/* KOR: 설명 / ENG: Description */}
          <p className="text-xs text-gray-600 leading-relaxed">{pathway.description}</p>

          {/* KOR: 비자 체인 / ENG: Visa chain */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Shield size={12} className="text-blue-500" />
              비자 경로
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, idx) => (
                <React.Fragment key={v.visa}>
                  <div className="text-center">
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg">{v.visa}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{v.duration}</p>
                  </div>
                  {idx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ArrowRight size={14} className="text-gray-300 shrink-0 mb-4" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* KOR: 트렌드 바 (세부 점수) / ENG: Trend bars (detailed scores) */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <TrendingUp size={12} className="text-blue-500" />
              항목별 분석
            </p>
            <div className="space-y-2">
              <TrendBar score={Math.min(100, score + 5)} label="취업 가능성" />
              <TrendBar score={Math.max(0, score - 10)} label="비용 효율성" />
              <TrendBar score={Math.min(100, Math.round(100 - pathway.totalDurationMonths * 0.8))} label="소요 기간" />
              <TrendBar score={Math.min(100, score - 5)} label="서류 준비도" />
            </div>
          </div>

          {/* KOR: 마일스톤 / ENG: Milestones */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Zap size={12} className="text-yellow-500" />
              주요 마일스톤
            </p>
            <div className="space-y-2">
              {pathway.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-base shrink-0 mt-0.5">{m.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{m.title}</p>
                    <p className="text-xs text-gray-500 leading-snug">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KOR: 다음 단계 처방 / ENG: Next step prescription */}
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
              <FileText size={12} />
              다음 단계 처방전
            </p>
            <div className="space-y-1">
              {nextSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center shrink-0 font-bold">{idx + 1}</span>
                  <p className="text-xs text-blue-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// KOR: 메인 페이지 컴포넌트 / ENG: Main page component
export default function Diagnosis32Page() {
  // KOR: 현재 진단 단계 / ENG: Current diagnosis step
  const [step, setStep] = useState<Step>('nationality');

  // KOR: 사용자 입력값 / ENG: User input values
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 연령 텍스트 입력 / ENG: Age text input
  const [ageText, setAgeText] = useState<string>('');

  // KOR: 결과 데이터 (실제 서비스에선 API 응답) / ENG: Result data (API response in production)
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 펼쳐진 경로 카드 ID / ENG: Expanded pathway card ID
  const [expandedId, setExpandedId] = useState<string>('');

  // KOR: 분석 로딩 상태 / ENG: Analysis loading state
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  // KOR: 단계 순서 정의 / ENG: Step order definition
  const STEPS: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'];
  const currentStepIndex = STEPS.indexOf(step);

  // KOR: 다음 단계로 이동 / ENG: Move to next step
  function goNext() {
    if (currentStepIndex < STEPS.length - 1) {
      setStep(STEPS[currentStepIndex + 1]);
    } else {
      runAnalysis();
    }
  }

  // KOR: 이전 단계로 이동 / ENG: Move to previous step
  function goBack() {
    if (step === 'result') {
      setStep('priorityPreference');
      setResult(null);
      return;
    }
    if (currentStepIndex > 0) {
      setStep(STEPS[currentStepIndex - 1]);
    }
  }

  // KOR: 진단 분석 실행 (목업 데이터 사용) / ENG: Run diagnosis analysis (using mock data)
  function runAnalysis() {
    setAnalyzing(true);
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setExpandedId(mockDiagnosisResult.pathways[0]?.id ?? '');
      setAnalyzing(false);
      setStep('result');
    }, 1800);
  }

  // KOR: 재시작 / ENG: Restart
  function restart() {
    setStep('nationality');
    setInput({});
    setAgeText('');
    setResult(null);
    setExpandedId('');
  }

  // KOR: 현재 단계가 유효한지 확인 / ENG: Check if current step is valid
  function isCurrentStepValid(): boolean {
    switch (step) {
      case 'nationality': return Boolean(input.nationality);
      case 'age': return Boolean(input.age && input.age > 0);
      case 'educationLevel': return Boolean(input.educationLevel);
      case 'availableAnnualFund': return Boolean(input.availableAnnualFund);
      case 'finalGoal': return Boolean(input.finalGoal);
      case 'priorityPreference': return Boolean(input.priorityPreference);
      default: return false;
    }
  }

  // KOR: 분석 중 화면 / ENG: Analyzing screen
  if (analyzing) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          {/* KOR: 심장 박동 애니메이션 / ENG: Heartbeat animation */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-30" />
            <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-red-400 to-pink-500 flex items-center justify-center shadow-lg">
              <Heart size={40} className="text-white" fill="white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">비자 건강 진단 중</h2>
          <p className="text-sm text-gray-500 mb-6">14개 평가 항목을 분석하고 있습니다...</p>

          {/* KOR: 진행 바 / ENG: Progress bar */}
          <div className="w-64 bg-gray-100 rounded-full h-2 mx-auto mb-3 overflow-hidden">
            <div className="h-full bg-linear-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse" style={{ width: '75%' }} />
          </div>

          <div className="space-y-1.5 mt-6 text-left max-w-xs mx-auto">
            {['국적 및 나이 분석', '학력 요건 검토', '비자 유형 매칭', '경로 우선순위 계산'].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-400 shrink-0" />
                <span className="text-xs text-gray-500">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // KOR: 결과 화면 / ENG: Result screen
  if (step === 'result' && result) {
    const overallScore = Math.round(
      result.pathways.reduce((acc, p) => acc + p.feasibilityScore, 0) / result.pathways.length
    );
    const overallVital = getVitalColor(overallScore);
    const overallGradient = getAppleGradient(overallScore);

    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
        {/* KOR: 상단 헤더 / ENG: Top header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={goBack} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-red-400 to-pink-500 flex items-center justify-center">
              <Heart size={16} className="text-white" fill="white" />
            </div>
            <span className="text-sm font-bold text-gray-800">비자 건강 진단 결과</span>
          </div>
          <button onClick={restart} className="ml-auto flex items-center gap-1 text-xs text-blue-500 font-medium">
            <RotateCcw size={13} />
            재진단
          </button>
        </div>

        <div className="max-w-lg mx-auto px-4 pb-10">
          {/* KOR: 종합 건강 점수 배너 / ENG: Overall health score banner */}
          <div className={`mt-5 rounded-2xl bg-linear-to-br ${overallGradient} p-5 text-white shadow-lg`}>
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {/* KOR: 흰색 배경 링 / ENG: White background ring */}
                <svg width={88} height={88} className="-rotate-90">
                  <circle cx={44} cy={44} r={36} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={8} />
                  <circle
                    cx={44}
                    cy={44}
                    r={36}
                    fill="none"
                    stroke="white"
                    strokeWidth={8}
                    strokeDasharray={2 * Math.PI * 36}
                    strokeDashoffset={2 * Math.PI * 36 - (overallScore / 100) * 2 * Math.PI * 36}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-white">{overallScore}</span>
                  <span className="text-xs text-white/80">종합</span>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-white/80 text-xs mb-1">종합 비자 적합도</p>
                <h1 className="text-2xl font-black text-white">{overallVital.status}</h1>
                <p className="text-white/80 text-xs mt-1">{result.pathways.length}개 경로 분석 완료</p>

                {/* KOR: 입력 요약 태그 / ENG: Input summary tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {input.nationality && (
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {popularCountries.find(c => c.name === input.nationality)?.flag ?? ''} {input.nationality}
                    </span>
                  )}
                  {input.age && (
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{input.age}세</span>
                  )}
                  {input.educationLevel && (
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{input.educationLevel}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* KOR: 바이탈 사인 섹션 / ENG: Vital signs section */}
          <div className="mt-5">
            <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Activity size={15} className="text-red-400" />
              바이탈 사인 — 항목별 건강 지표
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <VitalCard
                label="취업 가능성"
                value={overallScore}
                unit="점"
                icon={<TrendingUp size={18} />}
              />
              <VitalCard
                label="비용 효율"
                value={Math.max(40, overallScore - 12)}
                unit="점"
                icon={<DollarSign size={18} />}
              />
              <VitalCard
                label="서류 준비도"
                value={Math.min(100, overallScore + 5)}
                unit="점"
                icon={<FileText size={18} />}
              />
              <VitalCard
                label="경로 안정성"
                value={Math.max(50, overallScore - 5)}
                unit="점"
                icon={<Shield size={18} />}
              />
            </div>
          </div>

          {/* KOR: 트렌드 그래프 섹션 / ENG: Trend graph section */}
          <div className="mt-5 bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Star size={15} className="text-yellow-400" />
              경로별 종합 점수 비교
            </h2>
            <div className="space-y-3">
              {result.pathways.map((p, idx) => (
                <TrendBar key={p.id} score={p.feasibilityScore} label={`#${idx + 1} ${((p as any).name ?? p.nameKo ?? '').split(' ')[0]}`} />
              ))}
            </div>
          </div>

          {/* KOR: 진단 경로 카드 섹션 / ENG: Diagnosis pathway cards section */}
          <div className="mt-5">
            <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Heart size={15} className="text-red-400" />
              추천 비자 경로 처방
            </h2>
            <div className="space-y-3">
              {result.pathways.map((pathway, idx) => (
                <PathwayCard
                  key={pathway.id}
                  pathway={pathway}
                  rank={idx + 1}
                  expanded={expandedId === pathway.id}
                  onToggle={() => setExpandedId(expandedId === pathway.id ? '' : pathway.id)}
                />
              ))}
            </div>
          </div>

          {/* KOR: 면책 고지 / ENG: Disclaimer */}
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              본 진단 결과는 참고용이며, 실제 비자 심사 결과와 다를 수 있습니다.
              정확한 안내는 전문 행정사에게 문의하세요.
            </p>
          </div>

          {/* KOR: 하단 CTA 버튼 / ENG: Bottom CTA button */}
          <div className="mt-6 space-y-3">
            <button className="w-full bg-linear-to-br from-blue-500 to-cyan-500 text-white text-sm font-bold py-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
              <Zap size={16} />
              전문가 상담 예약하기
              <ChevronRight size={16} />
            </button>
            <button
              onClick={restart}
              className="w-full border-2 border-gray-200 text-gray-600 text-sm font-semibold py-3.5 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} />
              다시 진단하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // KOR: 입력 단계 화면들 / ENG: Input step screens

  // Step 1: 국적 / Nationality
  if (step === 'nationality') {
    return (
      <StepCard
        title="국적"
        subtitle="현재 보유 중인 국적을 선택하세요"
        icon={<Globe size={20} />}
        stepNumber={1}
        totalSteps={6}
      >
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {popularCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => setInput((prev) => ({ ...prev, nationality: country.name }))}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-left transition-all duration-200 ${
                  input.nationality === country.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50'
                }`}
              >
                <span className="text-xl shrink-0">{country.flag}</span>
                <span className={`text-sm font-medium truncate ${input.nationality === country.name ? 'text-blue-700' : 'text-gray-700'}`}>
                  {country.name}
                </span>
              </button>
            ))}
          </div>

          <button
            disabled={!isCurrentStepValid()}
            onClick={goNext}
            className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
              isCurrentStepValid()
                ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            다음
            <ChevronRight size={16} />
          </button>
        </div>
      </StepCard>
    );
  }

  // Step 2: 나이 / Age
  if (step === 'age') {
    return (
      <StepCard
        title="나이"
        subtitle="현재 만 나이를 입력해주세요"
        icon={<User size={20} />}
        stepNumber={2}
        totalSteps={6}
      >
        <div className="space-y-4">
          {/* KOR: 나이 입력 필드 / ENG: Age input field */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center">
            <p className="text-xs text-gray-400 mb-3">나이 (만 나이)</p>
            <input
              type="number"
              min={15}
              max={65}
              value={ageText}
              onChange={(e) => {
                setAgeText(e.target.value);
                const parsed = parseInt(e.target.value, 10);
                if (!isNaN(parsed) && parsed > 0 && parsed < 120) {
                  setInput((prev) => ({ ...prev, age: parsed }));
                }
              }}
              className="text-4xl font-black text-center text-blue-600 bg-transparent border-none outline-none w-32"
              placeholder="25"
            />
            <p className="text-sm text-gray-400 mt-2">세</p>
          </div>

          {/* KOR: 빠른 선택 칩 / ENG: Quick selection chips */}
          <div>
            <p className="text-xs text-gray-500 mb-2">빠른 선택</p>
            <div className="flex flex-wrap gap-2">
              {[20, 25, 28, 30, 35, 40].map((age) => (
                <button
                  key={age}
                  onClick={() => {
                    setAgeText(String(age));
                    setInput((prev) => ({ ...prev, age }));
                  }}
                  className={`px-3 py-1.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                    input.age === age
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-200'
                  }`}
                >
                  {age}세
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={goBack}
              className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              이전
            </button>
            <button
              disabled={!isCurrentStepValid()}
              onClick={goNext}
              className={`flex-1 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                isCurrentStepValid()
                  ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              다음 <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </StepCard>
    );
  }

  // Step 3: 학력 / Education
  if (step === 'educationLevel') {
    return (
      <StepCard
        title="최종 학력"
        subtitle="최종적으로 취득한 학력을 선택하세요"
        icon={<GraduationCap size={20} />}
        stepNumber={3}
        totalSteps={6}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {educationOptions.map((edu) => (
              <OptionButton
                key={edu}
                label={edu}
                selected={input.educationLevel === edu}
                onClick={() => setInput((prev) => ({ ...prev, educationLevel: edu }))}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={goBack}
              className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              이전
            </button>
            <button
              disabled={!isCurrentStepValid()}
              onClick={goNext}
              className={`flex-1 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                isCurrentStepValid()
                  ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              다음 <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </StepCard>
    );
  }

  // Step 4: 가용 자금 / Available Fund
  if (step === 'availableAnnualFund') {
    return (
      <StepCard
        title="연간 가용 자금"
        subtitle="비자 및 체류 관련 연간 사용 가능한 예산"
        icon={<DollarSign size={20} />}
        stepNumber={4}
        totalSteps={6}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {fundOptions.map((fund) => (
              <OptionButton
                key={fund}
                label={fund}
                selected={input.availableAnnualFund === fund}
                onClick={() => setInput((prev) => ({ ...prev, availableAnnualFund: fund }))}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={goBack}
              className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              이전
            </button>
            <button
              disabled={!isCurrentStepValid()}
              onClick={goNext}
              className={`flex-1 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                isCurrentStepValid()
                  ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              다음 <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </StepCard>
    );
  }

  // Step 5: 최종 목표 / Final Goal
  if (step === 'finalGoal') {
    return (
      <StepCard
        title="최종 목표"
        subtitle="한국에서 이루고 싶은 최종 목표를 선택하세요"
        icon={<Target size={20} />}
        stepNumber={5}
        totalSteps={6}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {goalOptions.map((goal) => (
              <OptionButton
                key={goal}
                label={goal}
                selected={input.finalGoal === goal}
                onClick={() => setInput((prev) => ({ ...prev, finalGoal: goal }))}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={goBack}
              className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              이전
            </button>
            <button
              disabled={!isCurrentStepValid()}
              onClick={goNext}
              className={`flex-1 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                isCurrentStepValid()
                  ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              다음 <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </StepCard>
    );
  }

  // Step 6: 우선순위 / Priority
  if (step === 'priorityPreference') {
    return (
      <StepCard
        title="우선순위"
        subtitle="가장 중요하게 생각하는 기준을 선택하세요"
        icon={<Star size={20} />}
        stepNumber={6}
        totalSteps={6}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {priorityOptions.map((priority) => (
              <OptionButton
                key={priority}
                label={priority}
                selected={input.priorityPreference === priority}
                onClick={() => setInput((prev) => ({ ...prev, priorityPreference: priority }))}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={goBack}
              className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              이전
            </button>
            <button
              disabled={!isCurrentStepValid()}
              onClick={goNext}
              className={`flex-1 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                isCurrentStepValid()
                  ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              진단 시작
              <Heart size={16} />
            </button>
          </div>
        </div>
      </StepCard>
    );
  }

  // KOR: 폴백 (도달하지 않아야 함) / ENG: Fallback (should not be reached)
  return null;
}
