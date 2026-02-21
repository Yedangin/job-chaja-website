'use client';

/**
 * Step3Korean — 한국어 능력 (간소화 폼)
 * Step3Korean — Korean language ability (simplified form)
 *
 * TOPIK 급수, 한국어 능력 자가진단, KIIP/세종학당 수준
 * TOPIK level, self-assessment, KIIP/Sejong level
 */

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Languages } from 'lucide-react';
import type { WizardFormData } from '../wizard-types';

interface Step3Props {
  formData: WizardFormData;
  onUpdate: (field: keyof WizardFormData, value: string) => void;
}

/** TOPIK 급수 / TOPIK levels */
const TOPIK_LEVELS = [
  { value: '0', label: '미응시 / Not taken' },
  { value: '1', label: '1급' },
  { value: '2', label: '2급' },
  { value: '3', label: '3급' },
  { value: '4', label: '4급' },
  { value: '5', label: '5급' },
  { value: '6', label: '6급' },
];

/** 한국어 능력 자가진단 / Korean ability self-assessment */
const KOREAN_ABILITIES = [
  { value: 'NONE', label: '구사 불가 / Cannot speak' },
  { value: 'BASIC', label: '기초 / Basic' },
  { value: 'DAILY', label: '일상회화 / Daily conversation' },
  { value: 'BUSINESS', label: '업무 가능 / Business level' },
  { value: 'FLUENT', label: '유창 / Fluent' },
];

export default function Step3Korean({ formData, onUpdate }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Languages className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">
          한국어 능력 / Korean Language Ability
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* TOPIK 급수 / TOPIK level */}
        <div className="space-y-2">
          <Label htmlFor="topik-level">TOPIK 급수 (TOPIK Level)</Label>
          <Select
            value={formData.topikLevel?.toString() ?? ''}
            onValueChange={(val) => onUpdate('topikLevel' as keyof WizardFormData, val)}
          >
            <SelectTrigger id="topik-level" className="w-full min-h-[44px]">
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {TOPIK_LEVELS.map((lv) => (
                <SelectItem key={lv.value} value={lv.value}>{lv.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 한국어 능력 / Korean ability */}
        <div className="space-y-2">
          <Label htmlFor="korean-ability">한국어 수준 (Korean Level)</Label>
          <Select
            value={formData.koreanAbility ?? ''}
            onValueChange={(val) => onUpdate('koreanAbility', val)}
          >
            <SelectTrigger id="korean-ability" className="w-full min-h-[44px]">
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {KOREAN_ABILITIES.map((ab) => (
                <SelectItem key={ab.value} value={ab.value}>{ab.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KIIP 수준 / KIIP level */}
        <div className="space-y-2">
          <Label htmlFor="kiip-level">KIIP 이수단계 (KIIP Level, 선택)</Label>
          <Select
            value={formData.kiipLevel?.toString() ?? ''}
            onValueChange={(val) => onUpdate('kiipLevel' as keyof WizardFormData, val)}
          >
            <SelectTrigger id="kiip-level" className="w-full min-h-[44px]">
              <SelectValue placeholder="선택 (선택사항)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">미이수 / Not completed</SelectItem>
              {[1, 2, 3, 4, 5].map((lv) => (
                <SelectItem key={lv} value={lv.toString()}>{lv}단계</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 세종학당 수준 / Sejong level */}
        <div className="space-y-2">
          <Label htmlFor="sejong-level">세종학당 수준 (Sejong, 선택)</Label>
          <Select
            value={formData.sejongLevel?.toString() ?? ''}
            onValueChange={(val) => onUpdate('sejongLevel' as keyof WizardFormData, val)}
          >
            <SelectTrigger id="sejong-level" className="w-full min-h-[44px]">
              <SelectValue placeholder="선택 (선택사항)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">미수강 / Not taken</SelectItem>
              {[1, 2, 3, 4, 5, 6].map((lv) => (
                <SelectItem key={lv} value={lv.toString()}>{lv}급</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
