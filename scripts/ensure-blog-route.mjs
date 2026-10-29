// Static-export routes ship as out/blog.html, so "/blog/" (trailing slash)
// and directory-index hits 404 on plain file hosts. Mirror the page into
// out/blog/index.html after every build so both URL shapes resolve.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const source = path.join(out, "blog.html");

if (existsSync(source)) {
  mkdirSync(path.join(out, "blog"), { recursive: true });
  copyFileSync(source, path.join(out, "blog", "index.html"));
  console.log("blog route: out/blog/index.html ready");
} else {
  console.log("blog route: out/blog.html missing, skipped");
}
