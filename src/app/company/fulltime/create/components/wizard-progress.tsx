/**
 * 위자드 진행 표시 컴포넌트
 * Wizard progress indicator component
 */

'use client';

import { Check } from 'lucide-react';
import type { WizardStep } from './fulltime-types';
import { useFulltimeCopy } from '../copy';

interface WizardProgressProps {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
}

export default function WizardProgress({
  currentStep,
  onStepClick,
}: WizardProgressProps) {
  const copy = useFulltimeCopy();
  const steps = [
    { step: 1 as WizardStep, label: copy.stepBasic }, { step: 2 as WizardStep, label: copy.stepConditions },
    { step: 3 as WizardStep, label: copy.stepDetails }, { step: 4 as WizardStep, label: copy.stepVisa },
    { step: 5 as WizardStep, label: copy.stepPreview },
  ];
  return (
    <div className="flex items-start justify-between gap-0 overflow-x-auto pb-1">
      {steps.map((s, index) => (
        <div key={s.step} className="flex items-center flex-1">
          <button
            type="button"
            onClick={() => onStepClick?.(s.step)}
            disabled={s.step > currentStep}
            aria-label={s.label}
            className={`flex flex-col items-center gap-1 ${
              onStepClick && s.step <= currentStep
                ? 'cursor-pointer'
                : 'cursor-default'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                s.step < currentStep
                  ? 'bg-blue-600 text-white'
                  : s.step === currentStep
                  ? 'bg-blue-600 text-white ring-2 ring-blue-100'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s.step < currentStep ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                s.step
              )}
            </div>
            <span
              className={`hidden min-[460px]:block text-[11px] font-medium whitespace-nowrap ${
                s.step === currentStep
                  ? 'text-blue-600'
                  : s.step < currentStep
                  ? 'text-gray-600'
                  : 'text-gray-400'
              }`}
            >
              {s.label}
            </span>
          </button>

          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-1.5 bg-gray-200">
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
