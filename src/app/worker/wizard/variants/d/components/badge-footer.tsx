'use client';

/**
 * BadgeFooter — 타임라인 하단 뱃지 영역
 * BadgeFooter — Badge area at the bottom of the timeline
 *
 * 위저드 진행에 따라 획득한 뱃지를 가로로 배치
 * Displays earned badges horizontally based on wizard progress
 */

import { cn } from '@/lib/utils';
import { Shield, Award, Star, CheckCircle } from 'lucide-react';
import type { WizardBadge } from './wizard-types';

interface BadgeFooterProps {
  /** 뱃지 목록 / Badge list */
  badges: WizardBadge[];
}

/** 뱃지 색상별 스타일 / Badge color styles */
const BADGE_STYLES: Record<WizardBadge['color'], string> = {
  green: 'bg-green-50 text-green-700 border-green-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  gray: 'bg-gray-50 text-gray-400 border-gray-200',
};

/** 뱃지 아이콘 매핑 / Badge icon mapping */
function BadgeIcon({ badgeId, className }: { badgeId: string; className?: string }) {
  switch (badgeId) {
    case 'visa_verified':
      return <Shield className={className} />;
    case 'profile_complete':
      return <CheckCircle className={className} />;
    case 'delta_scored':
      return <Award className={className} />;
    default:
      return <Star className={className} />;
  }
}

export default function BadgeFooter({ badges }: BadgeFooterProps) {
  if (badges.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      {/* 섹션 제목 / Section title */}
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Badges
      </p>

      {/* 뱃지 그리드 / Badge grid */}
      <div className="flex flex-wrap gap-1.5">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-medium',
              'transition-colors',
              BADGE_STYLES[badge.color]
            )}
            title={badge.label}
          >
            <BadgeIcon badgeId={badge.id} className="w-3 h-3" />
            <span className="truncate max-w-[60px]">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
