"use client";

import { useEffect, useState } from "react";
import { BackgroundRippleEffect } from "./aceternity/background-ripple-effect";

/* Sitewide background: swaps the three.js cubes grid (too heavy for the
   page) for the DOM-only ripple grid. The fixed layer sits behind the
   rounded .mn-sheet, so the interactive cells live in the margins around
   the sheet — hovering lifts a cell, clicking fires the ripple wave. The
   grid dimensions follow the viewport so the margins stay covered at any
   window size; cell colors come from the theme-aware --cell-* variables. */

const CELL = 56;

export default function SiteRippleBackground() {
  const [size, setSize] = useState({ rows: 6, cols: 10 });

  useEffect(() => {
    const measure = () =>
      setSize({
        rows: Math.max(6, Math.ceil(window.innerHeight / CELL)),
        cols: Math.max(10, Math.ceil(window.innerWidth / CELL)),
      });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="site-ripple-bg" aria-hidden="true">
      <BackgroundRippleEffect rows={size.rows} cols={size.cols} cellSize={CELL} />
    </div>
  );
}
