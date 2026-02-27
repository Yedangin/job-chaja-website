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
  login: async (data: LoginRequest & { memberType?: string }): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', data);
    // apiClient 응답 인터셉터가 SuccessTransformInterceptor 래핑을 자동 언래핑함
    // apiClient response interceptor auto-unwraps SuccessTransformInterceptor wrapping
    return response.data as LoginResponse;
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
  getKakaoLoginUrl: (userType?: string): string =>
    userType ? `/api/auth/kakao?userType=${userType}` : '/api/auth/kakao',
  getGoogleLoginUrl: (userType?: string): string =>
    userType ? `/api/auth/google?userType=${userType}` : '/api/auth/google',

  /**
   * 프로필 상세 조회
   */
  getProfileDetail: async () => {
    const response = await apiClient.get('/auth/my/profile-detail');
    return response.data;
  },

  /**
   * 비밀번호 변경 (이메일 계정만)
   */
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await apiClient.post('/auth/change-password', { oldPassword, newPassword });
    return response.data;
  },

  /**
   * 회원탈퇴
   */
  deleteAccount: async () => {
    const response = await apiClient.post('/auth/delete-account');
    return response.data;
  },

  /**
   * 알림 설정 조회
   */
  getNotificationSettings: async () => {
    const response = await apiClient.get('/auth/my/notification-settings');
    return response.data;
  },

  /**
   * 알림 설정 변경
   */
  updateNotificationSettings: async (settings: { sms: boolean; email: boolean; kakao: boolean }) => {
    const response = await apiClient.put('/auth/my/notification-settings', settings);
    return response.data;
  },

  /**
   * 고객센터 문의 작성
   */
  createSupportTicket: async (title: string, content: string) => {
    const response = await apiClient.post('/auth/support-ticket', { title, content });
    return response.data;
  },

  /**
   * 내 문의 목록
   */
  getMySupportTickets: async () => {
    const response = await apiClient.get('/auth/my/support-tickets');
    return response.data;
  },

  /**
   * 대시보드 통계 (Profile 모듈)
   */
  getMyDashboardStats: async () => {
    const response = await apiClient.get('/profile/my/dashboard-stats');
    return response.data;
  },

  /**
   * 내 지원 내역
   */
  getMyApplications: async (status?: string, page = 1, limit = 20) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set('status', status);
    const response = await apiClient.get(`/applications/applications/my?${params}`);
    return response.data;
  },

  /**
   * 내 면접 일정 (면접예정 지원건)
   */
  getMyInterviews: async () => {
    const response = await apiClient.get('/applications/applications/my?status=INTERVIEW_SCHEDULED');
    return response.data;
  },

  /**
   * 내 스크랩 목록
   */
  getMyScraps: async (page = 1, limit = 20) => {
    const response = await apiClient.get(`/applications/scraps/my?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * 채용공고 목록 조회
   */
  getJobListings: async (params: Record<string, string>) => {
    const search = new URLSearchParams(params);
    const response = await apiClient.get(`/jobs/listing?${search}`);
    return response.data;
  },

  /**
   * 내 공고 목록 (기업회원)
   */
  getMyJobPostings: async (status?: string, page = 1) => {
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (status) params.set('status', status);
    const response = await apiClient.get(`/jobs/my/list?${params}`);
    return response.data;
  },

  /**
   * 내 주문 내역 (기업회원)
   */
  getMyOrders: async (page = 1) => {
    const response = await apiClient.get(`/payment/orders/my?page=${page}&limit=20`);
    return response.data;
  },

  /**
   * 결제 상품 목록
   */
  getProducts: async (boardType?: string) => {
    const params = boardType ? `?boardType=${boardType}` : '';
    const response = await apiClient.get(`/payment/products${params}`);
    return response.data;
  },
};
