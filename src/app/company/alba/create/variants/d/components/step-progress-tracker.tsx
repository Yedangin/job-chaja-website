'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

/**
 * Linear 스타일 프로그레스 트래커
 * Linear-style step progress tracker
 *
 * 3단계 위자드 진행 상태 표시 (Notion/Linear 미니멀 스타일)
 * Shows 3-step wizard progress in Notion/Linear minimal style
 */

interface StepProgressTrackerProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { num: 1, label: '근무정보', labelEn: 'Job Details' },
  { num: 2, label: '상세설정', labelEn: 'Details & Location' },
  { num: 3, label: '미리보기', labelEn: 'Preview & Submit' },
];

export function StepProgressTracker({ currentStep, onStepClick }: StepProgressTrackerProps) {
  return (
    <div className="flex items-center gap-0 mb-8" role="navigation" aria-label="공고 등록 단계 / Job creation steps">
      {STEPS.map((step, idx) => {
        const isCompleted = currentStep > step.num;
        const isCurrent = currentStep === step.num;
        const isClickable = step.num < currentStep;

        return (
          <div key={step.num} className="flex items-center flex-1 last:flex-none">
            {/* 스텝 버튼 / Step button */}
            <button
              type="button"
              onClick={() => isClickable && onStepClick(step.num)}
              disabled={!isClickable}
              className={cn(
                'flex items-center gap-2 py-1.5 px-3 rounded transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
                isClickable && 'cursor-pointer hover:bg-gray-100',
                !isClickable && !isCurrent && 'cursor-default',
              )}
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`${step.label} (${step.labelEn}) - ${isCompleted ? '완료 / Completed' : isCurrent ? '현재 / Current' : '대기 / Pending'}`}
            >
              {/* 스텝 번호 또는 체크마크 / Step number or checkmark */}
              <span
                className={cn(
                  'flex items-center justify-center w-6 h-6 rounded text-xs font-mono font-semibold transition-colors',
                  isCompleted && 'bg-indigo-600 text-white',
                  isCurrent && 'bg-gray-900 text-white',
                  !isCompleted && !isCurrent && 'bg-gray-200 text-gray-400',
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.num}
              </span>

              {/* 스텝 라벨 / Step label */}
              <span
                className={cn(
                  'text-sm font-medium transition-colors whitespace-nowrap',
                  isCurrent && 'text-gray-900',
                  isCompleted && 'text-gray-600',
                  !isCompleted && !isCurrent && 'text-gray-400',
                )}
              >
                {step.label}
              </span>
            </button>

            {/* 연결선 / Connector line */}
            {idx < STEPS.length - 1 && (
              <div className="flex-1 mx-2">
                <div
                  className={cn(
                    'h-px w-full transition-colors',
                    currentStep > step.num ? 'bg-indigo-400' : 'bg-gray-200',
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
