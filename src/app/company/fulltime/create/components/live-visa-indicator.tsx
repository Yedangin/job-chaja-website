/**
 * 실시간 비자 분석 인디케이터 (백엔드 API 기반)
 * Live visa analysis indicator (backend API-based)
 *
 * 표시 로직:
 * - 고용형태 미선택: 전체 비자 (정규직 + 알바 통합, 14종) 섹션별 표시
 * - 알바 선택: 알바 가능 비자를 3개 섹션으로 분류
 *   ① 즉시채용 (취업제한 없는 F비자)
 *   ② 시간외 활동허가 필요 (D-2, D-4)
 *   ③ 방문취업/워킹홀리데이 (H-2, H-1, D-10)
 * - 정규직/계약직/인턴 + 직종·연봉 미입력: 전체 가능 비자 트랙별 표시
 * - 정규직/계약직/인턴 + 직종·연봉 입력: 백엔드 API 실시간 분석
 *
 * Display logic:
 * - No employment type: all visas (fulltime + alba, 14 types) by section
 * - ALBA: 3 sections (immediate / part-time permit needed / working holiday)
 * - Fulltime + no input: static visa list by track
 * - Fulltime + with input: live backend analysis
 */

'use client';

import { CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import type { FulltimeJobFormData, FulltimeVisaMatchingResponse } from './fulltime-types';
import { matchFulltimeVisa } from '../api';

interface LiveVisaIndicatorProps {
  form: FulltimeJobFormData;
}

// 트랙별 UI 메타데이터
// Track UI metadata
const TRACK_UI = {
  IMMEDIATE: { emoji: '🟢', color: 'green', label: '즉시채용', sub: '비자절차 불필요', time: '즉시' },
  TRANSITION: { emoji: '🟡', color: 'yellow', label: 'E-7 전환', sub: 'D-2/D-10 → E-7', time: '3~4주' },
  TRANSFER: { emoji: '🟠', color: 'orange', label: 'E-7 이직', sub: '근무처 변경 허가', time: '1~2주' },
  SPONSOR: { emoji: '🔵', color: 'blue', label: 'E-7 해외초청', sub: '신규발급 필요', time: '4~8주' },
} as const;

type TrackKey = keyof typeof TRACK_UI;

// 정규직/계약직/인턴 — 전체 가능 비자 목록
// E-7-S는 이직(TRANSFER) 및 해외초청(SPONSOR) 모두 가능
// All visas for fulltime/contract/intern
// E-7-S supports both TRANSFER (job change permit) and SPONSOR (new issuance)
const FULLTIME_ALL_VISAS: { visaCode: string; visaName: string; tracks: TrackKey[] }[] = [
  { visaCode: 'F-5', visaName: '영주', tracks: ['IMMEDIATE'] },
  { visaCode: 'F-6', visaName: '결혼이민', tracks: ['IMMEDIATE'] },
  { visaCode: 'F-2', visaName: '거주', tracks: ['IMMEDIATE'] },
  { visaCode: 'F-4', visaName: '재외동포', tracks: ['IMMEDIATE'] },
  { visaCode: 'E-7-1', visaName: '특정활동(전문직)', tracks: ['TRANSFER', 'SPONSOR'] },
  { visaCode: 'E-7-2', visaName: '특정활동(준전문직)', tracks: ['TRANSFER', 'SPONSOR'] },
  { visaCode: 'E-7-3', visaName: '특정활동(일반직)', tracks: ['TRANSFER', 'SPONSOR'] },
  { visaCode: 'E-7-4', visaName: '특정활동(숙련기능)', tracks: ['TRANSFER', 'SPONSOR'] },
  // E-7-S: 첨단기술 분야 — 이직(TRANSFER) 및 해외초청(SPONSOR) 모두 가능
  // E-7-S: high-tech sector — supports both job transfer and overseas sponsorship
  { visaCode: 'E-7-S', visaName: '특정활동(첨단기술)', tracks: ['TRANSFER', 'SPONSOR'] },
  { visaCode: 'D-2', visaName: '유학', tracks: ['TRANSITION'] },
  { visaCode: 'D-10', visaName: '구직', tracks: ['TRANSITION'] },
];

// 알바 비자 — 3개 섹션으로 분류
// Alba visas — categorized into 3 sections
const ALBA_VISA_SECTIONS = [
  {
    key: 'immediate',
    label: '즉시채용',
    desc: '취업활동 제한 없음',
    colorClass: { border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-900', icon: 'text-green-600', title: 'text-green-700', header: 'bg-green-100 border-green-200' },
    emoji: '🟢',
    visas: [
      { visaCode: 'F-5', visaName: '영주' },
      { visaCode: 'F-6', visaName: '결혼이민' },
      { visaCode: 'F-2', visaName: '거주' },
      { visaCode: 'F-4', visaName: '재외동포' },
    ],
  },
  {
    key: 'permit',
    label: '시간외 활동허가 필요',
    desc: '학교/기관 허가 후 가능',
    colorClass: { border: 'border-yellow-200', bg: 'bg-yellow-50', text: 'text-yellow-900', icon: 'text-yellow-600', title: 'text-yellow-700', header: 'bg-yellow-100 border-yellow-200' },
    emoji: '🟡',
    visas: [
      { visaCode: 'D-2', visaName: '유학(시간제)' },
      { visaCode: 'D-4', visaName: '일반연수' },
    ],
  },
  {
    key: 'working-holiday',
    label: '방문취업/워킹홀리데이',
    desc: '별도 허가 절차',
    colorClass: { border: 'border-purple-200', bg: 'bg-purple-50', text: 'text-purple-900', icon: 'text-purple-600', title: 'text-purple-700', header: 'bg-purple-100 border-purple-200' },
    emoji: '🟣',
    visas: [
      { visaCode: 'H-2', visaName: '방문취업' },
      { visaCode: 'H-1', visaName: '관광취업(워홀)' },
      { visaCode: 'D-10', visaName: '구직' },
    ],
  },
];

// 초기 상태 (고용형태 미선택) — 전체 비자 통합 표시
// Initial state (no employment type selected) — show all visas combined
const INITIAL_ALL_SECTIONS = [
  {
    key: 'immediate',
    label: '즉시채용 (공통)',
    desc: '정규직/알바 모두 취업제한 없음',
    emoji: '🟢',
    colorClass: { border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-900', icon: 'text-green-600', title: 'text-green-700' },
    visas: [
      { visaCode: 'F-5', visaName: '영주' },
      { visaCode: 'F-6', visaName: '결혼이민' },
      { visaCode: 'F-2', visaName: '거주' },
      { visaCode: 'F-4', visaName: '재외동포' },
    ],
  },
  {
    key: 'alba-only',
    label: '알바 전용',
    desc: '정규직 지원 불가, 알바만 가능',
    emoji: '🟣',
    colorClass: { border: 'border-purple-200', bg: 'bg-purple-50', text: 'text-purple-900', icon: 'text-purple-600', title: 'text-purple-700' },
    visas: [
      { visaCode: 'H-2', visaName: '방문취업' },
      { visaCode: 'H-1', visaName: '관광취업(워홀)' },
      { visaCode: 'D-4', visaName: '일반연수' },
    ],
  },
  {
    key: 'transition',
    label: '구직/전환 (알바·정규직 공통)',
    desc: '알바 가능, 정규직은 E-7 전환 필요',
    emoji: '🟡',
    colorClass: { border: 'border-yellow-200', bg: 'bg-yellow-50', text: 'text-yellow-900', icon: 'text-yellow-600', title: 'text-yellow-700' },
    visas: [
      { visaCode: 'D-2', visaName: '유학' },
      { visaCode: 'D-10', visaName: '구직' },
    ],
  },
  {
    key: 'e7',
    label: 'E-7 이직/해외초청 (정규직 전용)',
    desc: '알바 지원 불가, 정규직/계약직/인턴만 가능',
    emoji: '🟠',
    colorClass: { border: 'border-orange-200', bg: 'bg-orange-50', text: 'text-orange-900', icon: 'text-orange-600', title: 'text-orange-700' },
    visas: [
      { visaCode: 'E-7-1', visaName: '특정활동(전문직)' },
      { visaCode: 'E-7-2', visaName: '특정활동(준전문직)' },
      { visaCode: 'E-7-3', visaName: '특정활동(일반직)' },
      { visaCode: 'E-7-4', visaName: '특정활동(숙련기능)' },
      { visaCode: 'E-7-S', visaName: '특정활동(첨단기술)' },
    ],
  },
];

const colorClasses: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  green:  { border: 'border-green-200',  bg: 'bg-green-50',  text: 'text-green-900',  icon: 'text-green-600'  },
  yellow: { border: 'border-yellow-200', bg: 'bg-yellow-50', text: 'text-yellow-900', icon: 'text-yellow-600' },
  orange: { border: 'border-orange-200', bg: 'bg-orange-50', text: 'text-orange-900', icon: 'text-orange-600' },
  blue:   { border: 'border-blue-200',   bg: 'bg-blue-50',   text: 'text-blue-900',   icon: 'text-blue-600'   },
};

export default function LiveVisaIndicator({ form }: LiveVisaIndicatorProps) {
  const [result, setResult] = useState<FulltimeVisaMatchingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAlba = form.employmentType === 'ALBA';
  const isFulltime = ['REGULAR', 'CONTRACT', 'INTERN'].includes(form.employmentType);
  const noTypeSelected = !form.employmentType;

  // 폼 변경 시 debounce 후 백엔드 호출 (알바·미선택은 API 호출 안 함)
  // Call backend with debounce on form change (skip for ALBA or unselected)
  useEffect(() => {
    if (!isFulltime || !form.jobCategoryCode || form.salaryMin <= 0) {
      setResult(null);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await matchFulltimeVisa(form);
        setResult(data);
      } catch (err) {
        setError('비자 분석에 실패했습니다. 잠시 후 다시 시도해주세요.');
        void err;
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [
    isFulltime,
    form.jobCategoryCode,
    form.employmentType,
    form.salaryMin,
    form.educationLevel,
    form.experienceLevel,
    form.overseasHireWilling,
    form.address?.isDepopulationArea,
  ]);

  const toggleSection = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── 공통 패널 래퍼 (고정 위치 없음, 일반 컴포넌트) ──
  // Common panel wrapper (no fixed position, inline component)
  const Panel = ({ borderColor, children }: { borderColor: string; children: React.ReactNode }) => (
    <div className={`bg-white border-2 ${borderColor} rounded-xl shadow-md overflow-hidden`}>
      {children}
    </div>
  );

  // ── 1. 로딩 중 ──
  if (loading) {
    return (
      <Panel borderColor="border-gray-300">
        <div className="p-4 flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          <span className="ml-3 text-sm text-gray-600">비자 분석 중...</span>
        </div>
      </Panel>
    );
  }

  // ── 2. 에러 ──
  if (error) {
    return (
      <Panel borderColor="border-red-300">
        <div className="p-4 text-center py-6">
          <XCircle className="w-7 h-7 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </Panel>
    );
  }

  // ── 3. 고용형태 미선택 — 전체 비자 통합 표시 ──
  // No employment type selected — show all visas combined
  if (noTypeSelected) {
    const totalCount = INITIAL_ALL_SECTIONS.reduce((sum, s) => sum + s.visas.length, 0);
    return (
      <Panel borderColor="border-gray-300">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-gray-900 text-sm">🗂 채용 가능 비자 전체</h4>
            <span className="text-xl font-bold text-gray-600">{totalCount}</span>
          </div>
          <p className="text-xs text-gray-500">고용형태 선택 시 해당 비자만 표시됩니다</p>
        </div>
        <div className="p-3 space-y-3 max-h-[520px] overflow-y-auto">
          {INITIAL_ALL_SECTIONS.map((section) => (
            <div key={section.key}>
              <button
                type="button"
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between text-left mb-1.5"
              >
                <span className={`text-xs font-bold ${section.colorClass.title}`}>
                  {section.emoji} {section.label}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">{section.visas.length}</span>
                  {collapsed[section.key]
                    ? <ChevronDown className="w-3 h-3 text-gray-400" />
                    : <ChevronUp className="w-3 h-3 text-gray-400" />
                  }
                </span>
              </button>
              {!collapsed[section.key] && (
                <div className="space-y-1">
                  {section.visas.map((visa) => (
                    <div key={visa.visaCode} className={`flex items-center gap-2 px-2.5 py-1.5 ${section.colorClass.bg} rounded-lg`}>
                      <CheckCircle className={`w-3.5 h-3.5 ${section.colorClass.icon} shrink-0`} />
                      <span className={`text-xs font-semibold ${section.colorClass.text}`}>
                        {visa.visaCode}
                      </span>
                      <span className={`text-xs ${section.colorClass.icon} opacity-80`}>
                        {visa.visaName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  // ── 4. 알바 — 3개 섹션 ──
  // ALBA — 3 sections
  if (isAlba) {
    const totalAlba = ALBA_VISA_SECTIONS.reduce((sum, s) => sum + s.visas.length, 0);
    return (
      <Panel borderColor="border-green-500">
        <div className="p-4 border-b border-green-100 bg-green-50">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-green-900 text-sm">🏪 알바 채용 가능 비자</h4>
            <span className="text-xl font-bold text-green-600">{totalAlba}</span>
          </div>
          <p className="text-xs text-green-700">비자 종류에 따라 허가 절차가 다릅니다</p>
        </div>
        <div className="p-3 space-y-3 max-h-[520px] overflow-y-auto">
          {ALBA_VISA_SECTIONS.map((section) => (
            <div key={section.key}>
              <button
                type="button"
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between text-left mb-1.5"
              >
                <div>
                  <span className={`text-xs font-bold ${section.colorClass.title}`}>
                    {section.emoji} {section.label}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">— {section.desc}</span>
                </div>
                <span className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">{section.visas.length}</span>
                  {collapsed[section.key]
                    ? <ChevronDown className="w-3 h-3 text-gray-400" />
                    : <ChevronUp className="w-3 h-3 text-gray-400" />
                  }
                </span>
              </button>
              {!collapsed[section.key] && (
                <div className="space-y-1">
                  {section.visas.map((visa) => (
                    <div key={visa.visaCode} className={`flex items-center gap-2 px-2.5 py-1.5 ${section.colorClass.bg} rounded-lg`}>
                      <CheckCircle className={`w-3.5 h-3.5 ${section.colorClass.icon} shrink-0`} />
                      <span className={`text-xs font-semibold ${section.colorClass.text}`}>
                        {visa.visaCode}
                      </span>
                      <span className={`text-xs ${section.colorClass.icon} opacity-80`}>
                        {visa.visaName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            💡 정확한 근무시간 제한은 Step 3에서 비자별로 자동 분석됩니다
          </p>
        </div>
      </Panel>
    );
  }

  // ── 5. 정규직/계약직/인턴 — 직종·연봉 미입력 시 전체 가능 비자 목록 ──
  // Fulltime/contract/intern — static list before API call
  if (!form.jobCategoryCode || form.salaryMin <= 0) {
    const grouped: Partial<Record<TrackKey, { visaCode: string; visaName: string }[]>> = {};
    FULLTIME_ALL_VISAS.forEach((v) => {
      v.tracks.forEach((track) => {
        if (!grouped[track]) grouped[track] = [];
        grouped[track]!.push(v);
      });
    });

    const trackColorMap: Record<TrackKey, { border: string; bg: string; text: string; icon: string; title: string }> = {
      IMMEDIATE: { border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-900', icon: 'text-green-600', title: 'text-green-700' },
      TRANSITION: { border: 'border-yellow-200', bg: 'bg-yellow-50', text: 'text-yellow-900', icon: 'text-yellow-600', title: 'text-yellow-700' },
      TRANSFER: { border: 'border-orange-200', bg: 'bg-orange-50', text: 'text-orange-900', icon: 'text-orange-600', title: 'text-orange-700' },
      SPONSOR: { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-900', icon: 'text-blue-600', title: 'text-blue-700' },
    };

    const totalCount = FULLTIME_ALL_VISAS.length;
    return (
      <Panel borderColor="border-blue-500">
        <div className="p-4 border-b border-blue-100 bg-blue-50">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-blue-900 text-sm">📋 채용 가능 비자 전체</h4>
            <span className="text-xl font-bold text-blue-600">{totalCount}</span>
          </div>
          <p className="text-xs text-blue-700">직종·연봉 입력 시 실시간 분석으로 전환됩니다</p>
        </div>
        <div className="p-3 space-y-3 max-h-[520px] overflow-y-auto">
          {(Object.keys(trackColorMap) as TrackKey[]).map((trackKey) => {
            const visas = grouped[trackKey];
            if (!visas || visas.length === 0) return null;
            const ui = TRACK_UI[trackKey];
            const c = trackColorMap[trackKey];
            return (
              <div key={trackKey}>
                <button
                  type="button"
                  onClick={() => toggleSection(trackKey)}
                  className="w-full flex items-center justify-between text-left mb-1.5"
                >
                  <div>
                    <span className={`text-xs font-bold ${c.title}`}>
                      {ui.emoji} {ui.label}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">⏱ {ui.time}</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">{visas.length}</span>
                    {collapsed[trackKey]
                      ? <ChevronDown className="w-3 h-3 text-gray-400" />
                      : <ChevronUp className="w-3 h-3 text-gray-400" />
                    }
                  </span>
                </button>
                {!collapsed[trackKey] && (
                  <div className="space-y-1">
                    {visas.map((visa) => (
                      <div key={visa.visaCode} className={`flex items-center gap-2 px-2.5 py-1.5 ${c.bg} rounded-lg`}>
                        <CheckCircle className={`w-3.5 h-3.5 ${c.icon} shrink-0`} />
                        <span className={`text-xs font-semibold ${c.text}`}>
                          {visa.visaCode}
                        </span>
                        <span className={`text-xs ${c.icon} opacity-80`}>
                          {visa.visaName}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="p-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            💡 직종과 연봉을 입력하면 실시간 분석을 시작합니다
          </p>
        </div>
      </Panel>
    );
  }

  // ── 6. 실시간 분석 결과 없음 (직종·연봉 있으나 아직 API 응답 전) ──
  if (!result) return null;

  // ── 7. 정규직 실시간 분석 결과 ──
  // Fulltime live analysis result
  const tracks: TrackKey[] = ['IMMEDIATE', 'TRANSITION', 'TRANSFER', 'SPONSOR'];
  const totalEligible = result.overallSummary.totalEligible;
  const totalEvaluated = result.overallSummary.totalVisasEvaluated;

  return (
    <Panel borderColor="border-blue-500">
      <div className="p-4 border-b border-blue-100 bg-blue-50">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-blue-900 text-sm">📊 실시간 비자 분석</h4>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-blue-600">{totalEligible}</span>
            <span className="text-xs text-gray-400">/ {totalEvaluated}</span>
          </div>
        </div>
        <p className="text-xs text-blue-700">입력할 때마다 자동으로 업데이트됩니다</p>
      </div>

      <div className="p-3 space-y-3 max-h-[520px] overflow-y-auto">
        {tracks.map((trackKey) => {
          const trackData = result[trackKey.toLowerCase() as 'immediate' | 'sponsor' | 'transition' | 'transfer'];
          if (!trackData) return null;

          const ui = TRACK_UI[trackKey];
          const eligibleList = trackData.eligible;
          if (eligibleList.length === 0) return null;

          const c = colorClasses[ui.color];

          return (
            <div key={trackKey}>
              <button
                type="button"
                onClick={() => toggleSection(trackKey)}
                className="w-full flex items-center justify-between text-left mb-1.5"
              >
                <div>
                  <span className={`text-xs font-bold ${c.icon}`}>
                    {ui.emoji} {ui.label}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">⏱ {ui.time}</span>
                </div>
                <span className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">{eligibleList.length}</span>
                  {collapsed[trackKey]
                    ? <ChevronDown className="w-3 h-3 text-gray-400" />
                    : <ChevronUp className="w-3 h-3 text-gray-400" />
                  }
                </span>
              </button>
              {!collapsed[trackKey] && (
                <div className="space-y-1">
                  {eligibleList.map((visa) => (
                    <div key={visa.visaCode} className={`flex items-center gap-2 px-2.5 py-1.5 ${c.bg} rounded-lg`}>
                      <CheckCircle className={`w-3.5 h-3.5 ${c.icon} shrink-0`} />
                      <span className={`text-xs font-semibold ${c.text}`}>
                        {visa.visaCode}
                      </span>
                      <span className={`text-xs ${c.icon} opacity-80`}>
                        {visa.visaName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {totalEligible === 0 && (
          <div className="text-center py-6">
            <XCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">현재 조건으로 채용 가능한 비자가 없습니다</p>
            <p className="text-xs text-gray-500 mt-1">연봉이나 직종 조건을 조정해보세요</p>
          </div>
        )}
      </div>
    </Panel>
  );
}
