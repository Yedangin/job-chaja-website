'use client';

// KOR: 비자 진단 디자인 #87 — 갤러리 전시 (Art Gallery) 스타일
// ENG: Visa diagnosis design #87 — Art Gallery style
// 컨셉: 아트 갤러리처럼 비자 경로를 작품으로 전시 / Concept: exhibit visa pathways as artworks in a gallery

import { useState } from 'react';
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
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Eye,
  FrameIcon,
  Star,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Maximize2,
  X,
  Info,
  Headphones,
  BookOpen,
  Award,
  Users,
  LayoutGrid,
  List,
} from 'lucide-react';

// KOR: 입력 단계 정의 / ENG: Input step definitions
type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

const STEPS: Step[] = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
];

// KOR: 각 단계의 전시 카탈로그 메타데이터 / ENG: Exhibition catalog metadata per step
const STEP_META: Record<Step, { title: string; titleEn: string; subtitle: string; catalogNo: string }> = {
  nationality: {
    title: '출신 국가',
    titleEn: 'Country of Origin',
    subtitle: '작가의 출신을 알려주세요',
    catalogNo: 'CAT-001',
  },
  age: {
    title: '나이',
    titleEn: 'Age',
    subtitle: '작가의 연령대를 선택해주세요',
    catalogNo: 'CAT-002',
  },
  educationLevel: {
    title: '학력',
    titleEn: 'Education Level',
    subtitle: '작가의 학문적 배경을 선택해주세요',
    catalogNo: 'CAT-003',
  },
  availableAnnualFund: {
    title: '연간 예산',
    titleEn: 'Annual Budget',
    subtitle: '작품 구입에 사용할 수 있는 예산을 선택해주세요',
    catalogNo: 'CAT-004',
  },
  finalGoal: {
    title: '최종 목표',
    titleEn: 'Final Goal',
    subtitle: '이 전시에서 무엇을 찾고 계신가요?',
    catalogNo: 'CAT-005',
  },
  priorityPreference: {
    title: '우선순위',
    titleEn: 'Priority Preference',
    subtitle: '어떤 가치를 가장 중시하시나요?',
    catalogNo: 'CAT-006',
  },
};

// KOR: 실현 가능성에 따른 갤러리 등급 레이블 / ENG: Gallery tier label by feasibility
const getFeasibilityGalleryLabel = (score: number): string => {
  if (score >= 80) return 'Masterpiece Collection';
  if (score >= 60) return 'Featured Works';
  if (score >= 40) return 'Emerging Artists';
  return 'Experimental';
};

// KOR: 비자 경로 색상 팔레트 / ENG: Color palette per pathway
const PATHWAY_ACCENTS = [
  { bg: 'bg-slate-900', text: 'text-slate-900', border: 'border-slate-900', light: 'bg-slate-50', accent: '#1e293b' },
  { bg: 'bg-stone-800', text: 'text-stone-800', border: 'border-stone-800', light: 'bg-stone-50', accent: '#292524' },
  { bg: 'bg-neutral-700', text: 'text-neutral-700', border: 'border-neutral-700', light: 'bg-neutral-50', accent: '#404040' },
  { bg: 'bg-zinc-800', text: 'text-zinc-800', border: 'border-zinc-800', light: 'bg-zinc-50', accent: '#27272a' },
  { bg: 'bg-gray-900', text: 'text-gray-900', border: 'border-gray-900', light: 'bg-gray-50', accent: '#111827' },
];

