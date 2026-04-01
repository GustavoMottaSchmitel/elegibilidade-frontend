/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api-elegibilidade.duckdns.org/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
