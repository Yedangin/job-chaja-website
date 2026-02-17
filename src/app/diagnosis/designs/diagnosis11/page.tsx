'use client';

// KOR: 잡차자 비자 진단 — 디자인 #11: 원페이지 폼 (One-Page Form)
// ENG: JobChaja Visa Diagnosis — Design #11: One-Page Form
// Reference: Stripe, Linear, Notion, Supabase, Vercel
// Color theme: Minimal White + Indigo

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  Globe,
  GraduationCap,
  DollarSign,
  Target,
  Star,
  Clock,
  TrendingUp,
  ArrowRight,
  RotateCcw,
  Loader2,
  AlertCircle,
  Sparkles,
  MapPin,
  Calendar,
  Shield,
  FileText,
  CheckCircle2,
  XCircle,
  Info,
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
// 타입 정의 / Type definitions
// ============================================================

/** KOR: 폼 섹션 식별자 / ENG: Form section identifier */
type SectionId = 'nationality' | 'age' | 'education' | 'fund' | 'goal' | 'priority';

/** KOR: 진단 페이지의 현재 상태 / ENG: Current state of the diagnosis page */
type PageState = 'form' | 'loading' | 'result';

/** KOR: 섹션 정보 인터페이스 / ENG: Section info interface */
interface Section {
  id: SectionId;
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  isComplete: (input: Partial<DiagnosisInput>) => boolean;
}

// ============================================================
// 상수 정의 / Constants
// ============================================================

/** KOR: 폼 섹션 목록 / ENG: Form sections list */
const SECTIONS: Section[] = [
  {
    id: 'nationality',
    label: '국적',
    labelEn: 'Nationality',
    icon: <Globe size={16} />,
    isComplete: (input) => !!input.nationality,
  },
  {
    id: 'age',
    label: '나이',
    labelEn: 'Age',
    icon: <Calendar size={16} />,
    isComplete: (input) => !!input.age && input.age > 0,
  },
  {
    id: 'education',
    label: '학력',
    labelEn: 'Education',
    icon: <GraduationCap size={16} />,
    isComplete: (input) => !!input.educationLevel,
  },
  {
    id: 'fund',
    label: '가용 자금',
    labelEn: 'Available Fund',
    icon: <DollarSign size={16} />,
    isComplete: (input) => !!input.availableAnnualFund,
  },
  {
    id: 'goal',
    label: '최종 목표',
    labelEn: 'Final Goal',
    icon: <Target size={16} />,
    isComplete: (input) => !!input.finalGoal,
  },
  {
    id: 'priority',
    label: '우선순위',
    labelEn: 'Priority',
    icon: <Star size={16} />,
    isComplete: (input) => !!input.priorityPreference,
  },
];

// ============================================================
// 헬퍼 함수 / Helper functions
// ============================================================

