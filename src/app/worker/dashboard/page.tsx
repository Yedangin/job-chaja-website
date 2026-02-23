import { redirect } from 'next/navigation';

/**
 * /worker/dashboard → /worker/mypage 리다이렉트
 * Redirect /worker/dashboard → /worker/mypage (canonical dashboard)
 */
export default function WorkerDashboardRedirect() {
  redirect('/worker/mypage');
}
