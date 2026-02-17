'use client';

// 디자인 #42: 여행 일정표 (Travel Itinerary) 컨셉 비자 진단 페이지
// Design #42: Travel Itinerary concept visa diagnosis page
// 비자 경로를 여행 코스처럼 표현, TripIt/Wanderlog 스타일
// Represents visa pathways as travel itineraries, TripIt/Wanderlog style

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
  MapPin,
  Plane,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Star,
  Navigation,
  Compass,
  Flag,
  Camera,
  Backpack,
  Globe,
  DollarSign,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Circle,
  BookOpen,
  Briefcase,
  Home,
  Award,
  Info,
  AlertCircle,
  Ticket,
  Map,
  Route,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference' | 'result';

interface FormState {
  nationality: string;
  age: number | '';
  educationLevel: string;
  availableAnnualFund: number | '';
  finalGoal: string;
  priorityPreference: string;
}

// ============================================================
// 유틸 함수들 / Utility functions
// ============================================================

// 마일스톤 타입별 아이콘 / Milestone type icons
function getMilestoneIcon(type: string): React.ReactNode {
  switch (type) {
    case 'entry': return <Plane className="w-4 h-4" />;
    case 'part_time_unlock': return <Briefcase className="w-4 h-4" />;
    case 'study_upgrade': return <BookOpen className="w-4 h-4" />;
    case 'part_time_expand': return <TrendingUp className="w-4 h-4" />;
    case 'graduation': return <Award className="w-4 h-4" />;
    case 'final_goal': return <Flag className="w-4 h-4" />;
    case 'application': return <CheckCircle className="w-4 h-4" />;
    case 'waiting': return <Clock className="w-4 h-4" />;
    default: return <Circle className="w-4 h-4" />;
  }
}

// 마일스톤 타입별 색상 / Milestone type colors
function getMilestoneColor(type: string): string {
  switch (type) {
    case 'entry': return 'bg-orange-400';
    case 'part_time_unlock': return 'bg-amber-400';
    case 'study_upgrade': return 'bg-blue-400';
    case 'part_time_expand': return 'bg-teal-400';
    case 'graduation': return 'bg-purple-400';
    case 'final_goal': return 'bg-orange-600';
    case 'application': return 'bg-green-400';
    case 'waiting': return 'bg-gray-400';
    default: return 'bg-orange-300';
  }
}

// 비용 포맷 / Cost formatting
function formatCost(won: number): string {
  if (won === 0) return '무료 Free';
  if (won >= 10000) return `${(won / 10000).toFixed(0)}억원`;
  if (won >= 1000) return `${(won / 1000).toFixed(1)}천만원`;
  return `${won}만원`;
}

