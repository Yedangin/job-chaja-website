import RoleGuard from '@/components/guards/role-guard';
import AdminLayout from '@/components/layouts/admin-layout';

/**
 * 어드민 라우트 레이아웃 / Admin route layout
 * ADMIN 역할만 접근 가능 / Only ADMIN role can access
 */
export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <AdminLayout>{children}</AdminLayout>
    </RoleGuard>
  );
}
