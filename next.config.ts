import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbo: {
    resolveAlias: {
      "@/lib": "./lib",
      "@/components": "./components",
      "@/app": "./app",
      "@/src": "./src",
    },
  },
};

export default nextConfig;