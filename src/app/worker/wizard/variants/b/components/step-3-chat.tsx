'use client';

/**
 * Step 3: 한국어 능력 채팅 / Korean language ability chat
 * 시험 종류/급수, 증명서, 자가평가
 * Test type/level, certificate, self-assessment
 */

import { KOREAN_TEST_TYPES } from '../types';
import type { ChatQuestion } from '../types';

/**
 * Step 3 질문 목록 / Step 3 questions
 */
export const step3Questions: ChatQuestion[] = [
  {
    id: 'korean_test_type',
    step: 3,
    message: '한국어 시험을 본 적이 있나요? 있다면 어떤 시험인지 알려주세요.',
    subMessage: 'Have you taken any Korean language test? If so, which one?',
    inputType: 'choice',
    options: KOREAN_TEST_TYPES,
    required: false,
    skippable: true,
    skipLabel: '시험 본 적 없어요 (Never took a test)',
    fieldKey: 'koreanTestType',
  },
  {
    id: 'korean_test_level',
    step: 3,
    message: '몇 급(레벨)인가요?',
    subMessage: 'What level/grade did you achieve?',
    inputType: 'select',
    options: [
      { value: '1', label: '1급 (Level 1)' },
      { value: '2', label: '2급 (Level 2)' },
      { value: '3', label: '3급 (Level 3)' },
      { value: '4', label: '4급 (Level 4)' },
      { value: '5', label: '5급 (Level 5)' },
      { value: '6', label: '6급 (Level 6)' },
    ],
    placeholder: '급수 선택 (Select level)',
    required: false,
    skippable: true,
    skipLabel: '모르겠어요 (Not sure)',
    fieldKey: 'koreanTestLevel',
    showIf: (data) => !!data.koreanTestType && data.koreanTestType !== 'NONE',
  },
  {
    id: 'korean_certificate',
    step: 3,
    message: '한국어 성적증명서가 있으면 업로드해주세요.',
    subMessage: 'Please upload your Korean test certificate if available.',
    inputType: 'file',
    required: false,
    skippable: true,
    skipLabel: '증명서 없음 (No certificate)',
    fieldKey: 'koreanCertificate',
    showIf: (data) => !!data.koreanTestType && data.koreanTestType !== 'NONE',
  },
  {
    id: 'korean_self_assessment',
    step: 3,
    message: '본인이 생각하는 한국어 실력은 어느 정도인가요?',
    subMessage: 'How would you rate your Korean language ability?',
    inputType: 'rating',
    required: true,
    skippable: false,
    fieldKey: 'koreanSelfAssessment',
  },
];

/**
 * Step 3 답변 텍스트 생성 / Generate Step 3 answer display text
 */
export function getStep3AnswerDisplay(fieldKey: string, value: string): string {
  if (fieldKey === 'koreanTestType') {
    const found = KOREAN_TEST_TYPES.find((t) => t.value === value);
    return found ? found.label : value;
  }
  if (fieldKey === 'koreanTestLevel') {
    return `${value}급 (Level ${value})`;
  }
  if (fieldKey === 'koreanCertificate') {
    return value ? `📄 ${value}` : '없음';
  }
  if (fieldKey === 'koreanSelfAssessment') {
    const labels: Record<string, string> = {
      '1': '초급 (Beginner)',
      '2': '기초 (Elementary)',
      '3': '중급 (Intermediate)',
      '4': '중상급 (Upper-Int.)',
      '5': '고급 (Advanced)',
    };
    return `${value}단계 - ${labels[value] ?? ''}`;
  }
  return value;
}
