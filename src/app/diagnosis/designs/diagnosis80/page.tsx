'use client';

// KOR: 보험 비교 사이트 스타일의 비자 진단 페이지 (Design #80)
// ENG: Insurance Compare style visa diagnosis page (Design #80)
// References: Lemonade, Geico, Progressive, Oscar Health, Metromile

import React, { useState, useCallback } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  DollarSign,
  Zap,
  Award,
  Globe,
  GraduationCap,
  Target,
  Wallet,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  BarChart2,
  TrendingUp,
  Users,
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

// ============================================================
// KOR: 입력 단계 정의 타입
// ENG: Input step definition type
// ============================================================
type StepKey = keyof DiagnosisInput;

interface StepDef {
  key: StepKey;
  question: string;
  questionEn: string;
  icon: React.ReactNode;
  helper: string;
}

// KOR: 입력 단계 목록 (국적 → 나이 → 학력 → 자금 → 목표 → 우선순위)
// ENG: Input step list (nationality → age → education → fund → goal → priority)
const STEPS: StepDef[] = [
  {
    key: 'nationality',
    question: '어느 나라에서 오셨나요?',
    questionEn: 'Where are you from?',
    icon: <Globe size={20} />,
    helper: '국적을 선택하면 해당 국가와의 비자 협약 조건이 반영됩니다.',
  },
  {
    key: 'age',
    question: '현재 나이가 어떻게 되시나요?',
    questionEn: 'How old are you?',
    icon: <Users size={20} />,
    helper: '나이는 일부 비자의 신청 자격 요건에 영향을 줍니다.',
  },
  {
    key: 'educationLevel',
    question: '최종 학력을 선택해 주세요.',
    questionEn: 'Select your highest education level.',
    icon: <GraduationCap size={20} />,
    helper: '학력은 전문인력 비자(E-7) 등 다양한 비자 자격에 영향을 줍니다.',
  },
  {
    key: 'availableAnnualFund',
    question: '연간 사용 가능한 예산은 얼마인가요?',
    questionEn: 'What is your available annual budget?',
    icon: <Wallet size={20} />,
    helper: '유학, 생활비 등 비자 경로에 따라 필요한 자금이 다릅니다.',
  },
  {
    key: 'finalGoal',
    question: '한국에서의 최종 목표는 무엇인가요?',
    questionEn: 'What is your final goal in Korea?',
    icon: <Target size={20} />,
    helper: '목표에 따라 최적의 비자 경로가 달라집니다.',
  },
  {
    key: 'priorityPreference',
    question: '가장 중요하게 생각하는 것은 무엇인가요?',
    questionEn: 'What matters most to you?',
    icon: <Star size={20} />,
    helper: '우선순위를 바탕으로 맞춤형 플랜을 추천해 드립니다.',
  },
];

// KOR: 초기 입력 상태
// ENG: Initial input state
const INITIAL_INPUT: DiagnosisInput = {
  nationality: '',
  age: 25,
  educationLevel: '',
  availableAnnualFund: '',
  finalGoal: '',
  priorityPreference: '',
};

// KOR: 나이 선택 옵션
// ENG: Age selection options
const AGE_OPTIONS = [
  { label: '18 - 24세', value: 22 },
  { label: '25 - 29세', value: 27 },
  { label: '30 - 34세', value: 32 },
  { label: '35 - 39세', value: 37 },
  { label: '40세 이상', value: 42 },
];

// KOR: 실현 가능성 점수에 따른 색상 클래스 반환 (Lemonade 핑크 계열)
// ENG: Returns color class based on feasibility score (Lemonade pink palette)
function getScoreBarColor(score: number): string {
  if (score >= 80) return 'bg-pink-500';
  if (score >= 60) return 'bg-pink-400';
  if (score >= 40) return 'bg-pink-300';
  return 'bg-rose-300';
}

