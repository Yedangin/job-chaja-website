'use client';

// =============================================================================
// diagnosis4 — 스토리 대화 (Story Dialogue)
// 인스타그램 스토리처럼 탭하며 진행하는 대화형 비자 진단 UI
// Instagram Stories-like tap-through conversational visa diagnosis UI
// =============================================================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Star,
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

// =============================================================================
// 질문 단계 인터페이스 / Question step interface
// =============================================================================
interface QuestionStep {
  key: keyof DiagnosisInput;
  titleKo: string;
  titleEn: string;
  type: 'country-grid' | 'number-input' | 'option-list';
}

// =============================================================================
// 메인 컴포넌트 / Main component
// =============================================================================
export default function Diagnosis4Page() {
  // 현재 입력 단계 / Current input step
  const [currentStep, setCurrentStep] = useState(0);

  // 사용자 입력 데이터 / User input data
  const [inputs, setInputs] = useState<Partial<DiagnosisInput>>({});

  // 결과 표시 여부 / Whether to show results
  const [showResults, setShowResults] = useState(false);

  // 결과 화면에서 보고 있는 경로 인덱스 / Active result pathway index
  const [activeResultIndex, setActiveResultIndex] = useState(0);

  // 나이 임시 입력값 / Temporary age input value
  const [ageInput, setAgeInput] = useState('');

  // 전환 애니메이션 방향 / Transition animation direction
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  // 질문 목록 / Question list
  const questions: QuestionStep[] = useMemo(
    () => [
      {
        key: 'nationality' as keyof DiagnosisInput,
        titleKo: '어느 나라에서 왔나요?',
        titleEn: 'Where are you from?',
        type: 'country-grid' as const,
      },
      {
        key: 'age' as keyof DiagnosisInput,
        titleKo: '나이가 어떻게 되세요?',
        titleEn: 'How old are you?',
        type: 'number-input' as const,
      },
      {
        key: 'educationLevel' as keyof DiagnosisInput,
        titleKo: '최종 학력은 무엇인가요?',
        titleEn: "What's your highest education?",
        type: 'option-list' as const,
      },
      {
        key: 'availableAnnualFund' as keyof DiagnosisInput,
        titleKo: '연간 준비 가능한 자금은?',
        titleEn: 'Available annual fund?',
        type: 'option-list' as const,
      },
      {
        key: 'finalGoal' as keyof DiagnosisInput,
        titleKo: '한국에서의 최종 목표는?',
        titleEn: 'What is your goal in Korea?',
        type: 'option-list' as const,
      },
      {
        key: 'priorityPreference' as keyof DiagnosisInput,
        titleKo: '가장 중요하게 생각하는 것은?',
        titleEn: "What's most important to you?",
        type: 'option-list' as const,
      },
    ],
    []
  );

  // 진단 결과의 경로 목록 / Pathways from diagnosis result
  const pathways = mockDiagnosisResult.pathways;

  // ============================================
  // 답변 선택 핸들러 / Answer selection handler
  // ============================================
  const handleSelectAnswer = useCallback(
    (key: keyof DiagnosisInput, value: string | number) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
      // 자동으로 다음 단계로 이동 / Automatically move to next step
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setSlideDirection('left');
          setCurrentStep((prev) => prev + 1);
        } else {
          setShowResults(true);
        }
      }, 300);
    },
    [currentStep, questions.length]
  );

  // 나이 입력 확인 / Confirm age input
  const handleAgeConfirm = useCallback(() => {
    const age = parseInt(ageInput, 10);
    if (age > 0 && age < 100) {
      handleSelectAnswer('age', age);
    }
  }, [ageInput, handleSelectAnswer]);

  // 다음 스토리로 이동 (오른쪽 탭) / Navigate to next story (right tap)
  const handleNext = useCallback(() => {
    if (showResults) {
      if (activeResultIndex < pathways.length - 1) {
        setSlideDirection('left');
        setActiveResultIndex((prev) => prev + 1);
      }
    } else {
      const currentQuestion = questions[currentStep];
      if (inputs[currentQuestion.key] !== undefined) {
        if (currentStep < questions.length - 1) {
          setSlideDirection('left');
          setCurrentStep((prev) => prev + 1);
        } else {
          setShowResults(true);
        }
      }
    }
  }, [showResults, activeResultIndex, pathways.length, currentStep, questions, inputs]);

  // 이전 스토리로 이동 (왼쪽 탭) / Navigate to previous story (left tap)
  const handlePrev = useCallback(() => {
    if (showResults) {
      if (activeResultIndex > 0) {
        setSlideDirection('right');
        setActiveResultIndex((prev) => prev - 1);
      } else {
        // 결과의 첫 번째에서 뒤로 가면 입력 화면으로 돌아감
        // Going back from first result returns to input screen
        setShowResults(false);
        setCurrentStep(questions.length - 1);
      }
    } else {
      if (currentStep > 0) {
        setSlideDirection('right');
        setCurrentStep((prev) => prev - 1);
      }
    }
  }, [showResults, activeResultIndex, currentStep, questions.length]);

  // 처음부터 다시 시작 / Restart from beginning
  const handleRestart = useCallback(() => {
    setInputs({});
    setCurrentStep(0);
    setShowResults(false);
    setActiveResultIndex(0);
    setAgeInput('');
  }, []);

  // 키보드 좌우 이동 / Keyboard left/right navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // 슬라이드 애니메이션 리셋 / Reset slide animation
  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => setSlideDirection(null), 400);
      return () => clearTimeout(timer);
    }
  }, [slideDirection, currentStep, activeResultIndex]);

  // ===========================================
  // 프로그레스 바 / Progress bar
  // ===========================================
  const renderProgressBar = (count: number, activeIndex: number) => (
    <div className="absolute top-3 left-3 right-3 flex space-x-1 z-30">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/30">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              i < activeIndex
                ? 'w-full bg-white'
                : i === activeIndex
                ? 'w-1/2 bg-white/90'
                : 'w-0'
            }`}
          />
        </div>
      ))}
    </div>
  );

  // ===========================================
  // 현재 단계의 옵션 가져오기 / Get options for current step
  // ===========================================
  const getOptionsForStep = (step: QuestionStep) => {
    switch (step.key) {
      case 'educationLevel':
        return educationOptions.map((e) => ({
          value: e.value,
          label: `${e.emoji} ${e.labelKo}`,
          subLabel: e.labelEn,
        }));
      case 'availableAnnualFund':
        return fundOptions.map((f) => ({
          value: String(f.value),
          label: f.labelKo,
          subLabel: f.labelEn,
        }));
      case 'finalGoal':
        return goalOptions.map((g) => ({
          value: g.value,
          label: `${g.emoji} ${g.labelKo}`,
          subLabel: g.descKo,
        }));
      case 'priorityPreference':
        return priorityOptions.map((p) => ({
          value: p.value,
          label: `${p.emoji} ${p.labelKo}`,
          subLabel: p.descKo,
        }));
      default:
        return [];
    }
  };

  // ===========================================
  // 점수에 따른 배경 그라데이션 / Background gradient by score
  // ===========================================
  const getResultGradient = (score: number): string => {
    if (score >= 71) return 'from-emerald-500 via-teal-600 to-cyan-700';
    if (score >= 51) return 'from-blue-500 via-indigo-600 to-purple-700';
    if (score >= 31) return 'from-amber-500 via-orange-600 to-red-600';
    return 'from-rose-500 via-pink-600 to-purple-700';
  };

  // ===========================================
  // 질문 화면 렌더링 / Render question view
  // ===========================================
  const renderQuestionView = () => {
    const question = questions[currentStep];
    const isAnswered = inputs[question.key] !== undefined;

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
        {/* 프로그레스 바 / Progress bar */}
        {renderProgressBar(questions.length, currentStep)}

        {/* 단계 번호 / Step number */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
          <span className="text-white/60 text-xs tracking-widest uppercase">
            Step {currentStep + 1} / {questions.length}
          </span>
        </div>

        {/* 질문 제목 / Question title */}
        <div className="text-center mb-8 z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
            {question.titleKo}
          </h1>
          <p className="text-white/60 text-sm">{question.titleEn}</p>
        </div>

        {/* 답변 영역 / Answer area */}
        <div className="w-full max-w-md z-10 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {/* 국가 그리드 / Country grid */}
          {question.type === 'country-grid' && (
            <div className="grid grid-cols-3 gap-2">
              {popularCountries.map((country) => {
                const isSelected = inputs.nationality === country.code;
                return (
                  <button
                    key={country.code}
                    onClick={() => handleSelectAnswer('nationality', country.code)}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-2xl
                      transition-all duration-200 transform
                      ${
                        isSelected
                          ? 'bg-white/40 ring-2 ring-white scale-105'
                          : 'bg-white/15 hover:bg-white/25 hover:scale-[1.02]'
                      }
                    `}
                  >
                    <span className="text-2xl mb-1">{country.flag}</span>
                    <span className="text-white text-xs font-medium">{country.nameKo}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 나이 입력 / Age input */}
          {question.type === 'number-input' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-full max-w-[200px]">
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={ageInput}
                  onChange={(e) => setAgeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAgeConfirm();
                  }}
                  placeholder="25"
                  className="w-full p-4 text-center text-5xl font-bold bg-white/15 border-2 border-white/40 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">
                  세
                </span>
              </div>
              <button
                onClick={handleAgeConfirm}
                disabled={!ageInput || parseInt(ageInput, 10) <= 0}
                className="px-8 py-3 bg-white/25 hover:bg-white/35 disabled:bg-white/10 disabled:cursor-not-allowed rounded-full text-white font-semibold transition-all flex items-center space-x-2"
              >
                <span>확인</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* 옵션 리스트 / Option list */}
          {question.type === 'option-list' && (
            <div className="space-y-2">
              {getOptionsForStep(question).map((opt) => {
                const currentValue = inputs[question.key];
                const isSelected =
                  currentValue !== undefined && String(currentValue) === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const val =
                        question.key === 'availableAnnualFund'
                          ? parseInt(opt.value, 10)
                          : opt.value;
                      handleSelectAnswer(question.key, val);
                    }}
                    className={`
                      w-full p-4 rounded-2xl text-left transition-all duration-200
                      transform flex items-center justify-between
                      ${
                        isSelected
                          ? 'bg-white/35 ring-2 ring-white scale-[1.02]'
                          : 'bg-white/15 hover:bg-white/25 hover:scale-[1.01]'
                      }
                    `}
                  >
                    <div>
                      <div className="text-white font-semibold text-base">{opt.label}</div>
                      {opt.subLabel && (
                        <div className="text-white/50 text-xs mt-0.5">{opt.subLabel}</div>
                      )}
                    </div>
                    {isSelected && <CheckCircle size={20} className="text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 탭 네비게이션 힌트 / Tap navigation hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 text-white/40 text-xs z-10">
          {currentStep > 0 && (
            <span className="flex items-center">
              <ChevronLeft size={14} /> 이전
            </span>
          )}
          {isAnswered && currentStep < questions.length - 1 && (
            <span className="flex items-center">
              다음 <ChevronRight size={14} />
            </span>
          )}
        </div>
      </div>
    );
  };

  // ===========================================
  // 결과 화면 렌더링 / Render result view
  // ===========================================
  const renderResultView = () => {
    const pathway = pathways[activeResultIndex];
    if (!pathway) return null;

    const scoreColor = getScoreColor(pathway.finalScore);
    const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);
    const gradient = getResultGradient(pathway.finalScore);

    return (
      <div
        className={`relative w-full h-full bg-linear-to-br ${gradient} flex flex-col items-center justify-start overflow-y-auto`}
      >
        {/* 프로그레스 바 / Progress bar */}
        {renderProgressBar(pathways.length, activeResultIndex)}

        {/* 닫기 + 공유 버튼 / Close + share buttons */}
        <div className="absolute top-8 right-4 z-30 flex items-center space-x-3">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
            }}
            className="p-2 bg-white/15 rounded-full hover:bg-white/25 transition-colors"
            title="공유 / Share"
          >
            <Share2 size={18} className="text-white" />
          </button>
          <button
            onClick={handleRestart}
            className="p-2 bg-white/15 rounded-full hover:bg-white/25 transition-colors"
            title="다시 시작 / Restart"
          >
            <RotateCcw size={18} className="text-white" />
          </button>
        </div>

        {/* 스토리 하이라이트 서클 / Story highlight circles */}
        <div className="flex items-center space-x-3 mt-10 mb-4 z-10 px-4">
          {pathways.map((p, idx) => {
            const isActive = idx === activeResultIndex;
            const borderColor = getScoreColor(p.finalScore);
            return (
              <button
                key={p.pathwayId}
                onClick={() => {
                  setSlideDirection(idx > activeResultIndex ? 'left' : 'right');
                  setActiveResultIndex(idx);
                }}
                className={`
                  shrink-0 flex flex-col items-center transition-all duration-300
                  ${isActive ? 'scale-110' : 'scale-90 opacity-60'}
                `}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold"
                  style={{
                    border: `3px solid ${borderColor}`,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                  }}
                >
                  {p.finalScore}
                </div>
                <span className="text-white/70 text-[10px] mt-1 w-14 text-center truncate">
                  {p.pathwayId}
                </span>
              </button>
            );
          })}
        </div>

        {/* 경로 정보 카드 / Pathway info card */}
        <div className="w-full max-w-md px-4 z-10 pb-24">
          {/* 경로 제목 / Pathway title */}
          <div className="bg-black/25 backdrop-blur-sm rounded-3xl p-6 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xl">{emoji}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: scoreColor, color: 'white' }}
                  >
                    {pathway.feasibilityLabel}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white leading-tight">{pathway.nameKo}</h2>
                <p className="text-white/50 text-xs mt-1">{pathway.nameEn}</p>
              </div>
              <div
                className="text-3xl font-black text-white/90"
                style={{ color: scoreColor }}
              >
                {pathway.finalScore}
                <span className="text-sm font-normal text-white/40">점</span>
              </div>
            </div>

            {/* 주요 지표 / Key metrics */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <Clock size={16} className="text-white/60 mx-auto mb-1" />
                <div className="text-white font-bold text-lg">{pathway.estimatedMonths}</div>
                <div className="text-white/50 text-[10px]">개월 소요</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <DollarSign size={16} className="text-white/60 mx-auto mb-1" />
                <div className="text-white font-bold text-lg">
                  {pathway.estimatedCostWon > 0
                    ? `${pathway.estimatedCostWon.toLocaleString()}`
                    : '무료'}
                </div>
                <div className="text-white/50 text-[10px]">만원</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <Target size={16} className="text-white/60 mx-auto mb-1" />
                <div className="text-white font-bold text-xs leading-tight mt-1">
                  {pathway.platformSupport === 'full_support'
                    ? '풀 서포트'
                    : pathway.platformSupport === 'visa_processing'
                    ? '비자 대행'
                    : '정보 제공'}
                </div>
                <div className="text-white/50 text-[10px]">지원 유형</div>
              </div>
            </div>
          </div>

          {/* 비자 체인 / Visa chain */}
          <div className="bg-black/25 backdrop-blur-sm rounded-3xl p-5 mb-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center">
              <Sparkles size={14} className="mr-2" />
              비자 경로 / Visa Chain
            </h3>
            <div className="flex items-center flex-wrap gap-2">
              {pathway.visaChain.split(' → ').map((visa, idx, arr) => (
                <div key={idx} className="flex items-center">
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {visa}
                  </span>
                  {idx < arr.length - 1 && (
                    <ArrowRight size={14} className="text-white/40 mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 마일스톤 타임라인 / Milestone timeline */}
          <div className="bg-black/25 backdrop-blur-sm rounded-3xl p-5 mb-4">
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center">
              <Star size={14} className="mr-2" />
              주요 단계 / Milestones
            </h3>
            <div className="space-y-4">
              {pathway.milestones.map((ms, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  {/* 타임라인 점 / Timeline dot */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        ms.type === 'final_goal'
                          ? 'bg-green-400'
                          : ms.type === 'entry'
                          ? 'bg-blue-400'
                          : 'bg-white/50'
                      }`}
                    />
                    {idx < pathway.milestones.length - 1 && (
                      <div className="w-px h-8 bg-white/20 mt-1" />
                    )}
                  </div>
                  {/* 마일스톤 내용 / Milestone content */}
                  <div className="flex-1 -mt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">{ms.nameKo}</span>
                      <span className="text-white/40 text-[10px]">
                        {ms.monthFromStart}개월
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      {ms.visaStatus !== 'none' && (
                        <span className="text-[10px] bg-white/15 text-white/70 px-1.5 py-0.5 rounded">
                          {ms.visaStatus}
                        </span>
                      )}
                      {ms.canWorkPartTime && (
                        <span className="text-[10px] text-green-300">
                          근무 가능 {ms.weeklyHours > 0 ? `${ms.weeklyHours}h/w` : '(무제한)'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 비고 / Note */}
          <div className="bg-black/25 backdrop-blur-sm rounded-3xl p-5 mb-4">
            <p className="text-white/60 text-xs italic">
              💡 {pathway.note}
            </p>
          </div>

          {/* 다음 스텝 / Next steps */}
          {pathway.nextSteps.length > 0 && (
            <div className="bg-black/25 backdrop-blur-sm rounded-3xl p-5">
              <h3 className="text-white font-semibold text-sm mb-3">
                다음 단계 / Next Steps
              </h3>
              <div className="space-y-2">
                {pathway.nextSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 rounded-xl p-3 flex items-start space-x-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xs text-white font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{step.nameKo}</div>
                      <div className="text-white/50 text-xs mt-0.5">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 공유 바 / Bottom share bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4 z-20">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/15 rounded-full text-white text-sm hover:bg-white/25 transition-colors"
            >
              <RotateCcw size={16} />
              <span>다시 진단하기</span>
            </button>
            <button
              className="flex items-center space-x-2 px-6 py-2.5 bg-white text-purple-700 rounded-full text-sm font-bold hover:bg-white/90 transition-colors"
            >
              <Share2 size={16} />
              <span>결과 공유</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ===========================================
  // 메인 렌더 / Main render
  // ===========================================
  return (
    <main className="h-screen w-screen overflow-hidden relative">
      {/* 배경 그라데이션 / Background gradient */}
      {!showResults && (
        <div className="absolute inset-0 bg-linear-to-br from-pink-500 via-fuchsia-500 to-purple-700" />
      )}

      {/* 탭 네비게이션 영역 (좌/우) / Tap navigation areas (left/right) */}
      {!showResults && (
        <>
          <div
            className="absolute left-0 top-0 h-full w-1/4 z-20 cursor-pointer"
            onClick={handlePrev}
          />
          <div
            className="absolute right-0 top-0 h-full w-1/4 z-20 cursor-pointer"
            onClick={handleNext}
          />
        </>
      )}

      {/* 결과 화면의 탭 네비게이션 / Tap navigation for result view */}
      {showResults && (
        <>
          <div
            className="absolute left-0 top-0 h-full w-1/5 z-20 cursor-pointer"
            onClick={handlePrev}
          />
          <div
            className="absolute right-0 top-0 h-full w-1/5 z-20 cursor-pointer"
            onClick={handleNext}
          />
        </>
      )}

      {/* 콘텐츠 영역 / Content area */}
      <div
        className={`relative w-full h-full transition-transform duration-300 ease-out ${
          slideDirection === 'left'
            ? 'animate-slideLeft'
            : slideDirection === 'right'
            ? 'animate-slideRight'
            : ''
        }`}
      >
        {showResults ? renderResultView() : renderQuestionView()}
      </div>

      {/* 슬라이드 애니메이션 스타일 / Slide animation styles */}
      <style jsx>{`
        @keyframes slideLeft {
          from {
            transform: translateX(30px);
            opacity: 0.5;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideRight {
          from {
            transform: translateX(-30px);
            opacity: 0.5;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideLeft {
          animation: slideLeft 0.3s ease-out;
        }
        .animate-slideRight {
          animation: slideRight 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
