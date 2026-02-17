'use client';

// KOR: 비자 진단 - 디자인 #14: 슬라이더 폼 (Spotify/Ableton 감성의 다크 테마 인터랙티브 폼)
// ENG: Visa Diagnosis - Design #14: Slider Form (Dark theme interactive form with Spotify/Ableton aesthetics)

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Globe,
  GraduationCap,
  DollarSign,
  Target,
  Star,
  Play,
  BarChart2,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  RefreshCw,
  Volume2,
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

// KOR: 슬라이더 단계별 정의 인터페이스
// ENG: Interface defining each slider step
interface SliderStep {
  id: keyof DiagnosisInput;
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  type: 'slider' | 'toggle-group' | 'country-select';
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
}

// KOR: 국가 선택 상태 타입
// ENG: Country selection state type
type CountryEntry = { code: string; name: string; flag: string };

// KOR: 커스텀 슬라이더 컴포넌트 - Spotify 그린 트랙
// ENG: Custom slider component - Spotify green track
function GreenSlider({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="w-full">
      {/* KOR: 현재 값 표시 / ENG: Current value display */}
      <div className="flex justify-between mb-3 text-sm">
        <span className="text-gray-400">{min}{label}</span>
        <span className="text-[#1DB954] font-bold text-lg">{value}{label}</span>
        <span className="text-gray-400">{max}{label}</span>
      </div>
      {/* KOR: 슬라이더 트랙 래퍼 / ENG: Slider track wrapper */}
      <div className="relative h-2 w-full rounded-full bg-[#404040]">
        {/* KOR: 채워진 트랙 (Spotify 그린) / ENG: Filled track (Spotify green) */}
        <div
          className="absolute h-full rounded-full bg-[#1DB954] transition-all duration-100"
          style={{ width: `${pct}%` }}
        />
        {/* KOR: 슬라이더 핸들 / ENG: Slider handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-lg border-2 border-[#1DB954] cursor-pointer transition-all duration-100"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      {/* KOR: 틱 마크 / ENG: Tick marks */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: 5 }, (_, i) => {
          const tickVal = min + Math.round((i / 4) * (max - min));
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="w-px h-2 bg-[#404040]" />
              <span className="text-[10px] text-gray-600 mt-1">{tickVal}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// KOR: 토글 그룹 컴포넌트 - 슬라이더처럼 선택하는 버튼 그룹
// ENG: Toggle group component - button group that works like sliders
function ToggleGroup({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="w-full space-y-2">
      {options.map((opt, idx) => {
        const isSelected = selected === opt;
        // KOR: 선택 퍼센티지 계산 (이퀄라이저 바 시각화용)
        // ENG: Calculate selection percentage (for equalizer bar visualization)
        const barWidth = isSelected ? 100 : Math.max(15, 100 - idx * 18);
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`w-full relative flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left overflow-hidden ${
              isSelected
                ? 'border-[#1DB954] bg-[#1DB954]/10'
                : 'border-[#404040] bg-[#2a2a2a] hover:border-[#606060]'
            }`}
          >
            {/* KOR: 배경 바 (이퀄라이저 느낌) / ENG: Background bar (equalizer effect) */}
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                isSelected ? 'bg-[#1DB954]/20' : 'bg-[#303030]'
              }`}
              style={{ width: `${barWidth}%` }}
            />
            {/* KOR: 이퀄라이저 아이콘 / ENG: Equalizer icon */}
            <div className="relative flex items-center gap-1 shrink-0">
              {[3, 5, 4, 6, 3].map((h, i) => (
                <div
                  key={i}
                  className={`w-0.5 rounded-full transition-all duration-300 ${
                    isSelected ? 'bg-[#1DB954]' : 'bg-[#505050]'
                  }`}
                  style={{ height: `${isSelected ? h * 3 : h}px` }}
                />
              ))}
            </div>
            {/* KOR: 옵션 텍스트 / ENG: Option text */}
            <span className={`relative text-sm font-medium z-10 ${isSelected ? 'text-[#1DB954]' : 'text-gray-300'}`}>
              {opt}
            </span>
            {/* KOR: 체크 인디케이터 / ENG: Check indicator */}
            {isSelected && (
              <CheckCircle className="relative ml-auto shrink-0 w-4 h-4 text-[#1DB954]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// KOR: 국가 선택 그리드 컴포넌트
// ENG: Country selection grid component
function CountryGrid({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      {popularCountries.map((c: CountryEntry) => {
        const isSelected = selected === c.name;
        return (
          <button
            key={c.code}
            onClick={() => onSelect(c.name)}
            className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-200 overflow-hidden ${
              isSelected
                ? 'border-[#1DB954] bg-[#1DB954]/10'
                : 'border-[#404040] bg-[#2a2a2a] hover:border-[#606060]'
            }`}
          >
            {/* KOR: 배경 pulse 효과 / ENG: Background pulse effect */}
            {isSelected && (
              <div className="absolute inset-0 bg-[#1DB954]/5 animate-pulse rounded-xl" />
            )}
            <span className="text-2xl relative">{c.flag}</span>
            <span className={`text-xs font-medium relative ${isSelected ? 'text-[#1DB954]' : 'text-gray-400'}`}>
              {c.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// KOR: 이퀄라이저 바 차트 컴포넌트 (결과 화면용)
// ENG: Equalizer bar chart component (for results screen)
function EqualizerBar({
  score,
  label,
  color,
  animDelay,
}: {
  score: number;
  label: string;
  color: string;
  animDelay: number;
}) {
  const bars = 12;
  const activeCount = Math.round((score / 100) * bars);
  return (
    <div className="flex flex-col items-center gap-2">
      {/* KOR: 이퀄라이저 바 그룹 / ENG: Equalizer bar group */}
      <div className="flex items-end gap-0.5 h-20">
        {Array.from({ length: bars }, (_, i) => {
          const isActive = i < activeCount;
          // KOR: 바 높이 변화로 이퀄라이저 느낌 부여
          // ENG: Vary bar height to give equalizer feel
          const heights = [4, 6, 8, 10, 12, 14, 16, 14, 12, 10, 8, 6];
          return (
            <div
              key={i}
              className={`w-2 rounded-sm transition-all duration-700 ${
                isActive ? color : 'bg-[#303030]'
              }`}
              style={{
                height: `${isActive ? heights[i] * (score / 70) : heights[i] * 0.4}px`,
                transitionDelay: `${animDelay + i * 30}ms`,
              }}
            />
          );
        })}
      </div>
      <span className="text-xs text-gray-500 text-center max-w-16 leading-tight">{label}</span>
    </div>
  );
}

// KOR: 결과 경로 카드 컴포넌트
// ENG: Result pathway card component
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
  // KOR: 순위에 따른 색상 맵핑
  // ENG: Color mapping based on rank
  const rankColors: Record<number, string> = {
    1: 'text-[#1DB954] border-[#1DB954]',
    2: 'text-blue-400 border-blue-400',
    3: 'text-yellow-400 border-yellow-400',
    4: 'text-orange-400 border-orange-400',
    5: 'text-purple-400 border-purple-400',
  };
  const rankBg: Record<number, string> = {
    1: 'bg-[#1DB954]/10',
    2: 'bg-blue-500/10',
    3: 'bg-yellow-500/10',
    4: 'bg-orange-500/10',
    5: 'bg-purple-500/10',
  };
  const barColor: Record<number, string> = {
    1: 'bg-[#1DB954]',
    2: 'bg-blue-500',
    3: 'bg-yellow-500',
    4: 'bg-orange-500',
    5: 'bg-purple-500',
  };

  const color = rankColors[rank] ?? 'text-gray-400 border-gray-400';
  const bg = rankBg[rank] ?? 'bg-gray-500/10';
  const bar = barColor[rank] ?? 'bg-gray-500';

  return (
    <div className={`rounded-2xl border ${color.split(' ')[1]} ${bg} overflow-hidden transition-all duration-300`}>
      {/* KOR: 카드 헤더 / ENG: Card header */}
      <button
        className="w-full p-4 flex items-center gap-4 text-left"
        onClick={onToggle}
      >
        {/* KOR: 순위 배지 / ENG: Rank badge */}
        <div className={`shrink-0 w-10 h-10 rounded-full border-2 ${color} flex items-center justify-center font-bold text-sm`}>
          {rank}
        </div>
        {/* KOR: 경로 정보 / ENG: Pathway info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-semibold text-white truncate">{pathway.name}</span>
            <span className="shrink-0 text-sm">{getFeasibilityEmoji(pathway.feasibilityLabel)}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* KOR: 미니 이퀄라이저 바 (점수 시각화) / ENG: Mini equalizer bar (score visualization) */}
            <div className="flex items-end gap-0.5 h-4">
              {[30, 60, 80, 100, 80, 60, 40, 60, 80, pathway.feasibilityScore].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-sm ${i < Math.round(pathway.feasibilityScore / 10) ? bar : 'bg-[#404040]'}`}
                  style={{ height: `${(h / 100) * 16}px` }}
                />
              ))}
            </div>
            <span className={`text-sm font-bold ${color.split(' ')[0]}`}>{pathway.feasibilityScore}%</span>
            <span className="text-xs text-gray-500">{pathway.feasibilityLabel}</span>
          </div>
        </div>
        {/* KOR: 요약 정보 / ENG: Summary info */}
        <div className="shrink-0 text-right">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1 justify-end">
            <Clock className="w-3 h-3" />
            {pathway.totalDurationMonths}개월
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1 justify-end">
            <DollarSign className="w-3 h-3" />
            ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
          </div>
        </div>
        {/* KOR: 펼치기/접기 아이콘 / ENG: Expand/collapse icon */}
        <ChevronRight
          className={`shrink-0 w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
        />
      </button>

      {/* KOR: 확장된 상세 정보 / ENG: Expanded detail info */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-[#404040] pt-4">
          {/* KOR: 설명 / ENG: Description */}
          <p className="text-sm text-gray-300 leading-relaxed">{pathway.description}</p>

          {/* KOR: 비자 체인 시각화 / ENG: Visa chain visualization */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">비자 경로 / Visa Chain</h4>
            <div className="flex items-center flex-wrap gap-2">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((vc, i) => (
                <React.Fragment key={i}>
                  <div className={`px-3 py-1.5 rounded-lg border ${color.split(' ')[1]} ${bg} text-center`}>
                    <div className={`text-sm font-bold ${color.split(' ')[0]}`}>{vc.visa}</div>
                    <div className="text-xs text-gray-500">{vc.duration}</div>
                  </div>
                  {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* KOR: 마일스톤 / ENG: Milestones */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">주요 단계 / Milestones</h4>
            <div className="space-y-2">
              {pathway.milestones.map((ms, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#1a1a1a] rounded-lg p-3">
                  <span className="shrink-0 text-xl">{ms.emoji}</span>
                  <div>
                    <div className="text-sm font-semibold text-white mb-0.5">{ms.title}</div>
                    <div className="text-xs text-gray-400 leading-relaxed">{ms.description}</div>
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

// KOR: 진행 바 애니메이션 컴포넌트 (Spotify 로딩 바 스타일)
// ENG: Progress bar animation component (Spotify loading bar style)
function ProgressTrack({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="w-full">
      {/* KOR: 트랙 레이블 / ENG: Track label */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500">STEP {currentStep + 1} / {totalSteps}</span>
        <span className="text-xs text-[#1DB954]">{Math.round(((currentStep) / totalSteps) * 100)}%</span>
      </div>
      {/* KOR: 프로그레스 트랙 / ENG: Progress track */}
      <div className="relative h-1 w-full bg-[#404040] rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-[#1DB954] rounded-full transition-all duration-500"
          style={{ width: `${((currentStep) / totalSteps) * 100}%` }}
        />
        {/* KOR: 재생 헤드 포인터 / ENG: Playhead pointer */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-[#1DB954]/50 transition-all duration-500"
          style={{ left: `calc(${((currentStep) / totalSteps) * 100}% - 6px)` }}
        />
      </div>
      {/* KOR: 틱 마크 / ENG: Tick marks */}
      <div className="flex justify-between mt-1">
        {Array.from({ length: totalSteps + 1 }, (_, i) => (
          <div
            key={i}
            className={`w-px h-1.5 ${i <= currentStep ? 'bg-[#1DB954]' : 'bg-[#404040]'}`}
          />
        ))}
      </div>
    </div>
  );
}

// KOR: 분석 중 애니메이션 컴포넌트 (이퀄라이저 시각화)
// ENG: Analyzing animation component (equalizer visualization)
function AnalyzingScreen() {
  const bars = [8, 14, 10, 16, 12, 18, 10, 14, 8, 16, 12, 10, 14, 8, 16];
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-8">
      {/* KOR: 이퀄라이저 애니메이션 / ENG: Equalizer animation */}
      <div className="flex items-end gap-1 h-20">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-3 bg-[#1DB954] rounded-sm"
            style={{
              height: `${h * 4}px`,
              animation: `equalizerPulse 0.8s ease-in-out ${i * 0.05}s infinite alternate`,
            }}
          />
        ))}
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">비자 경로 분석 중...</h3>
        <p className="text-gray-400 text-sm">Analyzing your visa pathway...</p>
      </div>
      <style jsx>{`
        @keyframes equalizerPulse {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

// KOR: 메인 페이지 컴포넌트
// ENG: Main page component
export default function Diagnosis14Page() {
  // KOR: 현재 단계 상태 (0-5: 입력 단계, 6: 분석 중, 7: 결과)
  // ENG: Current step state (0-5: input steps, 6: analyzing, 7: results)
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [expandedPathway, setExpandedPathway] = useState<string | null>('path-1');

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [nationality, setNationality] = useState('');
  const [age, setAge] = useState(25);
  const [educationLevel, setEducationLevel] = useState('');
  const [availableAnnualFund, setAvailableAnnualFund] = useState('');
  const [finalGoal, setFinalGoal] = useState('');
  const [priorityPreference, setPriorityPreference] = useState('');

  // KOR: 결과 데이터 (목업 사용)
  // ENG: Result data (using mock)
  const [result] = useState<DiagnosisResult>(mockDiagnosisResult);

  // KOR: 입력 단계 정의
  // ENG: Input step definitions
  const steps: SliderStep[] = [
    {
      id: 'nationality',
      label: '국적',
      labelEn: 'Nationality',
      icon: <Globe className="w-5 h-5" />,
      type: 'country-select',
    },
    {
      id: 'age',
      label: '나이',
      labelEn: 'Age',
      icon: <Volume2 className="w-5 h-5" />,
      type: 'slider',
      min: 18,
      max: 60,
      unit: '세',
    },
    {
      id: 'educationLevel',
      label: '최종 학력',
      labelEn: 'Education Level',
      icon: <GraduationCap className="w-5 h-5" />,
      type: 'toggle-group',
      options: educationOptions,
    },
    {
      id: 'availableAnnualFund',
      label: '연간 가용 자금',
      labelEn: 'Annual Available Fund',
      icon: <DollarSign className="w-5 h-5" />,
      type: 'toggle-group',
      options: fundOptions,
    },
    {
      id: 'finalGoal',
      label: '최종 목표',
      labelEn: 'Final Goal',
      icon: <Target className="w-5 h-5" />,
      type: 'toggle-group',
      options: goalOptions,
    },
    {
      id: 'priorityPreference',
      label: '우선순위',
      labelEn: 'Priority Preference',
      icon: <Star className="w-5 h-5" />,
      type: 'toggle-group',
      options: priorityOptions,
    },
  ];

  const totalSteps = steps.length;

  // KOR: 현재 단계의 값 가져오기
  // ENG: Get current step value
  const getCurrentValue = (): string | number => {
    switch (steps[currentStep]?.id) {
      case 'nationality': return nationality;
      case 'age': return age;
      case 'educationLevel': return educationLevel;
      case 'availableAnnualFund': return availableAnnualFund;
      case 'finalGoal': return finalGoal;
      case 'priorityPreference': return priorityPreference;
      default: return '';
    }
  };

  // KOR: 현재 단계 값 설정하기
  // ENG: Set current step value
  const setCurrentValue = (val: string | number) => {
    switch (steps[currentStep]?.id) {
      case 'nationality': setNationality(String(val)); break;
      case 'age': setAge(Number(val)); break;
      case 'educationLevel': setEducationLevel(String(val)); break;
      case 'availableAnnualFund': setAvailableAnnualFund(String(val)); break;
      case 'finalGoal': setFinalGoal(String(val)); break;
      case 'priorityPreference': setPriorityPreference(String(val)); break;
    }
  };

  // KOR: 다음 단계로 이동
  // ENG: Move to next step
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // KOR: 마지막 단계 → 분석 시작
      // ENG: Last step → start analysis
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResult(true);
      }, 2500);
    }
  };

  // KOR: 이전 단계로 이동
  // ENG: Move to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  // KOR: 다음 버튼 활성화 여부
  // ENG: Whether next button is enabled
  const isNextEnabled = (): boolean => {
    const val = getCurrentValue();
    if (steps[currentStep]?.id === 'age') return true; // 나이는 항상 유효
    return String(val).trim().length > 0;
  };

  // KOR: 처음으로 재시작
  // ENG: Restart from beginning
  const handleRestart = () => {
    setCurrentStep(0);
    setShowResult(false);
    setIsAnalyzing(false);
    setNationality('');
    setAge(25);
    setEducationLevel('');
    setAvailableAnnualFund('');
    setFinalGoal('');
    setPriorityPreference('');
    setExpandedPathway('path-1');
  };

  // KOR: 경로 토글
  // ENG: Toggle pathway expansion
  const handlePathwayToggle = (id: string) => {
    setExpandedPathway((prev) => (prev === id ? null : id));
  };

  // KOR: 현재 단계 정보
  // ENG: Current step info
  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* KOR: 상단 바 (Spotify 스타일 플레이어 헤더) */}
      {/* ENG: Top bar (Spotify style player header) */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-[#282828] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {/* KOR: 로고 및 타이틀 / ENG: Logo and title */}
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-black" />
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-none">JobChaJa</div>
              <div className="text-[10px] text-[#1DB954] leading-none">비자 진단 / Visa Diagnosis</div>
            </div>
          </div>
          {/* KOR: 재생 상태 표시 (이퀄라이저 바) / ENG: Playback status (equalizer bars) */}
          {!showResult && !isAnalyzing && (
            <div className="flex items-end gap-0.5 h-4">
              {[2, 4, 3, 5, 3, 4, 2].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#1DB954] rounded-sm"
                  style={{
                    height: `${h * 3}px`,
                    animation: `equalizerAnim 0.6s ease-in-out ${i * 0.1}s infinite alternate`,
                  }}
                />
              ))}
            </div>
          )}
          {/* KOR: 디자인 번호 뱃지 / ENG: Design number badge */}
          <div className="px-2 py-1 bg-[#282828] rounded text-xs text-gray-400">#14</div>
        </div>
      </header>

      {/* KOR: 메인 콘텐츠 / ENG: Main content */}
      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 pb-8">
        {/* KOR: 분석 중 화면 / ENG: Analyzing screen */}
        {isAnalyzing && (
          <div className="flex-1 flex items-center justify-center">
            <AnalyzingScreen />
          </div>
        )}

        {/* KOR: 결과 화면 / ENG: Result screen */}
        {showResult && !isAnalyzing && (
          <div className="py-6 space-y-6">
            {/* KOR: 결과 헤더 / ENG: Result header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1DB954]/20 border border-[#1DB954]/40 rounded-full mb-4">
                <Play className="w-3 h-3 text-[#1DB954]" />
                <span className="text-xs text-[#1DB954] font-semibold">ANALYSIS COMPLETE</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">비자 경로 분석 완료</h2>
              <p className="text-gray-400 text-sm">Your personalized visa pathways are ready</p>
            </div>

            {/* KOR: 이퀄라이저 차트 (상위 3개 경로 점수 시각화) */}
            {/* ENG: Equalizer chart (top 3 pathway score visualization) */}
            <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#282828]">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="w-4 h-4 text-[#1DB954]" />
                <span className="text-sm font-semibold text-gray-300">경로별 실현 가능성 / Feasibility by Pathway</span>
              </div>
              <div className="flex items-end justify-around gap-4">
                {result.pathways.map((pw, idx) => (
                  <EqualizerBar
                    key={pw.id}
                    score={pw.feasibilityScore}
                    label={`#${idx + 1}`}
                    color={['bg-[#1DB954]', 'bg-blue-500', 'bg-yellow-500'][idx] ?? 'bg-gray-500'}
                    animDelay={idx * 150}
                  />
                ))}
              </div>
              {/* KOR: 범례 / ENG: Legend */}
              <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-[#282828]">
                {result.pathways.map((pw, idx) => (
                  <div key={pw.id} className="flex items-center gap-1.5">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        ['bg-[#1DB954]', 'bg-blue-500', 'bg-yellow-500'][idx] ?? 'bg-gray-500'
                      }`}
                    />
                    <span className="text-xs text-gray-400 truncate max-w-28">{pw.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KOR: 입력 요약 칩 / ENG: Input summary chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: '🌏', label: nationality || mockInput.nationality },
                { icon: '👤', label: `${age}세` },
                { icon: '🎓', label: educationLevel || mockInput.educationLevel },
                { icon: '💰', label: availableAnnualFund || mockInput.availableAnnualFund },
                { icon: '🎯', label: finalGoal || mockInput.finalGoal },
                { icon: '⭐', label: priorityPreference || mockInput.priorityPreference },
              ].map((chip, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#282828] rounded-full border border-[#383838]">
                  <span className="text-xs">{chip.icon}</span>
                  <span className="text-xs text-gray-300 truncate max-w-32">{chip.label}</span>
                </div>
              ))}
            </div>

            {/* KOR: 통계 요약 바 / ENG: Stats summary bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#1a1a1a] rounded-xl p-3 text-center border border-[#282828]">
                <div className="text-[#1DB954] font-bold text-xl">{result.pathways.length}</div>
                <div className="text-xs text-gray-500 mt-0.5">추천 경로</div>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-3 text-center border border-[#282828]">
                <div className="text-blue-400 font-bold text-xl">
                  {result.pathways[0]?.feasibilityScore ?? 0}%
                </div>
                <div className="text-xs text-gray-500 mt-0.5">최고 가능성</div>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-3 text-center border border-[#282828]">
                <div className="text-yellow-400 font-bold text-xl">
                  {result.pathways[0]?.totalDurationMonths ?? 0}개월
                </div>
                <div className="text-xs text-gray-500 mt-0.5">최단 기간</div>
              </div>
            </div>

            {/* KOR: 경로 카드 목록 / ENG: Pathway card list */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#1DB954]" />
                <span className="text-sm font-semibold text-gray-300">추천 비자 경로 / Recommended Pathways</span>
              </div>
              <div className="space-y-3">
                {result.pathways.map((pw, idx) => (
                  <PathwayCard
                    key={pw.id}
                    pathway={pw}
                    rank={idx + 1}
                    isExpanded={expandedPathway === pw.id}
                    onToggle={() => handlePathwayToggle(pw.id)}
                  />
                ))}
              </div>
            </div>

            {/* KOR: 재시작 버튼 / ENG: Restart button */}
            <button
              onClick={handleRestart}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-[#404040] text-gray-300 hover:border-[#1DB954] hover:text-[#1DB954] transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="font-medium">다시 분석하기 / Re-analyze</span>
            </button>
          </div>
        )}

        {/* KOR: 입력 폼 화면 / ENG: Input form screen */}
        {!isAnalyzing && !showResult && step && (
          <div className="py-6 flex flex-col gap-6">
            {/* KOR: 진행 트랙 (Spotify 플레이어 바 스타일) / ENG: Progress track (Spotify player bar style) */}
            <ProgressTrack currentStep={currentStep} totalSteps={totalSteps} />

            {/* KOR: 단계 헤더 / ENG: Step header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1DB954]/20 border border-[#1DB954]/40 flex items-center justify-center text-[#1DB954]">
                {step.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{step.label}</h2>
                <p className="text-xs text-gray-500">{step.labelEn}</p>
              </div>
              {/* KOR: 실시간 미니 이퀄라이저 (활성 상태 표시) */}
              {/* ENG: Live mini equalizer (active status indicator) */}
              <div className="ml-auto flex items-end gap-0.5 h-5">
                {[3, 5, 4, 6, 4].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-[#1DB954] rounded-sm"
                    style={{
                      height: `${h * 3}px`,
                      animation: `equalizerAnim 0.5s ease-in-out ${i * 0.08}s infinite alternate`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* KOR: 현재 선택 값 프리뷰 / ENG: Current selection preview */}
            {step.type !== 'slider' && getCurrentValue() && (
              <div className="flex items-center gap-2 px-4 py-3 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-xl">
                <CheckCircle className="w-4 h-4 text-[#1DB954] shrink-0" />
                <span className="text-sm text-[#1DB954] font-medium">{String(getCurrentValue())}</span>
              </div>
            )}

            {/* KOR: 입력 컴포넌트 (타입에 따라 렌더링) */}
            {/* ENG: Input component (rendered based on type) */}
            <div className="flex-1">
              {step.type === 'country-select' && (
                <CountryGrid
                  selected={nationality}
                  onSelect={(v) => setNationality(v)}
                />
              )}
              {step.type === 'slider' && step.min !== undefined && step.max !== undefined && (
                <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#282828]">
                  {/* KOR: 슬라이더 위 이퀄라이저 바 디스플레이 / ENG: Equalizer bar display above slider */}
                  <div className="flex items-end justify-center gap-1 h-16 mb-6">
                    {Array.from({ length: 20 }, (_, i) => {
                      const normalized = (age - step.min!) / (step.max! - step.min!);
                      const threshold = i / 19;
                      const isActive = threshold <= normalized;
                      const heights = [4, 6, 8, 10, 12, 14, 16, 18, 16, 14, 18, 14, 16, 12, 14, 10, 12, 8, 10, 6];
                      return (
                        <div
                          key={i}
                          className={`w-3 rounded-sm transition-all duration-150 ${
                            isActive ? 'bg-[#1DB954]' : 'bg-[#333]'
                          }`}
                          style={{ height: `${heights[i]}px` }}
                        />
                      );
                    })}
                  </div>
                  <GreenSlider
                    value={age}
                    min={step.min}
                    max={step.max}
                    onChange={(v) => setAge(v)}
                    label={step.unit}
                  />
                </div>
              )}
              {step.type === 'toggle-group' && step.options && (
                <ToggleGroup
                  options={step.options}
                  selected={String(getCurrentValue())}
                  onSelect={setCurrentValue}
                />
              )}
            </div>

            {/* KOR: 네비게이션 버튼 / ENG: Navigation buttons */}
            <div className="flex items-center gap-3 pt-2">
              {/* KOR: 이전 버튼 / ENG: Back button */}
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#404040] text-gray-400 hover:border-[#606060] hover:text-gray-200 transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">이전</span>
                </button>
              )}
              {/* KOR: 다음/분석 시작 버튼 / ENG: Next/Start analysis button */}
              <button
                onClick={handleNext}
                disabled={!isNextEnabled()}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  isNextEnabled()
                    ? 'bg-[#1DB954] text-black hover:bg-[#1ed760] shadow-lg shadow-[#1DB954]/25'
                    : 'bg-[#282828] text-gray-600 cursor-not-allowed'
                }`}
              >
                {currentStep < totalSteps - 1 ? (
                  <>
                    <span>다음 / Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>비자 분석 시작 / Start Analysis</span>
                  </>
                )}
              </button>
            </div>

            {/* KOR: 단계 도트 인디케이터 / ENG: Step dot indicator */}
            <div className="flex items-center justify-center gap-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => i < currentStep && setCurrentStep(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? 'w-6 h-2 bg-[#1DB954]'
                      : i < currentStep
                      ? 'w-2 h-2 bg-[#1DB954]/50 cursor-pointer hover:bg-[#1DB954]/80'
                      : 'w-2 h-2 bg-[#404040]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* KOR: 전역 keyframe 애니메이션 스타일 / ENG: Global keyframe animation styles */}
      <style jsx global>{`
        @keyframes equalizerAnim {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1); }
        }
        @keyframes equalizerPulse {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
        }
        input[type='range']::-moz-range-thumb {
          border: none;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
