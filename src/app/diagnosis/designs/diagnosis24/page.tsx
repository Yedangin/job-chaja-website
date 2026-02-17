'use client';

// 타로 카드 비자 진단 페이지 / Tarot Card Visa Diagnosis Page
// 디자인 #24: 신비로운 타로 카드 뒤집기로 비자 경로를 발견하는 컨셉
// Design #24: Discover visa pathways by flipping mystical tarot cards

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
import { Sparkles, Star, Moon, Sun, Eye, ChevronRight, RotateCcw, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';

// 진단 단계 타입 / Diagnosis step type
type DiagnosisStep = 'intro' | 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference' | 'reading' | 'result';

// 타로 카드 테마 색상 / Tarot card theme colors
const THEME = {
  bg: 'bg-[#0a0a1a]',
  navy: '#0a0a1a',
  navyMid: '#0f0f2d',
  navyLight: '#1a1a3e',
  gold: '#d4af37',
  goldLight: '#f0d060',
  goldDim: '#8a7020',
  purple: '#6b21a8',
  purpleLight: '#a855f7',
  star: '#ffe066',
};

// 타로 카드 심볼 배열 / Tarot card symbol array
const TAROT_SYMBOLS = ['☽', '✦', '⊛', '⋆', '✧', '⊕', '◈', '⌘', '⊗', '◉'];

// 별 배경 컴포넌트 / Starfield background component
function StarField() {
  // 랜덤 별 위치 고정값 / Fixed random star positions
  const stars = [
    { x: 5, y: 10, size: 1.5, opacity: 0.6 },
    { x: 15, y: 25, size: 1, opacity: 0.4 },
    { x: 25, y: 8, size: 2, opacity: 0.8 },
    { x: 35, y: 40, size: 1, opacity: 0.5 },
    { x: 45, y: 15, size: 1.5, opacity: 0.7 },
    { x: 55, y: 30, size: 1, opacity: 0.4 },
    { x: 65, y: 5, size: 2, opacity: 0.9 },
    { x: 75, y: 45, size: 1.5, opacity: 0.6 },
    { x: 85, y: 20, size: 1, opacity: 0.5 },
    { x: 92, y: 35, size: 2, opacity: 0.7 },
    { x: 10, y: 60, size: 1, opacity: 0.4 },
    { x: 20, y: 75, size: 1.5, opacity: 0.6 },
    { x: 30, y: 55, size: 1, opacity: 0.5 },
    { x: 40, y: 80, size: 2, opacity: 0.8 },
    { x: 50, y: 65, size: 1, opacity: 0.4 },
    { x: 60, y: 90, size: 1.5, opacity: 0.7 },
    { x: 70, y: 70, size: 1, opacity: 0.5 },
    { x: 80, y: 85, size: 2, opacity: 0.9 },
    { x: 90, y: 55, size: 1, opacity: 0.4 },
    { x: 8, y: 88, size: 1.5, opacity: 0.6 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {stars.map((star, i) => (
          <circle
            key={i}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill={THEME.star}
            opacity={star.opacity}
          />
        ))}
      </svg>
    </div>
  );
}

// 타로 카드 앞면 일러스트 / Tarot card front illustration
function TarotCardFront({ symbol, label, isSelected }: { symbol: string; label: string; isSelected: boolean }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-3 rounded-xl"
      style={{
        background: `linear-gradient(135deg, #1a1a3e 0%, #0f0f2d 50%, #1a0a2e 100%)`,
        border: `2px solid ${isSelected ? THEME.gold : THEME.goldDim}`,
        boxShadow: isSelected ? `0 0 20px ${THEME.gold}88` : 'none',
      }}
    >
      {/* 상단 장식 / Top decoration */}
      <div className="text-xs mb-1" style={{ color: THEME.goldDim }}>✦ ✦ ✦</div>
      {/* 중앙 심볼 / Center symbol */}
      <div className="text-4xl mb-2" style={{ color: THEME.gold }}>{symbol}</div>
      {/* 라벨 / Label */}
      <div className="text-center text-xs font-medium px-1" style={{ color: THEME.goldLight }}>{label}</div>
      {/* 하단 장식 / Bottom decoration */}
      <div className="text-xs mt-1" style={{ color: THEME.goldDim }}>✦ ✦ ✦</div>
    </div>
  );
}

// 타로 카드 뒷면 / Tarot card back
function TarotCardBack() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center rounded-xl"
      style={{
        background: `linear-gradient(135deg, #2d1a4a 0%, #1a0a2e 50%, #0f0a1a 100%)`,
        border: `2px solid ${THEME.goldDim}`,
      }}
    >
      <div className="text-2xl mb-1" style={{ color: THEME.goldDim }}>✦</div>
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
        style={{ border: `1px solid ${THEME.goldDim}`, color: THEME.goldDim }}
      >
        ✧
      </div>
      <div className="text-2xl mt-1" style={{ color: THEME.goldDim }}>✦</div>
    </div>
  );
}

