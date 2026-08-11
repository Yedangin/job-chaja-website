'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CanonicalInfoBoardDetail } from './canonical-info-board-detail';

export function PublicBoardDetail({ postId }: { postId: number }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname.startsWith('/board/posts/')) {
      router.replace(`/notice/${postId}`);
    }
  }, [pathname, postId, router]);

  return (
    <>
      <link rel="canonical" href={`/notice/${postId}`} />
      <CanonicalInfoBoardDetail
        access="public"
        postId={postId}
        basePath="/notice"
        requiredCategory="ANNOUNCEMENTS"
      />
    </>
  );
}
