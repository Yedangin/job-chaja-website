'use client';

// 진단 페이지 #44 — 지하철 노선도 컨셉 / Diagnosis page #44 — Subway Map concept
// 비자 경로를 지하철 노선도처럼 시각화 / Visualize visa pathways like a subway map

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
  Navigation,
  Clock,
  DollarSign,
  Star,
  ChevronRight,
  ArrowRight,
  Circle,
  Info,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Train,
  Zap,
  Globe,
  BookOpen,
  Briefcase,
  Home,
} from 'lucide-react';

// ============================================================
// 노선 색상 팔레트 / Line color palette
// 각 경로에 고유 노선 색상 부여 / Assign unique line color per pathway
// ============================================================
const LINE_COLORS: string[] = [
  '#2563EB', // 파랑 / Blue (1호선 스타일)
  '#16A34A', // 초록 / Green (2호선 스타일)
  '#D97706', // 주황 / Orange (3호선 스타일)
  '#7C3AED', // 보라 / Purple (5호선 스타일)
  '#DB2777', // 분홍 / Pink (6호선 스타일)
];

// ============================================================
// 역 타입별 아이콘 / Station type icons
// ============================================================
function getStationIcon(type: string): React.ReactNode {
  switch (type) {
    case 'entry':
      return <Train size={12} className="text-white" />;
    case 'part_time_unlock':
    case 'part_time_expand':
      return <Briefcase size={12} className="text-white" />;
    case 'study_upgrade':
      return <BookOpen size={12} className="text-white" />;
    case 'graduation':
      return <Star size={12} className="text-white" />;
    case 'final_goal':
      return <CheckCircle size={12} className="text-white" />;
    case 'waiting':
      return <Clock size={12} className="text-white" />;
    default:
      return <Circle size={12} className="text-white" />;
  }
}

// ============================================================
// 입력 단계 정의 / Input step definitions
// ============================================================
type InputStep = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

const INPUT_STEPS: InputStep[] = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
];

