'use client';

// KOR: 비자 진단 페이지 - 렌탈 서비스 스타일 (#79)
// ENG: Visa diagnosis page - Rental Service style (#79)
// 컨셉: 렌탈 서비스처럼 비자를 기간별로 "임대"하는 느낌 (Rent the Runway, Zipcar, Turo 스타일)
// Concept: Visa as a "rental" experience by duration period (Rent the Runway, Zipcar, Turo style)

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
  Calendar,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  MapPin,
  Award,
  Package,
  Repeat,
  Tag,
  CreditCard,
  Briefcase,
  BookOpen,
  Target,
  BarChart2,
  Key,
  Layers,
} from 'lucide-react';

// KOR: 렌탈 기간 슬라이더 옵션 정의
// ENG: Rental duration slider option definitions
const DURATION_OPTIONS = [
  { months: 6, label: '6개월', labelEn: '6 Months', desc: '단기 체험', icon: '⚡' },
  { months: 12, label: '1년', labelEn: '1 Year', desc: '기본 플랜', icon: '📅' },
  { months: 24, label: '2년', labelEn: '2 Years', desc: '스탠다드', icon: '🌟' },
  { months: 36, label: '3년', labelEn: '3 Years', desc: '프리미엄', icon: '💎' },
  { months: 60, label: '5년+', labelEn: '5 Years+', desc: '엔터프라이즈', icon: '🏆' },
];

// KOR: 부가 옵션 정의 (렌탈 서비스의 추가 옵션처럼)
// ENG: Add-on options definition (like rental service add-ons)
const ADDON_OPTIONS = [
  { id: 'language', label: '한국어 학습 패키지', labelEn: 'Korean Language Pack', icon: '🗣️', cost: '+3개월', color: 'purple' },
  { id: 'career', label: '취업 지원 서비스', labelEn: 'Career Support', icon: '💼', cost: '+6개월', color: 'blue' },
  { id: 'permanent', label: '영주권 플랜', labelEn: 'Permanent Residency Plan', icon: '🏠', cost: '+24개월', color: 'indigo' },
  { id: 'express', label: '빠른 처리 옵션', labelEn: 'Express Processing', icon: '⚡', cost: '우선 처리', color: 'violet' },
];

// KOR: 단계 레이블 정의
// ENG: Step label definitions
const STEPS = [
  { id: 1, label: '국적', labelEn: 'Nationality', icon: Globe },
  { id: 2, label: '나이', labelEn: 'Age', icon: Calendar },
  { id: 3, label: '학력', labelEn: 'Education', icon: BookOpen },
  { id: 4, label: '예산', labelEn: 'Budget', icon: DollarSign },
  { id: 5, label: '목표', labelEn: 'Goal', icon: Target },
  { id: 6, label: '우선순위', labelEn: 'Priority', icon: Star },
];

