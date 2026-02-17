'use client';

// KOR: 비자 진단 페이지 #95 — 스마트워치 스타일
// ENG: Visa Diagnosis Page #95 — Smartwatch Style
// Apple Watch / Galaxy Watch 인터페이스를 모티브로 한 블랙 OLED 원형 UI
// Black OLED circular UI inspired by Apple Watch / Galaxy Watch interface

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Watch, ChevronUp, ChevronDown, Check, Activity,
  Zap, Target, DollarSign, GraduationCap, Globe, Heart,
  RotateCcw, ArrowRight, Award, Clock, TrendingUp,
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

// KOR: 진단 단계 정의 (6단계 + 결과)
// ENG: Diagnosis step definitions (6 steps + result)
type Step = 'nationality' | 'age' | 'education' | 'fund' | 'goal' | 'priority' | 'result';

// KOR: 원형 프로그레스 링 SVG 컴포넌트 — 스마트워치 Activity Ring 스타일
// ENG: Circular progress ring SVG component — smartwatch Activity Ring style
interface RingProps {
  score: number; // 0-100
  size: number;
  strokeWidth: number;
  color: string;
  label?: string;
}

function CircleRing({ score, size, strokeWidth, color, label }: RingProps) {
  // KOR: 원의 반지름, 둘레 계산
  // ENG: Calculate circle radius and circumference
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* KOR: 배경 트랙 링 / ENG: Background track ring */}
      <svg width={size} height={size} className="absolute rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
        />
        {/* KOR: 진행 링 — 점수에 따라 채워짐 / ENG: Progress ring filled by score */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      {/* KOR: 중앙 텍스트 / ENG: Center text */}
      {label && (
        <div className="flex flex-col items-center z-10">
          <span className="text-white font-bold text-xl leading-none">{score}</span>
          <span className="text-gray-400 text-[10px] mt-0.5">{label}</span>
        </div>
      )}
    </div>
  );
}

// KOR: 크라운 스크롤 버튼 — 스마트워치 Digital Crown 모방
// ENG: Crown scroll button — imitating smartwatch Digital Crown
interface CrownButtonProps {
  onUp: () => void;
  onDown: () => void;
  disabled?: boolean;
}

function CrownScroll({ onUp, onDown, disabled }: CrownButtonProps) {
  return (
    <div className="flex flex-col items-center gap-1 ml-2">
      {/* KOR: 크라운 상단 / ENG: Crown top */}
      <button
        onClick={onUp}
        disabled={disabled}
        className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center hover:bg-gray-700 active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
        aria-label="위로 / Scroll up"
      >
        <ChevronUp className="w-4 h-4 text-gray-300" />
      </button>
      {/* KOR: 크라운 중앙 홈 / ENG: Crown center notch */}
      <div className="w-8 h-10 rounded-full bg-linear-to-br from-gray-700 to-gray-900 border border-gray-600 flex items-center justify-center shadow-inner">
        <div className="flex flex-col gap-[3px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="w-4 h-[1px] bg-gray-500 rounded-full" />
          ))}
        </div>
      </div>
      {/* KOR: 크라운 하단 / ENG: Crown bottom */}
      <button
        onClick={onDown}
        disabled={disabled}
        className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center hover:bg-gray-700 active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
        aria-label="아래로 / Scroll down"
      >
        <ChevronDown className="w-4 h-4 text-gray-300" />
      </button>
    </div>
  );
}

// KOR: 워치 컴플리케이션 카드 — 글랜스 뷰 형태의 결과 카드
// ENG: Watch complication card — result card in glance view format
interface ComplicationCardProps {
  pathway: RecommendedPathway;
  rank: number;
  isSelected: boolean;
  onClick: () => void;
}

