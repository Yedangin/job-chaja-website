'use client';

// ============================================================
// 비자 진단 페이지 — 디자인 #100: 잡차자 올인원 (최종 히어로 디자인)
// Visa diagnosis page — Design #100: JobChaja All-in-One (Final Hero)
// 참고: JobChaja, Toss, Linear, Vercel, Stripe 스타일
// References: JobChaja, Toss, Linear, Vercel, Stripe style
// ============================================================

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

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  MapPin,
  Clock,
  DollarSign,
  Target,
  Zap,
  Shield,
  TrendingUp,
  Sparkles,
  Globe,
  BookOpen,
  Briefcase,
  Star,
  Play,
  RotateCcw,
  Info,
  Calendar,
  Award,
  Building2,
  ExternalLink,
} from 'lucide-react';

// ============================================================
// 단계 정의 / Step definitions
// 입력 플로우: nationality → age → educationLevel → availableAnnualFund → finalGoal → priorityPreference
// Input flow: nationality → age → educationLevel → availableAnnualFund → finalGoal → priorityPreference
// ============================================================

type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

const STEPS: Step[] = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
];

const STEP_META: Record<Step, { titleKo: string; titleEn: string; icon: React.ReactNode }> = {
  nationality: { titleKo: '국적', titleEn: 'Nationality', icon: <Globe className="w-5 h-5" /> },
  age: { titleKo: '나이', titleEn: 'Age', icon: <Calendar className="w-5 h-5" /> },
  educationLevel: { titleKo: '학력', titleEn: 'Education', icon: <BookOpen className="w-5 h-5" /> },
  availableAnnualFund: { titleKo: '자금', titleEn: 'Budget', icon: <DollarSign className="w-5 h-5" /> },
  finalGoal: { titleKo: '목표', titleEn: 'Goal', icon: <Target className="w-5 h-5" /> },
  priorityPreference: { titleKo: '우선순위', titleEn: 'Priority', icon: <Star className="w-5 h-5" /> },
};

// ============================================================
// SVG 원형 게이지 컴포넌트 / SVG Circular Gauge Component
// ============================================================

interface CircularGaugeProps {
  score: number;      // 0~100
  color: string;      // hex color
  size?: number;      // px
  strokeWidth?: number;
  animated?: boolean;
}

function CircularGauge({ score, color, size = 120, strokeWidth = 10, animated = true }: CircularGaugeProps) {
  // 게이지 계산 / Gauge calculation
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [displayScore, setDisplayScore] = useState(0);

  // 카운트업 애니메이션 / Count-up animation
  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = score / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [score, animated]);

  // stroke-dashoffset 계산 / Stroke dashoffset calculation
  const progress = animated ? (displayScore / 100) : (score / 100);
  const offset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* 배경 원 / Background circle */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.05s ease' }}
        />
      </svg>
      {/* 점수 텍스트 / Score text */}
      <div className="relative z-10 text-center">
        <div className="text-2xl font-bold text-white leading-none">{displayScore}</div>
        <div className="text-xs text-white/60 mt-0.5">/ 100</div>
      </div>
    </div>
  );
}

// ============================================================
// 카운트업 숫자 컴포넌트 / Count-up Number Component
// ============================================================

interface CountUpProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

function CountUp({ target, duration = 1000, suffix = '', prefix = '', className = '' }: CountUpProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.round(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <span className={className}>
      {prefix}{current.toLocaleString()}{suffix}
    </span>
  );
}

// ============================================================
// 로드맵 타임라인 컴포넌트 / Roadmap Timeline Component
// ============================================================

interface TimelineProps {
  pathway: CompatPathway;
}

