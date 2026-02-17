'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { popularCountries } from '../_mock/diagnosis-mock-data';

// 질문 타입 정의 / Question type definitions
type Question = {
  id: string;
  title: string;
  subtitle?: string;
  type: 'country' | 'age' | 'education' | 'fund' | 'goal' | 'priority';
};

const questions: Question[] = [
  { id: 'country', title: '국적을 선택하세요', subtitle: 'Select your nationality', type: 'country' },
  { id: 'age', title: '나이를 입력하세요', subtitle: 'Enter your age', type: 'age' },
  { id: 'education', title: '최종 학력을 선택하세요', subtitle: 'Select your education level', type: 'education' },
  { id: 'fund', title: '준비 가능한 자금은?', subtitle: 'Available funds', type: 'fund' },
  { id: 'goal', title: '한국 체류 목적은?', subtitle: 'Purpose of stay in Korea', type: 'goal' },
  { id: 'priority', title: '가장 중요한 것은?', subtitle: 'What matters most', type: 'priority' },
];

const educationOptions = [
  { value: 'HIGH_SCHOOL', label: '고등학교 졸업', labelEn: 'High School' },
  { value: 'ASSOCIATE', label: '전문학사 (2-3년제)', labelEn: 'Associate Degree' },
  { value: 'BACHELOR', label: '학사 (4년제)', labelEn: "Bachelor's Degree" },
  { value: 'MASTER', label: '석사', labelEn: "Master's Degree" },
  { value: 'DOCTORATE', label: '박사', labelEn: 'Doctorate' },
];

const fundOptions = [
  { value: 'UNDER_10M', label: '1천만원 미만', labelEn: 'Under ₩10M' },
  { value: 'BETWEEN_10M_30M', label: '1천만원 ~ 3천만원', labelEn: '₩10M - ₩30M' },
  { value: 'BETWEEN_30M_50M', label: '3천만원 ~ 5천만원', labelEn: '₩30M - ₩50M' },
  { value: 'OVER_50M', label: '5천만원 이상', labelEn: 'Over ₩50M' },
];

const goalOptions = [
  { value: 'STUDY', emoji: '📚', label: '유학', labelEn: 'Study' },
  { value: 'WORK', emoji: '💼', label: '취업', labelEn: 'Work' },
  { value: 'BUSINESS', emoji: '🏢', label: '사업', labelEn: 'Business' },
  { value: 'SETTLE', emoji: '🏡', label: '정착', labelEn: 'Settlement' },
];

const priorityOptions = [
  { value: 'FAST', emoji: '⚡', label: '빠른 시간', labelEn: 'Speed' },
  { value: 'LOW_COST', emoji: '💰', label: '낮은 비용', labelEn: 'Low Cost' },
  { value: 'STABILITY', emoji: '🛡️', label: '안정성', labelEn: 'Stability' },
  { value: 'FLEXIBILITY', emoji: '🔄', label: '유연성', labelEn: 'Flexibility' },
];

