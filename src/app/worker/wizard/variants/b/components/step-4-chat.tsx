'use client';

/**
 * Step 4: 학력 채팅 / Education chat
 * 학교명, 전공, 학위 — 복수 입력
 * School name, major, degree — multiple entries
 */

import { DEGREE_TYPES } from '../types';
import type { ChatQuestion } from '../types';

/**
 * Step 4 질문 목록 / Step 4 questions
 * 간소화: 학위 → 전공 → 학교명 순으로 1세트, "추가" 선택으로 반복
 * Simplified: degree → major → school in 1 set, repeat with "add more"
 */
export const step4Questions: ChatQuestion[] = [
  {
    id: 'education_degree',
    step: 4,
    message: '최종 학력을 알려주세요.',
    subMessage: 'What is your highest level of education?',
    inputType: 'choice',
    options: DEGREE_TYPES,
    required: true,
    skippable: false,
    fieldKey: '_edu_degree',
  },
  {
    id: 'education_major',
    step: 4,
    message: '전공(학과)은 무엇인가요?',
    subMessage: 'What was your major / field of study?',
    inputType: 'text',
    placeholder: '예: 컴퓨터공학 (e.g., Computer Science)',
    required: false,
    skippable: true,
    skipLabel: '전공 없음 / 해당 없음 (N/A)',
    fieldKey: '_edu_major',
  },
  {
    id: 'education_school',
    step: 4,
    message: '학교 이름을 입력해주세요.',
    subMessage: 'Please enter the name of your school.',
    inputType: 'text',
    placeholder: '예: Hanoi University (하노이대학교)',
    required: false,
    skippable: true,
    skipLabel: '나중에 입력 (Skip)',
    fieldKey: '_edu_school',
  },
  {
    id: 'education_country',
    step: 4,
    message: '졸업 국가는 어디인가요?',
    subMessage: 'In which country did you graduate?',
    inputType: 'text',
    placeholder: '예: Vietnam, Korea',
    required: false,
    skippable: true,
    skipLabel: '나중에 입력 (Skip)',
    fieldKey: '_edu_country',
  },
  {
    id: 'education_more',
    step: 4,
    message: '다른 학력을 추가하시겠어요?',
    subMessage: 'Would you like to add another education entry?',
    inputType: 'choice',
    options: [
      { value: 'yes', label: '네, 추가할게요 (Yes, add more)', icon: '➕' },
      { value: 'no', label: '아니요, 다음으로 (No, continue)', icon: '➡️' },
    ],
    required: true,
    skippable: false,
    fieldKey: '_edu_more',
  },
];

/**
 * Step 4 답변 텍스트 생성 / Generate Step 4 answer display text
 */
export function getStep4AnswerDisplay(fieldKey: string, value: string): string {
  if (fieldKey === '_edu_degree') {
    const found = DEGREE_TYPES.find((d) => d.value === value);
    return found ? found.label : value;
  }
  if (fieldKey === '_edu_more') {
    return value === 'yes' ? '➕ 학력 추가' : '➡️ 다음으로';
  }
  return value;
}
