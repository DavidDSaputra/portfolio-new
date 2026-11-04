/* Generates optimized WebP derivatives for every raster in public/src/webp
   and the two heavy brand PNGs, into public/src/opt/:
     <base>.webp    — 900px wide, q72  (quick-look sheet, about portrait)
     <base>-s.webp  — 480px wide, q65  (drift-wall tiles, folder thumbs,
                     hero reel, nav logo, avatar)
   When a base exists as both .png and .jpg the smaller source wins.
   Run: npm run optimize:images */
import { mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public", "src", "opt");
mkdirSync(outDir, { recursive: true });

const SOURCES = ["public/src/webp", "public/src/png"];
const SKIP = /^Gemini_/; /* dead 5.5MB asset, referenced nowhere */
const ONLY_PNG = new Set(["nav-avatar.png", "logo-david.png", "mockup-laptop.png", "mockup-mobile.png"]);

const byBase = new Map();
for (const dir of SOURCES) {
  for (const file of readdirSync(path.join(root, dir))) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue;
    if (dir.endsWith("png") && !ONLY_PNG.has(file)) continue; /* icon logos stay as-is */
    const base = file.replace(/\.(png|jpe?g)$/i, "");
    if (SKIP.test(base)) continue;
    const full = path.join(root, dir, file);
    const size = statSync(full).size;
    const current = byBase.get(base);
    if (!current || size < current.size) byBase.set(base, { full, size });
  }
}

const kb = (n) => `${Math.round(n / 1024)}KB`;
for (const [base, source] of [...byBase].sort()) {
  const fullOut = path.join(outDir, `${base}.webp`);
  const smallOut = path.join(outDir, `${base}-s.webp`);
  await sharp(source.full)
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 72, effort: 4 })
    .toFile(fullOut);
  await sharp(source.full)
    .resize({ width: 480, withoutEnlargement: true })
    .webp({ quality: 65, effort: 4 })
    .toFile(smallOut);
  console.log(
    `${base}: ${kb(source.size)} -> ${kb(statSync(fullOut).size)} / ${kb(statSync(smallOut).size)}`,
  );
}
console.log(`optimize:images — ${byBase.size} bases written to public/src/opt`);
