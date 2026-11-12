import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: `next build` emits ./out, which Vercel serves as-is.
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    root: currentDir,
  },
};

export default nextConfig;
