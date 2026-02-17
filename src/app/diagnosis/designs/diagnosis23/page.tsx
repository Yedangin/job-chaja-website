'use client';

// 보드게임 비자 진단 페이지 / Board Game Visa Diagnosis Page
// 디자인 #23: 보드게임 판을 따라가며 칸칸이 정보를 입력
// Design #23: Navigate the board game to input info step by step

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
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Trophy,
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Map,
  Clock,
  DollarSign,
  Flag,
  User,
  GraduationCap,
  Globe,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle2,
  Circle,
  ArrowRight,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type StepKey = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

interface BoardSquare {
  // 보드 칸 정보 / Board square info
  id: number;
  step: StepKey | 'start' | 'finish';
  label: string;
  color: string;
  icon: React.ReactNode;
  isCorner?: boolean;
  isEvent?: boolean;
}

interface DiceState {
  // 주사위 상태 / Dice state
  value: number;
  isRolling: boolean;
  rollCount: number;
}

// ============================================================
// 상수 / Constants
// ============================================================

// 보드 칸 색상 테마 / Board square color themes
const SQUARE_COLORS = [
  'bg-emerald-100 border-emerald-300',
  'bg-lime-100 border-lime-300',
  'bg-teal-100 border-teal-300',
  'bg-green-100 border-green-300',
  'bg-cyan-100 border-cyan-300',
  'bg-emerald-100 border-emerald-300',
  'bg-lime-100 border-lime-300',
  'bg-teal-100 border-teal-300',
];

// 주사위 아이콘 맵 / Dice icon map
const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

// 스텝 레이블 / Step labels
const STEP_LABELS: Record<StepKey, string> = {
  nationality: '국적 선택',
  age: '나이 입력',
  educationLevel: '학력 선택',
  availableAnnualFund: '자금 선택',
  finalGoal: '목표 선택',
  priorityPreference: '우선순위',
};

// ============================================================
// 메인 컴포넌트 / Main Component
// ============================================================

