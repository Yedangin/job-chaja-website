'use client';

/**
 * Step 7: 희망 근무조건 / Work preferences
 * 고용형태, 업종, 지역, 급여, 자기소개
 * Employment type, industry, region, salary, self-introduction
 */

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, MapPin, Briefcase, Banknote } from 'lucide-react';
import { EmploymentType, SalaryType } from '../types';
import type { PreferencesData } from '../types';
import { INDUSTRY_OPTIONS, REGION_OPTIONS } from '../mock-data';

interface Step7PreferencesProps {
  /** 현재 데이터 / Current data */
  data: PreferencesData;
  /** 데이터 변경 핸들러 / Data change handler */
  onChange: (data: PreferencesData) => void;
}

/** 고용형태 옵션 / Employment type options */
const EMPLOYMENT_OPTIONS: { value: EmploymentType; label: string; labelEn: string; icon: string }[] = [
  { value: EmploymentType.FULL_TIME, label: '정규직', labelEn: 'Full-time', icon: '💼' },
  { value: EmploymentType.PART_TIME, label: '아르바이트', labelEn: 'Part-time', icon: '⏰' },
  { value: EmploymentType.CONTRACT, label: '계약직', labelEn: 'Contract', icon: '📝' },
  { value: EmploymentType.INTERN, label: '인턴', labelEn: 'Intern', icon: '🎓' },
];

/** 급여 유형 옵션 / Salary type options */
const SALARY_TYPE_OPTIONS: { value: SalaryType; label: string; labelEn: string }[] = [
  { value: SalaryType.HOURLY, label: '시급', labelEn: 'Hourly' },
  { value: SalaryType.MONTHLY, label: '월급', labelEn: 'Monthly' },
  { value: SalaryType.ANNUAL, label: '연봉', labelEn: 'Annual' },
];

/** 급여 단위 표시 / Salary unit display */
const SALARY_UNIT: Record<SalaryType, string> = {
  HOURLY: '원/시간',
  MONTHLY: '만원/월',
  ANNUAL: '만원/년',
};

/** 급여 플레이스홀더 / Salary placeholder */
const SALARY_PLACEHOLDER: Record<SalaryType, { min: string; max: string }> = {
  HOURLY: { min: '9,860', max: '15,000' },
  MONTHLY: { min: '200', max: '350' },
  ANNUAL: { min: '2,400', max: '4,200' },
};

