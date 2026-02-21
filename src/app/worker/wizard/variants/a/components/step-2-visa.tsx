'use client';

/**
 * Step 2: 비자/체류 정보 / Visa and stay information
 * 비자 유형, 세부유형, ARC 번호, 만료일, OCR 업로드
 * Visa type, sub-type, ARC number, expiry date, OCR upload
 */

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Upload,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Info,
} from 'lucide-react';
import { ResidencyStatus } from '../types';
import type { VisaData, ResidencyData } from '../types';
import { VISA_TYPE_OPTIONS } from '../mock-data';

interface Step2VisaProps {
  /** 현재 비자 데이터 / Current visa data */
  data: VisaData;
  /** 데이터 변경 핸들러 / Data change handler */
  onChange: (data: VisaData) => void;
  /** 거주 상태 (Step 0 결과) / Residency status (from Step 0) */
  residencyData: ResidencyData;
}

/** ARC 번호 포맷 검증 / ARC number format validation */
function isValidArcFormat(arc: string): boolean {
  // ARC 번호 형식: 숫자 13자리 또는 하이픈 포함 패턴
  // ARC number format: 13 digits or pattern with hyphens
  const cleaned = arc.replace(/[-\s]/g, '');
  return /^\d{13}$/.test(cleaned);
}