function ComplicationCard({ pathway, rank, isSelected, onClick }: ComplicationCardProps) {
  // KOR: 점수에 따른 링 색상 매핑
  // ENG: Ring color mapping by score
  const ringColor =
    pathway.feasibilityScore >= 80 ? '#00d4ff'
    : pathway.feasibilityScore >= 65 ? '#00ff88'
    : pathway.feasibilityScore >= 50 ? '#ffcc00'
    : '#ff6b6b';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-2xl border transition-all duration-300 ${
        isSelected
          ? 'border-cyan-400 bg-gray-900 shadow-[0_0_20px_rgba(0,212,255,0.3)]'
          : 'border-gray-800 bg-gray-950 hover:border-gray-700'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* KOR: 미니 프로그레스 링 / ENG: Mini progress ring */}
        <div className="shrink-0">
          <CircleRing
            score={pathway.feasibilityScore}
            size={52}
            strokeWidth={5}
            color={ringColor}
            label={`${pathway.feasibilityScore}`}
          />
        </div>
        {/* KOR: 경로 기본 정보 / ENG: Pathway basic info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-gray-500">#{rank}</span>
            <span className="text-xs font-bold text-white truncate">{pathway.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {pathway.totalDurationMonths}개월
            </span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
            </span>
          </div>
          {/* KOR: 비자 체인 태그 / ENG: Visa chain tags */}
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).slice(0, 2).map((v) => (
              <span
                key={v.visa}
                className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-400 font-mono"
              >
                {v.visa}
              </span>
            ))}
            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length > 2 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-500">
                +{(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 2}
              </span>
            )}
          </div>
        </div>
        {/* KOR: 선택 표시 / ENG: Selection indicator */}
        <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
          isSelected ? 'bg-cyan-400' : 'bg-gray-800'
        }`}>
          {isSelected && <Check className="w-3 h-3 text-black" />}
        </div>
      </div>
    </button>
  );
}

// KOR: 워치 상단 헤더 — 워치 페이스 시계 표시
// ENG: Watch top header — watch face time display
function WatchHeader() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between mb-2 px-1">
      {/* KOR: 워치 아이콘 / ENG: Watch icon */}
      <Watch className="w-4 h-4 text-gray-600" />
      {/* KOR: 현재 시간 표시 / ENG: Current time display */}
      <span className="text-gray-500 text-[11px] font-mono tracking-widest">{time}</span>
      {/* KOR: 배터리 인디케이터 / ENG: Battery indicator */}
      <div className="flex items-center gap-1">
        <div className="flex gap-[2px]">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-1 rounded-[1px] ${i < 3 ? 'bg-green-400' : 'bg-gray-700'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// KOR: 메인 스마트워치 스타일 진단 페이지 컴포넌트
// ENG: Main smartwatch-style diagnosis page component
export default function Diagnosis95Page() {
  // KOR: 현재 진단 단계 상태
  // ENG: Current diagnosis step state
  const [step, setStep] = useState<Step>('nationality');

  // KOR: 사용자 입력값 상태 (6개 필드)
  // ENG: User input state (6 fields)
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 각 단계 선택지의 현재 스크롤 인덱스
  // ENG: Current scroll index for each step's options
  const [scrollIndex, setScrollIndex] = useState(0);

  // KOR: 결과 선택 상태
  // ENG: Result selection state
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);

  // KOR: 결과 보기 모드 — 상세 vs 글랜스
  // ENG: Result view mode — detail vs glance
  const [detailPathway, setDetailPathway] = useState<RecommendedPathway | null>(null);

  // KOR: 애니메이션 상태 — 화면 전환 시 페이드
  // ENG: Animation state — fade during screen transitions
  const [fadeIn, setFadeIn] = useState(true);

  // KOR: 진동 피드백 시뮬레이션 (haptic class)
  // ENG: Haptic feedback simulation (haptic class)
  const [haptic, setHaptic] = useState(false);

  // KOR: 각 단계별 옵션 목록 정의
  // ENG: Option list definition per step
  const stepOptions: Record<string, string[]> = {
    nationality: popularCountries.map((c) => `${c.flag} ${c.name}`),
    age: Array.from({ length: 43 }, (_, i) => `${i + 18}세`),
    education: educationOptions,
    fund: fundOptions,
    goal: goalOptions,
    priority: priorityOptions,
  };

  // KOR: 단계 순서 정의
  // ENG: Step order definition
  const stepOrder: Step[] = ['nationality', 'age', 'education', 'fund', 'goal', 'priority'];

  // KOR: 현재 단계의 옵션 목록
  // ENG: Current step's option list
  const currentOptions = step !== 'result' ? stepOptions[step] ?? [] : [];

  // KOR: 화면 전환 시 페이드 처리 함수
  // ENG: Fade handler on screen transition
  const transitionTo = useCallback((nextStep: Step, resetIndex = true) => {
    setFadeIn(false);
    setTimeout(() => {
      setStep(nextStep);
      if (resetIndex) setScrollIndex(0);
      setFadeIn(true);
    }, 200);
  }, []);

  // KOR: 크라운 위 버튼 — 이전 항목으로 스크롤
  // ENG: Crown up button — scroll to previous item
  const handleCrownUp = useCallback(() => {
    if (scrollIndex > 0) {
      setScrollIndex((prev) => prev - 1);
      triggerHaptic();
    }
  }, [scrollIndex]);

  // KOR: 크라운 아래 버튼 — 다음 항목으로 스크롤
  // ENG: Crown down button — scroll to next item
  const handleCrownDown = useCallback(() => {
    if (scrollIndex < currentOptions.length - 1) {
      setScrollIndex((prev) => prev + 1);
      triggerHaptic();
    }
  }, [scrollIndex, currentOptions.length]);

  // KOR: 진동 피드백 트리거 (CSS 클래스 토글로 시뮬레이션)
  // ENG: Trigger haptic feedback (simulated via CSS class toggle)
  const triggerHaptic = () => {
    setHaptic(true);
    setTimeout(() => setHaptic(false), 100);
  };

  // KOR: 선택 확인 버튼 처리 — 현재 단계의 선택 저장 후 다음 단계 이동
  // ENG: Confirm selection — save current step choice then move to next step
  const handleConfirm = useCallback(() => {
    if (currentOptions.length === 0) return;
    const selected = currentOptions[scrollIndex];
    triggerHaptic();

    // KOR: 각 단계별 입력값을 input 상태에 저장
    // ENG: Save each step's input value to state
    const updated = { ...input };
    switch (step) {
      case 'nationality':
        updated.nationality = selected.replace(/^.+?\s/, ''); // 국기 이모지 제거
        break;
      case 'age':
        updated.age = parseInt(selected.replace('세', ''), 10);
        break;
      case 'education':
        updated.educationLevel = selected;
        break;
      case 'fund':
        updated.availableAnnualFund = selected;
        break;
      case 'goal':
        updated.finalGoal = selected;
        break;
      case 'priority':
        updated.priorityPreference = selected;
        break;
    }
    setInput(updated);

    const currentIdx = stepOrder.indexOf(step as Step);
    if (currentIdx < stepOrder.length - 1) {
      transitionTo(stepOrder[currentIdx + 1]);
    } else {
      // KOR: 마지막 단계 완료 — 결과 화면으로 이동
      // ENG: Last step done — navigate to result screen
      transitionTo('result');
    }
  }, [step, scrollIndex, currentOptions, input, transitionTo, stepOrder]);

  // KOR: 처음으로 돌아가기
  // ENG: Return to beginning
  const handleReset = useCallback(() => {
    setInput({});
    setSelectedPathwayId(null);
    setDetailPathway(null);
    transitionTo('nationality');
  }, [transitionTo]);

  // KOR: 단계 아이콘 매핑
  // ENG: Step icon mapping
  const stepIcons: Record<string, React.ReactNode> = {
    nationality: <Globe className="w-5 h-5 text-cyan-400" />,
    age: <Activity className="w-5 h-5 text-pink-400" />,
    education: <GraduationCap className="w-5 h-5 text-purple-400" />,
    fund: <DollarSign className="w-5 h-5 text-green-400" />,
    goal: <Target className="w-5 h-5 text-yellow-400" />,
    priority: <Zap className="w-5 h-5 text-orange-400" />,
  };

  // KOR: 단계 링 색상 매핑 — Activity Ring 스타일
  // ENG: Step ring color mapping — Activity Ring style
  const stepColors: Record<string, string> = {
    nationality: '#00d4ff',
    age: '#ff2d78',
    education: '#bf5af2',
    fund: '#30d158',
    goal: '#ffd60a',
    priority: '#ff9f0a',
  };

  // KOR: 현재 단계 진행률 (0-100)
  // ENG: Current step progress (0-100)
  const stepProgress =
    step === 'result'
      ? 100
      : Math.round(((stepOrder.indexOf(step as Step) + 1) / stepOrder.length) * 100);

  // KOR: 결과 상세 보기 컴포넌트
  // ENG: Result detail view component
  const DetailView = ({ pathway }: { pathway: RecommendedPathway }) => {
    const ringColor =
      pathway.feasibilityScore >= 80 ? '#00d4ff'
      : pathway.feasibilityScore >= 65 ? '#00ff88'
      : pathway.feasibilityScore >= 50 ? '#ffcc00'
      : '#ff6b6b';

    return (
      <div className="flex flex-col gap-3">
        {/* KOR: 상세 헤더 / ENG: Detail header */}
        <button
          onClick={() => setDetailPathway(null)}
          className="flex items-center gap-2 text-cyan-400 text-xs hover:text-cyan-300 transition-colors"
        >
          <ChevronUp className="w-3 h-3 rotate-[-90deg]" />
          목록으로 / Back to list
        </button>

        {/* KOR: 대형 점수 링 / ENG: Large score ring */}
        <div className="flex justify-center">
          <CircleRing
            score={pathway.feasibilityScore}
            size={110}
            strokeWidth={10}
            color={ringColor}
            label={pathway.feasibilityLabel}
          />
        </div>
        <p className="text-center text-white font-bold text-sm">{pathway.name}</p>
        <p className="text-center text-gray-400 text-[11px] leading-relaxed">{pathway.description}</p>

        {/* KOR: 핵심 지표 — 워치 컴플리케이션 그리드 / ENG: Key metrics — watch complication grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-900 rounded-xl p-2.5 flex flex-col items-center gap-1">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-bold text-base">{pathway.totalDurationMonths}</span>
            <span className="text-gray-500 text-[10px]">개월 소요</span>
          </div>
          <div className="bg-gray-900 rounded-xl p-2.5 flex flex-col items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-white font-bold text-sm">${(((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0) / 1000).toFixed(0)}K</span>
            <span className="text-gray-500 text-[10px]">예상 비용</span>
          </div>
        </div>

        {/* KOR: 비자 체인 / ENG: Visa chain */}
        <div className="bg-gray-900 rounded-xl p-3">
          <p className="text-gray-500 text-[10px] mb-2 uppercase tracking-wider">비자 경로 / Visa Chain</p>
          <div className="flex items-center gap-1 flex-wrap">
            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
              <div key={v.visa} className="flex items-center gap-1">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold font-mono text-white bg-gray-800 px-2 py-0.5 rounded-lg">
                    {v.visa}
                  </span>
                  <span className="text-[9px] text-gray-600 mt-0.5">{v.duration}</span>
                </div>
                {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                  <ArrowRight className="w-3 h-3 text-gray-700 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* KOR: 마일스톤 리스트 / ENG: Milestone list */}
        <div className="space-y-2">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider">단계별 계획 / Milestones</p>
          {pathway.milestones.map((m, i) => (
            <div key={i} className="flex items-start gap-2 bg-gray-900 rounded-xl p-2.5">
              <span className="text-lg shrink-0">{m.emoji}</span>
              <div>
                <p className="text-white text-xs font-semibold">{m.title}</p>
                <p className="text-gray-500 text-[10px] leading-relaxed mt-0.5">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // KOR: 결과 글랜스 뷰 컴포넌트 — 5개 경로 목록
  // ENG: Result glance view component — list of 5 pathways
  const ResultGlanceView = () => {
    const pathways = mockDiagnosisResult.pathways;

    return (
      <div className="flex flex-col gap-3">
        {/* KOR: 결과 헤더 요약 / ENG: Result header summary */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <CircleRing
              score={stepProgress}
              size={70}
              strokeWidth={6}
              color="#00d4ff"
              label="완료"
            />
          </div>
          <p className="text-white font-bold text-sm">진단 완료!</p>
          <p className="text-gray-400 text-[11px] mt-0.5">
            {pathways.length}개 비자 경로 발견
          </p>
        </div>

        {/* KOR: 3개 미니 Activity Ring — 속도·비용·성공률 / ENG: 3 mini Activity Rings — speed/cost/success */}
        <div className="flex justify-around bg-gray-900 rounded-2xl p-3">
          {[
            { label: '속도', score: 72, color: '#ff2d78' },
            { label: '성공률', score: 85, color: '#00d4ff' },
            { label: '비용효율', score: 60, color: '#30d158' },
          ].map((m) => (
            <div key={m.label} className="flex flex-col items-center gap-1">
              <CircleRing score={m.score} size={44} strokeWidth={4} color={m.color} />
              <span className="text-gray-500 text-[9px]">{m.label}</span>
            </div>
          ))}
        </div>

        {/* KOR: 경로 목록 / ENG: Pathway list */}
        <div className="space-y-2">
          <p className="text-gray-600 text-[10px] uppercase tracking-wider px-1">추천 경로 / Recommended</p>
          {pathways.map((pathway, i) => (
            <ComplicationCard
              key={pathway.id}
              pathway={pathway}
              rank={i + 1}
              isSelected={selectedPathwayId === pathway.id}
              onClick={() => {
                setSelectedPathwayId(pathway.id);
                triggerHaptic();
                setDetailPathway(pathway);
              }}
            />
          ))}
        </div>

        {/* KOR: 처음으로 버튼 / ENG: Reset button */}
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-gray-900 border border-gray-800 text-gray-400 text-xs hover:border-gray-600 hover:text-gray-200 transition-all duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          다시 진단하기 / Restart
        </button>
      </div>
    );
  };

  // KOR: 입력 단계 화면 컴포넌트 — 스크롤러 + 크라운
  // ENG: Input step screen component — scroller + crown
  const InputStep = () => {
    const stepIdx = stepOrder.indexOf(step as Step);
    const color = stepColors[step] ?? '#00d4ff';
    const icon = stepIcons[step];

    // KOR: 현재 스텝 라벨 한/영
    // ENG: Current step label KOR/ENG
    const stepLabels: Record<string, { ko: string; en: string }> = {
      nationality: { ko: '국적', en: 'Nationality' },
      age: { ko: '나이', en: 'Age' },
      education: { ko: '학력', en: 'Education' },
      fund: { ko: '연간 예산', en: 'Annual Fund' },
      goal: { ko: '최종 목표', en: 'Final Goal' },
      priority: { ko: '우선순위', en: 'Priority' },
    };
    const label = stepLabels[step] ?? { ko: '', en: '' };

    // KOR: 가시 범위 — 현재 선택 ±2 항목 표시 (슬롯머신 스타일)
    // ENG: Visible range — show ±2 items from selected (slot machine style)
    const visibleRange = [-2, -1, 0, 1, 2];

    return (
      <div className="flex flex-col gap-4">
        {/* KOR: 단계 진행 링 + 아이콘 / ENG: Step progress ring + icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <div>
              <p className="text-white font-bold text-sm">{label.ko}</p>
              <p className="text-gray-600 text-[10px]">{label.en}</p>
            </div>
          </div>
          {/* KOR: 단계 도트 인디케이터 / ENG: Step dot indicator */}
          <div className="flex gap-1.5">
            {stepOrder.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === stepIdx
                    ? 'w-4 bg-cyan-400'
                    : i < stepIdx
                    ? 'w-1.5 bg-gray-600'
                    : 'w-1.5 bg-gray-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* KOR: 스크롤 선택기 + 크라운 / ENG: Scroll picker + crown */}
        <div className="flex items-center gap-0">
          {/* KOR: 원형 선택 영역 / ENG: Circular selection area */}
          <div className="flex-1 relative overflow-hidden rounded-2xl bg-gray-950 border border-gray-900"
               style={{ height: '200px' }}>
            {/* KOR: 중앙 하이라이트 바 / ENG: Center highlight bar */}
            <div
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-10 z-10 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                borderTop: `1px solid ${color}40`,
                borderBottom: `1px solid ${color}40`,
              }}
            />
            {/* KOR: 위아래 페이드 오버레이 / ENG: Top/bottom fade overlay */}
            <div className="absolute inset-0 pointer-events-none z-20"
              style={{
                background: 'linear-gradient(to bottom, #000 0%, transparent 30%, transparent 70%, #000 100%)'
              }}
            />

            {/* KOR: 옵션 목록 슬롯 / ENG: Option list slots */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0">
              {visibleRange.map((offset) => {
                const idx = scrollIndex + offset;
                const isCenter = offset === 0;
                const isAdjacent = Math.abs(offset) === 1;
                const option = idx >= 0 && idx < currentOptions.length ? currentOptions[idx] : null;

                return (
                  <div
                    key={offset}
                    className="flex items-center justify-center transition-all duration-200"
                    style={{
                      height: '40px',
                      opacity: isCenter ? 1 : isAdjacent ? 0.45 : 0.15,
                      transform: `scale(${isCenter ? 1 : isAdjacent ? 0.88 : 0.75})`,
                    }}
                  >
                    {option ? (
                      <span
                        className={`text-center px-4 truncate max-w-full ${
                          isCenter
                            ? 'text-white font-bold text-sm'
                            : 'text-gray-500 text-xs'
                        }`}
                      >
                        {option}
                      </span>
                    ) : (
                      <div className="h-6" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* KOR: 크라운 스크롤 버튼 / ENG: Crown scroll buttons */}
          <CrownScroll
            onUp={handleCrownUp}
            onDown={handleCrownDown}
            disabled={false}
          />
        </div>

        {/* KOR: 확인 버튼 — 원형 체크 / ENG: Confirm button — circular check */}
        <button
          onClick={handleConfirm}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm text-black transition-all duration-200 active:scale-95 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
        >
          <Check className="w-4 h-4" />
          {stepIdx < stepOrder.length - 1 ? '다음 / Next' : '진단하기 / Diagnose'}
        </button>

        {/* KOR: 현재 선택 표시 / ENG: Current selection display */}
        <p className="text-center text-gray-600 text-[10px]">
          {scrollIndex + 1} / {currentOptions.length} — 크라운으로 선택 / Select with crown
        </p>
      </div>
    );
  };

  return (
    // KOR: 전체 페이지 — 블랙 OLED 배경 / ENG: Full page — black OLED background
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* KOR: 외부 베젤 — 스마트워치 케이스 / ENG: Outer bezel — smartwatch case */}
      <div
        className={`relative transition-transform duration-100 ${haptic ? 'translate-y-[1px]' : ''}`}
        style={{ maxWidth: '360px', width: '100%' }}
      >
        {/* KOR: 워치 케이스 외부 테두리 / ENG: Watch case outer border */}
        <div
          className="relative bg-linear-to-br from-gray-800 via-gray-900 to-black rounded-[48px] p-[3px]"
          style={{
            boxShadow: '0 0 0 1px #333, 0 20px 60px rgba(0,0,0,0.9), 0 0 80px rgba(0,212,255,0.05)',
          }}
        >
          {/* KOR: 워치 화면 내부 — OLED 블랙 / ENG: Watch screen interior — OLED black */}
          <div
            className="relative bg-black rounded-[46px] overflow-hidden"
            style={{ minHeight: '500px' }}
          >
            {/* KOR: 상단 센서 노치 / ENG: Top sensor notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-900 rounded-full z-20" />

            {/* KOR: 배경 글로우 효과 / ENG: Background glow effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  step === 'result'
                    ? 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 60%)'
                    : `radial-gradient(ellipse at 50% 0%, ${stepColors[step] ?? '#00d4ff'}10 0%, transparent 60%)`,
              }}
            />

            {/* KOR: 스크롤 가능한 콘텐츠 영역 / ENG: Scrollable content area */}
            <div
              className="relative z-10 p-5 pt-8 overflow-y-auto"
              style={{ maxHeight: '580px' }}
            >
              {/* KOR: 워치 헤더 — 시간 + 배터리 / ENG: Watch header — time + battery */}
              <WatchHeader />

              {/* KOR: 앱 아이디 + 제목 / ENG: App id + title */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-xs">비자 진단</p>
                  <p className="text-gray-600 text-[10px]">Visa Diagnosis · #95</p>
                </div>
                {/* KOR: 전체 진행 링 미니 / ENG: Mini overall progress ring */}
                <div className="ml-auto">
                  <CircleRing
                    score={stepProgress}
                    size={36}
                    strokeWidth={4}
                    color="#00d4ff"
                  />
                </div>
              </div>

              {/* KOR: 화면 전환 애니메이션 래퍼 / ENG: Screen transition animation wrapper */}
              <div
                style={{
                  opacity: fadeIn ? 1 : 0,
                  transform: fadeIn ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                }}
              >
                {/* KOR: 결과 화면 분기 / ENG: Result screen branch */}
                {step === 'result' ? (
                  detailPathway ? (
                    <DetailView pathway={detailPathway} />
                  ) : (
                    <ResultGlanceView />
                  )
                ) : (
                  <InputStep />
                )}
              </div>
            </div>

            {/* KOR: 하단 홈 인디케이터 / ENG: Bottom home indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-800 rounded-full" />
          </div>
        </div>

        {/* KOR: 크라운 사이드 버튼 (우측) — 장식용 / ENG: Crown side button (right) — decorative */}
        <div
          className="absolute right-[-10px] top-1/2 -translate-y-1/2 flex flex-col gap-2"
          aria-hidden="true"
        >
          {/* KOR: 사이드 버튼 위 / ENG: Side button top */}
          <div className="w-[10px] h-10 bg-linear-to-r from-gray-700 to-gray-800 rounded-r-lg border-r border-t border-b border-gray-600 shadow-md" />
          {/* KOR: 크라운 노브 / ENG: Crown knob */}
          <div className="w-[12px] h-16 bg-linear-to-r from-gray-600 to-gray-800 rounded-r-xl border-r border-t border-b border-gray-500 shadow-md">
            <div className="flex flex-col gap-[3px] items-end pr-[2px] pt-2">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-[6px] h-[1px] bg-gray-500 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* KOR: 디자인 배지 / ENG: Design badge */}
        <div className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
          <Watch className="w-3 h-3 text-gray-700" />
          <span className="text-gray-700 text-[10px] tracking-widest uppercase font-mono">
            Smartwatch · Design #95
          </span>
        </div>
      </div>
    </div>
  );
}
