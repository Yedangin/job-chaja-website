'use client';
// KOR: 디자인 #47 - 크루즈 항해 (Cruise Voyage) 비자 진단 페이지
// ENG: Design #47 - Cruise Voyage visa diagnosis page

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
  Anchor,
  Ship,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Star,
  Clock,
  DollarSign,
  Navigation,
  Compass,
  Wind,
  Waves,
  LifeBuoy,
  Flag,
  ArrowRight,
} from 'lucide-react';

// KOR: 크루즈 항해 단계 정의
// ENG: Cruise voyage step definitions
const CRUISE_STEPS = [
  { id: 1, port: '출발항', label: '국적 / Nationality', icon: '🌍' },
  { id: 2, port: '첫 기항지', label: '나이 / Age', icon: '🎂' },
  { id: 3, port: '두번째 기항지', label: '학력 / Education', icon: '🎓' },
  { id: 4, port: '세번째 기항지', label: '예산 / Budget', icon: '💰' },
  { id: 5, port: '네번째 기항지', label: '목표 / Goal', icon: '🏆' },
  { id: 6, port: '도착항', label: '우선순위 / Priority', icon: '⭐' },
];

// KOR: 크루즈 초기 입력 상태
// ENG: Initial cruise input state
const initialInput: DiagnosisInput = {
  nationality: '',
  age: 0,
  educationLevel: '',
  availableAnnualFund: '',
  finalGoal: '',
  priorityPreference: '',
};

// KOR: 파도 애니메이션 SVG 컴포넌트
// ENG: Wave animation SVG component
function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* KOR: 배경 오션 블루 그라디언트 / ENG: Background ocean blue gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-950 via-blue-800 to-cyan-700" />

      {/* KOR: 별빛 효과 / ENG: Starlight effect */}
      <div className="absolute top-0 left-0 w-full h-32 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 11 + 3) % 60}%`,
              opacity: (i % 3) * 0.3 + 0.2,
            }}
          />
        ))}
      </div>

      {/* KOR: 파도 레이어 1 / ENG: Wave layer 1 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" className="w-full opacity-20" preserveAspectRatio="none">
          <path
            d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
            fill="#0ea5e9"
          />
        </svg>
      </div>
      {/* KOR: 파도 레이어 2 / ENG: Wave layer 2 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 80" className="w-full opacity-15" preserveAspectRatio="none">
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,80 L0,80 Z"
            fill="#38bdf8"
          />
        </svg>
      </div>
    </div>
  );
}

// KOR: 선박 위치 인디케이터 컴포넌트
// ENG: Ship position indicator component
function CruiseProgress({ currentStep }: { currentStep: number }) {
  const totalSteps = CRUISE_STEPS.length;
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative w-full px-4 py-6">
      {/* KOR: 항로 선 / ENG: Route line */}
      <div className="relative h-2 bg-blue-800/60 rounded-full overflow-hidden mx-8">
        <div
          className="h-full bg-linear-to-r from-cyan-400 to-sky-300 rounded-full transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* KOR: 기항지 포인트들 / ENG: Port stop points */}
      <div className="absolute top-0 left-4 right-4 flex justify-between items-center h-full">
        {CRUISE_STEPS.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-1 pt-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-300 ${
                step.id < currentStep
                  ? 'bg-cyan-400 border-cyan-300 text-blue-950'
                  : step.id === currentStep
                  ? 'bg-sky-300 border-white text-blue-950 scale-110 shadow-lg shadow-sky-300/50'
                  : 'bg-blue-800/60 border-blue-600 text-blue-400'
              }`}
            >
              {step.id < currentStep ? '✓' : step.icon}
            </div>
            <span
              className={`text-xs font-medium whitespace-nowrap transition-all ${
                step.id === currentStep ? 'text-sky-300' : 'text-blue-400'
              }`}
            >
              {step.port}
            </span>
          </div>
        ))}
      </div>

      {/* KOR: 선박 아이콘 (진행에 따라 이동) / ENG: Ship icon (moves with progress) */}
      <div
        className="absolute top-1 transition-all duration-700"
        style={{ left: `calc(${progressPercent}% + 16px - 12px)` }}
      >
        <div className="text-2xl drop-shadow-lg" style={{ marginTop: '-4px' }}>
          🚢
        </div>
      </div>
    </div>
  );
}

// KOR: 국적 선택 스텝 / ENG: Nationality selection step
function NationalityStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* KOR: 기항지 안내 배너 / ENG: Port guidance banner */}
      <div className="bg-blue-900/50 border border-cyan-500/30 rounded-2xl p-4 flex items-center gap-3">
        <Anchor className="text-cyan-400 shrink-0" size={24} />
        <div>
          <p className="text-cyan-300 font-semibold text-sm">출발항 / Departure Port</p>
          <p className="text-blue-200 text-xs mt-0.5">어느 나라에서 출발하시나요? / Where are you departing from?</p>
        </div>
      </div>

      {/* KOR: 인기 국가 그리드 / ENG: Popular countries grid */}
      <div>
        <p className="text-sky-300 text-sm font-medium mb-3 flex items-center gap-2">
          <Flag size={14} /> 인기 국적 / Popular Nationalities
        </p>
        <div className="grid grid-cols-3 gap-2">
          {popularCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => onChange(country.name)}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                value === country.name
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                  : 'bg-blue-900/30 border-blue-700/50 text-blue-200 hover:border-cyan-600/50 hover:bg-blue-800/40'
              }`}
            >
              <span className="text-xl">{country.flag}</span>
              <span className="text-xs font-medium">{country.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* KOR: 직접 입력 / ENG: Manual input */}
      <div>
        <p className="text-sky-300 text-sm font-medium mb-2 flex items-center gap-2">
          <Compass size={14} /> 직접 입력 / Enter Manually
        </p>
        <input
          type="text"
          placeholder="국적을 입력하세요 / Enter your nationality"
          value={value && !popularCountries.find((c) => c.name === value) ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 bg-blue-900/40 border border-blue-700/50 rounded-xl text-white placeholder-blue-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
        />
      </div>
    </div>
  );
}

