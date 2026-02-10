import { z } from 'zod';

/**
 * 로그인 폼 검증 스키마
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'errEmailRequired')
    .email('errEmailFormat'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

/**
 * 회원가입 폼 검증 스키마
 */
export const signupSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Name is required'),
  email: z
    .string()
    .email('errEmailFormat'),
  password: z
    .string()
    .min(8, 'pwRulePh')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
      'pwRulePh'
    ),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'errPwMatch',
  path: ['passwordConfirm'],
});

/**
 * 이메일 검증 스키마 (비밀번호 찾기 등)
 */
export const emailSchema = z.object({
  email: z
    .string()
    .email('errEmailFormat'),
});

// 타입 추론
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
