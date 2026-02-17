'use client';

// KOR: React 및 상태 관리 임포트
// ENG: Import React and state management
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronRight,
  Scroll,
  Shield,
  Star,
  Sparkles,
  Trophy,
  Map,
  BookOpen,
  Target,
  Clock,
  Wallet,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sword,
  Gem,
} from 'lucide-react';

// KOR: 목업 데이터 및 타입 임포트
// ENG: Import mock data and types
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
// KOR: 타입 정의 / ENG: Type definitions
// ============================================================

/** KOR: 대화 진행 단계 / ENG: Dialogue progression step */
type DialogueStep =
  | 'intro'
  | 'nationality'
  | 'age'
  | 'education'
  | 'fund'
  | 'goal'
  | 'priority'
  | 'analyzing'
  | 'result';

/** KOR: NPC 대사 인터페이스 / ENG: NPC dialogue interface */
interface NpcDialogue {
  speaker: string;
  text: string;
  textEn: string;
}

/** KOR: 선택지 인터페이스 / ENG: Choice interface */
interface DialogueChoice {
  label: string;
  labelEn: string;
  value: string | number;
  icon?: string;
}

/** KOR: 레어리티 등급 / ENG: Rarity tier */
type RarityTier = 'legendary' | 'epic' | 'rare' | 'common';

// ============================================================
// KOR: 상수 / ENG: Constants
// ============================================================

/** KOR: 단계 순서 배열 / ENG: Step order array */
const STEP_ORDER: DialogueStep[] = [
  'intro',
  'nationality',
  'age',
  'education',
  'fund',
  'goal',
  'priority',
  'analyzing',
  'result',
];

/** KOR: NPC 대사 데이터 / ENG: NPC dialogue data */
const NPC_DIALOGUES: Record<string, NpcDialogue> = {
  intro: {
    speaker: 'Visa Sage',
    text: '모험자여, 환영하네. 나는 비자 현자... 한국 왕국으로의 여정을 안내하지. 자네의 운명을 점쳐볼 준비가 되었는가?',
    textEn: 'Welcome, adventurer. I am the Visa Sage. I guide journeys to the Kingdom of Korea. Are you ready to divine your destiny?',
  },
  nationality: {
    speaker: 'Visa Sage',
    text: '먼저 물어보겠네... 자네는 어느 땅에서 왔는가? 출신지에 따라 열리는 길이 다르다네.',
    textEn: 'First, tell me... which land do you hail from? The paths that open depend on your origin.',
  },
  age: {
    speaker: 'Visa Sage',
    text: '흥미롭군... 그렇다면 자네의 나이는 몇인가? 젊은 용사인가, 아니면 숙련된 전사인가?',
    textEn: 'Interesting... How many winters have you seen? Are you a young warrior, or a seasoned veteran?',
  },
  education: {
    speaker: 'Visa Sage',
    text: '수련의 기록을 보자꾸나. 자네가 습득한 지식의 수준은 어떠한가?',
    textEn: 'Let me see your training records. What level of knowledge have you attained?',
  },
  fund: {
    speaker: 'Visa Sage',
    text: '여정에는 자금이 필요하지... 자네의 골드 주머니는 얼마나 넉넉한가?',
    textEn: 'Every journey requires gold... How heavy is your coin purse?',
  },
  goal: {
    speaker: 'Visa Sage',
    text: '이제 핵심 질문이네. 한국 왕국에서 자네가 이루고자 하는 최종 목표는 무엇인가?',
    textEn: 'Now the crucial question. What is your ultimate quest in the Kingdom of Korea?',
  },
  priority: {
    speaker: 'Visa Sage',
    text: '마지막 질문이네, 모험자여. 자네에게 가장 중요한 것은 무엇인가? 속도인가, 안정인가, 비용인가?',
    textEn: 'One final question, adventurer. What matters most to you? Speed, stability, or cost?',
  },
  analyzing: {
    speaker: 'Visa Sage',
    text: '운명의 수정구를 들여다보고 있네... 자네의 미래가 서서히 드러나고 있다...',
    textEn: 'Gazing into the crystal of destiny... Your future is slowly revealing itself...',
  },
};

/** KOR: 레어리티 등급 판별 함수 / ENG: Determine rarity tier from score */
function getRarityTier(score: number): RarityTier {
  if (score >= 80) return 'legendary';
  if (score >= 65) return 'epic';
  if (score >= 50) return 'rare';
  return 'common';
}

/** KOR: 레어리티 색상 맵 / ENG: Rarity color map */
const RARITY_COLORS: Record<
  RarityTier,
  { border: string; bg: string; text: string; badge: string }
