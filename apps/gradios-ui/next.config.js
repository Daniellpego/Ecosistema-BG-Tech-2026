/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/jarvis/:path*",
        destination: "http://localhost:8001/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
