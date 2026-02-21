'use client';

import type { AlbaJobFormData, Benefit, ExperienceLevel, KoreanLevel } from '../../../a/types';
import {
  MapPin, FileText, Languages, Award, Gift, Check,
} from 'lucide-react';

interface StepDetailsProps {
  /** 현재 폼 데이터 / Current form data */
  form: Partial<AlbaJobFormData>;
  /** 폼 업데이트 콜백 / Form update callback */
  onUpdate: (data: Partial<AlbaJobFormData>) => void;
}

/** 복리후생 옵션 / Benefits options */
const BENEFIT_OPTIONS: { id: Benefit; label: string; labelEn: string; icon: string }[] = [
  { id: 'MEAL', label: '식사 제공', labelEn: 'Meal', icon: '🍚' },
  { id: 'TRANSPORT', label: '교통비 지원', labelEn: 'Transport', icon: '🚌' },
  { id: 'INSURANCE', label: '4대보험', labelEn: 'Insurance', icon: '🏥' },
  { id: 'HOUSING', label: '숙소 제공', labelEn: 'Housing', icon: '🏠' },
  { id: 'UNIFORM', label: '유니폼 지급', labelEn: 'Uniform', icon: '👔' },
  { id: 'STAFF_DISCOUNT', label: '직원 할인', labelEn: 'Discount', icon: '🏷' },
  { id: 'BONUS', label: '성과급', labelEn: 'Bonus', icon: '💰' },
  { id: 'FLEXIBLE_HOURS', label: '유연근무', labelEn: 'Flexible', icon: '⏰' },
];

/** 한국어 수준 옵션 / Korean level options */
const KOREAN_LEVEL_OPTIONS: { value: KoreanLevel; label: string }[] = [
  { value: 'NONE', label: '상관없음' },
  { value: 'BASIC', label: '기초 회화' },
  { value: 'DAILY', label: '일상 회화' },
  { value: 'BUSINESS', label: '업무 회화' },
];

/** 경력 수준 옵션 / Experience level options */
const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: 'NONE', label: '경력무관' },
  { value: 'UNDER_1Y', label: '1년 미만' },
  { value: 'ONE_TO_THREE_Y', label: '1년 ~ 3년' },
  { value: 'OVER_3Y', label: '3년 이상' },
];

/**
 * Step 2: 제목, 주소, 한국어수준, 경력, 우대사항, 복리후생, 상세설명
 * Step 2: Title, address, Korean level, experience, qualifications, benefits, description
 *
 * 시안 E 특징: 복리후생을 카드형 체크박스로 시각적 표현
 * Variant E feature: Benefits displayed as visual card checkboxes
 */
export function StepDetails({ form, onUpdate }: StepDetailsProps) {
  /** 텍스트 입력 핸들러 / Text input handler */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  /** 복리후생 토글 / Benefits toggle */
  const handleBenefitToggle = (benefitId: Benefit) => {
    const current = form.benefits ?? [];
    const updated = current.includes(benefitId)
      ? current.filter((b) => b !== benefitId)
      : [...current, benefitId];
    onUpdate({ benefits: updated });
  };

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 / Section header */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          상세 조건을 알려주세요
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          공고 제목과 근무 환경을 입력합니다. / Enter title and work environment details.
        </p>
      </div>

      {/* 공고 제목 / Job title */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          공고 제목 <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title || ''}
          onChange={handleInputChange}
          placeholder="예: 강남역 카페 주말 바리스타 모집"
          maxLength={100}
          className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          aria-label="공고 제목 / Job posting title"
        />
        <p className="text-xs text-gray-400 text-right">
          {(form.title || '').length}/100
        </p>
      </div>

      {/* 근무지 주소 / Workplace address */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <MapPin className="w-4 h-4 text-gray-400" />
          근무지 주소 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            placeholder="주소를 검색하세요"
            value={form.address ? `${form.address.sido} ${form.address.sigungu}` : ''}
            readOnly
            className="flex-1 h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 text-sm"
            aria-label="근무지 주소 / Workplace address"
          />
          <button
            type="button"
            className="px-4 h-11 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition"
            aria-label="주소 검색 / Search address"
          >
            검색
          </button>
        </div>
        <input
          name="addressDetail"
          placeholder="상세 주소를 입력하세요 (건물명, 층 등)"
          value={form.address?.detail || ''}
          onChange={(e) =>
            onUpdate({
              address: {
                sido: form.address?.sido || '',
                sigungu: form.address?.sigungu || '',
                detail: e.target.value,
                lat: form.address?.lat || 0,
                lng: form.address?.lng || 0,
              },
            })
          }
          className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          aria-label="상세 주소 / Detailed address"
        />
      </div>

      {/* 한국어 수준 + 경력 그리드 / Korean level + Experience grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* 한국어 수준 / Korean level */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Languages className="w-4 h-4 text-gray-400" />
            필요 한국어 수준
          </label>
          <select
            value={form.koreanLevel || 'NONE'}
            onChange={(e) => onUpdate({ koreanLevel: e.target.value as KoreanLevel })}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            aria-label="한국어 수준 선택 / Select Korean level"
          >
            {KOREAN_LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 경력 수준 / Experience level */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Award className="w-4 h-4 text-gray-400" />
            선호 경력
          </label>
          <select
            value={form.experienceLevel || 'NONE'}
            onChange={(e) => onUpdate({ experienceLevel: e.target.value as ExperienceLevel })}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            aria-label="경력 수준 선택 / Select experience level"
          >
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 우대사항 / Preferred qualifications */}
      <div className="space-y-2">
        <label htmlFor="preferredQualifications" className="text-sm font-medium text-gray-700">
          우대사항
        </label>
        <textarea
          id="preferredQualifications"
          name="preferredQualifications"
          value={form.preferredQualifications || ''}
          onChange={handleInputChange}
          placeholder="예: 인근 거주자, 관련 자격증 소지자"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          aria-label="우대사항 / Preferred qualifications"
        />
      </div>

      {/* 복리후생 카드형 체크박스 / Benefits card checkboxes */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <Gift className="w-4 h-4 text-gray-400" />
          복리후생 (Benefits)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BENEFIT_OPTIONS.map((opt) => {
            const isSelected = form.benefits?.includes(opt.id) ?? false;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleBenefitToggle(opt.id)}
                className={`relative flex flex-col items-center gap-1 p-3 rounded-lg border text-sm transition min-h-11
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                aria-pressed={isSelected}
                aria-label={`${opt.label} (${opt.labelEn})`}
              >
                {isSelected && (
                  <div className="absolute top-1 right-1">
                    <Check className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                )}
                <span className="text-lg">{opt.icon}</span>
                <span className="text-xs font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 상세 설명 / Detailed description */}
      <div className="space-y-2">
        <label htmlFor="detailDescription" className="text-sm font-medium text-gray-700">
          상세 설명 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="detailDescription"
          name="detailDescription"
          value={form.detailDescription || ''}
          onChange={handleInputChange}
          placeholder="채용 공고에 대한 자세한 내용을 기재해주세요. (업무 내용, 지원 자격, 근무 환경 등)"
          rows={8}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          aria-label="상세 설명 / Detailed description"
        />
      </div>
    </div>
  );
}
