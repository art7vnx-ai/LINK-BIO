import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Vercel Blob public store hostname — the leading label is a random
        // per-project store id, hence the wildcard. Lets next/image
        // optimize the uploaded avatar photo like any local asset.
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
