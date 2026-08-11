/**
 * Step 1: 기본 정보
 * Step 1: Basic Information
 * - 직종, 고용형태, 연봉, 경력, 학력, 해외채용 의사
 * - Occupation, employment type, salary, experience, education, overseas hire
 */

'use client';

import { Briefcase, DollarSign, GraduationCap, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type {
  FulltimeJobFormData,
  ExperienceLevel,
  EducationLevel,
  EmploymentType,
  ContractPeriod,
  SalaryInputType,
  E7JobCategory,
} from './fulltime-types';
import {
  convertHourlyToYearly,
  convertMonthlyToYearly,
  convertYearlyToHourly,
} from './fulltime-types';
import { useFulltimeCopy } from '../copy';
import { useLanguage } from '@/i18n/LanguageProvider';
import { fetchE7Categories } from '../api';
import { fetchAlbaCategories } from '../../../alba/create/api';
import { apiCategoriesToGroups, type JobCategory } from '../../../alba/create/components/alba-types';

interface StepBasicInfoProps {
  form: FulltimeJobFormData;
  errors: Record<string, string>;
  updateForm: <K extends keyof FulltimeJobFormData>(
    key: K,
    value: FulltimeJobFormData[K]
  ) => void;
}

export default function StepBasicInfo({
  form,
  errors,
  updateForm,
}: StepBasicInfoProps) {
  const copy = useFulltimeCopy();
  const { lang } = useLanguage();
  const isKorean = lang === 'ko' || lang === 'kr';
  const [categoryGroups, setCategoryGroups] = useState<Record<string, E7JobCategory[]>>({});
  const [albaCategoryGroups, setAlbaCategoryGroups] = useState<Record<string, JobCategory[]>>({});
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [albaCategoriesLoading, setAlbaCategoriesLoading] = useState(true);

  // 백엔드에서 E-7 직종 목록 로드 / Load E-7 categories from backend
  useEffect(() => {
    fetchE7Categories()
      .then((res) => {
        const groups: Record<string, E7JobCategory[]> = {};
        res.categories.forEach((cat) => {
          if (!groups[cat.categoryGroup]) groups[cat.categoryGroup] = [];
          groups[cat.categoryGroup].push(cat);
        });
        setCategoryGroups(groups);
      })
      .catch(() => {
        // 로드 실패 시 빈 목록으로 처리 — 사용자에게 select에서 안내
      })
      .finally(() => setCategoriesLoading(false));

    // 백엔드에서 알바 직종 목록 로드 / Load alba categories from backend
    fetchAlbaCategories()
      .then((res) => {
        const groups = apiCategoriesToGroups(res.categories);
        setAlbaCategoryGroups(groups);
      })
      .catch(() => {})
      .finally(() => setAlbaCategoriesLoading(false));
  }, []);

  const educationLabels: Record<EducationLevel, string> = {
    HIGH_SCHOOL: copy.highSchool,
    ASSOCIATE: copy.associate,
    BACHELOR: copy.bachelor,
    MASTER: copy.master,
    DOCTORATE: copy.doctorate,
  };

  const experienceLabels: Record<ExperienceLevel, string> = {
    ENTRY: copy.entry,
    JUNIOR: copy.junior,
    SENIOR: copy.senior,
    EXPERT: copy.expert,
  };

  const employmentLabels: Record<EmploymentType, string> = {
    REGULAR: copy.regular,
    CONTRACT: copy.contract,
    INTERN: copy.intern,
    ALBA: copy.partTime,
  };
  const contractLabels: Record<ContractPeriod, string> = {
    '6': copy.months6, '12': copy.months12, '18': copy.months18, '24': copy.months24, NEGOTIABLE: copy.negotiable,
  };
  const salaryLabels: Record<SalaryInputType, string> = {
    YEARLY: copy.yearly, MONTHLY: copy.monthly, HOURLY: copy.hourly,
  };

  return (
    <div className="space-y-8">
      {/* 고용 형태 / Employment type — 직종 선택 전에 먼저 선택 */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.employmentType}</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(employmentLabels) as EmploymentType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                // 알바 ↔ 정규직 전환 시 직종 코드 초기화 (코드 체계가 다름)
                // Reset job category code when switching between ALBA and non-ALBA
                const wasAlba = form.employmentType === 'ALBA';
                const willBeAlba = type === 'ALBA';
                if (wasAlba !== willBeAlba) {
                  updateForm('jobCategoryCode', '');
                }
                updateForm('employmentType', type);
              }}
              className={`p-3 border-2 rounded-lg transition text-sm font-medium ${
                form.employmentType === type
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
              aria-pressed={form.employmentType === type}
            >
              {employmentLabels[type]}
            </button>
          ))}
        </div>

        {/* 알바 선택 시 안내 메시지 / Alba notice */}
        {form.employmentType === 'ALBA' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-950 mb-1">{copy.partTimeTitle}</p>
                <p className="text-blue-900">{copy.partTimeBody}</p>
              </div>
            </div>
          </div>
        )}

        {/* 인턴 선택 시 안내 메시지 */}
        {form.employmentType === 'INTERN' && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-900 mb-1">{copy.internTitle}</p>
                <p className="text-yellow-800">{copy.internBody}</p>
              </div>
            </div>
          </div>
        )}

        {/* 계약직 선택 시 계약기간 입력 */}
        {form.employmentType === 'CONTRACT' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {copy.contractPeriod}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(Object.keys(contractLabels) as ContractPeriod[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => updateForm('contractPeriod', period)}
                  className={`p-2 border-2 rounded-lg transition text-xs font-medium ${
                    form.contractPeriod === period
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {contractLabels[period]}
                </button>
              ))}
            </div>

            {/* 6개월 미만 시 경고 */}
            {form.contractPeriod === '6' && form.overseasHireWilling && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {copy.shortContract}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 직종 선택 / Job category */}
      {/* 알바: 알바 직종(단순노무/서비스직), 정규직·계약직·인턴: E-7 직종 */}
      {/* ALBA: alba job categories, others: E-7 job categories from backend */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.jobCategory}</h3>
          {form.employmentType === 'ALBA' && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {copy.partTimeCategory}
            </span>
          )}
        </div>

        {form.employmentType === 'ALBA' ? (
          albaCategoriesLoading ? (
            /* 알바 직종 로딩 중 / Loading alba categories */
            <div className="flex items-center gap-2 h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{copy.loadingCategories}</span>
            </div>
          ) : (
            /* 알바 직종 선택 / Alba job categories (backend API-driven) */
            <select
              value={form.jobCategoryCode}
              onChange={(e) => updateForm('jobCategoryCode', e.target.value)}
              className={`w-full h-11 px-3 rounded-lg border text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
                errors.jobCategoryCode ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              <option value="">{copy.selectCategory}</option>
              {Object.values(albaCategoryGroups).flat().map((cat) => (
                <option key={cat.code} value={cat.code}>{isKorean ? cat.name : cat.nameEn}</option>
              ))}
            </select>
          )
        ) : categoriesLoading ? (
          /* E-7 직종 로딩 중 / Loading E-7 categories */
          <div className="flex items-center gap-2 h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{copy.loadingCategories}</span>
          </div>
        ) : (
          /* E-7 직종 선택 / E-7 job categories from backend */
          <select
            value={form.jobCategoryCode}
            onChange={(e) => updateForm('jobCategoryCode', e.target.value)}
            className={`w-full h-11 px-3 rounded-lg border text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition ${
              errors.jobCategoryCode ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <option value="">{copy.selectCategory}</option>
            {Object.values(categoryGroups).flat().map((cat) => (
              <option key={cat.code} value={cat.code}>{isKorean ? cat.nameKo : cat.nameEn}</option>
            ))}
          </select>
        )}

        {errors.jobCategoryCode && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.jobCategoryCode}
          </p>
        )}
      </section>

      {/* 급여 정보 / Salary information */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.salaryInfo}</h3>
        </div>

        {/* 급여 기준 선택 / Salary input type selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {copy.salaryType}
          </label>
          <div className="flex gap-3">
            {(Object.keys(salaryLabels) as SalaryInputType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateForm('salaryInputType', type)}
                className={`flex-1 p-3 border-2 rounded-lg transition text-sm font-medium ${
                  form.salaryInputType === type
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {salaryLabels[type]}
              </button>
            ))}
          </div>
        </div>

        {/* 연봉 입력 / Yearly salary input */}
        {form.salaryInputType === 'YEARLY' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-2">{copy.minYearly}</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.salaryMin ? form.salaryMin.toLocaleString() : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, '');
                    if (/^\d*$/.test(value)) {
                      updateForm('salaryMin', parseInt(value) || 0);
                    }
                  }}
                  placeholder="30,000,000"
                  className="w-full h-11 px-3 pr-16 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {copy.wonYear}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2">{copy.maxYearly}</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.salaryMax ? form.salaryMax.toLocaleString() : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, '');
                    if (/^\d*$/.test(value)) {
                      updateForm('salaryMax', parseInt(value) || 0);
                    }
                  }}
                  placeholder="50,000,000"
                  className="w-full h-11 px-3 pr-16 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {copy.wonYear}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 월급 입력 / Monthly salary input */}
        {form.salaryInputType === 'MONTHLY' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-2">{copy.minMonthly}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.monthlySalary ? Math.floor(form.salaryMin / 12).toLocaleString() : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '');
                      if (/^\d*$/.test(value)) {
                        const monthly = parseInt(value) || 0;
                        updateForm('salaryMin', convertMonthlyToYearly(monthly));
                      }
                    }}
                    placeholder="2,500,000"
                    className="w-full h-11 px-3 pr-16 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {copy.wonMonth}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-2">{copy.maxMonthly}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.salaryMax ? Math.floor(form.salaryMax / 12).toLocaleString() : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '');
                      if (/^\d*$/.test(value)) {
                        const monthly = parseInt(value) || 0;
                        updateForm('salaryMax', convertMonthlyToYearly(monthly));
                      }
                    }}
                    placeholder="4,000,000"
                    className="w-full h-11 px-3 pr-16 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {copy.wonMonth}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {copy.salaryConverted}: {form.salaryMin.toLocaleString()} {copy.wonYear} - {form.salaryMax.toLocaleString()} {copy.wonYear}
            </p>
          </div>
        )}

        {/* 시급 입력 / Hourly wage input */}
        {form.salaryInputType === 'HOURLY' && (
          <div className="space-y-4">
            {/* 주 근무시간 */}
            <div>
              <label className="block text-xs text-gray-600 mb-2">{copy.weeklyHours}</label>
              <div className="relative">
                <input
                  type="number"
                  value={form.weeklyWorkHours}
                  onChange={(e) => {
                    const hours = parseInt(e.target.value) || 40;
                    updateForm('weeklyWorkHours', hours);
                    // 주 근무시간 변경 시 연봉 재계산
                    if (form.hourlyWage) {
                      const minHourly = Math.floor(convertYearlyToHourly(form.salaryMin, hours));
                      const maxHourly = Math.floor(convertYearlyToHourly(form.salaryMax, hours));
                      updateForm('salaryMin', convertHourlyToYearly(minHourly, hours));
                      updateForm('salaryMax', convertHourlyToYearly(maxHourly, hours));
                    }
                  }}
                  min="1"
                  max="68"
                  placeholder="40"
                  className="w-full md:w-48 h-11 px-3 pr-16 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {copy.hoursWeek}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {copy.defaultHours}
              </p>
            </div>

            {/* 시급 범위 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-2">{copy.minHourly}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.salaryMin && form.weeklyWorkHours
                      ? Math.floor((form.salaryMin / 12) / ((form.weeklyWorkHours * 52) / 12)).toLocaleString()
                      : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '');
                      if (/^\d*$/.test(value)) {
                        const hourly = parseInt(value) || 0;
                        updateForm('salaryMin', convertHourlyToYearly(hourly, form.weeklyWorkHours));
                      }
                    }}
                    placeholder="10,320"
                    className="w-full h-11 px-3 pr-16 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {copy.wonHour}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-2">{copy.maxHourly}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.salaryMax && form.weeklyWorkHours
                      ? Math.floor((form.salaryMax / 12) / ((form.weeklyWorkHours * 52) / 12)).toLocaleString()
                      : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '');
                      if (/^\d*$/.test(value)) {
                        const hourly = parseInt(value) || 0;
                        updateForm('salaryMax', convertHourlyToYearly(hourly, form.weeklyWorkHours));
                      }
                    }}
                    placeholder="15,000"
                    className="w-full h-11 px-3 pr-16 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {copy.wonHour}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {copy.salaryConverted} ({form.weeklyWorkHours} {copy.hoursWeek}): {form.salaryMin.toLocaleString()} {copy.wonYear} - {form.salaryMax.toLocaleString()} {copy.wonYear}
            </p>
          </div>
        )}

        {errors.salaryMin && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.salaryMin}
          </p>
        )}
        {errors.salaryMax && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.salaryMax}
          </p>
        )}
      </section>

      {/* 경력 수준 / Experience level */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.experience}</h3>
        </div>
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(experienceLabels) as ExperienceLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => updateForm('experienceLevel', level)}
              className={`p-3 border-2 rounded-lg transition text-sm font-medium ${
                form.experienceLevel === level
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {experienceLabels[level]}
            </button>
          ))}
        </div>
      </section>

      {/* 학력 요구사항 / Education level */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.education}</h3>
        </div>
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-5 gap-3">
          {(Object.keys(educationLabels) as EducationLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => updateForm('educationLevel', level)}
              className={`p-3 border-2 rounded-lg transition text-sm font-medium ${
                form.educationLevel === level
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {educationLabels[level]}
            </button>
          ))}
        </div>
      </section>

      {/* 해외 인재 채용 의사 / Overseas hire willingness (인턴일 때 숨김) */}
      {form.employmentType !== 'INTERN' && (
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{copy.overseasHire}</h3>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            {copy.overseasQuestion}
          </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => updateForm('overseasHireWilling', true)}
            className={`flex-1 p-3 border-2 rounded-lg transition font-medium ${
              form.overseasHireWilling
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
            }`}
          >
            {copy.yes}
          </button>
          <button
            type="button"
            onClick={() => updateForm('overseasHireWilling', false)}
            className={`flex-1 p-3 border-2 rounded-lg transition font-medium ${
              !form.overseasHireWilling
                ? 'border-gray-400 bg-gray-100 text-gray-900'
                : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
            }`}
          >
            {copy.no}
          </button>
        </div>
          <p className="mt-3 text-xs text-blue-900 bg-blue-100 p-3 rounded-lg">
            {copy.overseasTip}
          </p>
        </section>
      )}
    </div>
  );
}
