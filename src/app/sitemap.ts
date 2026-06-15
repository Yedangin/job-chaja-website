import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobchaja.com';
  const lastModified = new Date();

  return [
    { url: siteUrl, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/alba`, lastModified, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${siteUrl}/fulltime`, lastModified, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${siteUrl}/international`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/recruit-info`, lastModified, changeFrequency: 'daily', priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/terms-and-conditions`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/privacy-policy`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/privacy-request`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/refund-policy`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
  ];
}
