import Header from '@/components/header';
import Footer from '@/components/footer';

/**
 * 공개 페이지 레이아웃 / Public page layout
 * Header + 콘텐츠 + Footer를 일관되게 적용
 * Applies Header + content + Footer consistently
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
