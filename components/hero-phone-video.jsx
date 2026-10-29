"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* Plays the screen-recording mockup inside the hero phone frame: the portal
   drops a <video> into the phone's transparent viewport and hides the
   scrolling screenshot reel while mounted. object-fit: cover fills the
   screen exactly — no stretching, no letterbox — and the viewport's overflow
   + border radius keep the picture inside the frame (the frame png stays on
   top at z-index 2). Respects reduced motion by pausing to the first frame. */

const VIEWPORT_SELECTOR = ".mn-dev-phone .mn-dev-viewport";

export default function HeroPhoneVideo() {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const viewport = document.querySelector(VIEWPORT_SELECTOR);
    if (!viewport) return undefined;
    viewport.classList.add("mn-dev-viewport-video");
    setTarget(viewport);
    return () => viewport.classList.remove("mn-dev-viewport-video");
  }, []);

  useEffect(() => {
    if (!target) return undefined;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const video = target.querySelector("video.mn-hero-phone-video");
      if (!video) return;
      if (query.matches) video.pause();
      else video.play().catch(() => {});
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [target]);

  if (!target) return null;

  return createPortal(
    <video
      className="mn-hero-phone-video"
      src="src/mp4/hero-phone-mockup.mp4"
      autoPlay
      muted
      loop
      playsInline
      tabIndex={-1}
      aria-hidden="true"
    />,
    target,
  );
}
