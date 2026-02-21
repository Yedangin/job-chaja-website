'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Briefcase,
  MapPin,
  Eye,
  Save,
  Loader2,
  Clock,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Phone,
  Mail,
  AlertCircle,
  ShieldCheck,
  Star,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CategorySelector } from './components/category-selector';
import { SchedulePicker } from './components/schedule-picker';
import { VisaMatchBadges, VisaBadgeInline } from './components/visa-match-badges';
import {
  MOCK_VISA_ELIGIBLE,
  MOCK_VISA_CONDITIONAL,
  MOCK_VISA_BLOCKED,
  MOCK_MATCHING_SUMMARY,
} from './components/mock-data';
import type {
  AlbaJobFormData,
  ScheduleItem,
  DayOfWeek,
  KoreanLevel,
  ExperienceLevel,
  BenefitCode,
  ApplicationMethod,
} from './components/alba-types';
import {
  JOB_CATEGORIES,
  BENEFITS_MAP,
  DAY_LABELS,
  KOREAN_LEVEL_LABELS,
  EXPERIENCE_LEVEL_LABELS,
} from './components/alba-types';

/**
 * 알바 공고 등록 3-Step 위자드 — Variant C (카드 비주얼)
 * Alba job creation 3-step wizard — Variant C (card visual)
 *
 * 알바몬/당근마켓 스타일 — 각 스텝이 카드 단위로 구성
 * Albamon/Daangn style — each step organized as card sections
 */

