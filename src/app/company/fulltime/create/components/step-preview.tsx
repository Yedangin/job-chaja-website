/**
 * Step 5: 미리보기 + 등록
 * Step 5: Preview + Submit
 */

'use client';

import { Edit2 } from 'lucide-react';
import type { FulltimeJobFormData, WizardStep } from './fulltime-types';
import { useFulltimeCopy } from '../copy';

interface StepPreviewProps {
  form: FulltimeJobFormData;
  onGoToStep: (step: WizardStep) => void;
}

export default function StepPreview({ form, onGoToStep }: StepPreviewProps) {
  const copy = useFulltimeCopy();
  const employmentLabel = {
    REGULAR: copy.regular, CONTRACT: copy.contract, INTERN: copy.intern, ALBA: copy.partTime,
  }[form.employmentType] || '-';
  const experienceLabel = {
    ENTRY: copy.entry, JUNIOR: copy.junior, SENIOR: copy.senior, EXPERT: copy.expert,
  }[form.experienceLevel] || '-';
  const educationLabel = {
    HIGH_SCHOOL: copy.highSchool, ASSOCIATE: copy.associate, BACHELOR: copy.bachelor,
    MASTER: copy.master, DOCTORATE: copy.doctorate,
  }[form.educationLevel] || '-';
  const benefitLabel: Record<string, string> = {
    MEAL: copy.meal, TRANSPORTATION: copy.transportation, ACCOMMODATION: copy.accommodation,
    INSURANCE: copy.insurance, RETIREMENT: copy.retirement, EDUCATION: copy.training,
    CHILDCARE: copy.childcare, ANNUAL_LEAVE: copy.annualLeave, HEALTH_CHECKUP: copy.healthCheckup, VACATION: copy.vacation,
  };
  const applicationLabel = {
    PLATFORM: copy.online, EMAIL: copy.email, PHONE: copy.phone, VISIT: copy.visit,
  }[form.applicationMethod] || '-';
  return (
    <div className="space-y-6">
      <div className="bg-[#F9FAFB] border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {copy.previewTitle}
        </h2>
        <p className="text-sm text-gray-600">
          {copy.previewHelp}
        </p>
      </div>

      {/* Step 1 미리보기 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">{copy.stepBasic}</h3>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" aria-hidden="true" />
            {copy.edit}
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-[minmax(6rem,9rem)_minmax(0,1fr)] gap-2">
            <span className="text-gray-600">{copy.jobCategory}:</span>
            <span className="font-semibold break-words">{form.jobCategoryCode || '-'}</span>
          </div>
          <div className="grid grid-cols-[minmax(6rem,9rem)_minmax(0,1fr)] gap-2">
            <span className="text-gray-600">{copy.employmentType}:</span>
            <span className="font-semibold break-words">{employmentLabel}</span>
          </div>
          <div className="grid grid-cols-[minmax(6rem,9rem)_minmax(0,1fr)] gap-2">
            <span className="text-gray-600">{copy.salary}:</span>
            <span className="font-semibold break-words">
              {form.salaryMin.toLocaleString()} {copy.wonYear} - {form.salaryMax.toLocaleString()} {copy.wonYear}
            </span>
          </div>
          <div className="grid grid-cols-[minmax(6rem,9rem)_minmax(0,1fr)] gap-2">
            <span className="text-gray-600">{copy.experience}:</span>
            <span className="font-semibold break-words">{experienceLabel}</span>
          </div>
          <div className="grid grid-cols-[minmax(6rem,9rem)_minmax(0,1fr)] gap-2">
            <span className="text-gray-600">{copy.education}:</span>
            <span className="font-semibold break-words">{educationLabel}</span>
          </div>
          <div className="grid grid-cols-[minmax(6rem,9rem)_minmax(0,1fr)] gap-2">
            <span className="text-gray-600">{copy.overseas}:</span>
            <span className="font-semibold">
              {form.overseasHireWilling ? copy.yes : copy.no}
            </span>
          </div>
        </div>
      </div>

      {/* Step 2 미리보기 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">{copy.stepConditions}</h3>
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            {copy.edit}
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-[minmax(6rem,9rem)_minmax(0,1fr)] gap-2">
            <span className="text-gray-600">{copy.address}:</span>
            <span className="font-semibold break-words">
              {form.address.sido} {form.address.sigungu} {form.address.detail}
            </span>
          </div>
          <div className="grid grid-cols-[minmax(6rem,9rem)_minmax(0,1fr)] gap-2">
            <span className="text-gray-600">{copy.preferredMajors}:</span>
            <span className="font-semibold break-words">
              {form.preferredMajors.length > 0
                ? form.preferredMajors.join(', ')
                : copy.none}
            </span>
          </div>
          <div className="grid grid-cols-[minmax(6rem,9rem)_minmax(0,1fr)] gap-2">
            <span className="text-gray-600">{copy.recruitCount}:</span>
            <span className="font-semibold">{form.recruitCount} {copy.people}</span>
          </div>
        </div>
      </div>

      {/* Step 3 미리보기 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">{copy.stepDetails}</h3>
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            {copy.edit}
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-600">{copy.title}:</span>
            <p className="font-semibold mt-1">{form.title}</p>
          </div>
          <div>
            <span className="text-gray-600">{copy.description}:</span>
            <p className="mt-1 text-gray-700 whitespace-pre-wrap">
              {form.detailDescription}
            </p>
          </div>
          <div>
            <span className="text-gray-600">{copy.benefitsLabel}:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="px-3 py-1 bg-blue-50 text-blue-900 rounded-full text-xs font-semibold"
                >
                  {benefitLabel[benefit] || benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 4 미리보기 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">{copy.applicationSettings}</h3>
          <button
            type="button"
            onClick={() => onGoToStep(4)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            {copy.edit}
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-[minmax(6rem,9rem)_minmax(0,1fr)] gap-2">
            <span className="text-gray-600">{copy.application}:</span>
            <span className="font-semibold break-words">{applicationLabel}</span>
          </div>
          <div className="grid grid-cols-[minmax(6rem,9rem)_minmax(0,1fr)] gap-2">
            <span className="text-gray-600">{copy.deadline}:</span>
            <span className="font-semibold">
              {form.isOpenEnded
                ? copy.openEnded
                : form.applicationDeadline || '-'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <p className="text-sm text-blue-900">
          {copy.reviewTip}
        </p>
      </div>
    </div>
  );
}
