'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Globe, Loader2, Scale } from 'lucide-react';
import type { VisaMatchResult, WizardStep } from '../types/job-create.types';

interface VisaResultCardProps {
  matchResult: VisaMatchResult | null;
  isLoading: boolean;
  onGoToStep?: (step: WizardStep) => void;
}

/**
 * 비자 매칭 결과 카드 / Visa matching result card
 * 적합/부적합 비자 목록 표시
 * Shows eligible/blocked visa list
 */
export function VisaResultCard({ matchResult, isLoading, onGoToStep }: VisaResultCardProps) {
  const [expandedVisa, setExpandedVisa] = useState<string | null>(null);
  const [showBlocked, setShowBlocked] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-blue-600" /> 비자 판단 보조 결과
      </h2>

      {/* 로딩 상태 / Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-3" />
          <span className="text-sm text-gray-500">비자 매칭 분석 중...</span>
        </div>
      )}

      {/* 결과 표시 / Results display */}
      {!isLoading && matchResult && (
        <div className="space-y-3">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-900">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span>판정 시점: {new Date(matchResult.evaluatedAt).toLocaleString('ko-KR')}</span>
              {matchResult.policy?.asOf && <span>정책 기준: {new Date(matchResult.policy.asOf).toLocaleDateString('ko-KR')}</span>}
              {matchResult.policy?.reviewedAt && <span>전문가 검토: {new Date(matchResult.policy.reviewedAt).toLocaleDateString('ko-KR')}</span>}
              {matchResult.policy?.version && <span>버전: {matchResult.policy.version}</span>}
            </div>
          </div>
          {matchResult.outcome === 'REVIEW_REQUIRED' && (
            <div className="flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950" role="alert">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">최신 정책 검토가 완료될 때까지 판정을 중단합니다.</p>
                <p className="mt-1 text-xs">{matchResult.summary}</p>
              </div>
            </div>
          )}
          {/* 적합 비자 / Eligible visas */}
          {matchResult.eligibleVisas.map(v => (
            <div key={v.code} className="border border-green-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedVisa(expandedVisa === v.code ? null : v.code)}
                className="w-full flex items-center justify-between p-3 hover:bg-green-50 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                  <span className="font-medium text-sm text-gray-900">{v.code}</span>
                  <span className="text-sm text-gray-600">{v.nameKo}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    입력조건상 가능
                  </span>
                </div>
                {expandedVisa === v.code
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </button>
              {expandedVisa === v.code && (
                <div className="px-3 pb-3 border-t border-green-100 pt-3 bg-green-50/50 space-y-2">
                  {v.restrictions.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-gray-700">제한사항:</span>
                      <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
                        {v.restrictions.map((r, i) => <li key={i}>&#8226; {r}</li>)}
                      </ul>
                    </div>
                  )}
                  {v.documents.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-gray-700">준비 서류:</span>
                      <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
                        {v.documents.map((d, i) => <li key={i}>&#8226; {d}</li>)}
                      </ul>
                    </div>
                  )}
                  {v.notes.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-gray-700">참고:</span>
                      <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
                        {v.notes.map((n, i) => <li key={i}>&#8226; {n}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* 부적합 비자 / Blocked visas */}
          {matchResult.blockedVisas.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowBlocked(!showBlocked)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
              >
                <span className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                {matchResult.blockedVisas.length}개 비자 부적합
                {showBlocked
                  ? <ChevronUp className="w-3.5 h-3.5" />
                  : <ChevronDown className="w-3.5 h-3.5" />
                }
              </button>
              {showBlocked && (
                <div className="mt-2 space-y-2">
                  {matchResult.blockedVisas.map(v => (
                    <div key={v.code} className="bg-red-50 border border-red-100 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-700">{v.code} {v.nameKo}</span>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">부적합</span>
                      </div>
                      {v.reasons.map((r, i) => (
                        <p key={i} className="text-xs text-red-600">&#8226; {r}</p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 매칭 없음 / No matches */}
          {matchResult.outcome !== 'REVIEW_REQUIRED' && matchResult.eligibleVisas.length === 0 && matchResult.blockedVisas.length === 0 && (
            <div className="text-center py-6">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">현재 조건에 매칭되는 비자가 없습니다.</p>
              {onGoToStep && (
                <button
                  type="button"
                  onClick={() => onGoToStep(2)}
                  className="text-sm text-blue-600 font-medium mt-2 hover:underline"
                >
                  조건 수정하기 &rarr;
                </button>
              )}
            </div>
          )}

          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
            <Scale className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              {matchResult.disclaimer || '이 결과는 입력정보와 표시된 정책 기준일에 따른 일반적인 판단 보조 정보입니다. 비자 발급·취업허가를 보장하거나 신청을 대리하지 않습니다. 개별 사실관계는 출입국·외국인청 1345 또는 자격 있는 행정사에게 직접 확인하세요.'}
            </p>
          </div>
        </div>
      )}

      {/* 결과 없음 / No result yet */}
      {!isLoading && !matchResult && (
        <p className="text-sm text-gray-400 text-center py-6">
          매칭 결과가 없습니다.
        </p>
      )}
    </div>
  );
}
