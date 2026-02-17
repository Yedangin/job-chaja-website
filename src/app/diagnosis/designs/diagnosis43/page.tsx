'use client';

// KOR: 디자인 #43 — 호텔 예약 컨셉의 비자 진단 페이지
// ENG: Design #43 — Visa diagnosis page with Hotel Booking concept (Airbnb/Booking.com style)

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
  Search,
  MapPin,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Calendar,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  X,
  SlidersHorizontal,
  Globe,
  Award,
  Layers,
  TrendingUp,
  Home,
  Wifi,
  Coffee,
  Shield,
  ChevronDown,
} from 'lucide-react';

// KOR: 비자 경로를 호텔 카드 데이터로 변환하는 헬퍼 타입
// ENG: Helper type for mapping visa pathway to hotel card data
interface HotelCardData {
  pathway: RecommendedPathway;
  images: string[];
  amenities: string[];
  reviewCount: number;
  location: string;
  badge?: string;
}

// KOR: 각 비자 경로에 호텔 메타데이터를 매핑
// ENG: Map hotel metadata to each visa pathway
const buildHotelData = (pathway: RecommendedPathway): HotelCardData => {
  // KOR: 실현 가능성에 따라 아메니티 배지 결정
  // ENG: Determine amenity badges based on feasibility
  const amenityMap: Record<string, string[]> = {
    '매우 높음': ['빠른 승인', '서류 간소화', '성공 보장', '비용 최소화'],
    '높음': ['높은 성공률', '안정적 경로', '체계적 지원'],
    '보통': ['단계별 가이드', '조건 충족 필요'],
    '낮음': ['난이도 높음', '전문가 상담 권장'],
    '매우 낮음': ['매우 어려움', '대안 경로 검토'],
  };

  // KOR: 비자 체인에서 지역명 생성
  // ENG: Generate location string from visa chain
  const location = (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v) => v.visa).join(' → ');

  // KOR: 리뷰 수는 실현 가능성 점수에 비례하여 설정
  // ENG: Review count proportional to feasibility score
  const reviewCount = Math.round((pathway.feasibilityScore / 100) * 2400 + 100);

  // KOR: 경로 특성에 따라 뱃지 부여
  // ENG: Assign badge based on pathway characteristics
  const badge =
    pathway.feasibilityScore >= 80
      ? '인기 경로'
      : pathway.feasibilityScore >= 70
      ? '추천'
      : undefined;

  return {
    pathway,
    images: [],
    amenities: amenityMap[pathway.feasibilityLabel] ?? ['가이드 제공'],
    reviewCount,
    location,
    badge,
  };
};

// KOR: 입력 단계 순서 정의
// ENG: Define input step order
const STEPS = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
] as const;

type StepKey = (typeof STEPS)[number];

// KOR: 각 단계의 라벨 및 아이콘 정의
// ENG: Define label and icon for each step
const stepMeta: Record<StepKey, { label: string; labelEn: string; icon: React.ReactNode }> = {
  nationality: {
    label: '국적',
    labelEn: 'Nationality',
    icon: <Globe size={18} />,
  },
  age: {
    label: '나이',
    labelEn: 'Age',
    icon: <Calendar size={18} />,
  },
  educationLevel: {
    label: '학력',
    labelEn: 'Education',
    icon: <Award size={18} />,
  },
  availableAnnualFund: {
    label: '연간 예산',
    labelEn: 'Annual Budget',
    icon: <DollarSign size={18} />,
  },
  finalGoal: {
    label: '최종 목표',
    labelEn: 'Final Goal',
    icon: <TrendingUp size={18} />,
  },
  priorityPreference: {
    label: '우선순위',
    labelEn: 'Priority',
    icon: <SlidersHorizontal size={18} />,
  },
};

