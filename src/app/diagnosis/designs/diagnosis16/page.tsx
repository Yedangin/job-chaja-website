'use client';

// 설문조사 스타일 비자 진단 페이지 / Survey-style visa diagnosis page
// Design #16: Google Forms / Typeform 스타일, 타입폼 블루 테마
// References: Typeform, Google Forms, SurveyMonkey, Tally, Jotform

import React, { useState, useEffect, useCallback } from 'react';
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
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  Clock,
  DollarSign,
  TrendingUp,
  Star,
  Globe,
  Users,
  Award,
  Zap,
  Target,
  ChevronRight,
  RotateCcw,
  Share2,
  Download,
  Heart,
} from 'lucide-react';

// ============================================================
// 상수 / Constants
// ============================================================

// 총 질문 수 / Total question count
const TOTAL_QUESTIONS = 6;

// 설문 질문 정의 / Survey question definitions
const QUESTIONS = [
  {
    id: 1,
    field: 'nationality' as keyof DiagnosisInput,
    titleKo: '어느 나라에서 오셨나요?',
    titleEn: 'Where are you from?',
    hintKo: '국적을 선택하세요',
    hintEn: 'Select your nationality',
    type: 'country',
  },
  {
    id: 2,
    field: 'age' as keyof DiagnosisInput,
    titleKo: '나이가 어떻게 되세요?',
    titleEn: 'How old are you?',
    hintKo: '만 나이를 입력하세요',
    hintEn: 'Enter your age',
    type: 'number',
  },
  {
    id: 3,
    field: 'educationLevel' as keyof DiagnosisInput,
    titleKo: '최종 학력은 무엇인가요?',
    titleEn: 'What is your education level?',
    hintKo: '가장 높은 학력을 선택하세요',
    hintEn: 'Select your highest education level',
    type: 'education',
  },
  {
    id: 4,
    field: 'availableAnnualFund' as keyof DiagnosisInput,
    titleKo: '연간 사용 가능한 자금은?',
    titleEn: 'What is your available annual fund?',
    hintKo: '생활비 포함 총 가용 자금',
    hintEn: 'Total available funds including living costs',
    type: 'fund',
  },
  {
    id: 5,
    field: 'finalGoal' as keyof DiagnosisInput,
    titleKo: '한국에서의 최종 목표는?',
    titleEn: 'What is your final goal in Korea?',
    hintKo: '가장 원하는 것을 선택하세요',
    hintEn: 'Select what you want most',
    type: 'goal',
  },
  {
    id: 6,
    field: 'priorityPreference' as keyof DiagnosisInput,
    titleKo: '어떤 방식을 선호하시나요?',
    titleEn: 'What do you prefer most?',
    hintKo: '경로 선택 기준을 알려주세요',
    hintEn: 'Tell us your pathway preference',
    type: 'priority',
  },
];

// ============================================================
// 타입 / Types
// ============================================================

// 진단 흐름 단계 / Diagnosis flow steps
type FlowStep = 'survey' | 'analyzing' | 'results' | 'thankyou';

// ============================================================
// 유틸 함수 / Utility functions
// ============================================================

// 점수에 따른 배경 클래스 / Background class by score
function getScoreBgClass(score: number): string {
  if (score >= 70) return 'bg-green-500';
  if (score >= 50) return 'bg-blue-500';
  if (score >= 30) return 'bg-amber-500';
  return 'bg-red-400';
}

// 만원 단위를 표시 포맷으로 변환 / Format cost in 만원 units
function formatCost(manWon: number): string {
  if (manWon === 0) return '무료 (장학금)';
  if (manWon >= 10000) return `${(manWon / 10000).toFixed(1)}억원`;
  if (manWon >= 1000) return `${(manWon / 1000).toFixed(1)}천만원`;
  return `${manWon}만원`;
}

