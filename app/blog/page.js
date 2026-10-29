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
        "/js/preloader.js",
        "/main.js",
        "/js/mobile-menu.js",
        "/js/glass-nav.js",
        "https://unpkg.com/aos@next/dist/aos.js",
        "/js/lenis.min.js",
        "/js/smooth-scroll.js",
        "/blog-content.js",
        "/js/blog-page.js",
      ]}
    />
  );
}
