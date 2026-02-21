'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Step 1: 신원정보 폼 (간소화) / Step 1: Identity form (simplified)
 * 이름, 생년월일, 국적, 연락처 입력
 * Name, DOB, nationality, contact input
 */

interface Step1IdentityProps {
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}

export default function Step1Identity({ onSave, onClose }: Step1IdentityProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    fullNameEn: '',
    dateOfBirth: '',
    nationality: '',
    phone: '',
    email: '',
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

  const isComplete = formData.fullName && formData.dateOfBirth && formData.nationality && formData.phone;

  return (
    <div className="space-y-5">
      {/* 이름 (한글) / Full name (Korean) */}
      <div className="space-y-1.5">
        <Label htmlFor="identity-name" className="text-sm font-semibold text-gray-700">
          이름 (한글) <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-1">/ Full Name (Korean)</span>
        </Label>
        <Input
          id="identity-name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="홍길동"
          className="h-11 rounded-xl"
          aria-required="true"
        />
      </div>

      {/* 이름 (영문) / Full name (English) */}
      <div className="space-y-1.5">
        <Label htmlFor="identity-name-en" className="text-sm font-semibold text-gray-700">
          이름 (영문)
          <span className="text-xs text-gray-400 ml-1">/ Full Name (English)</span>
        </Label>
        <Input
          id="identity-name-en"
          value={formData.fullNameEn}
          onChange={(e) => setFormData({ ...formData, fullNameEn: e.target.value })}
          placeholder="HONG GILDONG"
          className="h-11 rounded-xl"
        />
      </div>

      {/* 생년월일 / Date of birth */}
      <div className="space-y-1.5">
        <Label htmlFor="identity-dob" className="text-sm font-semibold text-gray-700">
          생년월일 <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-1">/ Date of Birth</span>
        </Label>
        <Input
          id="identity-dob"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          className="h-11 rounded-xl"
          aria-required="true"
        />
      </div>

      {/* 국적 / Nationality */}
      <div className="space-y-1.5">
        <Label htmlFor="identity-nationality" className="text-sm font-semibold text-gray-700">
          국적 <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-1">/ Nationality</span>
        </Label>
        <Input
          id="identity-nationality"
          value={formData.nationality}
          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
          placeholder="베트남 / Vietnam"
          className="h-11 rounded-xl"
          aria-required="true"
        />
      </div>

      {/* 전화번호 / Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="identity-phone" className="text-sm font-semibold text-gray-700">
          전화번호 <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-1">/ Phone Number</span>
        </Label>
        <Input
          id="identity-phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="010-1234-5678"
          className="h-11 rounded-xl"
          aria-required="true"
        />
      </div>

      {/* 이메일 / Email */}
      <div className="space-y-1.5">
        <Label htmlFor="identity-email" className="text-sm font-semibold text-gray-700">
          이메일
          <span className="text-xs text-gray-400 ml-1">/ Email</span>
        </Label>
        <Input
          id="identity-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="user@example.com"
          className="h-11 rounded-xl"
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
