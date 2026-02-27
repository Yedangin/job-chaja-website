import { redirect } from 'next/navigation';

/**
 * 상품 구매 페이지 → 결제 내역으로 통합 리다이렉트
 * Product purchase page → redirected to payment history
 * 상품 구매 메뉴 제거됨: 프리미엄은 공고에서 업그레이드, 열람권은 별도 페이지
 * Product purchase menu removed: premium upgrades from job listings, credits have separate page
 */
export default function CompanyPaymentsPage() {
  redirect('/company/payments/history');
}
