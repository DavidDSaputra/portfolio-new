import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: `next build` emits ./out, which scripts/publish-root.mjs mirrors to the repo root for GitHub Pages.
  output: "export",
  // GitHub Pages: every route becomes a folder with its own index.html.
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    root: currentDir,
  },
};

export default nextConfig;
