'use client';

import { useEffect, useState } from 'react';
import { Briefcase, DollarSign, Users, Clock, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import ScheduleBuilder from './schedule-builder';
import {
  type AlbaJobFormData,
  type JobCategory,
  apiCategoriesToGroups,
  MINIMUM_WAGE,
} from './alba-types';
import { fetchAlbaCategories } from '../api';

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
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      {/* 직종 선택 / Job category (backend API-driven) */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">직종 선택</h3>
          <span className="text-xs text-gray-400">Job Category</span>
        </div>
        {categoriesLoading ? (
          <div className="flex items-center gap-2 h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>직종 목록 로드 중...</span>
          </div>
        ) : categoriesError || Object.keys(categoryGroups).length === 0 ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              직종 목록을 불러올 수 없습니다
            </p>
            <button
              type="button"
              onClick={loadCategories}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <select
            value={form.jobCategoryCode}
            onChange={e => updateForm('jobCategoryCode', e.target.value)}
            className={`w-full h-11 px-3 rounded-lg border text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
              errors.jobCategoryCode ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <option value="">-- 직종을 선택하세요 --</option>
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
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{errors.jobCategoryCode}
          </p>
        )}
      </section>

      {/* 시급 / Hourly Wage */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">시급</h3>
          <span className="text-xs text-gray-400">Hourly Wage</span>
        </div>
        <div className="relative">
          <input
            type="number"
            value={form.hourlyWage || ''}
            onChange={e => updateForm('hourlyWage', Number(e.target.value))}
            placeholder={`최저시급 ${MINIMUM_WAGE.toLocaleString()}원`}
            className={`w-full h-11 px-3 pr-10 rounded-lg border text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
              errors.hourlyWage ? 'border-red-400' : form.hourlyWage > 0 && !wageAboveMin ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">원</span>
        </div>
        {form.hourlyWage > 0 && !wageAboveMin && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />최저시급({MINIMUM_WAGE.toLocaleString()}원) 이상이어야 합니다
          </p>
        )}
        {form.hourlyWage > 0 && wageAboveMin && wagePercent > 0 && (
          <p className="text-xs text-green-600 mt-1.5">
            최저시급 대비 +{wagePercent}%
          </p>
        )}
      </section>

      {/* 모집 인원 / Recruitment Count */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">모집 인원</h3>
          <span className="text-xs text-gray-400">Recruitment Count</span>
        </div>
        <input
          type="number"
          min={1}
          value={form.recruitCount || ''}
          onChange={e => updateForm('recruitCount', Number(e.target.value))}
          placeholder="모집 인원 수"
          className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
      </section>

      {/* 근무 스케줄 / Work Schedule */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">근무 일정</h3>
          <span className="text-xs text-gray-400">Work Schedule</span>
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
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">근무 기간</h3>
          <span className="text-xs text-gray-400">Work Period</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">시작일 *</label>
            <input
              type="date"
              value={form.workPeriod.startDate}
              onChange={e => updateForm('workPeriod', { ...form.workPeriod, startDate: e.target.value })}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">종료일 (선택)</label>
            <input
              type="date"
              value={form.workPeriod.endDate || ''}
              onChange={e => updateForm('workPeriod', { ...form.workPeriod, endDate: e.target.value || null })}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
