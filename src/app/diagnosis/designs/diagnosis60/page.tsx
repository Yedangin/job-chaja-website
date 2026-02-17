'use client';

// KOR: 디자인 #60 - 박물관 투어 테마의 비자 진단 페이지
// ENG: Design #60 - Museum Tour themed visa diagnosis page

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
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Volume2,
  Headphones,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Award,
  BookOpen,
  Navigation,
  Grid3X3,
  Info,
  ArrowRight,
  CheckCircle,
  Eye,
  Mic,
} from 'lucide-react';

// KOR: 현재 단계 타입 정의 / ENG: Step type definition
type Step = 'intro' | 'input' | 'gallery';

// KOR: 입력 단계 번호 정의 / ENG: Input step number definition
type InputStep = 1 | 2 | 3 | 4 | 5 | 6;

// KOR: 전시 홀 번호 타입 / ENG: Exhibition hall number type
type HallNumber = 1 | 2 | 3;

export default function MuseumTourDiagnosisPage() {
  // KOR: 메인 단계 상태 / ENG: Main step state
  const [step, setStep] = useState<Step>('intro');

  // KOR: 입력 단계 상태 / ENG: Input step state
  const [inputStep, setInputStep] = useState<InputStep>(1);

  // KOR: 사용자 입력 상태 / ENG: User input state
  const [formData, setFormData] = useState<Partial<DiagnosisInput>>({});

  // KOR: 진단 결과 상태 / ENG: Diagnosis result state
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 선택된 전시물(비자 경로) / ENG: Selected exhibit (visa pathway)
  const [selectedPathway, setSelectedPathway] = useState<RecommendedPathway | null>(null);

  // KOR: 오디오 가이드 재생 상태 / ENG: Audio guide playing state
  const [isPlaying, setIsPlaying] = useState(false);

  // KOR: 현재 전시 홀 번호 / ENG: Current exhibition hall number
  const [currentHall, setCurrentHall] = useState<HallNumber>(1);

  // KOR: 전시물 열람 상태 / ENG: Exhibit expanded state
  const [expandedExhibit, setExpandedExhibit] = useState<string | null>(null);

  // KOR: 로딩 상태 / ENG: Loading state
  const [isLoading, setIsLoading] = useState(false);

  // KOR: 입력 필드 업데이트 핸들러 / ENG: Input field update handler
  const handleInputChange = (field: keyof DiagnosisInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // KOR: 진단 실행 핸들러 / ENG: Diagnosis execution handler
  const handleDiagnose = () => {
    setIsLoading(true);
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setSelectedPathway(mockDiagnosisResult.pathways[0]);
      setStep('gallery');
      setIsLoading(false);
    }, 2000);
  };

  // KOR: 전시 홀별 경로 분배 / ENG: Distribute pathways by hall
  const getHallPathways = (hall: HallNumber): RecommendedPathway[] => {
    if (!result) return [];
    const all = result.pathways;
    if (hall === 1) return all.filter((_, i) => i < 2);
    if (hall === 2) return all.filter((_, i) => i === 2);
    return all.filter((_, i) => i >= 3);
  };

  // KOR: 오디오 가이드 번호 생성 / ENG: Generate audio guide number
  const getGuideNumber = (index: number) => String(index + 1).padStart(2, '0');

  // KOR: 입력 단계 라벨 / ENG: Input step labels
  const stepLabels: Record<InputStep, string> = {
    1: '국적 선택 · Select Nationality',
    2: '나이 입력 · Enter Age',
    3: '학력 선택 · Education Level',
    4: '연간 자금 · Annual Fund',
    5: '최종 목표 · Final Goal',
    6: '우선순위 · Priority',
  };

  // KOR: 인트로 화면 / ENG: Intro screen
  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-stone-50 font-serif">
        {/* KOR: 박물관 헤더 / ENG: Museum header */}
        <header className="bg-white border-b-2 border-stone-800">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center">
                <BookOpen className="text-amber-400" size={20} />
              </div>
              <div>
                <div className="text-xs text-stone-500 tracking-widest uppercase">Korean Visa</div>
                <div className="text-lg font-bold text-stone-800 tracking-wide">Museum</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-stone-600">
              <span className="flex items-center gap-1 cursor-pointer hover:text-amber-600 transition-colors">
                <MapPin size={14} />전시 안내
              </span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-amber-600 transition-colors">
                <Headphones size={14} />오디오 가이드
              </span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-amber-600 transition-colors">
                <Grid3X3 size={14} />전시실 지도
              </span>
            </nav>
          </div>
        </header>

        {/* KOR: 메인 입장 배너 / ENG: Main entrance banner */}
        <main className="max-w-5xl mx-auto px-6 py-16">
          {/* KOR: 미술관 건물 일러스트 / ENG: Museum building illustration */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <div className="w-48 h-32 bg-stone-200 mx-auto border-2 border-stone-400 rounded-t-lg relative">
                <div className="absolute inset-x-0 -top-6 h-6 bg-stone-300 border-2 border-stone-400 border-b-0 rounded-t-lg" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-20 bg-stone-100 border-2 border-stone-400 border-b-0" />
                <div className="absolute top-4 left-4 w-8 h-10 bg-amber-100 border border-amber-300" />
                <div className="absolute top-4 right-4 w-8 h-10 bg-amber-100 border border-amber-300" />
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="mt-6">
              <div className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-2">
                Welcome to the
              </div>
              <h1 className="text-5xl font-bold text-stone-800 mb-2">
                비자 박물관
              </h1>
              <h2 className="text-2xl text-stone-500 font-light mb-1">
                Korean Visa Museum
              </h2>
              <div className="w-24 h-px bg-amber-500 mx-auto mt-4" />
            </div>
          </div>

          {/* KOR: 전시 소개 카드 / ENG: Exhibition introduction cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <Eye size={24} />, title: '3개 전시실', subtitle: 'Three Halls', desc: '비자 유형별로 큐레이션된 전시실을 둘러보세요' },
              { icon: <Headphones size={24} />, title: '오디오 가이드', subtitle: 'Audio Guide', desc: '각 비자 경로에 대한 상세 설명을 들어보세요' },
              { icon: <Award size={24} />, title: '전문 큐레이션', subtitle: 'Expert Curation', desc: '맞춤형 비자 경로를 AI가 추천해 드립니다' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-stone-200 p-6 text-center hover:border-amber-400 transition-colors">
                <div className="text-amber-600 flex justify-center mb-3">{item.icon}</div>
                <div className="font-bold text-stone-800 mb-1">{item.title}</div>
                <div className="text-xs text-stone-400 tracking-widest uppercase mb-3">{item.subtitle}</div>
                <div className="text-sm text-stone-500">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* KOR: 현재 전시 안내 / ENG: Current exhibition notice */}
          <div className="bg-stone-800 text-white p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 border border-amber-500/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border border-amber-500/20 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="text-amber-400 text-xs tracking-widest uppercase mb-2">Current Exhibition · 현재 전시</div>
              <h3 className="text-2xl font-bold mb-2">나의 한국 비자 여정</h3>
              <p className="text-stone-300 text-sm leading-relaxed mb-6">
                당신의 국적, 학력, 목표를 분석하여 최적의 비자 경로를 전시합니다.<br />
                We analyze your nationality, education, and goals to exhibit the optimal visa pathway.
              </p>
              <button
                onClick={() => setStep('input')}
                className="bg-amber-500 text-stone-900 px-8 py-3 font-bold text-sm tracking-wider hover:bg-amber-400 transition-colors flex items-center gap-2"
              >
                <Navigation size={16} />
                투어 시작하기 · Start Tour
              </button>
            </div>
          </div>

          {/* KOR: 박물관 정보 / ENG: Museum info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-stone-500">
            {[
              { label: '전시 비자 수', value: '31+' },
              { label: '큐레이션 경로', value: '5개' },
              { label: '분석 항목', value: '14개' },
              { label: '검증 케이스', value: '2,629' },
            ].map((item, i) => (
              <div key={i} className="border border-stone-200 p-4">
                <div className="text-2xl font-bold text-amber-600">{item.value}</div>
                <div className="text-xs mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // KOR: 입력 단계 화면 / ENG: Input step screen
  if (step === 'input') {
    return (
      <div className="min-h-screen bg-stone-50 font-serif">
        {/* KOR: 박물관 헤더 / ENG: Museum header */}
        <header className="bg-white border-b-2 border-stone-800">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setStep('intro')}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors"
            >
              <ChevronLeft size={18} />
              <span className="text-sm">로비로 / Lobby</span>
            </button>
            <div className="text-center">
              <div className="text-xs tracking-widest text-stone-400 uppercase">Visitor Registration</div>
              <div className="text-sm font-bold text-stone-700">방문객 등록</div>
            </div>
            <div className="w-24" />
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          {/* KOR: 방문객 등록 진행 표시 / ENG: Visitor registration progress */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              {([1, 2, 3, 4, 5, 6] as InputStep[]).map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                      s < inputStep
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : s === inputStep
                        ? 'bg-stone-800 border-stone-800 text-white'
                        : 'bg-white border-stone-300 text-stone-400'
                    }`}
                  >
                    {s < inputStep ? <CheckCircle size={14} /> : s}
                  </div>
                  {s < 6 && (
                    <div
                      className={`h-px w-8 md:w-12 transition-colors ${
                        s < inputStep ? 'bg-amber-500' : 'bg-stone-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <div className="text-xs text-stone-400 tracking-widest uppercase mb-1">Step {inputStep} of 6</div>
              <h2 className="text-xl font-bold text-stone-800">{stepLabels[inputStep]}</h2>
            </div>
          </div>

          {/* KOR: 전시관 입장 양식 / ENG: Exhibition entry form */}
          <div className="bg-white border border-stone-200 p-8 min-h-64 relative">
            {/* KOR: 박물관 번호 라벨 / ENG: Museum number label */}
            <div className="absolute top-4 right-4 w-10 h-10 bg-stone-800 text-white flex items-center justify-center text-sm font-bold">
              {getGuideNumber(inputStep - 1)}
            </div>

            {/* KOR: 국적 선택 / ENG: Nationality selection */}
            {inputStep === 1 && (
              <div>
                <p className="text-stone-500 text-sm mb-6">
                  방문객의 국적을 선택해 주세요. 귀하의 국적에 맞는 비자 전시를 안내해 드립니다.<br />
                  <span className="text-stone-400 text-xs">Please select your nationality. We'll guide you to visa exhibits tailored to your country.</span>
                </p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {popularCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleInputChange('nationality', country.name)}
                      className={`p-3 border-2 text-center transition-all hover:border-amber-400 ${
                        formData.nationality === country.name
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-stone-200'
                      }`}
                    >
                      <div className="text-2xl mb-1">{country.flag}</div>
                      <div className="text-xs text-stone-700 font-medium">{country.name}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="기타 국적 입력 / Other nationality..."
                    value={
                      popularCountries.find((c) => c.name === formData.nationality)
                        ? ''
                        : formData.nationality || ''
                    }
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="w-full border border-stone-200 px-4 py-2 text-sm text-stone-700 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* KOR: 나이 입력 / ENG: Age input */}
            {inputStep === 2 && (
              <div>
                <p className="text-stone-500 text-sm mb-6">
                  방문객의 연령을 입력해 주세요. 나이에 따라 신청 가능한 비자가 달라집니다.<br />
                  <span className="text-stone-400 text-xs">Enter your age. Available visas differ by age group.</span>
                </p>
                <div className="text-center">
                  <div className="inline-block">
                    <input
                      type="number"
                      min={15}
                      max={80}
                      value={formData.age || ''}
                      onChange={(e) => handleInputChange('age', Number(e.target.value))}
                      className="text-6xl font-bold text-stone-800 text-center w-40 border-b-2 border-stone-300 focus:border-amber-500 focus:outline-none bg-transparent"
                      placeholder="00"
                    />
                    <div className="text-stone-400 text-sm mt-2">세 · years old</div>
                  </div>
                  <div className="mt-8 flex justify-center gap-4">
                    {[20, 25, 30, 35, 40].map((age) => (
                      <button
                        key={age}
                        onClick={() => handleInputChange('age', age)}
                        className={`px-4 py-2 border text-sm transition-all ${
                          formData.age === age
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-stone-200 text-stone-600 hover:border-amber-300'
                        }`}
                      >
                        {age}세
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* KOR: 학력 선택 / ENG: Education selection */}
            {inputStep === 3 && (
              <div>
                <p className="text-stone-500 text-sm mb-6">
                  최종 학력을 선택해 주세요. 많은 비자가 학력 요건을 포함합니다.<br />
                  <span className="text-stone-400 text-xs">Select your highest education level. Many visas include education requirements.</span>
                </p>
                <div className="space-y-3">
                  {educationOptions.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => handleInputChange('educationLevel', opt)}
                      className={`w-full flex items-center gap-4 p-4 border-2 text-left transition-all hover:border-amber-400 ${
                        formData.educationLevel === opt
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-stone-200'
                      }`}
                    >
                      <div className="w-8 h-8 bg-stone-100 flex items-center justify-center text-stone-500 text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-stone-700 font-medium">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: 연간 자금 선택 / ENG: Annual fund selection */}
            {inputStep === 4 && (
              <div>
                <p className="text-stone-500 text-sm mb-6">
                  연간 활용 가능한 자금 범위를 선택해 주세요. 비자 종류에 따라 충분한 자금이 필요합니다.<br />
                  <span className="text-stone-400 text-xs">Select your available annual fund range. Sufficient funds are required for certain visas.</span>
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {fundOptions.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => handleInputChange('availableAnnualFund', opt)}
                      className={`flex items-center gap-4 p-4 border-2 text-left transition-all hover:border-amber-400 ${
                        formData.availableAnnualFund === opt
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-stone-200'
                      }`}
                    >
                      <DollarSign className={`shrink-0 ${formData.availableAnnualFund === opt ? 'text-amber-600' : 'text-stone-400'}`} size={20} />
                      <span className="text-stone-700 font-medium">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: 최종 목표 선택 / ENG: Final goal selection */}
            {inputStep === 5 && (
              <div>
                <p className="text-stone-500 text-sm mb-6">
                  한국 체류의 최종 목표를 선택해 주세요. 목표에 따라 최적 경로가 달라집니다.<br />
                  <span className="text-stone-400 text-xs">Select your final goal in Korea. The optimal pathway differs based on your goal.</span>
                </p>
                <div className="space-y-3">
                  {goalOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleInputChange('finalGoal', opt)}
                      className={`w-full flex items-center gap-4 p-4 border-2 text-left transition-all hover:border-amber-400 ${
                        formData.finalGoal === opt
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-stone-200'
                      }`}
                    >
                      <Star
                        size={18}
                        className={`shrink-0 ${formData.finalGoal === opt ? 'text-amber-500 fill-amber-500' : 'text-stone-300'}`}
                      />
                      <span className="text-stone-700 font-medium">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: 우선순위 선택 / ENG: Priority selection */}
            {inputStep === 6 && (
              <div>
                <p className="text-stone-500 text-sm mb-6">
                  어떤 점을 가장 중요하게 생각하시나요? 우선순위에 맞게 경로를 추천해 드립니다.<br />
                  <span className="text-stone-400 text-xs">What matters most to you? We'll recommend pathways based on your priority.</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {priorityOptions.map((opt, i) => {
                    const icons = [<Clock size={24} key="clock" />, <DollarSign size={24} key="dollar" />, <Award size={24} key="award" />, <Navigation size={24} key="nav" />];
                    return (
                      <button
                        key={opt}
                        onClick={() => handleInputChange('priorityPreference', opt)}
                        className={`p-6 border-2 text-center transition-all hover:border-amber-400 ${
                          formData.priorityPreference === opt
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-stone-200'
                        }`}
                      >
                        <div className={`flex justify-center mb-3 ${formData.priorityPreference === opt ? 'text-amber-600' : 'text-stone-400'}`}>
                          {icons[i]}
                        </div>
                        <div className="text-stone-700 font-medium text-sm">{opt}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* KOR: 네비게이션 버튼 / ENG: Navigation buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => {
                if (inputStep > 1) setInputStep((prev) => (prev - 1) as InputStep);
                else setStep('intro');
              }}
              className="flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-600 hover:border-stone-500 transition-colors text-sm"
            >
              <ChevronLeft size={16} />
              이전 · Back
            </button>

            {inputStep < 6 ? (
              <button
                onClick={() => setInputStep((prev) => (prev + 1) as InputStep)}
                disabled={
                  (inputStep === 1 && !formData.nationality) ||
                  (inputStep === 2 && !formData.age) ||
                  (inputStep === 3 && !formData.educationLevel) ||
                  (inputStep === 4 && !formData.availableAnnualFund) ||
                  (inputStep === 5 && !formData.finalGoal)
                }
                className="flex items-center gap-2 px-8 py-3 bg-stone-800 text-white hover:bg-stone-700 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음 전시실 · Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleDiagnose}
                disabled={!formData.priorityPreference || isLoading}
                className="flex items-center gap-2 px-8 py-3 bg-amber-500 text-stone-900 font-bold hover:bg-amber-400 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-stone-700 border-t-transparent rounded-full animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Mic size={16} />
                    오디오 가이드 시작 · Start
                  </>
                )}
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // KOR: 갤러리 결과 화면 / ENG: Gallery result screen
  return (
    <div className="min-h-screen bg-stone-50 font-serif">
      {/* KOR: 박물관 갤러리 헤더 / ENG: Museum gallery header */}
      <header className="bg-stone-800 text-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <BookOpen className="text-stone-900" size={16} />
            </div>
            <span className="text-sm font-bold tracking-wide">Korean Visa Museum · 비자 박물관</span>
          </div>

          {/* KOR: 오디오 가이드 컨트롤 / ENG: Audio guide controls */}
          <div className="flex items-center gap-3 bg-stone-700 px-4 py-2 rounded">
            <Volume2 size={14} className="text-amber-400" />
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center hover:bg-amber-400 transition-colors"
            >
              {isPlaying ? <Pause size={12} className="text-stone-900" /> : <Play size={12} className="text-stone-900" />}
            </button>
            <span className="text-xs text-stone-300">오디오 가이드 {isPlaying ? '재생 중' : '일시정지'}</span>
          </div>

          <button
            onClick={() => { setStep('input'); setInputStep(1); }}
            className="text-xs text-stone-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <ChevronLeft size={14} />재입장
          </button>
        </div>

        {/* KOR: 전시실 탭 네비게이션 / ENG: Hall tab navigation */}
        <div className="border-t border-stone-700">
          <div className="max-w-6xl mx-auto px-6 flex">
            {([1, 2, 3] as HallNumber[]).map((hall) => (
              <button
                key={hall}
                onClick={() => setCurrentHall(hall)}
                className={`px-6 py-3 text-sm flex items-center gap-2 border-b-2 transition-colors ${
                  currentHall === hall
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <span className="w-5 h-5 border flex items-center justify-center text-xs">
                  {hall}
                </span>
                {hall === 1 ? '전문 취업 홀' : hall === 2 ? '기술 인력 홀' : '장기 체류 홀'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6">
        {/* KOR: 전시물 목록 사이드바 / ENG: Exhibit list sidebar */}
        <aside className="w-72 shrink-0 space-y-4">
          {/* KOR: 방문객 정보 / ENG: Visitor info */}
          <div className="bg-white border border-stone-200 p-4">
            <div className="text-xs text-stone-400 tracking-widest uppercase mb-3">방문객 정보 · Visitor</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">국적</span>
                <span className="text-stone-800 font-medium">{formData.nationality || mockInput.nationality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">나이</span>
                <span className="text-stone-800 font-medium">{formData.age || mockInput.age}세</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">학력</span>
                <span className="text-stone-800 font-medium text-right text-xs">{formData.educationLevel || mockInput.educationLevel}</span>
              </div>
            </div>
          </div>

          {/* KOR: 전시실 지도 / ENG: Hall map */}
          <div className="bg-white border border-stone-200 p-4">
            <div className="text-xs text-stone-400 tracking-widest uppercase mb-3">전시실 지도 · Map</div>
            <div className="space-y-2">
              {result?.pathways.map((pathway, i) => (
                <button
                  key={pathway.id}
                  onClick={() => {
                    setSelectedPathway(pathway);
                    setCurrentHall(i < 2 ? 1 : i === 2 ? 2 : 3);
                  }}
                  className={`w-full flex items-center gap-3 p-3 text-left border transition-all ${
                    selectedPathway?.id === pathway.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-stone-100 hover:border-stone-300'
                  }`}
                >
                  <div className="w-7 h-7 bg-stone-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {getGuideNumber(i)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-700">{pathway.name}</div>
                    <div className="text-xs text-stone-400">{pathway.feasibilityLabel}</div>
                  </div>
                  {selectedPathway?.id === pathway.id && (
                    <Headphones size={12} className="text-amber-500 ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* KOR: 오디오 가이드 재생 정보 / ENG: Audio guide playback info */}
          {selectedPathway && (
            <div className="bg-stone-800 text-white p-4">
              <div className="text-xs text-amber-400 tracking-widest uppercase mb-2">재생 중 · Now Playing</div>
              <div className="text-sm font-bold mb-1">{selectedPathway.name}</div>
              <div className="text-xs text-stone-400 mb-3">도슨트 No. {getGuideNumber(result?.pathways.findIndex(p => p.id === selectedPathway.id) || 0)}</div>

              {/* KOR: 오디오 진행 바 / ENG: Audio progress bar */}
              <div className="space-y-2">
                <div className="h-1 bg-stone-600 rounded">
                  <div
                    className={`h-1 bg-amber-400 rounded transition-all ${isPlaying ? 'animate-pulse' : ''}`}
                    style={{ width: isPlaying ? '45%' : '0%' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-stone-500">
                  <span>{isPlaying ? '2:15' : '0:00'}</span>
                  <span>5:30</span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* KOR: 메인 전시 공간 / ENG: Main exhibition space */}
        <main className="flex-1">
          {/* KOR: 전시실 제목 / ENG: Hall title */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-px bg-amber-500" />
              <span className="text-xs text-stone-400 tracking-widest uppercase">Hall {currentHall}</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800">
              {currentHall === 1 ? '전문 취업 비자 전시실' : currentHall === 2 ? '기술 인력 비자 전시실' : '장기 체류 비자 전시실'}
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              {currentHall === 1
                ? '학력과 전문성을 바탕으로 한국에서 전문 취업하는 경로를 전시합니다.'
                : currentHall === 2
                ? '기술 인력으로 한국 산업 현장에서 역량을 발휘하는 경로를 전시합니다.'
                : '한국에서의 장기 정착과 영주권 취득을 위한 경로를 전시합니다.'}
            </p>
          </div>

          {/* KOR: 전시물 카드 목록 / ENG: Exhibit card list */}
          <div className="space-y-6">
            {(result?.pathways || [])
              .filter((_, i) =>
                currentHall === 1 ? i < 2 : currentHall === 2 ? i === 2 : i >= 3
              )
              .map((pathway, displayIdx) => {
                const globalIdx = result?.pathways.findIndex((p) => p.id === pathway.id) || 0;
                const isExpanded = expandedExhibit === pathway.id;
                const isSelected = selectedPathway?.id === pathway.id;

                return (
                  <div
                    key={pathway.id}
                    className={`bg-white border-2 transition-all ${
                      isSelected ? 'border-amber-400' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {/* KOR: 전시물 헤더 / ENG: Exhibit header */}
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {/* KOR: 전시물 번호 플레이트 / ENG: Exhibit number plate */}
                        <div className="shrink-0">
                          <div className="w-14 h-14 bg-stone-800 text-white flex flex-col items-center justify-center">
                            <div className="text-xs text-stone-400">NO.</div>
                            <div className="text-xl font-bold text-amber-400">{getGuideNumber(globalIdx)}</div>
                          </div>
                        </div>

                        <div className="flex-1">
                          {/* KOR: 전시물 제목 / ENG: Exhibit title */}
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-stone-800">{pathway.name}</h3>
                              <p className="text-stone-500 text-sm mt-1">{pathway.description}</p>
                            </div>
                            {/* KOR: 실현 가능성 배지 / ENG: Feasibility badge */}
                            <div className="shrink-0 ml-4 text-center">
                              <div className="text-2xl">{getFeasibilityEmoji(pathway.feasibilityLabel)}</div>
                              <div className={`text-xs text-white px-2 py-0.5 mt-1 ${getScoreColor(pathway.feasibilityLabel)}`}>
                                {pathway.feasibilityLabel}
                              </div>
                            </div>
                          </div>

                          {/* KOR: 핵심 메타 정보 / ENG: Key meta information */}
                          <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-sm text-stone-600">
                              <div className="w-4 h-4 bg-amber-100 border border-amber-300 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                              </div>
                              <span>적합도 {pathway.feasibilityScore}%</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-stone-600">
                              <Clock size={14} className="text-stone-400" />
                              <span>{pathway.totalDurationMonths}개월 소요</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-stone-600">
                              <DollarSign size={14} className="text-stone-400" />
                              <span>${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
                            </div>
                          </div>

                          {/* KOR: 비자 체인 / ENG: Visa chain */}
                          <div className="flex items-center flex-wrap gap-1 mt-3">
                            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, vi) => (
                              <React.Fragment key={vi}>
                                <span className="px-2 py-1 bg-stone-100 border border-stone-200 text-xs text-stone-700 font-mono font-bold">
                                  {v.visa}
                                </span>
                                {vi < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                                  <ArrowRight size={12} className="text-stone-400" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* KOR: 버튼 행 / ENG: Button row */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                        <button
                          onClick={() => {
                            setSelectedPathway(pathway);
                            setIsPlaying(true);
                          }}
                          className={`flex items-center gap-2 px-4 py-2 text-xs transition-colors ${
                            isSelected && isPlaying
                              ? 'bg-amber-500 text-stone-900'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {isSelected && isPlaying ? <Pause size={12} /> : <Play size={12} />}
                          {isSelected && isPlaying ? '오디오 일시정지' : '오디오 가이드 듣기'}
                        </button>

                        <button
                          onClick={() => setExpandedExhibit(isExpanded ? null : pathway.id)}
                          className="flex items-center gap-2 text-xs text-stone-500 hover:text-stone-700 transition-colors"
                        >
                          <Info size={12} />
                          상세 보기 {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      </div>
                    </div>

                    {/* KOR: 전시물 상세 정보 (확장) / ENG: Exhibit detail (expanded) */}
                    {isExpanded && (
                      <div className="border-t-2 border-amber-200 bg-amber-50/50 p-6">
                        <div className="text-xs text-stone-400 tracking-widest uppercase mb-4">
                          도슨트 해설 · Docent Guide
                        </div>

                        {/* KOR: 마일스톤 타임라인 / ENG: Milestone timeline */}
                        <div className="space-y-4">
                          {pathway.milestones.map((milestone, mi) => (
                            <div key={mi} className="flex gap-4">
                              {/* KOR: 타임라인 선 / ENG: Timeline line */}
                              <div className="flex flex-col items-center shrink-0">
                                <div className="w-9 h-9 bg-white border-2 border-amber-400 flex items-center justify-center text-xl">
                                  {milestone.emoji}
                                </div>
                                {mi < pathway.milestones.length - 1 && (
                                  <div className="w-px h-6 bg-amber-200 mt-1" />
                                )}
                              </div>
                              <div className="pb-4">
                                <div className="font-bold text-stone-800 text-sm">{milestone.title}</div>
                                <div className="text-stone-500 text-sm mt-0.5">{milestone.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* KOR: 비자 체인 상세 / ENG: Visa chain detail */}
                        <div className="mt-4 pt-4 border-t border-amber-200">
                          <div className="text-xs text-stone-400 tracking-widest uppercase mb-3">비자 경로 상세 · Visa Chain</div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, vi) => (
                              <div key={vi} className="bg-white border border-stone-200 p-3 text-center">
                                <div className="text-xs text-stone-400 mb-1">Step {vi + 1}</div>
                                <div className="font-mono font-bold text-stone-800 text-lg">{v.visa}</div>
                                <div className="text-xs text-stone-500 mt-1">{v.duration}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* KOR: 전시실 이동 버튼 / ENG: Hall navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-stone-200">
            <button
              onClick={() => setCurrentHall((prev) => Math.max(1, prev - 1) as HallNumber)}
              disabled={currentHall === 1}
              className="flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-600 hover:border-stone-500 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              이전 전시실
            </button>

            <div className="flex items-center gap-2">
              {([1, 2, 3] as HallNumber[]).map((h) => (
                <button
                  key={h}
                  onClick={() => setCurrentHall(h)}
                  className={`w-8 h-8 border-2 text-xs font-bold transition-all ${
                    currentHall === h
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-stone-200 text-stone-500 hover:border-stone-400'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentHall((prev) => Math.min(3, prev + 1) as HallNumber)}
              disabled={currentHall === 3}
              className="flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-600 hover:border-stone-500 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              다음 전시실
              <ChevronRight size={16} />
            </button>
          </div>

          {/* KOR: 박물관 하단 CTA / ENG: Museum footer CTA */}
          <div className="mt-8 bg-stone-800 text-white p-6 flex items-center justify-between">
            <div>
              <div className="text-amber-400 text-xs tracking-widest uppercase mb-1">Museum Gift Shop · 뮤지엄 샵</div>
              <h3 className="font-bold text-lg">전문가 상담 예약</h3>
              <p className="text-stone-400 text-sm mt-1">비자 전문 행정사와 1:1 맞춤 상담을 받아보세요.</p>
            </div>
            <button className="bg-amber-500 text-stone-900 px-6 py-3 text-sm font-bold hover:bg-amber-400 transition-colors shrink-0 ml-4">
              상담 예약하기 →
            </button>
          </div>
        </main>
      </div>

      {/* KOR: 박물관 하단 정보 / ENG: Museum footer info */}
      <footer className="border-t border-stone-200 bg-white mt-8">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-stone-400">
          <div>
            © 2026 Korean Visa Museum · 한국 비자 박물관 |
            <span className="ml-2">모든 정보는 참고용이며 법적 효력이 없습니다.</span>
          </div>
          <div className="flex items-center gap-1">
            <Headphones size={12} />
            <span>오디오 가이드 v2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
