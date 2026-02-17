'use client';

// ============================================================
// KOR: iMessage 스타일 비자 진단 — SMS 문자 대화 인터페이스
// ENG: iMessage-style visa diagnosis — SMS thread conversation UI
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send,
  ChevronLeft,
  Video,
  Info,
  Clock,
  DollarSign,
  ArrowRight,
  RotateCcw,
  Check,
  Sparkles,
  Zap,
} from 'lucide-react';

// KOR: 목업 데이터 및 타입 임포트 / ENG: Import mock data and types
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

/** KOR: 빠른 답변 선택지 / ENG: Quick reply choice */
interface QuickReplyChoice {
  label: string;
  subLabel?: string;
  emoji?: string;
  value: string | number;
}

/** KOR: 메시지 읽음 상태 / ENG: Message delivery status */
type DeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read';

/** KOR: 채팅 메시지 / ENG: Chat message */
interface SMSMessage {
  id: string;
  sender: 'system' | 'user';
  type: 'text' | 'quick-reply' | 'typing' | 'result-card' | 'result-summary' | 'time-divider';
  text?: string;
  subText?: string;
  choices?: QuickReplyChoice[];
  choiceKey?: keyof DiagnosisInput;
  inputType?: 'number';
  pathway?: RecommendedPathway;
  pathways?: RecommendedPathway[];
  deliveryStatus?: DeliveryStatus;
  timestamp?: string;
  isLastInGroup?: boolean;
}

/** KOR: 진단 대화 단계 / ENG: Diagnosis conversation step */
type ConversationStep =
  | 'welcome'
  | 'nationality'
  | 'age'
  | 'education'
  | 'fund'
  | 'goal'
  | 'priority'
  | 'analyzing'
  | 'result';

/** KOR: 질문 정의 / ENG: Question definition */
interface QuestionDef {
  key: keyof DiagnosisInput;
  step: ConversationStep;
  text: string;
  subText?: string;
  choices?: QuickReplyChoice[];
  inputType?: 'number';
  inputPlaceholder?: string;
}

// ============================================================
// KOR: 질문 목록 정의 / ENG: Question list definitions
// ============================================================

const questions: QuestionDef[] = [
  {
    key: 'nationality',
    step: 'nationality',
    text: '어느 나라에서 오셨나요?',
    subText: 'Where are you from?',
    choices: popularCountries.map((c) => ({
      label: `${c.flag} ${c.nameKo}`,
      subLabel: c.nameEn,
      value: c.code,
    })),
  },
  {
    key: 'age',
    step: 'age',
    text: '나이가 어떻게 되시나요?',
    subText: 'How old are you?',
    inputType: 'number',
    inputPlaceholder: '나이 입력 (예: 24)',
  },
  {
    key: 'educationLevel',
    step: 'education',
    text: '최종 학력을 알려주세요',
    subText: 'What is your education level?',
    choices: educationOptions.map((e) => ({
      label: e.labelKo,
      subLabel: e.labelEn,
      emoji: e.emoji,
      value: e.value,
    })),
  },
  {
    key: 'availableAnnualFund',
    step: 'fund',
    text: '1년 준비 가능한 자금이 얼마인가요?',
    subText: 'How much can you invest annually?',
    choices: fundOptions.map((f) => ({
      label: f.labelKo,
      subLabel: f.labelEn,
      value: f.value,
    })),
  },
  {
    key: 'finalGoal',
    step: 'goal',
    text: '한국에서의 최종 목표는요?',
    subText: "What's your goal in Korea?",
    choices: goalOptions.map((g) => ({
      label: `${g.emoji} ${g.labelKo}`,
      subLabel: g.descKo,
      value: g.value,
    })),
  },
  {
    key: 'priorityPreference',
    step: 'priority',
    text: '가장 중요한 것은 무엇인가요?',
    subText: "What's your priority?",
    choices: priorityOptions.map((p) => ({
      label: `${p.emoji} ${p.labelKo}`,
      subLabel: p.descKo,
      value: p.value,
    })),
  },
];

// ============================================================
// KOR: 유틸리티 함수 / ENG: Utility functions
// ============================================================

