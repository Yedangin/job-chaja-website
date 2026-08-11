import type { Metadata } from 'next';
import { CompanyNoticeList } from '@/features/board/components/company-notice-list';

export const metadata: Metadata = {
  title: 'Employer notices | JobChaja',
  alternates: { canonical: '/company/support/notices' },
  robots: { index: false, follow: false },
};

export default function CompanyNoticesPage() {
  return <CompanyNoticeList />;
}
