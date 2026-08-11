'use client';

import { useEffect, useState } from 'react';
import { Briefcase, DollarSign, Users, Clock, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import ScheduleBuilder from './schedule-builder';
import {
  type AlbaJobFormData,
  type JobCategory,
  apiCategoriesToGroups,
} from './alba-types';
import { fetchAlbaCategories } from '../api';
import { useMinimumHourlyWage } from '@/hooks/use-minimum-wage';
import { useLanguage } from '@/i18n/LanguageProvider';
import { getAlbaCopy } from '../copy';

/**
 * Step 1: 기본정보 (백엔드 API 기반 직종 로드)
 * Step 1: Basic Info (backend API-driven category loading)
 */

interface Props {
  form: AlbaJobFormData;
  errors: Record<string, string>;
  updateForm: <K extends keyof AlbaJobFormData>(key: K, value: AlbaJobFormData[K]) => void;
}

export default function StepBasicInfo({ form, errors, updateForm }: Props) {
  const { lang } = useLanguage();
  const copy = getAlbaCopy(lang);
  const MINIMUM_WAGE = useMinimumHourlyWage();
  const wageAboveMin = form.hourlyWage >= MINIMUM_WAGE;
  const wagePercent = form.hourlyWage > 0
    ? Math.round(((form.hourlyWage - MINIMUM_WAGE) / MINIMUM_WAGE) * 100)
    : 0;

  // 백엔드에서 알바 직종 목록 로드 / Load alba categories from backend
  const [categoryGroups, setCategoryGroups] = useState<Record<string, JobCategory[]>>({});
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);

  const loadCategories = () => {
    setCategoriesLoading(true);
    setCategoriesError(false);
    fetchAlbaCategories()
      .then((res) => {
        const groups = apiCategoriesToGroups(res.categories);
        setCategoryGroups(groups);
      })
      .catch(() => {
        setCategoriesError(true);
      })
      .finally(() => setCategoriesLoading(false));
  };

  useEffect(() => {
    // Category loading is an external request; the initial loading state is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 직종 선택 / Job category (backend API-driven) */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.basic.category}</h3>
        </div>
        {categoriesLoading ? (
          <div className="flex items-center gap-2 h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{copy.basic.loadingCategories}</span>
          </div>
        ) : categoriesError || Object.keys(categoryGroups).length === 0 ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {copy.basic.categoriesError}
            </p>
            <button
              type="button"
              onClick={loadCategories}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              {copy.basic.retry}
            </button>
          </div>
        ) : (
          <select
            value={form.jobCategoryCode}
            aria-label={copy.basic.category}
            aria-invalid={Boolean(errors.jobCategoryCode)}
            onChange={e => updateForm('jobCategoryCode', e.target.value)}
            className={`w-full h-11 px-3 rounded-lg border text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
              errors.jobCategoryCode ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <option value="">-- {copy.basic.selectCategory} --</option>
            {Object.entries(categoryGroups).map(([group, cats]) => (
              <optgroup key={group} label={group}>
                {cats.map(cat => (
                  <option key={cat.code} value={cat.code}>
                    {cat.name} ({cat.nameEn})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        )}
        {errors.jobCategoryCode && (
          <p id="alba-category-error" role="alert" className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{errors.jobCategoryCode}
          </p>
        )}
      </section>

      {/* 시급 / Hourly Wage */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.basic.wage}</h3>
        </div>
        <div className="relative">
          <input
            type="number"
            value={form.hourlyWage || ''}
            onChange={e => updateForm('hourlyWage', Number(e.target.value))}
            aria-label={copy.basic.wage}
            aria-invalid={Boolean(errors.hourlyWage)}
            placeholder={copy.basic.wagePlaceholder(MINIMUM_WAGE.toLocaleString())}
            className={`w-full h-11 px-3 pr-10 rounded-lg border text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
              errors.hourlyWage ? 'border-red-400' : form.hourlyWage > 0 && !wageAboveMin ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{copy.basic.currency}</span>
        </div>
        {form.hourlyWage > 0 && !wageAboveMin && (
          <p id="alba-wage-error" role="alert" className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{errors.hourlyWage || copy.basic.wageError(MINIMUM_WAGE.toLocaleString())}
          </p>
        )}
        {form.hourlyWage > 0 && wageAboveMin && wagePercent > 0 && (
          <p className="text-xs text-[#0066FF] mt-1.5">
            {copy.basic.wageAbove(wagePercent)}
          </p>
        )}
      </section>

      {/* 모집 인원 / Recruitment Count */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.basic.recruitCount}</h3>
        </div>
        <input
          type="number"
          min={1}
          value={form.recruitCount || ''}
          onChange={e => updateForm('recruitCount', Number(e.target.value))}
          aria-label={copy.basic.recruitCount}
          placeholder={copy.basic.recruitCountPlaceholder}
          className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
      </section>

      {/* 근무 스케줄 / Work Schedule */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.basic.schedule}</h3>
        </div>
        <ScheduleBuilder
          schedule={form.schedule}
          onChange={s => {
            updateForm('schedule', s);
            const hours = s.reduce((sum, item) => {
              const [sh, sm] = item.startTime.split(':').map(Number);
              const [eh, em] = item.endTime.split(':').map(Number);
              let diff = (eh * 60 + em - (sh * 60 + sm)) / 60;
              if (diff <= 0) diff += 24;
              return sum + diff;
            }, 0);
            updateForm('weeklyHours', Math.round(hours * 10) / 10);
          }}
        />
        {errors.schedule && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{errors.schedule}
          </p>
        )}
      </section>

      {/* 근무 기간 / Work Period */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.basic.startDate} / {copy.basic.endDate}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="alba-start-date" className="block text-xs font-medium text-gray-500 mb-1">{copy.basic.startDate} *</label>
            <input
              id="alba-start-date"
              type="date"
              value={form.workPeriod.startDate}
              onChange={e => updateForm('workPeriod', { ...form.workPeriod, startDate: e.target.value })}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="alba-end-date" className="block text-xs font-medium text-gray-500 mb-1">{copy.basic.endDate} ({copy.basic.optional})</label>
            <input
              id="alba-end-date"
              type="date"
              value={form.workPeriod.endDate || ''}
              onChange={e => updateForm('workPeriod', { ...form.workPeriod, endDate: e.target.value || null })}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        {errors.workPeriod && <p role="alert" className="mt-2 text-xs text-red-500">{errors.workPeriod}</p>}
      </section>
    </div>
  );
}
