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
  CONTRACT_PERIOD_LABELS,
  SALARY_INPUT_TYPE_LABELS,
  convertHourlyToYearly,
  convertMonthlyToYearly,
  convertYearlyToHourly,
} from './fulltime-types';
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
    HIGH_SCHOOL: '고등학교',
    ASSOCIATE: '전문학사',
    BACHELOR: '학사',
    MASTER: '석사',
    DOCTORATE: '박사',
  };

  const experienceLabels: Record<ExperienceLevel, string> = {
    ENTRY: '신입',
    JUNIOR: '경력 1~3년',
    SENIOR: '경력 3~7년',
    EXPERT: '경력 7년 이상',
  };

  const employmentLabels: Record<EmploymentType, string> = {
    REGULAR: '정규직',
    CONTRACT: '계약직',
    INTERN: '인턴',
    ALBA: '알바',
  };

  return (
    <div className="space-y-8">
      {/* 고용 형태 / Employment type — 직종 선택 전에 먼저 선택 */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">고용 형태</h3>
          <span className="text-xs text-gray-400">Employment Type</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
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
            >
              {employmentLabels[type]}
            </button>
          ))}
        </div>

        {/* 알바 선택 시 안내 메시지 / Alba notice */}
        {form.employmentType === 'ALBA' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-green-900 mb-1">
                  알바 채용 — 단시간 근로
                </p>
                <p className="text-green-800">
                  알바는 <strong>D-2(유학), D-4, F비자, H비자</strong> 소지자가 지원 가능합니다.
                  <br />
                  현재 비자 기준으로 근무 가능 여부를 자동 판별합니다.
                </p>
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
                <p className="font-semibold text-yellow-900 mb-1">
                  ⚠️ E-7 비자 아님 → D-10-1 대상 (최대 6개월)
                </p>
                <p className="text-yellow-800">
                  인턴은 국내 <strong>D-10 (구직비자)</strong> 또는 <strong>F비자</strong> 소지자만 채용 가능합니다.
                  <br />
                  최대 6개월 근무 후 E-7 전환 가능합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 계약직 선택 시 계약기간 입력 */}
        {form.employmentType === 'CONTRACT' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계약 기간 <span className="text-xs text-gray-500">(Contract Period)</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(CONTRACT_PERIOD_LABELS) as ContractPeriod[]).map((period) => (
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
                  {CONTRACT_PERIOD_LABELS[period]}
                </button>
              ))}
            </div>

            {/* 6개월 미만 시 경고 */}
            {form.contractPeriod === '6' && form.overseasHireWilling && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    ⚠️ 계약기간이 6개월인 경우 해외 초청 비자 승인 가능성이 낮을 수 있습니다.
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
          <h3 className="text-base font-semibold text-gray-900">직종 선택</h3>
          <span className="text-xs text-gray-400">Job Category</span>
          {form.employmentType === 'ALBA' && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              알바 직종
            </span>
          )}
        </div>

        {form.employmentType === 'ALBA' ? (
          albaCategoriesLoading ? (
            /* 알바 직종 로딩 중 / Loading alba categories */
            <div className="flex items-center gap-2 h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>알바 직종 목록 로드 중...</span>
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
              <option value="">-- 알바 직종을 선택하세요 --</option>
              {Object.entries(albaCategoryGroups).map(([group, cats]) => (
                <optgroup key={group} label={group}>
                  {cats.map((cat) => (
                    <option key={cat.code} value={cat.code}>
                      {cat.name} ({cat.nameEn})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )
        ) : categoriesLoading ? (
          /* E-7 직종 로딩 중 / Loading E-7 categories */
          <div className="flex items-center gap-2 h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>직종 목록 로드 중...</span>
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
            <option value="">-- 직종을 선택하세요 --</option>
            {Object.entries(categoryGroups).map(([group, cats]) => (
              <optgroup key={group} label={group}>
                {cats.map((cat) => (
                  <option key={cat.code} value={cat.code}>
                    {cat.nameKo} ({cat.nameEn})
                  </option>
                ))}
              </optgroup>
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
          <h3 className="text-base font-semibold text-gray-900">급여 정보</h3>
          <span className="text-xs text-gray-400">Salary Information</span>
        </div>

        {/* 급여 기준 선택 / Salary input type selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            급여 기준 <span className="text-xs text-gray-500">(Salary Type)</span>
          </label>
          <div className="flex gap-3">
            {(Object.keys(SALARY_INPUT_TYPE_LABELS) as SalaryInputType[]).map((type) => (
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
                {SALARY_INPUT_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* 연봉 입력 / Yearly salary input */}
        {form.salaryInputType === 'YEARLY' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-2">최소 연봉</label>
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
                  원/년
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2">최대 연봉</label>
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
                  원/년
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
                <label className="block text-xs text-gray-600 mb-2">최소 월급</label>
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
                    원/월
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-2">최대 월급</label>
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
                    원/월
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              💡 연봉 환산: 최소 {form.salaryMin.toLocaleString()}원/년 ~ 최대 {form.salaryMax.toLocaleString()}원/년
            </p>
          </div>
        )}

        {/* 시급 입력 / Hourly wage input */}
        {form.salaryInputType === 'HOURLY' && (
          <div className="space-y-4">
            {/* 주 근무시간 */}
            <div>
              <label className="block text-xs text-gray-600 mb-2">주 근무시간</label>
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
                  시간/주
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                기본값: 40시간 (주 5일 × 8시간)
              </p>
            </div>

            {/* 시급 범위 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-2">최소 시급</label>
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
                    원/시간
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-2">최대 시급</label>
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
                    원/시간
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              💡 연봉 환산 (주 {form.weeklyWorkHours}시간): 최소 {form.salaryMin.toLocaleString()}원/년 ~ 최대 {form.salaryMax.toLocaleString()}원/년
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
          <h3 className="text-base font-semibold text-gray-900">경력 수준</h3>
          <span className="text-xs text-gray-400">Experience Level</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
          <h3 className="text-base font-semibold text-gray-900">학력 요구사항</h3>
          <span className="text-xs text-gray-400">Education Level</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
            <h3 className="text-base font-semibold text-gray-900">해외 인재 채용</h3>
            <span className="text-xs text-gray-400">Overseas Hire</span>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            해외 거주 외국인에게 비자를 스폰서하여 채용할 의사가 있나요?
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
            예, 가능합니다
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
            아니오, 불가능합니다
          </button>
        </div>
          <p className="mt-3 text-xs text-blue-900 bg-blue-100 p-3 rounded-lg">
            💡 이 설정은 <strong>E-7 비자 SPONSOR 트랙</strong> 활성화 여부를
            결정합니다. 해외 채용을 원하지 않는 경우, 국내 체류 중인 외국인만
            지원할 수 있습니다.
          </p>
        </section>
      )}
    </div>
  );
}
