'use client';

import { Input } from '@/components/ui/input';
import { SalaryInput } from './salary-input';
import { AddressSearchModal } from './address-search-modal';
import { DAY_LABELS } from '../types/job-create.types';
import type { JobCreateFormData, SalaryType, ExperienceLevel, EducationLevel } from '../types/job-create.types';

interface StepWorkConditionsProps {
  form: JobCreateFormData;
  errors: Record<string, string>;
  onUpdate: (updates: Partial<JobCreateFormData>) => void;
}

/**
 * Step 2: 근무조건 / Work conditions
 * 주소, 근무시간, 급여, 경력/학력 (boardType에 따라 분기)
 * Address, work hours, salary, experience/education (branches by boardType)
 */
export function StepWorkConditions({ form, errors, onUpdate }: StepWorkConditionsProps) {
  const isPartTime = form.boardType === 'PART_TIME';

  const toggleWorkDay = (index: number) => {
    const newDays = [...form.workDays];
    newDays[index] = !newDays[index];
    onUpdate({ workDays: newDays });
  };

  return (
    <div className="space-y-6">
      {/* 근무지 주소 / Work location */}
      <AddressSearchModal
        address={form.address}
        addressDetail={form.addressDetail}
        onAddressChange={addr => onUpdate({ address: addr })}
        onAddressDetailChange={detail => onUpdate({ addressDetail: detail })}
        error={errors.address}
      />

      {/* 근무 요일 / Work days */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">근무 요일</label>
        <div className="flex gap-2">
          {DAY_LABELS.map((d, i) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleWorkDay(i)}
              className={`w-10 h-10 rounded-lg text-sm font-medium border transition ${
                form.workDays[i]
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'text-gray-400 border-gray-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* 근무 시간 / Work hours */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">근무 시작</label>
          <Input
            type="time"
            value={form.workTimeStart}
            onChange={e => onUpdate({ workTimeStart: e.target.value })}
            className={errors.workTimeStart ? 'border-red-500' : ''}
          />
          {errors.workTimeStart && <p className="text-xs text-red-500 mt-1">{errors.workTimeStart}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">근무 종료</label>
          <Input
            type="time"
            value={form.workTimeEnd}
            onChange={e => onUpdate({ workTimeEnd: e.target.value })}
            className={errors.workTimeEnd ? 'border-red-500' : ''}
          />
          {errors.workTimeEnd && <p className="text-xs text-red-500 mt-1">{errors.workTimeEnd}</p>}
        </div>
      </div>

      {/* 급여 / Salary */}
      <SalaryInput
        boardType={form.boardType}
        salaryType={form.salaryType}
        salaryAmount={form.salaryAmount}
        salaryMax={form.salaryMax}
        onSalaryTypeChange={(type: SalaryType) => onUpdate({ salaryType: type })}
        onSalaryAmountChange={val => onUpdate({ salaryAmount: val })}
        onSalaryMaxChange={val => onUpdate({ salaryMax: val })}
        errors={errors}
      />

      {/* 경력/학력 (정규직만) / Experience/Education (full-time only) */}
      {!isPartTime && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">경력 요건</label>
            <div className="space-y-2">
              {([
                { v: 'ANY', l: '경력무관' },
                { v: 'ENTRY', l: '신입' },
                { v: 'EXPERIENCED', l: '경력' },
              ] as const).map(opt => (
                <label key={opt.v} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="experienceLevel"
                    checked={form.experienceLevel === opt.v}
                    onChange={() => onUpdate({ experienceLevel: opt.v as ExperienceLevel })}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">{opt.l}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">학력 요건</label>
            <select
              value={form.educationLevel}
              onChange={e => onUpdate({ educationLevel: e.target.value as EducationLevel })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="ANY">학력 무관</option>
              <option value="HIGH_SCHOOL">고졸 이상</option>
              <option value="ASSOCIATE">초대졸 이상</option>
              <option value="BACHELOR">대졸 이상</option>
              <option value="MASTER">석사 이상</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