// 기본 폼 데이터 / Default form data
const DEFAULT_FORM: AlbaJobFormData = {
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

// 스텝 정의 / Step definitions
const STEPS = [
  { number: 1, title: '어떤 일인가요?', titleEn: 'What work?', icon: Briefcase },
  { number: 2, title: '상세 정보', titleEn: 'Details', icon: MapPin },
  { number: 3, title: '미리보기', titleEn: 'Preview', icon: Eye },
] as const;

export default function AlbaCreateVariantCPage() {
  // 현재 스텝 / Current step
  const [currentStep, setCurrentStep] = useState(1);
  // 폼 데이터 / Form data
  const [form, setForm] = useState<AlbaJobFormData>(DEFAULT_FORM);
  // 제출 상태 / Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 저장 상태 / Save state
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  // 완료 상태 / Completion state
  const [isCompleted, setIsCompleted] = useState(false);
  // 매칭 로딩 / Matching loading
  const [matchLoading, setMatchLoading] = useState(false);

  // 폼 업데이트 헬퍼 / Form update helper
  const updateForm = useCallback(<K extends keyof AlbaJobFormData>(
    key: K,
    value: AlbaJobFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // 주당 근무시간 자동 계산 / Auto-calculate weekly hours
  const calculatedWeeklyHours = useMemo(() => {
    return form.schedule.reduce((total, item) => {
      const [sh, sm] = item.startTime.split(':').map(Number);
      const [eh, em] = item.endTime.split(':').map(Number);
      let hours = (eh * 60 + em - (sh * 60 + sm)) / 60;
      if (hours < 0) hours += 24;
      return total + hours;
    }, 0);
  }, [form.schedule]);

  // 주말만 근무 여부 / Weekend-only flag
  const isWeekendOnly = useMemo(() => {
    if (form.schedule.length === 0) return false;
    return form.schedule.every((s) => s.dayOfWeek === 'SAT' || s.dayOfWeek === 'SUN');
  }, [form.schedule]);

  // 직종 이름 / Category name
  const categoryInfo = useMemo(
    () => JOB_CATEGORIES.find((c) => c.code === form.jobCategoryCode),
    [form.jobCategoryCode]
  );

  // 다음 스텝으로 / Go to next step
  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      // 스텝 3 진입 시 매칭 시뮬레이션 / Simulate matching on step 3 entry
      if (currentStep === 2) {
        setMatchLoading(true);
        setTimeout(() => setMatchLoading(false), 1200);
      }
    }
  }, [currentStep]);

  // 이전 스텝으로 / Go to previous step
  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // 임시 저장 / Draft save
  const handleSave = useCallback(() => {
    const now = new Date();
    setLastSaved(
      `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    );
  }, []);

  // 공고 등록 / Submit posting
  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    // 실제 API 호출 시뮬레이션 / Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 1500);
  }, []);

  // 완료 화면 / Completion screen
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          {/* 성공 아이콘 / Success icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {/* 공고 등록 완료! / Posting created! */}
              공고 등록 완료!
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Your job posting has been created successfully.
            </p>
          </div>

          {/* 매칭 요약 / Matching summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <p className="text-sm font-semibold text-gray-900">
                {/* 비자 매칭 결과 / Visa matching result */}
                7개 비자 유형의 구직자가 지원 가능
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[...MOCK_VISA_ELIGIBLE, ...MOCK_VISA_CONDITIONAL].map((v) => (
                <VisaBadgeInline
                  key={v.visaCode}
                  status={v.status}
                  visaCode={v.visaCode}
                />
              ))}
            </div>
          </div>

          {/* 액션 버튼 / Action buttons */}
          <div className="space-y-3">
            <Link href="/company/alba/variants/c" className="block">
              <Button className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                {/* 공고 관리로 이동 / Go to job management */}
                공고 관리로 이동
              </Button>
            </Link>
            <Link href="/company/alba/create/variants/c" className="block">
              <Button variant="outline" className="w-full h-12 rounded-xl font-semibold">
                {/* 새 공고 등록 / Create new posting */}
                새 공고 등록
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-gray-50">
      {/* 상단 헤더 / Top header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/company/alba/variants/c"
              className="p-2 rounded-lg hover:bg-gray-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="뒤로가기 / Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-base font-bold text-gray-900">
              {/* 알바 공고 등록 / Create Alba Posting */}
              알바 공고 등록
            </h1>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-orange-600 transition min-h-[44px]"
            aria-label="임시 저장 / Save draft"
          >
            <Save className="w-4 h-4" />
            {lastSaved ? (
              <span className="text-xs text-green-600">
                {/* 저장됨 / Saved */}
                {lastSaved} 저장됨
              </span>
            ) : (
              <span className="text-xs">
                {/* 임시저장 / Save draft */}
                임시저장
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 스텝 진행바 / Step progress bar */}
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          {STEPS.map((step, idx) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.number;
            const isDone = currentStep > step.number;

            return (
              <div key={step.number} className="flex items-center flex-1">
                {/* 스텝 인디케이터 / Step indicator */}
                <button
                  type="button"
                  onClick={() => {
                    if (isDone) setCurrentStep(step.number);
                  }}
                  disabled={!isDone && !isActive}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl transition-all w-full min-h-[44px]',
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                      : isDone
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer'
                        : 'bg-gray-100 text-gray-400'
                  )}
                  aria-label={`${step.title} / ${step.titleEn}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone ? (
                    <Check className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <StepIcon className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="text-xs font-semibold truncate hidden sm:inline">
                    {step.title}
                  </span>
                  <span className="text-xs font-bold sm:hidden">{step.number}</span>
                </button>

                {/* 연결선 / Connector line */}
                {idx < STEPS.length - 1 && (
                  <div className={cn(
                    'h-0.5 w-4 flex-shrink-0 mx-1 rounded-full',
                    currentStep > step.number ? 'bg-orange-300' : 'bg-gray-200'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 스텝 컨텐츠 / Step content */}
      <main className="max-w-2xl mx-auto px-4 pb-32">
        {/* ─── Step 1: 어떤 일인가요? / What kind of work? ─── */}
        {currentStep === 1 && (
          <div className="space-y-4 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* 직종 선택 카드 / Job category selector card */}
            <Card className="rounded-2xl border-0 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                <h2 className="text-white font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  {/* 어떤 직종의 알바인가요? / What type of part-time work? */}
                  어떤 직종의 알바인가요?
                </h2>
                <p className="text-orange-100 text-xs mt-1">
                  Select the job category for this part-time position
                </p>
              </div>
              <CardContent className="pt-4">
                <CategorySelector
                  value={form.jobCategoryCode}
                  onChange={(code) => updateForm('jobCategoryCode', code)}
                />
              </CardContent>
            </Card>

            {/* 직무 상세 / Job description */}
            {form.jobCategoryCode && (
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      {/* 직무 상세 설명 / Job description */}
                      직무 상세 설명
                      <span className="text-gray-400 font-normal ml-1">Detailed job description</span>
                    </Label>
                    <textarea
                      value={form.jobDescription}
                      onChange={(e) => updateForm('jobDescription', e.target.value)}
                      placeholder="예: 주말 런치 서빙 및 정리 / e.g., Weekend lunch serving and cleanup"
                      className="mt-1.5 w-full h-24 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white"
                      aria-label="직무 상세 설명 / Job description"
                    />
                  </div>

                  {/* 모집인원 / Recruit count */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      {/* 모집 인원 / Number of positions */}
                      모집 인원
                      <span className="text-gray-400 font-normal ml-1">Positions</span>
                    </Label>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button
                        type="button"
                        onClick={() => updateForm('recruitCount', Math.max(1, form.recruitCount - 1))}
                        className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center text-xl font-bold hover:bg-gray-200 transition"
                        aria-label="인원 감소 / Decrease"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold text-orange-600 w-12 text-center">
                        {form.recruitCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateForm('recruitCount', form.recruitCount + 1)}
                        className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold hover:bg-orange-200 transition"
                        aria-label="인원 증가 / Increase"
                      >
                        +
                      </button>
                      <span className="text-sm text-gray-500 ml-1">명 / people</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 시급 / Hourly wage */}
            {form.jobCategoryCode && (
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      {/* 시급 / Hourly Wage */}
                      시급
                      <span className="text-gray-400 font-normal">Hourly Wage</span>
                    </Label>
                    <div className="mt-1.5 relative">
                      <Input
                        type="number"
                        min={10030}
                        value={form.hourlyWage}
                        onChange={(e) => updateForm('hourlyWage', Number(e.target.value))}
                        className="h-12 rounded-xl text-lg font-bold text-orange-600 pr-12"
                        aria-label="시급 입력 / Enter hourly wage"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        원
                      </span>
                    </div>
                    {form.hourlyWage < 10030 && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {/* 2025년 최저시급 10,030원 이상이어야 합니다 */}
                        2025 최저시급 10,030원 이상 필요
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {/* 2025년 최저시급: 10,030원/h */}
                      2025 minimum wage: 10,030 KRW/h
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 근무 스케줄 / Work schedule */}
            {form.jobCategoryCode && (
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="pt-6 space-y-4">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    {/* 근무 스케줄 / Work Schedule */}
                    근무 스케줄
                    <span className="text-gray-400 font-normal">Work Schedule</span>
                  </Label>
                  <SchedulePicker
                    schedule={form.schedule}
                    onChange={(schedule) => {
                      updateForm('schedule', schedule);
                      // 주당 시간 자동 업데이트 / Auto update weekly hours
                      const hours = schedule.reduce((total, item) => {
                        const [sh, sm] = item.startTime.split(':').map(Number);
                        const [eh, em] = item.endTime.split(':').map(Number);
                        let h = (eh * 60 + em - (sh * 60 + sm)) / 60;
                        if (h < 0) h += 24;
                        return total + h;
                      }, 0);
                      updateForm('weeklyHours', Number(hours.toFixed(1)));
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* 근무 기간 / Work period */}
            {form.jobCategoryCode && form.schedule.length > 0 && (
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="pt-6 space-y-4">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-orange-500" />
                    {/* 근무 기간 / Work Period */}
                    근무 기간
                    <span className="text-gray-400 font-normal">Work Period</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500">
                        {/* 시작일 / Start date */}
                        시작일
                      </label>
                      <Input
                        type="date"
                        value={form.workPeriod.startDate}
                        onChange={(e) =>
                          updateForm('workPeriod', { ...form.workPeriod, startDate: e.target.value })
                        }
                        className="h-11 rounded-xl mt-1"
                        aria-label="근무 시작일 / Work start date"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">
                        {/* 종료일 / End date */}
                        종료일
                      </label>
                      <Input
                        type="date"
                        value={form.workPeriod.endDate || ''}
                        onChange={(e) =>
                          updateForm('workPeriod', {
                            ...form.workPeriod,
                            endDate: e.target.value || null,
                          })
                        }
                        className="h-11 rounded-xl mt-1"
                        aria-label="근무 종료일 / Work end date"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={form.workPeriod.endDate === null}
                      onChange={(e) =>
                        updateForm('workPeriod', {
                          ...form.workPeriod,
                          endDate: e.target.checked ? null : '',
                        })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-300"
                    />
                    <span className="text-sm text-gray-600">
                      {/* 채용시까지 / Until position filled */}
                      채용시까지 (Until filled)
                    </span>
                  </label>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ─── Step 2: 상세 정보 / Details ─── */}
        {currentStep === 2 && (
          <div className="space-y-4 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* 공고 제목 / Title */}
            <Card className="rounded-2xl border-0 shadow-sm">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 rounded-t-2xl">
                <h2 className="text-white font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {/* 공고 정보 / Posting Info */}
                  공고 정보
                </h2>
                <p className="text-blue-100 text-xs mt-1">
                  Provide details about the posting
                </p>
              </div>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    {/* 공고 제목 / Posting Title */}
                    공고 제목 <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    placeholder="예: 강남역 근처 카페 주말 바리스타 모집"
                    className="h-12 rounded-xl mt-1.5"
                    maxLength={100}
                    aria-label="공고 제목 / Posting title"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {form.title.length}/100
                  </p>
                </div>

                {/* 상세 설명 / Detail description */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    {/* 상세 직무설명 / Detailed Description */}
                    상세 직무설명 <span className="text-red-400">*</span>
                  </Label>
                  <textarea
                    value={form.detailDescription}
                    onChange={(e) => updateForm('detailDescription', e.target.value)}
                    placeholder="업무 내용, 분위기, 지원자에게 전하고 싶은 말을 적어주세요.&#10;Describe the work, atmosphere, and anything you want applicants to know."
                    className="mt-1.5 w-full h-36 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white"
                    aria-label="상세 직무설명 / Detailed description"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 근무지 주소 / Work address */}
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {/* 근무지 주소 / Workplace Address */}
                  근무지 주소 <span className="text-red-400">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      value={form.address.sido}
                      onChange={(e) =>
                        updateForm('address', { ...form.address, sido: e.target.value })
                      }
                      placeholder="시/도 (Province)"
                      className="h-11 rounded-xl"
                      aria-label="시/도 / Province"
                    />
                  </div>
                  <div>
                    <Input
                      value={form.address.sigungu}
                      onChange={(e) =>
                        updateForm('address', { ...form.address, sigungu: e.target.value })
                      }
                      placeholder="시/군/구 (District)"
                      className="h-11 rounded-xl"
                      aria-label="시/군/구 / District"
                    />
                  </div>
                </div>
                <Input
                  value={form.address.detail}
                  onChange={(e) =>
                    updateForm('address', { ...form.address, detail: e.target.value })
                  }
                  placeholder="상세 주소 (Detailed address)"
                  className="h-11 rounded-xl"
                  aria-label="상세 주소 / Detailed address"
                />
              </CardContent>
            </Card>

            {/* 우대조건 / Preferences */}
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <Label className="text-sm font-semibold text-gray-700">
                  {/* 우대 조건 (선택) / Preferences (optional) */}
                  우대 조건
                  <span className="text-gray-400 font-normal ml-1">(선택 / Optional)</span>
                </Label>

                {/* 한국어 수준 / Korean level */}
                <div>
                  <label className="text-xs text-gray-500">
                    {/* 한국어 수준 / Korean level */}
                    한국어 수준 / Korean Level
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {(Object.keys(KOREAN_LEVEL_LABELS) as KoreanLevel[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => updateForm('koreanLevel', level)}
                        className={cn(
                          'px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px]',
                          form.koreanLevel === level
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                        aria-label={`${KOREAN_LEVEL_LABELS[level].label} / ${KOREAN_LEVEL_LABELS[level].labelEn}`}
                        aria-pressed={form.koreanLevel === level}
                      >
                        {KOREAN_LEVEL_LABELS[level].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 경력 수준 / Experience level */}
                <div>
                  <label className="text-xs text-gray-500">
                    {/* 경력 / Experience */}
                    경력 / Experience
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {(Object.keys(EXPERIENCE_LEVEL_LABELS) as ExperienceLevel[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => updateForm('experienceLevel', level)}
                        className={cn(
                          'px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px]',
                          form.experienceLevel === level
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                        aria-label={`${EXPERIENCE_LEVEL_LABELS[level].label} / ${EXPERIENCE_LEVEL_LABELS[level].labelEn}`}
                        aria-pressed={form.experienceLevel === level}
                      >
                        {EXPERIENCE_LEVEL_LABELS[level].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 우대사항 텍스트 / Preferred qualifications text */}
                <div>
                  <Input
                    value={form.preferredQualifications}
                    onChange={(e) => updateForm('preferredQualifications', e.target.value)}
                    placeholder="우대사항 (예: 바리스타 자격증 우대) / Preferred qualifications"
                    className="h-11 rounded-xl"
                    aria-label="우대사항 / Preferred qualifications"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 복리후생 / Benefits */}
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="pt-6 space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  {/* 복리후생 / Benefits */}
                  복리후생
                  <span className="text-gray-400 font-normal ml-1">Benefits</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(Object.keys(BENEFITS_MAP) as BenefitCode[]).map((code) => {
                    const benefit = BENEFITS_MAP[code];
                    const isSelected = form.benefits.includes(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          const newBenefits = isSelected
                            ? form.benefits.filter((b) => b !== code)
                            : [...form.benefits, code];
                          updateForm('benefits', newBenefits);
                        }}
                        className={cn(
                          'flex items-center gap-2 p-3 rounded-xl border-2 transition-all min-h-[44px]',
                          isSelected
                            ? 'border-orange-400 bg-orange-50 shadow-sm'
                            : 'border-transparent bg-gray-50 hover:border-gray-200'
                        )}
                        aria-label={`${benefit.label} / ${benefit.labelEn}`}
                        aria-pressed={isSelected}
                      >
                        <span className="text-lg" role="img" aria-hidden="true">{benefit.icon}</span>
                        <span className={cn(
                          'text-xs font-medium',
                          isSelected ? 'text-orange-700' : 'text-gray-600'
                        )}>
                          {benefit.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 접수 방법 / Application method */}
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <Label className="text-sm font-semibold text-gray-700">
                  {/* 접수 설정 / Application Settings */}
                  접수 설정
                  <span className="text-gray-400 font-normal ml-1">Application Settings</span>
                </Label>

                {/* 접수 마감일 / Deadline */}
                <div>
                  <label className="text-xs text-gray-500">
                    {/* 접수 마감일 / Application Deadline */}
                    접수 마감일 / Deadline
                  </label>
                  <Input
                    type="date"
                    value={form.applicationDeadline || ''}
                    onChange={(e) =>
                      updateForm('applicationDeadline', e.target.value || null)
                    }
                    className="h-11 rounded-xl mt-1"
                    aria-label="접수 마감일 / Application deadline"
                  />
                </div>

                {/* 접수 방법 / Method */}
                <div>
                  <label className="text-xs text-gray-500">
                    {/* 접수 방법 / Method */}
                    접수 방법 / Method
                  </label>
                  <div className="flex gap-2 mt-1.5">
                    {([
                      { value: 'PLATFORM' as ApplicationMethod, label: '플랫폼 지원', icon: '📱' },
                      { value: 'PHONE' as ApplicationMethod, label: '전화', icon: '📞' },
                      { value: 'EMAIL' as ApplicationMethod, label: '이메일', icon: '📧' },
                    ]).map((method) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => updateForm('applicationMethod', method.value)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px]',
                          form.applicationMethod === method.value
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                        aria-label={method.label}
                        aria-pressed={form.applicationMethod === method.value}
                      >
                        <span role="img" aria-hidden="true">{method.icon}</span>
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 연락처 / Contact info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">
                      {/* 담당자명 / Contact name */}
                      담당자명
                    </label>
                    <Input
                      value={form.contactName}
                      onChange={(e) => updateForm('contactName', e.target.value)}
                      placeholder="홍길동"
                      className="h-11 rounded-xl mt-1"
                      aria-label="담당자명 / Contact name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">
                      {/* 연락처 / Phone */}
                      연락처
                    </label>
                    <Input
                      value={form.contactPhone}
                      onChange={(e) => updateForm('contactPhone', e.target.value)}
                      placeholder="010-0000-0000"
                      className="h-11 rounded-xl mt-1"
                      aria-label="연락처 / Phone number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ─── Step 3: 미리보기 & 등록 / Preview & Submit ─── */}
        {currentStep === 3 && (
          <div className="space-y-4 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* 미리보기 카드 (대형) / Preview card (large) */}
            <Card className="rounded-2xl border-0 shadow-lg overflow-hidden">
              {/* 카드 헤더 — 그라데이션 / Card header — gradient */}
              <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 px-6 py-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    {categoryInfo?.icon || '💼'}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-white font-bold text-lg leading-tight">
                      {form.title || '공고 제목을 입력해주세요'}
                    </h2>
                    <p className="text-orange-100 text-sm mt-1">
                      {categoryInfo?.name || '직종 미선택'} &middot; {form.recruitCount}명 모집
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="pt-4 space-y-4">
                {/* 시급 + 스케줄 / Wage + Schedule */}
                <div className="flex gap-3">
                  <div className="flex-1 p-3 bg-orange-50 rounded-xl">
                    <p className="text-xs text-orange-600 font-medium">
                      {/* 시급 / Hourly */}
                      시급
                    </p>
                    <p className="text-xl font-bold text-orange-700">
                      {form.hourlyWage.toLocaleString()}원
                    </p>
                  </div>
                  <div className="flex-1 p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-600 font-medium">
                      {/* 주당 시간 / Weekly hours */}
                      주당 시간
                    </p>
                    <p className="text-xl font-bold text-blue-700">
                      {calculatedWeeklyHours.toFixed(1)}h
                    </p>
                  </div>
                </div>

                {/* 근무 요일 표시 / Work days display */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    {/* 근무 스케줄 / Work Schedule */}
                    근무 스케줄
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {form.schedule.map((s) => (
                      <span
                        key={s.dayOfWeek}
                        className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                      >
                        {DAY_LABELS[s.dayOfWeek].short} {s.startTime}~{s.endTime}
                      </span>
                    ))}
                    {isWeekendOnly && (
                      <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        주말만
                      </span>
                    )}
                  </div>
                </div>

                {/* 근무지 / Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {form.address.sido} {form.address.sigungu} {form.address.detail}
                </div>

                {/* 복리후생 / Benefits */}
                {form.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.benefits.map((code) => (
                      <span
                        key={code}
                        className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium"
                      >
                        {BENEFITS_MAP[code].icon} {BENEFITS_MAP[code].label}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 비자 매칭 결과 / Visa matching result */}
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    {/* 비자 매칭 결과 (자동) / Visa Matching (Auto) */}
                    비자 매칭 결과 (자동)
                  </h3>
                </div>

                {matchLoading ? (
                  <div className="flex flex-col items-center py-8">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    <p className="text-sm text-gray-500 mt-3">
                      {/* 비자 매칭 분석 중... / Analyzing visa matching... */}
                      비자 매칭 분석 중...
                    </p>
                  </div>
                ) : (
                  <VisaMatchBadges
                    eligible={MOCK_VISA_ELIGIBLE}
                    conditional={MOCK_VISA_CONDITIONAL}
                    blocked={MOCK_VISA_BLOCKED}
                    summary={MOCK_MATCHING_SUMMARY}
                    showBlocked={false}
                  />
                )}
              </CardContent>
            </Card>

            {/* 접수 요약 / Application summary */}
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  {/* 접수 설정 요약 / Application Settings Summary */}
                  접수 설정 요약
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {/* 마감일 / Deadline */}
                      마감일
                    </span>
                    <span>{form.applicationDeadline || '채용시까지'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {/* 접수 방법 / Method */}
                      접수 방법
                    </span>
                    <span>
                      {form.applicationMethod === 'PLATFORM'
                        ? '플랫폼 지원'
                        : form.applicationMethod === 'PHONE'
                          ? '전화'
                          : '이메일'}
                    </span>
                  </div>
                  {form.contactName && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        {/* 담당자 / Contact */}
                        담당자
                      </span>
                      <span>{form.contactName} {form.contactPhone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* 하단 네비게이션 바 / Bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="h-12 rounded-xl px-6 flex-shrink-0"
              aria-label="이전 단계 / Previous step"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {/* 이전 / Back */}
              이전
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              className="flex-1 h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              aria-label="다음 단계 / Next step"
            >
              {/* 다음 / Next */}
              다음
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-200"
              aria-label="공고 등록 / Submit posting"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  {/* 등록 중... / Submitting... */}
                  등록 중...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  {/* 공고 등록 / Submit Posting */}
                  공고 등록
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
