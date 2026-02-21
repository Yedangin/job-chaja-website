'use client';

/**
 * Step 1: 기본 신원 정보 / Basic identity information
 * 이름, 국적, 생년월일, 성별, 연락처, 사진, 주소
 * Name, nationality, birthdate, gender, contact, photo, address
 */

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Camera, User, Upload, Search } from 'lucide-react';
import { Gender, ResidencyStatus } from '../types';
import type { IdentityData, ResidencyData } from '../types';
import { NATIONALITY_OPTIONS } from '../mock-data';

interface Step1IdentityProps {
  /** 현재 데이터 / Current data */
  data: IdentityData;
  /** 거주 상태 데이터 / Residency data */
  residencyData: ResidencyData;
  /** 데이터 변경 핸들러 / Data change handler */
  onChange: (data: IdentityData) => void;
}

/** 성별 선택지 / Gender options */
const GENDER_OPTIONS: { value: Gender; label: string; labelEn: string }[] = [
  { value: Gender.MALE, label: '남성', labelEn: 'Male' },
  { value: Gender.FEMALE, label: '여성', labelEn: 'Female' },
  { value: Gender.OTHER, label: '기타', labelEn: 'Other' },
];

export default function Step1Identity({ data, residencyData, onChange }: Step1IdentityProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** 한국 거주 여부 / Is residing in Korea */
  const isKoreanResident =
    residencyData.residencyStatus === ResidencyStatus.LONG_TERM ||
    residencyData.residencyStatus === ResidencyStatus.SHORT_TERM;

  /** 필드 업데이트 헬퍼 / Field update helper */
  const updateField = <K extends keyof IdentityData>(
    key: K,
    value: IdentityData[K],
  ) => {
    onChange({ ...data, [key]: value });
  };

  /** 프로필 사진 업로드 핸들러 / Profile photo upload handler */
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 실제로는 POST /individual-profile/upload 호출
      // In production: call POST /individual-profile/upload
      const mockUrl = URL.createObjectURL(file);
      updateField('profilePhoto', mockUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* 프로필 사진 / Profile photo */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative w-24 h-24 rounded-full overflow-hidden',
            'border-2 border-dashed border-gray-300 hover:border-blue-400',
            'flex items-center justify-center bg-gray-50 transition-all',
            'focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2',
          )}
          aria-label="프로필 사진 업로드 / Upload profile photo"
        >
          {data.profilePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.profilePhoto}
              alt="프로필 사진 / Profile photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
            <Camera className="w-3.5 h-3.5 text-white" />
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
          aria-hidden="true"
        />
        <p className="text-xs text-gray-400">
          {/* 사진을 탭하여 업로드 / Tap photo to upload */}
          Tap to upload photo
        </p>
      </div>

      {/* 이름 / Name */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-sm text-gray-700">
            성 <span className="text-gray-400 font-normal">/ Last Name</span>
          </Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="홍 / Hong"
            className="min-h-[44px] rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="firstName" className="text-sm text-gray-700">
            이름 <span className="text-gray-400 font-normal">/ First Name</span>
          </Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="길동 / Gildong"
            className="min-h-[44px] rounded-xl"
          />
        </div>
      </div>

      {/* 국적 / Nationality */}
      <div className="space-y-1.5">
        <Label htmlFor="nationality" className="text-sm text-gray-700">
          국적 <span className="text-gray-400 font-normal">/ Nationality</span>
          <span className="text-red-500 ml-0.5">*</span>
        </Label>
        <select
          id="nationality"
          value={data.nationality}
          onChange={(e) => updateField('nationality', e.target.value)}
          className="w-full min-h-[44px] px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          aria-label="국적 선택 / Select nationality"
        >
          <option value="">선택해주세요 / Please select</option>
          {NATIONALITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} ({opt.labelEn})
            </option>
          ))}
        </select>
      </div>

      {/* 생년월일 / Date of birth */}
      <div className="space-y-1.5">
        <Label htmlFor="birthDate" className="text-sm text-gray-700">
          생년월일 <span className="text-gray-400 font-normal">/ Date of Birth</span>
          <span className="text-red-500 ml-0.5">*</span>
        </Label>
        <Input
          id="birthDate"
          type="date"
          value={data.birthDate}
          onChange={(e) => updateField('birthDate', e.target.value)}
          className="min-h-[44px] rounded-xl"
          max="2010-12-31"
        />
      </div>

      {/* 성별 / Gender */}
      <div className="space-y-1.5">
        <Label className="text-sm text-gray-700">
          성별 <span className="text-gray-400 font-normal">/ Gender</span>
          <span className="text-xs text-gray-500 block mt-0.5">
            (기숙사 제공 등 복지 정보 제공에 사용)
          </span>
        </Label>
        <div className="flex gap-2">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('gender', option.value)}
              className={cn(
                'flex-1 min-h-[44px] rounded-xl text-sm font-medium transition-all',
                'focus:outline-none focus:ring-2 focus:ring-blue-300',
                data.gender === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200',
              )}
              aria-pressed={data.gender === option.value}
            >
              {option.label}
              <span className="text-xs ml-0.5 opacity-70">{option.labelEn}</span>
            </button>
          ))}
        </div>
        {data.gender === Gender.OTHER && (
          <p className="text-xs text-amber-600 mt-1.5 flex items-start gap-1">
            <span className="shrink-0">⚠️</span>
            <span>기타를 선택하면 일부 업종 정보 제공이 제한될 수 있습니다.</span>
          </p>
        )}
      </div>

      {/* 연락처 / Contact */}
      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-sm text-gray-700">
          전화번호 <span className="text-gray-400 font-normal">/ Phone</span>
          <span className="text-red-500 ml-0.5">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="010-1234-5678"
          className="min-h-[44px] rounded-xl"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm text-gray-700">
          이메일 <span className="text-gray-400 font-normal">/ Email</span>
          <span className="text-xs text-gray-500 ml-1">(가입 시 사용한 이메일)</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          readOnly
          className="min-h-[44px] rounded-xl bg-gray-50 text-gray-600"
          placeholder="example@email.com"
        />
      </div>

      {/* 주소 / Address */}
      <div className="space-y-1.5">
        <Label htmlFor="address" className="text-sm text-gray-700">
          주소 <span className="text-gray-400 font-normal">/ Address</span>
          {isKoreanResident && (
            <span className="text-xs text-gray-500 ml-1">(한국 주소 검색)</span>
          )}
        </Label>

        {isKoreanResident ? (
          // 한국 거주: 주소 검색 API / Korean resident: Address search API
          <>
            <div className="flex gap-2">
              <Input
                id="address"
                value={data.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="주소 검색 버튼을 눌러주세요 / Click search button"
                className="min-h-[44px] rounded-xl flex-1"
                readOnly
              />
              <Button
                type="button"
                variant="outline"
                className="min-h-[44px] min-w-[44px] rounded-xl shrink-0"
                onClick={() => {
                  // 실제로는 카카오/네이버 주소 검색 API 연동
                  // In production: integrate Kakao/Naver address search API
                  // 예: daum.Postcode API 호출
                  // Example: call daum.Postcode API
                  updateField('address', '서울특별시 강남구 테헤란로 123');
                }}
                aria-label="주소 검색 / Search address"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <Input
              value={data.addressDetail}
              onChange={(e) => updateField('addressDetail', e.target.value)}
              placeholder="상세 주소 (동, 호수 등) / Detailed address (Dong, unit number, etc.)"
              className="min-h-[44px] rounded-xl mt-2"
            />
          </>
        ) : (
          // 해외 거주: 수동 입력 / Overseas: Manual entry
          <>
            <Input
              id="address"
              value={data.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="국가, 도시, 주소 입력 / Enter country, city, address"
              className="min-h-[44px] rounded-xl"
            />
            <Input
              value={data.addressDetail}
              onChange={(e) => updateField('addressDetail', e.target.value)}
              placeholder="상세 주소 (선택사항) / Detailed address (optional)"
              className="min-h-[44px] rounded-xl mt-2"
            />
            <p className="text-xs text-gray-400 mt-1">
              현재 거주 중인 해외 주소를 입력해주세요
              <br />
              Please enter your current overseas address
            </p>
          </>
        )}
      </div>
    </div>
  );
}
