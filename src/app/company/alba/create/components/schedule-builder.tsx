'use client';

import type { DayOfWeek, ScheduleItem } from './alba-types';

/**
 * 근무 스케줄 빌더 (E 스타일 기반)
 * Work schedule builder (based on variant E style)
 */

const DAYS: { key: DayOfWeek; label: string; short: string; isWeekend: boolean }[] = [
  { key: 'MON', label: '월', short: 'M', isWeekend: false },
  { key: 'TUE', label: '화', short: 'T', isWeekend: false },
  { key: 'WED', label: '수', short: 'W', isWeekend: false },
  { key: 'THU', label: '목', short: 'T', isWeekend: false },
  { key: 'FRI', label: '금', short: 'F', isWeekend: false },
  { key: 'SAT', label: '토', short: 'S', isWeekend: true },
  { key: 'SUN', label: '일', short: 'S', isWeekend: true },
];

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
  const selectedDays = new Set(schedule.map(s => s.dayOfWeek));

  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.has(day)) {
      onChange(schedule.filter(s => s.dayOfWeek !== day));
    } else {
      onChange([...schedule, { dayOfWeek: day, startTime: '09:00', endTime: '18:00' }]
        .sort((a, b) => DAYS.findIndex(d => d.key === a.dayOfWeek) - DAYS.findIndex(d => d.key === b.dayOfWeek)));
    }
  };

  const updateTime = (day: DayOfWeek, field: 'startTime' | 'endTime', value: string) => {
    onChange(schedule.map(s => s.dayOfWeek === day ? { ...s, [field]: value } : s));
  };

  const weeklyHours = schedule.reduce((sum, s) => sum + calcDailyHours(s.startTime, s.endTime), 0);

  return (
    <div className="space-y-4">
      {/* 요일 선택 / Day selection */}
      <div className="flex gap-2">
        {DAYS.map(d => (
          <button
            key={d.key}
            type="button"
            onClick={() => toggleDay(d.key)}
            className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
              selectedDays.has(d.key)
                ? 'bg-blue-600 text-white'
                : d.isWeekend
                ? 'bg-red-50 text-red-400 border border-red-200'
                : 'bg-gray-100 text-gray-400 border border-gray-200'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* 시간 입력 / Time inputs */}
      {schedule.length > 0 && (
        <div className="space-y-2">
          {schedule.map(s => {
            const dayInfo = DAYS.find(d => d.key === s.dayOfWeek)!;
            const hours = calcDailyHours(s.startTime, s.endTime);
            return (
              <div key={s.dayOfWeek} className="flex items-center gap-2 text-sm">
                <span className={`w-8 text-center font-medium ${dayInfo.isWeekend ? 'text-red-500' : 'text-gray-600'}`}>
                  {dayInfo.label}
                </span>
                <input
                  type="time"
                  value={s.startTime}
                  onChange={e => updateTime(s.dayOfWeek, 'startTime', e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                />
                <span className="text-gray-400">~</span>
                <input
                  type="time"
                  value={s.endTime}
                  onChange={e => updateTime(s.dayOfWeek, 'endTime', e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                />
                <span className="text-xs text-gray-400 hidden sm:inline">{hours}h</span>
              </div>
            );
          })}
        </div>
      )}

      {/* 주간 근무시간 / Weekly hours summary */}
      {schedule.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
          <span className="text-blue-600 text-sm font-medium">주간 근무시간</span>
          <span className="text-blue-800 text-lg font-bold">{weeklyHours}시간</span>
          <span className="text-blue-500 text-xs">/ 주 {schedule.length}일</span>
        </div>
      )}
    </div>
  );
}
