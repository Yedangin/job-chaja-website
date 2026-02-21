'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Step 4: 학력 폼 (간소화) / Step 4: Education form (simplified)
 * 최종학력, 전공, 졸업연도 입력
 * Degree, major, graduation year input
 */

interface Step4EducationProps {
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}

/** 학력 수준 옵션 / Education level options */
const EDUCATION_LEVELS = [
  { value: 'none', label: '해당없음', labelEn: 'None' },
  { value: 'middle_school', label: '중학교', labelEn: 'Middle School' },
  { value: 'high_school', label: '고등학교', labelEn: 'High School' },
  { value: 'associate', label: '전문학사 (2~3년제)', labelEn: 'Associate' },
  { value: 'bachelor', label: '학사 (4년제)', labelEn: 'Bachelor' },
  { value: 'master', label: '석사', labelEn: 'Master' },
  { value: 'doctorate', label: '박사', labelEn: 'Doctorate' },
] as const;

export default function Step4Education({ onSave, onClose }: Step4EducationProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    educationLevel: '',
    schoolName: '',
    major: '',
    graduationYear: '',
  });

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const isComplete = formData.educationLevel;

  return (
    <div className="space-y-5">
      {/* 최종학력 / Education level */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-gray-700">
          최종학력 <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-1">/ Education Level</span>
        </Label>
        <Select
          value={formData.educationLevel}
          onValueChange={(v) => setFormData({ ...formData, educationLevel: v })}
        >
          <SelectTrigger
            className="h-11 rounded-xl w-full"
            aria-label="최종학력 선택 / Select education level"
          >
            <SelectValue placeholder="최종학력 선택 / Select level" />
          </SelectTrigger>
          <SelectContent>
            {EDUCATION_LEVELS.map((lvl) => (
              <SelectItem key={lvl.value} value={lvl.value}>
                {lvl.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 학교명 / School name */}
      <div className="space-y-1.5">
        <Label htmlFor="edu-school" className="text-sm font-semibold text-gray-700">
          학교명
          <span className="text-xs text-gray-400 ml-1">/ School Name</span>
        </Label>
        <Input
          id="edu-school"
          value={formData.schoolName}
          onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
          placeholder="학교 이름 / School name"
          className="h-11 rounded-xl"
        />
      </div>

      {/* 전공 / Major */}
      <div className="space-y-1.5">
        <Label htmlFor="edu-major" className="text-sm font-semibold text-gray-700">
          전공
          <span className="text-xs text-gray-400 ml-1">/ Major</span>
        </Label>
        <Input
          id="edu-major"
          value={formData.major}
          onChange={(e) => setFormData({ ...formData, major: e.target.value })}
          placeholder="전공 / Major"
          className="h-11 rounded-xl"
        />
      </div>

      {/* 졸업연도 / Graduation year */}
      <div className="space-y-1.5">
        <Label htmlFor="edu-year" className="text-sm font-semibold text-gray-700">
          졸업연도
          <span className="text-xs text-gray-400 ml-1">/ Graduation Year</span>
        </Label>
        <Input
          id="edu-year"
          type="number"
          value={formData.graduationYear}
          onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
          placeholder="2024"
          className="h-11 rounded-xl"
          min={1950}
          max={2030}
        />
      </div>

      {/* 저장 버튼 / Save button */}
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
          className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
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
