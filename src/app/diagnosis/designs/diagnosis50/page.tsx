'use client';

// 비자 진단 페이지 — 디자인 #50: 기차 시간표 (Train Timetable)
// Visa diagnosis page — Design #50: Train Timetable
// 참고: Deutsche Bahn, SNCF, KTX 코레일 스타일
// Reference: Deutsche Bahn, SNCF, KTX Korail style
// 색상 테마: DB 레드(#EC0016) + 화이트 + 다크 그레이
// Color theme: DB Red (#EC0016) + White + Dark Gray

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
  Train,
  MapPin,
  Clock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
  Navigation,
  Repeat,
  Timer,
  Banknote,
  Users,
  Globe,
  GraduationCap,
  Target,
  Zap,
  Calendar,
  TrendingUp,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type Step = 'input' | 'result';
type InputField = keyof DiagnosisInput;

// ============================================================
// 상수 / Constants
// ============================================================

// DB 레드 색상 / DB Red brand color
const DB_RED = '#EC0016';
const DB_RED_DARK = '#C30012';
const DB_GRAY = '#282D37';
const DB_LIGHT_GRAY = '#F0F3F5';
const DB_MEDIUM_GRAY = '#646973';

// 환승 시간 계산 헬퍼 / Transfer time calculation helper
function getTransferLabel(months: number): string {
  if (months === 0) return '직행 / Direct';
  if (months <= 6) return `${months}개월 환승 / ${months}mo Transfer`;
  return `${months}개월 대기 / ${months}mo Wait`;
}

// 비자 체인을 환승역 배열로 파싱 / Parse visa chain string into station array
function parseVisaChain(chain: string): string[] {
  return chain.split(' → ').map((s) => s.trim());
}

// 점수 등급 라벨 / Score grade label
function getGradeLabel(score: number): string {
  if (score >= 71) return 'ICE';      // 최고급 / Premium high-speed
  if (score >= 51) return 'EC';       // 우수 / Excellent express
  if (score >= 31) return 'IC';       // 보통 / Intercity
  if (score >= 11) return 'RE';       // 지역 / Regional express
  return 'RB';                        // 완행 / Regional slow
}

// 등급 색상 / Grade color
function getGradeColor(score: number): string {
  if (score >= 71) return '#EC0016';   // DB 레드 / DB Red
  if (score >= 51) return '#3b82f6';   // 파랑 / Blue
  if (score >= 31) return '#f59e0b';   // 주황 / Amber
  if (score >= 11) return '#6b7280';   // 회색 / Gray
  return '#9ca3af';                    // 연회색 / Light gray
}

// 비용 포맷 / Cost formatter
function formatCost(costInManWon: number): string {
  if (costInManWon === 0) return '무료';
  if (costInManWon < 1000) return `${costInManWon}만원`;
  return `${(costInManWon / 100).toFixed(0)}백만원`;
}

// ============================================================
// 입력 섹션 컴포넌트 / Input section component
// ============================================================

interface InputSectionProps {
  formData: DiagnosisInput;
  onUpdate: (field: InputField, value: DiagnosisInput[InputField]) => void;
  onSubmit: () => void;
}

