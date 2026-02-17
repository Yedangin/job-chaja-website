'use client';
// KOR: 진단 디자인 #57 — 과학 키트 (Science Kit) 테마
// ENG: Diagnosis Design #57 — Science Kit Theme (KiwiCo/MEL Science inspired)

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
  FlaskConical,
  Beaker,
  Atom,
  TestTube,
  Microscope,
  Zap,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  Star,
  Clock,
  DollarSign,
  ArrowRight,
  RotateCcw,
  Play,
  BookOpen,
  Target,
  Layers,
} from 'lucide-react';

// KOR: 과학 키트 테마 색상 상수
// ENG: Science Kit theme color constants
const SCIENCE_GREEN = '#22c55e';
const SCIENCE_GREEN_LIGHT = '#dcfce7';
const SCIENCE_GREEN_DARK = '#15803d';

// KOR: 단계 정의 — 과학 실험 재료 수집 단계
// ENG: Step definitions — Science experiment ingredient collection stages
const STEPS = [
  { id: 1, label: '국적', labelEn: 'Nationality', icon: '🌍', ingredient: 'Reagent A' },
  { id: 2, label: '나이', labelEn: 'Age', icon: '🧪', ingredient: 'Reagent B' },
  { id: 3, label: '학력', labelEn: 'Education', icon: '📚', ingredient: 'Catalyst' },
  { id: 4, label: '자금', labelEn: 'Budget', icon: '💰', ingredient: 'Solvent' },
  { id: 5, label: '목표', labelEn: 'Goal', icon: '🎯', ingredient: 'Compound X' },
  { id: 6, label: '우선순위', labelEn: 'Priority', icon: '⚡', ingredient: 'Activator' },
];

// KOR: 초기 입력 상태
// ENG: Initial input state
const initialInput: DiagnosisInput = {
  nationality: '',
  age: 0,
  educationLevel: '',
  availableAnnualFund: '',
  finalGoal: '',
  priorityPreference: '',
};

