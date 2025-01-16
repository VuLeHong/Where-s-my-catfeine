// next.config.ts

import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['maps.googleapis.com'],
  },
  output: "standalone",
}

export default nextConfig;