// 개월 수를 년/월로 표시 / Format months into years and months
function formatMonths(months: number): string {
  if (months < 1) return '1개월 이내';
  if (months < 12) return `${months}개월`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years}년`;
  return `${years}년 ${rem}개월`;
}

// ============================================================
// 하위 컴포넌트: 진행 바 / Sub-component: Progress bar
// ============================================================

interface ProgressBarProps {
  current: number;
  total: number;
}

function ProgressBar({ current, total }: ProgressBarProps) {
  // 진행률 계산 / Calculate progress percentage
  const percent = Math.round((current / total) * 100);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* 얇은 진행 바 / Thin progress bar */}
      <div className="h-1 bg-blue-100">
        <div
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {/* 진행률 텍스트 / Progress text */}
      <div className="flex items-center justify-between px-6 py-2 bg-white border-b border-gray-100">
        <span className="text-sm font-medium text-blue-600">비자 진단 설문</span>
        <span className="text-sm text-gray-500">{percent}% 완료</span>
      </div>
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 국가 선택 / Sub-component: Country selection
// ============================================================

interface CountrySelectProps {
  value: string;
  onChange: (val: string) => void;
}

function CountrySelect({ value, onChange }: CountrySelectProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl">
      {popularCountries.map((country) => {
        const isSelected = value === country.code;
        return (
          <button
            key={country.code}
            onClick={() => onChange(country.code)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              isSelected
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <span className="text-2xl">{country.flag}</span>
            <div>
              <div className="font-semibold text-gray-800 text-sm">{country.nameKo}</div>
              <div className="text-xs text-gray-400">{country.nameEn}</div>
            </div>
            {isSelected && (
              <CheckCircle2 className="w-4 h-4 text-blue-500 ml-auto shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 나이 입력 / Sub-component: Age input
// ============================================================

interface AgeInputProps {
  value: number | '';
  onChange: (val: number) => void;
}

function AgeInput({ value, onChange }: AgeInputProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="relative w-full">
        <input
          type="number"
          min={16}
          max={65}
          value={value}
          onChange={(e) => {
            const num = parseInt(e.target.value, 10);
            if (!isNaN(num)) onChange(num);
          }}
          placeholder="나이 입력 (만 나이)"
          className="w-full px-6 py-5 text-2xl font-semibold text-center border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-medium">
          세
        </div>
      </div>
      {/* 범위 힌트 / Range hint */}
      <div className="flex gap-3">
        {[18, 22, 25, 28, 32].map((age) => (
          <button
            key={age}
            onClick={() => onChange(age)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              value === age
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
            }`}
          >
            {age}세
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 학력 선택 / Sub-component: Education select
// ============================================================

interface EducationSelectProps {
  value: string;
  onChange: (val: string) => void;
}

