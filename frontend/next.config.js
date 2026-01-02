import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // 開発時のパフォーマンス向上
  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'zustand', 'lucide-react'],
  },
  // ビルド最適化
  compress: true,
  poweredByHeader: false,
  // Next.js 16ではTurbopackがデフォルト
  turbopack: {},
};

export default bundleAnalyzer(nextConfig);