// 타로 카드 컴포넌트 (3D 플립) / Tarot card component with 3D flip
function TarotCard({
  symbol,
  label,
  isFlipped,
  isSelected,
  onClick,
  delay = 0,
}: {
  symbol: string;
  label: string;
  isFlipped: boolean;
  isSelected: boolean;
  onClick: () => void;
  delay?: number;
}) {
  return (
    <div
      className="cursor-pointer"
      style={{ perspective: '800px', width: '100px', height: '150px', flexShrink: 0 }}
      onClick={onClick}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: `transform 0.6s ease ${delay}ms`,
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* 뒷면 / Back face */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <TarotCardBack />
        </div>
        {/* 앞면 / Front face */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <TarotCardFront symbol={symbol} label={label} isSelected={isSelected} />
        </div>
      </div>
    </div>
  );
}

// 인트로 화면 / Intro screen
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* 로고 / Logo */}
      <div className="mb-6 relative">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center text-5xl mx-auto"
          style={{
            background: `radial-gradient(circle, #2d1a4a 0%, #0f0f2d 70%)`,
            border: `3px solid ${THEME.gold}`,
            boxShadow: `0 0 40px ${THEME.gold}44`,
          }}
        >
          ✦
        </div>
        {/* 궤도 별 / Orbital stars */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: THEME.gold,
              transform: `rotate(${deg}deg) translateX(60px) translateY(-50%)`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* 제목 / Title */}
      <div className="mb-2" style={{ color: THEME.goldDim, fontSize: '12px', letterSpacing: '4px', textTransform: 'uppercase' }}>
        JOBCHAJA VISA ORACLE
      </div>
      <h1 className="text-3xl font-bold mb-2" style={{ color: THEME.gold, fontFamily: 'serif' }}>
        운명의 비자 타로
      </h1>
      <p className="text-sm mb-1" style={{ color: THEME.goldLight, opacity: 0.7 }}>Your Visa Destiny Revealed</p>

      {/* 구분선 / Divider */}
      <div className="flex items-center gap-3 my-5 w-64">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${THEME.goldDim})` }} />
        <span style={{ color: THEME.gold }}>✦</span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${THEME.goldDim})` }} />
      </div>

      {/* 설명 / Description */}
      <p className="text-sm leading-relaxed mb-2 max-w-xs" style={{ color: '#a89cc0' }}>
        카드를 뒤집으며 당신의 한국 비자 경로를 발견하세요.
      </p>
      <p className="text-xs mb-8" style={{ color: '#6d5a8a' }}>
        Flip the cards to reveal your Korean visa pathway
      </p>

      {/* 시작 버튼 / Start button */}
      <button
        onClick={onStart}
        className="px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:scale-105"
        style={{
          background: `linear-gradient(135deg, #8a5a00, ${THEME.gold}, #8a5a00)`,
          color: '#0a0a1a',
          boxShadow: `0 4px 24px ${THEME.gold}55`,
        }}
      >
        ✦ 카드 읽기 시작 ✦
      </button>

      <p className="mt-4 text-xs" style={{ color: '#3d2d5a' }}>
        총 6장의 카드를 선택합니다 • 6 cards to choose
      </p>
    </div>
  );
}