const STEP_LABELS: Record<InputStep, { ko: string; en: string; icon: React.ReactNode }> = {
  nationality: { ko: '출발국', en: 'Origin', icon: <Globe size={16} /> },
  age: { ko: '나이', en: 'Age', icon: <Train size={16} /> },
  educationLevel: { ko: '학력', en: 'Education', icon: <BookOpen size={16} /> },
  availableAnnualFund: { ko: '자금', en: 'Budget', icon: <DollarSign size={16} /> },
  finalGoal: { ko: '목표역', en: 'Destination', icon: <MapPin size={16} /> },
  priorityPreference: { ko: '노선', en: 'Route', icon: <Navigation size={16} /> },
};

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function Diagnosis44Page() {
  // 현재 입력 단계 / Current input step index
  const [currentStep, setCurrentStep] = useState<number>(0);
  // 진단 입력값 / Diagnosis input values
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // 결과 표시 여부 / Whether to show results
  const [showResult, setShowResult] = useState<boolean>(false);
  // 선택된 경로 인덱스 / Selected pathway index
  const [selectedPathway, setSelectedPathway] = useState<number>(0);
  // 결과 데이터 / Result data
  const [result] = useState<DiagnosisResult>(mockDiagnosisResult);

  // 현재 단계 / Current step key
  const currentStepKey = INPUT_STEPS[currentStep];

  // 다음 단계로 이동 / Move to next step
  const handleNext = (value: string | number) => {
    const updated = { ...input, [currentStepKey]: value };
    setInput(updated);
    if (currentStep < INPUT_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 마지막 단계 완료 → 결과 표시 / Last step done → show results
      setShowResult(true);
    }
  };

  // 처음으로 재시작 / Restart from beginning
  const handleRestart = () => {
    setCurrentStep(0);
    setInput({});
    setShowResult(false);
    setSelectedPathway(0);
  };

  // 선택된 경로 데이터 / Selected pathway data
  const activePathway: RecommendedPathway = result.pathways[selectedPathway];
  const activeCompat: CompatPathway = mockPathways[selectedPathway];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ======================================================
          헤더 / Header — 지하철 노선도 스타일 상단 바
          ====================================================== */}
      <header className="bg-[#1a1a2e] text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Train size={22} className="text-yellow-400" />
          <span className="font-bold text-lg tracking-tight">잡차자 비자노선</span>
          <span className="text-xs text-gray-400 hidden sm:inline">Visa Subway Map</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-300">
          <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full font-bold">LIVE</span>
          <span>노선도 진단 v1</span>
        </div>
      </header>

      {!showResult ? (
        /* ====================================================
           입력 화면 / Input screen
           역 선택 UI — 출발역에서 도착역까지 / Station selection UI
           ==================================================== */
        <div className="max-w-lg mx-auto px-4 py-8">
          {/* 노선도 진행 표시 / Line progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500 font-medium">
                {currentStep + 1} / {INPUT_STEPS.length} 역 통과 중
                <span className="text-gray-400 ml-1">· Station {currentStep + 1} of {INPUT_STEPS.length}</span>
              </div>
              <div className="text-xs text-gray-400">
                {Math.round(((currentStep) / INPUT_STEPS.length) * 100)}% 완료
              </div>
            </div>
            {/* 노선 트랙 / Line track */}
            <div className="relative flex items-center gap-0">
              {INPUT_STEPS.map((step, i) => {
                const isDone = i < currentStep;
                const isCurrent = i === currentStep;
                const color = LINE_COLORS[0];
                return (
                  <React.Fragment key={step}>
                    {/* 역 노드 / Station node */}
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                        style={{
                          backgroundColor: isDone ? color : isCurrent ? color : '#e5e7eb',
                          borderColor: isDone || isCurrent ? color : '#d1d5db',
                          boxShadow: isCurrent ? `0 0 0 4px ${color}33` : 'none',
                        }}
                      >
                        {isDone ? (
                          <CheckCircle size={14} className="text-white" />
                        ) : (
                          <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-white' : 'bg-gray-300'}`} />
                        )}
                      </div>
                      <span className="text-[10px] mt-1 text-gray-500 text-center w-10 leading-tight">
                        {STEP_LABELS[step].ko}
                      </span>
                    </div>
                    {/* 선로 / Track line */}
                    {i < INPUT_STEPS.length - 1 && (
                      <div
                        className="flex-1 h-1 mx-0.5 transition-all duration-300"
                        style={{ backgroundColor: i < currentStep ? color : '#e5e7eb' }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* 현재 역 입력 카드 / Current station input card */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
            {/* 역 안내판 / Station signboard */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-bold mb-4"
              style={{ backgroundColor: LINE_COLORS[0] }}
            >
              {STEP_LABELS[currentStepKey].icon}
              <span>현재 역: {STEP_LABELS[currentStepKey].ko}</span>
              <span className="opacity-70">/ {STEP_LABELS[currentStepKey].en}</span>
            </div>

            {/* 단계별 입력 UI / Step-specific input UI */}
            {currentStepKey === 'nationality' && (
              <StepNationality onSelect={(v) => handleNext(v)} />
            )}
            {currentStepKey === 'age' && (
              <StepAge onSelect={(v) => handleNext(v)} />
            )}
            {currentStepKey === 'educationLevel' && (
              <StepEducation onSelect={(v) => handleNext(v)} />
            )}
            {currentStepKey === 'availableAnnualFund' && (
              <StepFund onSelect={(v) => handleNext(v)} />
            )}
            {currentStepKey === 'finalGoal' && (
              <StepGoal onSelect={(v) => handleNext(v)} />
            )}
            {currentStepKey === 'priorityPreference' && (
              <StepPriority onSelect={(v) => handleNext(v)} />
            )}
          </div>

          {/* 이전 역으로 돌아가기 / Go back to previous station */}
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1"
            >
              <ChevronRight size={14} className="rotate-180" />
              이전 역으로 돌아가기 · Back to previous station
            </button>
          )}
        </div>
      ) : (
        /* ====================================================
           결과 화면 / Result screen — 노선도 뷰
           ==================================================== */
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* 결과 헤더 / Result header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                비자 노선도 분석 완료
                <span className="text-base font-normal text-gray-500 ml-2">Visa Route Map</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {result.meta.totalPathwaysEvaluated}개 경로 평가 · {result.meta.hardFilteredOut}개 제외 · {result.pathways.length}개 추천
              </p>
            </div>
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={14} />
              다시 진단 · Restart
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* ===== 좌측: 노선 목록 패널 / Left: Line list panel ===== */}
            <div className="lg:w-64 shrink-0">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  추천 노선 / Recommended Lines
                </h3>
                <div className="space-y-2">
                  {result.pathways.map((pathway, idx) => (
                    <button
                      key={pathway.pathwayId}
                      onClick={() => setSelectedPathway(idx)}
                      className={`w-full text-left rounded-xl p-3 transition-all duration-200 border ${
                        selectedPathway === idx
                          ? 'bg-white border-transparent shadow-md'
                          : 'border-transparent hover:bg-white hover:border-gray-100'
                      }`}
                    >
                      {/* 노선 번호 배지 / Line number badge */}
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                          style={{ backgroundColor: LINE_COLORS[idx % LINE_COLORS.length] }}
                        >
                          {idx + 1}
                        </div>
                        <span className="text-xs font-semibold text-gray-800 leading-tight line-clamp-1">
                          {pathway.nameKo}
                        </span>
                      </div>
                      {/* 소요 시간 / Duration */}
                      <div className="flex items-center gap-2 ml-8 text-[11px] text-gray-400">
                        <Clock size={10} />
                        <span>{pathway.estimatedMonths}개월</span>
                        <span className="text-gray-200">·</span>
                        <span style={{ color: getScoreColor(pathway.finalScore) }}>
                          {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== 우측: 메인 노선도 / Right: Main subway map ===== */}
            <div className="flex-1 min-w-0">
              {/* 선택된 노선 헤더 / Selected line header */}
              <div
                className="rounded-2xl p-5 text-white mb-4"
                style={{
                  background: `linear-gradient(135deg, ${LINE_COLORS[selectedPathway % LINE_COLORS.length]}, ${LINE_COLORS[selectedPathway % LINE_COLORS.length]}cc)`,
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-black text-sm">
                        {selectedPathway + 1}
                      </div>
                      <span className="text-xs opacity-80 uppercase tracking-wider">
                        Line {selectedPathway + 1} · {activePathway.nameEn}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{activePathway.nameKo}</h3>
                  </div>
                  <div className="flex gap-3">
                    {/* 점수 / Score */}
                    <div className="bg-white bg-opacity-20 rounded-xl px-3 py-2 text-center">
                      <div className="text-2xl font-black">{activePathway.finalScore}</div>
                      <div className="text-[10px] opacity-80">점수</div>
                    </div>
                    {/* 소요 기간 / Duration */}
                    <div className="bg-white bg-opacity-20 rounded-xl px-3 py-2 text-center">
                      <div className="text-2xl font-black">{activePathway.estimatedMonths}</div>
                      <div className="text-[10px] opacity-80">개월</div>
                    </div>
                    {/* 비용 / Cost */}
                    <div className="bg-white bg-opacity-20 rounded-xl px-3 py-2 text-center">
                      <div className="text-2xl font-black">
                        {activePathway.estimatedCostWon === 0 ? '무료' : `${activePathway.estimatedCostWon}만`}
                      </div>
                      <div className="text-[10px] opacity-80">원</div>
                    </div>
                  </div>
                </div>

                {/* 비자 체인 태그 / Visa chain tags */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  {activePathway.visaChain.split(' → ').map((visa, vi) => (
                    <React.Fragment key={vi}>
                      <span className="bg-white bg-opacity-25 px-2 py-0.5 rounded-full text-xs font-bold">
                        {visa}
                      </span>
                      {vi < activePathway.visaChain.split(' → ').length - 1 && (
                        <ArrowRight size={12} className="opacity-60" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* 노선도 SVG 섹션 / Subway map SVG section */}
              <SubwayMapView
                pathway={activePathway}
                color={LINE_COLORS[selectedPathway % LINE_COLORS.length]}
              />

              {/* 다음 행동 카드 / Next action cards */}
              <div className="mt-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Navigation size={14} />
                  다음 행동 · Next Steps
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activePathway.nextSteps.map((step, si) => (
                    <div
                      key={si}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mb-2"
                        style={{ backgroundColor: LINE_COLORS[selectedPathway % LINE_COLORS.length] }}
                      >
                        {si + 1}
                      </div>
                      <div className="text-sm font-semibold text-gray-800">{step.nameKo}</div>
                      <div className="text-xs text-gray-500 mt-1">{step.description}</div>
                      <div className="text-[10px] text-gray-400 mt-1 font-mono">{step.actionType}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 노선 메모 / Line notes */}
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
                <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">{activePathway.note}</p>
              </div>

              {/* 모든 노선 비교 / All lines comparison */}
              <AllLinesComparison pathways={result.pathways} selected={selectedPathway} onSelect={setSelectedPathway} />
            </div>
          </div>
        </div>
      )}

      {/* 하단 범례 / Bottom legend */}
      {showResult && (
        <footer className="mt-8 border-t border-gray-100 px-4 py-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="font-bold text-gray-700">범례 / Legend:</span>
              <LegendItem icon={<Train size={10} />} color="#2563EB" label="입국 · Entry" />
              <LegendItem icon={<BookOpen size={10} />} color="#16A34A" label="학업 · Study" />
              <LegendItem icon={<Briefcase size={10} />} color="#D97706" label="취업 · Work" />
              <LegendItem icon={<Star size={10} />} color="#7C3AED" label="졸업 · Graduation" />
              <LegendItem icon={<CheckCircle size={10} />} color="#DB2777" label="목표 · Goal" />
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// ============================================================
// 지하철 노선도 SVG 뷰 / Subway map SVG view
// 마일스톤을 역으로 표시 / Display milestones as stations
// ============================================================
function SubwayMapView({
  pathway,
  color,
}: {
  pathway: RecommendedPathway;
  color: string;
}) {
  const milestones = pathway.milestones;
  const count = milestones.length;

  // 역 간 간격 / Spacing between stations
  const STATION_GAP = 130;
  const TRACK_Y = 80;
  const SVG_HEIGHT = 200;
  const SVG_WIDTH = Math.max(count * STATION_GAP + 60, 400);

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-x-auto">
      <div className="px-4 pt-4 pb-2">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
          노선도 · Route Map
        </h4>
        <p className="text-[11px] text-gray-400">총 {pathway.estimatedMonths}개월 여정 · {count}개 역 경유</p>
      </div>
      <div className="px-4 pb-4" style={{ minWidth: SVG_WIDTH }}>
        <svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full"
          style={{ minWidth: SVG_WIDTH }}
        >
          {/* 메인 선로 / Main track */}
          <line
            x1={30}
            y1={TRACK_Y}
            x2={30 + (count - 1) * STATION_GAP}
            y2={TRACK_Y}
            stroke={color}
            strokeWidth={5}
            strokeLinecap="round"
          />

          {milestones.map((m, i) => {
            const cx = 30 + i * STATION_GAP;
            const isFirst = i === 0;
            const isLast = i === count - 1;

            // 역 타입별 색상 / Color by station type
            const stationColor =
              m.type === 'final_goal'
                ? '#22c55e'
                : m.type === 'entry'
                ? '#f59e0b'
                : color;

            return (
              <g key={m.order}>
                {/* 역 원 (테두리) / Station circle (border) */}
                <circle
                  cx={cx}
                  cy={TRACK_Y}
                  r={isFirst || isLast ? 18 : 14}
                  fill="white"
                  stroke={stationColor}
                  strokeWidth={isFirst || isLast ? 4 : 3}
                />
                {/* 역 원 (채움) / Station circle (fill) */}
                <circle
                  cx={cx}
                  cy={TRACK_Y}
                  r={isFirst || isLast ? 12 : 8}
                  fill={stationColor}
                />

                {/* 월 표시 (아래) / Month indicator (below) */}
                <text
                  x={cx}
                  y={TRACK_Y + 32}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#6b7280"
                  fontWeight="600"
                >
                  +{m.monthFromStart}M
                </text>

                {/* 비자 상태 (아래) / Visa status (below) */}
                {m.visaStatus && m.visaStatus !== 'none' && (
                  <text
                    x={cx}
                    y={TRACK_Y + 46}
                    textAnchor="middle"
                    fontSize={9}
                    fill={color}
                    fontWeight="700"
                  >
                    {m.visaStatus}
                  </text>
                )}

                {/* 역 이름 (위) / Station name (above) */}
                <foreignObject
                  x={cx - 55}
                  y={4}
                  width={110}
                  height={TRACK_Y - 22}
                >
                  <div
                    style={{
                      fontSize: '10px',
                      textAlign: 'center',
                      color: '#374151',
                      fontWeight: i === 0 || i === count - 1 ? '700' : '500',
                      lineHeight: '1.3',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      height: '100%',
                      paddingBottom: '4px',
                    }}
                  >
                    {m.nameKo}
                  </div>
                </foreignObject>

                {/* 환승 표시 (알바 가능 시) / Transfer indicator (when part-time allowed) */}
                {m.canWorkPartTime && m.weeklyHours > 0 && (
                  <g>
                    <circle cx={cx + 14} cy={TRACK_Y - 12} r={8} fill="#f59e0b" />
                    <text
                      x={cx + 14}
                      y={TRACK_Y - 8}
                      textAnchor="middle"
                      fontSize={8}
                      fill="white"
                      fontWeight="700"
                    >
                      W
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 마일스톤 상세 카드 / Milestone detail cards */}
      <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {milestones.map((m, i) => (
          <div
            key={m.order}
            className="flex items-start gap-3 bg-white rounded-xl p-3 border border-gray-100"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{
                backgroundColor:
                  m.type === 'final_goal'
                    ? '#22c55e'
                    : m.type === 'entry'
                    ? '#f59e0b'
                    : color,
              }}
            >
              {getStationIcon(m.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-800">{m.nameKo}</span>
                {m.visaStatus && m.visaStatus !== 'none' && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: color }}
                  >
                    {m.visaStatus}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                +{m.monthFromStart}개월째
                {m.canWorkPartTime && m.weeklyHours > 0 && (
                  <span className="ml-1 text-amber-500 font-semibold">
                    · 주{m.weeklyHours}시간 근무 가능
                  </span>
                )}
                {m.estimatedMonthlyIncome > 0 && (
                  <span className="ml-1 text-green-500 font-semibold">
                    · 월 {m.estimatedMonthlyIncome}만원
                  </span>
                )}
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">{m.requirements}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 전체 노선 비교 / All lines comparison table
// ============================================================
function AllLinesComparison({
  pathways,
  selected,
  onSelect,
}: {
  pathways: RecommendedPathway[];
  selected: number;
  onSelect: (idx: number) => void;
}) {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <Train size={14} />
        전체 노선 비교 · All Lines Comparison
      </h4>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                노선 / Line
              </th>
              <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                점수 / Score
              </th>
              <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                기간 / Duration
              </th>
              <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                비용 / Cost
              </th>
              <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                가능성 / Feasibility
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pathways.map((p, idx) => (
              <tr
                key={p.pathwayId}
                onClick={() => onSelect(idx)}
                className={`cursor-pointer transition-colors ${
                  selected === idx ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0"
                      style={{ backgroundColor: LINE_COLORS[idx % LINE_COLORS.length] }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-800">{p.nameKo}</div>
                      <div className="text-[10px] text-gray-400">{p.visaChain}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <span
                    className="text-sm font-black"
                    style={{ color: getScoreColor(p.finalScore) }}
                  >
                    {p.finalScore}
                  </span>
                </td>
                <td className="px-3 py-3 text-center text-xs text-gray-600">
                  {p.estimatedMonths}개월
                </td>
                <td className="px-3 py-3 text-center text-xs text-gray-600">
                  {p.estimatedCostWon === 0 ? (
                    <span className="text-green-600 font-bold">무료</span>
                  ) : (
                    `${p.estimatedCostWon.toLocaleString()}만`
                  )}
                </td>
                <td className="px-3 py-3 text-center text-xs">
                  <span className="inline-flex items-center gap-1">
                    {getFeasibilityEmoji(p.feasibilityLabel)}
                    <span className="text-gray-600">{p.feasibilityLabel}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// 범례 아이템 / Legend item
// ============================================================
function LegendItem({
  icon,
  color,
  label,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <span>{label}</span>
    </div>
  );
}

// ============================================================
// 입력 단계 컴포넌트들 / Input step components
// ============================================================

// 국적 선택 / Nationality selection
function StepNationality({ onSelect }: { onSelect: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">출발국을 선택하세요</h2>
      <p className="text-sm text-gray-500 mb-4">Select your origin country</p>
      <div className="grid grid-cols-2 gap-2">
        {popularCountries.map((c) => (
          <button
            key={c.code}
            onClick={() => onSelect(c.code)}
            className="flex items-center gap-2 px-3 py-3 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
          >
            <span className="text-2xl">{c.flag}</span>
            <div>
              <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">
                {c.nameKo}
              </div>
              <div className="text-[11px] text-gray-400">{c.nameEn}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// 나이 입력 / Age input
function StepAge({ onSelect }: { onSelect: (v: number) => void }) {
  const [age, setAge] = useState<string>('24');
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">나이를 입력하세요</h2>
      <p className="text-sm text-gray-500 mb-4">Enter your age</p>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setAge(String(Math.max(18, parseInt(age || '18') - 1)))}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
        >
          −
        </button>
        <input
          type="number"
          min={18}
          max={65}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="flex-1 text-center text-3xl font-black text-gray-900 border-0 bg-transparent focus:outline-none"
        />
        <button
          onClick={() => setAge(String(Math.min(65, parseInt(age || '18') + 1)))}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
        >
          +
        </button>
      </div>
      <div className="text-center text-sm text-gray-400 mb-4">세 / years old</div>
      {/* 빠른 선택 / Quick selection */}
      <div className="flex gap-2 flex-wrap justify-center mb-4">
        {[18, 20, 24, 27, 30, 35].map((a) => (
          <button
            key={a}
            onClick={() => setAge(String(a))}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              age === String(a) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'
            }`}
          >
            {a}세
          </button>
        ))}
      </div>
      <button
        onClick={() => onSelect(parseInt(age) || 24)}
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        다음 역으로 · Next Station <ChevronRight size={16} />
      </button>
    </div>
  );
}

// 학력 선택 / Education selection
function StepEducation({ onSelect }: { onSelect: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">최종 학력을 선택하세요</h2>
      <p className="text-sm text-gray-500 mb-4">Select your education level</p>
      <div className="space-y-2">
        {educationOptions.map((e) => (
          <button
            key={e.value}
            onClick={() => onSelect(e.value)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
          >
            <span className="text-xl">{e.emoji}</span>
            <div>
              <div className="text-sm font-semibold text-gray-800">{e.labelKo}</div>
              <div className="text-xs text-gray-400">{e.labelEn}</div>
            </div>
            <ChevronRight size={14} className="ml-auto text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );
}

// 자금 선택 / Fund selection
function StepFund({ onSelect }: { onSelect: (v: number) => void }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">연간 사용 가능한 자금</h2>
      <p className="text-sm text-gray-500 mb-4">Available annual budget (Korean Won)</p>
      <div className="space-y-2">
        {fundOptions.map((f) => (
          <button
            key={f.value}
            onClick={() => onSelect(f.value)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
          >
            <DollarSign size={16} className="text-gray-400 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-gray-800">{f.labelKo}</div>
              <div className="text-xs text-gray-400">{f.labelEn}</div>
            </div>
            <ChevronRight size={14} className="ml-auto text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );
}

// 목표 선택 / Goal selection
function StepGoal({ onSelect }: { onSelect: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">최종 목표역</h2>
      <p className="text-sm text-gray-500 mb-4">Select your destination</p>
      <div className="grid grid-cols-2 gap-3">
        {goalOptions.map((g) => (
          <button
            key={g.value}
            onClick={() => onSelect(g.value)}
            className="flex flex-col items-center gap-2 px-4 py-5 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all text-center group"
          >
            <span className="text-3xl">{g.emoji}</span>
            <div className="text-sm font-bold text-gray-800 group-hover:text-blue-700">{g.labelKo}</div>
            <div className="text-xs text-gray-400">{g.labelEn}</div>
            <div className="text-[11px] text-gray-500 leading-snug">{g.descKo}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// 우선순위 선택 / Priority selection
function StepPriority({ onSelect }: { onSelect: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">어떤 노선을 원하세요?</h2>
      <p className="text-sm text-gray-500 mb-4">Which route type do you prefer?</p>
      <div className="grid grid-cols-2 gap-3">
        {priorityOptions.map((p) => (
          <button
            key={p.value}
            onClick={() => onSelect(p.value)}
            className="flex flex-col items-center gap-2 px-4 py-5 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all text-center group"
          >
            <span className="text-2xl">{p.emoji}</span>
            <div className="text-sm font-bold text-gray-800 group-hover:text-blue-700">{p.labelKo}</div>
            <div className="text-xs text-gray-400">{p.labelEn}</div>
            <div className="text-[11px] text-gray-500 leading-snug">{p.descKo}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
