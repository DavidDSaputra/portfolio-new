import { cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

/* Publish the Next static export (out/) to the repository root so GitHub
   Pages — which serves the root of main directly — ships the React-capable
   build instead of the legacy no-JS page. Without this, every React-driven
   section (ripple background, TextLoop ribbon, folder stage, carousels)
   falls back to legacy markup on the live host. */

const rootDir = process.cwd();
const outDir = path.join(rootDir, "out");

if (!existsSync(path.join(outDir, "index.html"))) {
  throw new Error("out/index.html missing — run `npm run build` first");
}

/* Wipe previously exported trees so stale hashed chunks never linger */
for (const stale of ["_next", "blog", "reactbits-demo"]) {
  rmSync(path.join(rootDir, stale), { recursive: true, force: true });
}
/* Legacy blog mirror would shadow the exported /blog route on Pages */
rmSync(path.join(rootDir, "blog.html"), { force: true });

/* Copy entry by entry so the export merges into the root instead of
   nesting a root/out directory */
for (const entry of readdirSync(outDir)) {
  cpSync(path.join(outDir, entry), path.join(rootDir, entry), {
    recursive: true,
    force: true,
  });
}

console.log("publish:root — out/ mirrored to repository root");
