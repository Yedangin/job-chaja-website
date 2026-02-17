'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/lib/toast';
import { getStepSchema } from '../schemas/job-create.schema';
import { jobCreateApi, transformToApiPayload } from '../api/job-create.api';
import { useAutoSave } from './use-auto-save';
import { useVisaMatching } from './use-visa-matching';
import type { JobCreateFormData, WizardStep, BoardType } from '../types/job-create.types';

/**
 * 초기 폼 데이터 / Initial form data
 */
const initialFormData: JobCreateFormData = {
  title: '',
  jobCategory: [],
  boardType: 'FULL_TIME',
  employmentSubType: 'PERMANENT',
  headcount: 1,
  address: '',
  addressDetail: '',
  workDays: [true, true, true, true, true, false, false],
  workTimeStart: '09:00',
  workTimeEnd: '18:00',
  salaryType: 'MONTHLY',
  salaryAmount: '',
  salaryMax: '',
  experienceLevel: 'ANY',
  educationLevel: 'ANY',
  jobDescription: '',
  requirements: '',
  preferredQualifications: '',
  benefits: [],
  customBenefit: '',
  applicationStartDate: new Date().toISOString().split('T')[0],
  applicationEndDate: '',
  applicationMethod: 'PLATFORM',
  externalEmail: '',
  externalUrl: '',
  allowedVisas: [],
};

/**
 * 채용공고 등록 메인 오케스트레이터 훅
 * Main orchestrator hook for job creation wizard
 */
