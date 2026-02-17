import { z } from 'zod';

/**
 * 채용공고 등록 Zod 스키마
 * Job posting creation validation schemas
 *
 * boardType을 discriminator로 사용하여 Step 2 분기
 * Step 2 branches based on boardType discriminator
 */

// ─── Step 1: 기본정보 / Basic info ───
export const step1Schema = z.object({
  title: z
    .string()
    .min(5, '공고 제목은 최소 5자 이상 입력해주세요.')
    .max(100, '공고 제목은 100자를 초과할 수 없습니다.'),
  jobCategory: z
    .array(z.string())
    .min(1, '모집 직종을 1개 이상 선택해주세요.')
    .max(3, '모집 직종은 최대 3개까지 선택 가능합니다.'),
  boardType: z.enum(['PART_TIME', 'FULL_TIME'], {
    required_error: '고용 형태를 선택해주세요.',
  }),
  employmentSubType: z.string().optional(),
  headcount: z.number().min(0).default(1),
});

// ─── Step 2: 근무조건 (알바) / Work conditions (part-time) ───
export const step2AlbaSchema = z.object({
  address: z
    .string()
    .min(1, '근무지 주소를 입력해주세요.'),
  addressDetail: z.string().optional(),
  workDays: z.array(z.boolean()).length(7),
  workTimeStart: z.string().min(1, '근무 시작 시간을 입력해주세요.'),
  workTimeEnd: z.string().min(1, '근무 종료 시간을 입력해주세요.'),
  salaryType: z.literal('HOURLY'),
  salaryAmount: z
    .string()
    .min(1, '시급을 입력해주세요.')
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 9860;
      },
      { message: '2025년 최저시급(9,860원) 이상으로 입력해주세요.' }
    ),
  salaryMax: z.string().optional(),
});

// ─── Step 2: 근무조건 (정규직) / Work conditions (full-time) ───
export const step2FulltimeSchema = z.object({
  address: z
    .string()
    .min(1, '근무지 주소를 입력해주세요.'),
  addressDetail: z.string().optional(),
  workDays: z.array(z.boolean()).length(7),
  workTimeStart: z.string().min(1, '근무 시작 시간을 입력해주세요.'),
  workTimeEnd: z.string().min(1, '근무 종료 시간을 입력해주세요.'),
  salaryType: z.enum(['MONTHLY', 'ANNUAL']),
  salaryAmount: z
    .string()
    .min(1, '급여를 입력해주세요.')
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
      },
      { message: '급여는 0보다 큰 값을 입력해주세요.' }
    ),
  salaryMax: z.string().optional(),
  experienceLevel: z.enum(['ANY', 'ENTRY', 'EXPERIENCED']),
  educationLevel: z.enum(['ANY', 'HIGH_SCHOOL', 'ASSOCIATE', 'BACHELOR', 'MASTER']),
}).refine(
  (data) => {
    if (data.salaryMax && data.salaryMax.trim() !== '') {
      const min = parseInt(data.salaryAmount);
      const max = parseInt(data.salaryMax);
      return !isNaN(min) && !isNaN(max) && max >= min;
    }
    return true;
  },
  { message: '최대 급여는 최소 급여 이상이어야 합니다.', path: ['salaryMax'] }
);

// ─── Step 3: 상세내용 / Details ───
export const step3Schema = z.object({
  jobDescription: z
    .string()
    .min(30, '업무 내용은 최소 30자 이상 작성해주세요.'),
  requirements: z.string().optional(),
  preferredQualifications: z.string().optional(),
  benefits: z.array(z.string()).optional(),
});

// ─── Step 4: 접수설정 / Application settings ───
export const step4Schema = z.object({
  applicationMethod: z.enum(['PLATFORM', 'EMAIL', 'WEBSITE'], {
    required_error: '접수 방법을 선택해주세요.',
  }),
  applicationStartDate: z.string().min(1, '접수 시작일을 입력해주세요.'),
  applicationEndDate: z.string().optional(),
  externalEmail: z.string().optional(),
  externalUrl: z.string().optional(),
}).refine(
  (data) => {
    if (data.applicationMethod === 'EMAIL') {
      return !!data.externalEmail && data.externalEmail.includes('@');
    }
    return true;
  },
  { message: '유효한 이메일 주소를 입력해주세요.', path: ['externalEmail'] }
).refine(
  (data) => {
    if (data.applicationMethod === 'WEBSITE') {
      return !!data.externalUrl && data.externalUrl.startsWith('http');
    }
    return true;
  },
  { message: '유효한 URL을 입력해주세요. (http:// 또는 https://)', path: ['externalUrl'] }
);

// ─── Step 2 통합 (boardType 기반 분기) / Step 2 union ───
export function getStep2Schema(boardType: 'PART_TIME' | 'FULL_TIME') {
  return boardType === 'PART_TIME' ? step2AlbaSchema : step2FulltimeSchema;
}

// ─── 스텝별 스키마 맵 / Step schema map ───
export function getStepSchema(step: number, boardType: 'PART_TIME' | 'FULL_TIME') {
  switch (step) {
    case 1: return step1Schema;
    case 2: return getStep2Schema(boardType);
    case 3: return step3Schema;
    case 4: return step4Schema;
    default: return null;
  }
}

// ─── 타입 추론 / Type inference ───
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2AlbaFormData = z.infer<typeof step2AlbaSchema>;
export type Step2FulltimeFormData = z.infer<typeof step2FulltimeSchema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
