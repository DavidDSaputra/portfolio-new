"use client";

import type { ReactNode } from "react";
import { useRef, useSyncExternalStore } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServer() {
  return false;
}

/* Hydration-safe reduced-motion flag. Motion's own hook reads matchMedia during
   the hydration render, so reduced-motion visitors got a different tree than the
   static HTML. This one reports false while hydrating (matching the export) and
   switches right after; the plain element then remounts without the inline
   opacity/transform styles the server emitted. */
function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getReducedMotionServer);
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds. Use index * 0.08 for a stagger. */
  delay?: number;
  /** Slide distance in px. */
  y?: number;
  as?: "div" | "li" | "span" | "p";
}

/* Fade + slide block reveal, once, when scrolled into view. */
export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

interface RevealTitleProps {
  /** One entry per visual line. */
  lines: readonly ReactNode[];
  className?: string;
  lineClassName?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  /** Animate on mount instead of on scroll (hero). */
  immediate?: boolean;
}

/* Line-mask reveal for big headings: each line slides up out of a clip. */
export function RevealTitle({
  lines,
  className,
  lineClassName,
  as: Tag = "h2",
  delay = 0,
  immediate = false,
}: RevealTitleProps) {
  const reduced = useReducedMotion();
  /* Observe the heading itself: the moving spans start fully clipped by their
     overflow-hidden line, so they would never report as intersecting. */
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const shown = immediate || inView;

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, index) => (
        <span
          key={index}
          className={cn("-mb-[0.08em] block overflow-hidden pt-[0.06em] pb-[0.08em]", lineClassName)}
        >
          {reduced ? (
            <span className="block">{line}</span>
          ) : (
            <motion.span
              className="block will-change-transform"
              initial={{ y: "110%" }}
              animate={{ y: shown ? 0 : "110%" }}
              transition={{ duration: 1, delay: delay + index * 0.09, ease: EASE }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </Tag>
  );
}
