'use client';
// KOR: 디자인 #62 - 매칭 앱 (Tinder/Bumble 스타일 비자 스와이프 UI)
// ENG: Design #62 - Matching App (Tinder/Bumble style visa swipe UI)

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
  Heart,
  X,
  Star,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Clock,
  DollarSign,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Zap,
  Flame,
} from 'lucide-react';

// KOR: 진행 단계 정의
// ENG: Step definition for the multi-step form
type Step = 'nationality' | 'age' | 'education' | 'fund' | 'goal' | 'priority' | 'matching' | 'result';

// KOR: 스와이프 방향 타입
// ENG: Swipe direction type
type SwipeDir = 'left' | 'right' | 'super';

// KOR: 매칭 팝업 상태 타입
// ENG: Match popup state type
interface MatchState {
  visible: boolean;
  pathway: CompatPathway | null;
}

// KOR: 카드 그라데이션 색상 (점수 기반) / ENG: Card gradient by score
const getCardGradient = (score: number): string =>
  score >= 50 ? 'from-pink-400 via-rose-400 to-red-300'
  : score >= 20 ? 'from-purple-400 via-pink-400 to-rose-300'
  : 'from-indigo-400 via-purple-400 to-pink-300';

// KOR: 호환도 퍼센트 (점수 기반) / ENG: Compatibility percent by score
const getCompatPercent = (score: number): number => Math.min(Math.round((score / 60) * 99), 99);

// KOR: 마일스톤 타입별 이모지 / ENG: Milestone type emoji
const getMilestoneEmoji = (type: string): string =>
  type === 'entry' ? '✈️' : type === 'final_goal' ? '🎉' : type === 'graduation' ? '🎓' : '📍';

