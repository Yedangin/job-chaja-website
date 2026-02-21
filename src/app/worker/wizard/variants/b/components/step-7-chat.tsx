'use client';

/**
 * Step 7: 희망 근무조건 채팅 / Desired work conditions chat
 * 직종, 지역, 급여, 입사 가능일, 근무 형태
 * Job types, locations, salary, available date, work schedule
 */

import { JOB_TYPES, WORK_LOCATIONS, WORK_SCHEDULES } from '../types';
import type { ChatQuestion } from '../types';

/**
 * Step 7 질문 목록 / Step 7 questions
 */
export const step7Questions: ChatQuestion[] = [
  {
    id: 'desired_job_types',
    step: 7,
    message: '거의 다 왔어요! 🎉 어떤 분야에서 일하고 싶으세요?',
    subMessage: 'Almost done! What type of work are you looking for? (Select multiple)',
    inputType: 'multi-select',
    options: JOB_TYPES,
    required: true,
    skippable: false,
    fieldKey: 'desiredJobTypes',
  },
  {
    id: 'desired_locations',
    step: 7,
    message: '희망 근무 지역을 선택해주세요.',
    subMessage: 'Where would you like to work? (Select multiple)',
    inputType: 'multi-select',
    options: WORK_LOCATIONS,
    required: true,
    skippable: false,
    fieldKey: 'desiredLocations',
  },
  {
    id: 'desired_salary',
    step: 7,
    message: '희망 월급 범위를 알려주세요.',
    subMessage: 'What is your desired monthly salary range?',
    inputType: 'salary-range',
    required: false,
    skippable: true,
    skipLabel: '상관없어요 (Any salary)',
    fieldKey: '_salary_range',
  },
  {
    id: 'available_date',
    step: 7,
    message: '언제부터 일할 수 있나요?',
    subMessage: 'When are you available to start working?',
    inputType: 'choice',
    options: [
      { value: 'immediately', label: '즉시 가능 (Immediately)', icon: '🚀' },
      { value: '1week', label: '1주 후 (In 1 week)', icon: '📅' },
      { value: '2weeks', label: '2주 후 (In 2 weeks)', icon: '📅' },
      { value: '1month', label: '1개월 후 (In 1 month)', icon: '📅' },
      { value: 'negotiable', label: '협의 가능 (Negotiable)', icon: '🤝' },
    ],
    required: true,
    skippable: false,
    fieldKey: 'availableDate',
  },
  {
    id: 'work_schedule',
    step: 7,
    message: '마지막! 선호하는 근무 형태를 골라주세요.',
    subMessage: 'Last one! What type of work schedule do you prefer?',
    inputType: 'choice',
    options: WORK_SCHEDULES,
    required: true,
    skippable: false,
    fieldKey: 'workSchedule',
  },
];

/**
 * Step 7 답변 텍스트 생성 / Generate Step 7 answer display text
 */
export function getStep7AnswerDisplay(fieldKey: string, value: string | string[]): string {
  if (fieldKey === 'desiredJobTypes' && Array.isArray(value)) {
    return value
      .map((v) => {
        const found = JOB_TYPES.find((j) => j.value === v);
        return found ? `${found.icon} ${found.label}` : v;
      })
      .join(', ');
  }
  if (fieldKey === 'desiredLocations' && Array.isArray(value)) {
    return value
      .map((v) => {
        const found = WORK_LOCATIONS.find((l) => l.value === v);
        return found ? found.label : v;
      })
      .join(', ');
  }
  if (fieldKey === '_salary_range') {
    return typeof value === 'string' ? `💰 ${value}원` : String(value);
  }
  if (fieldKey === 'availableDate') {
    const map: Record<string, string> = {
      immediately: '🚀 즉시 가능',
      '1week': '📅 1주 후',
      '2weeks': '📅 2주 후',
      '1month': '📅 1개월 후',
      negotiable: '🤝 협의 가능',
    };
    return map[typeof value === 'string' ? value : ''] ?? String(value);
  }
  if (fieldKey === 'workSchedule') {
    const found = WORK_SCHEDULES.find((w) => w.value === value);
    return found ? `${found.icon} ${found.label}` : String(value);
  }
  return String(value);
}
