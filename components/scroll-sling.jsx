"use client";

import { useEffect, useState } from "react";
import SlingButton from "./reactbits/SlingButton";

/* Scroll-up indicator built on the React Bits SlingButton slingshot: tap it
   (or pull the pad down past the arm distance and let go) and the page
   launches back to the top with the full band/particle animation. Fixed at
   the bottom-right on every page; colors follow the light/dark theme the
   same way projects-folder.jsx tracks it (html.dark MutationObserver). */

const SHOW_AFTER = 480; // px of scroll before the sling appears

/* Pad/well/band colors per theme; the accent keeps the site's orange so the
   loaded arc + particle burst read as "on brand" in both modes. */
const THEME = {
  light: {
    padColor: "#ffffff",
    iconColor: "#1c1c20",
    accentColor: "#fe6622",
    wellColor: "#26262c",
    bandColor: "#a3a3ad",
  },
  dark: {
    padColor: "#f4f4f2",
    iconColor: "#17171b",
    accentColor: "#fe6622",
    wellColor: "#2e2e36",
    bandColor: "#55555f",
  },
};

function scrollToTop() {
  /* smooth-scroll.js parks its Lenis instance on window.__lenis so the
     glide stays consistent with the rest of the page; native smooth scroll
     is the fallback (and reduced-motion users get an instant jump). */
  const lenis = typeof window !== "undefined" ? window.__lenis : null;
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(0, { duration: 1.2 });
    return;
  }
  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

export default function ScrollSling() {
  const [visible, setVisible] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let ticking = false;
    const check = () => {
      ticking = false;
      const top = window.scrollY || document.documentElement.scrollTop || 0;
      setVisible((shown) => (shown ? top > SHOW_AFTER * 0.6 : top > SHOW_AFTER));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const colors = dark ? THEME.dark : THEME.light;

  return (
    <div className="mn-scroll-sling" data-visible={visible ? "true" : "false"}>
      <SlingButton
        onSend={scrollToTop}
        size={52}
        strokeWidth={3}
        armAt={44}
        maxPull={150}
        launchSpeed={2400}
        flight={110}
        particles={12}
        spread={64}
        axis="vertical"
        tapSends
        ariaLabel="Kembali ke atas"
        {...colors}
      />
    </div>
  );
}
