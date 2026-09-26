import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Djougourian build only: serve its favicon at the conventional /favicon.ico path.
  ...(process.env.CLIENT_ID === "djougourian-law"
    ? {
        async rewrites() {
          return [{ source: "/favicon.ico", destination: "/favicon-djougourian.ico" }];
        },
      }
    : {}),
};

export default nextConfig;
