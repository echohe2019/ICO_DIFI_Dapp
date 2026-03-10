/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@rainbow-me/rainbowkit"],
  webpack: (config, { isServer }) => {
    // Handle module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      "@react-native-async-storage/async-storage": false,
    };

    return config;
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
