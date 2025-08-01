import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pages = [
  {
    label: "Home",
    href: "/",
  },
];

export const ASSET_PREFIX =
  process.env.NODE_ENV === "production"
    ? process.env.ASSET_PREFIX ||
      // VERCEL_PROJECT_PRODUCTION_URL is now available via next.config.ts env
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : // Fallback to branch URL (also available via next.config.ts env)
        process.env.VERCEL_BRANCH_URL
        ? `https://${process.env.VERCEL_BRANCH_URL}`
        : undefined)
    : undefined;
