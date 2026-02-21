'use client';

/**
 * Step2Visa — 비자/체류 정보 (상세 폼)
 * Step2Visa — Visa/residency information (detailed form)
 *
 * 비자 유형, 세부유형, 외국인등록번호, 만료일, ARC 업로드
 * Visa type, sub-type, foreigner registration number, expiry, ARC upload
 */

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IdCard, Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WizardFormData } from '../wizard-types';
import { VISA_TYPES } from '../wizard-types';

interface Step2Props {
  formData: WizardFormData;
  onUpdate: (field: keyof WizardFormData, value: string) => void;
}

export default function Step2Visa({ formData, onUpdate }: Step2Props) {
  const [arcFileName, setArcFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 선택된 비자의 세부유형 목록 / Sub-types for selected visa
  const selectedVisa = VISA_TYPES.find((v) => v.code === formData.visaType);
  const subTypes = selectedVisa?.subTypes ?? [];

  // 파일 업로드 처리 (Mock) / File upload handler (Mock)
  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      setArcFileName(file.name);
      onUpdate('arcFile', file.name);
    }
  };

  // 외국인등록번호 포맷 / Format foreign registration number
  const formatArcNumber = (value: string): string => {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 13);
    if (digits.length > 6) {
      return `${digits.slice(0, 6)}-${digits.slice(6)}`;
    }
    return digits;
  };

  return (
    <div className="space-y-8">
      {/* 섹션 1: 비자 유형 / Section 1: Visa type */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <IdCard className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            비자 정보 / Visa Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 현재 비자 / Current visa */}
          <div className="space-y-2">
            <Label htmlFor="visa-type">현재 비자 (Current Visa)</Label>
            <Select
              value={formData.visaType ?? ''}
              onValueChange={(val) => {
                onUpdate('visaType', val);
                onUpdate('visaSubType', ''); // 세부유형 초기화 / Reset sub-type
              }}
            >
              <SelectTrigger id="visa-type" className="w-full min-h-[44px]">
                <SelectValue placeholder="비자 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {VISA_TYPES.map((visa) => (
                  <SelectItem key={visa.code} value={visa.code}>
                    {visa.code} {visa.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 세부유형 / Sub-type */}
          <div className="space-y-2">
            <Label htmlFor="visa-sub-type">세부유형 (Sub-type)</Label>
            <Select
              value={formData.visaSubType ?? ''}
              onValueChange={(val) => onUpdate('visaSubType', val)}
              disabled={subTypes.length === 0}
            >
              <SelectTrigger
                id="visa-sub-type"
                className={cn('w-full min-h-[44px]', subTypes.length === 0 && 'opacity-50')}
              >
                <SelectValue placeholder={subTypes.length === 0 ? '해당 없음' : '세부유형 선택'} />
              </SelectTrigger>
              <SelectContent>
                {subTypes.map((sub) => (
                  <SelectItem key={sub.code} value={sub.code}>
                    {sub.code} {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 외국인등록번호 / Foreigner registration number */}
          <div className="space-y-2">
            <Label htmlFor="arc-number">
              외국인등록번호 (Foreigner Reg. No.)
            </Label>
            <Input
              id="arc-number"
              value={formData.foreignRegistrationNumber ?? ''}
              onChange={(e) =>
                onUpdate('foreignRegistrationNumber', formatArcNumber(e.target.value))
              }
              placeholder="000000-0000000"
              className="min-h-[44px] font-mono tracking-wider"
              maxLength={14}
            />
            <p className="text-[11px] text-gray-400">
              ARC 카드 앞면에 기재된 13자리 번호
            </p>
          </div>

          {/* 비자 만료일 / Visa expiry date */}
          <div className="space-y-2">
            <Label htmlFor="visa-expiry">비자 만료일 (Visa Expiry Date)</Label>
            <Input
              id="visa-expiry"
              type="date"
              value={formData.visaExpiryDate ?? ''}
              onChange={(e) => onUpdate('visaExpiryDate', e.target.value)}
              className="min-h-[44px]"
            />
            {formData.visaExpiryDate && (() => {
              const daysLeft = Math.ceil(
                (new Date(formData.visaExpiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              if (daysLeft <= 30 && daysLeft > 0) {
                return (
                  <p className="text-[11px] text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {daysLeft}일 후 만료 / Expires in {daysLeft} days
                  </p>
                );
              }
              if (daysLeft <= 0) {
                return (
                  <p className="text-[11px] text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    만료됨 / Expired
                  </p>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </section>

      {/* 섹션 2: ARC 카드 업로드 / Section 2: ARC card upload */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            ARC 카드 업로드 / ARC Card Upload
          </h3>
        </div>

        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
            arcFileName && 'border-green-300 bg-green-50/30'
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            handleFileSelect(e.dataTransfer.files[0]);
          }}
        >
          {arcFileName ? (
            /* 업로드 완료 / Upload complete */
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
              <p className="text-sm font-medium text-green-700">업로드 완료</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <FileText className="w-3.5 h-3.5" />
                <span>{arcFileName}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setArcFileName(null);
                  onUpdate('arcFile', '');
                }}
                className="mt-2 text-xs text-blue-600 hover:underline min-h-[44px] flex items-center"
                aria-label="파일 다시 선택 / Re-select file"
              >
                다시 선택 / Re-select
              </button>
            </div>
          ) : (
            /* 업로드 대기 / Awaiting upload */
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-10 h-10 text-gray-400" />
              <p className="text-sm text-gray-600">
                ARC 카드 사진을 드래그하거나 클릭해서 업로드
              </p>
              <p className="text-xs text-gray-400">
                Drag & drop or click to upload ARC card image
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                JPG, PNG, PDF (최대 10MB)
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
                aria-label="파일 선택 / Select file"
              >
                파일 선택
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
                aria-label="ARC 카드 파일 선택 / ARC card file select"
              />
            </div>
          )}
        </div>
      </section>

      {/* 비자 유형별 안내 / Visa-specific guidance */}
      {formData.visaType && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>참고:</strong> {formData.visaType} 비자 보유자의 취업 조건은 비자
            세부유형 및 체류기간에 따라 다릅니다. 정확한 정보 입력이 매칭 정확도를
            높입니다.
            <br />
            <strong>Note:</strong> Employment conditions for {formData.visaType}{' '}
            visa holders vary by sub-type and residency period. Accurate information
            improves matching accuracy.
          </p>
        </div>
      )}
    </div>
  );
}
