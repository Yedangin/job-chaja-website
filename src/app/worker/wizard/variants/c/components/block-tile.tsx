'use client';

import {
  UserCircle,
  Shield,
  Languages,
  GraduationCap,
  Zap,
  Briefcase,
  Settings,
  Lock,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WizardBlock, BlockStatus } from './wizard-types';

/**
 * 블록 타일 컴포넌트 / Block tile component
 * 각 위저드 블록(스텝)을 타일 카드로 표시.
 * Displays each wizard block (step) as a tile card.
 *
 * 상태별 색상:
 * - 미시작: gray / not_started: gray
 * - 진행중: blue / in_progress: blue
 * - 완료: green / completed: green
 * - 잠김: gray + 자물쇠 / locked: gray + lock icon
 */

interface BlockTileProps {
  block: WizardBlock;
  onClick: (block: WizardBlock) => void;
}

/** lucide 아이콘 매핑 / Map step key to lucide icon */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  UserCircle,
  Shield,
  Languages,
  GraduationCap,
  Zap,
  Briefcase,
  Settings,
};

/** 상태별 스타일 설정 / Status-based style config */
const STATUS_STYLES: Record<
  BlockStatus,
  {
    border: string;
    bg: string;
    iconBg: string;
    iconColor: string;
    text: string;
    label: string;
    labelEn: string;
    progressBg: string;
    progressFill: string;
  }
> = {
  completed: {
    border: 'border-green-200 hover:border-green-300',
    bg: 'bg-gradient-to-br from-green-50/80 to-white',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    text: 'text-green-700',
    label: '완료',
    labelEn: 'Done',
    progressBg: 'bg-green-100',
    progressFill: 'bg-green-500',
  },
  in_progress: {
    border: 'border-blue-200 hover:border-blue-300',
    bg: 'bg-gradient-to-br from-blue-50/80 to-white',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    text: 'text-blue-700',
    label: '진행중',
    labelEn: 'In Progress',
    progressBg: 'bg-blue-100',
    progressFill: 'bg-blue-500',
  },
  not_started: {
    border: 'border-gray-200 hover:border-gray-300',
    bg: 'bg-gradient-to-br from-gray-50/80 to-white',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-400',
    text: 'text-gray-500',
    label: '미시작',
    labelEn: 'Not Started',
    progressBg: 'bg-gray-100',
    progressFill: 'bg-gray-300',
  },
};

export default function BlockTile({ block, onClick }: BlockTileProps) {
  const IconComponent = ICON_MAP[block.icon] || UserCircle;
  const style = block.isLocked ? STATUS_STYLES.not_started : STATUS_STYLES[block.status];

  return (
    <button
      type="button"
      onClick={() => !block.isLocked && onClick(block)}
      disabled={block.isLocked}
      className={cn(
        'relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 w-full min-h-[140px]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2',
        block.isLocked
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
          : cn(style.border, style.bg, 'cursor-pointer hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-md')
      )}
      aria-label={`${block.name} (${block.nameEn}) - ${block.isLocked ? block.lockReason : style.label}`}
      aria-disabled={block.isLocked}
    >
      {/* 완료 체크 아이콘 / Completion check icon */}
      {block.status === 'completed' && !block.isLocked && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        </div>
      )}

      {/* 잠김 아이콘 / Lock icon */}
      {block.isLocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* 진행중 로더 / In-progress loader */}
      {block.status === 'in_progress' && !block.isLocked && (
        <div className="absolute top-2 right-2">
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        </div>
      )}

      {/* 아이콘 영역 / Icon area */}
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors',
          block.isLocked ? 'bg-gray-100' : style.iconBg
        )}
      >
        <IconComponent
          className={cn(
            'w-6 h-6 transition-colors',
            block.isLocked ? 'text-gray-300' : style.iconColor
          )}
        />
      </div>

      {/* 블록명 / Block name */}
      <span
        className={cn(
          'text-sm font-bold transition-colors',
          block.isLocked ? 'text-gray-400' : style.text
        )}
      >
        {block.name}
      </span>

      {/* 영문명 / English name */}
      <span className="text-[10px] text-gray-400 mt-0.5">
        {block.nameEn}
      </span>

      {/* 프로그레스 바 / Progress bar */}
      <div
        className={cn(
          'w-full h-1.5 rounded-full mt-auto',
          block.isLocked ? 'bg-gray-100' : style.progressBg
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            block.isLocked ? 'bg-gray-200' : style.progressFill
          )}
          style={{ width: `${block.isLocked ? 0 : block.completionPercent}%` }}
        />
      </div>

      {/* 완성도 텍스트 / Completion text */}
      <span
        className={cn(
          'text-[10px] mt-1 font-medium',
          block.isLocked ? 'text-gray-300' : style.text
        )}
      >
        {block.isLocked
          ? (block.lockReason || '잠김 / Locked')
          : block.completionPercent > 0
            ? `${block.completionPercent}%`
            : style.label
        }
      </span>
    </button>
  );
}
