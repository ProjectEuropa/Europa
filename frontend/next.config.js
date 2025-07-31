import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    // ESLintチェックをビルド時にスキップする（Biomeを使用しているため）
    ignoreDuringBuilds: true,
  },
  // 開発時のパフォーマンス向上
  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'zustand', 'lucide-react'],
  },
  // ビルド最適化
  compress: true,
  poweredByHeader: false,
  // 開発時のHMR最適化
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default bundleAnalyzer(nextConfig);
