'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, AlertCircle, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SchedulePicker } from './schedule-picker';
import type { AlbaJobFormData, JobCategory } from '../types';
import { MOCK_JOB_CATEGORIES, MIN_HOURLY_WAGE } from '../mock-data';

/**
 * Step 1: 어떤 일인가요? (미니멀 스타일)
 * Step 1: What kind of work? (minimal style)
 *
 * 직종, 시급, 스케줄, 근무기간 입력
 * Job category, wage, schedule, work period input
 */

interface StepJobDetailsProps {
  form: AlbaJobFormData;
  onUpdate: (updates: Partial<AlbaJobFormData>) => void;
  errors: Record<string, string>;
}

export function StepJobDetails({ form, onUpdate, errors }: StepJobDetailsProps) {
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // 카테고리 필터링 / Filter categories
  const filteredCategories = useMemo(() => {
    if (!categorySearch) return MOCK_JOB_CATEGORIES;
    const lower = categorySearch.toLowerCase();
    return MOCK_JOB_CATEGORIES.filter(
      (c) => c.name.includes(lower) || c.nameEn.toLowerCase().includes(lower) || c.code.toLowerCase().includes(lower),
    );
  }, [categorySearch]);

  // 선택된 카테고리 표시 이름 / Selected category display name
  const selectedCategoryName = useMemo(() => {
    const found = MOCK_JOB_CATEGORIES.find((c) => c.code === form.jobCategoryCode);
    return found ? found.name : '';
  }, [form.jobCategoryCode]);

  // 시급 유효성 검사 / Wage validation
  const wageError = form.hourlyWage > 0 && form.hourlyWage < MIN_HOURLY_WAGE
    ? `최저시급(${MIN_HOURLY_WAGE.toLocaleString()}원) 이상이어야 합니다 / Must be at or above minimum wage`
    : errors.hourlyWage || '';

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 / Section header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          어떤 일인가요?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          직종과 근무 조건을 설정해주세요 <span className="text-gray-400">/ Set job category and work conditions</span>
        </p>
      </div>

      {/* 직종 선택 / Job category selector */}
      <div className="space-y-2">
        <Label htmlFor="jobCategory" className="text-sm font-medium text-gray-700">
          직종 <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal ml-1">/ Job Category</span>
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="jobCategory"
            type="text"
            value={showCategoryDropdown ? categorySearch : selectedCategoryName}
            onChange={(e) => {
              setCategorySearch(e.target.value);
              setShowCategoryDropdown(true);
            }}
            onFocus={() => {
              setShowCategoryDropdown(true);
              setCategorySearch('');
            }}
            placeholder="직종을 검색하세요 / Search job category"
            className={cn(
              'w-full min-h-[48px] pl-10 pr-4 rounded-2xl border bg-white text-sm outline-none transition-all',
              'focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
              errors.jobCategoryCode ? 'border-red-300' : 'border-gray-200',
            )}
            aria-label="직종 검색 / Job category search"
            role="combobox"
            aria-expanded={showCategoryDropdown}
          />
          {/* 드롭다운 / Dropdown */}
          {showCategoryDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
              {filteredCategories.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  검색 결과 없음 / No results found
                </div>
              ) : (
                filteredCategories.map((cat) => (
                  <button
                    key={cat.code}
                    type="button"
                    className={cn(
                      'w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl',
                      form.jobCategoryCode === cat.code && 'bg-blue-50 text-blue-700 font-medium',
                    )}
                    onClick={() => {
                      onUpdate({ jobCategoryCode: cat.code });
                      setCategorySearch('');
                      setShowCategoryDropdown(false);
                    }}
                    aria-label={`${cat.name} (${cat.nameEn})`}
                  >
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-gray-400 ml-2 text-xs">{cat.nameEn}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {/* 외부 클릭으로 닫기 / Close on outside click */}
        {showCategoryDropdown && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowCategoryDropdown(false)}
            aria-hidden="true"
          />
        )}
        {errors.jobCategoryCode && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.jobCategoryCode}
          </p>
        )}
      </div>

      {/* 직무 설명 / Job description */}
      <div className="space-y-2">
        <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">
          직무 설명
          <span className="text-gray-400 font-normal ml-1">/ Job Description</span>
        </Label>
        <textarea
          id="jobDescription"
          value={form.jobDescription}
          onChange={(e) => onUpdate({ jobDescription: e.target.value })}
          placeholder="어떤 일을 하게 되나요? / What will the worker do?"
          className={cn(
            'w-full min-h-[100px] px-4 py-3 rounded-2xl border bg-white text-sm outline-none transition-all resize-none',
            'focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
            'border-gray-200',
          )}
          aria-label="직무 설명 / Job description"
        />
      </div>

      {/* 모집인원 + 시급 / Recruit count + Hourly wage */}
      <div className="grid grid-cols-2 gap-4">
        {/* 모집인원 / Recruit count */}
        <div className="space-y-2">
          <Label htmlFor="recruitCount" className="text-sm font-medium text-gray-700">
            모집인원 <span className="text-red-500">*</span>
            <span className="text-gray-400 font-normal ml-1">/ Positions</span>
          </Label>
          <div className="relative">
            <Input
              id="recruitCount"
              type="number"
              min={1}
              value={form.recruitCount || ''}
              onChange={(e) => onUpdate({ recruitCount: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="min-h-[48px] rounded-2xl pr-10"
              aria-label="모집인원 / Number of positions"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              명
            </span>
          </div>
          {errors.recruitCount && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.recruitCount}
            </p>
          )}
        </div>

        {/* 시급 / Hourly wage */}
        <div className="space-y-2">
          <Label htmlFor="hourlyWage" className="text-sm font-medium text-gray-700">
            시급 <span className="text-red-500">*</span>
            <span className="text-gray-400 font-normal ml-1">/ Hourly Wage</span>
          </Label>
          <div className="relative">
            <Input
              id="hourlyWage"
              type="number"
              min={MIN_HOURLY_WAGE}
              step={100}
              value={form.hourlyWage || ''}
              onChange={(e) => onUpdate({ hourlyWage: parseInt(e.target.value) || 0 })}
              placeholder={MIN_HOURLY_WAGE.toLocaleString()}
              className={cn(
                'min-h-[48px] rounded-2xl pr-10',
                wageError && 'border-red-300 focus-visible:border-red-300',
              )}
              aria-label="시급 / Hourly wage"
              aria-invalid={!!wageError}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              원
            </span>
          </div>
          {wageError ? (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {wageError}
            </p>
          ) : (
            <p className="text-xs text-gray-400">
              2025 최저시급 {MIN_HOURLY_WAGE.toLocaleString()}원 / Min wage {MIN_HOURLY_WAGE.toLocaleString()} KRW
            </p>
          )}
        </div>
      </div>

      {/* 근무 스케줄 / Work schedule */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          근무 스케줄 <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal ml-1">/ Work Schedule</span>
        </Label>
        <SchedulePicker
          schedule={form.schedule}
          onScheduleChange={(schedule) => onUpdate({ schedule })}
          weeklyHours={form.weeklyHours}
          onWeeklyHoursChange={(weeklyHours) => onUpdate({ weeklyHours })}
        />
        {errors.schedule && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.schedule}
          </p>
        )}
      </div>

      {/* 근무 기간 / Work period */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          근무 기간 <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal ml-1">/ Work Period</span>
        </Label>
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="date"
              value={form.workPeriod.startDate}
              onChange={(e) =>
                onUpdate({ workPeriod: { ...form.workPeriod, startDate: e.target.value } })
              }
              className="min-h-[48px] rounded-2xl pl-10"
              aria-label="근무 시작일 / Work start date"
            />
          </div>
          <span className="text-gray-400 text-sm shrink-0">~</span>
          <div className="flex-1 relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="date"
              value={form.workPeriod.endDate || ''}
              onChange={(e) =>
                onUpdate({
                  workPeriod: {
                    ...form.workPeriod,
                    endDate: e.target.value || null,
                  },
                })
              }
              className="min-h-[48px] rounded-2xl pl-10"
              placeholder="채용시까지"
              aria-label="근무 종료일 / Work end date"
            />
          </div>
        </div>
        {/* 채용시까지 토글 / Until filled toggle */}
        <label className="flex items-center gap-2 cursor-pointer mt-1">
          <input
            type="checkbox"
            checked={form.workPeriod.endDate === null}
            onChange={(e) =>
              onUpdate({
                workPeriod: {
                  ...form.workPeriod,
                  endDate: e.target.checked ? null : '',
                },
              })
            }
            className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
            aria-label="채용시까지 / Until position filled"
          />
          <span className="text-sm text-gray-600">
            채용시까지 <span className="text-gray-400">/ Until position filled</span>
          </span>
        </label>
        {errors.workPeriod && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.workPeriod}
          </p>
        )}
      </div>
    </div>
  );
}
