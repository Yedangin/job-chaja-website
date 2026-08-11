import Header from '@/components/header';
import Footer from '@/components/footer';
import { PublicBoardDetail } from '@/features/board/components/public-board-detail';

export default async function BoardPostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <PublicBoardDetail postId={Number(id)} />
      <Footer />
    </div>
  );
}

