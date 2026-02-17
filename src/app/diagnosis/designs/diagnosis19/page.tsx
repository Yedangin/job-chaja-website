'use client';

// 캘린더 기반 비자 진단 페이지 / Calendar-based visa diagnosis page
// 디자인 #19: 입국 날짜부터 역산하는 캘린더 중심 UI
// Design #19: Calendar-centric UI reverse-calculating from entry date
// References: Google Calendar, Calendly, Cal.com, Fantastical, Cron
// Color theme: White + Google Blue (#1a73e8)

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
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Target,
  Zap,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Globe,
  Bell,
  ArrowRight,
  Star,
  Info,
  AlertCircle,
  X,
} from 'lucide-react';

// ============================================================
// 상수 정의 / Constant definitions
// ============================================================

// 입력 단계 레이블 / Input step labels (6 steps)
const STEP_LABELS = ['국적 선택', '나이 입력', '학력 선택', '자금 규모', '목표 설정', '우선순위'];

// 현재 날짜 기준 / Based on current date
const NOW = new Date();
const CURRENT_YEAR = NOW.getFullYear();
const CURRENT_MONTH = NOW.getMonth(); // 0-indexed

// 한국어 월 이름 / Korean month names
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

// 한국어 요일 이름 / Korean day-of-week names
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

// 마일스톤 타입별 캘린더 이벤트 색상 / Calendar event colors by milestone type
const MILESTONE_COLORS: Record<string, string> = {
  entry: '#1a73e8',          // 구글 블루 / Google blue — 입국
  part_time_unlock: '#34a853', // 구글 그린 / Google green — 알바 허가
  study_upgrade: '#fbbc04',   // 구글 옐로 / Google yellow — 학교 승급
  part_time_expand: '#34a853',
  graduation: '#ea4335',      // 구글 레드 / Google red — 졸업
  final_goal: '#1a73e8',      // 블루 / Blue — 최종 목표 달성
  waiting: '#9aa0a6',         // 회색 / Gray — 대기
  application: '#1a73e8',
};

// ============================================================
// 로컬 타입 / Local types
// ============================================================

// 캘린더에 표시할 비자 이벤트 / Visa event for calendar display
interface CalendarEvent {
  year: number;
  month: number; // 0-indexed
  day: number;
  label: string;
  visaStatus: string;
  type: string;
  color: string;
}

// ============================================================
// 유틸리티 함수 / Utility functions
// ============================================================

// 경로 마일스톤 → 캘린더 이벤트 변환 / Convert pathway milestones to calendar events
function buildCalendarEvents(
  pathway: RecommendedPathway,
  startYear: number,
  startMonth: number,
): CalendarEvent[] {
  return pathway.milestones.map((m) => {
    const total = startMonth + m.monthFromStart;
    return {
      year: startYear + Math.floor(total / 12),
      month: total % 12,
      day: 1,
      label: m.nameKo,
      visaStatus: m.visaStatus,
      type: m.type,
      color: MILESTONE_COLORS[m.type] ?? '#1a73e8',
    };
  });
}

// 만원 단위 비용 포맷 / Format cost in KRW 만원
function formatCostWon(costInManWon: number): string {
  if (costInManWon === 0) return '무료';
  if (costInManWon >= 10000) return `${(costInManWon / 10000).toFixed(1)}억원`;
  return `${costInManWon.toLocaleString()}만원`;
}

// 월 앞/뒤 이동 헬퍼 / Month navigation helper — returns [year, month]
function shiftMonth(year: number, month: number, delta: number): [number, number] {
  const total = month + delta;
  const newMonth = ((total % 12) + 12) % 12;
  const newYear = year + Math.floor(total / 12);
  return [newYear, newMonth];
}

// ============================================================
// 미니 캘린더 컴포넌트 / Mini Calendar component
// Google Calendar 스타일 / Google Calendar style
// ============================================================

interface MiniCalendarProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  onPrev: () => void;
  onNext: () => void;
}

