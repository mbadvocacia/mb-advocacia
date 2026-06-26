import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["mysql2"],
  experimental: {
    staticGenerationRetryCount: 0,
  },
};

export default nextConfig;
