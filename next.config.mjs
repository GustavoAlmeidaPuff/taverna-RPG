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
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Garantir que Firebase não seja incluído no bundle do servidor
      config.externals = config.externals || [];
      config.externals.push({
        'firebase/app': 'commonjs firebase/app',
        'firebase/auth': 'commonjs firebase/auth',
        'firebase/firestore': 'commonjs firebase/firestore',
        'firebase/analytics': 'commonjs firebase/analytics',
      });
    }
    return config;
  },
};

export default nextConfig;
