import type { NextConfig } from "next";
import { ASSET_PREFIX } from "./lib/utils";

const nextConfig: NextConfig = {
  // Use absolute URLs for assets when deployed
  assetPrefix: ASSET_PREFIX,
};

export default nextConfig;
