"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import FigLabel from "@/components/ui/fig-label";
import { cn } from "@/lib/cn";
import { jalur, tintVar, type JalurIcon, type JalurStop } from "@/lib/content";

/* ──────────────────────────────────────────────────────────────────────────
   "Jalur" — a route that draws itself as you scroll.

   Geometry is measured, never guessed: every stop exposes an untransformed
   anchor element (the sticker badge on desktop, a timeline node on mobile).
   The path is built in px through those exact anchors, sampled into a lookup
   table (x, y, length-fraction), and everything else — draw progress, the pen
   head, the per-stop reveal thresholds — is derived from that one table. So
   the line and the stops stay aligned at every width, and re-align on resize.
   ────────────────────────────────────────────────────────────────────────── */

const DESKTOP_QUERY = "(min-width: 768px)";
/** Viewport line (from the top) the pen tip rides on while scrolling. */
const TIP_LINE = "65%";
/** Portion of the path (in length-fraction) over which a stop fades in. */
const REVEAL_WINDOW = 0.06;
/** Vertical-tangent strength of each S segment (0.5 = soft, →1 = loopier). */
const CURVE = 0.68;
const SAMPLES_PER_SEGMENT = 44;

type Animatable = MotionValue<number> | number;

interface Point {
  x: number;
  y: number;
}

interface Table {
  xs: number[];
  ys: number[];
  /** Cumulative length fraction 0 → 1 at each sample. */
  fs: number[];
}

interface Geometry {
  w: number;
  h: number;
  d: string;
  desktop: boolean;
  start: Point;
  table: Table;
  /** Length fraction at which the line reaches each stop anchor. */
  thresholds: number[];
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);
const round = (value: number) => Math.round(value * 10) / 10;

/** Layout-space centre of `el` relative to `root` (ignores CSS transforms). */
function centerWithin(el: HTMLElement, root: HTMLElement): Point | null {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
  }
  return node === root ? { x, y } : null;
}

