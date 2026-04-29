/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  transpilePackages: ['@gradios/tailwind-config'],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    minimumCacheTTL: 31536000,
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/index.html' },
        { source: '/sites', destination: '/sites/index.html' },
        { source: '/apps', destination: '/apps/index.html' },
        { source: '/sistemas', destination: '/sistemas/index.html' },
        { source: '/automacoes', destination: '/automacoes/index.html' },
        { source: '/servicos', destination: '/index.html' },
        { source: '/servicos/sites', destination: '/sites/index.html' },
        { source: '/servicos/apps', destination: '/apps/index.html' },
        { source: '/servicos/sistemas', destination: '/sistemas/index.html' },
        { source: '/servicos/automacoes', destination: '/automacoes/index.html' },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
