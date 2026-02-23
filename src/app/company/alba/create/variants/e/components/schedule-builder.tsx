'use client';

import type { DayOfWeek, ScheduleItem } from '../../a/types';
import { Check } from 'lucide-react';

interface ScheduleBuilderProps {
  /** 현재 스케줄 배열 / Current schedule array */
  schedule: ScheduleItem[];
  /** 스케줄 + 주당시간 업데이트 콜백 / Schedule + weekly hours update callback */
  onUpdate: (schedule: ScheduleItem[], weeklyHours: number) => void;
}

/** 요일 정의 / Day definitions */
const DAYS: { id: DayOfWeek; label: string; labelEn: string; isWeekend: boolean }[] = [
  { id: 'MON', label: '월', labelEn: 'Mon', isWeekend: false },
  { id: 'TUE', label: '화', labelEn: 'Tue', isWeekend: false },
  { id: 'WED', label: '수', labelEn: 'Wed', isWeekend: false },
  { id: 'THU', label: '목', labelEn: 'Thu', isWeekend: false },
  { id: 'FRI', label: '금', labelEn: 'Fri', isWeekend: false },
  { id: 'SAT', label: '토', labelEn: 'Sat', isWeekend: true },
  { id: 'SUN', label: '일', labelEn: 'Sun', isWeekend: true },
];

/**
 * 요일별 근무 스케줄 설정 컴포넌트 (시안 E)
 * Per-day work schedule builder component (Variant E)
 *
 * 요일 토글 체크 + 시작/종료 시간 입력 + 주당시간 자동 계산
 * Day toggle check + start/end time input + weekly hours auto-calculation
 */
export function ScheduleBuilder({ schedule, onUpdate }: ScheduleBuilderProps) {
  /** 주당 근무시간 계산 / Calculate weekly work hours */
  const calculateWeeklyHours = (sch: ScheduleItem[]): number => {
    return sch.reduce((total, item) => {
      const start = new Date(`1970-01-01T${item.startTime}:00`);
      const end = new Date(`1970-01-01T${item.endTime}:00`);
      let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (diff < 0) diff += 24; // 야간 교차 / Overnight shift
      return total + diff;
    }, 0);
  };

  /** 스케줄 업데이트 + 시간 재계산 / Update schedule + recalculate hours */
  const updateSchedule = (newSchedule: ScheduleItem[]) => {
    const weeklyHours = calculateWeeklyHours(newSchedule);
    onUpdate(newSchedule, parseFloat(weeklyHours.toFixed(1)));
  };

  /** 요일 토글 핸들러 / Day toggle handler */
  const handleDayToggle = (day: DayOfWeek) => {
    const exists = schedule.find((s) => s.dayOfWeek === day);
    let newSchedule: ScheduleItem[];
    if (exists) {
      newSchedule = schedule.filter((item) => item.dayOfWeek !== day);
    } else {
      newSchedule = [...schedule, { dayOfWeek: day, startTime: '09:00', endTime: '18:00' }];
      newSchedule.sort(
        (a, b) =>
          DAYS.findIndex((d) => d.id === a.dayOfWeek) - DAYS.findIndex((d) => d.id === b.dayOfWeek)
      );
    }
    updateSchedule(newSchedule);
  };

  /** 시간 변경 핸들러 / Time change handler */
  const handleTimeChange = (day: DayOfWeek, type: 'startTime' | 'endTime', value: string) => {
    const newSchedule = schedule.map((item) =>
      item.dayOfWeek === day ? { ...item, [type]: value } : item
    );
    updateSchedule(newSchedule);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 요일 선택 행 / Day selection row */}
      <div className="flex bg-gray-50 border-b border-gray-200 p-2 gap-1">
        {DAYS.map(({ id, label, isWeekend }) => {
          const isActive = schedule.some((s) => s.dayOfWeek === id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleDayToggle(id)}
              className={`flex-1 min-h-[44px] rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1
                ${isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isWeekend
                    ? 'bg-white text-red-400 border border-gray-200 hover:border-blue-300'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                }`}
              aria-label={`${label}요일 ${isActive ? '해제' : '선택'} / Toggle ${id}`}
              aria-pressed={isActive}
            >
              {isActive && <Check className="w-3 h-3" />}
              {label}
            </button>
          );
        })}
      </div>

      {/* 시간 설정 영역 / Time settings area */}
      <div className="divide-y divide-gray-100">
        {schedule.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">
            근무할 요일을 선택해주세요 / Select work days above
          </div>
        ) : (
          schedule.map((item) => {
            const dayInfo = DAYS.find((d) => d.id === item.dayOfWeek);
            return (
              <div key={item.dayOfWeek} className="flex items-center gap-3 px-4 py-3">
                <span
                  className={`w-8 text-sm font-bold ${
                    dayInfo?.isWeekend ? 'text-red-500' : 'text-gray-700'
                  }`}
                >
                  {dayInfo?.label}
                </span>
                <input
                  type="time"
                  value={item.startTime}
                  onChange={(e) => handleTimeChange(item.dayOfWeek, 'startTime', e.target.value)}
                  className="h-10 px-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  aria-label={`${dayInfo?.label}요일 시작 시간 / ${item.dayOfWeek} start time`}
                />
                <span className="text-gray-400 text-sm">~</span>
                <input
                  type="time"
                  value={item.endTime}
                  onChange={(e) => handleTimeChange(item.dayOfWeek, 'endTime', e.target.value)}
                  className="h-10 px-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  aria-label={`${dayInfo?.label}요일 종료 시간 / ${item.dayOfWeek} end time`}
                />
                {/* 일일 근무시간 표시 / Daily hours display */}
                <span className="text-xs text-gray-400 ml-auto hidden sm:inline">
                  {(() => {
                    const start = new Date(`1970-01-01T${item.startTime}:00`);
                    const end = new Date(`1970-01-01T${item.endTime}:00`);
                    let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                    if (diff < 0) diff += 24;
                    return `${diff}h`;
                  })()}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
