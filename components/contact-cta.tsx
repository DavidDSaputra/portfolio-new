"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import FigLabel from "@/components/ui/fig-label";
import PillButton, { ArrowIcon } from "@/components/ui/pill-button";
import { Reveal, RevealTitle } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { TINTS, about, contactCta, hero, tintVar } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Scattered stickers ─────────────────────────────────────────────────── */

interface StickerSpec {
  src: string;
  width: number;
  height: number;
  /** Resting tilt in degrees. */
  rotate: number;
  /** Parallax travel in px (each direction). */
  depth: number;
  /** Seconds — offsets the float loop so stickers don't bob in sync. */
  floatDelay: number;
  /** Position + responsive width. */
  className: string;
  frameClassName: string;
}

const stickers: StickerSpec[] = [
  {
    src: hero.stickers[0],
    width: 480,
    height: 270,
    rotate: 7,
    depth: 46,
    floatDelay: 0,
    className:
      "top-5 -right-6 w-[6.25rem] sm:top-8 sm:right-6 sm:w-[clamp(9rem,20vw,17.5rem)] lg:top-[7%] lg:right-[5%]",
    frameClassName: "rounded-xl sm:rounded-2xl",
  },
  {
    src: about.mascots[0].src,
    width: 1024,
    height: 1024,
    rotate: -8,
    depth: 28,
    floatDelay: 1.6,
    className:
      "-right-3 bottom-4 w-[5.75rem] sm:right-[5%] sm:bottom-[7%] sm:w-[clamp(7rem,14.5vw,13rem)]",
    frameClassName: "rounded-2xl sm:rounded-[1.75rem]",
  },
  {
    src: hero.stickers[2],
    width: 480,
    height: 332,
    rotate: -4,
    depth: 72,
    floatDelay: 3.1,
    className: "right-[23%] bottom-[24%] hidden w-[clamp(7rem,12.5vw,11.5rem)] md:block",
    frameClassName: "rounded-2xl",
  },
];

