/**
 * 인증 관련 타입 정의
 */

// 멤버 타입: 구직자 vs 회사
export type MemberType = 'seeker' | 'company';

// 뷰 타입: 로그인 vs 회원가입 vs 비밀번호 찾기
export type ViewType = 'login' | 'signup' | 'forgot-password';

// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 (백엔드가 accessToken 또는 sessionId를 반환할 수 있음)
export interface LoginResponse {
  accessToken?: string;
  sessionId?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: number;
  };
}

// 회원가입 요청
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: 'INDIVIDUAL' | 'CORPORATE'; // ★ 필수: 개인 회원 or 기업 회원
}

// 회원가입 응답
export interface RegisterResponse {
  message: string;
}

// 약관 동의
export interface TermsAgreement {
  term1: boolean; // 서비스 이용약관 (필수)
  term2: boolean; // 개인정보 수집 및 이용 (필수)
  term3: boolean; // 개인정보 국외 이전 (필수)
  term4: boolean; // 마케팅 정보 수신 (선택)
}

// 리뷰 데이터 (좌측 캐러셀)
export interface Review {
  text: string;
  author: string;
  initial: string;
  color: string;
}
