'use client';

/**
 * Step4Education — 학력 정보 (간소화 폼)
 * Step4Education — Education information (simplified form)
 *
 * 최종학력, 학교명, 전공, 졸업상태
 * Highest education, school name, major, graduation status
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
import { GraduationCap } from 'lucide-react';
import type { WizardFormData } from '../wizard-types';
import { EDUCATION_LEVELS } from '../wizard-types';

interface Step4Props {
  formData: WizardFormData;
  onUpdate: (field: keyof WizardFormData, value: string) => void;
}

/** 졸업 상태 / Graduation status */
const GRADUATION_STATUSES = [
  { value: 'enrolled', label: '재학중 / Enrolled' },
  { value: 'on_leave', label: '휴학중 / On leave' },
  { value: 'graduated', label: '졸업 / Graduated' },
  { value: 'expected', label: '졸업예정 / Expected' },
  { value: 'dropped', label: '중퇴 / Dropped out' },
];

export default function Step4Education({ formData, onUpdate }: Step4Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">
          학력 정보 / Education Information
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 최종학력 / Education level */}
        <div className="space-y-2">
          <Label htmlFor="education-level">최종학력 (Highest Education)</Label>
          <Select
            value={formData.educationLevel ?? ''}
            onValueChange={(val) => onUpdate('educationLevel', val)}
          >
            <SelectTrigger id="education-level" className="w-full min-h-[44px]">
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((lv) => (
                <SelectItem key={lv} value={lv}>{lv}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 졸업 상태 / Graduation status */}
        <div className="space-y-2">
          <Label htmlFor="graduation-status">졸업 상태 (Status)</Label>
          <Select
            value={formData.graduationStatus ?? ''}
            onValueChange={(val) => onUpdate('graduationStatus', val)}
          >
            <SelectTrigger id="graduation-status" className="w-full min-h-[44px]">
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {GRADUATION_STATUSES.map((gs) => (
                <SelectItem key={gs.value} value={gs.value}>{gs.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 학교명 / School name */}
        <div className="space-y-2">
          <Label htmlFor="school-name">학교명 (School Name)</Label>
          <Input
            id="school-name"
            value={formData.schoolName ?? ''}
            onChange={(e) => onUpdate('schoolName', e.target.value)}
            placeholder="예: 서울대학교"
            className="min-h-[44px]"
          />
        </div>

        {/* 전공 / Major */}
        <div className="space-y-2">
          <Label htmlFor="major">전공 (Major)</Label>
          <Input
            id="major"
            value={formData.major ?? ''}
            onChange={(e) => onUpdate('major', e.target.value)}
            placeholder="예: 컴퓨터공학"
            className="min-h-[44px]"
          />
        </div>

        {/* 졸업년도 / Graduation year */}
        <div className="space-y-2">
          <Label htmlFor="graduation-year">졸업(예정)년도 (Year)</Label>
          <Input
            id="graduation-year"
            type="number"
            min={1990}
            max={2030}
            value={formData.graduationYear ?? ''}
            onChange={(e) => onUpdate('graduationYear' as keyof WizardFormData, e.target.value)}
            placeholder="예: 2025"
            className="min-h-[44px]"
          />
        </div>
      </div>
    </div>
  );
}
