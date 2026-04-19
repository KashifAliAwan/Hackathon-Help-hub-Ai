import type { NextConfig } from "next";

const backendUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT || "http://localhost:3080"
    : process.env.NEXT_PUBLIC_BACKEND_URL || "https://helplytics-backend.vercel.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
