import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://project-europa.work';
  const currentDate = new Date();

  // 主要公開ページの定義
  const routes = [
    '',
    '/about',
    '/event',
    '/faq',
    '/guide',
    '/info',
    '/search/match',
    '/search/team',
    '/sumdownload/match',
    '/sumdownload/team',
    '/terms-of-service',
    '/privacy-policy',
    '/external-links',
  ];

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' || route.startsWith('/search') ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/search') ? 0.8 : 0.5,
  }));
}
