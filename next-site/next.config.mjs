import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this folder so Next doesn't pick up the
  // sibling Frontity lockfile.
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.taylorchasewhite.com" },
      { protocol: "https", hostname: "taylorchasewhite.com" },
      { protocol: "https", hostname: "secure.gravatar.com" },
      { protocol: "https", hostname: "**.gravatar.com" },
      { protocol: "https", hostname: "**.wp.com" },
    ],
  },
};

export default nextConfig;