function cubicAt(p0: number, p1: number, p2: number, p3: number, t: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

function buildGeometry(w: number, h: number, desktop: boolean, start: Point, anchors: Point[]): Geometry {
  const points: Point[] = [start, ...anchors];
  const samples: Point[] = [start];
  let d = `M${round(start.x)} ${round(start.y)}`;

  for (let i = 1; i < points.length; i += 1) {
    const from = points[i - 1];
    const to = points[i];
    if (desktop) {
      /* Vertical tangents at both ends → a smooth S that passes straight
         down through each badge and sweeps sideways in between. */
      const reach = (to.y - from.y) * CURVE;
      const c1y = from.y + reach;
      const c2y = to.y - reach;
      d += ` C${round(from.x)} ${round(c1y)} ${round(to.x)} ${round(c2y)} ${round(to.x)} ${round(to.y)}`;
      for (let step = 1; step <= SAMPLES_PER_SEGMENT; step += 1) {
        const t = step / SAMPLES_PER_SEGMENT;
        samples.push({
          x: cubicAt(from.x, from.x, to.x, to.x, t),
          y: cubicAt(from.y, c1y, c2y, to.y, t),
        });
      }
    } else {
      d += ` L${round(to.x)} ${round(to.y)}`;
      samples.push(to);
    }
  }

  const lengths: number[] = [0];
  for (let i = 1; i < samples.length; i += 1) {
    lengths.push(lengths[i - 1] + Math.hypot(samples[i].x - samples[i - 1].x, samples[i].y - samples[i - 1].y));
  }
  const total = lengths[lengths.length - 1] || 1;
  const table: Table = {
    xs: samples.map((sample) => sample.x),
    ys: samples.map((sample) => sample.y),
    fs: lengths.map((length) => length / total),
  };

  return {
    w,
    h,
    d,
    desktop,
    start,
    table,
    thresholds: anchors.map((anchor) => fractionAtY(table, anchor.y)),
  };
}

/** First index whose value is >= target (values ascending). */
function upperIndex(values: number[], target: number) {
  let lo = 0;
  let hi = values.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (values[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** Length fraction of the path at vertical position `y` (y is monotonic). */
function fractionAtY(table: Table, y: number) {
  const { ys, fs } = table;
  const last = ys.length - 1;
  if (y <= ys[0]) return 0;
  if (y >= ys[last]) return 1;
  const hi = upperIndex(ys, y);
  const lo = Math.max(0, hi - 1);
  const span = ys[hi] - ys[lo];
  const k = span > 0 ? (y - ys[lo]) / span : 0;
  return fs[lo] + (fs[hi] - fs[lo]) * k;
}

function pointAtFraction(table: Table, fraction: number): Point {
  const { xs, ys, fs } = table;
  const f = clamp01(fraction);
  const hi = upperIndex(fs, f);
  const lo = Math.max(0, hi - 1);
  const span = fs[hi] - fs[lo];
  const k = span > 0 ? (f - fs[lo]) / span : 0;
  return { x: xs[lo] + (xs[hi] - xs[lo]) * k, y: ys[lo] + (ys[hi] - ys[lo]) * k };
}

/* ── Icons ──────────────────────────────────────────────────────────────── */

const ICONS: Record<JalurIcon, ReactNode> = {
  code: (
    <>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m13.5 4.5-3 15" />
    </>
  ),
  layout: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 9.5h18" />
      <path d="M9.5 9.5V20" />
    </>
  ),
  brush: (
    <>
      <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
    </>
  ),
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11 3c.65 4.6 2.4 6.35 7 7-4.6.65-6.35 2.4-7 7-.65-4.6-2.4-6.35-7-7 4.6-.65 6.35-2.4 7-7z" />
      <path d="M19 15.5v5" />
      <path d="M16.5 18h5" />
      <path d="M4.5 3.5v3" />
      <path d="M3 5h3" />
    </>
  ),
};

function StopIcon({ icon, className }: { icon: JalurIcon; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {ICONS[icon]}
    </svg>
  );
}

/* ── Statement: words ink in as the paragraph scrolls through ───────────── */

function StatementWord({
  word,
  range,
  progress,
  reduced,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span className="inline-block" style={{ opacity: reduced ? 1 : opacity }}>
      {word}
    </motion.span>
  );
}

function Statement({ id, reduced }: { id: string; reduced: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "end 50%"] });
  const words = jalur.statement.split(" ");

  return (
    <h2
      id={id}
      ref={ref}
      aria-label={jalur.statement}
      className="mt-8 max-w-[22ch] font-sans text-[clamp(1.85rem,4.7vw,4.5rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-ink md:mt-10"
    >
      <span aria-hidden="true" className="flex flex-wrap gap-x-[0.26em] gap-y-[0.04em]">
        {words.map((word, index) => (
          <StatementWord
            key={`${word}-${index}`}
            word={word}
            range={[index / words.length, (index + 1) / words.length]}
            progress={scrollYProgress}
            reduced={reduced}
          />
        ))}
      </span>
    </h2>
  );
}

/* ── Timeline node (mobile only): sits on the line, fills when reached ──── */

function TimelineNode({
  anchorRef,
  fill,
  className,
}: {
  anchorRef: (el: HTMLSpanElement | null) => void;
  fill: Animatable;
  className?: string;
}) {
  return (
    <span
      ref={anchorRef}
      aria-hidden="true"
      className={cn(
        "absolute -left-9 z-10 block size-3.5 rounded-full border-2 border-line bg-bg md:hidden",
        className,
      )}
    >
      <motion.span className="absolute -inset-0.5 block rounded-full bg-accent" style={{ scale: fill }} />
    </span>
  );
}

/* ── One stop on the route ──────────────────────────────────────────────── */

interface StopProps {
  stop: JalurStop;
  index: number;
  total: number;
  progress: MotionValue<number>;
  threshold: number | null;
  reduced: boolean;
  badgeRef: (el: HTMLSpanElement | null) => void;
  nodeRef: (el: HTMLSpanElement | null) => void;
}

