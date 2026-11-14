"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import FigLabel from "@/components/ui/fig-label";
import { ArrowIcon } from "@/components/ui/pill-button";
import { Reveal, RevealTitle } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { TINTS, projects, tintVar, works, type Project } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

const archive = works.archive;

type FilterKey = (typeof archive.filters)[number]["key"];

const pad = (value: number) => String(value).padStart(2, "0");

/* Stable tint per project, independent of the active filter. */
const tintBySlug = new Map(projects.map((project, index) => [project.slug, TINTS[index % TINTS.length]]));

function HeartIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 shrink-0 fill-accent">
      <path d="M8 14s-5.5-3.3-5.5-7.3A3 3 0 0 1 8 5a3 3 0 0 1 5.5 1.7C13.5 10.7 8 14 8 14Z" />
    </svg>
  );
}

function ArchiveCard({ project, index }: { project: Project; index: number }) {
  const tint = tintBySlug.get(project.slug) ?? TINTS[0];
  const contain = project.fit === "contain";
  const target = project.href ?? project.download;
  const interactive = Boolean(target);

  const className = cn(
    "group/card relative flex h-full flex-col rounded-[1.25rem] border border-line bg-card p-2 pb-3.5 shadow-soft sm:p-3 sm:pb-4",
    "transition-[translate,rotate,box-shadow] duration-700 ease-out-expo",
    index % 2 === 0 ? "-rotate-[1.5deg]" : "rotate-[1.5deg]",
    "hover:-translate-y-1.5 hover:rotate-0 hover:shadow-lift",
    interactive && "focus-visible:-translate-y-1.5 focus-visible:rotate-0 focus-visible:shadow-lift",
    "motion-reduce:transition-none",
  );

  const body = (
    <>
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-[0.85rem]"
        style={{ backgroundColor: tintVar(tint) }}
      >
        <img
          src={project.thumb}
          alt=""
          aria-hidden="true"
          width={480}
          height={360}
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute inset-0 size-full transition-transform duration-[900ms] ease-out-expo",
            "motion-reduce:transition-none motion-reduce:group-hover/card:scale-100",
            contain
              ? "object-contain p-2.5 drop-shadow-[0_8px_14px_rgb(19_52_88/0.22)] group-hover/card:scale-[1.05] sm:p-3.5"
              : "object-cover object-top group-hover/card:scale-[1.06]",
          )}
        />
        {interactive && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-2 right-2 grid size-8 scale-75 place-items-center rounded-[4px] border-[1.5px] border-ink bg-card text-ink opacity-0 shadow-[2px_2px_0_0_var(--color-ink)]",
              "transition-[opacity,scale,rotate] duration-500 ease-out-expo",
              "group-hover/card:scale-100 group-hover/card:opacity-100 group-focus-visible/card:scale-100 group-focus-visible/card:opacity-100",
              project.href ? "-rotate-45 group-hover/card:rotate-0" : "rotate-90",
            )}
          >
            <ArrowIcon className="size-3.5" />
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col px-1 sm:px-1.5">
        <p className="label-mono text-ink-soft">{project.tag}</p>
        <h3 className="mt-1.5 line-clamp-2 text-[0.92rem] leading-snug font-semibold text-balance sm:text-lg">
          {project.title}
        </h3>
        <p className="mt-1.5 line-clamp-3 text-[0.78rem] leading-relaxed text-ink-soft sm:line-clamp-4 sm:text-sm">
          {project.desc}
        </p>

        {(project.likes !== undefined || !project.href) && (
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
            {project.likes !== undefined && (
              <p className="label-mono flex items-center gap-1.5 text-ink-soft">
                <HeartIcon />
                <span>
                  {project.likes} {archive.likesLabel}
                </span>
              </p>
            )}
            {!project.href && (
              <p className="label-mono rounded-full border border-line bg-bg px-2.5 py-1 text-ink">
                {project.status}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );

  if (project.href) {
    return (
      <a href={project.href} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }
  if (project.download) {
    return (
      <a href={project.download} download className={className}>
        {body}
      </a>
    );
  }
  return <div className={className}>{body}</div>;
}

export default function WorksArchive() {
  const reduced = useReducedMotion() ?? false;
  const [filter, setFilter] = useState<FilterKey>("all");

  const counts = useMemo(() => {
    const map = new Map<FilterKey, number>();
    for (const item of archive.filters) {
      map.set(
        item.key,
        item.key === "all"
          ? projects.length
          : projects.filter((project) => project.categories.some((category) => category === item.key)).length,
      );
    }
    return map;
  }, []);

  const visible = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((project) => project.categories.some((category) => category === filter)),
    [filter],
  );

  const gridClass =
    "relative m-0 mt-8 grid list-none grid-cols-2 gap-x-3 gap-y-5 p-0 sm:mt-10 sm:gap-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-7";

  return (
    <section
      id="archive"
      aria-label={archive.figLabel}
      className="relative overflow-x-clip pb-[clamp(5rem,12vw,10rem)]"
    >
      <div className="shell">
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <Reveal>
              <FigLabel fig={archive.fig} label={archive.figLabel} />
            </Reveal>
            <RevealTitle lines={archive.heading} className="display mt-6 text-[clamp(3.25rem,12vw,10rem)]" />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:pb-4">
            <p className="max-w-sm text-base leading-relaxed text-ink-soft sm:text-lg">{archive.intro}</p>
          </Reveal>
        </header>

        <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line pt-6 sm:mt-12">
          <div role="group" aria-label={archive.figLabel} className="flex flex-wrap gap-2">
            {archive.filters.map((item) => {
              const on = item.key === filter;
              return (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(item.key)}
                  className={cn(
                    "tab tab-press relative isolate inline-flex h-11 items-center gap-2 px-4 text-sm font-semibold",
                    on ? "text-bg" : "bg-card text-ink",
                  )}
                >
                  {on &&
                    (reduced ? (
                      <span aria-hidden="true" className="absolute inset-0 -z-10 rounded-[4.5px] bg-ink" />
                    ) : (
                      <motion.span
                        aria-hidden="true"
                        layoutId="archive-filter-pill"
                        className="absolute inset-0 -z-10 rounded-[4.5px] bg-ink"
                        transition={{ duration: 0.6, ease: EASE }}
                      />
                    ))}
                  <span>{item.label}</span>
                  <span className={cn("font-mono text-[0.7rem]", on ? "text-bg/75" : "text-ink-soft")}>
                    {pad(counts.get(item.key) ?? 0)}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="label-mono text-ink-soft" aria-live="polite">
            <span className="text-ink">{pad(visible.length)}</span> {archive.countLabel}
          </p>
        </Reveal>

        {reduced ? (
          <ul className={gridClass}>
            {visible.map((project, index) => (
              <li key={project.slug}>
                <ArchiveCard project={project} index={index} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className={gridClass}>
            <AnimatePresence mode="popLayout">
              {visible.map((project, index) => (
                <motion.li
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.3, ease: EASE } }}
                  viewport={{ once: true, margin: "0px 0px -6% 0px" }}
                  transition={{
                    duration: 0.7,
                    ease: EASE,
                    /* Stagger per row only, so late cards never wait long. */
                    delay: (index % 4) * 0.06,
                    layout: { duration: 0.6, ease: EASE },
                  }}
                >
                  <ArchiveCard project={project} index={index} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </section>
  );
}
