import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  },

  // Keep client-side nav cache fresh for a short window so that
  // rapid back/forward navigation reuses recently-fetched RSC payloads
  // without re-fetching — instant switches for recently visited pages.
  experimental: {
    staleTimes: {
      dynamic: 10, // 10 s — enough for quick back-and-forth without stale data
      static: 60
    }
  }
};

export default nextConfig;
