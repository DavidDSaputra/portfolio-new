"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import TextLoop from "./reactbits/TextLoop";

/* Roles marquee as the React Bits TextLoop wave ribbon — the demo look:
   bold uppercase roles riding a colored ribbon wave across the strip.
   Portals into the legacy hairline strip (which grows into a tall stage via
   .mn-marquee-loop); the svg keeps its 1200x520 ratio and --mn-loop-crop,
   measured from JS, trims the empty bands above/below the wave so the
   ribbon fills the strip edge to edge. The legacy track stays hidden while
   mounted so the no-JS fallback keeps the old scrolling marquee. */

const MARQUEE_SELECTOR = ".mn-marquee:not(.mn-ticker)";
const ROLES_TEXT =
  "Frontend Developer ✳ Vibe Coder ✳ Prompt Engineer ✳ Web Designer ✳ Problem Solver";
/* Ribbon geometry in viewBox units, used both as TextLoop props and to size
   the strip to the wave's real vertical extent. Small screens get chunkier
   units because the 1200-wide viewBox scales down with the strip width. */
const WIDE = { fontSize: 46, ribbonWidth: 86, curviness: 90, minHeight: 120 };
const COMPACT = { fontSize: 74, ribbonWidth: 150, curviness: 80, minHeight: 96 };
const PAD_VB = 16;
const COMPACT_MAX = 640;

export default function RolesMarqueeLoop() {
  const [target, setTarget] = useState(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const strip = document.querySelector(MARQUEE_SELECTOR);
    if (!strip) return undefined;

    let mounted = false;
    const measure = () => {
      const width = strip.clientWidth;
      const initialHeight = strip.clientHeight;
      if (!width || !initialHeight) return;
      setCompact(width < COMPACT_MAX);
      if (!mounted) {
        mounted = true;
        strip.classList.add("mn-marquee-loop");
        setTarget(strip);
      }
      // Size the strip to the ribbon wave itself: centerline bbox height +
      // ribbon stroke + padding, scaled from viewBox units to pixels, so
      // peaks/troughs never crop at any viewport width.
      const ribbon = strip.querySelector(".text-loop-svg path");
      if (ribbon) {
        try {
          const geo = width < COMPACT_MAX ? COMPACT : WIDE;
          const bbox = ribbon.getBBox();
          const extent = bbox.height + geo.ribbonWidth + PAD_VB;
          strip.style.height = `${Math.max(geo.minHeight, Math.round((extent * width) / 1200))}px`;
        } catch {
          /* getBBox unavailable before first paint: keep fallback height */
        }
      }
      const height = strip.clientHeight;
      // viewBox 1200x520 -> rendered svg height = width * 520/1200.
      const rendered = (width * 520) / 1200;
      strip.style.setProperty(
        "--mn-loop-crop",
        `${Math.max(0, Math.round((rendered - height) / 2))}px`,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    window.addEventListener("resize", measure);
    const retry = window.setTimeout(measure, 400);
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure, measure);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(retry);
      if (mounted) {
        strip.classList.remove("mn-marquee-loop");
        strip.style.removeProperty("--mn-loop-crop");
      }
    };
  }, []);

  if (!target) return null;

  return createPortal(
    <TextLoop
      className="mn-roles-loop"
      text={ROLES_TEXT}
      separator="✳"
      shape="wave"
      ribbon
      uppercase
      pauseOnHover
      fontSize={compact ? COMPACT.fontSize : WIDE.fontSize}
      ribbonWidth={compact ? COMPACT.ribbonWidth : WIDE.ribbonWidth}
      curviness={compact ? COMPACT.curviness : WIDE.curviness}
    />,
    target,
  );
}
