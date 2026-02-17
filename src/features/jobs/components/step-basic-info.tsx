'use client';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { CategorySelector } from './category-selector';
import type { JobCreateFormData, BoardType } from '../types/job-create.types';

interface StepBasicInfoProps {
  form: JobCreateFormData;
  errors: Record<string, string>;
  onUpdate: (updates: Partial<JobCreateFormData>) => void;
  onBoardTypeChange: (boardType: BoardType) => void;
}

/**
 * Step 1: 기본정보 / Basic information
 * 공고 제목, 직종, 고용형태, 모집인원
 * Title, category, employment type, headcount
 */
export function StepBasicInfo({ form, errors, onUpdate, onBoardTypeChange }: StepBasicInfoProps) {
  // 고용형태 → boardType + employmentSubType 매핑
  // Employment type → boardType + employmentSubType mapping
  const employmentOptions = [
    { boardType: 'FULL_TIME' as BoardType, subType: 'PERMANENT', label: '정규직' },
    { boardType: 'FULL_TIME' as BoardType, subType: 'CONTRACT', label: '계약직' },
    { boardType: 'FULL_TIME' as BoardType, subType: 'INTERNSHIP', label: '인턴' },
    { boardType: 'PART_TIME' as BoardType, subType: '', label: '아르바이트' },
  ];

  const currentEmployment = form.boardType === 'PART_TIME'
    ? 'PART_TIME'
    : form.employmentSubType || 'PERMANENT';

  const handleEmploymentChange = (opt: typeof employmentOptions[number]) => {
    onBoardTypeChange(opt.boardType);
    onUpdate({ employmentSubType: opt.subType as JobCreateFormData['employmentSubType'] });
  };

  return (
    <div className="space-y-6">
      {/* 공고 제목 / Job title */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          공고 제목 <span className="text-red-500">*</span>
        </label>
        <Input
          value={form.title}
          onChange={e => onUpdate({ title: e.target.value })}
          placeholder="예: [E-9] 제조업 생산직 외국인 근로자 모집"
          maxLength={100}
          className={errors.title ? 'border-red-500' : ''}
        />
        <div className="flex justify-between mt-1">
          {errors.title
            ? <p className="text-xs text-red-500">{errors.title}</p>
            : <span />
          }
          <p className="text-xs text-gray-400">{form.title.length}/100</p>
        </div>
      </div>

      {/* 모집 직종 / Job category */}
      <CategorySelector
        selected={form.jobCategory}
        onChange={categories => onUpdate({ jobCategory: categories })}
        error={errors.jobCategory}
      />

      {/* 고용 형태 / Employment type */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          고용 형태 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {employmentOptions.map(opt => {
            const isSelected =
              opt.boardType === 'PART_TIME'
                ? form.boardType === 'PART_TIME'
                : form.boardType === 'FULL_TIME' && form.employmentSubType === opt.subType;

            return (
              <button
                key={opt.subType || 'PART_TIME'}
                type="button"
                onClick={() => handleEmploymentChange(opt)}
                className={`px-4 py-2.5 text-sm rounded-lg border transition ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-medium'
                    : 'text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {errors.boardType && <p className="text-xs text-red-500 mt-1">{errors.boardType}</p>}
      </div>

      {/* 모집 인원 / Headcount */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">모집 인원</label>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            value={form.headcount === 0 ? '' : form.headcount}
            onChange={e => onUpdate({ headcount: parseInt(e.target.value) || 0 })}
            min="0"
            className="w-28"
            disabled={form.headcount === 0}
          />
          <span className="text-sm text-gray-500">명</span>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <Checkbox
              checked={form.headcount === 0}
              onCheckedChange={c => onUpdate({ headcount: c ? 0 : 1 })}
            />
            인원 미정
          </label>
        </div>
      </div>
    </div>
  );
}
