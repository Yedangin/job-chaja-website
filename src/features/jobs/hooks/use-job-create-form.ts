'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/i18n/LanguageProvider';
import { toast } from '@/lib/toast';
import { jobCreateApi, transformToApiPayload } from '../api/job-create.api';
import { companyJobsCopy, getCompanyJobsLocale } from '../company-jobs-copy';
import { getStepSchema } from '../schemas/job-create.schema';
import type { BoardType, JobCreateFormData, WizardStep } from '../types/job-create.types';
import { useAutoSave } from './use-auto-save';
import { useVisaMatching } from './use-visa-matching';

const initialFormData: JobCreateFormData = {
  title: '', jobCategory: [], boardType: 'FULL_TIME', employmentSubType: 'PERMANENT', headcount: 1,
  address: '', addressDetail: '', workDays: [true, true, true, true, true, false, false],
  workTimeStart: '09:00', workTimeEnd: '18:00', salaryType: 'MONTHLY', salaryAmount: '', salaryMax: '',
  experienceLevel: 'ANY', educationLevel: 'ANY', jobDescription: '', requirements: '',
  preferredQualifications: '', benefits: [], customBenefit: '', applicationStartDate: new Date().toISOString().split('T')[0],
  applicationEndDate: '', applicationMethod: 'PLATFORM', externalEmail: '', externalUrl: '', allowedVisas: [],
};

