"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import LocalTime from "@/components/ui/local-time";
import Marquee from "@/components/ui/marquee";
import PillButton, { ArrowIcon } from "@/components/ui/pill-button";
import { Pop } from "@/components/ui/pop";
import { cn } from "@/lib/cn";
import { useIntroState } from "@/lib/intro";
import { hero, roles, site } from "@/lib/content";

/* Typography-only hero: the name set as one giant line that fills the shell,
   its letters popping in behind the loading curtain, a role line that flips
   through what David does, and the two words drifting apart on scroll. */

/* The name spans the shell width (container units), backing off on short
   viewports so the whole hero stays above the fold. Below md it breaks onto
   two lines and is sized off "SAPUTRA", the longer word. */
const HEADLINE_SIZE =
  "text-[length:min(30.5cqw,26svh)] md:text-[length:min(18.2cqw,36svh)]";
const MARQUEE_SIZE = "text-[length:clamp(2rem,6vw,5rem)]";

/** Milliseconds each role stays up before flipping to the next. */
const ROLE_MS = 2600;

/* Anton's only kerning pair in the name. Giving each letter its own box drops
   kerning, so it is put back by hand (measured, in em). */
const KERNING: Record<string, number> = { AV: -0.0215 };

/* One word of the name, one popping letter at a time. `start` keeps the
   alternating tilt running across both words. Each letter sits in two boxes:
   the outer one pops in, the inner one does the hover bounce, so the two
   transforms never fight. */
function PopWord({ word, start }: { word: string; start: number }) {
  return (
    <>
      {[...word].map((char, charIndex) => {
        const index = start + charIndex;
        const kern = KERNING[(char + (word[charIndex + 1] ?? "")).toUpperCase()];
        return (
          <Pop
            key={charIndex}
            kind="letter"
            as="span"
            className="inline-block"
            from={{ rotate: index % 2 ? 14 : -12 }}
            style={kern ? { marginRight: `${kern}em` } : undefined}
          >
            <span className="hero-letter inline-block">{char}</span>
          </Pop>
        );
      })}
    </>
  );
}

function Word({
  word,
  start,
  x,
  className,
}: {
  word: string;
  start: number;
  x?: MotionValue<string>;
  className?: string;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn("block whitespace-nowrap will-change-transform md:inline-block", className)}
      style={x ? { x } : undefined}
    >
      <PopWord word={word} start={start} />
    </motion.span>
  );
}

/* "Currently — Frontend Developer", the role flipping letter by letter out of
   a mask. Waits for the curtain, then cycles. */
function RoleFlip({ className }: { className?: string }) {
  const intro = useIntroState();
  const reduced = useReducedMotion() ?? false;
  /* `prev` stays mounted (faded out) until the next flip replaces it. */
  const [{ index, prev }, setFlip] = useState({ index: 0, prev: -1 });
  const running = intro !== "pending" && !reduced;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () => setFlip((flip) => ({ index: (flip.index + 1) % roles.length, prev: flip.index })),
      ROLE_MS,
    );
    return () => window.clearInterval(timer);
  }, [running]);

  const role = roles[index];

  return (
    <p className={cn("flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-x-4", className)}>
      <span className="label-mono text-ink-soft">{hero.rolePrefix} —</span>
      <span className="sr-only">{roles.join(", ")}</span>
      {/* Both words share one grid cell, so the outgoing one rises out of the
          same one-line mask the incoming one rises into. */}
      <span
        aria-hidden="true"
        className="relative inline-grid h-[1.2em] overflow-hidden font-sans text-[clamp(1.6rem,1.1rem+2.2vw,3.25rem)] leading-[1.2] font-semibold tracking-[-0.03em] text-ink"
      >
        {prev !== -1 ? (
          <motion.span
            key={`out-${prev}`}
            className="col-start-1 row-start-1 inline-flex whitespace-pre"
            initial={{ y: "0%", opacity: 1 }}
            animate={{ y: "-110%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.84, 0] }}
          >
            {roles[prev]}
            <span className="text-accent">.</span>
          </motion.span>
        ) : null}
        {/* Letters rise in one after another; the word leaves as one. */}
        <span key={`in-${index}`} className="col-start-1 row-start-1 inline-flex whitespace-pre">
          {[...role].map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              initial={reduced || prev === -1 ? false : { y: "110%", rotate: 8 }}
              animate={{ y: "0%", rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.15 + charIndex * 0.022, ease: [0.16, 1, 0.3, 1] }}
            >
              {char}
            </motion.span>
          ))}
          <span className="text-accent">.</span>
        </span>
      </span>
    </p>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  /* The two words drift apart as the hero scrolls away. */
  const firstX = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const lastX = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);

  const [first, last] = hero.headlineLines;

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-svh flex-col overflow-hidden pt-[var(--header-h)]"
    >
      <div className="shell flex flex-1 flex-col justify-center gap-[clamp(1.5rem,4.5svh,3.5rem)] py-[clamp(1.5rem,4svh,3rem)]">
        {/* ── Top rule: kicker + where/when ───────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-4">
          <Pop kind="kicker" as="p" className="label-mono flex items-center gap-3 text-ink-soft">
            <span aria-hidden="true" className="inline-block size-2 shrink-0 rounded-full bg-accent" />
            <span>{hero.kicker}</span>
          </Pop>
          <Pop kind="soft" className="label-mono flex items-center gap-4 text-ink-soft">
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-sage-ink" />
              {hero.basedIn}
            </span>
            <LocalTime withSeconds className="hidden tabular-nums text-ink sm:inline" />
          </Pop>
        </div>

        {/* ── The name ────────────────────────────────────────────────── */}
        <div className="@container">
          <h1
            className={cn(
              "display flex flex-col text-ink md:flex-row md:justify-between",
              HEADLINE_SIZE,
            )}
          >
            <span className="sr-only">{site.name}</span>
            <Word word={first} start={0} x={reduced ? undefined : firstX} className="pt-[0.06em]" />
            <Word
              word={last}
              start={first.length}
              x={reduced ? undefined : lastX}
              className="-mt-[0.04em] pt-[0.06em] md:mt-0"
            />
          </h1>
        </div>

        {/* ── Role, tagline, CTAs ─────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <Pop kind="text">
              <RoleFlip />
            </Pop>
            <Pop
              kind="text"
              as="p"
              extra={0.08}
              className="mt-5 max-w-[52ch] text-[clamp(1rem,0.92rem+0.3vw,1.15rem)] leading-relaxed text-ink-soft"
            >
              {hero.tagline}
            </Pop>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-5 lg:items-end">
            <div className="flex flex-wrap gap-3 lg:justify-end">
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
            <Pop kind="soft" extra={0.2}>
              <a
                href="/#showcase"
                className="label-mono link-sweep flex items-center gap-2 text-ink-soft hover:text-ink"
              >
                {hero.nextLabel}
                <ArrowIcon className="size-3 rotate-90" />
              </a>
            </Pop>
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
