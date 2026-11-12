"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/* Global Lenis smooth scroll. Native scroll position is still driven, so
   Motion's useScroll keeps working. Skipped entirely for reduced motion. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: { offset: -72 },
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