> = {
  legendary: {
    border: 'border-yellow-400',
    bg: 'bg-yellow-900/20',
    text: 'text-yellow-300',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
  },
  epic: {
    border: 'border-purple-400',
    bg: 'bg-purple-900/20',
    text: 'text-purple-300',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  },
  rare: {
    border: 'border-blue-400',
    bg: 'bg-blue-900/20',
    text: 'text-blue-300',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  },
  common: {
    border: 'border-gray-500',
    bg: 'bg-gray-800/30',
    text: 'text-gray-300',
    badge: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
  },
};

/** KOR: 레어리티 한/영 라벨 / ENG: Rarity Korean/English labels */
const RARITY_LABELS: Record<RarityTier, { ko: string; en: string }> = {
  legendary: { ko: '전설', en: 'Legendary' },
  epic: { ko: '영웅', en: 'Epic' },
  rare: { ko: '희귀', en: 'Rare' },
  common: { ko: '일반', en: 'Common' },
};

// ============================================================
// KOR: 타이핑 애니메이션 커스텀 훅
// ENG: Custom typing animation hook
// ============================================================
function useTypingAnimation(text: string, speed: number = 28, shouldStart: boolean = true) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // KOR: 시작 조건이 아니면 리셋
    // ENG: Reset if not started
    if (!shouldStart) {
      setDisplayedText('');
      setIsComplete(false);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, shouldStart]);

  // KOR: 끝까지 스킵하는 함수 / ENG: Skip to end function
  const skipToEnd = useCallback(() => {
    setDisplayedText(text);
    setIsComplete(true);
  }, [text]);

  return { displayedText, isComplete, skipToEnd };
}

// ============================================================
// KOR: NPC 캐릭터 컴포넌트
// ENG: NPC Character Component
// ============================================================
function NpcCharacter({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <div className="relative shrink-0">
      {/* KOR: 캐릭터 후광 효과 / ENG: Character aura glow */}
      <div
        className={`absolute -inset-3 rounded-full transition-all duration-1000 ${
          isSpeaking ? 'bg-amber-500/20 animate-pulse' : 'bg-transparent'
        }`}
      />
      {/* KOR: 캐릭터 아이콘 프레임 / ENG: Character icon frame */}
      <div className="relative w-16 h-16 rounded-full border-2 border-amber-400/70 bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden shadow-lg shadow-amber-900/30">
        <span className="text-3xl" role="img" aria-label="wizard">
          🧙
        </span>
        {/* KOR: 말하는 중 인디케이터 / ENG: Speaking indicator dot */}
        {isSpeaking && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse" />
        )}
      </div>
    </div>
  );
}

