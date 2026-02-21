'use client';

/**
 * Step 1: 기본 신원 정보 채팅 / Basic identity info chat
 * 이름, 국적, 생년월일, 성별, 연락처, 사진, 주소
 * Name, nationality, birth date, gender, phone, photo, address
 */

import { NATIONALITIES } from '../types';
import type { ChatQuestion } from '../types';

/**
 * Step 1 질문 목록 / Step 1 questions
 */
export const step1Questions: ChatQuestion[] = [
  {
    id: 'first_name',
    step: 1,
    message: '좋아요! 이름을 알려주세요. (여권 영문 이름)',
    subMessage: 'Please enter your first name (as shown on passport, in English).',
    inputType: 'text',
    placeholder: 'First name (e.g., MINH)',
    required: true,
    skippable: false,
    fieldKey: 'firstName',
    validationPattern: '^[A-Za-z\\s-]+$',
    validationMessage: '영문 알파벳만 입력해주세요. (English letters only.)',
  },
  {
    id: 'last_name',
    step: 1,
    message: '성(Last Name)도 알려주세요.',
    subMessage: 'Please enter your last name / family name.',
    inputType: 'text',
    placeholder: 'Last name (e.g., NGUYEN)',
    required: true,
    skippable: false,
    fieldKey: 'lastName',
    validationPattern: '^[A-Za-z\\s-]+$',
    validationMessage: '영문 알파벳만 입력해주세요. (English letters only.)',
  },
  {
    id: 'nationality',
    step: 1,
    message: '국적을 선택해주세요.',
    subMessage: 'Please select your nationality.',
    inputType: 'select',
    options: NATIONALITIES,
    placeholder: '국적 선택 (Select nationality)',
    required: true,
    skippable: false,
    fieldKey: 'nationality',
  },
  {
    id: 'birth_date',
    step: 1,
    message: '생년월일은요?',
    subMessage: 'When is your date of birth?',
    inputType: 'date',
    placeholder: 'YYYY-MM-DD',
    required: true,
    skippable: false,
    fieldKey: 'birthDate',
  },
  {
    id: 'gender',
    step: 1,
    message: '성별을 알려주세요.',
    subMessage: 'What is your gender?',
    inputType: 'choice',
    options: [
      { value: 'male', label: '남성 (Male)', icon: '👨' },
      { value: 'female', label: '여성 (Female)', icon: '👩' },
      { value: 'other', label: '기타 (Other)', icon: '🧑' },
    ],
    required: true,
    skippable: false,
    fieldKey: 'gender',
  },
  {
    id: 'phone',
    step: 1,
    message: '연락처(휴대전화)를 입력해주세요.',
    subMessage: 'Please enter your mobile phone number.',
    inputType: 'phone',
    placeholder: '010-0000-0000',
    required: true,
    skippable: false,
    fieldKey: 'phone',
  },
  {
    id: 'profile_photo',
    step: 1,
    message: '프로필 사진을 등록하시겠어요?',
    subMessage: 'Would you like to upload a profile photo? (Optional)',
    inputType: 'file',
    required: false,
    skippable: true,
    skipLabel: '나중에 할게요 (Later)',
    fieldKey: 'profilePhoto',
  },
  {
    id: 'address',
    step: 1,
    message: '현재 주소를 입력해주세요. (시/도 까지만 괜찮아요)',
    subMessage: 'Please enter your current address. (City/Province is enough)',
    inputType: 'text',
    placeholder: '예: 서울특별시 / Seoul',
    required: false,
    skippable: true,
    skipLabel: '나중에 입력 (Skip for now)',
    fieldKey: 'address',
  },
];

/**
 * Step 1 답변 텍스트 생성 / Generate Step 1 answer display text
 */
export function getStep1AnswerDisplay(fieldKey: string, value: string): string {
  if (fieldKey === 'nationality') {
    const found = NATIONALITIES.find((n) => n.value === value);
    return found ? `${found.icon} ${found.label}` : value;
  }
  if (fieldKey === 'gender') {
    const map: Record<string, string> = {
      male: '👨 남성 (Male)',
      female: '👩 여성 (Female)',
      other: '🧑 기타 (Other)',
    };
    return map[value] ?? value;
  }
  if (fieldKey === 'profilePhoto') {
    return value ? `📷 ${value}` : '나중에';
  }
  return value;
}
