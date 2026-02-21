'use client';

import { useState } from 'react';
import { Shield, ShieldCheck, ShieldAlert, ShieldX, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VisaEvalResult, MatchingSummary } from './alba-types';

/**
 * 비자 매칭 결과 배지 표시 컴포넌트
 * Visa matching result badge display component
 *
 * 카드 기반 시각적 표현 — eligible(초록), conditional(주황), blocked(빨강)
 * Card-based visual — eligible(green), conditional(amber), blocked(red)
 */

interface VisaMatchBadgesProps {
  eligible: VisaEvalResult[];
  conditional: VisaEvalResult[];
  blocked?: VisaEvalResult[];
  summary: MatchingSummary;
  showBlocked?: boolean;
  compact?: boolean;
}

export function VisaMatchBadges({
  eligible,
  conditional,
  blocked = [],
  summary,
  showBlocked = false,
  compact = false,
}: VisaMatchBadgesProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);

  const totalAllowed = summary.totalEligible + summary.totalConditional;

  return (
    <div className="space-y-3">
      {/* 요약 카드 / Summary card */}
      <div className="p-4 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {/* N개 비자 유형 지원 가능 / N visa types eligible */}
                {totalAllowed}개 비자 유형 지원 가능
              </p>
              <p className="text-xs text-gray-500">
                {totalAllowed} visa types can apply
              </p>
            </div>
          </div>
          {compact && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-white/50 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isExpanded ? '접기 / Collapse' : '펼치기 / Expand'}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          )}
        </div>

        {/* 숫자 요약 / Number summary */}
        <div className="flex gap-3 mt-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-green-700">
              {/* 가능 / Eligible */}
              가능 {summary.totalEligible}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 rounded-full">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-amber-700">
              {/* 조건부 / Conditional */}
              조건부 {summary.totalConditional}
            </span>
          </div>
          {showBlocked && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 rounded-full">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-semibold text-red-700">
                {/* 불가 / Blocked */}
                불가 {summary.totalBlocked}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 상세 비자 목록 / Detailed visa list */}
      {isExpanded && (
        <div className="space-y-2">
          {/* 가능 비자 (Eligible) */}
          {eligible.map((visa) => (
            <VisaResultCard key={visa.visaCode} visa={visa} />
          ))}

          {/* 조건부 비자 (Conditional) */}
          {conditional.map((visa) => (
            <VisaResultCard key={visa.visaCode} visa={visa} />
          ))}

          {/* 불가 비자 (Blocked) — 기업에게는 기본 숨김 */}
          {showBlocked && blocked.map((visa) => (
            <VisaResultCard key={visa.visaCode} visa={visa} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 개별 비자 매칭 결과 카드 / Individual visa matching result card
 */
function VisaResultCard({ visa }: { visa: VisaEvalResult }) {
  const [showDetails, setShowDetails] = useState(false);

  const config = {
    eligible: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      dot: 'bg-green-500',
      icon: <ShieldCheck className="w-4 h-4 text-green-600" />,
      label: '가능',
      labelEn: 'Eligible',
      textColor: 'text-green-700',
    },
    conditional: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      icon: <ShieldAlert className="w-4 h-4 text-amber-600" />,
      label: '조건부',
      labelEn: 'Conditional',
      textColor: 'text-amber-700',
    },
    blocked: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      dot: 'bg-red-500',
      icon: <ShieldX className="w-4 h-4 text-red-600" />,
      label: '불가',
      labelEn: 'Blocked',
      textColor: 'text-red-700',
    },
  }[visa.status];

  const hasDetails =
    (visa.conditions && visa.conditions.length > 0) ||
    (visa.blockReasons && visa.blockReasons.length > 0) ||
    visa.notes ||
    visa.requiredPermit;

  return (
    <div className={cn('rounded-xl border p-3', config.bg, config.border)}>
      <div className="flex items-center gap-3">
        {/* 비자 아이콘 / Visa icon */}
        {config.icon}

        {/* 비자 정보 / Visa info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">{visa.visaCode}</span>
            <span className="text-sm text-gray-600">{visa.visaName}</span>
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', config.bg, config.textColor)}>
              {config.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 truncate">{visa.visaNameEn}</p>
        </div>

        {/* 상세보기 토글 / Details toggle */}
        {hasDetails && (
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-1.5 rounded-lg hover:bg-white/50 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={showDetails ? '상세 접기 / Hide details' : '상세 보기 / Show details'}
          >
            <Info className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* 상세 내용 / Details */}
      {showDetails && hasDetails && (
        <div className="mt-2 pt-2 border-t border-gray-100 space-y-1.5">
          {/* 조건 목록 / Conditions */}
          {visa.conditions?.map((cond, i) => (
            <p key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
              <span className="text-amber-400 mt-0.5">&#8226;</span>
              {cond}
            </p>
          ))}

          {/* 차단 사유 / Block reasons */}
          {visa.blockReasons?.map((reason, i) => (
            <p key={i} className="text-xs text-red-700 flex items-start gap-1.5">
              <span className="text-red-400 mt-0.5">&#8226;</span>
              {reason}
            </p>
          ))}

          {/* 필요 허가 / Required permit */}
          {visa.requiredPermit && (
            <p className="text-xs text-gray-600 flex items-start gap-1.5">
              <Shield className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
              {/* 필요 허가: / Required permit: */}
              필요 허가: {visa.requiredPermit}
            </p>
          )}

          {/* 참고사항 / Notes */}
          {visa.notes && (
            <p className="text-xs text-gray-500 italic">{visa.notes}</p>
          )}

          {/* 시간 / 사업장 제한 / Hour/workplace limits */}
          {(visa.maxWeeklyHours || visa.maxWorkplaces) && (
            <div className="flex gap-3 mt-1">
              {visa.maxWeeklyHours && (
                <span className="text-xs text-gray-500">
                  {/* 최대 주 Nh / Max N hrs/week */}
                  최대 주 {visa.maxWeeklyHours}h
                </span>
              )}
              {visa.maxWorkplaces && (
                <span className="text-xs text-gray-500">
                  {/* 사업장 N개 / N workplaces */}
                  사업장 {visa.maxWorkplaces}개
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 인라인 비자 배지 (카드 목록용)
 * Inline visa badge for card listings
 */
export function VisaBadgeInline({
  status,
  visaCode,
  label,
}: {
  status: 'eligible' | 'conditional' | 'blocked';
  visaCode?: string;
  label?: string;
}) {
  const config = {
    eligible: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      dot: 'bg-green-500',
    },
    conditional: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
    },
    blocked: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      dot: 'bg-red-500',
    },
  }[status];

  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium', config.bg, config.text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {visaCode && <span>{visaCode}</span>}
      {label && <span>{label}</span>}
    </span>
  );
}