export default function SwipeDiagnosisPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 답변 저장 / Store answers
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentIndex];

  // 답변 선택 및 다음 카드로 이동 / Select answer and move to next card
  const handleSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));

    if (currentIndex < questions.length - 1) {
      // 다음 질문으로 / Move to next question
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // 마지막 질문 완료 - 분석 화면 표시 / Last question - show analyzing
      setIsAnalyzing(true);
      setTimeout(() => {
        router.push('/diagnosis/designs/swipe/result');
      }, 2000);
    }
  };

  // 뒤로 가기 / Go back
  const handleBack = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      router.back();
    }
  };

  // 분석 중 화면 / Analyzing screen
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6 px-6">
          <div className="relative w-32 h-32 mx-auto">
            {/* 카드 셔플 애니메이션 / Card shuffle animation */}
            <div className="absolute inset-0 animate-shuffle-1 bg-blue-100 rounded-2xl shadow-lg"></div>
            <div className="absolute inset-0 animate-shuffle-2 bg-blue-200 rounded-2xl shadow-lg"></div>
            <div className="absolute inset-0 animate-shuffle-3 bg-blue-300 rounded-2xl shadow-lg"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">최적 경로 탐색 중</h2>
            <p className="text-gray-500">Finding your best visa pathway</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* 모바일 프레임 컨테이너 / Mobile frame container */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ height: '844px' }}>
        {/* 헤더 / Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>

          {/* 진행 표시 점 / Progress dots */}
          <div className="flex gap-2 justify-center">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-8 bg-blue-500'
                    : idx < currentIndex
                    ? 'w-1.5 bg-blue-300'
                    : 'w-1.5 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 카드 컨테이너 / Card container */}
        <div className="relative h-full overflow-hidden px-6 pt-8 pb-24">
          <div
            className={`transition-all duration-300 ${
              isTransitioning ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'
            }`}
          >
            {/* 질문 제목 / Question title */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {currentQuestion.title}
              </h1>
              <p className="text-sm text-gray-500">{currentQuestion.subtitle}</p>
            </div>

            {/* 질문별 입력 UI / Question-specific input UI */}
            <div className="space-y-3">
              {currentQuestion.type === 'country' && (
                <div className="grid grid-cols-3 gap-3">
                  {popularCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleSelect(country.code)}
                      className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                        answers.country === country.code
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      <span className="text-4xl">{country.flag}</span>
                      <span className="text-xs font-medium text-gray-700">
                        {country.nameKo}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'age' && (
                <div className="flex flex-col items-center gap-8 py-8">
                  <div className="text-7xl font-bold text-gray-900">
                    {answers.age || '25'}
                  </div>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => {
                        const current = parseInt(answers.age || '25');
                        if (current > 18) {
                          setAnswers(prev => ({ ...prev, age: String(current - 1) }));
                        }
                      }}
                      className="w-16 h-16 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center text-3xl font-bold transition-colors"
                    >
                      −
                    </button>
                    <button
                      onClick={() => {
                        const current = parseInt(answers.age || '25');
                        if (current < 99) {
                          setAnswers(prev => ({ ...prev, age: String(current + 1) }));
                        }
                      }}
                      className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 flex items-center justify-center text-3xl font-bold text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleSelect(answers.age || '25')}
                    className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-semibold transition-colors"
                  >
                    다음
                  </button>
                </div>
              )}

              {currentQuestion.type === 'education' && (
                <div className="space-y-3">
                  {educationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] active:scale-95 ${
                        answers.education === option.value
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-1">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-500">{option.labelEn}</div>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'fund' && (
                <div className="space-y-3">
                  {fundOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] active:scale-95 ${
                        answers.fund === option.value
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-1">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-500">{option.labelEn}</div>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'goal' && (
                <div className="grid grid-cols-2 gap-4">
                  {goalOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 ${
                        answers.goal === option.value
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      <span className="text-5xl">{option.emoji}</span>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.labelEn}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'priority' && (
                <div className="grid grid-cols-2 gap-4">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 ${
                        answers.priority === option.value
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      <span className="text-5xl">{option.emoji}</span>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.labelEn}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shuffle-1 {
          0%, 100% { transform: rotate(-5deg) translateX(-10px); }
          50% { transform: rotate(5deg) translateX(10px); }
        }
        @keyframes shuffle-2 {
          0%, 100% { transform: rotate(5deg) translateX(10px); }
          50% { transform: rotate(-5deg) translateX(-10px); }
        }
        @keyframes shuffle-3 {
          0%, 100% { transform: rotate(0deg) translateY(-5px); }
          50% { transform: rotate(0deg) translateY(5px); }
        }
        .animate-shuffle-1 {
          animation: shuffle-1 1s ease-in-out infinite;
        }
        .animate-shuffle-2 {
          animation: shuffle-2 1s ease-in-out infinite 0.2s;
        }
        .animate-shuffle-3 {
          animation: shuffle-3 1s ease-in-out infinite 0.4s;
        }
      `}</style>
    </div>
  );
}
