'use client';

// KOR: 스마트홈 스타일의 비자 진단 페이지 (Design #96)
// ENG: Smart Home style visa diagnosis page (Design #96)
// 참조: Apple HomeKit, Google Home, Samsung SmartThings, Alexa, IFTTT
// Reference: Apple HomeKit, Google Home, Samsung SmartThings, Alexa, IFTTT

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
  Home,
  Wifi,
  Zap,
  Globe,
  BookOpen,
  DollarSign,
  Target,
  Star,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  ChevronDown,
  Play,
  CheckCircle,
  Circle,
  Activity,
  Cpu,
  Shield,
  Thermometer,
  Lightbulb,
  Lock,
  Unlock,
  ArrowRight,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

// KOR: 방(카테고리)을 나타내는 타입 정의
// ENG: Type definition representing a room (category)
type RoomId = 'nationality' | 'age' | 'education' | 'fund' | 'goal' | 'priority';

// KOR: 각 방의 설정 정보 인터페이스
// ENG: Interface for each room's configuration info
interface RoomConfig {
  id: RoomId;
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  devices: number;
}

// KOR: 방 그리드 설정 데이터
// ENG: Room grid configuration data
const ROOMS: RoomConfig[] = [
  {
    id: 'nationality',
    label: '국적',
    labelEn: 'Nationality',
    icon: <Globe size={20} />,
    color: 'from-emerald-600/30 to-emerald-900/50',
    glowColor: 'shadow-emerald-500/30',
    devices: 4,
  },
  {
    id: 'age',
    label: '나이',
    labelEn: 'Age',
    icon: <Thermometer size={20} />,
    color: 'from-green-600/30 to-green-900/50',
    glowColor: 'shadow-green-500/30',
    devices: 2,
  },
  {
    id: 'education',
    label: '학력',
    labelEn: 'Education',
    icon: <BookOpen size={20} />,
    color: 'from-teal-600/30 to-teal-900/50',
    glowColor: 'shadow-teal-500/30',
    devices: 3,
  },
  {
    id: 'fund',
    label: '자금',
    labelEn: 'Annual Fund',
    icon: <DollarSign size={20} />,
    color: 'from-cyan-600/30 to-cyan-900/50',
    glowColor: 'shadow-cyan-500/30',
    devices: 3,
  },
  {
    id: 'goal',
    label: '목표',
    labelEn: 'Final Goal',
    icon: <Target size={20} />,
    color: 'from-lime-600/30 to-lime-900/50',
    glowColor: 'shadow-lime-500/30',
    devices: 4,
  },
  {
    id: 'priority',
    label: '우선순위',
    labelEn: 'Priority',
    icon: <Star size={20} />,
    color: 'from-emerald-700/30 to-green-900/50',
    glowColor: 'shadow-emerald-400/30',
    devices: 2,
  },
];

// KOR: 토글 스위치 컴포넌트 — 스마트홈 기기 ON/OFF 스타일
// ENG: Toggle switch component — smart home device ON/OFF style
function DeviceToggle({
  label,
  active,
  onToggle,
  icon,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl border transition-all duration-300 ${
        active
          ? 'bg-emerald-500/20 border-emerald-500/60 shadow-lg shadow-emerald-500/20'
          : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`text-xs ${active ? 'text-emerald-400' : 'text-gray-500'}`}>
          {icon ?? <Circle size={12} />}
        </span>
        <span className={`text-xs font-medium ${active ? 'text-emerald-300' : 'text-gray-400'}`}>
          {label}
        </span>
      </div>
      <div className={`relative w-8 h-4 rounded-full transition-all duration-300 ${active ? 'bg-emerald-500' : 'bg-gray-700'}`}>
        <div
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300 ${
            active ? 'left-4' : 'left-0.5'
          }`}
        />
      </div>
    </button>
  );
}

// KOR: 상태 표시등 컴포넌트 — 스마트홈 기기 상태 인디케이터
// ENG: Status indicator component — smart home device status indicator
function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full shrink-0 ${
        active ? 'bg-emerald-400 shadow-md shadow-emerald-400/60' : 'bg-gray-600'
      }`}
    />
  );
}