export default function Diagnosis79Page() {
  // KOR: 현재 입력 단계 (1~6 입력, 7 렌탈 설정, 8 결과)
  // ENG: Current input step (1~6 input, 7 rental config, 8 result)
  const [step, setStep] = useState<number>(1);

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 선택된 렌탈 기간 인덱스
  // ENG: Selected rental duration index
  const [durationIndex, setDurationIndex] = useState<number>(2);

  // KOR: 선택된 부가 옵션
  // ENG: Selected add-on options
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // KOR: 결과 데이터 (목업 사용)
  // ENG: Result data (using mock)
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 선택된 경로 인덱스
  // ENG: Selected pathway index
  const [selectedPathwayIdx, setSelectedPathwayIdx] = useState<number>(0);

  // KOR: 계약서 서명 완료 상태
  // ENG: Contract signature completion state
  const [isSigned, setIsSigned] = useState<boolean>(false);

  // KOR: 국가 검색 필터
  // ENG: Country search filter
  const [countrySearch, setCountrySearch] = useState<string>('');

  // KOR: 나이 입력값
  // ENG: Age input value
  const [ageValue, setAgeValue] = useState<string>('');

  const selectedDuration = DURATION_OPTIONS[durationIndex];
  const selectedPathway = result?.pathways[selectedPathwayIdx];

  // KOR: 필터된 국가 목록
  // ENG: Filtered country list
  const filteredCountries = popularCountries.filter(
    (c) =>
      (c.nameKoKo ?? '').toLowerCase().includes(countrySearch.toLowerCase()) ||
      (c.nameKoEn ?? '').toLowerCase().includes(countrySearch.toLowerCase()) ||
      (c.code ?? '').toLowerCase().includes(countrySearch.toLowerCase())
  );

  // KOR: 다음 단계로 이동
  // ENG: Move to next step
  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else if (step === 6) {
      // KOR: 렌탈 설정 단계로
      // ENG: Move to rental configuration step
      setStep(7);
    } else if (step === 7) {
      // KOR: 결과 단계로
      // ENG: Move to result step
      setResult(mockDiagnosisResult);
      setStep(8);
    }
  };

  // KOR: 이전 단계로 이동
  // ENG: Move to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // KOR: 부가 옵션 토글
  // ENG: Toggle add-on option
  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // KOR: 현재 단계 완료 여부 확인
  // ENG: Check if current step is completed
  const isStepComplete = (): boolean => {
    switch (step) {
      case 1: return !!input.nationality;
      case 2: return !!input.age && input.age > 0;
      case 3: return !!input.educationLevel;
      case 4: return !!input.availableAnnualFund;
      case 5: return !!input.finalGoal;
      case 6: return !!input.priorityPreference;
      case 7: return true;
      default: return false;
    }
  };

  // KOR: 총 렌탈 기간 계산 (선택된 기간 + 부가 옵션)
  // ENG: Calculate total rental duration (selected + add-ons)
  const getTotalMonths = (): number => {
    let total = selectedDuration.months;
    if (selectedAddons.includes('language')) total += 3;
    if (selectedAddons.includes('career')) total += 6;
    if (selectedAddons.includes('permanent')) total += 24;
    return total;
  };

  // KOR: 점수 바 색상 (렌탈 서비스 퍼플 팔레트)
  // ENG: Score bar color (rental service purple palette)
  const getBarColor = (score: number): string => {
    if (score >= 80) return 'bg-violet-500';
    if (score >= 60) return 'bg-purple-500';
    if (score >= 40) return 'bg-indigo-400';
    return 'bg-slate-400';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* KOR: 상단 헤더 - 렌탈 서비스 브랜드 바 */}
      {/* ENG: Top header - rental service brand bar */}
      <header className="bg-violet-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-violet-200 uppercase tracking-widest font-semibold">Visa Rental Co.</div>
              <div className="text-lg font-bold leading-tight">비자 렌탈 센터</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-violet-200">
            <Shield className="w-4 h-4 shrink-0" />
            <span>안전한 체류 보증</span>
          </div>
        </div>
        {/* KOR: 진행 단계 바 */}
        {/* ENG: Progress step bar */}
        <div className="max-w-4xl mx-auto px-6 pb-4">
          <div className="flex items-center gap-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i + 1 <= step ? 'bg-white' : 'bg-white/25'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-violet-200 mt-1.5">
            {step <= 6
              ? `정보 입력 ${step}/6`
              : step === 7
              ? '렌탈 플랜 설정'
              : '비자 계약서'}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* ──────────────────────────────────────────── */}
        {/* KOR: STEP 1 ~ 6 — 정보 입력 카드 */}
        {/* ENG: STEP 1 ~ 6 — Information input cards */}
        {/* ──────────────────────────────────────────── */}
        {step >= 1 && step <= 6 && (
          <div className="max-w-xl mx-auto">
            {/* KOR: 단계 아이콘 + 제목 */}
            {/* ENG: Step icon + title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                <Layers className="w-4 h-4 shrink-0" />
                STEP {step} OF 6
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                {step === 1 && '어느 나라에서 오셨나요?'}
                {step === 2 && '연령대를 알려주세요'}
                {step === 3 && '최종 학력을 선택하세요'}
                {step === 4 && '연간 가용 예산은?'}
                {step === 5 && '한국 체류의 최종 목표는?'}
                {step === 6 && '가장 중요하게 생각하는 것은?'}
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                {step === 1 && 'Select your nationality / 국적을 선택해주세요'}
                {step === 2 && 'Enter your age / 나이를 입력하세요'}
                {step === 3 && 'Choose your education level / 학력을 선택하세요'}
                {step === 4 && 'Choose available annual budget / 연간 예산을 선택하세요'}
                {step === 5 && 'What is your final goal? / 최종 목표를 선택하세요'}
                {step === 6 && 'What matters most? / 우선순위를 선택하세요'}
              </p>
            </div>

            {/* KOR: 입력 카드 */}
            {/* ENG: Input card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

              {/* STEP 1 - 국적 / Nationality */}
              {step === 1 && (
                <div>
                  <input
                    type="text"
                    placeholder="국가 검색... / Search country..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    {filteredCountries.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setInput({ ...input, nationality: c.nameKo })}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                          input.nationality === c.nameKo
                            ? 'border-violet-500 bg-violet-50 text-violet-800'
                            : 'border-slate-200 hover:border-violet-300 text-slate-700'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{c.flag}</span>
                        <div>
                          <div className="text-sm font-semibold">{c.nameKo}</div>
                          <div className="text-xs text-slate-400">{c.code}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {input.nationality && (
                    <div className="mt-4 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 text-sm text-violet-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      선택됨: <strong>{input.nationality}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2 - 나이 / Age */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={16}
                        max={65}
                        placeholder="예: 25"
                        value={ageValue}
                        onChange={(e) => {
                          setAgeValue(e.target.value);
                          const n = parseInt(e.target.value, 10);
                          if (!isNaN(n)) setInput({ ...input, age: n });
                        }}
                        className="w-full border-2 border-slate-200 rounded-2xl px-5 py-5 text-4xl font-bold text-center text-violet-700 focus:outline-none focus:border-violet-500"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">세 / yrs</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[20, 25, 30, 35, 40, 45, 50, 55].map((a) => (
                      <button
                        key={a}
                        onClick={() => {
                          setAgeValue(String(a));
                          setInput({ ...input, age: a });
                        }}
                        className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                          input.age === a
                            ? 'border-violet-500 bg-violet-500 text-white'
                            : 'border-slate-200 text-slate-600 hover:border-violet-300'
                        }`}
                      >
                        {a}세
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-4 text-center">16~65세 사이로 입력해주세요 / Enter age between 16-65</p>
                </div>
              )}

              {/* STEP 3 - 학력 / Education */}
              {step === 3 && (
                <div className="space-y-3">
                  {educationOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setInput({ ...input, educationLevel: opt })}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all ${
                        input.educationLevel === opt
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-slate-200 hover:border-violet-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        input.educationLevel === opt ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span className={`font-medium text-sm ${input.educationLevel === opt ? 'text-violet-800' : 'text-slate-700'}`}>
                        {opt}
                      </span>
                      {input.educationLevel === opt && (
                        <CheckCircle className="w-5 h-5 text-violet-500 ml-auto shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 4 - 예산 / Budget */}
              {step === 4 && (
                <div className="space-y-3">
                  {fundOptions.map((opt, i) => {
                    const tiers = ['베이직', '스탠다드', '프리미엄', '비즈니스', '엔터프라이즈'];
                    const colors = ['slate', 'blue', 'violet', 'purple', 'indigo'];
                    return (
                      <button
                        key={opt}
                        onClick={() => setInput({ ...input, availableAnnualFund: opt })}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all ${
                          input.availableAnnualFund === opt
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-slate-200 hover:border-violet-300'
                        }`}
                      >
                        <div className={`px-2 py-1 rounded-md text-xs font-bold bg-${colors[i]}-100 text-${colors[i]}-700 shrink-0`}>
                          {tiers[i]}
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm font-semibold ${input.availableAnnualFund === opt ? 'text-violet-800' : 'text-slate-700'}`}>
                            {opt}
                          </div>
                          <div className="text-xs text-slate-400">연간 가용 예산 / Annual budget</div>
                        </div>
                        {input.availableAnnualFund === opt && (
                          <CheckCircle className="w-5 h-5 text-violet-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 5 - 목표 / Goal */}
              {step === 5 && (
                <div className="space-y-3">
                  {goalOptions.map((opt, i) => {
                    const emojis = ['🗣️', '⏳', '📆', '🎓', '🏡'];
                    return (
                      <button
                        key={opt}
                        onClick={() => setInput({ ...input, finalGoal: opt })}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all ${
                          input.finalGoal === opt
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-slate-200 hover:border-violet-300'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{emojis[i]}</span>
                        <span className={`font-medium text-sm flex-1 ${input.finalGoal === opt ? 'text-violet-800' : 'text-slate-700'}`}>
                          {opt}
                        </span>
                        {input.finalGoal === opt && (
                          <CheckCircle className="w-5 h-5 text-violet-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 6 - 우선순위 / Priority */}
              {step === 6 && (
                <div className="space-y-3">
                  {priorityOptions.map((opt, i) => {
                    const icons = [Zap, DollarSign, Shield, Briefcase];
                    const Icon = icons[i];
                    return (
                      <button
                        key={opt}
                        onClick={() => setInput({ ...input, priorityPreference: opt })}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all ${
                          input.priorityPreference === opt
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-slate-200 hover:border-violet-300'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          input.priorityPreference === opt ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`font-medium text-sm flex-1 ${input.priorityPreference === opt ? 'text-violet-800' : 'text-slate-700'}`}>
                          {opt}
                        </span>
                        {input.priorityPreference === opt && (
                          <CheckCircle className="w-5 h-5 text-violet-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* KOR: 이전 / 다음 버튼 */}
            {/* ENG: Back / Next buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:border-violet-300 transition-all"
                >
                  <ChevronLeft className="w-4 h-4 shrink-0" /> 이전
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!isStepComplete()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all ${
                  isStepComplete()
                    ? 'bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-200'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {step === 6 ? '렌탈 플랜 설정하기' : '다음'} <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────── */}
        {/* KOR: STEP 7 — 렌탈 설정 (기간 슬라이더 + 부가 옵션) */}
        {/* ENG: STEP 7 — Rental configuration (duration slider + add-ons) */}
        {/* ──────────────────────────────────────────── */}
        {step === 7 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                <Package className="w-4 h-4 shrink-0" />
                RENTAL PLAN SETUP
              </div>
              <h1 className="text-2xl font-bold text-slate-800">비자 렌탈 플랜을 구성하세요</h1>
              <p className="text-slate-500 text-sm mt-2">원하는 기간과 옵션을 선택하면 맞춤 비자 경로를 추천해드립니다</p>
            </div>

            {/* KOR: 기간 슬라이더 카드 */}
            {/* ENG: Duration slider card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-5">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-5 h-5 text-violet-600 shrink-0" />
                <h2 className="font-bold text-slate-800">렌탈 기간 선택</h2>
                <span className="ml-auto text-sm font-semibold text-violet-700 bg-violet-50 px-3 py-1 rounded-full">
                  {selectedDuration.label}
                </span>
              </div>

              {/* KOR: 기간 옵션 슬라이더 */}
              {/* ENG: Duration option slider */}
              <div className="relative mb-4">
                <input
                  type="range"
                  min={0}
                  max={4}
                  value={durationIndex}
                  onChange={(e) => setDurationIndex(Number(e.target.value))}
                  className="w-full accent-violet-600 h-2"
                />
                <div className="flex justify-between mt-2">
                  {DURATION_OPTIONS.map((d, i) => (
                    <button
                      key={d.months}
                      onClick={() => setDurationIndex(i)}
                      className={`text-xs text-center transition-all ${
                        i === durationIndex ? 'text-violet-700 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* KOR: 선택된 기간 상세 카드 */}
              {/* ENG: Selected duration detail card */}
              <div className="bg-linear-to-br from-violet-600 to-purple-700 rounded-xl p-5 text-white mt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-3xl font-black">{selectedDuration.icon} {selectedDuration.label}</div>
                    <div className="text-violet-200 text-sm">{selectedDuration.desc} · {selectedDuration.labelEn}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-violet-200">총 체류 기간</div>
                    <div className="text-xl font-bold">{selectedDuration.months}개월</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-sm">
                  <Repeat className="w-4 h-4 shrink-0" />
                  부가 옵션 포함 시 최대 {selectedDuration.months + 33}개월 체류 가능
                </div>
              </div>
            </div>

            {/* KOR: 부가 옵션 카드 */}
            {/* ENG: Add-on options card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-5">
              <div className="flex items-center gap-2 mb-5">
                <Tag className="w-5 h-5 text-violet-600 shrink-0" />
                <h2 className="font-bold text-slate-800">부가 옵션 추가</h2>
                <span className="text-xs text-slate-400 ml-1">(선택사항 / Optional)</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {ADDON_OPTIONS.map((addon) => (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all ${
                      selectedAddons.includes(addon.id)
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-slate-200 hover:border-violet-300'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{addon.icon}</span>
                    <div className="flex-1">
                      <div className={`font-semibold text-sm ${selectedAddons.includes(addon.id) ? 'text-violet-800' : 'text-slate-700'}`}>
                        {addon.label}
                      </div>
                      <div className="text-xs text-slate-400">{addon.labelEn}</div>
                    </div>
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      selectedAddons.includes(addon.id)
                        ? 'bg-violet-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {addon.cost}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* KOR: 요약 + 분석 시작 버튼 */}
            {/* ENG: Summary + start analysis button */}
            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 mb-6">
              <div className="text-sm text-violet-700 font-semibold mb-3">렌탈 플랜 요약 / Plan Summary</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-violet-500 shrink-0" /> 기간: <strong className="text-violet-700">{selectedDuration.label}</strong>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Package className="w-4 h-4 text-violet-500 shrink-0" /> 옵션: <strong className="text-violet-700">{selectedAddons.length}개 추가</strong>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-violet-500 shrink-0" /> 총 기간: <strong className="text-violet-700">{getTotalMonths()}개월</strong>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Globe className="w-4 h-4 text-violet-500 shrink-0" /> 국적: <strong className="text-violet-700">{input.nationality || mockInput.nationality}</strong>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:border-violet-300 transition-all"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" /> 이전
              </button>
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-200 transition-all"
              >
                <FileText className="w-5 h-5 shrink-0" /> 비자 계약서 발행하기
              </button>
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────── */}
        {/* KOR: STEP 8 — 렌탈 계약서 스타일 결과 */}
        {/* ENG: STEP 8 — Rental contract style results */}
        {/* ──────────────────────────────────────────── */}
        {step === 8 && result && (
          <div className="max-w-2xl mx-auto">
            {/* KOR: 계약서 헤더 */}
            {/* ENG: Contract header */}
            <div className="bg-linear-to-br from-violet-700 to-purple-800 rounded-2xl p-6 mb-5 text-white shadow-xl shadow-violet-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-widest text-violet-200 font-bold">VISA RENTAL CONTRACT</div>
                <div className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                  #{((result as any).id ?? result.meta?.timestamp ?? 'XXXXX').slice(-5).toUpperCase()}
                </div>
              </div>
              <h1 className="text-2xl font-black mb-1">비자 렌탈 계약서</h1>
              <p className="text-violet-200 text-sm">Visa Rental Agreement — 맞춤 경로 분석 완료</p>
              <div className="mt-4 border-t border-white/20 pt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-violet-300 text-xs mb-1">임차인 / Tenant</div>
                  <div className="font-bold">{input.nationality || mockInput.nationality}</div>
                </div>
                <div>
                  <div className="text-violet-300 text-xs mb-1">임대 기간 / Duration</div>
                  <div className="font-bold">{selectedDuration.label}</div>
                </div>
                <div>
                  <div className="text-violet-300 text-xs mb-1">추천 경로 / Pathways</div>
                  <div className="font-bold">{result.pathways.length}개</div>
                </div>
              </div>
            </div>

            {/* KOR: 경로 탭 선택 */}
            {/* ENG: Pathway tab selection */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {result.pathways.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPathwayIdx(i)}
                  className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all whitespace-nowrap ${
                    selectedPathwayIdx === i
                      ? 'border-violet-500 bg-violet-600 text-white shadow-md shadow-violet-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300'
                  }`}
                >
                  {getFeasibilityEmoji(p.feasibilityLabel)} 경로 {i + 1}
                </button>
              ))}
            </div>

            {/* KOR: 선택된 경로 계약 상세 */}
            {/* ENG: Selected pathway contract detail */}
            {selectedPathway && (
              <div>
                {/* KOR: 경로 요약 카드 */}
                {/* ENG: Pathway summary card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-4">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="text-4xl shrink-0">{getFeasibilityEmoji(selectedPathway.feasibilityLabel)}</div>
                    <div className="flex-1">
                      <h2 className="text-lg font-black text-slate-800 mb-1">{selectedPathway.nameKo}</h2>
                      <p className="text-slate-500 text-sm leading-relaxed">{selectedPathway.description}</p>
                    </div>
                  </div>

                  {/* KOR: 실현 가능성 점수 바 */}
                  {/* ENG: Feasibility score bar */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">렌탈 가능성 / Feasibility</span>
                      <span className="text-sm font-black text-violet-700">{selectedPathway.feasibilityScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 ${getBarColor(selectedPathway.feasibilityScore)}`}
                        style={{ width: `${selectedPathway.feasibilityScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>낮음</span>
                      <span className="font-semibold text-violet-600">{selectedPathway.feasibilityLabel}</span>
                      <span>매우 높음</span>
                    </div>
                  </div>

                  {/* KOR: 통계 행 (기간, 비용) */}
                  {/* ENG: Stats row (duration, cost) */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-violet-500 shrink-0" />
                        <span className="text-xs text-slate-500 font-semibold">총 소요 기간</span>
                      </div>
                      <div className="text-xl font-black text-slate-800">{selectedPathway.totalDurationMonths}개월</div>
                      <div className="text-xs text-slate-400">Total Duration</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-violet-500 shrink-0" />
                        <span className="text-xs text-slate-500 font-semibold">예상 비용</span>
                      </div>
                      <div className="text-xl font-black text-slate-800">${((selectedPathway as any).estimatedCostUSD ?? selectedPathway.estimatedCostWon ?? 0).toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Estimated Cost (USD)</div>
                    </div>
                  </div>

                  {/* KOR: 비자 체인 (렌탈 타임라인) */}
                  {/* ENG: Visa chain (rental timeline) */}
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">렌탈 타임라인 / Visa Chain</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {(Array.isArray(selectedPathway.visaChain) ? selectedPathway.visaChain : []).map((v, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="bg-linear-to-br from-violet-100 to-purple-100 border border-violet-200 rounded-xl px-3 py-2 text-center">
                            <div className="text-sm font-black text-violet-700">{v.visa}</div>
                            <div className="text-xs text-violet-500">{v.duration}</div>
                          </div>
                          {i < (Array.isArray(selectedPathway.visaChain) ? selectedPathway.visaChain : []).length - 1 && (
                            <ArrowRight className="w-4 h-4 text-violet-400 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* KOR: 마일스톤 (렌탈 계약서 조항) */}
                {/* ENG: Milestones (rental contract clauses) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-4">
                  <div className="flex items-center gap-2 mb-5">
                    <FileText className="w-5 h-5 text-violet-600 shrink-0" />
                    <h3 className="font-bold text-slate-800">계약 조항 / Contract Milestones</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedPathway.milestones.map((m, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-sm font-black text-violet-700">
                          {i + 1}
                        </div>
                        <div className="flex-1 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{m.emoji}</span>
                            <span className="font-bold text-slate-800 text-sm">{m.title}</span>
                          </div>
                          <p className="text-slate-500 text-sm leading-relaxed">{m.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KOR: 부가 옵션 요약 */}
                {/* ENG: Selected add-ons summary */}
                {selectedAddons.length > 0 && (
                  <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-4 h-4 text-violet-600 shrink-0" />
                      <span className="text-sm font-bold text-violet-800">추가된 옵션 / Selected Add-ons</span>
                    </div>
                    <div className="space-y-2">
                      {ADDON_OPTIONS.filter((a) => selectedAddons.includes(a.id)).map((a) => (
                        <div key={a.id} className="flex items-center gap-3 text-sm">
                          <span className="text-base">{a.icon}</span>
                          <span className="text-violet-700 font-medium flex-1">{a.label}</span>
                          <span className="text-violet-500 font-bold text-xs">{a.cost}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-violet-200 flex items-center justify-between text-sm">
                      <span className="text-violet-600 font-semibold">총 예상 기간</span>
                      <span className="text-violet-800 font-black text-lg">{getTotalMonths()}개월</span>
                    </div>
                  </div>
                )}

                {/* KOR: 계약서 서명 + 시작하기 */}
                {/* ENG: Contract signature + get started */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <CreditCard className="w-5 h-5 text-violet-600 shrink-0" />
                    <h3 className="font-bold text-slate-800">계약 서명 / Contract Signature</h3>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
                    <div className="text-xs text-slate-500 mb-2 font-semibold">계약 동의 내용 / Agreement Terms</div>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                        본 비자 경로 분석은 참고용이며 법적 효력이 없습니다.
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                        실제 비자 신청 전 전문 행정사 상담을 권장합니다.
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                        This analysis is for reference only and not legally binding.
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setIsSigned(!isSigned)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 mb-4 transition-all ${
                      isSigned
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-slate-200 hover:border-violet-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSigned ? 'border-violet-500 bg-violet-500' : 'border-slate-300'
                    }`}>
                      {isSigned && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${isSigned ? 'text-violet-800' : 'text-slate-600'}`}>
                      위 내용에 동의하고 비자 렌탈 계약서에 서명합니다.
                    </span>
                  </button>

                  <button
                    disabled={!isSigned}
                    className={`w-full py-4 rounded-xl font-black text-base transition-all ${
                      isSigned
                        ? 'bg-linear-to-br from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-300 hover:shadow-xl'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isSigned ? '🎉 비자 렌탈 시작하기' : '서명 후 시작 가능'}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3 shrink-0" /> 안전 보증
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3 shrink-0" /> 전문가 검증
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat className="w-3 h-3 shrink-0" /> 언제든 수정 가능
                    </span>
                  </div>
                </div>

                {/* KOR: 다시 진단 버튼 */}
                {/* ENG: Restart diagnosis button */}
                <button
                  onClick={() => { setStep(1); setResult(null); setInput({}); setIsSigned(false); setSelectedAddons([]); }}
                  className="w-full mt-4 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:border-violet-300 transition-all text-sm"
                >
                  처음부터 다시 진단하기 / Start Over
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* KOR: 하단 브랜드 푸터 */}
      {/* ENG: Bottom brand footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Key className="w-3.5 h-3.5 shrink-0" />
            <span>Visa Rental Co. by 잡차자 · Design #79</span>
          </div>
          <div className="flex items-center gap-1">
            <span>렌탈 서비스 스타일</span>
            <span>· Rental Service Style</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
