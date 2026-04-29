/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  transpilePackages: ['@gradios/tailwind-config'],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      // UX: visitar URL Vercel direta cai no /servicos
      { source: '/', destination: '/servicos', permanent: false },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/servicos', destination: '/servicos/index.html' },
        { source: '/servicos/sites', destination: '/servicos/sites/index.html' },
        { source: '/servicos/apps', destination: '/servicos/apps/index.html' },
        { source: '/servicos/sistemas', destination: '/servicos/sistemas/index.html' },
        { source: '/servicos/automacoes', destination: '/servicos/automacoes/index.html' },
        { source: '/servicos/sobre', destination: '/servicos/sobre/index.html' },
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