/** KOR: 현재 시간 포맷팅 / ENG: Format current time */
const formatTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
};

/** KOR: 고유 ID 생성 / ENG: Generate unique ID */
let idCounter = 0;
const generateId = (): string => {
  idCounter += 1;
  return `msg-${Date.now()}-${idCounter}`;
};

// ============================================================
// KOR: 타이핑 인디케이터 컴포넌트 / ENG: Typing indicator component
// ============================================================

const TypingIndicator: React.FC = () => (
  <div className="flex items-end gap-1.5 mb-2">
    {/* KOR: 시스템 아바타 / ENG: System avatar */}
    <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-sm">
      <Sparkles className="w-3.5 h-3.5 text-white" />
    </div>
    <div className="bg-[#e9e9eb] rounded-2xl rounded-bl-md px-4 py-3 max-w-[80px]">
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_1.4s_ease-in-out_0s_infinite]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  </div>
);

// ============================================================
// KOR: 읽음 표시 컴포넌트 / ENG: Delivery status indicator
// ============================================================

const DeliveryIndicator: React.FC<{ status: DeliveryStatus }> = ({ status }) => {
  if (status === 'sending') {
    return <Clock className="w-3 h-3 text-gray-400" />;
  }
  if (status === 'sent') {
    return <Check className="w-3 h-3 text-gray-400" />;
  }
  if (status === 'delivered') {
    return (
      <span className="text-[10px] text-gray-400 font-medium">Delivered</span>
    );
  }
  // read
  return (
    <span className="text-[10px] text-blue-500 font-medium">Read</span>
  );
};

// ============================================================
// KOR: 결과 카드 (MMS 리치 링크 프리뷰 스타일) / ENG: Result card (MMS rich link preview style)
// ============================================================

