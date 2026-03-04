import { ProfileSkeleton } from '@/components/ui/skeleton';

// 프로필 로딩 스켈레톤 / Profile loading skeleton
export default function Loading() {
  return (
    <div className="p-6">
      <ProfileSkeleton />
    </div>
  );
}
