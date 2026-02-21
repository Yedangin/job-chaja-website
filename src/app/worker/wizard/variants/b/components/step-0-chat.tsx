'use client';

/**
 * Step 0: 거주 상태 분기 채팅 / Residence status branching chat
 * 3-way 선택: 장기체류 / 단기체류 / 해외
 * 3-way selection: Long-term / Short-term / Overseas
 */

import type { ChatQuestion } from '../types';

/**
 * Step 0 질문 목록 / Step 0 questions
 */
export const step0Questions: ChatQuestion[] = [
  {
    id: 'welcome',
    step: 0,
    message: '반갑습니다! 잡차자(JobChaJa)에 프로필을 만들어 볼까요? 🎉',
    subMessage: 'Welcome! Shall we create your profile on JobChaJa?',
    inputType: 'choice',
    options: [
      {
        value: 'start',
        label: '시작하기 (Start)',
        icon: '🚀',
      },
    ],
    required: true,
    skippable: false,
    fieldKey: '_welcome',
  },
  {
    id: 'residence_status',
    step: 0,
    message: '먼저, 현재 어디에 계신지 알려주세요.',
    subMessage: 'First, please tell us where you are currently located.',
    inputType: 'choice',
    options: [
      {
        value: 'long_term',
        label: '한국 장기 체류',
        icon: '🇰🇷',
        description: 'Long-term stay in Korea (visa holder)',
      },
      {
        value: 'short_term',
        label: '한국 단기 체류',
        icon: '🇰🇷',
        description: 'Short-term stay in Korea (tourist/transit)',
      },
      {
        value: 'overseas',
        label: '해외 거주',
        icon: '🌍',
        description: 'Living outside Korea',
      },
    ],
    required: true,
    skippable: false,
    fieldKey: 'residenceStatus',
  },
  {
    id: 'residence_confirm',
    step: 0,
    message: '좋아요! 그러면 지금부터 기본 정보를 입력해 볼까요?',
    subMessage: "Great! Let's start filling in your basic information.",
    inputType: 'choice',
    options: [
      {
        value: 'continue',
        label: '네, 계속할게요! (Yes, continue!)',
        icon: '👍',
      },
    ],
    required: true,
    skippable: false,
    fieldKey: '_confirm',
  },
];

/**
 * Step 0 답변 텍스트 생성 / Generate Step 0 answer display text
 */
export function getStep0AnswerDisplay(fieldKey: string, value: string): string {
  if (fieldKey === '_welcome') return '시작하기!';
  if (fieldKey === '_confirm') return '네, 계속할게요!';
  if (fieldKey === 'residenceStatus') {
    const map: Record<string, string> = {
      long_term: '🇰🇷 한국 장기 체류',
      short_term: '🇰🇷 한국 단기 체류',
      overseas: '🌍 해외 거주',
    };
    return map[value] ?? value;
  }
  return value;
}
