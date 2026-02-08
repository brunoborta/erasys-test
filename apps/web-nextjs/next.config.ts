import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.hunqz.com',
        pathname: '/img/usr/**',
      },
    ],
  },
};

export default nextConfig;
