 'use client';

import { Check } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { getAlbaCopy } from '../copy';
import type { WizardStep } from './alba-types';

/**
 * 위자드 진행 표시 (E 스타일 기반)
 * Wizard progress indicator (based on variant E style)
 */

interface Props {
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
}

export default function WizardProgress({ currentStep, onStepClick }: Props) {
  const { lang } = useLanguage();
  const copy = getAlbaCopy(lang);

  return (
    <nav aria-label={copy.progressLabel} className="w-full">
      <ol className="grid grid-cols-3 items-start gap-1 sm:gap-3">
        {copy.steps.map((label, index) => {
          const step = (index + 1) as WizardStep;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <li key={label} className="relative min-w-0">
              {index < copy.steps.length - 1 && <span aria-hidden="true" className={`absolute left-[calc(50%+1.25rem)] right-[-0.25rem] top-4 h-px sm:left-[calc(50%+1.5rem)] sm:right-[-0.75rem] ${isCompleted ? 'bg-[#0066FF]' : 'bg-gray-200'}`} />}
              <button type="button" onClick={() => isCompleted && onStepClick(step)} disabled={!isCompleted} aria-current={isCurrent ? 'step' : undefined} aria-label={`${step}. ${label}`} className="relative z-10 flex min-w-0 w-full flex-col items-center gap-1.5 text-center disabled:cursor-default">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${isCompleted ? 'bg-[#0066FF] text-white' : isCurrent ? 'bg-[#0066FF] text-white ring-4 ring-blue-100' : 'bg-gray-200 text-gray-500'}`}>
                  {isCompleted ? <Check aria-hidden="true" className="h-4 w-4" /> : step}
                </span>
                <span className={`max-w-full break-words text-[11px] font-medium leading-tight sm:text-sm ${isCurrent ? 'text-[#0066FF]' : isCompleted ? 'text-[#191F28]' : 'text-gray-500'}`}>{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