/** ARC 카드 미리보기 / ARC card preview */
function ArcCardPreview({
  imageSrc,
  side,
  onRemove,
}: {
  imageSrc: string | null;
  side: 'front' | 'back';
  onRemove: () => void;
}) {
  if (!imageSrc) return null;

  return (
    <div className="relative group rounded-xl overflow-hidden border border-gray-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={side === 'front' ? '외국인등록증 앞면 / ARC front' : '외국인등록증 뒷면 / ARC back'}
        className="w-full h-32 object-cover"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`${side === 'front' ? '앞면' : '뒷면'} 삭제 / Remove ${side}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Step2Visa({ data, onChange, residencyData }: Step2VisaProps) {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const [arcValid, setArcValid] = useState<boolean | null>(null);

  /** 필드 업데이트 헬퍼 / Field update helper */
  const updateField = <K extends keyof VisaData>(key: K, value: VisaData[K]) => {
    onChange({ ...data, [key]: value });
  };

  /** 현재 선택된 비자 유형의 세부유형 목록 / Sub-types for currently selected visa type */
  const selectedVisaType = VISA_TYPE_OPTIONS.find((v) => v.value === data.visaType);

  /** ARC 번호 입력 핸들러 / ARC number input handler */
  const handleArcChange = (value: string) => {
    updateField('arcNumber', value);
    if (value.replace(/[-\s]/g, '').length >= 13) {
      setArcValid(isValidArcFormat(value));
    } else {
      setArcValid(null);
    }
  };

  /** 이미지 업로드 핸들러 / Image upload handler */
  const handleImageUpload = (side: 'front' | 'back') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mock: URL.createObjectURL 사용 / Using createObjectURL for mock
    const mockUrl = URL.createObjectURL(file);

    if (side === 'front') {
      updateField('arcFrontImage', mockUrl);
    } else {
      updateField('arcBackImage', mockUrl);
    }

    // OCR 시뮬레이션 / OCR simulation
    if (side === 'front' && !data.arcNumber) {
      updateField('ocrStatus', 'PROCESSING');
      // 실제로는 POST /visa-verification/ocr 호출
      // In production: call POST /visa-verification/ocr
      setTimeout(() => {
        onChange({
          ...data,
          arcFrontImage: mockUrl,
          ocrStatus: 'SUCCESS',
          arcNumber: '123456-1234567',
          expiryDate: '2027-03-15',
        });
      }, 2000);
    }
  };

  /** 해외 거주자인 경우 비자 정보만 간략하게 / Simplified for overseas residents */
  const isOverseas = residencyData.residencyStatus === ResidencyStatus.OVERSEAS;

  return (
    <div className="space-y-6">
      {/* 비자 유형 / Visa type */}
      <div className="space-y-1.5">
        <Label htmlFor="visaType" className="text-sm text-gray-700">
          비자 유형 <span className="text-gray-400 font-normal">/ Visa Type</span>
          <span className="text-red-500 ml-0.5">*</span>
        </Label>
        <select
          id="visaType"
          value={data.visaType}
          onChange={(e) => {
            updateField('visaType', e.target.value);
            updateField('visaSubType', '');
          }}
          className="w-full min-h-[44px] px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          aria-label="비자 유형 선택 / Select visa type"
        >
          <option value="">비자 유형 선택 / Select visa type</option>
          {VISA_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} ({opt.labelEn})
            </option>
          ))}
        </select>
      </div>

      {/* 세부 유형 / Sub-type */}
      {selectedVisaType && selectedVisaType.subTypes.length > 0 && (
        <div className="space-y-1.5">
          <Label htmlFor="visaSubType" className="text-sm text-gray-700">
            세부 유형 <span className="text-gray-400 font-normal">/ Sub-type</span>
          </Label>
          <select
            id="visaSubType"
            value={data.visaSubType}
            onChange={(e) => updateField('visaSubType', e.target.value)}
            className="w-full min-h-[44px] px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            aria-label="세부 유형 선택 / Select sub-type"
          >
            <option value="">세부 유형 선택 / Select sub-type</option>
            {selectedVisaType.subTypes.map((sub) => (
              <option key={sub.value} value={sub.value}>
                {sub.label} ({sub.labelEn})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ARC 정보 (해외 거주자 또는 비자 미선택 시 생략) / ARC info (skip for overseas or no visa selected) */}
      {!isOverseas && data.visaType && (
        <>
          {/* ARC 번호 / ARC number */}
          <div className="space-y-1.5">
            <Label htmlFor="arcNumber" className="text-sm text-gray-700">
              외국인등록번호 <span className="text-gray-400 font-normal">/ ARC Number</span>
              <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="arcNumber"
                value={data.arcNumber}
                onChange={(e) => handleArcChange(e.target.value)}
                placeholder="000000-0000000"
                className={cn(
                  'min-h-[44px] rounded-xl pl-10 pr-10',
                  arcValid === true && 'border-green-400 focus-visible:border-green-400',
                  arcValid === false && 'border-red-400 focus-visible:border-red-400',
                )}
              />
              {/* 검증 아이콘 / Validation icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {arcValid === true && <CheckCircle className="w-4 h-4 text-green-500" />}
                {arcValid === false && <AlertCircle className="w-4 h-4 text-red-500" />}
              </div>
            </div>
            {arcValid === false && (
              <p className="text-xs text-red-500 mt-1">
                {/* 올바른 형식이 아닙니다 / Invalid format */}
                올바른 형식이 아닙니다 (13자리 숫자) / Invalid format (13 digits)
              </p>
            )}
          </div>

          {/* 만료일 / Expiry date */}
          <div className="space-y-1.5">
            <Label htmlFor="expiryDate" className="text-sm text-gray-700">
              체류자격 만료일 <span className="text-gray-400 font-normal">/ Visa Expiry Date</span>
              <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="expiryDate"
              type="date"
              value={data.expiryDate}
              onChange={(e) => updateField('expiryDate', e.target.value)}
              className="min-h-[44px] rounded-xl"
              min={new Date().toISOString().split('T')[0]}
            />
            {/* 만료 임박 경고 / Expiry warning */}
            {data.expiryDate && (() => {
              const daysLeft = Math.ceil(
                (new Date(data.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              if (daysLeft <= 90 && daysLeft > 0) {
                return (
                  <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {/* D-{daysLeft}일 남음. 연장을 권장합니다 */}
                    D-{daysLeft} remaining. We recommend extending your visa
                  </p>
                );
              }
              if (daysLeft <= 0) {
                return (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {/* 체류자격이 만료되었습니다 / Visa has expired */}
                    체류자격이 만료되었습니다 / Visa has expired
                  </p>
                );
              }
              return null;
            })()}
          </div>

          {/* ARC 카드 이미지 업로드 / ARC card image upload */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-700">
                외국인등록증 촬영 <span className="text-gray-400 font-normal">/ ARC Photo</span>
              </Label>
              {data.ocrStatus === 'PROCESSING' && (
                <span className="flex items-center gap-1 text-xs text-blue-500">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  OCR 인식 중...
                </span>
              )}
              {data.ocrStatus === 'SUCCESS' && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  자동 인식 완료
                </span>
              )}
            </div>

            {/* 안내 메시지 / Info message */}
            <p className="text-xs text-gray-500">
              외국인등록증 앞뒷면을 촬영해주세요
              <span className="text-gray-400"> / Please upload both sides of your ARC</span>
            </p>

            {/* 앞면 / Front side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-gray-600">
                  앞면 <span className="text-gray-400">/ Front</span>
                </p>
                {data.arcFrontImage ? (
                  <ArcCardPreview
                    imageSrc={data.arcFrontImage}
                    side="front"
                    onRemove={() => updateField('arcFrontImage', null)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => frontInputRef.current?.click()}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500 transition-all"
                    aria-label="ARC 앞면 업로드 / Upload ARC front"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-xs">앞면 촬영</span>
                  </button>
                )}
                <input
                  ref={frontInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload('front')}
                />
              </div>

              {/* 뒷면 / Back side */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-gray-600">
                  뒷면 <span className="text-gray-400">/ Back</span>
                </p>
                {data.arcBackImage ? (
                  <ArcCardPreview
                    imageSrc={data.arcBackImage}
                    side="back"
                    onRemove={() => updateField('arcBackImage', null)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => backInputRef.current?.click()}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500 transition-all"
                    aria-label="ARC 뒷면 업로드 / Upload ARC back"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-xs">뒷면 촬영</span>
                  </button>
                )}
                <input
                  ref={backInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload('back')}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* 해외 거주자 안내 / Overseas resident notice */}
      {isOverseas && (
        <div className="flex items-start gap-2 p-4 bg-amber-50 rounded-xl text-sm text-amber-700 border border-amber-200">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">해외 거주자 안내</p>
            <p className="text-xs mt-1">
              해외 거주자는 ARC 정보 입력이 필요하지 않습니다.
              입국 후 비자 발급 시 업데이트해주세요.
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Overseas residents do not need to enter ARC information.
              Please update after entering Korea and receiving your visa.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
