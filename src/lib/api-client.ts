import axios, { AxiosError } from 'axios';

// Axios 인스턴스 생성 / Create axios instance
// withCredentials: httpOnly 쿠키를 자동 전송 / Auto-send httpOnly cookies
export const apiClient = axios.create({
  baseURL: '/api', // Next.js API routes (프록시를 통해 백엔드로 전달됨 / Proxied to backend)
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: localStorage sessionId fallback (개별 페이지 하위호환)
// Request interceptor: localStorage sessionId fallback (backward compat for pages using direct fetch)
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        config.headers.Authorization = `Bearer ${sessionId}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 에러 처리 통합 / Response interceptor: unified error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // 에러 메시지 추출 / Extract error message
    const message = error.response?.data?.message || 'An error occurred';

    // 401: 인증 실패 - 로그인 페이지가 아닌 경우에만 자동 리다이렉트
    // 401: Auth failure - auto redirect only when not on login page
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const isLoginPage = window.location.pathname.startsWith('/login');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('user');
        if (!isLoginPage) {
          window.location.href = '/login';
        }
      }
    }

    // 에러 객체에 메시지 추가 / Add message to error object
    return Promise.reject(new Error(message));
  }
);
