'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft, ArrowRight, Save, Send,
  Briefcase, FileText, Eye,
  AlertCircle, Check, Info,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { StepProgressTracker } from './components/step-progress-tracker';
import { SchedulePicker } from './components/schedule-picker';
import { VisaMatchDisplay } from './components/visa-match-display';
import type {
  AlbaJobFormData, ApplicationMethod, BenefitType,
  ExperienceLevel, KoreanLevel, ScheduleItem,
} from './alba-types';
import {
  ALL_DAYS, APPLICATION_METHOD_LABELS, BENEFIT_LABELS,
  EXPERIENCE_LEVEL_LABELS, JOB_CATEGORIES, KOREAN_LEVEL_LABELS,
  MINIMUM_WAGE,
} from './alba-types';
import { MOCK_VISA_MATCHING_RESPONSE } from './mock-data';

/**
 * 알바 공고 등록 — Variant D (대시보드/Notion+Linear 스타일)
 * Alba job creation wizard — Variant D (Dashboard/Notion+Linear style)
 *
 * 3단계 위자드: 근무정보 → 상세설정 → 미리보기
 * 3-step wizard: Job Details → Settings → Preview
 */
export default function AlbaCreateVariantD() {
  // ─── 스텝 상태 / Step state ───
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // ─── 폼 상태 / Form state ───
  const [form, setForm] = useState<AlbaJobFormData>({
    jobCategoryCode: '',
    jobDescription: '',
    recruitCount: 1,
    hourlyWage: MINIMUM_WAGE,
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
    applicationDeadline: null,
    applicationMethod: 'PLATFORM',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  // ─── 유효성 검사 에러 / Validation errors ───
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── 폼 업데이트 헬퍼 / Form update helper ───
  const updateForm = useCallback(<K extends keyof AlbaJobFormData>(
    key: K, value: AlbaJobFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // 에러 클리어 / Clear error
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // ─── 스케줄 기반 주당시간 자동 계산 / Auto-calculate weekly hours from schedule ───
  const calculatedWeeklyHours = useMemo(() => {
    return form.schedule.reduce((total, item) => {
      const [sh, sm] = item.startTime.split(':').map(Number);
      const [eh, em] = item.endTime.split(':').map(Number);
      let startMin = sh * 60 + sm;
      let endMin = eh * 60 + em;
      if (endMin <= startMin) endMin += 24 * 60;
      return total + (endMin - startMin) / 60;
    }, 0);
  }, [form.schedule]);

  // ─── 비자 매칭 결과 (목업) / Visa matching result (mock) ───
  const matchResult = step >= 3 ? MOCK_VISA_MATCHING_RESPONSE : null;

  // ─── 스텝 유효성 검사 / Step validation ───
  const validateStep = useCallback((stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!form.jobCategoryCode) newErrors.jobCategoryCode = '직종을 선택해주세요 / Select a job category';
      if (form.hourlyWage < MINIMUM_WAGE) newErrors.hourlyWage = `최저시급 ${MINIMUM_WAGE.toLocaleString()}원 이상 / Min wage ${MINIMUM_WAGE.toLocaleString()} KRW`;
      if (form.schedule.length === 0) newErrors.schedule = '근무 요일을 선택해주세요 / Select work days';
      if (!form.workPeriod.startDate) newErrors.workPeriod = '시작일을 입력해주세요 / Enter start date';
    }

    if (stepNum === 2) {
      if (!form.title.trim()) newErrors.title = '공고 제목을 입력해주세요 / Enter job title';
      if (!form.address.sido) newErrors.address = '근무지 주소를 입력해주세요 / Enter workplace address';
      if (!form.detailDescription.trim()) newErrors.detailDescription = '상세 설명을 입력해주세요 / Enter description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // ─── 네비게이션 / Navigation ───
  const handleNext = useCallback(() => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 3));
    }
  }, [step, validateStep]);

  const handleBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const goToStep = useCallback((s: number) => {
    if (s < step) setStep(s);
  }, [step]);

  // ─── 임시저장 / Draft save ───
  const handleSave = useCallback(() => {
    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    setLastSaved(now);
  }, []);

  // ─── 제출 / Submit ───
  const handleSubmit = useCallback(() => {
    setSubmitting(true);
    // 목업: 2초 후 완료 / Mock: complete after 2s
    setTimeout(() => {
      setSubmitting(false);
      alert('공고가 등록되었습니다! / Job posted successfully!');
    }, 2000);
  }, []);

  // ─── 주말만 근무 여부 / Weekend-only check ───
  const isWeekendOnly = useMemo(() => {
    if (form.schedule.length === 0) return false;
    return form.schedule.every((s) => s.dayOfWeek === 'SAT' || s.dayOfWeek === 'SUN');
  }, [form.schedule]);

  // ─── 카테고리명 / Category name helper ───
  const selectedCategory = JOB_CATEGORIES.find((c) => c.code === form.jobCategoryCode);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* ─── 상단 네비게이션 바 / Top navigation bar ─── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/company/alba"
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors rounded"
              aria-label="돌아가기 / Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">알바 공고 등록</h1>
              <p className="text-[11px] text-gray-400 font-mono">New Alba Posting</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 임시저장 상태 / Draft save status */}
            {lastSaved && (
              <span className="text-[11px] text-gray-400 font-mono">
                saved {lastSaved}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="text-gray-500 hover:text-gray-700"
              aria-label="임시저장 / Save draft"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">저장</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ─── 메인 컨텐츠 / Main content ─── */}
      <main className="max-w-3xl mx-auto px-4 py-6 pb-32">
        {/* 프로그레스 트래커 / Progress tracker */}
        <StepProgressTracker currentStep={step} onStepClick={goToStep} />

        {/* ─── Step 1: 근무정보 / Job Details ─── */}
        {step === 1 && (
          <div className="space-y-6">
            {/* 섹션 헤더 / Section header */}
            <SectionHeader
              icon={<Briefcase className="w-4 h-4" />}
              title="어떤 일인가요?"
              titleEn="What kind of work?"
            />

            {/* 직종 선택 / Job category selection */}
            <FieldGroup label="직종" labelEn="Job Category" required error={errors.jobCategoryCode}>
              <select
                value={form.jobCategoryCode}
                onChange={(e) => updateForm('jobCategoryCode', e.target.value)}
                className={cn(
                  'w-full h-11 px-3 border rounded bg-white text-sm',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
                  errors.jobCategoryCode ? 'border-red-300' : 'border-gray-200',
                )}
                aria-label="직종 선택 / Select job category"
              >
                <option value="">직종을 선택하세요 / Select category</option>
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat.code} value={cat.code}>
                    {cat.name} ({cat.nameEn})
                  </option>
                ))}
              </select>
            </FieldGroup>

            {/* 직무 상세 / Job description */}
            <FieldGroup label="직무 상세" labelEn="Job Description">
              <textarea
                value={form.jobDescription}
                onChange={(e) => updateForm('jobDescription', e.target.value)}
                placeholder="예: 주말 런치 서빙 및 정리 / e.g., Weekend lunch serving and cleanup"
                className="w-full h-20 px-3 py-2 border border-gray-200 rounded text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              />
            </FieldGroup>

            {/* 모집 인원 + 시급 / Recruit count + Hourly wage */}
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="모집 인원" labelEn="Positions" required>
                <Input
                  type="number"
                  min={1}
                  value={form.recruitCount}
                  onChange={(e) => updateForm('recruitCount', parseInt(e.target.value) || 1)}
                  className="h-11 font-mono"
                  aria-label="모집 인원 / Number of positions"
                />
              </FieldGroup>

              <FieldGroup label="시급" labelEn="Hourly Wage (KRW)" required error={errors.hourlyWage}>
                <div className="relative">
                  <Input
                    type="number"
                    min={MINIMUM_WAGE}
                    step={100}
                    value={form.hourlyWage}
                    onChange={(e) => updateForm('hourlyWage', parseInt(e.target.value) || MINIMUM_WAGE)}
                    className={cn(
                      'h-11 font-mono pr-8',
                      errors.hourlyWage && 'border-red-300',
                    )}
                    aria-label="시급 / Hourly wage"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    원
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 font-mono">
                  min {MINIMUM_WAGE.toLocaleString()} KRW (2025)
                </p>
              </FieldGroup>
            </div>

            {/* 근무 스케줄 / Work schedule */}
            <FieldGroup label="근무 스케줄" labelEn="Work Schedule" required error={errors.schedule}>
              <SchedulePicker
                schedule={form.schedule}
                onChange={(schedule) => {
                  updateForm('schedule', schedule);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.schedule;
                    return next;
                  });
                }}
              />
            </FieldGroup>

            {/* 근무 기간 / Work period */}
            <FieldGroup label="근무 기간" labelEn="Work Period" required error={errors.workPeriod}>
              <div className="flex items-center gap-3">
                <Input
                  type="date"
                  value={form.workPeriod.startDate}
                  onChange={(e) => updateForm('workPeriod', { ...form.workPeriod, startDate: e.target.value })}
                  className={cn(
                    'h-11 font-mono flex-1',
                    errors.workPeriod && 'border-red-300',
                  )}
                  aria-label="근무 시작일 / Work start date"
                />
                <span className="text-gray-400 text-sm">~</span>
                <Input
                  type="date"
                  value={form.workPeriod.endDate || ''}
                  onChange={(e) => updateForm('workPeriod', {
                    ...form.workPeriod,
                    endDate: e.target.value || null,
                  })}
                  className="h-11 font-mono flex-1"
                  aria-label="근무 종료일 (선택) / Work end date (optional)"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                종료일 미입력 시 &quot;채용시까지&quot;로 표시 / Leave end date empty for &quot;until filled&quot;
              </p>
            </FieldGroup>
          </div>
        )}

        {/* ─── Step 2: 상세설정 / Details & Location ─── */}
        {step === 2 && (
          <div className="space-y-6">
            <SectionHeader
              icon={<FileText className="w-4 h-4" />}
              title="어디서, 어떻게?"
              titleEn="Where and how?"
            />

            {/* 공고 제목 / Job title */}
            <FieldGroup label="공고 제목" labelEn="Job Title" required error={errors.title}>
              <Input
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
                placeholder="예: 강남역 근처 카페 주말 바리스타 모집"
                maxLength={100}
                className={cn('h-11', errors.title && 'border-red-300')}
                aria-label="공고 제목 / Job title"
              />
              <p className="text-[11px] text-gray-400 mt-1 text-right font-mono">
                {form.title.length}/100
              </p>
            </FieldGroup>

            {/* 근무지 주소 / Workplace address */}
            <FieldGroup label="근무지 주소" labelEn="Workplace Address" required error={errors.address}>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={form.address.sido}
                  onChange={(e) => updateForm('address', { ...form.address, sido: e.target.value })}
                  placeholder="시/도 (예: 서울특별시)"
                  className={cn('h-11', errors.address && 'border-red-300')}
                  aria-label="시/도 / Province"
                />
                <Input
                  value={form.address.sigungu}
                  onChange={(e) => updateForm('address', { ...form.address, sigungu: e.target.value })}
                  placeholder="시/군/구 (예: 강남구)"
                  className="h-11"
                  aria-label="시/군/구 / District"
                />
              </div>
              <Input
                value={form.address.detail}
                onChange={(e) => updateForm('address', { ...form.address, detail: e.target.value })}
                placeholder="상세 주소 (예: 역삼동 123-45 2층)"
                className="h-11 mt-2"
                aria-label="상세 주소 / Detailed address"
              />
            </FieldGroup>

            {/* 우대 조건 / Preferences */}
            <SectionHeader
              icon={<Info className="w-4 h-4" />}
              title="우대 조건"
              titleEn="Preferences (optional)"
            />

            <div className="grid grid-cols-2 gap-4">
              {/* 한국어 수준 / Korean level */}
              <FieldGroup label="한국어 수준" labelEn="Korean Level">
                <select
                  value={form.koreanLevel}
                  onChange={(e) => updateForm('koreanLevel', e.target.value as KoreanLevel)}
                  className="w-full h-11 px-3 border border-gray-200 rounded text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  aria-label="한국어 수준 / Korean level"
                >
                  {(Object.entries(KOREAN_LEVEL_LABELS) as [KoreanLevel, { ko: string; en: string }][]).map(
                    ([key, val]) => (
                      <option key={key} value={key}>
                        {val.ko} ({val.en})
                      </option>
                    ),
                  )}
                </select>
              </FieldGroup>

              {/* 경력 / Experience */}
              <FieldGroup label="경력" labelEn="Experience">
                <select
                  value={form.experienceLevel}
                  onChange={(e) => updateForm('experienceLevel', e.target.value as ExperienceLevel)}
                  className="w-full h-11 px-3 border border-gray-200 rounded text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  aria-label="경력 수준 / Experience level"
                >
                  {(Object.entries(EXPERIENCE_LEVEL_LABELS) as [ExperienceLevel, { ko: string; en: string }][]).map(
                    ([key, val]) => (
                      <option key={key} value={key}>
                        {val.ko} ({val.en})
                      </option>
                    ),
                  )}
                </select>
              </FieldGroup>
            </div>

            {/* 우대사항 / Preferred qualifications */}
            <FieldGroup label="우대사항" labelEn="Preferred Qualifications">
              <Input
                value={form.preferredQualifications}
                onChange={(e) => updateForm('preferredQualifications', e.target.value)}
                placeholder="예: 바리스타 자격증 우대 / e.g., Barista certification preferred"
                className="h-11"
              />
            </FieldGroup>

            {/* 복리후생 / Benefits */}
            <FieldGroup label="복리후생" labelEn="Benefits">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.entries(BENEFIT_LABELS) as [BenefitType, { ko: string; en: string }][]).map(
                  ([key, val]) => {
                    const isChecked = form.benefits.includes(key);
                    return (
                      <label
                        key={key}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2.5 border rounded cursor-pointer transition-colors',
                          'min-h-11', // 터치 타겟 / Touch target
                          isChecked ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-gray-300',
                        )}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateForm('benefits', [...form.benefits, key]);
                            } else {
                              updateForm('benefits', form.benefits.filter((b) => b !== key));
                            }
                          }}
                          aria-label={`${val.ko} / ${val.en}`}
                        />
                        <span className="text-xs text-gray-700">{val.ko}</span>
                      </label>
                    );
                  },
                )}
              </div>
            </FieldGroup>

            {/* 상세 설명 / Detail description */}
            <FieldGroup label="상세 직무 설명" labelEn="Detailed Description" required error={errors.detailDescription}>
              <textarea
                value={form.detailDescription}
                onChange={(e) => updateForm('detailDescription', e.target.value)}
                placeholder="상세 직무 내용을 입력하세요. / Enter detailed job description."
                className={cn(
                  'w-full h-32 px-3 py-2 border rounded text-sm resize-y',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
                  errors.detailDescription ? 'border-red-300' : 'border-gray-200',
                )}
              />
            </FieldGroup>

            {/* 접수 설정 / Application settings */}
            <SectionHeader
              icon={<Send className="w-4 h-4" />}
              title="접수 설정"
              titleEn="Application Settings"
            />

            {/* 접수 마감일 / Application deadline */}
            <FieldGroup label="접수 마감일" labelEn="Application Deadline">
              <Input
                type="date"
                value={form.applicationDeadline || ''}
                onChange={(e) => updateForm('applicationDeadline', e.target.value || null)}
                className="h-11 font-mono max-w-xs"
                aria-label="접수 마감일 / Application deadline"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                미입력 시 채용시까지 / Leave empty for &quot;until filled&quot;
              </p>
            </FieldGroup>

            {/* 접수 방법 / Application method */}
            <FieldGroup label="접수 방법" labelEn="Application Method">
              <div className="flex gap-2">
                {(Object.entries(APPLICATION_METHOD_LABELS) as [ApplicationMethod, { ko: string; en: string }][]).map(
                  ([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updateForm('applicationMethod', key)}
                      className={cn(
                        'px-4 py-2.5 border rounded text-sm font-medium transition-colors min-h-11',
                        form.applicationMethod === key
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-gray-400',
                      )}
                      aria-pressed={form.applicationMethod === key}
                      aria-label={`${val.ko} / ${val.en}`}
                    >
                      {val.ko}
                    </button>
                  ),
                )}
              </div>
            </FieldGroup>

            {/* 담당자 정보 / Contact info */}
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="담당자명" labelEn="Contact Name">
                <Input
                  value={form.contactName}
                  onChange={(e) => updateForm('contactName', e.target.value)}
                  placeholder="김채용"
                  className="h-11"
                />
              </FieldGroup>
              <FieldGroup label="연락처" labelEn="Phone">
                <Input
                  value={form.contactPhone}
                  onChange={(e) => updateForm('contactPhone', e.target.value)}
                  placeholder="010-1234-5678"
                  className="h-11 font-mono"
                />
              </FieldGroup>
            </div>
          </div>
        )}

        {/* ─── Step 3: 미리보기 & 등록 / Preview & Submit ─── */}
        {step === 3 && (
          <div className="space-y-6">
            <SectionHeader
              icon={<Eye className="w-4 h-4" />}
              title="미리보기 & 등록"
              titleEn="Preview & Submit"
            />

            {/* 공고 미리보기 카드 / Posting preview card */}
            <div className="border border-gray-200 rounded bg-white">
              {/* 제목 영역 / Title area */}
              <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {form.title || '(제목 미입력 / No title)'}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      {selectedCategory?.name || '(직종 미선택)'}
                      {selectedCategory && ` / ${selectedCategory.nameEn}`}
                    </p>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700 border-0 text-[11px] font-mono rounded">
                    DRAFT
                  </Badge>
                </div>
              </div>

              {/* 키-값 쌍 데이터 / Key-value pair data */}
              <div className="divide-y divide-gray-100">
                <KVRow label="시급 / Wage" value={`${form.hourlyWage.toLocaleString()}원`} mono />
                <KVRow
                  label="근무시간 / Hours"
                  value={`주 ${calculatedWeeklyHours.toFixed(1)}시간${isWeekendOnly ? ' (주말만)' : ''}`}
                  mono
                />
                <KVRow
                  label="스케줄 / Schedule"
                  value={
                    form.schedule.length > 0
                      ? form.schedule
                          .map((s) => `${ALL_DAYS.indexOf(s.dayOfWeek) < 5 ? '' : ''}${s.dayOfWeek} ${s.startTime}-${s.endTime}`)
                          .join(' / ')
                      : '(미설정)'
                  }
                  mono
                />
                <KVRow
                  label="근무지 / Location"
                  value={
                    form.address.sido
                      ? `${form.address.sido} ${form.address.sigungu} ${form.address.detail}`
                      : '(미입력)'
                  }
                />
                <KVRow
                  label="근무기간 / Period"
                  value={`${form.workPeriod.startDate || '?'} ~ ${form.workPeriod.endDate || '채용시까지'}`}
                  mono
                />
                <KVRow label="모집인원 / Positions" value={`${form.recruitCount}명`} mono />
                <KVRow
                  label="한국어 / Korean"
                  value={KOREAN_LEVEL_LABELS[form.koreanLevel].ko}
                />
                <KVRow
                  label="경력 / Experience"
                  value={EXPERIENCE_LEVEL_LABELS[form.experienceLevel].ko}
                />
                {form.benefits.length > 0 && (
                  <KVRow
                    label="복리후생 / Benefits"
                    value={form.benefits.map((b) => BENEFIT_LABELS[b].ko).join(', ')}
                  />
                )}
                <KVRow
                  label="접수방법 / Method"
                  value={APPLICATION_METHOD_LABELS[form.applicationMethod].ko}
                />
                {form.applicationDeadline && (
                  <KVRow label="마감일 / Deadline" value={form.applicationDeadline} mono />
                )}
              </div>

              {/* 상세 설명 / Detailed description */}
              {form.detailDescription && (
                <div className="px-4 py-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 font-medium">
                    상세 설명 / Description
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {form.detailDescription}
                  </p>
                </div>
              )}
            </div>

            {/* 비자 매칭 결과 / Visa matching results */}
            <VisaMatchDisplay matchResult={matchResult} />
          </div>
        )}
      </main>

      {/* ─── 하단 고정 네비게이션 바 / Bottom fixed navigation bar ─── */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* 이전 / Back */}
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              className="gap-1.5 min-h-11"
              aria-label="이전 단계 / Previous step"
            >
              <ArrowLeft className="w-4 h-4" />
              이전
            </Button>
          ) : (
            <div />
          )}

          {/* 다음 또는 제출 / Next or Submit */}
          {step < 3 ? (
            <Button
              onClick={handleNext}
              className="gap-1.5 bg-gray-900 hover:bg-gray-800 text-white min-h-11"
              aria-label="다음 단계 / Next step"
            >
              다음
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white min-h-11"
              aria-label="공고 등록 / Submit posting"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  등록 중...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  공고 등록
                </>
              )}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

// ─── 헬퍼 컴포넌트 / Helper components ───

/** 섹션 헤더 / Section header */
function SectionHeader({
  icon,
  title,
  titleEn,
}: {
  icon: React.ReactNode;
  title: string;
  titleEn: string;
}) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
      <span className="text-gray-400">{icon}</span>
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <span className="text-xs text-gray-400 font-mono">{titleEn}</span>
    </div>
  );
}

/** 필드 그룹 / Field group */
function FieldGroup({
  label,
  labelEn,
  required,
  error,
  children,
}: {
  label: string;
  labelEn: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-[11px] text-gray-400">{labelEn}</span>
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1" role="alert">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/** 키-값 행 / Key-value row */
function KVRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-4 px-4 py-2.5">
      <span className="text-xs text-gray-400 w-28 shrink-0 pt-0.5">{label}</span>
      <span className={cn(
        'text-sm text-gray-800 flex-1',
        mono && 'font-mono',
      )}>
        {value}
      </span>
    </div>
  );
}
