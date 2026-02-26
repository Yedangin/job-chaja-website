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
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // 에러 메시지 추출 / Extract error message
    const message = error.response?.data?.message || 'An error occurred';

    // 401: 인증 실패 처리 / 401: Auth failure handling
    if (error.response?.status === 401) {
      const suppressRedirect = (error.config as Record<string, unknown>)?._suppressAuthRedirect;

      // _suppressAuthRedirect가 설정된 경우 아무 것도 하지 않음 (refreshAuth 등 백그라운드 체크)
      // When _suppressAuthRedirect is set, do NOTHING (background checks like refreshAuth)
      // 이전: suppress 여부와 관계없이 항상 localStorage를 삭제하여 다음 요청 인증이 달라짐
      // Previously: always cleared localStorage regardless of suppress flag, causing next request to differ
      if (!suppressRedirect && typeof window !== 'undefined') {
        const isLoginPage = window.location.pathname.startsWith('/login');
        if (!isLoginPage) {
          window.location.href = '/login';
        }
      }
    }

    // 에러 객체에 메시지 추가 / Add message to error object
    return Promise.reject(new Error(message));
  }
);
