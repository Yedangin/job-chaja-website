'use client';

import { useState } from 'react';
import type {
  AlbaJobFormData,
  AlbaVisaMatchingResponse,
  ApplicationMethod,
  VisaEvalResult,
} from '../../../a/types';
import { VisaInsightChart } from './visa-insight-chart';
import {
  Users, Clock, MapPin, DollarSign, Phone, Mail, User,
  Loader2, Zap, Eye,
} from 'lucide-react';

interface StepPreviewProps {
  /** 현재 폼 데이터 / Current form data */
  form: Partial<AlbaJobFormData>;
  /** 최종 등록 핸들러 / Final submit handler */
  onSubmit: () => void;
}

/** 접수 방법 라벨 / Application method labels */
const METHOD_LABELS: Record<ApplicationMethod, string> = {
  PLATFORM: '플랫폼 내 지원',
  PHONE: '전화 문의',
  EMAIL: '이메일 지원',
};

/** 더미 비자 매칭 결과 / Dummy visa matching result for preview */
const DUMMY_MATCH_RESULT: AlbaVisaMatchingResponse = {
  eligible: [
    { visaCode: 'F-5', visaName: '영주', visaNameEn: 'Permanent Residence', status: 'eligible', requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null, notes: '내국인과 동일한 취업 권리' },
    { visaCode: 'F-6', visaName: '결혼이민', visaNameEn: 'Marriage Immigration', status: 'eligible', requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null, notes: '내국인과 동일한 취업 권리' },
    { visaCode: 'F-2', visaName: '거주', visaNameEn: 'Residence', status: 'eligible', requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null, notes: '취업 제한 없음' },
    { visaCode: 'H-1', visaName: '워킹홀리데이', visaNameEn: 'Working Holiday', status: 'eligible', requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null, notes: '체류기간 최대 1년, 18~30세' },
  ],
  conditional: [
    { visaCode: 'D-2', visaName: '유학', visaNameEn: 'Study Abroad', status: 'conditional', conditions: ['체류자격외활동허가 필요', 'TOPIK 3급+ 필요 (평일 근무 시)'], requiredPermit: '체류자격외활동허가', maxWeeklyHours: 20, maxWorkplaces: 2, notes: '주말 근무는 시간 제한 없음' },
    { visaCode: 'H-2', visaName: '방문취업', visaNameEn: 'Visit & Employment', status: 'conditional', conditions: ['특례고용허가 필요 (일부 업종)'], requiredPermit: '특례고용허가', maxWeeklyHours: null, maxWorkplaces: null, notes: null },
    { visaCode: 'F-4', visaName: '재외동포', visaNameEn: 'Overseas Korean', status: 'conditional', conditions: ['단순노무 해당 시 예외 직종 확인 필요'], requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null, notes: null },
  ],
  blocked: [
    { visaCode: 'C-3', visaName: '단기방문', visaNameEn: 'Short-term Visit', status: 'blocked', blockReasons: ['취업 활동 불가 비자'], requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null, notes: null },
    { visaCode: 'B-1', visaName: '사증면제', visaNameEn: 'Visa Exemption', status: 'blocked', blockReasons: ['취업 활동 불가 비자'], requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null, notes: null },
  ],
  summary: { totalEligible: 4, totalConditional: 3, totalBlocked: 2 },
  matchedAt: new Date().toISOString(),
  inputSummary: {
    jobCategoryCode: 'REST_SERVING',
    ksicCode: 'I',
    weeklyHours: 15,
    isWeekendOnly: false,
    hasWeekdayShift: true,
    isDepopulationArea: false,
  },
};

/**
 * Step 3: 공고 미리보기 + 비자 매칭 결과 시각화 + 접수 설정
 * Step 3: Job preview + visa matching visualization + application settings
 *
 * 시안 E 특징: 좌우 2컬럼 레이아웃 (미리보기 | 비자 인사이트 + 접수설정)
 * Variant E feature: 2-column layout (Preview | Visa Insight + Application settings)
 */
