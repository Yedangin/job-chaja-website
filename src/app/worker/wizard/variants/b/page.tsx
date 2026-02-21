'use client';

/**
 * 채팅형 위저드 메인 페이지 / Chat-style wizard main page
 * 시안 B: 대화형 UI로 SEEKER 프로필을 만드는 위저드
 * Variant B: Chat-style UI wizard for creating SEEKER profile
 *
 * 구조:
 * - 스크롤 컨테이너에 채팅 메시지를 누적
 * - 봇 질문 → 사용자 답변 → 봇 응답(확인) → 다음 질문 반복
 * - 우측 도트 네비게이션으로 진행 상태 확인
 * - 모바일에서는 상단 진행률 바 표시
 *
 * Structure:
 * - Accumulate chat messages in scroll container
 * - Bot question → User answer → Bot confirm → Next question repeat
 * - Right dot nav for progress, mobile shows top progress bar
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// 컴포넌트 / Components
import ChatBubble, { TypingIndicator } from './components/chat-bubble';
import ChatInput from './components/chat-input';
import DotNavigation, { MobileProgressBar } from './components/dot-navigation';
import CompletionCelebration from './components/completion-celebration';

// 스텝별 질문 데이터 / Step question data
import { step0Questions, getStep0AnswerDisplay } from './components/step-0-chat';
import { step1Questions, getStep1AnswerDisplay } from './components/step-1-chat';
import { step2Questions, getStep2AnswerDisplay } from './components/step-2-chat';
import { step3Questions, getStep3AnswerDisplay } from './components/step-3-chat';
import { step4Questions, getStep4AnswerDisplay } from './components/step-4-chat';
import { generateDeltaQuestions, getStep5AnswerDisplay } from './components/step-5-chat';
import { step6Questions, getStep6AnswerDisplay } from './components/step-6-chat';
import { step7Questions, getStep7AnswerDisplay } from './components/step-7-chat';

// 타입 / Types
import type {
  ChatMessage,
  ChatQuestion,
  WizardFormData,
  WizardStep,
  EducationEntry,
} from './types';
import { INITIAL_FORM_DATA } from './types';

// Mock API
import { saveWizardStep } from './mock-api';

/**
 * 모든 스텝의 질문을 가져오는 함수
 * Get all questions for a given step
 */
function getQuestionsForStep(
  step: WizardStep,
  formData: WizardFormData
): ChatQuestion[] {
  switch (step) {
    case 0: return step0Questions;
    case 1: return step1Questions;
    case 2: return step2Questions;
    case 3: return step3Questions;
    case 4: return step4Questions;
    case 5: return generateDeltaQuestions(formData.visaType || 'OTHER');
    case 6: return step6Questions;
    case 7: return step7Questions;
    default: return [];
  }
}

/**
 * 스텝에 맞는 답변 표시 텍스트 생성
 * Generate display text for answer by step
 */
function getAnswerDisplay(
  step: WizardStep,
  fieldKey: string,
  value: string | string[]
): string {
  const strValue = Array.isArray(value) ? value.join(', ') : value;
  switch (step) {
    case 0: return getStep0AnswerDisplay(fieldKey, strValue);
    case 1: return getStep1AnswerDisplay(fieldKey, strValue);
    case 2: return getStep2AnswerDisplay(fieldKey, strValue);
    case 3: return getStep3AnswerDisplay(fieldKey, strValue);
    case 4: return getStep4AnswerDisplay(fieldKey, strValue);
    case 5: return getStep5AnswerDisplay(fieldKey, strValue);
    case 6: return getStep6AnswerDisplay(fieldKey, strValue);
    case 7: return getStep7AnswerDisplay(fieldKey, value);
    default: return strValue;
  }
}

/**
 * 고유 ID 생성 헬퍼 / Unique ID generator helper
 */
let messageIdCounter = 0;
function generateMessageId(): string {
  messageIdCounter += 1;
  return `msg-${Date.now()}-${messageIdCounter}`;
}

