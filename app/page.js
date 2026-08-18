import HomeReactBitsIntegration from "../components/home-reactbits-integration";
import { getLegacyPage } from "../lib/legacy-page";
import LegacyPageShell from "../components/legacy-page-shell";

export const metadata = {
  title: "David Saputra | Portfolio",
  description:
    "David Saputra adalah web developer dan digital visual artist dengan fokus pada desain frontend dan interaksi yang thoughtful.",
};

export default function HomePage() {
  const page = getLegacyPage("index.html");
  const html = page.bodyHtml
    .replace('<div id="preloader"></div>', "")
    .replace('<div class="blob"></div>', '<div class="blob reactbits-hero-host"></div>')
    .replace('<div class="akito-hero-content">', '<div class="akito-hero-content reactbits-hero-copy">')
    .replace(
      '<div class="contact-btn-div" data-aos="fade-up" data-aos-delay="800">',
      '<div class="contact-btn-div reactbits-contact-mounted" data-aos="fade-up" data-aos-delay="800">'
    )
    .replace(
      '<div class="dp" data-aos="fade-up">',
      '<div class="dp reactbits-about-mounted" data-aos="fade-up">'
    )
    .replace(
      '<div class="brew-slider-container">',
      '<div class="brew-slider-container reactbits-projects-mounted">'
    );

  return (
    <>
      <LegacyPageShell
        html={html}
        bodyClassName={page.bodyClassName}
        scripts={[
          "/main.js",
          "/js/mobile-menu.js",
          "https://unpkg.com/aos@next/dist/aos.js",
          "/js/home-page.js",
          "https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js",
        ]}
        moduleScripts={["/chat.js"]}
      />
      <HomeReactBitsIntegration />
    </>
  );
}
