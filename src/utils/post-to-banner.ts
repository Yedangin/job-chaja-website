// Posts를 Banner 형식으로 변환 / Convert posts to banner format
import { CATEGORY_BANNER_COLORS, DEFAULT_CATEGORY_COLOR } from '@/constants/category-colors';

export interface Post {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  viewCount?: number;
}

export interface BannerItem {
  bg: string;
  textColor: string;
  accentBg: string;
  accentText: string;
  tag: string;
  icon: any;
  title: string;
  desc: string;
  cta: string;
  href: string;
  postId: number;
}

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export const convertPostsToBanners = (posts: Post[]): BannerItem[] => {
  return posts.slice(0, 5).map((post) => {
    const colors = CATEGORY_BANNER_COLORS[post.category] || DEFAULT_CATEGORY_COLOR;

    return {
      ...colors,
      title: post.title,
      desc: `${colors.tag} • ${formatDate(post.createdAt)}`,
      cta: '읽기',
      href: `/board/posts${post.id}`,
      postId: post.id,
    };
  });
};
