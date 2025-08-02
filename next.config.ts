import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Expose environment variables to the client
  env: {
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
    ASSET_PREFIX: process.env.ASSET_PREFIX,
  },

  // Use absolute URLs for assets when deployed
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? process.env.ASSET_PREFIX ||
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : process.env.VERCEL_BRANCH_URL
          ? `https://${process.env.VERCEL_BRANCH_URL}`
          : undefined)
      : undefined,
};

export default nextConfig;
