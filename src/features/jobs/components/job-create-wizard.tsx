'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useJobCreateForm } from '../hooks/use-job-create-form';
import { StepProgressBar } from './step-progress-bar';
import { FormBottomBar } from './form-bottom-bar';
import { StepBasicInfo } from './step-basic-info';
import { StepWorkConditions } from './step-work-conditions';
import { StepDetails } from './step-details';
import { StepVisaMatching } from './step-visa-matching';
import { StepPreview } from './step-preview';
import { StepCompletion } from './step-completion';

/**
 * 채용공고 등록 메인 위자드 컨테이너
 * Main job creation wizard container
 *
 * 5단계 위자드 + 완료 화면 오케스트레이션
 * 5-step wizard + completion screen orchestration
 */
export function JobCreateWizard() {
  const {
    form,
    step,
    errors,
    submitting,
    createdJobId,
    updateForm,
    setBoardType,
    handleNext,
    handleBack,
    goToStep,
    handleSubmit,
    lastSaved,
    isSaving,
    manualSave,
    matchResult,
    matchLoading,
    user,
  } = useJobCreateForm();

  // ─── Step 6: 등록 완료 / Completion ───
  if (step === 6) {
    return (
      <StepCompletion
        form={form}
        matchResult={matchResult}
        createdJobId={createdJobId}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* 상단 헤더 / Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Link
            href="/company/jobs"
            className="p-1.5 text-gray-400 hover:text-gray-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">공고 등록</h1>
        </div>
        <span className="text-xs text-gray-400">
          {isSaving ? '저장 중...' : lastSaved ? `임시저장됨 ${lastSaved}` : ''}
        </span>
      </div>

      {/* 진행 표시기 / Progress bar */}
      <StepProgressBar
        currentStep={step}
        onStepClick={goToStep}
      />

      {/* ─── 스텝 컴포넌트 렌더링 / Step component rendering ─── */}
      {step === 1 && (
        <StepBasicInfo
          form={form}
          errors={errors}
          onUpdate={updateForm}
          onBoardTypeChange={setBoardType}
        />
      )}

      {step === 2 && (
        <StepWorkConditions
          form={form}
          errors={errors}
          onUpdate={updateForm}
        />
      )}

      {step === 3 && (
        <StepDetails
          form={form}
          errors={errors}
          onUpdate={updateForm}
        />
      )}

      {step === 4 && (
        <StepVisaMatching
          form={form}
          errors={errors}
          matchResult={matchResult}
          matchLoading={matchLoading}
          onUpdate={updateForm}
          onGoToStep={goToStep}
        />
      )}

      {step === 5 && (
        <StepPreview
          form={form}
          matchResult={matchResult}
          companyName={user?.companyName || ''}
          onGoToStep={goToStep}
        />
      )}

      {/* 하단 네비게이션 / Bottom navigation */}
      <FormBottomBar
        step={step}
        submitting={submitting}
        matchLoading={matchLoading}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        onSave={manualSave}
      />
    </div>
  );
}
