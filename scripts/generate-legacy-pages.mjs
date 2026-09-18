import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const legacyDir = path.join(rootDir, "legacy");
const outputFile = path.join(rootDir, "lib", "legacy-pages.generated.js");

const files = ["index.html", "blog.html"];

function rewriteLegacyMarkup(html) {
  return html
    .replace(/href="blog\.html"/g, 'href="/blog"')
    .replace(/href="index\.html"/g, 'href="/"')
    .replace(/href="index\.html#/g, 'href="/#')
    .replace(/href="blog\.html#/g, 'href="/blog#')
    .replace(/src="\.\/src\//g, 'src="/src/')
    .replace(/src="src\//g, 'src="/src/')
    .replace(/href="\.\/src\//g, 'href="/src/')
    .replace(/href="src\//g, 'href="/src/');
}

async function extractPage(filename) {
  const filePath = path.join(legacyDir, filename);
  const fileContents = await readFile(filePath, "utf8");
  const bodyMatch = fileContents.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  const inlineStyleMatch = fileContents.match(/<style>([\s\S]*?)<\/style>/i);
  const classMatch = bodyMatch?.[1]?.match(/class="([^"]+)"/i);

  if (!bodyMatch) {
    throw new Error(`Unable to extract body from ${filename}`);
  }

  return {
    bodyClassName: classMatch?.[1] ?? "",
    bodyHtml: rewriteLegacyMarkup(bodyMatch[2].replace(/<script[\s\S]*?<\/script>/gi, "")),
    inlineStyle: inlineStyleMatch?.[1] ?? "",
  };
}

const pages = {};
for (const file of files) {
  pages[file] = await extractPage(file);
}

const fileContents = `${`export const legacyPages = ${JSON.stringify(pages, null, 2)};

export function getLegacyPage(filename) {
  const page = legacyPages[filename];

  if (!page) {
    throw new Error(\`Unsupported legacy page: \${filename}\`);
  }

  return page;
}
`}`;

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, fileContents, "utf8");

// Standalone legacy pages (static hosting) link the minimalist stylesheet
// directly, so keep root/public mirrors of app/globals.css in sync.
const globalsSource = path.join(rootDir, "app", "globals.css");
await copyFile(globalsSource, path.join(rootDir, "public", "globals.css"));
await copyFile(globalsSource, path.join(rootDir, "globals.css"));

// Static hosting serves the root mirrors while Next serves the public/ copies:
// canonical runtime JS lives in public/, canonical neo base CSS in root style.css.
await copyFile(path.join(rootDir, "public", "main.js"), path.join(rootDir, "main.js"));
await copyFile(
  path.join(rootDir, "public", "blog-content.js"),
  path.join(rootDir, "blog-content.js")
);
await copyFile(path.join(rootDir, "style.css"), path.join(rootDir, "public", "style.css"));
