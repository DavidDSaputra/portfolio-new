"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll } from "motion/react";
import FigLabel from "@/components/ui/fig-label";
import PillButton from "@/components/ui/pill-button";
import { Reveal, RevealTitle } from "@/components/ui/reveal";
import type { MonitorChannel } from "@/components/retro-mac";
import { cn } from "@/lib/cn";
import { showcase } from "@/lib/content";

/* "Now Showing": the retro CRT as a channel guide. The list on the right is
   the remote — picking a channel tunes the monitor to that project. While
   nobody touches it, it flips through the channels on its own. */

const EASE = [0.16, 1, 0.3, 1] as const;
/** Milliseconds each channel stays on while auto-tuning. */
const AUTO_MS = 6500;

interface Entry {
  key: string;
  name: string;
  title: string;
  tag: string;
  desc: string;
  status: string;
  href?: string;
  download?: string;
}

const ENTRIES: Entry[] = [
  { key: "boot", ...showcase.boot },
  ...showcase.channels.map((project) => ({
    key: project.slug,
    name: project.name,
    title: project.title,
    tag: project.tag,
    desc: project.desc,
    status: project.status,
    href: project.href,
    download: project.download,
  })),
];

const CHANNELS: MonitorChannel[] = [
  { label: showcase.boot.name, status: showcase.boot.status },
  ...showcase.channels.map((project) => ({
    src: project.image,
    label: project.name,
    status: `● ${project.status}`,
  })),
];

const channelNumber = (index: number) => `${showcase.channelPrefix} ${String(index).padStart(2, "0")}`;

/* CSS-drawn monitor silhouette with the code on screen. Same square footprint
   as the WebGL canvas, so swapping one for the other never shifts layout. */
