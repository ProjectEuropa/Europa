export const dynamic = 'force-static';
export const revalidate = 0;
export const contentType = 'application/manifest+json';

export default function manifest() {
  return {
    name: 'EUROPA Platform',
    short_name: 'EUROPA',
    description:
      'カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0818',
    theme_color: '#010220',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}
