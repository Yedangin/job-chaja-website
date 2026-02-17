'use client';

// KOR: React 및 서드파티 라이브러리 임포트
// ENG: Import React and third-party libraries
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot,
  User,
  ChevronRight,
  Clock,
  DollarSign,
  Globe,
  GraduationCap,
  Target,
  TrendingUp,
  Wallet,
  RotateCcw,
  ArrowDown,
  Sparkles,
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
  DiagnosisInput,
  DiagnosisResult,
  RecommendedPathway,
  getScoreColor,
  getFeasibilityEmoji,
  mockPathways,
  CompatPathway,
} from '../_mock/diagnosis-mock-data';

// ============================================================
// KOR: 채팅 메시지 타입 정의
// ENG: Chat message type definitions
// ============================================================

/** KOR: 선택지 버튼 아이템 / ENG: Choice button item */
interface ChoiceItem {
  label: string;
  subLabel?: string;
  emoji?: string;
  value: string | number;
}

/** KOR: 채팅 메시지 / ENG: Chat message */
interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  type: 'text' | 'choices' | 'result-intro' | 'result-card' | 'milestone-timeline';
  text?: string;
  subText?: string;
  choices?: ChoiceItem[];
  choiceKey?: keyof DiagnosisInput;
  inputType?: 'number';
  pathway?: RecommendedPathway;
  pathways?: RecommendedPathway[];
}

// ============================================================
// KOR: 질문 정의 (국적 -> 나이 -> 학력 -> 자금 -> 목표 -> 우선순위)
// ENG: Question definitions (nationality -> age -> education -> fund -> goal -> priority)
// ============================================================

interface QuestionDef {
  key: keyof DiagnosisInput;
  text: string;
  subText: string;
  choices?: ChoiceItem[];
  inputType?: 'number';
  inputPlaceholder?: string;
}

const questionDefs: QuestionDef[] = [
  {
    key: 'nationality',
    text: '안녕하세요! 저는 잡차자 비자 가이드예요. 먼저, 어느 나라에서 오셨나요?',
    subText: "Hi! I'm JobChaJa's visa guide. First, which country are you from?",
    choices: popularCountries.map((c) => ({
      label: c.nameKo,
      subLabel: c.nameEn,
      emoji: c.flag,
      value: c.code,
    })),
  },
  {
    key: 'age',
    text: '반가워요! 나이가 어떻게 되시나요? (숫자로 입력해주세요)',
    subText: 'Nice to meet you! How old are you? (Enter a number)',
    inputType: 'number',
    inputPlaceholder: '예: 25',
  },
  {
    key: 'educationLevel',
    text: '좋아요! 최종 학력을 알려주세요.',
    subText: 'Great! What is your highest education level?',
    choices: educationOptions.map((e) => ({
      label: e.labelKo,
      subLabel: e.labelEn,
      emoji: e.emoji,
      value: e.value,
    })),
  },
  {
    key: 'availableAnnualFund',
    text: '연간 사용 가능한 자금 규모는 어느 정도인가요?',
    subText: 'How much funding do you have available per year?',
    choices: fundOptions.map((f) => ({
      label: f.labelKo,
      subLabel: f.labelEn,
      value: f.value,
    })),
  },
  {
    key: 'finalGoal',
    text: '거의 다 왔어요! 한국에서의 최종 목표가 뭔가요?',
    subText: 'Almost there! What is your ultimate goal in Korea?',
    choices: goalOptions.map((g) => ({
      label: g.labelKo,
      subLabel: g.descKo,
      emoji: g.emoji,
      value: g.value,
    })),
  },
  {
    key: 'priorityPreference',
    text: '마지막 질문! 비자 경로에서 가장 중요한 것은?',
    subText: 'Last question! What matters most in your visa pathway?',
    choices: priorityOptions.map((p) => ({
      label: p.labelKo,
      subLabel: p.descKo,
      emoji: p.emoji,
      value: p.value,
    })),
  },
];

// ============================================================
// KOR: 유틸리티 함수
// ENG: Utility functions
// ============================================================

/** KOR: 고유 메시지 ID 생성 / ENG: Generate unique message ID */
let msgCounter = 0;
function genMsgId(): string {
  msgCounter += 1;
  return `msg-${Date.now()}-${msgCounter}`;
}

