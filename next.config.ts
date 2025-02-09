import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['storage.googleapis.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      };
    }
    return config;
  }
};

export default nextConfig;
