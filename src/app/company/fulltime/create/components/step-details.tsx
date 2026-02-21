/**
 * Step 3: 상세 내용
 * Step 3: Details
 * - 제목, 설명, 복리후생
 * - Title, description, benefits
 */

'use client';

import { FileText, Info } from 'lucide-react';
import type { FulltimeJobFormData, BenefitType, BENEFIT_LABELS } from './fulltime-types';

interface StepDetailsProps {
  form: FulltimeJobFormData;
  errors: Record<string, string>;
  updateForm: <K extends keyof FulltimeJobFormData>(
    key: K,
    value: FulltimeJobFormData[K]
  ) => void;
}

const benefitLabels: Record<BenefitType, string> = {
  MEAL: '식대 지원',
  TRANSPORTATION: '교통비 지원',
  ACCOMMODATION: '숙소 제공',
  INSURANCE: '4대보험',
  RETIREMENT: '퇴직금',
  EDUCATION: '교육 지원',
  CHILDCARE: '육아 지원',
  ANNUAL_LEAVE: '연차',
  HEALTH_CHECKUP: '건강검진',
  VACATION: '휴가비',
};

export default function StepDetails({
  form,
  errors,
  updateForm,
}: StepDetailsProps) {
  // 복리후생 토글 / Toggle benefit
  const toggleBenefit = (benefit: BenefitType) => {
    if (form.benefits.includes(benefit)) {
      updateForm(
        'benefits',
        form.benefits.filter((b) => b !== benefit)
      );
    } else {
      updateForm('benefits', [...form.benefits, benefit]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 공고 제목 / Job title */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">공고 제목</h3>
          <span className="text-red-500 text-sm">*</span>
        </div>

        <input
          type="text"
          value={form.title}
          onChange={(e) => updateForm('title', e.target.value)}
          placeholder="예: 시니어 백엔드 개발자 채용 (E-7 비자 스폰서 가능)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={100}
        />

        {errors.title && (
          <p className="mt-2 text-sm text-red-600">{errors.title}</p>
        )}

        <p className="mt-2 text-xs text-gray-500">
          {form.title.length}/100자 • 지원자의 관심을 끄는 명확한 제목을 작성하세요
        </p>
      </div>

      {/* 상세 설명 / Detail description */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">상세 설명</h3>
          <span className="text-red-500 text-sm">*</span>
        </div>

        <textarea
          value={form.detailDescription}
          onChange={(e) => updateForm('detailDescription', e.target.value)}
          placeholder={`회사 소개, 주요 업무, 필요 기술 등을 작성하세요.\n\n예시:\n• 회사 소개: 저희는 AI 기반 솔루션을 개발하는 스타트업입니다.\n• 주요 업무: 백엔드 API 설계 및 개발, 데이터베이스 최적화\n• 필요 기술: Node.js, TypeScript, PostgreSQL, AWS\n• 우대 사항: Docker, Kubernetes 경험자`}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px] resize-y"
          maxLength={2000}
        />

        {errors.detailDescription && (
          <p className="mt-2 text-sm text-red-600">{errors.detailDescription}</p>
        )}

        <p className="mt-2 text-xs text-gray-500">
          {form.detailDescription.length}/2000자
        </p>
      </div>

      {/* 복리후생 / Benefits */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">복리후생</h3>
          <span className="text-gray-400 text-sm">(선택, 최대 10개)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {(Object.keys(benefitLabels) as BenefitType[]).map((benefit) => (
            <button
              key={benefit}
              type="button"
              onClick={() => toggleBenefit(benefit)}
              className={`p-4 border-2 rounded-lg transition text-sm font-medium ${
                form.benefits.includes(benefit)
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {form.benefits.includes(benefit) && (
                <span className="mr-1">✓</span>
              )}
              {benefitLabels[benefit]}
            </button>
          ))}
        </div>

        <p className="mt-3 text-xs text-gray-500">
          💡 제공하는 복리후생을 모두 선택하세요
        </p>
      </div>
    </div>
  );
}
