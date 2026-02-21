'use client';

/**
 * 완성도 요약 + 뱃지 시스템 / Completion summary + badge system
 * 100% 완료 시 또는 현재 완성도 확인용 오버레이/섹션
 * Overlay/section for checking current completion or 100% complete state
 */

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Lock,
  Clock,
  Shield,
  GraduationCap,
  Languages,
  Briefcase,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { BadgeStatus } from '../types';
import type { WizardCompletion, BadgeInfo } from '../types';
import { BADGES } from '../mock-data';

interface CompletionSummaryProps {
  /** 완성도 데이터 / Completion data */
  completion: WizardCompletion;
  /** 뱃지 목록 (상태 포함) / Badge list with status */
  badges: BadgeInfo[];
  /** Step 이동 핸들러 / Step navigation handler */
  onGoToStep: (step: number) => void;
  /** 대시보드로 이동 / Navigate to dashboard */
  onGoToDashboard: () => void;
}

/** 뱃지 아이콘 매핑 / Badge icon mapping */
const BADGE_ICONS: Record<string, typeof Shield> = {
  profile: CheckCircle,
  identity: Shield,
  education: GraduationCap,
  korean: Languages,
  employable: Briefcase,
};

/** 뱃지 상태 아이콘 / Badge status icon */
function BadgeStatusIcon({ status }: { status: BadgeStatus }) {
  switch (status) {
    case BadgeStatus.VERIFIED:
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case BadgeStatus.PENDING:
      return <Clock className="w-4 h-4 text-amber-500" />;
    case BadgeStatus.LOCKED:
      return <Lock className="w-4 h-4 text-gray-400" />;
    default:
      return null;
  }
}

/** 뱃지 상태 텍스트 / Badge status text */
function badgeStatusText(status: BadgeStatus): { ko: string; en: string } {
  switch (status) {
    case BadgeStatus.VERIFIED:
      return { ko: '인증 완료', en: 'Verified' };
    case BadgeStatus.PENDING:
      return { ko: '심사 중', en: 'Pending' };
    case BadgeStatus.LOCKED:
      return { ko: '미완료', en: 'Locked' };
    default:
      return { ko: '', en: '' };
  }
}

/** 원형 프로그레스 / Circular progress */
function CircularProgress({ percent }: { percent: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg
        className="w-full h-full -rotate-90"
        viewBox="0 0 120 120"
        role="img"
        aria-label={`완성도 ${percent}% / Completion ${percent}%`}
      >
        {/* 배경 원 / Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
        />
        {/* 진행 원 / Progress circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={percent >= 100 ? '#22C55E' : '#3B82F6'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* 중앙 텍스트 / Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn(
          'text-2xl font-bold',
          percent >= 100 ? 'text-green-600' : 'text-blue-600',
        )}>
          {percent}%
        </span>
        <span className="text-[10px] text-gray-400">완성도</span>
      </div>
    </div>
  );
}

export default function CompletionSummary({
  completion,
  badges,
  onGoToStep,
  onGoToDashboard,
}: CompletionSummaryProps) {
  const isComplete = completion.totalPercent >= 100;

  return (
    <div className="space-y-6 py-4">
      {/* 완성도 원형 그래프 / Completion circular chart */}
      <div className="flex flex-col items-center gap-4">
        <CircularProgress percent={completion.totalPercent} />
        {isComplete ? (
          <div className="text-center space-y-1">
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-gray-900">
                프로필 작성 완료!
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              Profile creation is complete!
            </p>
          </div>
        ) : (
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-gray-900">
              프로필 작성 진행 중
            </h3>
            <p className="text-sm text-gray-500">
              Profile creation in progress
            </p>
          </div>
        )}
      </div>

      {/* Step별 완성도 / Per-step completion */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 px-1">
          단계별 완성도 <span className="text-gray-400 font-normal">/ Step Completion</span>
        </h4>
        <div className="space-y-1.5">
          {completion.steps.map((step) => (
            <button
              key={step.step}
              type="button"
              onClick={() => onGoToStep(step.step)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all text-left"
            >
              {/* Step 완료 아이콘 / Step completion icon */}
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
                step.isComplete
                  ? 'bg-green-100 text-green-700'
                  : step.percent > 0
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-400',
              )}>
                {step.isComplete ? '✓' : step.step}
              </div>

              {/* Step 이름 + 바 / Step name + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 font-medium truncate">
                    {step.label}
                    <span className="text-gray-400 font-normal ml-1 text-xs">{step.labelEn}</span>
                  </span>
                  <span className={cn(
                    'text-xs font-medium',
                    step.isComplete ? 'text-green-600' : 'text-gray-400',
                  )}>
                    {step.percent}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      step.isComplete ? 'bg-green-400' : 'bg-blue-400',
                    )}
                    style={{ width: `${step.percent}%` }}
                  />
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* 뱃지 시스템 / Badge system */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 px-1">
          인증 뱃지 <span className="text-gray-400 font-normal">/ Verification Badges</span>
        </h4>
        <div className="space-y-2">
          {badges.map((badge) => {
            const Icon = BADGE_ICONS[badge.id] || Shield;
            const statusText = badgeStatusText(badge.status);

            return (
              <div
                key={badge.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border transition-all',
                  badge.status === BadgeStatus.VERIFIED
                    ? `${badge.bgColor} ${badge.borderColor}`
                    : badge.status === BadgeStatus.PENDING
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-gray-50 border-gray-200',
                )}
              >
                {/* 뱃지 아이콘 / Badge icon */}
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  badge.status === BadgeStatus.VERIFIED
                    ? badge.bgColor
                    : badge.status === BadgeStatus.PENDING
                      ? 'bg-amber-100'
                      : 'bg-gray-100',
                )}>
                  <Icon className={cn(
                    'w-5 h-5',
                    badge.status === BadgeStatus.VERIFIED
                      ? badge.color
                      : badge.status === BadgeStatus.PENDING
                        ? 'text-amber-500'
                        : 'text-gray-400',
                  )} />
                </div>

                {/* 뱃지 정보 / Badge info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-sm font-medium',
                      badge.status === BadgeStatus.LOCKED ? 'text-gray-500' : 'text-gray-700',
                    )}>
                      {badge.label}
                    </span>
                    <span className="text-xs text-gray-400">{badge.labelEn}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {badge.description}
                  </p>
                </div>

                {/* 상태 / Status */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <BadgeStatusIcon status={badge.status} />
                  <span className={cn(
                    'text-xs font-medium',
                    badge.status === BadgeStatus.VERIFIED ? 'text-green-600' :
                    badge.status === BadgeStatus.PENDING ? 'text-amber-600' :
                    'text-gray-400',
                  )}>
                    {statusText.ko}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 대시보드 이동 버튼 / Go to dashboard button */}
      {isComplete && (
        <div className="pt-2">
          <Button
            type="button"
            onClick={onGoToDashboard}
            className="w-full min-h-[52px] rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          >
            대시보드로 이동 / Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