// KOR: 실현 가능성 라벨에 따른 배지 스타일
// ENG: Badge style based on feasibility label
function getFeasibilityBadgeStyle(label: RecommendedPathway['feasibilityLabel']): string {
  switch (label) {
    case '매우 높음':
      return 'bg-pink-100 text-pink-700 border border-pink-200';
    case '높음':
      return 'bg-rose-50 text-rose-600 border border-rose-200';
    case '보통':
      return 'bg-orange-50 text-orange-600 border border-orange-200';
    case '낮음':
    case '매우 낮음':
      return 'bg-gray-100 text-gray-500 border border-gray-200';
    default:
      return 'bg-gray-100 text-gray-500 border border-gray-200';
  }
}

// KOR: 비자 체인 색상 (단계별)
// ENG: Visa chain colors (per step)
const VISA_CHAIN_COLORS = [
  'bg-pink-500 text-white',
  'bg-pink-400 text-white',
  'bg-rose-400 text-white',
  'bg-pink-300 text-white',
];

// ============================================================
// KOR: 커버리지 항목 계산 (보험 비교 스타일 체크리스트)
// ENG: Coverage item calculation (insurance comparison style checklist)
// ============================================================
interface CoverageItem {
  label: string;
  labelEn: string;
  covered: boolean;
}

function getCoverageItems(pathway: RecommendedPathway): CoverageItem[] {
  // KOR: 비자 경로 특성에 따라 커버리지 항목 생성
  // ENG: Generate coverage items based on pathway characteristics
  return [
    {
      label: '취업 허용',
      labelEn: 'Employment Allowed',
      covered: ((pathway as any).name ?? pathway.nameKo ?? '').includes('E-') || ((pathway as any).name ?? pathway.nameKo ?? '').includes('F-') || ((pathway as any).name ?? pathway.nameKo ?? '').includes('취업'),
    },
    {
      label: '가족 동반 가능',
      labelEn: 'Family Allowed',
      covered: pathway.feasibilityScore >= 70,
    },
    {
      label: '영주권 전환 가능',
      labelEn: 'PR Eligible',
      covered: ((pathway as any).name ?? pathway.nameKo ?? '').includes('F-') || ((pathway as any).name ?? pathway.nameKo ?? '').includes('영주') || (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).some((v: any) => (v.visa ?? v.code ?? '').startsWith('F-')),
    },
    {
      label: '재입국 허가',
      labelEn: 'Re-entry Permit',
      covered: pathway.feasibilityScore >= 60,
    },
    {
      label: '건강보험 적용',
      labelEn: 'Health Insurance',
      covered: pathway.feasibilityScore >= 50,
    },
    {
      label: '국적 변경 가능',
      labelEn: 'Citizenship Eligible',
      covered: ((pathway as any).feasibilityScore ?? pathway.finalScore ?? 0) >= 80 && ((pathway as any).name ?? pathway.nameKo ?? '').includes('F-'),
    },
  ];
}

// ============================================================
// KOR: 프리미엄 계산 (비용 → 월 환산)
// ENG: Premium calculation (cost → monthly estimate)
// ============================================================
function getMonthlyPremium(totalCostUSD: number, months: number): number {
  if (months === 0) return 0;
  return Math.round(totalCostUSD / months);
}