function InputSection({ formData, onUpdate, onSubmit }: InputSectionProps) {
  // 국적 검색 상태 / Nationality search state
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = popularCountries.filter(
    (c) =>
      c.nameKo.includes(searchQuery) ||
      c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 모든 필드가 채워졌는지 확인 / Check all fields are filled
  const isComplete =
    formData.nationality &&
    formData.age > 0 &&
    formData.educationLevel &&
    formData.availableAnnualFund >= 0 &&
    formData.finalGoal &&
    formData.priorityPreference;

  return (
    <div className="max-w-2xl mx-auto">
      {/* 역 안내판 스타일 헤더 / Station board style header */}
      <div
        className="rounded-t-xl p-6 text-white"
        style={{ backgroundColor: DB_RED }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Train size={28} className="shrink-0" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">비자 시간표 조회</h1>
            <p className="text-sm opacity-80">Visa Route Timetable / 비자 경로 안내</p>
          </div>
        </div>
        {/* 진행 표시줄 / Progress bar */}
        <div className="mt-4 flex gap-1">
          {['출발지', '탑승자', '목적지', '우선순위'].map((label, i) => (
            <div key={i} className="flex-1">
              <div className="h-1 rounded-full bg-white opacity-30" />
              <p className="text-xs mt-1 opacity-60 text-center">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 입력 폼 카드 / Input form card */}
      <div className="bg-white rounded-b-xl shadow-xl border border-gray-100">

        {/* 1. 출발지 — 국적 / Departure — Nationality */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ backgroundColor: DB_RED }}
            >
              1
            </div>
            <div>
              <p className="font-bold text-gray-900">출발역 / Departure Station</p>
              <p className="text-xs text-gray-500">국적을 선택하세요 / Select your nationality</p>
            </div>
            <MapPin size={16} className="ml-auto shrink-0" style={{ color: DB_RED }} />
          </div>

          {/* 검색창 / Search input */}
          <input
            type="text"
            placeholder="국가 검색 / Search country"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-red-400"
          />

          {/* 국가 그리드 / Country grid */}
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
            {filteredCountries.map((c) => (
              <button
                key={c.code}
                onClick={() => onUpdate('nationality', c.code)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-sm transition-all ${
                  formData.nationality === c.code
                    ? 'border-red-500 bg-red-50 text-red-700 font-medium'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <span className="text-base shrink-0">{c.flag}</span>
                <span className="truncate">{c.nameKo}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. 탑승자 정보 — 나이+학력 / Passenger info — Age + Education */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ backgroundColor: DB_RED }}
            >
              2
            </div>
            <div>
              <p className="font-bold text-gray-900">탑승자 정보 / Passenger Info</p>
              <p className="text-xs text-gray-500">나이와 학력을 입력하세요</p>
            </div>
            <Users size={16} className="ml-auto shrink-0" style={{ color: DB_RED }} />
          </div>

          {/* 나이 입력 / Age input */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">나이 / Age</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={18}
                max={60}
                value={formData.age || ''}
                onChange={(e) => onUpdate('age', Number(e.target.value))}
                placeholder="예: 24"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
              />
              <span className="text-sm text-gray-500 shrink-0">세 / years</span>
            </div>
          </div>

          {/* 학력 선택 / Education level */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">최종 학력 / Education Level</label>
            <div className="grid grid-cols-2 gap-2">
              {educationOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdate('educationLevel', opt.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                    formData.educationLevel === opt.value
                      ? 'border-red-500 bg-red-50 text-red-700 font-medium'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="shrink-0">{opt.emoji}</span>
                  <span className="truncate">{opt.labelKo}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. 좌석 등급 — 자금 / Seat class — Fund */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ backgroundColor: DB_RED }}
            >
              3
            </div>
            <div>
              <p className="font-bold text-gray-900">좌석 등급 / Seat Class</p>
              <p className="text-xs text-gray-500">연간 가용 자금 / Annual available fund</p>
            </div>
            <Banknote size={16} className="ml-auto shrink-0" style={{ color: DB_RED }} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {fundOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdate('availableAnnualFund', opt.value)}
                className={`px-3 py-2.5 rounded-lg border text-sm text-left transition-all ${
                  formData.availableAnnualFund === opt.value
                    ? 'border-red-500 bg-red-50 text-red-700 font-medium'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <p className="font-medium">{opt.labelKo}</p>
                <p className="text-xs opacity-60">{opt.labelEn}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 4. 목적지 — 최종 목표 / Destination — Final goal */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ backgroundColor: DB_RED }}
            >
              4
            </div>
            <div>
              <p className="font-bold text-gray-900">목적지 / Destination</p>
              <p className="text-xs text-gray-500">최종 목표를 선택하세요 / Select your final goal</p>
            </div>
            <Target size={16} className="ml-auto shrink-0" style={{ color: DB_RED }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {goalOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdate('finalGoal', opt.value)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.finalGoal === opt.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl block mb-1">{opt.emoji}</span>
                <p className={`font-bold text-sm ${formData.finalGoal === opt.value ? 'text-red-700' : 'text-gray-900'}`}>
                  {opt.labelKo}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{opt.descKo}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 5. 우선순위 — 열차 종류 / Priority — Train type */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ backgroundColor: DB_RED }}
            >
              5
            </div>
            <div>
              <p className="font-bold text-gray-900">열차 종류 / Train Type</p>
              <p className="text-xs text-gray-500">우선순위 설정 / Set your priority</p>
            </div>
            <Zap size={16} className="ml-auto shrink-0" style={{ color: DB_RED }} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {priorityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdate('priorityPreference', opt.value)}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-left transition-all ${
                  formData.priorityPreference === opt.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-xl shrink-0">{opt.emoji}</span>
                <div>
                  <p className={`font-bold text-sm ${formData.priorityPreference === opt.value ? 'text-red-700' : 'text-gray-900'}`}>
                    {opt.labelKo}
                  </p>
                  <p className="text-xs text-gray-500">{opt.descKo}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 조회 버튼 / Search button */}
        <div className="p-6">
          <button
            onClick={onSubmit}
            disabled={!isComplete}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all ${
              isComplete
                ? 'hover:opacity-90 active:scale-95'
                : 'opacity-40 cursor-not-allowed'
            }`}
            style={{ backgroundColor: isComplete ? DB_RED : '#9ca3af' }}
          >
            <Train size={20} className="shrink-0" />
            <span>시간표 조회 / Search Timetable</span>
            <ChevronRight size={20} className="shrink-0" />
          </button>

          {!isComplete && (
            <p className="text-center text-xs text-gray-400 mt-2">
              모든 항목을 입력해야 조회가 가능합니다
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 시간표 행 컴포넌트 / Timetable row component
// ============================================================

interface TimetableRowProps {
  pathway: CompatPathway;
  rank: number;
  isSelected: boolean;
  onSelect: () => void;
}

function TimetableRow({ pathway, rank, isSelected, onSelect }: TimetableRowProps) {
  const grade = getGradeLabel(pathway.finalScore);
  const gradeColor = getGradeColor(pathway.finalScore);
  const stations = (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v) => v.code);
  const isDirectRoute = stations.length === 1;

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left transition-all border-b border-gray-100 last:border-b-0 ${
        isSelected ? 'bg-red-50' : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="px-4 py-4">
        {/* 열차 번호 + 등급 / Train number + Grade */}
        <div className="flex items-center gap-3 mb-2">
          {/* 열차 등급 배지 / Train grade badge */}
          <div
            className="px-2 py-1 rounded text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: gradeColor }}
          >
            {grade}
          </div>

          {/* 경로 이름 / Route name */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 truncate text-sm">{pathway.nameKo}</p>
            <p className="text-xs text-gray-500 truncate">{pathway.nameEn}</p>
          </div>

          {/* 점수 / Score */}
          <div className="text-right shrink-0">
            <p
              className="text-lg font-bold"
              style={{ color: gradeColor }}
            >
              {pathway.finalScore}점
            </p>
            <p className="text-xs text-gray-400">적합도</p>
          </div>
        </div>

        {/* 역 경로 시각화 / Station route visualization */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-2">
          {stations.map((station, idx) => (
            <React.Fragment key={idx}>
              {/* 역 노드 / Station node */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="w-3 h-3 rounded-full border-2 mb-0.5"
                  style={{
                    borderColor: gradeColor,
                    backgroundColor: idx === 0 || idx === stations.length - 1 ? gradeColor : 'white',
                  }}
                />
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: gradeColor, fontSize: '10px' }}
                >
                  {station}
                </span>
              </div>
              {/* 연결선 / Connector line */}
              {idx < stations.length - 1 && (
                <div
                  className="flex-1 h-0.5 min-w-4"
                  style={{ backgroundColor: gradeColor, opacity: 0.4 }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 하단 정보 행 / Bottom info row */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {/* 소요 시간 / Duration */}
          <div className="flex items-center gap-1">
            <Clock size={12} className="shrink-0" />
            <span>{pathway.estimatedMonths}개월</span>
          </div>

          {/* 비용 / Cost */}
          <div className="flex items-center gap-1">
            <Banknote size={12} className="shrink-0" />
            <span>{formatCost(pathway.estimatedCostWon)}</span>
          </div>

          {/* 직행 여부 / Direct indicator */}
          <div className="flex items-center gap-1">
            <Repeat size={12} className="shrink-0" />
            <span>{isDirectRoute ? '직행' : `${stations.length - 1}회 환승`}</span>
          </div>

          {/* 실현가능성 / Feasibility */}
          <div className="ml-auto flex items-center gap-1">
            <span>{getFeasibilityEmoji(pathway.feasibilityLabel)}</span>
            <span className="font-medium">{pathway.feasibilityLabel}</span>
          </div>
        </div>
      </div>

      {/* 선택 표시 바 / Selection indicator bar */}
      {isSelected && (
        <div
          className="h-1 w-full"
          style={{ backgroundColor: DB_RED }}
        />
      )}
    </button>
  );
}

// ============================================================
// 상세 시간표 컴포넌트 / Detail timetable component
// ============================================================

interface DetailTimetableProps {
  pathway: CompatPathway;
}

function DetailTimetable({ pathway }: DetailTimetableProps) {
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);
  const grade = getGradeLabel(pathway.finalScore);
  const gradeColor = getGradeColor(pathway.finalScore);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* 상세 헤더 / Detail header */}
      <div
        className="px-4 py-3 text-white"
        style={{ backgroundColor: gradeColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white bg-opacity-20 px-2 py-0.5 rounded text-xs font-bold">
              {grade}
            </div>
            <p className="font-bold text-sm">{pathway.nameKo}</p>
          </div>
          <p className="text-lg font-bold">{pathway.finalScore}점</p>
        </div>
        <p className="text-xs opacity-70 mt-0.5">{pathway.nameEn}</p>
      </div>

      {/* 핵심 지표 그리드 / Key metric grid */}
      <div className="grid grid-cols-3 border-b border-gray-100">
        {/* 총 소요시간 / Total duration */}
        <div className="p-3 text-center border-r border-gray-100">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Timer size={12} />
            <span className="text-xs">소요기간</span>
          </div>
          <p className="font-bold text-gray-900">{pathway.estimatedMonths}개월</p>
        </div>
        {/* 총 비용 / Total cost */}
        <div className="p-3 text-center border-r border-gray-100">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Banknote size={12} />
            <span className="text-xs">예상비용</span>
          </div>
          <p className="font-bold text-gray-900">{formatCost(pathway.estimatedCostWon)}</p>
        </div>
        {/* 환승 횟수 / Transfer count */}
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Navigation size={12} />
            <span className="text-xs">비자 단계</span>
          </div>
          <p className="font-bold text-gray-900">{pathway.milestones.length}단계</p>
        </div>
      </div>

      {/* 역별 시간표 / Station-by-station timetable */}
      <div className="divide-y divide-gray-50">
        <div className="px-4 py-2 bg-gray-50 flex items-center gap-2">
          <Train size={13} style={{ color: DB_RED }} />
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
            정차역 시간표 / Station Timetable
          </p>
        </div>

        {pathway.milestones.map((milestone, idx) => {
          const isExpanded = expandedMilestone === idx;
          const isFirst = idx === 0;
          const isLast = idx === pathway.milestones.length - 1;
          const reqList = Array.isArray(milestone.requirements)
            ? milestone.requirements
            : [milestone.requirements as string];

          return (
            <div key={idx} className="relative">
              {/* 세로 연결선 / Vertical connector */}
              {!isLast && (
                <div
                  className="absolute left-8 top-10 bottom-0 w-0.5 z-0"
                  style={{ backgroundColor: gradeColor, opacity: 0.2 }}
                />
              )}

              <button
                onClick={() => setExpandedMilestone(isExpanded ? null : idx)}
                className="w-full text-left px-4 py-3 relative z-10 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* 역 아이콘 / Station icon */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 bg-white mt-0.5"
                    style={{
                      borderColor: gradeColor,
                      backgroundColor: isFirst || isLast ? gradeColor : 'white',
                    }}
                  >
                    {isFirst || isLast ? (
                      <MapPin size={14} className="text-white" />
                    ) : (
                      <span className="text-xs font-bold" style={{ color: gradeColor }}>
                        {idx}
                      </span>
                    )}
                  </div>

                  {/* 역 정보 / Station info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 text-sm">{milestone.nameKo}</p>
                      {/* 비자 배지 / Visa badge */}
                      {milestone.visaStatus && milestone.visaStatus !== 'none' && (
                        <span
                          className="px-2 py-0.5 rounded text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: gradeColor }}
                        >
                          {milestone.visaStatus}
                        </span>
                      )}
                      {/* 아르바이트 가능 / Part-time work allowed */}
                      {milestone.canWorkPartTime && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 font-medium shrink-0">
                          알바가능
                        </span>
                      )}
                    </div>
                    {/* 시간 정보 / Time info */}
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400">
                        {milestone.monthFromStart === 0 ? '출발' : `+${milestone.monthFromStart}개월`}
                      </span>
                      {milestone.canWorkPartTime && milestone.weeklyHours > 0 && (
                        <span className="text-xs text-gray-400">
                          주 {milestone.weeklyHours}시간 · 월 {milestone.estimatedMonthlyIncome}만원
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 펼치기 아이콘 / Expand icon */}
                  <div className="shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* 상세 정보 (펼쳤을 때) / Detail info (expanded) */}
              {isExpanded && (
                <div className="pl-15 pr-4 pb-3 ml-11 mr-4 bg-gray-50 rounded-lg mb-2">
                  <p className="text-xs font-bold text-gray-500 mb-2 pt-3">
                    필요 조건 / Requirements
                  </p>
                  <div className="space-y-1">
                    {reqList.filter(Boolean).map((req, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-1.5">
                        <CheckCircle size={12} className="shrink-0 mt-0.5" style={{ color: gradeColor }} />
                        <p className="text-xs text-gray-600">{req}</p>
                      </div>
                    ))}
                  </div>
                  {milestone.platformAction && milestone.platformAction !== 'info_only' && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-1">
                        <Star size={11} style={{ color: DB_RED }} />
                        <p className="text-xs font-medium" style={{ color: DB_RED }}>
                          잡차자 지원 가능 / JobChaja Support Available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 다음 단계 / Next steps */}
      {pathway.nextSteps.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="px-4 py-2 bg-gray-50 flex items-center gap-2">
            <ArrowRight size={13} style={{ color: DB_RED }} />
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
              다음 단계 / Next Steps
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {pathway.nextSteps.map((step, idx) => (
              <div key={idx} className="px-4 py-3 flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: DB_RED }}
                >
                  {idx + 1}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{step.nameKo}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 비고 / Notes */}
      {pathway.note && (
        <div className="px-4 py-3 border-t border-gray-100 bg-amber-50 flex items-start gap-2">
          <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">{pathway.note}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 결과 섹션 컴포넌트 / Result section component
// ============================================================

interface ResultSectionProps {
  input: DiagnosisInput;
  result: DiagnosisResult;
  onReset: () => void;
}

function ResultSection({ input, result, onReset }: ResultSectionProps) {
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>(
    result.pathways[0]?.pathwayId ?? ''
  );

  // 선택된 경로 / Selected pathway
  const selectedCompatPathway = mockPathways.find((p) => p.pathwayId === selectedPathwayId);

  // 입력에서 국가 정보 찾기 / Find country info from input
  const selectedCountry = popularCountries.find((c) => c.code === input.nationality);

  return (
    <div className="max-w-2xl mx-auto">
      {/* 결과 헤더 — 전광판 스타일 / Result header — departure board style */}
      <div
        className="rounded-t-xl p-4 text-white"
        style={{ backgroundColor: DB_GRAY }}
      >
        {/* 상단 바 / Top bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Train size={18} className="shrink-0" />
            <span className="font-bold text-sm">비자 경로 시간표</span>
          </div>
          <button
            onClick={onReset}
            className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-colors"
          >
            ← 다시 조회
          </button>
        </div>

        {/* 출발/도착 안내판 / Departure/arrival board */}
        <div className="bg-black bg-opacity-30 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* 출발 / Departure */}
            <div>
              <p className="text-xs opacity-50 uppercase tracking-wide mb-1">출발 / From</p>
              <p className="text-lg">{selectedCountry?.flag ?? '🌍'}</p>
              <p className="text-xs font-bold">{selectedCountry?.nameKo ?? input.nationality}</p>
            </div>
            {/* 방향 / Direction */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <ArrowRight size={20} className="mx-auto mb-1" style={{ color: DB_RED }} />
                <p className="text-xs opacity-50">{result.meta.totalPathwaysEvaluated}개 경로 분석</p>
              </div>
            </div>
            {/* 목적지 / Destination */}
            <div>
              <p className="text-xs opacity-50 uppercase tracking-wide mb-1">도착 / To</p>
              <p className="text-lg">🇰🇷</p>
              <p className="text-xs font-bold">대한민국</p>
            </div>
          </div>
        </div>

        {/* 조회 결과 요약 / Result summary */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="opacity-50">추천 경로</p>
            <p className="font-bold text-lg">{result.pathways.length}</p>
          </div>
          <div>
            <p className="opacity-50">제외 경로</p>
            <p className="font-bold text-lg">{result.meta.hardFilteredOut}</p>
          </div>
          <div>
            <p className="opacity-50">분석 시각</p>
            <p className="font-bold">방금 전</p>
          </div>
        </div>
      </div>

      {/* 열차 선택 시간표 / Train selection timetable */}
      <div className="bg-white shadow-lg">
        {/* 시간표 헤더 / Timetable header */}
        <div
          className="px-4 py-2 flex items-center gap-3 border-b"
          style={{ borderColor: DB_RED }}
        >
          <div
            className="text-xs font-bold text-white px-2 py-0.5 rounded shrink-0"
            style={{ backgroundColor: DB_RED }}
          >
            ABFAHRT
          </div>
          <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">
            출발 시간표 / Departure Board
          </p>
          <div className="ml-auto flex items-center gap-1">
            <Calendar size={12} className="text-gray-400" />
            <span className="text-xs text-gray-400">오늘 출발 기준</span>
          </div>
        </div>

        {/* 시간표 열 헤더 / Column headers */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 grid grid-cols-5 text-xs text-gray-400 font-bold uppercase tracking-wide">
          <div className="col-span-2">경로명</div>
          <div className="text-center">기간</div>
          <div className="text-center">비용</div>
          <div className="text-center">적합도</div>
        </div>

        {/* 시간표 행들 / Timetable rows */}
        <div className="divide-y divide-gray-50">
          {result.pathways.map((pathway, rank) => {
            const compatP = mockPathways.find((p) => p.pathwayId === pathway.pathwayId);
            if (!compatP) return null;
            return (
              <TimetableRow
                key={pathway.pathwayId}
                pathway={compatP}
                rank={rank + 1}
                isSelected={selectedPathwayId === pathway.pathwayId}
                onSelect={() => setSelectedPathwayId(pathway.pathwayId)}
              />
            );
          })}
        </div>
      </div>

      {/* 선택된 경로 상세 / Selected route detail */}
      {selectedCompatPathway && (
        <div className="mt-4">
          {/* 상세 섹션 레이블 / Detail section label */}
          <div className="flex items-center gap-2 mb-3 px-1">
            <div
              className="w-1 h-4 rounded-full"
              style={{ backgroundColor: DB_RED }}
            />
            <p className="text-sm font-bold text-gray-900">
              선택 경로 상세 / Route Detail
            </p>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <DetailTimetable pathway={selectedCompatPathway} />
        </div>
      )}

      {/* 점수 분석 카드 / Score analysis card */}
      {selectedCompatPathway && (
        <div className="mt-4 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <TrendingUp size={14} style={{ color: DB_RED }} />
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
              점수 분석 / Score Analysis
            </p>
          </div>

          <div className="p-4 space-y-3">
            {[
              { label: '기본 점수 / Base', value: selectedCompatPathway.scoreBreakdown.base, max: 100 },
              { label: '나이 가중치 / Age', value: Math.round(selectedCompatPathway.scoreBreakdown.ageMultiplier * 100), max: 100 },
              { label: '국적 가중치 / Nationality', value: Math.round(selectedCompatPathway.scoreBreakdown.nationalityMultiplier * 100), max: 100 },
              { label: '자금 가중치 / Fund', value: Math.round(selectedCompatPathway.scoreBreakdown.fundMultiplier * 100), max: 100 },
              { label: '학력 가중치 / Education', value: Math.round(selectedCompatPathway.scoreBreakdown.educationMultiplier * 100), max: 100 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-600">{item.label}</p>
                  <p className="text-xs font-bold text-gray-900">{item.value}점</p>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(item.value, item.max)}%`,
                      backgroundColor: getGradeColor(selectedCompatPathway.finalScore),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 안내 메시지 / Info message */}
      <div className="mt-4 bg-blue-50 rounded-xl p-4 flex items-start gap-3 border border-blue-100">
        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-900 mb-1">
            안내 / Information
          </p>
          <p className="text-xs text-blue-700 leading-relaxed">
            위 정보는 입력하신 조건을 바탕으로 한 참고용 안내입니다.
            실제 비자 심사는 출입국관리소에서 진행되며, 개인 상황에 따라 결과가 다를 수 있습니다.
            The above is for reference only based on your inputs. Actual visa decisions are made by the immigration authority.
          </p>
        </div>
      </div>

      {/* 하단 여백 / Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}

// ============================================================
// 메인 페이지 컴포넌트 / Main page component
// ============================================================

export default function Diagnosis50Page() {
  // 현재 단계 / Current step
  const [step, setStep] = useState<Step>('input');

  // 폼 데이터 / Form data (mock 기본값으로 초기화 / initialized with mock defaults)
  const [formData, setFormData] = useState<DiagnosisInput>({
    nationality: mockInput.nationality,
    age: mockInput.age,
    educationLevel: mockInput.educationLevel,
    availableAnnualFund: mockInput.availableAnnualFund,
    finalGoal: mockInput.finalGoal,
    priorityPreference: mockInput.priorityPreference,
  });

  // 진단 결과 / Diagnosis result
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // 폼 필드 업데이트 / Update form field
  const handleUpdate = (field: InputField, value: DiagnosisInput[InputField]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 폼 제출 / Submit form
  const handleSubmit = () => {
    // 목업 결과 반환 / Return mock result
    setResult(mockDiagnosisResult);
    setStep('result');
    // 페이지 상단으로 스크롤 / Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 초기화 / Reset
  const handleReset = () => {
    setStep('input');
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // 전체 페이지 래퍼 / Full page wrapper
    // DB 레드+화이트 기차 시간표 테마 / DB Red + White train timetable theme
    <div
      className="min-h-screen py-6 px-4"
      style={{ backgroundColor: DB_LIGHT_GRAY }}
    >
      {/* 상단 레일 장식 / Top rail decoration */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50"
        style={{ backgroundColor: DB_RED }}
      />

      {/* 페이지 타이틀 바 / Page title bar */}
      <div
        className="fixed top-1 left-0 right-0 z-40 py-2 px-4 flex items-center justify-between shadow-sm"
        style={{ backgroundColor: DB_GRAY }}
      >
        <div className="flex items-center gap-2">
          <div
            className="px-2 py-0.5 rounded text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: DB_RED }}
          >
            DB
          </div>
          <span className="text-white text-sm font-bold">JobChaja Visa Timetable</span>
        </div>
        <div className="flex items-center gap-1">
          <Globe size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400">KOR / ENG</span>
        </div>
      </div>

      {/* 상단 여백 (고정 바 높이 보정) / Top margin for fixed bar */}
      <div className="h-10 mb-4" />

      {/* 메인 콘텐츠 / Main content */}
      {step === 'input' && (
        <InputSection
          formData={formData}
          onUpdate={handleUpdate}
          onSubmit={handleSubmit}
        />
      )}

      {step === 'result' && result && (
        <ResultSection
          input={formData}
          result={result}
          onReset={handleReset}
        />
      )}

      {/* 하단 푸터 / Bottom footer */}
      <div className="max-w-2xl mx-auto mt-6 text-center">
        <p className="text-xs text-gray-400">
          Design #50 — 기차 시간표 / Train Timetable · JobChaja 비자 진단
        </p>
        <p className="text-xs text-gray-300 mt-1">
          Inspired by Deutsche Bahn · SNCF · KTX Korail
        </p>
      </div>
    </div>
  );
}
