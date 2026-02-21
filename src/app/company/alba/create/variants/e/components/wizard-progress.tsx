'use client';

import { Check } from 'lucide-react';

interface WizardProgressProps {
  /** 현재 스텝 (1~3) / Current step (1~3) */
  currentStep: number;
  /** 스텝 클릭 핸들러 (완료된 스텝만 클릭 가능) / Step click handler (only completed steps) */
  onStepClick: (step: number) => void;
}

/** 위자드 스텝 정의 / Wizard step definitions */
const steps = [
  { step: 1, title: '기본정보', titleEn: 'Job Info', description: '직종, 시급, 스케줄' },
  { step: 2, title: '상세조건', titleEn: 'Details', description: '제목, 주소, 자격' },
  { step: 3, title: '최종확인', titleEn: 'Preview', description: '미리보기, 비자, 등록' },
];

/**
 * 3단계 위자드 진행 표시줄 (시안 E)
 * 3-step wizard progress bar (Variant E)
 *
 * 완료 스텝: green 체크 아이콘 / Completed: green check icon
 * 현재 스텝: blue 강조 + 링 / Current: blue highlight + ring
 * 미완 스텝: gray 비활성 / Upcoming: gray disabled
 */
export function WizardProgress({ currentStep, onStepClick }: WizardProgressProps) {
  return (
    <div className="w-full" role="navigation" aria-label="위자드 진행 상태 / Wizard progress">
      <div className="flex items-center">
        {steps.map((s, index) => (
          <div key={s.step} className="flex items-center flex-1 last:flex-none">
            {/* 스텝 원형 + 라벨 / Step circle + label */}
            <button
              type="button"
              className="flex flex-col items-center cursor-pointer disabled:cursor-not-allowed"
              onClick={() => onStepClick(s.step)}
              disabled={s.step > currentStep}
              aria-label={`${s.title} (${s.titleEn}) - 단계 ${s.step}`}
              aria-current={currentStep === s.step ? 'step' : undefined}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                  ${currentStep > s.step ? 'bg-green-500 text-white' : ''}
                  ${currentStep === s.step ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                  ${currentStep < s.step ? 'bg-gray-200 text-gray-400' : ''}
                `}
              >
                {currentStep > s.step ? <Check className="w-5 h-5" /> : s.step}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-semibold ${
                    currentStep === s.step
                      ? 'text-blue-600'
                      : currentStep > s.step
                        ? 'text-green-600'
                        : 'text-gray-400'
                  }`}
                >
                  {s.title}
                </p>
                <p className="text-xs text-gray-400 hidden sm:block">{s.description}</p>
              </div>
            </button>

            {/* 연결선 / Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-3 transition-colors duration-300 ${
                  currentStep > s.step ? 'bg-green-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