// 카드 선택 질문 단계 설정 / Card question step configuration
const STEP_CONFIGS: {
  step: DiagnosisStep;
  field: keyof DiagnosisInput;
  question: string;
  questionEn: string;
  symbol: string;
  arcana: string;
}[] = [
  { step: 'nationality', field: 'nationality', question: '당신의 고향은 어디입니까?', questionEn: 'Where is your homeland?', symbol: '☽', arcana: 'The Star — 별자리' },
  { step: 'age', field: 'age', question: '당신의 나이는 몇 살입니까?', questionEn: 'What is your age?', symbol: '☀', arcana: 'The Sun — 태양' },
  { step: 'educationLevel', field: 'educationLevel', question: '당신의 학문적 배경은 무엇입니까?', questionEn: 'What is your academic background?', symbol: '⊛', arcana: 'The Hierophant — 교황' },
  { step: 'availableAnnualFund', field: 'availableAnnualFund', question: '준비된 자금의 별자리는?', questionEn: 'What is your financial constellation?', symbol: '◉', arcana: 'The Wheel — 운명의 수레바퀴' },
  { step: 'finalGoal', field: 'finalGoal', question: '당신이 원하는 운명은 무엇입니까?', questionEn: 'What destiny do you seek?', symbol: '✦', arcana: 'The World — 세계' },
  { step: 'priorityPreference', field: 'priorityPreference', question: '어떤 길의 에너지를 원합니까?', questionEn: 'Which energy guides your path?', symbol: '⋆', arcana: 'The Chariot — 전차' },
];

// 나이 범위 옵션 / Age range options
const AGE_OPTIONS = [
  { value: 19, label: '19세 이하', labelEn: 'Under 19', symbol: TAROT_SYMBOLS[0] },
  { value: 22, label: '20~24세', labelEn: '20-24', symbol: TAROT_SYMBOLS[1] },
  { value: 27, label: '25~29세', labelEn: '25-29', symbol: TAROT_SYMBOLS[2] },
  { value: 32, label: '30~34세', labelEn: '30-34', symbol: TAROT_SYMBOLS[3] },
  { value: 37, label: '35~39세', labelEn: '35-39', symbol: TAROT_SYMBOLS[4] },
  { value: 45, label: '40세 이상', labelEn: '40+', symbol: TAROT_SYMBOLS[5] },
];

// 점수에 따른 타로 카드 이름 / Tarot card name by score
function getTarotTitle(score: number): string {
  if (score >= 60) return '태양 (The Sun)';
  if (score >= 40) return '별 (The Star)';
  if (score >= 20) return '달 (The Moon)';
  return '은둔자 (The Hermit)';
}

// 점수에 따른 타로 해석 / Tarot reading by score
function getTarotReading(pathway: RecommendedPathway, index: number): string {
  const readings = [
    `별들이 당신에게 이 경로를 가리킵니다. ${pathway.nameKo}의 에너지가 당신의 운명과 공명합니다.`,
    `달빛 아래, ${pathway.nameKo}의 길이 열립니다. 인내와 헌신이 이 카드를 선택한 당신을 안내합니다.`,
    `${pathway.visaChain}의 여정이 당신의 미래에 새겨져 있습니다. 우주가 이 길을 준비했습니다.`,
    `고대의 지혜가 말합니다. ${pathway.nameKo}를 통해 새로운 시작이 기다립니다.`,
    `운명의 수레바퀴가 돌아 ${pathway.nameKo}를 가리킵니다. 변화의 시간이 왔습니다.`,
  ];
  return readings[index % readings.length];
}

// 비용 포맷 / Cost format
function formatCost(won: number): string {
  if (won === 0) return '무료';
  if (won >= 10000) return `${(won / 10000).toFixed(0)}억원`;
  if (won >= 1000) return `${(won / 1000).toFixed(1)}천만원`;
  return `${won}만원`;
}

