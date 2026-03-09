import { ListSkeleton } from '@/components/ui/skeleton';

// 공고/목록 로딩 스켈레톤 / Job listing loading skeleton
export default function Loading() {
  return (
    <div className="p-6">
      <ListSkeleton count={5} />
    </div>
  );
}
