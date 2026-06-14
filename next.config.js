/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['gkvxnxpdwrwaebmpcxej.supabase.co'],
  },
  output: 'standalone',
  distDir: '.next',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