// ============================================================
// KOR: 대화창 프레임 컴포넌트
// ENG: Dialogue Frame Component
// ============================================================
function DialogueFrame({
  speaker,
  text,
  textEn,
  isTyping,
  onSkip,
}: {
  speaker: string;
  text: string;
  textEn: string;
  isTyping: boolean;
  onSkip: () => void;
}) {
  return (
    // KOR: 클릭 시 타이핑 스킵 / ENG: Click to skip typing
    <div
      className="relative cursor-pointer"
      onClick={isTyping ? onSkip : undefined}
    >
      {/* KOR: 외곽 금빛 테두리 / ENG: Outer gold border */}
      <div className="absolute -inset-px bg-linear-to-r from-amber-600/50 via-yellow-500/50 to-amber-600/50 rounded-lg" />

      {/* KOR: 메인 대화창 배경 / ENG: Main dialogue box background */}
      <div className="relative bg-linear-to-b from-gray-900/95 to-gray-950/95 rounded-lg p-4 border border-amber-500/20">
        {/* KOR: 화자 이름 / ENG: Speaker name */}
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-amber-400 font-bold text-xs tracking-wider uppercase">
            {speaker}
          </span>
          {isTyping && (
            <span className="text-amber-500/60 text-xs ml-auto animate-pulse">
              ▼ 클릭하여 스킵
            </span>
          )}
        </div>

        {/* KOR: 한국어 대사 / ENG: Korean dialogue text */}
        <p className="text-gray-100 text-sm leading-relaxed font-medium min-h-12">
          {text}
          {isTyping && (
            <span className="inline-block w-0.5 h-3.5 bg-amber-400 ml-0.5 animate-pulse" />
          )}
        </p>

        {/* KOR: 영어 번역 / ENG: English translation */}
        {textEn && (
          <p className="text-gray-500 text-xs mt-1.5 italic min-h-4">
            {textEn}
          </p>
        )}

        {/* KOR: 모서리 RPG 장식 / ENG: Corner RPG decoration */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/40 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500/40 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500/40 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500/40 rounded-br-lg" />
      </div>
    </div>
  );
}

// ============================================================
// KOR: 경험치 바 컴포넌트
// ENG: Experience Bar Component
// ============================================================
function ExperienceBar({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full">
      {/* KOR: 레벨 + 경험치 수치 / ENG: Level + EXP value */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-300 text-xs font-bold tracking-wider">
            QUEST {currentStep}/{totalSteps}
          </span>
        </div>
        <span className="text-amber-400/60 text-xs">EXP {progress}%</span>
      </div>

      {/* KOR: 경험치 바 프레임 / ENG: EXP bar frame */}
      <div className="relative h-2.5 rounded-full bg-gray-800/80 border border-amber-900/50 overflow-hidden">
        {/* KOR: 경험치 채움 / ENG: EXP fill */}
        <div
          className="absolute inset-y-0 left-0 bg-linear-to-r from-amber-600 via-yellow-500 to-amber-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================
// KOR: RPG 선택지 버튼 컴포넌트
// ENG: RPG Choice Button Component
// ============================================================
function ChoiceButton({
  choice,
  index,
  onSelect,
  disabled,
}: {
  choice: DialogueChoice;
  index: number;
  onSelect: (value: string | number) => void;
  disabled: boolean;
}) {
  return (
    // KOR: 호버 시 금색 하이라이트 + 오른쪽으로 슬라이드
    // ENG: Gold highlight + slide right on hover
    <button
      onClick={() => onSelect(choice.value)}
      disabled={disabled}
      className={`
        group w-full text-left px-4 py-3 rounded-lg
        border transition-all duration-200 ease-out
        border-amber-800/40 bg-gray-900/60
        hover:border-amber-400/70 hover:bg-amber-900/25 hover:translate-x-1
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-center gap-3">
        {/* KOR: 선택지 번호 / ENG: Choice number */}
        <div className="w-7 h-7 rounded shrink-0 flex items-center justify-center text-xs font-bold bg-gray-800 text-gray-500 group-hover:bg-amber-500/25 group-hover:text-amber-300 transition-colors duration-200">
          {choice.icon ?? (index + 1)}
        </div>

        {/* KOR: 텍스트 / ENG: Text */}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-300 group-hover:text-amber-200 transition-colors duration-200">
            {choice.label}
          </span>
          {choice.labelEn && (
            <span className="block text-xs text-gray-600 mt-0.5 group-hover:text-gray-500 transition-colors">
              {choice.labelEn}
            </span>
          )}
        </div>

        {/* KOR: 화살표 아이콘 / ENG: Arrow icon */}
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
      </div>
    </button>
  );
}

// ============================================================
// KOR: 나이 직접 입력 컴포넌트
// ENG: Age Direct Input Component
// ============================================================
function AgeInput({
  onSubmit,
  disabled,
}: {
  onSubmit: (age: number) => void;
  disabled: boolean;
}) {
  const [ageValue, setAgeValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const age = parseInt(ageValue, 10);
    if (isNaN(age) || age < 15 || age > 70) {
      setError('15세에서 70세 사이의 나이를 입력해주세요. / Enter age between 15-70.');
      return;
    }
    setError('');
    onSubmit(age);
  };

  return (
    <div className="space-y-3">
      {/* KOR: 빠른 선택 버튼들 / ENG: Quick select buttons */}
      <p className="text-gray-500 text-xs">빠른 선택 / Quick select:</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: '18-24세', labelEn: 'Youth (18-24)', value: 22 },
          { label: '25-29세', labelEn: 'Young Adult (25-29)', value: 27 },
          { label: '30-34세', labelEn: 'Adult (30-34)', value: 32 },
          { label: '35세 이상', labelEn: 'Senior (35+)', value: 38 },
        ].map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => { setAgeValue(String(opt.value)); onSubmit(opt.value); }}
            disabled={disabled}
            className="px-3 py-2.5 rounded-lg border border-amber-800/40 bg-gray-900/60 hover:border-amber-400/70 hover:bg-amber-900/25 text-left transition-all duration-200"
          >
            <span className="text-xs font-medium text-gray-300 block">{opt.label}</span>
            <span className="text-[10px] text-gray-600">{opt.labelEn}</span>
          </button>
        ))}
      </div>

      {/* KOR: 또는 직접 입력 / ENG: Or type directly */}
      <div className="relative">
        <div className="absolute -inset-px bg-linear-to-r from-amber-600/30 to-amber-800/30 rounded-lg" />
        <div className="relative flex items-center bg-gray-900/80 rounded-lg border border-amber-800/40 overflow-hidden">
          <div className="px-3 py-2.5 bg-gray-800/50 border-r border-amber-900/30">
            <Sword className="w-4 h-4 text-amber-500/70" />
          </div>
          <input
            type="number"
            value={ageValue}
            onChange={(e) => { setAgeValue(e.target.value); setError(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="나이 직접 입력 / Enter age"
            min={15}
            max={70}
            disabled={disabled}
            className="flex-1 bg-transparent px-4 py-2.5 text-amber-100 placeholder-gray-600 text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !ageValue}
            className="px-4 py-2.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 font-bold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-l border-amber-900/30"
          >
            확인
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

// ============================================================
// KOR: 분석 중 애니메이션 컴포넌트
// ENG: Analyzing Animation Component
// ============================================================
function AnalyzingAnimation() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    // KOR: 점 3개 순환 애니메이션 / ENG: Cycle 3 dots animation
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-6">
      {/* KOR: 수정구 애니메이션 / ENG: Crystal ball animation */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-linear-to-br from-purple-600/30 to-indigo-700/30 border-2 border-purple-400/50 flex items-center justify-center animate-pulse shadow-lg shadow-purple-900/40">
          <span className="text-5xl animate-bounce" role="img" aria-label="crystal ball">
            🔮
          </span>
        </div>
        {/* KOR: 회전 파티클 / ENG: Rotating particles */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
          <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
          <div className="absolute top-1/2 left-0 w-1 h-1 bg-blue-400 rounded-full" />
          <div className="absolute top-1/2 right-0 w-1 h-1 bg-green-400 rounded-full" />
        </div>
      </div>

      <p className="text-amber-300 text-sm font-bold tracking-wider">
        운명을 해독하는 중{dots}
      </p>
      <p className="text-gray-500 text-xs">Deciphering your destiny{dots}</p>
    </div>
  );
}

// ============================================================
// KOR: 비자 경로 카드 컴포넌트
// ENG: Visa Pathway Card Component
// ============================================================
function PathwayItemCard({
  pathway,
  index,
  isExpanded,
  onToggle,
}: {
  pathway: RecommendedPathway;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // KOR: feasibilityScore 기반 레어리티 계산
  // ENG: Calculate rarity based on feasibilityScore
  const rarity = getRarityTier(pathway.feasibilityScore);
  const colors = RARITY_COLORS[rarity];
  const rarityLabel = RARITY_LABELS[rarity];

  return (
    <div
      className={`relative rounded-xl border-2 overflow-hidden transition-all duration-300 ${colors.border} ${colors.bg}`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* KOR: 카드 헤더 (클릭하여 펼치기/접기) / ENG: Card header (click to expand/collapse) */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 hover:bg-white/5 transition-colors duration-200"
      >
        {/* KOR: 레어리티 배지 + 실현 가능성 / ENG: Rarity badge + feasibility */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors.badge}`}
          >
            <Gem className="w-2.5 h-2.5" />
            {rarityLabel.en} — {rarityLabel.ko}
          </span>
          <span className="text-xs text-gray-500">
            {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
          </span>
        </div>

        {/* KOR: 경로 이름 / ENG: Pathway name */}
        <h3 className={`text-base font-bold ${colors.text} mb-0.5`}>
          {pathway.name}
        </h3>

        {/* KOR: 스탯 요약 / ENG: Stat summary */}
        <div className="grid grid-cols-3 gap-2 mt-3 mb-2">
          {/* 점수 / Score */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span className="text-[9px] text-gray-500 uppercase tracking-wider">Score</span>
            </div>
            <div className="h-1 rounded-full bg-gray-700 overflow-hidden mb-0.5">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-1000"
                style={{ width: `${pathway.feasibilityScore}%` }}
              />
            </div>
            <span className="text-xs font-bold text-amber-300">
              {pathway.feasibilityScore}/100
            </span>
          </div>

          {/* 기간 / Duration */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-2.5 h-2.5 text-blue-400" />
              <span className="text-[9px] text-gray-500 uppercase tracking-wider">Time</span>
            </div>
            <span className="text-xs font-bold text-blue-300">
              {pathway.totalDurationMonths}개월
            </span>
          </div>

          {/* 비용 / Cost */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Wallet className="w-2.5 h-2.5 text-green-400" />
              <span className="text-[9px] text-gray-500 uppercase tracking-wider">Gold</span>
            </div>
            <span className="text-xs font-bold text-green-300">
              ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* KOR: 비자 체인 / ENG: Visa chain */}
        <div className="flex items-center gap-1 flex-wrap mt-2">
          {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i, arr) => (
            <React.Fragment key={i}>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-800/80 border border-gray-700/50 text-gray-300">
                {v.visa}
              </span>
              {i < arr.length - 1 && (
                <ChevronRight className="w-3 h-3 text-amber-500/50" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* KOR: 펼치기/접기 아이콘 / ENG: Expand/collapse icon */}
        <div className="flex justify-center mt-2">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>

      {/* KOR: 펼침 영역 — 마일스톤 퀘스트 로그 / ENG: Expanded area — milestone quest log */}
      {isExpanded && (
        <div className="border-t border-amber-900/30 p-4 space-y-4">
          {/* KOR: 설명 / ENG: Description */}
          <p className="text-gray-400 text-xs leading-relaxed">{pathway.description}</p>

          {/* KOR: 퀘스트 로그 헤더 / ENG: Quest log header */}
          <div className="flex items-center gap-2">
            <Scroll className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-bold tracking-wider uppercase">
              Quest Log / 퀘스트 기록
            </span>
          </div>

          {/* KOR: 마일스톤 타임라인 / ENG: Milestone timeline */}
          <div className="relative pl-6 space-y-4">
            {/* KOR: 타임라인 세로 선 / ENG: Timeline vertical line */}
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-linear-to-b from-amber-500/50 via-amber-600/30 to-transparent" />

            {pathway.milestones.map((milestone, mIdx) => (
              <div key={mIdx} className="relative">
                {/* KOR: 타임라인 노드 / ENG: Timeline node */}
                <div className="absolute -left-4 top-1 w-3 h-3 rounded-full border-2 bg-gray-700 border-gray-600" />

                <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/30">
                  {/* KOR: 마일스톤 제목 / ENG: Milestone title */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{milestone.emoji}</span>
                    <span className="text-amber-200 text-sm font-bold">{milestone.title}</span>
                  </div>
                  {/* KOR: 마일스톤 설명 / ENG: Milestone description */}
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// KOR: 퀘스트 완료 헤더 컴포넌트
// ENG: Quest Complete Header Component
// ============================================================
function QuestCompleteHeader({
  pathwayCount,
  userNationality,
  userAge,
}: {
  pathwayCount: number;
  userNationality: string;
  userAge: number;
}) {
  const [expFill, setExpFill] = useState(0);
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    // KOR: 순차적으로 경험치 애니메이션 표시 / ENG: Sequentially animate EXP
    const timer1 = setTimeout(() => setExpFill(100), 300);
    const timer2 = setTimeout(() => setShowItems(true), 1200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // KOR: 선택된 국가 정보 / ENG: Selected country info
  const country = popularCountries.find((c) => c.name === userNationality);

  return (
    <div className="text-center space-y-4">
      {/* KOR: 트로피 + QUEST COMPLETE 타이틀 / ENG: Trophy + QUEST COMPLETE title */}
      <div className="relative inline-block">
        <div className="absolute -inset-4 bg-linear-to-r from-amber-500/0 via-amber-500/15 to-amber-500/0 blur-xl animate-pulse" />
        <div className="relative">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-2" />
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-yellow-200 to-amber-300">
            QUEST COMPLETE!
          </h1>
          <p className="text-amber-500/80 text-sm font-bold mt-0.5">
            비자 진단 완료
          </p>
        </div>
      </div>

      {/* KOR: 모험자 정보 요약 / ENG: Adventurer info summary */}
      <div className="bg-gray-900/60 rounded-lg border border-amber-800/30 p-3 max-w-xs mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">
            Adventurer Profile
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-gray-500 text-right">Origin:</span>
          <span className="text-gray-300 text-left">
            {country ? `${country.flag} ${country.name}` : userNationality}
          </span>
          <span className="text-gray-500 text-right">Level:</span>
          <span className="text-gray-300 text-left">{userAge}세</span>
        </div>
      </div>

      {/* KOR: 경험치 획득 바 / ENG: EXP gained bar */}
      <div className="max-w-xs mx-auto">
        <div className="flex items-center justify-between mb-1">
          <span className="text-amber-400 text-xs font-bold">+2,500 EXP</span>
          <span className="text-amber-300/60 text-[10px]">DIAGNOSIS COMPLETE</span>
        </div>
        <div className="h-2 rounded-full bg-gray-800 border border-amber-900/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-400 transition-all duration-1500 ease-out"
            style={{ width: `${expFill}%` }}
          />
        </div>
      </div>

      {/* KOR: 획득 경로 수 표시 / ENG: Display acquired path count */}
      {showItems && (
        <div className="flex items-center justify-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-300 font-bold">
            {pathwayCount}개의 비자 경로를 발견했습니다!
          </span>
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </div>
      )}
    </div>
  );
}

// ============================================================
// KOR: 메인 페이지 컴포넌트
// ENG: Main Page Component
// ============================================================
export default function Diagnosis9Page() {
  // KOR: 현재 대화 단계 / ENG: Current dialogue step
  const [currentStep, setCurrentStep] = useState<DialogueStep>('intro');

  // KOR: 사용자 입력 값 / ENG: User input values
  const [inputNationality, setInputNationality] = useState('');
  const [inputAge, setInputAge] = useState(0);
  const [inputEducation, setInputEducation] = useState('');
  const [inputFund, setInputFund] = useState('');
  const [inputGoal, setInputGoal] = useState('');
  const [inputPriority, setInputPriority] = useState('');

  // KOR: 진단 결과 / ENG: Diagnosis result
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 타이핑 시작 여부 / ENG: Whether typing should start
  const [shouldType, setShouldType] = useState(true);

  // KOR: 선택지 활성화 여부 / ENG: Whether choices are active
  const [canSelect, setCanSelect] = useState(false);

  // KOR: 펼쳐진 카드 인덱스 / ENG: Expanded card index
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // KOR: 대화 기록 / ENG: Dialogue history
  const [history, setHistory] = useState<Array<{ step: string; answer: string }>>([]);

  // KOR: 스크롤 컨테이너 ref / ENG: Scroll container ref
  const containerRef = useRef<HTMLDivElement>(null);

  // KOR: 현재 NPC 대사 / ENG: Current NPC dialogue
  const currentDialogue = NPC_DIALOGUES[currentStep] ?? NPC_DIALOGUES['intro'];

  // KOR: 타이핑 애니메이션 훅 사용 / ENG: Use typing animation hook
  const { displayedText, isComplete, skipToEnd } = useTypingAnimation(
    currentDialogue.text,
    25,
    shouldType
  );

  // KOR: 영어 번역 타이핑 (한국어 완료 후) / ENG: English typing after Korean completes
  const { displayedText: displayedEn } = useTypingAnimation(
    currentDialogue.textEn,
    15,
    shouldType && isComplete
  );

  // KOR: 타이핑 완료 시 선택지 표시 / ENG: Show choices when typing completes
  useEffect(() => {
    if (isComplete && currentStep !== 'analyzing' && currentStep !== 'result') {
      const timer = setTimeout(() => setCanSelect(true), 300);
      return () => clearTimeout(timer);
    }
    setCanSelect(false);
  }, [isComplete, currentStep]);

  // KOR: 분석 단계: 3초 후 결과로 이동 / ENG: Analyzing: move to result after 3s
  useEffect(() => {
    if (currentStep === 'analyzing') {
      const timer = setTimeout(() => {
        setResult(mockDiagnosisResult);
        setCurrentStep('result');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // KOR: 단계 변경 시 스크롤 최상단으로 / ENG: Scroll to top on step change
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // KOR: 단계 인덱스 계산 / ENG: Calculate step index
  const currentStepIndex = STEP_ORDER.indexOf(currentStep);
  const totalInputSteps = 6;

  // KOR: 다음 단계로 이동하는 공통 함수 / ENG: Common function to move to next step
  const goToNextStep = useCallback(
    (answerLabel: string) => {
      setHistory((prev) => [...prev, { step: currentStep, answer: answerLabel }]);
      setShouldType(false);
      setCanSelect(false);

      setTimeout(() => {
        const nextIndex = STEP_ORDER.indexOf(currentStep) + 1;
        if (nextIndex < STEP_ORDER.length) {
          setCurrentStep(STEP_ORDER[nextIndex]);
          setShouldType(true);
        }
      }, 400);
    },
    [currentStep]
  );

  // KOR: 선택지 목록 생성 / ENG: Generate choice list per step
  const getChoices = (): DialogueChoice[] => {
    switch (currentStep) {
      case 'intro':
        return [
          { label: '좋습니다, 시작하겠습니다!', labelEn: "Let's begin!", value: 'start', icon: '⚔️' },
        ];
      case 'nationality':
        return popularCountries.map((c) => ({
          label: `${c.flag} ${c.name}`,
          labelEn: c.code,
          value: c.name,
          icon: c.flag,
        }));
      case 'education':
        return educationOptions.map((edu, i) => ({
          label: edu,
          labelEn: edu,
          value: edu,
          icon: ['📚', '🏫', '🎓', '🔬', '📐'][i] ?? '📚',
        }));
      case 'fund':
        return fundOptions.map((f, i) => ({
          label: f,
          labelEn: f,
          value: f,
          icon: ['💰', '💵', '💴', '💷', '💎'][i] ?? '💰',
        }));
      case 'goal':
        return goalOptions.map((g, i) => ({
          label: g,
          labelEn: g,
          value: g,
          icon: ['📖', '💼', '🏢', '🎓', '🏆'][i] ?? '🎯',
        }));
      case 'priority':
        return priorityOptions.map((p, i) => ({
          label: p,
          labelEn: p,
          value: p,
          icon: ['⚡', '💰', '🎯', '🔭'][i] ?? '⭐',
        }));
      default:
        return [];
    }
  };

  // KOR: 선택지 클릭 핸들러 / ENG: Choice click handler
  const handleSelect = (value: string | number) => {
    switch (currentStep) {
      case 'intro':
        goToNextStep('시작');
        break;
      case 'nationality':
        setInputNationality(String(value));
        goToNextStep(String(value));
        break;
      case 'education':
        setInputEducation(String(value));
        goToNextStep(String(value));
        break;
      case 'fund':
        setInputFund(String(value));
        goToNextStep(String(value));
        break;
      case 'goal':
        setInputGoal(String(value));
        goToNextStep(String(value));
        break;
      case 'priority':
        setInputPriority(String(value));
        goToNextStep(String(value));
        break;
      default:
        break;
    }
  };

  // KOR: 나이 제출 핸들러 / ENG: Age submit handler
  const handleAgeSubmit = (age: number) => {
    setInputAge(age);
    goToNextStep(`${age}세`);
  };

  // KOR: 리셋 핸들러 / ENG: Reset handler
  const handleReset = () => {
    setCurrentStep('intro');
    setInputNationality('');
    setInputAge(0);
    setInputEducation('');
    setInputFund('');
    setInputGoal('');
    setInputPriority('');
    setResult(null);
    setShouldType(true);
    setCanSelect(false);
    setExpandedCard(null);
    setHistory([]);
  };

  const choices = getChoices();

  // ============================================================
  // KOR: 렌더링 / ENG: Render
  // ============================================================
  return (
    // KOR: 전체 화면 다크 판타지 배경 / ENG: Full-screen dark fantasy background
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* KOR: 배경 장식 레이어 / ENG: Background decoration layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute top-0 left-0 right-0 h-40 bg-linear-to-b from-amber-950/15 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-black/30 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-black/30 to-transparent" />
        {/* KOR: 별/파티클 효과 / ENG: Star/particle effects */}
        <div className="absolute top-12 left-16 w-1 h-1 bg-amber-400/40 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute top-28 right-20 w-0.5 h-0.5 bg-amber-300/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-52 left-3/4 w-1 h-1 bg-purple-400/25 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-3/4 left-10 w-0.5 h-0.5 bg-blue-400/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-5/6 right-1/3 w-1 h-1 bg-amber-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/4 w-0.5 h-0.5 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* KOR: 메인 레이아웃 / ENG: Main layout */}
      <div
        ref={containerRef}
        className="relative z-10 max-w-lg mx-auto min-h-screen flex flex-col overflow-y-auto"
      >
        {/* KOR: 상단 헤더 (스티키) / ENG: Top header (sticky) */}
        <header className="sticky top-0 z-20 bg-gray-950/85 backdrop-blur-md border-b border-amber-900/30 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            {/* KOR: 타이틀 / ENG: Title */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h1 className="text-amber-300 text-sm font-bold tracking-wider uppercase">
                Visa Quest
              </h1>
              <span className="text-gray-600 text-[10px]">— 비자 진단</span>
            </div>

            {/* KOR: 리셋 버튼 / ENG: Reset button */}
            {currentStep !== 'intro' && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-500 hover:text-amber-400 hover:bg-amber-900/20 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* KOR: 경험치 바 (결과 화면 제외) / ENG: EXP bar (except result screen) */}
          {currentStep !== 'result' && (
            <ExperienceBar
              currentStep={Math.min(currentStepIndex, totalInputSteps)}
              totalSteps={totalInputSteps}
            />
          )}
        </header>

        {/* KOR: 메인 콘텐츠 영역 / ENG: Main content area */}
        <main className="flex-1 px-4 py-6">
          {/* ==================== */}
          {/* KOR: 결과 화면 / ENG: Result screen */}
          {/* ==================== */}
          {currentStep === 'result' && result ? (
            <div className="space-y-6">
              {/* KOR: 퀘스트 완료 헤더 / ENG: Quest complete header */}
              <QuestCompleteHeader
                pathwayCount={result.pathways.length}
                userNationality={inputNationality}
                userAge={inputAge}
              />

              {/* KOR: 모험 기록 요약 / ENG: Adventure log summary */}
              <div className="bg-gray-900/40 rounded-lg border border-gray-800/50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Map className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400 text-xs font-bold uppercase">
                    Adventure Log / 모험 기록
                  </span>
                </div>
                <div className="space-y-1">
                  {history
                    .filter((h) => h.step !== 'intro')
                    .map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px]">
                        <span className="text-gray-600 w-20 shrink-0 uppercase">{h.step}</span>
                        <span className="text-amber-400/60">{'>'}</span>
                        <span className="text-gray-300 truncate">{h.answer}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* KOR: 획득 비자 경로 목록 / ENG: Acquired visa pathway list */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Gem className="w-5 h-5 text-amber-400" />
                  <h2 className="text-amber-300 font-bold tracking-wider uppercase text-sm">
                    Acquired Pathways / 획득 경로
                  </h2>
                </div>

                <div className="space-y-4">
                  {result.pathways.map((pathway, idx) => (
                    <PathwayItemCard
                      key={pathway.id}
                      pathway={pathway}
                      index={idx}
                      isExpanded={expandedCard === idx}
                      onToggle={() =>
                        setExpandedCard(expandedCard === idx ? null : idx)
                      }
                    />
                  ))}
                </div>
              </div>

              {/* KOR: 호환 비자 목록 / ENG: Compatible visas list */}
              <div className="bg-gray-900/40 rounded-lg border border-gray-800/50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300 text-xs font-bold uppercase">
                    All Visa Types Found / 발견된 비자 유형
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.pathways
                    .flatMap((p) => (Array.isArray(p.visaChain) ? p.visaChain : []).map((v) => v.visa))
                    .filter((v, i, arr) => arr.indexOf(v) === i)
                    .map((visa) => (
                      <span
                        key={visa}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-800/80 border border-gray-700/50 text-gray-300"
                      >
                        {visa}
                      </span>
                    ))}
                </div>
              </div>

              {/* KOR: 다시 진단하기 버튼 / ENG: Retry button */}
              <div className="text-center pt-2 pb-8">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-linear-to-r from-amber-700/40 to-amber-600/40 border border-amber-500/50 text-amber-300 font-bold text-sm hover:from-amber-600/50 hover:to-amber-500/50 transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4" />
                  NEW QUEST / 다시 진단하기
                </button>
              </div>
            </div>
          ) : currentStep === 'analyzing' ? (
            /* ==================== */
            /* KOR: 분석 화면 / ENG: Analyzing screen */
            /* ==================== */
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <NpcCharacter isSpeaking />
                <div className="flex-1">
                  <DialogueFrame
                    speaker={currentDialogue.speaker}
                    text={displayedText}
                    textEn={displayedEn}
                    isTyping={!isComplete}
                    onSkip={skipToEnd}
                  />
                </div>
              </div>
              <AnalyzingAnimation />
            </div>
          ) : (
            /* ==================== */
            /* KOR: 입력 화면 / ENG: Input screen */
            /* ==================== */
            <div className="space-y-5">
              {/* KOR: 최근 대화 기록 (최대 2개) / ENG: Recent dialogue history (max 2) */}
              {history.length > 0 && (
                <div className="space-y-2 opacity-60">
                  {history.slice(-2).map((h, i) => (
                    <div
                      key={i}
                      className="bg-gray-900/30 rounded-lg border border-gray-800/30 p-2.5"
                    >
                      <div className="flex items-center gap-1 text-[10px] text-gray-600 uppercase mb-0.5">
                        {h.step}
                      </div>
                      <div className="flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 text-amber-500/40 shrink-0" />
                        <span className="text-amber-300/60 text-xs truncate">{h.answer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* KOR: NPC + 대화창 / ENG: NPC + dialogue box */}
              <div className="flex items-start gap-4">
                <NpcCharacter isSpeaking={!isComplete} />
                <div className="flex-1">
                  <DialogueFrame
                    speaker={currentDialogue.speaker}
                    text={displayedText}
                    textEn={isComplete ? displayedEn : ''}
                    isTyping={!isComplete}
                    onSkip={skipToEnd}
                  />
                </div>
              </div>

              {/* KOR: 선택지 영역 (타이핑 완료 후 표시) / ENG: Choices area (shown after typing) */}
              {canSelect && (
                <div className="space-y-2">
                  {/* KOR: 나이는 별도 입력 컴포넌트 / ENG: Age uses separate input component */}
                  {currentStep === 'age' ? (
                    <AgeInput onSubmit={handleAgeSubmit} disabled={false} />
                  ) : (
                    <>
                      {choices.length > 6 && (
                        <p className="text-gray-600 text-[10px] text-center">
                          스크롤하여 더 많은 선택지를 확인하세요 / Scroll for more options
                        </p>
                      )}
                      <div
                        className={`space-y-2 ${
                          choices.length > 6 ? 'max-h-96 overflow-y-auto pr-1' : ''
                        }`}
                      >
                        {choices.map((choice, idx) => (
                          <ChoiceButton
                            key={String(choice.value)}
                            choice={choice}
                            index={idx}
                            onSelect={handleSelect}
                            disabled={!canSelect}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </main>

        {/* KOR: 하단 푸터 / ENG: Bottom footer */}
        <footer className="px-4 py-3 text-center border-t border-gray-800/30">
          <p className="text-gray-700 text-[10px]">
            JobChaJa Visa Quest Engine v1.0 | Powered by 14 Evaluators &amp; 31 Visa Types
          </p>
        </footer>
      </div>
    </div>
  );
}
