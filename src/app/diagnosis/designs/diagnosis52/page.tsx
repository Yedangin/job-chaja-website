'use client';

// 플래시카드 비자 진단 페이지 / Flashcard visa diagnosis page
// Design #52: 단어장 플래시카드처럼 뒤집으며 정보를 입력하는 UX
// Reference: Anki, Quizlet, Brainscape, Memrise, Duolingo
// Color theme: Quizlet 블루+화이트

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
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  BookOpen,
  Target,
  Zap,
  Award,
  Clock,
  DollarSign,
  TrendingUp,
  BarChart2,
  RefreshCw,
  Home,
  Layers,
} from 'lucide-react';

// ============================================================
// 카드 스텝 타입 / Card step type definition
// ============================================================
type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

const STEPS: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'];

// 각 스텝의 메타데이터 / Metadata for each step
const STEP_META: Record<Step, { titleKo: string; titleEn: string; emoji: string; hintKo: string; hintEn: string }> = {
  nationality: {
    titleKo: '어느 나라에서 오셨나요?',
    titleEn: 'Where are you from?',
    emoji: '🌏',
    hintKo: '국적을 선택하면 비자 매칭이 달라져요',
    hintEn: 'Your nationality affects visa matching',
  },
  age: {
    titleKo: '나이가 어떻게 되세요?',
    titleEn: 'How old are you?',
    emoji: '🎂',
    hintKo: '비자 종류에 따라 연령 제한이 있어요',
    hintEn: 'Some visas have age restrictions',
  },
  educationLevel: {
    titleKo: '최종 학력은 무엇인가요?',
    titleEn: 'What is your education level?',
    emoji: '🎓',
    hintKo: '학력이 높을수록 더 많은 비자 경로가 열려요',
    hintEn: 'Higher education opens more visa pathways',
  },
  availableAnnualFund: {
    titleKo: '연간 준비 가능한 자금은?',
    titleEn: 'What is your annual budget?',
    emoji: '💰',
    hintKo: '어학원, 생활비, 수수료 등 모든 비용 포함',
    hintEn: 'Include tuition, living costs, and fees',
  },
  finalGoal: {
    titleKo: '한국에서의 최종 목표는?',
    titleEn: 'What is your final goal in Korea?',
    emoji: '🎯',
    hintKo: '목표에 따라 최적의 비자 경로를 추천해요',
    hintEn: 'Your goal determines the best visa route',
  },
  priorityPreference: {
    titleKo: '가장 중요한 것은 무엇인가요?',
    titleEn: 'What is most important to you?',
    emoji: '⚡',
    hintKo: '우선순위에 맞게 경로를 정렬해드려요',
    hintEn: 'We sort pathways by your priority',
  },
};

// ============================================================
// 자신감 레벨 타입 / Confidence level type
// ============================================================
type ConfidenceLevel = 'again' | 'hard' | 'good' | 'easy';

