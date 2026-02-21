'use client';

/**
 * TimelineNode — 세로 타임라인의 개별 노드 컴포넌트
 * TimelineNode — Individual node component for vertical timeline
 *
 * 상태: completed(체크+green), current(pulse+blue), future(gray dot)
 * States: completed(check+green), current(pulse+blue), future(gray dot)
 */

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/** 노드 상태 타입 / Node state type */
type NodeStatus = 'completed' | 'current' | 'future';

interface TimelineNodeProps {
  /** 스텝 인덱스 / Step index */
  stepIndex: number;
  /** 스텝 라벨 / Step label */
  label: string;
  /** 노드 상태 / Node state */
  status: NodeStatus;
  /** 마지막 노드 여부 / Is last node */
  isLast: boolean;
  /** 클릭 핸들러 (완료된 스텝만 클릭 가능) / Click handler (only completed steps) */
  onClick?: () => void;
  /** 요약 텍스트 (완료 시 표시) / Summary text (shown when completed) */
  summary?: string;
}

export default function TimelineNode({
  stepIndex,
  label,
  status,
  isLast,
  onClick,
  summary,
}: TimelineNodeProps) {
  const isClickable = status === 'completed';

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 group',
        isClickable && 'cursor-pointer'
      )}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      aria-label={`Step ${stepIndex}: ${label} (${status === 'completed' ? '완료' : status === 'current' ? '현재' : '미래'})`}
    >
      {/* 세로 연결선 / Vertical connector line */}
      {!isLast && (
        <div
          className={cn(
            'absolute left-[15px] top-[32px] w-0.5 bottom-0',
            status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
          )}
          aria-hidden="true"
        />
      )}

      {/* 노드 원 / Node circle */}
      <div className="relative z-10 flex-shrink-0">
        {status === 'completed' ? (
          /* 완료: 초록 체크 / Completed: green check */
          <div
            className={cn(
              'w-[30px] h-[30px] rounded-full bg-green-500 flex items-center justify-center',
              'shadow-sm transition-transform',
              'group-hover:scale-110'
            )}
          >
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        ) : status === 'current' ? (
          /* 현재: 파란 펄스 / Current: blue pulse */
          <div className="relative">
            <div className="absolute inset-0 w-[30px] h-[30px] rounded-full bg-blue-400 animate-ping opacity-30" />
            <div
              className={cn(
                'relative w-[30px] h-[30px] rounded-full bg-blue-600 flex items-center justify-center',
                'shadow-md ring-4 ring-blue-100'
              )}
            >
              <span className="text-white text-xs font-bold">{stepIndex}</span>
            </div>
          </div>
        ) : (
          /* 미래: 회색 점 / Future: gray dot */
          <div
            className={cn(
              'w-[30px] h-[30px] rounded-full bg-gray-100 border-2 border-gray-300',
              'flex items-center justify-center'
            )}
          >
            <span className="text-gray-400 text-xs font-medium">{stepIndex}</span>
          </div>
        )}
      </div>

      {/* 라벨 + 요약 / Label + Summary */}
      <div className="flex-1 min-w-0 pb-6">
        <span
          className={cn(
            'block text-sm font-medium leading-[30px]',
            status === 'completed' && 'text-green-700 group-hover:text-green-800',
            status === 'current' && 'text-blue-700 font-semibold',
            status === 'future' && 'text-gray-400'
          )}
        >
          {label}
        </span>

        {/* 완료 요약 미리보기 / Completed summary preview */}
        {status === 'completed' && summary && (
          <span className="block text-xs text-gray-500 mt-0.5 truncate group-hover:text-gray-600 transition-colors">
            {summary}
          </span>
        )}

        {/* 현재 진행 표시 / Current step indicator */}
        {status === 'current' && (
          <span className="block text-[11px] text-blue-500 mt-0.5">
            작성 중... / In progress...
          </span>
        )}
      </div>
    </div>
  );
}