/** KOR: 금액 포맷 / ENG: Format cost in 만원 */
function formatCost(costWon: number): string {
  if (costWon === 0) return '무료 (Free)';
  if (costWon >= 10000) return `약 ${(costWon / 10000).toFixed(1)}억원`;
  return `약 ${costWon.toLocaleString()}만원`;
}

/** KOR: 개월 포맷 / ENG: Format months as years and months */
function formatMonths(months: number): string {
  if (months < 12) return `${months}개월`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years}년`;
  return `${years}년 ${rem}개월`;
}

// ============================================================
// KOR: 타이핑 인디케이터 컴포넌트
// ENG: Typing indicator component
// ============================================================
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

// ============================================================
// KOR: 점수 게이지 바 컴포넌트
// ENG: Score gauge bar component
// ============================================================
function ScoreGauge({ score, label }: { score: number; label: string }) {
  const color = getScoreColor(score);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-600">추천 점수 / Score</span>
        <span className="text-xs font-bold" style={{ color }}>
          {getFeasibilityEmoji(label)} {label} ({score}점)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${Math.min(score, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ============================================================
// KOR: 비자 체인 표시 컴포넌트
// ENG: Visa chain display component
// ============================================================
function VisaChainDisplay({ visaChain }: { visaChain: string }) {
  const steps = visaChain.split(' \u2192 ').map((s) => s.trim());
  return (
    <div className="flex items-center gap-1 flex-wrap mt-2">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            {step}
          </span>
          {idx < steps.length - 1 && <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ============================================================
// KOR: 결과 카드 컴포넌트 (말풍선 안에 들어가는 카드)
// ENG: Result card component (card inside chat bubble)
// ============================================================
function ResultCard({
  pathway,
  rank,
  onShowMilestones,
}: {
  pathway: RecommendedPathway;
  rank: number;
  onShowMilestones: (pathway: RecommendedPathway) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* KOR: 카드 헤더 / ENG: Card header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">#{rank}</span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{pathway.nameKo}</h3>
              <p className="text-xs text-gray-500">{pathway.nameEn}</p>
            </div>
          </div>
          <span className="text-xl">{getFeasibilityEmoji(pathway.feasibilityLabel)}</span>
        </div>

        {/* KOR: 점수 게이지 / ENG: Score gauge */}
        <div className="mt-3">
          <ScoreGauge score={pathway.finalScore} label={pathway.feasibilityLabel} />
        </div>

        {/* KOR: 요약 정보 / ENG: Summary info */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>{formatMonths(pathway.estimatedMonths)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Wallet className="w-3.5 h-3.5 text-green-500" />
            <span>{formatCost(pathway.estimatedCostWon)}</span>
          </div>
        </div>

        {/* KOR: 비자 체인 / ENG: Visa chain */}
        <VisaChainDisplay visaChain={pathway.visaChain} />

        {/* KOR: 확장 토글 / ENG: Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-blue-500 hover:text-blue-700 font-medium"
        >
          {expanded ? '접기' : '자세히 보기'}
        </button>

        {/* KOR: 확장 영역 / ENG: Expanded area */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            <p className="text-xs text-gray-500">{pathway.note}</p>
            {pathway.nextSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <span className="text-blue-500 font-bold mt-0.5">{idx + 1}.</span>
                <div>
                  <span className="font-medium text-gray-700">{step.nameKo}</span>
                  <span className="text-gray-500 ml-1">- {step.description}</span>
                </div>
              </div>
            ))}
            <button
              onClick={() => onShowMilestones(pathway)}
              className="mt-2 w-full text-xs bg-blue-50 text-blue-600 rounded-lg py-2 hover:bg-blue-100 transition-colors font-medium"
            >
              마일스톤 타임라인 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// KOR: 마일스톤 타임라인 컴포넌트
// ENG: Milestone timeline component
// ============================================================
function MilestoneTimeline({ pathway }: { pathway: RecommendedPathway }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-gray-800">
        {pathway.nameKo} 타임라인
      </p>
      <div className="relative pl-6 space-y-4">
        {/* KOR: 세로 라인 / ENG: Vertical line */}
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-blue-200" />

        {pathway.milestones.map((ms, idx) => (
          <div key={idx} className="relative">
            {/* KOR: 타임라인 점 / ENG: Timeline dot */}
            <div
              className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 ${
                ms.type === 'final_goal'
                  ? 'bg-green-500 border-green-300'
                  : 'bg-blue-500 border-blue-300'
              }`}
            />
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700">
                  {ms.monthFromStart === 0 ? '시작' : `+${ms.monthFromStart}개월`}
                </span>
                {ms.visaStatus !== 'none' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                    {ms.visaStatus}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-800 mt-1">{ms.nameKo}</p>
              {ms.canWorkPartTime && (
                <p className="text-xs text-green-600 mt-1">
                  아르바이트 가능 ({ms.weeklyHours > 0 ? `주 ${ms.weeklyHours}시간` : '무제한'})
                  {ms.estimatedMonthlyIncome > 0 && ` / 월 약 ${ms.estimatedMonthlyIncome}만원`}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">{ms.requirements}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// KOR: 봇 메시지 말풍선 컴포넌트
// ENG: Bot message bubble component
// ============================================================
function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 mb-4 animate-fadeIn">
      {/* KOR: 봇 아바타 / ENG: Bot avatar */}
      <div className="shrink-0 w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// KOR: 사용자 메시지 말풍선 컴포넌트
// ENG: User message bubble component
// ============================================================
function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-end gap-2 mb-4 animate-fadeIn">
      <div className="max-w-[75%] bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
        {children}
      </div>
      <div className="shrink-0 w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
        <User className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  );
}

// ============================================================
// KOR: 빠른 답변 칩 컴포넌트
// ENG: Quick answer chip component
// ============================================================
function QuickChips({
  choices,
  onSelect,
}: {
  choices: ChoiceItem[];
  onSelect: (choice: ChoiceItem) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {choices.map((choice) => (
        <button
          key={String(choice.value)}
          onClick={() => onSelect(choice)}
          className="inline-flex items-center gap-1.5 bg-white border border-blue-300 text-blue-600 rounded-full px-3 py-1.5 text-sm hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-sm active:scale-95"
        >
          {choice.emoji && <span>{choice.emoji}</span>}
          <span>{choice.label}</span>
        </button>
      ))}
    </div>
  );
}

// ============================================================
// KOR: 메인 페이지 컴포넌트
// ENG: Main page component
// ============================================================
export default function Diagnosis1Page() {
  // KOR: 상태 정의 / ENG: State definitions
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputData, setInputData] = useState<Partial<DiagnosisInput>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [numberInput, setNumberInput] = useState('');
  const [phase, setPhase] = useState<'input' | 'analyzing' | 'result'>('input');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // KOR: 채팅 스크롤 / ENG: Chat scroll
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // KOR: 봇 메시지 추가 유틸 / ENG: Utility to add bot message
  const addBotMessage = useCallback(
    (msg: Omit<ChatMessage, 'id' | 'sender'>, delay: number = 800): Promise<void> => {
      return new Promise((resolve) => {
        setIsTyping(true);
        setShowInput(false);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [...prev, { ...msg, id: genMsgId(), sender: 'bot' }]);
          resolve();
        }, delay);
      });
    },
    []
  );

  // KOR: 사용자 메시지 추가 유틸 / ENG: Utility to add user message
  const addUserMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: genMsgId(), sender: 'user', type: 'text', text },
    ]);
  }, []);

  // KOR: 첫 메시지 표시 / ENG: Show first message
  useEffect(() => {
    if (messages.length === 0) {
      const first = questionDefs[0];
      addBotMessage(
        {
          type: first.choices ? 'choices' : 'text',
          text: first.text,
          subText: first.subText,
          choices: first.choices,
          choiceKey: first.key,
          inputType: first.inputType,
        },
        1200
      ).then(() => setShowInput(true));
    }
    // KOR: 첫 마운트에만 실행 / ENG: Run only on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // KOR: 선택지 응답 처리 / ENG: Handle choice answer
  const handleChoiceSelect = useCallback(
    (choice: ChoiceItem) => {
      const question = questionDefs[currentStep];
      if (!question) return;

      // KOR: 사용자 메시지 추가 / ENG: Add user message
      const displayText = choice.emoji
        ? `${choice.emoji} ${choice.label}`
        : choice.label;
      addUserMessage(displayText);

      // KOR: 데이터 저장 / ENG: Store data
      const newData = { ...inputData, [question.key]: choice.value };
      setInputData(newData);
      setShowInput(false);

      // KOR: 다음 질문 진행 / ENG: Proceed to next question
      const nextStep = currentStep + 1;
      if (nextStep < questionDefs.length) {
        setCurrentStep(nextStep);
        const next = questionDefs[nextStep];
        addBotMessage(
          {
            type: next.choices ? 'choices' : 'text',
            text: next.text,
            subText: next.subText,
            choices: next.choices,
            choiceKey: next.key,
            inputType: next.inputType,
          },
          1000
        ).then(() => setShowInput(true));
      } else {
        // KOR: 모든 질문 완료 -> 결과 표시 / ENG: All questions done -> show results
        showResults(newData);
      }
    },
    [currentStep, inputData, addBotMessage, addUserMessage]
  );

  // KOR: 숫자 입력 응답 처리 / ENG: Handle number input answer
  const handleNumberSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const val = parseInt(numberInput, 10);
      if (isNaN(val) || val < 1 || val > 100) return;

      const question = questionDefs[currentStep];
      if (!question) return;

      addUserMessage(`${val}살`);

      const newData = { ...inputData, [question.key]: val };
      setInputData(newData);
      setNumberInput('');
      setShowInput(false);

      const nextStep = currentStep + 1;
      if (nextStep < questionDefs.length) {
        setCurrentStep(nextStep);
        const next = questionDefs[nextStep];
        addBotMessage(
          {
            type: next.choices ? 'choices' : 'text',
            text: next.text,
            subText: next.subText,
            choices: next.choices,
            choiceKey: next.key,
            inputType: next.inputType,
          },
          1000
        ).then(() => setShowInput(true));
      } else {
        showResults(newData);
      }
    },
    [currentStep, inputData, numberInput, addBotMessage, addUserMessage]
  );

  // KOR: 결과 표시 / ENG: Show results
  const showResults = useCallback(
    (finalData: Partial<DiagnosisInput>) => {
      setPhase('analyzing');
      setShowInput(false);

      // KOR: 분석 중 메시지 / ENG: Analyzing message
      addBotMessage(
        {
          type: 'text',
          text: '모든 정보를 확인했어요! 잠시만요, 최적의 비자 경로를 분석하고 있어요...',
          subText: "Got all the info! Hold on, I'm analyzing the best visa pathways for you...",
        },
        1000
      ).then(() => {
        // KOR: 결과 소개 메시지 / ENG: Result intro message
        setTimeout(() => {
          addBotMessage(
            {
              type: 'result-intro',
              text: `분석 완료! ${mockDiagnosisResult.meta.totalPathwaysEvaluated}개 경로를 평가해서 ${mockDiagnosisResult.pathways.length}개 추천 경로를 찾았어요.`,
              subText: `Analysis complete! Evaluated ${mockDiagnosisResult.meta.totalPathwaysEvaluated} pathways and found ${mockDiagnosisResult.pathways.length} recommendations.`,
              pathways: mockDiagnosisResult.pathways,
            },
            1500
          ).then(() => {
            setPhase('result');
          });
        }, 500);
      });
    },
    [addBotMessage]
  );

  // KOR: 마일스톤 표시 / ENG: Show milestones
  const handleShowMilestones = useCallback(
    (pathway: RecommendedPathway) => {
      addBotMessage(
        {
          type: 'milestone-timeline',
          text: `${pathway.nameKo}의 단계별 타임라인이에요!`,
          subText: `Here is the step-by-step timeline for ${pathway.nameEn}!`,
          pathway,
        },
        800
      );
    },
    [addBotMessage]
  );

  // KOR: 다시 시작 / ENG: Reset
  const handleReset = useCallback(() => {
    setMessages([]);
    setInputData({});
    setCurrentStep(0);
    setIsTyping(false);
    setShowInput(false);
    setNumberInput('');
    setPhase('input');
    msgCounter = 0;
  }, []);

  // KOR: 현재 질문 / ENG: Current question
  const currentQuestion = questionDefs[currentStep];
  // KOR: 마지막 봇 메시지에서 선택지 추출 / ENG: Extract choices from last bot message
  const lastBotMsg = [...messages].reverse().find((m) => m.sender === 'bot');

  return (
    <div className="flex flex-col h-screen bg-linear-to-b from-blue-50 via-white to-blue-50">
      {/* KOR: 커스텀 애니메이션 스타일 / ENG: Custom animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      {/* KOR: 헤더 / ENG: Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">잡차자 비자 가이드</h1>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              온라인
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {phase === 'result' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded-full px-3 py-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              다시 진단
            </button>
          )}
          {/* KOR: 진행 바 / ENG: Progress bar */}
          {phase === 'input' && (
            <div className="flex items-center gap-1">
              {questionDefs.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx < currentStep
                      ? 'w-4 bg-blue-500'
                      : idx === currentStep
                      ? 'w-6 bg-blue-400'
                      : 'w-3 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </header>

      {/* KOR: 채팅 영역 / ENG: Chat area */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <UserBubble key={msg.id}>
                  <p className="text-sm">{msg.text}</p>
                </UserBubble>
              );
            }

            // KOR: 봇 메시지 유형별 렌더링 / ENG: Render bot message by type
            switch (msg.type) {
              case 'text':
                return (
                  <BotBubble key={msg.id}>
                    <p className="text-sm text-gray-800">{msg.text}</p>
                    {msg.subText && (
                      <p className="text-xs text-gray-400 mt-1">{msg.subText}</p>
                    )}
                  </BotBubble>
                );

              case 'choices':
                return (
                  <BotBubble key={msg.id}>
                    <p className="text-sm text-gray-800">{msg.text}</p>
                    {msg.subText && (
                      <p className="text-xs text-gray-400 mt-1">{msg.subText}</p>
                    )}
                    {/* KOR: 이미 응답된 질문의 칩은 비활성화 / ENG: Disable chips for already answered questions */}
                    {msg.choiceKey && inputData[msg.choiceKey] !== undefined && msg.choices && (
                      <div className="flex flex-wrap gap-1.5 mt-2 opacity-50 pointer-events-none">
                        {msg.choices.map((c) => (
                          <span
                            key={String(c.value)}
                            className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 rounded-full px-2.5 py-1 text-xs"
                          >
                            {c.emoji && <span>{c.emoji}</span>}
                            {c.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </BotBubble>
                );

              case 'result-intro':
                return (
                  <BotBubble key={msg.id}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <p className="text-sm font-bold text-gray-800">{msg.text}</p>
                      </div>
                      {msg.subText && (
                        <p className="text-xs text-gray-400">{msg.subText}</p>
                      )}
                      {/* KOR: 결과 카드 목록 / ENG: Result card list */}
                      {msg.pathways && (
                        <div className="space-y-3 mt-3">
                          {msg.pathways.map((pw, idx) => (
                            <ResultCard
                              key={pw.pathwayId}
                              pathway={pw}
                              rank={idx + 1}
                              onShowMilestones={handleShowMilestones}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </BotBubble>
                );

              case 'milestone-timeline':
                return (
                  <BotBubble key={msg.id}>
                    <p className="text-sm text-gray-800 mb-2">{msg.text}</p>
                    {msg.subText && (
                      <p className="text-xs text-gray-400 mb-3">{msg.subText}</p>
                    )}
                    {msg.pathway && <MilestoneTimeline pathway={msg.pathway} />}
                  </BotBubble>
                );

              default:
                return null;
            }
          })}

          {/* KOR: 타이핑 인디케이터 / ENG: Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-2 mb-4">
              <div className="shrink-0 w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm border border-gray-100">
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* KOR: 하단 입력 영역 / ENG: Bottom input area */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-gray-200 px-4 py-3 sticky bottom-0">
        <div className="max-w-2xl mx-auto">
          {/* KOR: 선택지 칩 표시 / ENG: Show choice chips */}
          {showInput && phase === 'input' && currentQuestion?.choices && (
            <div className="pb-1">
              <QuickChips choices={currentQuestion.choices} onSelect={handleChoiceSelect} />
            </div>
          )}

          {/* KOR: 숫자 입력 / ENG: Number input */}
          {showInput && phase === 'input' && currentQuestion?.inputType === 'number' && (
            <form onSubmit={handleNumberSubmit} className="flex gap-2">
              <input
                type="number"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder={currentQuestion.inputPlaceholder || '숫자를 입력하세요'}
                min={1}
                max={100}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={!numberInput}
                className="bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-full px-5 py-2.5 text-sm font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                입력
              </button>
            </form>
          )}

          {/* KOR: 분석 중 / ENG: Analyzing */}
          {phase === 'analyzing' && (
            <div className="flex items-center justify-center gap-2 py-2 text-sm text-blue-500">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              비자 경로 분석 중...
            </div>
          )}

          {/* KOR: 결과 완료 후 CTA / ENG: Post-result CTA */}
          {phase === 'result' && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded-full px-4 py-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                다시 진단하기
              </button>
              <button className="flex items-center gap-1.5 text-sm text-white bg-linear-to-r from-blue-500 to-blue-600 rounded-full px-5 py-2 hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">
                <Sparkles className="w-4 h-4" />
                상세 상담 요청
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