// 기간 포맷 / Duration formatting
function formatDuration(months: number): string {
  if (months === 0) return '즉시 Instant';
  if (months < 12) return `${months}개월`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years}년`;
  return `${years}년 ${rem}개월`;
}

// ============================================================
// 서브 컴포넌트: 입력 단계 헤더 / Input step header
// ============================================================

function StepHeader({ step, totalSteps }: { step: number; totalSteps: number }) {
  const destinations = ['출발지', '여행자', '학력', '여행경비', '목적지', '여행스타일'];
  const current = destinations[step - 1] || '';
  return (
    <div className="flex items-center gap-3 mb-6">
      {/* 여행 경로 점 표시 / Travel route dots */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i + 1 < step
                ? 'w-3 h-3 bg-orange-500'
                : i + 1 === step
                ? 'w-4 h-4 bg-orange-500 ring-2 ring-orange-300'
                : 'w-2 h-2 bg-orange-200'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-orange-600 font-medium">
        {step}/{totalSteps} — {current}
      </span>
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 비자 체인 배지 / Visa chain badges
// ============================================================

function VisaChainBadges({ chain }: { chain: string }) {
  const parts = chain.split(' → ').map((s) => s.trim());
  return (
    <div className="flex flex-wrap items-center gap-1">
      {parts.map((visa, i) => (
        <React.Fragment key={i}>
          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full border border-orange-200">
            {visa}
          </span>
          {i < parts.length - 1 && (
            <ArrowRight className="w-3 h-3 text-orange-400 shrink-0" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 여행 일정 카드 (경로 카드) / Travel itinerary card
// ============================================================

function ItineraryCard({ pathway, index }: { pathway: RecommendedPathway; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);
  const scoreColor = getScoreColor(pathway.finalScore);

  // 순위별 배지 색상 / Rank badge colors
  const rankColors: Record<number, string> = {
    0: 'bg-orange-500 text-white',
    1: 'bg-orange-400 text-white',
    2: 'bg-amber-400 text-white',
    3: 'bg-amber-300 text-amber-900',
    4: 'bg-orange-200 text-orange-800',
  };
  const rankLabels: Record<number, string> = {
    0: '1st PICK',
    1: '2nd',
    2: '3rd',
    3: '4th',
    4: '5th',
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 overflow-hidden ${
      index === 0 ? 'border-orange-400' : 'border-orange-100 hover:border-orange-200'
    }`}>
      {/* 카드 헤더 — 여행지 커버처럼 / Card header like travel destination cover */}
      <div
        className={`relative px-5 py-4 cursor-pointer ${
          index === 0
            ? 'bg-linear-to-br from-orange-500 to-amber-500 text-white'
            : 'bg-linear-to-br from-orange-50 to-amber-50'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* 순위 배지 / Rank badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-bold ${rankColors[index] ?? 'bg-gray-200 text-gray-600'}`}>
              {rankLabels[index] ?? `${index + 1}th`}
            </span>
            <div>
              {/* 경로 이름 / Pathway name */}
              <h3 className={`font-bold text-base leading-tight ${index === 0 ? 'text-white' : 'text-gray-800'}`}>
                {pathway.nameKo}
              </h3>
              <p className={`text-xs mt-0.5 ${index === 0 ? 'text-orange-100' : 'text-gray-500'}`}>
                {pathway.nameEn}
              </p>
            </div>
          </div>

          {/* 점수 + 가능성 / Score + feasibility */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className="text-2xl font-black"
              style={{ color: index === 0 ? 'white' : scoreColor }}
            >
              {pathway.finalScore}
            </span>
            <span className={`text-xs ${index === 0 ? 'text-orange-100' : 'text-gray-500'}`}>
              {emoji} {pathway.feasibilityLabel}
            </span>
          </div>
        </div>

        {/* 핵심 정보 바 / Key info bar */}
        <div className="flex flex-wrap gap-3 mt-3">
          {/* 기간 / Duration */}
          <div className={`flex items-center gap-1 text-xs ${index === 0 ? 'text-orange-100' : 'text-gray-600'}`}>
            <Clock className="w-3 h-3 shrink-0" />
            <span>{formatDuration(pathway.estimatedMonths)}</span>
          </div>
          {/* 비용 / Cost */}
          <div className={`flex items-center gap-1 text-xs ${index === 0 ? 'text-orange-100' : 'text-gray-600'}`}>
            <DollarSign className="w-3 h-3 shrink-0" />
            <span>{formatCost(pathway.estimatedCostWon)}</span>
          </div>
          {/* 비자 체인 / Visa chain */}
          <div className={`flex items-center gap-1 text-xs ${index === 0 ? 'text-orange-100' : 'text-gray-600'}`}>
            <Ticket className="w-3 h-3 shrink-0" />
            <span className="font-medium">{pathway.visaChain}</span>
          </div>
        </div>

        {/* 확장 버튼 / Expand button */}
        <div className={`absolute bottom-3 right-4 ${index === 0 ? 'text-white' : 'text-orange-400'}`}>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* 확장 영역: 여행 일정 타임라인 / Expanded: travel timeline */}
      {expanded && (
        <div className="px-5 py-4 space-y-5 border-t border-orange-100">
          {/* 비자 체인 시각화 / Visa chain visualization */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              비자 여정 Visa Route
            </p>
            <VisaChainBadges chain={pathway.visaChain} />
          </div>

          {/* 마일스톤 타임라인 / Milestone timeline */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              여행 일정 Itinerary
            </p>
            <div className="relative">
              {/* 세로 연결선 / Vertical connector line */}
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-orange-100" />

              <div className="space-y-4">
                {pathway.milestones.map((milestone, mi) => (
                  <div key={mi} className="flex gap-3 relative">
                    {/* 타임라인 아이콘 / Timeline icon */}
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white z-10 ${getMilestoneColor(milestone.type)}`}>
                      {getMilestoneIcon(milestone.type)}
                    </div>

                    {/* 마일스톤 내용 카드 / Milestone content card */}
                    <div className="flex-1 bg-orange-50 rounded-xl p-3 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-gray-800 leading-tight">{milestone.nameKo}</p>
                          {/* 비자 상태 배지 / Visa status badge */}
                          {milestone.visaStatus && milestone.visaStatus !== 'none' && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-orange-200 text-orange-800 text-xs rounded-full font-bold">
                              {milestone.visaStatus}
                            </span>
                          )}
                        </div>
                        {/* 시작 월 / Start month */}
                        <span className="shrink-0 text-xs text-orange-500 font-medium whitespace-nowrap">
                          {milestone.monthFromStart === 0 ? '출발 Day 1' : `+${milestone.monthFromStart}개월`}
                        </span>
                      </div>

                      {/* 아르바이트 가능 정보 / Part-time work info */}
                      {milestone.canWorkPartTime && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-teal-700">
                          <Briefcase className="w-3 h-3 shrink-0" />
                          <span>
                            주 {milestone.weeklyHours}시간 근로 가능 · 월 약 {milestone.estimatedMonthlyIncome}만원
                          </span>
                        </div>
                      )}

                      {/* 요건 / Requirements */}
                      <p className="mt-1.5 text-xs text-gray-500">{milestone.requirements}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 다음 단계 액션 / Next step actions */}
          {pathway.nextSteps.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                출발 준비 Next Steps
              </p>
              <div className="space-y-2">
                {pathway.nextSteps.map((step, si) => (
                  <div key={si} className="flex items-start gap-2 p-3 bg-white border border-orange-100 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800">{step.nameKo}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 메모 / Note */}
          {pathway.note && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">{pathway.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================

export default function Diagnosis42Page() {
  // 현재 단계 / Current step
  const [currentStep, setCurrentStep] = useState<Step>('nationality');
  // 폼 상태 / Form state
  const [form, setForm] = useState<FormState>({
    nationality: '',
    age: '',
    educationLevel: '',
    availableAnnualFund: '',
    finalGoal: '',
    priorityPreference: '',
  });
  // 결과 표시 여부 / Result display state
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  // 로딩 / Loading
  const [isLoading, setIsLoading] = useState(false);
  // 선택된 경로 인덱스 / Selected pathway index
  const [selectedPathwayIndex, setSelectedPathwayIndex] = useState(0);

  // 단계 순서 / Step order
  const stepOrder: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'];
  const currentStepIndex = stepOrder.indexOf(currentStep);

  // 다음 단계로 / Go to next step
  function goNext() {
    const next = stepOrder[currentStepIndex + 1];
    if (next) {
      setCurrentStep(next);
    } else {
      // 진단 실행 / Run diagnosis
      runDiagnosis();
    }
  }

  // 이전 단계로 / Go to previous step
  function goBack() {
    if (currentStep === 'nationality') return;
    const prev = stepOrder[currentStepIndex - 1];
    if (prev) setCurrentStep(prev);
  }

  // 진단 실행 (목업) / Run diagnosis (mock)
  function runDiagnosis() {
    setIsLoading(true);
    setCurrentStep('result');
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setIsLoading(false);
    }, 1800);
  }

  // 다시 시작 / Restart
  function restart() {
    setForm({ nationality: '', age: '', educationLevel: '', availableAnnualFund: '', finalGoal: '', priorityPreference: '' });
    setCurrentStep('nationality');
    setResult(null);
    setIsLoading(false);
    setSelectedPathwayIndex(0);
  }

  // 현재 단계 유효성 / Current step validity
  function isCurrentStepValid(): boolean {
    switch (currentStep) {
      case 'nationality': return form.nationality !== '';
      case 'age': return form.age !== '' && Number(form.age) >= 18 && Number(form.age) <= 60;
      case 'educationLevel': return form.educationLevel !== '';
      case 'availableAnnualFund': return form.availableAnnualFund !== '';
      case 'finalGoal': return form.finalGoal !== '';
      case 'priorityPreference': return form.priorityPreference !== '';
      default: return false;
    }
  }

  // ============================================================
  // 렌더링 / Rendering
  // ============================================================

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-white font-sans">
      {/* 상단 헤더 / Top header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-orange-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 leading-none">잡차자</p>
              <p className="text-sm font-bold text-gray-800 leading-tight">비자 여정 플래너</p>
            </div>
          </div>
          {result && (
            <button
              onClick={restart}
              className="text-xs text-orange-600 font-medium flex items-center gap-1 hover:text-orange-700"
            >
              <Navigation className="w-3.5 h-3.5" />
              새 여정
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-20">
        {/* ======================================================
            결과 페이지 / Result page
        ====================================================== */}
        {currentStep === 'result' && (
          <div className="space-y-5">
            {/* 로딩 / Loading */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center animate-pulse">
                  <Plane className="w-8 h-8 text-orange-500 animate-bounce" />
                </div>
                <p className="text-gray-600 font-medium">최적 비자 경로 탐색 중...</p>
                <p className="text-gray-400 text-sm">Finding your best visa journey</p>
                <div className="flex gap-1 mt-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            ) : result ? (
              <>
                {/* 결과 요약 배너 / Result summary banner */}
                <div className="bg-linear-to-br from-orange-500 to-amber-500 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Map className="w-5 h-5 text-orange-200" />
                    <p className="text-orange-100 text-sm">여정 분석 완료 Journey Analysis Complete</p>
                  </div>
                  <h2 className="text-xl font-black leading-tight mb-1">
                    {result.pathways.length}가지 비자 경로 발견!
                  </h2>
                  <p className="text-orange-100 text-sm">
                    {result.meta.totalPathwaysEvaluated}개 경로 중 {result.meta.hardFilteredOut}개 필터링 →{' '}
                    <strong className="text-white">{result.pathways.length}개 추천</strong>
                  </p>

                  {/* 입력 정보 요약 / Input summary */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {form.nationality && (
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white">
                        {popularCountries.find((c) => c.code === form.nationality)?.flag}{' '}
                        {popularCountries.find((c) => c.code === form.nationality)?.nameKo ?? form.nationality}
                      </span>
                    )}
                    {form.age && (
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white">
                        {form.age}세
                      </span>
                    )}
                    {form.educationLevel && (
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white">
                        {educationOptions.find((e) => e.value === form.educationLevel)?.labelKo ?? form.educationLevel}
                      </span>
                    )}
                    {form.finalGoal && (
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white">
                        {goalOptions.find((g) => g.value === form.finalGoal)?.emoji}{' '}
                        {goalOptions.find((g) => g.value === form.finalGoal)?.labelKo ?? form.finalGoal}
                      </span>
                    )}
                  </div>
                </div>

                {/* 경로 카드 목록 / Pathway card list */}
                <div className="space-y-3">
                  {result.pathways.map((pathway, i) => (
                    <ItineraryCard key={pathway.pathwayId} pathway={pathway} index={i} />
                  ))}
                </div>

                {/* 하단 CTA / Bottom CTA */}
                <div className="mt-6 p-5 bg-white rounded-2xl border-2 border-orange-200 text-center shadow-sm">
                  <Globe className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="font-bold text-gray-800 mb-1">전문 비자 상담이 필요하신가요?</p>
                  <p className="text-sm text-gray-500 mb-4">Need professional visa consultation?</p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                      무료 상담 신청
                    </button>
                    <button className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-semibold hover:bg-orange-100 transition-colors border border-orange-200">
                      공고 둘러보기
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* ======================================================
            입력 단계 / Input steps
        ====================================================== */}
        {currentStep !== 'result' && (
          <div className="space-y-6">
            {/* 여행 테마 일러스트 배너 / Travel theme banner */}
            <div className="relative bg-linear-to-br from-orange-500 to-amber-500 rounded-2xl p-5 text-white overflow-hidden shadow-md">
              {/* 데코 아이콘들 / Decorative icons */}
              <Plane className="absolute top-3 right-4 w-12 h-12 text-white/10 rotate-12" />
              <Route className="absolute bottom-2 right-16 w-8 h-8 text-white/10" />

              <div className="flex items-center gap-2 mb-2">
                <Backpack className="w-5 h-5 text-orange-200" />
                <p className="text-orange-100 text-sm">비자 여정 플래너 Visa Journey Planner</p>
              </div>
              <h1 className="text-xl font-black leading-tight">
                나의 한국 비자 여정을<br />계획해보세요
              </h1>
              <p className="text-orange-100 text-xs mt-1">Plan your Korea visa journey</p>

              {/* 진행 바 / Progress bar */}
              <div className="mt-4 bg-white/20 rounded-full h-1.5">
                <div
                  className="bg-white rounded-full h-1.5 transition-all duration-500"
                  style={{ width: `${((currentStepIndex + 1) / stepOrder.length) * 100}%` }}
                />
              </div>
              <p className="text-orange-100 text-xs mt-1.5">{currentStepIndex + 1} / {stepOrder.length} 단계</p>
            </div>

            {/* 단계 헤더 / Step header */}
            <StepHeader step={currentStepIndex + 1} totalSteps={stepOrder.length} />

            {/* ---- STEP 1: 국적 / Nationality ---- */}
            {currentStep === 'nationality' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">어디서 출발하시나요?</h2>
                  <p className="text-sm text-gray-500 mt-1">Where are you coming from? 국적을 선택해주세요</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {popularCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, nationality: country.code }));
                      }}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-200 text-left ${
                        form.nationality === country.code
                          ? 'border-orange-500 bg-orange-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-orange-200'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{country.flag}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm leading-tight">{country.nameKo}</p>
                        <p className="text-xs text-gray-400 truncate">{country.nameEn}</p>
                      </div>
                      {form.nationality === country.code && (
                        <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ---- STEP 2: 나이 / Age ---- */}
            {currentStep === 'age' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">여행자 나이는요?</h2>
                  <p className="text-sm text-gray-500 mt-1">How old are you? 만 나이로 입력해주세요</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-orange-200 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-orange-400 shrink-0" />
                    <div className="flex-1">
                      <input
                        type="number"
                        min={18}
                        max={60}
                        value={form.age}
                        onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value === '' ? '' : Number(e.target.value) }))}
                        placeholder="예: 24"
                        className="w-full text-2xl font-bold text-gray-800 outline-none placeholder:text-gray-300"
                      />
                      <p className="text-xs text-gray-400 mt-1">만 18 ~ 60세 / Age 18–60</p>
                    </div>
                    <span className="text-gray-500 font-medium">세</span>
                  </div>
                </div>
                {/* 나이 슬라이더 / Age slider */}
                <input
                  type="range"
                  min={18}
                  max={60}
                  value={form.age || 24}
                  onChange={(e) => setForm((prev) => ({ ...prev, age: Number(e.target.value) }))}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>18세</span>
                  <span>60세</span>
                </div>
              </div>
            )}

            {/* ---- STEP 3: 학력 / Education ---- */}
            {currentStep === 'educationLevel' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">여행자 자격은요?</h2>
                  <p className="text-sm text-gray-500 mt-1">What's your education level? 최종 학력을 선택해주세요</p>
                </div>
                <div className="space-y-2">
                  {educationOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm((prev) => ({ ...prev, educationLevel: opt.value }))}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        form.educationLevel === opt.value
                          ? 'border-orange-500 bg-orange-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-orange-200'
                      }`}
                    >
                      <span className="text-xl shrink-0">{opt.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800">{opt.labelKo}</p>
                        <p className="text-xs text-gray-400">{opt.labelEn}</p>
                      </div>
                      {form.educationLevel === opt.value && (
                        <CheckCircle className="w-5 h-5 text-orange-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ---- STEP 4: 여행 경비 / Fund ---- */}
            {currentStep === 'availableAnnualFund' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">여행 예산은 얼마나 있나요?</h2>
                  <p className="text-sm text-gray-500 mt-1">What's your annual available fund? 연간 사용 가능 자금</p>
                </div>
                <div className="space-y-2">
                  {fundOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm((prev) => ({ ...prev, availableAnnualFund: opt.value }))}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        form.availableAnnualFund === opt.value
                          ? 'border-orange-500 bg-orange-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-orange-200'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        <DollarSign className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800">{opt.labelKo}</p>
                        <p className="text-xs text-gray-400">{opt.labelEn}</p>
                      </div>
                      {form.availableAnnualFund === opt.value && (
                        <CheckCircle className="w-5 h-5 text-orange-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ---- STEP 5: 최종 목적지 / Goal ---- */}
            {currentStep === 'finalGoal' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">최종 목적지는 어디인가요?</h2>
                  <p className="text-sm text-gray-500 mt-1">What's your final destination? 한국에서의 목표</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {goalOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm((prev) => ({ ...prev, finalGoal: opt.value }))}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
                        form.finalGoal === opt.value
                          ? 'border-orange-500 bg-orange-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-orange-200'
                      }`}
                    >
                      <span className="text-3xl">{opt.emoji}</span>
                      <p className="font-bold text-gray-800 text-sm">{opt.labelKo}</p>
                      <p className="text-xs text-gray-500">{opt.descKo}</p>
                      {form.finalGoal === opt.value && (
                        <CheckCircle className="w-4 h-4 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ---- STEP 6: 여행 스타일 / Priority ---- */}
            {currentStep === 'priorityPreference' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">어떤 여행 스타일인가요?</h2>
                  <p className="text-sm text-gray-500 mt-1">What's your travel style? 비자 경로 우선순위</p>
                </div>
                <div className="space-y-2">
                  {priorityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm((prev) => ({ ...prev, priorityPreference: opt.value }))}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        form.priorityPreference === opt.value
                          ? 'border-orange-500 bg-orange-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-orange-200'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800">{opt.labelKo}</p>
                        <p className="text-xs text-gray-500">{opt.descKo}</p>
                      </div>
                      {form.priorityPreference === opt.value && (
                        <CheckCircle className="w-5 h-5 text-orange-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 네비게이션 버튼 / Navigation buttons */}
            <div className="flex gap-3 pt-2">
              {currentStepIndex > 0 && (
                <button
                  onClick={goBack}
                  className="flex-1 py-3.5 rounded-2xl border-2 border-orange-200 text-orange-600 font-semibold hover:bg-orange-50 transition-colors"
                >
                  ← 이전
                </button>
              )}
              <button
                onClick={goNext}
                disabled={!isCurrentStepValid()}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                  isCurrentStepValid()
                    ? 'bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-200'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentStepIndex === stepOrder.length - 1 ? (
                  <>
                    <Plane className="w-4 h-4" />
                    여정 출발!
                  </>
                ) : (
                  <>
                    다음
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* 진행 안내 / Progress guide */}
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl border border-orange-100">
              <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
              <p className="text-xs text-orange-700">
                입력하신 정보는 비자 경로 추천에만 사용됩니다. 실제 비자 발급 조건은 출입국·외국인청에서 확인하세요.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
