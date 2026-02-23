/**
 * 실시간 비자 분석 인디케이터 (백엔드 API 기반)
 * Live visa analysis indicator (backend API-based)
 *
 * - 초기 상태: 고용형태에 따른 전체 가능 비자 목록 표시
 * - Initial state: shows all possible visas based on employment type
 * - 직종+연봉 입력 시: POST /fulltime-visa/evaluate 호출하여 실시간 분석
 * - On job/salary input: calls POST /fulltime-visa/evaluate for live analysis
 * - 알바 선택 시: 알바 비자 목록 (D-2/D-4/D-10/F/H) 표시
 * - On ALBA: shows alba visa list (D-2/D-4/D-10/F/H)
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

// 정규직/계약직/인턴 — 전체 가능 비자 목록 (백엔드 fulltime evaluator 기준)
// All visas for fulltime/contract/intern (based on backend fulltime evaluators)
// E-7-1~4는 이직(TRANSFER)과 해외초청(SPONSOR) 양쪽에 모두 표시
// E-7-1~4 appear in both TRANSFER and SPONSOR tracks
const FULLTIME_ALL_VISAS: { visaCode: string; visaName: string; tracks: TrackKey[] }[] = [
  { visaCode: 'F-5', visaName: '영주', tracks: ['IMMEDIATE'] },
  { visaCode: 'F-6', visaName: '결혼이민', tracks: ['IMMEDIATE'] },
  { visaCode: 'F-2', visaName: '거주', tracks: ['IMMEDIATE'] },
  { visaCode: 'F-4', visaName: '재외동포', tracks: ['IMMEDIATE'] },
  { visaCode: 'E-7-1', visaName: '특정활동(전문직)', tracks: ['TRANSFER', 'SPONSOR'] },
  { visaCode: 'E-7-2', visaName: '특정활동(준전문직)', tracks: ['TRANSFER', 'SPONSOR'] },
  { visaCode: 'E-7-3', visaName: '특정활동(일반직)', tracks: ['TRANSFER', 'SPONSOR'] },
  { visaCode: 'E-7-4', visaName: '특정활동(숙련기능)', tracks: ['TRANSFER', 'SPONSOR'] },
  { visaCode: 'E-7-S', visaName: '특정활동(첨단기술)', tracks: ['SPONSOR'] },
  { visaCode: 'D-2', visaName: '유학', tracks: ['TRANSITION'] },
  { visaCode: 'D-10', visaName: '구직', tracks: ['TRANSITION'] },
];

// 알바 — 전체 가능 비자 목록 (백엔드 alba evaluator 기준)
// All visas for alba (based on backend alba evaluators)
const ALBA_ALL_VISAS = [
  { visaCode: 'F-5', visaName: '영주' },
  { visaCode: 'F-6', visaName: '결혼이민' },
  { visaCode: 'F-2', visaName: '거주' },
  { visaCode: 'F-4', visaName: '재외동포' },
  { visaCode: 'H-2', visaName: '방문취업' },
  { visaCode: 'H-1', visaName: '관광취업(워홀)' },
  { visaCode: 'D-2', visaName: '유학(시간제)' },
  { visaCode: 'D-4', visaName: '일반연수' },
  { visaCode: 'D-10', visaName: '구직' },
];

export default function LiveVisaIndicator({ form }: LiveVisaIndicatorProps) {
  const [result, setResult] = useState<FulltimeVisaMatchingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAlba = form.employmentType === 'ALBA';

  // 폼 변경 시 debounce 후 백엔드 호출 (알바는 API 호출 안 함)
  // Call backend with debounce on form change (skip for ALBA)
  useEffect(() => {
    // 알바이거나 필수 입력값 없으면 API 호출 안 함
    // Skip API call for ALBA or missing required fields
    if (isAlba || !form.jobCategoryCode || form.salaryMin <= 0) {
      setResult(null);
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
        // 에러 로그 제거 (NestJS Logger 사용 원칙 / Use NestJS Logger instead)
        void err;
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [
    isAlba,
    form.jobCategoryCode,
    form.employmentType,
    form.salaryMin,
    form.educationLevel,
    form.experienceLevel,
    form.overseasHireWilling,
    form.address?.isDepopulationArea,
  ]);

  // 알바 선택 시 — 알바 비자 전체 목록 표시 (정적)
  // ALBA: show static list of all possible alba visas
  if (isAlba) {
    return (
      <div className="fixed bottom-20 right-6 w-80 bg-white border-2 border-green-500 rounded-xl shadow-2xl p-4 z-50">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-gray-900">🏪 알바 채용 가능 비자</h4>
            <span className="text-2xl font-bold text-green-600">{ALBA_ALL_VISAS.length}</span>
          </div>
          <p className="text-xs text-gray-500">현재 비자 기준 근무 가능 여부 분석</p>
        </div>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {ALBA_ALL_VISAS.map((visa) => (
            <div
              key={visa.visaCode}
              className="flex items-center gap-2 p-2 bg-green-50 rounded-lg"
            >
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
              <span className="text-xs font-semibold text-green-900">
                {visa.visaCode} ({visa.visaName})
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            💡 조건(시간 제한 등)은 비자별로 상이할 수 있습니다
          </p>
        </div>
      </div>
    );
  }

  // 정규직/계약직/인턴 — 직종+연봉 미입력 시 전체 가능 비자 목록 표시 (정적)
  // Fulltime/contract/intern: show all possible visas before API call
  if (!form.jobCategoryCode || form.salaryMin <= 0) {
    // 트랙별 그룹화 (E-7-1~4는 TRANSFER와 SPONSOR 양쪽에 포함)
    // Group by track (E-7-1~4 included in both TRANSFER and SPONSOR)
    const grouped: Partial<Record<TrackKey, { visaCode: string; visaName: string }[]>> = {};
    FULLTIME_ALL_VISAS.forEach((v) => {
      v.tracks.forEach((track) => {
        if (!grouped[track]) grouped[track] = [];
        grouped[track]!.push(v);
      });
    });

    const colorClasses: Record<TrackKey, { border: string; bg: string; text: string; icon: string; label: string; emoji: string }> = {
      IMMEDIATE: { border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-900', icon: 'text-green-600', label: '즉시채용', emoji: '🟢' },
      TRANSITION: { border: 'border-yellow-200', bg: 'bg-yellow-50', text: 'text-yellow-900', icon: 'text-yellow-600', label: 'E-7 전환', emoji: '🟡' },
      TRANSFER: { border: 'border-orange-200', bg: 'bg-orange-50', text: 'text-orange-900', icon: 'text-orange-600', label: 'E-7 이직', emoji: '🟠' },
      SPONSOR: { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-900', icon: 'text-blue-600', label: 'E-7 해외초청', emoji: '🔵' },
    };

    return (
      <div className="fixed bottom-20 right-6 w-80 bg-white border-2 border-blue-500 rounded-xl shadow-2xl p-4 z-50">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-gray-900">📋 채용 가능 비자 전체</h4>
            <span className="text-2xl font-bold text-blue-600">{FULLTIME_ALL_VISAS.length}</span>
          </div>
          <p className="text-xs text-gray-500">직종·연봉 입력 시 실시간 분석으로 전환됩니다</p>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {(Object.keys(colorClasses) as TrackKey[]).map((trackKey) => {
            const visas = grouped[trackKey];
            if (!visas || visas.length === 0) return null;
            const c = colorClasses[trackKey];
            return (
              <div key={trackKey}>
                <p className={`text-xs font-bold ${c.icon} mb-1`}>
                  {c.emoji} {c.label}
                </p>
                <div className="space-y-1">
                  {visas.map((visa) => (
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
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            💡 직종과 연봉을 입력하면 실시간 분석을 시작합니다
          </p>
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
