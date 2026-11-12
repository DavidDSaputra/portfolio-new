"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import FigLabel from "@/components/ui/fig-label";
import PillButton from "@/components/ui/pill-button";
import { Reveal, RevealTitle } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { TINTS, featuredProjects, tintVar, works, type Project } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

const pad = (value: number) => String(value).padStart(2, "0");

/* ── Sticky counter: "01 / 06" with rolling digits + progress bar ───────── */

const digitVariants = {
  enter: (dir: number) => ({ y: `${dir * 100}%` }),
  center: { y: "0%" },
  exit: (dir: number) => ({ y: `${dir * -100}%` }),
};

function RollingNumber({ value, dir, reduced }: { value: string; dir: number; reduced: boolean }) {
  if (reduced) return <span>{value}</span>;

  return (
    <span className="inline-flex">
      {value.split("").map((char, position) => (
        <span key={position} className="relative inline-block h-[1em] overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.span
              key={char}
              custom={dir}
              variants={digitVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7, ease: EASE }}
              className="block will-change-transform"
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

function StackCounter({
  active,
  dir,
  total,
  name,
  progress,
  reduced,
}: {
  active: number;
  dir: number;
  total: number;
  name: string;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const raw = useTransform(progress, [0, (total - 1) / total], [1 / total, 1]);
  const smooth = useSpring(raw, { stiffness: 140, damping: 26, mass: 0.4 });

  return (
    <div
      aria-hidden="true"
      className={cn(
        "sticky top-[var(--header-h)] z-30 flex items-center gap-4 bg-bg/90 py-3 backdrop-blur-sm",
        /* Same thresholds as the StackCard li: below them a stuck card cannot fit. */
        "[@media(max-height:620px)]:static sm:max-lg:[@media(max-height:720px)]:static lg:[@media(max-height:650px)]:static",
        "lg:top-[calc(var(--header-h)+2rem)] lg:z-auto lg:flex-col lg:items-start lg:gap-5 lg:self-start",
        "lg:bg-transparent lg:py-0 lg:backdrop-blur-none",
      )}
    >
      <div className="flex shrink-0 items-baseline gap-2">
        <span className="display text-[1.75rem] leading-none tabular-nums lg:text-[clamp(4.5rem,7vw,6.5rem)]">
          <RollingNumber value={pad(active + 1)} dir={dir} reduced={reduced} />
        </span>
        <span className="label-mono text-ink-soft">/ {pad(total)}</span>
      </div>

      <div className="relative h-0.5 min-w-0 flex-1 overflow-hidden rounded-full bg-line lg:w-full lg:flex-none">
        <motion.span
          className="absolute inset-0 origin-left rounded-full bg-ink"
          style={{ scaleX: reduced ? (active + 1) / total : smooth }}
        />
      </div>

      <p className="label-mono hidden max-w-[45%] truncate text-ink-soft sm:block lg:max-w-full lg:whitespace-normal lg:[overflow-wrap:anywhere]">
        {name}
      </p>
    </div>
  );
}

/* ── One pinned project card ────────────────────────────────────────────── */

function ProjectAction({ project }: { project: Project }) {
  if (project.href) {
    return (
      <PillButton href={project.href} aria-label={`${works.viewLabel}: ${project.title}`}>
        {works.viewLabel}
      </PillButton>
    );
  }
  if (project.download) {
    return (
      <PillButton href={project.download} download aria-label={`${works.downloadLabel}: ${project.title}`}>
        {works.downloadLabel}
      </PillButton>
    );
  }
  return (
    <span className="inline-flex h-12 items-center rounded-full border border-dashed border-ink/30 px-5 text-[0.95rem] font-semibold text-ink/80">
      {works.privateLabel}
    </span>
  );
}

function StackCard({
  project,
  index,
  total,
  progress,
  reduced,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const isLast = index === total - 1;
  /* The card is covered by the next one during this slice of the stack. */
  const range = [index / total, (index + 1) / total];
  const scale = useTransform(progress, range, [1, isLast ? 1 : 0.94]);
  const y = useTransform(progress, range, [0, isLast ? 0 : -6]);
  const dim = useTransform(progress, range, [0, isLast ? 0 : 0.1]);

  const tint = TINTS[index % TINTS.length];
  const isLive = Boolean(project.href);

  const meta = [
    { label: works.metaLabels.role, value: project.role, live: false },
    { label: works.metaLabels.status, value: project.status, live: isLive },
    { label: works.metaLabels.type, value: project.tag, live: false },
  ];

  return (
    <li
      className="sticky mb-6 last:mb-0 lg:mb-10 [@media(max-height:620px)]:static sm:max-lg:[@media(max-height:720px)]:static lg:[@media(max-height:650px)]:static"
      style={{ top: `calc(var(--header-h) + var(--stack-top) + ${index} * var(--stack-step))` }}
    >
      <motion.article
        className="origin-top will-change-transform"
        style={reduced ? undefined : { scale, y }}
      >
        <div
          className={cn(
            "group/card relative overflow-hidden rounded-[1.5rem] border border-line shadow-lift sm:rounded-[2rem]",
            "transition-transform duration-700 ease-out-expo hover:-translate-y-1.5 focus-within:-translate-y-1.5",
            "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0",
          )}
          style={{ backgroundColor: tintVar(tint) }}
        >
          <div className="grid gap-4 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10 lg:p-10">
            {/* Copy */}
            <div className="order-2 flex min-w-0 flex-col lg:order-1">
              <p className="label-mono flex items-center justify-between gap-3 text-ink/75">
                <span className="shrink-0">
                  {pad(index + 1)} / {pad(total)}
                </span>
                <span className="truncate">{project.name}</span>
              </p>

              <h3 className="display mt-3 text-[clamp(2rem,min(5vw,8svh),4.5rem)] text-balance lg:mt-6">
                {project.title}
              </h3>

              <p
                className={cn(
                  "mt-3 line-clamp-2 max-w-[46ch] text-sm leading-relaxed text-ink/80",
                  "sm:line-clamp-3 sm:text-base lg:mt-5 lg:line-clamp-4 2xl:line-clamp-none",
                  "max-lg:[@media(max-height:700px)]:hidden",
                )}
              >
                {project.desc}
              </p>

              <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-ink/10 pt-4 lg:mt-auto lg:pt-6">
                {meta.map((item) => (
                  <div key={item.label} className="min-w-0">
                    <dt className="label-mono text-ink/80">{item.label}</dt>
                    <dd className="mt-1 flex items-start gap-1.5 text-[0.8rem] leading-snug font-medium sm:text-sm">
                      {item.live && (
                        <span
                          aria-hidden="true"
                          className="mt-[0.4em] size-2 shrink-0 rounded-full bg-sage-ink ring-2 ring-sage/60"
                        />
                      )}
                      <span className="min-w-0 [overflow-wrap:anywhere]">{item.value}</span>
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 lg:mt-7">
                <ProjectAction project={project} />
              </div>
            </div>

            {/* Browser-framed shot */}
            <div className="order-1 min-w-0 lg:order-2">
              <div className="flex h-full flex-col overflow-hidden rounded-[1rem] border-[3px] border-card bg-card shadow-soft sm:rounded-[1.25rem] sm:border-4">
                <div className="flex h-7 shrink-0 items-center gap-3 px-2.5 sm:h-9 sm:px-3">
                  <span aria-hidden="true" className="flex shrink-0 gap-1.5">
                    <span className="size-2 rounded-full bg-accent sm:size-2.5" />
                    <span className="size-2 rounded-full bg-butter ring-1 ring-line sm:size-2.5" />
                    <span className="size-2 rounded-full bg-sage sm:size-2.5" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="truncate font-mono text-[0.68rem] tracking-wide text-ink-soft"
                  >
                    {project.name}
                  </span>
                </div>
                <div className="relative aspect-[16/10] max-h-[22svh] w-full overflow-hidden rounded-[0.7rem] bg-bg sm:max-h-[32svh] sm:rounded-[0.9rem] lg:aspect-auto lg:max-h-none lg:min-h-[21rem] lg:flex-1">
                  <img
                    src={project.image}
                    alt={project.title}
                    width={900}
                    height={563}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "absolute inset-0 size-full object-cover object-top",
                      "transition-transform duration-[900ms] ease-out-expo group-hover/card:scale-[1.06]",
                      "motion-reduce:transition-none motion-reduce:group-hover/card:scale-100",
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {!reduced && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-ink"
              style={{ opacity: dim }}
            />
          )}
        </div>
      </motion.article>
    </li>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */

export default function SelectedWorks() {
  const reduced = useReducedMotion() ?? false;
  const stackRef = useRef<HTMLOListElement>(null);
  const total = featuredProjects.length;
  const [state, setState] = useState({ index: 0, dir: 1 });

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(total - 1, Math.max(0, Math.round(value * total)));
    setState((prev) => (prev.index === next ? prev : { index: next, dir: next > prev.index ? 1 : -1 }));
  });

  const lastLine = works.heading.length - 1;
  const titleLines = works.heading.map((line, index) =>
    index === lastLine ? (
      <>
        {line}
        <span className="label-mono ml-[1.25em] inline-block translate-y-[0.6em] align-top text-ink-soft">
          {works.years}
        </span>
      </>
    ) : (
      line
    ),
  );

  return (
    <section id="work" aria-label={works.figLabel} className="relative py-[clamp(5rem,12vw,10rem)]">
      <div className="shell">
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <Reveal>
              <FigLabel fig={works.fig} label={works.figLabel} />
            </Reveal>
            <RevealTitle lines={titleLines} className="display mt-6 text-[clamp(3.75rem,15vw,13rem)]" />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:pb-5">
            <p className="max-w-sm text-base leading-relaxed text-ink-soft sm:text-lg">{works.intro}</p>
          </Reveal>
        </header>

        <div className="mt-[clamp(2rem,6vw,5rem)] lg:grid lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] lg:gap-10 xl:gap-16">
          <StackCounter
            active={state.index}
            dir={state.dir}
            total={total}
            name={featuredProjects[state.index]?.name ?? ""}
            progress={scrollYProgress}
            reduced={reduced}
          />

          <ol
            ref={stackRef}
            className="relative m-0 list-none p-0 [--stack-step:0.5rem] [--stack-top:3.5rem] lg:[--stack-step:0.875rem] lg:[--stack-top:2rem]"
          >
            {featuredProjects.map((project, index) => (
              <StackCard
                key={project.slug}
                project={project}
                index={index}
                total={total}
                progress={scrollYProgress}
                reduced={reduced}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