function EducationSelect({ value, onChange }: EducationSelectProps) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-lg">
      {educationOptions.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              isSelected
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <span className="text-2xl w-8 text-center">{opt.emoji}</span>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{opt.labelKo}</div>
              <div className="text-sm text-gray-400">{opt.labelEn}</div>
            </div>
            {isSelected && (
              <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 자금 선택 / Sub-component: Fund selection
// ============================================================

interface FundSelectProps {
  value: number | '';
  onChange: (val: number) => void;
}

function FundSelect({ value, onChange }: FundSelectProps) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-lg">
      {fundOptions.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              isSelected
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
              isSelected ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'
            }`}>
              ₩
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{opt.labelKo}</div>
              <div className="text-sm text-gray-400">{opt.labelEn}</div>
            </div>
            {isSelected && (
              <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 목표 선택 / Sub-component: Goal selection
// ============================================================

interface GoalSelectProps {
  value: string;
  onChange: (val: string) => void;
}

function GoalSelect({ value, onChange }: GoalSelectProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
      {goalOptions.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 text-center transition-all duration-200 ${
              isSelected
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <span className="text-4xl">{opt.emoji}</span>
            <div>
              <div className="font-bold text-gray-800 text-lg">{opt.labelKo}</div>
              <div className="text-sm text-gray-400 mt-1">{opt.descKo}</div>
            </div>
            {isSelected && (
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 우선순위 선택 / Sub-component: Priority selection
// ============================================================

interface PrioritySelectProps {
  value: string;
  onChange: (val: string) => void;
}

function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
      {priorityOptions.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 text-center transition-all duration-200 ${
              isSelected
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <div>
              <div className="font-bold text-gray-800 text-lg">{opt.labelKo}</div>
              <div className="text-sm text-gray-400 mt-1">{opt.descKo}</div>
            </div>
            {isSelected && (
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 분석 화면 / Sub-component: Analyzing screen
// ============================================================

interface AnalyzingScreenProps {
  percent: number;
}

function AnalyzingScreen({ percent }: AnalyzingScreenProps) {
  // 분석 단계 텍스트 / Analysis step texts
  const steps = [
    { threshold: 0, text: '비자 규칙 데이터 로드 중...' },
    { threshold: 20, text: '국적 및 학력 조건 평가 중...' },
    { threshold: 40, text: '자금 적합성 분석 중...' },
    { threshold: 60, text: '31개 비자 유형 평가 중...' },
    { threshold: 80, text: '최적 경로 계산 중...' },
    { threshold: 95, text: '결과 생성 완료!' },
  ];

  const currentStep = [...steps].reverse().find((s) => percent >= s.threshold);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      {/* 애니메이션 원형 / Animated circle */}
      <div className="relative w-40 h-40 mb-10">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={`${2 * Math.PI * 70 * (1 - percent / 100)}`}
            className="transition-all duration-300 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-blue-600">{percent}%</span>
          <span className="text-xs text-gray-400 mt-1">분석 중</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-3">AI 비자 경로 분석 중</h2>
      <p className="text-gray-500 text-center mb-8 max-w-sm">
        {currentStep?.text ?? '분석 준비 중...'}
      </p>

      {/* 단계 체크리스트 / Step checklist */}
      <div className="w-full max-w-sm space-y-3">
        {steps.map((step, i) => {
          const done = percent > step.threshold;
          const active = percent >= step.threshold && (i === steps.length - 1 || percent < steps[i + 1].threshold);
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                done ? 'bg-blue-500' : active ? 'border-2 border-blue-400' : 'bg-gray-100'
              }`}>
                {done && <CheckCircle2 className="w-4 h-4 text-white" />}
                {active && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
              </div>
              <span className={`text-sm transition-all ${
                done ? 'text-blue-600 font-medium' : active ? 'text-blue-500' : 'text-gray-300'
              }`}>
                {step.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 점수 막대 차트 / Sub-component: Score bar chart
// ============================================================

interface ScoreChartProps {
  pathways: RecommendedPathway[];
}

function ScoreChart({ pathways }: ScoreChartProps) {
  // 최고 점수로 정규화 / Normalize by max score
  const maxScore = Math.max(...pathways.map((p) => p.finalScore), 1);

  return (
    <div className="w-full space-y-3">
      {pathways.map((p, i) => {
        const barWidth = Math.max((p.finalScore / maxScore) * 100, 4);
        const color = getScoreColor(p.finalScore);
        return (
          <div key={p.pathwayId} className="flex items-center gap-3">
            {/* 순위 배지 / Rank badge */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
              i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'
            }`}>
              {i + 1}
            </div>
            {/* 공고 이름 / Pathway name */}
            <div className="w-32 shrink-0">
              <div className="text-xs font-medium text-gray-700 truncate">{p.nameKo}</div>
              <div className="text-xs text-gray-400">{getFeasibilityEmoji(p.feasibilityLabel)} {p.feasibilityLabel}</div>
            </div>
            {/* 점수 바 / Score bar */}
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                style={{ width: `${barWidth}%`, backgroundColor: color }}
              >
                <span className="text-white text-xs font-bold">{p.finalScore}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 경로 카드 / Sub-component: Pathway card
// ============================================================

interface PathwayCardProps {
  pathway: RecommendedPathway;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function PathwayCard({ pathway, rank, isExpanded, onToggle }: PathwayCardProps) {
  const scoreColor = getScoreColor(pathway.finalScore);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
      rank === 1 ? 'border-blue-400 shadow-lg shadow-blue-100' : 'border-gray-200'
    }`}>
      {/* 카드 헤더 / Card header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        {/* 순위 + 점수 / Rank + score */}
        <div className="flex flex-col items-center shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mb-1 ${
            rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-gray-400' : 'bg-orange-400'
          }`}>
            {rank}
          </div>
          <div className="text-xs font-bold" style={{ color: scoreColor }}>
            {pathway.finalScore}점
          </div>
        </div>

        {/* 경로 정보 / Pathway info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-800 text-base">{pathway.nameKo}</span>
            {rank === 1 && (
              <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                추천
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-0.5">{pathway.nameEn}</div>
          {/* 비자 체인 / Visa chain */}
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {pathway.visaChain.split(' → ').map((v, vi) => (
              <React.Fragment key={vi}>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-md">
                  {v}
                </span>
                {vi < pathway.visaChain.split(' → ').length - 1 && (
                  <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 요약 통계 / Summary stats */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{formatMonths(pathway.estimatedMonths)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span>{formatCost(pathway.estimatedCostWon)}</span>
          </div>
          <div className="text-lg">{emoji}</div>
        </div>

        {/* 토글 아이콘 / Toggle icon */}
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        )}
      </button>

      {/* 확장 콘텐츠 / Expanded content */}
      {isExpanded && (
        <div className="px-5 pb-5 bg-gray-50 border-t border-gray-100">
          {/* 점수 분석 / Score breakdown */}
          <div className="mt-4 mb-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              점수 분석 / Score Breakdown
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '기본점수', value: pathway.scoreBreakdown.base },
                { label: '나이 가중치', value: `×${pathway.scoreBreakdown.ageMultiplier}` },
                { label: '국적 가중치', value: `×${pathway.scoreBreakdown.nationalityMultiplier}` },
                { label: '자금 적합성', value: `×${pathway.scoreBreakdown.fundMultiplier}` },
                { label: '학력 가중치', value: `×${pathway.scoreBreakdown.educationMultiplier}` },
                { label: '우선순위 가중치', value: `×${pathway.scoreBreakdown.priorityWeight}` },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 px-3 bg-white rounded-lg">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-xs font-bold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 마일스톤 / Milestones */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              진행 단계 / Milestones
            </div>
            <div className="space-y-2">
              {pathway.milestones.map((m, mi) => (
                <div key={mi} className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{m.order}</span>
                    </div>
                    {mi < pathway.milestones.length - 1 && (
                      <div className="w-0.5 h-4 bg-blue-200 mt-1" />
                    )}
                  </div>
                  <div className="pb-2">
                    <div className="text-sm font-semibold text-gray-700">{m.nameKo}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-blue-500 font-medium">
                        {m.monthFromStart === 0 ? '시작' : `${m.monthFromStart}개월 후`}
                      </span>
                      {m.visaStatus && m.visaStatus !== 'none' && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                          {m.visaStatus}
                        </span>
                      )}
                      {m.canWorkPartTime && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          알바 가능
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 다음 단계 / Next steps */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              지금 바로 시작 / Next Steps
            </div>
            <div className="space-y-2">
              {pathway.nextSteps.map((ns, ni) => (
                <div key={ni} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100">
                  <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-gray-700">{ns.nameKo}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{ns.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 참고사항 / Note */}
          {pathway.note && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="text-xs text-amber-700">
                <span className="font-bold">참고: </span>{pathway.note}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 결과 통계 요약 / Sub-component: Result stats summary
// ============================================================

interface ResultStatsSummaryProps {
  result: DiagnosisResult;
  input: DiagnosisInput;
}

function ResultStatsSummary({ result, input }: ResultStatsSummaryProps) {
  const topPathway = result.pathways[0];

  // 사용자 국가 정보 / User country info
  const country = popularCountries.find((c) => c.code === input.nationality);

  return (
    <div className="bg-linear-to-br from-blue-500 to-blue-700 rounded-3xl p-6 text-white mb-6">
      {/* 헤더 / Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
          {country?.flag ?? '🌍'}
        </div>
        <div>
          <div className="text-sm text-blue-100">설문 결과</div>
          <div className="text-xl font-bold">
            {country?.nameKo ?? input.nationality} · {input.age}세 · 비자 경로 진단
          </div>
        </div>
      </div>

      {/* 통계 카드 그리드 / Stat card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: <Target className="w-5 h-5" />,
            label: '평가된 경로',
            value: `${result.meta.totalPathwaysEvaluated}개`,
          },
          {
            icon: <CheckCircle2 className="w-5 h-5" />,
            label: '추천 경로',
            value: `${result.pathways.length}개`,
          },
          {
            icon: <TrendingUp className="w-5 h-5" />,
            label: '최고 점수',
            value: `${topPathway.finalScore}점`,
          },
          {
            icon: <Clock className="w-5 h-5" />,
            label: '최단 기간',
            value: formatMonths(Math.min(...result.pathways.map((p) => p.estimatedMonths))),
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white bg-opacity-15 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-blue-100 mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-blue-200 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 감사 화면 / Sub-component: Thank you screen
// ============================================================

interface ThankYouScreenProps {
  onRestart: () => void;
}

function ThankYouScreen({ onRestart }: ThankYouScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
      {/* 체크 아이콘 / Check icon */}
      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-8">
        <CheckCircle2 className="w-14 h-14 text-blue-500" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-3">
        설문 완료!
      </h1>
      <p className="text-gray-500 mb-2 max-w-sm">
        잡차자 비자 진단을 완료해 주셔서 감사합니다.
      </p>
      <p className="text-sm text-gray-400 mb-10 max-w-xs">
        결과를 저장하고 전문 상담사와 연결하여 비자 경로를 확정하세요.
      </p>

      {/* 액션 버튼 / Action buttons */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button className="flex items-center justify-center gap-2 bg-blue-500 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors">
          <Users className="w-5 h-5" />
          전문 상담사 연결하기
        </button>
        <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-200 transition-colors">
          <Share2 className="w-5 h-5" />
          결과 공유하기
        </button>
        <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-200 transition-colors">
          <Download className="w-5 h-5" />
          PDF로 저장하기
        </button>
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 text-gray-400 font-medium py-3 hover:text-blue-500 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          다시 진단하기
        </button>
      </div>

      {/* 하단 로고 / Bottom logo */}
      <div className="mt-12 flex items-center gap-2 text-gray-300">
        <Globe className="w-4 h-4" />
        <span className="text-sm">잡차자 비자 진단 · JobChaJa Visa Diagnosis</span>
      </div>
    </div>
  );
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================

export default function Diagnosis16Page() {
  // 현재 질문 인덱스 (0-based) / Current question index
  const [currentQ, setCurrentQ] = useState<number>(0);

  // 입력 값 상태 / Input values state
  const [answers, setAnswers] = useState<Partial<DiagnosisInput>>({
    nationality: mockInput.nationality,
    age: mockInput.age,
    educationLevel: mockInput.educationLevel,
    availableAnnualFund: mockInput.availableAnnualFund,
    finalGoal: mockInput.finalGoal,
    priorityPreference: mockInput.priorityPreference,
  });

  // 흐름 단계 / Flow step
  const [flowStep, setFlowStep] = useState<FlowStep>('survey');

  // 분석 진행률 / Analysis progress
  const [analyzePercent, setAnalyzePercent] = useState<number>(0);

  // 결과 / Result
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // 확장된 경로 ID / Expanded pathway ID
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 결과 탭 / Result tab
  const [activeTab, setActiveTab] = useState<'chart' | 'list'>('chart');

  // ============================================================
  // 현재 질문 가져오기 / Get current question
  // ============================================================
  const question = QUESTIONS[currentQ];

  // ============================================================
  // 현재 답변 값 가져오기 / Get current answer value
  // ============================================================
  const currentValue = answers[question?.field];

  // ============================================================
  // 현재 질문에 답변이 있는지 확인 / Check if current question has answer
  // ============================================================
  const hasAnswer = useCallback((): boolean => {
    if (!question) return false;
    const val = answers[question.field];
    if (val === undefined || val === null || val === '') return false;
    if (question.type === 'number' && (val as number) <= 0) return false;
    return true;
  }, [question, answers]);

  // ============================================================
  // 다음 질문으로 이동 / Move to next question
  // ============================================================
  const handleNext = useCallback(() => {
    if (currentQ < TOTAL_QUESTIONS - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      // 마지막 질문 후 분석 시작 / Start analysis after last question
      setFlowStep('analyzing');
    }
  }, [currentQ]);

  // ============================================================
  // 이전 질문으로 이동 / Move to previous question
  // ============================================================
  const handleBack = useCallback(() => {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    }
  }, [currentQ]);

  // ============================================================
  // 답변 업데이트 / Update answer
  // ============================================================
  const updateAnswer = useCallback(
    <K extends keyof DiagnosisInput>(field: K, value: DiagnosisInput[K]) => {
      setAnswers((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // ============================================================
  // 키보드 단축키 (Enter = 다음, ← = 이전) / Keyboard shortcuts
  // ============================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (flowStep !== 'survey') return;
      if (e.key === 'Enter' && hasAnswer()) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentQ > 0) {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flowStep, hasAnswer, handleNext, handleBack, currentQ]);

  // ============================================================
  // 분석 애니메이션 / Analysis animation
  // ============================================================
  useEffect(() => {
    if (flowStep !== 'analyzing') return;

    setAnalyzePercent(0);
    const interval = setInterval(() => {
      setAnalyzePercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // 분석 완료 → 결과 표시 / Analysis done → show results
          setTimeout(() => {
            setResult(mockDiagnosisResult);
            setFlowStep('results');
          }, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [flowStep]);

  // ============================================================
  // 처음부터 다시 시작 / Restart from beginning
  // ============================================================
  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setAnswers({
      nationality: '',
      age: 0,
      educationLevel: '',
      availableAnnualFund: 0,
      finalGoal: '',
      priorityPreference: '',
    });
    setResult(null);
    setAnalyzePercent(0);
    setExpandedId(null);
    setActiveTab('chart');
    setFlowStep('survey');
  }, []);

  // ============================================================
  // 분석 화면 렌더링 / Render analysis screen
  // ============================================================
  if (flowStep === 'analyzing') {
    return <AnalyzingScreen percent={analyzePercent} />;
  }

  // ============================================================
  // 감사 화면 렌더링 / Render thank you screen
  // ============================================================
  if (flowStep === 'thankyou') {
    return <ThankYouScreen onRestart={handleRestart} />;
  }

  // ============================================================
  // 결과 화면 렌더링 / Render results screen
  // ============================================================
  if (flowStep === 'results' && result) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 결과 헤더 / Results header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-gray-800 text-lg">비자 진단 결과</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
            >
              <RotateCcw className="w-4 h-4" />
              다시하기
            </button>
            <button
              onClick={() => setFlowStep('thankyou')}
              className="flex items-center gap-2 bg-blue-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
            >
              완료
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 결과 콘텐츠 / Results content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* 요약 통계 / Summary stats */}
          <ResultStatsSummary
            result={result}
            input={answers as DiagnosisInput}
          />

          {/* 탭 전환 / Tab switcher */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'chart'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              점수 차트
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Target className="w-4 h-4" />
              경로 목록
            </button>
          </div>

          {/* 차트 탭 / Chart tab */}
          {activeTab === 'chart' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800 text-base">경로별 점수 비교</h3>
                <span className="text-xs text-gray-400">총 {result.pathways.length}개 경로</span>
              </div>
              <ScoreChart pathways={result.pathways} />
              {/* 범례 / Legend */}
              <div className="flex items-center gap-4 mt-5 flex-wrap">
                {[
                  { color: '#22c55e', label: '70점 이상 (높음)' },
                  { color: '#3b82f6', label: '50-69점 (보통)' },
                  { color: '#f59e0b', label: '30-49점 (낮음)' },
                  { color: '#ef4444', label: '30점 미만 (매우낮음)' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 목록 탭 / List tab */}
          {activeTab === 'list' && (
            <div className="space-y-4 mb-6">
              {result.pathways.map((pathway, i) => (
                <PathwayCard
                  key={pathway.pathwayId}
                  pathway={pathway}
                  rank={i + 1}
                  isExpanded={expandedId === pathway.pathwayId}
                  onToggle={() =>
                    setExpandedId(
                      expandedId === pathway.pathwayId ? null : pathway.pathwayId
                    )
                  }
                />
              ))}
            </div>
          )}

          {/* CTA 섹션 / CTA section */}
          <div className="bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 text-center">
            <Star className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 text-lg mb-2">
              전문 상담으로 최종 확정하세요
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              AI 진단 결과를 바탕으로 공인 행정사가 1:1로 최적 비자 경로를 안내해 드립니다.
            </p>
            <button
              onClick={() => setFlowStep('thankyou')}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Users className="w-5 h-5" />
              무료 상담 신청하기
            </button>
          </div>

          {/* 하단 메타 / Bottom meta */}
          <div className="text-center mt-6 text-xs text-gray-300">
            {result.meta.totalPathwaysEvaluated}개 경로 평가 · {result.meta.hardFilteredOut}개 필터링 제외 ·{' '}
            {new Date(result.meta.timestamp).toLocaleString('ko-KR')}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 설문 화면 렌더링 / Render survey screen
  // ============================================================

  // 현재 질문 번호 (1-based) / Current question number (1-based)
  const qNum = currentQ + 1;
  const canProceed = hasAnswer();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 진행 바 / Progress bar */}
      <ProgressBar current={qNum} total={TOTAL_QUESTIONS} />

      {/* 설문 본문 / Survey body */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-10">
        {/* 질문 번호 + 제목 / Question number + title */}
        <div className="w-full max-w-xl mb-8">
          {/* 번호 배지 / Number badge */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full shrink-0">
              {qNum}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span className="font-medium text-blue-500">{qNum}</span>
              <span>/ {TOTAL_QUESTIONS}</span>
            </div>
          </div>

          {/* 질문 텍스트 / Question text */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 leading-snug">
            {question.titleKo}
          </h1>
          <p className="text-base text-gray-400">{question.hintKo}</p>
        </div>

        {/* 입력 영역 / Input area */}
        <div className="w-full flex justify-center">
          {question.type === 'country' && (
            <CountrySelect
              value={(answers.nationality ?? '') as string}
              onChange={(val) => updateAnswer('nationality', val)}
            />
          )}

          {question.type === 'number' && (
            <AgeInput
              value={answers.age === 0 ? '' : (answers.age ?? '')}
              onChange={(val) => updateAnswer('age', val)}
            />
          )}

          {question.type === 'education' && (
            <EducationSelect
              value={(answers.educationLevel ?? '') as string}
              onChange={(val) => updateAnswer('educationLevel', val)}
            />
          )}

          {question.type === 'fund' && (
            <FundSelect
              value={answers.availableAnnualFund === undefined ? '' : (answers.availableAnnualFund ?? '')}
              onChange={(val) => updateAnswer('availableAnnualFund', val)}
            />
          )}

          {question.type === 'goal' && (
            <GoalSelect
              value={(answers.finalGoal ?? '') as string}
              onChange={(val) => updateAnswer('finalGoal', val)}
            />
          )}

          {question.type === 'priority' && (
            <PrioritySelect
              value={(answers.priorityPreference ?? '') as string}
              onChange={(val) => updateAnswer('priorityPreference', val)}
            />
          )}
        </div>
      </div>

      {/* 하단 네비게이션 / Bottom navigation */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between max-w-xl mx-auto gap-4">
          {/* 이전 버튼 / Back button */}
          <button
            onClick={handleBack}
            disabled={currentQ === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
              currentQ === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            이전
          </button>

          {/* 키보드 힌트 / Keyboard hint */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-300">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-400 font-mono">Enter</kbd>
            <span>로 다음</span>
          </div>

          {/* 다음 버튼 / Next button */}
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all ${
              canProceed
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-200'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {currentQ === TOTAL_QUESTIONS - 1 ? (
              <>
                <Zap className="w-4 h-4" />
                진단 시작
              </>
            ) : (
              <>
                다음
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
