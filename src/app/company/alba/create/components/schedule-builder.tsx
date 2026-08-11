'use client';

import { useLanguage } from '@/i18n/LanguageProvider';
import { getAlbaCopy } from '../copy';
import type { DayOfWeek, ScheduleItem } from './alba-types';

/**
 * 근무 스케줄 빌더 (E 스타일 기반)
 * Work schedule builder (based on variant E style)
 */

const DAY_KEYS: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

/** 시간 차이 계산 / Calculate time difference in hours */
function calcDailyHours(start: string, end: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let diff = (eh * 60 + em - (sh * 60 + sm)) / 60;
  if (diff <= 0) diff += 24; // 야간 교대 / overnight
  return Math.round(diff * 10) / 10;
}

interface Props {
  schedule: ScheduleItem[];
  onChange: (schedule: ScheduleItem[]) => void;
}

export default function ScheduleBuilder({ schedule, onChange }: Props) {
  const { lang } = useLanguage();
  const copy = getAlbaCopy(lang);
  const selectedDays = new Set(schedule.map(s => s.dayOfWeek));

  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.has(day)) {
      onChange(schedule.filter(s => s.dayOfWeek !== day));
    } else {
      onChange([...schedule, { dayOfWeek: day, startTime: '09:00', endTime: '18:00' }]
        .sort((a, b) => DAY_KEYS.indexOf(a.dayOfWeek) - DAY_KEYS.indexOf(b.dayOfWeek)));
    }
  };

  const updateTime = (day: DayOfWeek, field: 'startTime' | 'endTime', value: string) => {
    onChange(schedule.map(s => s.dayOfWeek === day ? { ...s, [field]: value } : s));
  };

  const weeklyHours = schedule.reduce((sum, s) => sum + calcDailyHours(s.startTime, s.endTime), 0);

  return (
    <div className="space-y-4">
      {/* 요일 선택 / Day selection */}
      <div role="group" aria-label={copy.basic.schedule} className="grid grid-cols-7 gap-1.5 sm:flex sm:gap-2">
        {DAY_KEYS.map(day => {
          const selected = selectedDays.has(day);
          return <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            aria-pressed={selected}
            aria-label={copy.schedule.days[day]}
            className={`aspect-square min-h-10 w-full rounded-lg text-xs font-semibold transition-colors sm:h-10 sm:w-10 sm:aspect-auto ${selected ? 'bg-[#0066FF] text-white' : 'border border-gray-200 bg-white text-gray-500 hover:border-blue-300'}`}
          >
            {copy.schedule.days[day]}
          </button>
        })}
      </div>

      {/* 시간 입력 / Time inputs */}
      {schedule.length > 0 && (
        <div className="space-y-2">
          {schedule.map(s => {
            return (
              <div key={s.dayOfWeek} className="grid grid-cols-[2rem_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-sm">
                <span className="text-center font-medium text-[#191F28]">{copy.schedule.days[s.dayOfWeek]}</span>
                <input
                  type="time"
                  aria-label={`${copy.schedule.days[s.dayOfWeek]} ${copy.schedule.startTime}`}
                  value={s.startTime}
                  onChange={e => updateTime(s.dayOfWeek, 'startTime', e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                />
                <span className="text-gray-400">~</span>
                <input
                  type="time"
                  aria-label={`${copy.schedule.days[s.dayOfWeek]} ${copy.schedule.endTime}`}
                  value={s.endTime}
                  onChange={e => updateTime(s.dayOfWeek, 'endTime', e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* 주간 근무시간 / Weekly hours summary */}
      {schedule.length > 0 && (
        <div role="status" className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm font-medium text-[#0066FF]">
          {copy.schedule.selectedSummary(weeklyHours, schedule.length)}
        </div>
      )}
    </div>
  );
}
