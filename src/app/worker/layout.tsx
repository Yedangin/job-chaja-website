import RoleGuard from '@/components/guards/role-guard';
import WorkerLayout from '@/components/layouts/worker-layout';

/**
 * 개인회원 라우트 레이아웃 / Worker route layout
 * INDIVIDUAL 역할만 접근 가능
 */
export default function WorkerRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['INDIVIDUAL']}>
      <WorkerLayout>{children}</WorkerLayout>
    </RoleGuard>
  );
}
