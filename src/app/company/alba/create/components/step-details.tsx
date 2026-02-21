'use client';

import {
  FileText,
  MapPin,
  MessageCircle,
  Award,
  Heart,
  AlignLeft,
  AlertCircle,
} from 'lucide-react';
import {
  type AlbaJobFormData,
  type Benefit,
  type KoreanLevel,
  type ExperienceLevel,
  BENEFIT_OPTIONS,
} from './alba-types';

/**
 * Step 2: 상세조건 (E 스타일 — 카드 체크박스 복리후생)
 * Step 2: Detailed Conditions (E style — card checkbox benefits)
 */

const KOREAN_LEVELS: { value: KoreanLevel; label: string }[] = [
  { value: 'NONE', label: '무관' },
  { value: 'BASIC', label: '기초 (인사, 숫자)' },
  { value: 'DAILY', label: '일상회화' },
  { value: 'BUSINESS', label: '업무 가능' },
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'NONE', label: '경력 무관' },
  { value: 'UNDER_1Y', label: '1년 미만' },
  { value: 'ONE_TO_THREE_Y', label: '1~3년' },
  { value: 'OVER_3Y', label: '3년 이상' },
];

interface Props {
  form: AlbaJobFormData;
  errors: Record<string, string>;
  updateForm: <K extends keyof AlbaJobFormData>(key: K, value: AlbaJobFormData[K]) => void;
}

export default function StepDetails({ form, errors, updateForm }: Props) {
  const toggleBenefit = (b: Benefit) => {
    const has = form.benefits.includes(b);
    updateForm('benefits', has ? form.benefits.filter(x => x !== b) : [...form.benefits, b]);
  };

  return (
    <div className="space-y-8">
      {/* 공고 제목 / Job Title */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">공고 제목</h3>
          <span className="text-xs text-gray-400">Job Title</span>
        </div>
        <input
          type="text"
          value={form.title}
          onChange={e => updateForm('title', e.target.value)}
          placeholder="예: 강남역 카페 주말 바리스타 모집"
          maxLength={100}
          className={`w-full h-11 px-3 rounded-lg border text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
            errors.title ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        <div className="flex justify-between mt-1.5">
          {errors.title && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.title}
            </p>
          )}
          <span className="text-xs text-gray-400 ml-auto">{form.title.length}/100</span>
        </div>
      </section>

      {/* 근무지 주소 / Workplace Address */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">근무지</h3>
          <span className="text-xs text-gray-400">Workplace</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">시/도</label>
            <input
              type="text"
              value={form.address.sido}
              onChange={e => updateForm('address', { ...form.address, sido: e.target.value })}
              placeholder="서울특별시"
              className={`w-full h-11 px-3 rounded-lg border text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                errors.address ? 'border-red-400' : 'border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">시/군/구</label>
            <input
              type="text"
              value={form.address.sigungu}
              onChange={e => updateForm('address', { ...form.address, sigungu: e.target.value })}
              placeholder="강남구"
              className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">상세주소</label>
          <input
            type="text"
            value={form.address.detail}
            onChange={e => updateForm('address', { ...form.address, detail: e.target.value })}
            placeholder="건물명, 층수 등"
            className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        {errors.address && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{errors.address}
          </p>
        )}
      </section>

      {/* 한국어 수준 + 경력 / Korean Level + Experience */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">자격 요건</h3>
          <span className="text-xs text-gray-400">Requirements</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">한국어 수준</label>
            <select
              value={form.koreanLevel}
              onChange={e => updateForm('koreanLevel', e.target.value as KoreanLevel)}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {KOREAN_LEVELS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">경력</label>
            <select
              value={form.experienceLevel}
              onChange={e => updateForm('experienceLevel', e.target.value as ExperienceLevel)}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {EXPERIENCE_LEVELS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 우대 조건 / Preferred Qualifications */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">우대 조건</h3>
          <span className="text-xs text-gray-400">Preferred Qualifications</span>
        </div>
        <textarea
          value={form.preferredQualifications}
          onChange={e => updateForm('preferredQualifications', e.target.value)}
          rows={3}
          placeholder="예: TOPIK 3급 이상, 관련 경험자"
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
        />
      </section>

      {/* 복리후생 (E 스타일 카드) / Benefits (E style card checkboxes) */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">복리후생</h3>
          <span className="text-xs text-gray-400">Benefits</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {BENEFIT_OPTIONS.map(opt => {
            const selected = form.benefits.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleBenefit(opt.value)}
                className={`relative flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg border-2 text-sm transition-all ${
                  selected
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="text-xs font-medium">{opt.label}</span>
                {selected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 상세 설명 / Detailed Description */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlignLeft className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">상세 설명</h3>
          <span className="text-xs text-gray-400">Description</span>
        </div>
        <textarea
          value={form.detailDescription}
          onChange={e => updateForm('detailDescription', e.target.value)}
          rows={8}
          placeholder="근무 내용, 근무 환경, 지원 방법 등을 자유롭게 작성해주세요."
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
        />
      </section>
    </div>
  );
}
