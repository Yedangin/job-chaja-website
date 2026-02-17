'use client';

import { Check } from 'lucide-react';
import { STEP_LABELS } from '../types/job-create.types';
import type { WizardStep } from '../types/job-create.types';

interface StepProgressBarProps {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
}

/**
 * 상단 진행 표시기 / Step progress bar
 * 5단계 위자드 진행 상황 표시
 * Shows 5-step wizard progress
 */
export function StepProgressBar({ currentStep, onStepClick }: StepProgressBarProps) {
  return (
    <div className="flex items-center mb-8">
      {STEP_LABELS.map((label, idx) => {
        const num = (idx + 1) as WizardStep;
        const isActive = currentStep === num;
        const isCompleted = currentStep > num;
        const isClickable = isCompleted && onStepClick;

        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex items-center gap-1.5">
              {/* 스텝 번호 원형 / Step number circle */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick(num)}
                disabled={!isClickable}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition
                  ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                  ${isCompleted ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : num}
              </button>
              {/* 스텝 레이블 / Step label */}
              <span className={`text-xs font-medium hidden sm:inline ${
                currentStep >= num ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {label}
              </span>
            </div>
            {/* 연결선 / Connector line */}
            {idx < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition ${
                isCompleted ? 'bg-green-400' : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
