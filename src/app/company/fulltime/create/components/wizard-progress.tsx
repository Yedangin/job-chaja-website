/**
 * 위자드 진행 표시 컴포넌트
 * Wizard progress indicator component
 */

'use client';

import { Check } from 'lucide-react';
import type { WizardStep } from './fulltime-types';

interface WizardProgressProps {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
}

const steps = [
  { step: 1 as WizardStep, label: '기본 정보' },
  { step: 2 as WizardStep, label: '근무 조건' },
  { step: 3 as WizardStep, label: '상세 내용' },
  { step: 4 as WizardStep, label: '비자 매칭' },
  { step: 5 as WizardStep, label: '미리보기' },
];

export default function WizardProgress({
  currentStep,
  onStepClick,
}: WizardProgressProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((s, index) => (
        <div key={s.step} className="flex items-center flex-1">
          <button
            type="button"
            onClick={() => onStepClick?.(s.step)}
            disabled={s.step > currentStep}
            className={`flex flex-col items-center gap-2 ${
              onStepClick && s.step <= currentStep
                ? 'cursor-pointer'
                : 'cursor-default'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                s.step < currentStep
                  ? 'bg-blue-600 text-white'
                  : s.step === currentStep
                  ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s.step < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                s.step
              )}
            </div>
            <span
              className={`text-xs font-medium whitespace-nowrap ${
                s.step === currentStep
                  ? 'text-blue-600'
                  : s.step < currentStep
                  ? 'text-gray-700'
                  : 'text-gray-400'
              }`}
            >
              {s.label}
            </span>
          </button>

          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 bg-gray-200">
              <div
                className={`h-full transition-all duration-300 ${
                  s.step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                style={{
                  width: s.step < currentStep ? '100%' : '0%',
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
