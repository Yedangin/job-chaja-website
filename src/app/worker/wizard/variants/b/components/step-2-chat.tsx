'use client';

/**
 * Step 2: 비자/체류 정보 채팅 / Visa/residence info chat
 * 비자유형, 세부유형, ARC, 만료일, OCR
 * Visa type, sub-type, ARC number, expiry date, OCR document
 */

import { VISA_TYPES } from '../types';
import type { ChatQuestion, WizardFormData } from '../types';

/**
 * Step 2 질문 목록 / Step 2 questions
 */
export const step2Questions: ChatQuestion[] = [
  {
    id: 'visa_intro',
    step: 2,
    message: '이제 비자 정보를 입력할 차례에요. 정확한 매칭을 위해 중요한 단계입니다!',
    subMessage: "Now it's time for your visa information. This step is crucial for accurate job matching!",
    inputType: 'choice',
    options: [
      { value: 'manual', label: '직접 입력할게요 (Manual entry)', icon: '✏️' },
      { value: 'ocr', label: '외국인등록증 촬영 (Scan ARC)', icon: '📸' },
    ],
    required: true,
    skippable: false,
    fieldKey: '_visaMethod',
  },
  {
    id: 'ocr_upload',
    step: 2,
    message: '외국인등록증(ARC) 앞면 사진을 업로드해주세요. 자동으로 정보를 읽어드릴게요!',
    subMessage: 'Please upload a photo of the front of your Alien Registration Card. We will read the info automatically!',
    inputType: 'file',
    required: false,
    skippable: true,
    skipLabel: '직접 입력 (Enter manually)',
    fieldKey: 'ocrDocument',
    showIf: (data: WizardFormData) => {
      // OCR 선택 시에만 표시 / Only show when OCR is selected
      return (data as WizardFormData & { _visaMethod?: string })._visaMethod === 'ocr';
    },
  },
  {
    id: 'visa_type',
    step: 2,
    message: '어떤 비자를 가지고 계신가요?',
    subMessage: 'What type of visa do you have?',
    inputType: 'select',
    options: VISA_TYPES,
    placeholder: '비자 유형 선택 (Select visa type)',
    required: true,
    skippable: false,
    fieldKey: 'visaType',
  },
  {
    id: 'visa_sub_type',
    step: 2,
    message: '비자 세부 유형이 있다면 입력해주세요.',
    subMessage: 'If your visa has a sub-category, please enter it.',
    inputType: 'text',
    placeholder: '예: E-9-1, F-2-7 등',
    required: false,
    skippable: true,
    skipLabel: '세부 유형 없음 (No sub-type)',
    fieldKey: 'visaSubType',
  },
  {
    id: 'arc_number',
    step: 2,
    message: '외국인등록번호(ARC Number)를 입력해주세요.',
    subMessage: 'Please enter your Alien Registration Card number.',
    inputType: 'text',
    placeholder: '000000-0000000',
    required: true,
    skippable: false,
    fieldKey: 'arcNumber',
    showIf: (data: WizardFormData) => data.residenceStatus !== 'overseas',
  },
  {
    id: 'visa_expiry',
    step: 2,
    message: '비자 만료일은 언제인가요?',
    subMessage: 'When does your visa expire?',
    inputType: 'date',
    required: true,
    skippable: false,
    fieldKey: 'visaExpiry',
    showIf: (data: WizardFormData) => data.residenceStatus !== 'overseas',
  },
];

/**
 * Step 2 답변 텍스트 생성 / Generate Step 2 answer display text
 */
export function getStep2AnswerDisplay(fieldKey: string, value: string): string {
  if (fieldKey === '_visaMethod') {
    return value === 'ocr' ? '📸 외국인등록증 촬영' : '✏️ 직접 입력';
  }
  if (fieldKey === 'visaType') {
    const found = VISA_TYPES.find((v) => v.value === value);
    return found ? `${found.label}` : value;
  }
  if (fieldKey === 'ocrDocument') {
    return value ? `📄 ${value}` : '직접 입력';
  }
  return value;
}
