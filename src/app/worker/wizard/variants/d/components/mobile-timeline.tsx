'use client';

/**
 * MobileTimeline — 모바일용 접이식 타임라인
 * MobileTimeline — Collapsible timeline for mobile devices
 *
 * 상단에 현재 스텝 표시 + 탭하면 전체 타임라인 펼침
 * Shows current step at top + expands full timeline on tap
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStepSummary } from './step-summary';
import { WIZARD_STEPS } from './wizard-types';
import type { WizardFormData, WizardBadge } from './wizard-types';

interface MobileTimelineProps {
  /** 현재 스텝 / Current step */
  currentStep: number;
  /** 완료된 스텝 Set / Completed steps set */
  completedSteps: Set<number>;
  /** 폼 데이터 / Form data */
  formData: WizardFormData;
  /** 스텝 클릭 핸들러 / Step click handler */
  onStepClick: (step: number) => void;
  /** 뱃지 목록 / Badge list */
  badges: WizardBadge[];
  /** 전체 진행률 % / Overall progress percentage */
  progress: number;
}

export default function MobileTimeline({
  currentStep,
  completedSteps,
  formData,
  onStepClick,
  badges,
  progress,
}: MobileTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentStepData = WIZARD_STEPS[currentStep];

  return (
    <div className="lg:hidden bg-white border-b border-gray-200">
      {/* 접힌 상태: 현재 스텝 + 진행 표시 / Collapsed: current step + progress */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 min-h-[56px]"
        aria-expanded={isExpanded}
        aria-controls="mobile-timeline-content"
        aria-label={`Step ${currentStep}: ${currentStepData?.label ?? ''} (${isExpanded ? '접기' : '펼치기'})`}
      >
        <div className="flex items-center gap-3">
          {/* 현재 스텝 숫자 / Current step number */}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{currentStep}</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">
              {currentStepData?.label ?? ''}
            </p>
            <p className="text-[11px] text-gray-500">
              {currentStep + 1} / {WIZARD_STEPS.length} 단계
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 진행률 미니 바 / Mini progress bar */}
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-blue-600 font-semibold">{progress}%</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* 펼친 상태: 전체 타임라인 / Expanded: full timeline */}
      {isExpanded && (
        <div
          id="mobile-timeline-content"
          className="px-4 pb-4 border-t border-gray-100"
        >
          {/* 수평 스텝 표시 / Horizontal step indicators */}
          <div className="flex items-center gap-1 py-3 overflow-x-auto">
            {WIZARD_STEPS.map((step, idx) => {
              const isCompleted = completedSteps.has(step.index);
              const isCurrent = step.index === currentStep;
              const isClickable = isCompleted;

              return (
                <button
                  key={step.index}
                  type="button"
                  onClick={() => {
                    if (isClickable) {
                      onStepClick(step.index);
                      setIsExpanded(false);
                    }
                  }}
                  disabled={!isClickable && !isCurrent}
                  className={cn(
                    'flex flex-col items-center gap-1 min-w-[64px] py-2 px-1 rounded-lg transition-colors',
                    'min-h-[44px]',
                    isCompleted && 'hover:bg-green-50 cursor-pointer',
                    isCurrent && 'bg-blue-50',
                    !isCompleted && !isCurrent && 'opacity-50'
                  )}
                  aria-label={`Step ${step.index}: ${step.label}`}
                >
                  {/* 노드 원 / Node circle */}
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-blue-200">
                      <span className="text-white text-[10px] font-bold">{step.index}</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
                      <span className="text-gray-400 text-[10px]">{step.index}</span>
                    </div>
                  )}

                  {/* 라벨 / Label */}
                  <span
                    className={cn(
                      'text-[10px] leading-tight text-center',
                      isCompleted && 'text-green-700 font-medium',
                      isCurrent && 'text-blue-700 font-semibold',
                      !isCompleted && !isCurrent && 'text-gray-400'
                    )}
                  >
                    {step.label}
                  </span>

                  {/* 요약 / Summary */}
                  {isCompleted && (
                    <span className="text-[9px] text-gray-400 truncate max-w-[60px]">
                      {getStepSummary(step.index, formData) ?? ''}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 뱃지 / Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
              {badges.map((badge) => (
                <span
                  key={badge.id}
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border',
                    badge.color === 'green' && 'bg-green-50 text-green-700 border-green-200',
                    badge.color === 'amber' && 'bg-amber-50 text-amber-700 border-amber-200',
                    badge.color === 'blue' && 'bg-blue-50 text-blue-700 border-blue-200',
                    badge.color === 'gray' && 'bg-gray-50 text-gray-400 border-gray-200'
                  )}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
