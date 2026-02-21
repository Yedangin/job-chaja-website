'use client';

import type { AlbaVisaMatchingResponse, VisaEvalResult, VisaMatchStatus } from '../../../a/types';
import { ShieldCheck, ShieldAlert, ShieldX, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface VisaInsightChartProps {
  /** 비자 매칭 응답 데이터 / Visa matching response data */
  matchResult: AlbaVisaMatchingResponse;
}

/** 상태별 설정 / Status configuration */
const STATUS_CONFIG: Record<
  VisaMatchStatus,
  {
    label: string;
    labelEn: string;
    color: string;
    bgColor: string;
    strokeColor: string;
    icon: typeof ShieldCheck;
  }
> = {
  eligible: {
    label: '적합',
    labelEn: 'Eligible',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    strokeColor: '#22c55e',
    icon: ShieldCheck,
  },
  conditional: {
    label: '조건부',
    labelEn: 'Conditional',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    strokeColor: '#f59e0b',
    icon: ShieldAlert,
  },
  blocked: {
    label: '불가',
    labelEn: 'Blocked',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    strokeColor: '#ef4444',
    icon: ShieldX,
  },
};

/**
 * SVG 도넛 세그먼트 / SVG donut segment
 */
function DonutSegment({
  radius,
  strokeWidth,
  percentage,
  offset,
  color,
}: {
  radius: number;
  strokeWidth: number;
  percentage: number;
  offset: number;
  color: string;
}) {
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(circumference * percentage) / 100} ${circumference}`;
  const strokeDashoffset = -(circumference * offset) / 100;

  return (
    <circle
      cx="50"
      cy="50"
      r={radius}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      strokeDashoffset={strokeDashoffset}
      strokeLinecap="round"
      transform="rotate(-90 50 50)"
      className="transition-all duration-700 ease-out"
    />
  );
}

/**
 * 비자 매칭 결과를 도넛 차트 + 프로그레스 바 + 비자 목록으로 시각화
 * Visualize visa matching results with donut chart + progress bars + visa list
 *
 * 시안 E 핵심 차별점: 데이터 시각화 중심의 비자 인사이트 대시보드
 * Variant E key differentiator: Data visualization-centric visa insight dashboard
 */
export function VisaInsightChart({ matchResult }: VisaInsightChartProps) {
  const [expandedStatus, setExpandedStatus] = useState<VisaMatchStatus | null>(null);
  const { summary, eligible, conditional, blocked } = matchResult;
  const total = summary.totalEligible + summary.totalConditional + summary.totalBlocked;

  if (total === 0) {
    return (
      <div className="text-center py-6">
        <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">매칭되는 비자 정보가 없습니다</p>
        <p className="text-xs text-gray-400">No matching visa information found</p>
      </div>
    );
  }

  const eligiblePct = (summary.totalEligible / total) * 100;
  const conditionalPct = (summary.totalConditional / total) * 100;
  const blockedPct = (summary.totalBlocked / total) * 100;

  /** 비자 매칭률 (eligible + conditional) / Match rate */
  const matchRate = Math.round(((summary.totalEligible + summary.totalConditional) / total) * 100);

  /** 상태별 비자 목록 / Visa list by status */
  const statusGroups: { status: VisaMatchStatus; visas: VisaEvalResult[]; count: number; pct: number }[] = [
    { status: 'eligible', visas: eligible, count: summary.totalEligible, pct: eligiblePct },
    { status: 'conditional', visas: conditional, count: summary.totalConditional, pct: conditionalPct },
    { status: 'blocked', visas: blocked, count: summary.totalBlocked, pct: blockedPct },
  ];

  return (
    <div className="space-y-6">
      {/* 도넛 차트 + 매칭률 / Donut chart + match rate */}
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* 배경 원 / Background circle */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" strokeWidth="12" />
            {/* 데이터 세그먼트 / Data segments */}
            <DonutSegment radius={38} strokeWidth={12} percentage={eligiblePct} offset={0} color="#22c55e" />
            <DonutSegment radius={38} strokeWidth={12} percentage={conditionalPct} offset={eligiblePct} color="#f59e0b" />
            <DonutSegment radius={38} strokeWidth={12} percentage={blockedPct} offset={eligiblePct + conditionalPct} color="#ef4444" />
          </svg>
          {/* 중앙 텍스트 / Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gray-900">{matchRate}%</span>
            <span className="text-[10px] text-gray-500">매칭률</span>
          </div>
        </div>

        {/* 요약 숫자 / Summary numbers */}
        <div className="flex-1 space-y-2">
          {statusGroups.map(({ status, count, pct }) => {
            const config = STATUS_CONFIG[status];
            const Icon = config.icon;
            return (
              <div key={status} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                <span className="text-sm text-gray-900 font-bold ml-auto">{count}개</span>
                <span className="text-xs text-gray-400 w-10 text-right">{Math.round(pct)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 프로그레스 바 / Progress bar */}
      <div className="w-full h-2.5 rounded-full bg-gray-100 flex overflow-hidden">
        <div
          className="bg-green-500 transition-all duration-700"
          style={{ width: `${eligiblePct}%` }}
          aria-label={`적합 ${Math.round(eligiblePct)}% / Eligible`}
        />
        <div
          className="bg-amber-400 transition-all duration-700"
          style={{ width: `${conditionalPct}%` }}
          aria-label={`조건부 ${Math.round(conditionalPct)}% / Conditional`}
        />
        <div
          className="bg-red-400 transition-all duration-700"
          style={{ width: `${blockedPct}%` }}
          aria-label={`불가 ${Math.round(blockedPct)}% / Blocked`}
        />
      </div>

      {/* 비자 상세 목록 (접기/펼치기) / Visa detail list (collapsible) */}
      <div className="space-y-2">
        {statusGroups.map(({ status, visas }) => {
          if (visas.length === 0) return null;
          const config = STATUS_CONFIG[status];
          const isExpanded = expandedStatus === status;

          return (
            <div key={status} className={`rounded-lg border overflow-hidden ${isExpanded ? 'border-gray-300' : 'border-gray-200'}`}>
              <button
                type="button"
                onClick={() => setExpandedStatus(isExpanded ? null : status)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition ${config.bgColor} min-h-11`}
                aria-expanded={isExpanded}
                aria-label={`${config.label} 비자 목록 ${isExpanded ? '접기' : '펼치기'} / Toggle ${config.labelEn} visa list`}
              >
                <span className={config.color}>
                  {config.label} ({visas.length}개 비자)
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''} ${config.color}`} />
              </button>
              {isExpanded && (
                <div className="divide-y divide-gray-100">
                  {visas.map((visa) => (
                    <div key={visa.visaCode} className="px-3 py-2.5 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-semibold text-gray-900">{visa.visaCode}</span>
                          <span className="text-sm text-gray-500 ml-2">{visa.visaName}</span>
                        </div>
                        {visa.maxWeeklyHours && (
                          <span className="text-xs text-gray-400">
                            최대 {visa.maxWeeklyHours}h/주
                          </span>
                        )}
                      </div>
                      {visa.conditions && visa.conditions.length > 0 && (
                        <ul className="mt-1 space-y-0.5">
                          {visa.conditions.map((cond, i) => (
                            <li key={i} className="text-xs text-amber-600">- {cond}</li>
                          ))}
                        </ul>
                      )}
                      {visa.blockReasons && visa.blockReasons.length > 0 && (
                        <ul className="mt-1 space-y-0.5">
                          {visa.blockReasons.map((reason, i) => (
                            <li key={i} className="text-xs text-red-500">- {reason}</li>
                          ))}
                        </ul>
                      )}
                      {visa.notes && (
                        <p className="text-xs text-gray-400 mt-1">{visa.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
