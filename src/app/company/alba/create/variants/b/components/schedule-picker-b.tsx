'use client';

/**
 * Variant B 스케줄 피커 — 테이블 형태의 요일별 시간 입력
 * Variant B schedule picker — tabular per-day time input
 *
 * 사람인/잡코리아 스타일: 데이터 테이블 느낌, 컴팩트한 인풋
 * Saramin/Jobkorea style: data-table feel, compact inputs
 */

import { useState, useCallback } from 'react';
import { Clock, Info } from 'lucide-react';
import type { ScheduleItem } from './alba-types';
import { DAY_LABELS } from './alba-types';

interface SchedulePickerBProps {
  schedule: ScheduleItem[];
  onChange: (schedule: ScheduleItem[]) => void;
  weeklyHours: number;
  onWeeklyHoursChange: (hours: number) => void;
}

// ─── 전체 요일 목록 / All days of week ───
const ALL_DAYS: ScheduleItem['dayOfWeek'][] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// ─── 시간 옵션 생성 (30분 단위) / Generate time options (30min intervals) ───
const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of ['00', '30']) {
    TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${m}`);
  }
}
TIME_OPTIONS.push('24:00');

/**
 * 선택된 스케줄에서 주당 시간 계산
 * Calculate weekly hours from selected schedule
 */
function calculateWeeklyHours(schedule: ScheduleItem[]): number {
  let total = 0;
  for (const item of schedule) {
    const [startH, startM] = item.startTime.split(':').map(Number);
    const [endH, endM] = item.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    if (endMinutes > startMinutes) {
      total += (endMinutes - startMinutes) / 60;
    }
  }
  return Math.round(total * 10) / 10;
}

/**
 * 주말만 근무인지 판별 / Check if weekend-only work
 */
function isWeekendOnly(schedule: ScheduleItem[]): boolean {
  return schedule.length > 0 && schedule.every(s => s.dayOfWeek === 'SAT' || s.dayOfWeek === 'SUN');
}

export function SchedulePickerB({
  schedule,
  onChange,
  weeklyHours,
  onWeeklyHoursChange,
}: SchedulePickerBProps) {
  // ─── 선택된 요일 셋 / Selected days set ───
  const selectedDays = new Set(schedule.map(s => s.dayOfWeek));

  // ─── 일괄 적용 시간 상태 / Batch apply time state ───
  const [batchStart, setBatchStart] = useState('09:00');
  const [batchEnd, setBatchEnd] = useState('18:00');

  // ─── 요일 토글 / Toggle day ───
  const toggleDay = useCallback((day: ScheduleItem['dayOfWeek']) => {
    let newSchedule: ScheduleItem[];
    if (selectedDays.has(day)) {
      newSchedule = schedule.filter(s => s.dayOfWeek !== day);
    } else {
      newSchedule = [...schedule, { dayOfWeek: day, startTime: '09:00', endTime: '18:00' }];
    }
    // 요일 순서 정렬 / Sort by day order
    newSchedule.sort((a, b) => ALL_DAYS.indexOf(a.dayOfWeek) - ALL_DAYS.indexOf(b.dayOfWeek));
    onChange(newSchedule);
    onWeeklyHoursChange(calculateWeeklyHours(newSchedule));
  }, [schedule, selectedDays, onChange, onWeeklyHoursChange]);

  // ─── 시간 변경 / Change time ───
  const updateTime = useCallback((day: ScheduleItem['dayOfWeek'], field: 'startTime' | 'endTime', value: string) => {
    const newSchedule = schedule.map(s =>
      s.dayOfWeek === day ? { ...s, [field]: value } : s
    );
    onChange(newSchedule);
    onWeeklyHoursChange(calculateWeeklyHours(newSchedule));
  }, [schedule, onChange, onWeeklyHoursChange]);

  // ─── 일괄 적용 / Batch apply ───
  const applyBatch = useCallback(() => {
    const newSchedule = schedule.map(s => ({
      ...s,
      startTime: batchStart,
      endTime: batchEnd,
    }));
    onChange(newSchedule);
    onWeeklyHoursChange(calculateWeeklyHours(newSchedule));
  }, [schedule, batchStart, batchEnd, onChange, onWeeklyHoursChange]);

  const weekendOnlyFlag = isWeekendOnly(schedule);

  return (
    <div className="border border-gray-200 rounded-sm bg-white">
      {/* 헤더 / Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">
            근무 스케줄 설정 / Work Schedule
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-gray-500">
            주당 <span className="font-bold text-blue-700">{weeklyHours}</span>시간
          </span>
          {weekendOnlyFlag && (
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[11px] font-medium">
              주말만 근무
            </span>
          )}
        </div>
      </div>

      {/* 요일 선택 버튼 / Day selection buttons */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-500 mr-2 shrink-0">요일 선택:</span>
          {ALL_DAYS.map(day => {
            const isSelected = selectedDays.has(day);
            const isWeekend = day === 'SAT' || day === 'SUN';
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                aria-label={`${DAY_LABELS[day]}요일 ${isSelected ? '선택 해제' : '선택'}`}
                className={`
                  min-w-[44px] h-[36px] px-2.5 rounded-sm text-sm font-medium border transition-colors
                  ${isSelected
                    ? isWeekend
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-blue-600 text-white border-blue-600'
                    : isWeekend
                      ? 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                {DAY_LABELS[day]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 일괄 시간 적용 / Batch time apply */}
      {schedule.length > 1 && (
        <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 shrink-0">일괄 적용:</span>
          <select
            value={batchStart}
            onChange={e => setBatchStart(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1.5 bg-white min-w-[80px]"
            aria-label="일괄 시작 시간 / Batch start time"
          >
            {TIME_OPTIONS.map(t => (
              <option key={`bs-${t}`} value={t}>{t}</option>
            ))}
          </select>
          <span className="text-xs text-gray-400">~</span>
          <select
            value={batchEnd}
            onChange={e => setBatchEnd(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1.5 bg-white min-w-[80px]"
            aria-label="일괄 종료 시간 / Batch end time"
          >
            {TIME_OPTIONS.map(t => (
              <option key={`be-${t}`} value={t}>{t}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={applyBatch}
            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            적용
          </button>
        </div>
      )}

      {/* 요일별 시간 테이블 / Per-day time table */}
      {schedule.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {schedule.map(item => {
            const [sh, sm] = item.startTime.split(':').map(Number);
            const [eh, em] = item.endTime.split(':').map(Number);
            const hours = Math.round(((eh * 60 + em) - (sh * 60 + sm)) / 60 * 10) / 10;
            return (
              <div key={item.dayOfWeek} className="px-4 py-2.5 flex items-center gap-3">
                {/* 요일 라벨 / Day label */}
                <span className={`
                  min-w-[32px] text-center text-sm font-semibold
                  ${(item.dayOfWeek === 'SAT' || item.dayOfWeek === 'SUN')
                    ? 'text-blue-700' : 'text-gray-700'}
                `}>
                  {DAY_LABELS[item.dayOfWeek]}
                </span>

                {/* 시작 시간 / Start time */}
                <select
                  value={item.startTime}
                  onChange={e => updateTime(item.dayOfWeek, 'startTime', e.target.value)}
                  className="text-sm border border-gray-200 rounded px-2 py-1.5 bg-white min-w-[80px]"
                  aria-label={`${DAY_LABELS[item.dayOfWeek]}요일 시작 시간`}
                >
                  {TIME_OPTIONS.map(t => (
                    <option key={`s-${item.dayOfWeek}-${t}`} value={t}>{t}</option>
                  ))}
                </select>

                <span className="text-gray-400 text-sm">~</span>

                {/* 종료 시간 / End time */}
                <select
                  value={item.endTime}
                  onChange={e => updateTime(item.dayOfWeek, 'endTime', e.target.value)}
                  className="text-sm border border-gray-200 rounded px-2 py-1.5 bg-white min-w-[80px]"
                  aria-label={`${DAY_LABELS[item.dayOfWeek]}요일 종료 시간`}
                >
                  {TIME_OPTIONS.map(t => (
                    <option key={`e-${item.dayOfWeek}-${t}`} value={t}>{t}</option>
                  ))}
                </select>

                {/* 시간 표시 / Hours display */}
                <span className="text-xs text-gray-500 ml-auto">
                  {hours > 0 ? `${hours}h` : '-'}
                </span>

                {/* 삭제 / Remove */}
                <button
                  type="button"
                  onClick={() => toggleDay(item.dayOfWeek)}
                  className="text-gray-400 hover:text-red-500 text-xs transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={`${DAY_LABELS[item.dayOfWeek]}요일 삭제 / Remove ${DAY_LABELS[item.dayOfWeek]}`}
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-4 py-8 text-center text-gray-400 text-sm">
          근무 요일을 선택해주세요 / Select work days above
        </div>
      )}

      {/* 주말 무제한 안내 / Weekend unlimited notice */}
      {weekendOnlyFlag && (
        <div className="px-4 py-2.5 bg-green-50 border-t border-green-100 flex items-start gap-2">
          <Info className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
          <p className="text-xs text-green-700 leading-relaxed">
            주말만 근무 시 D-2(유학) 비자 소지자는 시간 제한 없이 근무 가능합니다.
            <br />
            <span className="text-green-600">
              Weekend-only work: D-2 (study) visa holders have no hour limit.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