function MiniCalendar({ year, month, events, onPrev, onNext }: MiniCalendarProps) {
  // 이 달 이벤트만 필터 / Filter events for this month
  const monthEvents = events.filter((e) => e.year === year && e.month === month);
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=일
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 빈 셀 + 날짜 셀 배열 생성 / Build cell array: empty prefix + dates
  const cells: (number | null)[] = [
    ...Array<null>(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* 상단 헤더 / Top header — 구글 블루 / Google blue */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a73e8] text-white">
        <button
          onClick={onPrev}
          aria-label="이전 달 / Previous month"
          className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-center">
          <p className="font-semibold text-sm">{year}년 {MONTH_NAMES[month]}</p>
        </div>
        <button
          onClick={onNext}
          aria-label="다음 달 / Next month"
          className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 요일 헤더 행 / Day-of-week header row */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs py-2 font-semibold ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 / Date grid */}
      <div className="grid grid-cols-7 p-2 gap-0.5">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} className="h-9" />;
          const dayEvents = monthEvents.filter((e) => e.day === day);
          const isToday = year === CURRENT_YEAR && month === CURRENT_MONTH && day === NOW.getDate();
          return (
            <div
              key={day}
              className={`h-9 flex flex-col items-center justify-start pt-1 rounded-lg cursor-default transition-colors ${
                isToday ? 'bg-[#1a73e8]' : 'hover:bg-gray-50'
              }`}
            >
              <span className={`text-xs leading-none ${isToday ? 'text-white font-bold' : 'text-gray-700'}`}>
                {day}
              </span>
              {/* 이벤트 점 / Event dots */}
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {dayEvents.slice(0, 3).map((e, j) => (
                    <div
                      key={j}
                      className="w-1 h-1 rounded-full shrink-0"
                      style={{ backgroundColor: isToday ? 'white' : e.color }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 이달 이벤트 요약 / Monthly event summary */}
      {monthEvents.length > 0 && (
        <div className="border-t border-gray-100 px-3 py-2 space-y-1.5">
          {monthEvents.map((e, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: e.color }} />
              <span className="text-xs text-gray-700 truncate flex-1">{e.label}</span>
              {e.visaStatus && e.visaStatus !== 'none' && (
                <span className="text-xs font-bold text-[#1a73e8] shrink-0">{e.visaStatus}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 경로 카드 컴포넌트 / Pathway Card component
// Calendly 이벤트 카드 스타일 / Calendly event card style
// ============================================================

interface PathwayCardProps {
  pathway: RecommendedPathway;
  isSelected: boolean;
  onClick: () => void;
  entryDate: Date;
}

function PathwayCard({ pathway, isSelected, onClick, entryDate }: PathwayCardProps) {
  const [expanded, setExpanded] = useState(false);

  // 점수 색상 및 가능성 이모지 / Score color and feasibility emoji
  const scoreColor = getScoreColor(pathway.finalScore);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  // 완료 예상 날짜 / Estimated completion date
  const completionDate = new Date(entryDate);
  completionDate.setMonth(completionDate.getMonth() + pathway.estimatedMonths);
  const completionStr = `${completionDate.getFullYear()}.${String(completionDate.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border-2 transition-all cursor-pointer bg-white overflow-hidden ${
        isSelected
          ? 'border-[#1a73e8] shadow-lg shadow-blue-100'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
      }`}
    >
      {/* 카드 상단부 / Card top section */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* 경로명 + 선택 배지 / Pathway name + selected badge */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{pathway.nameKo}</span>
            {isSelected && (
              <span className="shrink-0 px-2 py-0.5 bg-[#1a73e8] text-white text-xs rounded-full font-semibold">
                선택됨
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-2">{pathway.nameEn}</p>
          {/* 비자 체인 칩 / Visa chain chips */}
          <div className="flex flex-wrap items-center gap-1">
            {pathway.visaChain.split(' → ').map((v, i, arr) => (
              <React.Fragment key={i}>
                <span className="px-2 py-0.5 bg-blue-50 text-[#1a73e8] text-xs rounded-md font-semibold border border-blue-100">
                  {v}
                </span>
                {i < arr.length - 1 && <ArrowRight size={10} className="text-gray-400 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 점수 원 / Score circle */}
        <div className="shrink-0 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-sm"
            style={{ backgroundColor: scoreColor }}
          >
            {pathway.finalScore}
          </div>
          <p className="text-xs text-gray-500 mt-1 leading-none">{emoji} {pathway.feasibilityLabel}</p>
        </div>
      </div>

      {/* 일정 요약 3칸 / Schedule summary 3 cells */}
      <div className="px-4 pb-3 grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-blue-50 rounded-xl">
          <Calendar size={13} className="mx-auto text-[#1a73e8] mb-1" />
          <p className="text-xs font-bold text-gray-800">{pathway.estimatedMonths}개월</p>
          <p className="text-xs text-gray-400">소요</p>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-xl">
          <DollarSign size={13} className="mx-auto text-green-600 mb-1" />
          <p className="text-xs font-bold text-gray-800">{formatCostWon(pathway.estimatedCostWon)}</p>
          <p className="text-xs text-gray-400">비용</p>
        </div>
        <div className="text-center p-2 bg-amber-50 rounded-xl">
          <Target size={13} className="mx-auto text-amber-600 mb-1" />
          <p className="text-xs font-bold text-gray-800">{completionStr}</p>
          <p className="text-xs text-gray-400">완료 예상</p>
        </div>
      </div>

      {/* 토글 버튼 / Toggle button */}
      <button
        onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs text-gray-400 hover:text-[#1a73e8] border-t border-gray-100 hover:bg-blue-50/30 transition-colors"
      >
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {expanded ? '마일스톤 접기' : `마일스톤 보기 (${pathway.milestones.length}개)`}
      </button>

      {/* 마일스톤 타임라인 / Milestone timeline */}
      {expanded && (
        <div className="px-4 pb-4 pt-1">
          <div className="space-y-2 mb-3">
            {pathway.milestones.map((m, i) => {
              // 이 마일스톤의 절대 날짜 / Absolute date for this milestone
              const d = new Date(entryDate);
              d.setMonth(d.getMonth() + m.monthFromStart);
              const dStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
              const dotColor = m.visaStatus && m.visaStatus !== 'none' ? '#1a73e8' : '#9ca3af';

              return (
                <div key={i} className="flex gap-3 items-start">
                  {/* 타임라인 점 + 선 / Timeline dot + connector */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: dotColor }}
                    >
                      {m.order}
                    </div>
                    {i < pathway.milestones.length - 1 && (
                      <div className="w-px h-5 bg-gray-200 mt-0.5" />
                    )}
                  </div>

                  {/* 마일스톤 내용 / Milestone content */}
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-semibold text-gray-800">{m.nameKo}</p>
                      {m.visaStatus && m.visaStatus !== 'none' && (
                        <span className="text-xs text-[#1a73e8] font-bold">{m.visaStatus}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{dStr} · {m.monthFromStart}개월 후</p>
                    {m.canWorkPartTime && (
                      <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                        <CheckCircle size={10} />주 {m.weeklyHours}h 알바 가능 · 월 {m.estimatedMonthlyIncome}만원
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 다음 단계 액션 / Next step actions */}
          {pathway.nextSteps.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-xs font-bold text-[#1a73e8] mb-2 flex items-center gap-1">
                <Zap size={12} />지금 해야 할 일
              </p>
              {pathway.nextSteps.map((ns, i) => (
                <div key={i} className="flex items-start gap-2 mb-1 last:mb-0">
                  <ArrowRight size={11} className="text-[#1a73e8] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{ns.nameKo}</p>
                    <p className="text-xs text-gray-500">{ns.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 비고 / Note */}
          {pathway.note && (
            <p className="text-xs text-gray-400 mt-2 flex items-start gap-1">
              <Info size={11} className="shrink-0 mt-0.5" />{pathway.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 메인 컴포넌트 / Main Component — Diagnosis19Page
// ============================================================
export default function Diagnosis19Page() {
  // ── 입력/단계 상태 / Input and step state ─────────────────────────────
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);

  // ── 캘린더 상태 / Calendar state ─────────────────────────────────────
  // 입국 예정일 (사용자 선택) / User-selected planned entry month
  const [entryYear, setEntryYear] = useState(CURRENT_YEAR);
  const [entryMonth, setEntryMonth] = useState(CURRENT_MONTH);
  // 캘린더 뷰 위치 / Calendar view position
  const [calYear, setCalYear] = useState(CURRENT_YEAR);
  const [calMonth, setCalMonth] = useState(CURRENT_MONTH);
  // 입국 월 선택 픽커 열림 여부 / Entry date picker visibility
  const [showPicker, setShowPicker] = useState(false);

  // 선택된 경로 / Selected pathway object
  const selectedPathway = result?.pathways.find((p) => p.pathwayId === selectedPathwayId) ?? null;

  // 입국 날짜 Date 객체 / Entry Date object
  const entryDate = new Date(entryYear, entryMonth, 1);

  // 캘린더 이벤트 (선택 경로 기준) / Calendar events from selected pathway
  const calEvents: CalendarEvent[] = selectedPathway
    ? buildCalendarEvents(selectedPathway, entryYear, entryMonth)
    : [];

  // ── 진단 실행 / Run diagnosis ──────────────────────────────────────────
  const handleDiagnose = () => {
    setIsAnalyzing(true);
    // 목업 데이터 딜레이 표시 / Show mock result after delay
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setSelectedPathwayId(mockDiagnosisResult.pathways[0].pathwayId);
      setIsAnalyzing(false);
      setStep(6);
    }, 1200);
  };

  // ── 스텝 이동 / Step navigation ───────────────────────────────────────
  const handleNext = () => (step < 5 ? setStep(step + 1) : handleDiagnose());
  const handlePrev = () => step > 0 && setStep(step - 1);

  // ── 캘린더 월 이동 / Calendar month navigation ─────────────────────────
  const handleCalPrev = () => { const [y, m] = shiftMonth(calYear, calMonth, -1); setCalYear(y); setCalMonth(m); };
  const handleCalNext = () => { const [y, m] = shiftMonth(calYear, calMonth, 1); setCalYear(y); setCalMonth(m); };

  // ── 입력 유효성 / Input validity per step ─────────────────────────────
  const isValid = (): boolean => {
    switch (step) {
      case 0: return !!input.nationality;
      case 1: return typeof input.age === 'number' && input.age >= 15 && input.age <= 60;
      case 2: return !!input.educationLevel;
      case 3: return typeof input.availableAnnualFund === 'number';
      case 4: return !!input.finalGoal;
      case 5: return !!input.priorityPreference;
      default: return true;
    }
  };

  // ── 경로 선택 핸들러 / Pathway select handler ─────────────────────────
  const handleSelectPathway = (pw: RecommendedPathway) => {
    setSelectedPathwayId(pw.pathwayId);
    // 첫 마일스톤 달로 캘린더 이동 / Jump calendar to first milestone month
    const evs = buildCalendarEvents(pw, entryYear, entryMonth);
    if (evs.length > 0) { setCalYear(evs[0].year); setCalMonth(evs[0].month); }
  };

  // ============================================================
  // 스텝별 입력 UI / Per-step input UI
  // ============================================================
  const renderStepContent = () => {
    switch (step) {
      // ── Step 0: 국적 / Nationality ────────────────────────
      case 0:
        return (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">어느 나라에서 오셨나요?</h2>
            <p className="text-sm text-gray-500 mb-4">Where are you from?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {popularCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setInput((p) => ({ ...p, nationality: c.code }))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm transition-all ${
                    input.nationality === c.code
                      ? 'border-[#1a73e8] bg-blue-50 text-[#1a73e8] font-semibold'
                      : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/30'
                  }`}
                >
                  <span className="text-xl">{c.flag}</span>
                  <span className="truncate">{c.nameKo}</span>
                  {input.nationality === c.code && <CheckCircle size={14} className="ml-auto shrink-0 text-[#1a73e8]" />}
                </button>
              ))}
            </div>
          </div>
        );

      // ── Step 1: 나이 / Age ────────────────────────────────
      case 1:
        return (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">나이를 알려주세요</h2>
            <p className="text-sm text-gray-500 mb-8">How old are you?</p>
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => setInput((p) => ({ ...p, age: Math.max(15, (p.age ?? 20) - 1) }))}
                className="w-14 h-14 rounded-full bg-[#1a73e8] text-white text-3xl font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center shadow-md"
              >
                −
              </button>
              <div className="text-center w-28">
                <span className="text-6xl font-black text-gray-900 tabular-nums">{input.age ?? 20}</span>
                <p className="text-sm text-gray-500 mt-2">세 / years old</p>
              </div>
              <button
                onClick={() => setInput((p) => ({ ...p, age: Math.min(60, (p.age ?? 20) + 1) }))}
                className="w-14 h-14 rounded-full bg-[#1a73e8] text-white text-3xl font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center shadow-md"
              >
                +
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-6">15 ~ 60세 입력 가능</p>
          </div>
        );

      // ── Step 2: 학력 / Education ──────────────────────────
      case 2:
        return (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">최종 학력을 선택해주세요</h2>
            <p className="text-sm text-gray-500 mb-4">What is your highest education level?</p>
            <div className="space-y-2">
              {educationOptions.map((e) => (
                <button
                  key={e.value}
                  onClick={() => setInput((p) => ({ ...p, educationLevel: e.value }))}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                    input.educationLevel === e.value
                      ? 'border-[#1a73e8] bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/20'
                  }`}
                >
                  <span className="text-xl w-7 text-center">{e.emoji}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${input.educationLevel === e.value ? 'text-[#1a73e8]' : 'text-gray-800'}`}>
                      {e.labelKo}
                    </p>
                    <p className="text-xs text-gray-400">{e.labelEn}</p>
                  </div>
                  {input.educationLevel === e.value && <CheckCircle size={18} className="text-[#1a73e8] shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        );

      // ── Step 3: 자금 / Fund ───────────────────────────────
      case 3:
        return (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">연간 사용 가능한 자금은?</h2>
            <p className="text-sm text-gray-500 mb-4">What is your available annual budget?</p>
            <div className="space-y-2">
              {fundOptions.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setInput((p) => ({ ...p, availableAnnualFund: f.value }))}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                    input.availableAnnualFund === f.value
                      ? 'border-[#1a73e8] bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/20'
                  }`}
                >
                  <DollarSign size={18} className={input.availableAnnualFund === f.value ? 'text-[#1a73e8]' : 'text-gray-400'} />
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${input.availableAnnualFund === f.value ? 'text-[#1a73e8]' : 'text-gray-800'}`}>
                      {f.labelKo}
                    </p>
                    <p className="text-xs text-gray-400">{f.labelEn}</p>
                  </div>
                  {input.availableAnnualFund === f.value && <CheckCircle size={18} className="text-[#1a73e8] shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        );

      // ── Step 4: 목표 / Goal ───────────────────────────────
      case 4:
        return (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">한국에서의 최종 목표는?</h2>
            <p className="text-sm text-gray-500 mb-4">What is your final goal in Korea?</p>
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setInput((p) => ({ ...p, finalGoal: g.value }))}
                  className={`flex flex-col items-center gap-2 px-3 py-5 rounded-2xl border-2 transition-all ${
                    input.finalGoal === g.value
                      ? 'border-[#1a73e8] bg-blue-50 shadow-md shadow-blue-100'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/20'
                  }`}
                >
                  <span className="text-3xl">{g.emoji}</span>
                  <p className={`text-sm font-bold ${input.finalGoal === g.value ? 'text-[#1a73e8]' : 'text-gray-800'}`}>
                    {g.labelKo}
                  </p>
                  <p className="text-xs text-gray-500 text-center leading-tight">{g.descKo}</p>
                </button>
              ))}
            </div>
          </div>
        );

      // ── Step 5: 우선순위 / Priority ───────────────────────
      case 5:
        return (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">가장 중요한 것은?</h2>
            <p className="text-sm text-gray-500 mb-4">What matters most to you?</p>
            <div className="space-y-2">
              {priorityOptions.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setInput((prev) => ({ ...prev, priorityPreference: p.value }))}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 text-left transition-all ${
                    input.priorityPreference === p.value
                      ? 'border-[#1a73e8] bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/20'
                  }`}
                >
                  <span className="text-2xl w-8 text-center">{p.emoji}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${input.priorityPreference === p.value ? 'text-[#1a73e8]' : 'text-gray-800'}`}>
                      {p.labelKo}
                    </p>
                    <p className="text-xs text-gray-400">{p.descKo}</p>
                  </div>
                  {input.priorityPreference === p.value && <Zap size={18} className="text-[#1a73e8] shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================
  // 분석 중 화면 / Analyzing loading screen
  // ============================================================
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-20 h-20 rounded-2xl bg-[#1a73e8] flex items-center justify-center animate-pulse shadow-xl shadow-blue-200">
          <Calendar size={38} className="text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">비자 일정을 계산 중...</h2>
          <p className="text-sm text-gray-500">입력하신 조건으로 최적 경로를 분석합니다</p>
          <p className="text-xs text-gray-400 mt-1">Analyzing your visa schedule...</p>
        </div>
        <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#1a73e8] rounded-full animate-[ld_1.2s_ease-in-out_forwards]" />
        </div>
        <style>{`@keyframes ld { from { width: 0 } to { width: 100% } }`}</style>
      </div>
    );
  }

  // ============================================================
  // 결과 화면 / Result screen — Calendar-centric layout
  // ============================================================
  if (step === 6 && result) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 결과 헤더 / Result header */}
        <div className="bg-[#1a73e8] text-white px-4 pt-10 pb-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={20} />
              <h1 className="text-lg font-bold">비자 일정 플래너</h1>
              <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
                <Globe size={12} />Asia/Seoul (KST, UTC+9)
              </span>
            </div>
            <p className="text-sm text-blue-100 mb-4">
              총 {result.meta.totalPathwaysEvaluated}개 경로 평가 · {result.meta.hardFilteredOut}개 필터 제외 ·{' '}
              <span className="font-semibold">{result.pathways.length}개 추천 경로</span>
            </p>
            {/* 입국 예정일 선택기 / Entry month picker */}
            <div className="relative">
              <button
                onClick={() => setShowPicker((v) => !v)}
                className="flex items-center gap-2 bg-white text-[#1a73e8] rounded-xl px-4 py-2.5 font-semibold text-sm hover:bg-blue-50 transition-colors shadow-sm"
              >
                <Calendar size={15} />
                입국 예정: {entryYear}년 {MONTH_NAMES[entryMonth]}
                <ChevronDown size={13} className="ml-1 text-gray-400" />
              </button>
              {/* 월 선택 드롭다운 / Month picker dropdown */}
              {showPicker && (
                <div className="absolute left-0 top-12 z-50 bg-white rounded-2xl shadow-2xl p-4 w-64 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => { const [y,m] = shiftMonth(entryYear, entryMonth, -1); setEntryYear(y); setEntryMonth(m); }} className="p-1 hover:bg-gray-100 rounded-lg"><ChevronLeft size={15} className="text-gray-600" /></button>
                    <span className="font-bold text-gray-800 text-sm">{entryYear}년</span>
                    <button onClick={() => { const [y,m] = shiftMonth(entryYear, entryMonth, 1); setEntryYear(y); setEntryMonth(m); }} className="p-1 hover:bg-gray-100 rounded-lg"><ChevronRight size={15} className="text-gray-600" /></button>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {MONTH_NAMES.map((mn, idx) => (
                      <button key={idx} onClick={() => { setEntryMonth(idx); setShowPicker(false); }}
                        className={`py-2 text-xs rounded-lg transition-all ${entryMonth === idx ? 'bg-[#1a73e8] text-white font-bold' : 'hover:bg-blue-50 text-gray-700'}`}>
                        {mn}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 본문 / Main body */}
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* 캘린더 위젯 / Calendar widget */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-gray-700">
                비자 일정 캘린더
                {selectedPathway && (
                  <span className="ml-2 text-xs text-[#1a73e8] font-normal">— {selectedPathway.nameKo}</span>
                )}
              </h2>
              {calEvents.length === 0 && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Info size={11} />경로를 선택하면 일정이 표시됩니다
                </span>
              )}
            </div>
            <MiniCalendar year={calYear} month={calMonth} events={calEvents} onPrev={handleCalPrev} onNext={handleCalNext} />
          </div>

          {/* 전체 비자 일정 타임라인 / All visa events timeline */}
          {calEvents.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Bell size={14} className="text-[#1a73e8]" />전체 비자 일정
              </h3>
              <div className="space-y-1">
                {calEvents.map((e, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    onClick={() => { setCalYear(e.year); setCalMonth(e.month); }}
                  >
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: e.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{e.label}</p>
                      <p className="text-xs text-gray-400">
                        {e.year}년 {MONTH_NAMES[e.month]}
                        {e.visaStatus && e.visaStatus !== 'none' && (
                          <span className="ml-1 text-[#1a73e8] font-bold">{e.visaStatus}</span>
                        )}
                      </p>
                    </div>
                    <MapPin size={11} className="text-gray-300 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 추천 경로 카드 목록 / Recommended pathway cards */}
          <div>
            <h2 className="text-sm font-bold text-gray-700 mb-3">추천 경로 ({result.pathways.length}개)</h2>
            <div className="space-y-3">
              {result.pathways.map((pw) => (
                <PathwayCard
                  key={pw.pathwayId}
                  pathway={pw}
                  isSelected={selectedPathwayId === pw.pathwayId}
                  onClick={() => handleSelectPathway(pw)}
                  entryDate={entryDate}
                />
              ))}
            </div>
          </div>

          {/* 면책 고지 / Disclaimer */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
            <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              이 결과는 입력된 정보를 기반으로 한 참고 자료입니다. 실제 비자 심사 결과는 출입국·외국인정책본부 기준에 따라 달라질 수 있습니다.
              This result is for reference only. Actual visa decisions are made by the Korea Immigration Service.
            </p>
          </div>

          {/* 다시 진단 버튼 / Redo button */}
          <button
            onClick={() => { setStep(0); setResult(null); setInput({}); setSelectedPathwayId(null); }}
            className="w-full py-3 rounded-xl border-2 border-[#1a73e8] text-[#1a73e8] font-semibold text-sm hover:bg-blue-50 transition-colors"
          >
            다시 진단하기 / Re-diagnose
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // 입력 화면 / Input screen — Step 0~5
  // ============================================================
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 + 진행 바 / Top header + progress bar */}
      <div className="bg-[#1a73e8] text-white px-4 pt-10 pb-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={22} />
            <h1 className="text-base font-bold">잡차자 비자 진단</h1>
            <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">Design #19</span>
          </div>
          {/* 단계 진행 바 / Step progress bar */}
          <div className="flex items-center gap-1 mb-2">
            {STEP_LABELS.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
          <p className="text-xs text-blue-100">
            {step + 1} / {STEP_LABELS.length} — {STEP_LABELS[step]}
          </p>
        </div>
      </div>

      {/* 입력 폼 영역 / Input form area */}
      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full overflow-y-auto">
        {renderStepContent()}
      </div>

      {/* 하단 고정 버튼 / Sticky bottom buttons */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 max-w-md mx-auto w-full">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />이전
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!isValid()}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              isValid()
                ? 'bg-[#1a73e8] text-white hover:bg-blue-700 shadow-md shadow-blue-200 active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {step === 5 ? (
              <><Calendar size={16} />일정 분석 시작</>
            ) : (
              <>다음<ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
