'use client';

import { Input } from '@/components/ui/input';
import { VisaResultCard } from './visa-result-card';
import type { JobCreateFormData, VisaMatchResult, WizardStep, ApplicationMethod } from '../types/job-create.types';

interface StepVisaMatchingProps {
  form: JobCreateFormData;
  errors: Record<string, string>;
  matchResult: VisaMatchResult | null;
  matchLoading: boolean;
  onUpdate: (updates: Partial<JobCreateFormData>) => void;
  onGoToStep: (step: WizardStep) => void;
}

/**
 * Step 4: 비자매칭 결과 + 접수설정 / Visa matching results + application settings
 * 자동 비자 매칭 결과 표시 + 접수 방법/기간 설정
 * Auto visa match results + application method/period settings
 */
export function StepVisaMatching({
  form,
  errors,
  matchResult,
  matchLoading,
  onUpdate,
  onGoToStep,
}: StepVisaMatchingProps) {
  return (
    <div className="space-y-6">
      {/* 비자 매칭 결과 / Visa matching results */}
      <VisaResultCard
        matchResult={matchResult}
        isLoading={matchLoading}
        onGoToStep={onGoToStep}
      />

      {/* 접수 설정 / Application settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-base font-bold text-gray-900">접수 설정</h2>

        {/* 접수 기간 / Application period */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              접수 시작일 <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={form.applicationStartDate}
              onChange={e => onUpdate({ applicationStartDate: e.target.value })}
              className={errors.applicationStartDate ? 'border-red-500' : ''}
            />
            {errors.applicationStartDate && (
              <p className="text-xs text-red-500 mt-1">{errors.applicationStartDate}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">접수 마감일</label>
            <Input
              type="date"
              value={form.applicationEndDate}
              onChange={e => onUpdate({ applicationEndDate: e.target.value })}
            />
          </div>
        </div>

        {/* 접수 방법 / Application method */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            접수 방법 <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {([
              { v: 'PLATFORM' as ApplicationMethod, l: '잡차자 접수' },
              { v: 'EMAIL' as ApplicationMethod, l: '이메일 접수' },
              { v: 'WEBSITE' as ApplicationMethod, l: '외부 링크' },
            ]).map(opt => (
              <label key={opt.v} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="applicationMethod"
                  checked={form.applicationMethod === opt.v}
                  onChange={() => onUpdate({ applicationMethod: opt.v })}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">{opt.l}</span>
              </label>
            ))}
          </div>
          {errors.applicationMethod && (
            <p className="text-xs text-red-500 mt-1">{errors.applicationMethod}</p>
          )}

          {/* 이메일 입력 / Email input */}
          {form.applicationMethod === 'EMAIL' && (
            <div className="mt-2">
              <Input
                type="email"
                value={form.externalEmail}
                onChange={e => onUpdate({ externalEmail: e.target.value })}
                placeholder="접수 이메일 주소"
                className={errors.externalEmail ? 'border-red-500' : ''}
              />
              {errors.externalEmail && (
                <p className="text-xs text-red-500 mt-1">{errors.externalEmail}</p>
              )}
            </div>
          )}

          {/* URL 입력 / URL input */}
          {form.applicationMethod === 'WEBSITE' && (
            <div className="mt-2">
              <Input
                type="url"
                value={form.externalUrl}
                onChange={e => onUpdate({ externalUrl: e.target.value })}
                placeholder="https://example.com/apply"
                className={errors.externalUrl ? 'border-red-500' : ''}
              />
              {errors.externalUrl && (
                <p className="text-xs text-red-500 mt-1">{errors.externalUrl}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
