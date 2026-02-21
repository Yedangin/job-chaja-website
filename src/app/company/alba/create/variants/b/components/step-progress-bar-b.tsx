'use client';

/**
 * Variant B 진행 표시기 — 정보 밀도 높은 가로 스텝바
 * Variant B progress bar — dense horizontal step bar
 *
 * 사람인/잡코리아 스타일: 컴팩트한 스텝 표시, 번호 + 이름
 * Saramin/Jobkorea style: compact step display, number + name
 */

interface StepProgressBarBProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

// ─── 스텝 정보 / Step info ───
const STEPS = [
  { num: 1, label: '직무 / 근무조건', labelEn: 'Job & Schedule' },
  { num: 2, label: '상세정보 / 위치', labelEn: 'Details & Location' },
  { num: 3, label: '미리보기 / 등록', labelEn: 'Preview & Register' },
];

export function StepProgressBarB({ currentStep, onStepClick }: StepProgressBarBProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm mb-4">
      <div className="flex">
        {STEPS.map((step, idx) => {
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;
          const isClickable = currentStep > step.num;

          return (
            <button
              key={step.num}
              type="button"
              onClick={() => isClickable && onStepClick(step.num)}
              disabled={!isClickable}
              aria-label={`Step ${step.num}: ${step.label}`}
              className={`
                flex-1 flex items-center justify-center gap-2 px-3 py-3
                text-sm font-medium transition-colors
                border-b-2 relative
                ${isActive
                  ? 'bg-navy-50 border-b-navy-700 text-navy-800 bg-blue-50/50'
                  : isCompleted
                    ? 'bg-gray-50 border-b-green-500 text-gray-600 hover:bg-gray-100 cursor-pointer'
                    : 'bg-white border-b-transparent text-gray-400 cursor-default'
                }
                ${idx < STEPS.length - 1 ? 'border-r border-gray-200' : ''}
              `}
            >
              {/* 스텝 번호 원형 / Step number circle */}
              <span
                className={`
                  inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                  ${isActive
                    ? 'bg-blue-700 text-white'
                    : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {isCompleted ? '\u2713' : step.num}
              </span>

              {/* 스텝 라벨 / Step label */}
              <span className="hidden sm:inline truncate">{step.label}</span>
              <span className="sm:hidden text-xs">{`Step ${step.num}`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
