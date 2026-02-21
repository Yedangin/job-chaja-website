'use client';

/**
 * StepContent — 우측 폼 영역 래퍼
 * StepContent — Right-side form area wrapper
 *
 * 현재 Step의 제목, 설명, 폼 콘텐츠, 네비게이션 버튼을 래핑
 * Wraps current step title, description, form content, and navigation buttons
 */

import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { WIZARD_STEPS } from './wizard-types';

interface StepContentProps {
  /** 현재 스텝 / Current step */
  currentStep: number;
  /** 폼 콘텐츠 / Form content */
  children: React.ReactNode;
  /** 이전 버튼 핸들러 / Previous button handler */
  onPrev: () => void;
  /** 다음 버튼 핸들러 / Next button handler */
  onNext: () => void;
  /** 저장 핸들러 / Save handler */
  onSave: () => void;
  /** 로딩 상태 / Loading state */
  isLoading?: boolean;
  /** 마지막 스텝 여부 / Is last step */
  isLastStep: boolean;
  /** 첫번째 스텝 여부 / Is first step */
  isFirstStep: boolean;
}

export default function StepContent({
  currentStep,
  children,
  onPrev,
  onNext,
  onSave,
  isLoading = false,
  isLastStep,
  isFirstStep,
}: StepContentProps) {
  const stepData = WIZARD_STEPS[currentStep];

  return (
    <main
      className={cn(
        'flex-1 min-w-0',
        'px-4 py-6 lg:px-8 lg:py-8',
        'max-w-3xl mx-auto w-full'
      )}
      aria-label={`Step ${currentStep}: ${stepData?.label ?? ''}`}
    >
      {/* 스텝 헤더 / Step header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            {currentStep}
          </span>
          <h1 className="text-xl font-bold text-gray-900">
            {stepData?.label ?? ''}
          </h1>
        </div>
        <p className="text-sm text-gray-500 ml-9">
          {stepData?.labelEn ?? ''}
        </p>
      </div>

      {/* 폼 콘텐츠 영역 / Form content area */}
      <div className="mb-8">
        {children}
      </div>

      {/* 네비게이션 버튼 / Navigation buttons */}
      <div
        className={cn(
          'flex items-center gap-3 pt-6 border-t border-gray-200',
          isFirstStep ? 'justify-end' : 'justify-between'
        )}
      >
        {/* 이전 버튼 / Previous button */}
        {!isFirstStep && (
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={isLoading}
            className="min-h-[44px] min-w-[44px] gap-2"
            aria-label="이전 단계 / Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </Button>
        )}

        {/* 우측: 저장 + 다음 / Right: Save + Next */}
        <div className="flex items-center gap-2">
          {/* 임시저장 / Save draft */}
          <Button
            variant="outline"
            onClick={onSave}
            disabled={isLoading}
            className="min-h-[44px] gap-2"
            aria-label="임시저장 / Save draft"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            저장
          </Button>

          {/* 다음 또는 완료 / Next or Complete */}
          <Button
            onClick={onNext}
            disabled={isLoading}
            className="min-h-[44px] gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            aria-label={isLastStep ? '프로필 완성 / Complete profile' : '다음 단계 / Next step'}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLastStep ? '프로필 완성' : '다음'}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </main>
  );
}
