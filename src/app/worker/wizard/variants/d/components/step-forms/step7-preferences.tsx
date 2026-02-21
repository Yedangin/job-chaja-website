'use client';

/**
 * Step7Preferences — 희망 조건 (간소화 폼)
 * Step7Preferences — Job preferences (simplified form)
 *
 * 희망 직종, 희망 지역, 급여 범위, 근무 요일, 입사 가능일
 * Desired job type, region, salary range, work days, start date
 */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Target } from 'lucide-react';
import type { WizardFormData } from '../wizard-types';
import { SIDO_LIST } from '../wizard-types';

interface Step7Props {
  formData: WizardFormData;
  onUpdate: (field: keyof WizardFormData, value: string) => void;
  /** 근무 요일 토글 / Toggle work day */
  onToggleWorkDay: (day: string) => void;
}

/** 희망 직종 / Desired job types */
const JOB_TYPES = [
  { value: 'FULL_TIME', label: '정규직 / Full-time' },
  { value: 'PART_TIME', label: '알바/파트타임 / Part-time' },
  { value: 'CONTRACT', label: '계약직 / Contract' },
  { value: 'INTERN', label: '인턴 / Intern' },
  { value: 'ANY', label: '무관 / Any' },
];

/** 요일 / Days */
const DAYS = [
  { value: 'MON', label: '월' },
  { value: 'TUE', label: '화' },
  { value: 'WED', label: '수' },
  { value: 'THU', label: '목' },
  { value: 'FRI', label: '금' },
  { value: 'SAT', label: '토' },
  { value: 'SUN', label: '일' },
];

export default function Step7Preferences({ formData, onUpdate, onToggleWorkDay }: Step7Props) {
  const workDays = formData.desiredWorkDays ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">
          희망 조건 / Job Preferences
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 희망 직종 / Desired job type */}
        <div className="space-y-2">
          <Label htmlFor="desired-job-type">희망 직종 (Job Type)</Label>
          <Select
            value={formData.desiredJobType ?? ''}
            onValueChange={(val) => onUpdate('desiredJobType', val)}
          >
            <SelectTrigger id="desired-job-type" className="w-full min-h-[44px]">
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPES.map((jt) => (
                <SelectItem key={jt.value} value={jt.value}>{jt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 희망 지역 / Desired region */}
        <div className="space-y-2">
          <Label htmlFor="desired-sido">희망 지역 (Desired Region)</Label>
          <Select
            value={formData.desiredSido ?? ''}
            onValueChange={(val) => onUpdate('desiredSido', val)}
          >
            <SelectTrigger id="desired-sido" className="w-full min-h-[44px]">
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ANY">전국 / Anywhere</SelectItem>
              {SIDO_LIST.map((sido) => (
                <SelectItem key={sido} value={sido}>{sido}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 희망 급여 최소 / Desired salary min */}
        <div className="space-y-2">
          <Label htmlFor="salary-min">희망 최소 급여 (Min Salary, 만원)</Label>
          <Input
            id="salary-min"
            type="number"
            min={0}
            value={formData.desiredSalaryMin ?? ''}
            onChange={(e) => onUpdate('desiredSalaryMin' as keyof WizardFormData, e.target.value)}
            placeholder="예: 200"
            className="min-h-[44px]"
          />
        </div>

        {/* 희망 급여 최대 / Desired salary max */}
        <div className="space-y-2">
          <Label htmlFor="salary-max">희망 최대 급여 (Max Salary, 만원)</Label>
          <Input
            id="salary-max"
            type="number"
            min={0}
            value={formData.desiredSalaryMax ?? ''}
            onChange={(e) => onUpdate('desiredSalaryMax' as keyof WizardFormData, e.target.value)}
            placeholder="예: 400"
            className="min-h-[44px]"
          />
        </div>

        {/* 입사 가능일 / Available start date */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="available-start">입사 가능일 (Available Start Date)</Label>
          <Input
            id="available-start"
            type="date"
            value={formData.availableStartDate ?? ''}
            onChange={(e) => onUpdate('availableStartDate', e.target.value)}
            className="min-h-[44px] max-w-xs"
          />
        </div>
      </div>

      {/* 근무 가능 요일 / Available work days */}
      <div className="space-y-2">
        <Label>근무 가능 요일 (Available Days)</Label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => {
            const isChecked = workDays.includes(day.value);
            return (
              <label
                key={day.value}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer
                  transition-colors min-h-[44px]
                  ${isChecked
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'}
                `}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => onToggleWorkDay(day.value)}
                />
                <span className="text-sm font-medium">{day.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 완성 안내 / Completion notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-xs text-green-700 leading-relaxed">
          <strong>마지막 단계입니다!</strong> 희망 조건을 입력하면 프로필이 완성됩니다.
          완성된 프로필로 자동 매칭된 공고를 확인할 수 있습니다.
          <br />
          <strong>Last step!</strong> Complete your preferences to finish your profile.
          You will see auto-matched job postings with your completed profile.
        </p>
      </div>
    </div>
  );
}
