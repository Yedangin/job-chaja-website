'use client';
// KOR: 디자인 #59 - 요리 레시피 테마의 비자 진단 페이지
// ENG: Design #59 - Cooking Recipe themed visa diagnosis page

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
import {
  ChefHat,
  Clock,
  Flame,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Check,
  BookOpen,
  Utensils,
  Timer,
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Soup,
} from 'lucide-react';

// KOR: 단계 타입 정의 - 입력 단계와 결과 단계 구분
// ENG: Step type definition - separating input steps from result step
type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference' | 'results';

// KOR: 각 단계별 요리 레시피 테마 메타데이터
// ENG: Cooking recipe theme metadata for each step
const STEP_METADATA: Record<string, { ingredient: string; emoji: string; tip: string; unit: string }> = {
  nationality: { ingredient: '국적 (Origins)', emoji: '🌍', tip: '요리의 근본은 재료의 출처입니다', unit: '국가' },
  age: { ingredient: '나이 (Age)', emoji: '🎂', tip: '숙성 기간이 맛을 결정합니다', unit: '세' },
  educationLevel: { ingredient: '학력 (Education)', emoji: '🎓', tip: '기술 레벨이 레시피 난이도를 결정합니다', unit: '단계' },
  availableAnnualFund: { ingredient: '예산 (Budget)', emoji: '💰', tip: '좋은 재료엔 적절한 투자가 필요합니다', unit: '연간' },
  finalGoal: { ingredient: '목표 (Goal)', emoji: '🏆', tip: '완성할 요리를 먼저 결정하세요', unit: '목표' },
  priorityPreference: { ingredient: '우선순위 (Priority)', emoji: '⭐', tip: '요리 스타일은 셰프의 철학입니다', unit: '방식' },
};

// KOR: 난이도를 요리 용어로 변환
// ENG: Convert feasibility to cooking difficulty terms
const getDifficultyLabel = (score: number): { label: string; emoji: string; color: string } => {
  if (score >= 80) return { label: '입문자 레시피', emoji: '🟢', color: 'text-green-600' };
  if (score >= 65) return { label: '중급 레시피', emoji: '🟡', color: 'text-yellow-600' };
  if (score >= 50) return { label: '고급 레시피', emoji: '🟠', color: 'text-orange-600' };
  return { label: '마스터 레시피', emoji: '🔴', color: 'text-red-600' };
};

// KOR: 조리 시간을 월 수로 포맷
// ENG: Format cooking time from months
const formatCookingTime = (months: number): string => {
  if (months < 12) return `${months}개월`;
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  return remaining > 0 ? `${years}년 ${remaining}개월` : `${years}년`;
};