/** KOR: 실현 가능성 레이블에 따른 텍스트 색상 클래스 반환 / ENG: Returns text color class based on feasibility label */
const getFeasibilityTextColor = (label: RecommendedPathway['feasibilityLabel']): string => {
  switch (label) {
    case '매우 높음': return 'text-indigo-600';
    case '높음': return 'text-green-600';
    case '보통': return 'text-yellow-600';
    case '낮음': return 'text-orange-600';
    case '매우 낮음': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

/** KOR: 실현 가능성 레이블에 따른 배경색 클래스 반환 / ENG: Returns badge bg class based on feasibility label */
const getFeasibilityBadgeClass = (label: RecommendedPathway['feasibilityLabel']): string => {
  switch (label) {
    case '매우 높음': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case '높음': return 'bg-green-50 text-green-700 border-green-200';
    case '보통': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case '낮음': return 'bg-orange-50 text-orange-700 border-orange-200';
    case '매우 낮음': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

/** KOR: 점수 바 색상 클래스 반환 / ENG: Returns score bar color class */
const getScoreBarColor = (score: number): string => {
  if (score >= 80) return 'bg-indigo-500';
  if (score >= 60) return 'bg-green-500';
  if (score >= 40) return 'bg-yellow-500';
  if (score >= 20) return 'bg-orange-500';
  return 'bg-red-500';
};

// ============================================================
// 서브 컴포넌트 / Sub-components
// ============================================================

/** KOR: 프로그레스 인디케이터 / ENG: Progress indicator */
const ProgressIndicator: React.FC<{
  sections: Section[];
  completedCount: number;
  activeSection: SectionId | null;
  onSectionClick: (id: SectionId) => void;
  input: Partial<DiagnosisInput>;
}> = ({ sections, completedCount, activeSection, onSectionClick, input }) => {
  const totalCount = sections.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    // KOR: 고정 프로그레스 바 (상단) / ENG: Sticky progress bar (top)
    <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-3">
        {/* KOR: 상단 행 — 제목 + 퍼센트 / ENG: Top row — title + percentage */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800">비자 적합도 진단</span>
          </div>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {completedCount}/{totalCount} 완료 · {percentage}%
          </span>
        </div>

        {/* KOR: 프로그레스 바 / ENG: Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* KOR: 섹션 스텝 아이콘 / ENG: Section step icons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {sections.map((section, idx) => {
            const isComplete = section.isComplete(input);
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all shrink-0
                  ${isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isComplete
                    ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
              >
                {isComplete ? (
                  <CheckCircle2 size={11} className={isActive ? 'text-white' : 'text-indigo-500'} />
                ) : (
                  <span className={`w-3 h-3 rounded-full border flex items-center justify-center text-[9px] font-bold
                    ${isActive ? 'border-white text-white' : 'border-gray-300 text-gray-400'}`}>
                    {idx + 1}
                  </span>
                )}
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** KOR: 국적 선택 섹션 / ENG: Nationality selection section */
const NationalitySection: React.FC<{
  value: string;
  onChange: (v: string) => void;
  isActive: boolean;
  isComplete: boolean;
  onFocus: () => void;
}> = ({ value, onChange, isActive, isComplete, onFocus }) => {
  const [search, setSearch] = useState('');

  const filteredCountries = popularCountries.filter(
    (c) =>
      (c.nameKo ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (c.nameEn ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (c.code ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* KOR: 검색 입력 / ENG: Search input */}
      <div className="relative">
        <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="국가 검색 (예: Vietnam, China...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={onFocus}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 placeholder:text-gray-300 text-gray-700 bg-gray-50 focus:bg-white transition-all"
        />
      </div>

      {/* KOR: 국가 그리드 / ENG: Country grid */}
      <div className="grid grid-cols-3 gap-2">
        {filteredCountries.map((country) => (
          <button
            key={country.code}
            onClick={() => onChange(country.name)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all
              ${value === country.name
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                : 'border-gray-100 bg-white text-gray-600 hover:border-indigo-200 hover:bg-indigo-50'
              }`}
          >
            <span className="text-base">{country.flag}</span>
            <span className="truncate text-xs">{country.name}</span>
            {value === country.name && (
              <Check size={11} className="text-indigo-500 shrink-0 ml-auto" />
            )}
          </button>
        ))}
      </div>

      {/* KOR: 직접 입력 안내 / ENG: Manual entry hint */}
      {search && filteredCountries.length === 0 && (
        <button
          onClick={() => onChange(search)}
          className="w-full py-2.5 px-4 border border-dashed border-indigo-300 rounded-lg text-sm text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
        >
          <MapPin size={14} />
          <span>"{search}" 직접 입력하기</span>
        </button>
      )}
    </div>
  );
};

/** KOR: 나이 입력 섹션 / ENG: Age input section */
const AgeSection: React.FC<{
  value: number | '';
  onChange: (v: number) => void;
  onFocus: () => void;
}> = ({ value, onChange, onFocus }) => {
  const [localVal, setLocalVal] = useState(value === '' ? '' : String(value));
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalVal(raw);
    const num = parseInt(raw, 10);
    if (isNaN(num) || num < 15 || num > 80) {
      setError('15~80 사이의 나이를 입력하세요.');
    } else {
      setError('');
      onChange(num);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="number"
          min={15}
          max={80}
          placeholder="예: 25"
          value={localVal}
          onChange={handleChange}
          onFocus={onFocus}
          className={`w-full pl-9 pr-16 py-2.5 text-sm border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
            placeholder:text-gray-300 text-gray-700 bg-gray-50 focus:bg-white transition-all
            ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'}`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">세 (만)</span>
      </div>

      {/* KOR: 빠른 선택 버튼 / ENG: Quick select buttons */}
      <div className="flex flex-wrap gap-2">
        {[20, 25, 28, 30, 35, 40].map((age) => (
          <button
            key={age}
            onClick={() => {
              setLocalVal(String(age));
              setError('');
              onChange(age);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
              ${value === age
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-white text-gray-500 hover:border-indigo-200 hover:text-indigo-600'
              }`}
          >
            {age}세
          </button>
        ))}
      </div>

      {/* KOR: 에러 메시지 / ENG: Error message */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}

      {/* KOR: 나이 관련 안내 / ENG: Age-related note */}
      <div className="flex items-start gap-2 p-2.5 bg-indigo-50 rounded-lg">
        <Info size={13} className="text-indigo-400 mt-0.5 shrink-0" />
        <p className="text-xs text-indigo-600">
          나이는 일부 비자(F-2-7 점수제, 워킹홀리데이 등) 자격 요건에 영향을 줍니다.
        </p>
      </div>
    </div>
  );
};

/** KOR: 선택지 그리드 섹션 (학력, 자금, 목표, 우선순위 공용) / ENG: Option grid section (shared for education, fund, goal, priority) */
const OptionGridSection: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[];
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  columns?: 1 | 2;
}> = ({ options, value, onChange, onFocus, columns = 2 }) => {
  return (
    <div className={`grid gap-2 ${columns === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {options.map((option) => {
        // KOR: 옵션이 문자열이면 그대로, 객체면 value/labelKo 사용
        // ENG: If option is string use as-is, if object use value/labelKo
        const optValue = typeof option === 'string' ? option : String(option.value ?? option.labelKo ?? '');
        const optLabel = typeof option === 'string' ? option : (option.emoji ? `${option.emoji} ${option.labelKo}` : option.labelKo);
        return (
          <button
            key={optValue}
            onClick={() => { onFocus(); onChange(optValue); }}
            className={`flex items-center justify-between px-3 py-3 rounded-xl border text-sm font-medium transition-all text-left
              ${value === optValue
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                : 'border-gray-100 bg-white text-gray-600 hover:border-indigo-200 hover:bg-indigo-50'
              }`}
          >
            <span>{optLabel}</span>
            {value === optValue && (
              <Check size={14} className="text-indigo-500 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
};

/** KOR: 단일 폼 섹션 컨테이너 / ENG: Single form section container */
const FormSection: React.FC<{
  section: Section;
  isActive: boolean;
  isComplete: boolean;
  children: React.ReactNode;
  onToggle: () => void;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}> = ({ section, isActive, isComplete, children, onToggle, sectionRef }) => {
  return (
    <div
      ref={sectionRef}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden
        ${isActive
          ? 'border-indigo-300 shadow-md shadow-indigo-50'
          : isComplete
          ? 'border-green-200 bg-green-50/30'
          : 'border-gray-100 bg-white hover:border-gray-200'
        }`}
    >
      {/* KOR: 섹션 헤더 / ENG: Section header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
      >
        <div className="flex items-center gap-3">
          {/* KOR: 상태 아이콘 / ENG: Status icon */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all
            ${isComplete
              ? 'bg-green-100 text-green-600'
              : isActive
              ? 'bg-indigo-100 text-indigo-600'
              : 'bg-gray-100 text-gray-400'
            }`}>
            {isComplete ? <Check size={14} /> : section.icon}
          </div>

          <div>
            <p className={`text-sm font-semibold transition-colors
              ${isActive ? 'text-indigo-700' : isComplete ? 'text-gray-700' : 'text-gray-400'}`}>
              {section.label}
              <span className="ml-1.5 text-xs font-normal text-gray-400">· {section.labelEn}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isComplete && !isActive && (
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              완료
            </span>
          )}
          <div className={`text-gray-400 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}>
            <ChevronDown size={16} />
          </div>
        </div>
      </button>

      {/* KOR: 섹션 콘텐츠 (접힘/펼침) / ENG: Section content (collapse/expand) */}
      <div className={`transition-all duration-300 overflow-hidden
        ${isActive ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pb-5 pt-1 border-t border-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

/** KOR: 비자 경로 카드 / ENG: Visa pathway card */
const PathwayCard: React.FC<{
  pathway: RecommendedPathway;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ pathway, rank, isExpanded, onToggle }) => {
  const scoreBarColor = getScoreBarColor(pathway.feasibilityScore);
  const badgeClass = getFeasibilityBadgeClass(pathway.feasibilityLabel);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300
      ${rank === 1
        ? 'border-indigo-300 shadow-lg shadow-indigo-50 ring-1 ring-indigo-200'
        : 'border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md'
      }`}>

      {/* KOR: 1위 배지 / ENG: Top pick badge */}
      {rank === 1 && (
        <div className="bg-linear-to-br from-indigo-600 to-indigo-700 px-4 py-1.5 flex items-center gap-2">
          <Sparkles size={12} className="text-indigo-200" />
          <span className="text-xs font-semibold text-white">최적 추천 경로</span>
          <span className="text-xs text-indigo-300 ml-auto">Best Match</span>
        </div>
      )}

      {/* KOR: 카드 헤더 / ENG: Card header */}
      <div className="p-5 bg-white">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0
              ${rank === 1 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
              {rank}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{pathway.name}</h3>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${badgeClass}`}>
                <span>{emoji}</span>
                <span>적합도: {pathway.feasibilityLabel}</span>
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-xl font-black ${getFeasibilityTextColor(pathway.feasibilityLabel)}`}>
              {pathway.feasibilityScore}
            </div>
            <div className="text-[10px] text-gray-400">/ 100점</div>
          </div>
        </div>

        {/* KOR: 점수 바 / ENG: Score bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
          <div
            className={`${scoreBarColor} h-1.5 rounded-full transition-all duration-700`}
            style={{ width: `${pathway.feasibilityScore}%` }}
          />
        </div>

        {/* KOR: 핵심 수치 3개 / ENG: 3 key stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <Clock size={11} />
              <span className="text-[10px]">기간</span>
            </div>
            <div className="font-bold text-gray-800 text-sm">{pathway.totalDurationMonths}개월</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <DollarSign size={11} />
              <span className="text-[10px]">비용</span>
            </div>
            <div className="font-bold text-gray-800 text-sm">
              ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <Shield size={11} />
              <span className="text-[10px]">단계</span>
            </div>
            <div className="font-bold text-gray-800 text-sm">{(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length}단계</div>
          </div>
        </div>

        {/* KOR: 비자 체인 / ENG: Visa chain */}
        <div className="flex items-center flex-wrap gap-1.5 mb-4">
          {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border
                  ${idx === 0
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}>
                  {step.visa}
                </span>
                <span className="text-[9px] text-gray-400 mt-0.5">{step.duration}</span>
              </div>
              {idx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                <ArrowRight size={12} className="text-gray-300 shrink-0 mb-2" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* KOR: 간략 설명 / ENG: Brief description */}
        <p className="text-xs text-gray-500 leading-relaxed mb-3">{pathway.description}</p>

        {/* KOR: 펼치기 버튼 / ENG: Expand button */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={13} />
              <span>상세 로드맵 접기</span>
            </>
          ) : (
            <>
              <ChevronDown size={13} />
              <span>상세 로드맵 보기</span>
            </>
          )}
        </button>
      </div>

      {/* KOR: 상세 내용 (마일스톤) / ENG: Detail content (milestones) */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4">
          <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
            단계별 로드맵 · Milestone
          </h4>
          <div className="space-y-3">
            {pathway.milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-3">
                {/* KOR: 타임라인 점 / ENG: Timeline dot */}
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center text-sm shrink-0">
                    {milestone.emoji}
                  </div>
                  {idx < pathway.milestones.length - 1 && (
                    <div className="w-px h-4 bg-indigo-100 mt-1" />
                  )}
                </div>
                <div className="pt-0.5 pb-1">
                  <p className="text-xs font-bold text-gray-800 mb-0.5">{milestone.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* KOR: 다음 단계 행동 CTA / ENG: Next steps CTA */}
          <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={13} className="text-indigo-500" />
              <span className="text-xs font-bold text-indigo-700">다음 단계</span>
            </div>
            <ul className="space-y-1">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).slice(0, 2).map((step, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-indigo-600">
                  <CheckCircle2 size={10} className="text-indigo-400 shrink-0" />
                  <span>{step.visa} 비자 요건 확인 및 서류 준비 ({step.duration})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

/** KOR: 결과 패널 (인라인) / ENG: Inline result panel */
const ResultPanel: React.FC<{
  result: DiagnosisResult;
  input: Partial<DiagnosisInput>;
  onReset: () => void;
}> = ({ result, input, onReset }) => {
  const [expandedId, setExpandedId] = useState<string | null>(result.pathways[0]?.id ?? null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 animate-[fadeSlideUp_0.5s_ease_both]">

      {/* KOR: 결과 헤더 요약 / ENG: Result header summary */}
      <div className="rounded-2xl bg-linear-to-br from-indigo-600 to-indigo-800 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-indigo-200" />
              <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wide">
                비자 적합도 진단 완료
              </span>
            </div>
            <h2 className="text-xl font-black leading-tight mb-1">
              {result.pathways.length}개의 추천 경로를 찾았습니다
            </h2>
            <p className="text-xs text-indigo-200 leading-relaxed">
              입력하신 조건을 분석하여 최적 비자 경로를 순위별로 정렬했습니다.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-black text-white">{result.pathways[0]?.feasibilityScore ?? 0}</div>
            <div className="text-xs text-indigo-300">최고 적합도</div>
          </div>
        </div>

        {/* KOR: 입력 요약 칩 / ENG: Input summary chips */}
        <div className="flex flex-wrap gap-2">
          {input.nationality && (
            <span className="px-2.5 py-1 bg-white/15 rounded-full text-xs text-white font-medium backdrop-blur-sm">
              🌏 {input.nationality}
            </span>
          )}
          {input.age && (
            <span className="px-2.5 py-1 bg-white/15 rounded-full text-xs text-white font-medium backdrop-blur-sm">
              🎂 {input.age}세
            </span>
          )}
          {input.educationLevel && (
            <span className="px-2.5 py-1 bg-white/15 rounded-full text-xs text-white font-medium backdrop-blur-sm">
              🎓 {input.educationLevel}
            </span>
          )}
          {input.finalGoal && (
            <span className="px-2.5 py-1 bg-white/15 rounded-full text-xs text-white font-medium backdrop-blur-sm">
              🎯 {input.finalGoal}
            </span>
          )}
        </div>
      </div>

      {/* KOR: 경로 카드 리스트 / ENG: Pathway card list */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <TrendingUp size={14} className="text-indigo-500" />
          추천 경로 순위
        </h3>
        {result.pathways.map((pathway, idx) => (
          <PathwayCard
            key={pathway.id}
            pathway={pathway}
            rank={idx + 1}
            isExpanded={expandedId === pathway.id}
            onToggle={() => toggleExpand(pathway.id)}
          />
        ))}
      </div>

      {/* KOR: 다시 진단하기 버튼 / ENG: Re-diagnose button */}
      <div className="flex flex-col items-center gap-3 pt-2 pb-8">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 border-2 border-indigo-200 text-indigo-600 rounded-2xl text-sm font-semibold hover:bg-indigo-50 transition-all"
        >
          <RotateCcw size={15} />
          <span>처음부터 다시 진단하기</span>
        </button>
        <p className="text-xs text-gray-400">결과는 참고용이며 실제 비자 심사와 다를 수 있습니다.</p>
      </div>
    </div>
  );
};

/** KOR: 로딩 오버레이 / ENG: Loading overlay */
const LoadingOverlay: React.FC = () => (
  <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
    <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white shadow-2xl border border-indigo-100 max-w-xs w-full mx-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={20} className="text-indigo-500" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-gray-800 mb-1">AI 비자 분석 중...</p>
        <p className="text-xs text-gray-400">31개 비자 유형을 비교하고 있습니다</p>
      </div>
      {/* KOR: 프로그레스 점 / ENG: Progress dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ============================================================
// 메인 페이지 컴포넌트 / Main page component
// ============================================================
export default function Diagnosis11Page() {
  // KOR: 폼 입력 상태 / ENG: Form input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 현재 활성화된 섹션 / ENG: Currently active section
  const [activeSection, setActiveSection] = useState<SectionId | null>('nationality');

  // KOR: 페이지 전체 상태 / ENG: Overall page state
  const [pageState, setPageState] = useState<PageState>('form');

  // KOR: 진단 결과 / ENG: Diagnosis result
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 각 섹션의 DOM ref (스크롤용) / ENG: DOM refs for each section (for scrolling)
  const sectionRefs: Record<SectionId, React.RefObject<HTMLDivElement | null>> = {
    nationality: useRef<HTMLDivElement>(null),
    age: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
    fund: useRef<HTMLDivElement>(null),
    goal: useRef<HTMLDivElement>(null),
    priority: useRef<HTMLDivElement>(null),
  };

  // KOR: 완료된 섹션 수 계산 / ENG: Calculate completed section count
  const completedCount = SECTIONS.filter((s) => s.isComplete(input)).length;

  // KOR: 모든 필수 항목이 완료되었는지 / ENG: Whether all required fields are complete
  const isAllComplete = completedCount === SECTIONS.length;

  // KOR: 입력 업데이트 핸들러 / ENG: Input update handler
  const updateInput = <K extends keyof DiagnosisInput>(key: K, value: DiagnosisInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  // KOR: 섹션 토글 및 스크롤 / ENG: Toggle section and scroll to it
  const handleSectionToggle = (id: SectionId) => {
    setActiveSection((prev) => (prev === id ? null : id));
    setTimeout(() => {
      sectionRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // KOR: 프로그레스 바에서 섹션 클릭 / ENG: Section click from progress bar
  const handleProgressSectionClick = (id: SectionId) => {
    setActiveSection(id);
    setTimeout(() => {
      sectionRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // KOR: 입력 완료 후 다음 섹션 자동 열기 / ENG: Auto-open next section after completing current
  const handleSectionComplete = (currentId: SectionId) => {
    const currentIdx = SECTIONS.findIndex((s) => s.id === currentId);
    const nextSection = SECTIONS[currentIdx + 1];
    if (nextSection) {
      setTimeout(() => {
        setActiveSection(nextSection.id);
        sectionRefs[nextSection.id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  };

  // KOR: 진단 실행 / ENG: Run diagnosis
  const handleDiagnose = () => {
    setPageState('loading');
    // KOR: 실제 API 호출 대신 목업 데이터 사용 (2초 딜레이 시뮬레이션)
    // ENG: Using mock data instead of real API call (2-second delay simulation)
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setPageState('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  // KOR: 초기화 / ENG: Reset
  const handleReset = () => {
    setInput({});
    setResult(null);
    setPageState('form');
    setActiveSection('nationality');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* KOR: 로딩 오버레이 / ENG: Loading overlay */}
      {pageState === 'loading' && <LoadingOverlay />}

      {/* KOR: 프로그레스 인디케이터 (폼 상태에서만) / ENG: Progress indicator (form state only) */}
      {pageState === 'form' && (
        <ProgressIndicator
          sections={SECTIONS}
          completedCount={completedCount}
          activeSection={activeSection}
          onSectionClick={handleProgressSectionClick}
          input={input}
        />
      )}

      {/* KOR: 결과 상태일 때 상단 헤더 / ENG: Top header when in result state */}
      {pageState === 'result' && (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">비자 진단 결과</span>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <RotateCcw size={13} />
              <span>다시 진단</span>
            </button>
          </div>
        </div>
      )}

      {/* KOR: 페이지 헤더 (폼 상태) / ENG: Page header (form state) */}
      {pageState === 'form' && (
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-6">
          <div className="text-center mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full mb-4">
              <Sparkles size={12} className="text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-600">AI 비자 적합도 진단</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">
              나에게 맞는 비자 경로를<br />
              <span className="text-indigo-600">지금 바로 찾아보세요</span>
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              6가지 기본 정보만 입력하면 31개 비자 유형 중 최적 경로를 추천해드립니다.
              평균 소요 시간 2분.
            </p>
          </div>

          {/* KOR: 특징 배지 3개 / ENG: 3 feature badges */}
          <div className="flex justify-center gap-3 flex-wrap mt-4">
            {[
              { icon: '⚡', text: '2분 완성' },
              { icon: '🔒', text: '무료 진단' },
              { icon: '🎯', text: '31개 비자 분석' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-100 shadow-sm">
                <span className="text-sm">{badge.icon}</span>
                <span className="text-xs font-medium text-gray-600">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KOR: 메인 컨텐츠 영역 / ENG: Main content area */}
      <main className="max-w-3xl mx-auto px-4 pb-10">

        {/* ============================================================ */}
        {/* KOR: 폼 상태 — 섹션 폼 렌더링 / ENG: Form state — section form rendering */}
        {/* ============================================================ */}
        {pageState === 'form' && (
          <div className="space-y-3">

            {/* Section 1: 국적 / Nationality */}
            <FormSection
              section={SECTIONS[0]}
              isActive={activeSection === 'nationality'}
              isComplete={SECTIONS[0].isComplete(input)}
              onToggle={() => handleSectionToggle('nationality')}
              sectionRef={sectionRefs.nationality}
            >
              <NationalitySection
                value={input.nationality ?? ''}
                onChange={(v) => {
                  updateInput('nationality', v);
                  handleSectionComplete('nationality');
                }}
                isActive={activeSection === 'nationality'}
                isComplete={SECTIONS[0].isComplete(input)}
                onFocus={() => setActiveSection('nationality')}
              />
            </FormSection>

            {/* Section 2: 나이 / Age */}
            <FormSection
              section={SECTIONS[1]}
              isActive={activeSection === 'age'}
              isComplete={SECTIONS[1].isComplete(input)}
              onToggle={() => handleSectionToggle('age')}
              sectionRef={sectionRefs.age}
            >
              <AgeSection
                value={input.age ?? ''}
                onChange={(v) => {
                  updateInput('age', v);
                  handleSectionComplete('age');
                }}
                onFocus={() => setActiveSection('age')}
              />
            </FormSection>

            {/* Section 3: 학력 / Education */}
            <FormSection
              section={SECTIONS[2]}
              isActive={activeSection === 'education'}
              isComplete={SECTIONS[2].isComplete(input)}
              onToggle={() => handleSectionToggle('education')}
              sectionRef={sectionRefs.education}
            >
              <OptionGridSection
                options={educationOptions}
                value={input.educationLevel ?? ''}
                onChange={(v) => {
                  updateInput('educationLevel', v);
                  handleSectionComplete('education');
                }}
                onFocus={() => setActiveSection('education')}
                columns={2}
              />
            </FormSection>

            {/* Section 4: 가용 자금 / Available Fund */}
            <FormSection
              section={SECTIONS[3]}
              isActive={activeSection === 'fund'}
              isComplete={SECTIONS[3].isComplete(input)}
              onToggle={() => handleSectionToggle('fund')}
              sectionRef={sectionRefs.fund}
            >
              <OptionGridSection
                options={fundOptions}
                value={input.availableAnnualFund ?? ''}
                onChange={(v) => {
                  updateInput('availableAnnualFund', v);
                  handleSectionComplete('fund');
                }}
                onFocus={() => setActiveSection('fund')}
                columns={2}
              />
            </FormSection>

            {/* Section 5: 최종 목표 / Final Goal */}
            <FormSection
              section={SECTIONS[4]}
              isActive={activeSection === 'goal'}
              isComplete={SECTIONS[4].isComplete(input)}
              onToggle={() => handleSectionToggle('goal')}
              sectionRef={sectionRefs.goal}
            >
              <OptionGridSection
                options={goalOptions}
                value={input.finalGoal ?? ''}
                onChange={(v) => {
                  updateInput('finalGoal', v);
                  handleSectionComplete('goal');
                }}
                onFocus={() => setActiveSection('goal')}
                columns={1}
              />
            </FormSection>

            {/* Section 6: 우선순위 / Priority */}
            <FormSection
              section={SECTIONS[5]}
              isActive={activeSection === 'priority'}
              isComplete={SECTIONS[5].isComplete(input)}
              onToggle={() => handleSectionToggle('priority')}
              sectionRef={sectionRefs.priority}
            >
              <OptionGridSection
                options={priorityOptions}
                value={input.priorityPreference ?? ''}
                onChange={(v) => {
                  updateInput('priorityPreference', v);
                }}
                onFocus={() => setActiveSection('priority')}
                columns={2}
              />
            </FormSection>

            {/* KOR: 진단 실행 버튼 / ENG: Diagnose submit button */}
            <div className="pt-2">
              <button
                onClick={handleDiagnose}
                disabled={!isAllComplete}
                className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all
                  ${isAllComplete
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {isAllComplete ? (
                  <>
                    <Sparkles size={16} />
                    <span>AI 비자 진단 시작하기</span>
                    <ChevronRight size={16} />
                  </>
                ) : (
                  <>
                    <span>{completedCount}/{SECTIONS.length} 항목 입력 완료 후 진단 가능합니다</span>
                  </>
                )}
              </button>

              {/* KOR: 미입력 항목 안내 / ENG: Missing fields hint */}
              {!isAllComplete && completedCount > 0 && (
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <AlertCircle size={12} className="text-amber-400" />
                  <span className="text-xs text-gray-400">
                    미입력: {SECTIONS.filter((s) => !s.isComplete(input)).map((s) => s.label).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* KOR: 빠른 채우기 버튼 (개발/데모용) / ENG: Quick fill button (for dev/demo) */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setInput({
                    nationality: mockInput.nationality,
                    age: mockInput.age,
                    educationLevel: mockInput.educationLevel,
                    availableAnnualFund: mockInput.availableAnnualFund,
                    finalGoal: mockInput.finalGoal,
                    priorityPreference: mockInput.priorityPreference,
                  });
                  setActiveSection(null);
                }}
                className="text-xs text-gray-400 hover:text-indigo-500 underline underline-offset-2 transition-colors"
              >
                샘플 데이터로 빠르게 채우기 (데모)
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* KOR: 결과 상태 — 인라인 결과 패널 / ENG: Result state — inline result panel */}
        {/* ============================================================ */}
        {pageState === 'result' && result && (
          <div className="pt-6">
            <ResultPanel
              result={result}
              input={input}
              onReset={handleReset}
            />
          </div>
        )}
      </main>

      {/* KOR: 커스텀 애니메이션 인라인 스타일 / ENG: Custom animation inline styles */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
