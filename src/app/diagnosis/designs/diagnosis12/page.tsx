'use client';

// KOR: 디자인 #12 — 카드 위자드 (Card Wizard)
// ENG: Design #12 — Card Wizard UI with slide-based step progression

import React, { useState } from 'react';
import {
  popularCountries,
  educationOptions,
  goalOptions,
  priorityOptions,
  fundOptions,
  mockDiagnosisResult,
  DiagnosisInput,
  RecommendedPathway,
  getScoreColor,
  getFeasibilityEmoji,
} from '../_mock/diagnosis-mock-data';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  GraduationCap,
  DollarSign,
  Target,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Plane,
  Briefcase,
  ArrowRight,
} from 'lucide-react';

// KOR: 입력 단계 정의 타입
// ENG: Type definition for input steps
type StepKey = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

// KOR: 각 단계의 메타데이터 정의
// ENG: Metadata definition for each step
interface StepMeta {
  key: StepKey;
  title: string;
  titleEn: string;
  subtitle: string;
  icon: React.ReactNode;
}

// KOR: 단계별 확장된 경로 상태 (아코디언 열림/닫힘)
// ENG: Expanded pathway state per step (accordion open/close)
type ExpandedMap = Record<string, boolean>;

const STEPS: StepMeta[] = [
  {
    key: 'nationality',
    title: '국적을 선택해주세요',
    titleEn: 'Select your nationality',
    subtitle: '현재 어느 나라 여권을 보유하고 있나요?',
    icon: <MapPin className="w-6 h-6" />,
  },
  {
    key: 'age',
    title: '나이를 입력해주세요',
    titleEn: 'Enter your age',
    subtitle: '만 나이 기준으로 입력해주세요',
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    key: 'educationLevel',
    title: '최종 학력을 선택해주세요',
    titleEn: 'Select your education level',
    subtitle: '가장 최근에 완료한 학업 단계를 선택해주세요',
    icon: <GraduationCap className="w-6 h-6" />,
  },
  {
    key: 'availableAnnualFund',
    title: '연간 가용 자금을 선택해주세요',
    titleEn: 'Select your annual available fund',
    subtitle: '비자 취득 및 체류에 사용할 수 있는 연간 예산',
    icon: <DollarSign className="w-6 h-6" />,
  },
  {
    key: 'finalGoal',
    title: '최종 목표를 선택해주세요',
    titleEn: 'Select your final goal',
    subtitle: '한국에서 궁극적으로 이루고 싶은 것은 무엇인가요?',
    icon: <Target className="w-6 h-6" />,
  },
  {
    key: 'priorityPreference',
    title: '우선순위를 선택해주세요',
    titleEn: 'Select your priority',
    subtitle: '비자 경로를 선택할 때 가장 중요하게 여기는 요소는 무엇인가요?',
    icon: <Star className="w-6 h-6" />,
  },
];

// KOR: 기본 입력 초기값
// ENG: Default initial input values
const INITIAL_INPUT: DiagnosisInput = {
  nationality: '',
  age: 25,
  educationLevel: '',
  availableAnnualFund: '',
  finalGoal: '',
  priorityPreference: '',
};

// KOR: 코랄 테마 컬러 헬퍼 함수 — feasibilityLabel에 따른 테두리/배지 색상
// ENG: Coral theme color helper — border/badge color based on feasibilityLabel
const getPathwayAccentClass = (label: RecommendedPathway['feasibilityLabel']): string => {
  switch (label) {
    case '매우 높음': return 'border-l-coral-600 bg-coral-50';
    case '높음': return 'border-l-amber-500 bg-amber-50';
    case '보통': return 'border-l-yellow-400 bg-yellow-50';
    default: return 'border-l-gray-300 bg-gray-50';
  }
};

// KOR: 점수 바 색상 클래스 — tailwind 적합 버전
// ENG: Score bar color class — tailwind-compatible version
const getBarColorClass = (score: number): string => {
  if (score >= 80) return 'bg-coral-500';
  if (score >= 60) return 'bg-amber-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-gray-400';
};

