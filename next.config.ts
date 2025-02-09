import type { NextConfig } from "next";
import { webpack } from "next/dist/compiled/webpack/webpack";

const nextConfig: NextConfig = {
  images: {
    domains: ['storage.googleapis.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve("buffer/"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
        os: require.resolve("os-browserify/browser"),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http")
      };
      
      config.plugins.push(
        new webpack.DefinePlugin({
          global: 'globalThis',
        })
      );
    }
    return config;
  }
};

export default nextConfig;
// trigger
