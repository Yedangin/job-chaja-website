import type { Metadata } from 'next';

/**
 * 해외 사용자 랜딩페이지 레이아웃 / International landing page layout
 * 심플 레이아웃: Header + Footer만, 사이드바 없음
 * Simple layout: Header + Footer only, no sidebar (spec 04 §6-2)
 */
export const metadata: Metadata = {
  title: 'Plan Your Journey to Korea — JobChaja Visa Planner',
  description:
    'Find the best visa pathway to work, study, or settle in South Korea. Free visa analysis covering 31 visa types and 2,629 immigration rules.',
  keywords:
    'Korea visa, work in Korea, study in Korea, visa planner, E-7 visa, D-2 visa, Korean immigration',
  openGraph: {
    type: 'website',
    title: 'Plan Your Journey to Korea — Free Visa Assessment',
    description:
      'Analyze 31 Korean visa types to find your best pathway. Free tool by JobChaja.',
    url: 'https://jobchaja.com/international',
    siteName: 'JobChaja',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plan Your Journey to Korea',
    description:
      'Free visa pathway analysis for South Korea.',
  },
  alternates: {
    canonical: 'https://jobchaja.com/international',
    languages: {
      en: 'https://jobchaja.com/international',
      ko: 'https://jobchaja.com/',
    },
  },
};

export default function InternationalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
