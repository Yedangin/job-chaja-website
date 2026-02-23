/**
 * 실시간 비자 분석 인디케이터 (백엔드 API 기반)
 * Live visa analysis indicator (backend API-based)
 *
 * - 입력값 변경 시 500ms debounce 후 POST /fulltime-visa/evaluate 호출
 * - Calls POST /fulltime-visa/evaluate with 500ms debounce on form change
 * - 모든 판정 로직은 백엔드에서 처리 (웹/앱 공통)
 * - All judgment logic handled by backend (shared by web and app)
 */

'use client';

import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import type { FulltimeJobFormData, FulltimeVisaMatchingResponse } from './fulltime-types';
import { matchFulltimeVisa } from '../api';

interface LiveVisaIndicatorProps {
  form: FulltimeJobFormData;
}

// 트랙별 UI 메타데이터 (색상/이모지는 UI 전용, 백엔드 응답에 없음)
// Track UI metadata (color/emoji are UI-only, not in backend response)
const TRACK_UI = {
  IMMEDIATE: { emoji: '🟢', color: 'green', label: '즉시채용', sub: '비자절차 불필요', time: '즉시' },
  TRANSITION: { emoji: '🟡', color: 'yellow', label: 'E-7 전환', sub: '체류자격 변경 필요', time: '3~4주' },
  TRANSFER: { emoji: '🟠', color: 'orange', label: 'E-7 이직', sub: '근무처 변경', time: '1~2주' },
  SPONSOR: { emoji: '🔵', color: 'blue', label: 'E-7 해외초청', sub: '신규발급 필요', time: '4~8주' },
} as const;

type TrackKey = keyof typeof TRACK_UI;

export default function LiveVisaIndicator({ form }: LiveVisaIndicatorProps) {
  const [result, setResult] = useState<FulltimeVisaMatchingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 폼 변경 시 debounce 후 백엔드 호출
  // Call backend with debounce on form change
  useEffect(() => {
    // 필수 입력값 없으면 호출하지 않음 / Skip if required fields missing
    if (!form.jobCategoryCode || form.salaryMin <= 0) {
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await matchFulltimeVisa(form);
        setResult(data);
      } catch (err) {
        setError('비자 분석에 실패했습니다. 잠시 후 다시 시도해주세요.');
        console.error('비자 매칭 API 오류:', err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [
    form.jobCategoryCode,
    form.employmentType,
    form.salaryMin,
    form.educationLevel,
    form.experienceLevel,
    form.overseasHireWilling,
    form.address?.isDepopulationArea,
  ]);

  // 필수값 미입력 시 안내 표시
  if (!form.jobCategoryCode || form.salaryMin <= 0) {
    return (
      <div className="fixed bottom-20 right-6 w-80 bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-4 z-50">
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">직종과 연봉을 입력하면</p>
          <p className="text-sm text-gray-500">채용 가능한 비자를 분석합니다</p>
        </div>
      </div>
    );
  }

  // 로딩 중
  if (loading) {
    return (
      <div className="fixed bottom-20 right-6 w-80 bg-white border-2 border-gray-300 rounded-xl shadow-2xl p-4 z-50">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          <span className="ml-3 text-sm text-gray-600">비자 분석 중...</span>
        </div>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className="fixed bottom-20 right-6 w-80 bg-white border-2 border-red-300 rounded-xl shadow-2xl p-4 z-50">
        <div className="text-center py-4">
          <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // 결과 없음 (첫 로드)
  if (!result) {
    return null;
  }

  const tracks: TrackKey[] = ['IMMEDIATE', 'TRANSITION', 'TRANSFER', 'SPONSOR'];
  const totalEligible = result.overallSummary.totalEligible;
  const totalEvaluated = result.overallSummary.totalVisasEvaluated;

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white border-2 border-blue-500 rounded-xl shadow-2xl p-4 z-50">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-900">📊 실시간 비자 분석</h4>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">{totalEligible}</span>
            <span className="text-xs text-gray-500">/ {totalEvaluated}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tracks.map((trackKey) => {
          const trackData = result[trackKey.toLowerCase() as 'immediate' | 'sponsor' | 'transition' | 'transfer'];
          if (!trackData) return null;

          const ui = TRACK_UI[trackKey];
          const eligibleList = trackData.eligible;

          if (eligibleList.length === 0) return null;

          const colorClasses: Record<string, { border: string; bg: string; text: string; icon: string }> = {
            green:  { border: 'border-green-200',  bg: 'bg-green-50',  text: 'text-green-900',  icon: 'text-green-600'  },
            yellow: { border: 'border-yellow-200', bg: 'bg-yellow-50', text: 'text-yellow-900', icon: 'text-yellow-600' },
            orange: { border: 'border-orange-200', bg: 'bg-orange-50', text: 'text-orange-900', icon: 'text-orange-600' },
            blue:   { border: 'border-blue-200',   bg: 'bg-blue-50',   text: 'text-blue-900',   icon: 'text-blue-600'   },
          };
          const c = colorClasses[ui.color];

          return (
            <div key={trackKey}>
              <div className="mb-2">
                <div className={`text-xs font-bold ${c.icon}`}>
                  {ui.emoji} {trackKey} — {ui.label} ⏱ {ui.time}
                </div>
                <div className="text-xs text-gray-500 pl-5">[{ui.sub}]</div>
              </div>
              <div className="space-y-1">
                {eligibleList.map((visa) => (
                  <div key={visa.visaCode} className={`flex items-center gap-2 p-2 ${c.bg} rounded-lg`}>
                    <CheckCircle className={`w-4 h-4 ${c.icon} shrink-0`} />
                    <span className={`text-xs font-semibold ${c.text}`}>
                      {visa.visaCode} ({visa.visaName})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {totalEligible === 0 && (
          <div className="text-center py-8">
            <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">현재 조건으로 채용 가능한 비자가 없습니다</p>
            <p className="text-xs text-gray-500 mt-1">연봉이나 직종 조건을 조정해보세요</p>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 입력할 때마다 실시간으로 업데이트됩니다
        </p>
      </div>
    </div>
  );
}
