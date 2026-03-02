'use client';

import CompanyAuthGuard from '@/components/guards/company-auth-guard';

/**
 * 결제 관련 페이지 레이아웃: 기업인증 APPROVED만 접근 가능
 * Payment pages layout: only APPROVED companies can access
 */
export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <CompanyAuthGuard requiredAccess="payment">
      {children}
    </CompanyAuthGuard>
  );
}