export function useJobCreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // 폼 상태 / Form state
  const [form, setForm] = useState<JobCreateFormData>(initialFormData);
  const [step, setStep] = useState<WizardStep>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<number | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  // 자동저장 / Auto-save
  const autoSave = useAutoSave(form, step);

  // 비자 매칭 / Visa matching
  const visaMatching = useVisaMatching();

  // 초기 데이터 로드 / Initial data load
  useEffect(() => {
    // 공고 복사 / Copy existing job
    const copyId = searchParams.get('copy');
    if (copyId) {
      loadCopyJob(copyId);
      return;
    }

    // 임시저장 복원 / Restore draft
    const draft = autoSave.checkRestore();
    if (draft && !draftRestored) {
      setForm(draft.form);
      setStep(draft.step);
      setDraftRestored(true);
      toast.info('이전 작성 내용을 불러왔습니다.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 공고 복사 로드 / Load job for copy
  const loadCopyJob = async (jobId: string) => {
    try {
      const job = await jobCreateApi.getJobForCopy(jobId);
      if (!job) return;
      setForm(prev => ({
        ...prev,
        title: `[복사] ${job.title || ''}`,
        jobCategory: job.jobCategory || prev.jobCategory,
        boardType: job.boardType || prev.boardType,
        employmentSubType: job.employmentSubType || prev.employmentSubType,
        headcount: job.headcount || 1,
        address: job.displayAddress || job.actualAddress || '',
        addressDetail: job.addressDetail || '',
        workTimeStart: job.workTimeStart || prev.workTimeStart,
        workTimeEnd: job.workTimeEnd || prev.workTimeEnd,
        salaryType: job.hourlyWage ? 'HOURLY' : job.salaryMin ? 'MONTHLY' : prev.salaryType,
        salaryAmount: String(job.hourlyWage || job.salaryMin || ''),
        salaryMax: String(job.salaryMax || ''),
        experienceLevel: job.experienceLevel || prev.experienceLevel,
        educationLevel: job.educationLevel || prev.educationLevel,
        jobDescription: job.description || '',
        requirements: job.requirements || '',
        preferredQualifications: job.preferredQualifications || '',
        benefits: job.benefits
          ? (typeof job.benefits === 'string' ? JSON.parse(job.benefits) : job.benefits)
          : prev.benefits,
        allowedVisas: job.allowedVisas
          ? (typeof job.allowedVisas === 'string' ? job.allowedVisas.split(',') : job.allowedVisas)
          : prev.allowedVisas,
        applicationMethod: job.applicationMethod || prev.applicationMethod,
        externalEmail: job.externalEmail || '',
        externalUrl: job.externalUrl || '',
      }));
    } catch {
      toast.error('공고 복사에 실패했습니다.');
    }
  };

  // 폼 업데이트 / Update form
  const updateForm = useCallback((updates: Partial<JobCreateFormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
    // 해당 필드 에러 제거 / Clear errors for updated fields
    const keys = Object.keys(updates);
    setErrors(prev => {
      const next = { ...prev };
      keys.forEach(k => delete next[k]);
      return next;
    });
  }, []);

  // 스텝 유효성 검사 / Validate current step
  const validateStep = useCallback((targetStep: number): boolean => {
    const schema = getStepSchema(targetStep, form.boardType);
    if (!schema) return true;

    // 스텝에 해당하는 필드만 추출 / Extract fields for step
    const result = schema.safeParse(form);
    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: Record<string, string> = {};
    result.error.errors.forEach(err => {
      const field = err.path.join('.');
      if (!newErrors[field]) {
        newErrors[field] = err.message;
      }
    });
    setErrors(newErrors);
    return false;
  }, [form]);

  // 다음 스텝 / Next step
  const handleNext = useCallback(async () => {
    if (!validateStep(step)) {
      toast.error('필수 항목을 확인해주세요.');
      return;
    }

    if (step === 3) {
      // Step 3 → 4: 비자 매칭 실행 / Run visa matching
      const result = await visaMatching.runMatching(
        form.boardType,
        form.salaryType,
        form.salaryAmount,
        form.address,
      );
      if (result && result.eligibleVisas.length > 0) {
        const codes = result.eligibleVisas.map(v => v.code);
        updateForm({
          allowedVisas: [...new Set([...form.allowedVisas, ...codes])],
        });
      }
      setStep(4);
    } else if (step < 5) {
      setStep((step + 1) as WizardStep);
    }
  }, [step, form, validateStep, visaMatching, updateForm]);

  // 이전 스텝 / Previous step
  const handleBack = useCallback(() => {
    if (step > 1) setStep((step - 1) as WizardStep);
  }, [step]);

  // 특정 스텝으로 이동 / Go to specific step
  const goToStep = useCallback((targetStep: WizardStep) => {
    if (targetStep < step) {
      setStep(targetStep);
    }
  }, [step]);

  // 공고 등록 (DRAFT → activate) / Submit job posting
  const handleSubmit = useCallback(async () => {
    if (!validateStep(4)) {
      toast.error('접수 설정을 확인해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = transformToApiPayload(
        form,
        user?.fullName || '',
        user?.email || '',
      );

      // 1. DRAFT 생성 / Create as DRAFT
      const created = await jobCreateApi.create(payload);
      const jobId = created.id || created.jobId;

      // 2. 활성화 / Activate
      await jobCreateApi.activate(jobId);

      setCreatedJobId(jobId);
      autoSave.clearDraft();
      setStep(6);
      toast.success('공고가 등록되었습니다!');
    } catch (err) {
      const message = err instanceof Error ? err.message : '공고 등록에 실패했습니다.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }, [form, user, validateStep, autoSave]);

  // boardType 변경 시 급여 타입 자동 전환 / Auto-switch salary type on boardType change
  const setBoardType = useCallback((boardType: BoardType) => {
    const salaryType = boardType === 'PART_TIME' ? 'HOURLY' : 'MONTHLY';
    updateForm({ boardType, salaryType });
  }, [updateForm]);

  // 이탈 방지 / Prevent page leave
  useEffect(() => {
    if (step >= 6 || !form.title.trim()) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [step, form.title]);

  return {
    // 상태 / State
    form,
    step,
    errors,
    submitting,
    createdJobId,

    // 폼 조작 / Form actions
    updateForm,
    setBoardType,

    // 네비게이션 / Navigation
    handleNext,
    handleBack,
    goToStep,
    handleSubmit,

    // 자동저장 / Auto-save
    lastSaved: autoSave.lastSaved,
    isSaving: autoSave.isSaving,
    manualSave: autoSave.manualSave,

    // 비자 매칭 / Visa matching
    matchResult: visaMatching.matchResult,
    matchLoading: visaMatching.isLoading,
    corpProfile: visaMatching.corpProfile,

    // 사용자 정보 / User info
    user,
    router,
  };
}
