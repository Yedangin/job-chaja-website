'use client';

import { useState } from 'react';
import type { AlbaJobFormData } from '../../a/types';
import { ScheduleBuilder } from './schedule-builder';
import {
  Briefcase, DollarSign, Users, Clock, Calendar,
  AlertCircle, Info,
} from 'lucide-react';

interface StepJobInfoProps {
  /** 현재 폼 데이터 / Current form data */
  form: Partial<AlbaJobFormData>;
  /** 폼 업데이트 콜백 / Form update callback */
  onUpdate: (data: Partial<AlbaJobFormData>) => void;
}

/** 최저시급 (2026년 기준) / Minimum hourly wage (2026 standard) */
const MINIMUM_WAGE = 10030;

/** 직종 카테고리 더미 / Job category dummy data */
const JOB_CATEGORIES = [
  { code: 'REST_SERVING', name: '음식점 서빙', nameEn: 'Restaurant Serving' },
  { code: 'REST_KITCHEN', name: '주방 보조', nameEn: 'Kitchen Assistant' },
  { code: 'CAFE_BARISTA', name: '카페 바리스타', nameEn: 'Cafe Barista' },
  { code: 'CONV_STORE', name: '편의점', nameEn: 'Convenience Store' },
  { code: 'DELIVERY', name: '배달', nameEn: 'Delivery' },
  { code: 'RETAIL_SALES', name: '판매/매장관리', nameEn: 'Retail Sales' },
  { code: 'OFFICE_ADMIN', name: '사무보조', nameEn: 'Office Admin' },
  { code: 'WAREHOUSE', name: '물류/창고', nameEn: 'Warehouse' },
  { code: 'CLEANING', name: '청소/미화', nameEn: 'Cleaning' },
  { code: 'TUTORING', name: '과외/학원', nameEn: 'Tutoring' },
];

/**
 * Step 1: 직종, 시급, 스케줄, 모집인원, 근무기간 입력
 * Step 1: Job category, hourly wage, schedule, headcount, work period
 *
 * 비자 인사이트 스타일: 입력 시 실시간 주당시간 계산 + 최저시급 경고
 * Visa insight style: real-time weekly hours calculation + minimum wage warning
 */
export function StepJobInfo({ form, onUpdate }: StepJobInfoProps) {
  const [wageWarning, setWageWarning] = useState(false);

  /* 시급 변경 핸들러 / Hourly wage change handler */
  const handleWageChange = (value: string) => {
    const wage = parseInt(value, 10) || 0;
    setWageWarning(wage > 0 && wage < MINIMUM_WAGE);
    onUpdate({ hourlyWage: wage });
  };

  /* 스케줄 업데이트 핸들러 / Schedule update handler */
  const handleScheduleUpdate = (schedule: AlbaJobFormData['schedule'], weeklyHours: number) => {
    onUpdate({ schedule, weeklyHours });
  };

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 / Section header */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          어떤 일인가요?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          직종과 근무 조건을 입력해주세요. / Enter job category and work conditions.
        </p>
      </div>

      {/* 직종 선택 / Job category selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          직종 <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-1">(Job Category)</span>
        </label>
        <select
          value={form.jobCategoryCode || ''}
          onChange={(e) => onUpdate({ jobCategoryCode: e.target.value })}
          className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          aria-label="직종 선택 / Select job category"
        >
          <option value="" disabled>직종을 선택해주세요</option>
          {JOB_CATEGORIES.map((cat) => (
            <option key={cat.code} value={cat.code}>
              {cat.name} ({cat.nameEn})
            </option>
          ))}
        </select>
        {form.jobCategoryCode && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            선택한 직종에 따라 비자 매칭 결과가 달라집니다 / Visa matching varies by category
          </p>
        )}
      </div>

      {/* 시급 + 모집인원 그리드 / Wage + Headcount grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* 시급 / Hourly wage */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-gray-400" />
            시급 (원) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={form.hourlyWage || ''}
              onChange={(e) => handleWageChange(e.target.value)}
              min={MINIMUM_WAGE}
              placeholder={`최저 ${MINIMUM_WAGE.toLocaleString()}원`}
              className={`w-full h-11 px-3 pr-12 rounded-lg border text-sm transition focus:ring-2
                ${wageWarning
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              aria-label="시급 입력 / Enter hourly wage"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">원</span>
          </div>
          {wageWarning && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              최저시급({MINIMUM_WAGE.toLocaleString()}원) 이상이어야 합니다 / Must be at or above minimum wage
            </p>
          )}
          {!wageWarning && form.hourlyWage && form.hourlyWage >= MINIMUM_WAGE && (
            <p className="text-xs text-green-600">
              최저시급 대비 {Math.round(((form.hourlyWage - MINIMUM_WAGE) / MINIMUM_WAGE) * 100)}% 높은 시급입니다
            </p>
          )}
        </div>

        {/* 모집인원 / Headcount */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            모집 인원 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={form.recruitCount || ''}
            onChange={(e) => onUpdate({ recruitCount: parseInt(e.target.value, 10) || 1 })}
            min={1}
            placeholder="2"
            className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            aria-label="모집 인원 / Number of positions"
          />
        </div>
      </div>

      {/* 근무 스케줄 빌더 / Work schedule builder */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-400" />
          근무 스케줄 <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-1">(Work Schedule)</span>
        </label>
        <ScheduleBuilder
          schedule={form.schedule || []}
          onUpdate={handleScheduleUpdate}
        />
        {/* 주당 근무시간 인사이트 카드 / Weekly hours insight card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">주당 근무시간</p>
              <p className="text-xs text-blue-600">자동 계산 / Auto-calculated</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-blue-700">
            {form.weeklyHours || 0}<span className="text-sm font-normal ml-1">시간</span>
          </span>
        </div>
      </div>

      {/* 근무 기간 / Work period */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          근무 기간
          <span className="text-xs text-gray-400 ml-1">(Work Period)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-gray-500">시작일 / Start date</span>
            <input
              type="date"
              value={form.workPeriod?.startDate || ''}
              onChange={(e) =>
                onUpdate({
                  workPeriod: {
                    startDate: e.target.value,
                    endDate: form.workPeriod?.endDate ?? null,
                  },
                })
              }
              className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              aria-label="근무 시작일 / Work start date"
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-gray-500">종료일 / End date (선택)</span>
            <input
              type="date"
              value={form.workPeriod?.endDate || ''}
              onChange={(e) =>
                onUpdate({
                  workPeriod: {
                    startDate: form.workPeriod?.startDate || '',
                    endDate: e.target.value || null,
                  },
                })
              }
              className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              aria-label="근무 종료일 / Work end date"
            />
            <p className="text-xs text-gray-400">비워두면 &quot;채용시까지&quot;로 표시됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}
