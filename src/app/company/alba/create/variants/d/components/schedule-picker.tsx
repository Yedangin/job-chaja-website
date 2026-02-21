'use client';

import { cn } from '@/lib/utils';
import { Clock, Info } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import type { DayOfWeek, ScheduleItem } from '../alba-types';
import { ALL_DAYS, DAY_LABELS } from '../alba-types';

/**
 * 요일별 근무 스케줄 선택 컴포넌트 (대시보드 스타일)
 * Per-day work schedule picker component (dashboard style)
 *
 * 토글 기반 요일 선택 + 시간대 입력 + 자동 주당시간 계산
 * Toggle-based day selection + time input + auto weekly hours calculation
 */

interface SchedulePickerProps {
  schedule: ScheduleItem[];
  onChange: (schedule: ScheduleItem[]) => void;
}

/** 시간 옵션 생성 (30분 단위) / Generate time options (30-min intervals) */
const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

export function SchedulePicker({ schedule, onChange }: SchedulePickerProps) {
  // 선택된 요일 셋 / Set of selected days
  const selectedDays = useMemo(
    () => new Set(schedule.map((s) => s.dayOfWeek)),
    [schedule],
  );

  // 요일 토글 / Toggle day
  const toggleDay = useCallback(
    (day: DayOfWeek) => {
      if (selectedDays.has(day)) {
        onChange(schedule.filter((s) => s.dayOfWeek !== day));
      } else {
        onChange([...schedule, { dayOfWeek: day, startTime: '09:00', endTime: '18:00' }]);
      }
    },
    [schedule, selectedDays, onChange],
  );

  // 시간 변경 / Update time
  const updateTime = useCallback(
    (day: DayOfWeek, field: 'startTime' | 'endTime', value: string) => {
      onChange(
        schedule.map((s) =>
          s.dayOfWeek === day ? { ...s, [field]: value } : s,
        ),
      );
    },
    [schedule, onChange],
  );

  // 주당 총 근무시간 계산 / Calculate weekly hours
  const weeklyHours = useMemo(() => {
    return schedule.reduce((total, item) => {
      const [sh, sm] = item.startTime.split(':').map(Number);
      const [eh, em] = item.endTime.split(':').map(Number);
      let startMin = sh * 60 + sm;
      let endMin = eh * 60 + em;
      // 다음날 넘어가는 경우 / Overnight shift
      if (endMin <= startMin) endMin += 24 * 60;
      return total + (endMin - startMin) / 60;
    }, 0);
  }, [schedule]);

  // 주말만 근무 여부 / Weekend-only check
  const isWeekendOnly = useMemo(() => {
    if (schedule.length === 0) return false;
    return schedule.every((s) => s.dayOfWeek === 'SAT' || s.dayOfWeek === 'SUN');
  }, [schedule]);

  // 일별 근무시간 계산 / Per-day hours calculation
  const getDayHours = (item: ScheduleItem): number => {
    const [sh, sm] = item.startTime.split(':').map(Number);
    const [eh, em] = item.endTime.split(':').map(Number);
    let startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;
    if (endMin <= startMin) endMin += 24 * 60;
    return (endMin - startMin) / 60;
  };

  return (
    <div className="space-y-4">
      {/* 요일 선택 그리드 / Day selection grid */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          근무 요일 / Work Days
        </label>
        <div className="flex gap-1.5">
          {ALL_DAYS.map((day) => {
            const isSelected = selectedDays.has(day);
            const isWeekend = day === 'SAT' || day === 'SUN';

            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={cn(
                  'flex-1 h-11 rounded text-sm font-medium transition-colors',
                  'border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
                  'min-w-11', // 터치 타겟 44px / Touch target 44px
                  isSelected && !isWeekend && 'bg-gray-900 text-white border-gray-900',
                  isSelected && isWeekend && 'bg-indigo-600 text-white border-indigo-600',
                  !isSelected && 'bg-white text-gray-500 border-gray-200 hover:border-gray-400',
                )}
                aria-pressed={isSelected}
                aria-label={`${DAY_LABELS[day].ko} ${isSelected ? '선택됨' : '선택 안됨'} / ${DAY_LABELS[day].en} ${isSelected ? 'selected' : 'not selected'}`}
              >
                {DAY_LABELS[day].short}
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택된 요일별 시간 입력 / Per-day time input */}
      {schedule.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
            근무 시간 / Work Hours
          </label>
          <div className="border border-gray-200 rounded divide-y divide-gray-100">
            {/* 정렬된 순서로 표시 / Display in sorted order */}
            {ALL_DAYS.filter((d) => selectedDays.has(d)).map((day) => {
              const item = schedule.find((s) => s.dayOfWeek === day);
              if (!item) return null;
              const hours = getDayHours(item);

              return (
                <div
                  key={day}
                  className="flex items-center gap-3 px-3 py-2.5 bg-white"
                >
                  {/* 요일 라벨 / Day label */}
                  <span className={cn(
                    'text-sm font-mono font-medium w-8',
                    (day === 'SAT' || day === 'SUN') ? 'text-indigo-600' : 'text-gray-700',
                  )}>
                    {DAY_LABELS[day].short}
                  </span>

                  {/* 시작 시간 / Start time */}
                  <select
                    value={item.startTime}
                    onChange={(e) => updateTime(day, 'startTime', e.target.value)}
                    className="h-9 px-2 border border-gray-200 rounded text-sm font-mono bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                    aria-label={`${DAY_LABELS[day].ko} 시작 시간 / ${DAY_LABELS[day].en} start time`}
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                  <span className="text-gray-400 text-xs">~</span>

                  {/* 종료 시간 / End time */}
                  <select
                    value={item.endTime}
                    onChange={(e) => updateTime(day, 'endTime', e.target.value)}
                    className="h-9 px-2 border border-gray-200 rounded text-sm font-mono bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                    aria-label={`${DAY_LABELS[day].ko} 종료 시간 / ${DAY_LABELS[day].en} end time`}
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                  {/* 일 근무시간 / Daily hours */}
                  <span className="text-xs text-gray-400 font-mono ml-auto">
                    {hours.toFixed(1)}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 주당 시간 요약 / Weekly hours summary */}
      {schedule.length > 0 && (
        <div className="flex items-center justify-between px-3 py-3 bg-gray-50 border border-gray-200 rounded">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              주당 총 근무시간 / Weekly total
            </span>
          </div>
          <span className="text-lg font-mono font-bold text-gray-900">
            {weeklyHours.toFixed(1)}h
          </span>
        </div>
      )}

      {/* 주말만 근무 안내 / Weekend-only notice */}
      {isWeekendOnly && schedule.length > 0 && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-indigo-50 border border-indigo-100 rounded">
          <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
          <p className="text-xs text-indigo-700 leading-relaxed">
            주말만 근무 공고입니다. D-2(유학) 비자 소지자는 주말 근무 시 시간 제한 없이 지원 가능합니다.
            <br />
            <span className="text-indigo-500">
              Weekend-only posting. D-2 (Study) visa holders can work without hour limits on weekends.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
