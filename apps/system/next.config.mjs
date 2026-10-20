/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@ui/primitives', '@backend/convex', '@core/domain'],
};

export default nextConfig;

