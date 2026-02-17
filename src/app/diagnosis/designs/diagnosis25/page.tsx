'use client';

// KOR: 디자인 #25 — 미로 탈출 (Maze Runner) 비자 진단 페이지
// ENG: Design #25 — Maze Runner visa diagnosis page
// KOR: Monument Valley, Alto Adventure, Journey, Gris 등에서 영감을 받은 미니멀 파스텔+골드 어드벤처 스타일
// ENG: Minimalist pastel + gold adventure style inspired by Monument Valley, Alto Adventure, Journey, Gris

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
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Star,
  Trophy,
  Compass,
  Map,
  Footprints,
  ArrowRight,
  Clock,
  DollarSign,
  CheckCircle,
  Circle,
  Gem,
  Navigation,
  Sparkles,
  RotateCcw,
  Home,
} from 'lucide-react';

// KOR: 진단 단계 타입 정의 — 미로 구역 이름으로 표현
// ENG: Diagnosis step type definition — expressed as maze zone names
type MazeStep =
  | 'entrance'       // 입구: 국적 선택 / Entrance: nationality
  | 'corridor-1'     // 복도 1: 나이 / Corridor 1: age
  | 'junction-1'     // 분기점 1: 학력 / Junction 1: education
  | 'chamber'        // 방: 자금 / Chamber: fund
  | 'junction-2'     // 분기점 2: 목표 / Junction 2: goal
  | 'final-gate'     // 최종 관문: 우선순위 / Final gate: priority
  | 'treasure';      // 보물: 결과 / Treasure: result

// KOR: 미로 각 구역의 메타데이터
// ENG: Metadata for each maze zone
interface MazeZone {
  step: MazeStep;
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  color: string;         // KOR: Tailwind 배경색 / ENG: Tailwind bg color
  borderColor: string;   // KOR: Tailwind 테두리색 / ENG: Tailwind border color
  textColor: string;     // KOR: Tailwind 텍스트색 / ENG: Tailwind text color
}

// KOR: 진단 순서에 따른 미로 구역 목록 (보물 제외)
// ENG: List of maze zones in diagnosis order (excluding treasure)
const MAZE_ZONES: MazeZone[] = [
  {
    step: 'entrance',
    label: '미로 입구',
    labelEn: 'Maze Entrance',
    icon: <Home size={16} />,
    color: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-600',
  },
  {
    step: 'corridor-1',
    label: '돌의 복도',
    labelEn: 'Stone Corridor',
    icon: <Footprints size={16} />,
    color: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-600',
  },
  {
    step: 'junction-1',
    label: '첫 번째 분기',
    labelEn: 'First Junction',
    icon: <Compass size={16} />,
    color: 'bg-lime-50',
    borderColor: 'border-lime-200',
    textColor: 'text-lime-600',
  },
  {
    step: 'chamber',
    label: '황금의 방',
    labelEn: 'Golden Chamber',
    icon: <Gem size={16} />,
    color: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-600',
  },
  {
    step: 'junction-2',
    label: '두 번째 분기',
    labelEn: 'Second Junction',
    icon: <Navigation size={16} />,
    color: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-600',
  },
  {
    step: 'final-gate',
    label: '최종 관문',
    labelEn: 'Final Gate',
    icon: <Star size={16} />,
    color: 'bg-violet-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-600',
  },
];

