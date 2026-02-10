'use client';

import { LoginView } from '@/features/auth/components/login-view';

/**
 * 로그인 페이지
 * 리팩토링 버전: 모든 로직은 features/auth로 분리됨
 */
export default function LoginPage() {
  return <LoginView />;
}
