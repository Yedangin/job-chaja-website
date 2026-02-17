'use client';

// 배낭여행 테마 비자 진단 페이지 / Backpacker-themed visa diagnosis page
// Design #46 — 배낭여행 (Backpacker)
// Concept: 배낭여행자 스타일로 자유롭게 경로 탐색 / Explore visa paths like a backpacker

import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Flag,
  Backpack,
  Navigation,
  Star,
  Clock,
  Wallet,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Globe,
  BookOpen,
  Camera,
  Coffee,
  Tent,
  Route,
  Mountain,
  Sunrise,
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
// 어스 톤 색상 팔레트 / Earth-tone color palette
// ============================================================
const EARTH = {
  sand: '#D4A853',
  moss: '#5C7A3E',
  bark: '#8B5E3C',
  stone: '#7C8471',
  cream: '#F5F0E8',
  terracotta: '#C17B4E',
  forest: '#3A5A40',
  sage: '#87A878',
  khaki: '#C3B091',
  olive: '#6B7B3A',
};

// ============================================================
// 타입 정의 / Type definitions
// ============================================================
interface FormData {
  nationality: string;
  age: string;
  educationLevel: string;
  availableAnnualFund: number;
  finalGoal: string;
  priorityPreference: string;
}

// ============================================================
// 단계 컴포넌트 — 현재 스탬프 / Step indicator — passport stamps
// ============================================================
function PassportStamp({
  step,
  currentStep,
  label,
}: {
  step: number;
  currentStep: number;
  label: string;
}) {
  // 완료/현재/미래 스탬프 상태 / Stamp states: done, active, future
  const isDone = step < currentStep;
  const isActive = step === currentStep;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-sm transition-all duration-300 ${
          isDone
            ? 'border-[#5C7A3E] bg-[#5C7A3E] text-white'
            : isActive
            ? 'border-[#D4A853] bg-[#D4A853] text-white shadow-lg scale-110'
            : 'border-[#C3B091] bg-[#F5F0E8] text-[#8B5E3C]'
        }`}
      >
        {isDone ? <CheckCircle className="w-5 h-5" /> : step}
      </div>
      <span
        className={`text-xs font-medium hidden sm:block ${
          isActive ? 'text-[#8B5E3C]' : 'text-[#7C8471]'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// ============================================================
// 태그 버튼 컴포넌트 / Tag button component
// ============================================================
function TagButton({
  selected,
  onClick,
  children,
  color = 'moss',
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: 'moss' | 'sand' | 'bark';
}) {
  const colorMap = {
    moss: selected
      ? 'bg-[#5C7A3E] text-white border-[#5C7A3E]'
      : 'bg-[#F5F0E8] text-[#5C7A3E] border-[#87A878] hover:border-[#5C7A3E]',
    sand: selected
      ? 'bg-[#D4A853] text-white border-[#D4A853]'
      : 'bg-[#F5F0E8] text-[#8B5E3C] border-[#C3B091] hover:border-[#D4A853]',
    bark: selected
      ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]'
      : 'bg-[#F5F0E8] text-[#8B5E3C] border-[#C3B091] hover:border-[#8B5E3C]',
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all duration-200 ${colorMap[color]}`}
    >
      {children}
    </button>
  );
}

// ============================================================
// 경로 핀 카드 컴포넌트 / Route pin card component
// ============================================================
function RoutePinCard({
  pathway,
  index,
  isExpanded,
  onToggle,
}: {
  pathway: CompatPathway;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // 배낭여행 루트 핀 스타일 / Backpacker route pin style
  const pinColors = [
    'bg-[#5C7A3E]', // 모스 그린 / Moss green
    'bg-[#D4A853]', // 샌드 옐로 / Sand yellow
    'bg-[#8B5E3C]', // 바크 브라운 / Bark brown
    'bg-[#7C8471]', // 스톤 그레이 / Stone gray
    'bg-[#C17B4E]', // 테라코타 / Terracotta
  ];

  const pinColor = pinColors[index % pinColors.length];

  // 가능성 라벨별 배지 색상 / Feasibility label badge colors
  const feasibilityBg =
    pathway.feasibilityLabel === '보통'
      ? 'bg-blue-100 text-blue-700'
      : pathway.feasibilityLabel === '높음'
      ? 'bg-green-100 text-green-700'
      : 'bg-orange-100 text-orange-700';

  return (
    <div className="relative">
      {/* 여행 핀 마커 / Travel pin marker */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center shrink-0">
          <div
            className={`w-10 h-10 ${pinColor} rounded-full flex items-center justify-center shadow-md text-white font-bold text-sm`}
          >
            {index + 1}
          </div>
          {/* 연결선 / Connector line */}
          <div className="w-0.5 bg-[#C3B091] flex-1 min-h-4 mt-1" />
        </div>

        {/* 경로 카드 본체 / Route card body */}
        <div className="flex-1 mb-4">
          <div
            className="bg-white rounded-2xl border-2 border-[#C3B091] shadow-sm cursor-pointer hover:border-[#D4A853] transition-all duration-200 overflow-hidden"
            onClick={onToggle}
          >
            {/* 카드 헤더 / Card header */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${feasibilityBg}`}
                    >
                      {getFeasibilityEmoji(pathway.feasibilityLabel)}{' '}
                      {pathway.feasibilityLabel}
                    </span>
                    <span className="text-xs text-[#7C8471] bg-[#F5F0E8] px-2 py-0.5 rounded-full">
                      점수: {pathway.finalScore}점
                    </span>
                  </div>
                  <h3 className="font-bold text-[#3A5A40] text-base">
                    {pathway.nameKo}
                  </h3>
                  <p className="text-xs text-[#7C8471] mt-0.5">{pathway.nameEn}</p>
                </div>
                <div className="shrink-0 text-[#8B5E3C]">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* 여행 정보 요약 / Travel summary info */}
              <div className="flex flex-wrap gap-3 mt-3">
                <div className="flex items-center gap-1 text-xs text-[#7C8471]">
                  <Clock className="w-3.5 h-3.5 text-[#D4A853]" />
                  <span>{pathway.estimatedMonths}개월</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#7C8471]">
                  <Wallet className="w-3.5 h-3.5 text-[#5C7A3E]" />
                  <span>
                    {pathway.estimatedCostWon > 0
                      ? `${pathway.estimatedCostWon.toLocaleString()}만원`
                      : '무료'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#7C8471]">
                  <Route className="w-3.5 h-3.5 text-[#8B5E3C]" />
                  <span>{pathway.visaChainStr}</span>
                </div>
              </div>
            </div>

            {/* 확장 콘텐츠 / Expanded content */}
            {isExpanded && (
              <div className="border-t-2 border-[#F5F0E8] bg-[#FDFAF5]">
                {/* 여행 노트 / Travel note */}
                <div className="p-4 border-b border-[#E8E0D0]">
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-[#D4A853] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-[#8B5E3C] mb-1">
                        여행 노트 / Travel Note
                      </p>
                      <p className="text-xs text-[#7C8471]">{pathway.note}</p>
                    </div>
                  </div>
                </div>

                {/* 마일스톤 타임라인 / Milestone timeline */}
                <div className="p-4">
                  <p className="text-xs font-semibold text-[#5C7A3E] mb-3 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5" />
                    여정 경유지 / Journey Stops
                  </p>
                  <div className="space-y-2">
                    {pathway.milestones.map((milestone, mIdx) => (
                      <div key={mIdx} className="flex items-start gap-3">
                        {/* 마일스톤 핀 / Milestone pin */}
                        <div className="shrink-0 flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-[#C3B091] flex items-center justify-center">
                            <MapPin className="w-3 h-3 text-white" />
                          </div>
                          {mIdx < pathway.milestones.length - 1 && (
                            <div className="w-0.5 h-4 bg-[#C3B091] mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-[#3A5A40]">
                              {milestone.nameKo}
                            </span>
                            {milestone.visaStatus && milestone.visaStatus !== 'none' && (
                              <span className="text-xs bg-[#5C7A3E] text-white px-1.5 py-0.5 rounded">
                                {milestone.visaStatus}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#7C8471] mt-0.5">
                            {milestone.monthFromStart}개월째
                            {milestone.canWorkPartTime && (
                              <span className="ml-1 text-[#D4A853]">
                                · 주{milestone.weeklyHours}시간 근무가능
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 다음 단계 / Next steps */}
                {pathway.nextSteps.length > 0 && (
                  <div className="p-4 border-t border-[#E8E0D0]">
                    <p className="text-xs font-semibold text-[#8B5E3C] mb-2 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" />
                      첫 번째 발걸음 / First Steps
                    </p>
                    <div className="space-y-2">
                      {pathway.nextSteps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-start gap-2 bg-white rounded-lg p-2 border border-[#E8E0D0]"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4A853] mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-[#3A5A40]">
                              {step.nameKo}
                            </p>
                            <p className="text-xs text-[#7C8471]">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 예산 계산기 미니 컴포넌트 / Mini budget calculator component
// ============================================================
function BudgetCalculator({ pathways }: { pathways: CompatPathway[] }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = pathways[selectedIdx];

  // 예산 범위별 색상 / Budget range colors
  const getBudgetColor = (cost: number) => {
    if (cost === 0) return 'text-[#5C7A3E]';
    if (cost <= 500) return 'text-[#D4A853]';
    if (cost <= 2000) return 'text-[#C17B4E]';
    return 'text-[#8B5E3C]';
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[#C3B091] p-4 shadow-sm">
      <h3 className="font-bold text-[#3A5A40] text-sm flex items-center gap-2 mb-3">
        <Wallet className="w-4 h-4 text-[#D4A853]" />
        예산 계산기 / Budget Calculator
      </h3>
      {/* 경로 선택 탭 / Pathway selector tabs */}
      <div className="flex gap-1 flex-wrap mb-4">
        {pathways.map((p, idx) => (
          <button
            key={p.pathwayId}
            onClick={() => setSelectedIdx(idx)}
            className={`text-xs px-2 py-1 rounded-full border transition-all duration-200 ${
              selectedIdx === idx
                ? 'bg-[#D4A853] text-white border-[#D4A853]'
                : 'bg-[#F5F0E8] text-[#7C8471] border-[#C3B091]'
            }`}
          >
            경로 {idx + 1}
          </button>
        ))}
      </div>
      {/* 선택된 경로 예산 정보 / Selected pathway budget info */}
      <div className="bg-[#F5F0E8] rounded-xl p-3">
        <p className="text-xs text-[#7C8471] mb-1">{selected.nameKo}</p>
        <div className="flex items-end gap-1">
          <span className={`text-2xl font-bold ${getBudgetColor(selected.estimatedCostWon)}`}>
            {selected.estimatedCostWon > 0
              ? `${selected.estimatedCostWon.toLocaleString()}만원`
              : '무료'}
          </span>
          <span className="text-xs text-[#7C8471] pb-1">예상 총 비용</span>
        </div>
        <div className="flex gap-3 mt-2">
          <div className="text-xs text-[#7C8471]">
            <span className="font-medium text-[#8B5E3C]">{selected.estimatedMonths}</span>개월
          </div>
          <div className="text-xs text-[#7C8471]">
            월 평균{' '}
            <span className="font-medium text-[#8B5E3C]">
              {selected.estimatedCostWon > 0
                ? Math.round(selected.estimatedCostWon / selected.estimatedMonths).toLocaleString()
                : 0}
              만원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 메인 페이지 컴포넌트 / Main page component
// ============================================================
export default function Diagnosis46Page() {
  // 현재 단계 상태 / Current step state
  const [currentStep, setCurrentStep] = useState(1);
  // 폼 데이터 상태 / Form data state
  const [formData, setFormData] = useState<FormData>({
    nationality: '',
    age: '',
    educationLevel: '',
    availableAnnualFund: -1,
    finalGoal: '',
    priorityPreference: '',
  });
  // 진단 결과 표시 여부 / Show results flag
  const [showResults, setShowResults] = useState(false);
  // 확장된 경로 카드 인덱스 / Expanded pathway card index
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  // 로딩 상태 / Loading state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // 자유 텍스트 입력 / Free text input
  const [freeNote, setFreeNote] = useState('');

  // 단계별 라벨 / Step labels
  const stepLabels = ['국적', '나이', '학력', '자금', '목표', '우선순위'];

  // 단계별 완료 여부 / Step completion check
  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: return formData.nationality !== '';
      case 2: return formData.age !== '' && Number(formData.age) > 0;
      case 3: return formData.educationLevel !== '';
      case 4: return formData.availableAnnualFund >= 0;
      case 5: return formData.finalGoal !== '';
      case 6: return formData.priorityPreference !== '';
      default: return false;
    }
  };

  // 진단 시작 핸들러 / Start diagnosis handler
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // 목업 딜레이 / Mock delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 1800);
  };

  // 다시 시작 핸들러 / Reset handler
  const handleReset = () => {
    setShowResults(false);
    setCurrentStep(1);
    setExpandedIdx(0);
    setFormData({
      nationality: '',
      age: '',
      educationLevel: '',
      availableAnnualFund: -1,
      finalGoal: '',
      priorityPreference: '',
    });
    setFreeNote('');
  };

  // 모든 필수 입력 완료 여부 / All required inputs complete
  const allComplete = [1, 2, 3, 4, 5, 6].every(isStepComplete);

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #F5F0E8 0%, #EDE5D5 50%, #E8DFC8 100%)' }}
    >
      {/* ── 헤더 / Header ── */}
      <header
        className="sticky top-0 z-30 shadow-md"
        style={{ background: 'linear-gradient(90deg, #3A5A40 0%, #5C7A3E 100%)' }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#D4A853] rounded-full flex items-center justify-center shadow">
              <Backpack className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-tight">비자 배낭여행</h1>
              <p className="text-[#87A878] text-xs">Visa Backpacker Guide</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#87A878] text-xs">
            <Globe className="w-3.5 h-3.5" />
            <span>31개 비자 탐색 중</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-20">
        {!showResults ? (
          /* ── 입력 단계 / Input steps ── */
          <div>
            {/* 여행 컨셉 배너 / Travel concept banner */}
            <div
              className="rounded-2xl p-5 mb-6 text-white shadow-lg relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #3A5A40 0%, #5C7A3E 60%, #87A878 100%)' }}
            >
              {/* 배경 장식 / Background decoration */}
              <div className="absolute top-2 right-4 opacity-10">
                <Mountain className="w-24 h-24 text-white" />
              </div>
              <div className="absolute bottom-2 right-16 opacity-10">
                <Tent className="w-16 h-16 text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Compass className="w-5 h-5 text-[#D4A853]" />
                  <span className="text-[#D4A853] font-semibold text-sm">배낭여행자 가이드</span>
                </div>
                <h2 className="text-xl font-bold mb-1">한국 비자 루트를 탐험하세요</h2>
                <p className="text-[#87A878] text-sm">
                  목적지와 예산을 알려주시면, 최적의 비자 경로를 안내해 드릴게요.
                </p>
                <p className="text-[#87A878] text-xs mt-1">
                  Tell us your destination & budget — we'll map your visa route.
                </p>
              </div>
            </div>

            {/* 여권 스탬프 스타일 단계 표시 / Passport stamp step indicator */}
            <div className="bg-white rounded-2xl border-2 border-[#C3B091] p-4 mb-6 shadow-sm">
              <p className="text-xs text-[#7C8471] text-center mb-3">
                여권 도장 찍는 중 / Collecting passport stamps
              </p>
              <div className="flex items-center justify-between">
                {stepLabels.map((label, idx) => (
                  <React.Fragment key={idx}>
                    <PassportStamp
                      step={idx + 1}
                      currentStep={currentStep}
                      label={label}
                    />
                    {idx < stepLabels.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-1 ${
                          idx + 1 < currentStep ? 'bg-[#5C7A3E]' : 'bg-[#C3B091]'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* ── Step 1: 국적 / Nationality ── */}
            <div
              className={`bg-white rounded-2xl border-2 p-5 mb-4 shadow-sm transition-all duration-200 ${
                currentStep === 1 ? 'border-[#D4A853]' : 'border-[#C3B091]'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#D4A853] flex items-center justify-center">
                  <Flag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#3A5A40] text-sm">어느 나라에서 왔나요?</h3>
                  <p className="text-xs text-[#7C8471]">Where are you from?</p>
                </div>
              </div>
              {/* 국가 태그 선택 / Country tag selection */}
              <div className="flex flex-wrap gap-2 mb-3">
                {popularCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setFormData({ ...formData, nationality: country.code });
                      if (currentStep === 1) setCurrentStep(2);
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full border-2 text-sm transition-all duration-200 ${
                      formData.nationality === country.code
                        ? 'bg-[#D4A853] text-white border-[#D4A853] shadow-md'
                        : 'bg-[#F5F0E8] text-[#8B5E3C] border-[#C3B091] hover:border-[#D4A853]'
                    }`}
                  >
                    <span>{country.flag}</span>
                    <span>{country.nameKo}</span>
                  </button>
                ))}
              </div>
              {/* 자유 텍스트 입력 / Free text input */}
              <input
                type="text"
                placeholder="다른 나라 직접 입력 / Enter other country..."
                className="w-full border border-[#C3B091] rounded-xl px-3 py-2 text-sm text-[#3A5A40] placeholder-[#C3B091] bg-[#FDFAF5] focus:outline-none focus:border-[#D4A853] transition-colors"
                onChange={(e) => {
                  if (e.target.value) {
                    setFormData({ ...formData, nationality: e.target.value });
                    if (currentStep === 1) setCurrentStep(2);
                  }
                }}
              />
            </div>

            {/* ── Step 2: 나이 / Age ── */}
            <div
              className={`bg-white rounded-2xl border-2 p-5 mb-4 shadow-sm transition-all duration-200 ${
                currentStep === 2 ? 'border-[#D4A853]' : 'border-[#C3B091]'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#5C7A3E] flex items-center justify-center">
                  <Sunrise className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#3A5A40] text-sm">여행자의 나이는?</h3>
                  <p className="text-xs text-[#7C8471]">Traveler's age?</p>
                </div>
              </div>
              {/* 나이 빠른 선택 태그 / Quick age tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {['18', '20', '22', '24', '26', '28', '30', '35', '40+'].map((ageOpt) => (
                  <TagButton
                    key={ageOpt}
                    selected={formData.age === ageOpt}
                    onClick={() => {
                      const val = ageOpt === '40+' ? '40' : ageOpt;
                      setFormData({ ...formData, age: val });
                      if (currentStep === 2) setCurrentStep(3);
                    }}
                    color="moss"
                  >
                    {ageOpt}세
                  </TagButton>
                ))}
              </div>
              {/* 직접 입력 / Direct input */}
              <input
                type="number"
                placeholder="또는 직접 입력 / or enter directly"
                min={18}
                max={60}
                value={formData.age}
                onChange={(e) => {
                  setFormData({ ...formData, age: e.target.value });
                  if (e.target.value && currentStep === 2) setCurrentStep(3);
                }}
                className="w-full border border-[#C3B091] rounded-xl px-3 py-2 text-sm text-[#3A5A40] placeholder-[#C3B091] bg-[#FDFAF5] focus:outline-none focus:border-[#5C7A3E] transition-colors"
              />
            </div>

            {/* ── Step 3: 학력 / Education ── */}
            <div
              className={`bg-white rounded-2xl border-2 p-5 mb-4 shadow-sm transition-all duration-200 ${
                currentStep === 3 ? 'border-[#D4A853]' : 'border-[#C3B091]'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#8B5E3C] flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#3A5A40] text-sm">학력 배낭 / Education backpack</h3>
                  <p className="text-xs text-[#7C8471]">Highest education level</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {educationOptions.map((opt) => (
                  <TagButton
                    key={opt.value}
                    selected={formData.educationLevel === opt.value}
                    onClick={() => {
                      setFormData({ ...formData, educationLevel: opt.value });
                      if (currentStep === 3) setCurrentStep(4);
                    }}
                    color="bark"
                  >
                    {opt.emoji} {opt.labelKo}
                  </TagButton>
                ))}
              </div>
            </div>

            {/* ── Step 4: 연간 자금 / Annual fund ── */}
            <div
              className={`bg-white rounded-2xl border-2 p-5 mb-4 shadow-sm transition-all duration-200 ${
                currentStep === 4 ? 'border-[#D4A853]' : 'border-[#C3B091]'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#D4A853] flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#3A5A40] text-sm">여행 예산은? / Travel budget?</h3>
                  <p className="text-xs text-[#7C8471]">연간 사용 가능한 자금 / Annual available fund</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {fundOptions.map((opt) => (
                  <TagButton
                    key={opt.value}
                    selected={formData.availableAnnualFund === opt.value}
                    onClick={() => {
                      setFormData({ ...formData, availableAnnualFund: opt.value });
                      if (currentStep === 4) setCurrentStep(5);
                    }}
                    color="sand"
                  >
                    {opt.labelKo}
                  </TagButton>
                ))}
              </div>
            </div>

            {/* ── Step 5: 최종 목표 / Final goal ── */}
            <div
              className={`bg-white rounded-2xl border-2 p-5 mb-4 shadow-sm transition-all duration-200 ${
                currentStep === 5 ? 'border-[#D4A853]' : 'border-[#C3B091]'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#5C7A3E] flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#3A5A40] text-sm">최종 목적지 / Final destination</h3>
                  <p className="text-xs text-[#7C8471]">What's your ultimate goal in Korea?</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {goalOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFormData({ ...formData, finalGoal: opt.value });
                      if (currentStep === 5) setCurrentStep(6);
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      formData.finalGoal === opt.value
                        ? 'border-[#5C7A3E] bg-[#5C7A3E] text-white'
                        : 'border-[#C3B091] bg-[#F5F0E8] text-[#3A5A40] hover:border-[#5C7A3E]'
                    }`}
                  >
                    <div className="text-xl mb-1">{opt.emoji}</div>
                    <div className="font-semibold text-sm">{opt.labelKo}</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        formData.finalGoal === opt.value ? 'text-[#87A878]' : 'text-[#7C8471]'
                      }`}
                    >
                      {opt.descKo}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Step 6: 우선순위 / Priority ── */}
            <div
              className={`bg-white rounded-2xl border-2 p-5 mb-4 shadow-sm transition-all duration-200 ${
                currentStep === 6 ? 'border-[#D4A853]' : 'border-[#C3B091]'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#C17B4E] flex items-center justify-center">
                  <Compass className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#3A5A40] text-sm">여행 스타일 / Travel style</h3>
                  <p className="text-xs text-[#7C8471]">What matters most to you?</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {priorityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFormData({ ...formData, priorityPreference: opt.value });
                      if (currentStep === 6) setCurrentStep(7);
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      formData.priorityPreference === opt.value
                        ? 'border-[#C17B4E] bg-[#C17B4E] text-white'
                        : 'border-[#C3B091] bg-[#F5F0E8] text-[#3A5A40] hover:border-[#C17B4E]'
                    }`}
                  >
                    <div className="text-xl mb-1">{opt.emoji}</div>
                    <div className="font-semibold text-sm">{opt.labelKo}</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        formData.priorityPreference === opt.value ? 'text-[#E8CABB]' : 'text-[#7C8471]'
                      }`}
                    >
                      {opt.descKo}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 여행 메모 / Travel memo */}
            <div className="bg-white rounded-2xl border-2 border-[#C3B091] p-5 mb-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4 text-[#D4A853]" />
                <h3 className="font-bold text-[#3A5A40] text-sm">여행 메모 (선택)</h3>
                <span className="text-xs text-[#7C8471]">/ Travel memo (optional)</span>
              </div>
              <textarea
                rows={3}
                placeholder="추가로 알려주고 싶은 상황이 있으신가요? 예: 한국어 능력, 현재 비자 상태, 특별한 사정...&#10;Any extra info? e.g. Korean level, current visa, special circumstances..."
                value={freeNote}
                onChange={(e) => setFreeNote(e.target.value)}
                className="w-full border border-[#C3B091] rounded-xl px-3 py-2 text-sm text-[#3A5A40] placeholder-[#C3B091] bg-[#FDFAF5] focus:outline-none focus:border-[#D4A853] transition-colors resize-none"
              />
            </div>

            {/* 분석 시작 버튼 / Start analysis button */}
            <button
              onClick={handleAnalyze}
              disabled={!allComplete || isAnalyzing}
              className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                allComplete && !isAnalyzing
                  ? 'bg-[#3A5A40] text-white hover:bg-[#5C7A3E] hover:shadow-xl active:scale-98'
                  : 'bg-[#C3B091] text-white cursor-not-allowed opacity-60'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>루트 탐색 중... / Mapping route...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  <span>비자 루트 탐색 시작 / Start Route Discovery</span>
                </>
              )}
            </button>
            {!allComplete && (
              <p className="text-center text-xs text-[#7C8471] mt-2">
                모든 정보를 입력하면 탐색이 시작됩니다 / Fill in all fields to start
              </p>
            )}
          </div>
        ) : (
          /* ── 결과 단계 / Results section ── */
          <div>
            {/* 결과 헤더 배너 / Results header banner */}
            <div
              className="rounded-2xl p-5 mb-6 text-white shadow-lg relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #3A5A40 0%, #6B7B3A 100%)' }}
            >
              <div className="absolute top-0 right-0 opacity-10">
                <Route className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-[#D4A853]" />
                  <span className="text-[#D4A853] font-semibold text-sm">루트 발견!</span>
                </div>
                <h2 className="text-xl font-bold mb-1">
                  {mockDiagnosisResult.pathways.length}개의 비자 경로를 찾았어요
                </h2>
                <p className="text-[#87A878] text-sm">
                  총 {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 경로 중{' '}
                  {mockDiagnosisResult.pathways.length}개 추천 루트 발견
                </p>
                <p className="text-[#87A878] text-xs mt-0.5">
                  Found {mockDiagnosisResult.pathways.length} recommended routes from{' '}
                  {mockDiagnosisResult.meta.totalPathwaysEvaluated} total pathways
                </p>
              </div>
            </div>

            {/* 예산 계산기 / Budget calculator */}
            <div className="mb-5">
              <BudgetCalculator pathways={mockPathways} />
            </div>

            {/* 커뮤니티 리뷰 스타일 팁 / Community review style tip */}
            <div className="bg-[#FFF8EC] rounded-2xl border-2 border-[#D4A853] p-4 mb-5 flex items-start gap-3">
              <Coffee className="w-4 h-4 text-[#D4A853] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#8B5E3C] mb-0.5">
                  배낭여행자 팁 / Backpacker Tip
                </p>
                <p className="text-xs text-[#7C8471]">
                  점수가 높을수록 달성 가능성이 높은 경로입니다. 경유지(마일스톤)를 꼼꼼히 확인하세요!
                </p>
                <p className="text-xs text-[#C3B091] mt-0.5">
                  Higher score = more achievable route. Check each milestone carefully!
                </p>
              </div>
            </div>

            {/* 경로 핀 목록 / Route pin list */}
            <div className="mb-6">
              <h3 className="font-bold text-[#3A5A40] text-base flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#D4A853]" />
                추천 비자 루트 / Recommended Visa Routes
              </h3>
              <div>
                {mockPathways.map((pathway, idx) => (
                  <RoutePinCard
                    key={pathway.pathwayId}
                    pathway={pathway}
                    index={idx}
                    isExpanded={expandedIdx === idx}
                    onToggle={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                  />
                ))}
                {/* 마지막 핀 끝 마커 / End marker */}
                <div className="flex gap-4 items-center">
                  <div className="shrink-0 w-10 flex justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#3A5A40] flex items-center justify-center">
                      <Flag className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-[#7C8471] italic">
                    목적지 도착! / Destination reached!
                  </p>
                </div>
              </div>
            </div>

            {/* 경고 안내 / Disclaimer */}
            <div className="bg-white rounded-2xl border border-[#C3B091] p-4 mb-5 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-[#C17B4E] mt-0.5 shrink-0" />
              <p className="text-xs text-[#7C8471]">
                본 결과는 참고용 정보입니다. 실제 비자 신청 전 출입국·외국인청 또는 전문가 상담을 권장합니다.
                / This result is for reference only. Please consult immigration authorities or experts before applying.
              </p>
            </div>

            {/* 다시 시작 버튼 / Restart button */}
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-2xl border-2 border-[#5C7A3E] text-[#5C7A3E] font-bold text-sm hover:bg-[#5C7A3E] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              새로운 루트 탐색 / Explore New Route
            </button>
          </div>
        )}
      </main>

      {/* ── 하단 고정 배너 / Bottom fixed banner ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 shadow-lg"
        style={{ background: 'linear-gradient(90deg, #3A5A40 0%, #5C7A3E 100%)' }}
      >
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tent className="w-4 h-4 text-[#D4A853]" />
            <span className="text-white text-xs">잡차자 비자 배낭여행</span>
          </div>
          <span className="text-[#87A878] text-xs">JobChaJa © 2026</span>
        </div>
      </div>
    </div>
  );
}
