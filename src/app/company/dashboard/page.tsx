import { redirect } from 'next/navigation';

/**
 * 기업 대시보드 → 마이페이지로 통합
 * Company dashboard → redirected to mypage
 */
export default function CompanyDashboardPage() {
  redirect('/company/mypage');
}
