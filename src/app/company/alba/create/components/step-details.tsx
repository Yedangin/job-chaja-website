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
import { useLanguage } from '@/i18n/LanguageProvider';
import { getAlbaCopy } from '../copy';

/**
 * Step 2: 상세조건 (E 스타일 — 카드 체크박스 복리후생)
 * Step 2: Detailed Conditions (E style — card checkbox benefits)
 */

const KOREAN_LEVELS: KoreanLevel[] = ['NONE', 'BASIC', 'DAILY', 'BUSINESS'];

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['NONE', 'UNDER_1Y', 'ONE_TO_THREE_Y', 'OVER_3Y'];

interface Props {
  form: AlbaJobFormData;
  errors: Record<string, string>;
  updateForm: <K extends keyof AlbaJobFormData>(key: K, value: AlbaJobFormData[K]) => void;
}

export default function StepDetails({ form, errors, updateForm }: Props) {
  const { lang } = useLanguage();
  const copy = getAlbaCopy(lang);
  const toggleBenefit = (b: Benefit) => {
    const has = form.benefits.includes(b);
    updateForm('benefits', has ? form.benefits.filter(x => x !== b) : [...form.benefits, b]);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 공고 제목 / Job Title */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.details.title}</h3>
        </div>
        <input
          type="text"
          value={form.title}
          onChange={e => updateForm('title', e.target.value)}
          aria-label={copy.details.title}
          aria-invalid={Boolean(errors.title)}
          placeholder={copy.details.titlePlaceholder}
          maxLength={100}
          className={`w-full h-11 px-3 rounded-lg border text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
            errors.title ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        <div className="flex justify-between mt-1.5">
          {errors.title && (
            <p id="alba-title-error" role="alert" className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.title}
            </p>
          )}
          <span className="text-xs text-gray-400 ml-auto">{form.title.length}/100</span>
        </div>
      </section>

      {/* 근무지 주소 / Workplace Address */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.details.location}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="alba-province" className="block text-xs font-medium text-gray-500 mb-1">{copy.details.province}</label>
            <input
              type="text"
              value={form.address.sido}
              onChange={e => updateForm('address', { ...form.address, sido: e.target.value })}
              id="alba-province"
              placeholder={copy.details.province}
              className={`w-full h-11 px-3 rounded-lg border text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                errors.address ? 'border-red-400' : 'border-gray-300'
              }`}
            />
          </div>
          <div>
            <label htmlFor="alba-district" className="block text-xs font-medium text-gray-500 mb-1">{copy.details.district}</label>
            <input
              type="text"
              value={form.address.sigungu}
              onChange={e => updateForm('address', { ...form.address, sigungu: e.target.value })}
              id="alba-district"
              placeholder={copy.details.district}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor="alba-address" className="block text-xs font-medium text-gray-500 mb-1">{copy.details.address}</label>
          <input
            type="text"
            value={form.address.detail}
            onChange={e => updateForm('address', { ...form.address, detail: e.target.value })}
            id="alba-address"
            placeholder={copy.details.address}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        {errors.address && (
          <p id="alba-address-error" role="alert" className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{errors.address}
          </p>
        )}
      </section>

      {/* 한국어 수준 + 경력 / Korean Level + Experience */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.details.requirements}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{copy.details.language}</label>
            <select
              value={form.koreanLevel}
              onChange={e => updateForm('koreanLevel', e.target.value as KoreanLevel)}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {KOREAN_LEVELS.map(l => (
                <option key={l} value={l}>{copy.options.language[l]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{copy.details.experience}</label>
            <select
              value={form.experienceLevel}
              onChange={e => updateForm('experienceLevel', e.target.value as ExperienceLevel)}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {EXPERIENCE_LEVELS.map(l => (
                <option key={l} value={l}>{copy.options.experience[l]}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 우대 조건 / Preferred Qualifications */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.details.preferred}</h3>
        </div>
        <textarea
          value={form.preferredQualifications}
          onChange={e => updateForm('preferredQualifications', e.target.value)}
          rows={3}
          aria-label={copy.details.preferred}
          placeholder={copy.details.preferredPlaceholder}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
        />
      </section>

      {/* 복리후생 (E 스타일 카드) / Benefits (E style card checkboxes) */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.details.benefits}</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {BENEFIT_OPTIONS.map(opt => {
            const selected = form.benefits.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleBenefit(opt.value)}
                aria-pressed={selected}
                aria-label={copy.options.benefits[opt.value]}
                className={`relative flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg border-2 text-sm transition-all ${
                  selected
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="break-words text-center text-xs font-medium">{copy.options.benefits[opt.value]}</span>
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
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlignLeft className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.details.description}</h3>
        </div>
        <textarea
          value={form.detailDescription}
          onChange={e => updateForm('detailDescription', e.target.value)}
          rows={8}
          aria-label={copy.details.description}
          placeholder={copy.details.descriptionPlaceholder}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
        />
      </section>
    </div>
  );
}
