'use client';

/**
 * Step 5: DELTA 추가 정보 채팅 / DELTA additional info chat
 * 비자별 추가 필드 — DB 기반으로 동적 생성
 * Additional fields per visa type — dynamically generated from DB
 *
 * 현재는 Mock으로 비자 유형에 따라 추가 질문을 생성합니다.
 * Currently generates additional questions based on visa type using mock data.
 */

import type { ChatQuestion, WizardFormData } from '../types';

/**
 * 비자별 추가 질문 생성 / Generate additional questions by visa type
 * 실제로는 DB에서 동적으로 로드해야 합니다.
 * In production, this should be dynamically loaded from DB.
 */
export function generateDeltaQuestions(visaType: string): ChatQuestion[] {
  const baseQuestions: ChatQuestion[] = [
    {
      id: 'delta_intro',
      step: 5,
      message: `${visaType} 비자에 맞는 추가 정보를 몇 가지 여쭤볼게요.`,
      subMessage: `We need a few more details specific to the ${visaType} visa.`,
      inputType: 'choice',
      options: [
        { value: 'ok', label: '네, 알겠어요 (OK)', icon: '👍' },
      ],
      required: true,
      skippable: false,
      fieldKey: '_delta_intro',
    },
  ];

  // 비자 유형별 추가 질문 / Additional questions per visa type
  switch (visaType) {
    case 'E-9':
      return [
        ...baseQuestions,
        {
          id: 'delta_e9_industry',
          step: 5,
          message: '현재 사업장의 업종은 무엇인가요?',
          subMessage: 'What is the industry of your current workplace?',
          inputType: 'choice',
          options: [
            { value: 'manufacturing', label: '제조업 (Manufacturing)', icon: '🏭' },
            { value: 'construction', label: '건설업 (Construction)', icon: '🏗️' },
            { value: 'agriculture', label: '농축산업 (Agriculture)', icon: '🌾' },
            { value: 'fishery', label: '어업 (Fishery)', icon: '🐟' },
            { value: 'service', label: '서비스업 (Service)', icon: '🏨' },
          ],
          required: false,
          skippable: true,
          skipLabel: '해당 없음 (N/A)',
          fieldKey: 'delta_industry',
        },
        {
          id: 'delta_e9_contract',
          step: 5,
          message: '현재 근로계약 기간이 남아있나요?',
          subMessage: 'Do you have remaining time on your work contract?',
          inputType: 'choice',
          options: [
            { value: 'yes', label: '네, 남아있어요 (Yes)', icon: '✅' },
            { value: 'no', label: '아니요, 만료됨 (No, expired)', icon: '❌' },
            { value: 'changing', label: '사업장 변경 중 (Changing workplace)', icon: '🔄' },
          ],
          required: false,
          skippable: true,
          skipLabel: '모르겠어요 (Not sure)',
          fieldKey: 'delta_contract',
        },
      ];

    case 'E-7':
    case 'E-7-1':
      return [
        ...baseQuestions,
        {
          id: 'delta_e7_specialty',
          step: 5,
          message: '전문 분야(직종 코드)를 알고 계신가요?',
          subMessage: 'Do you know your specialty / occupation code?',
          inputType: 'text',
          placeholder: '예: 소프트웨어 개발 (e.g., Software Development)',
          required: false,
          skippable: true,
          skipLabel: '모르겠어요 (Not sure)',
          fieldKey: 'delta_specialty',
        },
        {
          id: 'delta_e7_salary',
          step: 5,
          message: '현재 또는 최근 연봉은 얼마인가요? (만원 단위)',
          subMessage: 'What is your current/recent annual salary? (in 10,000 KRW)',
          inputType: 'number',
          placeholder: '예: 3000 (= 3,000만원)',
          required: false,
          skippable: true,
          skipLabel: '답하지 않겠습니다 (Prefer not to answer)',
          fieldKey: 'delta_salary',
        },
      ];

    case 'H-2':
    case 'F-4':
      return [
        ...baseQuestions,
        {
          id: 'delta_ethnic_korean',
          step: 5,
          message: '동포 자격 확인 서류가 있으신가요?',
          subMessage: 'Do you have documents proving ethnic Korean status?',
          inputType: 'choice',
          options: [
            { value: 'yes', label: '네, 있어요 (Yes)', icon: '📄' },
            { value: 'no', label: '아니요 (No)', icon: '❌' },
          ],
          required: false,
          skippable: true,
          skipLabel: '나중에 준비 (Prepare later)',
          fieldKey: 'delta_ethnic_doc',
        },
      ];

    default:
      // 기본: 추가 질문 없이 바로 넘어감 / Default: skip to next step
      return [
        {
          id: 'delta_none',
          step: 5,
          message: '추가 정보가 필요 없는 비자 유형이에요. 다음 단계로 넘어갈까요?',
          subMessage: 'No additional info needed for your visa type. Shall we continue?',
          inputType: 'choice',
          options: [
            { value: 'continue', label: '네, 다음으로! (Yes, continue!)', icon: '➡️' },
          ],
          required: true,
          skippable: false,
          fieldKey: '_delta_skip',
        },
      ];
  }
}

/**
 * Step 5 답변 텍스트 생성 / Generate Step 5 answer display text
 */
export function getStep5AnswerDisplay(fieldKey: string, value: string): string {
  if (fieldKey === '_delta_intro' || fieldKey === '_delta_skip') {
    return '확인!';
  }
  return value;
}
