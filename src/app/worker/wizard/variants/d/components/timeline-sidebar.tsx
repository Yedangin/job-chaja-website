'use client';

/**
 * TimelineSidebar — 좌측 세로 타임라인 사이드바 (데스크탑)
 * TimelineSidebar — Left vertical timeline sidebar (desktop)
 *
 * 노드 + 요약 미리보기 + 하단 뱃지로 구성
 * Composed of nodes + summary preview + bottom badges
 */

import { cn } from '@/lib/utils';
import TimelineNode from './timeline-node';
import BadgeFooter from './badge-footer';
import { getStepSummary } from './step-summary';
import { WIZARD_STEPS } from './wizard-types';
import type { WizardFormData, WizardBadge } from './wizard-types';

interface TimelineSidebarProps {
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

export default function TimelineSidebar({
  currentStep,
  completedSteps,
  formData,
  onStepClick,
  badges,
  progress,
}: TimelineSidebarProps) {
  return (
    <aside
      className={cn(
        'hidden lg:flex lg:flex-col',
        'w-[280px] shrink-0',
        'bg-white border-r border-gray-200',
        'px-5 py-6',
        'sticky top-0 h-screen overflow-y-auto'
      )}
      aria-label="위저드 타임라인 / Wizard timeline"
    >
      {/* 헤더: 프로필 설정 / Header: Profile setup */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-1">
          프로필 설정
        </h2>
        <p className="text-xs text-gray-500">Profile Setup</p>

        {/* 진행률 바 / Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
            <span>진행률 / Progress</span>
            <span className="font-semibold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`진행률 ${progress}% / Progress ${progress}%`}
            />
          </div>
        </div>
      </div>

      {/* 타임라인 노드 목록 / Timeline node list */}
      <nav className="flex-1" aria-label="위저드 단계 / Wizard steps">
        {WIZARD_STEPS.map((step, idx) => {
          const status = completedSteps.has(step.index)
            ? 'completed'
            : step.index === currentStep
              ? 'current'
              : 'future';

          return (
            <TimelineNode
              key={step.index}
              stepIndex={step.index}
              label={step.label}
              status={status as 'completed' | 'current' | 'future'}
              isLast={idx === WIZARD_STEPS.length - 1}
              onClick={() => onStepClick(step.index)}
              summary={getStepSummary(step.index, formData)}
            />
          );
        })}
      </nav>

      {/* 하단 뱃지 / Bottom badges */}
      <BadgeFooter badges={badges} />
    </aside>
  );
}
