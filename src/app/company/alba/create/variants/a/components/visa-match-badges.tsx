'use client';

import { cn } from '@/lib/utils';
import { Check, AlertTriangle, XCircle, Info, Shield } from 'lucide-react';
import type { VisaEvalResult, AlbaVisaMatchingResponse } from '../types';

/**
 * 비자 매칭 결과 배지 표시 (미니멀 스타일)
 * Visa matching result badges (minimal style)
 *
 * 초록(eligible), 노란(conditional), 빨간(blocked) 3단계
 * Green(eligible), amber(conditional), red(blocked) 3-tier
 */

interface VisaMatchBadgesProps {
  matchResult: AlbaVisaMatchingResponse | null;
  isLoading?: boolean;
  showBlocked?: boolean;
  compact?: boolean;
}

/** 개별 비자 배지 / Individual visa badge */
function VisaBadge({ visa, compact }: { visa: VisaEvalResult; compact?: boolean }) {
  const statusConfig = {
    eligible: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      dot: 'bg-green-500',
      icon: <Check className="w-3.5 h-3.5" />,
      label: '가능',
    },
    conditional: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      label: '조건부',
    },
    blocked: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      dot: 'bg-red-500',
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: '불가',
    },
  };

  const config = statusConfig[visa.status];

  if (compact) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border',
          config.bg,
          config.border,
          config.text,
        )}
        aria-label={`${visa.visaCode} ${visa.visaName} - ${config.label}`}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
        {visa.visaCode}
      </span>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border p-4 transition-all duration-200',
        config.bg,
        config.border,
      )}
      role="listitem"
      aria-label={`${visa.visaCode} ${visa.visaName} - ${config.label}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={cn('flex items-center justify-center w-8 h-8 rounded-full', config.bg, config.text)}>
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn('font-semibold text-sm', config.text)}>
                {visa.visaCode}
              </span>
              <span className="text-sm text-gray-600">{visa.visaName}</span>
              <span className="text-xs text-gray-400">{visa.visaNameEn}</span>
            </div>
            {/* 조건 표시 / Display conditions */}
            {visa.conditions && visa.conditions.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {visa.conditions.map((cond, i) => (
                  <li key={i} className="text-xs text-amber-600 flex items-start gap-1">
                    <span className="mt-0.5 shrink-0">-</span>
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            )}
            {/* 불가 사유 / Block reasons */}
            {visa.blockReasons && visa.blockReasons.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {visa.blockReasons.map((reason, i) => (
                  <li key={i} className="text-xs text-red-600 flex items-start gap-1">
                    <span className="mt-0.5 shrink-0">-</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            )}
            {/* 참고사항 / Notes */}
            {visa.notes && (
              <p className="text-xs text-gray-500 mt-1">{visa.notes}</p>
            )}
          </div>
        </div>

        {/* 시간/사업장 제한 배지 / Hour/workplace limit badges */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          {visa.maxWeeklyHours !== null && visa.maxWeeklyHours !== undefined && (
            <span className="text-[10px] bg-white/60 px-2 py-0.5 rounded-full text-gray-600">
              주 {visa.maxWeeklyHours}h
            </span>
          )}
          {visa.maxWorkplaces !== null && visa.maxWorkplaces !== undefined && (
            <span className="text-[10px] bg-white/60 px-2 py-0.5 rounded-full text-gray-600">
              {visa.maxWorkplaces}개소
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** 스켈레톤 로딩 / Skeleton loading */
function MatchingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="h-4 w-48 bg-gray-200 rounded-lg" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-2xl" />
      ))}
    </div>
  );
}

export function VisaMatchBadges({
  matchResult,
  isLoading = false,
  showBlocked = false,
  compact = false,
}: VisaMatchBadgesProps) {
  if (isLoading) {
    return <MatchingSkeleton />;
  }

  if (!matchResult) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Shield className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">
          비자 매칭 결과가 없습니다
          <br />
          <span className="text-gray-400">No visa matching results available</span>
        </p>
      </div>
    );
  }

  const { eligible, conditional, blocked, summary } = matchResult;
  const totalMatchable = summary.totalEligible + summary.totalConditional;

  if (compact) {
    return (
      <div className="space-y-3">
        {/* 요약 / Summary */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {totalMatchable}개 비자 유형
          </span>
          <span className="text-sm text-gray-500">지원 가능</span>
        </div>

        {/* 배지 목록 / Badge list */}
        <div className="flex flex-wrap gap-2">
          {eligible.map((v) => (
            <VisaBadge key={v.visaCode} visa={v} compact />
          ))}
          {conditional.map((v) => (
            <VisaBadge key={v.visaCode} visa={v} compact />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 요약 배너 / Summary banner */}
      <div className="bg-blue-50 rounded-2xl px-5 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full shrink-0">
          <Shield className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-900">
            {totalMatchable}개 비자 유형의 구직자가 지원 가능합니다
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            {summary.totalEligible} eligible + {summary.totalConditional} conditional
          </p>
        </div>
      </div>

      {/* 가능 비자 / Eligible visas */}
      {eligible.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <h4 className="text-sm font-semibold text-gray-800">
              지원 가능 <span className="text-gray-400 font-normal">/ Eligible ({eligible.length})</span>
            </h4>
          </div>
          <div className="space-y-2" role="list" aria-label="지원 가능 비자 목록 / Eligible visas">
            {eligible.map((v) => (
              <VisaBadge key={v.visaCode} visa={v} />
            ))}
          </div>
        </div>
      )}

      {/* 조건부 비자 / Conditional visas */}
      {conditional.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <h4 className="text-sm font-semibold text-gray-800">
              조건부 가능 <span className="text-gray-400 font-normal">/ Conditional ({conditional.length})</span>
            </h4>
          </div>
          <div className="space-y-2" role="list" aria-label="조건부 가능 비자 목록 / Conditional visas">
            {conditional.map((v) => (
              <VisaBadge key={v.visaCode} visa={v} />
            ))}
          </div>
        </div>
      )}

      {/* 불가 비자 (옵션) / Blocked visas (optional) */}
      {showBlocked && blocked.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <h4 className="text-sm font-semibold text-gray-800">
              지원 불가 <span className="text-gray-400 font-normal">/ Blocked ({blocked.length})</span>
            </h4>
          </div>
          <div className="space-y-2" role="list" aria-label="지원 불가 비자 목록 / Blocked visas">
            {blocked.map((v) => (
              <VisaBadge key={v.visaCode} visa={v} />
            ))}
          </div>
        </div>
      )}

      {/* 안내 / Notice */}
      <div className="flex items-start gap-2 text-xs text-gray-400 px-1">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <p>
          비자 매칭 결과는 공고 조건 기반 자동 판별이며, 실제 고용 시 개별 확인이 필요할 수 있습니다.
          <br />
          Visa matching is auto-determined based on job conditions. Individual verification may be needed for actual employment.
        </p>
      </div>
    </div>
  );
}
