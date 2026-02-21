'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  Calendar,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VISA_TYPES } from '../mock-data';
import type { VisaFormData } from '../wizard-types';

/**
 * Step 2: 비자정보 폼 (상세 구현) / Step 2: Visa info form (detailed)
 * 비자 유형, 체류 상태, 만료일, 취업 가능 여부, 취업 제한, 재입국 허가
 * Visa type, residency status, expiry, work eligibility, restrictions, re-entry permit
 */

interface Step2VisaProps {
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}

/** 체류 상태 옵션 / Residency status options */
const RESIDENCY_STATUS_OPTIONS = [
  { value: 'valid', label: '유효 (체류 중)', labelEn: 'Valid (Staying)' },
  { value: 'expiring_soon', label: '만료 임박 (90일 이내)', labelEn: 'Expiring Soon (<90 days)' },
  { value: 'extension_pending', label: '연장 심사 중', labelEn: 'Extension Pending' },
  { value: 'change_pending', label: '변경 심사 중', labelEn: 'Status Change Pending' },
  { value: 'not_entered', label: '미입국 (비자 발급)', labelEn: 'Not Entered (Visa Issued)' },
] as const;

export default function Step2Visa({ onSave, onClose }: Step2VisaProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<VisaFormData>({
    visaType: '',
    visaStatus: '',
    visaExpiry: '',
    canWorkLegally: false,
    workRestrictions: '',
    reentryPermit: false,
  });

  // 만료일까지 남은 일수 계산 / Calculate days until expiry
  const daysUntilExpiry = formData.visaExpiry
    ? Math.ceil(
        (new Date(formData.visaExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  // 만료 경고 수준 / Expiry warning level
  const expiryWarning = daysUntilExpiry !== null
    ? daysUntilExpiry <= 0
      ? 'expired'    // 만료됨 / Expired
      : daysUntilExpiry <= 30
        ? 'critical'  // 위급 / Critical
        : daysUntilExpiry <= 90
          ? 'warning'   // 경고 / Warning
          : 'safe'      // 안전 / Safe
    : null;

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(formData as unknown as Record<string, unknown>);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  // 필수 필드 완성 여부 / Required fields complete
  const isComplete = formData.visaType && formData.visaStatus && formData.visaExpiry;

  // 선택된 비자 유형 정보 / Selected visa type info
  const selectedVisa = VISA_TYPES.find((v) => v.code === formData.visaType);

  return (
    <div className="space-y-6">
      {/* 안내 배너 / Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">
            {/* 비자 정보는 잡차자 매칭의 핵심입니다 / Visa info is key to JobChaJa matching */}
            비자 정보는 잡차자 매칭의 핵심입니다
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            {/* 정확한 정보를 입력해야 적합한 채용공고를 추천받을 수 있습니다 */}
            정확한 정보를 입력해야 적합한 채용공고를 추천받을 수 있습니다
          </p>
          <p className="text-[10px] text-blue-500 mt-1">
            Accurate info ensures better job matching recommendations
          </p>
        </div>
      </div>

      {/* === 비자 유형 선택 / Visa type selection === */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">
          비자 유형 <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-1">/ Visa Type</span>
        </Label>
        <Select
          value={formData.visaType}
          onValueChange={(v) => setFormData({ ...formData, visaType: v })}
        >
          <SelectTrigger
            className="h-11 rounded-xl w-full"
            aria-label="비자 유형 선택 / Select visa type"
          >
            <SelectValue placeholder="비자 유형을 선택하세요 / Select visa type" />
          </SelectTrigger>
          <SelectContent>
            {VISA_TYPES.map((visa) => (
              <SelectItem key={visa.code} value={visa.code}>
                <span className="font-medium">{visa.code}</span>
                <span className="text-gray-500 ml-2 text-xs">{visa.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 선택된 비자 유형 카드 / Selected visa type card */}
        {selectedVisa && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-blue-800 text-sm">{selectedVisa.code}</span>
              <span className="text-xs text-blue-600">{selectedVisa.label}</span>
            </div>
            <p className="text-[10px] text-blue-500 mt-1">{selectedVisa.labelEn}</p>
          </div>
        )}
      </div>

      {/* === 체류 상태 / Residency status === */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">
          체류 상태 <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-1">/ Residency Status</span>
        </Label>
        <Select
          value={formData.visaStatus}
          onValueChange={(v) => setFormData({ ...formData, visaStatus: v })}
        >
          <SelectTrigger
            className="h-11 rounded-xl w-full"
            aria-label="체류 상태 선택 / Select residency status"
          >
            <SelectValue placeholder="현재 체류 상태 / Current status" />
          </SelectTrigger>
          <SelectContent>
            {RESIDENCY_STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* === 비자 만료일 / Visa expiry date === */}
      <div className="space-y-2">
        <Label htmlFor="visa-expiry" className="text-sm font-semibold text-gray-700">
          비자 만료일 <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-1">/ Visa Expiry Date</span>
        </Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            id="visa-expiry"
            type="date"
            value={formData.visaExpiry}
            onChange={(e) => setFormData({ ...formData, visaExpiry: e.target.value })}
            className="h-11 rounded-xl pl-10"
            aria-required="true"
          />
        </div>

        {/* 만료일 경고 카드 / Expiry warning card */}
        {expiryWarning && (
          <div
            className={cn(
              'rounded-xl p-3 flex items-center gap-2 text-sm',
              expiryWarning === 'expired' && 'bg-red-50 border border-red-200 text-red-700',
              expiryWarning === 'critical' && 'bg-red-50 border border-red-200 text-red-600',
              expiryWarning === 'warning' && 'bg-amber-50 border border-amber-200 text-amber-700',
              expiryWarning === 'safe' && 'bg-green-50 border border-green-200 text-green-700',
            )}
            role="alert"
          >
            {expiryWarning === 'safe' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span className="text-xs font-medium">
              {expiryWarning === 'expired' && `만료됨 / Expired`}
              {expiryWarning === 'critical' && `만료 ${daysUntilExpiry}일 전 (긴급) / ${daysUntilExpiry} days left (Urgent)`}
              {expiryWarning === 'warning' && `만료 ${daysUntilExpiry}일 전 / ${daysUntilExpiry} days left`}
              {expiryWarning === 'safe' && `만료까지 ${daysUntilExpiry}일 (안전) / ${daysUntilExpiry} days left (Safe)`}
            </span>
          </div>
        )}
      </div>

      {/* === 취업 가능 여부 / Work eligibility === */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">
          취업 관련 사항
          <span className="text-xs text-gray-400 ml-1">/ Employment Details</span>
        </Label>

        {/* 합법 취업 가능 여부 / Legally allowed to work */}
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
          <Checkbox
            id="can-work"
            checked={formData.canWorkLegally}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, canWorkLegally: checked === true })
            }
            className="mt-0.5"
            aria-label="합법적 취업 가능 / Legally allowed to work"
          />
          <div>
            <Label htmlFor="can-work" className="text-sm font-medium text-gray-700 cursor-pointer">
              합법적 취업이 가능합니다
            </Label>
            <p className="text-[10px] text-gray-400 mt-0.5">
              I am legally allowed to work in Korea
            </p>
          </div>
        </div>

        {/* 재입국 허가 / Re-entry permit */}
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
          <Checkbox
            id="reentry"
            checked={formData.reentryPermit}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, reentryPermit: checked === true })
            }
            className="mt-0.5"
            aria-label="재입국 허가 보유 / Has re-entry permit"
          />
          <div>
            <Label htmlFor="reentry" className="text-sm font-medium text-gray-700 cursor-pointer">
              재입국 허가를 보유하고 있습니다
            </Label>
            <p className="text-[10px] text-gray-400 mt-0.5">
              I have a re-entry permit
            </p>
          </div>
        </div>
      </div>

      {/* === 취업 제한 사항 / Work restrictions === */}
      <div className="space-y-2">
        <Label htmlFor="work-restrictions" className="text-sm font-semibold text-gray-700">
          취업 제한 사항 (선택)
          <span className="text-xs text-gray-400 ml-1">/ Work Restrictions (Optional)</span>
        </Label>
        <textarea
          id="work-restrictions"
          value={formData.workRestrictions}
          onChange={(e) => setFormData({ ...formData, workRestrictions: e.target.value })}
          placeholder="근무 시간 제한, 업종 제한 등이 있다면 기재해주세요&#10;Please describe any work time or industry restrictions"
          className="w-full h-24 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder:text-gray-400"
          aria-label="취업 제한 사항 / Work restrictions"
        />
      </div>

      {/* === 비자 서류 업로드 안내 / Visa document upload guide === */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">
            {/* 비자 인증 서류 / Visa Verification Documents */}
            비자 인증 서류
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {/* 비자 인증은 별도의 비자 인증 페이지에서 진행할 수 있습니다 */}
          비자 인증은 별도의 비자 인증 페이지에서 진행할 수 있습니다.
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          Visa verification can be done on the separate visa verification page.
        </p>
        <Button
          variant="outline"
          className="mt-3 h-9 rounded-lg text-xs"
          onClick={() => {
            // 비자 인증 페이지로 이동 / Navigate to visa verification page
            // 실제 연동 시 router.push('/worker/visa-verification') 사용
          }}
          aria-label="비자 인증 페이지로 이동 / Go to visa verification"
        >
          비자 인증 바로가기 / Go to Verification
        </Button>
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
