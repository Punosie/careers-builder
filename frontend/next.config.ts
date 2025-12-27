// next.config.ts (or next.config.mjs/next.config.js)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imyvnolzxzdhytbitdru.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/company-assets/**",
      },
    ],
  },
};

export default nextConfig;
