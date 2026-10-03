/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/web%20admin',
        destination: '/web-admin',
      },
    ];
  },
};

export default nextConfig;