function Stop({ stop, index, total, progress, threshold, reduced, badgeRef, nodeRef }: StopProps) {
  const right = index % 2 === 1;
  const side = right ? 1 : -1;
  const tilt = side * (index % 3 === 0 ? 9 : 11);
  const bubbleTilt = -side * (index % 2 === 0 ? 3 : 4);
  const tint = tintVar(stop.tint);

  /* 0 → 1 as the drawn line approaches and then reaches this stop. */
  const reveal = useTransform(progress, (latest) => {
    if (threshold === null) return 0;
    const span = Math.max(0.0001, Math.min(REVEAL_WINDOW, threshold));
    return easeOutCubic(clamp01((latest - threshold + span) / span));
  });
  const scale = useTransform(reveal, [0, 1], [0.85, 1]);
  const rotate = useTransform(reveal, [0, 1], [side * 3, 0]);
  const lift = useTransform(reveal, [0, 1], [36, 0]);

  /* Badge + node pop with a springy overshoot once the line is nearly there. */
  const popTarget = useTransform<number, number>(reveal, (latest) => (latest >= 0.6 ? 1 : 0));
  const pop = useSpring(popTarget, { stiffness: 420, damping: 15, mass: 0.8 });
  const badgeScale = useTransform(pop, (latest) => Math.max(0, latest));
  const badgeRotate = useTransform(pop, [0, 1], [tilt - side * 40, tilt], { clamp: false });

  const bubbleOpacity = useTransform(reveal, [0.45, 1], [0, 1]);
  const bubbleScale = useTransform(pop, [0, 1], [0.9, 1], { clamp: false });
  const bubbleLift = useTransform(reveal, [0.45, 1], [18, 0]);

  const number = String(index + 1).padStart(2, "0");
  const count = String(total).padStart(2, "0");

  return (
    <li className="relative py-10 md:flex md:min-h-[90svh] md:flex-col md:justify-center md:py-[6vh]">
      <TimelineNode anchorRef={nodeRef} fill={reduced ? 1 : badgeScale} className="top-[2.6rem]" />

      <motion.div
        className={cn(
          "jalur-reveal group relative flex origin-left flex-col items-start",
          right && "md:origin-right md:items-end",
        )}
        style={
          reduced
            ? undefined
            : { opacity: reveal, scale, rotate, y: lift }
        }
      >
        <p className="label-mono relative flex items-center gap-2.5 text-ink-soft">
          <span
            aria-hidden="true"
            className="hidden size-2 rounded-full border border-ink/15 md:inline-block"
            style={{ backgroundColor: tint }}
          />
          <span>
            {number} <span aria-hidden="true">/</span> {count}
          </span>
        </p>

        <h3
          aria-label={stop.words.join(" ")}
          className={cn(
            "display relative mt-4 flex flex-wrap items-center gap-x-[0.16em] gap-y-[0.08em] text-[clamp(2.4rem,13vw,4rem)] text-ink md:mt-6 md:text-[clamp(3rem,9vw,8.75rem)]",
            right && "md:justify-end",
          )}
        >
          <span aria-hidden="true" className="relative z-10">
            {stop.words[0]}
          </span>

          {/* Untransformed anchor: the path is built through its centre. */}
          <span
            ref={badgeRef}
            aria-hidden="true"
            className="relative -mx-[0.03em] -my-[0.12em] inline-block size-[0.94em] shrink-0"
          >
            <motion.span
              className="absolute inset-0 block"
              style={reduced ? { rotate: tilt } : { scale: badgeScale, rotate: badgeRotate }}
            >
              <span
                className="absolute -inset-[0.24em] block rounded-full opacity-90 blur-2xl"
                style={{ backgroundColor: tint }}
              />
              <span
                className="relative flex size-full items-center justify-center rounded-[0.22em] border-[0.045em] border-white text-ink shadow-lift transition-transform duration-700 ease-out-expo group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transition-none"
                style={{ backgroundColor: tint }}
              >
                <StopIcon icon={stop.icon} className="size-[52%]" />
              </span>
            </motion.span>
          </span>

          <span aria-hidden="true" className="relative z-10">
            {stop.words[1]}
          </span>
        </h3>

        <motion.p
          className={cn(
            "relative mt-6 max-w-[34ch] rounded-[1.75rem] border border-line bg-card px-6 py-4 font-sans text-[0.95rem] leading-relaxed text-ink shadow-soft md:mt-9 md:px-7 md:py-5 md:text-[1.02rem]",
            right
              ? "origin-top-left md:mr-[clamp(1.5rem,7vw,7rem)] md:origin-top-right"
              : "origin-top-left md:ml-[clamp(1.5rem,7vw,7rem)]",
          )}
          style={
            reduced
              ? { rotate: bubbleTilt }
              : { opacity: bubbleOpacity, scale: bubbleScale, y: bubbleLift, rotate: bubbleTilt }
          }
        >
          {/* Tail pointing back up at the title. */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute -top-[0.45rem] left-9 block size-3.5 rotate-45 rounded-tl-[0.3rem] border-t border-l border-line bg-card",
              right && "md:right-9 md:left-auto",
            )}
          />
          <span className="relative">{stop.bubble}</span>
        </motion.p>
      </motion.div>
    </li>
  );
}

/* ── Final sticker: where the route lands ───────────────────────────────── */

