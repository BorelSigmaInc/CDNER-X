import type { NextConfig } from 'next'
import path from 'node:path'

const apiInternal = process.env.API_INTERNAL_BASE || 'http://127.0.0.1:8003'

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
      { source: '/api/:path*', destination: `${apiInternal}/api/:path*` },
      { source: '/health', destination: `${apiInternal}/health` },
      { source: '/docs', destination: `${apiInternal}/docs` },
      { source: '/docs/:path*', destination: `${apiInternal}/docs/:path*` },
      { source: '/redoc', destination: `${apiInternal}/redoc` },
      { source: '/openapi.json', destination: `${apiInternal}/openapi.json` },
    ]
  },
}

export default nextConfig