function MonitorPlaceholder() {
  return (
    <div aria-hidden="true" className="@container grid size-full place-items-center">
      <div className="flex h-[74%] w-[55%] flex-col items-center">
        <div className="flex w-full flex-1 flex-col rounded-[12%] border border-ink/10 bg-line p-[9%] shadow-soft">
          <div className="aspect-[1.3] rounded-[8%] bg-ink p-[6%]">
            <div className="size-full overflow-hidden rounded-[5%] bg-bg p-[7%] font-mono text-[2.1cqw] leading-[1.6] text-ink">
              {showcase.monitor.code.map((line, index) => (
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
    <div role="img" aria-label={showcase.monitor.alt} className="size-full">
      <MonitorPlaceholder />
    </div>
  ),
});

function EntryLink({ entry }: { entry: Entry }) {
  if (entry.href) {
    return (
      <PillButton href={entry.href} variant="white">
        {showcase.visitLabel}
      </PillButton>
    );
  }
  if (entry.download) {
    return (
      <PillButton href={entry.download} variant="white" download>
        {showcase.downloadLabel}
      </PillButton>
    );
  }
  if (entry.key === "boot") return null;
  return <span className="label-mono text-bg/60">{showcase.privateLabel}</span>;
}

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hovering, setHovering] = useState(false);
  const inView = useInView(sectionRef, { margin: "-20% 0px -20% 0px" });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const ticking = auto && inView && !hovering && !reduced;

  useEffect(() => {
    if (!ticking) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % ENTRIES.length), AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [ticking, active]);

  const tune = (index: number) => {
    setActive(index);
    setAuto(false);
  };

  const current = ENTRIES[active];

  return (
    <section
      id="showcase"
      ref={sectionRef}
      aria-labelledby="showcase-heading"
      className="relative overflow-x-clip py-[clamp(5rem,11vw,10rem)]"
    >
      <div className="shell">
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <Reveal>
              <FigLabel fig={showcase.fig} label={showcase.figLabel} />
            </Reveal>
            <div id="showcase-heading">
              <RevealTitle
                lines={showcase.heading}
                className="display mt-6 text-[clamp(3.25rem,11vw,10rem)]"
              />
            </div>
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:pb-5">
            <p className="max-w-sm text-base leading-relaxed text-ink-soft sm:text-lg">{showcase.intro}</p>
          </Reveal>
        </header>

        <div className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* ── The set ─────────────────────────────────────────────────── */}
          <Reveal className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:col-span-7">
            <div className="relative mx-auto aspect-square w-full max-w-[min(22rem,80vw)] sm:max-w-[30rem] lg:max-w-[40rem]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute inset-[10%] rounded-full bg-peach blur-3xl" />
                <div className="absolute top-[4%] left-[42%] size-[50%] rounded-full bg-lilac opacity-80 blur-3xl" />
                <div className="absolute bottom-[6%] left-[2%] size-[42%] rounded-full bg-mint opacity-70 blur-3xl" />
              </div>
              <div
                aria-hidden="true"
                className="absolute bottom-[9%] left-1/2 h-[5%] w-[46%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-xl"
              />

              <RetroMac
                channels={CHANNELS}
                active={active}
                scrollProgress={scrollYProgress}
                fallback={<MonitorPlaceholder />}
                className="absolute inset-0"
              />

              {/* Now-playing tag, re-keyed so it flips on every change. */}
              <div className="absolute bottom-[6%] left-[2%] overflow-hidden rounded-full border border-line bg-card shadow-soft">
                <motion.p
                  key={current.key}
                  initial={reduced ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="label-mono flex items-center gap-2 px-3 py-1.5 text-ink"
                >
                  <span className="size-1.5 animate-pulse rounded-full bg-sage-ink motion-reduce:animate-none" />
                  {channelNumber(active)} · {current.name}
                </motion.p>
              </div>
            </div>
            <p className="label-mono mt-2 hidden text-center text-ink-soft lg:block">{showcase.hint}</p>
          </Reveal>

          {/* ── The remote ──────────────────────────────────────────────── */}
          <div
            className="lg:col-span-5"
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
          >
            <div className="label-mono flex items-center justify-between border-b border-line pb-3 text-ink-soft">
              <span>
                {String(ENTRIES.length).padStart(2, "0")} {showcase.channelPrefix}
              </span>
              <button
                type="button"
                onClick={() => setAuto((value) => !value)}
                aria-pressed={auto}
                className="flex items-center gap-2 rounded-full border border-line px-3 py-1 text-ink transition-colors hover:bg-card"
              >
                <span
                  aria-hidden="true"
                  className={cn("size-1.5 rounded-full", auto ? "bg-sage-ink" : "bg-ink/30")}
                />
                {auto ? showcase.autoLabel : showcase.pausedLabel}
              </button>
            </div>

            <ol className="m-0 mt-3 flex list-none flex-col gap-1.5 p-0">
              {ENTRIES.map((entry, index) => {
                const on = index === active;
                return (
                  <li key={entry.key}>
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-2xl transition-colors duration-500 ease-out-expo",
                        on ? "bg-ink text-bg" : "text-ink hover:bg-card",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => tune(index)}
                        aria-current={on ? "true" : undefined}
                        className="flex w-full items-center gap-4 px-4 py-3.5 text-left"
                      >
                        <span className={cn("label-mono w-12 shrink-0", on ? "text-bg/60" : "text-ink-soft")}>
                          {channelNumber(index)}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[clamp(1rem,0.9rem+0.4vw,1.2rem)] font-semibold tracking-[-0.01em]">
                          {entry.title}
                        </span>
                        <span
                          className={cn(
                            "label-mono hidden shrink-0 sm:block",
                            on ? "text-bg/60" : "text-ink-soft",
                          )}
                        >
                          {entry.tag.split("·").pop()?.trim()}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {on ? (
                          <motion.div
                            key="details"
                            initial={reduced ? false : { height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={reduced ? undefined : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-4 px-4 pb-5 sm:pl-20">
                              <p className="max-w-[44ch] text-sm leading-relaxed text-bg/75">{entry.desc}</p>
                              <div className="flex flex-wrap items-center gap-3">
                                <EntryLink entry={entry} />
                                <span className="label-mono flex items-center gap-2 text-bg/60">
                                  <span aria-hidden="true" className="size-1.5 rounded-full bg-mint" />
                                  {entry.status}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      {/* Auto-tune countdown. */}
                      {on && ticking ? (
                        <motion.span
                          key={`bar-${active}`}
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                        />
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
