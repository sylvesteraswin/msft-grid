import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use absolute URLs for assets when deployed
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? process.env.ASSET_PREFIX ||
        // VERCEL_PROJECT_PRODUCTION_URL is the direct production URL without auth
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : // Fallback to branch URL (also direct)
          process.env.VERCEL_BRANCH_URL
          ? `https://${process.env.VERCEL_BRANCH_URL}`
          : undefined)
      : undefined,
};

export default nextConfig;