function RoadmapTimeline({ pathway }: TimelineProps) {
  const [expanded, setExpanded] = useState(false);
  const milestones = pathway.milestones.slice(0, expanded ? undefined : 3);

  return (
    <div className="mt-4">
      <div className="relative">
        {/* 세로 라인 / Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-linear-to-b from-indigo-500/50 via-purple-500/30 to-transparent" />

        <div className="space-y-3">
          {milestones.map((milestone, idx) => {
            // 마일스톤 타입에 따른 색상 / Color by milestone type
            const dotColor =
              milestone.type === 'final_goal'
                ? 'bg-emerald-400 ring-emerald-400/30'
                : milestone.type === 'entry'
                ? 'bg-indigo-400 ring-indigo-400/30'
                : milestone.type === 'part_time_unlock' || milestone.type === 'part_time_expand'
                ? 'bg-amber-400 ring-amber-400/30'
                : 'bg-purple-400 ring-purple-400/30';

            return (
              <div key={idx} className="flex gap-4 pl-0 relative">
                {/* 점 / Dot */}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-opacity-30 ${dotColor}`}>
                  <span className="text-xs font-bold text-white">{milestone.order}</span>
                </div>

                {/* 내용 / Content */}
                <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/10 hover:border-indigo-400/40 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-white">{milestone.nameKo}</div>
                      {milestone.visaStatus && milestone.visaStatus !== 'none' && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {milestone.visaStatus}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-white/50">M+{milestone.monthFromStart}</div>
                      {milestone.estimatedMonthlyIncome > 0 && (
                        <div className="text-xs text-emerald-400 font-medium mt-0.5">
                          +{milestone.estimatedMonthlyIncome}만/월
                        </div>
                      )}
                    </div>
                  </div>
                  {milestone.canWorkPartTime && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3 text-amber-400" />
                      <span className="text-xs text-amber-300">
                        {milestone.weeklyHours > 0 ? `주 ${milestone.weeklyHours}시간 근무 가능` : '취업 가능'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 더보기 / Show more */}
      {pathway.milestones.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 ml-12 flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? '접기' : `${pathway.milestones.length - 3}단계 더 보기`}
        </button>
      )}
    </div>
  );
}

// ============================================================
// 경로 카드 컴포넌트 / Pathway Card Component
// ============================================================

interface PathwayCardProps {
  pathway: CompatPathway;
  rank: number;
  isSelected: boolean;
  onSelect: () => void;
}

function PathwayCard({ pathway, rank, isSelected, onSelect }: PathwayCardProps) {
  const scoreColor = getScoreColor(pathway.finalScore);
  const feasEmoji = getFeasibilityEmoji(pathway.feasibilityLabel);
  const isBest = rank === 1;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected
          ? 'border-indigo-500/70 bg-linear-to-br from-indigo-900/60 to-purple-900/60 shadow-xl shadow-indigo-500/20'
          : 'border-white/10 bg-white/5 hover:border-indigo-500/40 hover:bg-white/8'
      }`}
      onClick={onSelect}
    >
      {/* 카드 헤더 / Card header */}
      <div className="p-4 flex items-start gap-4">
        {/* 게이지 / Gauge */}
        <div className="shrink-0">
          <CircularGauge
            score={pathway.finalScore}
            color={scoreColor}
            size={72}
            strokeWidth={7}
            animated={isSelected}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* 순위 배지 / Rank badge */}
          <div className="flex items-center gap-2 mb-1.5">
            {isBest && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-linear-to-r from-amber-500 to-orange-500 text-white">
                <Sparkles className="w-3 h-3" />
                추천
              </span>
            )}
            <span className="text-xs text-white/40 font-medium">#{rank}</span>
            <span className="text-xs text-white/40">|</span>
            <span className="text-xs">{feasEmoji} {pathway.feasibilityLabel}</span>
          </div>

          {/* 경로명 / Pathway name */}
          <h3 className="text-base font-bold text-white leading-tight line-clamp-1">
            {pathway.nameKo}
          </h3>
          <p className="text-xs text-white/50 mt-0.5">{pathway.nameEn}</p>

          {/* 메트릭 / Metrics */}
          <div className="mt-2.5 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-white/70">{pathway.estimatedMonths}개월</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs text-white/70">
                {pathway.estimatedCostWon === 0
                  ? '비용없음'
                  : `${pathway.estimatedCostWon.toLocaleString()}만원`}
              </span>
            </div>
            {pathway.platformSupport === 'full_support' && (
              <div className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-emerald-400">풀 지원</span>
              </div>
            )}
          </div>
        </div>

        {/* 펼치기 / Expand */}
        <ChevronRight
          className={`w-5 h-5 text-white/30 shrink-0 transition-transform mt-1 ${isSelected ? 'rotate-90 text-indigo-400' : ''}`}
        />
      </div>

      {/* 비자 체인 / Visa chain */}
      <div className="px-4 pb-3 flex items-center gap-1.5 flex-wrap">
        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-white/8 text-white/80 border border-white/10">
              {v.code}
            </span>
            {idx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
              <ArrowRight className="w-3 h-3 text-white/30" />
            )}
          </div>
        ))}
      </div>

      {/* 확장 섹션 / Expanded section */}
      {isSelected && (
        <div className="border-t border-white/10 px-4 pt-4 pb-5">
          {/* 로드맵 타임라인 / Roadmap timeline */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
              로드맵 타임라인
            </h4>
            <RoadmapTimeline pathway={pathway} />
          </div>

          {/* 다음 단계 / Next steps */}
          {pathway.nextSteps.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                지금 바로 시작하기
              </h4>
              <div className="space-y-2">
                {pathway.nextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-indigo-400">{idx + 1}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{step.nameKo}</div>
                      <div className="text-xs text-white/50 mt-0.5">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 노트 / Note */}
          {pathway.note && (
            <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300/90">{pathway.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 진행률 바 컴포넌트 / Progress bar component
// ============================================================

interface ProgressBarProps {
  current: number;  // 0-based
  total: number;
}

function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ============================================================
// 메인 컴포넌트 / Main Component
// ============================================================

export default function Diagnosis100Page() {
  // 앱 상태 / App state
  const [phase, setPhase] = useState<'intro' | 'input' | 'loading' | 'result'>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);
  const [loadingPct, setLoadingPct] = useState(0);
  const [ageInput, setAgeInput] = useState('');
  const loadingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 현재 단계 / Current step
  const currentStep = STEPS[stepIndex];

  // 선택된 경로 / Selected pathway
  const selectedPathway = mockPathways.find((p) => p.pathwayId === selectedPathwayId) ?? null;

  // 최고 점수 경로 / Highest score pathway
  const topPathway = mockPathways[0];

  // 로딩 애니메이션 / Loading animation
  const runLoading = useCallback(() => {
    setLoadingPct(0);
    const stages = [
      { target: 30, delay: 400 },
      { target: 65, delay: 800 },
      { target: 88, delay: 600 },
      { target: 100, delay: 400 },
    ];
    let elapsed = 0;
    stages.forEach(({ target, delay }) => {
      elapsed += delay;
      setTimeout(() => {
        setLoadingPct(target);
      }, elapsed);
    });
    setTimeout(() => {
      setPhase('result');
      setSelectedPathwayId(mockPathways[0].pathwayId);
    }, elapsed + 300);
  }, []);

  // 단계 진행 / Step progress
  const handleNext = useCallback(() => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      // 마지막 단계 → 로딩 → 결과 / Last step → loading → result
      setPhase('loading');
      runLoading();
    }
  }, [stepIndex, runLoading]);

  const handleBack = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    } else {
      setPhase('intro');
    }
  }, [stepIndex]);

  // 재진단 / Retry
  const handleRetry = useCallback(() => {
    setPhase('intro');
    setStepIndex(0);
    setInput({ ...mockInput });
    setAgeInput('');
    setSelectedPathwayId(null);
  }, []);

  // 국적 선택 여부 확인 / Check nationality selection
  const isStepComplete = useCallback((step: Step): boolean => {
    switch (step) {
      case 'nationality': return !!input.nationality;
      case 'age': return input.age >= 15 && input.age <= 65;
      case 'educationLevel': return !!input.educationLevel;
      case 'availableAnnualFund': return input.availableAnnualFund >= 0;
      case 'finalGoal': return !!input.finalGoal;
      case 'priorityPreference': return !!input.priorityPreference;
      default: return false;
    }
  }, [input]);

  // ============================================================
  // 인트로 화면 / Intro screen
  // ============================================================
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col overflow-hidden">
        {/* 배경 그래디언트 / Background gradient */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-950/80 via-[#0a0a1a] to-purple-950/50" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl" />
          {/* 그리드 패턴 / Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16">
          {/* 브랜드 / Brand */}
          <div className="mb-6 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">잡차자</span>
          </div>

          {/* 히어로 헤드라인 / Hero headline */}
          <div className="text-center max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>31개 비자 유형 · 2,629개 케이스 분석</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              내 상황에 맞는
              <br />
              <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                비자 경로
              </span>
              를 찾아드릴게요
            </h1>

            <p className="text-lg text-white/60 leading-relaxed">
              국적, 학력, 자금 6가지 정보만 입력하면
              <br />
              <strong className="text-white/90">잡차자 매칭 엔진</strong>이 최적 경로를 자동 분석합니다.
            </p>
          </div>

          {/* 통계 카드들 / Stat cards */}
          <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-sm">
            {[
              { labelKo: '비자 유형', value: 31, suffix: '가지' },
              { labelKo: '분석 케이스', value: 2629, suffix: '개' },
              { labelKo: '소요 시간', value: 60, suffix: '초' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-xl font-extrabold text-white">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-xs text-indigo-400 font-medium">{stat.suffix}</div>
                <div className="text-xs text-white/40 mt-0.5">{stat.labelKo}</div>
              </div>
            ))}
          </div>

          {/* CTA 버튼 / CTA button */}
          <button
            onClick={() => setPhase('input')}
            className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-lg overflow-hidden"
          >
            {/* 버튼 배경 / Button background */}
            <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-purple-600 transition-opacity" />
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            {/* 버튼 글로우 / Button glow */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
            <Play className="relative w-5 h-5" />
            <span className="relative">비자 진단 시작하기</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-4 text-xs text-white/30">회원가입 없이 무료로 이용 가능합니다</p>

          {/* 지원 비자 샘플 / Sample visa types */}
          <div className="mt-12 flex flex-wrap justify-center gap-2 max-w-lg opacity-50">
            {['E-7-1', 'E-9', 'D-4', 'D-2', 'F-2-R', 'H-2', 'D-10', 'F-4', 'E-6', 'F-5'].map((visa) => (
              <span key={visa} className="px-2.5 py-1 rounded-lg text-xs font-mono text-white/70 border border-white/10 bg-white/5">
                {visa}
              </span>
            ))}
            <span className="px-2.5 py-1 rounded-lg text-xs text-white/50">+21개</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 로딩 화면 / Loading screen
  // ============================================================
  if (phase === 'loading') {
    const loadingMessages = [
      { pct: 0, msgKo: '입력 정보 분석 중...', msgEn: 'Analyzing your profile...' },
      { pct: 30, msgKo: '31개 비자 유형 검토 중...', msgEn: 'Evaluating 31 visa types...' },
      { pct: 65, msgKo: '14개 평가 엔진 실행 중...', msgEn: 'Running 14 evaluators...' },
      { pct: 88, msgKo: '최적 경로 순위 산정 중...', msgEn: 'Ranking optimal pathways...' },
      { pct: 100, msgKo: '분석 완료!', msgEn: 'Analysis complete!' },
    ];
    const currentMsg = loadingMessages.reduce(
      (acc, msg) => (loadingPct >= msg.pct ? msg : acc),
      loadingMessages[0]
    );

    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center px-6">
        <div className="fixed inset-0 bg-linear-to-br from-indigo-950/80 via-[#0a0a1a] to-purple-950/50 pointer-events-none" />

        <div className="relative z-10 text-center max-w-sm w-full">
          {/* 로딩 게이지 / Loading gauge */}
          <div className="relative inline-block mb-8">
            <CircularGauge
              score={loadingPct}
              color="#818cf8"
              size={160}
              strokeWidth={12}
              animated={false}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {currentMsg.msgKo}
          </h2>
          <p className="text-sm text-white/50 mb-8">{currentMsg.msgEn}</p>

          {/* 진행률 바 / Progress bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${loadingPct}%` }}
            />
          </div>

          {/* 분석 단계 표시 / Analysis steps */}
          <div className="mt-8 space-y-2">
            {[
              { pct: 30, label: '국적 · 나이 · 학력 필터' },
              { pct: 65, label: '비자 요건 매칭' },
              { pct: 88, label: '비용 · 기간 최적화' },
              { pct: 100, label: '경로 순위 산정' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    loadingPct >= item.pct
                      ? 'bg-indigo-500 border-indigo-400'
                      : 'bg-transparent border-white/20'
                  }`}
                />
                <span className={`text-sm transition-colors ${loadingPct >= item.pct ? 'text-white' : 'text-white/30'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 결과 화면 / Result screen
  // ============================================================
  if (phase === 'result') {
    const bestPathway = mockPathways[0];
    const totalPathways = mockDiagnosisResult.meta.totalPathwaysEvaluated;
    const filtered = mockDiagnosisResult.meta.hardFilteredOut;
    const matched = totalPathways - filtered;

    return (
      <div className="min-h-screen bg-[#0a0a1a]">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-950/70 via-[#0a0a1a] to-purple-950/40" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 pb-24">
          {/* 상단 헤더 / Top header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-base font-bold text-white">잡차자</span>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              재진단
            </button>
          </div>

          {/* 결과 히어로 카드 / Result hero card */}
          <div className="rounded-3xl border border-indigo-500/30 bg-linear-to-br from-indigo-900/50 to-purple-900/40 p-6 mb-6 overflow-hidden relative">
            {/* 배경 글로우 / Background glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              {/* 분석 완료 배지 / Analysis complete badge */}
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">분석 완료</span>
                <span className="text-xs text-white/30">
                  {totalPathways}개 경로 검토 → {matched}개 적합
                </span>
              </div>

              <div className="flex items-start gap-5">
                {/* 최고 점수 게이지 / Top score gauge */}
                <div className="shrink-0">
                  <CircularGauge
                    score={bestPathway.finalScore}
                    color={getScoreColor(bestPathway.finalScore)}
                    size={100}
                    strokeWidth={9}
                  />
                  <div className="mt-2 text-center">
                    <span className="text-xs text-white/50">최고 점수</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
                    최우선 추천 경로
                  </div>
                  <h2 className="text-xl font-extrabold text-white leading-tight mb-1">
                    {bestPathway.nameKo}
                  </h2>
                  <p className="text-sm text-white/60">{bestPathway.nameEn}</p>

                  {/* 빠른 메트릭 / Quick metrics */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="bg-white/8 rounded-xl p-2.5">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-xs text-white/50">예상 기간</span>
                      </div>
                      <div className="text-base font-bold text-white">
                        <CountUp target={bestPathway.estimatedMonths} suffix="개월" />
                      </div>
                    </div>
                    <div className="bg-white/8 rounded-xl p-2.5">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <DollarSign className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs text-white/50">예상 비용</span>
                      </div>
                      <div className="text-base font-bold text-white">
                        {bestPathway.estimatedCostWon === 0
                          ? '무료'
                          : <CountUp target={bestPathway.estimatedCostWon} suffix="만원" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 입력 요약 / Input summary */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                {[
                  { label: popularCountries.find((c) => c.code === input.nationality)?.nameKo ?? input.nationality },
                  { label: `${input.age}세` },
                  { label: educationOptions.find((e) => e.value === input.educationLevel)?.labelKo ?? input.educationLevel },
                  { label: goalOptions.find((g) => g.value === input.finalGoal)?.labelKo ?? input.finalGoal },
                  { label: priorityOptions.find((p) => p.value === input.priorityPreference)?.labelKo ?? input.priorityPreference },
                ].map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs text-white/60 bg-white/8 border border-white/10">
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 경로 목록 제목 / Pathway list title */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-white">
              추천 경로 <span className="text-indigo-400">{mockPathways.length}개</span>
            </h3>
            <span className="text-xs text-white/40">점수 높은 순</span>
          </div>

          {/* 경로 카드 목록 / Pathway card list */}
          <div className="space-y-3 mb-8">
            {mockPathways.map((pathway, idx) => (
              <PathwayCard
                key={pathway.pathwayId}
                pathway={pathway}
                rank={idx + 1}
                isSelected={selectedPathwayId === pathway.pathwayId}
                onSelect={() =>
                  setSelectedPathwayId(
                    selectedPathwayId === pathway.pathwayId ? null : pathway.pathwayId
                  )
                }
              />
            ))}
          </div>

          {/* CTA 섹션 / CTA section */}
          <div className="rounded-2xl border border-purple-500/30 bg-linear-to-br from-purple-900/40 to-indigo-900/30 p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-white mb-1">
                  잡차자로 취업비자 한 번에 해결
                </h4>
                <p className="text-sm text-white/60 mb-4">
                  비자 매칭부터 채용 연결까지, 전문가가 함께합니다.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    <Briefcase className="w-4 h-4" />
                    채용공고 보기
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    전문가 상담
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 재진단 버튼 / Retry button */}
          <button
            onClick={handleRetry}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white/50 hover:text-white text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            다른 조건으로 다시 진단하기
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // 입력 화면 / Input screen
  // ============================================================

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col">
      {/* 배경 / Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-950/70 via-[#0a0a1a] to-purple-950/40" />
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-indigo-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-w-lg mx-auto w-full px-5 py-6">
        {/* 헤더 / Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {stepIndex === 0 ? '처음으로' : '이전'}
          </button>
          <span className="text-xs text-white/40">
            {stepIndex + 1} / {STEPS.length}
          </span>
        </div>

        {/* 진행률 바 / Progress bar */}
        <ProgressBar current={stepIndex + 1} total={STEPS.length} />

        {/* 단계 인디케이터 / Step indicators */}
        <div className="flex items-center gap-1.5 mt-4 mb-8">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  idx < stepIndex
                    ? 'bg-indigo-500 text-white'
                    : idx === stepIndex
                    ? 'bg-linear-to-r from-indigo-500 to-purple-500 text-white ring-4 ring-indigo-500/20'
                    : 'bg-white/10 text-white/30'
                }`}
              >
                {idx < stepIndex ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 w-4 rounded-full transition-all ${idx < stepIndex ? 'bg-indigo-500' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* 질문 / Question */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              {STEP_META[currentStep].icon}
            </div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              {STEP_META[currentStep].titleEn}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight">
            {currentStep === 'nationality' && '국적을 선택해 주세요'}
            {currentStep === 'age' && '나이를 입력해 주세요'}
            {currentStep === 'educationLevel' && '최종 학력을 선택해 주세요'}
            {currentStep === 'availableAnnualFund' && '준비 가능한 연간 자금은?'}
            {currentStep === 'finalGoal' && '한국에서의 최종 목표는?'}
            {currentStep === 'priorityPreference' && '어떤 경로를 선호하시나요?'}
          </h2>
          <p className="text-sm text-white/50 mt-1.5">
            {currentStep === 'nationality' && '비자 쿼터 및 협정 적용 여부 판단에 사용됩니다'}
            {currentStep === 'age' && '비자 연령 제한 및 점수제 산정에 사용됩니다'}
            {currentStep === 'educationLevel' && '요건 충족 여부 및 매칭 점수에 반영됩니다'}
            {currentStep === 'availableAnnualFund' && '학비, 생활비, 비자 수수료 등 1년치 기준'}
            {currentStep === 'finalGoal' && '목표에 최적화된 비자 경로를 추천합니다'}
            {currentStep === 'priorityPreference' && '경로 순위 산정 가중치에 반영됩니다'}
          </p>
        </div>

        {/* 입력 UI / Input UI */}
        <div className="flex-1">
          {/* 국적 선택 / Nationality selection */}
          {currentStep === 'nationality' && (
            <div className="grid grid-cols-2 gap-2.5">
              {popularCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setInput((prev) => ({ ...prev, nationality: country.code }))}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left ${
                    input.nationality === country.code
                      ? 'border-indigo-500/70 bg-indigo-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/8'
                  }`}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <div className="text-sm font-semibold">{country.nameKo}</div>
                    <div className="text-xs text-white/40">{country.nameEn}</div>
                  </div>
                  {input.nationality === country.code && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 ml-auto shrink-0" />
                  )}
                </button>
              ))}
              <button
                onClick={() => setInput((prev) => ({ ...prev, nationality: 'OTHER' }))}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all col-span-2 ${
                  input.nationality === 'OTHER'
                    ? 'border-indigo-500/70 bg-indigo-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                }`}
              >
                <Globe className="w-6 h-6" />
                <span className="text-sm font-medium">기타 국가</span>
                {input.nationality === 'OTHER' && (
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 ml-auto" />
                )}
              </button>
            </div>
          )}

          {/* 나이 입력 / Age input */}
          {currentStep === 'age' && (
            <div>
              <div className="relative">
                <input
                  type="number"
                  min={15}
                  max={65}
                  value={ageInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAgeInput(val);
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num >= 15 && num <= 65) {
                      setInput((prev) => ({ ...prev, age: num }));
                    }
                  }}
                  placeholder="예: 24"
                  className="w-full bg-white/8 border border-white/20 rounded-2xl px-5 py-5 text-3xl font-bold text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all text-center"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-xl font-bold text-white/40">세</div>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                {[20, 22, 24, 26, 28, 30, 35].map((age) => (
                  <button
                    key={age}
                    onClick={() => {
                      setAgeInput(String(age));
                      setInput((prev) => ({ ...prev, age }));
                    }}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      input.age === age
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                    }`}
                  >
                    {age}세
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-white/40 text-center">
                15세 ~ 65세 입력 가능 (비자 연령 제한 기준)
              </p>
            </div>
          )}

          {/* 학력 선택 / Education selection */}
          {currentStep === 'educationLevel' && (
            <div className="space-y-2.5">
              {educationOptions.map((edu) => (
                <button
                  key={edu.value}
                  onClick={() => setInput((prev) => ({ ...prev, educationLevel: edu.value }))}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    input.educationLevel === edu.value
                      ? 'border-indigo-500/70 bg-indigo-500/15 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/8'
                  }`}
                >
                  <span className="text-2xl w-8 text-center">{edu.emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{edu.labelKo}</div>
                    <div className="text-xs text-white/40">{edu.labelEn}</div>
                  </div>
                  {input.educationLevel === edu.value && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* 자금 선택 / Fund selection */}
          {currentStep === 'availableAnnualFund' && (
            <div className="space-y-2.5">
              {fundOptions.map((fund) => (
                <button
                  key={fund.value}
                  onClick={() => setInput((prev) => ({ ...prev, availableAnnualFund: fund.value }))}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    input.availableAnnualFund === fund.value
                      ? 'border-indigo-500/70 bg-indigo-500/15 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/8'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-sm font-semibold">{fund.labelKo}</div>
                    <div className="text-xs text-white/40">{fund.labelEn}</div>
                  </div>
                  {input.availableAnnualFund === fund.value && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* 목표 선택 / Goal selection */}
          {currentStep === 'finalGoal' && (
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setInput((prev) => ({ ...prev, finalGoal: goal.value }))}
                  className={`flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all text-center ${
                    input.finalGoal === goal.value
                      ? 'border-indigo-500/70 bg-linear-to-b from-indigo-500/20 to-purple-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/8'
                  }`}
                >
                  <span className="text-3xl">{goal.emoji}</span>
                  <div>
                    <div className="text-sm font-bold">{goal.labelKo}</div>
                    <div className="text-xs text-white/50 mt-0.5">{goal.descKo}</div>
                  </div>
                  {input.finalGoal === goal.value && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* 우선순위 선택 / Priority selection */}
          {currentStep === 'priorityPreference' && (
            <div className="space-y-3">
              {priorityOptions.map((priority) => (
                <button
                  key={priority.value}
                  onClick={() => setInput((prev) => ({ ...prev, priorityPreference: priority.value }))}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                    input.priorityPreference === priority.value
                      ? 'border-indigo-500/70 bg-linear-to-r from-indigo-500/15 to-purple-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/8 flex items-center justify-center text-2xl shrink-0">
                    {priority.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold">{priority.labelKo}</div>
                    <div className="text-sm text-white/50">{priority.descKo}</div>
                  </div>
                  {input.priorityPreference === priority.value && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 하단 다음 버튼 / Bottom next button */}
        <div className="mt-8">
          <button
            onClick={handleNext}
            disabled={!isStepComplete(currentStep)}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-200 ${
              isStepComplete(currentStep)
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-indigo-500/20'
                : 'bg-white/8 text-white/30 cursor-not-allowed'
            }`}
          >
            {stepIndex < STEPS.length - 1 ? (
              <>
                다음
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                비자 분석 시작
              </>
            )}
          </button>
          <p className="text-center text-xs text-white/30 mt-3">
            {STEPS.length - stepIndex - 1 > 0
              ? `${STEPS.length - stepIndex - 1}단계 더 남았습니다`
              : '마지막 단계입니다'}
          </p>
        </div>
      </div>
    </div>
  );
}
