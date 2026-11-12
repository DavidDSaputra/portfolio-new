"use client";

import { useRef } from "react";
import type { CSSProperties, RefObject } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import LocalTime from "@/components/ui/local-time";
import Marquee from "@/components/ui/marquee";
import PillButton, { ArrowIcon } from "@/components/ui/pill-button";
import { Pop } from "@/components/ui/pop";
import { cn } from "@/lib/cn";
import { TINTS, hero, roles, tintVar } from "@/lib/content";

/* Giant name: scales with width, but backs off on short viewports so the
   whole hero (and a peek of the marquee) stays near the fold. */
const HEADLINE_SIZE = "text-[length:clamp(4.5rem,min(19vw,25svh),19rem)]";
const MARQUEE_SIZE = "text-[length:clamp(2rem,6vw,5rem)]";

/* Where the monitor "sticker" sits from md up: pinned to the right edge of the
   headline block, overlapping the end of the name. */
const DESKTOP_SPOT =
  "md:absolute md:right-0 md:top-1/2 md:w-[clamp(17rem,36vw,31rem)] md:-translate-y-[46%]";

/* Scattered polaroids around the monitor (percentages of the visual square).
   `burst` is where each one starts its pop: tucked behind the monitor, so
   they fly out of it. */
const STICKER_SPOTS = [
  {
    position: "-left-[12%] top-[5%] w-[40%]",
    rotate: -9,
    spin: -5,
    drift: -70,
    burst: { x: "55%", y: "45%" },
  },
  {
    position: "-right-[6%] -top-[3%] w-[33%]",
    rotate: 7,
    spin: 6,
    drift: -130,
    burst: { x: "-60%", y: "70%" },
  },
  {
    position: "-right-[8%] bottom-[4%] w-[41%]",
    rotate: 5,
    spin: -4,
    drift: -40,
    burst: { x: "-50%", y: "-55%" },
  },
] as const;

const CHIP_TILTS = [-2, 1.5, -1, 2, -1.5] as const;

/* Anton's only kerning pair in the name. Giving each letter its own box drops
   kerning, so it is put back by hand (measured, in em). */
const KERNING: Record<string, number> = { AV: -0.0215 };

/* The giant name, one popping letter at a time. Each letter times itself to
   the curtain edge, so the name bursts open from the centre outwards. The
   visible letters are hidden from assistive tech; the sr-only copy is read. */
