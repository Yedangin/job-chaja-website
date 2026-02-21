'use client';

import { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Wallet,
  Calendar,
  Clock,
  Home,
  Truck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { JOB_TYPE_OPTIONS, REGION_OPTIONS } from '../mock-data';
import type { PreferencesFormData } from '../wizard-types';

/**
 * Step 7: 희망조건 폼 (상세 구현) / Step 7: Preferences form (detailed)
 * 희망 업종, 지역, 급여, 근무 일정, 출퇴근/이주 가능 여부
 * Desired job types, regions, salary, schedule, commute/relocation
 */

interface Step7PreferencesProps {
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}

/** 근무 일정 옵션 / Work schedule options */
const SCHEDULE_OPTIONS = [
  { value: 'full_time', label: '풀타임', labelEn: 'Full-time' },
  { value: 'part_time', label: '파트타임', labelEn: 'Part-time' },
  { value: 'shift', label: '교대근무', labelEn: 'Shift work' },
  { value: 'flexible', label: '유연근무', labelEn: 'Flexible' },
  { value: 'any', label: '무관', labelEn: 'Any' },
] as const;

export default function Step7Preferences({ onSave, onClose }: Step7PreferencesProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<PreferencesFormData>({
    desiredJobTypes: [],
    desiredRegions: [],
    minSalary: 0,
    maxSalary: 0,
    salaryType: 'monthly',
    availableFrom: '',
    workSchedulePreference: '',
    commutePossible: true,
    relocationPossible: false,
  });

  // 업종 토글 / Toggle job type
  const toggleJobType = useCallback((code: string) => {
    setFormData((prev) => ({
      ...prev,
      desiredJobTypes: prev.desiredJobTypes.includes(code)
        ? prev.desiredJobTypes.filter((t) => t !== code)
        : [...prev.desiredJobTypes, code],
    }));
  }, []);

  // 지역 토글 / Toggle region
  const toggleRegion = useCallback((code: string) => {
    setFormData((prev) => ({
      ...prev,
      desiredRegions: prev.desiredRegions.includes(code)
        ? prev.desiredRegions.filter((r) => r !== code)
        : [...prev.desiredRegions, code],
    }));
  }, []);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(formData as unknown as Record<string, unknown>);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  // 최소 1개 업종 + 1개 지역 선택 필요 / Need at least 1 job type + 1 region
  const isComplete = formData.desiredJobTypes.length > 0 && formData.desiredRegions.length > 0;

  return (
    <div className="space-y-6">
      {/* === 희망 업종 / Desired job types === */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          희망 업종 <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-1">/ Desired Job Types</span>
          {formData.desiredJobTypes.length > 0 && (
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
              {formData.desiredJobTypes.length}개
            </span>
          )}
        </Label>

        <div className="grid grid-cols-2 gap-2">
          {JOB_TYPE_OPTIONS.map((type) => {
            const isSelected = formData.desiredJobTypes.includes(type.code);
            return (
              <button
                key={type.code}
                type="button"
                onClick={() => toggleJobType(type.code)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all min-h-[44px]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
                  isSelected
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200'
                )}
                aria-label={`${type.label} (${type.labelEn})`}
                aria-pressed={isSelected}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                <span className="truncate">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* === 희망 지역 / Desired regions === */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-gray-500" />
          희망 지역 <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-1">/ Desired Regions</span>
          {formData.desiredRegions.length > 0 && (
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
              {formData.desiredRegions.length}개
            </span>
          )}
        </Label>

        <div className="flex flex-wrap gap-2">
          {REGION_OPTIONS.map((region) => {
            const isSelected = formData.desiredRegions.includes(region.code);
            return (
              <button
                key={region.code}
                type="button"
                onClick={() => toggleRegion(region.code)}
                className={cn(
                  'px-3 py-2 rounded-full border text-xs font-medium transition-all min-h-[36px]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400',
                  isSelected
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-green-200'
                )}
                aria-label={`${region.label} (${region.labelEn})`}
                aria-pressed={isSelected}
              >
                {region.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* === 희망 급여 / Desired salary === */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Wallet className="w-4 h-4 text-gray-500" />
          희망 급여
          <span className="text-xs text-gray-400 ml-1">/ Desired Salary</span>
        </Label>

        {/* 급여 유형 선택 / Salary type */}
        <RadioGroup
          value={formData.salaryType}
          onValueChange={(v) =>
            setFormData({ ...formData, salaryType: v as PreferencesFormData['salaryType'] })
          }
          className="flex gap-3"
          aria-label="급여 유형 / Salary type"
        >
          {[
            { value: 'hourly', label: '시급', labelEn: 'Hourly' },
            { value: 'monthly', label: '월급', labelEn: 'Monthly' },
            { value: 'annual', label: '연봉', labelEn: 'Annual' },
          ].map((opt) => (
            <div key={opt.value} className="flex items-center gap-1.5">
              <RadioGroupItem value={opt.value} id={`salary-${opt.value}`} />
              <Label htmlFor={`salary-${opt.value}`} className="text-sm cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* 급여 범위 / Salary range */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">최소 / Min</Label>
            <div className="relative">
              <Input
                type="number"
                value={formData.minSalary || ''}
                onChange={(e) => setFormData({ ...formData, minSalary: Number(e.target.value) })}
                placeholder={formData.salaryType === 'hourly' ? '10,030' : formData.salaryType === 'monthly' ? '2,000,000' : '24,000,000'}
                className="h-10 rounded-xl pr-8 text-sm"
                aria-label="최소 급여 / Minimum salary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">원</span>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">최대 / Max</Label>
            <div className="relative">
              <Input
                type="number"
                value={formData.maxSalary || ''}
                onChange={(e) => setFormData({ ...formData, maxSalary: Number(e.target.value) })}
                placeholder={formData.salaryType === 'hourly' ? '15,000' : formData.salaryType === 'monthly' ? '3,000,000' : '36,000,000'}
                className="h-10 rounded-xl pr-8 text-sm"
                aria-label="최대 급여 / Maximum salary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">원</span>
            </div>
          </div>
        </div>
      </div>

      {/* === 근무 가능 시작일 / Available from === */}
      <div className="space-y-2">
        <Label htmlFor="pref-available" className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-gray-500" />
          근무 가능 시작일
          <span className="text-xs text-gray-400 ml-1">/ Available From</span>
        </Label>
        <Input
          id="pref-available"
          type="date"
          value={formData.availableFrom}
          onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
          className="h-11 rounded-xl"
          aria-label="근무 가능 시작일 / Available from date"
        />
      </div>

      {/* === 근무 일정 선호 / Work schedule preference === */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-500" />
          근무 일정
          <span className="text-xs text-gray-400 ml-1">/ Work Schedule</span>
        </Label>
        <Select
          value={formData.workSchedulePreference}
          onValueChange={(v) => setFormData({ ...formData, workSchedulePreference: v })}
        >
          <SelectTrigger
            className="h-11 rounded-xl w-full"
            aria-label="근무 일정 선택 / Select work schedule"
          >
            <SelectValue placeholder="근무 일정 선호 / Schedule preference" />
          </SelectTrigger>
          <SelectContent>
            {SCHEDULE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} ({opt.labelEn})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* === 출퇴근/이주 가능 여부 / Commute/relocation === */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">
          이동 가능 여부
          <span className="text-xs text-gray-400 ml-1">/ Mobility</span>
        </Label>

        {/* 출퇴근 가능 / Commutable */}
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
          <Checkbox
            id="pref-commute"
            checked={formData.commutePossible}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, commutePossible: checked === true })
            }
            className="mt-0.5"
            aria-label="출퇴근 가능 / Commutable"
          />
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <Label htmlFor="pref-commute" className="text-sm font-medium text-gray-700 cursor-pointer">
                출퇴근 가능
              </Label>
              <p className="text-[10px] text-gray-400">Available for daily commute</p>
            </div>
          </div>
        </div>

        {/* 이주 가능 / Relocation possible */}
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
          <Checkbox
            id="pref-relocation"
            checked={formData.relocationPossible}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, relocationPossible: checked === true })
            }
            className="mt-0.5"
            aria-label="이주 가능 / Relocation possible"
          />
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <Label htmlFor="pref-relocation" className="text-sm font-medium text-gray-700 cursor-pointer">
                이주 가능 (숙소 제공 시)
              </Label>
              <p className="text-[10px] text-gray-400">Can relocate (if accommodation provided)</p>
            </div>
          </div>
        </div>
      </div>

      {/* === 저장 버튼 / Save buttons === */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 h-12 rounded-xl"
          aria-label="취소 / Cancel"
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isComplete || isSaving}
          className={cn(
            'flex-1 h-12 rounded-xl font-semibold text-white',
            isComplete
              ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
              : 'bg-gray-300 cursor-not-allowed'
          )}
          aria-label="저장하기 / Save"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-1" />
              저장하기
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
