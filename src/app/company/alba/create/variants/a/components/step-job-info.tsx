'use client';

import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AlbaJobFormData, KoreanLevel, ExperienceLevel, Benefit } from '../types';
import {
  KOREAN_LEVEL_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  BENEFIT_LABELS,
} from '../mock-data';

/**
 * Step 2: 어디서, 어떻게? (미니멀 스타일)
 * Step 2: Where and how? (minimal style)
 *
 * 공고 제목, 주소, 우대조건, 복리후생, 상세설명
 * Title, address, preferences, benefits, detail description
 */

interface StepJobInfoProps {
  form: AlbaJobFormData;
  onUpdate: (updates: Partial<AlbaJobFormData>) => void;
  errors: Record<string, string>;
}

const KOREAN_LEVELS: KoreanLevel[] = ['NONE', 'BASIC', 'DAILY', 'BUSINESS'];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ['NONE', 'UNDER_1Y', 'ONE_TO_THREE_Y', 'OVER_3Y'];
const ALL_BENEFITS: Benefit[] = ['MEAL', 'TRANSPORT', 'INSURANCE', 'HOUSING', 'UNIFORM', 'STAFF_DISCOUNT', 'BONUS', 'FLEXIBLE_HOURS'];

export function StepJobInfo({ form, onUpdate, errors }: StepJobInfoProps) {
  // 다음 주소 API 호출 (카카오 주소 검색)
  // Daum address API call (Kakao address search)
  const handleAddressSearch = useCallback(() => {
    // 실제로는 다음 주소 API를 호출
    // In production, call Daum/Kakao address API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as unknown as Record<string, unknown>;
    if (typeof window !== 'undefined' && win.daum) {
      const daum = win.daum as Record<string, unknown>;
      const PostcodeConstructor = daum.Postcode as new (config: Record<string, unknown>) => void;
      new PostcodeConstructor({
        oncomplete: (data: Record<string, string>) => {
          onUpdate({
            address: {
              ...form.address,
              sido: data.sido || '',
              sigungu: data.sigungu || '',
              detail: data.address || '',
            },
          });
        },
      });
    } else {
      // 개발용 폴백 / Development fallback
      onUpdate({
        address: {
          sido: '서울특별시',
          sigungu: '강남구',
          detail: '역삼동 123-45',
          lat: 37.4979,
          lng: 127.0276,
        },
      });
    }
  }, [form.address, onUpdate]);

  // 복리후생 토글 / Toggle benefit
  const toggleBenefit = useCallback(
    (benefit: Benefit) => {
      const current = form.benefits;
      const newBenefits = current.includes(benefit)
        ? current.filter((b) => b !== benefit)
        : [...current, benefit];
      onUpdate({ benefits: newBenefits });
    },
    [form.benefits, onUpdate],
  );

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 / Section header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          어디서, 어떻게?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          근무지와 상세 조건을 설정해주세요 <span className="text-gray-400">/ Set workplace and details</span>
        </p>
      </div>

      {/* 공고 제목 / Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          공고 제목 <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal ml-1">/ Job Title</span>
        </Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="예: 강남역 근처 카페 주말 바리스타 모집"
          maxLength={100}
          className={cn(
            'min-h-[48px] rounded-2xl',
            errors.title && 'border-red-300',
          )}
          aria-label="공고 제목 / Job title"
        />
        <div className="flex justify-between">
          {errors.title ? (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.title}
            </p>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-400">{form.title.length}/100</span>
        </div>
      </div>

      {/* 근무지 주소 / Workplace address */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          근무지 주소 <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal ml-1">/ Workplace Address</span>
        </Label>
        <div className="flex gap-2">
          <Input
            readOnly
            value={
              form.address.sido
                ? `${form.address.sido} ${form.address.sigungu} ${form.address.detail}`
                : ''
            }
            placeholder="주소를 검색해주세요 / Search address"
            className="flex-1 min-h-[48px] rounded-2xl bg-gray-50 cursor-pointer"
            onClick={handleAddressSearch}
            aria-label="선택된 주소 / Selected address"
          />
          <button
            type="button"
            onClick={handleAddressSearch}
            className="min-h-[48px] px-5 bg-gray-900 text-white rounded-2xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shrink-0"
            aria-label="주소 검색 / Search address"
          >
            <MapPin className="w-4 h-4" />
            검색
          </button>
        </div>
        {errors.address && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.address}
          </p>
        )}
      </div>

      {/* 한국어 수준 / Korean level */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          한국어 수준
          <span className="text-gray-400 font-normal ml-1">/ Korean Level</span>
        </Label>
        <div className="flex gap-2">
          {KOREAN_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onUpdate({ koreanLevel: level })}
              className={cn(
                'flex-1 min-h-[44px] rounded-xl text-sm font-medium transition-all',
                'focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 outline-none',
                form.koreanLevel === level
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200',
              )}
              aria-label={`${KOREAN_LEVEL_LABELS[level].ko} (${KOREAN_LEVEL_LABELS[level].en})`}
              aria-pressed={form.koreanLevel === level}
            >
              {KOREAN_LEVEL_LABELS[level].ko}
            </button>
          ))}
        </div>
      </div>

      {/* 경력 수준 / Experience level */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          경력
          <span className="text-gray-400 font-normal ml-1">/ Experience</span>
        </Label>
        <div className="flex gap-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onUpdate({ experienceLevel: level })}
              className={cn(
                'flex-1 min-h-[44px] rounded-xl text-sm font-medium transition-all',
                'focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 outline-none',
                form.experienceLevel === level
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200',
              )}
              aria-label={`${EXPERIENCE_LEVEL_LABELS[level].ko} (${EXPERIENCE_LEVEL_LABELS[level].en})`}
              aria-pressed={form.experienceLevel === level}
            >
              {EXPERIENCE_LEVEL_LABELS[level].ko}
            </button>
          ))}
        </div>
      </div>

      {/* 우대사항 / Preferred qualifications */}
      <div className="space-y-2">
        <Label htmlFor="preferredQualifications" className="text-sm font-medium text-gray-700">
          우대사항
          <span className="text-gray-400 font-normal ml-1">/ Preferred Qualifications</span>
        </Label>
        <textarea
          id="preferredQualifications"
          value={form.preferredQualifications}
          onChange={(e) => onUpdate({ preferredQualifications: e.target.value })}
          placeholder="예: 바리스타 자격증 우대, 영어 가능자 우대"
          className={cn(
            'w-full min-h-[80px] px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none transition-all resize-none',
            'focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
          )}
          aria-label="우대사항 / Preferred qualifications"
        />
      </div>

      {/* 복리후생 / Benefits */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          복리후생
          <span className="text-gray-400 font-normal ml-1">/ Benefits</span>
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ALL_BENEFITS.map((benefit) => {
            const isSelected = form.benefits.includes(benefit);
            return (
              <button
                key={benefit}
                type="button"
                onClick={() => toggleBenefit(benefit)}
                className={cn(
                  'min-h-[44px] px-3 rounded-xl text-sm font-medium transition-all',
                  'focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 outline-none',
                  isSelected
                    ? 'bg-blue-50 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200',
                )}
                aria-label={`${BENEFIT_LABELS[benefit].ko} (${BENEFIT_LABELS[benefit].en})`}
                aria-pressed={isSelected}
              >
                {BENEFIT_LABELS[benefit].ko}
              </button>
            );
          })}
        </div>
      </div>

      {/* 상세 직무설명 / Detail description */}
      <div className="space-y-2">
        <Label htmlFor="detailDescription" className="text-sm font-medium text-gray-700">
          상세 직무설명 <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal ml-1">/ Detail Description</span>
        </Label>
        <textarea
          id="detailDescription"
          value={form.detailDescription}
          onChange={(e) => onUpdate({ detailDescription: e.target.value })}
          placeholder="근무 환경, 업무 내용, 채용 조건 등을 자세히 작성해주세요 / Describe work environment, tasks, conditions in detail"
          className={cn(
            'w-full min-h-[160px] px-4 py-3 rounded-2xl border bg-white text-sm outline-none transition-all resize-none leading-relaxed',
            'focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
            errors.detailDescription ? 'border-red-300' : 'border-gray-200',
          )}
          aria-label="상세 직무설명 / Detail description"
          aria-invalid={!!errors.detailDescription}
        />
        {errors.detailDescription && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.detailDescription}
          </p>
        )}
      </div>
    </div>
  );
}
