"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { preloader } from "@/lib/content";

type Phase = "loading" | "ready" | "opening" | "done";

/** Minimum time the count takes, so it reads as a count and not a flash. */
const COUNT_MS = 2200;
/** The count waits at this value until fonts + window load have settled. */
const HOLD_AT = 90;
/** Never hold the visitor longer than this, whatever the network does. */
const MAX_WAIT_MS = 7000;
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const CURTAIN_S = 1.25;

/* Soft vertical folds so the two panels read as fabric, not flat blocks. */
const FOLDS =
  "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.05) 0, rgb(255 255 255 / 0) 2.2rem, rgb(0 0 0 / 0.16) 4.4rem, rgb(255 255 255 / 0.05) 6.6rem)";

/* Loading screen: counts to 100%, waits for a click, then opens like a
   curtain. Rendered in the static HTML so the page never flashes before it;
   the inline script in app/layout.tsx marks repeat visits in the same tab
   session with html[data-intro="skip"], which hides it via CSS (globals.css).
   Scroll is locked by CSS until html[data-intro="done"]. */
export default function Preloader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("loading");
  const [count, setCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Count up; hold at HOLD_AT until the page's assets are in.
  useEffect(() => {
    if (document.documentElement.dataset.intro === "skip") {
      setPhase("done");
      return;
    }

    let loaded = false;
    let cancelled = false;
    const markLoaded = () => {
      loaded = true;
    };
    const windowLoaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
    Promise.all([document.fonts?.ready ?? Promise.resolve(), windowLoaded]).then(markLoaded, markLoaded);
    const cap = window.setTimeout(markLoaded, MAX_WAIT_MS);

    let value = 0;
    let shown = 0;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      if (cancelled) return;
      const dt = Math.min(now - last, 100);
      last = now;
      value = Math.min(loaded ? 100 : HOLD_AT, value + (dt / COUNT_MS) * 100);
      const next = Math.floor(value);
      if (next !== shown) {
        shown = next;
        setCount(next);
      }
      if (value >= 100) {
        setPhase("ready");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(cap);
    };
  }, []);

  const finish = useCallback(() => {
    document.documentElement.dataset.intro = "done";
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      /* private mode: the intro simply shows again next load */
    }
    setPhase("done");
  }, []);

  const open = useCallback(() => {
    setPhase((current) => (current === "ready" ? "opening" : current));
  }, []);

  // Once ready: focus the button, and keep keyboard focus on the screen.
  useEffect(() => {
    if (phase !== "ready") return;
    buttonRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();
        buttonRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  if (phase === "done") return null;

  const opening = phase === "opening";
  const ready = phase === "ready";
  const digits = String(count).padStart(3, "0");
  const fade = { duration: reduced ? 0 : 0.35 };

  return (
    <motion.div
      className="preloader fixed inset-0 z-[200] overflow-hidden text-bg"
      role="dialog"
      aria-modal="true"
      aria-label={preloader.label}
      data-lenis-prevent
      onClick={open}
      style={{ cursor: ready ? "pointer" : "progress", pointerEvents: opening ? "none" : undefined }}
      // Reduced motion: no sliding panels, the whole screen just fades away.
      animate={{ opacity: reduced && opening ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      onAnimationComplete={() => {
        if (reduced && opening) finish();
      }}
    >
      {/* Curtain: two halves that part from the centre. */}
      {(["left", "right"] as const).map((side) => (
        <motion.div
          key={side}
          aria-hidden="true"
          className={`absolute inset-y-0 w-[50.5%] bg-ink will-change-transform ${
            side === "left" ? "left-0" : "right-0"
          }`}
          style={{ backgroundImage: FOLDS }}
          initial={false}
          animate={{ x: opening && !reduced ? (side === "left" ? "-101%" : "101%") : "0%" }}
          transition={{ duration: CURTAIN_S, ease: CURTAIN_EASE, delay: 0.12 }}
          onAnimationComplete={() => {
            if (opening && side === "right") finish();
          }}
        >
          {/* Hem where the two halves meet. */}
          <span
            className={`absolute inset-y-0 w-px bg-bg/25 ${side === "left" ? "right-0" : "left-0"}`}
          />
        </motion.div>
      ))}

      {/* Content sits above the curtain and fades as it opens. */}
      <motion.div
        className="relative flex h-full flex-col justify-between p-[clamp(1.25rem,4vw,3.5rem)]"
        animate={{ opacity: opening ? 0 : 1, scale: opening && !reduced ? 0.96 : 1 }}
        transition={fade}
      >
        <div className="label-mono flex items-center justify-between gap-4 text-bg/70">
          <span>{preloader.label}</span>
          <span aria-hidden="true">{preloader.years}</span>
        </div>

        <div className="flex flex-col items-center text-center">
          <p
            className="display relative text-[clamp(5rem,min(28vw,44svh),22rem)] leading-[0.82] tabular-nums"
            aria-hidden="true"
          >
            <span>{digits}</span>
            <span className="absolute top-[0.1em] left-full ml-[0.06em] text-[0.28em] text-bg/60">%</span>
          </p>
          <p className="sr-only" role="status">
            {ready ? preloader.ready : `${preloader.loading} ${count}%`}
          </p>

          <div className="mt-[clamp(1.5rem,4vw,3rem)] grid h-14 place-items-center">
            {ready || opening ? (
              <motion.button
                ref={buttonRef}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  open();
                }}
                className="group/open inline-flex h-14 items-center gap-3 rounded-full bg-bg pr-2 pl-7 text-base font-semibold text-ink shadow-lift focus-visible:outline-bg"
                initial={reduced ? false : { opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <span>{preloader.ready}</span>
                <span
                  aria-hidden="true"
                  className="grid size-10 place-items-center rounded-full bg-accent text-bg transition-transform duration-500 ease-out-expo group-hover/open:scale-110"
                >
                  {/* two arrows parting, like the curtain */}
                  <svg viewBox="0 0 20 20" fill="none" className="size-[48%]">
                    <path
                      d="M8 5 3 10l5 5M12 5l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </motion.button>
            ) : (
              <p className="label-mono text-bg/70">{preloader.loading}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div
            className="h-px w-full bg-bg/20"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={count}
            aria-label={preloader.loading}
          >
            <div
              className="h-full origin-left bg-bg"
              style={{ transform: `scaleX(${count / 100})`, transition: "transform 120ms linear" }}
            />
          </div>
          <div className="label-mono flex items-center justify-between gap-4 text-bg/70">
            <span>{ready || opening ? preloader.hint : preloader.loading}</span>
            <span aria-hidden="true">{digits} / 100</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
