import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    return [
      {
        source: '/cdner-media/:path*',
        destination: 'https://cdner-262908.vercel.app/media/:path*',
      },
    ]
  },
}

export default nextConfig