// KOR: 나이 입력 스텝 / ENG: Age input step
function AgeStep({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ageRanges = [
    { label: '18-24세', min: 18, max: 24, emoji: '🌱' },
    { label: '25-29세', min: 25, max: 29, emoji: '⚡' },
    { label: '30-34세', min: 30, max: 34, emoji: '🌊' },
    { label: '35-39세', min: 35, max: 39, emoji: '🏄' },
    { label: '40-49세', min: 40, max: 49, emoji: '🧭' },
    { label: '50세 이상', min: 50, max: 99, emoji: '⚓' },
  ];

  return (
    <div className="space-y-6">
      {/* KOR: 첫 기항지 안내 / ENG: First port guidance */}
      <div className="bg-blue-900/50 border border-sky-500/30 rounded-2xl p-4 flex items-center gap-3">
        <Ship className="text-sky-400 shrink-0" size={24} />
        <div>
          <p className="text-sky-300 font-semibold text-sm">첫 기항지 / First Port of Call</p>
          <p className="text-blue-200 text-xs mt-0.5">나이에 따라 적합한 비자 경로가 달라집니다 / Age affects your visa pathway options</p>
        </div>
      </div>

      {/* KOR: 나이대 선택 / ENG: Age range selection */}
      <div className="grid grid-cols-2 gap-3">
        {ageRanges.map((range) => (
          <button
            key={range.label}
            onClick={() => onChange(range.min + 1)}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
              value >= range.min && value <= range.max
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-md shadow-sky-500/20'
                : 'bg-blue-900/30 border-blue-700/50 text-blue-200 hover:border-sky-600/50 hover:bg-blue-800/40'
            }`}
          >
            <span className="text-2xl">{range.emoji}</span>
            <span className="font-medium text-sm">{range.label}</span>
          </button>
        ))}
      </div>

      {/* KOR: 직접 입력 / ENG: Direct input */}
      <div>
        <p className="text-sky-300 text-sm font-medium mb-2">정확한 나이 / Exact Age</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onChange(Math.max(18, value - 1))}
            className="w-12 h-12 bg-blue-800/50 border border-blue-600 rounded-full text-white text-xl hover:bg-blue-700/50 transition-all"
          >
            −
          </button>
          <div className="flex-1 text-center">
            <span className="text-5xl font-bold text-white">{value || '—'}</span>
            <span className="text-blue-300 ml-2 text-lg">세</span>
          </div>
          <button
            onClick={() => onChange(Math.min(99, (value || 18) + 1))}
            className="w-12 h-12 bg-blue-800/50 border border-blue-600 rounded-full text-white text-xl hover:bg-blue-700/50 transition-all"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// KOR: 학력 선택 스텝 / ENG: Education level selection step
function EducationStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const educationIcons = ['📚', '🏫', '🎓', '🔬', '👨‍🏫'];

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/50 border border-indigo-500/30 rounded-2xl p-4 flex items-center gap-3">
        <Navigation className="text-indigo-400 shrink-0" size={24} />
        <div>
          <p className="text-indigo-300 font-semibold text-sm">두번째 기항지 / Second Port of Call</p>
          <p className="text-blue-200 text-xs mt-0.5">최종 학력을 선택해주세요 / Please select your highest education level</p>
        </div>
      </div>

      <div className="space-y-3">
        {educationOptions.map((edu, i) => (
          <button
            key={edu}
            onClick={() => onChange(edu)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
              value === edu
                ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-md shadow-indigo-500/20'
                : 'bg-blue-900/30 border-blue-700/50 text-blue-200 hover:border-indigo-600/50 hover:bg-blue-800/40'
            }`}
          >
            <span className="text-2xl">{educationIcons[i]}</span>
            <div>
              <span className="font-medium">{edu}</span>
              {value === edu && (
                <span className="ml-2 text-xs bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full">
                  선택됨
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// KOR: 예산 선택 스텝 / ENG: Budget selection step
function BudgetStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const budgetEmojis = ['🪙', '💵', '💰', '💎', '🏆'];
  const budgetLabels = ['절약형', '기본형', '여유형', '프리미엄형', '최상위형'];

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/50 border border-teal-500/30 rounded-2xl p-4 flex items-center gap-3">
        <DollarSign className="text-teal-400 shrink-0" size={24} />
        <div>
          <p className="text-teal-300 font-semibold text-sm">세번째 기항지 / Third Port of Call</p>
          <p className="text-blue-200 text-xs mt-0.5">연간 가용 예산을 선택하세요 / Select your annual available budget</p>
        </div>
      </div>

      {/* KOR: 크루즈 등급처럼 예산 등급 표시 / ENG: Display budget tiers like cruise classes */}
      <div className="space-y-3">
        {fundOptions.map((fund, i) => (
          <button
            key={fund}
            onClick={() => onChange(fund)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
              value === fund
                ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-md shadow-teal-500/20'
                : 'bg-blue-900/30 border-blue-700/50 text-blue-200 hover:border-teal-600/50 hover:bg-blue-800/40'
            }`}
          >
            <span className="text-2xl shrink-0">{budgetEmojis[i]}</span>
            <div className="flex-1 text-left">
              <p className="font-semibold">{fund}</p>
              <p className="text-xs opacity-70 mt-0.5">{budgetLabels[i]}</p>
            </div>
            {/* KOR: 등급 바 / ENG: Tier bar */}
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, j) => (
                <div
                  key={j}
                  className={`w-2 h-4 rounded-sm ${j <= i ? 'bg-teal-400' : 'bg-blue-700/50'}`}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// KOR: 목표 선택 스텝 / ENG: Goal selection step
function GoalStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const goalEmojis = ['🗣️', '⚡', '🌟', '🎓', '🏡'];

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/50 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3">
        <MapPin className="text-amber-400 shrink-0" size={24} />
        <div>
          <p className="text-amber-300 font-semibold text-sm">네번째 기항지 / Fourth Port of Call</p>
          <p className="text-blue-200 text-xs mt-0.5">한국에서의 최종 목표를 선택하세요 / Select your final goal in Korea</p>
        </div>
      </div>

      <div className="space-y-3">
        {goalOptions.map((goal, i) => (
          <button
            key={goal}
            onClick={() => onChange(goal)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
              value === goal
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20'
                : 'bg-blue-900/30 border-blue-700/50 text-blue-200 hover:border-amber-600/50 hover:bg-blue-800/40'
            }`}
          >
            <span className="text-2xl shrink-0">{goalEmojis[i]}</span>
            <span className="font-medium">{goal}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// KOR: 우선순위 선택 스텝 / ENG: Priority selection step
function PriorityStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const priorityData = [
    { label: priorityOptions[0], emoji: '🚀', desc: '가장 빠른 비자 경로로 안내합니다' },
    { label: priorityOptions[1], emoji: '💸', desc: '최소 비용의 경로를 찾아드립니다' },
    { label: priorityOptions[2], emoji: '🎯', desc: '승인 가능성이 가장 높은 경로입니다' },
    { label: priorityOptions[3], emoji: '💼', desc: '직업 분야에 최적화된 비자를 추천합니다' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/50 border border-rose-500/30 rounded-2xl p-4 flex items-center gap-3">
        <Star className="text-rose-400 shrink-0" size={24} />
        <div>
          <p className="text-rose-300 font-semibold text-sm">도착항 / Destination Port</p>
          <p className="text-blue-200 text-xs mt-0.5">어떤 점을 가장 중시하시나요? / What is your top priority?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {priorityData.map((item) => (
          <button
            key={item.label}
            onClick={() => onChange(item.label)}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
              value === item.label
                ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-md shadow-rose-500/20'
                : 'bg-blue-900/30 border-blue-700/50 text-blue-200 hover:border-rose-600/50 hover:bg-blue-800/40'
            }`}
          >
            <span className="text-3xl shrink-0">{item.emoji}</span>
            <div>
              <p className="font-semibold">{item.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// KOR: 항해 루트 맵 컴포넌트 (결과 페이지용)
// ENG: Voyage route map component (for result page)
function VoyageRouteMap({ pathway }: { pathway: RecommendedPathway }) {
  return (
    <div className="bg-blue-950/60 rounded-2xl p-4 border border-blue-800/50">
      <p className="text-sky-300 text-xs font-semibold mb-3 flex items-center gap-2">
        <Navigation size={12} /> 항해 루트 / Voyage Route
      </p>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {/* KOR: 출발항 / ENG: Departure port */}
        <div className="shrink-0 text-center">
          <div className="w-10 h-10 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center text-lg">
            🛫
          </div>
          <p className="text-xs text-green-400 mt-1 whitespace-nowrap">출발</p>
        </div>

        {/* KOR: 비자 체인 / ENG: Visa chain */}
        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((item, index) => (
          <React.Fragment key={index}>
            <div className="shrink-0 text-cyan-400/60">
              <Waves size={16} />
            </div>
            <div className="shrink-0 text-center">
              <div className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-xl">
                <p className="text-cyan-300 font-bold text-sm">{item.visa}</p>
                <p className="text-blue-300 text-xs">{item.duration}</p>
              </div>
            </div>
          </React.Fragment>
        ))}

        {/* KOR: 도착항 / ENG: Destination port */}
        <div className="shrink-0 text-cyan-400/60">
          <Waves size={16} />
        </div>
        <div className="shrink-0 text-center">
          <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/50 rounded-full flex items-center justify-center text-lg">
            🏁
          </div>
          <p className="text-xs text-amber-400 mt-1 whitespace-nowrap">도착</p>
        </div>
      </div>
    </div>
  );
}

// KOR: 기항지 카드 컴포넌트 (마일스톤)
// ENG: Port stop card component (milestones)
function MilestoneCards({ milestones }: { milestones: RecommendedPathway['milestones'] }) {
  return (
    <div className="space-y-3">
      <p className="text-sky-300 text-xs font-semibold flex items-center gap-2">
        <MapPin size={12} /> 기항지 일정 / Port of Call Schedule
      </p>
      {milestones.map((milestone, index) => (
        <div
          key={index}
          className="flex items-start gap-3 bg-blue-900/30 rounded-xl p-3 border border-blue-800/40"
        >
          {/* KOR: 기항지 번호 / ENG: Port number */}
          <div className="shrink-0 w-7 h-7 bg-sky-500/20 border border-sky-500/40 rounded-full flex items-center justify-center text-sky-400 text-xs font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{milestone.emoji}</span>
              <p className="text-white font-semibold text-sm">{milestone.title}</p>
            </div>
            <p className="text-blue-300 text-xs leading-relaxed">{milestone.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// KOR: 경로 결과 카드 (기항지 카드)
// ENG: Pathway result card (port card)
function PathwayCard({
  pathway,
  rank,
  isExpanded,
  onToggle,
}: {
  pathway: RecommendedPathway;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // KOR: 등수별 색상 / ENG: Rank-based colors
  const rankColors = [
    'from-amber-500/20 to-yellow-500/10 border-amber-500/50',
    'from-slate-400/20 to-slate-500/10 border-slate-400/50',
    'from-orange-700/20 to-orange-800/10 border-orange-700/50',
  ];
  const rankLabels = ['🥇 1등 추천', '🥈 2등 추천', '🥉 3등 추천'];
  const rankLabelColors = ['text-amber-400', 'text-slate-300', 'text-orange-500'];

  const scoreColorClass = getScoreColor(pathway.feasibilityLabel);
  const feasibilityEmoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <div
      className={`rounded-2xl border bg-linear-to-br ${rankColors[rank] ?? 'from-blue-800/20 to-blue-900/10 border-blue-700/50'} overflow-hidden`}
    >
      {/* KOR: 카드 헤더 / ENG: Card header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <span className={`text-xs font-bold ${rankLabelColors[rank] ?? 'text-blue-400'}`}>
              {rankLabels[rank] ?? `${rank + 1}번 경로`}
            </span>
            <h3 className="text-white font-bold text-base mt-1 leading-tight">{pathway.name}</h3>
          </div>
          {/* KOR: 실현가능성 점수 / ENG: Feasibility score */}
          <div className="shrink-0 text-center">
            <div className={`w-12 h-12 ${scoreColorClass} rounded-xl flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">{pathway.feasibilityScore}</span>
            </div>
            <p className="text-xs text-blue-300 mt-1">{feasibilityEmoji}</p>
          </div>
        </div>

        {/* KOR: 핵심 통계 / ENG: Key stats */}
        <div className="flex gap-4 mb-3">
          <div className="flex items-center gap-1.5 text-blue-300 text-xs">
            <Clock size={12} className="text-sky-400" />
            <span>{pathway.totalDurationMonths}개월</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-300 text-xs">
            <DollarSign size={12} className="text-green-400" />
            <span>${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-300 text-xs">
            <LifeBuoy size={12} className="text-amber-400" />
            <span>{pathway.feasibilityLabel}</span>
          </div>
        </div>

        <p className="text-blue-200 text-xs leading-relaxed">{pathway.description}</p>

        {/* KOR: 더보기 버튼 / ENG: Expand button */}
        <button
          onClick={onToggle}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-sky-300 text-xs font-medium"
        >
          {isExpanded ? '접기 / Collapse' : '항해 일정 보기 / View Voyage Schedule'}
          <ChevronRight
            size={14}
            className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        </button>
      </div>

      {/* KOR: 확장 영역: 루트 맵 + 마일스톤 / ENG: Expanded area: route map + milestones */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/10 pt-4">
          <VoyageRouteMap pathway={pathway} />
          <MilestoneCards milestones={pathway.milestones} />
        </div>
      )}
    </div>
  );
}

// KOR: 결과 화면 컴포넌트 / ENG: Result screen component
function ResultScreen({
  result,
  input,
  onReset,
}: {
  result: DiagnosisResult;
  input: DiagnosisInput;
  onReset: () => void;
}) {
  // KOR: 확장된 카드 상태 관리 / ENG: Expanded card state management
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['path-1']));

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // KOR: 국적 플래그 찾기 / ENG: Find nationality flag
  const nationalityFlag =
    popularCountries.find((c) => c.name === input.nationality)?.flag ?? '🌏';

  return (
    <div className="space-y-6">
      {/* KOR: 항구 도착 배너 / ENG: Port arrival banner */}
      <div className="relative bg-linear-to-br from-blue-900/80 to-cyan-900/60 rounded-3xl p-6 border border-cyan-500/30 overflow-hidden">
        <div className="absolute top-2 right-2 text-5xl opacity-10">🚢</div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center text-2xl">
            {nationalityFlag}
          </div>
          <div>
            <p className="text-cyan-300 text-xs font-semibold">항해 완료 / Voyage Complete</p>
            <h2 className="text-white font-bold text-lg">비자 경로 분석 결과</h2>
          </div>
        </div>
        <p className="text-blue-200 text-sm">
          <span className="text-cyan-300 font-semibold">{result.pathways.length}개의 최적 항로</span>를 발견했습니다.
          아래에서 가장 적합한 비자 경로를 선택하세요.
        </p>
        <p className="text-blue-300/70 text-xs mt-1">
          We found {result.pathways.length} optimal routes. Choose the most suitable visa pathway below.
        </p>

        {/* KOR: 입력 요약 태그 / ENG: Input summary tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 bg-white/10 rounded-full text-white text-xs">{input.nationality}</span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-white text-xs">{input.age}세</span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-white text-xs">{input.educationLevel}</span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-white text-xs">{input.availableAnnualFund}</span>
        </div>
      </div>

      {/* KOR: 경로 카드 목록 / ENG: Pathway card list */}
      <div className="space-y-4">
        {result.pathways.map((pathway, index) => (
          <PathwayCard
            key={pathway.id}
            pathway={pathway}
            rank={index}
            isExpanded={expandedIds.has(pathway.id)}
            onToggle={() => toggleExpand(pathway.id)}
          />
        ))}
      </div>

      {/* KOR: 재진단 버튼 / ENG: Re-diagnosis button */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-3 py-4 bg-blue-800/50 hover:bg-blue-700/50 border border-blue-600/50 rounded-2xl text-blue-200 font-medium transition-all group"
      >
        <Anchor size={18} className="group-hover:rotate-12 transition-transform" />
        다시 항해하기 / Start New Voyage
      </button>
    </div>
  );
}

// KOR: 메인 페이지 컴포넌트
// ENG: Main page component
export default function Diagnosis47Page() {
  // KOR: 현재 단계 상태 / ENG: Current step state
  const [currentStep, setCurrentStep] = useState(1);
  // KOR: 사용자 입력 상태 / ENG: User input state
  const [input, setInput] = useState<DiagnosisInput>(initialInput);
  // KOR: 로딩 상태 / ENG: Loading state
  const [isLoading, setIsLoading] = useState(false);
  // KOR: 결과 상태 / ENG: Result state
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 현재 단계 유효성 검사 / ENG: Current step validation
  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1: return !!input.nationality;
      case 2: return input.age >= 18;
      case 3: return !!input.educationLevel;
      case 4: return !!input.availableAnnualFund;
      case 5: return !!input.finalGoal;
      case 6: return !!input.priorityPreference;
      default: return false;
    }
  };

  // KOR: 다음 단계로 이동 / ENG: Navigate to next step
  const handleNext = () => {
    if (!isStepValid()) return;
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  // KOR: 이전 단계로 이동 / ENG: Navigate to previous step
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // KOR: 진단 제출 — 목업 데이터 사용 / ENG: Submit diagnosis — uses mock data
  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResult(mockDiagnosisResult);
    }, 2200);
  };

  // KOR: 초기화 / ENG: Reset to initial state
  const handleReset = () => {
    setResult(null);
    setCurrentStep(1);
    setInput(initialInput);
  };

  // KOR: 입력 업데이트 헬퍼 / ENG: Input update helper
  const updateInput = <K extends keyof DiagnosisInput>(key: K, value: DiagnosisInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* KOR: 오션 배경 / ENG: Ocean background */}
      <WaveBackground />

      {/* KOR: 컨텐츠 래퍼 / ENG: Content wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* KOR: 헤더 / ENG: Header */}
        <header className="px-4 pt-6 pb-2">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Anchor className="text-cyan-400" size={22} />
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">잡차자 비자 크루즈</h1>
                <p className="text-cyan-400/80 text-xs">JobChaja Visa Cruise</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-300 text-xs">
              <Wind size={14} className="text-sky-400" />
              <span>Design #47</span>
            </div>
          </div>
        </header>

        {/* KOR: 메인 컨텐츠 / ENG: Main content */}
        <main className="flex-1 px-4 pb-8">
          <div className="max-w-lg mx-auto">
            {/* KOR: 로딩 오버레이 / ENG: Loading overlay */}
            {isLoading && (
              <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-950/90 backdrop-blur-sm">
                <div className="text-center space-y-6">
                  <div className="text-6xl animate-bounce">🚢</div>
                  <div className="space-y-2">
                    <p className="text-white font-bold text-xl">항로 탐색 중...</p>
                    <p className="text-cyan-300 text-sm">Navigating your optimal visa route</p>
                  </div>
                  {/* KOR: 파도 애니메이션 / ENG: Wave animation indicator */}
                  <div className="flex justify-center gap-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-2 bg-cyan-400 rounded-full animate-pulse"
                        style={{
                          height: `${8 + (i % 3) * 8}px`,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* KOR: 결과 화면 / ENG: Result screen */}
            {result ? (
              <div className="mt-4">
                <ResultScreen result={result} input={input} onReset={handleReset} />
              </div>
            ) : (
              <>
                {/* KOR: 진행 상황 표시 / ENG: Progress display */}
                <div className="mt-4 mb-6">
                  <CruiseProgress currentStep={currentStep} />
                </div>

                {/* KOR: 현재 기항지 정보 / ENG: Current port info */}
                <div className="mb-4 text-center">
                  <p className="text-sky-400 text-sm font-semibold">
                    {CRUISE_STEPS[currentStep - 1]?.port}
                  </p>
                  <h2 className="text-white text-xl font-bold mt-1">
                    {CRUISE_STEPS[currentStep - 1]?.icon}{' '}
                    {CRUISE_STEPS[currentStep - 1]?.label}
                  </h2>
                  <p className="text-blue-400 text-xs mt-1">
                    Step {currentStep} / {CRUISE_STEPS.length}
                  </p>
                </div>

                {/* KOR: 스텝 카드 / ENG: Step card */}
                <div className="bg-blue-900/40 backdrop-blur-sm border border-blue-700/40 rounded-3xl p-5 mb-4">
                  {currentStep === 1 && (
                    <NationalityStep
                      value={input.nationality}
                      onChange={(v) => updateInput('nationality', v)}
                    />
                  )}
                  {currentStep === 2 && (
                    <AgeStep
                      value={input.age}
                      onChange={(v) => updateInput('age', v)}
                    />
                  )}
                  {currentStep === 3 && (
                    <EducationStep
                      value={input.educationLevel}
                      onChange={(v) => updateInput('educationLevel', v)}
                    />
                  )}
                  {currentStep === 4 && (
                    <BudgetStep
                      value={input.availableAnnualFund}
                      onChange={(v) => updateInput('availableAnnualFund', v)}
                    />
                  )}
                  {currentStep === 5 && (
                    <GoalStep
                      value={input.finalGoal}
                      onChange={(v) => updateInput('finalGoal', v)}
                    />
                  )}
                  {currentStep === 6 && (
                    <PriorityStep
                      value={input.priorityPreference}
                      onChange={(v) => updateInput('priorityPreference', v)}
                    />
                  )}
                </div>

                {/* KOR: 네비게이션 버튼 / ENG: Navigation buttons */}
                <div className="flex gap-3">
                  {currentStep > 1 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center justify-center gap-2 px-5 py-4 bg-blue-800/50 hover:bg-blue-700/50 border border-blue-700/50 rounded-2xl text-blue-200 font-medium transition-all"
                    >
                      <ChevronLeft size={18} />
                      이전
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all ${
                      isStepValid()
                        ? 'bg-linear-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-blue-800/30 text-blue-500 cursor-not-allowed border border-blue-700/30'
                    }`}
                  >
                    {currentStep === 6 ? (
                      <>
                        <Ship size={18} />
                        항해 시작! / Set Sail!
                      </>
                    ) : (
                      <>
                        다음 기항지 / Next Port
                        <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