// KOR: 미로 맵 SVG — 6구역 경로를 시각적으로 표현 (단순화된 미로 도식)
// ENG: Maze map SVG — visually represents 6-zone path (simplified maze schematic)
function MazeMiniMap({ currentStep }: { currentStep: MazeStep }) {
  // KOR: 각 미로 노드의 위치 (SVG 좌표)
  // ENG: Position of each maze node (SVG coordinates)
  const nodes: { step: MazeStep; cx: number; cy: number; label: string }[] = [
    { step: 'entrance', cx: 40, cy: 80, label: '입구' },
    { step: 'corridor-1', cx: 90, cy: 55, label: '복도' },
    { step: 'junction-1', cx: 150, cy: 70, label: '분기1' },
    { step: 'chamber', cx: 200, cy: 40, label: '황금방' },
    { step: 'junction-2', cx: 255, cy: 65, label: '분기2' },
    { step: 'final-gate', cx: 310, cy: 45, label: '관문' },
    { step: 'treasure', cx: 355, cy: 80, label: '보물' },
  ];

  // KOR: 단계 순서 인덱스
  // ENG: Step order index
  const stepOrder: MazeStep[] = [
    'entrance', 'corridor-1', 'junction-1', 'chamber', 'junction-2', 'final-gate', 'treasure',
  ];
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 400 110" className="w-full max-w-lg mx-auto" style={{ minWidth: '280px' }}>
        {/* KOR: 미로 배경 장식선 / ENG: Maze background decorative lines */}
        <path d="M20 95 Q60 20 100 50 Q140 80 160 40 Q180 10 220 30 Q260 50 280 20 Q320 0 370 30" stroke="#e5e7eb" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
        <path d="M20 95 Q40 60 80 70 Q120 80 140 55 Q160 30 190 45 Q220 60 250 40 Q280 20 330 50 Q350 60 380 45" stroke="#f3f4f6" strokeWidth="1" fill="none" />

        {/* KOR: 경로 연결선 / ENG: Path connection lines */}
        {nodes.slice(0, -1).map((node, i) => {
          const next = nodes[i + 1];
          const isPassed = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <line
              key={`line-${i}`}
              x1={node.cx}
              y1={node.cy}
              x2={next.cx}
              y2={next.cy}
              stroke={isPassed ? '#fbbf24' : isCurrent ? '#fde68a' : '#d1d5db'}
              strokeWidth={isPassed ? 2.5 : 1.5}
              strokeDasharray={isPassed ? '0' : '5 3'}
            />
          );
        })}

        {/* KOR: 각 미로 노드 / ENG: Each maze node */}
        {nodes.map((node, i) => {
          const isPassed = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;
          const isGold = node.step === 'treasure';

          return (
            <g key={node.step}>
              {/* KOR: 외부 광택 링 (현재 위치) / ENG: Outer glow ring (current position) */}
              {isCurrent && (
                <circle cx={node.cx} cy={node.cy} r={14} fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.5" />
              )}
              {/* KOR: 노드 원형 배경 / ENG: Node circle background */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={10}
                fill={
                  isGold
                    ? '#fbbf24'
                    : isPassed
                    ? '#fde68a'
                    : isCurrent
                    ? '#ffffff'
                    : '#f3f4f6'
                }
                stroke={
                  isGold
                    ? '#d97706'
                    : isPassed
                    ? '#f59e0b'
                    : isCurrent
                    ? '#fbbf24'
                    : '#d1d5db'
                }
                strokeWidth={isCurrent ? 2.5 : 1.5}
              />
              {/* KOR: 노드 레이블 / ENG: Node label */}
              <text
                x={node.cx}
                y={node.cy + 22}
                textAnchor="middle"
                fontSize="7"
                fill={isFuture ? '#9ca3af' : '#6b7280'}
                fontFamily="sans-serif"
              >
                {node.label}
              </text>
              {/* KOR: 통과한 체크 표시 / ENG: Passed check mark */}
              {isPassed && (
                <text x={node.cx} y={node.cy + 3} textAnchor="middle" fontSize="8" fill="#92400e">
                  ✓
                </text>
              )}
              {/* KOR: 현재 위치 캐릭터 / ENG: Current position character */}
              {isCurrent && (
                <text x={node.cx} y={node.cy + 4} textAnchor="middle" fontSize="10">
                  🧭
                </text>
              )}
              {/* KOR: 보물 아이콘 / ENG: Treasure icon */}
              {isGold && !isCurrent && (
                <text x={node.cx} y={node.cy + 4} textAnchor="middle" fontSize="10">
                  {currentStep === 'treasure' ? '🏆' : '💎'}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// KOR: 미로 경로 선택 버튼 컴포넌트 — 방향 분기 스타일
// ENG: Maze path choice button component — directional junction style
function PathButton({
  label,
  sublabel,
  selected,
  onClick,
  direction = 'right',
}: {
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
  direction?: 'left' | 'right' | 'up' | 'down';
}) {
  // KOR: 방향별 화살표 아이콘 매핑
  // ENG: Direction-to-arrow icon mapping
  const arrows: Record<string, React.ReactNode> = {
    left: <ChevronLeft size={16} />,
    right: <ChevronRight size={16} />,
    up: <ChevronUp size={16} />,
    down: <ChevronDown size={16} />,
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left
        ${selected
          ? 'border-yellow-400 bg-yellow-50 shadow-md shadow-yellow-100'
          : 'border-stone-200 bg-white hover:border-yellow-300 hover:bg-yellow-50/50 hover:shadow-sm'
        }
      `}
    >
      {/* KOR: 방향 화살표 / ENG: Direction arrow */}
      <span
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
          ${selected ? 'bg-yellow-400 text-white' : 'bg-stone-100 text-stone-400'}
        `}
      >
        {arrows[direction]}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${selected ? 'text-yellow-800' : 'text-stone-700'}`}>
          {label}
        </p>
        {sublabel && (
          <p className={`text-xs truncate ${selected ? 'text-yellow-600' : 'text-stone-400'}`}>
            {sublabel}
          </p>
        )}
      </div>
      {/* KOR: 선택 완료 표시 / ENG: Selection complete indicator */}
      {selected && (
        <CheckCircle size={18} className="shrink-0 text-yellow-500" />
      )}
    </button>
  );
}

// KOR: 결과 페이지 — 각 비자 경로 카드
// ENG: Result page — each visa pathway card
function PathwayCard({ pathway, index }: { pathway: RecommendedPathway; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  // KOR: 경로 순서에 따른 보물 레벨 아이콘
  // ENG: Treasure level icon based on pathway rank
  const treasureIcons = ['🏆', '🥇', '🥈', '🥉', '💎'];
  const icon = treasureIcons[index] ?? '⭐';

  // KOR: 점수 퍼센트 바 너비
  // ENG: Score percent bar width
  const scoreWidth = `${pathway.feasibilityScore}%`;

  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden
        ${index === 0 ? 'border-yellow-300 shadow-lg shadow-yellow-100' : 'border-stone-200 shadow-sm'}
      `}
    >
      {/* KOR: 카드 헤더 — 클릭하여 열고 닫기 / ENG: Card header — click to expand/collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center gap-3 p-4 text-left
          ${index === 0 ? 'bg-linear-to-br from-yellow-50 to-amber-50' : 'bg-stone-50'}
        `}
      >
        {/* KOR: 순위 아이콘 / ENG: Rank icon */}
        <span className="text-2xl shrink-0">{icon}</span>

        {/* KOR: 경로 제목 및 설명 / ENG: Pathway title and description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-stone-800 truncate">{pathway.name}</h3>
            <span
              className={`shrink-0 text-xs px-2 py-0.5 rounded-full text-white font-medium ${getScoreColor(pathway.feasibilityLabel)}`}
            >
              {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
            </span>
          </div>
          {/* KOR: 점수 바 / ENG: Score bar */}
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getScoreColor(pathway.feasibilityLabel)}`}
                style={{ width: scoreWidth }}
              />
            </div>
            <span className="text-xs font-bold text-stone-500 shrink-0">{pathway.feasibilityScore}</span>
          </div>
        </div>

        {/* KOR: 펼치기/접기 토글 / ENG: Expand/collapse toggle */}
        <span className="shrink-0 text-stone-400">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {/* KOR: 카드 상세 내용 (펼쳐질 때) / ENG: Card detail content (when expanded) */}
      {expanded && (
        <div className="p-4 border-t border-stone-100 space-y-4 bg-white">
          {/* KOR: 요약 스탯 (기간, 비용) / ENG: Summary stats (duration, cost) */}
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2 bg-sky-50 rounded-xl p-3">
              <Clock size={16} className="text-sky-500 shrink-0" />
              <div>
                <p className="text-xs text-sky-500 font-medium">예상 기간</p>
                <p className="text-sm font-bold text-sky-800">{pathway.totalDurationMonths}개월</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-emerald-50 rounded-xl p-3">
              <DollarSign size={16} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-xs text-emerald-500 font-medium">예상 비용</p>
                <p className="text-sm font-bold text-emerald-800">${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* KOR: 경로 설명 / ENG: Pathway description */}
          <p className="text-xs text-stone-500 leading-relaxed">{pathway.description}</p>

          {/* KOR: 비자 체인 — 미로 경로처럼 표시 / ENG: Visa chain — displayed like a maze path */}
          <div>
            <p className="text-xs font-bold text-stone-600 mb-2 flex items-center gap-1">
              <Map size={13} className="text-amber-500" />
              탈출 경로 (비자 체인)
            </p>
            <div className="flex flex-wrap items-center gap-1">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((item, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-200">
                      {item.visa}
                    </span>
                    <span className="text-[10px] text-stone-400 mt-0.5">{item.duration}</span>
                  </div>
                  {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ArrowRight size={14} className="text-amber-300 shrink-0 mb-4" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* KOR: 마일스톤 — 보물 지도 스타일 / ENG: Milestones — treasure map style */}
          <div>
            <p className="text-xs font-bold text-stone-600 mb-2 flex items-center gap-1">
              <Footprints size={13} className="text-amber-500" />
              발자국 (주요 단계)
            </p>
            <div className="space-y-2">
              {pathway.milestones.map((ms, i) => (
                <div key={i} className="flex gap-2.5">
                  {/* KOR: 단계 번호 원형 / ENG: Step number circle */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
                      <span className="text-xs">{ms.emoji}</span>
                    </div>
                    {i < pathway.milestones.length - 1 && (
                      <div className="w-0.5 h-4 bg-amber-100 mt-1" />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="text-xs font-bold text-stone-700">{ms.title}</p>
                    <p className="text-[11px] text-stone-400 leading-relaxed">{ms.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// KOR: 메인 진단 페이지 컴포넌트
// ENG: Main diagnosis page component
export default function Diagnosis25Page() {
  // KOR: 현재 미로 단계 상태
  // ENG: Current maze step state
  const [currentStep, setCurrentStep] = useState<MazeStep>('entrance');

  // KOR: 사용자 입력값 상태 (Partial로 단계별 누적)
  // ENG: User input state (partial, accumulated step by step)
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 나이 직접 입력 상태
  // ENG: Age direct input state
  const [ageInput, setAgeInput] = useState<string>('');

  // KOR: 결과 데이터 — 실제 API 연동 전 목업 사용
  // ENG: Result data — using mock before real API integration
  const result: DiagnosisResult = mockDiagnosisResult;

  // KOR: 미로 단계 순서 배열
  // ENG: Maze step order array
  const stepOrder: MazeStep[] = [
    'entrance', 'corridor-1', 'junction-1', 'chamber', 'junction-2', 'final-gate', 'treasure',
  ];

  // KOR: 현재 단계 인덱스
  // ENG: Current step index
  const currentIndex = stepOrder.indexOf(currentStep);

  // KOR: 다음 단계로 이동
  // ENG: Move to next step
  const goNext = () => {
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  // KOR: 이전 단계로 이동
  // ENG: Move to previous step
  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  // KOR: 처음으로 리셋
  // ENG: Reset to beginning
  const resetMaze = () => {
    setCurrentStep('entrance');
    setInput({});
    setAgeInput('');
  };

  // KOR: 현재 단계에서 "다음" 버튼 활성화 여부
  // ENG: Whether "Next" button is active at current step
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 'entrance': return Boolean(input.nationality);
      case 'corridor-1': return Boolean(input.age && input.age > 0);
      case 'junction-1': return Boolean(input.educationLevel);
      case 'chamber': return Boolean(input.availableAnnualFund);
      case 'junction-2': return Boolean(input.finalGoal);
      case 'final-gate': return Boolean(input.priorityPreference);
      default: return false;
    }
  };

  // KOR: 방향 배열 — 각 국가를 4방향 중 하나로 매핑하여 미로 분기처럼 보이게
  // ENG: Direction array — maps each country to one of 4 directions to look like maze junctions
  const directions: ('left' | 'right' | 'up' | 'down')[] = ['right', 'right', 'up', 'left', 'down', 'right', 'up', 'left', 'down', 'right', 'up', 'left'];

  // KOR: 현재 단계 구역 정보 (보물 제외)
  // ENG: Current zone info (excluding treasure)
  const currentZone = MAZE_ZONES.find((z) => z.step === currentStep);

  // KOR: 진행률 퍼센트 계산 (보물 단계는 100%)
  // ENG: Progress percentage calculation (treasure = 100%)
  const progressPercent = currentStep === 'treasure'
    ? 100
    : Math.round((currentIndex / (stepOrder.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* ─── 상단 헤더 / Top Header ─── */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-stone-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {/* KOR: 로고 및 제목 / ENG: Logo and title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-amber-400 to-yellow-300 rounded-lg flex items-center justify-center shadow-sm">
              <Map size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800 leading-none">미로 탈출</p>
              <p className="text-[10px] text-stone-400 leading-none">Maze Runner</p>
            </div>
          </div>

          {/* KOR: 진행률 바 / ENG: Progress bar */}
          <div className="flex-1 mx-4">
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-300 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-stone-400 text-right mt-0.5">{progressPercent}% 탐험 완료</p>
          </div>

          {/* KOR: 리셋 버튼 / ENG: Reset button */}
          <button
            onClick={resetMaze}
            className="w-8 h-8 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center justify-center transition-colors"
            title="처음부터"
          >
            <RotateCcw size={15} className="text-stone-500" />
          </button>
        </div>
      </header>

      {/* ─── 미로 맵 (결과 화면 제외) / Maze Map (excluding result) ─── */}
      {currentStep !== 'treasure' && (
        <div className="bg-white border-b border-stone-100 px-4 py-3">
          <div className="max-w-lg mx-auto">
            <MazeMiniMap currentStep={currentStep} />
          </div>
        </div>
      )}

      {/* ─── 본문 컨텐츠 / Main Content ─── */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">

        {/* ════ STEP 1: 입구 — 국적 선택 / Entrance — Nationality ════ */}
        {currentStep === 'entrance' && (
          <div className="space-y-5">
            {/* KOR: 구역 헤더 / ENG: Zone header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <Home size={20} className="text-rose-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-800">미로 입구 — 출발지 선택</h2>
                <p className="text-xs text-stone-400">Where are you from? / 어느 나라에서 왔나요?</p>
              </div>
            </div>

            {/* KOR: 구역 구분 뱃지 / ENG: Zone badge */}
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <MapPin size={12} className="text-rose-400" />
              <span>입국 경로의 시작 — 국적을 선택하세요</span>
            </div>

            {/* KOR: 인기 국가 그리드 / ENG: Popular countries grid */}
            <div className="grid grid-cols-3 gap-2">
              {popularCountries.map((c, i) => {
                const isSelected = input.nationality === c.name;
                const dir = directions[i % directions.length];
                return (
                  <button
                    key={c.code}
                    onClick={() => setInput((prev) => ({ ...prev, nationality: c.name }))}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-left
                      ${isSelected
                        ? 'border-amber-400 bg-amber-50 shadow-md shadow-amber-100'
                        : 'border-stone-200 bg-white hover:border-amber-200 hover:bg-amber-50/30'}
                    `}
                  >
                    <span className="text-lg shrink-0">{c.flag}</span>
                    <span className={`text-xs font-medium truncate ${isSelected ? 'text-amber-800' : 'text-stone-600'}`}>
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* KOR: 기타 국가 직접 입력 / ENG: Other country direct input */}
            <div>
              <p className="text-xs text-stone-500 mb-1.5">목록에 없는 나라 / Other country</p>
              <input
                type="text"
                value={!popularCountries.some((c) => c.name === input.nationality) ? (input.nationality ?? '') : ''}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, nationality: e.target.value }))
                }
                placeholder="국가명 직접 입력 / Type country name"
                className="w-full px-4 py-2.5 border-2 border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white text-stone-700 placeholder:text-stone-300"
              />
            </div>
          </div>
        )}

        {/* ════ STEP 2: 복도 — 나이 / Corridor — Age ════ */}
        {currentStep === 'corridor-1' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Footprints size={20} className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-800">돌의 복도 — 탐험가의 나이</h2>
                <p className="text-xs text-stone-400">How old are you? / 나이가 어떻게 되시나요?</p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <p className="text-xs text-amber-700 mb-3 font-medium">나이를 입력하세요 (만 나이)</p>
              <div className="flex items-center gap-3">
                {/* KOR: 감소 버튼 / ENG: Decrement button */}
                <button
                  onClick={() => {
                    const cur = input.age ?? 25;
                    const next = Math.max(15, cur - 1);
                    setInput((prev) => ({ ...prev, age: next }));
                    setAgeInput(String(next));
                  }}
                  className="w-10 h-10 rounded-xl bg-white border-2 border-amber-200 flex items-center justify-center text-amber-600 font-bold text-xl hover:bg-amber-100 transition-colors"
                >
                  −
                </button>

                {/* KOR: 나이 표시 숫자 / ENG: Age display number */}
                <div className="flex-1 text-center">
                  <input
                    type="number"
                    min={15}
                    max={80}
                    value={ageInput !== '' ? ageInput : (input.age ?? '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAgeInput(val);
                      const num = parseInt(val, 10);
                      if (!isNaN(num) && num >= 15 && num <= 80) {
                        setInput((prev) => ({ ...prev, age: num }));
                      }
                    }}
                    className="w-full text-center text-3xl font-bold text-amber-800 bg-transparent focus:outline-none border-b-2 border-amber-300 focus:border-amber-500 pb-1"
                    placeholder="25"
                  />
                  <p className="text-xs text-amber-500 mt-1">세 (만 나이 기준)</p>
                </div>

                {/* KOR: 증가 버튼 / ENG: Increment button */}
                <button
                  onClick={() => {
                    const cur = input.age ?? 25;
                    const next = Math.min(80, cur + 1);
                    setInput((prev) => ({ ...prev, age: next }));
                    setAgeInput(String(next));
                  }}
                  className="w-10 h-10 rounded-xl bg-white border-2 border-amber-200 flex items-center justify-center text-amber-600 font-bold text-xl hover:bg-amber-100 transition-colors"
                >
                  ＋
                </button>
              </div>

              {/* KOR: 나이 슬라이더 / ENG: Age slider */}
              <input
                type="range"
                min={15}
                max={80}
                value={input.age ?? 25}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setInput((prev) => ({ ...prev, age: val }));
                  setAgeInput(String(val));
                }}
                className="w-full mt-4 accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-amber-400 mt-0.5">
                <span>15세</span><span>80세</span>
              </div>
            </div>

            {/* KOR: 나이 범주 빠른 선택 / ENG: Age range quick select */}
            <div className="grid grid-cols-4 gap-2">
              {[20, 25, 30, 35].map((age) => (
                <button
                  key={age}
                  onClick={() => {
                    setInput((prev) => ({ ...prev, age }));
                    setAgeInput(String(age));
                  }}
                  className={`py-2 rounded-xl border-2 text-sm font-bold transition-all
                    ${input.age === age
                      ? 'border-amber-400 bg-amber-400 text-white shadow-md'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-amber-200'}
                  `}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════ STEP 3: 첫 번째 분기 — 학력 / Junction 1 — Education ════ */}
        {currentStep === 'junction-1' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lime-100 rounded-xl flex items-center justify-center">
                <Compass size={20} className="text-lime-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-800">첫 번째 분기 — 길을 선택하세요</h2>
                <p className="text-xs text-stone-400">Education level / 학력을 선택하세요</p>
              </div>
            </div>

            <p className="text-xs text-stone-500 bg-lime-50 px-3 py-2 rounded-lg border border-lime-100">
              🧭 분기점에 도달했습니다. 어느 방향으로 갈까요?
            </p>

            <div className="space-y-2">
              {educationOptions.map((option, i) => (
                <PathButton
                  key={String(option.value)}
                  label={option.labelKo}
                  selected={input.educationLevel === option.value}
                  onClick={() => setInput((prev) => ({ ...prev, educationLevel: option.value }))}
                  direction={(['up', 'right', 'right', 'down', 'left'] as const)[i % 5]}
                />
              ))}
            </div>
          </div>
        )}

        {/* ════ STEP 4: 황금의 방 — 자금 / Golden Chamber — Fund ════ */}
        {currentStep === 'chamber' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Gem size={20} className="text-yellow-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-800">황금의 방 — 보물을 평가하세요</h2>
                <p className="text-xs text-stone-400">Annual available fund / 연간 가용 자금</p>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100 flex items-center gap-2">
              <span className="text-lg">💰</span>
              <p className="text-xs text-yellow-700">비자 신청, 생활비, 교육비 등 한국에서 1년간 사용 가능한 총 금액을 선택하세요.</p>
            </div>

            <div className="space-y-2">
              {fundOptions.map((option, i) => (
                <PathButton
                  key={String(option.value)}
                  label={option.labelKo}
                  sublabel={i === 0 ? '기본 체류' : i === 4 ? '투자 이민 가능' : undefined}
                  selected={input.availableAnnualFund === option.value}
                  onClick={() => setInput((prev) => ({ ...prev, availableAnnualFund: option.value }))}
                  direction={(['left', 'right', 'up', 'right', 'down'] as const)[i % 5]}
                />
              ))}
            </div>
          </div>
        )}

        {/* ════ STEP 5: 두 번째 분기 — 목표 / Junction 2 — Goal ════ */}
        {currentStep === 'junction-2' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                <Navigation size={20} className="text-sky-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-800">두 번째 분기 — 목적지는 어디인가요?</h2>
                <p className="text-xs text-stone-400">Final goal / 최종 목표</p>
              </div>
            </div>

            <p className="text-xs text-stone-500 bg-sky-50 px-3 py-2 rounded-lg border border-sky-100">
              🗺️ 두 번째 분기점입니다. 어디로 향하고 싶으신가요?
            </p>

            <div className="space-y-2">
              {goalOptions.map((option, i) => {
                const emojis = ['📚', '💼', '🏢', '🎓', '🏠'];
                return (
                  <PathButton
                    key={String(option.value)}
                    label={option.labelKo}
                    sublabel={`${emojis[i]} 이 방향으로 탐험`}
                    selected={input.finalGoal === option.value}
                    onClick={() => setInput((prev) => ({ ...prev, finalGoal: option.value }))}
                    direction={(['up', 'right', 'right', 'down', 'left'] as const)[i % 5]}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ════ STEP 6: 최종 관문 — 우선순위 / Final Gate — Priority ════ */}
        {currentStep === 'final-gate' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                <Star size={20} className="text-violet-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-800">최종 관문 — 탈출 전략을 선택하세요</h2>
                <p className="text-xs text-stone-400">Priority preference / 우선 고려 사항</p>
              </div>
            </div>

            <div className="bg-violet-50 rounded-xl p-3 border border-violet-100 flex items-center gap-2">
              <span className="text-lg">🚪</span>
              <p className="text-xs text-violet-700">보물 방문 직전 — 마지막 선택. 어떤 전략으로 미로를 탈출할까요?</p>
            </div>

            <div className="space-y-2">
              {priorityOptions.map((option, i) => {
                const strategyEmojis = ['⚡', '💸', '🎯', '🔧'];
                const strategyDesc = ['빠를수록 좋다', '비용을 줄이자', '합격률이 중요', '내 직업 분야'];
                return (
                  <PathButton
                    key={String(option.value)}
                    label={option.labelKo}
                    sublabel={`${strategyEmojis[i]} ${strategyDesc[i]}`}
                    selected={input.priorityPreference === option.value}
                    onClick={() => setInput((prev) => ({ ...prev, priorityPreference: option.value }))}
                    direction={(['right', 'left', 'up', 'down'] as const)[i % 4]}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ════ STEP 7: 보물 발견 — 결과 / Treasure Found — Result ════ */}
        {currentStep === 'treasure' && (
          <div className="space-y-5">
            {/* KOR: 보물 발견 헤더 / ENG: Treasure found header */}
            <div className="rounded-2xl bg-linear-to-br from-amber-400 to-yellow-300 p-5 text-center shadow-lg shadow-amber-200">
              <div className="text-4xl mb-2">🏆</div>
              <h2 className="text-lg font-bold text-white drop-shadow">탈출 성공! 보물을 발견했습니다</h2>
              <p className="text-yellow-100 text-xs mt-1">Maze Complete! Your visa pathways are ready.</p>
            </div>

            {/* KOR: 입력 요약 카드 / ENG: Input summary card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
              <p className="text-xs font-bold text-stone-600 mb-3 flex items-center gap-1">
                <Sparkles size={13} className="text-amber-400" />
                탐험가 프로필 / Explorer Profile
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-stone-50 rounded-lg p-2">
                  <span className="text-stone-400">국적</span>
                  <p className="font-bold text-stone-700 truncate">{input.nationality ?? mockInput.nationality}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-2">
                  <span className="text-stone-400">나이</span>
                  <p className="font-bold text-stone-700">{input.age ?? mockInput.age}세</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-2 col-span-2">
                  <span className="text-stone-400">학력</span>
                  <p className="font-bold text-stone-700 truncate">{input.educationLevel ?? mockInput.educationLevel}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-2">
                  <span className="text-stone-400">자금</span>
                  <p className="font-bold text-stone-700 truncate text-[11px]">{input.availableAnnualFund ?? mockInput.availableAnnualFund}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-2">
                  <span className="text-stone-400">목표</span>
                  <p className="font-bold text-stone-700 truncate text-[11px]">{input.finalGoal ?? mockInput.finalGoal}</p>
                </div>
              </div>
            </div>

            {/* KOR: 추천 비자 경로 목록 / ENG: Recommended visa pathway list */}
            <div>
              <p className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" />
                발견한 보물 — 추천 비자 경로 {result.pathways.length}개
              </p>
              <div className="space-y-3">
                {result.pathways.map((pathway, i) => (
                  <PathwayCard key={pathway.id} pathway={pathway} index={i} />
                ))}
              </div>
            </div>

            {/* KOR: 다시 탐험 버튼 / ENG: Explore again button */}
            <button
              onClick={resetMaze}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-amber-300 bg-amber-50 text-amber-700 font-bold text-sm hover:bg-amber-100 transition-colors"
            >
              <RotateCcw size={16} />
              미로 다시 탐험하기 / Explore Again
            </button>
          </div>
        )}

        {/* ─── 하단 네비게이션 (보물 단계 제외) / Bottom Navigation (excluding treasure) ─── */}
        {currentStep !== 'treasure' && (
          <div className="mt-6 flex items-center justify-between gap-3">
            {/* KOR: 뒤로 버튼 / ENG: Back button */}
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all
                ${currentIndex === 0
                  ? 'border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:bg-amber-50'}
              `}
            >
              <ChevronLeft size={18} />
              뒤로
            </button>

            {/* KOR: 현재 단계 표시 / ENG: Current step indicator */}
            <div className="flex gap-1.5">
              {MAZE_ZONES.map((zone, i) => (
                <div
                  key={zone.step}
                  className={`rounded-full transition-all duration-300
                    ${currentStep === zone.step
                      ? 'w-5 h-2.5 bg-amber-400'
                      : i < currentIndex
                      ? 'w-2.5 h-2.5 bg-amber-200'
                      : 'w-2.5 h-2.5 bg-stone-200'}
                  `}
                />
              ))}
            </div>

            {/* KOR: 다음/결과 버튼 / ENG: Next/Result button */}
            <button
              onClick={goNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all
                ${canProceed()
                  ? 'bg-linear-to-r from-amber-400 to-yellow-300 text-white shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 hover:-translate-y-0.5'
                  : 'bg-stone-100 text-stone-300 cursor-not-allowed'}
              `}
            >
              {currentStep === 'final-gate' ? '보물 발견! 🏆' : '전진'}
              {currentStep !== 'final-gate' && <ChevronRight size={18} />}
            </button>
          </div>
        )}
      </main>

      {/* ─── 하단 푸터 / Bottom Footer ─── */}
      <footer className="text-center py-4 px-4 border-t border-stone-100 bg-white">
        <p className="text-[10px] text-stone-300">
          잡차자 비자 진단 / JobChaja Visa Diagnosis · Design #25 Maze Runner
        </p>
      </footer>
    </div>
  );
}
