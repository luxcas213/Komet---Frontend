import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // During production builds, Next.js runs ESLint by default and will
    // fail the build on lint errors. Set this to true to skip ESLint checks
    // during `next build`.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
