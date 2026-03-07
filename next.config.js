/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14 不再需要 appDir 配置，默认使用 pages 目录
  transpilePackages: [
    "@vanilla-extract/sprinkles",
    "@rainbow-me/rainbowkit",
    "@reown/appkit",
    "@walletconnect/ethereum-provider",
    "@walletconnect/universal-provider",
  ],
  webpack: (config, { isServer }) => {
    // Handle module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false,
      "@react-native-async-storage/async-storage": false,
    };

    // Fix for ESM/CommonJS compatibility
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });

    // Fix for vanilla-extract and other CommonJS modules
    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    });

    // Handle .mjs files
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    // Fix for @base-org/account import syntax
    config.module.noParse = [
      ...(config.module.noParse || []),
      /@base-org\/account/,
    ];

    return config;
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
