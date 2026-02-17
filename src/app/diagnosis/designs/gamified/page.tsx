"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Step backgrounds (bright, pastel colors)
// 단계별 배경색 (밝고 부드러운 파스텔)
const STEP_COLORS = [
  "bg-gradient-to-br from-blue-100 to-blue-200",
  "bg-gradient-to-br from-green-100 to-green-200",
  "bg-gradient-to-br from-yellow-100 to-yellow-200",
  "bg-gradient-to-br from-purple-100 to-purple-200",
  "bg-gradient-to-br from-pink-100 to-pink-200",
  "bg-gradient-to-br from-orange-100 to-orange-200",
];

// Step data / 단계 데이터
const STEPS = [
  {
    id: 1,
    emoji: "🌏",
    question: "어느 나라에서 오셨나요?",
    questionEn: "Which country are you from?",
    type: "country",
    options: [
      { value: "Vietnam", label: "베트남", emoji: "🇻🇳" },
      { value: "China", label: "중국", emoji: "🇨🇳" },
      { value: "Thailand", label: "태국", emoji: "🇹🇭" },
      { value: "Philippines", label: "필리핀", emoji: "🇵🇭" },
      { value: "Nepal", label: "네팔", emoji: "🇳🇵" },
      { value: "Uzbekistan", label: "우즈베키스탄", emoji: "🇺🇿" },
      { value: "Other", label: "기타", emoji: "🌍" },
    ],
  },
  {
    id: 2,
    emoji: "🎂",
    question: "몇 살이세요?",
    questionEn: "How old are you?",
    type: "age",
    options: [], // Age input
  },
  {
    id: 3,
    emoji: "🎓",
    question: "최종 학력은?",
    questionEn: "What is your highest education?",
    type: "education",
    options: [
      { value: "high_school", label: "고등학교 졸업", emoji: "🏫" },
      { value: "bachelor", label: "학사 (4년제 대학)", emoji: "🎓" },
      { value: "master", label: "석사", emoji: "📚" },
      { value: "phd", label: "박사", emoji: "👨‍🎓" },
    ],
  },
  {
    id: 4,
    emoji: "💰",
    question: "1년에 쓸 수 있는 금액은?",
    questionEn: "How much can you spend per year?",
    type: "funds",
    options: [
      { value: "under_5m", label: "500만원 이하", emoji: "💸", desc: "약 $4,000" },
      { value: "5m_10m", label: "500~1,000만원", emoji: "💵", desc: "약 $4,000~$8,000" },
      { value: "10m_20m", label: "1,000~2,000만원", emoji: "💴", desc: "약 $8,000~$15,000" },
      { value: "over_20m", label: "2,000만원 이상", emoji: "💎", desc: "약 $15,000+" },
    ],
  },
  {
    id: 5,
    emoji: "🎯",
    question: "한국에서 가장 하고 싶은 것은?",
    questionEn: "What do you most want to do in Korea?",
    type: "goal",
    options: [
      { value: "study", label: "공부하기", emoji: "📖", desc: "대학 진학, 한국어 학습" },
      { value: "work", label: "일하기", emoji: "💼", desc: "취업, 경력 쌓기" },
      { value: "startup", label: "사업하기", emoji: "🚀", desc: "창업, 비즈니스 시작" },
      { value: "settle", label: "정착하기", emoji: "🏡", desc: "영주권, 시민권 취득" },
    ],
  },
  {
    id: 6,
    emoji: "⭐",
    question: "가장 중요한 것은?",
    questionEn: "What matters most to you?",
    type: "priority",
    options: [
      { value: "speed", label: "빠른 시간", emoji: "⚡", desc: "최단 기간 내 목표 달성" },
      { value: "cost", label: "적은 비용", emoji: "💰", desc: "경제적 부담 최소화" },
      { value: "stability", label: "안정성", emoji: "🛡️", desc: "확실한 경로 선택" },
      { value: "flexibility", label: "유연성", emoji: "🔄", desc: "다양한 옵션 유지" },
    ],
  },
];