function EndSticker({
  progress,
  ready,
  reduced,
  stickerRef,
  nodeRef,
}: {
  progress: MotionValue<number>;
  ready: boolean;
  reduced: boolean;
  stickerRef: (el: HTMLDivElement | null) => void;
  nodeRef: (el: HTMLSpanElement | null) => void;
}) {
  const popTarget = useTransform<number, number>(progress, (latest) => (ready && latest >= 0.975 ? 1 : 0));
  const pop = useSpring(popTarget, { stiffness: 380, damping: 14, mass: 0.9 });
  const scale = useTransform(pop, (latest) => Math.max(0, latest));
  const rotate = useTransform(pop, [0, 1], [-22, -4], { clamp: false });
  const opacity = useTransform(pop, [0, 0.35], [0, 1]);

  return (
    <div className="relative z-10 pt-10 pb-4 md:flex md:justify-center md:pt-[10vh] md:pb-[6vh]">
      <TimelineNode anchorRef={nodeRef} fill={reduced ? 1 : scale} className="top-[calc(2.5rem+1.35rem)]" />

      {/* Untransformed anchor box: the path ends at its centre. */}
      <div ref={stickerRef} className="relative inline-block max-w-full">
        <motion.p
          className="jalur-reveal display relative inline-flex max-w-full items-center gap-[0.5em] rounded-full border-[3px] border-white bg-accent px-[1.1em] py-[0.62em] text-[clamp(1.35rem,3.6vw,3rem)] text-ink shadow-lift"
          style={reduced ? { rotate: -4 } : { scale, rotate, opacity }}
        >
          <StopIcon icon="sparkles" className="size-[0.9em] shrink-0" />
          <span>{jalur.endNote}</span>
        </motion.p>
      </div>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */

export default function Jalur() {
  const reduced = useReducedMotion() ?? false;
  const stops = jalur.stops;
  const headingId = "jalur-heading";

  const routeRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const badgeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const endStickerRef = useRef<HTMLDivElement | null>(null);
  const endNodeRef = useRef<HTMLSpanElement | null>(null);

  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const geometryRef = useRef<Geometry | null>(null);
  const signatureRef = useRef("");

  /* Progress of the 65%-viewport line through the route box, 0 → 1. */
  const { scrollYProgress } = useScroll({
    target: routeRef,
    offset: [`start ${TIP_LINE}`, `end ${TIP_LINE}`],
  });

  /* Length fraction of the path that should be drawn (tip stays on that line). */
  const draw = useMotionValue(0);
  const spring = useSpring(draw, { stiffness: 240, damping: 36, mass: 0.35 });
  const full = useMotionValue(1);
  const progress = reduced ? full : spring;

  const penX = useMotionValue(0);
  const penY = useMotionValue(0);
  const penOpacity = useTransform(progress, [0, 0.008, 0.975, 0.995], [0, 1, 1, 0]);
  const lineOpacity = useTransform(progress, [0, 0.004], [0, 1]);

  const placePen = useCallback(
    (fraction: number) => {
      const current = geometryRef.current;
      if (!current) return;
      const point = pointAtFraction(current.table, fraction);
      penX.set(point.x);
      penY.set(point.y);
    },
    [penX, penY],
  );

  const measure = useCallback(() => {
    const route = routeRef.current;
    if (!route) return;
    const w = route.offsetWidth;
    const h = route.offsetHeight;
    if (!w || !h) return;

    const desktop = window.matchMedia(DESKTOP_QUERY).matches;
    const sources = desktop ? badgeRefs.current : nodeRefs.current;
    const anchors: Point[] = [];

    for (let i = 0; i < jalur.stops.length; i += 1) {
      const el = sources[i];
      const point = el ? centerWithin(el, route) : null;
      if (!point) return;
      anchors.push(point);
    }
    const endEl = desktop ? endStickerRef.current : endNodeRef.current;
    const end = endEl ? centerWithin(endEl, route) : null;
    if (!end) return;
    anchors.push(end);

    /* The route must only ever travel downwards. */
    for (let i = 1; i < anchors.length; i += 1) {
      if (anchors[i].y <= anchors[i - 1].y) anchors[i] = { x: anchors[i].x, y: anchors[i - 1].y + 1 };
    }

    const start: Point = desktop ? { x: w * 0.56, y: 0 } : { x: anchors[0].x, y: 0 };
    const next = buildGeometry(w, h, desktop, start, anchors);
    const signature = `${w}|${h}|${next.d}`;
    if (signature === signatureRef.current) return;
    signatureRef.current = signature;
    setGeometry(next);
  }, []);

  /* Measure on mount, on any size change, and once webfonts settle
     (the display font changes word widths, which moves the badges). */
  useEffect(() => {
    measure();
    const observer = new ResizeObserver(() => measure());
    if (routeRef.current) observer.observe(routeRef.current);
    if (listRef.current) {
      observer.observe(listRef.current);
      Array.from(listRef.current.children).forEach((child) => observer.observe(child));
    }
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    const fonts = document.fonts;
    let cancelled = false;
    fonts.ready.then(() => {
      if (!cancelled) measure();
    });
    fonts.addEventListener("loadingdone", measure);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      fonts.removeEventListener("loadingdone", measure);
    };
  }, [measure]);

  /* New geometry → re-sync draw progress and the pen head without scrolling. */
  useEffect(() => {
    geometryRef.current = geometry;
    if (!geometry) return;
    draw.set(fractionAtY(geometry.table, scrollYProgress.get() * geometry.h));
    placePen(progress.get());
  }, [geometry, draw, scrollYProgress, progress, placePen]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const current = geometryRef.current;
    if (current) draw.set(fractionAtY(current.table, latest * current.h));
  });

  useMotionValueEvent(progress, "change", placePen);

  const strokeWidth = geometry?.desktop ? 12 : 4;

  return (
    <section
      id="services"
      aria-labelledby={headingId}
      className="relative overflow-x-clip pt-24 pb-20 md:pt-40 md:pb-28"
    >
      {/* Without JS nothing would ever reveal — keep the content readable. */}
      <noscript>
        <style>{".jalur-reveal{opacity:1!important;transform:none!important}"}</style>
      </noscript>

      <div className="shell">
        <FigLabel fig={jalur.fig} label={jalur.figLabel} />
        <Statement id={headingId} reduced={reduced} />

        <div ref={routeRef} className="relative mt-14 pl-9 md:mt-20 md:pl-0">
          {geometry && (
            <svg
              aria-hidden="true"
              focusable="false"
              width={geometry.w}
              height={geometry.h}
              viewBox={`0 0 ${geometry.w} ${geometry.h}`}
              fill="none"
              className="pointer-events-none absolute top-0 left-0 z-0 max-w-none overflow-visible"
            >
              {/* Ghost track: hints the route before it is drawn. */}
              <path
                d={geometry.d}
                stroke="var(--color-line)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={geometry.desktop ? 0.75 : 1}
              />
              {geometry.desktop && (
                <path
                  d={geometry.d}
                  stroke="var(--color-ink)"
                  strokeOpacity={0.2}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray="1 13"
                />
              )}

              {reduced ? (
                <path
                  d={geometry.d}
                  stroke="var(--color-accent)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <motion.path
                  d={geometry.d}
                  stroke="var(--color-accent)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pathLength: progress, opacity: lineOpacity }}
                />
              )}

              {geometry.desktop && (
                <circle
                  cx={geometry.start.x}
                  cy={geometry.start.y}
                  r={9}
                  fill="var(--color-bg)"
                  stroke="var(--color-accent)"
                  strokeWidth={4}
                />
              )}
            </svg>
          )}

          <ol ref={listRef} className="relative z-10">
            {stops.map((stop, index) => (
              <Stop
                key={stop.words.join("-")}
                stop={stop}
                index={index}
                total={stops.length}
                progress={progress}
                threshold={geometry ? geometry.thresholds[index] : null}
                reduced={reduced}
                badgeRef={(el) => {
                  badgeRefs.current[index] = el;
                }}
                nodeRef={(el) => {
                  nodeRefs.current[index] = el;
                }}
              />
            ))}
          </ol>

          <EndSticker
            progress={progress}
            ready={geometry !== null}
            reduced={reduced}
            stickerRef={(el) => {
              endStickerRef.current = el;
            }}
            nodeRef={(el) => {
              endNodeRef.current = el;
            }}
          />

          {/* Pen head riding the tip of the line (motion values only). */}
          {geometry && !reduced && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 z-20"
              style={{ x: penX, y: penY, opacity: penOpacity }}
            >
              <span className="absolute top-0 left-0 block size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-card shadow-soft md:size-7 md:border-[3px]">
                <span className="absolute inset-[22%] block rounded-full bg-accent" />
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
