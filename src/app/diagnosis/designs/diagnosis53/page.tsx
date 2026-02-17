'use client';

// KOR: 디자인 #53 - 언어 학습 (Language Learning) 테마 비자 진단 페이지
// ENG: Design #53 - Language Learning themed visa diagnosis page
// KOR: 듀오링고 스타일의 게이미피케이션으로 재미있게 비자 진단을 진행합니다.
// ENG: Gamified visa diagnosis in Duolingo-style with XP, hearts, streaks, and mascot.

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
  Star,
  Zap,
  Trophy,
  Shield,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Globe,
  GraduationCap,
  DollarSign,
  Target,
  Flame,
  Award,
  BarChart2,
  Clock,
  TrendingUp,
  Gift,
} from 'lucide-react';

// KOR: 레슨 단계 정의 / ENG: Lesson step definitions
const LESSON_STEPS = [
  { id: 1, title: '국적 선택', titleEn: 'Select Nationality', icon: '🌍', xpReward: 10 },
  { id: 2, title: '나이 입력', titleEn: 'Enter Age', icon: '🎂', xpReward: 10 },
  { id: 3, title: '학력 수준', titleEn: 'Education Level', icon: '🎓', xpReward: 15 },
  { id: 4, title: '가용 자금', titleEn: 'Available Funds', icon: '💰', xpReward: 15 },
  { id: 5, title: '최종 목표', titleEn: 'Final Goal', icon: '🎯', xpReward: 20 },
  { id: 6, title: '우선순위', titleEn: 'Priority', icon: '⭐', xpReward: 20 },
];

// KOR: 리그 단계 정의 / ENG: League tier definitions
const LEAGUES = [
  { name: '브론즈', nameEn: 'Bronze', icon: '🥉', minXP: 0, color: 'text-amber-700' },
  { name: '실버', nameEn: 'Silver', icon: '🥈', minXP: 50, color: 'text-gray-400' },
  { name: '골드', nameEn: 'Gold', icon: '🥇', minXP: 100, color: 'text-yellow-500' },
  { name: '플래티넘', nameEn: 'Platinum', icon: '💎', minXP: 200, color: 'text-cyan-400' },
];

// KOR: XP에 따른 현재 리그 반환 / ENG: Get current league based on XP
const getCurrentLeague = (xp: number) => {
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (xp >= LEAGUES[i].minXP) return LEAGUES[i];
  }
  return LEAGUES[0];
};

