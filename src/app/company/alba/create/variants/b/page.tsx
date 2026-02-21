'use client';

/**
 * Variant B — 알바 공고 등록 3-Step Wizard (정보 밀도 높은 사람인/잡코리아 스타일)
 * Variant B — Alba job create 3-step wizard (information-dense Saramin/Jobkorea style)
 *
 * 특징: 필드셋 스타일 박스, 가능한 한 스크롤 없이 모든 필드 표시,
 *       테이블형 스케줄 입력, 인라인 유효성 검사 메시지
 * Features: Fieldset-style boxes, all fields visible without scrolling,
 *           tabular schedule input, inline validation messages
 */

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Save, ChevronRight, ChevronLeft, Send,
  Briefcase, Clock, MapPin, FileText, Eye,
  AlertCircle, CheckCircle, Loader2,
} from 'lucide-react';
import { StepProgressBarB } from './components/step-progress-bar-b';
import { SchedulePickerB } from './components/schedule-picker-b';
import { VisaMatchBadgesB } from './components/visa-match-badges-b';
import type {
  AlbaJobFormData,
  ScheduleItem,
  KoreanLevel,
  ExperienceLevel,
  Benefit,
  ApplicationMethod,
  VisaMatchingResponse,
} from './components/alba-types';
import {
  JOB_CATEGORIES,
  KOREAN_LEVEL_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  BENEFIT_LABELS,
  APPLICATION_METHOD_LABELS,
  DAY_LABELS,
  SIDO_LIST,
} from './components/alba-types';

// ─── 초기 폼 데이터 / Initial form data ───
const INITIAL_FORM: AlbaJobFormData = {
  jobCategoryCode: '',
  jobDescription: '',
  recruitCount: 1,
  hourlyWage: 10030,
  weeklyHours: 0,
  schedule: [],
  workPeriod: { startDate: '', endDate: null },
  title: '',
  address: { sido: '', sigungu: '', detail: '', lat: 0, lng: 0 },
  koreanLevel: 'NONE',
  experienceLevel: 'NONE',
  preferredQualifications: '',
  benefits: [],
  detailDescription: '',
  workContentImg: null,
  applicationDeadline: null,
  applicationMethod: 'PLATFORM',
  contactName: '',
  contactPhone: '',
  contactEmail: null,
};

// ─── 유효성 에러 타입 / Validation error type ───
type FormErrors = Partial<Record<keyof AlbaJobFormData, string>>;

// ─── 목업 비자 매칭 결과 / Mock visa matching response ───
const MOCK_VISA_RESULT: VisaMatchingResponse = {
  eligible: [
    { visaCode: 'F-5', visaName: '영주', visaNameEn: 'Permanent Residence', status: 'eligible', notes: '내국인과 동일한 취업 권리' },
    { visaCode: 'F-6', visaName: '결혼이민', visaNameEn: 'Marriage Immigration', status: 'eligible', notes: '내국인과 동일한 취업 권리' },
    { visaCode: 'F-2', visaName: '거주', visaNameEn: 'Residence', status: 'eligible', notes: '취업 제한 없음' },
    { visaCode: 'H-1', visaName: '워킹홀리데이', visaNameEn: 'Working Holiday', status: 'eligible', notes: '체류기간 최대 1년, 18~30세 대상' },
  ],
  conditional: [
    { visaCode: 'D-2', visaName: '유학', visaNameEn: 'Study Abroad', status: 'conditional', conditions: ['주말 근무만 가능 (평일 포함 시 TOPIK 3급+ 필요)', '체류자격외활동허가 필요'], maxWeeklyHours: 30, maxWorkplaces: 2, requiredPermit: '체류자격외활동허가' },
    { visaCode: 'H-2', visaName: '방문취업', visaNameEn: 'Visit & Employment', status: 'conditional', conditions: ['특례고용허가 필요 (일부 업종)'], requiredPermit: '특례고용허가' },
    { visaCode: 'F-4', visaName: '재외동포', visaNameEn: 'Overseas Korean', status: 'conditional', conditions: ['단순노무 해당 시 예외 직종 확인 필요'] },
  ],
  blocked: [
    { visaCode: 'C-3', visaName: '단기방문', visaNameEn: 'Short-term Visit', status: 'blocked', blockReasons: ['취업 활동 불가 비자'] },
    { visaCode: 'B-1', visaName: '사증면제', visaNameEn: 'Visa Exemption', status: 'blocked', blockReasons: ['취업 활동 불가 비자'] },
  ],
  summary: { totalEligible: 4, totalConditional: 3, totalBlocked: 2 },
  matchedAt: new Date().toISOString(),
  inputSummary: { jobCategoryCode: 'REST_SERVING', ksicCode: 'I', weeklyHours: 20, isWeekendOnly: true, hasWeekdayShift: false, isDepopulationArea: false },
};

