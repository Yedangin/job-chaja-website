'use client';

/**
 * Step 5: DELTA 디스패처 / DELTA dispatcher
 * 비자 유형(visaCode)에 따라 다른 추가 필드를 동적으로 렌더링
 * Dynamically renders different additional fields based on visa type (visaCode)
 */

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Info, AlertTriangle } from 'lucide-react';
import type { DeltaData, DeltaFieldConfig } from '../types';
import { DELTA_FIELD_CONFIGS } from '../mock-data';

interface Step5DeltaProps {
  /** 현재 데이터 / Current data */
  data: DeltaData;
  /** 데이터 변경 핸들러 / Data change handler */
  onChange: (data: DeltaData) => void;
  /** 현재 비자 코드 (Step 2에서 선택된 값) / Current visa code (from Step 2) */
  visaCode: string;
}

/** 개별 DELTA 필드 렌더링 / Render individual DELTA field */
function DeltaField({
  config,
  value,
  onValueChange,
}: {
  config: DeltaFieldConfig;
  value: string | boolean | number | undefined;
  onValueChange: (val: string | boolean | number) => void;
}) {
  switch (config.type) {
    case 'text':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-700">
            {config.label}{' '}
            <span className="text-gray-400 font-normal">/ {config.labelEn}</span>
            {config.required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          <Input
            value={(value as string) || ''}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={config.placeholder}
            className="min-h-[44px] rounded-xl"
          />
        </div>
      );

    case 'number':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-700">
            {config.label}{' '}
            <span className="text-gray-400 font-normal">/ {config.labelEn}</span>
            {config.required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          <Input
            type="number"
            value={value !== undefined ? String(value) : ''}
            onChange={(e) => onValueChange(e.target.value ? Number(e.target.value) : '')}
            placeholder={config.placeholder}
            className="min-h-[44px] rounded-xl"
          />
        </div>
      );

    case 'date':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-700">
            {config.label}{' '}
            <span className="text-gray-400 font-normal">/ {config.labelEn}</span>
            {config.required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          <Input
            type="date"
            value={(value as string) || ''}
            onChange={(e) => onValueChange(e.target.value)}
            className="min-h-[44px] rounded-xl"
          />
        </div>
      );

    case 'select':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-700">
            {config.label}{' '}
            <span className="text-gray-400 font-normal">/ {config.labelEn}</span>
            {config.required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          <select
            value={(value as string) || ''}
            onChange={(e) => onValueChange(e.target.value)}
            className="w-full min-h-[44px] px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">선택해주세요 / Please select</option>
            {config.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.labelEn})
              </option>
            ))}
          </select>
        </div>
      );

    case 'checkbox':
      return (
        <div className="flex items-center gap-3 min-h-[44px] p-3 bg-gray-50 rounded-xl">
          <Checkbox
            id={`delta-${config.key}`}
            checked={(value as boolean) || false}
            onCheckedChange={(checked) => onValueChange(checked === true)}
            className="w-5 h-5"
          />
          <Label
            htmlFor={`delta-${config.key}`}
            className="text-sm text-gray-700 cursor-pointer flex-1"
          >
            {config.label}{' '}
            <span className="text-gray-400 font-normal">/ {config.labelEn}</span>
            {config.required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
        </div>
      );

    default:
      return null;
  }
}

export default function Step5Delta({ data, onChange, visaCode }: Step5DeltaProps) {
  /** 현재 비자에 맞는 DELTA 필드 설정 가져오기 / Get DELTA field config for current visa */
  const fieldConfigs = DELTA_FIELD_CONFIGS[visaCode] || [];

  /** 필드 값 업데이트 / Update field value */
  const updateFieldValue = (key: string, value: string | boolean | number) => {
    onChange({
      fields: {
        ...data.fields,
        [key]: value,
      },
    });
  };

  /** 비자 미선택 시 / When no visa is selected */
  if (!visaCode) {
    return (
      <div className="text-center py-12 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <div>
          <p className="text-sm font-medium text-gray-700">
            비자 유형을 먼저 선택해주세요
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Please select your visa type in Step 2 first
          </p>
        </div>
      </div>
    );
  }

  /** 해당 비자에 추가 필드 없을 때 / No additional fields for this visa */
  if (fieldConfigs.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <FileText className="w-12 h-12 text-green-400 mx-auto" />
        <div>
          <p className="text-sm font-medium text-gray-700">
            추가 입력이 필요하지 않습니다
          </p>
          <p className="text-xs text-gray-400 mt-1">
            No additional information required for your visa type ({visaCode})
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 안내 배너 / Info banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">
            {visaCode} 비자 추가 정보
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            Additional information required for {visaCode} visa holders.
            These fields help employers verify your eligibility.
          </p>
        </div>
      </div>

      {/* 비자별 필수 필드 / Required fields */}
      <div className="space-y-3">
        {fieldConfigs.filter((f) => f.required).length > 0 && (
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            필수 항목 / Required
          </p>
        )}
        {fieldConfigs
          .filter((f) => f.required)
          .map((config) => (
            <DeltaField
              key={config.key}
              config={config}
              value={data.fields[config.key]}
              onValueChange={(val) => updateFieldValue(config.key, val)}
            />
          ))}
      </div>

      {/* 비자별 선택 필드 / Optional fields */}
      {fieldConfigs.filter((f) => !f.required).length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            선택 항목 / Optional
          </p>
          {fieldConfigs
            .filter((f) => !f.required)
            .map((config) => (
              <DeltaField
                key={config.key}
                config={config}
                value={data.fields[config.key]}
                onValueChange={(val) => updateFieldValue(config.key, val)}
              />
            ))}
        </div>
      )}
    </div>
  );
}
