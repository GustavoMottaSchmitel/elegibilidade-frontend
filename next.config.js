/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://authcentral-atasistemas.duckdns.org/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
