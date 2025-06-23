import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "(?<subdomain>.*)",
          },
        ],
        destination: "/:path*",
      },
    ];
  },
};

export default nextConfig;