export default function GamifiedDiagnosisPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");
  const [loadingText, setLoadingText] = useState("당신의 한국 여정을 설계하고 있어요...");

  const currentStepData = STEPS.find((s) => s.id === currentStep);
  const progress = (currentStep / STEPS.length) * 100;

  // Handle answer selection / 답변 선택 처리
  const handleSelectAnswer = (stepType: string, value: string) => {
    setAnswers({ ...answers, [stepType]: value });

    // Auto-advance to next step / 자동으로 다음 단계로
    setTimeout(() => {
      if (currentStep < STEPS.length) {
        setSlideDirection("left");
        setCurrentStep(currentStep + 1);
      } else {
        // Start loading animation / 로딩 애니메이션 시작
        startLoadingSequence();
      }
    }, 300);
  };

  // Handle back button / 뒤로가기 버튼
  const handleBack = () => {
    if (currentStep > 1) {
      setSlideDirection("right");
      setCurrentStep(currentStep - 1);
    }
  };

  // Loading animation sequence / 로딩 애니메이션 시퀀스
  const startLoadingSequence = () => {
    setIsLoading(true);

    setTimeout(() => {
      setLoadingText("15개 경로를 분석하는 중...");
    }, 800);

    setTimeout(() => {
      setLoadingText("최적의 경로를 찾았어요!");
    }, 1600);

    setTimeout(() => {
      router.push("/diagnosis/designs/gamified/result");
    }, 2400);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-spin-slow">🌍</div>
          <p className="text-2xl font-bold text-white mb-2 animate-pulse">
            {loadingText}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${STEP_COLORS[currentStep - 1]}`}>
      {/* Header with back button and progress / 헤더: 뒤로가기 버튼 + 진행률 */}
      <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
        <div className="flex items-center gap-4 mb-6">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
              aria-label="이전 단계로"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <div className="flex-1">
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-700 mt-2 text-center font-medium">
              {currentStep} / {STEPS.length}
            </p>
          </div>
        </div>

        {/* Step content with slide animation / 단계 콘텐츠 (슬라이드 애니메이션) */}
        <div
          key={currentStep}
          className={`animate-slide-${slideDirection}`}
        >
          {/* Question emoji and text / 질문 이모지 + 텍스트 */}
          <div className="text-center mb-12">
            <div className="text-7xl mb-6">{currentStepData?.emoji}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentStepData?.question}
            </h1>
            <p className="text-gray-600">{currentStepData?.questionEn}</p>
          </div>

          {/* Options / 선택지 */}
          {currentStepData?.type === "age" ? (
            // Age input / 나이 입력
            <div className="flex flex-col items-center gap-6">
              <input
                type="number"
                placeholder="25"
                className="w-32 h-32 text-6xl text-center border-4 border-white rounded-3xl bg-white/80 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all"
                min="16"
                max="99"
                onChange={(e) => {
                  if (e.target.value && parseInt(e.target.value) >= 16) {
                    setAnswers({ ...answers, age: e.target.value });
                  }
                }}
              />
              {answers.age && (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl px-12 py-6 rounded-full hover:scale-105 transition-transform"
                  onClick={() => handleSelectAnswer("age", answers.age)}
                >
                  다음
                </Button>
              )}
            </div>
          ) : currentStepData?.type === "country" ? (
            // Country grid / 국가 그리드
            <div className="grid grid-cols-2 gap-4">
              {currentStepData.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelectAnswer(currentStepData.type, option.value)}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 hover:scale-105 hover:shadow-xl transition-all duration-200 hover:bg-white group"
                >
                  <div className="text-5xl mb-3">{option.emoji}</div>
                  <p className="font-bold text-gray-900 text-lg">{option.label}</p>
                </button>
              ))}
            </div>
          ) : (
            // Other options (vertical list) / 기타 선택지 (세로 목록)
            <div className="flex flex-col gap-4">
              {currentStepData?.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelectAnswer(currentStepData.type, option.value)}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 hover:scale-105 hover:shadow-xl transition-all duration-200 hover:bg-white group text-left flex items-center gap-4"
                >
                  <div className="text-5xl flex-shrink-0">{option.emoji}</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-xl mb-1">{option.label}</p>
                    {option.desc && (
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS animations / CSS 애니메이션 */}
      <style jsx>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-slide-left {
          animation: slide-in-left 0.4s ease-out;
        }

        .animate-slide-right {
          animation: slide-in-right 0.4s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
