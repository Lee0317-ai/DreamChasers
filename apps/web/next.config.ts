import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(process.env.STANDALONE_BUILD === "1" ? { output: "standalone" as const } : {}),
  turbopack: {
    root: path.resolve(__dirname, "../..")
  }
};

export default nextConfig;
