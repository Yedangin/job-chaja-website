'use client';

/**
 * 세로 도트 네비게이션 컴포넌트 / Vertical dot navigation component
 * 우측에 8개의 도트로 현재 진행 상태를 표시합니다.
 * Shows 8 dots on the right side indicating current progress.
 */

import { cn } from '@/lib/utils';
import { STEP_METAS } from '../types';
import type { WizardStep } from '../types';

interface DotNavigationProps {
  /** 현재 스텝 / Current step */
  currentStep: WizardStep;
  /** 완료된 스텝 목록 / Completed steps list */
  completedSteps: WizardStep[];
  /** 스텝 클릭 핸들러 / Step click handler */
  onStepClick?: (step: WizardStep) => void;
  /** 추가 CSS 클래스 / Additional CSS classes */
  className?: string;
}

export default function DotNavigation({
  currentStep,
  completedSteps,
  onStepClick,
  className,
}: DotNavigationProps) {
  return (
    <nav
      aria-label="Wizard progress navigation"
      className={cn(
        'fixed right-4 top-1/2 -translate-y-1/2 z-40',
        'hidden md:flex flex-col items-center gap-3',
        className
      )}
    >
      {STEP_METAS.map((meta) => {
        const isActive = meta.step === currentStep;
        const isCompleted = completedSteps.includes(meta.step);
        const isClickable = isCompleted || meta.step <= currentStep;

        return (
          <button
            key={meta.step}
            type="button"
            onClick={() => isClickable && onStepClick?.(meta.step)}
            disabled={!isClickable}
            aria-label={`${meta.label} (${meta.description})`}
            aria-current={isActive ? 'step' : undefined}
            className={cn(
              'group relative flex items-center',
              'transition-all duration-300',
              isClickable ? 'cursor-pointer' : 'cursor-default'
            )}
          >
            {/* 도트 / Dot */}
            <div
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-300',
                'min-w-[12px] min-h-[12px]', // 터치 영역 보조 / Touch area support
                isActive && 'w-4 h-4 bg-blue-500 ring-4 ring-blue-100 shadow-md',
                isCompleted && !isActive && 'bg-green-500 shadow-sm',
                !isActive && !isCompleted && 'bg-gray-300',
              )}
            />

            {/* 툴팁 (호버 시) / Tooltip on hover */}
            <div
              className={cn(
                'absolute right-full mr-3 px-3 py-1.5 rounded-lg text-xs font-medium',
                'whitespace-nowrap',
                'opacity-0 group-hover:opacity-100 pointer-events-none',
                'transition-opacity duration-200',
                'bg-gray-900 text-white shadow-lg'
              )}
            >
              <span className="mr-1">{meta.icon}</span>
              {meta.label}
              {/* 툴팁 화살표 / Tooltip arrow */}
              <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 rotate-45" />
            </div>

            {/* 연결선 (마지막 제외) / Connector line (except last) */}
            {meta.step < 7 && (
              <div
                className={cn(
                  'absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-3',
                  isCompleted ? 'bg-green-300' : 'bg-gray-200'
                )}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

/**
 * 모바일용 진행률 바 / Mobile progress bar
 * 모바일에서는 상단에 진행률 바를 표시합니다.
 * Shows progress bar at top on mobile.
 */
export function MobileProgressBar({
  currentStep,
  className,
}: {
  currentStep: WizardStep;
  className?: string;
}) {
  // 진행률 계산 (0~7 → 0~100%) / Calculate progress
  const progress = ((currentStep) / 7) * 100;

  return (
    <div className={cn('md:hidden w-full', className)}>
      {/* 스텝 라벨 / Step label */}
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-sm font-medium text-gray-700">
          {STEP_METAS[currentStep]?.icon} {STEP_METAS[currentStep]?.label}
        </span>
        <span className="text-xs text-gray-500">
          {currentStep + 1} / 8
        </span>
      </div>

      {/* 진행률 바 / Progress bar */}
      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
