import { getLegacyPage } from "../lib/legacy-page";
import LegacyPageShell from "../components/legacy-page-shell";

export const metadata = {
  title: "David Saputra | Frontend Developer, Vibe Coder & Prompt Engineer",
  description:
    "David Saputra adalah frontend developer, vibe coder, dan prompt engineer dari Tangerang, Indonesia. Membangun pengalaman web yang bersih, jelas, dan purposeful — dari company profile hingga sistem internal.",
  openGraph: {
    type: "website",
    url: "https://davidsaputra.my.id/",
    title: "David Saputra | Frontend Developer, Vibe Coder & Prompt Engineer",
    description:
      "Clean, purposeful web experiences — company profiles, product sites and internal systems. Based in Tangerang, Indonesia.",
    images: [
      {
        url: "https://davidsaputra.my.id/src/png/nav-avatar.png",
        alt: "David Saputra portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@David_Saputra07",
    title: "David Saputra | Frontend Developer, Vibe Coder & Prompt Engineer",
    description:
      "Clean, purposeful web experiences — company profiles, product sites and internal systems. Based in Tangerang, Indonesia.",
    images: ["https://davidsaputra.my.id/src/png/nav-avatar.png"],
  },
};

export default function HomePage() {
  const page = getLegacyPage("index.html");

  return (
    <LegacyPageShell
      html={page.bodyHtml}
      bodyClassName={page.bodyClassName}
      scripts={[
        "/main.js",
        "/js/mobile-menu.js",
        "https://unpkg.com/aos@next/dist/aos.js",
        "/js/home-page.js",
      ]}
      moduleScripts={["/chat.js"]}
    />
  );
}
