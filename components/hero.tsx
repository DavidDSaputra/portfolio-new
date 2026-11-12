"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import LocalTime from "@/components/ui/local-time";
import Marquee from "@/components/ui/marquee";
import PillButton, { ArrowIcon } from "@/components/ui/pill-button";
import { RevealTitle } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { TINTS, hero, roles, tintVar } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Giant name: scales with width, but backs off on short viewports so the
   whole hero (and a peek of the marquee) stays near the fold. */
const HEADLINE_SIZE = "text-[length:clamp(4.5rem,min(19vw,25svh),19rem)]";
const MARQUEE_SIZE = "text-[length:clamp(2rem,6vw,5rem)]";

/* Where the monitor "sticker" sits from md up: pinned to the right edge of the
   headline block, overlapping the end of the name. */
const DESKTOP_SPOT =
  "md:absolute md:right-0 md:top-1/2 md:w-[clamp(17rem,36vw,31rem)] md:-translate-y-[46%]";

/* Scattered polaroids around the monitor (percentages of the visual square). */
const STICKER_SPOTS = [
  { position: "-left-[12%] top-[5%] w-[40%]", rotate: -9, spin: -5, drift: -70 },
  { position: "-right-[6%] -top-[3%] w-[33%]", rotate: 7, spin: 6, drift: -130 },
  { position: "-right-[8%] bottom-[4%] w-[41%]", rotate: 5, spin: -4, drift: -40 },
] as const;

const CHIP_TILTS = [-2, 1.5, -1, 2, -1.5] as const;

/* Fade + slide entrance; collapses to an instant swap under reduced motion. */
function rise(delay: number, reduced: boolean) {
  return {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: reduced ? { duration: 0 } : { duration: 0.8, delay, ease: EASE },
  };
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
function Halo({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none", className)}>
      <div className="absolute inset-[7%] rounded-full bg-peach blur-3xl" />
      <div className="absolute top-0 left-[40%] size-[56%] rounded-full bg-lilac opacity-80 blur-3xl" />
      <div className="absolute bottom-[2%] -left-[4%] size-[46%] rounded-full bg-mint opacity-70 blur-3xl" />
    </div>
  );
}

function Sticker({
  src,
  index,
  progress,
  reduced,
}: {
  src: string;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const spot = STICKER_SPOTS[index % STICKER_SPOTS.length];
  const y = useTransform(progress, [0, 1], [0, spot.drift]);
  const rotate = useTransform(progress, [0, 1], [spot.rotate, spot.rotate + spot.spin]);

  return (
    <motion.div
      className={cn("absolute will-change-transform", spot.position)}
      style={reduced ? { rotate: spot.rotate } : { y, rotate }}
    >
      <motion.div
        className="rounded-[0.9rem] border border-line bg-card p-[5%] shadow-lift"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={
          reduced ? { duration: 0 } : { duration: 0.9, delay: 0.85 + index * 0.12, ease: EASE }
        }
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
      </motion.div>
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

          <motion.p
            {...rise(0.05, reduced)}
            className="label-mono mb-[clamp(0.9rem,2svh,1.5rem)] flex items-start gap-3 text-ink-soft"
          >
            <span
              aria-hidden="true"
              className="mt-[0.35em] inline-block size-2 shrink-0 rounded-full bg-accent"
            />
            <span>{hero.kicker}</span>
          </motion.p>

          <RevealTitle
            as="h1"
            immediate
            delay={0.12}
            lines={hero.headlineLines}
            className={cn("display text-ink", HEADLINE_SIZE)}
          />

          <div
            className={cn(
              "pointer-events-none relative z-10 mx-auto mt-8 aspect-square w-[min(78%,21rem)] md:mt-0",
              DESKTOP_SPOT,
            )}
          >
            <Halo className="absolute inset-0 md:hidden" />

            {hero.stickers.map((src, index) => (
              <Sticker
                key={src}
                src={src}
                index={index}
                progress={scrollYProgress}
                reduced={reduced}
              />
            ))}

            <div
              aria-hidden="true"
              className="absolute bottom-[8%] left-1/2 h-[5%] w-[44%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-xl"
            />

            <motion.div
              className="absolute inset-0 will-change-transform"
              initial={{ opacity: 0, scale: 0.82, rotate: -7 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 1.1, delay: 0.4, ease: EASE }}
            >
              <RetroMac fallback={<MonitorPlaceholder />} scrollProgress={scrollYProgress} />
            </motion.div>

            <motion.div
              aria-hidden="true"
              className="absolute top-[1%] left-[9%] size-[9%] text-accent"
              initial={{ opacity: 0, scale: 0, rotate: -40 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.9, delay: 1.15, ease: EASE }}
            >
              <Sparkle className="size-full" />
            </motion.div>

            <motion.p
              aria-hidden="true"
              className="label-mono absolute bottom-[10%] -left-[3%] flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-ink shadow-soft"
              initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              transition={reduced ? { duration: 0 } : { duration: 0.9, delay: 1.25, ease: EASE }}
            >
              <span className="size-1.5 rounded-full bg-sage-ink" />
              {hero.monitor.fileLabel}
            </motion.p>
          </div>
        </div>

        {/* ── Tagline, CTAs, meta ────────────────────────────────────── */}
        <div className="mt-9 grid gap-10 md:mt-[clamp(1.75rem,4svh,3rem)] lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-6">
            <motion.p
              {...rise(0.7, reduced)}
              className="max-w-[46ch] text-[clamp(1rem,0.92rem+0.35vw,1.2rem)] leading-relaxed text-ink-soft"
            >
              {hero.tagline}
            </motion.p>

            <motion.div {...rise(0.82, reduced)} className="mt-7 flex flex-wrap gap-3">
              <PillButton href={hero.primaryCta.href} variant="ink">
                {hero.primaryCta.label}
              </PillButton>
              <PillButton href={hero.secondaryCta.href} variant="white" download>
                {hero.secondaryCta.label}
              </PillButton>
            </motion.div>
          </div>

          <motion.div {...rise(0.94, reduced)} className="lg:col-span-5 lg:col-start-8">
            <div className="label-mono flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-ink-soft">
              <span className="flex items-center gap-2.5">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-sage-ink" />
                {hero.basedIn}
              </span>
              <LocalTime withSeconds className="tabular-nums text-ink" />
              <span aria-hidden="true" className="ml-auto hidden items-center gap-2 sm:flex">
                {hero.scrollHint}
                <ArrowIcon className="size-3 rotate-90" />
              </span>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {roles.map((role, index) => (
                <li
                  key={role}
                  className="label-mono rounded-full border border-ink/10 px-3 py-1.5 text-ink rotate-(--tilt) transition-[rotate,translate] duration-500 ease-out-expo hover:-translate-y-0.5 hover:rotate-0 motion-reduce:transition-none"
                  style={
                    {
                      backgroundColor: tintVar(TINTS[index % TINTS.length]),
                      "--tilt": `${CHIP_TILTS[index % CHIP_TILTS.length]}deg`,
                    } as CSSProperties
                  }
                >
                  {role}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* ── Roles ticker ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 1, delay: 1.05, ease: EASE }}
      >
        <Marquee
          items={hero.marquee}
          duration={38}
          className="border-y border-line py-[clamp(0.7rem,1.5vw,1.3rem)]"
          itemClassName={cn("display text-ink", MARQUEE_SIZE)}
          separatorClassName={cn("display mx-[0.5em]", MARQUEE_SIZE)}
        />
      </motion.div>
    </section>
  );
}
