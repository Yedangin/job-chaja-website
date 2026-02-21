'use client';

import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Lock } from 'lucide-react';
import type { WizardBadge, BadgeStatus } from './wizard-types';

/**
 * 뱃지 행 컴포넌트 / Badge row component
 * 5개 뱃지를 가로로 나열. 각 뱃지의 상태(획득/진행중/잠김) 표시.
 * Displays 5 badges horizontally. Shows each badge's status (earned/in_progress/locked).
 */

interface BadgeRowProps {
  badges: WizardBadge[];
  className?: string;
}

/** 뱃지 상태별 색상 맵 / Badge status-based color map */
const BADGE_COLOR_MAP: Record<string, Record<BadgeStatus, {
  bg: string;
  border: string;
  text: string;
  icon: string;
}>> = {
  green: {
    earned: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700', icon: 'text-green-600' },
    in_progress: { bg: 'bg-green-50', border: 'border-green-200 border-dashed', text: 'text-green-500', icon: 'text-green-400' },
    locked: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-400', icon: 'text-gray-300' },
  },
  blue: {
    earned: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700', icon: 'text-blue-600' },
    in_progress: { bg: 'bg-blue-50', border: 'border-blue-200 border-dashed', text: 'text-blue-500', icon: 'text-blue-400' },
    locked: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-400', icon: 'text-gray-300' },
  },
  purple: {
    earned: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700', icon: 'text-purple-600' },
    in_progress: { bg: 'bg-purple-50', border: 'border-purple-200 border-dashed', text: 'text-purple-500', icon: 'text-purple-400' },
    locked: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-400', icon: 'text-gray-300' },
  },
  amber: {
    earned: { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700', icon: 'text-amber-600' },
    in_progress: { bg: 'bg-amber-50', border: 'border-amber-200 border-dashed', text: 'text-amber-500', icon: 'text-amber-400' },
    locked: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-400', icon: 'text-gray-300' },
  },
  rose: {
    earned: { bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-700', icon: 'text-rose-600' },
    in_progress: { bg: 'bg-rose-50', border: 'border-rose-200 border-dashed', text: 'text-rose-500', icon: 'text-rose-400' },
    locked: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-400', icon: 'text-gray-300' },
  },
};

/** 상태별 아이콘 / Status icon */
function StatusIcon({ status, className }: { status: BadgeStatus; className?: string }) {
  switch (status) {
    case 'earned':
      return <CheckCircle2 className={cn('w-3.5 h-3.5', className)} />;
    case 'in_progress':
      return <Clock className={cn('w-3.5 h-3.5', className)} />;
    case 'locked':
      return <Lock className={cn('w-3.5 h-3.5', className)} />;
  }
}

export default function BadgeRow({ badges, className }: BadgeRowProps) {
  return (
    <div
      className={cn('flex items-center gap-2 overflow-x-auto scrollbar-none py-1', className)}
      role="list"
      aria-label="프로필 뱃지 / Profile badges"
    >
      {badges.map((badge) => {
        const colorSet = BADGE_COLOR_MAP[badge.color]?.[badge.status]
          || BADGE_COLOR_MAP.green[badge.status];

        return (
          <div
            key={badge.type}
            role="listitem"
            className={cn(
              'flex flex-col items-center gap-1 min-w-[56px] shrink-0',
            )}
            aria-label={`${badge.label} (${badge.labelEn}) - ${
              badge.status === 'earned' ? '획득 / Earned' :
              badge.status === 'in_progress' ? '진행중 / In Progress' :
              '잠김 / Locked'
            }`}
          >
            {/* 뱃지 원형 아이콘 / Badge circle icon */}
            <div
              className={cn(
                'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all',
                colorSet.bg,
                colorSet.border,
                badge.status === 'earned' && 'shadow-sm',
              )}
            >
              <StatusIcon
                status={badge.status}
                className={colorSet.icon}
              />
            </div>

            {/* 뱃지 라벨 / Badge label */}
            <span
              className={cn(
                'text-[10px] font-medium leading-tight text-center',
                colorSet.text,
              )}
            >
              {badge.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
