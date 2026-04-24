/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;