const ResultCard: React.FC<{ pathway: RecommendedPathway; rank: number }> = ({ pathway, rank }) => {
  // KOR: 펼침/접힘 상태 / ENG: Expand/collapse state
  const [expanded, setExpanded] = useState(false);

  const scoreColor = getScoreColor(pathway.finalScore);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 max-w-[300px] transition-all duration-300">
      {/* KOR: 리치 링크 상단 컬러 바 / ENG: Rich link top color bar */}
      <div className="h-1.5" style={{ backgroundColor: scoreColor }} />

      {/* KOR: 카드 헤더 / ENG: Card header */}
      <div className="p-3.5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">#{rank}</span>
            <span className="text-sm font-bold text-gray-900 leading-tight">{pathway.nameKo}</span>
          </div>
          <div
            className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
            style={{ backgroundColor: `${scoreColor}18` }}
          >
            <span className="text-sm font-bold" style={{ color: scoreColor }}>
              {pathway.finalScore}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 mb-3">{pathway.nameEn}</p>

        {/* KOR: 핵심 정보 그리드 / ENG: Key info grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 rounded-lg px-2.5 py-2">
            <div className="flex items-center gap-1 mb-0.5">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-400">소요 기간</span>
            </div>
            <span className="text-xs font-semibold text-gray-800">
              {pathway.estimatedMonths}개월
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg px-2.5 py-2">
            <div className="flex items-center gap-1 mb-0.5">
              <DollarSign className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-400">예상 비용</span>
            </div>
            <span className="text-xs font-semibold text-gray-800">
              {pathway.estimatedCostWon === 0 ? '무료' : `${pathway.estimatedCostWon.toLocaleString()}만원`}
            </span>
          </div>
        </div>

        {/* KOR: 실현 가능성 / ENG: Feasibility */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-xs">{emoji}</span>
          <span className="text-[11px] text-gray-600">
            실현 가능성: <span className="font-semibold" style={{ color: scoreColor }}>{pathway.feasibilityLabel}</span>
          </span>
        </div>

        {/* KOR: 비자 체인 / ENG: Visa chain */}
        <div className="flex items-center gap-1 flex-wrap mb-3">
          {pathway.visaChain.split(' → ').map((visa, i, arr) => (
            <React.Fragment key={visa + i}>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-[10px] font-semibold text-blue-700 border border-blue-100">
                {visa}
              </span>
              {i < arr.length - 1 && (
                <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* KOR: 펼침/접힘 영역 / ENG: Expandable section */}
        {expanded && (
          <div className="border-t border-gray-100 pt-3 mt-1 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {/* KOR: 마일스톤 타임라인 / ENG: Milestone timeline */}
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Timeline</p>
              <div className="space-y-2">
                {pathway.milestones.map((ms, idx) => (
                  <div key={ms.order} className="flex items-start gap-2">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 ${
                          idx === pathway.milestones.length - 1 ? 'bg-green-500' : 'bg-blue-400'
                        }`}
                      />
                      {idx < pathway.milestones.length - 1 && (
                        <div className="w-px h-5 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-gray-800 truncate">{ms.nameKo}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400">{ms.monthFromStart}개월차</span>
                        {ms.visaStatus !== 'none' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
                            {ms.visaStatus}
                          </span>
                        )}
                        {ms.canWorkPartTime && (
                          <span className="text-[10px] text-emerald-500 font-medium">
                            근무 {ms.weeklyHours > 0 ? `${ms.weeklyHours}h/w` : '무제한'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KOR: 다음 단계 / ENG: Next steps */}
            {pathway.nextSteps.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Next Steps</p>
                {pathway.nextSteps.map((ns) => (
                  <div key={ns.actionType} className="flex items-start gap-2 mb-1.5">
                    <Zap className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] font-medium text-gray-800">{ns.nameKo}</p>
                      <p className="text-[10px] text-gray-400">{ns.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* KOR: 참고사항 / ENG: Note */}
            {pathway.note && (
              <div className="bg-amber-50 rounded-lg px-3 py-2">
                <p className="text-[10px] text-amber-700">
                  <span className="font-semibold">Note: </span>{pathway.note}
                </p>
              </div>
            )}
          </div>
        )}

        {/* KOR: 더보기/접기 버튼 / ENG: Expand/collapse button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-2 py-1.5 text-[11px] font-medium text-blue-500 hover:text-blue-600 transition-colors"
        >
          {expanded ? '접기' : '자세히 보기'}
        </button>
      </div>
    </div>
  );
};

// ============================================================
// KOR: 메인 페이지 컴포넌트 / ENG: Main page component
// ============================================================

export default function Diagnosis7Page() {
  // KOR: 상태 관리 / ENG: State management
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('welcome');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [input, setInput] = useState<DiagnosisInput>({
    nationality: '',
    age: 0,
    educationLevel: '',
    availableAnnualFund: 0,
    finalGoal: '',
    priorityPreference: '',
  });
  const [isTyping, setIsTyping] = useState(false);
  const [numberInput, setNumberInput] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [currentChoices, setCurrentChoices] = useState<QuickReplyChoice[]>([]);
  const [currentChoiceKey, setCurrentChoiceKey] = useState<keyof DiagnosisInput | null>(null);
  const [isNumberStep, setIsNumberStep] = useState(false);

  // KOR: refs / ENG: refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // KOR: 하단 자동 스크롤 / ENG: Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // ============================================================
  // KOR: 메시지 추가 핼퍼 / ENG: Message adding helper
  // ============================================================

  /** KOR: 시스템 메시지 추가 (타이핑 애니메이션 포함) / ENG: Add system message with typing animation */
  const addSystemMessage = useCallback(
    (
      text: string,
      options?: {
        subText?: string;
        delay?: number;
        choices?: QuickReplyChoice[];
        choiceKey?: keyof DiagnosisInput;
        inputType?: 'number';
        type?: SMSMessage['type'];
        pathway?: RecommendedPathway;
        pathways?: RecommendedPathway[];
      }
    ): Promise<void> => {
      return new Promise((resolve) => {
        const typingDelay = options?.delay ?? 800;

        setIsTyping(true);
        setShowQuickReplies(false);

        setTimeout(() => {
          setIsTyping(false);

          const msg: SMSMessage = {
            id: generateId(),
            sender: 'system',
            type: options?.type ?? 'text',
            text,
            subText: options?.subText,
            choices: options?.choices,
            choiceKey: options?.choiceKey,
            inputType: options?.inputType,
            pathway: options?.pathway,
            pathways: options?.pathways,
            timestamp: formatTime(),
            isLastInGroup: true,
          };

          setMessages((prev) => {
            // KOR: 이전 시스템 메시지의 isLastInGroup 해제 / ENG: Unset previous system message's isLastInGroup
            const updated = prev.map((m) =>
              m.sender === 'system' && m.isLastInGroup ? { ...m, isLastInGroup: false } : m
            );
            return [...updated, msg];
          });

          // KOR: 빠른 답변 표시 / ENG: Show quick replies
          if (options?.choices && options.choices.length > 0) {
            setCurrentChoices(options.choices);
            setCurrentChoiceKey(options.choiceKey ?? null);
            setIsNumberStep(false);
            setTimeout(() => setShowQuickReplies(true), 200);
          } else if (options?.inputType === 'number') {
            setIsNumberStep(true);
            setCurrentChoices([]);
            setShowQuickReplies(false);
            setTimeout(() => inputRef.current?.focus(), 300);
          }

          resolve();
        }, typingDelay);
      });
    },
    []
  );

  /** KOR: 사용자 메시지 추가 / ENG: Add user message */
  const addUserMessage = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      const msg: SMSMessage = {
        id: generateId(),
        sender: 'user',
        type: 'text',
        text,
        deliveryStatus: 'sending',
        timestamp: formatTime(),
        isLastInGroup: true,
      };

      setMessages((prev) => {
        const updated = prev.map((m) =>
          m.sender === 'user' && m.isLastInGroup ? { ...m, isLastInGroup: false } : m
        );
        return [...updated, msg];
      });

      setShowQuickReplies(false);
      setIsNumberStep(false);

      // KOR: Delivery 상태 변경 (sent → delivered → read) / ENG: Update delivery status
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, deliveryStatus: 'sent' as DeliveryStatus } : m))
        );
      }, 300);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, deliveryStatus: 'delivered' as DeliveryStatus } : m))
        );
      }, 700);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, deliveryStatus: 'read' as DeliveryStatus } : m))
        );
        resolve();
      }, 1200);
    });
  }, []);

  // ============================================================
  // KOR: 대화 플로우 / ENG: Conversation flow
  // ============================================================

  /** KOR: 환영 메시지 시작 / ENG: Start welcome message */
  useEffect(() => {
    const startConversation = async () => {
      // KOR: 시간 구분선 / ENG: Time divider
      setMessages([
        {
          id: generateId(),
          sender: 'system',
          type: 'time-divider',
          text: '오늘',
          timestamp: formatTime(),
        },
      ]);

      await addSystemMessage('안녕하세요! 잡차자입니다 👋', { delay: 600 });
      await addSystemMessage(
        '한국 비자 진단을 도와드릴게요. 간단한 질문 6개면 됩니다!',
        { delay: 500, subText: "I'll help you with Korean visa diagnosis. Just 6 simple questions!" }
      );

      // KOR: 첫 번째 질문 출력 / ENG: Show first question
      const firstQ = questions[0];
      await addSystemMessage(firstQ.text, {
        delay: 600,
        subText: firstQ.subText,
        choices: firstQ.choices,
        choiceKey: firstQ.key,
        inputType: firstQ.inputType,
      });
      setCurrentStep(firstQ.step);
    };

    startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** KOR: 다음 질문으로 이동 / ENG: Move to next question */
  const askNextQuestion = useCallback(
    async (nextIndex: number) => {
      if (nextIndex >= questions.length) {
        // KOR: 모든 질문 완료 → 분석 단계 / ENG: All questions done → analyzing
        setCurrentStep('analyzing');
        await addSystemMessage('모든 정보를 받았습니다! 분석 중이에요...', {
          delay: 600,
          subText: 'Got all the info! Analyzing now...',
        });
        await addSystemMessage('15개 경로를 비교하고 있어요 📊', { delay: 1000 });

        // KOR: 결과 요약 메시지 / ENG: Result summary message
        const resultData = mockDiagnosisResult;
        const topPathways = resultData.pathways;

        await addSystemMessage(
          `분석 완료! ${resultData.meta.totalPathwaysEvaluated}개 경로 중 ${topPathways.length}개를 추천합니다 ✨`,
          {
            delay: 1500,
            subText: `Analysis complete! Found ${topPathways.length} recommendations from ${resultData.meta.totalPathwaysEvaluated} pathways`,
          }
        );

        // KOR: 각 경로를 MMS 카드로 전송 / ENG: Send each pathway as MMS card
        for (let i = 0; i < topPathways.length; i++) {
          await addSystemMessage(
            `${i === 0 ? '🏆 최적 추천' : `#${i + 1} 추천`}`,
            {
              delay: i === 0 ? 800 : 600,
              type: 'result-card',
              pathway: topPathways[i],
            }
          );
        }

        // KOR: 마무리 메시지 / ENG: Closing message
        await addSystemMessage(
          '궁금한 점이 있으면 언제든 물어보세요! 더 자세한 상담이 필요하면 전문가 연결도 가능해요 🙌',
          {
            delay: 600,
            subText: 'Feel free to ask anything! Expert consultation is also available.',
          }
        );

        setCurrentStep('result');
        return;
      }

      const q = questions[nextIndex];
      setQuestionIndex(nextIndex);
      setCurrentStep(q.step);

      await addSystemMessage(q.text, {
        delay: 700,
        subText: q.subText,
        choices: q.choices,
        choiceKey: q.key,
        inputType: q.inputType,
      });
    },
    [addSystemMessage]
  );

  /** KOR: 빠른 답변 선택 처리 / ENG: Handle quick reply selection */
  const handleQuickReply = useCallback(
    async (choice: QuickReplyChoice) => {
      // KOR: 사용자 입력 저장 / ENG: Save user input
      if (currentChoiceKey) {
        setInput((prev) => ({ ...prev, [currentChoiceKey]: choice.value }));
      }

      // KOR: 사용자 메시지 표시 / ENG: Show user message
      const displayText = choice.emoji
        ? `${choice.emoji} ${choice.label.replace(choice.emoji, '').trim()}`
        : choice.label;
      await addUserMessage(displayText);

      // KOR: 다음 질문 / ENG: Next question
      await askNextQuestion(questionIndex + 1);
    },
    [currentChoiceKey, questionIndex, addUserMessage, askNextQuestion]
  );

  /** KOR: 숫자 입력 제출 / ENG: Handle number input submit */
  const handleNumberSubmit = useCallback(async () => {
    const num = parseInt(numberInput, 10);
    if (isNaN(num) || num <= 0 || num > 120) return;

    setInput((prev) => ({ ...prev, age: num }));
    setNumberInput('');

    await addUserMessage(`${num}살`);
    await askNextQuestion(questionIndex + 1);
  }, [numberInput, questionIndex, addUserMessage, askNextQuestion]);

  /** KOR: 처음부터 다시 시작 / ENG: Restart from beginning */
  const handleRestart = useCallback(() => {
    setMessages([]);
    setCurrentStep('welcome');
    setQuestionIndex(0);
    setInput({
      nationality: '',
      age: 0,
      educationLevel: '',
      availableAnnualFund: 0,
      finalGoal: '',
      priorityPreference: '',
    });
    setIsTyping(false);
    setNumberInput('');
    setShowQuickReplies(false);
    setCurrentChoices([]);
    setCurrentChoiceKey(null);
    setIsNumberStep(false);
    idCounter = 0;

    // KOR: 재시작 대화 / ENG: Restart conversation
    setTimeout(async () => {
      setMessages([
        {
          id: generateId(),
          sender: 'system',
          type: 'time-divider',
          text: '오늘',
          timestamp: formatTime(),
        },
      ]);

      await addSystemMessage('다시 시작할게요! 🔄', { delay: 400 });
      await addSystemMessage(
        '한국 비자 진단을 도와드릴게요. 간단한 질문 6개면 됩니다!',
        { delay: 500, subText: "I'll help you with Korean visa diagnosis. Just 6 simple questions!" }
      );

      const firstQ = questions[0];
      await addSystemMessage(firstQ.text, {
        delay: 600,
        subText: firstQ.subText,
        choices: firstQ.choices,
        choiceKey: firstQ.key,
        inputType: firstQ.inputType,
      });
      setCurrentStep(firstQ.step);
    }, 100);
  }, [addSystemMessage]);

  // ============================================================
  // KOR: 렌더링 / ENG: Rendering
  // ============================================================

  // KOR: 진행률 계산 / ENG: Calculate progress
  const progressSteps: ConversationStep[] = ['nationality', 'age', 'education', 'fund', 'goal', 'priority'];
  const currentProgressIndex = progressSteps.indexOf(currentStep);
  const progressPercent =
    currentStep === 'result' || currentStep === 'analyzing'
      ? 100
      : currentProgressIndex >= 0
      ? Math.round((currentProgressIndex / progressSteps.length) * 100)
      : 0;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* ============================================================
          KOR: iOS 스타일 상단 네비게이션 바
          ENG: iOS-style top navigation bar
          ============================================================ */}
      <div className="shrink-0 bg-[#f6f6f6] border-b border-gray-200">
        {/* KOR: 상태바 (시계, 배터리 등 - 시뮬레이션) / ENG: Status bar simulation */}
        <div className="flex items-center justify-between px-5 pt-2 pb-1">
          <span className="text-xs font-semibold text-gray-800">
            {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-[3px] rounded-sm ${i <= 3 ? 'bg-gray-800' : 'bg-gray-300'}`}
                  style={{ height: `${8 + i * 2}px` }}
                />
              ))}
            </div>
            <span className="text-[10px] font-medium text-gray-800 ml-1">5G</span>
            <div className="ml-2 w-6 h-3 rounded-sm border border-gray-800 relative">
              <div className="absolute inset-0.5 bg-gray-800 rounded-[1px]" style={{ width: '70%' }} />
            </div>
          </div>
        </div>

        {/* KOR: 네비게이션 헤더 / ENG: Navigation header */}
        <div className="flex items-center justify-between px-3 py-2">
          <button className="flex items-center gap-0.5 text-blue-500">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-[15px]">Back</span>
          </button>

          <div className="flex flex-col items-center">
            {/* KOR: 아바타 / ENG: Avatar */}
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-0.5 shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[13px] font-semibold text-gray-900">잡차자 비자진단</span>
            <span className="text-[10px] text-gray-400">JobChaJa Visa Advisor</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-blue-500">
              <Video className="w-5 h-5" />
            </button>
            <button className="text-blue-500">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* KOR: 진행 프로그레스 바 / ENG: Progress bar */}
        <div className="px-4 pb-2">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[9px] text-gray-400">
              {currentStep === 'result'
                ? '진단 완료 / Diagnosis complete'
                : currentStep === 'analyzing'
                ? '분석 중... / Analyzing...'
                : `${currentProgressIndex + 1} / ${progressSteps.length} 질문`}
            </span>
            <span className="text-[9px] text-gray-400">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          KOR: 메시지 영역
          ENG: Message area
          ============================================================ */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-3 py-4 bg-white"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {messages.map((msg) => {
          // KOR: 시간 구분선 / ENG: Time divider
          if (msg.type === 'time-divider') {
            return (
              <div key={msg.id} className="flex items-center justify-center my-3">
                <span className="text-[11px] text-gray-400 font-medium bg-white px-3">
                  {msg.text}
                </span>
              </div>
            );
          }

          // KOR: 시스템 (수신) 메시지 / ENG: System (received) message
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="flex items-end gap-1.5 mb-1">
                {/* KOR: 아바타 (그룹의 마지막 메시지에만 표시) / ENG: Avatar (only on last message in group) */}
                {msg.isLastInGroup ? (
                  <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                ) : (
                  <div className="w-7 shrink-0" />
                )}

                <div className="max-w-[80%]">
                  {/* KOR: 결과 카드 메시지 / ENG: Result card message */}
                  {msg.type === 'result-card' && msg.pathway ? (
                    <div className="mb-1">
                      {msg.text && (
                        <div className="bg-[#e9e9eb] rounded-2xl rounded-bl-md px-3.5 py-2.5 mb-1.5 inline-block">
                          <p className="text-[15px] text-gray-900 leading-relaxed">{msg.text}</p>
                        </div>
                      )}
                      <ResultCard
                        pathway={msg.pathway}
                        rank={
                          mockDiagnosisResult.pathways.findIndex(
                            (p) => p.pathwayId === msg.pathway?.pathwayId
                          ) + 1
                        }
                      />
                    </div>
                  ) : (
                    /* KOR: 일반 텍스트 메시지 / ENG: Normal text message */
                    <div
                      className={`bg-[#e9e9eb] rounded-2xl px-3.5 py-2.5 inline-block ${
                        msg.isLastInGroup ? 'rounded-bl-md' : ''
                      }`}
                    >
                      <p className="text-[15px] text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                      {msg.subText && (
                        <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{msg.subText}</p>
                      )}
                    </div>
                  )}

                  {/* KOR: 타임스탬프 (마지막 메시지에만) / ENG: Timestamp (only on last) */}
                  {msg.isLastInGroup && msg.timestamp && (
                    <p className="text-[10px] text-gray-400 mt-0.5 ml-1">{msg.timestamp}</p>
                  )}
                </div>
              </div>
            );
          }

          // KOR: 사용자 (발신) 메시지 / ENG: User (sent) message
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex flex-col items-end mb-1">
                <div
                  className={`bg-[#007AFF] rounded-2xl px-3.5 py-2.5 max-w-[75%] inline-block ${
                    msg.isLastInGroup ? 'rounded-br-md' : ''
                  }`}
                >
                  <p className="text-[15px] text-white leading-relaxed">{msg.text}</p>
                </div>

                {/* KOR: 읽음 표시 + 타임스탬프 / ENG: Delivery status + timestamp */}
                {msg.isLastInGroup && (
                  <div className="flex items-center gap-1.5 mt-0.5 mr-1">
                    {msg.deliveryStatus && <DeliveryIndicator status={msg.deliveryStatus} />}
                    {msg.timestamp && (
                      <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                    )}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}

        {/* KOR: 타이핑 인디케이터 / ENG: Typing indicator */}
        {isTyping && <TypingIndicator />}

        {/* KOR: 스크롤 앵커 / ENG: Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ============================================================
          KOR: 빠른 답변 영역 (Quick Replies)
          ENG: Quick reply area
          ============================================================ */}
      {showQuickReplies && currentChoices.length > 0 && (
        <div className="shrink-0 bg-white border-t border-gray-100">
          <div className="px-3 py-2.5 overflow-x-auto">
            <div className="flex gap-2 flex-wrap max-h-[180px] overflow-y-auto">
              {currentChoices.map((choice, idx) => (
                <button
                  key={`${choice.value}-${idx}`}
                  onClick={() => handleQuickReply(choice)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-all duration-150 text-blue-600 shrink-0"
                >
                  {choice.emoji && <span className="text-sm">{choice.emoji}</span>}
                  <span className="text-[13px] font-medium whitespace-nowrap">{choice.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          KOR: 입력 영역 (iMessage 스타일)
          ENG: Input area (iMessage style)
          ============================================================ */}
      <div className="shrink-0 bg-[#f6f6f6] border-t border-gray-200 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {currentStep === 'result' ? (
          /* KOR: 결과 화면 — 다시하기 버튼 / ENG: Result screen — restart button */
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              다시 진단하기 / Restart
            </button>
          </div>
        ) : isNumberStep ? (
          /* KOR: 숫자 입력 모드 (나이) / ENG: Number input mode (age) */
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-white rounded-full border border-gray-300 px-4 py-2">
              <input
                ref={inputRef}
                type="number"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNumberSubmit();
                }}
                placeholder="나이 입력 (예: 24)"
                className="flex-1 text-[15px] text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                min={1}
                max={120}
              />
            </div>
            <button
              onClick={handleNumberSubmit}
              disabled={!numberInput || parseInt(numberInput, 10) <= 0}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                numberInput && parseInt(numberInput, 10) > 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* KOR: 기본 상태 — 입력 비활성 / ENG: Default — input disabled */
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-white rounded-full border border-gray-300 px-4 py-2.5">
              <span className="text-[15px] text-gray-400">
                {isTyping ? '잡차자가 입력 중...' : '위에서 답변을 선택해주세요'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <Send className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