const CONFIDENCE_LABELS: Record<ConfidenceLevel, { ko: string; en: string; color: string; bg: string }> = {
  again: { ko: '다시', en: 'Again', color: 'text-red-600', bg: 'bg-red-50 border-red-200 hover:bg-red-100' },
  hard: { ko: '어려움', en: 'Hard', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200 hover:bg-orange-100' },
  good: { ko: '보통', en: 'Good', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
  easy: { ko: '쉬움', en: 'Easy', color: 'text-green-600', bg: 'bg-green-50 border-green-200 hover:bg-green-100' },
};

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function Diagnosis52Page() {
  // 현재 스텝 인덱스 / Current step index
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // 카드 뒤집힘 상태 / Card flip state
  const [isFlipped, setIsFlipped] = useState(false);
  // 입력 데이터 / Input data
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // 나이 입력 임시 값 / Temporary age input value
  const [ageInput, setAgeInput] = useState('');
  // 결과 표시 여부 / Whether to show results
  const [showResults, setShowResults] = useState(false);
  // 선택된 결과 카드 / Selected result card index
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  // 자신감 기록 / Confidence level record per step
  const [confidenceLog, setConfidenceLog] = useState<Record<string, ConfidenceLevel>>({});
  // 완료된 카드 수 / Number of completed cards
  const [completedCards, setCompletedCards] = useState(0);
  // 덱 뒤집기 애니메이션 진행 중 / Deck flip animation in progress
  const [isAnimating, setIsAnimating] = useState(false);

  const currentStep = STEPS[currentStepIndex];
  const meta = STEP_META[currentStep];
  const progress = (currentStepIndex / STEPS.length) * 100;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  // ============================================================
  // 카드 앞면 클릭 → 뒤집기 / Flip card to show back
  // ============================================================
  const handleFlipCard = () => {
    if (!isAnimating) {
      setIsFlipped(true);
    }
  };

  // ============================================================
  // 옵션 선택 처리 / Handle option selection
  // ============================================================
  const handleSelect = (key: Step, value: string | number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  // ============================================================
  // 자신감 선택 후 다음 카드 / Select confidence and go to next card
  // ============================================================
  const handleConfidence = (level: ConfidenceLevel) => {
    if (isAnimating) return;
    setConfidenceLog((prev) => ({ ...prev, [currentStep]: level }));
    setCompletedCards((prev) => prev + 1);

    if (isLastStep) {
      // 모든 카드 완료 → 결과 화면 / All cards done → show results
      setIsAnimating(true);
      setTimeout(() => {
        setShowResults(true);
        setIsAnimating(false);
      }, 400);
    } else {
      // 다음 카드로 / Next card
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        setIsFlipped(false);
        setIsAnimating(false);
      }, 400);
    }
  };

  // ============================================================
  // 이전 카드로 / Go to previous card
  // ============================================================
  const handlePrev = () => {
    if (currentStepIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev - 1);
        setIsFlipped(false);
        setIsAnimating(false);
      }, 300);
    }
  };

  // ============================================================
  // 처음부터 다시 / Restart from beginning
  // ============================================================
  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsFlipped(false);
    setInput({});
    setAgeInput('');
    setShowResults(false);
    setSelectedResult(null);
    setConfidenceLog({});
    setCompletedCards(0);
    setIsAnimating(false);
  };

  // ============================================================
  // 현재 스텝의 선택된 값 확인 / Check if current step has a value
  // ============================================================
  const hasValue = (step: Step): boolean => {
    if (step === 'age') return !!ageInput && parseInt(ageInput) > 0;
    return input[step] !== undefined;
  };

  // ============================================================
  // 자신감 평균 계산 / Calculate average confidence
  // ============================================================
  const getConfidenceStats = () => {
    const levels = Object.values(confidenceLog);
    const counts = { again: 0, hard: 0, good: 0, easy: 0 };
    levels.forEach((l) => counts[l]++);
    return counts;
  };

  // ============================================================
  // 결과 화면 / Results screen
  // ============================================================
  if (showResults) {
    const stats = getConfidenceStats();
    const pathways = mockPathways;

    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
        {/* 헤더 / Header */}
        <div className="bg-white border-b border-blue-100 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-blue-900 text-sm">잡차자 비자 진단</span>
            </div>
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>다시 시작</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* 학습 완료 배너 / Study complete banner */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center shadow-lg">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold mb-1">진단 완료!</h2>
            <p className="text-blue-100 text-sm">Study Complete</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {/* 완료 카드 수 / Cards completed */}
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-2xl font-bold">{completedCards}</div>
                <div className="text-xs text-blue-100 mt-0.5">완료 카드</div>
              </div>
              {/* 쉬운 항목 / Easy items */}
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-2xl font-bold text-green-300">{stats.easy + stats.good}</div>
                <div className="text-xs text-blue-100 mt-0.5">이해 완료</div>
              </div>
              {/* 추천 경로 / Recommended pathways */}
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-2xl font-bold text-yellow-300">{pathways.length}</div>
                <div className="text-xs text-blue-100 mt-0.5">추천 경로</div>
              </div>
            </div>
          </div>

          {/* 자신감 레벨 통계 / Confidence level statistics */}
          <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              <span>학습 통계 · Study Stats</span>
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(stats) as [ConfidenceLevel, number][]).map(([level, count]) => (
                <div key={level} className="text-center">
                  <div className={`text-lg font-bold ${CONFIDENCE_LABELS[level].color}`}>{count}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{CONFIDENCE_LABELS[level].ko}</div>
                  {/* 막대 그래프 / Bar chart */}
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        level === 'easy' ? 'bg-green-400' :
                        level === 'good' ? 'bg-blue-400' :
                        level === 'hard' ? 'bg-orange-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${(count / STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 결과 카드 덱 / Result card deck */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>추천 비자 경로 덱 · Recommended Pathway Deck</span>
              <span className="ml-auto text-sm text-gray-400 font-normal">{pathways.length}개</span>
            </h3>
            <div className="space-y-3">
              {pathways.map((pathway, idx) => (
                <button
                  key={pathway.id}
                  onClick={() => setSelectedResult(selectedResult === idx ? null : idx)}
                  className={`w-full text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                    selectedResult === idx
                      ? 'border-blue-500 shadow-md shadow-blue-100'
                      : 'border-gray-100 hover:border-blue-200 bg-white'
                  }`}
                >
                  {/* 카드 앞면 요약 / Card front summary */}
                  <div className={`p-4 ${selectedResult === idx ? 'bg-blue-50' : 'bg-white'}`}>
                    <div className="flex items-center gap-3">
                      {/* 순위 배지 / Rank badge */}
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                        idx === 1 ? 'bg-gray-100 text-gray-600' :
                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 truncate">{pathway.nameKo}</div>
                        <div className="text-xs text-gray-500 truncate">{pathway.nameEn}</div>
                      </div>
                      {/* 점수 / Score */}
                      <div className="shrink-0 text-right">
                        <div
                          className="text-xl font-black"
                          style={{ color: getScoreColor(pathway.finalScore) }}
                        >
                          {pathway.finalScore}
                        </div>
                        <div className="text-xs text-gray-400">점</div>
                      </div>
                      {/* 적합도 이모지 / Feasibility emoji */}
                      <div className="shrink-0 text-lg">
                        {getFeasibilityEmoji(pathway.feasibilityLabel)}
                      </div>
                    </div>

                    {/* 태그 요약 / Tag summary */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {pathway.estimatedMonths}개월
                      </span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {pathway.estimatedCostWon === 0 ? '무료' : `${pathway.estimatedCostWon.toLocaleString()}만원`}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {pathway.visaChainStr}
                      </span>
                    </div>
                  </div>

                  {/* 카드 뒷면 (펼침 시) / Card back (when expanded) */}
                  {selectedResult === idx && (
                    <div className="border-t border-blue-100 bg-white p-4 space-y-3">
                      {/* 점수 세부 / Score breakdown */}
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          점수 분석 · Score Breakdown
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: '기본', value: pathway.scoreBreakdown.base },
                            { label: '나이', value: `×${pathway.scoreBreakdown.ageMultiplier}` },
                            { label: '국적', value: `×${pathway.scoreBreakdown.nationalityMultiplier}` },
                            { label: '자금', value: `×${pathway.scoreBreakdown.fundMultiplier}` },
                            { label: '학력', value: `×${pathway.scoreBreakdown.educationMultiplier}` },
                            { label: '우선', value: `×${pathway.scoreBreakdown.priorityWeight}` },
                          ].map((item) => (
                            <div key={item.label} className="bg-gray-50 rounded-lg p-2 text-center">
                              <div className="text-xs text-gray-500">{item.label}</div>
                              <div className="font-bold text-gray-800 text-sm">{item.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 다음 단계 / Next steps */}
                      {pathway.nextSteps.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            다음 단계 · Next Steps
                          </div>
                          <div className="space-y-1.5">
                            {pathway.nextSteps.map((step, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <Check className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                  <span className="font-medium text-gray-800">{step.nameKo}</span>
                                  <span className="text-gray-500 ml-1 text-xs">{step.description}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 메모 / Note */}
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <div className="text-xs font-semibold text-amber-700 mb-1">📌 참고사항</div>
                        <div className="text-sm text-amber-800">{pathway.note}</div>
                      </div>

                      {/* CTA 버튼 / CTA button */}
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                        이 경로로 상담 신청하기 →
                      </button>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 하단 액션 / Bottom actions */}
          <div className="grid grid-cols-2 gap-3 pb-8">
            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 bg-white border-2 border-blue-200 text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>다시 학습</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
              <Star className="w-4 h-4" />
              <span>전문가 상담</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 진단 화면 / Diagnosis screen
  // ============================================================
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* 헤더 / Header */}
      <div className="bg-white border-b border-blue-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-blue-900 text-sm leading-tight">잡차자 비자 진단</div>
              <div className="text-xs text-blue-400">Flashcard Mode</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* 진행률 텍스트 / Progress text */}
            <span className="text-sm text-gray-500">
              {currentStepIndex + 1} / {STEPS.length}
            </span>
            <button
              onClick={handleRestart}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="처음부터 시작 / Restart"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* 진행률 바 / Progress bar */}
        <div className="h-1 bg-blue-100">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start max-w-2xl mx-auto w-full px-4 py-8 gap-6">
        {/* 스텝 도트 / Step dots */}
        <div className="flex gap-2">
          {STEPS.map((step, idx) => (
            <div
              key={step}
              className={`rounded-full transition-all duration-300 ${
                idx < currentStepIndex
                  ? 'w-2 h-2 bg-blue-600'
                  : idx === currentStepIndex
                  ? 'w-4 h-2 bg-blue-600'
                  : 'w-2 h-2 bg-blue-200'
              }`}
            />
          ))}
        </div>

        {/* 플래시카드 영역 / Flashcard area */}
        {/* 3D 카드 플립 컨테이너 / 3D card flip container */}
        <div
          className="w-full relative"
          style={{ perspective: '1000px', minHeight: '360px' }}
        >
          {/* 카드 래퍼 (3D 변환) / Card wrapper (3D transform) */}
          <div
            className="w-full relative transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: '360px',
            }}
          >
            {/* ──────────────────────────────────────
                카드 앞면 / Card front
                ────────────────────────────────────── */}
            <div
              className="absolute inset-0 w-full"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <button
                onClick={handleFlipCard}
                className="w-full bg-white rounded-3xl border-2 border-blue-100 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 p-8 flex flex-col items-center gap-4 cursor-pointer group"
                style={{ minHeight: '360px' }}
              >
                {/* 카드 유형 레이블 / Card type label */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 uppercase tracking-widest">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Question Card</span>
                </div>

                {/* 이모지 / Emoji */}
                <div className="text-6xl">{meta.emoji}</div>

                {/* 질문 / Question */}
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-black text-gray-900 leading-tight">{meta.titleKo}</h2>
                  <p className="text-sm text-gray-500">{meta.titleEn}</p>
                </div>

                {/* 힌트 / Hint */}
                <div className="bg-blue-50 rounded-2xl px-4 py-3 max-w-xs text-center">
                  <p className="text-xs text-blue-600">{meta.hintKo}</p>
                  <p className="text-xs text-blue-400 mt-0.5">{meta.hintEn}</p>
                </div>

                {/* 클릭 유도 / Click prompt */}
                <div className="flex items-center gap-2 text-sm text-blue-400 group-hover:text-blue-600 transition-colors mt-auto">
                  <RotateCcw className="w-4 h-4" />
                  <span>카드를 클릭해 답하기 · Click to answer</span>
                </div>
              </button>
            </div>

            {/* ──────────────────────────────────────
                카드 뒷면 / Card back
                ────────────────────────────────────── */}
            <div
              className="absolute inset-0 w-full"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div
                className="bg-white rounded-3xl border-2 border-blue-400 shadow-lg p-6 flex flex-col gap-4"
                style={{ minHeight: '360px' }}
              >
                {/* 뒷면 헤더 / Back header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 uppercase tracking-widest">
                    <Check className="w-3.5 h-3.5" />
                    <span>Answer Card</span>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{meta.emoji} {meta.titleKo}</span>
                </div>

                {/* 옵션 입력 영역 / Option input area */}
                <div className="flex-1 overflow-y-auto">
                  <CardInputArea
                    step={currentStep}
                    input={input}
                    ageInput={ageInput}
                    setAgeInput={setAgeInput}
                    onSelect={handleSelect}
                  />
                </div>

                {/* 선택 여부 표시 / Selection indicator */}
                {hasValue(currentStep) && (
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>선택 완료 · Selection confirmed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 자신감 레벨 버튼 (뒤집힌 후 표시) / Confidence buttons (shown after flip) */}
        {isFlipped && (
          <div className="w-full space-y-3">
            <div className="text-center text-sm text-gray-500">
              이 질문이 얼마나 어렵나요? · How difficult was this question?
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(CONFIDENCE_LABELS) as [ConfidenceLevel, typeof CONFIDENCE_LABELS[ConfidenceLevel]][]).map(
                ([level, label]) => (
                  <button
                    key={level}
                    onClick={() => {
                      if (hasValue(currentStep)) {
                        handleConfidence(level);
                      }
                    }}
                    disabled={!hasValue(currentStep) || isAnimating}
                    className={`py-2.5 px-2 rounded-xl border-2 text-sm font-bold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${label.bg} ${label.color}`}
                  >
                    <div>{label.ko}</div>
                    <div className="text-xs font-normal opacity-70">{label.en}</div>
                  </button>
                )
              )}
            </div>
            {!hasValue(currentStep) && (
              <p className="text-center text-xs text-amber-600">
                ⚠️ 먼저 옵션을 선택해주세요 · Please select an option first
              </p>
            )}
          </div>
        )}

        {/* 네비게이션 / Navigation */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0 || isAnimating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전</span>
          </button>

          {/* 중앙 스텝 이름 / Center step name */}
          <div className="text-xs text-gray-400 text-center">
            <div className="font-medium">{meta.titleKo}</div>
          </div>

          {/* 스킵 버튼 (뒤집힌 상태에서만) / Skip button (only when flipped) */}
          {isFlipped && !isLastStep && (
            <button
              onClick={() => handleConfidence('again')}
              disabled={isAnimating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors text-sm"
            >
              <span>건너뛰기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          {(!isFlipped || isLastStep) && (
            <div className="w-20" />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 카드 입력 영역 컴포넌트 / Card input area component
// 각 스텝에 맞는 입력 UI를 렌더링
// ============================================================
function CardInputArea({
  step,
  input,
  ageInput,
  setAgeInput,
  onSelect,
}: {
  step: Step;
  input: Partial<DiagnosisInput>;
  ageInput: string;
  setAgeInput: (v: string) => void;
  onSelect: (key: Step, value: string | number) => void;
}) {
  // ── 국적 선택 / Nationality selection ──
  if (step === 'nationality') {
    return (
      <div className="grid grid-cols-3 gap-2">
        {popularCountries.map((c) => (
          <button
            key={c.code}
            onClick={() => onSelect('nationality', c.code)}
            className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 transition-all duration-150 text-xs font-medium ${
              input.nationality === c.code
                ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm'
                : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-blue-200 hover:bg-blue-50'
            }`}
          >
            <span className="text-xl">{c.flag}</span>
            <span className="leading-tight text-center">{c.nameKo}</span>
          </button>
        ))}
      </div>
    );
  }

  // ── 나이 입력 / Age input ──
  if (step === 'age') {
    return (
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="text-sm text-gray-500">나이를 입력해주세요 · Enter your age</div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const v = Math.max(16, (parseInt(ageInput) || 20) - 1);
              setAgeInput(String(v));
              onSelect('age', v);
            }}
            className="w-10 h-10 rounded-full border-2 border-blue-200 text-blue-600 text-xl font-bold hover:bg-blue-50 transition-colors"
          >
            −
          </button>
          <input
            type="number"
            min="16"
            max="65"
            value={ageInput}
            onChange={(e) => {
              setAgeInput(e.target.value);
              if (e.target.value) onSelect('age', parseInt(e.target.value));
            }}
            className="w-24 text-center text-3xl font-black text-blue-700 border-b-4 border-blue-400 outline-none bg-transparent py-1"
            placeholder="24"
          />
          <button
            onClick={() => {
              const v = Math.min(65, (parseInt(ageInput) || 20) + 1);
              setAgeInput(String(v));
              onSelect('age', v);
            }}
            className="w-10 h-10 rounded-full border-2 border-blue-200 text-blue-600 text-xl font-bold hover:bg-blue-50 transition-colors"
          >
            +
          </button>
        </div>
        <div className="text-lg text-gray-400">세 · years old</div>
        {/* 빠른 선택 / Quick select */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[18, 20, 22, 24, 26, 28, 30, 35].map((a) => (
            <button
              key={a}
              onClick={() => {
                setAgeInput(String(a));
                onSelect('age', a);
              }}
              className={`px-3 py-1 rounded-full text-sm border-2 transition-all ${
                parseInt(ageInput) === a
                  ? 'border-blue-500 bg-blue-600 text-white font-bold'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── 학력 선택 / Education level selection ──
  if (step === 'educationLevel') {
    return (
      <div className="space-y-2">
        {educationOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect('educationLevel', opt.value)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150 text-left ${
              input.educationLevel === opt.value
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50'
            }`}
          >
            <span className="text-xl shrink-0">{opt.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className={`font-bold text-sm ${input.educationLevel === opt.value ? 'text-blue-800' : 'text-gray-800'}`}>
                {opt.labelKo}
              </div>
              <div className="text-xs text-gray-500">{opt.labelEn}</div>
            </div>
            {input.educationLevel === opt.value && (
              <Check className="w-4 h-4 text-blue-600 shrink-0" />
            )}
          </button>
        ))}
      </div>
    );
  }

  // ── 자금 선택 / Fund selection ──
  if (step === 'availableAnnualFund') {
    return (
      <div className="space-y-2">
        {fundOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect('availableAnnualFund', opt.value)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150 text-left ${
              input.availableAnnualFund === opt.value
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50'
            }`}
          >
            <DollarSign className={`w-5 h-5 shrink-0 ${input.availableAnnualFund === opt.value ? 'text-blue-600' : 'text-gray-400'}`} />
            <div className="flex-1 min-w-0">
              <div className={`font-bold text-sm ${input.availableAnnualFund === opt.value ? 'text-blue-800' : 'text-gray-800'}`}>
                {opt.labelKo}
              </div>
              <div className="text-xs text-gray-500">{opt.labelEn}</div>
            </div>
            {input.availableAnnualFund === opt.value && (
              <Check className="w-4 h-4 text-blue-600 shrink-0" />
            )}
          </button>
        ))}
      </div>
    );
  }

  // ── 목표 선택 / Goal selection ──
  if (step === 'finalGoal') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {goalOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect('finalGoal', opt.value)}
            className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all duration-150 ${
              input.finalGoal === opt.value
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50'
            }`}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <div className="text-center">
              <div className={`font-bold text-sm ${input.finalGoal === opt.value ? 'text-blue-800' : 'text-gray-800'}`}>
                {opt.labelKo}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{opt.labelEn}</div>
              <div className="text-xs text-gray-400 mt-1 leading-tight">{opt.descKo}</div>
            </div>
            {input.finalGoal === opt.value && (
              <Check className="w-4 h-4 text-blue-600" />
            )}
          </button>
        ))}
      </div>
    );
  }

  // ── 우선순위 선택 / Priority selection ──
  if (step === 'priorityPreference') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {priorityOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect('priorityPreference', opt.value)}
            className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all duration-150 ${
              input.priorityPreference === opt.value
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50'
            }`}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <div className="text-center">
              <div className={`font-bold text-sm ${input.priorityPreference === opt.value ? 'text-blue-800' : 'text-gray-800'}`}>
                {opt.labelKo}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{opt.labelEn}</div>
              <div className="text-xs text-gray-400 mt-1 leading-tight">{opt.descKo}</div>
            </div>
            {input.priorityPreference === opt.value && (
              <Check className="w-4 h-4 text-blue-600" />
            )}
          </button>
        ))}
      </div>
    );
  }

  return null;
}
