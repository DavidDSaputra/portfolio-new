"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import FigLabel from "@/components/ui/fig-label";
import { Reveal, RevealTitle } from "@/components/ui/reveal";
import { about, tintVar } from "@/lib/content";
import type { Tint } from "@/lib/content";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

const [statement, ...bodyParagraphs] = about.paragraphs;

/* ── Statement: words brighten from 20% → 100% as the block scrolls through ── */

function ScrubWord({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <motion.span className="will-change-[opacity]" style={{ opacity }}>
      {children}
    </motion.span>
  );
}

function Statement({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.55"] });

  const words = text.split(" ");
  const className =
    "max-w-[24ch] font-sans text-[clamp(1.6rem,3.4vw,3rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance text-ink sm:max-w-[26ch]";

  if (reduced) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => {
        const start = index / words.length;
        /* Each word overlaps the next few so the sweep feels continuous. */
        const end = Math.min(1, start + 4 / words.length);
        return (
          <span key={`${word}-${index}`}>
            <ScrubWord progress={scrollYProgress} range={[start, end]}>
              {word}
            </ScrubWord>
            {index < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </p>
  );
}

/* ── Trait chips ─────────────────────────────────────────────────────────── */

const CHIP_TINTS: Tint[] = ["pink", "mint", "butter"];
const CHIP_TILT = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1"];

const CHIP_ICONS: ReactNode[] = [
  /* speech bubble */
  <path
    key="chat"
    d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5v4A1.5 1.5 0 0 1 11.5 10H8l-3 2.5V10h-.5A1.5 1.5 0 0 1 3 8.5v-4Z"
  />,
  /* bolt */
  <path key="bolt" d="M9 2 4 9h3.5L7 14l5-7H8.5L9 2Z" />,
  /* linked circles */
  <g key="team">
    <circle cx="5.75" cy="8" r="2.75" />
    <circle cx="10.25" cy="8" r="2.75" />
  </g>,
];

function TraitChips() {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-3.5">
      {about.traits.map((trait, index) => (
        <Reveal as="li" key={trait} delay={0.1 + index * 0.08} y={18}>
          <span
            className={cn(
              "inline-flex items-center gap-2.5 rounded-full border border-ink/10 py-2 pr-4.5 pl-2 text-[0.95rem] font-medium text-ink shadow-soft",
              "transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:rotate-0 hover:shadow-lift motion-reduce:transition-none",
              CHIP_TILT[index % CHIP_TILT.length],
            )}
            style={{ backgroundColor: tintVar(CHIP_TINTS[index % CHIP_TINTS.length]) }}
          >
            <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-card">
              <svg
                viewBox="0 0 16 16"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {CHIP_ICONS[index % CHIP_ICONS.length]}
              </svg>
            </span>
            {trait}
          </span>
        </Reveal>
      ))}
    </ul>
  );
}

/* ── Sticker photo + halo ────────────────────────────────────────────────── */

function PhotoSticker() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const photoY = useTransform(smooth, [0, 1], [36, -36]);
  const haloY = useTransform(smooth, [0, 1], [-24, 24]);

  return (
    <div ref={ref} className="relative isolate mx-auto w-full max-w-[26rem] px-6 py-10 sm:px-10 sm:py-12">
      {/* Pastel halo */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[6%] -z-10"
        style={reduced ? undefined : { y: haloY }}
      >
        <div className="absolute inset-0 rounded-[46%_54%_58%_42%/52%_44%_56%_48%] bg-lilac" />
        <div className="absolute -right-[4%] -bottom-[6%] size-[46%] rounded-full bg-peach" />
        <div className="absolute -top-[5%] left-[4%] size-[26%] rounded-full bg-butter" />
      </motion.div>

      {/* Photo */}
      <motion.div style={reduced ? undefined : { y: photoY }}>
        <Reveal y={40}>
          <motion.figure
            className="relative rounded-[1.75rem] bg-card p-[clamp(10px,1.2vw,14px)] shadow-lift"
            initial={false}
            animate={{ rotate: -5 }}
            whileHover={reduced ? undefined : { rotate: 0, scale: 1.03 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {/* Tape */}
            <span
              aria-hidden="true"
              className="absolute -top-3.5 left-1/2 z-10 h-7 w-28 -translate-x-1/2 rotate-[4deg] rounded-[3px] border border-ink/5 bg-butter/85 shadow-[0_1px_2px_rgb(19_52_88/0.08)]"
            />
            <img
              src={about.photo.src}
              alt={about.photo.alt}
              width={400}
              height={400}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full rounded-[1.25rem] bg-peach object-cover"
            />
            <figcaption className="label-mono flex items-start gap-2 px-1.5 pt-3 pb-1.5 text-[0.64rem] text-ink-soft">
              <span aria-hidden="true" className="mt-[0.35em] inline-block size-1.5 shrink-0 rounded-full bg-accent" />
              <span aria-hidden="true">{about.photo.caption}</span>
            </figcaption>
          </motion.figure>
        </Reveal>
      </motion.div>
    </div>
  );
}

/* ── Meta grid ───────────────────────────────────────────────────────────── */

function MetaGrid() {
  return (
    <dl className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
      {about.meta.map((item, index) => (
        <Reveal
          key={item.label}
          delay={index * 0.08}
          y={20}
          className={cn(
            "border-b border-line py-6 sm:py-7 lg:border-b-0 lg:py-8",
            "sm:odd:pr-8 sm:even:border-l sm:even:pl-8",
            "lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0",
          )}
        >
          <dt className="label-mono flex items-center gap-2.5 text-ink-soft">
            <span aria-hidden="true" className="tabular-nums text-ink/40">
              {String(index + 1).padStart(2, "0")}
            </span>
            {item.label}
          </dt>
          <dd className="mt-3 max-w-[30ch] text-[1.02rem] leading-snug font-medium text-ink">{item.value}</dd>
        </Reveal>
      ))}
    </dl>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-x-clip py-[clamp(5rem,12vw,11rem)]"
    >
      <div className="shell">
        <Reveal>
          <FigLabel fig={about.fig} label={about.figLabel} />
        </Reveal>

        <div id="about-heading" className="mt-6 sm:mt-8">
          <RevealTitle
            as="h2"
            lines={about.heading}
            className="display text-[clamp(2.25rem,11vw,9.5rem)] text-ink"
          />
        </div>

        <div className="mt-[clamp(3rem,7vw,6rem)] grid grid-cols-1 items-center gap-x-10 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Statement text={statement} />
            <div className="mt-9 sm:mt-11">
              <TraitChips />
            </div>
          </div>
          <div className="lg:col-span-5">
            <PhotoSticker />
          </div>
        </div>

        <div className="mt-[clamp(3.5rem,8vw,7rem)] grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2 lg:w-10/12 xl:w-9/12">
          {bodyParagraphs.map((paragraph, index) => (
            <Reveal
              as="p"
              key={paragraph}
              delay={index * 0.1}
              className="max-w-[58ch] text-[1.05rem] leading-[1.7] text-ink-soft"
            >
              {paragraph}
            </Reveal>
          ))}
        </div>

        <div className="mt-[clamp(3.5rem,8vw,6.5rem)]">
          <MetaGrid />
        </div>
      </div>
    </section>
  );
}
