'use client';

import { useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Clock, Info } from 'lucide-react';
import type { DayOfWeek, ScheduleItem } from '../types';
import { DAY_LABELS } from '../mock-data';

/**
 * 요일별 근무 스케줄 선택기 (미니멀 스타일)
 * Per-day work schedule picker (minimal style)
 *
 * 요일 토글 + 시간 입력 + 주당 시간 자동 계산
 * Day toggles + time inputs + auto weekly hours calculation
 */

interface SchedulePickerProps {
  schedule: ScheduleItem[];
  onScheduleChange: (schedule: ScheduleItem[]) => void;
  weeklyHours: number;
  onWeeklyHoursChange: (hours: number) => void;
}

const ALL_DAYS: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const WEEKDAY_DAYS: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const WEEKEND_DAYS: DayOfWeek[] = ['SAT', 'SUN'];

/** 시간 문자열에서 시간(분) 계산 / Calculate minutes from time string */
function calculateMinutes(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  // 야간 근무 (종료가 시작보다 이른 경우) / Night shift (end earlier than start)
  return endMin > startMin ? endMin - startMin : (24 * 60 - startMin) + endMin;
}

/** 시간 옵션 생성 (30분 간격) / Generate time options (30min intervals) */
function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      options.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

export function SchedulePicker({
  schedule,
  onScheduleChange,
  weeklyHours,
  onWeeklyHoursChange,
}: SchedulePickerProps) {
  // 선택된 요일 세트 / Selected days set
  const selectedDays = useMemo(
    () => new Set(schedule.map((s) => s.dayOfWeek)),
    [schedule],
  );

  // 주말만 근무 여부 / Weekend-only flag
  const isWeekendOnly = useMemo(() => {
    if (schedule.length === 0) return false;
    return schedule.every((s) => WEEKEND_DAYS.includes(s.dayOfWeek));
  }, [schedule]);

  // 주당 총 시간 자동 계산 / Auto-calculate weekly total hours
  const calculatedHours = useMemo(() => {
    let totalMinutes = 0;
    schedule.forEach((s) => {
      if (s.startTime && s.endTime) {
        totalMinutes += calculateMinutes(s.startTime, s.endTime);
      }
    });
    return Math.round((totalMinutes / 60) * 10) / 10;
  }, [schedule]);

  // 요일 토글 / Toggle day
  const toggleDay = useCallback(
    (day: DayOfWeek) => {
      let newSchedule: ScheduleItem[];
      if (selectedDays.has(day)) {
        newSchedule = schedule.filter((s) => s.dayOfWeek !== day);
      } else {
        // 기본 시간 설정 / Default time setting
        newSchedule = [
          ...schedule,
          { dayOfWeek: day, startTime: '09:00', endTime: '18:00' },
        ];
      }
      // 요일 순서대로 정렬 / Sort by day order
      newSchedule.sort((a, b) => ALL_DAYS.indexOf(a.dayOfWeek) - ALL_DAYS.indexOf(b.dayOfWeek));
      onScheduleChange(newSchedule);
      // 주당 시간 자동 갱신 / Auto-update weekly hours
      let totalMinutes = 0;
      newSchedule.forEach((s) => {
        if (s.startTime && s.endTime) {
          totalMinutes += calculateMinutes(s.startTime, s.endTime);
        }
      });
      onWeeklyHoursChange(Math.round((totalMinutes / 60) * 10) / 10);
    },
    [schedule, selectedDays, onScheduleChange, onWeeklyHoursChange],
  );

  // 시간 변경 / Update time for a day
  const updateTime = useCallback(
    (day: DayOfWeek, field: 'startTime' | 'endTime', value: string) => {
      const newSchedule = schedule.map((s) =>
        s.dayOfWeek === day ? { ...s, [field]: value } : s,
      );
      onScheduleChange(newSchedule);
      // 주당 시간 자동 갱신 / Auto-update weekly hours
      let totalMinutes = 0;
      newSchedule.forEach((s) => {
        if (s.startTime && s.endTime) {
          totalMinutes += calculateMinutes(s.startTime, s.endTime);
        }
      });
      onWeeklyHoursChange(Math.round((totalMinutes / 60) * 10) / 10);
    },
    [schedule, onScheduleChange, onWeeklyHoursChange],
  );

  return (
    <div className="space-y-5">
      {/* 요일 토글 버튼 / Day toggle buttons */}
      <div>
        <div className="text-sm font-medium text-gray-700 mb-3">
          근무 요일 선택 <span className="text-gray-400 font-normal">/ Select work days</span>
        </div>
        <div className="flex gap-2">
          {ALL_DAYS.map((day) => {
            const isSelected = selectedDays.has(day);
            const isWeekend = WEEKEND_DAYS.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={cn(
                  'flex-1 min-h-[44px] rounded-xl text-sm font-medium transition-all duration-200',
                  'focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 outline-none',
                  isSelected
                    ? 'bg-blue-500 text-white shadow-sm'
                    : isWeekend
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100',
                )}
                aria-label={`${DAY_LABELS[day].ko} ${isSelected ? '선택됨' : '선택안됨'}`}
                aria-pressed={isSelected}
              >
                {DAY_LABELS[day].koShort}
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택된 요일별 시간 입력 / Time input per selected day */}
      {schedule.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">
            시간 설정 <span className="text-gray-400 font-normal">/ Set hours</span>
          </div>
          {schedule.map((item) => {
            const dailyMinutes = calculateMinutes(item.startTime, item.endTime);
            const dailyHours = Math.round((dailyMinutes / 60) * 10) / 10;

            return (
              <div
                key={item.dayOfWeek}
                className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3"
              >
                {/* 요일 라벨 / Day label */}
                <span className="text-sm font-semibold text-gray-800 min-w-[44px]">
                  {DAY_LABELS[item.dayOfWeek].ko}
                </span>

                {/* 시작 시간 / Start time */}
                <select
                  value={item.startTime}
                  onChange={(e) => updateTime(item.dayOfWeek, 'startTime', e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm min-h-[44px] outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  aria-label={`${DAY_LABELS[item.dayOfWeek].ko} 시작 시간 / Start time`}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={`start-${t}`} value={t}>{t}</option>
                  ))}
                </select>

                <span className="text-gray-400 text-sm">~</span>

                {/* 종료 시간 / End time */}
                <select
                  value={item.endTime}
                  onChange={(e) => updateTime(item.dayOfWeek, 'endTime', e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm min-h-[44px] outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  aria-label={`${DAY_LABELS[item.dayOfWeek].ko} 종료 시간 / End time`}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={`end-${t}`} value={t}>{t}</option>
                  ))}
                </select>

                {/* 일일 시간 표시 / Daily hours display */}
                <span className="text-xs text-gray-500 min-w-[40px] text-right">
                  {dailyHours}h
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* 주당 총 시간 요약 / Weekly total hours summary */}
      {schedule.length > 0 && (
        <div className="bg-blue-50 rounded-2xl px-5 py-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-900">
                주당 총 근무시간 <span className="font-normal text-blue-600">/ Weekly hours</span>
              </span>
            </div>
            <span className="text-xl font-bold text-blue-600">
              {calculatedHours}시간
            </span>
          </div>

          {/* 주말만 근무 안내 / Weekend-only notice */}
          {isWeekendOnly && (
            <div className="flex items-start gap-2 mt-1">
              <Info className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <p className="text-xs text-green-700 leading-relaxed">
                주말만 근무 — D-2(유학) 비자는 주말 시간 무제한!
                <span className="text-green-500 ml-1">
                  / Weekend only — D-2 visa: unlimited weekend hours!
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
