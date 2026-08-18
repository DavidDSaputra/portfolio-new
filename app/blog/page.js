import { getLegacyPage } from "../../lib/legacy-page";
import LegacyPageShell from "../../components/legacy-page-shell";

export const metadata = {
  title: "David Saputra | Blog",
  description: "Tutorial seputar Git, GitHub, Laravel, dan web development dari David Saputra.",
};

export default function BlogPage() {
  const page = getLegacyPage("blog.html");

  return (
    <LegacyPageShell
      html={page.bodyHtml}
      inlineStyle={page.inlineStyle}
      scripts={[
        "/main.js",
        "/js/mobile-menu.js",
        "https://unpkg.com/aos@next/dist/aos.js",
        "/blog-content.js",
        "https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js",
        "/js/blog-page.js",
      ]}
    />
  );
}