export function StepPreview({ form, onSubmit }: StepPreviewProps) {
  const [matchResult, setMatchResult] = useState<AlbaVisaMatchingResponse | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  /** 비자 매칭 실행 (더미) / Execute visa matching (dummy) */
  const handleVisaMatch = async () => {
    setIsMatching(true);
    // TODO: POST /api/alba/visa-matching 호출 / Call visa matching API
    await new Promise((res) => setTimeout(res, 1500));
    setMatchResult(DUMMY_MATCH_RESULT);
    setIsMatching(false);
  };

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 / Section header */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          최종 확인
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          공고 내용을 확인하고 비자 매칭 결과를 미리 확인합니다. / Review and check visa matching.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 좌측: 공고 미리보기 / Left: Job preview */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">공고 미리보기 / Preview</h3>

          {/* 미리보기 카드 / Preview card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-4">
              <p className="text-xs text-gray-500">{form.jobCategoryCode}</p>
              <h4 className="text-lg font-bold text-gray-900 mt-1">{form.title || '(제목 미입력)'}</h4>
              <p className="text-lg font-bold text-blue-600 mt-1">
                시급 {(form.hourlyWage || 0).toLocaleString()}원
              </p>
            </div>
            <div className="p-4 space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{form.recruitCount || 0}명 모집</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                <span>주 {form.weeklyHours || 0}시간 ({form.schedule?.length || 0}일 근무)</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{form.address ? `${form.address.sido} ${form.address.sigungu}` : '(주소 미입력)'}</span>
              </div>
            </div>
          </div>

          {/* 상세 설명 미리보기 / Description preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">상세 설명</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              {form.detailDescription || '(상세 설명 미입력)'}
            </p>
          </div>

          {/* 복리후생 / Benefits */}
          {form.benefits && form.benefits.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">복리후생</h4>
              <div className="flex flex-wrap gap-2">
                {form.benefits.map((b) => (
                  <span key={b} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 우측: 비자 매칭 + 접수 설정 / Right: Visa matching + Application settings */}
        <div className="space-y-4">
          {/* 비자 매칭 결과 카드 / Visa matching result card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              비자 매칭 인사이트 / Visa Insight
            </h3>
            {!matchResult ? (
              <div className="text-center py-6">
                <Zap className="w-10 h-10 text-blue-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  공고 조건에 맞는 비자를 미리 확인해보세요
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Check which visas are compatible with this job posting
                </p>
                <button
                  type="button"
                  onClick={handleVisaMatch}
                  disabled={isMatching}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 min-h-11"
                  aria-label="비자 매칭 분석하기 / Analyze visa matching"
                >
                  {isMatching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      분석 중...
                    </>
                  ) : (
                    '비자 매칭 분석하기'
                  )}
                </button>
              </div>
            ) : (
              <VisaInsightChart matchResult={matchResult} />
            )}
          </div>

          {/* 접수 설정 / Application settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              접수 설정 / Application Settings
            </h3>

            {/* 접수 방법 / Application method */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">접수 방법</label>
              <div className="flex gap-2">
                {(['PLATFORM', 'PHONE', 'EMAIL'] as ApplicationMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition min-h-11
                      ${form.applicationMethod === method
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    aria-label={METHOD_LABELS[method]}
                  >
                    {METHOD_LABELS[method]}
                  </button>
                ))}
              </div>
            </div>

            {/* 담당자 정보 / Contact info */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-400" /> 담당자명
                </label>
                <input
                  value={form.contactName || ''}
                  readOnly
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-gray-50 text-sm"
                  aria-label="담당자명 / Contact name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> 연락처
                </label>
                <input
                  value={form.contactPhone || ''}
                  readOnly
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-gray-50 text-sm"
                  aria-label="연락처 / Contact phone"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> 이메일
                </label>
                <input
                  value={form.contactEmail || ''}
                  readOnly
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-gray-50 text-sm"
                  aria-label="이메일 / Contact email"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