export default function Diagnosis62Page() {
  // KOR: 현재 단계 상태 / ENG: Current step state
  const [step, setStep] = useState<Step>('nationality');

  // KOR: 사용자 입력 데이터 / ENG: User input data
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 현재 카드 인덱스 / ENG: Current card index
  const [cardIndex, setCardIndex] = useState(0);

  // KOR: 스와이프 애니메이션 상태 / ENG: Swipe animation state
  const [swipeAnim, setSwipeAnim] = useState<SwipeDir | null>(null);

  // KOR: 매칭 팝업 상태 / ENG: Match popup state
  const [matchState, setMatchState] = useState<MatchState>({ visible: false, pathway: null });

  // KOR: 수퍼라이크 남은 횟수 / ENG: Remaining super likes count
  const [superLikes, setSuperLikes] = useState(3);

  // KOR: 좋아요한 비자 경로 목록 / ENG: Liked visa pathway list
  const [likedPathways, setLikedPathways] = useState<CompatPathway[]>([]);

  // KOR: 결과 데이터는 designs/_mock에서 가져온 호환 경로 배열 사용
  // ENG: Result data uses compatible pathway array from designs/_mock
  const pathways: CompatPathway[] = mockPathways;

  // KOR: 현재 표시 중인 카드 / ENG: Current displayed card
  const currentPathway = pathways[cardIndex] ?? null;
  const nextPathway = pathways[cardIndex + 1] ?? null;

  // KOR: 단계 배열 (입력 단계만) / ENG: Input step array
  const inputSteps: Step[] = ['nationality', 'age', 'education', 'fund', 'goal', 'priority'];
  const stepNum = inputSteps.indexOf(step as Step) + 1;

  // KOR: 다음 단계로 / ENG: Go to next step
  const nextStep = () => {
    const cur = inputSteps.indexOf(step as Step);
    if (cur < inputSteps.length - 1) setStep(inputSteps[cur + 1]);
    else setStep('matching');
  };

  // KOR: 이전 단계로 / ENG: Go to previous step
  const prevStep = () => {
    const cur = inputSteps.indexOf(step as Step);
    if (cur > 0) setStep(inputSteps[cur - 1]);
  };

  // KOR: 스와이프 처리 / ENG: Swipe handler
  const handleSwipe = (dir: SwipeDir) => {
    if (!currentPathway) return;
    if (dir === 'super' && superLikes <= 0) return;

    setSwipeAnim(dir);

    if (dir === 'right' || dir === 'super') {
      if (dir === 'super') setSuperLikes((prev) => prev - 1);
      setLikedPathways((prev) => [...prev, currentPathway]);
      setTimeout(() => {
        setSwipeAnim(null);
        setMatchState({ visible: true, pathway: currentPathway });
        setCardIndex((prev) => prev + 1);
      }, 400);
    } else {
      setTimeout(() => {
        setSwipeAnim(null);
        setCardIndex((prev) => prev + 1);
      }, 400);
    }
  };

  // KOR: 매칭 팝업 닫기 / ENG: Close match popup
  const closeMatch = () => setMatchState({ visible: false, pathway: null });

  // KOR: 매칭 팝업 컴포넌트 / ENG: Match popup component
  const MatchPopup = () => {
    if (!matchState.visible || !matchState.pathway) return null;
    const pw = matchState.pathway;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
        <div className="w-full max-w-sm rounded-3xl bg-linear-to-br from-pink-500 via-rose-500 to-red-400 p-1 shadow-2xl">
          <div className="rounded-3xl bg-white p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-linear-to-br from-pink-400 to-rose-500 shadow-lg">
                <Heart className="h-10 w-10 fill-white text-white" />
              </div>
            </div>
            <div className="mb-1 text-2xl font-black text-gray-900">매칭되었습니다! 🎉</div>
            <div className="mb-3 text-sm font-semibold text-pink-500">It&apos;s a Match!</div>
            <div className="mb-5 text-base font-bold text-gray-800">{pw.nameKo}</div>
            <div className="mb-6 flex items-center justify-center gap-2 rounded-2xl bg-pink-50 px-6 py-4">
              <Sparkles className="h-5 w-5 text-pink-400" />
              <span className="text-lg font-black text-pink-600">{getCompatPercent(pw.finalScore)}% 호환</span>
            </div>
            <div className="flex gap-3">
              <button onClick={closeMatch} className="flex-1 rounded-2xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50">
                계속 탐색
              </button>
              <button onClick={() => { closeMatch(); setStep('result'); }} className="flex-1 rounded-2xl bg-linear-to-r from-pink-500 to-rose-500 py-3 text-sm font-bold text-white shadow-md hover:opacity-90">
                상세 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // KOR: 입력 단계 공통 래퍼 / ENG: Input step wrapper
  const StepWrapper = ({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) => (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-pink-50 via-rose-50 to-white">
      <div className="bg-linear-to-r from-pink-500 to-rose-500 px-6 pb-8 pt-12 text-white">
        <div className="mb-6 flex items-center gap-3">
          {stepNum > 1 && (
            <button onClick={prevStep} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30">
              <ArrowLeft className="h-4 w-4 text-white" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-white text-white" />
            <span className="text-sm font-bold uppercase tracking-wider opacity-90">JobChaJa Match</span>
          </div>
        </div>
        <div className="mb-3 flex gap-1">
          {inputSteps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < stepNum ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </div>
        <div className="text-xs font-semibold opacity-75">{stepNum} / {inputSteps.length}</div>
        <h1 className="mt-2 text-2xl font-black leading-tight">{title}</h1>
        <p className="mt-1 text-sm opacity-80">{subtitle}</p>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
    </div>
  );

  // KOR: Step 1 - 국적 선택 / ENG: Step 1 - Nationality selection
  if (step === 'nationality') {
    return (
      <StepWrapper title="어느 나라에서 오셨나요?" subtitle="국적을 선택하면 맞춤 비자를 찾아드려요 💕">
        <div className="grid grid-cols-3 gap-3">
          {popularCountries.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                setInput((p) => ({ ...p, nationality: c.code }));
                nextStep();
              }}
              className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all duration-200 ${
                input.nationality === c.code
                  ? 'border-pink-400 bg-pink-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-pink-200 hover:shadow-sm'
              }`}
            >
              <span className="text-3xl">{c.flag}</span>
              <span className="text-xs font-semibold text-gray-700">{c.nameKo}</span>
            </button>
          ))}
        </div>
        {input.nationality && (
          <button
            onClick={nextStep}
            className="mt-2 w-full rounded-2xl bg-linear-to-r from-pink-500 to-rose-500 py-4 text-base font-black text-white shadow-lg hover:opacity-90"
          >
            다음 →
          </button>
        )}
      </StepWrapper>
    );
  }

  // KOR: Step 2 - 나이 입력 / ENG: Step 2 - Age input
  if (step === 'age') {
    const age = input.age ?? 25;
    return (
      <StepWrapper title="나이를 알려주세요" subtitle="나이에 따라 적합한 비자가 달라져요 🎂">
        <div className="flex flex-col items-center gap-8 py-8">
          {/* KOR: 나이 원형 디스플레이 / ENG: Age circular display */}
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-linear-to-br from-pink-400 to-rose-500 shadow-2xl">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white">
              <span className="text-5xl font-black text-pink-500">{age}</span>
            </div>
          </div>
          {/* KOR: 나이 슬라이더 / ENG: Age slider */}
          <div className="w-full">
            <input
              type="range"
              min={18}
              max={60}
              value={age}
              onChange={(e) => setInput((p) => ({ ...p, age: Number(e.target.value) }))}
              className="w-full accent-pink-500"
            />
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>18세</span>
              <span>60세</span>
            </div>
          </div>
          {/* KOR: 빠른 나이 선택 / ENG: Quick age selection */}
          <div className="flex w-full gap-2">
            {[20, 25, 30, 35, 40].map((a) => (
              <button
                key={a}
                onClick={() => setInput((p) => ({ ...p, age: a }))}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                  age === a ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                }`}
              >
                {a}대
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={nextStep}
          className="w-full rounded-2xl bg-linear-to-r from-pink-500 to-rose-500 py-4 text-base font-black text-white shadow-lg hover:opacity-90"
        >
          다음 →
        </button>
      </StepWrapper>
    );
  }

  // KOR: Step 3 - 학력 선택 / ENG: Step 3 - Education selection
  if (step === 'education') {
    return (
      <StepWrapper title="학력을 알려주세요" subtitle="학력이 비자 매칭에 중요한 역할을 해요 📖">
        <div className="flex flex-col gap-3">
          {educationOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setInput((p) => ({ ...p, educationLevel: opt.value }))}
              className={`flex items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200 ${
                input.educationLevel === opt.value
                  ? 'border-pink-400 bg-linear-to-r from-pink-50 to-rose-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-pink-200'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-sm font-bold text-gray-800">{opt.labelKo}</span>
              {input.educationLevel === opt.value && (
                <CheckCircle className="ml-auto h-5 w-5 text-pink-500" />
              )}
            </button>
          ))}
        </div>
        {input.educationLevel && (
          <button
            onClick={nextStep}
            className="mt-2 w-full rounded-2xl bg-linear-to-r from-pink-500 to-rose-500 py-4 text-base font-black text-white shadow-lg hover:opacity-90"
          >
            다음 →
          </button>
        )}
      </StepWrapper>
    );
  }

  // KOR: Step 4 - 자금 선택 / ENG: Step 4 - Fund selection
  if (step === 'fund') {
    return (
      <StepWrapper title="연간 가용 자금은?" subtitle="예산에 맞는 최적의 비자 경로를 찾아드려요 💸">
        <div className="flex flex-col gap-3">
          {fundOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setInput((p) => ({ ...p, availableAnnualFund: opt.value }))}
              className={`flex items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200 ${
                input.availableAnnualFund === opt.value
                  ? 'border-pink-400 bg-linear-to-r from-pink-50 to-rose-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-pink-200'
              }`}
            >
              <span className="text-2xl">💰</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-black text-gray-800">{opt.labelKo}</span>
                <span className="text-xs text-gray-400">{opt.labelEn}</span>
              </div>
              {input.availableAnnualFund === opt.value && (
                <CheckCircle className="ml-auto h-5 w-5 text-pink-500" />
              )}
            </button>
          ))}
        </div>
        {input.availableAnnualFund !== undefined && (
          <button
            onClick={nextStep}
            className="mt-2 w-full rounded-2xl bg-linear-to-r from-pink-500 to-rose-500 py-4 text-base font-black text-white shadow-lg hover:opacity-90"
          >
            다음 →
          </button>
        )}
      </StepWrapper>
    );
  }

  // KOR: Step 5 - 최종 목표 선택 / ENG: Step 5 - Final goal selection
  if (step === 'goal') {
    return (
      <StepWrapper title="한국에서의 목표는?" subtitle="목표에 딱 맞는 비자를 매칭해 드려요 🎯">
        <div className="flex flex-col gap-3">
          {goalOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setInput((p) => ({ ...p, finalGoal: opt.value }))}
              className={`flex items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200 ${
                input.finalGoal === opt.value
                  ? 'border-pink-400 bg-linear-to-r from-pink-50 to-rose-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-pink-200'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-gray-800">{opt.labelKo}</span>
                <span className="text-xs text-gray-500">{opt.descKo}</span>
              </div>
              {input.finalGoal === opt.value && (
                <CheckCircle className="ml-auto h-5 w-5 shrink-0 text-pink-500" />
              )}
            </button>
          ))}
        </div>
        {input.finalGoal && (
          <button
            onClick={nextStep}
            className="mt-2 w-full rounded-2xl bg-linear-to-r from-pink-500 to-rose-500 py-4 text-base font-black text-white shadow-lg hover:opacity-90"
          >
            다음 →
          </button>
        )}
      </StepWrapper>
    );
  }

  // KOR: Step 6 - 우선순위 선택 / ENG: Step 6 - Priority selection
  if (step === 'priority') {
    return (
      <StepWrapper title="가장 중요한 것은?" subtitle="당신의 우선순위에 맞게 비자를 정렬해 드려요 💫">
        <div className="flex flex-col gap-3">
          {priorityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setInput((p) => ({ ...p, priorityPreference: opt.value }))}
              className={`flex items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200 ${
                input.priorityPreference === opt.value
                  ? 'border-pink-400 bg-linear-to-r from-pink-50 to-rose-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-pink-200'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-gray-800">{opt.labelKo}</span>
                <span className="text-xs text-gray-500">{opt.descKo}</span>
              </div>
              {input.priorityPreference === opt.value && (
                <CheckCircle className="ml-auto h-5 w-5 shrink-0 text-pink-500" />
              )}
            </button>
          ))}
        </div>
        {input.priorityPreference && (
          <button
            onClick={nextStep}
            className="mt-2 w-full rounded-2xl bg-linear-to-r from-pink-500 to-rose-500 py-4 text-base font-black text-white shadow-lg hover:opacity-90"
          >
            매칭 시작! 💕
          </button>
        )}
      </StepWrapper>
    );
  }

  // KOR: 매칭 화면 (스와이프 카드) / ENG: Matching screen (swipe cards)
  if (step === 'matching') {
    const allDone = cardIndex >= pathways.length;

    return (
      <div className="flex min-h-screen flex-col bg-linear-to-br from-pink-50 via-rose-50 to-white">
        <MatchPopup />

        {/* KOR: 헤더 / ENG: Header */}
        <div className="bg-linear-to-r from-pink-500 to-rose-500 px-6 pb-4 pt-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep('priority')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
            >
              <ArrowLeft className="h-4 w-4 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-200" />
              <span className="text-sm font-black text-white">비자 매칭</span>
            </div>
            {/* KOR: 수퍼라이크 잔여 표시 / ENG: Super like remaining display */}
            <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
              <Star className="h-3 w-3 text-yellow-200" />
              <span className="text-xs font-bold text-white">{superLikes}</span>
            </div>
          </div>
          {/* KOR: 매칭 진행률 / ENG: Matching progress */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-white/20">
              <div
                className="h-2 rounded-full bg-white transition-all duration-500"
                style={{ width: `${(cardIndex / pathways.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-white/80">
              {cardIndex}/{pathways.length}
            </span>
          </div>
        </div>

        {/* KOR: 카드 영역 / ENG: Card area */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-6">
          {allDone ? (
            /* KOR: 모든 카드 완료 / ENG: All cards done */
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-pink-400 to-rose-500">
                <Heart className="h-12 w-12 fill-white text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">매칭 완료! 🎊</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {likedPathways.length}개의 비자 경로를 선택했어요
                </p>
              </div>
              <div className="flex w-full flex-col gap-3">
                <button
                  onClick={() => setStep('result')}
                  className="w-full rounded-2xl bg-linear-to-r from-pink-500 to-rose-500 py-4 text-base font-black text-white shadow-lg"
                >
                  상세 분석 보기 →
                </button>
                <button
                  onClick={() => {
                    setCardIndex(0);
                    setLikedPathways([]);
                    setSuperLikes(3);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-600"
                >
                  <RefreshCw className="h-4 w-4" />
                  다시 매칭하기
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* KOR: 뒤 카드 (다음 카드 미리보기) / ENG: Back card (next card preview) */}
              {nextPathway && (
                <div
                  className="absolute top-8 w-[calc(100%-3rem)] max-w-sm rounded-3xl"
                  style={{ transform: 'scale(0.95) translateY(10px)', zIndex: 1 }}
                >
                  <div
                    className={`h-48 rounded-3xl bg-linear-to-br ${getCardGradient(nextPathway.finalScore)} opacity-50`}
                  />
                </div>
              )}

              {/* KOR: 현재 카드 / ENG: Current card */}
              {currentPathway && (
                <div
                  className={`relative z-10 w-full max-w-sm rounded-3xl shadow-2xl transition-all duration-400 ${
                    swipeAnim === 'right'
                      ? 'translate-x-full rotate-12 opacity-0'
                      : swipeAnim === 'left'
                      ? '-translate-x-full -rotate-12 opacity-0'
                      : swipeAnim === 'super'
                      ? '-translate-y-full opacity-0'
                      : ''
                  }`}
                >
                  {/* KOR: 카드 상단 그라데이션 영역 / ENG: Card top gradient area */}
                  <div
                    className={`relative rounded-t-3xl bg-linear-to-br ${getCardGradient(currentPathway.finalScore)} p-6 text-white`}
                  >
                    {/* KOR: 호환도 배지 / ENG: Compatibility badge */}
                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                      <Sparkles className="h-3 w-3 text-yellow-200" />
                      <span className="text-xs font-black">
                        {getCompatPercent(currentPathway.finalScore)}% 호환
                      </span>
                    </div>

                    <div className="mb-3 text-4xl">
                      {getFeasibilityEmoji(currentPathway.feasibilityLabel)}
                    </div>
                    <h3 className="mb-1 text-xl font-black leading-tight">{currentPathway.nameKo}</h3>
                    <p className="text-sm leading-relaxed opacity-85">{currentPathway.nameEn}</p>

                    {/* KOR: 비자 체인 태그 / ENG: Visa chain tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(Array.isArray(currentPathway.visaChain) ? currentPathway.visaChain : []).map((v) => (
                        <span
                          key={v.code}
                          className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm"
                        >
                          {v.code}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* KOR: 카드 하단 정보 / ENG: Card bottom info */}
                  <div className="rounded-b-3xl bg-white p-5">
                    <div className="mb-4 grid grid-cols-3 gap-3">
                      <div className="flex flex-col items-center gap-1 rounded-2xl bg-pink-50 p-3">
                        <TrendingUp className="h-4 w-4 text-pink-500" />
                        <span className="text-lg font-black text-pink-600">
                          {currentPathway.finalScore}점
                        </span>
                        <span className="text-xs text-gray-500">매칭점수</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-2xl bg-rose-50 p-3">
                        <Clock className="h-4 w-4 text-rose-500" />
                        <span className="text-lg font-black text-rose-600">
                          {currentPathway.estimatedMonths}개월
                        </span>
                        <span className="text-xs text-gray-500">소요기간</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-2xl bg-red-50 p-3">
                        <DollarSign className="h-4 w-4 text-red-500" />
                        <span className="text-lg font-black text-red-600">
                          {currentPathway.estimatedCostWon > 0
                            ? `${currentPathway.estimatedCostWon}만`
                            : '무료'}
                        </span>
                        <span className="text-xs text-gray-500">예상비용</span>
                      </div>
                    </div>

                    {/* KOR: 첫 마일스톤 / ENG: First milestone */}
                    {currentPathway.milestones[0] && (
                      <div className="mb-3 flex items-start gap-3 rounded-2xl bg-gray-50 p-3">
                        <span className="shrink-0 text-lg">{getMilestoneEmoji(currentPathway.milestones[0].type)}</span>
                        <div>
                          <div className="text-xs font-bold text-gray-700">{currentPathway.milestones[0].nameKo}</div>
                          <div className="text-xs text-gray-500">시작 후 {currentPathway.milestones[0].monthFromStart}개월</div>
                        </div>
                      </div>
                    )}

                    {/* KOR: 실현 가능성 라벨 / ENG: Feasibility label */}
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: getScoreColor(currentPathway.finalScore) }}
                      />
                      <span className="text-xs font-bold text-gray-600">
                        실현 가능성: {currentPathway.feasibilityLabel}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* KOR: 스와이프 힌트 레이블 / ENG: Swipe hint labels */}
              {swipeAnim === 'right' && (
                <div className="absolute left-8 top-1/3 z-20 rotate-[-15deg] rounded-2xl border-4 border-green-400 px-4 py-2 text-2xl font-black text-green-400">
                  LIKE 💚
                </div>
              )}
              {swipeAnim === 'left' && (
                <div className="absolute right-8 top-1/3 z-20 rotate-[15deg] rounded-2xl border-4 border-red-400 px-4 py-2 text-2xl font-black text-red-400">
                  NOPE ✗
                </div>
              )}
              {swipeAnim === 'super' && (
                <div className="absolute left-1/2 top-1/4 z-20 -translate-x-1/2 rounded-2xl border-4 border-blue-400 px-4 py-2 text-2xl font-black text-blue-400">
                  SUPER ⭐
                </div>
              )}
            </>
          )}
        </div>

        {/* KOR: 하단 액션 버튼 / ENG: Bottom action buttons */}
        {!allDone && (
          <div className="px-6 pb-8">
            <div className="flex items-center justify-center gap-6">
              {/* KOR: 패스 버튼 / ENG: Pass button */}
              <button
                onClick={() => handleSwipe('left')}
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-200 bg-white shadow-lg transition-all hover:scale-105 hover:border-red-400 active:scale-95"
              >
                <X className="h-8 w-8 text-red-400" />
              </button>

              {/* KOR: 수퍼라이크 버튼 / ENG: Super like button */}
              <button
                onClick={() => handleSwipe('super')}
                disabled={superLikes <= 0}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-md transition-all hover:scale-105 active:scale-95 ${
                  superLikes > 0
                    ? 'border-blue-200 bg-white hover:border-blue-400'
                    : 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-40'
                }`}
              >
                <Star
                  className={`h-6 w-6 ${superLikes > 0 ? 'text-blue-400' : 'text-gray-300'}`}
                />
              </button>

              {/* KOR: 좋아요 버튼 / ENG: Like button */}
              <button
                onClick={() => handleSwipe('right')}
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-pink-200 bg-white shadow-lg transition-all hover:scale-105 hover:border-pink-400 active:scale-95"
              >
                <Heart className="h-8 w-8 fill-pink-400 text-pink-400" />
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-gray-400">
              ✗ 패스 &nbsp;|&nbsp; ⭐ 슈퍼라이크 ({superLikes}회 남음) &nbsp;|&nbsp; ♥ 관심 있어요
            </p>
          </div>
        )}
      </div>
    );
  }

  // KOR: 결과 화면 / ENG: Result screen
  if (step === 'result') {
    return (
      <div className="flex min-h-screen flex-col bg-linear-to-br from-pink-50 via-rose-50 to-white">
        {/* KOR: 결과 헤더 / ENG: Result header */}
        <div className="bg-linear-to-r from-pink-500 via-rose-500 to-red-400 px-6 pb-8 pt-10 text-white">
          <button
            onClick={() => setStep('matching')}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            다시 탐색하기
          </button>
          <div className="mb-2 flex items-center gap-2">
            <Heart className="h-5 w-5 fill-white text-white" />
            <span className="text-sm font-bold opacity-90">매칭 결과</span>
          </div>
          <h1 className="text-2xl font-black">당신의 비자 매칭 결과 💕</h1>
          <p className="mt-1 text-sm opacity-80">
            {pathways.length}개 경로 분석 완료 · {likedPathways.length}개 관심 표시
          </p>

          {/* KOR: 요약 카드 / ENG: Summary card */}
          <div className="mt-4 flex gap-3 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
            <div className="flex flex-1 flex-col items-center">
              <span className="text-2xl font-black">{pathways.length}</span>
              <span className="text-xs opacity-80">전체 경로</span>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex flex-1 flex-col items-center">
              <span className="text-2xl font-black">{likedPathways.length}</span>
              <span className="text-xs opacity-80">관심 경로</span>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex flex-1 flex-col items-center">
              <span className="text-2xl font-black">
                {pathways[0] ? getCompatPercent(pathways[0].finalScore) : 0}%
              </span>
              <span className="text-xs opacity-80">최고 호환도</span>
            </div>
          </div>
        </div>

        {/* KOR: 경로 카드 목록 / ENG: Pathway card list */}
        <div className="flex flex-col gap-4 p-6">
          {pathways.map((pathway, idx) => {
            const isLiked = likedPathways.some((p) => p.id === pathway.id);
            return (
              <div key={pathway.pathwayId} className="overflow-hidden rounded-3xl bg-white shadow-md">
                {/* KOR: 카드 상단 컬러 헤더 / ENG: Card top color header */}
                <div
                  className={`flex items-center justify-between bg-linear-to-r ${getCardGradient(pathway.finalScore)} px-5 py-4`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getFeasibilityEmoji(pathway.feasibilityLabel)}
                    </span>
                    <div>
                      <div className="text-sm font-black text-white">{pathway.nameKo}</div>
                      <div className="text-xs text-white/80">{pathway.feasibilityLabel}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="rounded-full bg-white/20 px-3 py-1 text-sm font-black text-white">
                      {getCompatPercent(pathway.finalScore)}%
                    </div>
                    {isLiked && (
                      <div className="flex items-center gap-1 text-xs text-white/90">
                        <Heart className="h-3 w-3 fill-white text-white" />
                        <span>관심</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* KOR: 카드 본문 / ENG: Card body */}
                <div className="p-5">
                  <p className="mb-4 text-sm leading-relaxed text-gray-600">{pathway.note}</p>

                  {/* KOR: 핵심 수치 / ENG: Key metrics */}
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-pink-50 p-3 text-center">
                      <div className="text-base font-black text-pink-600">
                        {pathway.finalScore}점
                      </div>
                      <div className="text-xs text-gray-500">매칭 점수</div>
                    </div>
                    <div className="rounded-xl bg-rose-50 p-3 text-center">
                      <div className="text-base font-black text-rose-600">
                        {pathway.estimatedMonths}개월
                      </div>
                      <div className="text-xs text-gray-500">소요기간</div>
                    </div>
                    <div className="rounded-xl bg-red-50 p-3 text-center">
                      <div className="text-base font-black text-red-600">
                        {pathway.estimatedCostWon > 0
                          ? `${pathway.estimatedCostWon}만원`
                          : '무료'}
                      </div>
                      <div className="text-xs text-gray-500">예상비용</div>
                    </div>
                  </div>

                  {/* KOR: 비자 체인 / ENG: Visa chain */}
                  <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
                    {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, vi) => (
                      <React.Fragment key={v.code}>
                        <div className="shrink-0 rounded-xl bg-gray-50 px-3 py-2 text-center">
                          <div className="text-xs font-black text-gray-800">{v.code}</div>
                        </div>
                        {vi < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                          <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* KOR: 마일스톤 목록 / ENG: Milestone list */}
                  <div className="flex flex-col gap-2">
                    {pathway.milestones.slice(0, 3).map((m) => (
                      <div
                        key={m.order}
                        className="flex items-start gap-3 rounded-xl bg-gray-50 p-3"
                      >
                        <span className="shrink-0 text-base">{getMilestoneEmoji(m.type)}</span>
                        <div>
                          <div className="text-xs font-bold text-gray-700">{m.nameKo}</div>
                          <div className="text-xs text-gray-500">
                            {m.monthFromStart === 0
                              ? '시작 시점'
                              : `${m.monthFromStart}개월 후`}
                            {m.canWorkPartTime && ' · 아르바이트 가능'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* KOR: 최고 매칭 배지 / ENG: Top match badge */}
                  {idx === 0 && (
                    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-linear-to-r from-pink-500 to-rose-500 p-3 text-white">
                      <Zap className="h-4 w-4" />
                      <span className="text-xs font-black">최고 매칭 경로 — 가장 높은 호환도!</span>
                    </div>
                  )}

                  {/* KOR: 플랫폼 지원 배지 / ENG: Platform support badge */}
                  {pathway.platformSupport === 'full_support' && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-bold text-green-700">잡차자 전담 지원 가능</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* KOR: 하단 상담 CTA / ENG: Bottom consultation CTA */}
          <div className="mt-2 rounded-3xl bg-linear-to-br from-pink-500 to-rose-500 p-6 text-center text-white shadow-lg">
            <Heart className="mx-auto mb-3 h-8 w-8 fill-white text-white" />
            <h3 className="mb-1 text-lg font-black">비자 전문가와 상담하기</h3>
            <p className="mb-4 text-sm opacity-85">
              매칭 결과를 바탕으로 1:1 맞춤 상담을 받아보세요
            </p>
            <button className="w-full rounded-2xl bg-white py-3 text-sm font-black text-pink-600 shadow hover:opacity-90">
              무료 상담 신청 →
            </button>
          </div>

          {/* KOR: 처음부터 다시 / ENG: Restart from beginning */}
          <button
            onClick={() => {
              setStep('nationality');
              setInput({});
              setCardIndex(0);
              setLikedPathways([]);
              setSuperLikes(3);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            처음부터 다시 진단하기
          </button>
        </div>
      </div>
    );
  }

  return null;
}
