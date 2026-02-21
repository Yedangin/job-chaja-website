'use client';

/**
 * Step6Experience — 경력 정보 (간소화 폼)
 * Step6Experience — Work experience (simplified form)
 *
 * 총 경력 연수, 주요 분야, 경력 항목 추가
 * Total years, main field, add experience entries
 */

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import type { WizardFormData, ExperienceEntry } from '../wizard-types';

interface Step6Props {
  formData: WizardFormData;
  onUpdate: (field: keyof WizardFormData, value: string) => void;
  /** 경력 목록 업데이트 / Update experience list */
  onUpdateExperiences: (experiences: ExperienceEntry[]) => void;
}

/** 경력 분야 / Experience fields */
const EXPERIENCE_FIELDS = [
  { value: 'IT', label: 'IT/개발' },
  { value: 'MANUFACTURING', label: '제조/생산' },
  { value: 'SERVICE', label: '서비스/요식' },
  { value: 'CONSTRUCTION', label: '건설' },
  { value: 'OFFICE', label: '사무/관리' },
  { value: 'SALES', label: '영업/판매' },
  { value: 'AGRICULTURE', label: '농/축/수산' },
  { value: 'OTHER', label: '기타' },
];

/** 빈 경력 항목 / Empty experience entry */
const EMPTY_ENTRY: ExperienceEntry = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
};

export default function Step6Experience({ formData, onUpdate, onUpdateExperiences }: Step6Props) {
  const experiences = formData.experiences ?? [];

  // 경력 추가 / Add experience
  const addExperience = () => {
    onUpdateExperiences([...experiences, { ...EMPTY_ENTRY }]);
  };

  // 경력 삭제 / Remove experience
  const removeExperience = (index: number) => {
    onUpdateExperiences(experiences.filter((_, i) => i !== index));
  };

  // 경력 필드 업데이트 / Update experience field
  const updateExperience = (index: number, field: keyof ExperienceEntry, value: string | boolean) => {
    const updated = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    onUpdateExperiences(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">
          경력 정보 / Work Experience
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 총 경력 / Total experience */}
        <div className="space-y-2">
          <Label htmlFor="total-exp">총 경력 (Total Years)</Label>
          <Input
            id="total-exp"
            type="number"
            min={0}
            max={50}
            value={formData.totalExperienceYears ?? ''}
            onChange={(e) => onUpdate('totalExperienceYears' as keyof WizardFormData, e.target.value)}
            placeholder="예: 3"
            className="min-h-[44px]"
          />
        </div>

        {/* 주요 분야 / Main field */}
        <div className="space-y-2">
          <Label htmlFor="exp-field">주요 분야 (Main Field)</Label>
          <Select
            value={formData.experienceField ?? ''}
            onValueChange={(val) => onUpdate('experienceField', val)}
          >
            <SelectTrigger id="exp-field" className="w-full min-h-[44px]">
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_FIELDS.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 경력 항목 목록 / Experience entries */}
      {experiences.length > 0 && (
        <div className="space-y-4">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 space-y-3 relative"
            >
              {/* 삭제 버튼 / Delete button */}
              <button
                type="button"
                onClick={() => removeExperience(idx)}
                className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={`경력 ${idx + 1} 삭제 / Delete experience ${idx + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <p className="text-xs font-semibold text-gray-500 mb-2">
                경력 {idx + 1} / Experience {idx + 1}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">회사명 (Company)</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                    placeholder="회사명"
                    className="min-h-[44px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">직책 (Position)</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(idx, 'position', e.target.value)}
                    placeholder="직책"
                    className="min-h-[44px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">시작일 (Start)</Label>
                  <Input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                    className="min-h-[44px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">종료일 (End)</Label>
                  <Input
                    type="date"
                    value={exp.endDate ?? ''}
                    onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                    disabled={exp.isCurrent}
                    className="min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 경력 추가 버튼 / Add experience button */}
      <Button
        variant="outline"
        onClick={addExperience}
        className="w-full min-h-[44px] gap-2"
        aria-label="경력 추가 / Add experience"
      >
        <Plus className="w-4 h-4" />
        경력 추가 / Add Experience
      </Button>
    </div>
  );
}
