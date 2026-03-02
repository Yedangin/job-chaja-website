'use client';

/**
 * 빈 상태 컴포넌트 / Empty state component
 * 데이터가 없을 때 안내 메시지 + CTA 버튼 표시 (spec 12 §1-1)
 * Shows guidance message + CTA button when no data exists
 */

import Link from 'next/link';
import {
  Inbox,
  Search,
  FileText,
  Bell,
  Briefcase,
  Users,
  type LucideIcon,
} from 'lucide-react';

/* ─── 프리셋 아이콘 매핑 / Preset icon mapping ─── */
const PRESET_ICONS: Record<string, LucideIcon> = {
  inbox: Inbox,
  search: Search,
  document: FileText,
  notification: Bell,
  job: Briefcase,
  talent: Users,
};

interface EmptyStateProps {
  /** 아이콘 프리셋 이름 또는 커스텀 아이콘 / Preset name or custom icon */
  icon?: keyof typeof PRESET_ICONS | LucideIcon;
  /** 제목 / Title */
  title: string;
  /** 설명 문구 / Description */
  description?: string;
  /** CTA 버튼 텍스트 / CTA button label */
  actionLabel?: string;
  /** CTA 링크 (Link) 또는 onClick / CTA link or click handler */
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const Icon =
    typeof icon === 'string' ? PRESET_ICONS[icon] || Inbox : icon;

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className || ''}`}
    >
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>

      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>

      {description && (
        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && (actionHref || onAction) && (
        <div className="mt-5">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
