/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/wig',
  images: {
    unoptimized: true
  },
  assetPrefix: './',
  output: 'export'
};

export default nextConfig;
