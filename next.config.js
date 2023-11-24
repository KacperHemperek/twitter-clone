/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/', destination: '/feed/main', permanent: true }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'twitter.kacperhemperek.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

module.exports = nextConfig;
