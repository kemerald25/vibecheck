/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: process.env.FARCASTER_MANIFEST_URL || 'https://farcaster.xyz/.well-known/vibecheck-manifest.json',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig

