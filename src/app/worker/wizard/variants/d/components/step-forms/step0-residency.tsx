'use client';

/**
 * Step0Residency — 거주 정보 (상세 폼)
 * Step0Residency — Residency information (detailed form)
 *
 * 체류 유형, 거주지 주소, 연락처 입력
 * Residency type, address, and contact information
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
import { Home, MapPin, Phone } from 'lucide-react';
import type { WizardFormData } from '../wizard-types';
import { SIDO_LIST } from '../wizard-types';

interface Step0Props {
  /** 폼 데이터 / Form data */
  formData: WizardFormData;
  /** 필드 업데이트 / Field update */
  onUpdate: (field: keyof WizardFormData, value: string) => void;
}

export default function Step0Residency({ formData, onUpdate }: Step0Props) {
  return (
    <div className="space-y-8">
      {/* 섹션 1: 체류 유형 / Section 1: Residency type */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            체류 유형 / Residency Type
          </h3>
        </div>

        <RadioGroup
          value={formData.residencyType ?? ''}
          onValueChange={(val) => onUpdate('residencyType', val)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {/* 장기체류 / Long-term */}
          <label
            className={`
              flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all min-h-[44px]
              ${formData.residencyType === 'long_term'
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-200 hover:border-gray-300'}
            `}
          >
            <RadioGroupItem value="long_term" className="mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">장기체류</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Long-term stay (91일 이상 / 91+ days)
              </p>
            </div>
          </label>

          {/* 단기체류 / Short-term */}
          <label
            className={`
              flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all min-h-[44px]
              ${formData.residencyType === 'short_term'
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-200 hover:border-gray-300'}
            `}
          >
            <RadioGroupItem value="short_term" className="mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">단기체류</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Short-term stay (90일 이하 / 90 days or less)
              </p>
            </div>
          </label>
        </RadioGroup>
      </section>

      {/* 섹션 2: 거주지 주소 / Section 2: Residence address */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            거주지 주소 / Residence Address
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 시/도 / Province */}
          <div className="space-y-2">
            <Label htmlFor="residence-sido">시/도 (Province)</Label>
            <Select
              value={formData.residenceSido ?? ''}
              onValueChange={(val) => onUpdate('residenceSido', val)}
            >
              <SelectTrigger id="residence-sido" className="w-full min-h-[44px]">
                <SelectValue placeholder="시/도 선택" />
              </SelectTrigger>
              <SelectContent>
                {SIDO_LIST.map((sido) => (
                  <SelectItem key={sido} value={sido}>
                    {sido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 시/군/구 / District */}
          <div className="space-y-2">
            <Label htmlFor="residence-sigungu">시/군/구 (District)</Label>
            <Input
              id="residence-sigungu"
              value={formData.residenceSigungu ?? ''}
              onChange={(e) => onUpdate('residenceSigungu', e.target.value)}
              placeholder="예: 강남구"
              className="min-h-[44px]"
            />
          </div>

          {/* 상세 주소 / Detail address */}
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="residence-detail">상세 주소 (Detail Address)</Label>
            <Input
              id="residence-detail"
              value={formData.residenceDetail ?? ''}
              onChange={(e) => onUpdate('residenceDetail', e.target.value)}
              placeholder="동/호수 등 상세 주소"
              className="min-h-[44px]"
            />
          </div>
        </div>
      </section>

      {/* 섹션 3: 연락처 / Section 3: Contact */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            연락처 / Contact
          </h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone-number">휴대폰 번호 (Phone Number)</Label>
          <Input
            id="phone-number"
            type="tel"
            value={formData.phoneNumber ?? ''}
            onChange={(e) => onUpdate('phoneNumber', e.target.value)}
            placeholder="010-0000-0000"
            className="min-h-[44px] max-w-xs"
          />
          <p className="text-xs text-gray-400">
            한국 휴대폰 번호 / Korean mobile number
          </p>
        </div>
      </section>

      {/* 안내 메시지 / Info message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>안내:</strong> 거주 정보는 지원 가능한 공고 매칭에 활용됩니다.
          정확한 정보를 입력해주세요.
          <br />
          <strong>Note:</strong> Residency information is used to match eligible
          job postings. Please provide accurate information.
        </p>
      </div>
    </div>
  );
}
