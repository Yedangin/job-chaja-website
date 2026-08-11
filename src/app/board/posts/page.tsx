import Header from '@/components/header';
import Footer from '@/components/footer';
import { PublicBoardList } from '@/features/board/components/public-board-list';

export default function BoardPostsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <PublicBoardList />
      <Footer />
    </div>
  );
}