export default function ChatWizardPage() {
  const router = useRouter();

  // === 상태 관리 / State management ===
  const [currentStep, setCurrentStep] = useState<WizardStep>(0);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_FORM_DATA);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);

  // 학력 임시 저장 / Temp education storage
  const [tempEducation, setTempEducation] = useState<Partial<EducationEntry>>({});
  // 경력 임시 저장 / Temp career storage
  const [tempCareer, setTempCareer] = useState<{
    company: string;
    position: string;
    duration: string;
  }>({ company: '', position: '', duration: '' });

  // 스크롤 컨테이너 참조 / Scroll container ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 현재 스텝의 질문 목록 / Current step questions
  const currentQuestions = getQuestionsForStep(currentStep, formData);

  /**
   * 맨 아래로 스크롤 / Scroll to bottom
   */
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  /**
   * 봇 질문 메시지 추가 / Add bot question message
   */
  const addBotQuestion = useCallback(
    (question: ChatQuestion) => {
      setIsTyping(true);

      // 타이핑 인디케이터 표시 후 메시지 추가 / Show typing indicator then add message
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: generateMessageId(),
          role: 'bot',
          text: question.message,
          subText: question.subMessage,
          timestamp: new Date(),
          inputType: question.inputType,
          options: question.options,
          placeholder: question.placeholder,
          required: question.required,
          skippable: question.skippable,
          skipLabel: question.skipLabel,
          validationPattern: question.validationPattern,
          validationMessage: question.validationMessage,
          fieldKey: question.fieldKey,
          answered: false,
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        scrollToBottom();
      }, 600 + Math.random() * 400);
    },
    [scrollToBottom]
  );

  /**
   * 초기 질문 로드 / Load initial question
   */
  useEffect(() => {
    if (messages.length === 0 && currentQuestions.length > 0) {
      addBotQuestion(currentQuestions[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 폼 데이터 업데이트 / Update form data
   */
  const updateFormData = useCallback(
    (fieldKey: string, value: string | string[]) => {
      setFormData((prev) => {
        const newData = { ...prev };

        // 배열 필드 처리 / Handle array fields
        if (
          fieldKey === 'desiredJobTypes' ||
          fieldKey === 'desiredLocations'
        ) {
          (newData as Record<string, unknown>)[fieldKey] = Array.isArray(value)
            ? value
            : [value];
          return newData;
        }

        // 급여 범위 처리 / Handle salary range
        if (fieldKey === '_salary_range' && typeof value === 'string') {
          const parts = value.split('~');
          newData.desiredSalaryMin = parseInt(parts[0]?.replace(/\D/g, '') || '0', 10);
          newData.desiredSalaryMax = parseInt(parts[1]?.replace(/\D/g, '') || '0', 10);
          return newData;
        }

        // 일반 필드 / Regular fields
        if (!fieldKey.startsWith('_')) {
          (newData as Record<string, unknown>)[fieldKey] = typeof value === 'string' ? value : value;
        }

        return newData;
      });
    },
    []
  );

  /**
   * 다음 질문으로 이동 / Move to next question
   */
  const moveToNextQuestion = useCallback(
    (stepQuestions: ChatQuestion[], qIndex: number, data: WizardFormData) => {
      let nextIndex = qIndex + 1;

      // 조건부 질문 스킵 / Skip conditional questions
      while (nextIndex < stepQuestions.length) {
        const nextQ = stepQuestions[nextIndex];
        if (nextQ.showIf && !nextQ.showIf(data)) {
          nextIndex++;
          continue;
        }
        break;
      }

      if (nextIndex < stepQuestions.length) {
        // 같은 스텝 내 다음 질문 / Next question within same step
        setCurrentQuestionIndex(nextIndex);
        addBotQuestion(stepQuestions[nextIndex]);
      } else {
        // 스텝 완료 → 다음 스텝 / Step complete → next step
        const completedStep = stepQuestions[0]?.step ?? currentStep;

        // Mock API 호출 / Mock API call
        saveWizardStep(completedStep, data);

        setCompletedSteps((prev) => {
          if (!prev.includes(completedStep)) {
            return [...prev, completedStep];
          }
          return prev;
        });

        if (completedStep < 7) {
          const nextStep = (completedStep + 1) as WizardStep;
          setCurrentStep(nextStep);
          setCurrentQuestionIndex(0);

          // 스텝 전환 메시지 / Step transition message
          const nextStepQuestions = getQuestionsForStep(nextStep, data);
          if (nextStepQuestions.length > 0) {
            setTimeout(() => {
              addBotQuestion(nextStepQuestions[0]);
            }, 500);
          }
        } else {
          // 모든 스텝 완료 / All steps complete
          setCompletedSteps((prev) => [...prev, 7 as WizardStep]);
          setIsCompleted(true);
        }
      }
    },
    [addBotQuestion, currentStep]
  );

  /**
   * 사용자 답변 처리 / Handle user answer
   */
  const handleAnswer = useCallback(
    (value: string | string[]) => {
      const currentQuestion = currentQuestions[currentQuestionIndex];
      if (!currentQuestion) return;

      const displayText = getAnswerDisplay(
        currentStep,
        currentQuestion.fieldKey,
        value
      );

      // 사용자 답변 메시지 추가 / Add user answer message
      const userMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'user',
        text: displayText,
        timestamp: new Date(),
        fieldKey: currentQuestion.fieldKey,
        answerValue: value,
        answerDisplay: displayText,
      };
      setMessages((prev) => {
        // 마지막 봇 메시지 answered 플래그 업데이트 / Update last bot message answered flag
        const updated = prev.map((msg) =>
          msg.id === prev[prev.length - 1]?.id && msg.role === 'bot'
            ? { ...msg, answered: true }
            : msg
        );
        return [...updated, userMessage];
      });

      // 폼 데이터 업데이트 / Update form data
      updateFormData(currentQuestion.fieldKey, value);

      // === 특수 분기 처리 / Special branching logic ===

      // Step 0 환영: 바로 다음 / Step 0 welcome: move immediately
      if (currentQuestion.fieldKey === '_welcome') {
        scrollToBottom();
        moveToNextQuestion(currentQuestions, currentQuestionIndex, formData);
        return;
      }

      // Step 0 확인: 바로 다음 / Step 0 confirm: move immediately
      if (currentQuestion.fieldKey === '_confirm') {
        scrollToBottom();
        moveToNextQuestion(currentQuestions, currentQuestionIndex, formData);
        return;
      }

      // Step 2 비자 방법: OCR 선택 시 formData 업데이트
      if (currentQuestion.fieldKey === '_visaMethod') {
        const updatedData = { ...formData, _visaMethod: value } as WizardFormData & { _visaMethod: string };
        scrollToBottom();
        moveToNextQuestion(currentQuestions, currentQuestionIndex, updatedData);
        return;
      }

      // Step 4 학력 추가: 임시 저장 처리
      if (currentQuestion.fieldKey === '_edu_degree') {
        setTempEducation((prev) => ({
          ...prev,
          degree: typeof value === 'string' ? value : value[0],
        }));
        scrollToBottom();
        moveToNextQuestion(currentQuestions, currentQuestionIndex, formData);
        return;
      }
      if (currentQuestion.fieldKey === '_edu_major') {
        setTempEducation((prev) => ({
          ...prev,
          major: typeof value === 'string' ? value : value[0],
        }));
        scrollToBottom();
        moveToNextQuestion(currentQuestions, currentQuestionIndex, formData);
        return;
      }
      if (currentQuestion.fieldKey === '_edu_school') {
        setTempEducation((prev) => ({
          ...prev,
          schoolName: typeof value === 'string' ? value : value[0],
        }));
        scrollToBottom();
        moveToNextQuestion(currentQuestions, currentQuestionIndex, formData);
        return;
      }
      if (currentQuestion.fieldKey === '_edu_country') {
        setTempEducation((prev) => ({
          ...prev,
          country: typeof value === 'string' ? value : value[0],
        }));
        scrollToBottom();
        moveToNextQuestion(currentQuestions, currentQuestionIndex, formData);
        return;
      }
      if (currentQuestion.fieldKey === '_edu_more') {
        // 학력 항목 저장 / Save education entry
        const newEdu: EducationEntry = {
          schoolName: tempEducation.schoolName ?? '',
          major: tempEducation.major ?? '',
          degree: tempEducation.degree ?? '',
          graduationYear: '',
          country: tempEducation.country ?? '',
        };
        const updatedData = {
          ...formData,
          educations: [...formData.educations, newEdu],
        };
        setFormData(updatedData);
        setTempEducation({});

        if (value === 'yes') {
          // 학력 추가 반복 / Repeat education entry
          setCurrentQuestionIndex(0);
          setTimeout(() => {
            addBotQuestion(currentQuestions[0]);
          }, 500);
        } else {
          // 다음 스텝으로 / Move to next step
          scrollToBottom();
          moveToNextQuestion(currentQuestions, currentQuestionIndex, updatedData);
        }
        return;
      }

      // Step 6 경력 분기 / Step 6 career branching
      if (currentQuestion.fieldKey === '_has_career') {
        const hasCareer = value === 'yes';
        const updatedData = { ...formData, hasCareer };
        setFormData(updatedData);
        scrollToBottom();

        if (!hasCareer) {
          // 경력 없음 → 다음 스텝 / No career → next step
          moveToNextQuestion(currentQuestions, currentQuestions.length - 1, updatedData);
        } else {
          moveToNextQuestion(currentQuestions, currentQuestionIndex, updatedData);
        }
        return;
      }
      if (currentQuestion.fieldKey === '_career_company') {
        setTempCareer((prev) => ({
          ...prev,
          company: typeof value === 'string' ? value : value[0],
        }));
        scrollToBottom();
        moveToNextQuestion(currentQuestions, currentQuestionIndex, formData);
        return;
      }
      if (currentQuestion.fieldKey === '_career_position') {
        setTempCareer((prev) => ({
          ...prev,
          position: typeof value === 'string' ? value : value[0],
        }));
        scrollToBottom();
        moveToNextQuestion(currentQuestions, currentQuestionIndex, formData);
        return;
      }
      if (currentQuestion.fieldKey === '_career_duration') {
        setTempCareer((prev) => ({
          ...prev,
          duration: typeof value === 'string' ? value : value[0],
        }));
        scrollToBottom();
        moveToNextQuestion(currentQuestions, currentQuestionIndex, formData);
        return;
      }
      if (currentQuestion.fieldKey === '_career_more') {
        // 경력 항목 저장 / Save career entry
        const updatedData = {
          ...formData,
          careers: [
            ...formData.careers,
            {
              companyName: tempCareer.company,
              position: tempCareer.position,
              startDate: '',
              endDate: '',
              isCurrent: tempCareer.duration === 'current',
              description: `${tempCareer.duration}`,
            },
          ],
        };
        setFormData(updatedData);
        setTempCareer({ company: '', position: '', duration: '' });

        if (value === 'yes') {
          // 경력 추가 반복 / Repeat career entry
          // 두 번째 질문(회사명)부터 시작 / Start from second question (company)
          setCurrentQuestionIndex(1);
          setTimeout(() => {
            addBotQuestion(currentQuestions[1]);
          }, 500);
        } else {
          scrollToBottom();
          moveToNextQuestion(currentQuestions, currentQuestionIndex, updatedData);
        }
        return;
      }

      // DELTA 스킵/인트로 처리 / DELTA skip/intro handling
      if (
        currentQuestion.fieldKey === '_delta_intro' ||
        currentQuestion.fieldKey === '_delta_skip'
      ) {
        scrollToBottom();
        if (currentQuestion.fieldKey === '_delta_skip') {
          // 추가 질문 없음 → 다음 스텝 / No additional questions → next step
          moveToNextQuestion(currentQuestions, currentQuestions.length - 1, formData);
        } else {
          moveToNextQuestion(currentQuestions, currentQuestionIndex, formData);
        }
        return;
      }

      // 일반 흐름: 다음 질문 / Normal flow: next question
      scrollToBottom();
      moveToNextQuestion(currentQuestions, currentQuestionIndex, formData);
    },
    [
      currentStep,
      currentQuestions,
      currentQuestionIndex,
      formData,
      updateFormData,
      moveToNextQuestion,
      addBotQuestion,
      scrollToBottom,
      tempEducation,
      tempCareer,
    ]
  );

  /**
   * 스킵 처리 / Handle skip
   */
  const handleSkip = useCallback(() => {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    if (!currentQuestion) return;

    // 스킵 메시지 추가 / Add skip message
    const skipMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      text: currentQuestion.skipLabel ?? '건너뛰기 (Skipped)',
      timestamp: new Date(),
      fieldKey: currentQuestion.fieldKey,
      answerValue: '',
      answerDisplay: '건너뛰기',
    };
    setMessages((prev) => {
      const updated = prev.map((msg) =>
        msg.id === prev[prev.length - 1]?.id && msg.role === 'bot'
          ? { ...msg, answered: true }
          : msg
      );
      return [...updated, skipMessage];
    });

    scrollToBottom();
    moveToNextQuestion(currentQuestions, currentQuestionIndex, formData);
  }, [
    currentQuestions,
    currentQuestionIndex,
    formData,
    moveToNextQuestion,
    scrollToBottom,
  ]);

  /**
   * 도트 네비게이션 클릭 / Dot navigation click
   * 완료된 스텝만 이동 가능
   * Only navigable to completed steps
   */
  const handleStepClick = useCallback(
    (step: WizardStep) => {
      if (completedSteps.includes(step) || step <= currentStep) {
        // 스텝으로 이동 시에는 새 대화 흐름 시작
        // When navigating to step, start new conversation flow
        setCurrentStep(step);
        setCurrentQuestionIndex(0);
        const stepQuestions = getQuestionsForStep(step, formData);
        if (stepQuestions.length > 0) {
          // 구분선 메시지 추가 / Add divider message
          const dividerMsg: ChatMessage = {
            id: generateMessageId(),
            role: 'bot',
            text: `--- ${step}단계로 돌아갑니다 (Going back to Step ${step}) ---`,
            timestamp: new Date(),
            answered: true,
          };
          setMessages((prev) => [...prev, dividerMsg]);
          setTimeout(() => addBotQuestion(stepQuestions[0]), 300);
        }
      }
    },
    [completedSteps, currentStep, formData, addBotQuestion]
  );

  // === 완료 화면 / Completion screen ===
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <CompletionCelebration
          formData={formData}
          onGoToDashboard={() => router.push('/worker/dashboard')}
          onViewProfile={() => router.push('/worker/mypage')}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 모바일 진행률 바 / Mobile progress bar */}
      <MobileProgressBar
        currentStep={currentStep}
        className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100"
      />

      {/* 데스크톱 도트 네비게이션 / Desktop dot navigation */}
      <DotNavigation
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* 채팅 컨테이너 / Chat container */}
      <div
        ref={scrollContainerRef}
        className={cn(
          'max-w-2xl mx-auto px-4 pb-8 pt-4 md:pt-8',
          'md:pr-20' // 도트 네비 여백 / Dot nav margin
        )}
      >
        {/* 헤더 / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-3">
            <span>🤖</span>
            <span>잡차자 프로필 위저드 (JobChaJa Profile Wizard)</span>
          </div>
        </div>

        {/* 메시지 목록 / Messages list */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              role={msg.role}
              text={msg.text}
              subText={msg.subText}
              animate={false}
            >
              {/* 봇 메시지에 입력 UI 표시 (미답변인 경우만) / Show input UI on bot messages (unanswered only) */}
              {msg.role === 'bot' && !msg.answered && msg.inputType && (
                <ChatInput
                  inputType={msg.inputType}
                  options={msg.options}
                  placeholder={msg.placeholder}
                  required={msg.required}
                  skippable={msg.skippable}
                  skipLabel={msg.skipLabel}
                  validationPattern={msg.validationPattern}
                  validationMessage={msg.validationMessage}
                  onSubmit={handleAnswer}
                  onSkip={handleSkip}
                  disabled={isTyping}
                />
              )}
            </ChatBubble>
          ))}

          {/* 타이핑 인디케이터 / Typing indicator */}
          {isTyping && <TypingIndicator />}

          {/* 스크롤 앵커 / Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 하단 안전 영역 / Bottom safe area */}
      <div className="h-20" />
    </div>
  );
}
