import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '정보 게시판 | JobChaja',
};

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
