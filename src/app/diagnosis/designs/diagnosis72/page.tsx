'use client';

// KOR: 비자 진단 디자인 #72 — 구독 플랜 (Subscription Plan) 스타일
// ENG: Visa Diagnosis Design #72 — Subscription Plan style (SaaS pricing card layout)

import { useState } from 'react';
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
  Check,
  X,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  DollarSign,
  Globe,
  ChevronRight,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
  Award,
  Users,
  Lock,
  Unlock,
  Info,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Target,
  BarChart3,
} from 'lucide-react';

// KOR: 입력 단계 타입 정의
// ENG: Type definition for input steps
type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

// KOR: 비자 플랜 티어 타입 (구독 요금제처럼 표현)
// ENG: Visa plan tier type (displayed like subscription pricing tiers)
type PlanTier = 'basic' | 'standard' | 'premium';

// KOR: 플랜 구성 인터페이스
// ENG: Plan configuration interface
interface PlanConfig {
  tier: PlanTier;
  label: string;
  labelEn: string;
  pathway: RecommendedPathway;
  badge?: string;
  highlight: boolean;
  monthlyEquivalent: number;
  features: { label: string; included: boolean }[];
  accentColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeColor: string;
}

// KOR: 단계 목록 (입력 플로우 순서)
// ENG: Step list (input flow order)
const STEPS: Step[] = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
];

// KOR: 단계별 라벨 정의
// ENG: Label definition per step
const STEP_LABELS: Record<Step, { ko: string; en: string }> = {
  nationality: { ko: '국적 선택', en: 'Select Nationality' },
  age: { ko: '나이 입력', en: 'Enter Age' },
  educationLevel: { ko: '학력 선택', en: 'Select Education' },
  availableAnnualFund: { ko: '연간 예산 선택', en: 'Select Annual Budget' },
  finalGoal: { ko: '최종 목표', en: 'Final Goal' },
  priorityPreference: { ko: '우선순위', en: 'Priority' },
};

// KOR: 기본 입력 초기값
// ENG: Default initial input values
const DEFAULT_INPUT: DiagnosisInput = {
  nationality: '',
  age: 25,
  educationLevel: '',
  availableAnnualFund: '',
  finalGoal: '',
  priorityPreference: '',
};

// KOR: 플랜 기능 비교 테이블 데이터 생성 함수
// ENG: Function to generate plan feature comparison table data
const buildPlanFeatures = (pathway: RecommendedPathway, tier: PlanTier): { label: string; included: boolean }[] => {
  const isFeasible = pathway.feasibilityScore >= 70;
  const isMedium = pathway.feasibilityScore >= 50;

  return [
    { label: '비자 체인 경로 제공', included: true },
    { label: '단계별 마일스톤 가이드', included: true },
    { label: '예상 소요 기간 안내', included: true },
    { label: '예상 비용 분석', included: true },
    { label: '전문가 상담 연결', included: isFeasible },
    { label: '행정사 매칭 서비스', included: isFeasible },
    { label: '비자 서류 체크리스트', included: isMedium || isFeasible },
    { label: '맞춤형 취업 공고 추천', included: tier === 'premium' },
  ];
};

