/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLintチェックをビルド時にスキップする
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
