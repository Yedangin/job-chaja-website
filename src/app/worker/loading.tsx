import { CardSkeleton } from '@/components/ui/skeleton';

// 대시보드 로딩 스켈레톤 / Dashboard loading skeleton
export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <CardSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <CardSkeleton />
    </div>
  );
}