// KOR: 비자 경로 카드 컴포넌트 — 자동화 시나리오 스타일
// ENG: Visa pathway card component — automation scenario style
function AutomationScenarioCard({
  pathway,
  index,
}: {
  pathway: RecommendedPathway;
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  // KOR: 점수에 따른 색상 클래스 계산
  // ENG: Calculate color class based on score
  const scoreColorClass =
    pathway.feasibilityScore >= 80
      ? 'text-emerald-400'
      : pathway.feasibilityScore >= 60
      ? 'text-green-400'
      : 'text-yellow-400';

  const borderColorClass =
    pathway.feasibilityScore >= 80
      ? 'border-emerald-500/40'
      : pathway.feasibilityScore >= 60
      ? 'border-green-500/40'
      : 'border-yellow-500/40';

  const bgGlowClass =
    pathway.feasibilityScore >= 80
      ? 'shadow-emerald-500/10'
      : pathway.feasibilityScore >= 60
      ? 'shadow-green-500/10'
      : 'shadow-yellow-500/10';

  return (
    <div
      className={`rounded-2xl border ${borderColorClass} bg-gray-900/80 shadow-lg ${bgGlowClass} overflow-hidden transition-all duration-300`}
    >
      {/* KOR: 자동화 카드 헤더 / ENG: Automation card header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* KOR: 자동화 활성 아이콘 / ENG: Automation active icon */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-800 ${scoreColorClass}`}>
            <Zap size={16} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{pathway.name}</span>
              <span className={`text-xs font-medium ${scoreColorClass}`}>
                {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{pathway.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {/* KOR: 실현 가능성 점수 원형 게이지 / ENG: Feasibility score circular gauge */}
          <div className="relative w-10 h-10">
            <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#1f2937" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={pathway.feasibilityScore >= 80 ? '#10b981' : pathway.feasibilityScore >= 60 ? '#22c55e' : '#eab308'}
                strokeWidth="3"
                strokeDasharray={`${(pathway.feasibilityScore / 100) * 87.96} 87.96`}
                strokeLinecap="round"
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${scoreColorClass}`}>
              {pathway.feasibilityScore}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* KOR: 자동화 세부 정보 (확장 시) / ENG: Automation details (when expanded) */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-800/60">
          {/* KOR: 메타 정보 행 / ENG: Meta information row */}
          <div className="flex gap-4 pt-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock size={12} className="text-emerald-500" />
              <span>{pathway.totalDurationMonths}개월</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <DollarSign size={12} className="text-emerald-500" />
              <span>${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
            </div>
          </div>

          {/* KOR: 비자 체인 — 자동화 트리거처럼 표시 / ENG: Visa chain — displayed like automation triggers */}
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">자동화 시퀀스 · Sequence</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((step, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="bg-gray-800 border border-emerald-500/30 rounded-lg px-2.5 py-1">
                    <span className="text-xs font-bold text-emerald-400">{step.visa}</span>
                    <span className="text-xs text-gray-500 ml-1.5">{step.duration}</span>
                  </div>
                  {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ArrowRight size={12} className="text-emerald-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* KOR: 마일스톤 목록 — IFTTT 레시피처럼 표시 / ENG: Milestone list — displayed like IFTTT recipes */}
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">실행 단계 · Steps</p>
            <div className="space-y-2">
              {pathway.milestones.map((ms, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-800/40 border border-gray-700/30">
                  <span className="text-base shrink-0 leading-none mt-0.5">{ms.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-200">{ms.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{ms.description}</p>
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

// KOR: 방 선택 패널 컴포넌트 — 선택된 방의 기기(조건) 목록을 보여줌
// ENG: Room selection panel component — shows device (condition) list for the selected room
function RoomPanel({
  activeRoom,
  input,
  onUpdate,
}: {
  activeRoom: RoomId;
  input: DiagnosisInput;
  onUpdate: (field: keyof DiagnosisInput, value: string | number) => void;
}) {
  // KOR: 방별 기기(조건) 렌더링
  // ENG: Render devices (conditions) per room
  switch (activeRoom) {
    case 'nationality':
      return (
        <div className="grid grid-cols-3 gap-2">
          {popularCountries.map((c) => (
            <button
              key={c.code}
              onClick={() => onUpdate('nationality', c.name)}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all duration-200 ${
                input.nationality === c.name
                  ? 'bg-emerald-500/20 border-emerald-500/60 shadow-md shadow-emerald-500/20'
                  : 'bg-gray-800/50 border-gray-700/40 hover:border-gray-600'
              }`}
            >
              <span className="text-xl">{c.flag}</span>
              <span className={`text-xs font-medium ${input.nationality === c.name ? 'text-emerald-300' : 'text-gray-400'}`}>
                {c.name}
              </span>
              <StatusDot active={input.nationality === c.name} />
            </button>
          ))}
        </div>
      );

    case 'age':
      return (
        <div className="space-y-3">
          {/* KOR: 나이 슬라이더 — 스마트 온도계 스타일 / ENG: Age slider — smart thermostat style */}
          <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700/40">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-400">현재 설정값 · Current</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-emerald-400">{input.age}</span>
                <span className="text-sm text-gray-500">세</span>
              </div>
            </div>
            <input
              type="range"
              min={18}
              max={65}
              value={input.age}
              onChange={(e) => onUpdate('age', parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${((input.age - 18) / (65 - 18)) * 100}%, #374151 ${((input.age - 18) / (65 - 18)) * 100}%, #374151 100%)`,
              }}
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-600">18세</span>
              <span className="text-xs text-gray-600">65세</span>
            </div>
          </div>
          {/* KOR: 나이 범위 빠른 선택 버튼들 / ENG: Age range quick-select buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[20, 25, 30, 35].map((age) => (
              <button
                key={age}
                onClick={() => onUpdate('age', age)}
                className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                  input.age === age
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-gray-800/50 border-gray-700/40 text-gray-500 hover:border-gray-600'
                }`}
              >
                {age}세
              </button>
            ))}
          </div>
        </div>
      );

    case 'education':
      return (
        <div className="space-y-2">
          {educationOptions.map((edu) => (
            <DeviceToggle
              key={edu}
              label={edu}
              active={input.educationLevel === edu}
              onToggle={() => onUpdate('educationLevel', edu)}
              icon={<BookOpen size={12} />}
            />
          ))}
        </div>
      );

    case 'fund':
      return (
        <div className="space-y-2">
          {fundOptions.map((fund) => (
            <DeviceToggle
              key={fund}
              label={fund}
              active={input.availableAnnualFund === fund}
              onToggle={() => onUpdate('availableAnnualFund', fund)}
              icon={<DollarSign size={12} />}
            />
          ))}
        </div>
      );

    case 'goal':
      return (
        <div className="space-y-2">
          {goalOptions.map((goal) => (
            <DeviceToggle
              key={goal}
              label={goal}
              active={input.finalGoal === goal}
              onToggle={() => onUpdate('finalGoal', goal)}
              icon={<Target size={12} />}
            />
          ))}
        </div>
      );

    case 'priority':
      return (
        <div className="space-y-2">
          {priorityOptions.map((priority) => (
            <DeviceToggle
              key={priority}
              label={priority}
              active={input.priorityPreference === priority}
              onToggle={() => onUpdate('priorityPreference', priority)}
              icon={<Star size={12} />}
            />
          ))}
        </div>
      );

    default:
      return null;
  }
}

// KOR: 완성도 계산 함수 — 입력된 필드 수 / 전체 필드 수
// ENG: Completion rate calculation — filled fields / total fields
function calcCompletion(input: DiagnosisInput): number {
  const fields: (keyof DiagnosisInput)[] = [
    'nationality',
    'age',
    'educationLevel',
    'availableAnnualFund',
    'finalGoal',
    'priorityPreference',
  ];
  const filled = fields.filter((f) => {
    const val = input[f];
    if (typeof val === 'number') return val > 0;
    return !!val;
  });
  return Math.round((filled.length / fields.length) * 100);
}

// KOR: 메인 스마트홈 비자 진단 페이지 컴포넌트
// ENG: Main Smart Home visa diagnosis page component
export default function Diagnosis96Page() {
  // KOR: 입력 상태 — mockInput 초기값으로 시작
  // ENG: Input state — start with mockInput default values
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });

  // KOR: 현재 선택된 방(카테고리) 상태
  // ENG: Currently selected room (category) state
  const [activeRoom, setActiveRoom] = useState<RoomId>('nationality');

  // KOR: 진단 결과 표시 여부 상태
  // ENG: Whether to show diagnosis results state
  const [showResults, setShowResults] = useState(false);

  // KOR: 시스템 상태 (연결 중 / 분석 중)
  // ENG: System status (connecting / analyzing)
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // KOR: 결과 데이터 (분석 후 mockDiagnosisResult 사용)
  // ENG: Result data (uses mockDiagnosisResult after analysis)
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 입력값 업데이트 핸들러
  // ENG: Input value update handler
  const handleUpdate = (field: keyof DiagnosisInput, value: string | number) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  // KOR: 진단 실행 핸들러 — 분석 애니메이션 후 결과 표시
  // ENG: Diagnosis run handler — shows results after analysis animation
  const handleRunDiagnosis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult(mockDiagnosisResult);
      setShowResults(true);
    }, 2000);
  };

  // KOR: 입력 화면으로 리셋
  // ENG: Reset to input screen
  const handleReset = () => {
    setShowResults(false);
    setResult(null);
    setInput({ ...mockInput });
  };

  const completion = calcCompletion(input);
  const activeRoomConfig = ROOMS.find((r) => r.id === activeRoom);

  // KOR: 분석 중 화면 — 스마트홈 연결 중 스타일
  // ENG: Analyzing screen — smart home connecting style
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          {/* KOR: 회전 분석 인디케이터 / ENG: Rotating analysis indicator */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-emerald-400/40 animate-pulse" />
            <div className="w-24 h-24 rounded-full border-t-2 border-emerald-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu size={28} className="text-emerald-400" />
            </div>
          </div>
          <div>
            <p className="text-emerald-400 font-semibold text-lg">스마트 비자 분석 중</p>
            <p className="text-gray-500 text-sm mt-1">Analyzing visa pathways...</p>
          </div>
          <div className="flex gap-1.5 justify-center">
            {[0, 0.2, 0.4].map((delay, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // KOR: 결과 화면 — 자동화 시나리오 스타일
  // ENG: Results screen — automation scenario style
  if (showResults && result) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        {/* KOR: 결과 헤더 / ENG: Result header */}
        <div className="bg-gray-900/90 border-b border-gray-800 px-5 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Activity size={16} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest">자동화 결과 · Automation Results</p>
                <p className="text-sm font-bold text-white">비자 경로 시나리오</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-400 hover:border-gray-600 transition-colors"
            >
              <Home size={12} />
              <span>홈으로</span>
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-5 py-6 space-y-4">
          {/* KOR: 분석 요약 대시보드 / ENG: Analysis summary dashboard */}
          <div className="bg-gray-900/80 border border-emerald-500/20 rounded-2xl p-5 shadow-lg shadow-emerald-500/5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={16} className="text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">분석 완료 · Analysis Complete</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{result.pathways.length}</p>
                <p className="text-xs text-gray-500 mt-1">추천 경로</p>
              </div>
              <div className="text-center border-x border-gray-800">
                <p className="text-2xl font-bold text-green-400">
                  {Math.max(...result.pathways.map((p) => p.feasibilityScore))}
                </p>
                <p className="text-xs text-gray-500 mt-1">최고 점수</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-teal-400">
                  {Math.min(...result.pathways.map((p) => p.totalDurationMonths))}
                </p>
                <p className="text-xs text-gray-500 mt-1">최단 기간(개월)</p>
              </div>
            </div>
          </div>

          {/* KOR: 입력 요약 칩들 / ENG: Input summary chips */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <Globe size={10} />, value: result.userInput.nationality },
              { icon: <Thermometer size={10} />, value: `${result.userInput.age}세` },
              { icon: <BookOpen size={10} />, value: result.userInput.educationLevel },
              { icon: <DollarSign size={10} />, value: result.userInput.availableAnnualFund },
            ].map((chip, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-800/80 border border-gray-700/60 text-xs text-gray-400"
              >
                <span className="text-emerald-500">{chip.icon}</span>
                <span>{chip.value}</span>
              </div>
            ))}
          </div>

          {/* KOR: 자동화 시나리오 카드 목록 / ENG: Automation scenario card list */}
          <div className="space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-widest px-1">
              추천 자동화 시나리오 · Recommended Scenarios
            </p>
            {result.pathways.map((pathway, index) => (
              <AutomationScenarioCard key={pathway.id} pathway={pathway} index={index} />
            ))}
          </div>

          {/* KOR: 호환 가능 경로 요약 / ENG: Compatible pathway summary */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
              호환 검사 결과 · Compatibility Check
            </p>
            <div className="space-y-2">
              {mockPathways.map((p: CompatPathway) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusDot active={true} />
                    <span className="text-xs text-gray-300">{p.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {((p as any).tags ?? (p as any).highlights ?? []).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded-md bg-emerald-900/30 border border-emerald-800/40 text-xs text-emerald-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // KOR: 입력 화면 — 스마트홈 대시보드 스타일
  // ENG: Input screen — smart home dashboard style
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* KOR: 상단 스마트홈 헤더 바 / ENG: Top smart home header bar */}
      <div className="bg-gray-900/95 border-b border-gray-800/80 px-5 py-3.5 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* KOR: 브랜드 + 시스템 상태 / ENG: Brand + system status */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Home size={14} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-none">잡차자 스마트 비자</p>
              <p className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                시스템 연결됨 · Connected
              </p>
            </div>
          </div>
          {/* KOR: 완성도 인디케이터 / ENG: Completion indicator */}
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-linear-to-br from-emerald-400 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <span className="text-xs text-emerald-400 font-mono">{completion}%</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-5 space-y-5">
        {/* KOR: 시스템 상태 대시보드 — 홈 요약 / ENG: System status dashboard — home summary */}
        <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-widest">스마트 홈 · Smart Hub</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Wifi size={11} />
              <span>온라인</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {/* KOR: 입력된 방 수 / ENG: Number of configured rooms */}
            <div className="bg-gray-800/60 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-emerald-400">
                {Math.round(completion / (100 / 6))}
                <span className="text-sm text-gray-600">/6</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">구성된 방</p>
            </div>
            {/* KOR: 활성 기기 수 / ENG: Number of active devices */}
            <div className="bg-gray-800/60 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-green-400">{activeRoomConfig?.devices ?? 0}</p>
              <p className="text-xs text-gray-500 mt-1">현재 기기</p>
            </div>
            {/* KOR: 예상 자동화 / ENG: Expected automations */}
            <div className="bg-gray-800/60 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-teal-400">3</p>
              <p className="text-xs text-gray-500 mt-1">자동화 수</p>
            </div>
          </div>
        </div>

        {/* KOR: 방 그리드 — 카테고리 선택 UI / ENG: Room grid — category selection UI */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 px-1">
            방 선택 · Select Room
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {ROOMS.map((room) => {
              const isActive = activeRoom === room.id;
              // KOR: 각 방의 입력 완료 여부 판별
              // ENG: Determine if each room's input is complete
              const isConfigured = (() => {
                switch (room.id) {
                  case 'nationality': return !!input.nationality;
                  case 'age': return input.age > 0;
                  case 'education': return !!input.educationLevel;
                  case 'fund': return !!input.availableAnnualFund;
                  case 'goal': return !!input.finalGoal;
                  case 'priority': return !!input.priorityPreference;
                }
              })();
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room.id)}
                  className={`relative rounded-2xl p-4 border transition-all duration-300 text-left ${
                    isActive
                      ? `bg-linear-to-br ${room.color} border-emerald-500/50 shadow-lg ${room.glowColor}`
                      : 'bg-gray-900/60 border-gray-800/60 hover:border-gray-700'
                  }`}
                >
                  {/* KOR: 구성 완료 표시 / ENG: Configuration complete indicator */}
                  {isConfigured && !isActive && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/60" />
                    </div>
                  )}
                  <div className={`mb-2 ${isActive ? 'text-emerald-300' : 'text-gray-500'}`}>
                    {room.icon}
                  </div>
                  <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {room.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${isActive ? 'text-emerald-400' : 'text-gray-600'}`}>
                    {room.labelEn}
                  </p>
                  {/* KOR: 기기 수 표시 / ENG: Device count display */}
                  <div className={`mt-2 flex items-center gap-1 text-xs ${isActive ? 'text-emerald-400/70' : 'text-gray-600'}`}>
                    <Lightbulb size={10} />
                    <span>{room.devices} 기기</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* KOR: 선택된 방의 기기(조건) 패널 / ENG: Device (condition) panel for selected room */}
        <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl overflow-hidden">
          {/* KOR: 방 패널 헤더 / ENG: Room panel header */}
          <div className={`px-4 py-3 bg-linear-to-br ${activeRoomConfig?.color ?? ''} border-b border-gray-800/40`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-300">{activeRoomConfig?.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{activeRoomConfig?.label}</p>
                  <p className="text-xs text-emerald-400/70">{activeRoomConfig?.labelEn}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                {(() => {
                  const isRoomConfigured = (() => {
                    switch (activeRoom) {
                      case 'nationality': return !!input.nationality;
                      case 'age': return input.age > 0;
                      case 'education': return !!input.educationLevel;
                      case 'fund': return !!input.availableAnnualFund;
                      case 'goal': return !!input.finalGoal;
                      case 'priority': return !!input.priorityPreference;
                    }
                  })();
                  return isRoomConfigured ? (
                    <>
                      <Unlock size={12} className="text-emerald-400" />
                      <span className="text-emerald-400">설정됨</span>
                    </>
                  ) : (
                    <>
                      <Lock size={12} className="text-gray-500" />
                      <span className="text-gray-500">미설정</span>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
          <div className="p-4">
            <RoomPanel activeRoom={activeRoom} input={input} onUpdate={handleUpdate} />
          </div>
        </div>

        {/* KOR: 현재 설정 요약 — 스마트홈 자동화 트리거처럼 표시
            ENG: Current settings summary — displayed like smart home automation triggers */}
        <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
            현재 설정 요약 · Current Config
          </p>
          <div className="space-y-2">
            {[
              { label: '국적 · Nationality', value: input.nationality, icon: <Globe size={12} /> },
              { label: '나이 · Age', value: `${input.age}세`, icon: <Thermometer size={12} /> },
              { label: '학력 · Education', value: input.educationLevel, icon: <BookOpen size={12} /> },
              { label: '자금 · Fund', value: input.availableAnnualFund, icon: <DollarSign size={12} /> },
              { label: '목표 · Goal', value: input.finalGoal, icon: <Target size={12} /> },
              { label: '우선순위 · Priority', value: input.priorityPreference, icon: <Star size={12} /> },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-800/40 last:border-0">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-emerald-600">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDot active={!!item.value} />
                  <span className={`text-xs font-medium ${item.value ? 'text-gray-200' : 'text-gray-600'}`}>
                    {item.value || '미설정'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KOR: 진단 실행 버튼 — IFTTT "Run Applet" 스타일
            ENG: Diagnosis run button — IFTTT "Run Applet" style */}
        <div className="pb-8">
          {completion < 100 && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-yellow-900/20 border border-yellow-700/30 mb-3">
              <AlertCircle size={14} className="text-yellow-500 shrink-0" />
              <p className="text-xs text-yellow-500">
                모든 방을 설정해야 자동화를 실행할 수 있습니다. ({Math.round(completion / (100/6))}/6 완료)
              </p>
            </div>
          )}
          <button
            onClick={handleRunDiagnosis}
            disabled={completion < 50}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 ${
              completion >= 50
                ? 'bg-linear-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
            }`}
          >
            <Play size={18} className={completion >= 50 ? 'text-white' : 'text-gray-600'} />
            <span>자동화 실행 · Run Automation</span>
            {completion >= 50 && <ArrowRight size={16} />}
          </button>
          <p className="text-center text-xs text-gray-600 mt-2">
            비자 경로를 자동으로 분석합니다 · Automatically analyzes visa pathways
          </p>
        </div>
      </div>
    </div>
  );
}
