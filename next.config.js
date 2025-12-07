/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'standalone' output for dev mode - it's only needed for production
  // output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig

