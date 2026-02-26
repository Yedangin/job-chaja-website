import axios, { AxiosError } from 'axios';

// Axios 인스턴스 생성 / Create axios instance
// withCredentials: httpOnly 쿠키를 자동 전송 / Auto-send httpOnly cookies
// httpOnly 쿠키가 유일한 인증 수단 — localStorage sessionId는 사용하지 않음
// httpOnly cookie is the ONLY auth mechanism — localStorage sessionId is NOT used
export const apiClient = axios.create({
  baseURL: '/api', // Next.js API routes (프록시를 통해 백엔드로 전달됨 / Proxied to backend)
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ※ 요청 인터셉터 제거됨 / Request interceptor REMOVED
// 이전: localStorage sessionId를 Authorization 헤더로 전송 (하위호환)
// Previously: sent localStorage sessionId as Authorization header (backward compat)
// 문제: httpOnly 쿠키와 localStorage sessionId가 불일치하면 새로고침마다 로그인 상태가 랜덤으로 변함
// Problem: when httpOnly cookie and localStorage sessionId diverge, login state flickers on refresh
// httpOnly 쿠키(withCredentials: true)만으로 인증이 완전히 동작함
// httpOnly cookie (withCredentials: true) handles auth completely on its own

// 응답 인터셉터: 에러 처리 통합 / Response interceptor: unified error handling
// 주의: validateStatus: () => true 사용 시 이 에러 핸들러가 호출되지 않음
// Note: when validateStatus: () => true is used, this error handler is NOT called
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // 에러 메시지 추출 / Extract error message
    const message = error.response?.data?.message || 'An error occurred';

    // 401: 인증 실패 처리 / 401: Auth failure handling
    // window.location.href 리다이렉트 제거: 전체 페이지 네비게이션이 발생하여
    // auth-context의 refreshAuth 완료 전에 로그인 페이지로 튕기는 현상 유발
    // Removed window.location.href redirect: caused full page navigation
    // that redirected to login before auth-context's refreshAuth could complete
    if (error.response?.status === 401) {
      const suppressRedirect = (error.config as Record<string, unknown>)?._suppressAuthRedirect;

      if (!suppressRedirect && typeof window !== 'undefined') {
        // window.location.href 대신 아무 것도 하지 않음 — AuthProvider의 상태로 로그인 여부 판단
        // Do nothing instead of window.location.href — let AuthProvider state determine login status
        // 페이지별 로그인 필요 여부는 RoleGuard나 미들웨어에서 처리
        // Page-level login requirements are handled by RoleGuard or middleware
      }
    }

    // 에러 객체에 메시지 추가 / Add message to error object
    return Promise.reject(new Error(message));
  }
);
