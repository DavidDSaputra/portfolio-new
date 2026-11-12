"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { MotionStyle } from "motion/react";
import { cn } from "@/lib/cn";
import { curtainIsOver, curtainRevealTime, useIntroState } from "@/lib/intro";
import type { IntroState } from "@/lib/intro";

/* Pop-in entrance for the hero. Each element stays hidden until the loading
   screen's curtain is opened, then bursts in with a springy overshoot at the
   moment the curtain's edge uncovers it — so the pops chase the curtain from
   the centre of the screen outwards. Without a curtain (repeat visit) the same
   centre-out order plays straight away. */

type PopState = {
  opacity?: number;
  scale?: number;
  x?: number | string;
  y?: number | string;
  rotate?: number;
};

interface PopPreset {
  from: PopState;
  to: PopState;
  /** Lower damping = bouncier. */
  spring: { stiffness: number; damping: number; mass?: number };
  /** CSS transform-origin the element grows from. */
  origin?: string;
  /** Seconds the opacity takes; short, so the pop reads as a burst, not a fade. */
  fade?: number;
}

export type PopKind =
  | "letter"
  | "monitor"
  | "sticker"
  | "spark"
  | "chip"
  | "button"
  | "kicker"
  | "text"
  | "soft"
  | "band"
  | "glow";

const POPS: Record<PopKind, PopPreset> = {
  /* Headline letters: popcorn, growing up from the baseline. */
  letter: {
    from: { opacity: 0, scale: 0, y: "16%" },
    to: { opacity: 1, scale: 1, y: "0%", rotate: 0 },
    spring: { stiffness: 520, damping: 20, mass: 0.9 },
    origin: "50% 78%",
  },
  /* The 3D monitor: the biggest, bounciest one. */
  monitor: {
    from: { opacity: 0, scale: 0.3, y: "10%", rotate: -16 },
    to: { opacity: 1, scale: 1, y: "0%", rotate: 0 },
    spring: { stiffness: 240, damping: 13 },
  },
  /* Polaroids: thrown out from behind the monitor (offsets passed per spot). */
  sticker: {
    from: { opacity: 0, scale: 0 },
    to: { opacity: 1, scale: 1, x: "0%", y: "0%", rotate: 0 },
    spring: { stiffness: 300, damping: 15 },
  },
  spark: {
    from: { opacity: 0, scale: 0, rotate: -120 },
    to: { opacity: 1, scale: 1, rotate: 0 },
    spring: { stiffness: 380, damping: 13 },
  },
  chip: {
    from: { opacity: 0, scale: 0 },
    to: { opacity: 1, scale: 1 },
    spring: { stiffness: 500, damping: 19 },
  },
  button: {
    from: { opacity: 0, scale: 0 },
    to: { opacity: 1, scale: 1 },
    spring: { stiffness: 460, damping: 19 },
  },
  kicker: {
    from: { opacity: 0, scale: 0.5, x: -14 },
    to: { opacity: 1, scale: 1, x: 0 },
    spring: { stiffness: 420, damping: 21 },
    origin: "0% 50%",
  },
  /* Body copy: a gentler pop, so a paragraph does not wobble. */
  text: {
    from: { opacity: 0, scale: 0.9, y: 18 },
    to: { opacity: 1, scale: 1, y: 0 },
    spring: { stiffness: 300, damping: 22 },
    origin: "0% 0%",
  },
  soft: {
    from: { opacity: 0, y: 14 },
    to: { opacity: 1, y: 0 },
    spring: { stiffness: 300, damping: 26 },
  },
  /* Full-width ticker: springs up from below the fold line. */
  band: {
    from: { opacity: 0, y: "100%" },
    to: { opacity: 1, y: "0%" },
    spring: { stiffness: 210, damping: 21 },
  },
  /* Blurred glows: opacity only — scaling a blur repaints it every frame. */
  glow: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    spring: { stiffness: 200, damping: 30 },
    fade: 0.7,
  },
};

