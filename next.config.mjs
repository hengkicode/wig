/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  assetPrefix: './',
  output: 'export'
};

export default nextConfig;