export default function Diagnosis43Page() {
  // KOR: 현재 입력 단계 인덱스
  // ENG: Current input step index
  const [currentStep, setCurrentStep] = useState<number>(0);

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 나이 직접 입력 값
  // ENG: Age direct input value
  const [ageInput, setAgeInput] = useState<string>('');

  // KOR: 진단 결과 표시 여부
  // ENG: Whether to show results
  const [showResults, setShowResults] = useState<boolean>(false);

  // KOR: 결과 데이터 (mockDiagnosisResult 사용)
  // ENG: Result data (using mockDiagnosisResult)
  const [result] = useState<DiagnosisResult>(mockDiagnosisResult);

  // KOR: 필터 패널 표시 여부
  // ENG: Whether to show filter panel
  const [showFilter, setShowFilter] = useState<boolean>(false);

  // KOR: 정렬 기준 상태
  // ENG: Sort criterion state
  const [sortBy, setSortBy] = useState<'score' | 'cost' | 'duration'>('score');

  // KOR: 즐겨찾기 상태 (경로 ID 집합)
  // ENG: Favorited pathway IDs
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // KOR: 확장된 카드 ID
  // ENG: Expanded card ID
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // KOR: 이미지 캐러셀 현재 인덱스 (경로 ID → 인덱스)
  // ENG: Carousel current index per pathway ID
  const [carouselIndex, setCarouselIndex] = useState<Record<string, number>>({});

  // KOR: 비교 선택된 경로 ID 목록 (최대 2개)
  // ENG: Selected pathway IDs for comparison (max 2)
  const [compareList, setCompareList] = useState<string[]>([]);

  // KOR: 비교 모달 표시 여부
  // ENG: Whether to show comparison modal
  const [showCompare, setShowCompare] = useState<boolean>(false);

  // KOR: 현재 단계 키
  // ENG: Current step key
  const currentKey = STEPS[currentStep];

  // KOR: 입력값 업데이트 함수
  // ENG: Function to update input value
  const handleSelect = (key: StepKey, value: string | number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  // KOR: 다음 단계로 이동
  // ENG: Go to next step
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  // KOR: 이전 단계로 이동
  // ENG: Go to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // KOR: 현재 단계 값 선택 여부 확인
  // ENG: Check whether current step value is selected
  const isCurrentStepSelected = (): boolean => {
    const val = input[currentKey];
    if (currentKey === 'age') return typeof val === 'number' && val > 0;
    return typeof val === 'string' && val.length > 0;
  };

  // KOR: 즐겨찾기 토글
  // ENG: Toggle favorite
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // KOR: 비교 목록 토글 (최대 2개)
  // ENG: Toggle compare list (max 2)
  const toggleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  // KOR: 캐러셀 이동 함수
  // ENG: Carousel navigation function
  const moveCarousel = (pathwayId: string, direction: 'prev' | 'next', total: number) => {
    setCarouselIndex((prev) => {
      const current = prev[pathwayId] ?? 0;
      const next =
        direction === 'next'
          ? (current + 1) % total
          : (current - 1 + total) % total;
      return { ...prev, [pathwayId]: next };
    });
  };

  // KOR: 정렬된 경로 목록 반환
  // ENG: Return sorted pathway list
  const getSortedPathways = (): RecommendedPathway[] => {
    const pathways = [...result.pathways];
    if (sortBy === 'score') return pathways.sort((a, b) => b.feasibilityScore - a.feasibilityScore);
    if (sortBy === 'cost') return pathways.sort((a, b) => ((a as any).estimatedCostUSD ?? a.estimatedCostWon ?? 0) - ((b as any).estimatedCostUSD ?? b.estimatedCostWon ?? 0));
    if (sortBy === 'duration') return pathways.sort((a, b) => a.totalDurationMonths - b.totalDurationMonths);
    return pathways;
  };

  // KOR: 비교 대상 경로 반환
  // ENG: Return pathways selected for comparison
  const getComparePathways = (): RecommendedPathway[] =>
    result.pathways.filter((p) => compareList.includes(p.id));

  // KOR: 색상 팔레트 — Airbnb 코랄 테마
  // ENG: Color palette — Airbnb coral theme
  const coral = {
    primary: 'bg-[#FF5A5F]',
    primaryHover: 'hover:bg-[#e04e53]',
    primaryText: 'text-[#FF5A5F]',
    primaryBorder: 'border-[#FF5A5F]',
    primaryLight: 'bg-[#FFF0F0]',
    gradient: 'bg-linear-to-br from-[#FF5A5F] to-[#FF8C69]',
  };

  // KOR: 캐러셀 배경색 팔레트 (이미지 대체)
  // ENG: Carousel background color palette (image placeholder)
  const carouselColors = [
    ['bg-[#FF5A5F]', 'bg-[#FF8C69]', 'bg-[#FFA07A]'],
    ['bg-[#4A90D9]', 'bg-[#5BA0E9]', 'bg-[#7BB5F0]'],
    ['bg-[#48BB78]', 'bg-[#38A169]', 'bg-[#68D391]'],
  ];

  // KOR: 실현 가능성 별점 계산 (5점 만점)
  // ENG: Calculate star rating from feasibility score (out of 5)
  const getStarRating = (score: number): number => Math.round((score / 100) * 5 * 10) / 10;

  // KOR: 별점 렌더링
  // ENG: Render star rating
  const renderStars = (score: number) => {
    const rating = getStarRating(score);
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={
              i < fullStars
                ? 'text-[#FF5A5F] fill-[#FF5A5F]'
                : i === fullStars && hasHalf
                ? 'text-[#FF5A5F] fill-[#FFB3B5]'
                : 'text-gray-300 fill-gray-200'
            }
          />
        ))}
        <span className="text-xs text-gray-600 ml-1 font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // ===== 검색/입력 화면 렌더링 =====
  // ===== Render Search/Input Screen =====
  if (!showResults) {
    return (
      <div className="min-h-screen bg-white">
        {/* KOR: 헤더 — Airbnb 스타일 */}
        {/* ENG: Header — Airbnb style */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FF5A5F] flex items-center justify-center">
                <Globe size={16} className="text-white" />
              </div>
              <span className="font-bold text-[#FF5A5F] text-lg tracking-tight">비자스테이</span>
              <span className="text-gray-400 text-xs hidden sm:block">by 잡차자</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <button className="hidden sm:block hover:text-[#FF5A5F] transition-colors">비자 가이드</button>
              <button className="hidden sm:block hover:text-[#FF5A5F] transition-colors">고객지원</button>
              <button className="border border-gray-300 rounded-full px-4 py-1.5 hover:border-[#FF5A5F] hover:text-[#FF5A5F] transition-colors text-xs font-medium">
                로그인
              </button>
            </div>
          </div>
        </header>

        {/* KOR: 히어로 섹션 — 호텔 예약 검색창 스타일 */}
        {/* ENG: Hero section — Hotel booking search bar style */}
        <div className="bg-linear-to-br from-[#FF5A5F] to-[#FF8C69] py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-white/80 text-sm font-medium mb-2 tracking-widest uppercase">
              Visa Booking Platform
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              원하는 비자를 예약하세요
            </h1>
            <p className="text-white/90 text-base mb-8">
              호텔 예약처럼 쉽게 — 내 조건에 맞는 최적의 비자 경로를 찾아드립니다
            </p>

            {/* KOR: 검색창 컨테이너 */}
            {/* ENG: Search bar container */}
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
              {/* KOR: 진행 단계 탭 표시 */}
              {/* ENG: Progress step tab display */}
              <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
                {STEPS.map((step, idx) => {
                  const meta = stepMeta[step];
                  const isDone = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <button
                      key={step}
                      onClick={() => idx <= currentStep && setCurrentStep(idx)}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        isCurrent
                          ? 'bg-[#FF5A5F] text-white border-[#FF5A5F]'
                          : isDone
                          ? 'bg-[#FFF0F0] text-[#FF5A5F] border-[#FF5A5F]/30'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {isDone ? <CheckCircle size={12} /> : meta.icon}
                      <span className="hidden sm:inline">{meta.label}</span>
                      <span className="sm:hidden">{idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              {/* KOR: 단계별 입력 UI */}
              {/* ENG: Step-by-step input UI */}
              <div className="text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#FFF0F0] flex items-center justify-center text-[#FF5A5F]">
                    {stepMeta[currentKey].icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base">{stepMeta[currentKey].label}</p>
                    <p className="text-xs text-gray-500">{stepMeta[currentKey].labelEn}</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-400">
                    {currentStep + 1} / {STEPS.length}
                  </div>
                </div>

                {/* KOR: 국적 선택 — 인기 국가 그리드 */}
                {/* ENG: Nationality selection — popular countries grid */}
                {currentKey === 'nationality' && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {popularCountries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleSelect('nationality', country.name)}
                        className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                          input.nationality === country.name
                            ? 'border-[#FF5A5F] bg-[#FFF0F0]'
                            : 'border-gray-200 hover:border-[#FF5A5F]/50'
                        }`}
                      >
                        <span className="text-2xl mb-1">{country.flag}</span>
                        <span className="text-xs font-medium text-gray-700">{country.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* KOR: 나이 입력 — 슬라이더 + 직접 입력 */}
                {/* ENG: Age input — slider + direct input */}
                {currentKey === 'age' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="range"
                          min={18}
                          max={65}
                          value={typeof input.age === 'number' ? input.age : 25}
                          onChange={(e) => {
                            handleSelect('age', Number(e.target.value));
                            setAgeInput(e.target.value);
                          }}
                          className="w-full accent-[#FF5A5F]"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>18세</span>
                          <span>65세</span>
                        </div>
                      </div>
                      <div className="shrink-0 w-20">
                        <input
                          type="number"
                          min={18}
                          max={65}
                          value={typeof input.age === 'number' ? input.age : ''}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 18 && val <= 65) handleSelect('age', val);
                          }}
                          placeholder="나이"
                          className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-center font-bold text-[#FF5A5F] text-lg focus:outline-none focus:border-[#FF5A5F]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[20, 25, 30, 35].map((age) => (
                        <button
                          key={age}
                          onClick={() => handleSelect('age', age)}
                          className={`py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                            input.age === age
                              ? 'border-[#FF5A5F] bg-[#FFF0F0] text-[#FF5A5F]'
                              : 'border-gray-200 text-gray-600 hover:border-[#FF5A5F]/50'
                          }`}
                        >
                          {age}세
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* KOR: 학력 선택 */}
                {/* ENG: Education level selection */}
                {currentKey === 'educationLevel' && (
                  <div className="space-y-2">
                    {educationOptions.map((edu) => (
                      <button
                        key={edu}
                        onClick={() => handleSelect('educationLevel', edu)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                          input.educationLevel === edu
                            ? 'border-[#FF5A5F] bg-[#FFF0F0] text-[#FF5A5F]'
                            : 'border-gray-200 text-gray-700 hover:border-[#FF5A5F]/50'
                        }`}
                      >
                        <span>{edu}</span>
                        {input.educationLevel === edu && <CheckCircle size={16} className="text-[#FF5A5F]" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* KOR: 연간 예산 선택 */}
                {/* ENG: Annual budget selection */}
                {currentKey === 'availableAnnualFund' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {fundOptions.map((fund) => (
                      <button
                        key={fund}
                        onClick={() => handleSelect('availableAnnualFund', fund)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                          input.availableAnnualFund === fund
                            ? 'border-[#FF5A5F] bg-[#FFF0F0]'
                            : 'border-gray-200 hover:border-[#FF5A5F]/50'
                        }`}
                      >
                        <DollarSign
                          size={18}
                          className={input.availableAnnualFund === fund ? 'text-[#FF5A5F]' : 'text-gray-400'}
                        />
                        <span
                          className={`text-sm font-medium ${
                            input.availableAnnualFund === fund ? 'text-[#FF5A5F]' : 'text-gray-700'
                          }`}
                        >
                          {fund}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* KOR: 최종 목표 선택 */}
                {/* ENG: Final goal selection */}
                {currentKey === 'finalGoal' && (
                  <div className="space-y-2">
                    {goalOptions.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => handleSelect('finalGoal', goal)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                          input.finalGoal === goal
                            ? 'border-[#FF5A5F] bg-[#FFF0F0] text-[#FF5A5F] font-semibold'
                            : 'border-gray-200 text-gray-700 hover:border-[#FF5A5F]/50'
                        }`}
                      >
                        <span>{goal}</span>
                        {input.finalGoal === goal && <CheckCircle size={16} className="text-[#FF5A5F]" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* KOR: 우선순위 선택 */}
                {/* ENG: Priority preference selection */}
                {currentKey === 'priorityPreference' && (
                  <div className="grid grid-cols-2 gap-3">
                    {priorityOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelect('priorityPreference', opt)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          input.priorityPreference === opt
                            ? 'border-[#FF5A5F] bg-[#FFF0F0]'
                            : 'border-gray-200 hover:border-[#FF5A5F]/50'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            input.priorityPreference === opt ? 'bg-[#FF5A5F]' : 'bg-gray-100'
                          }`}
                        >
                          {opt.includes('빠른') && (
                            <Clock size={18} className={input.priorityPreference === opt ? 'text-white' : 'text-gray-500'} />
                          )}
                          {opt.includes('저렴') && (
                            <DollarSign size={18} className={input.priorityPreference === opt ? 'text-white' : 'text-gray-500'} />
                          )}
                          {opt.includes('성공률') && (
                            <Shield size={18} className={input.priorityPreference === opt ? 'text-white' : 'text-gray-500'} />
                          )}
                          {opt.includes('직업') && (
                            <Layers size={18} className={input.priorityPreference === opt ? 'text-white' : 'text-gray-500'} />
                          )}
                        </div>
                        <span
                          className={`text-xs font-medium text-center ${
                            input.priorityPreference === opt ? 'text-[#FF5A5F]' : 'text-gray-600'
                          }`}
                        >
                          {opt}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* KOR: 하단 네비게이션 버튼 */}
              {/* ENG: Bottom navigation buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-600 text-sm font-medium hover:border-gray-400 transition-colors"
                  >
                    <ChevronLeft size={16} />
                    이전
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!isCurrentStepSelected()}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                    isCurrentStepSelected()
                      ? 'bg-[#FF5A5F] text-white hover:bg-[#e04e53] shadow-lg shadow-[#FF5A5F]/30'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {currentStep === STEPS.length - 1 ? (
                    <>
                      <Search size={16} />
                      비자 검색하기
                    </>
                  ) : (
                    <>
                      다음
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KOR: 하단 신뢰 지표 섹션 */}
        {/* ENG: Bottom trust indicator section */}
        <div className="bg-gray-50 py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-xs text-gray-500 mb-6 uppercase tracking-widest">왜 비자스테이인가요?</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { icon: <Shield size={24} />, title: '31개 비자 유형', desc: '완전 커버리지' },
                { icon: <CheckCircle size={24} />, title: '2,629개 테스트', desc: '검증된 알고리즘' },
                { icon: <Star size={24} />, title: '98% 만족도', desc: '실제 사용자 기준' },
                { icon: <Globe size={24} />, title: '12개 언어', desc: '다국어 지원' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#FFF0F0] flex items-center justify-center text-[#FF5A5F]">
                    {item.icon}
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== 결과 화면 렌더링 — 호텔 목록 스타일 =====
  // ===== Render Results Screen — Hotel Listing Style =====
  const sortedPathways = getSortedPathways();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* KOR: 결과 헤더 */}
      {/* ENG: Results header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* KOR: 뒤로가기 + 로고 */}
            {/* ENG: Back button + logo */}
            <button
              onClick={() => setShowResults(false)}
              className="flex items-center gap-1 text-gray-600 hover:text-[#FF5A5F] transition-colors text-sm"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">수정</span>
            </button>

            {/* KOR: 검색 요약 바 */}
            {/* ENG: Search summary bar */}
            <button
              onClick={() => setShowResults(false)}
              className="flex-1 flex items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition-colors"
            >
              <Search size={14} className="text-gray-500 shrink-0" />
              <div className="text-left overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {input.nationality ?? mockInput.nationality} ·{' '}
                  {input.age ?? mockInput.age}세 · {input.educationLevel ?? mockInput.educationLevel}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {input.finalGoal ?? mockInput.finalGoal}
                </p>
              </div>
            </button>

            {/* KOR: 필터 버튼 */}
            {/* ENG: Filter button */}
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className={`flex items-center gap-1.5 border-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                showFilter
                  ? 'border-[#FF5A5F] bg-[#FFF0F0] text-[#FF5A5F]'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              <SlidersHorizontal size={14} />
              필터
            </button>
          </div>
        </div>
      </header>

      {/* KOR: 필터 패널 드롭다운 */}
      {/* ENG: Filter panel dropdown */}
      {showFilter && (
        <div className="bg-white border-b border-gray-200 shadow-sm px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-xs font-semibold text-gray-700">정렬:</span>
              {(['score', 'cost', 'duration'] as const).map((key) => {
                const labels = { score: '성공률 높은순', cost: '비용 낮은순', duration: '기간 짧은순' };
                return (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                      sortBy === key
                        ? 'border-[#FF5A5F] bg-[#FF5A5F] text-white'
                        : 'border-gray-200 text-gray-600 hover:border-[#FF5A5F]/50'
                    }`}
                  >
                    {labels[key]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* KOR: 결과 요약 타이틀 */}
        {/* ENG: Results summary title */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            {result.pathways.length}개의 비자 경로를 찾았습니다
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {input.nationality ?? mockInput.nationality} 국적 ·{' '}
            {input.age ?? mockInput.age}세 · {input.educationLevel ?? mockInput.educationLevel}
          </p>
        </div>

        {/* KOR: 비교하기 플로팅 배너 */}
        {/* ENG: Floating comparison banner */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4">
            <span className="text-sm font-medium">
              {compareList.length}개 경로 선택됨
            </span>
            <button
              onClick={() => setShowCompare(true)}
              disabled={compareList.length < 2}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                compareList.length >= 2
                  ? 'bg-[#FF5A5F] hover:bg-[#e04e53]'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              비교하기
            </button>
            <button onClick={() => setCompareList([])} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
        )}

        {/* KOR: 호텔 카드 목록 */}
        {/* ENG: Hotel card list */}
        <div className="space-y-5">
          {sortedPathways.map((pathway, idx) => {
            const hotelData = buildHotelData(pathway);
            const colorPalette = carouselColors[idx % carouselColors.length];
            const slideIdx = carouselIndex[pathway.id] ?? 0;
            const isExpanded = expandedCard === pathway.id;
            const isFav = favorites.has(pathway.id);
            const isComparing = compareList.includes(pathway.id);
            const starRating = getStarRating(pathway.feasibilityScore);

            return (
              <div
                key={pathway.id}
                className={`bg-white rounded-2xl shadow-sm border transition-all overflow-hidden ${
                  isComparing ? 'border-[#FF5A5F] ring-2 ring-[#FF5A5F]/20' : 'border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* KOR: 이미지 캐러셀 영역 (색상 슬라이드로 대체) */}
                  {/* ENG: Image carousel area (replaced with color slides) */}
                  <div className="relative sm:w-72 shrink-0 h-48 sm:h-auto overflow-hidden rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl">
                    {/* KOR: 현재 슬라이드 배경 */}
                    {/* ENG: Current slide background */}
                    <div
                      className={`absolute inset-0 ${colorPalette[slideIdx % colorPalette.length]} flex flex-col items-center justify-center text-white transition-all`}
                    >
                      <div className="text-5xl mb-2">{getFeasibilityEmoji(pathway.feasibilityLabel)}</div>
                      <p className="text-xs font-medium opacity-80">{pathway.visaChain[0]?.visa}</p>
                    </div>

                    {/* KOR: 캐러셀 이동 버튼 */}
                    {/* ENG: Carousel navigation buttons */}
                    <button
                      onClick={() => moveCarousel(pathway.id, 'prev', colorPalette.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    >
                      <ChevronLeft size={14} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => moveCarousel(pathway.id, 'next', colorPalette.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    >
                      <ChevronRight size={14} className="text-gray-700" />
                    </button>

                    {/* KOR: 슬라이드 인디케이터 */}
                    {/* ENG: Slide indicator dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {colorPalette.map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            i === slideIdx ? 'bg-white w-3' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>

                    {/* KOR: 즐겨찾기 버튼 */}
                    {/* ENG: Favorite button */}
                    <button
                      onClick={() => toggleFavorite(pathway.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    >
                      <Heart
                        size={15}
                        className={isFav ? 'text-[#FF5A5F] fill-[#FF5A5F]' : 'text-gray-600'}
                      />
                    </button>

                    {/* KOR: 인기 뱃지 */}
                    {/* ENG: Popular badge */}
                    {hotelData.badge && (
                      <div className="absolute top-3 left-3 bg-[#FF5A5F] text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                        {hotelData.badge}
                      </div>
                    )}
                  </div>

                  {/* KOR: 카드 본문 영역 */}
                  {/* ENG: Card body area */}
                  <div className="flex-1 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        {/* KOR: 경로 이름 */}
                        {/* ENG: Pathway name */}
                        <h3 className="font-bold text-gray-900 text-base leading-snug">{pathway.name}</h3>
                        {/* KOR: 비자 체인 위치 표시 */}
                        {/* ENG: Visa chain location display */}
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin size={12} className="text-gray-400 shrink-0" />
                          <p className="text-xs text-gray-500 truncate">{hotelData.location}</p>
                        </div>
                      </div>

                      {/* KOR: 점수 뱃지 */}
                      {/* ENG: Score badge */}
                      <div className="shrink-0 text-right">
                        <div className="text-xl font-bold text-[#FF5A5F]">{pathway.feasibilityScore}</div>
                        <div className="text-xs text-gray-500">성공지수</div>
                      </div>
                    </div>

                    {/* KOR: 별점 + 리뷰 수 */}
                    {/* ENG: Star rating + review count */}
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(pathway.feasibilityScore)}
                      <span className="text-xs text-gray-400">({hotelData.reviewCount.toLocaleString()}명 이용)</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${getScoreColor(pathway.feasibilityLabel)}`}>
                        {pathway.feasibilityLabel}
                      </span>
                    </div>

                    {/* KOR: 아메니티 태그 */}
                    {/* ENG: Amenity tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {hotelData.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {/* KOR: 기간 + 비용 요약 */}
                    {/* ENG: Duration + cost summary */}
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-gray-700 font-medium">{pathway.totalDurationMonths}개월</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign size={14} className="text-gray-400" />
                        <span className="text-gray-700 font-medium">
                          ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers size={14} className="text-gray-400" />
                        <span className="text-gray-700 font-medium">{(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length}단계</span>
                      </div>
                    </div>

                    {/* KOR: 비자 체인 칩 */}
                    {/* ENG: Visa chain chips */}
                    <div className="flex items-center gap-1 flex-wrap mb-3">
                      {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                        <React.Fragment key={i}>
                          <span className="text-xs bg-[#FFF0F0] text-[#FF5A5F] font-bold px-2 py-0.5 rounded-lg border border-[#FF5A5F]/20">
                            {v.visa}
                          </span>
                          {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                            <ArrowRight size={10} className="text-gray-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* KOR: 하단 액션 버튼 */}
                    {/* ENG: Bottom action buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => toggleCompare(pathway.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          isComparing
                            ? 'border-[#FF5A5F] bg-[#FFF0F0] text-[#FF5A5F]'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {isComparing ? <CheckCircle size={12} /> : <Layers size={12} />}
                        {isComparing ? '선택됨' : '비교'}
                      </button>
                      <button
                        onClick={() => setExpandedCard(isExpanded ? null : pathway.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 text-gray-600 text-xs font-medium hover:border-gray-400 transition-all"
                      >
                        <ChevronDown
                          size={12}
                          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                        {isExpanded ? '접기' : '상세보기'}
                      </button>
                      <div className="flex-1" />
                      <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FF5A5F] hover:bg-[#e04e53] text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                        예약하기
                        <ArrowRight size={12} />
                      </button>
                    </div>

                    {/* KOR: 확장된 상세 패널 — 마일스톤 */}
                    {/* ENG: Expanded detail panel — milestones */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
                          체류 단계 (Milestones)
                        </p>
                        <div className="space-y-3">
                          {pathway.milestones.map((ms, i) => (
                            <div key={i} className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#FFF0F0] flex items-center justify-center text-base shrink-0">
                                {ms.emoji}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-900">{ms.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{ms.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3 italic">{pathway.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* KOR: 지도 핀 스타일 요약 (장식 요소) */}
        {/* ENG: Map pin style summary (decorative element) */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-[#FF5A5F]" />
            <h3 className="font-bold text-gray-900 text-sm">비자 경로 지도</h3>
            <span className="text-xs text-gray-400 ml-auto">경로별 위치 핀</span>
          </div>
          <div className="relative bg-linear-to-br from-blue-50 to-green-50 rounded-xl h-36 overflow-hidden">
            {/* KOR: 장식용 지도 배경 격자 */}
            {/* ENG: Decorative map background grid */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="absolute border-t border-gray-400 w-full" style={{ top: `${i * 20}%` }} />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="absolute border-l border-gray-400 h-full" style={{ left: `${i * 14}%` }} />
              ))}
            </div>
            {/* KOR: 경로 핀 배치 */}
            {/* ENG: Pathway pin placement */}
            {sortedPathways.map((pathway, idx) => {
              const positions = [
                { top: '20%', left: '20%' },
                { top: '50%', left: '50%' },
                { top: '30%', left: '75%' },
              ];
              const pos = positions[idx % positions.length];
              return (
                <div
                  key={pathway.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={pos}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-[#FF5A5F] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white hover:scale-110 transition-transform">
                      {pathway.feasibilityScore}
                    </div>
                    <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF5A5F] rounded-full" />
                    {/* KOR: 핀 툴팁 */}
                    {/* ENG: Pin tooltip */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      {((pathway as any).name ?? pathway.nameKo ?? '').split(' ')[0]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KOR: 비교 모달 */}
      {/* ENG: Comparison modal */}
      {showCompare && compareList.length >= 2 && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-bold text-gray-900">경로 비교</h3>
              <button
                onClick={() => setShowCompare(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {getComparePathways().map((pathway) => (
                <div key={pathway.id} className="space-y-3">
                  <div className="text-center p-3 bg-[#FFF0F0] rounded-xl">
                    <div className="text-3xl mb-1">{getFeasibilityEmoji(pathway.feasibilityLabel)}</div>
                    <p className="font-bold text-gray-900 text-xs leading-tight">{pathway.name}</p>
                  </div>
                  {[
                    { label: '성공지수', value: `${pathway.feasibilityScore}점` },
                    { label: '실현가능성', value: pathway.feasibilityLabel },
                    { label: '소요기간', value: `${pathway.totalDurationMonths}개월` },
                    { label: '예상비용', value: `$${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}` },
                    { label: '단계수', value: `${(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length}단계` },
                    { label: '별점', value: `${getStarRating(pathway.feasibilityScore)}점` },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-xs text-gray-500">{row.label}</span>
                      <span className="text-xs font-bold text-gray-900">{row.value}</span>
                    </div>
                  ))}
                  <button className="w-full py-2 bg-[#FF5A5F] hover:bg-[#e04e53] text-white rounded-xl text-xs font-bold transition-colors">
                    이 경로 선택
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
