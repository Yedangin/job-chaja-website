'use client';

/**
 * Step 6: 경력 채팅 / Career/experience chat
 * 복수 입력, "없음" 가능
 * Multiple entries, "none" option available
 */

import type { ChatQuestion } from '../types';

/**
 * Step 6 질문 목록 / Step 6 questions
 * 간소화: 경력 유무 → 회사명 → 직무 → 기간 → 추가 여부
 * Simplified: has career → company → position → duration → add more
 */
export const step6Questions: ChatQuestion[] = [
  {
    id: 'has_career',
    step: 6,
    message: '이전 또는 현재 직장 경력이 있나요?',
    subMessage: 'Do you have any previous or current work experience?',
    inputType: 'choice',
    options: [
      { value: 'yes', label: '네, 있어요 (Yes)', icon: '💼' },
      { value: 'no', label: '없어요 (No experience)', icon: '🆕' },
    ],
    required: true,
    skippable: false,
    fieldKey: '_has_career',
  },
  {
    id: 'career_company',
    step: 6,
    message: '회사(사업장) 이름을 알려주세요.',
    subMessage: 'What is the name of the company/workplace?',
    inputType: 'text',
    placeholder: '예: 삼성전자 / Samsung Electronics',
    required: true,
    skippable: false,
    fieldKey: '_career_company',
    showIf: (data) => data.hasCareer,
  },
  {
    id: 'career_position',
    step: 6,
    message: '어떤 일을 했나요? (직무/직책)',
    subMessage: 'What was your role / position?',
    inputType: 'text',
    placeholder: '예: 생산직 / Production worker',
    required: true,
    skippable: false,
    fieldKey: '_career_position',
    showIf: (data) => data.hasCareer,
  },
  {
    id: 'career_duration',
    step: 6,
    message: '근무 기간은 대략 어느 정도인가요?',
    subMessage: 'How long did you work there?',
    inputType: 'choice',
    options: [
      { value: 'less_6m', label: '6개월 미만 (< 6 months)' },
      { value: '6m_1y', label: '6개월~1년 (6m - 1 year)' },
      { value: '1y_2y', label: '1년~2년 (1 - 2 years)' },
      { value: '2y_3y', label: '2년~3년 (2 - 3 years)' },
      { value: '3y_plus', label: '3년 이상 (3+ years)' },
      { value: 'current', label: '현재 재직중 (Currently working)', icon: '🟢' },
    ],
    required: true,
    skippable: false,
    fieldKey: '_career_duration',
    showIf: (data) => data.hasCareer,
  },
  {
    id: 'career_more',
    step: 6,
    message: '다른 경력을 추가하시겠어요?',
    subMessage: 'Would you like to add another work experience?',
    inputType: 'choice',
    options: [
      { value: 'yes', label: '네, 추가 (Yes, add more)', icon: '➕' },
      { value: 'no', label: '아니요, 다음으로 (No, continue)', icon: '➡️' },
    ],
    required: true,
    skippable: false,
    fieldKey: '_career_more',
    showIf: (data) => data.hasCareer,
  },
];

/**
 * Step 6 답변 텍스트 생성 / Generate Step 6 answer display text
 */
export function getStep6AnswerDisplay(fieldKey: string, value: string): string {
  if (fieldKey === '_has_career') {
    return value === 'yes' ? '💼 경력 있음' : '🆕 경력 없음';
  }
  if (fieldKey === '_career_duration') {
    const map: Record<string, string> = {
      less_6m: '6개월 미만',
      '6m_1y': '6개월~1년',
      '1y_2y': '1~2년',
      '2y_3y': '2~3년',
      '3y_plus': '3년 이상',
      current: '🟢 현재 재직중',
    };
    return map[value] ?? value;
  }
  if (fieldKey === '_career_more') {
    return value === 'yes' ? '➕ 경력 추가' : '➡️ 다음으로';
  }
  return value;
}
