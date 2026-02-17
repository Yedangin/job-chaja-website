import RoleGuard from '@/components/guards/role-guard';
import CompanyLayout from '@/components/layouts/company-layout';

/**
 * 기업회원 라우트 레이아웃 / Company route layout
 * CORPORATE 역할만 접근 가능
 */
export default function CompanyRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['CORPORATE']}>
      <CompanyLayout>{children}</CompanyLayout>
    </RoleGuard>
  );
}
