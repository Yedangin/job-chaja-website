'use client';

// 비자 진단 디자인 #49: 우편 배송 (Package Tracking)
// Visa Diagnosis Design #49: Package Tracking / Courier Delivery Theme
// 컨셉: 택배 추적처럼 비자 경로를 실시간 추적 / Concept: Track visa journey like parcel delivery
// 색상: FedEx 퍼플 + 오렌지 / Colors: FedEx purple + orange

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
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Search,
  Truck,
  Box,
  Navigation,
  Star,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Barcode,
  Globe,
  User,
  GraduationCap,
  DollarSign,
  Target,
  Zap,
} from 'lucide-react';

// ============================================================
// 타입 / Types
// ============================================================

type Step = 'input' | 'tracking' | 'detail';

interface FormState {
  nationality: string;
  age: string;
  educationLevel: string;
  availableAnnualFund: number;
  finalGoal: string;
  priorityPreference: string;
}

// ============================================================
// 추적 번호 생성 / Generate tracking number
// ============================================================
function generateTrackingNo(input: FormState): string {
  // 국가코드 + 나이 + 학력 + 목표 코드 조합 / Combine fields into tracking number
  const country = input.nationality || 'VNM';
  const age = input.age || '24';
  const edu = (input.educationLevel || 'HS').substring(0, 2).toUpperCase();
  const goal = (input.finalGoal || 'EMP').substring(0, 3).toUpperCase();
  const rand = Math.floor(Math.random() * 90000 + 10000);
  return `JCJ-${country}-${age}${edu}${goal}-${rand}`;
}

