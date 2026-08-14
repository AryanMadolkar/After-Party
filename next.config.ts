import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        // Placeholder photography for the marketing site only — see
        // lib/landing/photo-palette.ts. Not used anywhere real user
        // photos are involved.
        protocol: "https",
        hostname: "loremflickr.com",
      },
    ],
  },
};

export default nextConfig;
