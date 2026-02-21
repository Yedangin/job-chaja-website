'use client';

import { Check } from 'lucide-react';
import type { WizardStep } from './alba-types';

/**
 * 위자드 진행 표시 (E 스타일 기반)
 * Wizard progress indicator (based on variant E style)
 */

const steps = [
  { num: 1 as WizardStep, label: '기본정보', labelEn: 'Basic Info' },
  { num: 2 as WizardStep, label: '상세조건', labelEn: 'Details' },
  { num: 3 as WizardStep, label: '미리보기', labelEn: 'Preview' },
];

interface Props {
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
}

export default function WizardProgress({ currentStep, onStepClick }: Props) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((s, i) => {
        const isCompleted = s.num < currentStep;
        const isCurrent = s.num === currentStep;

        return (
          <div key={s.num} className="flex items-center">
            {/* 스텝 버튼 / Step button */}
            <button
              type="button"
              onClick={() => isCompleted && onStepClick(s.num)}
              disabled={!isCompleted}
              className="flex items-center gap-2"
            >
              {/* 원형 인디케이터 / Circle indicator */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : s.num}
              </div>
              {/* 라벨 / Label */}
              <div className="text-left hidden sm:block">
                <p className={`text-sm font-medium ${isCurrent ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-400'}`}>
                  {s.label}
                </p>
                <p className="text-[10px] text-gray-400">{s.labelEn}</p>
              </div>
            </button>

            {/* 연결선 / Connector line */}
            {i < steps.length - 1 && (
              <div className={`w-12 sm:w-16 h-0.5 mx-2 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
