import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://project-europa.work';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/mypage', '/upload', '/reset-password'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
