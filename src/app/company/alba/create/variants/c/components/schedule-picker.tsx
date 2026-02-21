'use client';

import { useMemo } from 'react';
import { Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DayOfWeek, ScheduleItem } from './alba-types';
import { DAY_LABELS } from './alba-types';

/**
 * 주간 스케줄 선택 컴포넌트 (드래그/탭 기반)
 * Weekly schedule picker component (tap-based)
 *
 * 카드 스타일 — 요일 선택 후 시간대 설정
 * Card style — select days then set time slots
 */

interface SchedulePickerProps {
  schedule: ScheduleItem[];
  onChange: (schedule: ScheduleItem[]) => void;
}

const ALL_DAYS: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// 시간 옵션 생성 (30분 단위) / Generate time options (30-min intervals)
const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
}
TIME_OPTIONS.push('24:00');

export function SchedulePicker({ schedule, onChange }: SchedulePickerProps) {
  // 선택된 요일 추출 / Extract selected days
  const selectedDays = useMemo(
    () => new Set(schedule.map((s) => s.dayOfWeek)),
    [schedule]
  );

  // 주당 총 근무시간 계산 / Calculate total weekly hours
  const weeklyHours = useMemo(() => {
    return schedule.reduce((total, item) => {
      const [sh, sm] = item.startTime.split(':').map(Number);
      const [eh, em] = item.endTime.split(':').map(Number);
      let hours = (eh * 60 + em - (sh * 60 + sm)) / 60;
      if (hours < 0) hours += 24; // 야간 근무 (자정 넘김) / Night shift (past midnight)
      return total + hours;
    }, 0);
  }, [schedule]);

  // 주말만 근무 여부 / Weekend-only flag
  const isWeekendOnly = useMemo(() => {
    if (schedule.length === 0) return false;
    return schedule.every((s) => s.dayOfWeek === 'SAT' || s.dayOfWeek === 'SUN');
  }, [schedule]);

  // 요일 토글 / Toggle day
  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.has(day)) {
      onChange(schedule.filter((s) => s.dayOfWeek !== day));
    } else {
      // 이전 스케줄 기본값 복사 또는 기본 시간 / Copy previous or default time
      const lastSchedule = schedule[schedule.length - 1];
      const defaultStart = lastSchedule?.startTime || '09:00';
      const defaultEnd = lastSchedule?.endTime || '18:00';
      onChange([...schedule, { dayOfWeek: day, startTime: defaultStart, endTime: defaultEnd }]);
    }
  };

  // 요일별 시간 변경 / Update time for a day
  const updateTime = (day: DayOfWeek, field: 'startTime' | 'endTime', value: string) => {
    onChange(
      schedule.map((s) => (s.dayOfWeek === day ? { ...s, [field]: value } : s))
    );
  };

  return (
    <div className="space-y-4">
      {/* 요일 선택 버튼 그리드 / Day selection button grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {ALL_DAYS.map((day) => {
          const isSelected = selectedDays.has(day);
          const isWeekend = day === 'SAT' || day === 'SUN';
          return (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={cn(
                'flex flex-col items-center justify-center py-3 rounded-xl transition-all min-h-[44px] font-medium',
                isSelected
                  ? isWeekend
                    ? 'bg-coral-500 text-white shadow-md shadow-coral-200 bg-gradient-to-b from-orange-400 to-orange-500'
                    : 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : isWeekend
                    ? 'bg-red-50 text-red-400 hover:bg-red-100'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              )}
              aria-label={`${DAY_LABELS[day].full} ${isSelected ? '선택됨' : '선택'} / ${DAY_LABELS[day].shortEn} ${isSelected ? 'selected' : 'select'}`}
              aria-pressed={isSelected}
            >
              <span className="text-xs">{DAY_LABELS[day].shortEn}</span>
              <span className="text-base font-bold">{DAY_LABELS[day].short}</span>
            </button>
          );
        })}
      </div>

      {/* 요일별 시간대 설정 카드 / Per-day time slot cards */}
      {schedule.length > 0 && (
        <div className="space-y-2">
          {/* 정렬: 월~일 순 / Sort: Mon to Sun */}
          {ALL_DAYS.filter((d) => selectedDays.has(d)).map((day) => {
            const item = schedule.find((s) => s.dayOfWeek === day);
            if (!item) return null;

            // 해당 요일 근무시간 / Hours for this day
            const [sh, sm] = item.startTime.split(':').map(Number);
            const [eh, em] = item.endTime.split(':').map(Number);
            let dayHours = (eh * 60 + em - (sh * 60 + sm)) / 60;
            if (dayHours < 0) dayHours += 24;

            return (
              <div
                key={day}
                className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm"
              >
                {/* 요일 라벨 / Day label */}
                <div
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold flex-shrink-0',
                    day === 'SAT' || day === 'SUN'
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {DAY_LABELS[day].short}
                </div>

                {/* 시간 입력 / Time inputs */}
                <div className="flex items-center gap-2 flex-1">
                  <select
                    value={item.startTime}
                    onChange={(e) => updateTime(day, 'startTime', e.target.value)}
                    className="flex-1 h-10 rounded-lg border border-gray-200 bg-gray-50 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 min-w-0"
                    aria-label={`${DAY_LABELS[day].full} 시작 시간 / ${DAY_LABELS[day].shortEn} start time`}
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={`start-${t}`} value={t}>{t}</option>
                    ))}
                  </select>
                  <span className="text-gray-400 text-sm flex-shrink-0">~</span>
                  <select
                    value={item.endTime}
                    onChange={(e) => updateTime(day, 'endTime', e.target.value)}
                    className="flex-1 h-10 rounded-lg border border-gray-200 bg-gray-50 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 min-w-0"
                    aria-label={`${DAY_LABELS[day].full} 종료 시간 / ${DAY_LABELS[day].shortEn} end time`}
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={`end-${t}`} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* 시간 표시 / Hours display */}
                <span className="text-xs text-gray-400 flex-shrink-0 w-12 text-right">
                  {dayHours.toFixed(1)}h
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* 주당 요약 정보 카드 / Weekly summary card */}
      <div className={cn(
        'p-4 rounded-2xl border-2',
        schedule.length > 0
          ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
          : 'bg-gray-50 border-gray-100'
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {/* 주당 총 근무시간 / Total weekly hours */}
              주당 총 {weeklyHours.toFixed(1)}시간
            </p>
            <p className="text-xs text-gray-500">
              {schedule.length}일 근무 / {schedule.length} days per week
            </p>
          </div>
          {isWeekendOnly && (
            <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              {/* 주말만 근무 / Weekend only */}
              주말만
            </span>
          )}
        </div>

        {/* D-2 비자 주말 무제한 안내 / D-2 visa weekend unlimited notice */}
        {isWeekendOnly && (
          <div className="flex items-start gap-2 mt-3 p-2.5 bg-white/70 rounded-xl">
            <Info className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-700 leading-relaxed">
              {/* D-2(유학) 비자 소지자는 주말 근무 시간 무제한! 더 많은 구직자가 지원할 수 있습니다. */}
              D-2(유학) 비자는 주말 시간 무제한!
              <br />
              <span className="text-green-600">Weekend work: unlimited hours for D-2 visa holders</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
