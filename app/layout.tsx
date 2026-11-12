import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Anton, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import Preloader from "@/components/preloader";
import SmoothScroll from "@/components/ui/smooth-scroll";
import { nav, site } from "@/lib/content";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  icons: { icon: "/src/png/nav-avatar.png" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.siteName,
    title: site.title,
    description: site.ogDescription,
    images: [{ url: site.ogImage, alt: site.ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitter,
    title: site.title,
    description: site.ogDescription,
    images: [site.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF6F0",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${anton.variable} ${bricolage.variable} ${jetbrains.variable}`}>
      <head>
        {/* Before first paint: skip the intro on repeat visits in this tab session. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(sessionStorage.getItem("intro-seen"))document.documentElement.dataset.intro="skip"}catch(e){}',
          }}
        />
        <noscript>
          <style>{".preloader{display:none!important}html{overflow:auto!important}"}</style>
        </noscript>
      </head>
      <body>
        <Preloader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
        >
          {nav.skipLabel}
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
