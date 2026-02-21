'use client';

import { cn } from '@/lib/utils';
import { Check, AlertTriangle, X, ChevronDown, ChevronUp, Shield, Info } from 'lucide-react';
import { useState } from 'react';
import type { VisaEvalResult, VisaMatchingResponse } from '../alba-types';

/**
 * 비자 매칭 결과 표시 컴포넌트 (코드/모노스페이스 스타일)
 * Visa matching result display component (code/monospace style)
 *
 * eligible=green, conditional=amber, blocked=red 색상 체계
 * Color scheme: eligible=green, conditional=amber, blocked=red
 */

interface VisaMatchDisplayProps {
  matchResult: VisaMatchingResponse | null;
  isLoading?: boolean;
  compact?: boolean;
}

export function VisaMatchDisplay({ matchResult, isLoading, compact }: VisaMatchDisplayProps) {
  const [showBlocked, setShowBlocked] = useState(false);

  // 로딩 상태 / Loading state
  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded p-4 animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  // 데이터 없음 상태 / Empty state
  if (!matchResult) {
    return (
      <div className="border border-gray-200 rounded p-6 text-center">
        <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          비자 매칭 결과가 없습니다. 공고 정보를 입력하면 자동으로 매칭됩니다.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          No visa matching results. Fill in job details to auto-match.
        </p>
      </div>
    );
  }

  const { eligible, conditional, blocked, summary } = matchResult;
  const totalAllowed = summary.totalEligible + summary.totalConditional;

  return (
    <div className="space-y-4">
      {/* 요약 헤더 / Summary header */}
      <div className="flex items-center justify-between px-3 py-3 bg-gray-50 border border-gray-200 rounded">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-gray-900">
            비자 매칭 결과 / Visa Matching
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-emerald-600">{summary.totalEligible} eligible</span>
          <span className="text-amber-600">{summary.totalConditional} conditional</span>
          <span className="text-gray-400">{summary.totalBlocked} blocked</span>
        </div>
      </div>

      {/* 허용 비자 수 안내 / Allowed visa count info */}
      <div className="flex items-start gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded">
        <Info className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
        <p className="text-sm text-emerald-800">
          <span className="font-semibold font-mono">{totalAllowed}개</span> 비자 유형의 구직자가 지원 가능합니다.
          <span className="text-emerald-600 text-xs ml-1">
            {totalAllowed} visa types can apply
          </span>
        </p>
      </div>

      {/* 비자 목록 (코드 블록 스타일) / Visa list (code block style) */}
      <div className="border border-gray-200 rounded overflow-hidden">
        {/* Eligible 비자 / Eligible visas */}
        {eligible.map((visa) => (
          <VisaResultRow key={visa.visaCode} visa={visa} compact={compact} />
        ))}

        {/* Conditional 비자 / Conditional visas */}
        {conditional.map((visa) => (
          <VisaResultRow key={visa.visaCode} visa={visa} compact={compact} />
        ))}

        {/* Blocked 비자 토글 / Blocked visas toggle */}
        {blocked.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setShowBlocked(!showBlocked)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 hover:bg-gray-100 transition-colors"
              aria-expanded={showBlocked}
              aria-label={`불가 비자 ${blocked.length}개 ${showBlocked ? '숨기기' : '보기'} / ${showBlocked ? 'Hide' : 'Show'} ${blocked.length} blocked visas`}
            >
              <span>
                불가 비자 {blocked.length}개 / {blocked.length} blocked
              </span>
              {showBlocked ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showBlocked && blocked.map((visa) => (
              <VisaResultRow key={visa.visaCode} visa={visa} compact={compact} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── 비자 결과 행 / Visa result row ───

interface VisaResultRowProps {
  visa: VisaEvalResult;
  compact?: boolean;
}

function VisaResultRow({ visa, compact }: VisaResultRowProps) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = (visa.conditions && visa.conditions.length > 0)
    || (visa.blockReasons && visa.blockReasons.length > 0)
    || visa.notes
    || visa.requiredPermit;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-2.5',
          hasDetails && !compact && 'cursor-pointer hover:bg-gray-50',
        )}
        onClick={() => hasDetails && !compact && setExpanded(!expanded)}
        role={hasDetails && !compact ? 'button' : undefined}
        tabIndex={hasDetails && !compact ? 0 : undefined}
        onKeyDown={(e) => {
          if (hasDetails && !compact && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
        aria-expanded={hasDetails && !compact ? expanded : undefined}
        aria-label={`${visa.visaCode} ${visa.visaName} - ${visa.status}`}
      >
        {/* 상태 아이콘 / Status icon */}
        <StatusDot status={visa.status} />

        {/* 비자 코드 (모노스페이스) / Visa code (monospace) */}
        <span className={cn(
          'font-mono text-sm font-semibold w-10',
          visa.status === 'eligible' && 'text-emerald-700',
          visa.status === 'conditional' && 'text-amber-700',
          visa.status === 'blocked' && 'text-red-500',
        )}>
          {visa.visaCode}
        </span>

        {/* 비자명 / Visa name */}
        <span className="text-sm text-gray-700 flex-1">
          {visa.visaName}
          <span className="text-gray-400 text-xs ml-1.5">{visa.visaNameEn}</span>
        </span>

        {/* 시간 제한 / Hour limit */}
        {visa.maxWeeklyHours && (
          <span className="text-xs font-mono text-gray-400">
            max {visa.maxWeeklyHours}h/w
          </span>
        )}

        {/* 펼침 아이콘 / Expand icon */}
        {hasDetails && !compact && (
          <ChevronDown className={cn(
            'w-3.5 h-3.5 text-gray-400 transition-transform',
            expanded && 'rotate-180',
          )} />
        )}
      </div>

      {/* 상세 영역 / Detail area */}
      {expanded && hasDetails && (
        <div className="px-3 pb-3 pl-12 space-y-1.5">
          {/* 조건 목록 / Conditions */}
          {visa.conditions?.map((condition, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700">
              <span className="text-amber-500 shrink-0 mt-0.5">--</span>
              <span>{condition}</span>
            </div>
          ))}

          {/* 차단 사유 / Block reasons */}
          {visa.blockReasons?.map((reason, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-red-600">
              <span className="text-red-400 shrink-0 mt-0.5">--</span>
              <span>{reason}</span>
            </div>
          ))}

          {/* 필요 허가 / Required permit */}
          {visa.requiredPermit && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">
                permit
              </span>
              <span>{visa.requiredPermit}</span>
            </div>
          )}

          {/* 참고사항 / Notes */}
          {visa.notes && (
            <div className="text-xs text-gray-500 italic mt-1">
              {visa.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── 상태 도트 / Status dot ───

function StatusDot({ status }: { status: string }) {
  return (
    <span className={cn(
      'flex items-center justify-center w-5 h-5 rounded',
      status === 'eligible' && 'bg-emerald-100 text-emerald-600',
      status === 'conditional' && 'bg-amber-100 text-amber-600',
      status === 'blocked' && 'bg-red-100 text-red-500',
    )}>
      {status === 'eligible' && <Check className="w-3 h-3" />}
      {status === 'conditional' && <AlertTriangle className="w-3 h-3" />}
      {status === 'blocked' && <X className="w-3 h-3" />}
    </span>
  );
}
