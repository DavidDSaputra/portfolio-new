"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import RotatingText from "./reactbits/RotatingText";

/* Replaces the three static soft-skill pills in the About copy with one
   React Bits RotatingText pill that cycles the same traits (masked slide,
   monochrome highlight block that resizes to fit each trait). The legacy
   <ul class="mn-softskills"> stays in the DOM for the no-JS fallback and the
   standalone legacy pages, hidden once this mounts. */

const SKILLS_SELECTOR = ".mn-softskills";

const TRAITS = ["Clear Communication", "Fast Adaptation", "Team Collaboration"];

export default function AboutRotatingTraits() {
  const [target, setTarget] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const list = document.querySelector(SKILLS_SELECTOR);
    if (!list || !list.parentElement) return undefined;

    list.classList.add("mn-softskills-hidden");
    setTarget(list.parentElement);

    return () => {
      list.classList.remove("mn-softskills-hidden");
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!target) return null;

  return createPortal(
    <div className="mn-softskills-rotate" aria-label="Soft skills">
      <RotatingText
        texts={TRAITS}
        effect="slide"
        direction="up"
        highlight
        highlightColor={dark ? "#f3f3f0" : "#16161a"}
        staggerFrom="last"
        staggerDuration={0.025}
        splitLevelClassName="mn-rt-word-mask"
        rotationInterval={2200}
        mainClassName="mn-softskills-text"
      />
    </div>,
    target,
  );
}
