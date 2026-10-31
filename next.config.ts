import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/events",
        destination: "/upcoming-events",
      },
      {
        source: "/events/create",
        destination: "/create-event",
      },
      {
        source: "/my-events",
        destination: "/joined-events",
      },
    ];
  },
};

export default nextConfig;
