import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Required for Docker multi-stage build
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dioixskrrkyfpyqerygu.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.marvel.com",
      },
    ],
  },
};

export default nextConfig;