export default function Diagnosis53Page() {
  // KOR: 현재 레슨 단계 / ENG: Current lesson step
  const [currentStep, setCurrentStep] = useState(0); // 0 = 시작화면, 1-6 = 레슨, 7 = 결과
  // KOR: 사용자 입력 상태 / ENG: User input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // KOR: 하트(생명) 수 / ENG: Heart (lives) count
  const [hearts, setHearts] = useState(5);
  // KOR: 획득한 XP / ENG: Earned XP
  const [xp, setXp] = useState(0);
  // KOR: 스트릭 카운터 / ENG: Streak counter
  const [streak] = useState(7);
  // KOR: 마지막 획득 XP 애니메이션용 / ENG: Last gained XP for animation
  const [lastXpGain, setLastXpGain] = useState(0);
  // KOR: XP 애니메이션 표시 여부 / ENG: Whether to show XP animation
  const [showXpAnim, setShowXpAnim] = useState(false);
  // KOR: 결과 데이터 / ENG: Diagnosis result data
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  // KOR: 확장된 경로 카드 인덱스 / ENG: Expanded pathway card index
  const [expandedPath, setExpandedPath] = useState<string | null>('path-1');
  // KOR: 현재 선택된 옵션 (애니메이션용) / ENG: Currently selected option (for animation)
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // KOR: XP 획득 처리 / ENG: Handle XP gain
  const gainXP = (amount: number) => {
    setXp((prev) => prev + amount);
    setLastXpGain(amount);
    setShowXpAnim(true);
    setTimeout(() => setShowXpAnim(false), 1500);
  };

  // KOR: 다음 단계로 이동 / ENG: Move to next step
  const handleNext = () => {
    const stepXP = LESSON_STEPS[currentStep - 1]?.xpReward ?? 10;
    gainXP(stepXP);
    if (currentStep >= 6) {
      // KOR: 진단 완료 - 결과 표시 / ENG: Diagnosis complete - show results
      setResult(mockDiagnosisResult);
      setCurrentStep(7);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
    setSelectedOption(null);
  };

  // KOR: 이전 단계로 이동 / ENG: Move to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setSelectedOption(null);
    }
  };

  // KOR: 옵션 선택 처리 / ENG: Handle option selection
  const handleSelect = (field: keyof DiagnosisInput, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
    setSelectedOption(value);
  };

  // KOR: 현재 단계에서 값이 선택됐는지 확인 / ENG: Check if value is selected for current step
  const isCurrentStepFilled = (): boolean => {
    switch (currentStep) {
      case 1: return !!input.nationality;
      case 2: return !!input.age && input.age > 0;
      case 3: return !!input.educationLevel;
      case 4: return !!input.availableAnnualFund;
      case 5: return !!input.finalGoal;
      case 6: return !!input.priorityPreference;
      default: return false;
    }
  };

  const currentLeague = getCurrentLeague(xp);
  const totalXP = LESSON_STEPS.reduce((sum, s) => sum + s.xpReward, 0);
  const xpProgress = Math.min((xp / totalXP) * 100, 100);

  // KOR: 시작 화면 렌더링 / ENG: Render start screen
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
        {/* KOR: 상단 장식 배경 / ENG: Top decorative background */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-br from-[#58CC02] to-[#46a302] rounded-b-[60px]" />

        <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
          {/* KOR: 마스코트 캐릭터 (듀오 올빼미 스타일) / ENG: Mascot character (Duo owl style) */}
          <div className="mb-4 animate-bounce">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-[#58CC02]">
              <span className="text-7xl select-none">🦉</span>
            </div>
          </div>

          {/* KOR: 마스코트 말풍선 / ENG: Mascot speech bubble */}
          <div className="bg-white rounded-2xl px-6 py-4 mb-6 shadow-lg border-2 border-[#E5E7EB] relative max-w-xs text-center">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-l-2 border-t-2 border-[#E5E7EB] rotate-45" />
            <p className="text-gray-800 font-bold text-lg leading-snug">
              안녕! 나는 비자비 🎓
            </p>
            <p className="text-gray-500 text-sm mt-1">
              함께 비자 레슨을 시작해볼까요?
            </p>
          </div>

          {/* KOR: 타이틀 / ENG: Title */}
          <h1 className="text-3xl font-extrabold text-white mb-1 text-center drop-shadow-md">
            비자 진단 레슨
          </h1>
          <p className="text-green-100 text-center mb-6 text-sm">
            Visa Diagnosis Lesson
          </p>

          {/* KOR: 스탯 카드 (스트릭, 리그) / ENG: Stat cards (streak, league) */}
          <div className="flex gap-3 mb-8 w-full">
            <div className="flex-1 bg-white rounded-2xl p-3 flex flex-col items-center shadow-md border border-gray-100">
              <div className="flex items-center gap-1 mb-1">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-2xl font-extrabold text-gray-800">{streak}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">일 스트릭</span>
            </div>
            <div className="flex-1 bg-white rounded-2xl p-3 flex flex-col items-center shadow-md border border-gray-100">
              <span className="text-2xl mb-1">{currentLeague.icon}</span>
              <span className={`text-xs font-bold ${currentLeague.color}`}>{currentLeague.name} 리그</span>
            </div>
            <div className="flex-1 bg-white rounded-2xl p-3 flex flex-col items-center shadow-md border border-gray-100">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-extrabold text-gray-800">{xp}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">XP</span>
            </div>
          </div>

          {/* KOR: 레슨 목록 미리보기 / ENG: Lesson list preview */}
          <div className="w-full bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
            <p className="text-xs text-gray-400 font-semibold mb-3 uppercase tracking-wide">6개 레슨 · 90 XP</p>
            <div className="space-y-2">
              {LESSON_STEPS.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#58CC02] bg-opacity-10 rounded-full flex items-center justify-center text-sm shrink-0">
                    {step.icon}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{step.title}</span>
                  <span className="ml-auto text-xs text-[#58CC02] font-bold">+{step.xpReward} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* KOR: 시작 버튼 / ENG: Start button */}
          <button
            onClick={() => setCurrentStep(1)}
            className="w-full bg-[#58CC02] hover:bg-[#46a302] active:bg-[#3d8e02] text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg transition-all duration-150 active:scale-95 border-b-4 border-[#3d8e02]"
          >
            레슨 시작하기 🚀
          </button>
          <p className="text-gray-400 text-xs mt-3">Start your visa lesson</p>
        </div>
      </div>
    );
  }

  // KOR: 결과 화면 / ENG: Result screen
  if (currentStep === 7 && result) {
    const finalLeague = getCurrentLeague(xp);
    return (
      <div className="min-h-screen bg-gray-50">
        {/* KOR: 결과 헤더 (레벨업 축하) / ENG: Result header (level up celebration) */}
        <div className="bg-linear-to-br from-[#58CC02] to-[#46a302] px-4 pt-10 pb-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-ping"
                style={{ left: `${(i * 17) % 100}%`, top: `${(i * 23) % 100}%`, animationDelay: `${i * 0.1}s`, animationDuration: '2s' }}
              >
                ⭐
              </div>
            ))}
          </div>
          <div className="relative z-10">
            {/* KOR: 레벨업 마스코트 / ENG: Level up mascot */}
            <div className="text-7xl mb-3">🦉</div>
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 font-extrabold px-4 py-2 rounded-full text-sm mb-3 shadow-md">
              <Trophy className="w-4 h-4" />
              레벨업! Level Up!
            </div>
            <h2 className="text-white text-2xl font-extrabold mb-1">진단 완료!</h2>
            <p className="text-green-100 text-sm">Diagnosis Complete!</p>

            {/* KOR: XP 획득 요약 / ENG: XP gained summary */}
            <div className="flex justify-center gap-4 mt-4">
              <div className="bg-white bg-opacity-20 rounded-2xl px-5 py-3 text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span className="text-white text-2xl font-extrabold">{xp}</span>
                </div>
                <span className="text-green-100 text-xs">획득 XP</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-2xl px-5 py-3 text-center">
                <span className="text-2xl">{finalLeague.icon}</span>
                <div className={`text-sm font-bold ${finalLeague.color} text-white`}>{finalLeague.name} 리그</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-2xl px-5 py-3 text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Heart className="w-5 h-5 text-red-300 fill-red-300" />
                  <span className="text-white text-2xl font-extrabold">{hearts}</span>
                </div>
                <span className="text-green-100 text-xs">남은 하트</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOR: 결과 카드 영역 / ENG: Result cards area */}
        <div className="max-w-2xl mx-auto px-4 -mt-8 pb-12">
          {/* KOR: XP 경험치 바 / ENG: XP progress bar */}
          <div className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#58CC02]" />
                <span className="font-bold text-gray-800 text-sm">비자 탐험가</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">{xp} / {totalXP} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 bg-linear-to-r from-[#58CC02] to-[#78e600] rounded-full transition-all duration-1000"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">다음 리그까지 {Math.max(0, 100 - xp)} XP</p>
          </div>

          {/* KOR: 추천 비자 경로 제목 / ENG: Recommended pathway title */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#58CC02] rounded-full flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-gray-800 font-extrabold text-base">추천 비자 경로 리포트</h3>
            <span className="ml-auto text-xs text-gray-400">Visa Report</span>
          </div>

          {/* KOR: 비자 경로 카드 목록 / ENG: Visa pathway card list */}
          <div className="space-y-3">
            {result.pathways.map((pathway: RecommendedPathway, index: number) => {
              const isExpanded = expandedPath === pathway.id;
              // KOR: 순위별 배지 설정 / ENG: Badge config by rank
              const rankConfig = [
                { badge: '🥇 1위', bg: 'bg-yellow-50', border: 'border-yellow-300', badgeBg: 'bg-yellow-400 text-yellow-900' },
                { badge: '🥈 2위', bg: 'bg-gray-50', border: 'border-gray-300', badgeBg: 'bg-gray-300 text-gray-700' },
                { badge: '🥉 3위', bg: 'bg-orange-50', border: 'border-orange-200', badgeBg: 'bg-orange-300 text-orange-900' },
              ][index] ?? { badge: `${index + 1}위`, bg: 'bg-white', border: 'border-gray-200', badgeBg: 'bg-gray-100 text-gray-600' };

              return (
                <div key={pathway.id} className={`${rankConfig.bg} rounded-2xl border-2 ${rankConfig.border} overflow-hidden shadow-sm`}>
                  {/* KOR: 경로 카드 헤더 / ENG: Pathway card header */}
                  <button
                    onClick={() => setExpandedPath(isExpanded ? null : pathway.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      {/* KOR: 이모지 순위 배지 / ENG: Emoji rank badge */}
                      <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${rankConfig.badgeBg}`}>
                        {rankConfig.badge}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm leading-snug">{pathway.name}</h4>
                        {/* KOR: XP 스타일 점수 표시 / ENG: XP-style score display */}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-[#58CC02]" />
                            <span className="text-[#58CC02] font-extrabold text-sm">{pathway.feasibilityScore} XP</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{pathway.totalDurationMonths}개월</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <DollarSign className="w-3 h-3" />
                            <span>${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-600">
                            {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
                          </span>
                        </div>
                        {/* KOR: 실현 가능성 XP 바 / ENG: Feasibility XP bar */}
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-700 ${getScoreColor(pathway.feasibilityLabel)}`}
                            style={{ width: `${pathway.feasibilityScore}%` }}
                          />
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </button>

                  {/* KOR: 펼침 상세 내용 / ENG: Expanded detail content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-200 pt-3 space-y-4">
                      {/* KOR: 비자 체인 (레슨 맵처럼) / ENG: Visa chain (like lesson map) */}
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">비자 경로 맵</p>
                        <div className="flex items-center gap-1 flex-wrap">
                          {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((vc, i) => (
                            <React.Fragment key={i}>
                              <div className="bg-[#58CC02] text-white rounded-xl px-3 py-2 text-center shadow-sm">
                                <div className="font-extrabold text-sm">{vc.visa}</div>
                                <div className="text-xs text-green-100">{vc.duration}</div>
                              </div>
                              {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* KOR: 마일스톤 (레슨 단계처럼) / ENG: Milestones (like lesson steps) */}
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">레슨 마일스톤</p>
                        <div className="space-y-2">
                          {pathway.milestones.map((ms, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-gray-100">
                              {/* KOR: 레슨 원형 번호 / ENG: Circular lesson number */}
                              <div className="w-8 h-8 bg-[#58CC02] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                <span className="text-white text-xs font-bold">{i + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-base">{ms.emoji}</span>
                                  <span className="font-bold text-gray-800 text-sm">{ms.title}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{ms.description}</p>
                              </div>
                              <CheckCircle className="w-5 h-5 text-gray-200 shrink-0 mt-0.5" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* KOR: 경로 설명 / ENG: Pathway description */}
                      <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                        <p className="text-xs text-blue-700 leading-relaxed">{pathway.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* KOR: 보상 및 다음 액션 / ENG: Rewards and next actions */}
          <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-[#58CC02]" />
              <span className="font-bold text-gray-800">레슨 완료 보상</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="w-4 h-4 text-[#58CC02]" />
                  <span className="text-[#58CC02] font-extrabold">{xp} XP</span>
                </div>
                <span className="text-xs text-gray-500">경험치 획득</span>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-center border border-orange-100">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-500 font-extrabold">{streak + 1}일</span>
                </div>
                <span className="text-xs text-gray-500">스트릭 연장</span>
              </div>
            </div>
            <button className="w-full bg-[#58CC02] hover:bg-[#46a302] active:scale-95 text-white font-extrabold py-3.5 rounded-2xl shadow-md border-b-4 border-[#3d8e02] transition-all duration-150 mb-2">
              전문가 상담 신청하기 💬
            </button>
            <button
              onClick={() => { setCurrentStep(0); setInput({}); setXp(0); setHearts(5); setResult(null); }}
              className="w-full border-2 border-[#58CC02] text-[#58CC02] font-bold py-3 rounded-2xl hover:bg-green-50 transition-all duration-150"
            >
              다시 진단하기 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  // KOR: 레슨 진행 화면 / ENG: Lesson in progress screen
  const stepInfo = LESSON_STEPS[currentStep - 1];
  const stepProgress = ((currentStep - 1) / LESSON_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* KOR: 레슨 헤더 (프로그레스 바 + 하트 + XP) / ENG: Lesson header (progress bar + hearts + XP) */}
      <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-lg mx-auto">
          {/* KOR: 상단 레이아웃 (뒤로 / 진행바 / 하트) / ENG: Top layout (back / progress / hearts) */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep <= 1}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors shrink-0"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* KOR: 레슨 진행 바 / ENG: Lesson progress bar */}
            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 bg-linear-to-r from-[#58CC02] to-[#78e600] rounded-full transition-all duration-500"
                style={{ width: `${stepProgress}%` }}
              />
            </div>

            {/* KOR: 하트(생명) 표시 / ENG: Hearts (lives) display */}
            <div className="flex items-center gap-1 shrink-0">
              <Heart className={`w-6 h-6 transition-all ${hearts > 0 ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
              <span className="text-red-500 font-extrabold text-sm">{hearts}</span>
            </div>
          </div>

          {/* KOR: XP + 스트릭 인라인 표시 / ENG: XP + streak inline display */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-600 font-bold text-xs">{xp} XP</span>
            </div>
            <span className="text-gray-400 text-xs font-medium">
              레슨 {currentStep} / {LESSON_STEPS.length}
            </span>
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500 font-bold text-xs">{streak}일</span>
            </div>
          </div>
        </div>
      </div>

      {/* KOR: XP 획득 애니메이션 / ENG: XP gain animation */}
      {showXpAnim && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-yellow-400 text-yellow-900 font-extrabold px-4 py-2 rounded-full shadow-xl text-sm animate-bounce">
            +{lastXpGain} XP 🎉
          </div>
        </div>
      )}

      {/* KOR: 레슨 콘텐츠 영역 / ENG: Lesson content area */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-6 pb-4 flex flex-col">
        {/* KOR: 레슨 아이콘 + 제목 + 마스코트 / ENG: Lesson icon + title + mascot */}
        <div className="flex items-start gap-3 mb-6">
          <div className="w-14 h-14 bg-[#58CC02] rounded-2xl flex items-center justify-center text-3xl shadow-md shrink-0">
            {stepInfo.icon}
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#58CC02] font-bold uppercase tracking-wide">레슨 {currentStep}</p>
            <h2 className="text-xl font-extrabold text-gray-800 leading-tight">{stepInfo.title}</h2>
            <p className="text-xs text-gray-400">{stepInfo.titleEn}</p>
          </div>
          {/* KOR: 소형 마스코트 / ENG: Mini mascot */}
          <div className="text-3xl shrink-0">🦉</div>
        </div>

        {/* KOR: 마스코트 힌트 말풍선 / ENG: Mascot hint speech bubble */}
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-5 relative">
          <div className="absolute -top-2 left-6 w-4 h-4 bg-green-50 border-l border-t border-green-200 rotate-45" />
          <p className="text-green-700 text-sm font-medium">
            {currentStep === 1 && '어느 나라에서 오셨나요? 비자비가 맞춤 경로를 찾아드릴게요!'}
            {currentStep === 2 && '나이는 비자 자격 요건에 영향을 줄 수 있어요!'}
            {currentStep === 3 && '학력이 높을수록 더 많은 비자 경로가 열려요!'}
            {currentStep === 4 && '예산에 맞는 최적의 경로를 추천해드릴게요!'}
            {currentStep === 5 && '목표에 맞는 비자 경로가 달라요. 신중하게 선택하세요!'}
            {currentStep === 6 && '마지막 단계예요! 우선순위를 선택하면 결과가 나와요!'}
          </p>
        </div>

        {/* KOR: 단계별 입력 UI / ENG: Step-by-step input UI */}
        <div className="flex-1">

          {/* KOR: Step 1 - 국적 선택 / ENG: Step 1 - Nationality */}
          {currentStep === 1 && (
            <div className="grid grid-cols-3 gap-2">
              {popularCountries.map((country) => {
                const isSelected = input.nationality === country.name;
                return (
                  <button
                    key={country.code}
                    onClick={() => handleSelect('nationality', country.name)}
                    className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-150 active:scale-95 ${
                      isSelected
                        ? 'border-[#58CC02] bg-green-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <span className="text-3xl mb-1">{country.flag}</span>
                    <span className={`text-xs font-bold leading-tight text-center ${isSelected ? 'text-[#58CC02]' : 'text-gray-600'}`}>
                      {country.name}
                    </span>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-[#58CC02] mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* KOR: Step 2 - 나이 입력 / ENG: Step 2 - Age */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 text-center">
                <p className="text-6xl font-extrabold text-[#58CC02] mb-2">
                  {input.age ?? '--'}
                </p>
                <p className="text-gray-400 text-sm">세 (Years Old)</p>
              </div>
              {/* KOR: 나이 슬라이더 / ENG: Age slider */}
              <input
                type="range"
                min={18}
                max={65}
                value={input.age ?? 25}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setInput((prev) => ({ ...prev, age: val }));
                  setSelectedOption(String(val));
                }}
                className="w-full accent-[#58CC02]"
              />
              <div className="flex justify-between text-xs text-gray-400 px-1">
                <span>18세</span>
                <span>40세</span>
                <span>65세</span>
              </div>
              {/* KOR: 빠른 선택 버튼 / ENG: Quick select buttons */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[20, 25, 30, 35].map((age) => (
                  <button
                    key={age}
                    onClick={() => { setInput((prev) => ({ ...prev, age })); setSelectedOption(String(age)); }}
                    className={`py-2 rounded-xl font-bold text-sm transition-all border-2 ${
                      input.age === age
                        ? 'bg-[#58CC02] text-white border-[#58CC02]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {age}세
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* KOR: Step 3 - 학력 수준 / ENG: Step 3 - Education level */}
          {currentStep === 3 && (
            <div className="space-y-2">
              {educationOptions.map((edu, i) => {
                const isSelected = input.educationLevel === edu;
                const icons = ['🏫', '🎓', '📚', '🔬', '🏛️'];
                return (
                  <button
                    key={edu}
                    onClick={() => handleSelect('educationLevel', edu)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-150 active:scale-[0.98] ${
                      isSelected
                        ? 'border-[#58CC02] bg-green-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{icons[i]}</span>
                    <span className={`flex-1 text-left font-bold text-sm ${isSelected ? 'text-[#58CC02]' : 'text-gray-700'}`}>
                      {edu}
                    </span>
                    {isSelected
                      ? <CheckCircle className="w-5 h-5 text-[#58CC02] shrink-0" />
                      : <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                    }
                  </button>
                );
              })}
            </div>
          )}

          {/* KOR: Step 4 - 가용 자금 / ENG: Step 4 - Available funds */}
          {currentStep === 4 && (
            <div className="space-y-2">
              {fundOptions.map((fund, i) => {
                const isSelected = input.availableAnnualFund === fund;
                const colors = ['text-gray-500', 'text-blue-500', 'text-green-600', 'text-yellow-600', 'text-orange-600'];
                const icons = ['💵', '💴', '💶', '💷', '💰'];
                return (
                  <button
                    key={fund}
                    onClick={() => handleSelect('availableAnnualFund', fund)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-150 active:scale-[0.98] ${
                      isSelected
                        ? 'border-[#58CC02] bg-green-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{icons[i]}</span>
                    <span className={`flex-1 text-left font-bold text-sm ${isSelected ? 'text-[#58CC02]' : colors[i]}`}>
                      {fund}
                    </span>
                    {isSelected
                      ? <CheckCircle className="w-5 h-5 text-[#58CC02] shrink-0" />
                      : <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                    }
                  </button>
                );
              })}
            </div>
          )}

          {/* KOR: Step 5 - 최종 목표 / ENG: Step 5 - Final goal */}
          {currentStep === 5 && (
            <div className="space-y-2">
              {goalOptions.map((goal, i) => {
                const isSelected = input.finalGoal === goal;
                const icons = ['🗣️', '💼', '🏢', '🎓', '🏡'];
                return (
                  <button
                    key={goal}
                    onClick={() => handleSelect('finalGoal', goal)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-150 active:scale-[0.98] ${
                      isSelected
                        ? 'border-[#58CC02] bg-green-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{icons[i]}</span>
                    <span className={`flex-1 text-left font-bold text-sm ${isSelected ? 'text-[#58CC02]' : 'text-gray-700'}`}>
                      {goal}
                    </span>
                    {isSelected
                      ? <CheckCircle className="w-5 h-5 text-[#58CC02] shrink-0" />
                      : <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                    }
                  </button>
                );
              })}
            </div>
          )}

          {/* KOR: Step 6 - 우선순위 / ENG: Step 6 - Priority preference */}
          {currentStep === 6 && (
            <div className="space-y-2">
              {priorityOptions.map((priority, i) => {
                const isSelected = input.priorityPreference === priority;
                const icons = ['⚡', '💲', '🏆', '🎯'];
                const descs = ['가장 빠른 속도로', '최소 비용으로', '최고 성공률로', '원하는 직종으로'];
                return (
                  <button
                    key={priority}
                    onClick={() => handleSelect('priorityPreference', priority)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-150 active:scale-[0.98] ${
                      isSelected
                        ? 'border-[#58CC02] bg-green-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${isSelected ? 'bg-[#58CC02]' : 'bg-gray-100'}`}>
                      {icons[i]}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-bold text-sm ${isSelected ? 'text-[#58CC02]' : 'text-gray-800'}`}>{priority}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{descs[i]}</p>
                    </div>
                    {isSelected
                      ? <CheckCircle className="w-5 h-5 text-[#58CC02] shrink-0" />
                      : <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                    }
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* KOR: 하단 다음 버튼 / ENG: Bottom next button */}
        <div className="pt-4 mt-auto">
          {/* KOR: XP 보상 미리보기 / ENG: XP reward preview */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-500 font-medium">
              이 레슨 완료 시 <span className="text-yellow-600 font-bold">+{stepInfo.xpReward} XP</span> 획득
            </span>
          </div>
          <button
            onClick={handleNext}
            disabled={!isCurrentStepFilled()}
            className={`w-full font-extrabold text-lg py-4 rounded-2xl shadow-lg transition-all duration-150 border-b-4 ${
              isCurrentStepFilled()
                ? 'bg-[#58CC02] hover:bg-[#46a302] active:scale-95 text-white border-[#3d8e02]'
                : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            {currentStep < 6 ? '다음 레슨 →' : '진단 완료! 🎉'}
          </button>

          {/* KOR: 건너뛰기 텍스트 링크 / ENG: Skip text link */}
          <button
            onClick={() => {
              setInput(mockInput);
              setCurrentStep(7);
              setResult(mockDiagnosisResult);
              setXp(totalXP);
            }}
            className="w-full text-gray-400 text-xs py-2 mt-1 hover:text-gray-600 transition-colors"
          >
            예시 데이터로 결과 보기 (Skip)
          </button>
        </div>
      </div>
    </div>
  );
}
