'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Search } from 'lucide-react';
import {
  popularCountries,
  educationOptions,
  fundOptions,
  goalOptions,
  priorityOptions,
} from '../_mock/diagnosis-mock-data';

// Types / 타입 정의
type Answer = string | number | null;

interface ChatMessage {
  type: 'question' | 'answer';
  content: string | React.ReactNode;
  questionId?: number;
}

export default function ChatDiagnosisPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([null, null, null, null, null, null]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Questions / 질문 목록
  const questions = [
    '어느 나라에서 오셨나요?',
    '몇 살이세요?',
    '최종 학력은?',
    '1년에 쓸 수 있는 금액은?',
    '한국에서 가장 하고 싶은 것은?',
    '가장 중요한 것은?',
  ];

  // Auto-scroll to bottom / 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load from sessionStorage / 세션 스토리지에서 불러오기
  useEffect(() => {
    const saved = sessionStorage.getItem('diagnosis-answers');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed);
    }

    // Show first question / 첫 질문 표시
    if (messages.length === 0) {
      setMessages([{ type: 'question', content: questions[0], questionId: 0 }]);
    }
  }, []);

  // Save to sessionStorage / 세션 스토리지에 저장
  useEffect(() => {
    sessionStorage.setItem('diagnosis-answers', JSON.stringify(answers));
  }, [answers]);

  // Handle answer / 답변 처리
  const handleAnswer = (step: number, value: Answer, displayText: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = value;
    setAnswers(newAnswers);

    // Add answer message / 답변 메시지 추가
    setMessages((prev) => [
      ...prev.slice(0, prev.findIndex((m) => m.questionId === step) + 1),
      { type: 'answer', content: displayText },
    ]);

    // Move to next question or finish / 다음 질문으로 이동 또는 완료
    setTimeout(() => {
      if (step < questions.length - 1) {
        setCurrentStep(step + 1);
        setMessages((prev) => [
          ...prev,
          { type: 'question', content: questions[step + 1], questionId: step + 1 },
        ]);
      } else {
        // All answers complete / 모든 답변 완료
        setIsAnalyzing(true);
        setTimeout(() => {
          router.push('/diagnosis/designs/chat/result');
        }, 2000);
      }
    }, 300);
  };

  // Render question UI / 질문 UI 렌더링
  const renderQuestionInput = (step: number) => {
    if (step !== currentStep || isAnalyzing) return null;

    switch (step) {
      case 0: // Country / 국가
        return (
          <div className="space-y-3 animate-fadeIn">
            <div className="grid grid-cols-2 gap-2">
              {popularCountries.slice(0, 6).map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleAnswer(0, country.code, `${country.flag} ${country.nameKo}`)}
                  className="flex items-center gap-2 p-3 rounded-xl border-2 border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition-all"
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-sm font-medium">{country.nameKo}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => handleAnswer(0, 'OTHER', '다른 국가')}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-300 hover:border-sky-500 hover:bg-sky-50 transition-all"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">다른 국가</span>
            </button>
          </div>
        );

      case 1: // Age / 나이
        return (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
              <input
                type="number"
                placeholder="나이를 입력하세요"
                className="w-full text-lg text-center outline-none"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = parseInt((e.target as HTMLInputElement).value);
                    if (value > 0 && value < 120) {
                      handleAnswer(1, value, `${value}세`);
                    }
                  }
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value);
                  if (value > 0 && value < 120) {
                    handleAnswer(1, value, `${value}세`);
                  }
                }}
              />
            </div>
          </div>
        );

      case 2: // Education / 학력
        return (
          <div className="space-y-2 animate-fadeIn">
            {educationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(2, option.value, option.label)}
                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition-all text-left"
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        );

      case 3: // Fund / 자금
        return (
          <div className="space-y-2 animate-fadeIn">
            {fundOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(3, option.value, option.label)}
                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition-all text-left"
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        );

      case 4: // Goal / 목표
        return (
          <div className="grid grid-cols-2 gap-3 animate-fadeIn">
            {goalOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(4, option.value, option.label)}
                className="p-4 rounded-xl border-2 border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition-all"
              >
                <div className="text-3xl mb-2">{option.emoji}</div>
                <div className="text-sm font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        );

      case 5: // Priority / 우선순위
        return (
          <div className="grid grid-cols-2 gap-3 animate-fadeIn">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(5, option.value, option.label)}
                className="p-4 rounded-xl border-2 border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition-all"
              >
                <div className="text-3xl mb-2">{option.emoji}</div>
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-50 to-white">
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Header / 헤더 */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-gray-900">비자 진단</h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentStep + 1} / {questions.length}
          </p>
        </div>

        {/* Messages / 메시지 목록 */}
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'answer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl ${
                  message.type === 'question'
                    ? 'bg-sky-100 text-gray-900 rounded-tl-none'
                    : 'bg-sky-500 text-white rounded-tr-none'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Current question input / 현재 질문 입력 */}
          {!isAnalyzing && currentStep < questions.length && (
            <div className="mt-6">{renderQuestionInput(currentStep)}</div>
          )}

          {/* Analyzing indicator / 분석 중 표시 */}
          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="bg-sky-100 p-4 rounded-2xl rounded-tl-none">
                <div className="flex items-center gap-2">
                  <span>분석 중</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