export default function Diagnosis59Page() {
  // KOR: 현재 단계 상태
  // ENG: Current step state
  const [currentStep, setCurrentStep] = useState<Step>('nationality');

  // KOR: 사용자 입력 상태 - mockInput으로 초기화
  // ENG: User input state - initialized with mockInput
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });

  // KOR: 결과 표시 상태
  // ENG: Results display state
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 로딩 상태 (조리 중 애니메이션)
  // ENG: Loading state (cooking animation)
  const [isCooking, setIsCooking] = useState(false);

  // KOR: 확장된 레시피 카드 상태
  // ENG: Expanded recipe card state
  const [expandedCard, setExpandedCard] = useState<string | null>('path-1');

  // KOR: 조리 단계 순서 정의
  // ENG: Define cooking step order
  const STEPS: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'];
  const currentStepIndex = STEPS.indexOf(currentStep as any);

  // KOR: 다음 단계로 이동 핸들러
  // ENG: Move to next step handler
  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    } else {
      // KOR: 조리 시작 - 진단 시작
      // ENG: Start cooking - begin diagnosis
      startCooking();
    }
  };

  // KOR: 이전 단계로 이동 핸들러
  // ENG: Move to previous step handler
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1]);
    }
  };

  // KOR: 조리 시작 (진단 처리)
  // ENG: Start cooking (process diagnosis)
  const startCooking = () => {
    setIsCooking(true);
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setCurrentStep('results');
      setIsCooking(false);
    }, 2000);
  };

  // KOR: 처음부터 다시 시작
  // ENG: Start over from the beginning
  const handleReset = () => {
    setCurrentStep('nationality');
    setInput({ ...mockInput });
    setResult(null);
    setExpandedCard('path-1');
  };

  // KOR: 입력값 업데이트 핸들러
  // ENG: Update input value handler
  const updateInput = (key: keyof DiagnosisInput, value: string | number) => {
    setInput(prev => ({ ...prev, [key]: value }));
  };

  // KOR: 재료 목록 컴포넌트 (좌측 사이드바)
  // ENG: Ingredients list component (left sidebar)
  const IngredientsSidebar = () => (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Utensils size={18} className="text-amber-700" />
        <h3 className="font-bold text-amber-900 text-sm">재료 목록 / Ingredients</h3>
      </div>
      <div className="space-y-2">
        {STEPS.map((step, idx) => {
          const meta = STEP_METADATA[step];
          const isCompleted = idx < currentStepIndex;
          const isCurrent = step === currentStep;
          return (
            <div
              key={step}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                isCurrent ? 'bg-orange-100 border border-orange-300' :
                isCompleted ? 'opacity-60' : 'opacity-40'
              }`}
            >
              <span className="text-base shrink-0">{meta.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${isCurrent ? 'text-orange-800' : 'text-amber-800'}`}>
                  {meta.ingredient}
                </p>
              </div>
              {isCompleted && <Check size={12} className="text-green-600 shrink-0" />}
              {isCurrent && <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 animate-pulse" />}
            </div>
          );
        })}
      </div>

      {/* KOR: 요리 팁 박스 / ENG: Cooking tip box */}
      {currentStep !== 'results' && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
          <p className="text-xs font-bold text-orange-700 mb-1">셰프의 팁 Chef's Tip</p>
          <p className="text-xs text-orange-600 leading-relaxed">
            {STEP_METADATA[currentStep]?.tip}
          </p>
        </div>
      )}
    </div>
  );

  // KOR: 진행 표시기 컴포넌트
  // ENG: Progress indicator component
  const ProgressBar = () => (
    <div className="flex items-center gap-1 mb-6">
      {STEPS.map((step, idx) => (
        <React.Fragment key={step}>
          <div
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              idx < currentStepIndex ? 'bg-orange-500' :
              idx === currentStepIndex ? 'bg-orange-300' : 'bg-amber-100'
            }`}
          />
          {idx < STEPS.length - 1 && (
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              idx < currentStepIndex ? 'bg-orange-500' : 'bg-amber-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // KOR: 국적 선택 단계
  // ENG: Nationality selection step
  const NationalityStep = () => (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {popularCountries.map(country => (
          <button
            key={country.code}
            onClick={() => updateInput('nationality', country.name)}
            className={`p-3 rounded-xl border-2 transition-all text-center ${
              input.nationality === country.name
                ? 'border-orange-500 bg-orange-50 shadow-md'
                : 'border-amber-200 bg-white hover:border-amber-400'
            }`}
          >
            <div className="text-2xl mb-1">{country.flag}</div>
            <div className="text-xs font-medium text-amber-900 truncate">{country.name}</div>
          </button>
        ))}
      </div>
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
        <p className="text-xs text-amber-700 font-medium mb-1">기타 국가 입력 / Other Country</p>
        <input
          type="text"
          placeholder="국가명을 입력하세요..."
          value={popularCountries.some(c => c.name === input.nationality) ? '' : input.nationality}
          onChange={e => updateInput('nationality', e.target.value)}
          className="w-full text-sm border border-amber-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-orange-400"
        />
      </div>
    </div>
  );

  // KOR: 나이 입력 단계
  // ENG: Age input step
  const AgeStep = () => (
    <div className="text-center">
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => updateInput('age', Math.max(18, (input.age as number) - 1))}
          className="w-12 h-12 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold text-xl transition-all"
        >
          -
        </button>
        <div className="w-32 h-32 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex flex-col items-center justify-center shadow-lg">
          <span className="text-4xl font-bold text-white">{input.age}</span>
          <span className="text-sm text-orange-100">세 / years</span>
        </div>
        <button
          onClick={() => updateInput('age', Math.min(65, (input.age as number) + 1))}
          className="w-12 h-12 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold text-xl transition-all"
        >
          +
        </button>
      </div>
      <input
        type="range"
        min={18}
        max={65}
        value={input.age}
        onChange={e => updateInput('age', parseInt(e.target.value))}
        className="w-full accent-orange-500"
      />
      <div className="flex justify-between text-xs text-amber-500 mt-1">
        <span>18세</span>
        <span>65세</span>
      </div>
      <p className="mt-4 text-sm text-amber-700 bg-amber-50 rounded-xl p-3">
        🎂 나이는 비자 포인트 계산의 핵심 재료입니다
      </p>
    </div>
  );

  // KOR: 학력 선택 단계
  // ENG: Education level selection step
  const EducationStep = () => (
    <div className="space-y-2">
      {educationOptions.map((option, idx) => {
        const levelEmojis = ['📗', '📘', '📙', '📕', '📔'];
        return (
          <button
            key={String(option.value)}
            onClick={() => updateInput('educationLevel', option.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              input.educationLevel === option.value
                ? 'border-orange-500 bg-orange-50 shadow-md'
                : 'border-amber-200 bg-white hover:border-amber-400'
            }`}
          >
            <span className="text-xl shrink-0">{levelEmojis[idx]}</span>
            <span className="font-medium text-amber-900">{option.labelKo}</span>
            {input.educationLevel === option.value && (
              <Check size={16} className="ml-auto text-orange-500 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );

  // KOR: 예산 선택 단계
  // ENG: Fund selection step
  const FundStep = () => (
    <div className="space-y-2">
      {fundOptions.map((option, idx) => {
        const budgetEmojis = ['🪙', '💵', '💴', '💰', '💎'];
        return (
          <button
            key={String(option.value)}
            onClick={() => updateInput('availableAnnualFund', option.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              input.availableAnnualFund === option.value
                ? 'border-orange-500 bg-orange-50 shadow-md'
                : 'border-amber-200 bg-white hover:border-amber-400'
            }`}
          >
            <span className="text-xl shrink-0">{budgetEmojis[idx]}</span>
            <span className="font-medium text-amber-900">{option.labelKo}</span>
            {input.availableAnnualFund === option.value && (
              <Check size={16} className="ml-auto text-orange-500 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );

  // KOR: 최종 목표 선택 단계
  // ENG: Final goal selection step
  const GoalStep = () => (
    <div className="space-y-2">
      {goalOptions.map((option, idx) => {
        const goalEmojis = ['🗣️', '⚡', '🌱', '📚', '🏆'];
        return (
          <button
            key={String(option.value)}
            onClick={() => updateInput('finalGoal', option.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              input.finalGoal === option.value
                ? 'border-orange-500 bg-orange-50 shadow-md'
                : 'border-amber-200 bg-white hover:border-amber-400'
            }`}
          >
            <span className="text-xl shrink-0">{goalEmojis[idx]}</span>
            <span className="font-medium text-amber-900">{option.labelKo}</span>
            {input.finalGoal === option.value && (
              <Check size={16} className="ml-auto text-orange-500 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );

  // KOR: 우선순위 선택 단계
  // ENG: Priority selection step
  const PriorityStep = () => (
    <div className="space-y-2">
      {priorityOptions.map((option, idx) => {
        const priorityEmojis = ['🚀', '💸', '✅', '🎯'];
        return (
          <button
            key={String(option.value)}
            onClick={() => updateInput('priorityPreference', option.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              input.priorityPreference === option.value
                ? 'border-orange-500 bg-orange-50 shadow-md'
                : 'border-amber-200 bg-white hover:border-amber-400'
            }`}
          >
            <span className="text-xl shrink-0">{priorityEmojis[idx]}</span>
            <span className="font-medium text-amber-900">{option.labelKo}</span>
            {input.priorityPreference === option.value && (
              <Check size={16} className="ml-auto text-orange-500 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );

  // KOR: 현재 단계에 맞는 컨텐츠 렌더링
  // ENG: Render content for current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'nationality': return <NationalityStep />;
      case 'age': return <AgeStep />;
      case 'educationLevel': return <EducationStep />;
      case 'availableAnnualFund': return <FundStep />;
      case 'finalGoal': return <GoalStep />;
      case 'priorityPreference': return <PriorityStep />;
      default: return null;
    }
  };

  // KOR: 레시피 카드 컴포넌트 (결과 페이지용)
  // ENG: Recipe card component (for results page)
  const RecipeCard = ({ pathway, rank }: { pathway: RecommendedPathway; rank: number }) => {
    const isExpanded = expandedCard === pathway.id;
    const difficulty = getDifficultyLabel(pathway.feasibilityScore);
    const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

    return (
      <div
        className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
          isExpanded ? 'border-orange-400 shadow-xl' : 'border-amber-200 hover:border-amber-400 shadow-sm'
        }`}
      >
        {/* KOR: 레시피 카드 헤더 / ENG: Recipe card header */}
        <button
          onClick={() => setExpandedCard(isExpanded ? null : pathway.id)}
          className="w-full p-5 text-left"
        >
          <div className="flex items-start gap-3">
            {/* KOR: 랭크 뱃지 / ENG: Rank badge */}
            <div className="text-2xl shrink-0 mt-0.5">{rankEmojis[rank]}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  difficulty.color.replace('text-', 'bg-').replace('600', '100')
                } ${difficulty.color}`}>
                  {difficulty.emoji} {difficulty.label}
                </span>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  성공률 {pathway.feasibilityScore}%
                </span>
              </div>
              <h3 className="font-bold text-amber-900 text-base leading-tight">{pathway.name}</h3>
            </div>

            {/* KOR: 확장/축소 아이콘 / ENG: Expand/collapse icon */}
            <div className={`shrink-0 mt-1 text-amber-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown size={18} />
            </div>
          </div>

          {/* KOR: 빠른 정보 행 / ENG: Quick info row */}
          <div className="flex items-center gap-4 mt-3 text-xs text-amber-600">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatCookingTime(pathway.totalDurationMonths)}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign size={12} />
              ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Soup size={12} />
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length}단계 레시피
            </span>
          </div>
        </button>

        {/* KOR: 확장된 레시피 상세 내용 / ENG: Expanded recipe details */}
        {isExpanded && (
          <div className="border-t border-amber-100 bg-amber-50">
            <div className="p-5 space-y-5">

              {/* KOR: 레시피 설명 / ENG: Recipe description */}
              <p className="text-sm text-amber-800 leading-relaxed bg-white rounded-xl p-3 border border-amber-200">
                📋 {pathway.description}
              </p>

              {/* KOR: 비자 체인 (조리 과정) / ENG: Visa chain (cooking process) */}
              <div>
                <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-1">
                  <Flame size={12} />
                  조리 순서 / Cooking Steps
                </h4>
                <div className="flex items-center gap-1 flex-wrap">
                  {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className="bg-white border-2 border-orange-300 rounded-xl px-3 py-2 text-center shadow-sm">
                        <div className="text-sm font-bold text-orange-700">{step.visa}</div>
                        <div className="text-xs text-amber-600">{step.duration}</div>
                      </div>
                      {idx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                        <ArrowRight size={14} className="text-orange-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* KOR: 마일스톤 (단계별 조리법) / ENG: Milestones (step-by-step recipe) */}
              <div>
                <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-1">
                  <BookOpen size={12} />
                  단계별 레시피 / Step-by-Step
                </h4>
                <div className="space-y-2">
                  {pathway.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-amber-100">
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-900">
                          {milestone.emoji} {milestone.title}
                        </p>
                        <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KOR: 난이도 게이지 / ENG: Difficulty gauge */}
              <div>
                <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <TrendingUp size={12} />
                  성공 가능성 / Success Rate
                </h4>
                <div className="bg-white rounded-xl p-3 border border-amber-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-amber-700">{getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}</span>
                    <span className="text-sm font-bold text-orange-600">{pathway.feasibilityScore}%</span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-linear-to-r from-orange-400 to-amber-500 transition-all duration-500"
                      style={{ width: `${pathway.feasibilityScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* KOR: 잡차자 지원 CTA / ENG: JobChaja support CTA */}
              <button className="w-full bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl py-3 text-sm font-bold hover:from-orange-600 hover:to-amber-600 transition-all shadow-md">
                🍳 이 레시피로 시작하기 / Start This Recipe
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // KOR: 조리 중 로딩 화면
  // ENG: Cooking loading screen
  if (isCooking) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-8xl mb-6 animate-bounce">🍳</div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">비자 레시피 조리 중...</h2>
          <p className="text-amber-600 mb-6">Preparing your visa recipe...</p>
          <div className="flex justify-center gap-2">
            {['🥕', '🧅', '🧄', '🌶️', '🫙'].map((emoji, idx) => (
              <span
                key={idx}
                className="text-2xl"
                style={{ animationDelay: `${idx * 0.2}s`, animation: 'bounce 1s infinite' }}
              >
                {emoji}
              </span>
            ))}
          </div>
          <div className="mt-6 w-48 mx-auto bg-amber-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-orange-500 animate-pulse" style={{ width: '70%' }} />
          </div>
        </div>
      </div>
    );
  }

  // KOR: 결과 페이지 렌더링
  // ENG: Render results page
  if (currentStep === 'results' && result) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* KOR: 결과 헤더 / ENG: Results header */}
        <div className="bg-linear-to-r from-orange-600 to-amber-600 text-white py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <ChefHat size={28} className="shrink-0" />
              <div>
                <p className="text-orange-200 text-sm">비자 레시피 완성 / Recipe Complete</p>
                <h1 className="text-xl font-bold">맞춤 비자 레시피 {result.pathways.length}개 완성!</h1>
              </div>
            </div>

            {/* KOR: 요약 재료 태그 / ENG: Summary ingredient tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                🌍 {result.userInput.nationality}
              </span>
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                🎂 {result.userInput.age}세
              </span>
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                🎓 {result.userInput.educationLevel}
              </span>
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                🏆 {result.userInput.finalGoal}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-4">
          {/* KOR: 레시피 통계 / ENG: Recipe statistics */}
          <div className="grid grid-cols-3 gap-3 mb-6 mt-2">
            <div className="bg-white rounded-2xl p-4 text-center border border-amber-200 shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{result.pathways.length}</div>
              <div className="text-xs text-amber-600 mt-1">레시피 수 / Recipes</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-amber-200 shadow-sm">
              <div className="text-2xl font-bold text-orange-600">
                {Math.max(...result.pathways.map(p => p.feasibilityScore))}%
              </div>
              <div className="text-xs text-amber-600 mt-1">최고 성공률 / Top Rate</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-amber-200 shadow-sm">
              <div className="text-2xl font-bold text-orange-600">
                {formatCookingTime(Math.min(...result.pathways.map(p => p.totalDurationMonths)))}
              </div>
              <div className="text-xs text-amber-600 mt-1">최단 기간 / Fastest</div>
            </div>
          </div>

          {/* KOR: 레시피 카드 목록 / ENG: Recipe card list */}
          <div className="space-y-3">
            {result.pathways.map((pathway, idx) => (
              <RecipeCard key={pathway.id} pathway={pathway} rank={idx} />
            ))}
          </div>

          {/* KOR: 전문가 상담 배너 / ENG: Expert consultation banner */}
          <div className="mt-6 bg-linear-to-br from-amber-800 to-orange-900 rounded-2xl p-5 text-white text-center">
            <div className="text-3xl mb-2">👨‍🍳</div>
            <h3 className="font-bold text-lg mb-1">전문 비자 셰프와 상담하기</h3>
            <p className="text-amber-200 text-sm mb-4">Consult with our visa expert chef</p>
            <button className="bg-white text-amber-900 font-bold py-2 px-6 rounded-xl text-sm hover:bg-amber-100 transition-all">
              무료 상담 예약 / Free Consultation
            </button>
          </div>

          {/* KOR: 다시 시작 버튼 / ENG: Reset button */}
          <button
            onClick={handleReset}
            className="w-full mt-4 py-3 border-2 border-amber-300 text-amber-700 font-bold rounded-2xl hover:bg-amber-50 transition-all text-sm"
          >
            🔄 새로운 레시피 만들기 / Create New Recipe
          </button>
        </div>
      </div>
    );
  }

  // KOR: 메인 입력 폼 렌더링
  // ENG: Render main input form
  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* KOR: 헤더 / ENG: Header */}
      <header className="bg-linear-to-r from-orange-600 to-amber-600 text-white py-4 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <ChefHat size={22} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">비자 레시피 북</h1>
            <p className="text-orange-200 text-xs">Visa Recipe Book — Jobchaja</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5">
            <Timer size={14} />
            <span className="text-xs font-medium">재료 {currentStepIndex + 1}/{STEPS.length}</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* KOR: 좌측 재료 사이드바 (lg 이상에서만 표시) / ENG: Left ingredients sidebar (shown lg+) */}
          <div className="hidden lg:block">
            <IngredientsSidebar />
          </div>

          {/* KOR: 메인 입력 폼 / ENG: Main input form */}
          <div className="lg:col-span-2">
            {/* KOR: 요리 카드 / ENG: Cooking card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-amber-200 overflow-hidden">

              {/* KOR: 카드 헤더 - 현재 재료 정보 / ENG: Card header - current ingredient info */}
              <div className="bg-linear-to-r from-orange-500 to-amber-500 p-5">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{STEP_METADATA[currentStep]?.emoji}</div>
                  <div>
                    <p className="text-orange-100 text-xs mb-0.5 uppercase tracking-wide font-medium">
                      재료 {currentStepIndex + 1} / Ingredient {currentStepIndex + 1}
                    </p>
                    <h2 className="text-xl font-bold text-white">
                      {STEP_METADATA[currentStep]?.ingredient}
                    </h2>
                  </div>
                </div>

                {/* KOR: 진행 바 / ENG: Progress bar */}
                <div className="mt-4">
                  <ProgressBar />
                </div>
              </div>

              {/* KOR: 카드 본문 / ENG: Card body */}
              <div className="p-5">
                {/* KOR: 모바일용 팁 / ENG: Mobile tip */}
                <div className="lg:hidden mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                  <p className="text-xs font-bold text-orange-700">👨‍🍳 셰프의 팁</p>
                  <p className="text-xs text-orange-600 mt-0.5">{STEP_METADATA[currentStep]?.tip}</p>
                </div>

                {/* KOR: 단계별 콘텐츠 / ENG: Step-specific content */}
                {renderStepContent()}

                {/* KOR: 네비게이션 버튼 / ENG: Navigation buttons */}
                <div className="flex gap-3 mt-6">
                  {currentStepIndex > 0 && (
                    <button
                      onClick={handleBack}
                      className="flex-1 py-3 border-2 border-amber-300 text-amber-700 font-bold rounded-xl hover:bg-amber-50 transition-all"
                    >
                      ← 이전 재료
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="flex-1 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {currentStepIndex === STEPS.length - 1 ? (
                      <>
                        <Flame size={16} />
                        요리 시작! / Start Cooking!
                      </>
                    ) : (
                      <>
                        다음 재료 →
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* KOR: 카드 푸터 - 레시피 미리보기 / ENG: Card footer - recipe preview */}
              <div className="px-5 pb-4 border-t border-amber-100 pt-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs text-amber-500 shrink-0">재료:</span>
                  {STEPS.slice(0, currentStepIndex + 1).map((step) => (
                    <span key={step} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full shrink-0">
                      {STEP_METADATA[step]?.emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* KOR: 모바일용 재료 목록 (간략) / ENG: Mobile ingredients list (compact) */}
            <div className="lg:hidden mt-4">
              <IngredientsSidebar />
            </div>

            {/* KOR: 하단 안내 / ENG: Bottom guidance */}
            <div className="mt-4 text-center text-xs text-amber-500">
              <Award size={12} className="inline mr-1" />
              잡차자 AI 비자 엔진이 최적 레시피를 선별합니다
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
