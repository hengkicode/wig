/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // basePath: '',
  images: {
    unoptimized: true
  },
  assetPrefix: './',
  output: 'export'
};

export default nextConfig;
