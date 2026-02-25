/**
 * 정규채용 공고 등록 위자드 (최종 버전)
 * Fulltime job posting creation wizard (final version)
 * - Step 1: 기본 정보 (직종, 연봉, 경력, 학력, 해외채용)
 * - Step 2: 근무 조건 (주소, 우대전공, 모집인원, 회사정보)
 * - Step 3: 상세 내용 (제목, 설명, 복리후생)
 * - Step 4: 비자 매칭 결과 + 접수 설정
 * - Step 5: 미리보기 + 등록
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import WizardProgress from './components/wizard-progress';
import StepBasicInfo from './components/step-basic-info';
import StepWorkConditions from './components/step-work-conditions';
import StepDetails from './components/step-details';
import StepVisaMatching from './components/step-visa-matching';
import StepPreview from './components/step-preview';
import LiveVisaIndicator from './components/live-visa-indicator';
import { matchFulltimeVisa, createFulltimeJob } from './api';
import type {
  FulltimeJobFormData,
  FulltimeVisaMatchingResponse,
  WizardStep,
} from './components/fulltime-types';

const INITIAL_FORM: FulltimeJobFormData = {
  // Step 1 — 선택 필드는 빈값으로 초기화 (사용자가 직접 선택)
  // Selection fields initialized empty (user must explicitly choose)
  jobCategoryCode: '',
  employmentType: '' as unknown as FulltimeJobFormData['employmentType'],
  salaryInputType: '' as unknown as FulltimeJobFormData['salaryInputType'],
  salaryMin: 0,
  salaryMax: 0,
  weeklyWorkHours: 40,
  experienceLevel: '' as unknown as FulltimeJobFormData['experienceLevel'],
  educationLevel: '' as unknown as FulltimeJobFormData['educationLevel'],
  overseasHireWilling: true,  // 해외 인재 채용 기본값 "예" / Default overseas hire = yes
  // Step 2
  address: { sido: '', sigungu: '', detail: '' },
  preferredMajors: [],
  recruitCount: 1,
  companyInfo: {},
  // Step 3
  title: '',
  detailDescription: '',
  benefits: [],
  // Step 4
  applicationMethod: 'PLATFORM',
  applicationDeadline: null,
  isOpenEnded: false,
};

export default function FulltimeCreatePage() {
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<FulltimeJobFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [matchResult, setMatchResult] = useState<FulltimeVisaMatchingResponse | null>(null);
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // 폼 업데이트 / Update form field
  const updateForm = useCallback(
    <K extends keyof FulltimeJobFormData>(key: K, value: FulltimeJobFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      // 비자 매칭에 영향을 주는 필드 변경 시 결과 초기화
      if (
        [
          'jobCategoryCode',
          'employmentType',
          'salaryMin',
          'salaryMax',
          'experienceLevel',
          'educationLevel',
          'overseasHireWilling',
          'address',
        ].includes(key)
      ) {
        setMatchResult(null);
      }
    },
    []
  );

  // Step 1 유효성 검증
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.jobCategoryCode) errs.jobCategoryCode = '직종을 선택해주세요';
    if (!form.employmentType) errs.employmentType = '고용 형태를 선택해주세요';
    if (form.salaryMin < 20000000) errs.salaryMin = '최소 연봉은 2,000만원 이상이어야 합니다';
    if (form.salaryMax < form.salaryMin) errs.salaryMax = '최대 연봉은 최소 연봉보다 커야 합니다';
    if (!form.experienceLevel) errs.experienceLevel = '경력 수준을 선택해주세요';
    if (!form.educationLevel) errs.educationLevel = '학력을 선택해주세요';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 유효성 검증
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.address.sido) errs.address = '시/도를 선택해주세요';
    if (!form.address.sigungu) errs.address = '시/군/구를 선택해주세요';
    if (!form.address.detail.trim()) errs.address = '상세 주소를 입력해주세요';
    if (form.recruitCount < 1) errs.recruitCount = '모집 인원은 1명 이상이어야 합니다';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 유효성 검증
  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim() || form.title.length < 10)
      errs.title = '제목은 10자 이상 입력해주세요';
    if (!form.detailDescription.trim() || form.detailDescription.length < 50)
      errs.detailDescription = '상세 설명은 50자 이상 입력해주세요';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 4 유효성 검증
  const validateStep4 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.applicationMethod) errs.applicationMethod = '접수 방법을 선택해주세요';
    if (!form.isOpenEnded && !form.applicationDeadline)
      errs.applicationDeadline = '마감일을 선택하거나 "채용 시까지"를 체크해주세요';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 다음 단계
  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    if (step === 4 && !validateStep4()) return;
    setStep((prev) => Math.min(prev + 1, 5) as WizardStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 이전 단계
  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1) as WizardStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 4 진입 시 비자 매칭 자동 실행
  useEffect(() => {
    if (step === 4 && !matchResult && !isMatchLoading) {
      handleRequestMatch();
    }
  }, [step]);

  // 비자 매칭 요청
  const handleRequestMatch = useCallback(async () => {
    if (isMatchLoading) return;
    setIsMatchLoading(true);
    try {
      const result = await matchFulltimeVisa(form);
      setMatchResult(result);
    } catch {
      setMatchResult(null);
    } finally {
      setIsMatchLoading(false);
    }
  }, [form, isMatchLoading]);

  // 공고 등록
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await createFulltimeJob(form);
      setCompleted(true);
    } catch {
      alert('공고 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  // 완료 화면
  if (completed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">정규채용 공고가 등록되었습니다!</h2>
          <p className="text-sm text-gray-500 mb-8">
            비자 매칭 결과: {matchResult?.overallSummary.totalEligible ?? 0}개 가능,{' '}
            {matchResult?.overallSummary.totalConditional ?? 0}개 조건부
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/company/fulltime"
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              공고 관리로 이동
            </Link>
            <Link
              href="/company/fulltime/create"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition"
              onClick={() => {
                setForm(INITIAL_FORM);
                setStep(1);
                setMatchResult(null);
                setCompleted(false);
              }}
            >
              새 공고 등록
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 이전/다음 네비게이션 버튼 / Prev/next navigation buttons
  const NavButtons = () => (
    <div className="flex items-center justify-between pt-5 mt-5 border-t border-gray-100">
      {step > 1 ? (
        <button
          type="button"
          onClick={handlePrev}
          className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          이전
        </button>
      ) : (
        <div />
      )}
      {step < 5 ? (
        <button
          type="button"
          onClick={handleNext}
          className="px-7 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition min-w-[100px]"
        >
          다음
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-7 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              등록 중...
            </>
          ) : (
            '최종 등록하기'
          )}
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50">
      {/* 상단 컴팩트 스티키 바: 제목 + 진행 단계 / Compact sticky bar: title + step progress */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          {/* 제목 행 / Title row */}
          <div className="h-11 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/company/fulltime" className="p-1 text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-sm font-bold text-gray-900">정규채용 공고 등록</h1>
            </div>
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">임시저장</span>
            </button>
          </div>
          {/* 진행 단계 표시 / Step progress */}
          <div className="pb-2.5">
            <WizardProgress currentStep={step} onStepClick={(s) => setStep(s)} />
          </div>
        </div>
      </div>

      {/* 스텝 컨텐츠 — Steps 1~3: 2컬럼 (폼 + 비자 패널), Steps 4~5: 단일 컬럼 */}
      {/* Step content — Steps 1~3: 2-column (form + visa panel), Steps 4~5: single column */}
      {step <= 3 ? (
        <div className="max-w-6xl mx-auto px-4 pt-5 pb-8">
          <div className="flex gap-5 items-start">
            <div className="flex-1 min-w-0">
              {step === 1 && <StepBasicInfo form={form} errors={errors} updateForm={updateForm} />}
              {step === 2 && <StepWorkConditions form={form} errors={errors} updateForm={updateForm} />}
              {step === 3 && <StepDetails form={form} errors={errors} updateForm={updateForm} />}
            </div>
            {/* 우측 비자 패널 (sticky) / Right visa panel (sticky) */}
            <div className="w-64 shrink-0 sticky top-[100px]">
              <LiveVisaIndicator form={form} />
            </div>
          </div>
          <NavButtons />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 pt-5 pb-8">
          {step === 4 && (
            <StepVisaMatching
              form={form}
              errors={errors}
              updateForm={updateForm}
              matchResult={matchResult}
              isMatchLoading={isMatchLoading}
              onRequestMatch={handleRequestMatch}
            />
          )}
          {step === 5 && <StepPreview form={form} onGoToStep={setStep} />}
          <NavButtons />
        </div>
      )}
    </div>
  );
}