export function useJobCreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const copy = companyJobsCopy[getCompanyJobsLocale(lang)];
  const [form, setForm] = useState<JobCreateFormData>(initialFormData);
  const [step, setStep] = useState<WizardStep>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<number | null>(null);
  const initializedRef = useRef(false);
  const autoSave = useAutoSave(form, step);
  const visaMatching = useVisaMatching();
  const { matchResult, runMatching, setMatchResult } = visaMatching;

  const loadCopyJob = useCallback(async (jobId: string) => {
    try {
      const job = await jobCreateApi.getJobForCopy(jobId);
      if (!job) return;
      setForm((previous) => ({
        ...previous,
        title: job.title || '',
        jobCategory: job.jobCategory || previous.jobCategory,
        boardType: job.boardType || previous.boardType,
        employmentSubType: job.employmentSubType || previous.employmentSubType,
        headcount: job.headcount || 1,
        address: job.displayAddress || job.actualAddress || '',
        addressDetail: job.addressDetail || '',
        workTimeStart: job.workTimeStart || previous.workTimeStart,
        workTimeEnd: job.workTimeEnd || previous.workTimeEnd,
        salaryType: job.hourlyWage ? 'HOURLY' : job.salaryMin ? 'MONTHLY' : previous.salaryType,
        salaryAmount: String(job.hourlyWage || job.salaryMin || ''),
        salaryMax: String(job.salaryMax || ''),
        experienceLevel: job.experienceLevel || previous.experienceLevel,
        educationLevel: job.educationLevel || previous.educationLevel,
        jobDescription: job.description || '',
        requirements: job.requirements || '',
        preferredQualifications: job.preferredQualifications || '',
        benefits: job.benefits ? (typeof job.benefits === 'string' ? JSON.parse(job.benefits) : job.benefits) : previous.benefits,
        allowedVisas: job.allowedVisas ? (typeof job.allowedVisas === 'string' ? job.allowedVisas.split(',') : job.allowedVisas) : previous.allowedVisas,
        applicationMethod: job.applicationMethod || previous.applicationMethod,
        externalEmail: job.externalEmail || '', externalUrl: job.externalUrl || '',
      }));
    } catch {
      toast.error(copy.copyFailed);
    }
  }, [copy.copyFailed]);

  useEffect(() => {
    if (initializedRef.current) return;
    const initializationId = window.setTimeout(() => {
      initializedRef.current = true;
      const copyId = searchParams.get('copy');
      if (copyId) {
        void loadCopyJob(copyId);
        return;
      }
      const draft = autoSave.checkRestore();
      if (draft) {
        setForm(draft.form);
        setStep(draft.step);
        toast.info(copy.draftRestored);
        return;
      }
      const requestedBoardType = searchParams.get('boardType');
      if (requestedBoardType === 'PART_TIME' || requestedBoardType === 'FULL_TIME') {
        setForm((previous) => ({
          ...previous,
          boardType: requestedBoardType,
          salaryType: requestedBoardType === 'PART_TIME' ? 'HOURLY' : 'MONTHLY',
        }));
      }
    }, 0);
    return () => window.clearTimeout(initializationId);
  }, [autoSave, copy.draftRestored, loadCopyJob, searchParams]);

  const updateForm = useCallback((updates: Partial<JobCreateFormData>) => {
    const visaInputsChanged = Object.keys(updates).some((key) =>
      ['boardType', 'salaryType', 'salaryAmount', 'address', 'jobCategory', 'experienceLevel', 'educationLevel'].includes(key),
    );
    setForm((previous) => ({ ...previous, ...updates }));
    if (visaInputsChanged) {
      setMatchResult(null);
      setForm((previous) => ({ ...previous, allowedVisas: [] }));
    }
    setErrors((previous) => {
      const next = { ...previous };
      Object.keys(updates).forEach((key) => delete next[key]);
      return next;
    });
  }, [setMatchResult]);

  const validateStep = useCallback((targetStep: number): boolean => {
    const schema = getStepSchema(targetStep, form.boardType);
    if (!schema) return true;
    const result = schema.safeParse(form);
    if (result.success) {
      setErrors({});
      return true;
    }
    const nextErrors: Record<string, string> = {};
    result.error.errors.forEach((error) => {
      const field = error.path.join('.');
      if (!nextErrors[field]) nextErrors[field] = copy.validationError;
    });
    setErrors(nextErrors);
    return false;
  }, [copy.validationError, form]);

  const handleNext = useCallback(async () => {
    if (!validateStep(step)) {
      toast.error(copy.requiredFields);
      return;
    }
    if (step === 3) {
      const result = await runMatching(form.boardType, form.salaryType, form.salaryAmount, form.address);
      if (!result) return;
      updateForm({ allowedVisas: result.eligibleVisas.map((visa) => visa.code) });
      setStep(4);
    } else if (step < 5) {
      setStep((current) => (current + 1) as WizardStep);
    }
  }, [copy.requiredFields, form, runMatching, step, updateForm, validateStep]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep((current) => (current - 1) as WizardStep);
  }, [step]);

  const goToStep = useCallback((targetStep: WizardStep) => {
    if (targetStep < step) setStep(targetStep);
  }, [step]);

  const handleSubmit = useCallback(async () => {
    if (!matchResult) {
      toast.error('최신 입력정보로 비자 판단 보조를 다시 실행해주세요.');
      setStep(3);
      return;
    }
    if (!validateStep(4)) {
      toast.error(copy.requiredFields);
      return;
    }
    setSubmitting(true);
    try {
      const payload = transformToApiPayload(form, user?.fullName || '', user?.email || '');
      const created = await jobCreateApi.create(payload);
      const jobId = Number(created.id || created.jobId);
      if (!Number.isFinite(jobId)) throw new Error(copy.saveFailed);
      await jobCreateApi.submit(jobId);
      setCreatedJobId(jobId);
      autoSave.clearDraft();
      setStep(6);
      toast.success(copy.reviewSubmitted);
    } catch {
      toast.error(copy.saveFailed);
    } finally {
      setSubmitting(false);
    }
  }, [autoSave, copy.requiredFields, copy.reviewSubmitted, copy.saveFailed, form, matchResult, user, validateStep]);

  const setBoardType = useCallback((boardType: BoardType) => {
    updateForm({ boardType, salaryType: boardType === 'PART_TIME' ? 'HOURLY' : 'MONTHLY' });
  }, [updateForm]);

  useEffect(() => {
    if (step >= 6 || !form.title.trim()) return;
    const preventUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', preventUnload);
    return () => window.removeEventListener('beforeunload', preventUnload);
  }, [form.title, step]);

  return {
    form, step, errors, submitting, createdJobId,
    updateForm, setBoardType, handleNext, handleBack, goToStep, handleSubmit,
    lastSaved: autoSave.lastSaved, isSaving: autoSave.isSaving, manualSave: autoSave.manualSave,
    matchResult, matchLoading: visaMatching.isLoading, corpProfile: visaMatching.corpProfile,
    user, router,
  };
}
