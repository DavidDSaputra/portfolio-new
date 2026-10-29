"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import TechText from "./reactbits/TechText";

const TITLE_SELECTOR = ".mn-hero-title";
const LINES = ["David", "Saputra"];
const FONT_WEIGHT = 400;
const LETTER_SPACING = -0.02;

// .mn-tech-line is pulled 5% to the left so TechText's own 5% left margin
// lands flush with the h1 edge; the box therefore ends up 1.05x as wide.
const BOX_WIDTH_FACTOR = 1.05;

function readFontSize(host) {
  const style = window.getComputedStyle(host);
  const fontSize = Number.parseFloat(style.fontSize);
  const width = host.clientWidth * BOX_WIDTH_FACTOR;

  if (!Number.isFinite(fontSize) || fontSize <= 0 || width <= 0) {
    return 0;
  }

  const probe = document.createElement("canvas").getContext("2d");

  if (!probe) {
    return fontSize;
  }

  probe.font = `${FONT_WEIGHT} ${fontSize}px ${style.fontFamily || "serif"}`;
  if ("letterSpacing" in probe) {
    probe.letterSpacing = `${LETTER_SPACING * fontSize}px`;
  }
  probe.textAlign = "left";
  probe.textBaseline = "alphabetic";

  // Keep both lines on the same scale: shrink the pair together instead of
  // letting TechText fit each word independently.
  const fit = LINES.reduce((smallest, text) => {
    const metrics = probe.measureText(text);
    const ink = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    return Math.min(smallest, ink > 0 ? (width * 0.9) / ink : 1);
  }, 1);

  return fontSize * Math.min(1, fit);
}

export default function HeroTechTitle() {
  const [target, setTarget] = useState(null);
  const [fontSize, setFontSize] = useState(0);

  useEffect(() => {
    const host = document.querySelector(TITLE_SELECTOR);

    if (!host) {
      return undefined;
    }

    let mounted = false;

    // Measure first, hide the legacy letters only once a usable size exists —
    // otherwise the h1 would collapse to zero width and never recover.
    const sync = () => {
      const next = readFontSize(host);

      if (!next) {
        return;
      }

      if (!mounted) {
        mounted = true;
        host.classList.add("mn-tech-mounted");
        setTarget(host);
      }

      setFontSize(next);
    };

    sync();

    const observer = new ResizeObserver(sync);
    observer.observe(host);
    if (host.parentElement) {
      observer.observe(host.parentElement);
    }
    window.addEventListener("resize", sync);

    const retry = window.setTimeout(sync, 400);

    if (document.fonts?.ready) {
      document.fonts.ready.then(sync, sync);
    }

    return () => {
      observer.disconnect();
      window.clearTimeout(retry);
      window.removeEventListener("resize", sync);
      if (mounted) {
        host.classList.remove("mn-tech-mounted");
      }
      setTarget(null);
    };
  }, []);

  if (!target || !fontSize) {
    return null;
  }

  return createPortal(
    <div className="mn-tech-title" aria-hidden="true">
      {LINES.map((line) => (
        <div className="mn-tech-line" key={line}>
          <TechText
            text={line}
            fontWeight={FONT_WEIGHT}
            fontSize={fontSize}
            letterSpacing={LETTER_SPACING}
            align="left"
            reveal="letter"
            specks={12}
            intro="none"
            sweep
          />
        </div>
      ))}
    </div>,
    target,
  );
}