// ============================================================
// 상태 라벨 / Status label mapping
// ============================================================
function getStatusInfo(feasibilityLabel: string): {
  label: string;
  labelEn: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
} {
  switch (feasibilityLabel) {
    case '높음':
      return { label: '배송 가능', labelEn: 'Deliverable', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300', dot: 'bg-green-500' };
    case '보통':
      return { label: '배송 준비 중', labelEn: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-300', dot: 'bg-blue-500' };
    case '낮음':
      return { label: '배송 지연', labelEn: 'Delayed', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300', dot: 'bg-amber-500' };
    default:
      return { label: '경로 제한', labelEn: 'Restricted', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300', dot: 'bg-red-500' };
  }
}

// ============================================================
// 비용 포맷 / Format cost
// ============================================================
function formatCost(costWon: number): string {
  if (costWon === 0) return '무료 (Free)';
  if (costWon < 100) return `${costWon}만원`;
  return `${(costWon / 100).toFixed(1)}백만원`;
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function Diagnosis49() {
  // 폼 상태 / Form state
  const [form, setForm] = useState<FormState>({
    nationality: '',
    age: '',
    educationLevel: '',
    availableAnnualFund: -1,
    finalGoal: '',
    priorityPreference: '',
  });

  // 화면 단계 / Screen step
  const [step, setStep] = useState<Step>('input');
  // 추적 번호 / Tracking number
  const [trackingNo, setTrackingNo] = useState('');
  // 선택된 패키지(경로) / Selected pathway
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // 타임라인 펼침 / Expand timeline
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // 로딩 / Loading
  const [isSearching, setIsSearching] = useState(false);

  // ============================================================
  // 폼 유효성 / Form validation
  // ============================================================
  const isFormValid =
    form.nationality !== '' &&
    form.age !== '' &&
    form.educationLevel !== '' &&
    form.availableAnnualFund >= 0 &&
    form.finalGoal !== '' &&
    form.priorityPreference !== '';

  // ============================================================
  // 추적 시작 / Start tracking
  // ============================================================
  function handleTrack() {
    if (!isFormValid) return;
    setIsSearching(true);
    const no = generateTrackingNo(form);
    setTrackingNo(no);
    // 모의 검색 딜레이 / Simulated search delay
    setTimeout(() => {
      setIsSearching(false);
      setStep('tracking');
    }, 1800);
  }

  // ============================================================
  // 다시 시작 / Restart
  // ============================================================
  function handleRestart() {
    setStep('input');
    setSelectedId(null);
    setExpandedId(null);
    setTrackingNo('');
    setForm({
      nationality: '',
      age: '',
      educationLevel: '',
      availableAnnualFund: -1,
      finalGoal: '',
      priorityPreference: '',
    });
  }

  // 선택된 경로 / Currently selected pathway
  const selectedPathway = selectedId
    ? mockPathways.find((p) => p.pathwayId === selectedId) ?? null
    : null;

  // 현재 날짜 (컴포넌트 레벨) / Current date at component level
  const now = new Date();

  // 발송인/수취인 정보 / Sender/receiver info
  const senderCountry = popularCountries.find((c) => c.code === form.nationality);
  const receiverGoal = goalOptions.find((g) => g.value === form.finalGoal);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* ────────────────────────────────────────────── */}
      {/* 헤더 / Header — FedEx 스타일 */}
      {/* ────────────────────────────────────────────── */}
      <header className="bg-[#4D148C] text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 로고 / Logo */}
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight text-white">Job</span>
              <span className="text-2xl font-black tracking-tight text-[#FF6600]">ChaJa</span>
            </div>
            <div className="h-5 w-px bg-purple-400" />
            <div className="flex items-center gap-1.5 text-sm text-purple-200">
              <Package size={14} />
              <span>비자 경로 추적 / Visa Route Tracker</span>
            </div>
          </div>
          {step !== 'input' && (
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 text-sm text-purple-200 hover:text-white transition-colors"
            >
              <RotateCcw size={14} />
              <span>새 조회 / New Search</span>
            </button>
          )}
        </div>
        {/* 오렌지 하단 줄 / Orange bottom bar */}
        <div className="h-1 bg-[#FF6600]" />
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ══════════════════════════════════════════════ */}
        {/* STEP 1: 배송 정보 입력 / Package Info Input   */}
        {/* ══════════════════════════════════════════════ */}
        {step === 'input' && (
          <div className="space-y-4">
            {/* 안내 카드 / Info card */}
            <div className="bg-white rounded-xl shadow-md border-l-4 border-[#FF6600] p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#FF6600] bg-opacity-10 rounded-lg shrink-0">
                  <Box size={24} className="text-[#FF6600]" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">비자 경로 추적 서비스</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Visa Route Tracking Service</p>
                  <p className="text-sm text-gray-600 mt-2">
                    발송인(현재 상황)과 수취인(목표)을 입력하면, 잡차자가 최적 비자 경로를 실시간으로 추적합니다.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Enter your origin (current status) and destination (goal) to track your optimal visa route.
                  </p>
                </div>
              </div>
            </div>

            {/* 배송 정보 폼 / Shipping info form */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* 폼 헤더 / Form header */}
              <div className="bg-[#4D148C] text-white px-5 py-3 flex items-center gap-2">
                <Barcode size={16} />
                <span className="text-sm font-semibold">배송 정보 입력 / Shipping Information</span>
              </div>

              <div className="p-5 space-y-5">
                {/* ── 발송인: 국적 / Sender: Nationality ── */}
                <div className="border border-dashed border-purple-200 rounded-lg p-4 bg-purple-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#4D148C] flex items-center justify-center shrink-0">
                      <Globe size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-[#4D148C]">발송인 정보 / Sender (Origin)</span>
                  </div>

                  {/* 국적 / Nationality */}
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 mb-1.5 block">국적 / Nationality</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {popularCountries.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => setForm((f) => ({ ...f, nationality: c.code }))}
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-all ${
                            form.nationality === c.code
                              ? 'border-[#4D148C] bg-[#4D148C] text-white'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                          }`}
                        >
                          <span>{c.flag}</span>
                          <span className="truncate">{c.nameKo}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 나이 / Age */}
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 mb-1.5 block">나이 / Age</label>
                    <div className="flex gap-2 flex-wrap">
                      {[18, 20, 22, 24, 26, 28, 30, 35, 40].map((a) => (
                        <button
                          key={a}
                          onClick={() => setForm((f) => ({ ...f, age: String(a) }))}
                          className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                            form.age === String(a)
                              ? 'border-[#4D148C] bg-[#4D148C] text-white'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                          }`}
                        >
                          {a}세
                        </button>
                      ))}
                      <input
                        type="number"
                        placeholder="직접 입력 / Enter age"
                        value={form.age && ![18,20,22,24,26,28,30,35,40].includes(Number(form.age)) ? form.age : ''}
                        onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs w-28 focus:outline-none focus:border-purple-400"
                        min={18}
                        max={60}
                      />
                    </div>
                  </div>

                  {/* 학력 / Education */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">최종 학력 / Education Level</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {educationOptions.map((e) => (
                        <button
                          key={e.value}
                          onClick={() => setForm((f) => ({ ...f, educationLevel: e.value }))}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all text-left ${
                            form.educationLevel === e.value
                              ? 'border-[#4D148C] bg-[#4D148C] text-white'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                          }`}
                        >
                          <span>{e.emoji}</span>
                          <span>{e.labelKo}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── 수취인: 목표 / Receiver: Goal ── */}
                <div className="border border-dashed border-orange-200 rounded-lg p-4 bg-orange-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#FF6600] flex items-center justify-center shrink-0">
                      <MapPin size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-[#FF6600]">수취인 정보 / Receiver (Destination)</span>
                  </div>

                  {/* 최종 목표 / Final goal */}
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 mb-1.5 block">최종 목표 / Final Goal</label>
                    <div className="grid grid-cols-2 gap-2">
                      {goalOptions.map((g) => (
                        <button
                          key={g.value}
                          onClick={() => setForm((f) => ({ ...f, finalGoal: g.value }))}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all ${
                            form.finalGoal === g.value
                              ? 'border-[#FF6600] bg-[#FF6600] text-white'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                          }`}
                        >
                          <span className="text-base">{g.emoji}</span>
                          <div>
                            <div className="text-xs font-semibold">{g.labelKo}</div>
                            <div className="text-xs opacity-75">{g.descKo}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 우선순위 / Priority */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">배송 우선순위 / Delivery Priority</label>
                    <div className="grid grid-cols-2 gap-2">
                      {priorityOptions.map((p) => (
                        <button
                          key={p.value}
                          onClick={() => setForm((f) => ({ ...f, priorityPreference: p.value }))}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all ${
                            form.priorityPreference === p.value
                              ? 'border-[#FF6600] bg-[#FF6600] text-white'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                          }`}
                        >
                          <span>{p.emoji}</span>
                          <div className="text-left">
                            <div className="font-semibold">{p.labelKo}</div>
                            <div className="opacity-75">{p.descKo}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── 배송 비용(자금) / Shipping cost (Fund) ── */}
                <div className="border border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center shrink-0">
                      <DollarSign size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">배송비(연간 자금) / Annual Budget</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {fundOptions.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setForm((prev) => ({ ...prev, availableAnnualFund: f.value }))}
                        className={`px-3 py-2 rounded-lg border text-xs transition-all text-left ${
                          form.availableAnnualFund === f.value
                            ? 'border-[#4D148C] bg-[#4D148C] text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <div className="font-semibold">{f.labelKo}</div>
                        <div className="opacity-75 text-xs">{f.labelEn}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── 조회 버튼 / Track button ── */}
                <button
                  onClick={handleTrack}
                  disabled={!isFormValid || isSearching}
                  className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                    isFormValid && !isSearching
                      ? 'bg-[#FF6600] hover:bg-orange-600 text-white shadow-lg shadow-orange-200'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>경로 검색 중... / Searching Routes...</span>
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      <span>비자 경로 추적 시작 / Start Visa Route Tracking</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* STEP 2: 추적 결과 / Tracking Results          */}
        {/* ══════════════════════════════════════════════ */}
        {step === 'tracking' && (
          <div className="space-y-4">
            {/* 추적 번호 카드 / Tracking number card */}
            <div className="bg-[#4D148C] text-white rounded-xl shadow-lg p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-purple-300 text-xs mb-1">추적 번호 / Tracking Number</p>
                  <p className="text-xl font-mono font-bold tracking-widest">{trackingNo}</p>
                </div>
                <div className="bg-[#FF6600] rounded-lg p-2">
                  <Package size={22} className="text-white" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-600 grid grid-cols-2 gap-4">
                {/* 발송인 / Sender */}
                <div>
                  <p className="text-purple-300 text-xs mb-1">발송인 / From</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{senderCountry?.flag ?? '🌐'}</span>
                    <div>
                      <p className="text-sm font-semibold">{senderCountry?.nameKo ?? form.nationality}</p>
                      <p className="text-purple-300 text-xs">
                        {form.age}세 · {educationOptions.find((e) => e.value === form.educationLevel)?.labelKo}
                      </p>
                    </div>
                  </div>
                </div>
                {/* 수취인 / Receiver */}
                <div>
                  <p className="text-purple-300 text-xs mb-1">수취인 / To</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{receiverGoal?.emoji ?? '🎯'}</span>
                    <div>
                      <p className="text-sm font-semibold">한국 {receiverGoal?.labelKo}</p>
                      <p className="text-purple-300 text-xs">
                        {priorityOptions.find((p) => p.value === form.priorityPreference)?.labelKo} 우선
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 결과 요약 / Result summary */}
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 경로 분석 완료
                </p>
                <p className="text-xs text-gray-500">
                  {mockDiagnosisResult.pathways.length}개 경로 발견 · {mockDiagnosisResult.meta.hardFilteredOut}개 제한
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Truck size={14} className="text-[#FF6600]" />
                <span>{mockDiagnosisResult.pathways.length} routes found</span>
              </div>
            </div>

            {/* 경로 카드 목록 / Route cards */}
            <div className="space-y-3">
              {mockPathways.map((pathway, index) => {
                const status = getStatusInfo(pathway.feasibilityLabel);
                const isExpanded = expandedId === pathway.pathwayId;
                const isSelected = selectedId === pathway.pathwayId;
                // 예상 도착일 계산 / Calculate estimated arrival
                const arrival = new Date(now.getTime() + pathway.estimatedMonths * 30 * 24 * 60 * 60 * 1000);
                const arrivalStr = arrival.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

                return (
                  <div
                    key={pathway.pathwayId}
                    className={`bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all ${
                      isSelected ? 'border-[#FF6600]' : 'border-transparent'
                    }`}
                  >
                    {/* 카드 헤더 / Card header */}
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => {
                        setExpandedId(isExpanded ? null : pathway.pathwayId);
                        setSelectedId(pathway.pathwayId);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* 순위 뱃지 / Rank badge */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                            index === 0
                              ? 'bg-[#FF6600] text-white'
                              : index === 1
                              ? 'bg-[#4D148C] text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* 경로명 + 상태 / Route name + status */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-bold text-gray-900 leading-tight">{pathway.nameKo}</p>
                              <p className="text-xs text-gray-400">{pathway.nameEn}</p>
                            </div>
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${status.color} ${status.bg} ${status.border}`}
                            >
                              {status.label}
                            </span>
                          </div>

                          {/* 추적 바 / Tracking bar */}
                          <div className="mt-2 flex items-center gap-1">
                            {pathway.milestones.map((m, mi) => (
                              <React.Fragment key={m.order}>
                                <div
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    mi === 0 ? 'bg-[#4D148C]' :
                                    mi === pathway.milestones.length - 1 ? 'bg-[#FF6600]' :
                                    'bg-purple-300'
                                  }`}
                                />
                                {mi < pathway.milestones.length - 1 && (
                                  <div className="h-0.5 flex-1 bg-gray-200" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>

                          {/* 핵심 지표 / Key metrics */}
                          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock size={11} className="text-[#4D148C]" />
                              <span>{pathway.estimatedMonths}개월</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign size={11} className="text-[#FF6600]" />
                              <span>{formatCost(pathway.estimatedCostWon)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Navigation size={11} className="text-green-500" />
                              <span>{arrivalStr} 예상</span>
                            </div>
                            <div className="ml-auto flex items-center gap-1 font-semibold" style={{ color: getScoreColor(pathway.finalScore) }}>
                              <span>{getFeasibilityEmoji(pathway.feasibilityLabel)}</span>
                              <span>{pathway.finalScore}점</span>
                            </div>
                          </div>

                          {/* 비자 체인 / Visa chain */}
                          <div className="mt-2 flex items-center gap-1 flex-wrap">
                            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, vi) => (
                              <React.Fragment key={vi}>
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-mono font-semibold">
                                  {v.code}
                                </span>
                                {vi < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                                  <ArrowRight size={10} className="text-gray-400" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        {/* 펼치기 아이콘 / Expand icon */}
                        <button className="text-gray-400 shrink-0 mt-1">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* 타임라인 상세 / Timeline detail */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 px-4 pb-4 pt-3 bg-gray-50">
                        <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1">
                          <Truck size={12} />
                          배송 추적 타임라인 / Delivery Tracking Timeline
                        </p>
                        <div className="space-y-3">
                          {pathway.milestones.map((m, mi) => {
                            const isFinal = mi === pathway.milestones.length - 1;
                            const milestoneDate = new Date(
                              now.getTime() + m.monthFromStart * 30 * 24 * 60 * 60 * 1000
                            );
                            const dateStr = milestoneDate.toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'short',
                            });
                            return (
                              <div key={m.order} className="flex gap-3">
                                {/* 타임라인 점/선 / Timeline dot/line */}
                                <div className="flex flex-col items-center shrink-0">
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                      isFinal
                                        ? 'bg-[#FF6600]'
                                        : mi === 0
                                        ? 'bg-[#4D148C]'
                                        : 'bg-purple-400'
                                    }`}
                                  >
                                    {isFinal ? (
                                      <MapPin size={10} className="text-white" />
                                    ) : mi === 0 ? (
                                      <Box size={10} className="text-white" />
                                    ) : (
                                      <CheckCircle size={10} className="text-white" />
                                    )}
                                  </div>
                                  {mi < pathway.milestones.length - 1 && (
                                    <div className="w-0.5 flex-1 bg-purple-200 mt-1 mb-1 min-h-4" />
                                  )}
                                </div>
                                {/* 내용 / Content */}
                                <div className={`flex-1 pb-1 ${mi < pathway.milestones.length - 1 ? 'mb-1' : ''}`}>
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="text-xs font-semibold text-gray-800">{m.nameKo}</p>
                                      {m.visaStatus && m.visaStatus !== 'none' && (
                                        <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono">
                                          {m.visaStatus}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="text-xs text-gray-500">{dateStr}</p>
                                      {m.estimatedMonthlyIncome > 0 && (
                                        <p className="text-xs text-green-600 font-semibold">
                                          +{m.estimatedMonthlyIncome}만원/월
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  {m.canWorkPartTime && (
                                    <p className="text-xs text-blue-600 mt-0.5">
                                      ✓ 파트타임 가능{m.weeklyHours > 0 ? ` (주 ${m.weeklyHours}시간)` : ''}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* 배송 메모 / Delivery note */}
                        <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                          <AlertCircle size={13} className="text-amber-500 mt-0.5 shrink-0" />
                          <p className="text-xs text-amber-700">{pathway.note}</p>
                        </div>

                        {/* 다음 단계 / Next steps */}
                        {pathway.nextSteps.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-gray-500 mb-2">즉시 해야 할 일 / Immediate Actions</p>
                            <div className="space-y-1.5">
                              {pathway.nextSteps.map((ns, nsi) => (
                                <div key={nsi} className="flex items-start gap-2 text-xs text-gray-700">
                                  <div className="w-4 h-4 rounded-full bg-[#FF6600] text-white flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">
                                    {nsi + 1}
                                  </div>
                                  <div>
                                    <span className="font-semibold">{ns.nameKo}</span>
                                    <span className="text-gray-500"> — {ns.description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 상세 버튼 / Detail button */}
                        <button
                          onClick={() => setStep('detail')}
                          className="mt-3 w-full py-2.5 bg-[#4D148C] hover:bg-purple-900 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                          <Package size={15} />
                          이 경로 자세히 보기 / View Route Detail
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 플랫폼 지원 안내 / Platform support notice */}
            <div className="bg-[#4D148C] bg-opacity-5 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
              <Star size={18} className="text-[#FF6600] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">잡차자 풀 서비스 지원 경로</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  full_support 경로는 잡차자에서 어학당 연결, 취업 매칭, 비자 처리까지 원스톱 지원합니다.
                </p>
                <p className="text-xs text-gray-400">Routes marked "full_support" are handled end-to-end by JobChaJa.</p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* STEP 3: 경로 상세 / Route Detail             */}
        {/* ══════════════════════════════════════════════ */}
        {step === 'detail' && selectedPathway && (
          <div className="space-y-4">
            {/* 뒤로 / Back */}
            <button
              onClick={() => setStep('tracking')}
              className="flex items-center gap-1.5 text-sm text-[#4D148C] hover:text-purple-900 font-semibold"
            >
              <RotateCcw size={14} />
              추적 목록으로 / Back to Results
            </button>

            {/* 상세 헤더 / Detail header */}
            <div className="bg-linear-to-br from-[#4D148C] to-purple-800 text-white rounded-xl shadow-lg p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-purple-300 text-xs mb-1">선택된 배송 경로 / Selected Route</p>
                  <h2 className="text-xl font-bold">{selectedPathway.nameKo}</h2>
                  <p className="text-purple-300 text-sm mt-0.5">{selectedPathway.nameEn}</p>
                </div>
                <div
                  className="text-2xl font-black"
                  style={{ color: getScoreColor(selectedPathway.finalScore) }}
                >
                  {selectedPathway.finalScore}
                </div>
              </div>

              {/* 점수 분해 / Score breakdown */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: '기본 점수', labelEn: 'Base', value: selectedPathway.scoreBreakdown.base },
                  { label: '나이', labelEn: 'Age', value: Math.round(selectedPathway.scoreBreakdown.ageMultiplier * 100) },
                  { label: '학력', labelEn: 'Edu', value: Math.round(selectedPathway.scoreBreakdown.educationMultiplier * 100) },
                  { label: '국적', labelEn: 'Nation', value: Math.round(selectedPathway.scoreBreakdown.nationalityMultiplier * 100) },
                  { label: '자금', labelEn: 'Fund', value: Math.round(selectedPathway.scoreBreakdown.fundMultiplier * 100) },
                  { label: '우선순위', labelEn: 'Priority', value: Math.round(selectedPathway.scoreBreakdown.priorityWeight * 100) },
                ].map((item) => (
                  <div key={item.label} className="bg-purple-700 bg-opacity-60 rounded-lg p-2 text-center">
                    <p className="text-purple-300 text-xs">{item.label}</p>
                    <p className="text-white font-bold text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 배송 정보 요약 / Shipping summary */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1">
                <Package size={12} />
                배송 정보 요약 / Shipment Summary
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <Clock size={16} className="text-[#4D148C] mx-auto mb-1" />
                  <p className="text-lg font-bold text-[#4D148C]">{selectedPathway.estimatedMonths}</p>
                  <p className="text-xs text-gray-500">개월 소요</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <DollarSign size={16} className="text-[#FF6600] mx-auto mb-1" />
                  <p className="text-lg font-bold text-[#FF6600]">{formatCost(selectedPathway.estimatedCostWon)}</p>
                  <p className="text-xs text-gray-500">예상 비용</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <Navigation size={16} className="text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-bold text-green-700">
                    {(() => {
                      const arr = new Date(now.getTime() + selectedPathway.estimatedMonths * 30 * 24 * 60 * 60 * 1000);
                      return arr.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
                    })()}
                  </p>
                  <p className="text-xs text-gray-500">예상 도착</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <Zap size={16} className="text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-bold text-blue-700 capitalize">{selectedPathway.platformSupport.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500">잡차자 지원</p>
                </div>
              </div>
            </div>

            {/* 전체 타임라인 / Full timeline */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <p className="text-xs font-semibold text-gray-500 mb-4 flex items-center gap-1">
                <Truck size={12} />
                전체 배송 추적 / Full Tracking Timeline
              </p>
              <div className="space-y-4">
                {selectedPathway.milestones.map((m, mi) => {
                  const isFinal = mi === selectedPathway.milestones.length - 1;
                  const milestoneDate = new Date(
                    now.getTime() + m.monthFromStart * 30 * 24 * 60 * 60 * 1000
                  );
                  return (
                    <div key={m.order} className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                            isFinal ? 'bg-[#FF6600]' : mi === 0 ? 'bg-[#4D148C]' : 'bg-purple-400'
                          }`}
                        >
                          {isFinal ? <MapPin size={14} /> : mi === 0 ? <Box size={14} /> : <CheckCircle size={14} />}
                        </div>
                        {mi < selectedPathway.milestones.length - 1 && (
                          <div className="w-0.5 flex-1 bg-purple-100 mt-2 mb-2 min-h-6" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-bold text-gray-800">{m.nameKo}</p>
                            {m.visaStatus && m.visaStatus !== 'none' && (
                              <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono font-semibold">
                                {m.visaStatus}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">
                              {milestoneDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' })}
                            </p>
                            <p className="text-xs text-gray-400">+{m.monthFromStart}개월</p>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {m.canWorkPartTime && (
                            <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">
                              파트타임 가능{m.weeklyHours > 0 ? ` 주${m.weeklyHours}h` : ''}
                            </span>
                          )}
                          {m.estimatedMonthlyIncome > 0 && (
                            <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full">
                              +{m.estimatedMonthlyIncome}만원/월
                            </span>
                          )}
                        </div>
                        {/* 배송 바 / mini progress */}
                        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-[#4D148C] to-[#FF6600]"
                            style={{
                              width: `${Math.min(100, ((mi + 1) / selectedPathway.milestones.length) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 다음 행동 / Next actions */}
            {selectedPathway.nextSteps.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-4">
                <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1">
                  <Zap size={12} className="text-[#FF6600]" />
                  지금 당장 해야 할 일 / Immediate Action Items
                </p>
                <div className="space-y-2">
                  {selectedPathway.nextSteps.map((ns, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-[#FF6600] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{ns.nameKo}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{ns.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 메모 / Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">배송 유의사항 / Delivery Note</p>
                <p className="text-xs text-amber-700 mt-1">{selectedPathway.note}</p>
              </div>
            </div>

            {/* 상담 CTA / Consult CTA */}
            <div className="bg-linear-to-br from-[#4D148C] to-purple-700 rounded-xl p-5 text-white text-center">
              <Package size={28} className="mx-auto mb-2 text-[#FF6600]" />
              <h3 className="text-base font-bold mb-1">전문 비자 상담 서비스</h3>
              <p className="text-xs text-purple-300 mb-3">
                잡차자 전문가가 최적 경로 설계부터 비자 발급까지 도와드립니다.
              </p>
              <button className="w-full py-3 bg-[#FF6600] hover:bg-orange-500 text-white rounded-lg font-bold text-sm transition-colors">
                무료 상담 신청하기 / Get Free Consultation
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 푸터 / Footer */}
      <footer className="mt-8 border-t border-gray-200 bg-white py-4 text-center">
        <p className="text-xs text-gray-400">
          JobChaJa Visa Route Tracker · 잡차자 비자 경로 추적 서비스 ·{' '}
          <span className="text-[#4D148C]">Design #49</span>
        </p>
      </footer>
    </div>
  );
}