export default function Diagnosis23Page() {
  // 진단 입력 상태 / Diagnosis input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // 현재 스텝 인덱스 / Current step index (0~5)
  const [currentStep, setCurrentStep] = useState<number>(0);
  // 플레이어 토큰 위치 (보드 칸 번호) / Player token position on board
  const [tokenPosition, setTokenPosition] = useState<number>(0);
  // 주사위 상태 / Dice state
  const [dice, setDice] = useState<DiceState>({ value: 1, isRolling: false, rollCount: 0 });
  // 결과 표시 여부 / Show result flag
  const [showResult, setShowResult] = useState<boolean>(false);
  // 결과 데이터 / Result data
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  // 펼쳐진 경로 인덱스 / Expanded pathway index
  const [expandedPathway, setExpandedPathway] = useState<number | null>(0);
  // 완주 애니메이션 / Finish animation
  const [showFinishAnimation, setShowFinishAnimation] = useState<boolean>(false);
  // 이벤트 카드 메시지 / Event card message
  const [eventMessage, setEventMessage] = useState<string | null>(null);

  // 스텝 순서 / Step order
  const STEPS: StepKey[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'];
  // 총 보드 칸 수 (시작 + 6 스텝 + 완료) / Total board squares
  const TOTAL_SQUARES = 8;

  // ============================================================
  // 보드 칸 정의 / Board square definitions
  // ============================================================
  const boardSquares: BoardSquare[] = [
    { id: 0, step: 'start', label: 'START', color: 'bg-amber-200 border-amber-400', icon: <Flag className="w-4 h-4" />, isCorner: true },
    { id: 1, step: 'nationality', label: '국적', color: 'bg-emerald-100 border-emerald-300', icon: <Globe className="w-4 h-4" /> },
    { id: 2, step: 'age', label: '나이', color: 'bg-lime-100 border-lime-300', icon: <User className="w-4 h-4" /> },
    { id: 3, step: 'educationLevel', label: '학력', color: 'bg-teal-100 border-teal-300', icon: <GraduationCap className="w-4 h-4" />, isEvent: true },
    { id: 4, step: 'availableAnnualFund', label: '자금', color: 'bg-green-100 border-green-300', icon: <DollarSign className="w-4 h-4" /> },
    { id: 5, step: 'finalGoal', label: '목표', color: 'bg-cyan-100 border-cyan-300', icon: <Star className="w-4 h-4" />, isEvent: true },
    { id: 6, step: 'priorityPreference', label: '우선순위', color: 'bg-emerald-100 border-emerald-300', icon: <Zap className="w-4 h-4" /> },
    { id: 7, step: 'finish', label: 'GOAL', color: 'bg-yellow-200 border-yellow-400', icon: <Trophy className="w-4 h-4" />, isCorner: true },
  ];

  // ============================================================
  // 이벤트 카드 메시지 / Event card messages
  // ============================================================
  const EVENT_MESSAGES = [
    '🎉 이벤트! 잡차자가 최적 경로를 찾고 있어요!',
    '🌟 행운의 칸! 비자 전문가의 도움을 받아보세요!',
    '🎲 특별 이벤트! 당신의 경로가 더 밝아집니다!',
  ];

  // ============================================================
  // 주사위 굴리기 / Roll dice
  // ============================================================
  const rollDice = useCallback(() => {
    if (dice.isRolling) return;

    // 현재 스텝의 입력이 완료되어야 주사위를 굴릴 수 있음
    // Must complete current step input before rolling
    if (currentStep > 0 && !isCurrentStepComplete()) return;

    setDice(prev => ({ ...prev, isRolling: true }));

    // 주사위 애니메이션 / Dice rolling animation
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDice(prev => ({
        ...prev,
        value: Math.floor(Math.random() * 6) + 1,
        rollCount: prev.rollCount + 1,
      }));
      rollCount++;
      if (rollCount >= 8) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDice(prev => ({ ...prev, value: finalValue, isRolling: false }));

        // 이벤트 칸 체크 / Check event square
        const nextPos = tokenPosition + 1;
        if (nextPos < TOTAL_SQUARES) {
          const sq = boardSquares[nextPos];
          if (sq.isEvent) {
            const msg = EVENT_MESSAGES[Math.floor(Math.random() * EVENT_MESSAGES.length)];
            setEventMessage(msg);
            setTimeout(() => setEventMessage(null), 2500);
          }
        }

        // 토큰 이동 / Move token
        setTokenPosition(prev => {
          const next = Math.min(prev + 1, TOTAL_SQUARES - 1);
          return next;
        });
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
      }
    }, 80);
  }, [dice.isRolling, currentStep, tokenPosition]);

  // ============================================================
  // 현재 스텝 완료 여부 / Check current step completion
  // ============================================================
  const isCurrentStepComplete = (): boolean => {
    if (currentStep === 0) return true;
    const step = STEPS[currentStep - 1];
    const val = input[step];
    if (step === 'age') return typeof val === 'number' && (val as number) >= 15 && (val as number) <= 60;
    return val !== undefined && val !== null && val !== '';
  };

  // ============================================================
  // 진단 실행 / Run diagnosis
  // ============================================================
  const runDiagnosis = () => {
    if (tokenPosition === TOTAL_SQUARES - 1) {
      setShowFinishAnimation(true);
      setTimeout(() => {
        setShowFinishAnimation(false);
        setResult(mockDiagnosisResult);
        setShowResult(true);
      }, 1800);
    }
  };

  useEffect(() => {
    if (tokenPosition === TOTAL_SQUARES - 1 && currentStep === STEPS.length) {
      runDiagnosis();
    }
  }, [tokenPosition, currentStep]);

  // ============================================================
  // 리셋 / Reset
  // ============================================================
  const reset = () => {
    setInput({});
    setCurrentStep(0);
    setTokenPosition(0);
    setDice({ value: 1, isRolling: false, rollCount: 0 });
    setShowResult(false);
    setResult(null);
    setExpandedPathway(0);
    setShowFinishAnimation(false);
    setEventMessage(null);
  };

  // ============================================================
  // 렌더: 주사위 / Render: Dice
  // ============================================================
  const renderDice = () => {
    const DiceIcon = DICE_ICONS[dice.value - 1];
    return (
      <div className="flex flex-col items-center gap-3">
        <div
          className={`relative cursor-pointer select-none transition-all duration-150 ${dice.isRolling ? 'animate-bounce' : 'hover:scale-110 active:scale-95'}`}
          onClick={rollDice}
          title="주사위를 굴려서 다음 칸으로 이동하세요 / Roll dice to move to next square"
        >
          {/* 우드 텍스처 주사위 / Wood-textured dice */}
          <div className={`
            w-20 h-20 rounded-2xl border-4 border-amber-600
            bg-linear-to-br from-amber-100 via-amber-50 to-amber-200
            shadow-[4px_4px_0px_#92400e,0_0_0_2px_#d97706]
            flex items-center justify-center
            ${dice.isRolling ? 'opacity-80' : ''}
          `}>
            <DiceIcon
              className={`w-12 h-12 text-amber-800 transition-all ${dice.isRolling ? 'rotate-12' : ''}`}
              strokeWidth={1.5}
            />
          </div>
          {/* 반짝임 효과 / Sparkle effect */}
          {!dice.isRolling && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-yellow-600 animate-pulse" />
          )}
        </div>
        <span className="text-sm font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          {dice.isRolling ? '굴리는 중... / Rolling...' : '주사위 굴리기 / Roll Dice'}
        </span>
      </div>
    );
  };

  // ============================================================
  // 렌더: 보드 맵 / Render: Board map
  // ============================================================
  const renderBoardMap = () => {
    return (
      <div className="relative bg-linear-to-br from-green-50 to-emerald-100 rounded-3xl border-4 border-emerald-400 p-4 shadow-xl">
        {/* 보드 제목 / Board title */}
        <div className="text-center mb-3">
          <span className="text-sm font-bold text-emerald-800 bg-emerald-200 px-3 py-1 rounded-full border border-emerald-400">
            🎯 잡차자 비자 진단 보드 / Visa Diagnosis Board
          </span>
        </div>

        {/* 보드 칸들 / Board squares */}
        <div className="flex flex-wrap justify-center gap-2">
          {boardSquares.map((sq, idx) => {
            const isActive = tokenPosition === sq.id;
            const isPassed = tokenPosition > sq.id;
            const isCurrent = sq.step !== 'start' && sq.step !== 'finish' && STEPS[currentStep - 1] === sq.step;

            return (
              <div
                key={sq.id}
                className={`
                  relative flex flex-col items-center justify-center
                  w-16 h-16 rounded-xl border-3 border-2 transition-all duration-300
                  ${sq.color}
                  ${isActive ? 'scale-110 shadow-lg ring-2 ring-amber-400' : ''}
                  ${isPassed ? 'opacity-70' : ''}
                  ${sq.isCorner ? 'w-20 h-20 rounded-2xl' : ''}
                  ${sq.isEvent ? 'border-dashed' : ''}
                `}
                title={sq.label}
              >
                {/* 완료 체크 / Done check */}
                {isPassed && sq.step !== 'start' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* 이벤트 별 / Event star */}
                {sq.isEvent && !isPassed && (
                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center border border-yellow-600">
                    <Star className="w-2 h-2 text-yellow-800" />
                  </div>
                )}

                {/* 아이콘 / Icon */}
                <div className={`${sq.isCorner ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {sq.icon}
                </div>
                <span className={`text-xs font-bold mt-0.5 ${sq.isCorner ? 'text-amber-800' : 'text-emerald-800'} text-center leading-tight`}>
                  {sq.label}
                </span>

                {/* 플레이어 토큰 / Player token */}
                {isActive && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-red-400 to-red-600 border-2 border-red-800 shadow-md flex items-center justify-center text-xs font-bold text-white animate-bounce">
                      🎭
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 경로 화살표 표시 / Path arrow indicator */}
        <div className="flex items-center justify-center mt-4 gap-1 flex-wrap">
          {boardSquares.map((sq, idx) => (
            <React.Fragment key={sq.id}>
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${tokenPosition >= sq.id ? 'bg-emerald-500 scale-125' : 'bg-emerald-200'}`} />
              {idx < boardSquares.length - 1 && (
                <div className={`w-3 h-0.5 transition-all duration-300 ${tokenPosition > sq.id ? 'bg-emerald-500' : 'bg-emerald-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================
  // 렌더: 입력 카드 / Render: Input card
  // ============================================================
  const renderInputCard = () => {
    if (currentStep === 0) {
      // 시작 화면 / Start screen
      return (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 shadow-lg text-center">
          <div className="text-6xl mb-3">🎲</div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-2">비자 진단 보드게임</h2>
          <p className="text-emerald-600 mb-4 text-sm">
            주사위를 굴려서 보드를 따라가며<br />
            6가지 질문에 답하면 최적 비자 경로를 알려드립니다!
          </p>
          <p className="text-xs text-gray-400">Roll the dice to navigate the board and answer 6 questions for your optimal visa path!</p>
          {renderDice()}
        </div>
      );
    }

    if (currentStep > STEPS.length) return null;

    const stepKey = STEPS[currentStep - 1];

    return (
      <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-lg overflow-hidden">
        {/* 카드 헤더 / Card header */}
        <div className="bg-linear-to-r from-emerald-400 to-teal-400 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 font-bold text-lg shadow">
            {currentStep}
          </div>
          <div>
            <p className="text-white text-xs opacity-80">Step {currentStep} of {STEPS.length}</p>
            <h3 className="text-white font-bold text-lg">{STEP_LABELS[stepKey]}</h3>
          </div>
          {/* 이벤트 카드 메시지 / Event card message */}
          {eventMessage && (
            <div className="ml-auto bg-yellow-100 border border-yellow-400 rounded-xl px-3 py-1 text-xs text-yellow-800 font-bold animate-pulse max-w-32">
              {eventMessage}
            </div>
          )}
        </div>

        {/* 카드 바디 / Card body */}
        <div className="p-4">
          {stepKey === 'nationality' && renderNationalityInput()}
          {stepKey === 'age' && renderAgeInput()}
          {stepKey === 'educationLevel' && renderEducationInput()}
          {stepKey === 'availableAnnualFund' && renderFundInput()}
          {stepKey === 'finalGoal' && renderGoalInput()}
          {stepKey === 'priorityPreference' && renderPriorityInput()}
        </div>

        {/* 주사위 섹션 / Dice section */}
        {isCurrentStepComplete() && (
          <div className="border-t border-emerald-100 p-4 bg-emerald-50 flex flex-col items-center gap-2">
            <p className="text-xs text-emerald-700 font-semibold">✅ 입력 완료! 주사위를 굴려 다음 칸으로 / Input done! Roll to next square</p>
            {renderDice()}
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // 렌더: 국적 입력 / Render: Nationality input
  // ============================================================
  const renderNationalityInput = () => (
    <div>
      <p className="text-sm text-gray-500 mb-3">어느 나라에서 오셨나요? / Where are you from?</p>
      <div className="grid grid-cols-3 gap-2">
        {popularCountries.map(c => (
          <button
            key={c.code}
            onClick={() => setInput(prev => ({ ...prev, nationality: c.code }))}
            className={`
              flex flex-col items-center p-2 rounded-xl border-2 transition-all text-xs font-semibold
              ${input.nationality === c.code
                ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105'
                : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50'}
            `}
          >
            <span className="text-2xl mb-1">{c.flag}</span>
            <span className="text-gray-700">{c.nameKo}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ============================================================
  // 렌더: 나이 입력 / Render: Age input
  // ============================================================
  const renderAgeInput = () => (
    <div>
      <p className="text-sm text-gray-500 mb-3">나이를 입력하세요 (15~60세) / Enter your age (15~60)</p>
      <div className="flex items-center gap-4 justify-center">
        <button
          onClick={() => setInput(prev => ({ ...prev, age: Math.max(15, ((prev.age as number) || 20) - 1) }))}
          className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-700 font-bold text-xl hover:bg-emerald-200 transition-all active:scale-95"
        >
          −
        </button>
        <div className="text-center">
          <div className="text-5xl font-bold text-emerald-700 w-24 text-center">
            {(input.age as number) || 20}
          </div>
          <div className="text-xs text-gray-400 mt-1">세 / years old</div>
        </div>
        <button
          onClick={() => setInput(prev => ({ ...prev, age: Math.min(60, ((prev.age as number) || 20) + 1) }))}
          className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-700 font-bold text-xl hover:bg-emerald-200 transition-all active:scale-95"
        >
          +
        </button>
      </div>
      {!(input.age) && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setInput(prev => ({ ...prev, age: 20 }))}
            className="text-xs text-emerald-600 underline"
          >
            20세로 시작하기 / Start with 20
          </button>
        </div>
      )}
    </div>
  );

  // ============================================================
  // 렌더: 학력 입력 / Render: Education input
  // ============================================================
  const renderEducationInput = () => (
    <div>
      <p className="text-sm text-gray-500 mb-3">최종 학력을 선택하세요 / Select your education level</p>
      <div className="space-y-2">
        {educationOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setInput(prev => ({ ...prev, educationLevel: opt.value }))}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
              ${input.educationLevel === opt.value
                ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50'}
            `}
          >
            <span className="text-xl">{opt.emoji}</span>
            <div>
              <div className="text-sm font-semibold text-gray-800">{opt.labelKo}</div>
              <div className="text-xs text-gray-400">{opt.labelEn}</div>
            </div>
            {input.educationLevel === opt.value && (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  // ============================================================
  // 렌더: 자금 입력 / Render: Fund input
  // ============================================================
  const renderFundInput = () => (
    <div>
      <p className="text-sm text-gray-500 mb-3">연간 사용 가능 자금 / Available annual fund</p>
      <div className="grid grid-cols-2 gap-2">
        {fundOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setInput(prev => ({ ...prev, availableAnnualFund: opt.value }))}
            className={`
              p-3 rounded-xl border-2 transition-all text-left
              ${input.availableAnnualFund === opt.value
                ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50'}
            `}
          >
            <div className="text-lg mb-1">💰</div>
            <div className="text-xs font-bold text-gray-800 leading-tight">{opt.labelKo}</div>
            <div className="text-xs text-gray-400">{opt.labelEn}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // ============================================================
  // 렌더: 목표 입력 / Render: Goal input
  // ============================================================
  const renderGoalInput = () => (
    <div>
      <p className="text-sm text-gray-500 mb-3">한국에서 무엇을 하고 싶으세요? / What do you want to do in Korea?</p>
      <div className="grid grid-cols-2 gap-3">
        {goalOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setInput(prev => ({ ...prev, finalGoal: opt.value }))}
            className={`
              p-4 rounded-2xl border-2 transition-all text-center
              ${input.finalGoal === opt.value
                ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105'
                : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50'}
            `}
          >
            <div className="text-3xl mb-2">{opt.emoji}</div>
            <div className="text-sm font-bold text-gray-800">{opt.labelKo}</div>
            <div className="text-xs text-gray-400 mt-1">{opt.descKo}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // ============================================================
  // 렌더: 우선순위 입력 / Render: Priority input
  // ============================================================
  const renderPriorityInput = () => (
    <div>
      <p className="text-sm text-gray-500 mb-3">가장 중요한 것은? / What matters most?</p>
      <div className="space-y-2">
        {priorityOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setInput(prev => ({ ...prev, priorityPreference: opt.value }))}
            className={`
              w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all
              ${input.priorityPreference === opt.value
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50'}
            `}
          >
            <span className="text-2xl">{opt.emoji}</span>
            <div className="text-left">
              <div className="text-sm font-bold text-gray-800">{opt.labelKo}</div>
              <div className="text-xs text-gray-400">{opt.descKo}</div>
            </div>
            {input.priorityPreference === opt.value && (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  // ============================================================
  // 렌더: 완주 화면 / Render: Finish animation
  // ============================================================
  const renderFinishAnimation = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm mx-4 animate-bounce">
        <div className="text-7xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">보드 완주!</h2>
        <p className="text-gray-500 text-sm">최적 비자 경로를 계산 중... / Calculating optimal visa path...</p>
        <div className="flex justify-center gap-1 mt-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // ============================================================
  // 렌더: 결과 경로 카드 / Render: Pathway result card
  // ============================================================
  const renderPathwayCard = (pathway: RecommendedPathway, idx: number) => {
    const isExpanded = expandedPathway === idx;
    const scoreColor = getScoreColor(pathway.finalScore);
    const feasEmoji = getFeasibilityEmoji(pathway.feasibilityLabel);
    const compatPathway = mockPathways.find(p => p.pathwayId === pathway.pathwayId);

    return (
      <div
        key={pathway.pathwayId}
        className={`
          bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden
          ${idx === 0 ? 'border-yellow-400 shadow-lg' : 'border-emerald-200 shadow-sm'}
        `}
      >
        {/* 카드 헤더 / Card header */}
        <button
          onClick={() => setExpandedPathway(isExpanded ? null : idx)}
          className="w-full flex items-center gap-3 p-4 text-left"
        >
          {/* 순위 메달 / Rank medal */}
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0 border-2
            ${idx === 0 ? 'bg-yellow-100 border-yellow-400 text-yellow-700' :
              idx === 1 ? 'bg-gray-100 border-gray-300 text-gray-600' :
              idx === 2 ? 'bg-orange-100 border-orange-300 text-orange-600' :
              'bg-emerald-50 border-emerald-200 text-emerald-600'}
          `}>
            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-800 text-sm truncate">{pathway.nameKo}</div>
            <div className="text-xs text-gray-400 truncate">{pathway.nameEn}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs">{feasEmoji} {pathway.feasibilityLabel}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500 flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {pathway.estimatedMonths}개월
              </span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500 flex items-center gap-0.5">
                <DollarSign className="w-3 h-3" />
                {pathway.estimatedCostWon.toLocaleString()}만원
              </span>
            </div>
          </div>

          {/* 점수 배지 / Score badge */}
          <div className="shrink-0 text-right">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
              style={{ backgroundColor: scoreColor }}
            >
              {pathway.finalScore}
            </div>
          </div>

          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
        </button>

        {/* 확장 내용 / Expanded content */}
        {isExpanded && (
          <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
            {/* 비자 체인 / Visa chain */}
            <div>
              <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">비자 경로 / Visa Chain</p>
              <div className="flex items-center gap-1 flex-wrap">
                {pathway.visaChain.split(' → ').map((visa, vIdx, arr) => (
                  <React.Fragment key={vIdx}>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300">
                      {visa}
                    </span>
                    {vIdx < arr.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-emerald-500 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* 마일스톤 / Milestones */}
            <div>
              <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">단계별 여정 / Milestones</p>
              <div className="space-y-2">
                {pathway.milestones.map((ms, mIdx) => (
                  <div key={mIdx} className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {ms.order}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-700">{ms.nameKo}</div>
                      <div className="text-xs text-gray-400">
                        {ms.monthFromStart}개월 차
                        {ms.canWorkPartTime && ` · 아르바이트 가능 (주${ms.weeklyHours}h)`}
                        {ms.estimatedMonthlyIncome > 0 && ` · 월 ${ms.estimatedMonthlyIncome}만원`}
                      </div>
                    </div>
                    {ms.visaStatus && ms.visaStatus !== 'none' && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold border border-blue-200 shrink-0">
                        {ms.visaStatus}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 다음 단계 / Next steps */}
            {pathway.nextSteps.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">지금 할 일 / Next Steps</p>
                <div className="space-y-1.5">
                  {pathway.nextSteps.map((ns, nsIdx) => (
                    <div key={nsIdx} className="flex items-start gap-2 p-2 bg-white rounded-lg border border-emerald-100">
                      <ArrowRight className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-gray-700">{ns.nameKo}</div>
                        <div className="text-xs text-gray-400">{ns.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 메모 / Note */}
            {pathway.note && (
              <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-sm">📌</span>
                <p className="text-xs text-amber-800">{pathway.note}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // 렌더: 결과 화면 / Render: Result screen
  // ============================================================
  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-green-50 to-teal-50 p-4">
        {/* 완주 배너 / Completion banner */}
        <div className="bg-linear-to-r from-yellow-400 to-amber-400 rounded-3xl p-6 text-center mb-6 shadow-xl border-4 border-yellow-500">
          <div className="text-5xl mb-2">🏆</div>
          <h1 className="text-2xl font-bold text-amber-900 mb-1">보드게임 완주!</h1>
          <p className="text-amber-800 text-sm">
            {result.meta.totalPathwaysEvaluated}개 경로 분석 완료 · {result.meta.hardFilteredOut}개 필터 제거
          </p>
          <p className="text-amber-700 text-xs mt-1">
            Analyzed {result.meta.totalPathwaysEvaluated} pathways · Filtered {result.meta.hardFilteredOut}
          </p>
        </div>

        {/* 입력 요약 / Input summary */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4 mb-5 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">입력 정보 요약 / Your Input Summary</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '국적', value: popularCountries.find(c => c.code === (input.nationality || mockInput.nationality))?.nameKo || '-', icon: '🌍' },
              { label: '나이', value: `${input.age || mockInput.age}세`, icon: '🎂' },
              { label: '학력', value: educationOptions.find(e => e.value === (input.educationLevel || mockInput.educationLevel))?.labelKo || '-', icon: '🎓' },
              { label: '자금', value: fundOptions.find(f => f.value === (input.availableAnnualFund ?? mockInput.availableAnnualFund))?.labelKo || '-', icon: '💰' },
              { label: '목표', value: goalOptions.find(g => g.value === (input.finalGoal || mockInput.finalGoal))?.labelKo || '-', icon: '🎯' },
              { label: '우선순위', value: priorityOptions.find(p => p.value === (input.priorityPreference || mockInput.priorityPreference))?.labelKo || '-', icon: '⭐' },
            ].map((item, idx) => (
              <div key={idx} className="bg-emerald-50 rounded-xl p-2 text-center border border-emerald-100">
                <div className="text-lg mb-0.5">{item.icon}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="text-xs font-bold text-emerald-800 mt-0.5 leading-tight">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 추천 경로 목록 / Recommended pathways */}
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-800 mb-1">🗺️ 추천 비자 경로</h2>
          <p className="text-xs text-gray-400 mb-3">Recommended visa pathways — tap to expand / 탭하여 상세 보기</p>
          <div className="space-y-3">
            {result.pathways.map((pathway, idx) => renderPathwayCard(pathway, idx))}
          </div>
        </div>

        {/* 다시 시작 버튼 / Restart button */}
        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-base transition-all shadow-lg active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          다시 진단하기 / Diagnose Again
        </button>

        <p className="text-center text-xs text-gray-400 mt-4 pb-4">
          잡차자 비자 진단 · Jobchaja Visa Diagnosis Engine
        </p>
      </div>
    );
  };

  // ============================================================
  // 메인 렌더 / Main render
  // ============================================================
  if (showResult) {
    return renderResult();
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* 상단 헤더 / Top header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-emerald-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-emerald-800 text-sm">비자 진단 보드게임</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 bg-emerald-100 px-2 py-1 rounded-full border border-emerald-200">
            {tokenPosition}/{TOTAL_SQUARES - 1} 칸
          </div>
          <button
            onClick={reset}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
            title="처음부터 / Restart"
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-8">
        {/* 보드 맵 / Board map */}
        {renderBoardMap()}

        {/* 입력 카드 / Input card */}
        {renderInputCard()}

        {/* 진행 상황 텍스트 / Progress text */}
        {currentStep > 0 && currentStep <= STEPS.length && (
          <div className="bg-white rounded-2xl border border-emerald-200 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-600">진행률 / Progress</span>
              <span className="text-xs text-emerald-600 font-bold">{Math.round((tokenPosition / (TOTAL_SQUARES - 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${(tokenPosition / (TOTAL_SQUARES - 1)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">START</span>
              <span className="text-xs text-gray-400">GOAL 🏆</span>
            </div>
          </div>
        )}

        {/* 게임 규칙 안내 / Game rules guide */}
        {currentStep === 0 && (
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
            <h3 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-1">
              <Star className="w-4 h-4" />
              게임 방법 / How to Play
            </h3>
            <ul className="space-y-1.5">
              {[
                '1️⃣ 주사위를 굴려 첫 번째 칸으로 이동',
                '2️⃣ 칸에 해당하는 질문에 답변 입력',
                '3️⃣ 입력 완료 후 다시 주사위를 굴려 전진',
                '4️⃣ GOAL에 도착하면 맞춤 비자 경로 확인!',
              ].map((rule, idx) => (
                <li key={idx} className="text-xs text-amber-700">{rule}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 완주 애니메이션 오버레이 / Finish animation overlay */}
      {showFinishAnimation && renderFinishAnimation()}
    </div>
  );
}
