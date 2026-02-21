'use client';

/**
 * 위저드 프로그레스 바 컴포넌트 / Wizard progress bar component
 * 상단에 고정되는 가로 프로그레스 바 + Step 번호 + 자동저장 표시
 * Fixed horizontal progress bar at top with step number and auto-save indicator
 */

import { cn } from '@/lib/utils';
import { Check, Save, Loader2, AlertCircle } from 'lucide-react';
import type { AutoSaveStatus } from '../types';
import { STEP_META } from '../mock-data';

interface WizardProgressBarProps {
  /** 현재 Step 번호 / Current step number */
  currentStep: number;
  /** 전체 완성도(%) / Total completion percentage */
  totalPercent: number;
  /** 자동저장 상태 / Auto-save status */
  autoSaveStatus: AutoSaveStatus;
  /** Step 클릭 핸들러 / Step click handler */
  onStepClick?: (step: number) => void;
  /** 각 Step 완료 여부 / Whether each step is complete */
  stepCompleted: boolean[];
}

/** 자동저장 상태 표시 / Auto-save status indicator */
function AutoSaveIndicator({ status }: { status: AutoSaveStatus }) {
  switch (status) {
    case 'SAVING':
      return (
        <span className="flex items-center gap-1.5 text-xs text-blue-500">
          <Loader2 className="w-3 h-3 animate-spin" />
          {/* 저장 중... / Saving... */}
          <span className="hidden sm:inline">저장 중...</span>
        </span>
      );
    case 'SAVED':
      return (
        <span className="flex items-center gap-1.5 text-xs text-green-600">
          <Check className="w-3 h-3" />
          {/* 저장됨 / Saved */}
          <span className="hidden sm:inline">저장됨</span>
        </span>
      );
    case 'ERROR':
      return (
        <span className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3 h-3" />
          {/* 저장 실패 / Save failed */}
          <span className="hidden sm:inline">저장 실패</span>
        </span>
      );
    default:
      return null;
  }
}

export default function WizardProgressBar({
  currentStep,
  totalPercent,
  autoSaveStatus,
  onStepClick,
  stepCompleted,
}: WizardProgressBarProps) {
  const totalSteps = STEP_META.length;
  const currentMeta = STEP_META[currentStep];

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      {/* 프로그레스 바 (최상단 얇은 바) / Progress bar (thin top bar) */}
      <div className="h-1 bg-gray-100 w-full">
        <div
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${totalPercent}%` }}
          role="progressbar"
          aria-valuenow={totalPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`위저드 진행률 ${totalPercent}% / Wizard progress ${totalPercent}%`}
        />
      </div>

      {/* Step 정보 + 저장 상태 / Step info + save status */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          {/* Step 번호 + 제목 / Step number + title */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">
              {currentStep}
            </span>
            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-tight">
                {currentMeta?.title}
                <span className="text-gray-400 font-normal ml-1.5 text-xs">
                  {currentMeta?.titleEn}
                </span>
              </h2>
            </div>
          </div>

          {/* 완성도 + 자동저장 / Completion + auto-save */}
          <div className="flex items-center gap-3">
            <AutoSaveIndicator status={autoSaveStatus} />
            <span className="text-xs font-semibold text-gray-500">
              {totalPercent}%
            </span>
          </div>
        </div>

        {/* Step 도트 네비게이션 / Step dot navigation */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }, (_, i) => {
            const isActive = i === currentStep;
            const isCompleted = stepCompleted[i];
            const isPast = i < currentStep;

            return (
              <button
                key={i}
                type="button"
                onClick={() => onStepClick?.(i)}
                className={cn(
                  'flex-1 h-1.5 rounded-full transition-all duration-300',
                  'min-w-[20px] cursor-pointer',
                  isActive && 'bg-blue-500',
                  isCompleted && !isActive && 'bg-green-400',
                  isPast && !isCompleted && !isActive && 'bg-blue-200',
                  !isPast && !isActive && !isCompleted && 'bg-gray-200',
                )}
                aria-label={`Step ${i}: ${STEP_META[i]?.title} ${STEP_META[i]?.titleEn}${isCompleted ? ' (완료 / Complete)' : ''}`}
                aria-current={isActive ? 'step' : undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