// ============================================================
// KOR: 추천 배지 결정
// ENG: Determine recommendation badge
// ============================================================
function getRecommendBadge(
  pathway: RecommendedPathway,
  allPathways: RecommendedPathway[],
  priority: string
): string | null {
  // KOR: 최고 점수 경로에 "Best Match" 배지
  // ENG: "Best Match" badge for highest score pathway
  const maxScore = Math.max(...allPathways.map(p => p.feasibilityScore));
  if (pathway.feasibilityScore === maxScore) return 'Best Match';

  // KOR: 우선순위에 따른 배지
  // ENG: Badge based on priority
  if (priority.includes('저렴') || priority.includes('비용')) {
    const minCost = Math.min(...allPathways.map(p => (p as any).estimatedCostUSD ?? p.estimatedCostWon ?? 0));
    if (((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0) === minCost) return 'Most Affordable';
  }
  if (priority.includes('빠른') || priority.includes('속도')) {
    const minDuration = Math.min(...allPathways.map(p => p.totalDurationMonths));
    if (pathway.totalDurationMonths === minDuration) return 'Fastest';
  }

  return null;
}

// ============================================================
// KOR: 메인 페이지 컴포넌트
// ENG: Main page component
// ============================================================
export default function Diagnosis80Page() {
  // KOR: 현재 단계 인덱스 (0 = 첫 번째 질문)
  // ENG: Current step index (0 = first question)
  const [currentStep, setCurrentStep] = useState<number>(0);

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [input, setInput] = useState<DiagnosisInput>(INITIAL_INPUT);

  // KOR: 결과 표시 여부
  // ENG: Whether to show results
  const [showResult, setShowResult] = useState<boolean>(false);

  // KOR: 확장된 카드 ID
  // ENG: Expanded card ID
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // KOR: 로딩 애니메이션 상태
  // ENG: Loading animation state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // KOR: 결과 데이터 (mockDiagnosisResult 사용)
  // ENG: Result data (uses mockDiagnosisResult)
  const result: DiagnosisResult = mockDiagnosisResult;

  // KOR: 현재 단계 정의
  // ENG: Current step definition
  const step = STEPS[currentStep];

  // KOR: 단계별 선택지 반환
  // ENG: Return choices for each step
  const getStepOptions = useCallback((): { label: string; value: string | number }[] => {
    switch (step?.key) {
      case 'nationality':
        return popularCountries.map(c => ({ label: `${c.flag} ${c.name}`, value: c.name }));
      case 'age':
        return AGE_OPTIONS.map(a => ({ label: a.label, value: a.value }));
      case 'educationLevel':
        return educationOptions.map(e => ({ label: e, value: e }));
      case 'availableAnnualFund':
        return fundOptions.map(f => ({ label: f, value: f }));
      case 'finalGoal':
        return goalOptions.map(g => ({ label: g, value: g }));
      case 'priorityPreference':
        return priorityOptions.map(p => ({ label: p, value: p }));
      default:
        return [];
    }
  }, [step]);

  // KOR: 옵션 선택 핸들러
  // ENG: Option selection handler
  const handleSelect = useCallback((value: string | number) => {
    if (!step) return;

    setInput(prev => ({ ...prev, [step.key]: value }));

    // KOR: 마지막 단계면 분석 시작
    // ENG: If last step, start analysis
    if (currentStep === STEPS.length - 1) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResult(true);
      }, 2200);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  }, [step, currentStep]);

  // KOR: 다시 시작 핸들러
  // ENG: Restart handler
  const handleRestart = useCallback(() => {
    setInput(INITIAL_INPUT);
    setCurrentStep(0);
    setShowResult(false);
    setExpandedId(null);
    setIsAnalyzing(false);
  }, []);

  // KOR: 카드 확장 토글
  // ENG: Toggle card expansion
  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  // ============================================================
  // KOR: 로딩(분석 중) 화면
  // ENG: Loading (analyzing) screen
  // ============================================================
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center px-4">
        {/* KOR: 로딩 헤더 / ENG: Loading header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-500 mb-6 shadow-lg">
            <Shield size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">비자 플랜 분석 중</h2>
          <p className="text-gray-500 text-sm">Analyzing your best visa pathways...</p>
        </div>

        {/* KOR: 분석 항목 순차 표시 / ENG: Sequential analysis items */}
        <div className="w-full max-w-sm space-y-3">
          {[
            { label: '국적 조건 확인 중', icon: <Globe size={16} /> },
            { label: '학력 요건 매칭 중', icon: <GraduationCap size={16} /> },
            { label: '예산 플랜 계산 중', icon: <DollarSign size={16} /> },
            { label: '최적 경로 선별 중', icon: <BarChart2 size={16} /> },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <div className="text-pink-500 shrink-0">{item.icon}</div>
              <span className="text-sm text-gray-700 flex-1">{item.label}</span>
              <div className="w-5 h-5 rounded-full border-2 border-pink-300 border-t-pink-500 animate-spin shrink-0" />
            </div>
          ))}
        </div>

        {/* KOR: 분석 완료 메시지 / ENG: Analysis complete message */}
        <p className="mt-8 text-xs text-pink-400 animate-pulse">
          잠시만 기다려 주세요 · Please wait...
        </p>
      </div>
    );
  }

  // ============================================================
  // KOR: 결과 화면 — 보험 상품 카드 비교 레이아웃
  // ENG: Result screen — insurance product card comparison layout
  // ============================================================
  if (showResult) {
    return (
      <div className="min-h-screen bg-pink-50">
        {/* KOR: 결과 헤더 바 / ENG: Result header bar */}
        <header className="bg-white border-b border-pink-100 sticky top-0 z-20 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span className="font-bold text-gray-900 text-sm">비자비교 · VisaCompare</span>
            </div>
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 text-xs text-pink-600 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full transition-colors"
            >
              <RefreshCw size={13} />
              다시 시작
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          {/* KOR: 결과 요약 배너 / ENG: Result summary banner */}
          <div className="bg-linear-to-br from-pink-500 to-rose-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-pink-100 text-xs mb-1">맞춤 분석 완료 · Analysis Complete</p>
                <h1 className="text-xl font-bold mb-1">
                  {result.pathways.length}가지 비자 플랜을 찾았습니다!
                </h1>
                <p className="text-pink-100 text-sm">
                  We found {result.pathways.length} visa plans tailored for you.
                </p>
              </div>
              <div className="bg-white/20 rounded-xl px-3 py-2 text-center">
                <div className="text-2xl font-bold">{result.pathways.length}</div>
                <div className="text-xs text-pink-100">Plans</div>
              </div>
            </div>

            {/* KOR: 입력 요약 칩 / ENG: Input summary chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {input.nationality && (
                <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full">
                  {popularCountries.find(c => c.name === input.nationality)?.flag}{' '}
                  {input.nationality}
                </span>
              )}
              {input.educationLevel && (
                <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full">
                  {input.educationLevel}
                </span>
              )}
              {input.availableAnnualFund && (
                <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full">
                  {input.availableAnnualFund}
                </span>
              )}
              {input.finalGoal && (
                <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full">
                  {input.finalGoal}
                </span>
              )}
            </div>
          </div>

          {/* KOR: 정렬 기준 탭 / ENG: Sort criteria tabs */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            <span className="text-xs text-gray-500 whitespace-nowrap">정렬:</span>
            {['추천순', '비용순', '기간순', '성공률순'].map(label => (
              <button
                key={label}
                className="text-xs bg-white border border-pink-200 text-pink-600 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-pink-50 transition-colors first-of-type:bg-pink-500 first-of-type:text-white first-of-type:border-pink-500"
              >
                {label}
              </button>
            ))}
          </div>

          {/* KOR: 비자 경로 카드 목록 / ENG: Visa pathway card list */}
          <div className="space-y-4">
            {result.pathways.map((pathway, index) => {
              const badge = getRecommendBadge(pathway, result.pathways, input.priorityPreference);
              const coverageItems = getCoverageItems(pathway);
              const monthlyPremium = getMonthlyPremium((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0, pathway.totalDurationMonths);
              const isExpanded = expandedId === pathway.id;
              const coveredCount = coverageItems.filter(c => c.covered).length;

              return (
                <div
                  key={pathway.id}
                  className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 overflow-hidden ${
                    badge === 'Best Match'
                      ? 'border-pink-400 shadow-pink-100 shadow-md'
                      : 'border-gray-100 hover:border-pink-200'
                  }`}
                >
                  {/* KOR: 추천 배지 상단 바 / ENG: Recommendation badge top bar */}
                  {badge && (
                    <div className="bg-pink-500 text-white text-xs text-center py-1.5 font-semibold tracking-wide">
                      {badge === 'Best Match' && '⭐ 최적 추천 플랜 · Best Match'}
                      {badge === 'Most Affordable' && '💰 최저 비용 플랜 · Most Affordable'}
                      {badge === 'Fastest' && '⚡ 최단 기간 플랜 · Fastest'}
                    </div>
                  )}

                  {/* KOR: 카드 헤더 / ENG: Card header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        {/* KOR: 플랜 번호 + 이름 / ENG: Plan number + name */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-pink-50 text-pink-500 font-bold px-2 py-0.5 rounded-md">
                            PLAN {index + 1}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getFeasibilityBadgeStyle(pathway.feasibilityLabel)}`}>
                            {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base leading-snug">
                          {pathway.name}
                        </h3>
                      </div>

                      {/* KOR: 점수 원형 / ENG: Score circle */}
                      <div className="shrink-0 ml-3 flex flex-col items-center">
                        <div className="relative w-14 h-14">
                          <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                            <circle cx="28" cy="28" r="22" fill="none" stroke="#fce7f3" strokeWidth="5" />
                            <circle
                              cx="28" cy="28" r="22" fill="none"
                              stroke="#ec4899" strokeWidth="5"
                              strokeDasharray={`${(pathway.feasibilityScore / 100) * 138} 138`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-pink-600">
                            {pathway.feasibilityScore}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 mt-0.5">점수</span>
                      </div>
                    </div>

                    {/* KOR: 핵심 지표 3개 / ENG: 3 key metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-pink-50 rounded-xl p-3 text-center">
                        <Clock size={14} className="text-pink-400 mx-auto mb-1" />
                        <div className="text-base font-bold text-gray-900">{pathway.totalDurationMonths}개월</div>
                        <div className="text-xs text-gray-400">예상 기간</div>
                      </div>
                      <div className="bg-pink-50 rounded-xl p-3 text-center">
                        <DollarSign size={14} className="text-pink-400 mx-auto mb-1" />
                        <div className="text-base font-bold text-gray-900">
                          ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">총 비용</div>
                      </div>
                      <div className="bg-pink-50 rounded-xl p-3 text-center">
                        <TrendingUp size={14} className="text-pink-400 mx-auto mb-1" />
                        <div className="text-base font-bold text-gray-900">
                          ${monthlyPremium.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">월 평균</div>
                      </div>
                    </div>

                    {/* KOR: 비자 체인 흐름 / ENG: Visa chain flow */}
                    <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                      {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                        <React.Fragment key={i}>
                          <div className="flex flex-col items-center">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${VISA_CHAIN_COLORS[i % VISA_CHAIN_COLORS.length]}`}>
                              {v.visa}
                            </span>
                            <span className="text-xs text-gray-400 mt-0.5">{v.duration}</span>
                          </div>
                          {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                            <ArrowRight size={14} className="text-pink-300 shrink-0 mb-3" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* KOR: 커버리지 요약 바 / ENG: Coverage summary bar */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-500">커버리지</span>
                      <div className="flex-1 bg-pink-100 rounded-full h-2">
                        <div
                          className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(coveredCount / coverageItems.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-pink-600">
                        {coveredCount}/{coverageItems.length}
                      </span>
                    </div>

                    {/* KOR: 커버리지 체크 그리드 (접힌 상태) / ENG: Coverage check grid (collapsed) */}
                    <div className="grid grid-cols-2 gap-1.5 mb-4">
                      {coverageItems.slice(0, 4).map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          {item.covered ? (
                            <CheckCircle size={13} className="text-pink-500 shrink-0" />
                          ) : (
                            <XCircle size={13} className="text-gray-300 shrink-0" />
                          )}
                          <span className={`text-xs ${item.covered ? 'text-gray-700' : 'text-gray-300'}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* KOR: 상세 보기 / 접기 토글 버튼 / ENG: Expand / collapse toggle button */}
                    <button
                      onClick={() => toggleExpand(pathway.id)}
                      className="w-full flex items-center justify-center gap-1.5 text-sm text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl py-2.5 transition-colors font-medium"
                    >
                      {isExpanded ? '간략히 보기' : '상세 플랜 보기'}
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  {/* KOR: 확장 영역 — 상세 정보 / ENG: Expanded area — detailed info */}
                  {isExpanded && (
                    <div className="border-t border-pink-50 px-5 pb-5 pt-4 bg-pink-50/30">
                      {/* KOR: 상세 설명 / ENG: Detailed description */}
                      <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                        {pathway.description}
                      </p>

                      {/* KOR: 전체 커버리지 체크 / ENG: Full coverage check */}
                      <div className="mb-5">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                          커버리지 상세 · Coverage Details
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {coverageItems.map((item, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                                item.covered ? 'bg-white' : 'bg-gray-50'
                              }`}
                            >
                              {item.covered ? (
                                <CheckCircle size={14} className="text-pink-500 shrink-0" />
                              ) : (
                                <XCircle size={14} className="text-gray-300 shrink-0" />
                              )}
                              <div>
                                <div className={`text-xs font-medium ${item.covered ? 'text-gray-800' : 'text-gray-300'}`}>
                                  {item.label}
                                </div>
                                <div className="text-xs text-gray-400">{item.labelEn}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* KOR: 마일스톤 타임라인 / ENG: Milestone timeline */}
                      <div className="mb-5">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                          단계별 플랜 · Step-by-Step Plan
                        </h4>
                        <div className="relative">
                          {pathway.milestones.map((milestone, i) => (
                            <div key={i} className="flex gap-3 mb-4 last:mb-0">
                              {/* KOR: 타임라인 선 / ENG: Timeline line */}
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-base shrink-0 shadow-sm">
                                  {milestone.emoji}
                                </div>
                                {i < pathway.milestones.length - 1 && (
                                  <div className="w-0.5 h-full bg-pink-200 mt-1" />
                                )}
                              </div>
                              <div className="pb-4">
                                <div className="text-sm font-semibold text-gray-900 mb-0.5">
                                  {milestone.title}
                                </div>
                                <div className="text-xs text-gray-500 leading-relaxed">
                                  {milestone.description}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* KOR: 비용 비교 미니 차트 / ENG: Cost comparison mini chart */}
                      <div className="bg-white rounded-xl p-4 mb-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                          비용 분석 · Cost Breakdown
                        </h4>
                        <div className="flex items-end gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>총 비용</span>
                              <span className="font-bold text-gray-900">
                                ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="bg-pink-100 rounded-full h-3">
                              <div
                                className="bg-pink-500 h-3 rounded-full"
                                style={{
                                  width: `${Math.min((((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0) / 50000) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="bg-pink-50 rounded-lg p-2 text-center">
                            <div className="text-xs text-gray-500">월 평균 비용</div>
                            <div className="text-sm font-bold text-pink-600">
                              ${monthlyPremium.toLocaleString()}/mo
                            </div>
                          </div>
                          <div className="bg-pink-50 rounded-lg p-2 text-center">
                            <div className="text-xs text-gray-500">총 기간</div>
                            <div className="text-sm font-bold text-pink-600">
                              {pathway.totalDurationMonths}개월
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* KOR: CTA 버튼 / ENG: CTA button */}
                      <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                        이 플랜으로 시작하기
                        <ChevronRight size={16} />
                      </button>
                      <p className="text-xs text-center text-gray-400 mt-2">
                        Start with this plan · 전문 상담 연결 가능
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* KOR: 하단 비교 팁 섹션 / ENG: Bottom comparison tip section */}
          <div className="mt-6 bg-white rounded-2xl p-5 border border-pink-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                <AlertCircle size={16} className="text-pink-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  플랜 비교 안내 · How to Compare
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  각 플랜의 커버리지와 비용을 꼼꼼히 비교하세요. 비자 조건은 개인 상황에 따라 다를 수 있으므로 전문가 상담을 권장합니다.
                  Compare coverage and costs of each plan. Visa conditions may vary by individual situation — professional consultation is recommended.
                </p>
              </div>
            </div>
          </div>

          {/* KOR: 다시 시작 버튼 / ENG: Restart button */}
          <button
            onClick={handleRestart}
            className="w-full mt-4 border-2 border-pink-200 text-pink-600 hover:bg-pink-50 font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={15} />
            조건 변경하여 다시 비교하기
          </button>
        </main>
      </div>
    );
  }

  // ============================================================
  // KOR: 입력 단계 화면 — 보험 가입 폼 스타일
  // ENG: Input step screen — insurance enrollment form style
  // ============================================================

  const options = getStepOptions();
  const progressPercent = ((currentStep) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      {/* KOR: 헤더 / ENG: Header */}
      <header className="bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {/* KOR: 로고 / ENG: Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">비자비교</span>
              <span className="text-pink-400 text-xs ml-1">VisaCompare</span>
            </div>
          </div>
          {/* KOR: 단계 표시 / ENG: Step indicator */}
          <span className="text-xs text-gray-400 font-medium">
            {currentStep + 1} / {STEPS.length}
          </span>
        </div>

        {/* KOR: 진행 바 / ENG: Progress bar */}
        <div className="h-1 bg-pink-100">
          <div
            className="h-1 bg-pink-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* KOR: 메인 콘텐츠 / ENG: Main content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 flex flex-col">
        {/* KOR: 질문 카드 / ENG: Question card */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 mb-6">
          {/* KOR: 아이콘 + 질문 / ENG: Icon + question */}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500 shrink-0">
              {step?.icon}
            </div>
            <div>
              <p className="text-xs text-pink-400 font-medium">
                STEP {currentStep + 1} OF {STEPS.length}
              </p>
              <h2 className="text-lg font-bold text-gray-900 leading-snug">
                {step?.question}
              </h2>
            </div>
          </div>

          {/* KOR: 영어 부제 / ENG: English subtitle */}
          <p className="text-sm text-gray-400 ml-12 mb-4">{step?.questionEn}</p>

          {/* KOR: 헬퍼 텍스트 / ENG: Helper text */}
          <div className="flex items-start gap-2 bg-pink-50 rounded-xl px-3 py-2.5">
            <AlertCircle size={13} className="text-pink-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">{step?.helper}</p>
          </div>
        </div>

        {/* KOR: 선택지 버튼 목록 / ENG: Option button list */}
        <div className="space-y-2.5 flex-1">
          {options.map((option, i) => {
            const isSelected = input[step?.key as StepKey] === option.value;
            return (
              <button
                key={i}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-pink-200 hover:bg-pink-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* KOR: 라디오 원형 / ENG: Radio circle */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-pink-500' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-pink-700' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                </div>
                {isSelected && (
                  <CheckCircle size={16} className="text-pink-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* KOR: 뒤로가기 버튼 / ENG: Back button */}
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
            className="mt-6 w-full text-sm text-gray-400 hover:text-pink-500 py-2 transition-colors"
          >
            ← 이전 단계로 돌아가기
          </button>
        )}

        {/* KOR: 브랜드 안내 문구 / ENG: Brand tagline */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-300">
            Powered by 잡차자 Visa Engine · 31개 비자 유형 분석
          </p>
        </div>
      </main>

      {/* KOR: 하단 신뢰 지표 바 / ENG: Bottom trust indicator bar */}
      <div className="bg-white border-t border-pink-50 py-3">
        <div className="max-w-lg mx-auto px-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Shield size={12} className="text-pink-300" />
            <span>안전한 분석</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Zap size={12} className="text-pink-300" />
            <span>실시간 매칭</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Award size={12} className="text-pink-300" />
            <span>31개 비자 유형</span>
          </div>
        </div>
      </div>
    </div>
  );
}
