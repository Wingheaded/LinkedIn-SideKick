// next.config.mjs (ESM)
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": __dirname, // alias "@" aponta para a raiz do projeto
    };
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