export default function Step7Preferences({ data, onChange }: Step7PreferencesProps) {
  /** 필드 업데이트 헬퍼 / Field update helper */
  const updateField = <K extends keyof PreferencesData>(
    key: K,
    value: PreferencesData[K],
  ) => {
    onChange({ ...data, [key]: value });
  };

  /** 토글 배열 항목 / Toggle array item */
  const toggleArrayItem = <K extends 'employmentTypes' | 'industries' | 'regions'>(
    key: K,
    value: string,
  ) => {
    const current = data[key] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateField(key, updated as PreferencesData[K]);
  };

  /** 자기소개 글자 수 / Introduction character count */
  const introLength = data.introduction.length;
  const maxIntroLength = 500;

  return (
    <div className="space-y-6">
      {/* 고용형태 / Employment type */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-500" />
          <Label className="text-sm text-gray-700 font-semibold">
            희망 고용형태 <span className="text-gray-400 font-normal">/ Employment Type</span>
          </Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {EMPLOYMENT_OPTIONS.map((opt) => {
            const isSelected = data.employmentTypes.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleArrayItem('employmentTypes', opt.value)}
                className={cn(
                  'min-h-[52px] rounded-xl p-3 text-left transition-all border-2',
                  'focus:outline-none focus:ring-2 focus:ring-blue-300',
                  isSelected
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50',
                )}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{opt.icon}</span>
                  <div>
                    <p className={cn(
                      'text-sm font-medium',
                      isSelected ? 'text-blue-700' : 'text-gray-700',
                    )}>
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-gray-400">{opt.labelEn}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 희망 업종 / Preferred industry */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-400" />
          <Label className="text-sm text-gray-700 font-semibold">
            희망 업종 <span className="text-gray-400 font-normal">/ Industry</span>
            <span className="text-xs text-gray-400 ml-2">(최대 5개 / Max 5)</span>
          </Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {INDUSTRY_OPTIONS.map((opt) => {
            const isSelected = data.industries.includes(opt.value);
            const isDisabled = !isSelected && data.industries.length >= 5;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => !isDisabled && toggleArrayItem('industries', opt.value)}
                disabled={isDisabled}
                className={cn(
                  'px-3 min-h-[36px] rounded-full text-xs font-medium transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-blue-300',
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : isDisabled
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                )}
                aria-pressed={isSelected}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 희망 근무지역 / Preferred region */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-500" />
          <Label className="text-sm text-gray-700 font-semibold">
            희망 근무지역 <span className="text-gray-400 font-normal">/ Region</span>
            <span className="text-xs text-gray-400 ml-2">(최대 5개 / Max 5)</span>
          </Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {REGION_OPTIONS.map((opt) => {
            const isSelected = data.regions.includes(opt.value);
            const isDisabled = !isSelected && data.regions.length >= 5;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => !isDisabled && toggleArrayItem('regions', opt.value)}
                disabled={isDisabled}
                className={cn(
                  'px-3 min-h-[36px] rounded-full text-xs font-medium transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-blue-300',
                  isSelected
                    ? 'bg-green-500 text-white'
                    : isDisabled
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                )}
                aria-pressed={isSelected}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 희망 급여 / Preferred salary */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Banknote className="w-4 h-4 text-amber-500" />
          <Label className="text-sm text-gray-700 font-semibold">
            희망 급여 <span className="text-gray-400 font-normal">/ Salary</span>
          </Label>
        </div>

        {/* 급여 유형 / Salary type */}
        <div className="flex gap-2">
          {SALARY_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                updateField('salaryType', opt.value);
                updateField('salaryMin', 0);
                updateField('salaryMax', 0);
              }}
              className={cn(
                'flex-1 min-h-[40px] rounded-xl text-sm font-medium transition-all',
                'focus:outline-none focus:ring-2 focus:ring-blue-300',
                data.salaryType === opt.value
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200',
              )}
              aria-pressed={data.salaryType === opt.value}
            >
              {opt.label}
              <span className="text-xs opacity-70 ml-0.5">{opt.labelEn}</span>
            </button>
          ))}
        </div>

        {/* 급여 범위 / Salary range */}
        {data.salaryType && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">
                최소 <span className="text-gray-400">/ Min</span>
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={data.salaryMin || ''}
                  onChange={(e) => updateField('salaryMin', Number(e.target.value))}
                  placeholder={SALARY_PLACEHOLDER[data.salaryType].min}
                  className="min-h-[44px] rounded-xl pr-14"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {SALARY_UNIT[data.salaryType]}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">
                최대 <span className="text-gray-400">/ Max</span>
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={data.salaryMax || ''}
                  onChange={(e) => updateField('salaryMax', Number(e.target.value))}
                  placeholder={SALARY_PLACEHOLDER[data.salaryType].max}
                  className="min-h-[44px] rounded-xl pr-14"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {SALARY_UNIT[data.salaryType]}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 자기소개 / Self-introduction */}
      <div className="space-y-2">
        <Label className="text-sm text-gray-700 font-semibold">
          자기소개 <span className="text-gray-400 font-normal">/ Introduction</span>
        </Label>
        <textarea
          value={data.introduction}
          onChange={(e) => {
            if (e.target.value.length <= maxIntroLength) {
              updateField('introduction', e.target.value);
            }
          }}
          placeholder={
            '간단한 자기소개를 작성해주세요.\n예: 성실하고 책임감 있게 일하겠습니다.\n\nPlease write a brief self-introduction.\nEx: I am diligent and responsible.'
          }
          rows={5}
          className="w-full min-h-[120px] px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none leading-relaxed"
        />
        <div className="flex justify-end">
          <span
            className={cn(
              'text-xs',
              introLength > maxIntroLength * 0.9 ? 'text-amber-500' : 'text-gray-400',
            )}
          >
            {introLength} / {maxIntroLength}
          </span>
        </div>
      </div>
    </div>
  );
}
