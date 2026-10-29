// Build-time snapshot of the public GitHub contribution graph for the
// Open Source section. The fragment endpoint is not CORS-enabled, so the
// data is fetched here (Node) and served same-origin as public/github-stats.json.
// Never fails the build: on any error the previous snapshot is kept.
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const USER = "DavidDSaputra";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "github-stats.json");

const tipCount = (text) => {
  const m = /(\d+)\s+contribution/.exec(text);
  return m ? Number(m[1]) : 0;
};

async function main() {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, {
    headers: { "user-agent": "portfolio-stats-snapshot" },
  });
  if (!res.ok) { throw new Error(`http ${res.status}`); }
  const html = await res.text();

  const totalMatch = /([\d,]+)\s*contributions?\s*in the last year/i.exec(html);
  const total = totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : 0;

  const days = [];
  for (const m of html.matchAll(/<td\b[^>]*>/g)) {
    const tag = m[0];
    const d = /data-date="(\d{4}-\d{2}-\d{2})"/.exec(tag);
    const l = /data-level="(\d)"/.exec(tag);
    if (d && l) { days.push({ d: d[1], l: Number(l[1]), c: 0 }); }
  }
  if (!days.length) { throw new Error("no days parsed"); }

  // Tool-tips carry the exact per-day counts, in the same order as the cells.
  const tips = [...html.matchAll(/<tool-tip\b[^>]*>([\s\S]*?)<\/tool-tip>/g)].map((m) => tipCount(m[1]));
  days.forEach((day, i) => { day.c = tips[i] || 0; });

  let best = { c: 0, d: days[0].d };
  let streak = 0;
  let run = 0;
  let active = 0;
  let sum = 0;
  for (const day of days) {
    sum += day.c;
    if (day.c > best.c) { best = { c: day.c, d: day.d }; }
    if (day.c > 0) {
      active += 1;
      run += 1;
      if (run > streak) { streak = run; }
    } else {
      run = 0;
    }
  }

  const data = {
    user: USER,
    fetchedAt: new Date().toISOString(),
    total: total || sum,
    best,
    streak,
    active,
    span: days.length,
    days,
  };
  writeFileSync(OUT, JSON.stringify(data));
  console.log(`github-stats: ${data.total} contributions, ${days.length} days, streak ${streak}`);
}

main().catch((err) => {
  console.log(`github-stats: skipped (${err.message}); keeping previous snapshot`);
  if (!existsSync(OUT)) { writeFileSync(OUT, JSON.stringify({ user: USER, days: [] })); }
});
