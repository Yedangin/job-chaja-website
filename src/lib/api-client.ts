import axios, { AxiosError } from 'axios';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: '/api', // Next.js API routes (프록시를 통해 백엔드로 전달됨)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: sessionId 자동 추가
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

// 응답 인터셉터: 에러 처리 통합
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // 에러 메시지 추출
    const message = error.response?.data?.message || 'An error occurred';

    // 401: 인증 실패 - 로그인 페이지가 아닌 경우에만 자동 리다이렉트
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

    // 에러 객체에 메시지 추가
    return Promise.reject(new Error(message));
  }
);
