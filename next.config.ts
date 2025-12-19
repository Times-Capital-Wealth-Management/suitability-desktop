import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Tauri - generates static HTML/CSS/JS
  output: "export",

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Ensure trailing slashes for proper routing in Tauri
  trailingSlash: true,

  // Disable strict mode for development (optional)
  reactStrictMode: true,

  // Ignore ESLint errors during the build process
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Ignore TypeScript errors during the build process
  typescript: {
    ignoreBuildErrors: true,
  },

  // [!CRITICAL FIX!] Configure Webpack to handle react-pdf in browser mode
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;