export default function AlbaCreateVariantBPage() {
  // ─── 상태 / State ───
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<AlbaJobFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [matchResult, setMatchResult] = useState<VisaMatchingResponse | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  // ─── 폼 업데이트 / Form update ───
  const updateForm = useCallback(<K extends keyof AlbaJobFormData>(key: K, value: AlbaJobFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    // 에러 클리어 / Clear error
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }, [errors]);

  // ─── Step 1 유효성 검사 / Step 1 validation ───
  const validateStep1 = useCallback((): boolean => {
    const errs: FormErrors = {};
    if (!form.jobCategoryCode) errs.jobCategoryCode = '직종을 선택해주세요';
    if (form.recruitCount < 1) errs.recruitCount = '모집인원은 1명 이상이어야 합니다';
    if (form.hourlyWage < 10030) errs.hourlyWage = '최저시급(10,030원) 이상이어야 합니다';
    if (form.schedule.length === 0) errs.schedule = '근무 요일을 1개 이상 선택해주세요';
    if (!form.workPeriod.startDate) errs.workPeriod = '근무 시작일을 입력해주세요';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  // ─── Step 2 유효성 검사 / Step 2 validation ───
  const validateStep2 = useCallback((): boolean => {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = '공고 제목을 입력해주세요';
    if (!form.address.sido) errs.address = '근무지 주소를 입력해주세요';
    if (!form.detailDescription.trim()) errs.detailDescription = '상세 직무 설명을 입력해주세요';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  // ─── 비자 매칭 실행 (목업) / Run visa matching (mock) ───
  const runVisaMatching = useCallback(async () => {
    setMatchLoading(true);
    // 실제 API 호출 시뮬레이션 / Simulate actual API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    setMatchResult(MOCK_VISA_RESULT);
    setMatchLoading(false);
  }, []);

  // ─── 다음 스텝 / Next step ───
  const handleNext = useCallback(async () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2) {
      if (!validateStep2()) return;
      // Step 2 → 3 전환 시 비자 매칭 실행 / Run matching when going to step 3
      await runVisaMatching();
    }
    setStep(prev => Math.min(3, prev + 1));
  }, [step, validateStep1, validateStep2, runVisaMatching]);

  // ─── 이전 스텝 / Previous step ───
  const handleBack = useCallback(() => {
    setStep(prev => Math.max(1, prev - 1));
  }, []);

  // ─── 스텝 직접 이동 / Go to step directly ───
  const goToStep = useCallback((target: number) => {
    if (target < step) setStep(target);
  }, [step]);

  // ─── 임시 저장 / Manual save (mock) ───
  const handleSave = useCallback(() => {
    const now = new Date();
    setLastSaved(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`);
  }, []);

  // ─── 제출 / Submit ───
  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitting(false);
    setShowCompletion(true);
  }, []);

  // ─── 직종 그룹 / Category groups ───
  const categoryGroups = useMemo(() => {
    const groups: Record<string, typeof JOB_CATEGORIES> = {};
    JOB_CATEGORIES.forEach(cat => {
      if (!groups[cat.group]) groups[cat.group] = [];
      groups[cat.group].push(cat);
    });
    return groups;
  }, []);

  // ─── 완료 화면 / Completion screen ───
  if (showCompletion) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">알바 공고가 등록되었습니다!</h2>
          <p className="text-sm text-gray-500 mb-6">
            비자 매칭 결과: {matchResult?.summary.totalEligible}개 가능, {matchResult?.summary.totalConditional}개 조건부
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/company/alba"
              className="px-5 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded hover:bg-blue-800 transition-colors"
            >
              공고 관리로 이동
            </Link>
            <Link
              href="/company/alba/create/variants/b"
              className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded hover:bg-gray-50 transition-colors"
            >
              새 공고 등록
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* ─── 헤더 / Header ─── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Link
            href="/company/alba"
            className="p-1.5 text-gray-400 hover:text-gray-700 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="공고 관리로 돌아가기 / Back to job management"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-bold text-gray-900">알바 공고 등록</h1>
          <span className="text-xs text-gray-400 hidden sm:inline">/ Part-time Job Posting</span>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded hover:bg-gray-50 transition-colors min-h-[36px]"
          aria-label="임시 저장 / Save draft"
        >
          <Save className="w-3.5 h-3.5" />
          {lastSaved ? `저장됨 ${lastSaved}` : '임시저장'}
        </button>
      </div>

      {/* ─── 진행 바 / Progress bar ─── */}
      <StepProgressBarB currentStep={step} onStepClick={goToStep} />

      {/* ─── Step 1: 직무 / 근무조건 ─── */}
      {step === 1 && (
        <div className="space-y-4">
          {/* 직종 + 직무설명 필드셋 / Category + description fieldset */}
          <fieldset className="border border-gray-200 rounded-sm bg-white">
            <legend className="ml-4 px-2 text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600" />
              직종 정보 / Job Category
            </legend>
            <div className="p-4 space-y-3">
              {/* 직종 선택 / Category select */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    직종 선택 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.jobCategoryCode}
                    onChange={e => updateForm('jobCategoryCode', e.target.value)}
                    className={`w-full border rounded px-3 py-2 text-sm bg-white ${errors.jobCategoryCode ? 'border-red-400' : 'border-gray-200'}`}
                    aria-label="직종 선택 / Select job category"
                  >
                    <option value="">-- 직종을 선택하세요 --</option>
                    {Object.entries(categoryGroups).map(([group, cats]) => (
                      <optgroup key={group} label={group}>
                        {cats.map(cat => (
                          <option key={cat.code} value={cat.code}>{cat.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {errors.jobCategoryCode && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.jobCategoryCode}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    모집인원 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.recruitCount}
                    onChange={e => updateForm('recruitCount', Math.max(1, parseInt(e.target.value) || 1))}
                    className={`w-full border rounded px-3 py-2 text-sm ${errors.recruitCount ? 'border-red-400' : 'border-gray-200'}`}
                    aria-label="모집인원 / Number of positions"
                  />
                  {errors.recruitCount && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.recruitCount}
                    </p>
                  )}
                </div>
              </div>
              {/* 직무 설명 / Job description */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">직무 상세 설명</label>
                <textarea
                  rows={2}
                  value={form.jobDescription}
                  onChange={e => updateForm('jobDescription', e.target.value)}
                  placeholder="예: 주말 런치 서빙 및 정리"
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm resize-none"
                  aria-label="직무 상세 설명 / Job description"
                />
              </div>
            </div>
          </fieldset>

          {/* 시급 + 근무기간 필드셋 / Wage + period fieldset */}
          <fieldset className="border border-gray-200 rounded-sm bg-white">
            <legend className="ml-4 px-2 text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              급여 / 근무기간 / Wage & Period
            </legend>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 시급 / Hourly wage */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    시급 (원) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={10030}
                      step={100}
                      value={form.hourlyWage}
                      onChange={e => updateForm('hourlyWage', parseInt(e.target.value) || 0)}
                      className={`w-full border rounded px-3 py-2 text-sm pr-8 ${errors.hourlyWage ? 'border-red-400' : 'border-gray-200'}`}
                      aria-label="시급 / Hourly wage"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">원</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">2025 최저시급: 10,030원</p>
                  {errors.hourlyWage && (
                    <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.hourlyWage}
                    </p>
                  )}
                </div>
                {/* 근무 시작일 / Start date */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    근무 시작일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.workPeriod.startDate}
                    onChange={e => updateForm('workPeriod', { ...form.workPeriod, startDate: e.target.value })}
                    className={`w-full border rounded px-3 py-2 text-sm ${errors.workPeriod ? 'border-red-400' : 'border-gray-200'}`}
                    aria-label="근무 시작일 / Work start date"
                  />
                  {errors.workPeriod && (
                    <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.workPeriod}
                    </p>
                  )}
                </div>
                {/* 근무 종료일 / End date */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">근무 종료일</label>
                  <input
                    type="date"
                    value={form.workPeriod.endDate || ''}
                    onChange={e => updateForm('workPeriod', { ...form.workPeriod, endDate: e.target.value || null })}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                    aria-label="근무 종료일 / Work end date"
                  />
                  <p className="text-[11px] text-gray-400 mt-0.5">비워두면 &quot;채용시까지&quot;</p>
                </div>
              </div>
            </div>
          </fieldset>

          {/* 근무 스케줄 필드셋 / Schedule fieldset */}
          <fieldset className="border border-gray-200 rounded-sm bg-white">
            <legend className="ml-4 px-2 text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              근무 스케줄 / Work Schedule <span className="text-red-500">*</span>
            </legend>
            <div className="p-4">
              <SchedulePickerB
                schedule={form.schedule}
                onChange={(s: ScheduleItem[]) => updateForm('schedule', s)}
                weeklyHours={form.weeklyHours}
                onWeeklyHoursChange={(h: number) => updateForm('weeklyHours', h)}
              />
              {errors.schedule && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.schedule}
                </p>
              )}
            </div>
          </fieldset>
        </div>
      )}

      {/* ─── Step 2: 상세정보 / 위치 ─── */}
      {step === 2 && (
        <div className="space-y-4">
          {/* 공고 기본정보 / Basic info */}
          <fieldset className="border border-gray-200 rounded-sm bg-white">
            <legend className="ml-4 px-2 text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              공고 기본정보 / Posting Info
            </legend>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  공고 제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={form.title}
                  onChange={e => updateForm('title', e.target.value)}
                  placeholder="예: 강남역 근처 카페 주말 바리스타 모집"
                  className={`w-full border rounded px-3 py-2 text-sm ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
                  aria-label="공고 제목 / Job title"
                />
                <div className="flex items-center justify-between mt-0.5">
                  {errors.title && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.title}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 ml-auto">{form.title.length}/100</p>
                </div>
              </div>
            </div>
          </fieldset>

          {/* 근무지 주소 + 조건 (2-column on desktop) / Address + requirements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 근무지 주소 / Workplace address */}
            <fieldset className="border border-gray-200 rounded-sm bg-white">
              <legend className="ml-4 px-2 text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                근무지 주소 / Address <span className="text-red-500">*</span>
              </legend>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">시/도</label>
                    <select
                      value={form.address.sido}
                      onChange={e => updateForm('address', { ...form.address, sido: e.target.value, sigungu: '' })}
                      className={`w-full border rounded px-3 py-2 text-sm bg-white ${errors.address ? 'border-red-400' : 'border-gray-200'}`}
                      aria-label="시/도 선택 / Select province"
                    >
                      <option value="">-- 선택 --</option>
                      {SIDO_LIST.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">시/군/구</label>
                    <input
                      type="text"
                      value={form.address.sigungu}
                      onChange={e => updateForm('address', { ...form.address, sigungu: e.target.value })}
                      placeholder="예: 강남구"
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                      aria-label="시/군/구 입력 / Enter district"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">상세 주소</label>
                  <input
                    type="text"
                    value={form.address.detail}
                    onChange={e => updateForm('address', { ...form.address, detail: e.target.value })}
                    placeholder="예: 역삼동 123-45 2층"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                    aria-label="상세 주소 / Detail address"
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{errors.address}
                  </p>
                )}
              </div>
            </fieldset>

            {/* 우대 조건 / Requirements */}
            <fieldset className="border border-gray-200 rounded-sm bg-white">
              <legend className="ml-4 px-2 text-sm font-semibold text-gray-700">
                우대 조건 / Requirements
              </legend>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">한국어 수준</label>
                    <select
                      value={form.koreanLevel}
                      onChange={e => updateForm('koreanLevel', e.target.value as KoreanLevel)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white"
                      aria-label="한국어 수준 / Korean level"
                    >
                      {(Object.entries(KOREAN_LEVEL_LABELS) as [KoreanLevel, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">경력</label>
                    <select
                      value={form.experienceLevel}
                      onChange={e => updateForm('experienceLevel', e.target.value as ExperienceLevel)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white"
                      aria-label="경력 수준 / Experience level"
                    >
                      {(Object.entries(EXPERIENCE_LEVEL_LABELS) as [ExperienceLevel, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">우대사항 (자유 텍스트)</label>
                  <input
                    type="text"
                    value={form.preferredQualifications}
                    onChange={e => updateForm('preferredQualifications', e.target.value)}
                    placeholder="예: 바리스타 자격증 우대"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                    aria-label="우대사항 / Preferred qualifications"
                  />
                </div>
              </div>
            </fieldset>
          </div>

          {/* 복리후생 / Benefits */}
          <fieldset className="border border-gray-200 rounded-sm bg-white">
            <legend className="ml-4 px-2 text-sm font-semibold text-gray-700">
              복리후생 / Benefits
            </legend>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {(Object.entries(BENEFIT_LABELS) as [Benefit, string][]).map(([key, label]) => {
                  const isChecked = form.benefits.includes(key);
                  return (
                    <label
                      key={key}
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-2 rounded border text-sm cursor-pointer transition-colors
                        min-h-[44px]
                        ${isChecked
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const next = isChecked
                            ? form.benefits.filter(b => b !== key)
                            : [...form.benefits, key];
                          updateForm('benefits', next);
                        }}
                        className="sr-only"
                      />
                      <span className={`w-4 h-4 border rounded flex items-center justify-center text-xs ${isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                        {isChecked && '\u2713'}
                      </span>
                      {label}
                    </label>
                  );
                })}
              </div>
            </div>
          </fieldset>

          {/* 상세 설명 / Detailed description */}
          <fieldset className="border border-gray-200 rounded-sm bg-white">
            <legend className="ml-4 px-2 text-sm font-semibold text-gray-700">
              상세 직무 설명 / Detail Description <span className="text-red-500">*</span>
            </legend>
            <div className="p-4">
              <textarea
                rows={6}
                value={form.detailDescription}
                onChange={e => updateForm('detailDescription', e.target.value)}
                placeholder="근무 환경, 주요 업무 내용, 원하는 인재상 등을 상세히 적어주세요."
                className={`w-full border rounded px-3 py-2 text-sm resize-vertical ${errors.detailDescription ? 'border-red-400' : 'border-gray-200'}`}
                aria-label="상세 직무 설명 / Detailed description"
              />
              {errors.detailDescription && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.detailDescription}
                </p>
              )}
            </div>
          </fieldset>
        </div>
      )}

      {/* ─── Step 3: 미리보기 + 비자 매칭 + 등록 ─── */}
      {step === 3 && (
        <div className="space-y-4">
          {/* 공고 미리보기 테이블 / Preview table */}
          <div className="border border-gray-200 rounded-sm bg-white">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">공고 미리보기 / Preview</span>
            </div>
            <div className="p-4">
              {/* 제목 영역 / Title area */}
              <h2 className="text-lg font-bold text-gray-900 mb-3">{form.title || '(제목 없음)'}</h2>

              {/* 핵심 정보 테이블 / Key info table */}
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-500 font-medium w-[120px]">직종</td>
                    <td className="py-2 text-gray-800">
                      {JOB_CATEGORIES.find(c => c.code === form.jobCategoryCode)?.name || '-'}
                    </td>
                    <td className="py-2 pr-4 text-gray-500 font-medium w-[120px]">모집인원</td>
                    <td className="py-2 text-gray-800">{form.recruitCount}명</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-500 font-medium">시급</td>
                    <td className="py-2 text-blue-700 font-bold">{form.hourlyWage.toLocaleString()}원</td>
                    <td className="py-2 pr-4 text-gray-500 font-medium">주당 근무</td>
                    <td className="py-2 text-gray-800">{form.weeklyHours}시간</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-500 font-medium">근무요일</td>
                    <td className="py-2 text-gray-800" colSpan={3}>
                      {form.schedule.map(s => `${DAY_LABELS[s.dayOfWeek]} ${s.startTime}~${s.endTime}`).join(' / ') || '-'}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-500 font-medium">근무기간</td>
                    <td className="py-2 text-gray-800" colSpan={3}>
                      {form.workPeriod.startDate} ~ {form.workPeriod.endDate || '채용시까지'}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-500 font-medium">근무지</td>
                    <td className="py-2 text-gray-800" colSpan={3}>
                      {form.address.sido} {form.address.sigungu} {form.address.detail}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-500 font-medium">한국어</td>
                    <td className="py-2 text-gray-800">{KOREAN_LEVEL_LABELS[form.koreanLevel]}</td>
                    <td className="py-2 pr-4 text-gray-500 font-medium">경력</td>
                    <td className="py-2 text-gray-800">{EXPERIENCE_LEVEL_LABELS[form.experienceLevel]}</td>
                  </tr>
                  {form.benefits.length > 0 && (
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 text-gray-500 font-medium">복리후생</td>
                      <td className="py-2 text-gray-800" colSpan={3}>
                        <div className="flex flex-wrap gap-1">
                          {form.benefits.map(b => (
                            <span key={b} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              {BENEFIT_LABELS[b]}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* 상세 설명 / Detail description */}
              {form.detailDescription && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">상세 설명</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {form.detailDescription}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 비자 매칭 결과 / Visa matching result */}
          <VisaMatchBadgesB matchResult={matchResult} loading={matchLoading} />

          {/* 접수 설정 / Application settings */}
          <fieldset className="border border-gray-200 rounded-sm bg-white">
            <legend className="ml-4 px-2 text-sm font-semibold text-gray-700">
              접수 설정 / Application Settings
            </legend>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">접수 마감일</label>
                  <input
                    type="date"
                    value={form.applicationDeadline || ''}
                    onChange={e => updateForm('applicationDeadline', e.target.value || null)}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                    aria-label="접수 마감일 / Application deadline"
                  />
                  <p className="text-[11px] text-gray-400 mt-0.5">비워두면 채용시까지</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">접수 방법</label>
                  <select
                    value={form.applicationMethod}
                    onChange={e => updateForm('applicationMethod', e.target.value as ApplicationMethod)}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white"
                    aria-label="접수 방법 / Application method"
                  >
                    {(Object.entries(APPLICATION_METHOD_LABELS) as [ApplicationMethod, string][]).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">담당자 연락처</label>
                  <input
                    type="tel"
                    value={form.contactPhone}
                    onChange={e => updateForm('contactPhone', e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                    aria-label="담당자 연락처 / Contact phone"
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      )}

      {/* ─── 하단 네비게이션 / Bottom navigation ─── */}
      <div className="mt-6 border-t border-gray-200 pt-4 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors min-h-[44px]"
            aria-label="이전 단계 / Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded hover:bg-blue-800 transition-colors min-h-[44px]"
            aria-label="다음 단계 / Next step"
          >
            다음
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || matchLoading}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-700 text-white text-sm font-bold rounded hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            aria-label="공고 등록 / Register posting"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                등록 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                공고 등록
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
