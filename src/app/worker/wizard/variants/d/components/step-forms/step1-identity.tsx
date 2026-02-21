'use client';

/**
 * Step1Identity — 신원 정보 (간소화 폼)
 * Step1Identity — Identity information (simplified form)
 *
 * 이름, 성별, 생년월일, 국적 입력
 * Name, gender, date of birth, nationality input
 */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from 'lucide-react';
import type { WizardFormData } from '../wizard-types';
import { NATIONALITIES } from '../wizard-types';

interface Step1Props {
  formData: WizardFormData;
  onUpdate: (field: keyof WizardFormData, value: string) => void;
}

export default function Step1Identity({ formData, onUpdate }: Step1Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <User className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">
          신원 정보 / Identity Information
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 성(Last name) */}
        <div className="space-y-2">
          <Label htmlFor="last-name">성 (Last Name)</Label>
          <Input
            id="last-name"
            value={formData.lastName ?? ''}
            onChange={(e) => onUpdate('lastName', e.target.value)}
            placeholder="예: NGUYEN"
            className="min-h-[44px]"
          />
        </div>

        {/* 이름(First name) */}
        <div className="space-y-2">
          <Label htmlFor="first-name">이름 (First Name)</Label>
          <Input
            id="first-name"
            value={formData.firstName ?? ''}
            onChange={(e) => onUpdate('firstName', e.target.value)}
            placeholder="예: VAN A"
            className="min-h-[44px]"
          />
        </div>

        {/* 생년월일 / Date of birth */}
        <div className="space-y-2">
          <Label htmlFor="birth-date">생년월일 (Date of Birth)</Label>
          <Input
            id="birth-date"
            type="date"
            value={formData.birthDate ?? ''}
            onChange={(e) => onUpdate('birthDate', e.target.value)}
            className="min-h-[44px]"
          />
        </div>

        {/* 국적 / Nationality */}
        <div className="space-y-2">
          <Label htmlFor="nationality">국적 (Nationality)</Label>
          <Select
            value={formData.nationality ?? ''}
            onValueChange={(val) => onUpdate('nationality', val)}
          >
            <SelectTrigger id="nationality" className="w-full min-h-[44px]">
              <SelectValue placeholder="국적 선택" />
            </SelectTrigger>
            <SelectContent>
              {NATIONALITIES.map((nat) => (
                <SelectItem key={nat} value={nat}>{nat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 성별 / Gender */}
      <div className="space-y-2">
        <Label>성별 (Gender)</Label>
        <RadioGroup
          value={formData.gender ?? ''}
          onValueChange={(val) => onUpdate('gender', val)}
          className="flex gap-4"
        >
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <RadioGroupItem value="male" />
            <span className="text-sm">남성 / Male</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <RadioGroupItem value="female" />
            <span className="text-sm">여성 / Female</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <RadioGroupItem value="other" />
            <span className="text-sm">기타 / Other</span>
          </label>
        </RadioGroup>
      </div>
    </div>
  );
}
