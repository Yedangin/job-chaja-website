import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobchaja.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/company/',
        '/diagnosis/designs/',
        '/job-cards/',
        '/login',
        '/register',
        '/worker/',
        '/*/variants/',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