// 메인 컴포넌트 / Main component
export default function Diagnosis24Page() {
  // 현재 단계 / Current step
  const [currentStep, setCurrentStep] = useState<DiagnosisStep>('intro');
  // 진단 입력값 / Diagnosis input values
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // 뒤집힌 카드 인덱스들 / Flipped card indices
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  // 선택된 카드 인덱스 / Selected card index
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  // 결과 화면에서 확장된 경로 인덱스 / Expanded pathway index in result
  const [expandedPathway, setExpandedPathway] = useState<number | null>(0);
  // 리딩 애니메이션 완료 여부 / Reading animation complete
  const [readingDone, setReadingDone] = useState(false);
  // 현재 단계 설정 / Current step config
  const currentConfig = STEP_CONFIGS.find((c) => c.step === currentStep);
  // 결과 경로 / Result pathways
  const pathways = mockDiagnosisResult.pathways;

  // 카드 뒤집기 처리 / Handle card flip
  const handleCardFlip = (index: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    // 잠시 후 선택 처리 / Select after short delay
    setTimeout(() => {
      setSelectedCard(index);
    }, 400);
  };

  // 다음 단계로 이동 / Move to next step
  const handleNext = (value: string | number) => {
    if (!currentConfig) return;
    const fieldKey = currentConfig.field;
    setInput((prev) => ({ ...prev, [fieldKey]: value }));

    const stepOrder: DiagnosisStep[] = [
      'nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'
    ];
    const currentIndex = stepOrder.indexOf(currentStep as DiagnosisStep);

    // 카드 상태 초기화 / Reset card states
    setFlippedCards(new Set());
    setSelectedCard(null);

    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      // 리딩 화면으로 / Go to reading screen
      setCurrentStep('reading');
      setTimeout(() => {
        setReadingDone(true);
        setTimeout(() => setCurrentStep('result'), 1000);
      }, 3000);
    }
  };

  // 처음으로 / Restart
  const handleRestart = () => {
    setCurrentStep('intro');
    setInput({});
    setFlippedCards(new Set());
    setSelectedCard(null);
    setExpandedPathway(0);
    setReadingDone(false);
  };

  // 현재 단계의 카드 옵션 생성 / Generate card options for current step
  const getCardOptions = (): { value: string | number; label: string; labelEn: string; symbol: string }[] => {
    switch (currentStep) {
      case 'nationality':
        return popularCountries.map((c, i) => ({
          value: c.code,
          label: `${c.flag} ${c.nameKo}`,
          labelEn: c.nameEn,
          symbol: TAROT_SYMBOLS[i % TAROT_SYMBOLS.length],
        }));
      case 'age':
        return AGE_OPTIONS.map((a) => ({
          value: a.value,
          label: a.label,
          labelEn: a.labelEn,
          symbol: a.symbol,
        }));
      case 'educationLevel':
        return educationOptions.map((e, i) => ({
          value: e.value,
          label: `${e.emoji} ${e.labelKo}`,
          labelEn: e.labelEn,
          symbol: TAROT_SYMBOLS[i % TAROT_SYMBOLS.length],
        }));
      case 'availableAnnualFund':
        return fundOptions.map((f, i) => ({
          value: f.value,
          label: f.labelKo,
          labelEn: f.labelEn,
          symbol: TAROT_SYMBOLS[i % TAROT_SYMBOLS.length],
        }));
      case 'finalGoal':
        return goalOptions.map((g, i) => ({
          value: g.value,
          label: `${g.emoji} ${g.labelKo}`,
          labelEn: g.descKo,
          symbol: TAROT_SYMBOLS[i % TAROT_SYMBOLS.length],
        }));
      case 'priorityPreference':
        return priorityOptions.map((p, i) => ({
          value: p.value,
          label: `${p.emoji} ${p.labelKo}`,
          labelEn: p.descKo,
          symbol: TAROT_SYMBOLS[i % TAROT_SYMBOLS.length],
        }));
      default:
        return [];
    }
  };

  const cardOptions = getCardOptions();
  const stepIndex = STEP_CONFIGS.findIndex((c) => c.step === currentStep);

  return (
    <div className="min-h-screen" style={{ background: THEME.navy, color: '#e8d5b7' }}>
      {/* 별 배경 / Star background */}
      <StarField />

      {/* 상단 장식 바 / Top decorative bar */}
      {currentStep !== 'intro' && (
        <div
          className="fixed top-0 left-0 right-0 z-10 h-1"
          style={{ background: `linear-gradient(to right, ${THEME.purple}, ${THEME.gold}, ${THEME.purple})` }}
        />
      )}

      {/* 인트로 / Intro */}
      {currentStep === 'intro' && <IntroScreen onStart={() => setCurrentStep('nationality')} />}

      {/* 카드 선택 단계 / Card selection steps */}
      {currentConfig && currentStep !== 'intro' && currentStep !== 'reading' && currentStep !== 'result' && (
        <div className="min-h-screen flex flex-col px-4 py-8 relative z-[1]">
          {/* 단계 표시기 / Step indicator */}
          <div className="flex justify-center gap-2 mb-8 pt-4">
            {STEP_CONFIGS.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === stepIndex ? '24px' : '8px',
                  height: '8px',
                  background: i < stepIndex ? THEME.gold : i === stepIndex ? THEME.gold : THEME.goldDim,
                  opacity: i <= stepIndex ? 1 : 0.3,
                }}
              />
            ))}
          </div>

          {/* 아르카나 레이블 / Arcana label */}
          <div className="text-center mb-2">
            <span
              className="text-xs tracking-widest uppercase px-4 py-1 rounded-full"
              style={{ color: THEME.goldDim, border: `1px solid ${THEME.goldDim}33` }}
            >
              {currentConfig.arcana}
            </span>
          </div>

          {/* 중앙 심볼 / Center symbol */}
          <div className="text-center my-3 text-5xl" style={{ color: THEME.gold }}>
            {currentConfig.symbol}
          </div>

          {/* 질문 / Question */}
          <div className="text-center mb-1">
            <h2 className="text-xl font-bold mb-1" style={{ color: THEME.goldLight, fontFamily: 'serif' }}>
              {currentConfig.question}
            </h2>
            <p className="text-xs" style={{ color: THEME.goldDim }}>{currentConfig.questionEn}</p>
          </div>

          {/* 구분선 / Divider */}
          <div className="flex items-center gap-3 my-4 mx-auto w-48">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${THEME.goldDim})` }} />
            <span style={{ color: THEME.gold, fontSize: '10px' }}>✦</span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${THEME.goldDim})` }} />
          </div>

          {/* 안내 문구 / Instruction */}
          <p className="text-center text-xs mb-5" style={{ color: '#6d5a8a' }}>
            카드를 뒤집어 선택하세요 • Flip a card to choose
          </p>

          {/* 카드 그리드 / Card grid */}
          <div className="flex flex-wrap gap-4 justify-center mb-6 max-w-lg mx-auto">
            {cardOptions.map((option, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <TarotCard
                  symbol={option.symbol}
                  label={option.label}
                  isFlipped={flippedCards.has(i)}
                  isSelected={selectedCard === i}
                  onClick={() => {
                    if (!flippedCards.has(i)) {
                      handleCardFlip(i);
                    }
                  }}
                  delay={i * 30}
                />
                {/* 카드 레이블 (뒤집힌 후) / Card label after flip */}
                {flippedCards.has(i) && (
                  <div className="text-center max-w-[100px]">
                    <p className="text-xs font-medium" style={{ color: THEME.goldLight }}>{option.label}</p>
                    <p className="text-xs" style={{ color: THEME.goldDim }}>{option.labelEn}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 선택 확인 버튼 / Confirm selection button */}
          {selectedCard !== null && (
            <div className="flex justify-center mt-2">
              <button
                onClick={() => handleNext(cardOptions[selectedCard].value)}
                className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold tracking-wider transition-all duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, #8a5a00, ${THEME.gold})`,
                  color: '#0a0a1a',
                  boxShadow: `0 4px 20px ${THEME.gold}44`,
                }}
              >
                이 카드로 결정 ✦
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 리딩 애니메이션 화면 / Reading animation screen */}
      {currentStep === 'reading' && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative z-[1]">
          {/* 회전하는 원형 / Rotating circle */}
          <div className="relative mb-8">
            <div
              className="w-40 h-40 rounded-full flex items-center justify-center"
              style={{
                border: `2px solid ${THEME.goldDim}`,
                animation: 'spin 4s linear infinite',
              }}
            >
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center text-5xl"
                style={{
                  background: `radial-gradient(circle, #2d1a4a, #0a0a1a)`,
                  border: `1px solid ${THEME.gold}`,
                  color: THEME.gold,
                  boxShadow: `0 0 30px ${THEME.gold}44`,
                }}
              >
                ✦
              </div>
            </div>
            {/* 회전 별들 / Rotating stars */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  background: THEME.gold,
                  transform: `rotate(${deg}deg) translateX(76px) translateY(-50%)`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-3" style={{ color: THEME.gold, fontFamily: 'serif' }}>
            카드를 읽는 중...
          </h2>
          <p className="text-sm mb-2" style={{ color: THEME.goldLight, opacity: 0.7 }}>
            Reading your destiny...
          </p>
          <p className="text-xs mt-4 max-w-xs" style={{ color: '#6d5a8a' }}>
            별자리의 에너지를 모아 당신의 비자 운명을 해석합니다.
            <br />
            The stars align to reveal your visa pathway.
          </p>

          {/* CSS 애니메이션 / CSS animation */}
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* 결과 화면 / Result screen */}
      {currentStep === 'result' && (
        <div className="min-h-screen pb-20 relative z-[1]">
          {/* 결과 헤더 / Result header */}
          <div
            className="px-6 py-8 text-center relative overflow-hidden"
            style={{ background: `linear-gradient(180deg, #1a0a2e 0%, ${THEME.navy} 100%)` }}
          >
            {/* 배경 장식 / Background decoration */}
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${THEME.gold} 0%, transparent 60%)` }}
            />

            <div className="relative">
              <div className="text-xs tracking-widest mb-3" style={{ color: THEME.goldDim }}>
                ✦ THE READING IS COMPLETE ✦
              </div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: THEME.gold, fontFamily: 'serif' }}>
                당신의 비자 운명
              </h1>
              <p className="text-xs mb-4" style={{ color: THEME.goldDim }}>Your Visa Destiny Has Been Revealed</p>

              {/* 총 경로 수 / Total pathways */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                style={{ background: '#1a1a3e', border: `1px solid ${THEME.goldDim}`, color: THEME.goldLight }}
              >
                <Sparkles className="w-4 h-4" style={{ color: THEME.gold }} />
                {pathways.length}개의 경로가 당신을 기다립니다
                <Sparkles className="w-4 h-4" style={{ color: THEME.gold }} />
              </div>
            </div>
          </div>

          {/* 경로 카드들 / Pathway cards */}
          <div className="px-4 pt-4 space-y-4">
            {pathways.map((pathway, index) => {
              const isExpanded = expandedPathway === index;
              const scoreColor = getScoreColor(pathway.finalScore);
              const tarotTitle = getTarotTitle(pathway.finalScore);
              const reading = getTarotReading(pathway, index);

              // 각 카드별 타로 심볼 / Tarot symbol per card
              const cardSymbols = ['✦', '☽', '☀', '⊛', '◉'];
              const cardSymbol = cardSymbols[index % cardSymbols.length];

              return (
                <div
                  key={pathway.pathwayId}
                  className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, #1a1a3e 0%, #0f0f2d 100%)`,
                    border: `1px solid ${isExpanded ? THEME.gold : THEME.goldDim + '55'}`,
                    boxShadow: isExpanded ? `0 0 24px ${THEME.gold}33` : 'none',
                  }}
                  onClick={() => setExpandedPathway(isExpanded ? null : index)}
                >
                  {/* 카드 헤더 / Card header */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* 타로 심볼 원 / Tarot symbol circle */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
                        style={{
                          background: `radial-gradient(circle, #2d1a4a, #0f0f2d)`,
                          border: `1.5px solid ${scoreColor}`,
                          color: scoreColor,
                          boxShadow: `0 0 12px ${scoreColor}44`,
                        }}
                      >
                        {cardSymbol}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* 순위 + 타로 이름 / Rank + tarot name */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs" style={{ color: THEME.goldDim }}>
                            {index + 1}번째 카드
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#2d1a4a', color: THEME.goldLight }}>
                            {tarotTitle}
                          </span>
                        </div>

                        {/* 경로 이름 / Pathway name */}
                        <h3 className="font-bold text-sm mb-0.5" style={{ color: THEME.goldLight }}>
                          {pathway.nameKo}
                        </h3>
                        <p className="text-xs" style={{ color: '#6d5a8a' }}>{pathway.nameEn}</p>

                        {/* 비자 체인 / Visa chain */}
                        <div className="flex flex-wrap items-center gap-1 mt-2">
                          {pathway.visaChain.split(' → ').map((visa, vi) => (
                            <React.Fragment key={vi}>
                              <span
                                className="text-xs px-2 py-0.5 rounded"
                                style={{ background: '#0f0f2d', color: THEME.gold, border: `1px solid ${THEME.goldDim}44` }}
                              >
                                {visa}
                              </span>
                              {vi < pathway.visaChain.split(' → ').length - 1 && (
                                <ArrowRight className="w-3 h-3 shrink-0" style={{ color: THEME.goldDim }} />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* 점수 / Score */}
                      <div className="text-center shrink-0">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                          style={{
                            background: `${scoreColor}22`,
                            border: `1.5px solid ${scoreColor}`,
                            color: scoreColor,
                          }}
                        >
                          {pathway.finalScore}
                        </div>
                        <p className="text-xs mt-1" style={{ color: THEME.goldDim }}>점수</p>
                      </div>
                    </div>

                    {/* 요약 정보 / Summary info */}
                    <div className="flex gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${THEME.goldDim}22` }}>
                      <div className="flex items-center gap-1 text-xs" style={{ color: '#8a7890' }}>
                        <Clock className="w-3 h-3" />
                        {pathway.estimatedMonths}개월
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: '#8a7890' }}>
                        <DollarSign className="w-3 h-3" />
                        {formatCost(pathway.estimatedCostWon)}
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: '#8a7890' }}>
                        {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
                      </div>
                    </div>
                  </div>

                  {/* 확장 영역 / Expanded area */}
                  {isExpanded && (
                    <div className="px-4 pb-4" style={{ borderTop: `1px solid ${THEME.goldDim}33` }}>
                      {/* 타로 리딩 / Tarot reading */}
                      <div
                        className="mt-4 p-4 rounded-xl"
                        style={{ background: '#0a0a1a', border: `1px solid ${THEME.goldDim}44` }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="w-4 h-4" style={{ color: THEME.gold }} />
                          <span className="text-xs font-bold" style={{ color: THEME.gold }}>
                            타로 리딩 • Tarot Reading
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#c4a8d4' }}>
                          {reading}
                        </p>
                      </div>

                      {/* 마일스톤 / Milestones */}
                      <div className="mt-4">
                        <h4 className="text-xs font-bold mb-3 flex items-center gap-2" style={{ color: THEME.goldDim }}>
                          <Star className="w-3 h-3" />
                          운명의 여정 • Journey Milestones
                        </h4>
                        <div className="space-y-2">
                          {pathway.milestones.map((milestone, mi) => (
                            <div key={mi} className="flex gap-3 items-start">
                              {/* 타임라인 점 / Timeline dot */}
                              <div className="flex flex-col items-center shrink-0">
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                  style={{
                                    background: '#1a1a3e',
                                    border: `1px solid ${THEME.gold}`,
                                    color: THEME.gold,
                                  }}
                                >
                                  {mi + 1}
                                </div>
                                {mi < pathway.milestones.length - 1 && (
                                  <div className="w-px flex-1 mt-1" style={{ background: `${THEME.goldDim}44`, minHeight: '16px' }} />
                                )}
                              </div>
                              <div className="flex-1 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium" style={{ color: THEME.goldLight }}>
                                    {milestone.nameKo}
                                  </span>
                                  {milestone.visaStatus && milestone.visaStatus !== 'none' && (
                                    <span
                                      className="text-xs px-1.5 py-0.5 rounded"
                                      style={{ background: '#2d1a4a', color: THEME.gold, fontSize: '10px' }}
                                    >
                                      {milestone.visaStatus}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs mt-0.5" style={{ color: '#6d5a8a' }}>
                                  {milestone.monthFromStart}개월 후 • {milestone.requirements}
                                </p>
                                {milestone.canWorkPartTime && (
                                  <p className="text-xs mt-0.5" style={{ color: '#4d9a6d' }}>
                                    ✦ 파트타임 가능 ({milestone.weeklyHours}시간/주)
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 다음 단계 / Next steps */}
                      {pathway.nextSteps.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-xs font-bold mb-3" style={{ color: THEME.goldDim }}>
                            ✦ 첫 번째 행동 • First Actions
                          </h4>
                          <div className="space-y-2">
                            {pathway.nextSteps.map((step, si) => (
                              <div
                                key={si}
                                className="flex gap-2 p-3 rounded-lg"
                                style={{ background: '#0f0f2d', border: `1px solid ${THEME.goldDim}33` }}
                              >
                                <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" style={{ color: THEME.gold }} />
                                <div>
                                  <p className="text-xs font-medium" style={{ color: THEME.goldLight }}>{step.nameKo}</p>
                                  <p className="text-xs mt-0.5" style={{ color: '#6d5a8a' }}>{step.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 메모 / Note */}
                      {pathway.note && (
                        <div
                          className="mt-3 p-3 rounded-lg text-xs"
                          style={{
                            background: `${THEME.gold}11`,
                            border: `1px solid ${THEME.gold}33`,
                            color: THEME.goldDim,
                          }}
                        >
                          <Moon className="w-3 h-3 inline mr-1" />
                          {pathway.note}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 하단 액션 / Bottom actions */}
          <div className="px-4 mt-8 pb-8">
            {/* 구분선 / Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${THEME.goldDim})` }} />
              <span style={{ color: THEME.gold }}>✦</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${THEME.goldDim})` }} />
            </div>

            {/* 상담 CTA / Consultation CTA */}
            <div
              className="p-5 rounded-2xl text-center mb-4"
              style={{
                background: `linear-gradient(135deg, #1a0a2e, #0f0f2d)`,
                border: `1px solid ${THEME.goldDim}`,
              }}
            >
              <div className="text-2xl mb-2">🔮</div>
              <h3 className="font-bold mb-1 text-sm" style={{ color: THEME.goldLight }}>
                더 깊은 리딩을 원하시나요?
              </h3>
              <p className="text-xs mb-4" style={{ color: THEME.goldDim }}>
                비자 전문가와 1:1 상담으로 정확한 경로를 찾으세요
                <br />
                <span style={{ color: '#4d3a6d' }}>Consult with a visa expert for precise guidance</span>
              </p>
              <button
                className="w-full py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, #8a5a00, ${THEME.gold})`,
                  color: '#0a0a1a',
                  boxShadow: `0 4px 16px ${THEME.gold}44`,
                }}
              >
                ✦ 전문가 상담 신청 ✦
              </button>
            </div>

            {/* 다시 읽기 / Read again */}
            <button
              onClick={handleRestart}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm transition-all duration-300"
              style={{
                background: 'transparent',
                border: `1px solid ${THEME.goldDim}`,
                color: THEME.goldDim,
              }}
            >
              <RotateCcw className="w-4 h-4" />
              다시 카드 읽기 • Read Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
