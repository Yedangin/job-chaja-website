'use client';

import { BenefitSelector } from './benefit-selector';
import type { JobCreateFormData } from '../types/job-create.types';

interface StepDetailsProps {
  form: JobCreateFormData;
  errors: Record<string, string>;
  onUpdate: (updates: Partial<JobCreateFormData>) => void;
}

/**
 * Step 3: 상세내용 / Job details
 * 업무 내용, 자격 요건, 우대 사항, 복리후생
 * Job description, requirements, preferences, benefits
 */
export function StepDetails({ form, errors, onUpdate }: StepDetailsProps) {
  return (
    <div className="space-y-6">
      {/* 주요 업무 내용 / Job description */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          주요 업무 내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.jobDescription}
          onChange={e => onUpdate({ jobDescription: e.target.value })}
          rows={6}
          placeholder="담당할 업무 내용을 상세하게 작성해주세요 (최소 30자)"
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
            errors.jobDescription ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.jobDescription
            ? <p className="text-xs text-red-500">{errors.jobDescription}</p>
            : <span />
          }
          <p className={`text-xs ${form.jobDescription.length < 30 ? 'text-gray-400' : 'text-green-600'}`}>
            {form.jobDescription.length}자
          </p>
        </div>
      </div>

      {/* 자격 요건 / Requirements */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">자격 요건</label>
        <textarea
          value={form.requirements}
          onChange={e => onUpdate({ requirements: e.target.value })}
          rows={4}
          placeholder="필수 자격 요건을 작성해주세요"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {/* 우대 사항 / Preferred qualifications */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">우대 사항</label>
        <textarea
          value={form.preferredQualifications}
          onChange={e => onUpdate({ preferredQualifications: e.target.value })}
          rows={3}
          placeholder="우대 사항이 있으면 작성해주세요"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {/* 복리후생 / Benefits */}
      <BenefitSelector
        selected={form.benefits}
        onChange={benefits => onUpdate({ benefits })}
      />
    </div>
  );
}
