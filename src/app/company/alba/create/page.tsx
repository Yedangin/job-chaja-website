'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import WizardProgress from './components/wizard-progress';
import StepBasicInfo from './components/step-basic-info';
import StepDetails from './components/step-details';
import StepPreview from './components/step-preview';
import { AlbaApiError, matchAlbaVisa, createAlbaJob, submitAlbaJobForReview } from './api';
import type { AlbaJobFormData, AlbaVisaMatchingResponse, WizardStep } from './components/alba-types';
import CompanyAuthGuard from '@/components/guards/company-auth-guard';
import { useMinimumHourlyWage } from '@/hooks/use-minimum-wage';
import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import { useLanguage } from '@/i18n/LanguageProvider';
import { getAlbaCopy } from './copy';

/**
 * 알바 공고 등록 위자드 (최종 버전)
 * Alba job posting creation wizard (final version)
 * - Step 1: 기본정보 (E 스타일 + B 직종드롭다운)
 * - Step 2: 상세조건 (E 스타일 카드형 복리후생)
 * - Step 3: 미리보기 (A 프리뷰 + 자동 비자매칭)
 * - 완료: B 스타일 성공 화면
 */

const INITIAL_FORM: AlbaJobFormData = {
  jobCategoryCode: '',
  recruitCount: 1,
  hourlyWage: 0,
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
};

export default function AlbaCreatePage() {
  const { lang } = useLanguage();
  const copy = getAlbaCopy(lang);
  const { user } = useAuth();
  const minimumWage = useMinimumHourlyWage();
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<AlbaJobFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [matchResult, setMatchResult] = useState<AlbaVisaMatchingResponse | null>(null);
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // 기업인증 정보에서 담당자 정보 자동 입력 / Auto-fill contact info from corporate profile
  useEffect(() => {
    if (!user || user.role !== 'CORPORATE') return;
    apiClient.get('/auth/corporate-verify').then(({ data }) => {
      if (!data) return;
      setForm((prev) => ({
        ...prev,
        contactName: prev.contactName || data.managerName || user.fullName || '',
        contactPhone: prev.contactPhone || data.managerPhone || '',
        contactEmail: prev.contactEmail || user.email || '',
      }));
    }).catch(() => {
      // 실패 시 수동 입력 / Manual input on failure
    });
  }, [user]);

  // 폼 업데이트 / Update form field
  const updateForm = useCallback(<K extends keyof AlbaJobFormData>(key: K, value: AlbaJobFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    // 비자 매칭에 영향을 주는 필드 변경 시 결과 초기화 / Reset match on relevant changes
    if (['jobCategoryCode', 'schedule', 'weeklyHours', 'hourlyWage', 'address'].includes(key)) {
      setMatchResult(null);
    }
  }, []);

  // Step 1 유효성 검증 / Step 1 validation
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.jobCategoryCode) errs.jobCategoryCode = copy.validation.category;
    if (form.hourlyWage < minimumWage) errs.hourlyWage = copy.validation.wage;
    if (form.schedule.length === 0) errs.schedule = copy.validation.schedule;
    if (!form.workPeriod.startDate) errs.workPeriod = copy.validation.startDate;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 유효성 검증 / Step 2 validation
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = copy.validation.title;
    if (!form.address.sido.trim()) errs.address = copy.validation.address;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 다음 단계 / Next step
  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(prev => Math.min(prev + 1, 3) as WizardStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 이전 단계 / Previous step
  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1) as WizardStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 비자 매칭 요청 / Request visa matching
  const handleRequestMatch = useCallback(async () => {
    if (isMatchLoading) return;
    setIsMatchLoading(true);
    setMatchError(null);
    try {
      const result = await matchAlbaVisa(form);
      setMatchResult(result);
    } catch (error) {
      setMatchResult(null);
      setMatchError(error instanceof AlbaApiError && error.code === 'AUTH_REQUIRED' ? copy.errors.auth : copy.errors.matching);
    } finally {
      setIsMatchLoading(false);
    }
  }, [form, isMatchLoading, copy.errors.auth, copy.errors.matching]);

  // 공고 등록 / Submit job
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const draft = await createAlbaJob(form, matchResult);
      await submitAlbaJobForReview(draft.jobId);
      setCompleted(true);
    } catch (error) {
      alert(error instanceof AlbaApiError && error.code === 'AUTH_REQUIRED' ? copy.errors.auth : copy.errors.submit);
    } finally {
      setSubmitting(false);
    }
  };

  // 완료 화면 (B 스타일) / Completion screen (B style)
  if (completed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-[#0066FF]" />
          </div>
          <h2 className="text-xl font-bold text-[#191F28] mb-2">{copy.completionTitle}</h2>
          <p className="text-sm text-gray-500 mb-8">
            {copy.completionBody(matchResult?.summary.totalEligible ?? 0, matchResult?.summary.totalConditional ?? 0)}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/company/alba"
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              {copy.manageJobs}
            </Link>
            <Link
              href="/company/alba/create"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition"
              onClick={() => {
                setForm(INITIAL_FORM);
                setStep(1);
                setMatchResult(null);
                setCompleted(false);
              }}
            >
              {copy.newJob}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CompanyAuthGuard requiredAccess="draft">
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 / Top header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/company/alba" aria-label={copy.back} className="p-1.5 text-gray-500 hover:text-gray-700">
              <ArrowLeft aria-hidden="true" className="w-5 h-5" />
            </Link>
            <h1 className="text-base font-bold text-[#191F28]">{copy.headerTitle}</h1>
          </div>
        </div>
      </div>

      {/* 진행 표시 / Progress */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <WizardProgress currentStep={step} onStepClick={s => setStep(s)} />
      </div>

      {/* 스텝 컨텐츠 / Step content */}
      <div className="max-w-4xl mx-auto px-4 pb-44 md:pb-32">
        {step === 1 && (
          <StepBasicInfo form={form} errors={errors} updateForm={updateForm} />
        )}
        {step === 2 && (
          <StepDetails form={form} errors={errors} updateForm={updateForm} />
        )}
        {step === 3 && (
          <StepPreview
            form={form}
            matchResult={matchResult}
            isMatchLoading={isMatchLoading}
            matchError={matchError}
            onRequestMatch={handleRequestMatch}
            onGoToStep={setStep}
          />
        )}
      </div>

      {/* 하단 네비게이션 / Bottom navigation */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 z-40 md:bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {copy.previous}
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition min-w-[120px]"
            >
              {copy.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {copy.submitting}
                </>
              ) : (
                copy.submit
              )}
            </button>
          )}
        </div>
      </div>
    </div>
    </CompanyAuthGuard>
  );
}
