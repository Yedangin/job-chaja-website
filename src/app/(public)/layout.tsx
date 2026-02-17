import PublicLayout from '@/components/layouts/public-layout';

/**
 * 공개 라우트 그룹 레이아웃 / Public route group layout
 * URL에 영향 없음 (라우트 그룹은 URL 세그먼트에 포함되지 않음)
 * Does not affect URLs (route groups are not included in URL segments)
 */
export default function PublicRouteLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