export default function Diagnosis57Page() {
  // KOR: 현재 단계 상태 (1~6: 입력, 7: 결과)
  // ENG: Current step state (1~6: input, 7: results)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [input, setInput] = useState<DiagnosisInput>(initialInput);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [expandedPathway, setExpandedPathway] = useState<string | null>('path-1');
  const [customAge, setCustomAge] = useState<string>('');

  // KOR: 수집된 재료 수 계산 (진행 표시용)
  // ENG: Count collected ingredients for progress display
  const collectedCount = [
    input.nationality,
    input.age > 0 ? input.age : '',
    input.educationLevel,
    input.availableAnnualFund,
    input.finalGoal,
    input.priorityPreference,
  ].filter(Boolean).length;

  // KOR: 다음 단계로 이동
  // ENG: Move to next step
  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleAnalyze();
    }
  };

  // KOR: 이전 단계로 이동
  // ENG: Move to previous step
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // KOR: 현재 단계의 입력값이 유효한지 확인
  // ENG: Check if current step's input is valid
  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 1: return !!input.nationality;
      case 2: return input.age > 0 && input.age < 100;
      case 3: return !!input.educationLevel;
      case 4: return !!input.availableAnnualFund;
      case 5: return !!input.finalGoal;
      case 6: return !!input.priorityPreference;
      default: return false;
    }
  };

  // KOR: 실험 분석 실행 (목업 데이터 사용)
  // ENG: Run experiment analysis (using mock data)
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setIsAnalyzing(false);
      setCurrentStep(7);
    }, 2200);
  };

  // KOR: 처음부터 다시 시작
  // ENG: Restart from beginning
  const handleReset = () => {
    setInput(initialInput);
    setCustomAge('');
    setCurrentStep(1);
    setResult(null);
    setExpandedPathway('path-1');
  };

  // KOR: 입력 업데이트 헬퍼
  // ENG: Input update helper
  const updateInput = (field: keyof DiagnosisInput, value: string | number) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  // KOR: 실현가능성 점수에 따른 버블 색상 반환
  // ENG: Return bubble color based on feasibility score
  const getBubbleColor = (score: number): string => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-lime-400 to-green-400';
    if (score >= 40) return 'from-yellow-400 to-lime-400';
    return 'from-orange-400 to-yellow-400';
  };

  // KOR: 재료 카드 렌더링 — 과학 실험 재료 스타일
  // ENG: Render ingredient card — science experiment material style
  const IngredientCard = ({ step, isActive, isCollected }: { step: typeof STEPS[0]; isActive: boolean; isCollected: boolean }) => (
    <div
      className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-300 ${
        isActive
          ? 'border-green-500 bg-green-50 shadow-lg shadow-green-200 scale-105'
          : isCollected
          ? 'border-green-300 bg-green-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      {/* KOR: 수집 완료 체크 마크 / ENG: Collection complete checkmark */}
      {isCollected && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
          <Check size={10} className="text-white" strokeWidth={3} />
        </div>
      )}
      <span className="text-2xl">{step.icon}</span>
      <span className="text-xs font-semibold text-gray-700">{step.label}</span>
      <span className="text-[10px] text-green-600 font-mono">{step.ingredient}</span>
    </div>
  );

  // KOR: 실험 플라스크 진행 표시기
  // ENG: Experiment flask progress indicator
  const FlaskProgress = () => (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border-2 border-green-200 shadow-sm">
      <div className="relative">
        <FlaskConical size={48} className="text-green-500" />
        {/* KOR: 채워진 재료 표시 / ENG: Show filled ingredients */}
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 bg-linear-to-t from-green-400 to-green-300 rounded-sm transition-all duration-500"
          style={{ height: `${(collectedCount / 6) * 28}px` }}
        />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-700 mb-1">재료 수집 현황</div>
        <div className="text-xs text-gray-500 mb-2">Ingredients Collected: {collectedCount}/6</div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 bg-linear-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(collectedCount / 6) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );

  // KOR: 분석 중 화면 렌더링
  // ENG: Render analyzing screen
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="absolute inset-4 bg-green-200 rounded-full animate-ping opacity-40" style={{ animationDelay: '0.3s' }} />
            <div className="relative w-full h-full bg-green-50 rounded-full border-4 border-green-400 flex items-center justify-center shadow-lg shadow-green-200">
              <FlaskConical size={48} className="text-green-500 animate-bounce" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">실험 진행 중...</h2>
          <p className="text-sm text-green-600 font-mono mb-6">Analyzing reactions...</p>
          {/* KOR: 반응 단계 표시 / ENG: Show reaction steps */}
          <div className="space-y-3">
            {['재료 혼합 중 / Mixing ingredients...', '반응 분석 중 / Analyzing reactions...', '결과 도출 중 / Generating results...'].map(
              (msg, i) => (
                <div key={i} className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-2">
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                  <span className="text-xs text-gray-600">{msg}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // KOR: 결과 화면 렌더링
  // ENG: Render results screen
  if (currentStep === 7 && result) {
    return (
      <div className="min-h-screen bg-white">
        {/* KOR: 결과 헤더 / ENG: Results header */}
        <div className="bg-linear-to-br from-green-500 to-emerald-600 px-4 pt-8 pb-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Beaker size={22} className="text-white" />
              </div>
              <div>
                <div className="text-white/80 text-xs font-mono">EXPERIMENT COMPLETE</div>
                <div className="text-white font-bold">실험 결과 레시피</div>
              </div>
            </div>
            <h1 className="text-2xl font-black text-white mb-2">
              {result.pathways.length}가지 비자 경로 발견!
            </h1>
            <p className="text-green-100 text-sm">
              입력하신 재료를 바탕으로 최적의 비자 레시피를 찾았습니다.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 -mt-6 pb-12">
          {/* KOR: 사용된 재료 요약 카드 / ENG: Used ingredients summary card */}
          <div className="bg-white rounded-2xl border-2 border-green-200 shadow-lg mb-6 overflow-hidden">
            <div className="bg-green-50 px-4 py-3 border-b border-green-100">
              <div className="flex items-center gap-2">
                <TestTube size={16} className="text-green-600" />
                <span className="text-sm font-bold text-green-700">사용된 재료 / Ingredients Used</span>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { label: '국적 / Nationality', value: result.userInput.nationality, icon: '🌍' },
                { label: '나이 / Age', value: `${result.userInput.age}세`, icon: '🧪' },
                { label: '학력 / Education', value: result.userInput.educationLevel, icon: '📚' },
                { label: '자금 / Budget', value: result.userInput.availableAnnualFund, icon: '💰' },
                { label: '목표 / Goal', value: result.userInput.finalGoal, icon: '🎯' },
                { label: '우선순위 / Priority', value: result.userInput.priorityPreference, icon: '⚡' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-semibold text-gray-800 leading-tight">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KOR: 경로 레시피 카드 목록 / ENG: Pathway recipe card list */}
          <div className="space-y-4">
            {result.pathways.map((pathway, idx) => (
              <RecipeCard
                key={pathway.id}
                pathway={pathway}
                rank={idx + 1}
                isExpanded={expandedPathway === pathway.id}
                onToggle={() => setExpandedPathway(expandedPathway === pathway.id ? null : pathway.id)}
                getBubbleColor={getBubbleColor}
              />
            ))}
          </div>

          {/* KOR: 다시 시작 버튼 / ENG: Restart button */}
          <button
            onClick={handleReset}
            className="mt-8 w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-green-400 text-green-700 rounded-2xl font-bold hover:bg-green-50 transition-colors"
          >
            <RotateCcw size={18} />
            새 실험 시작 / New Experiment
          </button>
        </div>
      </div>
    );
  }

  // KOR: 입력 화면 렌더링
  // ENG: Render input screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* KOR: 상단 헤더 — 과학 키트 로고 / ENG: Top header — Science Kit logo */}
      <div className="bg-white border-b border-green-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
            <Atom size={20} className="text-white" />
          </div>
          <div>
            <div className="text-base font-black text-gray-800 leading-none">Visa Science Kit</div>
            <div className="text-xs text-green-600 font-mono">비자 실험 키트 v1.0</div>
          </div>
          <div className="ml-auto text-xs font-mono text-gray-400">
            Step {currentStep}/6
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 pb-24">
        {/* KOR: 재료 수집 그리드 / ENG: Ingredients collection grid */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          {STEPS.map((step) => (
            <IngredientCard
              key={step.id}
              step={step}
              isActive={currentStep === step.id}
              isCollected={
                (step.id === 1 && !!input.nationality) ||
                (step.id === 2 && input.age > 0) ||
                (step.id === 3 && !!input.educationLevel) ||
                (step.id === 4 && !!input.availableAnnualFund) ||
                (step.id === 5 && !!input.finalGoal) ||
                (step.id === 6 && !!input.priorityPreference)
              }
            />
          ))}
        </div>

        {/* KOR: 플라스크 진행 표시기 / ENG: Flask progress indicator */}
        <FlaskProgress />

        {/* KOR: 입력 카드 — 현재 재료 수집 / ENG: Input card — current ingredient collection */}
        <div className="mt-4 bg-white rounded-2xl border-2 border-green-200 shadow-sm overflow-hidden">
          {/* KOR: 재료 라벨 / ENG: Ingredient label */}
          <div className="bg-linear-to-r from-green-500 to-emerald-500 px-5 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">{STEPS[currentStep - 1]?.icon}</span>
            </div>
            <div>
              <div className="text-white/80 text-[10px] font-mono uppercase tracking-widest">
                {STEPS[currentStep - 1]?.ingredient}
              </div>
              <div className="text-white font-bold text-lg">{STEPS[currentStep - 1]?.label}</div>
            </div>
            <div className="ml-auto bg-white/20 rounded-lg px-2 py-1">
              <span className="text-white text-xs font-mono">{currentStep}/6</span>
            </div>
          </div>

          <div className="p-5">
            {/* KOR: Step 1 — 국적 선택 / ENG: Step 1 — Nationality selection */}
            {currentStep === 1 && (
              <div>
                <p className="text-sm text-gray-600 mb-4 font-mono">
                  // 실험 대상 국적을 선택하세요 / Select experiment subject nationality
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {popularCountries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => updateInput('nationality', c.name)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        input.nationality === c.name
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-sm shadow-green-200'
                          : 'border-gray-200 hover:border-green-300 text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{c.flag}</span>
                      <span className="text-xs truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: Step 2 — 나이 입력 / ENG: Step 2 — Age input */}
            {currentStep === 2 && (
              <div>
                <p className="text-sm text-gray-600 mb-4 font-mono">
                  // 실험 대상 나이를 측정하세요 / Measure experiment subject age
                </p>
                {/* KOR: 빠른 선택 버튼 / ENG: Quick select buttons */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[20, 25, 28, 30, 33, 35, 40, 45].map((age) => (
                    <button
                      key={age}
                      onClick={() => {
                        updateInput('age', age);
                        setCustomAge(String(age));
                      }}
                      className={`py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                        input.age === age
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-sm shadow-green-200'
                          : 'border-gray-200 hover:border-green-300 text-gray-700'
                      }`}
                    >
                      {age}세
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <TestTube size={18} className="text-green-500 shrink-0" />
                  <input
                    type="number"
                    min={15}
                    max={99}
                    placeholder="직접 입력 / Enter age"
                    value={customAge}
                    onChange={(e) => {
                      setCustomAge(e.target.value);
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v) && v > 0) updateInput('age', v);
                    }}
                    className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-sm outline-none font-mono"
                  />
                  <span className="text-sm text-gray-500">세 / years</span>
                </div>
              </div>
            )}

            {/* KOR: Step 3 — 학력 선택 / ENG: Step 3 — Education selection */}
            {currentStep === 3 && (
              <div>
                <p className="text-sm text-gray-600 mb-4 font-mono">
                  // 교육 촉매제를 선택하세요 / Select education catalyst
                </p>
                <div className="space-y-2">
                  {educationOptions.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => updateInput('educationLevel', opt)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                        input.educationLevel === opt
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-sm shadow-green-200'
                          : 'border-gray-200 hover:border-green-300 text-gray-700'
                      }`}
                    >
                      <span className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-xs font-bold text-green-600 shrink-0">
                        {['HS', 'AS', 'BS', 'MS', 'PhD'][i]}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: Step 4 — 자금 선택 / ENG: Step 4 — Budget selection */}
            {currentStep === 4 && (
              <div>
                <p className="text-sm text-gray-600 mb-4 font-mono">
                  // 용매(자금) 농도를 설정하세요 / Set solvent (budget) concentration
                </p>
                <div className="space-y-2">
                  {fundOptions.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => updateInput('availableAnnualFund', opt)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                        input.availableAnnualFund === opt
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-sm shadow-green-200'
                          : 'border-gray-200 hover:border-green-300 text-gray-700'
                      }`}
                    >
                      <span className="text-green-500 shrink-0">
                        <DollarSign size={18} />
                      </span>
                      <span className="font-mono">{opt}</span>
                      {/* KOR: 농도 표시 바 / ENG: Concentration display bar */}
                      <div className="ml-auto flex gap-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div
                            key={j}
                            className={`w-3 h-3 rounded-sm ${
                              j <= i ? 'bg-green-400' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: Step 5 — 목표 선택 / ENG: Step 5 — Goal selection */}
            {currentStep === 5 && (
              <div>
                <p className="text-sm text-gray-600 mb-4 font-mono">
                  // 목표 화합물을 선택하세요 / Select target compound
                </p>
                <div className="space-y-2">
                  {goalOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateInput('finalGoal', opt)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                        input.finalGoal === opt
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-sm shadow-green-200'
                          : 'border-gray-200 hover:border-green-300 text-gray-700'
                      }`}
                    >
                      <Target size={18} className={`shrink-0 ${input.finalGoal === opt ? 'text-green-500' : 'text-gray-400'}`} />
                      {opt}
                      {input.finalGoal === opt && (
                        <Check size={16} className="ml-auto text-green-500" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: Step 6 — 우선순위 선택 / ENG: Step 6 — Priority selection */}
            {currentStep === 6 && (
              <div>
                <p className="text-sm text-gray-600 mb-4 font-mono">
                  // 반응 활성화제를 선택하세요 / Select reaction activator
                </p>
                <div className="space-y-2">
                  {priorityOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateInput('priorityPreference', opt)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                        input.priorityPreference === opt
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-sm shadow-green-200'
                          : 'border-gray-200 hover:border-green-300 text-gray-700'
                      }`}
                    >
                      <Zap size={18} className={`shrink-0 ${input.priorityPreference === opt ? 'text-green-500' : 'text-gray-400'}`} />
                      {opt}
                      {input.priorityPreference === opt && (
                        <Check size={16} className="ml-auto text-green-500" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>

                {/* KOR: 마지막 단계 — 실험 시작 예고 / ENG: Final step — Experiment start preview */}
                {input.priorityPreference && (
                  <div className="mt-4 bg-green-50 rounded-xl border border-green-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FlaskConical size={18} className="text-green-600" />
                      <span className="text-sm font-bold text-green-700">모든 재료 수집 완료!</span>
                    </div>
                    <p className="text-xs text-green-600">
                      6가지 재료가 준비되었습니다. "실험 시작" 버튼을 눌러 비자 반응을 분석하세요.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KOR: 하단 네비게이션 버튼 / ENG: Bottom navigation buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 px-4 py-3 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              <ChevronRight size={16} className="rotate-180" />
              이전
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              isCurrentStepValid()
                ? 'bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === 6 ? (
              <>
                <Play size={16} />
                실험 시작 / Start Experiment
              </>
            ) : (
              <>
                재료 수집 / Collect Ingredient
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// KOR: 레시피 카드 컴포넌트 — 비자 경로를 과학 레시피 스타일로 표시
// ENG: Recipe card component — display visa pathway as science recipe style
function RecipeCard({
  pathway,
  rank,
  isExpanded,
  onToggle,
  getBubbleColor,
}: {
  pathway: RecommendedPathway;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
  getBubbleColor: (score: number) => string;
}) {
  return (
    <div className="bg-white rounded-2xl border-2 border-green-100 shadow-sm overflow-hidden">
      {/* KOR: 카드 헤더 / ENG: Card header */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors"
      >
        {/* KOR: 순위 버블 / ENG: Rank bubble */}
        <div
          className={`w-12 h-12 rounded-2xl bg-linear-to-br ${getBubbleColor(pathway.feasibilityScore)} flex flex-col items-center justify-center shrink-0 shadow-sm`}
        >
          <span className="text-white text-xs font-bold leading-none">#{rank}</span>
          <span className="text-white text-sm font-black leading-none">{pathway.feasibilityScore}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{getFeasibilityEmoji(pathway.feasibilityLabel)}</span>
            <span className="text-xs font-semibold text-green-600 bg-green-50 rounded-full px-2 py-0.5">
              {pathway.feasibilityLabel}
            </span>
          </div>
          <h3 className="font-bold text-gray-800 text-sm leading-tight">{pathway.name}</h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              {pathway.totalDurationMonths}개월
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <DollarSign size={12} />
              ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="shrink-0 text-gray-400">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* KOR: 비자 체인 — 반응 시각화 / ENG: Visa chain — reaction visualization */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
            <React.Fragment key={i}>
              <div className="shrink-0 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-center">
                <div className="text-xs font-black text-green-700">{v.visa}</div>
                <div className="text-[10px] text-gray-500 whitespace-nowrap">{v.duration}</div>
              </div>
              {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                <ArrowRight size={14} className="text-green-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* KOR: 확장 상세 내용 / ENG: Expanded detail content */}
      {isExpanded && (
        <div className="border-t border-green-50 px-5 py-4 bg-gray-50">
          {/* KOR: 설명 / ENG: Description */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{pathway.description}</p>

          {/* KOR: 마일스톤 — 실험 단계 / ENG: Milestones — experiment steps */}
          <div className="mb-1">
            <div className="flex items-center gap-2 mb-3">
              <Layers size={14} className="text-green-600" />
              <span className="text-xs font-bold text-gray-700">실험 단계 / Experiment Steps</span>
            </div>
            <div className="space-y-2">
              {pathway.milestones.map((m, i) => (
                <div key={i} className="flex gap-3 bg-white rounded-xl p-3 border border-green-100">
                  <div className="shrink-0 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-base shadow-sm shadow-green-200">
                    {m.emoji}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800 mb-0.5">
                      <span className="text-green-500 mr-1 font-mono">0{i + 1}.</span>
                      {m.title}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
