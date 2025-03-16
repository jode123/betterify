/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
    NEXT_PUBLIC_LASTFM_API_KEY: process.env.NEXT_PUBLIC_LASTFM_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lastfm.freetls.fastly.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.last.fm',
        pathname: '**',
      }
    ],
    deviceSizes: [140, 180, 280, 360, 420, 768], // Optimize for mobile first
  }
}

module.exports = nextConfig