export default function Diagnosis12Page() {
  // KOR: 현재 단계 인덱스 (0 ~ 5 = 입력, 6 = 결과)
  // ENG: Current step index (0~5 = input, 6 = result)
  const [currentStep, setCurrentStep] = useState<number>(0);

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [input, setInput] = useState<DiagnosisInput>(INITIAL_INPUT);

  // KOR: 슬라이드 방향 (next: 오른쪽→왼쪽, prev: 왼쪽→오른쪽)
  // ENG: Slide direction (next: right→left, prev: left→right)
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  // KOR: 애니메이션 트리거 상태
  // ENG: Animation trigger state
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // KOR: 결과 화면 표시 여부
  // ENG: Whether to show the result screen
  const [showResult, setShowResult] = useState<boolean>(false);

  // KOR: 각 경로 카드의 아코디언 열림 상태
  // ENG: Accordion open state for each pathway card
  const [expandedPathways, setExpandedPathways] = useState<ExpandedMap>({});

  // KOR: 국적 검색 필터
  // ENG: Nationality search filter
  const [countrySearch, setCountrySearch] = useState<string>('');

  // KOR: 현재 단계 메타데이터
  // ENG: Current step metadata
  const stepMeta = STEPS[currentStep];

  // KOR: 현재 단계가 유효한 값을 가지는지 확인
  // ENG: Check if current step has a valid value
  const isCurrentStepValid = (): boolean => {
    const key = STEPS[currentStep]?.key;
    if (!key) return false;
    if (key === 'age') return input.age >= 18 && input.age <= 70;
    const val = input[key];
    return typeof val === 'string' && val.trim().length > 0;
  };

  // KOR: 단계 전환 함수 (애니메이션 포함)
  // ENG: Step transition function (with animation)
  const goToStep = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    if (direction === 'next' && !isCurrentStepValid()) return;

    setSlideDirection(direction);
    setIsAnimating(true);

    setTimeout(() => {
      if (direction === 'next') {
        if (currentStep >= STEPS.length - 1) {
          setShowResult(true);
        } else {
          setCurrentStep((prev) => prev + 1);
        }
      } else {
        if (showResult) {
          setShowResult(false);
        } else {
          setCurrentStep((prev) => Math.max(0, prev - 1));
        }
      }
      setIsAnimating(false);
    }, 250);
  };

  // KOR: 특정 입력 필드 업데이트 헬퍼
  // ENG: Helper to update a specific input field
  const updateInput = <K extends keyof DiagnosisInput>(key: K, value: DiagnosisInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  // KOR: 경로 카드 아코디언 토글
  // ENG: Toggle accordion for a pathway card
  const togglePathway = (id: string) => {
    setExpandedPathways((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // KOR: 국적 필터링
  // ENG: Filtered country list
  const filteredCountries = popularCountries.filter(
    (c) =>
      (c.nameKo ?? '').toLowerCase().includes(countrySearch.toLowerCase()) ||
      (c.nameEn ?? '').toLowerCase().includes(countrySearch.toLowerCase()) ||
      (c.code ?? '').toLowerCase().includes(countrySearch.toLowerCase())
  );

  // KOR: 브레드크럼 단계 표시 (결과 화면에서도 6번째로 표시)
  // ENG: Breadcrumb step display (shown as step 6 on result screen)
  const displayStep = showResult ? STEPS.length : currentStep;

  // KOR: 단계별 카드 콘텐츠 렌더링
  // ENG: Render card content for each step
  const renderStepContent = () => {
    if (!stepMeta) return null;
    const key = stepMeta.key;

    // 국적 선택 / Nationality selection
    if (key === 'nationality') {
      return (
        <div className="space-y-4">
          {/* 검색창 / Search input */}
          <input
            type="text"
            placeholder="국가 검색 / Search country..."
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-amber-100 bg-white focus:outline-none focus:border-orange-400 text-gray-700 placeholder-gray-400 text-sm"
          />
          {/* 국가 그리드 / Country grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => updateInput('nationality', country.name)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 ${
                  input.nationality === country.name
                    ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-100'
                    : 'border-amber-100 bg-white hover:border-orange-300 hover:bg-orange-50/50'
                }`}
              >
                <span className="text-2xl shrink-0">{country.flag}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{country.name}</p>
                  <p className="text-xs text-gray-400">{country.code}</p>
                </div>
                {input.nationality === country.name && (
                  <Check className="w-4 h-4 text-orange-500 ml-auto shrink-0" />
                )}
              </button>
            ))}
          </div>
          {/* 직접 입력 / Direct input fallback */}
          {filteredCountries.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-2">목록에 없으면 직접 입력하세요 / Enter manually if not in list</p>
              <input
                type="text"
                placeholder="국가명 입력..."
                value={input.nationality}
                onChange={(e) => updateInput('nationality', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-orange-300 bg-white focus:outline-none focus:border-orange-500 text-gray-700 text-sm"
              />
            </div>
          )}
        </div>
      );
    }

    // 나이 입력 / Age input
    if (key === 'age') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-4">
              <button
                onClick={() => updateInput('age', Math.max(18, input.age - 1))}
                className="w-12 h-12 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 text-2xl font-bold transition-colors flex items-center justify-center"
              >
                −
              </button>
              <div className="w-28 text-center">
                <span className="text-6xl font-bold text-gray-800">{input.age}</span>
                <p className="text-sm text-gray-400 mt-1">세 (만 나이)</p>
              </div>
              <button
                onClick={() => updateInput('age', Math.min(70, input.age + 1))}
                className="w-12 h-12 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 text-2xl font-bold transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          {/* 슬라이더 / Range slider */}
          <div className="px-2">
            <input
              type="range"
              min={18}
              max={70}
              value={input.age}
              onChange={(e) => updateInput('age', parseInt(e.target.value, 10))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>18세</span>
              <span>70세</span>
            </div>
          </div>
          {/* 빠른 선택 / Quick age select */}
          <div className="flex gap-2 flex-wrap justify-center">
            {[20, 25, 30, 35, 40].map((age) => (
              <button
                key={age}
                onClick={() => updateInput('age', age)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                  input.age === age
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-amber-100 bg-white text-gray-600 hover:border-orange-300'
                }`}
              >
                {age}세
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 학력 선택 / Education selection
    if (key === 'educationLevel') {
      return (
        <div className="space-y-3">
          {educationOptions.map((edu, idx) => {
            const icons = ['📘', '🎓', '🏛️', '🔬', '🏆'];
            return (
              <button
                key={edu}
                onClick={() => updateInput('educationLevel', edu)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  input.educationLevel === edu
                    ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-100'
                    : 'border-amber-100 bg-white hover:border-orange-300 hover:bg-orange-50/40'
                }`}
              >
                <span className="text-2xl shrink-0">{icons[idx] ?? '📄'}</span>
                <span className="text-sm font-medium text-gray-800">{edu}</span>
                {input.educationLevel === edu && (
                  <Check className="w-5 h-5 text-orange-500 ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      );
    }

    // 자금 선택 / Fund selection
    if (key === 'availableAnnualFund') {
      return (
        <div className="space-y-3">
          {fundOptions.map((fund, idx) => {
            const labels = ['소액형', '기본형', '표준형', '여유형', '프리미엄'];
            const colors = [
              'from-gray-100 to-gray-200',
              'from-amber-50 to-orange-100',
              'from-orange-100 to-coral-100',
              'from-orange-200 to-red-100',
              'from-red-100 to-rose-200',
            ];
            return (
              <button
                key={fund}
                onClick={() => updateInput('availableAnnualFund', fund)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  input.availableAnnualFund === fund
                    ? 'border-orange-500 shadow-md shadow-orange-100'
                    : 'border-amber-100 hover:border-orange-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${colors[idx]} flex items-center justify-center shrink-0`}>
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{fund}</p>
                  <p className="text-xs text-gray-400">{labels[idx]}</p>
                </div>
                {input.availableAnnualFund === fund && (
                  <Check className="w-5 h-5 text-orange-500 ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      );
    }

    // 최종 목표 선택 / Final goal selection
    if (key === 'finalGoal') {
      const goalIcons = ['🗣️', '💼', '🏢', '📚', '🏠'];
      return (
        <div className="space-y-3">
          {goalOptions.map((goal, idx) => (
            <button
              key={goal}
              onClick={() => updateInput('finalGoal', goal)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all duration-200 ${
                input.finalGoal === goal
                  ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-100'
                  : 'border-amber-100 bg-white hover:border-orange-300 hover:bg-orange-50/40'
              }`}
            >
              <span className="text-2xl shrink-0">{goalIcons[idx] ?? '🎯'}</span>
              <span className="text-sm font-medium text-gray-800">{goal}</span>
              {input.finalGoal === goal && (
                <Check className="w-5 h-5 text-orange-500 ml-auto shrink-0" />
              )}
            </button>
          ))}
        </div>
      );
    }

    // 우선순위 선택 / Priority selection
    if (key === 'priorityPreference') {
      const priorityIcons = ['⚡', '💰', '✅', '🔍'];
      const priorityDescs = ['가장 빠르게 한국에 체류 가능한 경로', '총 비용을 최소화하는 경로', '성공 가능성이 가장 높은 경로', '특정 직업 및 분야 중심의 경로'];
      return (
        <div className="space-y-3">
          {priorityOptions.map((priority, idx) => (
            <button
              key={priority}
              onClick={() => updateInput('priorityPreference', priority)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all duration-200 ${
                input.priorityPreference === priority
                  ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-100'
                  : 'border-amber-100 bg-white hover:border-orange-300 hover:bg-orange-50/40'
              }`}
            >
              <span className="text-2xl shrink-0">{priorityIcons[idx] ?? '⭐'}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{priority}</p>
                <p className="text-xs text-gray-400">{priorityDescs[idx]}</p>
              </div>
              {input.priorityPreference === priority && (
                <Check className="w-5 h-5 text-orange-500 ml-auto shrink-0" />
              )}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  // KOR: 결과 화면 렌더링
  // ENG: Result screen rendering
  const renderResult = () => {
    const pathways = mockDiagnosisResult.pathways;
    return (
      <div className="space-y-6">
        {/* 결과 요약 헤더 / Result summary header */}
        <div className="bg-linear-to-br from-orange-500 to-red-400 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">
                {pathways.length}개 비자 경로를 찾았습니다!
              </h2>
              <p className="text-orange-100 text-sm">
                {input.nationality} 국적, {input.age}세 · {input.educationLevel} 기준
              </p>
              <p className="text-orange-100 text-xs mt-1">목표: {input.finalGoal}</p>
            </div>
          </div>
          {/* 입력 요약 태그 / Input summary tags */}
          <div className="flex gap-2 flex-wrap mt-4">
            {[input.availableAnnualFund, input.priorityPreference].map((tag) => (
              <span key={tag} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 여행 일정표 스타일 경로 목록 / Travel itinerary-style pathway list */}
        <div className="space-y-4">
          {pathways.map((pathway, idx) => {
            const isExpanded = !!expandedPathways[pathway.id];
            const scoreBarClass = getBarColorClass(pathway.feasibilityScore);
            const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);
            const scoreColorClass = getScoreColor(pathway.feasibilityLabel);

            return (
              <div
                key={pathway.id}
                className={`bg-white rounded-2xl border-2 border-l-4 overflow-hidden shadow-sm transition-all duration-300 ${
                  idx === 0
                    ? 'border-orange-200 border-l-orange-500'
                    : idx === 1
                    ? 'border-amber-200 border-l-amber-400'
                    : 'border-gray-200 border-l-gray-400'
                }`}
              >
                {/* 카드 헤더 / Card header */}
                <button
                  onClick={() => togglePathway(pathway.id)}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-start gap-3">
                    {/* 순위 배지 / Rank badge */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                        idx === 0 ? 'bg-orange-500' : idx === 1 ? 'bg-amber-400' : 'bg-gray-400'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-bold text-gray-800 truncate">{pathway.name}</h3>
                        <span className="text-base shrink-0">{emoji}</span>
                      </div>

                      {/* 비자 체인 표시 / Visa chain display */}
                      <div className="flex items-center gap-1 flex-wrap mb-3">
                        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((vc, vcIdx) => (
                          <React.Fragment key={vc.visa}>
                            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-md">
                              {vc.visa}
                            </span>
                            {vcIdx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                              <ArrowRight className="w-3 h-3 text-gray-400" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* 핵심 지표 행 / Key metrics row */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-0.5">실현가능성</p>
                          <p className="text-sm font-bold text-gray-700">{pathway.feasibilityScore}점</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-0.5">소요 기간</p>
                          <p className="text-sm font-bold text-gray-700">{pathway.totalDurationMonths}개월</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-0.5">예상 비용</p>
                          <p className="text-sm font-bold text-gray-700">${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* 점수 진행 바 / Score progress bar */}
                      <div className="mt-3 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${scoreBarClass}`}
                          style={{ width: `${pathway.feasibilityScore}%` }}
                        />
                      </div>
                    </div>

                    {/* 펼치기 아이콘 / Expand icon */}
                    <div className="shrink-0 text-gray-400 mt-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </button>

                {/* 펼쳐진 상세 내용 (여행 일정표 스타일) / Expanded details (travel itinerary style) */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 pb-5">
                    {/* 설명 / Description */}
                    <p className="text-sm text-gray-600 mt-4 mb-4 leading-relaxed bg-orange-50 rounded-xl p-3">
                      {pathway.description}
                    </p>

                    {/* 마일스톤 타임라인 / Milestone timeline */}
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      단계별 로드맵 / Step-by-step Roadmap
                    </h4>
                    <div className="relative pl-6">
                      {/* 수직선 / Vertical line */}
                      <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-orange-200" />

                      {pathway.milestones.map((milestone, mIdx) => (
                        <div key={mIdx} className="relative mb-4 last:mb-0">
                          {/* 타임라인 점 / Timeline dot */}
                          <div className="absolute -left-3.5 top-1 w-5 h-5 rounded-full bg-white border-2 border-orange-400 flex items-center justify-center">
                            <span className="text-xs">{milestone.emoji}</span>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-xs">
                            <p className="text-sm font-semibold text-gray-800 mb-0.5">
                              Step {mIdx + 1}. {milestone.title}
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 비자 체인 상세 / Visa chain details */}
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-3">
                      비자 전환 체인 / Visa Transition Chain
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((vc, vcIdx) => (
                        <div
                          key={vcIdx}
                          className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-orange-700">{vc.visa}</p>
                            <p className="text-xs text-gray-500">{vc.duration}</p>
                          </div>
                          {vcIdx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                            <ArrowRight className="w-3.5 h-3.5 text-orange-300 ml-1" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* 실현가능성 배지 / Feasibility badge */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-full ${scoreColorClass}`}>
                        {emoji} {pathway.feasibilityLabel}
                      </span>
                      <span className="text-xs text-gray-500">
                        총 {pathway.totalDurationMonths}개월 · ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 다시 시작 버튼 / Restart button */}
        <button
          onClick={() => {
            setShowResult(false);
            setCurrentStep(0);
            setInput(INITIAL_INPUT);
            setExpandedPathways({});
            setCountrySearch('');
          }}
          className="w-full py-3 rounded-xl border-2 border-orange-200 text-orange-600 font-semibold text-sm hover:bg-orange-50 transition-colors"
        >
          다시 진단하기 / Start Over
        </button>
      </div>
    );
  };

  // KOR: 프리뷰 사이드바에 표시할 현재 입력 요약
  // ENG: Current input summary for preview sidebar
  const previewItems: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: '국적', value: input.nationality || '—', icon: <MapPin className="w-3.5 h-3.5" /> },
    { label: '나이', value: input.age ? `${input.age}세` : '—', icon: <Calendar className="w-3.5 h-3.5" /> },
    { label: '학력', value: input.educationLevel || '—', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { label: '자금', value: input.availableAnnualFund || '—', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { label: '목표', value: input.finalGoal || '—', icon: <Target className="w-3.5 h-3.5" /> },
    { label: '우선순위', value: input.priorityPreference || '—', icon: <Star className="w-3.5 h-3.5" /> },
  ];

  return (
    // KOR: 전체 래퍼 — 코랄+웜 화이트 배경
    // ENG: Full wrapper — coral + warm white background
    <div className="min-h-screen bg-amber-50 font-sans">
      {/* 상단 헤더 / Top header */}
      <header className="bg-white border-b border-amber-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-500 to-red-400 flex items-center justify-center shadow-md">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-800">잡차자 비자 진단</h1>
              <p className="text-xs text-gray-400">JobChaJa Visa Diagnosis</p>
            </div>
          </div>
          {/* 진행률 표시 / Progress display */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4 text-orange-400" />
            <span>약 2분 소요</span>
          </div>
        </div>
      </header>

      {/* 브레드크럼 진행 바 / Breadcrumb progress bar */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          {/* 단계 점 표시 / Step dot indicators */}
          <div className="flex items-center gap-1">
            {STEPS.map((step, idx) => (
              <React.Fragment key={step.key}>
                <button
                  onClick={() => {
                    if (!showResult && idx < currentStep) {
                      setCurrentStep(idx);
                    }
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0 ${
                    showResult || idx < currentStep
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                      : idx === currentStep && !showResult
                      ? 'bg-orange-100 text-orange-600 border-2 border-orange-400'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  title={step.title}
                >
                  {showResult || idx < currentStep ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </button>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                      showResult || idx < currentStep ? 'bg-orange-400' : 'bg-gray-100'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
            {/* 결과 점 / Result dot */}
            <div className={`w-1.5 h-1.5 mx-1 bg-gray-200 rounded-full`} />
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                showResult ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'bg-gray-100 text-gray-400'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 단계 라벨 / Step label */}
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {showResult ? '분석 결과' : `${currentStep + 1} / ${STEPS.length} 단계`}
            </p>
            <p className="text-xs text-orange-500 font-medium">
              {showResult ? '완료!' : `${Math.round(((currentStep) / STEPS.length) * 100)}% 완료`}
            </p>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 / Main content area */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8 items-start">
          {/* 왼쪽: 카드 위자드 / Left: Card wizard */}
          <div className="flex-1 min-w-0">
            {/* 카드 컨테이너 / Card container */}
            <div
              className={`bg-white rounded-3xl shadow-lg shadow-orange-100/50 border border-amber-100 overflow-hidden transition-all duration-250 ${
                isAnimating
                  ? slideDirection === 'next'
                    ? 'opacity-0 -translate-x-4'
                    : 'opacity-0 translate-x-4'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              {!showResult ? (
                <>
                  {/* 카드 헤더 / Card header */}
                  <div className="bg-linear-to-r from-orange-50 to-amber-50 px-6 py-5 border-b border-amber-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-red-400 text-white flex items-center justify-center shadow-md">
                        {stepMeta?.icon}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">{stepMeta?.title}</h2>
                        <p className="text-sm text-gray-500">{stepMeta?.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* 카드 바디 / Card body */}
                  <div className="px-6 py-6">{renderStepContent()}</div>

                  {/* 카드 푸터 — 네비게이션 / Card footer — navigation */}
                  <div className="px-6 py-5 border-t border-amber-100 bg-amber-50/50 flex items-center justify-between">
                    {/* 뒤로가기 / Back button */}
                    <button
                      onClick={() => goToStep('prev')}
                      disabled={currentStep === 0}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        currentStep === 0
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-amber-200'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      이전 / Back
                    </button>

                    {/* 단계 표시 / Step indicator */}
                    <div className="flex gap-1.5">
                      {STEPS.map((_, idx) => (
                        <div
                          key={idx}
                          className={`rounded-full transition-all duration-300 ${
                            idx === currentStep
                              ? 'w-5 h-1.5 bg-orange-500'
                              : idx < currentStep
                              ? 'w-1.5 h-1.5 bg-orange-300'
                              : 'w-1.5 h-1.5 bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* 다음/제출 버튼 / Next/Submit button */}
                    <button
                      onClick={() => goToStep('next')}
                      disabled={!isCurrentStepValid()}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        isCurrentStepValid()
                          ? 'bg-linear-to-r from-orange-500 to-red-400 text-white shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 hover:-translate-y-0.5'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {currentStep === STEPS.length - 1 ? (
                        <>
                          <TrendingUp className="w-4 h-4" />
                          진단 시작!
                        </>
                      ) : (
                        <>
                          다음 / Next
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* 결과 화면 헤더 / Result screen header */}
                  <div className="bg-linear-to-r from-orange-50 to-amber-50 px-6 py-5 border-b border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-red-400 text-white flex items-center justify-center shadow-md">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">비자 경로 분석 결과</h2>
                        <p className="text-sm text-gray-500">Visa Pathway Analysis Results</p>
                      </div>
                    </div>
                    <button
                      onClick={() => goToStep('prev')}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      수정
                    </button>
                  </div>

                  {/* 결과 바디 / Result body */}
                  <div className="px-6 py-6">{renderResult()}</div>
                </>
              )}
            </div>

            {/* 하단 안내 / Bottom notice */}
            <p className="text-center text-xs text-gray-400 mt-4">
              이 결과는 참고용이며, 실제 비자 심사는 출입국 당국의 기준을 따릅니다.
              <br />
              This result is for reference only. Actual visa review follows immigration authority standards.
            </p>
          </div>

          {/* 오른쪽: 프리뷰 사이드바 / Right: Preview sidebar */}
          <div className="w-64 shrink-0 hidden lg:block">
            {/* 입력 요약 카드 / Input summary card */}
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden mb-4">
              <div className="bg-linear-to-r from-orange-500 to-red-400 px-4 py-3">
                <h3 className="text-sm font-bold text-white">내 정보 요약</h3>
                <p className="text-orange-100 text-xs">My Profile Summary</p>
              </div>
              <div className="p-4 space-y-3">
                {previewItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-orange-100 text-orange-500 flex items-center justify-center mt-0.5 shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className={`text-xs font-semibold truncate ${item.value === '—' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 경로 힌트 카드 / Pathway hint card */}
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-amber-50">
                <h3 className="text-sm font-bold text-gray-700">추천 비자 유형</h3>
                <p className="text-xs text-gray-400">Based on your profile</p>
              </div>
              <div className="p-4 space-y-2">
                {['D-2 유학', 'E-7 특정활동', 'F-2 거주', 'E-9 비전문취업', 'D-4 어학연수'].map((visa, idx) => (
                  <div key={visa} className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        idx === 0 ? 'bg-orange-500' : idx === 1 ? 'bg-amber-400' : 'bg-gray-300'
                      }`}
                    />
                    <span className={`text-xs ${idx < 2 ? 'font-semibold text-gray-700' : 'text-gray-400'}`}>{visa}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 통계 카드 / Stats card */}
            <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-2xl border border-amber-200 p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">잡차자 진단 통계</h3>
              <div className="space-y-2">
                {[
                  { label: '진단 완료', value: '12,847명', icon: '👥' },
                  { label: '평균 적합 경로', value: '3.2개', icon: '🗺️' },
                  { label: '비자 취득 성공률', value: '87%', icon: '🎉' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{stat.icon}</span>
                      <span className="text-xs text-gray-500">{stat.label}</span>
                    </div>
                    <span className="text-xs font-bold text-orange-600">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