export default function Diagnosis72Page() {
  // KOR: 현재 단계 상태
  // ENG: Current step state
  const [currentStep, setCurrentStep] = useState<number>(0);

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [input, setInput] = useState<DiagnosisInput>(DEFAULT_INPUT);

  // KOR: 진단 결과 표시 여부
  // ENG: Whether to show diagnosis results
  const [showResult, setShowResult] = useState<boolean>(false);

  // KOR: 결과 데이터 (목업 사용)
  // ENG: Result data (using mock data)
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 월/연 토글 상태 (false=월별, true=연간)
  // ENG: Monthly/Annual toggle state (false=monthly, true=annual)
  const [isAnnual, setIsAnnual] = useState<boolean>(false);

  // KOR: 선택된 플랜 인덱스
  // ENG: Selected plan index
  const [selectedPlan, setSelectedPlan] = useState<number>(1);

  // KOR: 상세 펼침 상태 (pathway id → boolean)
  // ENG: Detail expand state (pathway id → boolean)
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null);

  // KOR: 현재 단계 키
  // ENG: Current step key
  const currentStepKey = STEPS[currentStep];

  // KOR: 진행률 퍼센트 계산
  // ENG: Calculate progress percentage
  const progressPercent = ((currentStep) / STEPS.length) * 100;

  // KOR: 다음 단계로 이동
  // ENG: Move to next step
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // KOR: 마지막 단계 완료 시 결과 표시
      // ENG: Show result when last step is completed
      setResult(mockDiagnosisResult);
      setShowResult(true);
    }
  };

  // KOR: 이전 단계로 이동
  // ENG: Move to previous step
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // KOR: 입력값 업데이트
  // ENG: Update input value
  const updateInput = (key: keyof DiagnosisInput, value: string | number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  // KOR: 현재 단계에서 다음으로 진행 가능한지 여부 확인
  // ENG: Check if the user can proceed from the current step
  const canProceed = (): boolean => {
    switch (currentStepKey) {
      case 'nationality': return input.nationality !== '';
      case 'age': return input.age >= 18 && input.age <= 60;
      case 'educationLevel': return input.educationLevel !== '';
      case 'availableAnnualFund': return input.availableAnnualFund !== '';
      case 'finalGoal': return input.finalGoal !== '';
      case 'priorityPreference': return input.priorityPreference !== '';
      default: return false;
    }
  };

  // KOR: 결과로부터 3개의 플랜 카드 구성 (인기 순위 기반)
  // ENG: Build 3 plan cards from results (based on popularity ranking)
  const buildPlans = (res: DiagnosisResult): PlanConfig[] => {
    const pathways = res.pathways.slice(0, 3);

    const tiers: PlanTier[] = ['basic', 'standard', 'premium'];
    const tierLabels = ['스타터', '스탠다드', '프리미엄'];
    const tierLabelsEn = ['Starter', 'Standard', 'Premium'];
    const badges = ['', '가장 인기', ''];
    const highlights = [false, true, false];

    // KOR: 월별 비용 환산 (총 비용 / 총 개월수)
    // ENG: Monthly cost equivalent (total cost / total months)
    return pathways.map((p, i) => {
      const monthly = Math.round((((p as any).estimatedCostUSD ?? p.estimatedCostWon ?? 0) / p.totalDurationMonths) * 100);
      const accentColors = [
        'indigo',
        'violet',
        'blue',
      ];
      const configs = [
        {
          accentColor: 'indigo',
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-200',
          textColor: 'text-indigo-700',
          badgeColor: 'bg-indigo-100 text-indigo-700',
        },
        {
          accentColor: 'violet',
          bgColor: 'bg-violet-600',
          borderColor: 'border-violet-500',
          textColor: 'text-white',
          badgeColor: 'bg-yellow-400 text-yellow-900',
        },
        {
          accentColor: 'blue',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          badgeColor: 'bg-blue-100 text-blue-700',
        },
      ];
      return {
        tier: tiers[i],
        label: tierLabels[i],
        labelEn: tierLabelsEn[i],
        pathway: p,
        badge: badges[i],
        highlight: highlights[i],
        monthlyEquivalent: monthly,
        features: buildPlanFeatures(p, tiers[i]),
        ...configs[i],
      };
    });
  };

  // KOR: 연간 할인율 (20% 절약)
  // ENG: Annual discount rate (save 20%)
  const getDisplayCost = (usd: number) => {
    return isAnnual ? Math.round(usd * 0.8) : usd;
  };

  // KOR: ─── 결과 화면 ───
  // ENG: ─── Result screen ───
  if (showResult && result) {
    const plans = buildPlans(result);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* KOR: 헤더 배너 — SaaS 스타일 */}
        {/* ENG: Header banner — SaaS style */}
        <div className="bg-linear-to-br from-indigo-700 via-indigo-600 to-violet-700 text-white">
          <div className="max-w-6xl mx-auto px-4 py-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Sparkles size={14} />
              <span>비자 경로 분석 완료 · Visa Path Analysis Complete</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
              {result.userInput.nationality} 출신 · 나이 {result.userInput.age}세
            </h1>
            <p className="text-indigo-100 text-lg mb-2">
              {result.pathways.length}개의 비자 경로를 플랜으로 비교해 드립니다
            </p>
            <p className="text-indigo-200 text-sm">
              {result.pathways.length} visa pathways compared as subscription plans
            </p>

            {/* KOR: 월/연 토글 스위치 */}
            {/* ENG: Monthly/Annual toggle switch */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-indigo-300'}`}>
                월별 비용 · Monthly
              </span>
              <button
                onClick={() => setIsAnnual((prev) => !prev)}
                className="relative inline-flex items-center"
                aria-label="Toggle annual billing"
              >
                {isAnnual ? (
                  <ToggleRight size={40} className="text-yellow-300" />
                ) : (
                  <ToggleLeft size={40} className="text-indigo-300" />
                )}
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-indigo-300'}`}>
                연간 절약 · Annual
                {isAnnual && (
                  <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    20% OFF
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* KOR: 3단 플랜 카드 비교 섹션 */}
        {/* ENG: 3-column plan card comparison section */}
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
              <div
                key={plan.pathway.id}
                onClick={() => setSelectedPlan(idx)}
                className={`relative rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden
                  ${plan.highlight
                    ? 'border-violet-500 shadow-2xl shadow-violet-200 scale-105'
                    : selectedPlan === idx
                      ? 'border-indigo-400 shadow-lg'
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
              >
                {/* KOR: 인기 배지 */}
                {/* ENG: Popular badge */}
                {plan.badge && (
                  <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <div className={`${plan.badgeColor} text-xs font-bold px-4 py-1.5 rounded-b-xl flex items-center gap-1`}>
                      <Star size={12} fill="currentColor" />
                      {plan.badge} · Most Popular
                    </div>
                  </div>
                )}

                {/* KOR: 카드 헤더 */}
                {/* ENG: Card header */}
                <div className={`${plan.highlight ? 'bg-violet-600' : 'bg-white'} p-6 ${plan.badge ? 'pt-10' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${plan.highlight ? 'text-violet-200' : 'text-gray-400'}`}>
                      {plan.tier.toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      plan.highlight
                        ? 'bg-violet-500 text-violet-100'
                        : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {getFeasibilityEmoji(plan.pathway.feasibilityLabel)} {plan.pathway.feasibilityLabel}
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold mb-0.5 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.label}
                  </h3>
                  <p className={`text-xs mb-4 ${plan.highlight ? 'text-violet-200' : 'text-gray-500'}`}>
                    {plan.labelEn}
                  </p>

                  {/* KOR: 가격 표시 — 월 환산 비용 */}
                  {/* ENG: Price display — monthly equivalent cost */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                      ${getDisplayCost((plan.pathway as any).estimatedCostUSD ?? plan.pathway.estimatedCostWon ?? 0).toLocaleString()}
                    </span>
                    <span className={`text-sm ${plan.highlight ? 'text-violet-200' : 'text-gray-500'}`}>
                      총 비용
                    </span>
                  </div>
                  {isAnnual && (
                    <p className={`text-xs mb-3 ${plan.highlight ? 'text-yellow-300' : 'text-green-600'}`}>
                      원가 ${((plan.pathway as any).estimatedCostUSD ?? plan.pathway.estimatedCostWon ?? 0).toLocaleString()} → 20% 절약!
                    </p>
                  )}

                  <div className={`flex items-center gap-1 text-xs ${plan.highlight ? 'text-violet-200' : 'text-gray-400'}`}>
                    <Clock size={12} />
                    <span>총 {plan.pathway.totalDurationMonths}개월 경로 · {plan.pathway.totalDurationMonths} months</span>
                  </div>
                </div>

                {/* KOR: 비자 경로 이름 */}
                {/* ENG: Visa pathway name */}
                <div className={`px-6 py-3 border-t ${plan.highlight ? 'bg-violet-700 border-violet-500' : 'bg-gray-50 border-gray-100'}`}>
                  <p className={`text-sm font-semibold ${plan.highlight ? 'text-violet-100' : 'text-gray-700'}`}>
                    {plan.pathway.name}
                  </p>
                </div>

                {/* KOR: 기능 목록 체크 */}
                {/* ENG: Feature checklist */}
                <div className={`px-6 py-5 space-y-3 ${plan.highlight ? 'bg-violet-600' : 'bg-white'}`}>
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      {feature.included ? (
                        <CheckCircle2
                          size={16}
                          className={`shrink-0 ${plan.highlight ? 'text-green-300' : 'text-green-500'}`}
                        />
                      ) : (
                        <X
                          size={16}
                          className={`shrink-0 ${plan.highlight ? 'text-violet-400' : 'text-gray-300'}`}
                        />
                      )}
                      <span className={`text-sm ${
                        feature.included
                          ? plan.highlight ? 'text-violet-100' : 'text-gray-700'
                          : plan.highlight ? 'text-violet-400' : 'text-gray-300'
                      }`}>
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* KOR: CTA 버튼 */}
                {/* ENG: CTA button */}
                <div className={`px-6 pb-6 pt-2 ${plan.highlight ? 'bg-violet-600' : 'bg-white'}`}>
                  <button
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2
                      ${plan.highlight
                        ? 'bg-white text-violet-700 hover:bg-violet-50 shadow-lg'
                        : selectedPlan === idx
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                      }`}
                  >
                    {plan.highlight ? <Zap size={16} /> : <ArrowRight size={16} />}
                    {plan.highlight ? '이 플랜으로 시작하기' : '선택하기'}
                  </button>
                </div>

                {/* KOR: 선택됨 표시 오버레이 */}
                {/* ENG: Selected indicator overlay */}
                {selectedPlan === idx && !plan.highlight && (
                  <div className="absolute top-3 right-3 bg-indigo-600 rounded-full p-1">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* KOR: 기능 비교 상세 테이블 */}
        {/* ENG: Detailed feature comparison table */}
        <div className="max-w-6xl mx-auto px-4 pb-10">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-900 px-6 py-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <BarChart3 size={20} />
                플랜별 상세 비교 · Detailed Plan Comparison
              </h2>
            </div>

            {/* KOR: 비교 테이블 헤더 */}
            {/* ENG: Comparison table header */}
            <div className="grid grid-cols-4 gap-0 border-b border-gray-100">
              <div className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                항목 · Feature
              </div>
              {plans.map((plan) => (
                <div
                  key={plan.pathway.id}
                  className={`px-4 py-4 text-center ${plan.highlight ? 'bg-violet-50' : ''}`}
                >
                  <p className="font-bold text-gray-900 text-sm">{plan.label}</p>
                  <p className="text-xs text-gray-500">{plan.labelEn}</p>
                </div>
              ))}
            </div>

            {/* KOR: 비교 데이터 행 */}
            {/* ENG: Comparison data rows */}
            {[
              {
                label: '실현 가능성 점수',
                values: plans.map((p) => `${p.pathway.feasibilityScore}점`),
              },
              {
                label: '총 소요 기간',
                values: plans.map((p) => `${p.pathway.totalDurationMonths}개월`),
              },
              {
                label: '예상 총 비용',
                values: plans.map((p) => `$${getDisplayCost((p.pathway as any).estimatedCostUSD ?? p.pathway.estimatedCostWon ?? 0).toLocaleString()}`),
              },
              {
                label: '비자 단계 수',
                values: plans.map((p) => `${(Array.isArray(p.visaChain) ? p.visaChain : []).length}단계`),
              },
              {
                label: '마일스톤 수',
                values: plans.map((p) => `${p.pathway.milestones.length}개`),
              },
            ].map((row, rIdx) => (
              <div
                key={rIdx}
                className={`grid grid-cols-4 gap-0 border-b border-gray-50 ${rIdx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}
              >
                <div className="px-6 py-3.5 text-sm text-gray-700 font-medium">{row.label}</div>
                {row.values.map((val, vIdx) => (
                  <div
                    key={vIdx}
                    className={`px-4 py-3.5 text-center text-sm font-semibold ${
                      plans[vIdx].highlight ? 'bg-violet-50 text-violet-700' : 'text-gray-700'
                    }`}
                  >
                    {val}
                  </div>
                ))}
              </div>
            ))}

            {/* KOR: 기능 포함 여부 행 */}
            {/* ENG: Feature inclusion rows */}
            {plans[0].features.map((feature, fIdx) => (
              <div
                key={fIdx}
                className={`grid grid-cols-4 gap-0 border-b border-gray-50 ${fIdx % 2 === 0 ? '' : 'bg-gray-50/50'}`}
              >
                <div className="px-6 py-3.5 text-sm text-gray-600">{feature.label}</div>
                {plans.map((plan, pIdx) => (
                  <div
                    key={pIdx}
                    className={`px-4 py-3.5 flex justify-center items-center ${plan.highlight ? 'bg-violet-50' : ''}`}
                  >
                    {plan.features[fIdx]?.included ? (
                      <Check size={18} className={`${plan.highlight ? 'text-violet-600' : 'text-green-500'}`} />
                    ) : (
                      <X size={18} className="text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* KOR: 비자 체인 상세 카드 (펼침/접힘) */}
        {/* ENG: Visa chain detail cards (expand/collapse) */}
        <div className="max-w-6xl mx-auto px-4 pb-10">
          <h2 className="text-gray-900 font-bold text-xl mb-4 flex items-center gap-2">
            <Target size={22} className="text-indigo-600" />
            경로별 단계 상세 · Step-by-Step Path Details
          </h2>
          <div className="space-y-4">
            {result.pathways.map((pathway, idx) => {
              const plan = plans[idx];
              const isExpanded = expandedPathway === pathway.id;
              return (
                <div
                  key={pathway.id}
                  className={`bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                    plan?.highlight ? 'border-violet-400 shadow-lg' : 'border-gray-200'
                  }`}
                >
                  {/* KOR: 경로 헤더 (클릭 시 펼침) */}
                  {/* ENG: Path header (click to expand) */}
                  <button
                    onClick={() => setExpandedPathway(isExpanded ? null : pathway.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm
                        ${plan?.highlight ? 'bg-violet-600' : 'bg-indigo-500'}`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-gray-900">{pathway.name}</span>
                          {plan?.badge && (
                            <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Star size={10} fill="currentColor" />
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1">{pathway.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-indigo-700">${getDisplayCost((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{pathway.totalDurationMonths}개월</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                        isExpanded ? 'bg-indigo-100 rotate-90' : 'bg-gray-100'
                      }`}>
                        <ChevronRight size={16} className="text-indigo-600" />
                      </div>
                    </div>
                  </button>

                  {/* KOR: 펼쳐진 상세 내용 */}
                  {/* ENG: Expanded detail content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      {/* KOR: 비자 체인 시각화 */}
                      {/* ENG: Visa chain visualization */}
                      <div className="pt-5 mb-6">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          비자 체인 · Visa Chain
                        </p>
                        <div className="flex items-center flex-wrap gap-2">
                          {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((vc, vcIdx) => (
                            <div key={vcIdx} className="flex items-center gap-2">
                              <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-center">
                                <p className="text-sm font-bold text-indigo-800">{vc.visa}</p>
                                <p className="text-xs text-indigo-500">{vc.duration}</p>
                              </div>
                              {vcIdx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                                <ArrowRight size={16} className="text-gray-400 shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* KOR: 마일스톤 단계 */}
                      {/* ENG: Milestone steps */}
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        단계별 마일스톤 · Milestones
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {pathway.milestones.map((ms, msIdx) => (
                          <div key={msIdx} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                            <span className="text-2xl shrink-0">{ms.emoji}</span>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm mb-1">
                                {msIdx + 1}. {ms.title}
                              </p>
                              <p className="text-xs text-gray-500 leading-relaxed">{ms.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* KOR: 실현 가능성 스코어 바 */}
                      {/* ENG: Feasibility score bar */}
                      <div className="mt-5 bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-gray-700">
                            실현 가능성 · Feasibility Score
                          </p>
                          <span className="text-sm font-bold text-indigo-700">{pathway.feasibilityScore}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getScoreColor(pathway.feasibilityLabel)} transition-all duration-700`}
                            style={{ width: `${pathway.feasibilityScore}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">
                          {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel} — {((pathway as any).description ?? pathway.note ?? '').slice(0, 60)}...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* KOR: 재진단 버튼 */}
        {/* ENG: Re-diagnosis button */}
        <div className="max-w-6xl mx-auto px-4 pb-16 text-center">
          <button
            onClick={() => {
              setShowResult(false);
              setCurrentStep(0);
              setInput(DEFAULT_INPUT);
              setResult(null);
              setSelectedPlan(1);
            }}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors"
          >
            <ArrowRight size={18} className="rotate-180" />
            다시 진단하기 · Re-diagnose
          </button>
        </div>
      </div>
    );
  }

  // KOR: ─── 입력 화면 ───
  // ENG: ─── Input screen ───
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-violet-50">
      {/* KOR: 상단 SaaS 스타일 헤더 */}
      {/* ENG: Top SaaS style header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Globe size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">잡차자 비자 진단</span>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
              구독 플랜 스타일
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx < currentStep
                    ? 'bg-indigo-600 w-6'
                    : idx === currentStep
                      ? 'bg-indigo-400 w-8'
                      : 'bg-gray-200 w-4'
                }`}
              />
            ))}
          </div>
        </div>

        {/* KOR: 전체 진행 바 */}
        {/* ENG: Overall progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-linear-to-br from-indigo-500 to-violet-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* KOR: 메인 입력 카드 */}
      {/* ENG: Main input card */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* KOR: 상단 소개 섹션 (첫 단계에만 표시) */}
        {/* ENG: Top introduction section (shown only on first step) */}
        {currentStep === 0 && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Award size={14} />
              <span>비자 경로를 요금제처럼 비교 · Compare visa paths like pricing plans</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              나에게 맞는 비자 플랜을 찾아보세요
            </h1>
            <p className="text-gray-500 text-base max-w-lg mx-auto">
              정보를 입력하면, 스트라이프(Stripe) 요금제처럼 비자 경로를 플랜 카드로 비교해 드립니다.
            </p>
          </div>
        )}

        {/* KOR: 단계 제목 카드 */}
        {/* ENG: Step title card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
          <div className="bg-linear-to-br from-indigo-600 to-violet-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-xs font-medium mb-1">
                  STEP {currentStep + 1} / {STEPS.length}
                </p>
                <h2 className="text-white text-xl font-bold">
                  {STEP_LABELS[currentStepKey].ko}
                </h2>
                <p className="text-indigo-200 text-sm mt-0.5">
                  {STEP_LABELS[currentStepKey].en}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">
                  {currentStep === 0 ? '🌍' :
                   currentStep === 1 ? '🎂' :
                   currentStep === 2 ? '🎓' :
                   currentStep === 3 ? '💰' :
                   currentStep === 4 ? '🎯' : '⚡'}
                </span>
              </div>
            </div>
          </div>

          {/* KOR: 단계별 입력 UI */}
          {/* ENG: Step-by-step input UI */}
          <div className="p-6">
            {/* KOR: 국적 선택 */}
            {/* ENG: Nationality selection */}
            {currentStepKey === 'nationality' && (
              <div>
                <p className="text-sm text-gray-500 mb-4">국적을 선택하세요 · Select your nationality</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {popularCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => updateInput('nationality', country.name)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 text-left
                        ${input.nationality === country.name
                          ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                        }`}
                    >
                      <span className="text-2xl shrink-0">{country.flag}</span>
                      <span className={`text-sm font-medium ${input.nationality === country.name ? 'text-indigo-800' : 'text-gray-700'}`}>
                        {country.name}
                      </span>
                      {input.nationality === country.name && (
                        <Check size={14} className="text-indigo-600 ml-auto shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: 나이 입력 */}
            {/* ENG: Age input */}
            {currentStepKey === 'age' && (
              <div>
                <p className="text-sm text-gray-500 mb-4">현재 나이를 입력하세요 · Enter your current age</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateInput('age', Math.max(18, input.age - 1))}
                    className="w-12 h-12 rounded-xl border-2 border-gray-200 text-gray-600 text-xl font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-5xl font-extrabold text-indigo-700 mb-1">{input.age}</div>
                    <p className="text-sm text-gray-400">세 · years old</p>
                  </div>
                  <button
                    onClick={() => updateInput('age', Math.min(60, input.age + 1))}
                    className="w-12 h-12 rounded-xl border-2 border-gray-200 text-gray-600 text-xl font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <div className="mt-6">
                  <input
                    type="range"
                    min={18}
                    max={60}
                    value={input.age}
                    onChange={(e) => updateInput('age', parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>18세</span>
                    <span>60세</span>
                  </div>
                </div>
              </div>
            )}

            {/* KOR: 학력 선택 */}
            {/* ENG: Education level selection */}
            {currentStepKey === 'educationLevel' && (
              <div>
                <p className="text-sm text-gray-500 mb-4">최종 학력을 선택하세요 · Select your education level</p>
                <div className="space-y-2.5">
                  {educationOptions.map((edu) => (
                    <button
                      key={edu}
                      onClick={() => updateInput('educationLevel', edu)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${input.educationLevel === edu
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                      <span className={`font-medium text-sm ${input.educationLevel === edu ? 'text-indigo-800' : 'text-gray-700'}`}>
                        {edu}
                      </span>
                      {input.educationLevel === edu ? (
                        <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: 연간 예산 선택 */}
            {/* ENG: Annual fund selection */}
            {currentStepKey === 'availableAnnualFund' && (
              <div>
                <p className="text-sm text-gray-500 mb-4">연간 가용 예산을 선택하세요 · Select your annual available budget</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fundOptions.map((fund) => (
                    <button
                      key={fund}
                      onClick={() => updateInput('availableAnnualFund', fund)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${input.availableAnnualFund === fund
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                      <DollarSign size={18} className={input.availableAnnualFund === fund ? 'text-indigo-600' : 'text-gray-400'} />
                      <span className={`font-medium text-sm ${input.availableAnnualFund === fund ? 'text-indigo-800' : 'text-gray-700'}`}>
                        {fund}
                      </span>
                      {input.availableAnnualFund === fund && (
                        <Check size={16} className="text-indigo-600 ml-auto shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: 최종 목표 선택 */}
            {/* ENG: Final goal selection */}
            {currentStepKey === 'finalGoal' && (
              <div>
                <p className="text-sm text-gray-500 mb-4">한국에서의 최종 목표를 선택하세요 · Select your final goal in Korea</p>
                <div className="space-y-2.5">
                  {goalOptions.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => updateInput('finalGoal', goal)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${input.finalGoal === goal
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                      <TrendingUp size={18} className={input.finalGoal === goal ? 'text-indigo-600' : 'text-gray-400'} />
                      <span className={`font-medium text-sm ${input.finalGoal === goal ? 'text-indigo-800' : 'text-gray-700'}`}>
                        {goal}
                      </span>
                      {input.finalGoal === goal && (
                        <Check size={16} className="text-indigo-600 ml-auto shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: 우선순위 선택 */}
            {/* ENG: Priority preference selection */}
            {currentStepKey === 'priorityPreference' && (
              <div>
                <p className="text-sm text-gray-500 mb-4">어떤 것을 가장 우선시하나요? · What do you prioritize most?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {priorityOptions.map((priority, pIdx) => {
                    const icons = [<Zap key="zap" size={20} />, <DollarSign key="dollar" size={20} />, <Shield key="shield" size={20} />, <Users key="users" size={20} />];
                    return (
                      <button
                        key={priority}
                        onClick={() => updateInput('priorityPreference', priority)}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left
                          ${input.priorityPreference === priority
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300'
                          }`}
                      >
                        <span className={input.priorityPreference === priority ? 'text-indigo-600' : 'text-gray-400'}>
                          {icons[pIdx]}
                        </span>
                        <span className={`font-medium text-sm leading-snug ${input.priorityPreference === priority ? 'text-indigo-800' : 'text-gray-700'}`}>
                          {priority}
                        </span>
                        {input.priorityPreference === priority && (
                          <Check size={16} className="text-indigo-600 ml-auto shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KOR: 네비게이션 버튼 */}
        {/* ENG: Navigation buttons */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={16} className="rotate-180" />
              이전
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200
              ${canProceed()
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {currentStep === STEPS.length - 1 ? (
              <>
                <Sparkles size={18} />
                비자 플랜 분석하기 · Analyze Visa Plans
              </>
            ) : (
              <>
                다음 · Next
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* KOR: 하단 신뢰 배지 */}
        {/* ENG: Bottom trust badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Lock size={12} />
            <span>개인정보 보호</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield size={12} />
            <span>31개 비자 유형 분석</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} />
            <span>2,629개 테스트 검증</span>
          </div>
        </div>
      </div>
    </div>
  );
}