/** Share of an element's width the curtain must have uncovered before it pops. */
const UNCOVER = 0.25;
/** The curtain's edge is effectively off-screen beyond this distance. */
const MAX_DISTANCE = 0.47;
/** Seconds after the edge passes: lets the pop start in full view. */
const CURTAIN_LEAD = 0.02;
/** Without a curtain: start almost at once, in the same order and pace. */
const INSTANT_START = 0.15;
const INSTANT_PACE = 1;
/** Global tempo: below 1 slows every pop down. Stiffness scales by TEMPO²
    and damping by TEMPO, so each pop keeps its bounce, just takes longer. */
const TEMPO = 0.62;
/** Fades are stretched by the same amount. */
const FADE_MIN = 0.28;

/* Seconds until `el` should pop. Works from its layout box (offset*), so the
   hidden, scaled-down transform it currently wears does not skew the result. */
function revealDelay(el: HTMLElement | null, mode: Exclude<IntroState, "pending">) {
  const viewport = document.documentElement.clientWidth || 1;
  let distance = 0.25;

  if (el) {
    let centre = el.offsetWidth / 2;
    for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
      centre += node.offsetLeft;
    }
    distance = Math.abs(centre - viewport / 2) / viewport + (el.offsetWidth / viewport) * UNCOVER;
  }

  const time = curtainRevealTime(Math.min(distance, MAX_DISTANCE));
  return mode === "curtain"
    ? time + CURTAIN_LEAD
    : INSTANT_START + (time - curtainRevealTime(0)) * INSTANT_PACE;
}

/** Seconds to wait before popping, or null while the curtain is still closed.
    `target` is the element whose position decides the timing. */
export function usePopDelay(target: RefObject<HTMLElement | null>, extra = 0): number | null {
  const intro = useIntroState();
  const [delay, setDelay] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (intro === "pending") return;
    const mode = curtainIsOver() ? "instant" : intro;
    setDelay(Math.max(0, revealDelay(target.current, mode) + extra));
  }, [intro, target, extra]);

  return delay;
}

interface PopProps {
  kind: PopKind;
  as?: "div" | "p" | "span" | "li";
  /** Time the pop from this element's position instead of its own, so a
      cluster (monitor + stickers) goes off together. */
  anchor?: RefObject<HTMLElement | null>;
  /** Seconds added to the computed delay. */
  extra?: number;
  /** Overrides merged into the preset's hidden / resting state. */
  from?: PopState;
  to?: PopState;
  className?: string;
  style?: MotionStyle;
  children?: ReactNode;
  "aria-hidden"?: boolean | "true" | "false";
}

export function Pop({
  kind,
  as = "div",
  anchor,
  extra = 0,
  from,
  to,
  className,
  style,
  children,
  ...rest
}: PopProps) {
  const self = useRef<HTMLElement | null>(null);
  const delay = usePopDelay(anchor ?? self, extra);
  const reduced = useReducedMotion() ?? false;

  const preset = POPS[kind];
  const hidden = { ...preset.from, ...from };
  const shown = { ...preset.to, ...to };
  const at = delay ?? 0;
  // One implementation for every tag; the props used here are common to all.
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      {...rest}
      ref={(node: HTMLElement | null) => {
        self.current = node;
      }}
      // .hero-pop is forced visible for visitors without JavaScript (layout.tsx).
      className={cn("hero-pop", className)}
      style={preset.origin ? { transformOrigin: preset.origin, ...style } : style}
      initial={hidden}
      animate={delay === null ? hidden : shown}
      transition={
        reduced
          ? { duration: 0 }
          : {
              type: "spring",
              ...preset.spring,
              stiffness: preset.spring.stiffness * TEMPO * TEMPO,
              damping: preset.spring.damping * TEMPO,
              delay: at,
              opacity: {
                duration: Math.max(FADE_MIN, (preset.fade ?? 0.16) / TEMPO),
                delay: at,
                ease: "easeOut",
              },
            }
      }
    >
      {children}
    </Tag>
  );
}
