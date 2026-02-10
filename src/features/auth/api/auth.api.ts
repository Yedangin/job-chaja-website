import { apiClient } from '@/lib/api-client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types/auth.types';

/**
 * 인증 관련 API 호출 함수 모음
 */
export const authApi = {
  /**
   * 로그인
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * 회원가입
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * OTP 발송
   */
  sendOtp: async (email: string): Promise<void> => {
    await apiClient.post('/auth/send-otp', { email });
  },

  /**
   * OTP 검증
   */
  verifyOtp: async (email: string, code: string): Promise<void> => {
    await apiClient.post('/auth/verify-otp', { email, code });
  },

  /**
   * 소셜 로그인 URL
   */
  getKakaoLoginUrl: (): string => '/api/auth/kakao',
  getGoogleLoginUrl: (): string => '/api/auth/google',
};
