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

  // Enable CORS for API routes and assets
  async headers() {
    return [
      {
        // Apply CORS headers to all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
      {
        // Apply CORS headers to static assets
        source:
          "/:path*.(jpg|jpeg|png|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET" },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
