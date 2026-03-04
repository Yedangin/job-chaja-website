import { CardSkeleton } from '@/components/ui/skeleton';

// 콘텐츠 로딩 스켈레톤 / Content loading skeleton
export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