function Sticker({
  spec,
  index,
  progress,
}: {
  spec: StickerSpec;
  index: number;
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const y = useTransform(progress, [0, 1], [spec.depth, -spec.depth]);

  const frame = (
    <div
      className={cn(
        "overflow-hidden border-4 border-card bg-card shadow-lift sm:border-[6px]",
        spec.frameClassName,
      )}
      style={{ rotate: `${spec.rotate}deg` }}
    >
      <img
        src={spec.src}
        alt=""
        width={spec.width}
        height={spec.height}
        loading="lazy"
        decoding="async"
        className="h-auto w-full"
      />
    </div>
  );

  if (reduced) {
    return (
      <div aria-hidden="true" className={cn("pointer-events-none absolute", spec.className)}>
        {frame}
      </div>
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none absolute will-change-transform", spec.className)}
      style={{ y }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 0.9, delay: 0.25 + index * 0.12, ease: EASE }}
      >
        <div className="animate-float" style={{ animationDelay: `-${spec.floatDelay}s` }}>
          {frame}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Magnetic wrapper: the child drifts toward the pointer (mouse only) ─── */

function Magnetic({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 170, damping: 14, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 170, damping: 14, mass: 0.5 });

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.32);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.42);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    /* The padded zone widens the pull area without shifting layout. */
    <div
      className="-m-5 inline-block p-5"
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <motion.div className="inline-block" style={reduced ? undefined : { x: springX, y: springY }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ── Decorative accent strokes ──────────────────────────────────────────── */

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path
        d="M24 3c1.6 11.4 5.6 17.4 21 21-15.4 3.6-19.4 9.6-21 21-1.6-11.4-5.6-17.4-21-21 15.4-3.6 19.4-9.6 21-21Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ── Channel row ────────────────────────────────────────────────────────── */

type Channel = (typeof contactCta.channels)[number];

function ChannelRow({ channel, index }: { channel: Channel; index: number }) {
  const external = /^https?:\/\//.test(channel.href);
  const tint = TINTS[index % TINTS.length];

  return (
    <Reveal as="li" delay={index * 0.07} y={20} className="border-b border-line">
      <a
        href={channel.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(
          "group relative isolate grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 py-5",
          "sm:py-6 md:grid-cols-[3.5rem_11rem_minmax(0,1fr)_auto] md:gap-x-6 md:py-7",
          "rounded-2xl focus-visible:outline-offset-4",
        )}
      >
        {/* Tinted wash that fades in behind the row. */}
        <span
          aria-hidden="true"
          className="absolute -inset-x-3 inset-y-1.5 -z-10 scale-[0.985] rounded-2xl opacity-0 transition-[opacity,scale] duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 sm:-inset-x-5"
          style={{ background: tintVar(tint) }}
        />

        <span aria-hidden="true" className="label-mono hidden text-ink-soft md:col-start-1 md:block">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="label-mono col-start-1 text-ink-soft md:col-start-2">{channel.label}</span>

        <span className="col-start-1 row-start-2 min-w-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5 md:col-start-3 md:row-start-1">
          <span
            className={cn(
              "link-sweep max-w-full align-bottom font-medium tracking-tight [overflow-wrap:anywhere]",
              "text-[clamp(1.05rem,4.4vw,2.75rem)] md:text-[clamp(1.25rem,3vw,2.75rem)] leading-[1.15]",
              "group-hover:after:[transform-origin:left] group-hover:after:[transform:scaleX(1)]",
              "group-focus-visible:after:[transform-origin:left] group-focus-visible:after:[transform:scaleX(1)]",
            )}
          >
            {channel.value}
          </span>
        </span>

        {/* Arrow circle: one arrow leaves top-right while another slides in. */}
        <span
          aria-hidden="true"
          className="relative col-start-2 row-span-2 row-start-1 grid size-9 place-items-center overflow-hidden rounded-full border border-ink/15 bg-card text-ink transition-colors duration-500 ease-out-expo group-hover:border-ink group-hover:bg-ink group-hover:text-bg group-focus-visible:border-ink group-focus-visible:bg-ink group-focus-visible:text-bg md:col-start-4 md:row-span-1 md:size-12"
        >
          <ArrowIcon className="size-[42%] -rotate-45 transition-transform duration-500 ease-out-expo group-hover:translate-x-[170%] group-hover:-translate-y-[170%] group-focus-visible:translate-x-[170%] group-focus-visible:-translate-y-[170%]" />
          <ArrowIcon className="absolute size-[42%] -translate-x-[170%] translate-y-[170%] -rotate-45 transition-transform duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0" />
        </span>
      </a>
    </Reveal>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */

export default function ContactCta() {
  const panelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      id="contact"
      aria-label={contactCta.figLabel}
      className="shell pt-[clamp(4rem,10vw,9rem)] pb-[clamp(3.5rem,8vw,7rem)]"
    >
      <div
        ref={panelRef}
        className="relative isolate overflow-hidden rounded-[2rem] border border-card/70 bg-linear-to-br from-peach via-pink to-butter shadow-soft sm:rounded-[2.5rem] lg:rounded-[3rem]"
      >
        {/* Soft colour pools + accent strokes (decor, clipped by the panel). */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-[20%] -left-[10%] aspect-square w-[55%] rounded-full bg-butter opacity-70 blur-3xl" />
          <div className="absolute -right-[12%] -bottom-[30%] aspect-square w-[60%] rounded-full bg-lilac opacity-60 blur-3xl" />
          <svg
            viewBox="0 0 400 400"
            fill="none"
            className="absolute -bottom-[38%] -left-[12%] w-[min(70%,34rem)] text-accent opacity-50"
          >
            <circle cx="200" cy="200" r="198" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 9" />
          </svg>
          <Sparkle className="absolute top-[13%] left-[46%] hidden w-7 text-card sm:block lg:w-10" />
          <Sparkle className="absolute top-[31%] right-[7%] hidden w-5 text-accent md:block" />
        </div>

        {stickers.map((spec, index) => (
          <Sticker key={spec.src} spec={spec} index={index} progress={scrollYProgress} />
        ))}

        <div className="relative z-10 flex min-h-[clamp(29rem,58vw,46rem)] flex-col px-4 pt-6 pb-28 sm:px-10 sm:pt-10 sm:pb-12 lg:px-14 lg:pt-14 lg:pb-14">
          <Reveal>
            <FigLabel fig={contactCta.fig} label={contactCta.figLabel} className="text-ink" />
          </Reveal>

          <div className="mt-auto pt-20 sm:pt-24">
            <Reveal delay={0.05}>
              <p className="mb-3 flex items-center gap-3 text-base font-medium text-ink sm:mb-5 sm:text-xl">
                <span aria-hidden="true" className="h-px w-8 bg-ink/40 sm:w-12" />
                {contactCta.kicker}
              </p>
            </Reveal>

            <RevealTitle
              lines={contactCta.headingLines}
              className="display text-[clamp(2.25rem,10.5vw,11rem)] text-ink"
              delay={0.1}
            />

            <Reveal delay={0.35} className="mt-8 flex flex-col items-start gap-5 sm:mt-12 sm:flex-row sm:items-center sm:gap-7">
              <Magnetic>
                <PillButton href={contactCta.cta.href} size="lg" variant="ink">
                  {contactCta.cta.label}
                </PillButton>
              </Magnetic>

              <p className="inline-flex items-center gap-3 rounded-full border border-card bg-card/70 py-2.5 pr-5 pl-4 text-sm font-medium text-ink shadow-soft backdrop-blur-sm">
                <span aria-hidden="true" className="relative grid size-2.5 place-items-center">
                  <span className="absolute inset-0 rounded-full bg-sage motion-safe:animate-ping" />
                  <span className="relative size-2.5 rounded-full bg-sage-ink" />
                </span>
                {contactCta.availability}
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      <ul className="mt-[clamp(2rem,5vw,4.5rem)] border-t border-line">
        {contactCta.channels.map((channel, index) => (
          <ChannelRow key={channel.label} channel={channel} index={index} />
        ))}
      </ul>
    </section>
  );
}
