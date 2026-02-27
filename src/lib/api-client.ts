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

// 응답 인터셉터: SuccessTransformInterceptor 자동 unwrap + 에러 처리 통합
// Response interceptor: auto-unwrap SuccessTransformInterceptor + unified error handling
// 백엔드 SuccessTransformInterceptor가 모든 성공 응답을 {"status":"OK","data":{...}} 로 감싸므로
// 프론트에서 response.data를 읽으면 실제 데이터가 아닌 래핑 객체가 됨 → 자동 언래핑 필수
// Backend SuccessTransformInterceptor wraps ALL success responses as {"status":"OK","data":{...}}
// Without auto-unwrap, response.data returns the wrapper object instead of actual data
// 주의: validateStatus: () => true 사용 시 에러 핸들러가 호출되지 않으므로
// 200이 아닌 응답도 success 핸들러에서 처리됨 → unwrap 조건을 status:"OK"로 한정
// Note: when validateStatus: () => true is used, error handler is NOT called,
// so non-200 responses also go through success handler → limit unwrap to status:"OK"
apiClient.interceptors.response.use(
  (response) => {
    // 백엔드 SuccessTransformInterceptor 자동 언래핑 / Auto-unwrap backend wrapper
    // {"status":"OK","data":{actual_payload}} → response.data = {actual_payload}
    // 에러 응답 (401, 429 등)은 status:"OK"가 아니므로 언래핑하지 않음
    // Error responses (401, 429, etc.) don't have status:"OK" so they're NOT unwrapped
    if (
      response.data &&
      typeof response.data === 'object' &&
      response.data.status === 'OK' &&
      'data' in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
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
