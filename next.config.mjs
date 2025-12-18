/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
    ],
    // Fallback para compatibilidade
    domains: ['cdn.shopify.com'],
  },
};

export default nextConfig;
