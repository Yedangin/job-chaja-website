/**
 * Step 3: 상세 내용
 * Step 3: Details
 * - 제목, 설명, 복리후생
 * - Title, description, benefits
 */

'use client';

import { FileText, Info } from 'lucide-react';
import type { FulltimeJobFormData, BenefitType } from './fulltime-types';
import { useFulltimeCopy } from '../copy';

interface StepDetailsProps {
  form: FulltimeJobFormData;
  errors: Record<string, string>;
  updateForm: <K extends keyof FulltimeJobFormData>(
    key: K,
    value: FulltimeJobFormData[K]
  ) => void;
}

export default function StepDetails({
  form,
  errors,
  updateForm,
}: StepDetailsProps) {
  const copy = useFulltimeCopy();
  const benefitLabels: Record<BenefitType, string> = {
    MEAL: copy.meal, TRANSPORTATION: copy.transportation, ACCOMMODATION: copy.accommodation,
    INSURANCE: copy.insurance, RETIREMENT: copy.retirement, EDUCATION: copy.training,
    CHILDCARE: copy.childcare, ANNUAL_LEAVE: copy.annualLeave, HEALTH_CHECKUP: copy.healthCheckup,
    VACATION: copy.vacation,
  };
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
          <h3 className="text-lg font-bold text-gray-900">{copy.jobTitle}</h3>
          <span className="text-red-500 text-sm">*</span>
        </div>

        <input
          type="text"
          value={form.title}
          onChange={(e) => updateForm('title', e.target.value)}
          placeholder={copy.titlePlaceholder}
          aria-label={copy.jobTitle}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={100}
        />

        {errors.title && (
          <p className="mt-2 text-sm text-red-600">{errors.title}</p>
        )}

        <p className="mt-2 text-xs text-gray-500">
          {form.title.length}/100 - {copy.titleHelp}
        </p>
      </div>

      {/* 상세 설명 / Detail description */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">{copy.description}</h3>
          <span className="text-red-500 text-sm">*</span>
        </div>

        <textarea
          value={form.detailDescription}
          onChange={(e) => updateForm('detailDescription', e.target.value)}
          placeholder={copy.descriptionPlaceholder}
          aria-label={copy.description}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px] resize-y"
          maxLength={2000}
        />

        {errors.detailDescription && (
          <p className="mt-2 text-sm text-red-600">{errors.detailDescription}</p>
        )}

        <p className="mt-2 text-xs text-gray-500">
          {form.detailDescription.length}/2000
        </p>
      </div>

      {/* 복리후생 / Benefits */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">{copy.benefits}</h3>
          <span className="text-gray-400 text-sm">({copy.optionalMax5})</span>
        </div>

        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
              aria-pressed={form.benefits.includes(benefit)}
            >
              {form.benefits.includes(benefit) && (
                <span className="mr-1">✓</span>
              )}
              {benefitLabels[benefit]}
            </button>
          ))}
        </div>

        <p className="mt-3 text-xs text-gray-500">
          {copy.benefitTip}
        </p>
      </div>
    </div>
  );
}
