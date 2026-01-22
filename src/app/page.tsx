'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import HeroSlider from '@/components/hero-slider';
import QuickSearch from '@/components/quick-search';
import PremiumJobs from '@/components/premium-jobs';
import RealtimeJobs from '@/components/realtime-jobs';
import CompanyDashboard from '@/components/company-dashboard';
import Loading from './loading';
import Footer from '@/components/footer';

export default function Home() {
  const [isCompanyMode, setIsCompanyMode] = useState(false);
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header
        isCompanyMode={isCompanyMode}
        onToggleMode={() => setIsCompanyMode(!isCompanyMode)}
        onLogoClick={() => setIsCompanyMode(false)}
      />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Seeker View */}
        {!isCompanyMode && (
          <div className="space-y-12 fade-in-up">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <HeroSlider />
              <QuickSearch />
            </section>

            {/* Premium Jobs Section */}
            <PremiumJobs />

            {/* Real-time Jobs Section */}
            <RealtimeJobs />
          </div>
        )}

        {/* Company Dashboard View */}
        {isCompanyMode && (
          <Suspense fallback={<Loading />}>
            <CompanyDashboard />
          </Suspense>
        )}
      </main>
      <Footer />
    </div>
  );
}