export default function Diagnosis87Page() {
  // KOR: 현재 입력 단계 / ENG: Current input step
  const [currentStep, setCurrentStep] = useState<number>(0);
  // KOR: 사용자 입력 상태 / ENG: User input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // KOR: 결과 표시 여부 / ENG: Whether to show results
  const [showResults, setShowResults] = useState<boolean>(false);
  // KOR: 확대 보기 경로 / ENG: Expanded pathway for detail view
  const [expandedPathway, setExpandedPathway] = useState<RecommendedPathway | null>(null);
  // KOR: 오디오 가이드 활성 / ENG: Audio guide active state
  const [audioActive, setAudioActive] = useState<boolean>(false);
  // KOR: 현재 오디오 가이드 경로 / ENG: Current audio guide pathway
  const [audioPathway, setAudioPathway] = useState<string | null>(null);
  // KOR: 갤러리 뷰 모드 / ENG: Gallery view mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // KOR: 선택된 내셔널리티 / ENG: Selected nationality
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  // KOR: 나이 입력값 / ENG: Age input value
  const [ageInput, setAgeInput] = useState<string>('');

  const step = STEPS[currentStep];
  const stepMeta = STEP_META[step];

  // KOR: 다음 단계로 이동 / ENG: Move to next step
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  // KOR: 이전 단계로 이동 / ENG: Move to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // KOR: 국가 선택 핸들러 / ENG: Country selection handler
  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setInput({ ...input, nationality: country });
  };

  // KOR: 옵션 선택 핸들러 / ENG: Option selection handler
  const handleOptionSelect = (field: keyof DiagnosisInput, value: string) => {
    setInput({ ...input, [field]: value });
  };

  // KOR: 나이 입력 핸들러 / ENG: Age input handler
  const handleAgeInput = (value: string) => {
    setAgeInput(value);
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setInput({ ...input, age: num });
    }
  };

  // KOR: 현재 단계 완료 여부 / ENG: Whether current step is complete
  const isStepComplete = (): boolean => {
    switch (step) {
      case 'nationality': return !!input.nationality;
      case 'age': return !!input.age;
      case 'educationLevel': return !!input.educationLevel;
      case 'availableAnnualFund': return !!input.availableAnnualFund;
      case 'finalGoal': return !!input.finalGoal;
      case 'priorityPreference': return !!input.priorityPreference;
      default: return false;
    }
  };

  // KOR: 오디오 가이드 토글 / ENG: Toggle audio guide for a pathway
  const toggleAudio = (pathwayId: string) => {
    if (audioPathway === pathwayId && audioActive) {
      setAudioActive(false);
      setAudioPathway(null);
    } else {
      setAudioActive(true);
      setAudioPathway(pathwayId);
    }
  };

  // KOR: 처음으로 돌아가기 / ENG: Reset to start
  const handleReset = () => {
    setCurrentStep(0);
    setInput({});
    setShowResults(false);
    setExpandedPathway(null);
    setSelectedCountry('');
    setAgeInput('');
  };

  // ============================================================
  // KOR: 결과 화면 렌더링 / ENG: Results screen rendering
  // ============================================================
  if (showResults) {
    const pathways = mockDiagnosisResult.pathways;

    return (
      <div className="min-h-screen bg-white">
        {/* KOR: 갤러리 헤더 / ENG: Gallery header */}
        <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
              >
                <ChevronLeft size={16} />
                <span>다시 진단</span>
              </button>
              <div className="h-4 w-px bg-gray-300" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">JobChaJa Gallery</p>
                <h1 className="text-base font-light text-gray-900 tracking-wide">비자 경로 전시</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* KOR: 뷰 모드 토글 / ENG: View mode toggle */}
              <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List size={14} />
                </button>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400">진단 완료</p>
                <p className="text-sm font-medium text-gray-700">{pathways.length}개 경로 발견</p>
              </div>
            </div>
          </div>
        </header>

        {/* KOR: 전시 소개 배너 / ENG: Exhibition intro banner */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Special Exhibition 2024</p>
                <h2 className="text-3xl font-extralight text-gray-900 mb-2 tracking-tight">
                  한국 체류 비자 경로전
                </h2>
                <p className="text-gray-500 text-sm font-light">
                  Korean Residency Visa Pathway Exhibition
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Users size={12} />
                  <span>큐레이터: JobChaJa AI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye size={12} />
                  <span>{pathways.length}개 작품</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award size={12} />
                  <span>2024 선별 컬렉션</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KOR: 갤러리 메인 전시 공간 / ENG: Gallery main exhibition space */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {viewMode === 'grid' ? (
            // KOR: 그리드 갤러리 뷰 / ENG: Grid gallery view
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pathways.map((pathway, index) => {
                const accent = PATHWAY_ACCENTS[index % PATHWAY_ACCENTS.length];
                const galleryLabel = getFeasibilityGalleryLabel(pathway.feasibilityScore);
                const isAudioOn = audioPathway === pathway.id && audioActive;

                return (
                  <div key={pathway.id} className="group">
                    {/* KOR: 작품 프레임 / ENG: Artwork frame */}
                    <div className="relative">
                      {/* KOR: 갤러리 번호 / ENG: Gallery number */}
                      <div className="absolute -top-3 -left-3 z-10 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-xs text-gray-500 font-mono">{index + 1}</span>
                      </div>

                      {/* KOR: 액자 효과 / ENG: Picture frame effect */}
                      <div className="border-4 border-gray-100 shadow-md group-hover:shadow-lg transition-shadow duration-300 p-1">
                        <div className="border border-gray-200">
                          {/* KOR: 작품 상단 색상 띠 (실현 가능성 시각화) / ENG: Top color band (feasibility visualization) */}
                          <div className="relative h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
                            {/* KOR: 배경 추상 아트 패턴 / ENG: Background abstract art pattern */}
                            <div
                              className="absolute inset-0 opacity-5"
                              style={{
                                backgroundImage: `repeating-linear-gradient(
                                  45deg,
                                  ${accent.accent} 0px,
                                  ${accent.accent} 1px,
                                  transparent 1px,
                                  transparent 20px
                                )`,
                              }}
                            />
                            {/* KOR: 중앙 점수 원형 / ENG: Center score circle */}
                            <div className="relative flex flex-col items-center">
                              <div
                                className={`w-16 h-16 rounded-full ${accent.bg} flex items-center justify-center mb-2`}
                              >
                                <span className="text-white text-xl font-thin">{pathway.feasibilityScore}</span>
                              </div>
                              <span className="text-xs text-gray-400 font-light tracking-wider uppercase">
                                {pathway.feasibilityLabel}
                              </span>
                            </div>
                            {/* KOR: 비자 체인 태그 / ENG: Visa chain tags */}
                            <div className="absolute bottom-2 left-2 right-2 flex gap-1 flex-wrap justify-center">
                              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-1.5 py-0.5 bg-white border border-gray-200 text-gray-600 font-mono"
                                >
                                  {v.visa}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* KOR: 작품 정보 패널 / ENG: Artwork info panel */}
                          <div className="bg-white p-4">
                            {/* KOR: 갤러리 분류 / ENG: Gallery classification */}
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-light">
                              {galleryLabel}
                            </p>
                            <h3 className="text-sm font-medium text-gray-900 mb-1 leading-tight">
                              {pathway.name}
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-light">
                              {pathway.description}
                            </p>

                            {/* KOR: 작품 통계 / ENG: Artwork stats */}
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Clock size={10} />
                                  <span>{pathway.totalDurationMonths}개월</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign size={10} />
                                  <span>${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {/* KOR: 오디오 가이드 버튼 / ENG: Audio guide button */}
                                <button
                                  onClick={() => toggleAudio(pathway.id)}
                                  className={`p-1.5 rounded-sm transition-colors ${
                                    isAudioOn
                                      ? 'bg-gray-900 text-white'
                                      : 'text-gray-400 hover:text-gray-600'
                                  }`}
                                  title="오디오 가이드 / Audio Guide"
                                >
                                  {isAudioOn ? <Volume2 size={12} /> : <VolumeX size={12} />}
                                </button>
                                {/* KOR: 상세 보기 버튼 / ENG: Detail view button */}
                                <button
                                  onClick={() => setExpandedPathway(pathway)}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                  title="작품 상세 / Artwork Detail"
                                >
                                  <Maximize2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* KOR: 벽면 레이블 (갤러리 실제 레이블 스타일) / ENG: Wall label (actual gallery label style) */}
                      <div className="mt-3 pl-1">
                        <p className="text-xs font-light text-gray-900">{pathway.name}</p>
                        <p className="text-xs text-gray-400 font-light">
                          {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel} · {pathway.totalDurationMonths}개월
                        </p>
                        <p className="text-xs text-gray-300 font-light mt-0.5 font-mono">
                          #J-{String(index + 1).padStart(3, '0')} · 비자 경로도
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // KOR: 리스트 갤러리 뷰 / ENG: List gallery view
            <div className="space-y-6">
              {pathways.map((pathway, index) => {
                const accent = PATHWAY_ACCENTS[index % PATHWAY_ACCENTS.length];
                const galleryLabel = getFeasibilityGalleryLabel(pathway.feasibilityScore);
                const isAudioOn = audioPathway === pathway.id && audioActive;

                return (
                  <div
                    key={pathway.id}
                    className="flex gap-6 group border-b border-gray-100 pb-6"
                  >
                    {/* KOR: 썸네일 프레임 / ENG: Thumbnail frame */}
                    <div className="shrink-0 border-2 border-gray-100 shadow-sm w-28 h-28 flex items-center justify-center bg-gray-50 relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-5"
                        style={{
                          backgroundImage: `repeating-linear-gradient(45deg, ${accent.accent} 0px, ${accent.accent} 1px, transparent 1px, transparent 15px)`,
                        }}
                      />
                      <div className={`w-12 h-12 rounded-full ${accent.bg} flex items-center justify-center relative`}>
                        <span className="text-white text-sm font-thin">{pathway.feasibilityScore}</span>
                      </div>
                      <div className="absolute bottom-1 left-0 right-0 text-center">
                        <span className="text-gray-400 text-xs font-mono">#{String(index + 1).padStart(3, '0')}</span>
                      </div>
                    </div>

                    {/* KOR: 작품 정보 / ENG: Artwork info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-widest font-light mb-0.5">
                            {galleryLabel}
                          </p>
                          <h3 className="text-base font-light text-gray-900">{pathway.name}</h3>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => toggleAudio(pathway.id)}
                            className={`p-1.5 rounded-sm transition-colors ${isAudioOn ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            {isAudioOn ? <Volume2 size={14} /> : <Headphones size={14} />}
                          </button>
                          <button
                            onClick={() => setExpandedPathway(pathway)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Maximize2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 font-light mt-1 leading-relaxed">
                        {pathway.description}
                      </p>
                      {/* KOR: 비자 체인 / ENG: Visa chain */}
                      <div className="mt-2 flex items-center gap-1 flex-wrap">
                        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <span className="text-xs px-2 py-0.5 border border-gray-200 text-gray-600 font-mono bg-gray-50">
                              {v.visa}
                            </span>
                            {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && <ArrowRight size={10} className="text-gray-300" />}
                          </span>
                        ))}
                        <span className="text-xs text-gray-400 ml-2 font-light">
                          · {pathway.totalDurationMonths}개월 · ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
                        </span>
                      </div>
                      {/* KOR: 오디오 가이드 활성 시 큐레이터 노트 표시 / ENG: Show curator note when audio guide active */}
                      {isAudioOn && (
                        <div className="mt-3 p-3 bg-gray-50 border-l-2 border-gray-900">
                          <p className="text-xs text-gray-500 italic font-light leading-relaxed">
                            🎧 <strong className="font-medium text-gray-700">큐레이터 노트 —</strong>{' '}
                            이 경로는 {pathway.feasibilityLabel} 실현 가능성을 보여줍니다.
                            총 {pathway.totalDurationMonths}개월의 여정을 통해 한국 체류 목표를 달성하는 방법입니다.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* KOR: 큐레이터 노트 섹션 / ENG: Curator notes section */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen size={16} className="text-gray-400" />
              <h3 className="text-sm font-light text-gray-700 uppercase tracking-widest">큐레이터 노트</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">관람 안내</p>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  각 작품은 귀하의 상황에 맞게 큐레이션된 비자 경로입니다.
                  숫자는 실현 가능성 점수(0-100)를 나타냅니다.
                </p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">법적 고지</p>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  이 전시의 정보는 참고용이며, 실제 비자 신청 전 반드시 전문가와 상담하세요.
                </p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">다음 단계</p>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  관심 있는 작품을 선택하여 상세 정보를 확인하고 비자 전문가와 연결하세요.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* KOR: 확대 보기 모달 (작품 상세) / ENG: Expanded view modal (artwork detail) */}
        {expandedPathway && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* KOR: 모달 헤더 / ENG: Modal header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">작품 상세 / Artwork Detail</p>
                  <h2 className="text-base font-light text-gray-900">{expandedPathway.name}</h2>
                </div>
                <button
                  onClick={() => setExpandedPathway(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* KOR: 모달 본문 / ENG: Modal body */}
              <div className="p-6">
                {/* KOR: 실현 가능성 표시 / ENG: Feasibility display */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 border border-gray-100">
                  <div className="w-16 h-16 bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-2xl font-thin">{expandedPathway.feasibilityScore}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getFeasibilityEmoji(expandedPathway.feasibilityLabel)} {expandedPathway.feasibilityLabel}
                    </p>
                    <p className="text-xs text-gray-500 font-light">{expandedPathway.description}</p>
                  </div>
                </div>

                {/* KOR: 비자 경로 흐름 / ENG: Visa pathway flow */}
                <div className="mb-6">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">비자 경로 / Visa Chain</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(Array.isArray(expandedPathway.visaChain) ? expandedPathway.visaChain : []).map((v, i) => (
                      <span key={i} className="flex items-center gap-2">
                        <div className="border border-gray-200 px-3 py-2 text-center">
                          <p className="text-sm font-mono text-gray-900">{v.visa}</p>
                          <p className="text-xs text-gray-400 font-light">{v.duration}</p>
                        </div>
                        {i < (Array.isArray(expandedPathway.visaChain) ? expandedPathway.visaChain : []).length - 1 && (
                          <ArrowRight size={14} className="text-gray-300" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* KOR: 마일스톤 (큐레이터 설명) / ENG: Milestones (curator description) */}
                <div className="mb-6">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">경로 단계 / Milestones</p>
                  <div className="space-y-3">
                    {expandedPathway.milestones.map((m, i) => (
                      <div key={i} className="flex gap-3 p-3 border border-gray-100">
                        <div className="shrink-0 w-8 h-8 bg-gray-100 flex items-center justify-center text-sm">
                          {m.emoji}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.title}</p>
                          <p className="text-xs text-gray-500 font-light leading-relaxed">{m.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KOR: 예상 비용 및 기간 / ENG: Estimated cost and duration */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 border border-gray-100 bg-gray-50 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">예상 기간</p>
                    <p className="text-2xl font-thin text-gray-900">{expandedPathway.totalDurationMonths}</p>
                    <p className="text-xs text-gray-400">개월</p>
                  </div>
                  <div className="p-3 border border-gray-100 bg-gray-50 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">예상 비용</p>
                    <p className="text-2xl font-thin text-gray-900">${((expandedPathway as any).estimatedCostUSD ?? expandedPathway.estimatedCostWon ?? 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-400">USD</p>
                  </div>
                </div>

                {/* KOR: 전문가 상담 CTA / ENG: Expert consultation CTA */}
                <button className="w-full py-3 bg-gray-900 text-white text-sm font-light tracking-wide hover:bg-gray-800 transition-colors">
                  이 경로로 전문가 상담 신청 →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // KOR: 입력 화면 렌더링 (갤러리 카탈로그 탐색 스타일) / ENG: Input screen rendering (gallery catalog style)
  // ============================================================
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* KOR: 갤러리 상단 헤더 / ENG: Gallery top header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">JobChaJa Gallery</p>
            <h1 className="text-sm font-light text-gray-900 mt-0.5">비자 경로 전시 카탈로그</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="font-mono">{stepMeta.catalogNo}</span>
            <span>/</span>
            <span className="font-mono">CAT-006</span>
          </div>
        </div>
      </header>

      {/* KOR: 진행 표시줄 (갤러리 섹션 표시) / ENG: Progress bar (gallery section indicator) */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-0.5 flex-1 transition-colors duration-300 ${
                  i <= currentStep ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="py-2 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-light">
              {currentStep + 1} / {STEPS.length} — 카탈로그 작성 중
            </p>
            <p className="text-xs text-gray-400 font-light">
              Section {currentStep + 1}: {stepMeta.titleEn}
            </p>
          </div>
        </div>
      </div>

      {/* KOR: 카탈로그 폼 / ENG: Catalog form */}
      <main className="flex-1 flex items-start justify-center py-12">
        <div className="max-w-4xl w-full px-6">
          <div className="flex gap-12">
            {/* KOR: 왼쪽 — 카탈로그 표지 / ENG: Left — Catalog cover */}
            <div className="hidden md:block shrink-0 w-48">
              {/* KOR: 전시 카탈로그 카드 / ENG: Exhibition catalog card */}
              <div className="border border-gray-200 shadow-sm">
                <div className="h-32 bg-gray-50 flex items-center justify-center border-b border-gray-100 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, #1e293b 0px, #1e293b 1px, transparent 1px, transparent 16px)`,
                    }}
                  />
                  <div className="relative text-center">
                    <div className="text-3xl mb-1">🗂️</div>
                    <p className="text-xs text-gray-400 font-mono">{stepMeta.catalogNo}</p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">현재 섹션</p>
                  <p className="text-sm font-light text-gray-900">{stepMeta.title}</p>
                  <p className="text-xs text-gray-400 font-light mt-1">{stepMeta.titleEn}</p>
                </div>
              </div>

              {/* KOR: 완료된 섹션 목록 / ENG: Completed sections list */}
              {currentStep > 0 && (
                <div className="mt-4 space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">기입 완료</p>
                  {STEPS.slice(0, currentStep).map((s) => (
                    <div key={s} className="flex items-center gap-2 text-xs text-gray-400 font-light">
                      <div className="w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0" />
                      <span>{STEP_META[s].title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* KOR: 오른쪽 — 입력 폼 / ENG: Right — Input form */}
            <div className="flex-1">
              {/* KOR: 섹션 제목 / ENG: Section title */}
              <div className="mb-8">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{stepMeta.catalogNo}</p>
                <h2 className="text-2xl font-extralight text-gray-900 mb-1">{stepMeta.title}</h2>
                <p className="text-sm text-gray-400 font-light">{stepMeta.subtitle}</p>
              </div>

              {/* KOR: 국가 선택 / ENG: Nationality selection */}
              {step === 'nationality' && (
                <div>
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">인기 국가 / Popular Countries</p>
                    <div className="grid grid-cols-3 gap-2">
                      {popularCountries.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => handleCountrySelect(c.name)}
                          className={`flex items-center gap-2 p-3 border text-left transition-all ${
                            selectedCountry === c.name
                              ? 'border-gray-900 bg-gray-50'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <span className="text-lg">{c.flag}</span>
                          <span className="text-xs text-gray-700 font-light">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">직접 입력 / Other</p>
                    <input
                      type="text"
                      placeholder="국가명 입력..."
                      value={selectedCountry === input.nationality ? selectedCountry : ''}
                      onChange={(e) => handleCountrySelect(e.target.value)}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm font-light text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* KOR: 나이 입력 / ENG: Age input */}
              {step === 'age' && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">나이 / Age</p>
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={16}
                        max={80}
                        placeholder="나이를 입력하세요"
                        value={ageInput}
                        onChange={(e) => handleAgeInput(e.target.value)}
                        className="w-full border border-gray-200 px-4 py-4 text-4xl font-thin text-gray-900 placeholder:text-gray-200 focus:outline-none focus:border-gray-900 transition-colors text-center"
                      />
                    </div>
                    <span className="text-lg text-gray-400 font-light pb-4">세</span>
                  </div>
                  {/* KOR: 나이 범위 퀵 선택 / ENG: Age range quick selection */}
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {[20, 25, 30, 35, 40].map((age) => (
                      <button
                        key={age}
                        onClick={() => { setAgeInput(String(age)); handleAgeInput(String(age)); }}
                        className={`px-3 py-1.5 border text-xs transition-all ${
                          String(input.age) === String(age)
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 text-gray-500 hover:border-gray-400'
                        }`}
                      >
                        {age}대
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KOR: 학력 선택 / ENG: Education level selection */}
              {step === 'educationLevel' && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">학력 수준 / Education Level</p>
                  <div className="space-y-2">
                    {educationOptions.map((edu) => (
                      <button
                        key={edu}
                        onClick={() => handleOptionSelect('educationLevel', edu)}
                        className={`w-full flex items-center justify-between p-4 border text-left transition-all ${
                          input.educationLevel === edu
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <span className="text-sm font-light text-gray-900">{edu}</span>
                        {input.educationLevel === edu && (
                          <div className="w-2 h-2 bg-gray-900 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KOR: 연간 가용 자금 선택 / ENG: Annual fund selection */}
              {step === 'availableAnnualFund' && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">연간 예산 / Annual Budget</p>
                  <div className="grid grid-cols-1 gap-2">
                    {fundOptions.map((fund) => (
                      <button
                        key={fund}
                        onClick={() => handleOptionSelect('availableAnnualFund', fund)}
                        className={`flex items-center justify-between p-4 border text-left transition-all ${
                          input.availableAnnualFund === fund
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-light text-gray-900 font-mono">{fund}</p>
                        </div>
                        {input.availableAnnualFund === fund && (
                          <div className="w-2 h-2 bg-gray-900 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KOR: 최종 목표 선택 / ENG: Final goal selection */}
              {step === 'finalGoal' && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">최종 목표 / Final Goal</p>
                  <div className="space-y-2">
                    {goalOptions.map((goal, i) => (
                      <button
                        key={goal}
                        onClick={() => handleOptionSelect('finalGoal', goal)}
                        className={`w-full flex items-center gap-4 p-4 border text-left transition-all ${
                          input.finalGoal === goal
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <span className="text-xs text-gray-400 font-mono shrink-0">
                          G-{String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-light text-gray-900">{goal}</span>
                        {input.finalGoal === goal && (
                          <div className="ml-auto w-2 h-2 bg-gray-900 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KOR: 우선순위 선택 / ENG: Priority selection */}
              {step === 'priorityPreference' && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">우선순위 / Priority</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {priorityOptions.map((priority) => (
                      <button
                        key={priority}
                        onClick={() => handleOptionSelect('priorityPreference', priority)}
                        className={`p-5 border text-center transition-all ${
                          input.priorityPreference === priority
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <p className="text-sm font-light text-gray-900">{priority}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KOR: 네비게이션 버튼 / ENG: Navigation buttons */}
              <div className="mt-10 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                  <span>이전</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isStepComplete()}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-light transition-all ${
                    isStepComplete()
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {currentStep === STEPS.length - 1 ? '전시 관람하기' : '다음 섹션'}
                  </span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* KOR: 갤러리 하단 푸터 / ENG: Gallery bottom footer */}
      <footer className="border-t border-gray-100 mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-gray-300 font-light">
          <span>JobChaJa Gallery — Visa Pathway Exhibition</span>
          <span className="font-mono">Design #87 — Art Gallery</span>
        </div>
      </footer>
    </div>
  );
}
