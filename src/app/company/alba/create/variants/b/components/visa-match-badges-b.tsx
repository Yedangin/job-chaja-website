'use client';

/**
 * Variant B 비자 매칭 결과 배지 — 테이블 형태 표시
 * Variant B visa matching result badges — table format display
 *
 * 사람인/잡코리아 스타일: 밀도 높은 행 기반 표시
 * Saramin/Jobkorea style: dense row-based display
 */

import { ChevronDown, ChevronUp, Shield, ShieldAlert, ShieldX, Info } from 'lucide-react';
import { useState } from 'react';
import type { VisaEvalResult, VisaMatchingResponse } from './alba-types';

interface VisaMatchBadgesBProps {
  matchResult: VisaMatchingResponse | null;
  loading?: boolean;
  compact?: boolean;
}

/**
 * 비자 상태별 스타일 / Visa status styles
 */
function getStatusStyle(status: VisaEvalResult['status']) {
  switch (status) {
    case 'eligible':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        icon: <Shield className="w-3.5 h-3.5 text-green-600" />,
        label: '가능',
        labelEn: 'Eligible',
        dot: 'bg-green-500',
      };
    case 'conditional':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />,
        label: '조건부',
        labelEn: 'Conditional',
        dot: 'bg-amber-500',
      };
    case 'blocked':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-600',
        icon: <ShieldX className="w-3.5 h-3.5 text-red-500" />,
        label: '불가',
        labelEn: 'Blocked',
        dot: 'bg-red-500',
      };
  }
}

export function VisaMatchBadgesB({ matchResult, loading = false, compact = false }: VisaMatchBadgesBProps) {
  const [showBlocked, setShowBlocked] = useState(false);

  // ─── 로딩 상태 / Loading state ───
  if (loading) {
    return (
      <div className="border border-gray-200 rounded-sm bg-white">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // ─── 결과 없음 / No result ───
  if (!matchResult) {
    return (
      <div className="border border-gray-200 rounded-sm bg-white p-6 text-center">
        <Info className="w-6 h-6 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          비자 매칭 결과가 아직 없습니다
        </p>
        <p className="text-xs text-gray-400 mt-1">
          공고 정보를 입력하면 자동으로 비자 매칭이 실행됩니다
        </p>
      </div>
    );
  }

  const { eligible, conditional, blocked, summary } = matchResult;
  const totalAllowed = summary.totalEligible + summary.totalConditional;

  return (
    <div className="border border-gray-200 rounded-sm bg-white">
      {/* 요약 헤더 / Summary header */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">
              비자 매칭 결과 / Visa Matching Result
            </span>
          </div>
          <span className="text-sm font-bold text-blue-700">
            {totalAllowed}개 비자 지원 가능
          </span>
        </div>
        {/* 요약 숫자 / Summary numbers */}
        <div className="flex items-center gap-4 mt-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-gray-600">가능 {summary.totalEligible}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span className="text-gray-600">조건부 {summary.totalConditional}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span className="text-gray-600">불가 {summary.totalBlocked}</span>
          </span>
        </div>
      </div>

      {/* 가능 비자 목록 / Eligible visas */}
      {eligible.length > 0 && (
        <div className="border-b border-gray-100">
          <div className="px-4 py-1.5 bg-green-50/50 border-b border-green-100">
            <span className="text-xs font-semibold text-green-700">
              지원 가능 / Eligible ({eligible.length})
            </span>
          </div>
          {compact ? (
            <div className="px-4 py-2 flex flex-wrap gap-1.5">
              {eligible.map(v => (
                <span
                  key={v.visaCode}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {v.visaCode} {v.visaName}
                </span>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {eligible.map(v => (
                <VisaRow key={v.visaCode} visa={v} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 조건부 비자 목록 / Conditional visas */}
      {conditional.length > 0 && (
        <div className="border-b border-gray-100">
          <div className="px-4 py-1.5 bg-amber-50/50 border-b border-amber-100">
            <span className="text-xs font-semibold text-amber-700">
              조건부 가능 / Conditional ({conditional.length})
            </span>
          </div>
          {compact ? (
            <div className="px-4 py-2 flex flex-wrap gap-1.5">
              {conditional.map(v => (
                <span
                  key={v.visaCode}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded border border-amber-200"
                  title={v.conditions?.join(', ') || ''}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {v.visaCode} {v.visaName}
                </span>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {conditional.map(v => (
                <VisaRow key={v.visaCode} visa={v} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 불가 비자 (접힘) / Blocked visas (collapsible) */}
      {blocked.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowBlocked(!showBlocked)}
            className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-500 hover:bg-gray-50 transition-colors"
            aria-label="불가 비자 목록 토글 / Toggle blocked visas"
          >
            <span>불가 비자 {blocked.length}개</span>
            {showBlocked ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showBlocked && (
            <div className="divide-y divide-gray-50 border-t border-gray-100">
              {blocked.map(v => (
                <VisaRow key={v.visaCode} visa={v} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 비자 행 컴포넌트 / Visa row component
 */
function VisaRow({ visa }: { visa: VisaEvalResult }) {
  const style = getStatusStyle(visa.status);

  return (
    <div className={`px-4 py-2 flex items-start gap-3 ${style.bg}`}>
      {/* 아이콘 / Icon */}
      <div className="mt-0.5 shrink-0">{style.icon}</div>

      {/* 비자 정보 / Visa info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${style.text}`}>
            {visa.visaCode}
          </span>
          <span className="text-sm text-gray-600">{visa.visaName}</span>
          <span className="text-xs text-gray-400">({visa.visaNameEn})</span>
        </div>
        {/* 조건 / Conditions */}
        {visa.conditions && visa.conditions.length > 0 && (
          <ul className="mt-1 space-y-0.5">
            {visa.conditions.map((c, i) => (
              <li key={i} className="text-xs text-amber-600 flex items-start gap-1">
                <span className="mt-1 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        )}
        {/* 불가 사유 / Block reasons */}
        {visa.blockReasons && visa.blockReasons.length > 0 && (
          <ul className="mt-1 space-y-0.5">
            {visa.blockReasons.map((r, i) => (
              <li key={i} className="text-xs text-red-500 flex items-start gap-1">
                <span className="mt-1 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        )}
        {/* 참고사항 / Notes */}
        {visa.notes && (
          <p className="text-xs text-gray-500 mt-0.5">{visa.notes}</p>
        )}
      </div>

      {/* 추가 정보 / Extra info */}
      <div className="text-right shrink-0 text-xs space-y-0.5">
        {visa.maxWeeklyHours != null && (
          <div className="text-gray-500">최대 {visa.maxWeeklyHours}h/주</div>
        )}
        {visa.requiredPermit && (
          <div className="text-amber-600 font-medium">{visa.requiredPermit}</div>
        )}
        {visa.maxWorkplaces != null && (
          <div className="text-gray-500">{visa.maxWorkplaces}개소 제한</div>
        )}
      </div>
    </div>
  );
}
