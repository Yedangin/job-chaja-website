'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { WizardStep } from '../types';

/**
 * 3스텝 진행 표시기 (미니멀 스타일)
 * 3-step progress indicator (minimal style)
 *
 * Toss 스타일의 깔끔한 단계 표시기
 * Clean step indicator in Toss style
 */

interface StepIndicatorProps {
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
}

const STEPS: { step: WizardStep; label: string; labelEn: string }[] = [
  { step: 1, label: '어떤 일인가요?', labelEn: 'Job Details' },
  { step: 2, label: '어디서, 어떻게?', labelEn: 'Location & Info' },
  { step: 3, label: '미리보기 & 등록', labelEn: 'Preview & Submit' },
];

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between px-2 py-6" role="navigation" aria-label="공고 작성 단계 / Job creation steps">
      {STEPS.map(({ step, label }, index) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;
        const isClickable = step <= currentStep;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            {/* 스텝 원형 + 라벨 / Step circle + label */}
            <button
              type="button"
              onClick={() => isClickable && onStepClick(step)}
              disabled={!isClickable}
              className={cn(
                'flex flex-col items-center gap-2 transition-all duration-300',
                isClickable ? 'cursor-pointer' : 'cursor-default',
              )}
              aria-label={`${label} (Step ${step})`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {/* 원형 번호 / Circle number */}
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300',
                  isCompleted && 'bg-blue-500 text-white',
                  isCurrent && 'bg-blue-500 text-white ring-4 ring-blue-100',
                  !isCompleted && !isCurrent && 'bg-gray-100 text-gray-400',
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" strokeWidth={2.5} />
                ) : (
                  step
                )}
              </div>

              {/* 라벨 / Label */}
              <span
                className={cn(
                  'text-xs font-medium text-center whitespace-nowrap transition-colors duration-300',
                  isCurrent && 'text-blue-600',
                  isCompleted && 'text-gray-700',
                  !isCompleted && !isCurrent && 'text-gray-400',
                )}
              >
                {label}
              </span>
            </button>

            {/* 연결선 / Connector line */}
            {index < STEPS.length - 1 && (
              <div className="flex-1 mx-3 mt-[-20px]">
                <div
                  className={cn(
                    'h-0.5 rounded-full transition-colors duration-500',
                    step < currentStep ? 'bg-blue-500' : 'bg-gray-200',
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
