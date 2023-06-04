/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/', destination: '/feed/main', permanent: true }];
  },
};

module.exports = nextConfig;