function PopHeadline({ lines, className }: { lines: readonly string[]; className?: string }) {
  let count = 0;

  return (
    <h1 className={className}>
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, lineIndex) => (
        <span
          key={lineIndex}
          aria-hidden="true"
          className="-mb-[0.08em] block pt-[0.06em] pb-[0.08em] whitespace-nowrap"
        >
          {[...line].map((char, charIndex) => {
            const index = count++;
            const kern = KERNING[(char + (line[charIndex + 1] ?? "")).toUpperCase()];
            return (
              <Pop
                key={charIndex}
                kind="letter"
                as="span"
                className="inline-block"
                from={{ rotate: index % 2 ? 14 : -12 }}
                style={kern ? { marginRight: `${kern}em` } : undefined}
              >
                {char === " " ? "\u00a0" : char}
              </Pop>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

/* CSS-drawn monitor silhouette with the code on screen. Same square footprint
   as the WebGL canvas, so swapping one for the other never shifts layout. */
function MonitorPlaceholder() {
  return (
    <div aria-hidden="true" className="@container grid size-full place-items-center">
      <div className="flex h-[74%] w-[55%] flex-col items-center">
        <div className="flex w-full flex-1 flex-col rounded-[12%] border border-ink/10 bg-line p-[9%] shadow-soft">
          <div className="aspect-[1.3] rounded-[8%] bg-ink p-[6%]">
            <div className="size-full overflow-hidden rounded-[5%] bg-bg p-[7%] font-mono text-[2.1cqw] leading-[1.6] text-ink">
              {hero.monitor.code.map((line, index) => (
                <span key={index} className="block whitespace-pre">
                  {line}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-auto ml-auto h-[3%] w-[46%] rounded-full bg-ink/60" />
        </div>
        <div className="h-[9%] w-[84%] rounded-b-[18%] border border-t-0 border-ink/10 bg-line" />
      </div>
    </div>
  );
}

const RetroMac = dynamic(() => import("@/components/retro-mac"), {
  ssr: false,
  loading: () => (
    <div role="img" aria-label={hero.monitor.alt} className="size-full">
      <MonitorPlaceholder />
    </div>
  ),
});

/* Soft pastel blobs behind the monitor. */
function Halo({
  className,
  anchor,
}: {
  className?: string;
  anchor?: RefObject<HTMLElement | null>;
}) {
  return (
    <Pop
      kind="glow"
      anchor={anchor}
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <div className="absolute inset-[7%] rounded-full bg-peach blur-3xl" />
      <div className="absolute top-0 left-[40%] size-[56%] rounded-full bg-lilac opacity-80 blur-3xl" />
      <div className="absolute bottom-[2%] -left-[4%] size-[46%] rounded-full bg-mint opacity-70 blur-3xl" />
    </Pop>
  );
}

function Sticker({
  src,
  index,
  progress,
  reduced,
  anchor,
}: {
  src: string;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
  anchor: RefObject<HTMLElement | null>;
}) {
  const spot = STICKER_SPOTS[index % STICKER_SPOTS.length];
  const y = useTransform(progress, [0, 1], [0, spot.drift]);
  const rotate = useTransform(progress, [0, 1], [spot.rotate, spot.rotate + spot.spin]);

  return (
    <motion.div
      className={cn("absolute will-change-transform", spot.position)}
      style={reduced ? { rotate: spot.rotate } : { y, rotate }}
    >
      <Pop
        kind="sticker"
        anchor={anchor}
        extra={0.1 + index * 0.08}
        from={{ ...spot.burst, rotate: -spot.rotate * 2 }}
        className="rounded-[0.9rem] border border-line bg-card p-[5%] shadow-lift"
      >
        <img
          src={src}
          alt=""
          aria-hidden="true"
          width={480}
          height={360}
          decoding="async"
          draggable={false}
          className="aspect-[4/3] w-full rounded-[0.55rem] object-cover"
        />
      </Pop>
    </motion.div>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M12 0c1 7 4 10 12 12-8 2-11 5-12 12-1-7-4-10-12-12 8-2 11-5 12-12z"
      />
    </svg>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  /* The monitor cluster pops as one: everything in it times off this box. */
  const clusterRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-svh flex-col overflow-hidden pt-[var(--header-h)]"
    >
      <div className="shell flex flex-1 flex-col justify-center py-[clamp(1.5rem,4svh,3.25rem)]">
        {/* ── Name + monitor ─────────────────────────────────────────── */}
        <div className="relative isolate">
          {/* Halo sits behind the headline from md up so it never tints the type. */}
          <Halo className={cn("-z-10 hidden aspect-square md:block", DESKTOP_SPOT)} />

          <Pop
            kind="kicker"
            as="p"
            className="label-mono mb-[clamp(0.9rem,2svh,1.5rem)] flex items-start gap-3 text-ink-soft"
          >
            <span
              aria-hidden="true"
              className="mt-[0.35em] inline-block size-2 shrink-0 rounded-full bg-accent"
            />
            <span>{hero.kicker}</span>
          </Pop>

          <PopHeadline lines={hero.headlineLines} className={cn("display text-ink", HEADLINE_SIZE)} />

          <div
            ref={clusterRef}
            className={cn(
              "pointer-events-none relative z-10 mx-auto mt-8 aspect-square w-[min(78%,21rem)] md:mt-0",
              DESKTOP_SPOT,
            )}
          >
            <Halo anchor={clusterRef} className="absolute inset-0 md:hidden" />

            {hero.stickers.map((src, index) => (
              <Sticker
                key={src}
                src={src}
                index={index}
                progress={scrollYProgress}
                reduced={reduced}
                anchor={clusterRef}
              />
            ))}

            <Pop
              kind="glow"
              anchor={clusterRef}
              aria-hidden="true"
              className="absolute bottom-[8%] left-1/2 h-[5%] w-[44%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-xl"
            />

            <Pop kind="monitor" anchor={clusterRef} className="absolute inset-0">
              <RetroMac fallback={<MonitorPlaceholder />} scrollProgress={scrollYProgress} />
            </Pop>

            <Pop
              kind="spark"
              anchor={clusterRef}
              extra={0.32}
              aria-hidden="true"
              className="absolute top-[1%] left-[9%] size-[9%] text-accent"
            >
              <Sparkle className="size-full" />
            </Pop>

            <Pop
              kind="chip"
              as="p"
              anchor={clusterRef}
              extra={0.42}
              from={{ rotate: 12 }}
              to={{ rotate: -5 }}
              aria-hidden="true"
              className="label-mono absolute bottom-[10%] -left-[3%] flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-ink shadow-soft"
            >
              <span className="size-1.5 rounded-full bg-sage-ink" />
              {hero.monitor.fileLabel}
            </Pop>
          </div>
        </div>

        {/* ── Tagline, CTAs, meta ────────────────────────────────────── */}
        <div className="mt-9 grid gap-10 md:mt-[clamp(1.75rem,4svh,3rem)] lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-6">
            <Pop
              kind="text"
              as="p"
              className="max-w-[46ch] text-[clamp(1rem,0.92rem+0.35vw,1.2rem)] leading-relaxed text-ink-soft"
            >
              {hero.tagline}
            </Pop>

            <div className="mt-7 flex flex-wrap gap-3">
              <Pop kind="button" extra={0.05}>
                <PillButton href={hero.primaryCta.href} variant="ink">
                  {hero.primaryCta.label}
                </PillButton>
              </Pop>
              <Pop kind="button" extra={0.12}>
                <PillButton href={hero.secondaryCta.href} variant="white" download>
                  {hero.secondaryCta.label}
                </PillButton>
              </Pop>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Pop
              kind="soft"
              className="label-mono flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-ink-soft"
            >
              <span className="flex items-center gap-2.5">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-sage-ink" />
                {hero.basedIn}
              </span>
              <LocalTime withSeconds className="tabular-nums text-ink" />
              <span aria-hidden="true" className="ml-auto hidden items-center gap-2 sm:flex">
                {hero.scrollHint}
                <ArrowIcon className="size-3 rotate-90" />
              </span>
            </Pop>

            <ul className="mt-4 flex flex-wrap gap-2">
              {roles.map((role, index) => (
                <Pop
                  key={role}
                  kind="chip"
                  as="li"
                  extra={index * 0.05}
                  className="label-mono rounded-full border border-ink/10 px-3 py-1.5 text-ink rotate-(--tilt) transition-[rotate,translate] duration-500 ease-out-expo hover:-translate-y-0.5 hover:rotate-0 motion-reduce:transition-none"
                  style={
                    {
                      backgroundColor: tintVar(TINTS[index % TINTS.length]),
                      "--tilt": `${CHIP_TILTS[index % CHIP_TILTS.length]}deg`,
                    } as CSSProperties
                  }
                >
                  {role}
                </Pop>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Roles ticker ─────────────────────────────────────────────── */}
      <Pop kind="band" extra={0.1}>
        <Marquee
          items={hero.marquee}
          duration={38}
          className="border-y border-line py-[clamp(0.7rem,1.5vw,1.3rem)]"
          itemClassName={cn("display text-ink", MARQUEE_SIZE)}
          separatorClassName={cn("display mx-[0.5em]", MARQUEE_SIZE)}
        />
      </Pop>
    </section>
  );
}
