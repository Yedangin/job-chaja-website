/**
 * 실시간 비자 필터링 인디케이터 (API 기반)
 * Live visa filtering indicator (API-based)
 * - 백엔드 API에서 비자 규칙을 가져와 실시간 필터링
 * - Fetches visa rules from backend API and performs real-time filtering
 */

'use client';

import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';
import type { FulltimeJobFormData } from './fulltime-types';
import { fetchVisaFilterRules, type VisaFilterRule } from '../api';

interface LiveVisaIndicatorProps {
  form: FulltimeJobFormData;
}

// 학력 순서 / Education level order
const EDUCATION_ORDER: Record<string, number> = {
  HIGH_SCHOOL: 0,
  ASSOCIATE: 1,
  BACHELOR: 2,
  MASTER: 3,
  DOCTORATE: 4,
};

export default function LiveVisaIndicator({ form }: LiveVisaIndicatorProps) {
  const [allVisas, setAllVisas] = useState<VisaFilterRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기 로드 시 비자 규칙 가져오기 / Fetch visa rules on initial load
  useEffect(() => {
    const loadVisaRules = async () => {
      try {
        setLoading(true);
        const response = await fetchVisaFilterRules();
        setAllVisas(response.visas);
        setError(null);
      } catch (err) {
        console.error('비자 규칙 로드 실패:', err);
        setError('비자 규칙을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadVisaRules();
  }, []);

  // 실시간 필터링 / Real-time filtering
  const availableVisas = useMemo(() => {
    if (allVisas.length === 0) return [];

    let visas = [...allVisas];

    // 0. 인턴 선택 시 E-7 비자 제외 (D-10, F비자만 가능)
    // For INTERN employment type, exclude all E-7 visas (only D-10 and F visas allowed)
    if (form.employmentType === 'INTERN') {
      visas = visas.filter((v) => {
        // F비자 (IMMEDIATE 트랙) 허용
        if (v.hiringTrack === 'IMMEDIATE') return true;
        // D-10 (TRANSITION 트랙 중 D-10만) 허용
        if (v.hiringTrack === 'TRANSITION' && v.visaCode === 'D-10') return true;
        // 나머지 모두 제외 (E-7 비자, D-2, D-4, SPONSOR 트랙 전체)
        return false;
      });
    }

    // 1. 직종 조건 체크 / Check job category requirement
    if (form.jobCategoryCode) {
      visas = visas.filter((v) => {
        if (v.allowedJobCategories === null) return true; // 모든 직종 가능 / All jobs allowed
        return v.allowedJobCategories.includes(form.jobCategoryCode);
      });
    }

    // 2. 해외 채용 불가능 시 requiresOverseasHire=true 비자 제거
    // Remove visas requiring overseas hire when not willing
    if (!form.overseasHireWilling) {
      visas = visas.filter((v) => !v.requiresOverseasHire);
    }

    // 3. 연봉 조건 체크 / Check salary requirement
    if (form.salaryMin > 0) {
      visas = visas.filter((v) => {
        if (v.minSalary === null) return true; // 제한 없음 / No limit
        return form.salaryMin >= v.minSalary;
      });
    }

    // 4. 학력 조건 체크 / Check education requirement
    if (form.educationLevel) {
      const userEducationLevel = EDUCATION_ORDER[form.educationLevel] ?? 0;
      visas = visas.filter((v) => {
        if (v.minEducation === null) return true; // 제한 없음 / No limit
        const requiredLevel = EDUCATION_ORDER[v.minEducation] ?? 0;
        return userEducationLevel >= requiredLevel;
      });
    }

    // 5. 경력 조건 체크 (D-2 필터링) / Check experience level requirement (D-2 filtering)
    // D-2는 신입 채용(ENTRY)만 가능, 경력 요구 시 제외
    // D-2 is only for entry-level hiring, excluded when experience is required
    if (form.experienceLevel) {
      visas = visas.filter((v) => {
        if (v.requiresEntryLevel && form.experienceLevel !== 'ENTRY') {
          return false; // D-2는 경력 요구 시 제외 / Exclude D-2 when experience is required
        }
        return true;
      });
    }

    return visas;
  }, [allVisas, form.employmentType, form.jobCategoryCode, form.overseasHireWilling, form.salaryMin, form.educationLevel, form.experienceLevel]);

  // 트랙별 그룹화 / Group by track
  const visasByTrack = useMemo(() => {
    const grouped: Record<string, VisaFilterRule[]> = {
      IMMEDIATE: [],
      SPONSOR: [],
      TRANSITION: [],
      TRANSFER: [],
    };
    availableVisas.forEach((visa) => {
      grouped[visa.hiringTrack]?.push(visa);
    });

    return grouped;
  }, [availableVisas]);

  const totalCount = availableVisas.length;
  const initialCount = allVisas.length;
  const filteredCount = initialCount - totalCount;

  // 로딩 중 / Loading state
  if (loading) {
    return (
      <div className="fixed bottom-20 right-6 w-80 bg-white border-2 border-gray-300 rounded-xl shadow-2xl p-4 z-50">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          <span className="ml-3 text-sm text-gray-600">비자 규칙 로드 중...</span>
        </div>
      </div>
    );
  }

  // 에러 상태 / Error state
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

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white border-2 border-blue-500 rounded-xl shadow-2xl p-4 z-50">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-900">📊 실시간 비자 분석</h4>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">{totalCount}</span>
            <span className="text-xs text-gray-500">/ {initialCount}</span>
          </div>
        </div>
        {filteredCount > 0 && (
          <p className="text-xs text-gray-600">
            {filteredCount}개 비자가 조건에 맞지 않아 제외되었습니다
          </p>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {/* 🟢 IMMEDIATE — 즉시채용 */}
        {visasByTrack.IMMEDIATE.length > 0 && (
          <div>
            <div className="mb-2">
              <div className="text-xs font-bold text-green-600">
                🟢 IMMEDIATE — 즉시채용 ⏱ 즉시
              </div>
              <div className="text-xs text-gray-500 pl-5">[비자절차 불필요]</div>
            </div>
            <div className="space-y-1">
              {visasByTrack.IMMEDIATE.map((visa) => (
                <div
                  key={visa.visaCode}
                  className="flex items-center gap-2 p-2 bg-green-50 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-green-900">
                    {visa.visaCode} ({visa.visaName})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🟡 TRANSITION — E-7 전환 */}
        {visasByTrack.TRANSITION.length > 0 && (
          <div>
            <div className="mb-2">
              <div className="text-xs font-bold text-yellow-600">
                🟡 TRANSITION — E-7 전환 ⏱ 3~4주
              </div>
              <div className="text-xs text-gray-500 pl-5">[체류자격 변경 필요]</div>
            </div>
            <div className="space-y-1">
              {visasByTrack.TRANSITION.map((visa) => (
                <div
                  key={visa.visaCode}
                  className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-yellow-900">
                    {visa.visaCode} ({visa.visaName})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🟠 TRANSFER — E-7 이직 */}
        {visasByTrack.TRANSFER.length > 0 && (
          <div>
            <div className="mb-2">
              <div className="text-xs font-bold text-orange-600">
                🟠 TRANSFER — E-7 이직 ⏱ 1~2주
              </div>
              <div className="text-xs text-gray-500 pl-5">[근무처 변경]</div>
            </div>
            <div className="space-y-1">
              {visasByTrack.TRANSFER.map((visa) => (
                <div
                  key={`${visa.visaCode}-${visa.hiringTrack}`}
                  className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-orange-900">
                    {visa.visaCode} ({visa.visaName})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔵 SPONSOR — E-7 해외초청 */}
        {visasByTrack.SPONSOR.length > 0 && (
          <div>
            <div className="mb-2">
              <div className="text-xs font-bold text-blue-600">
                🔵 SPONSOR — E-7 해외초청 ⏱ 4~8주
              </div>
              <div className="text-xs text-gray-500 pl-5">[신규발급 필요]</div>
            </div>
            <div className="space-y-1">
              {visasByTrack.SPONSOR.map((visa) => (
                <div
                  key={`${visa.visaCode}-${visa.hiringTrack}`}
                  className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-blue-900">
                    {visa.visaCode} ({visa.visaName})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalCount === 0 && (
          <div className="text-center py-8">
            <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              현재 조건으로 채용 가능한 비자가 없습니다
            </p>
            <p className="text-xs text-gray-500 mt-1">
              연봉이나 학력 조건을 조정해보세요
            </p>
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
