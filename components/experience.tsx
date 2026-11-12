"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { experience, tintVar } from "@/lib/content";
import type { ExperienceItem } from "@/lib/content";
import { cn } from "@/lib/cn";
import FigLabel from "@/components/ui/fig-label";
import PillButton from "@/components/ui/pill-button";
import { Reveal, RevealTitle } from "@/components/ui/reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

type FileKind = ExperienceItem["file"]["kind"];

const items: ExperienceItem[] = experience.items;
const total = items.length;

const pad = (value: number) => String(value).padStart(2, "0");
const stepId = (index: number) => `experience-step-${pad(index + 1)}`;

/* Scalar fields shown in the mock files — real keys of the content object. */
const FIELD_KEYS = ["badge", "role", "company"] as const satisfies readonly (keyof ExperienceItem)[];
const LIST_KEY = "bullets" as const satisfies keyof ExperienceItem;

/** "hr-system.tsx" -> "hrSystem" (identifier for the mock code view). */
function toIdentifier(fileName: string) {
  const base = fileName.replace(/\.[^.]+$/, "");
  return base.replace(/[^a-zA-Z0-9]+(.)?/g, (_match, next: string | undefined) =>
    next ? next.toUpperCase() : "",
  );
}

/* ── Small icons ──────────────────────────────────────────────────────── */

function KindIcon({ kind, className }: { kind: FileKind | "download"; className?: string }) {
  const common = {
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
  switch (kind) {
    case "code":
      return (
        <svg {...common}>
          <path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5" />
        </svg>
      );
    case "sheet":
      return (
        <svg {...common}>
          <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
          <path d="M2.5 6.5h11M2.5 10h11M6.5 2.5v11" />
        </svg>
      );
    case "table":
      return (
        <svg {...common}>
          <path d="M3 4h10M3 8h10M3 12h10" />
        </svg>
      );
    case "doc":
      return (
        <svg {...common}>
          <path d="M4 2.5h5l3 3v8H4z" />
          <path d="M9 2.5v3h3M6.25 9h3.5M6.25 11.25h3.5" />
        </svg>
      );
    case "download":
      return (
        <svg {...common}>
          <path d="M8 2.5v7.5M4.75 7 8 10.25 11.25 7M3 13.5h10" />
        </svg>
      );
  }
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="m3.5 8.5 3 3 6-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Mock file views (built only from the item's own content) ─────────── */

type TokenType = "kw" | "id" | "key" | "str" | "punc";
interface Token {
  type: TokenType;
  value: string;
}
interface CodeLine {
  indent: number;
  tokens: Token[];
}

const tokenClass: Record<TokenType, string> = {
  kw: "text-accent-ink",
  id: "text-ink font-semibold",
  key: "text-sage-ink",
  str: "text-ink",
  punc: "text-ink-soft",
};

function buildCodeLines(item: ExperienceItem): CodeLine[] {
  const str = (value: string): Token => ({ type: "str", value: JSON.stringify(value) });
  const punc = (value: string): Token => ({ type: "punc", value });

  return [
    {
      indent: 0,
      tokens: [
        { type: "kw", value: "export const " },
        { type: "id", value: toIdentifier(item.file.name) },
        punc(" = {"),
      ],
    },
    ...FIELD_KEYS.map(
      (key): CodeLine => ({
        indent: 1,
        tokens: [{ type: "key", value: key }, punc(": "), str(item[key]), punc(",")],
      }),
    ),
    { indent: 1, tokens: [{ type: "key", value: LIST_KEY }, punc(": [")] },
    ...item[LIST_KEY].map((bullet): CodeLine => ({ indent: 2, tokens: [str(bullet), punc(",")] })),
    { indent: 1, tokens: [punc("],")] },
    { indent: 0, tokens: [punc("};")] },
  ];
}

function FileSurface({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "h-full overflow-hidden rounded-2xl border border-ink/10 bg-card shadow-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CodeFile({ item }: { item: ExperienceItem }) {
  const lines = buildCodeLines(item);
  return (
    <FileSurface className="py-4 font-mono text-[0.78rem] leading-[1.75] xl:text-[0.82rem]">
      {lines.map((line, index) => (
        <div key={index} className="grid grid-cols-[2.75rem_minmax(0,1fr)] pr-5">
          <span className="pr-3 text-right text-ink-soft/60 select-none">{index + 1}</span>
          <span
            className="break-words whitespace-pre-wrap"
            style={{ paddingLeft: `${line.indent * 2}ch` }}
          >
            {line.tokens.map((token, tokenIndex) => (
              <span key={tokenIndex} className={tokenClass[token.type]}>
                {token.value}
              </span>
            ))}
          </span>
        </div>
      ))}
    </FileSurface>
  );
}

function SheetFile({ item }: { item: ExperienceItem }) {
  const columns = ["", ...Array.from({ length: 3 }, (_, index) => String.fromCharCode(65 + index))];
  const grid = "grid grid-cols-[2rem_6.25rem_minmax(0,1fr)_2.75rem]";
  const cell = "border-r border-b border-line px-2.5 py-2";

  return (
    <FileSurface className="text-[0.8rem] leading-snug">
      <div className={cn(grid, "label-mono bg-bg text-ink-soft")}>
        {columns.map((column, index) => (
          <span key={index} className={cn(cell, "py-1.5 text-center last:border-r-0")}>
            {column}
          </span>
        ))}
      </div>
      <div className={cn(grid, "font-semibold")} style={{ backgroundColor: tintVar(item.tint) }}>
        <span className={cn(cell, "label-mono bg-bg text-center font-normal text-ink-soft")}>1</span>
        <span className={cn(cell, "label-mono self-stretch")}>{item.badge}</span>
        <span className={cell}>
          {item.role} <span className="font-normal text-ink-soft">/ {item.company}</span>
        </span>
        <span className={cn(cell, "border-r-0")} />
      </div>
      {item.bullets.map((bullet, index) => (
        <div key={index} className={grid}>
          <span className={cn(cell, "label-mono bg-bg text-center text-ink-soft")}>{index + 2}</span>
          <span className={cn(cell, "font-mono text-ink-soft")}>{pad(index + 1)}</span>
          <span className={cell}>{bullet}</span>
          <span className={cn(cell, "grid place-items-center border-r-0")}>
            <span className="grid size-5 place-items-center rounded-md bg-mint text-sage-ink">
              <CheckIcon className="size-3.5" />
            </span>
          </span>
        </div>
      ))}
    </FileSurface>
  );
}

function TableFile({ item }: { item: ExperienceItem }) {
  return (
    <FileSurface className="font-mono text-[0.76rem] leading-relaxed xl:text-[0.8rem]">
      <div
        className="grid grid-cols-[0.7fr_1.1fr_1.4fr] border-b border-line"
        style={{ backgroundColor: tintVar(item.tint) }}
      >
        {FIELD_KEYS.map((key) => (
          <span key={key} className="label-mono border-r border-ink/10 px-3 py-2 last:border-r-0">
            {key}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-[0.7fr_1.1fr_1.4fr] border-b border-line font-semibold">
        {FIELD_KEYS.map((key) => (
          <span
            key={key}
            className="border-r border-dashed border-line px-3 py-2.5 break-words last:border-r-0"
          >
            {item[key]}
          </span>
        ))}
      </div>
      {item.bullets.map((bullet, index) => (
        <div
          key={index}
          className="grid grid-cols-[2.75rem_minmax(0,1fr)] border-b border-dashed border-line odd:bg-bg/70"
        >
          <span className="px-3 py-2.5 text-right text-ink-soft/70">{index + 1}</span>
          <span className="py-2.5 pr-4">
            <span className="text-accent-ink">,</span>
            {JSON.stringify(bullet)}
          </span>
        </div>
      ))}
    </FileSurface>
  );
}

function DocFile({ item }: { item: ExperienceItem }) {
  return (
    <div className="grid h-full place-items-start justify-items-center overflow-hidden pt-2">
      <div className="relative w-[min(100%,26rem)] -rotate-[1.25deg] rounded-md border border-ink/10 bg-card px-7 pt-7 pb-9 shadow-lift">
        <span
          aria-hidden="true"
          className="absolute top-0 right-0 size-7 rounded-bl-md border-b border-l border-ink/10"
          style={{ backgroundColor: tintVar(item.tint) }}
        />
        <p className="label-mono text-ink-soft">{item.badge}</p>
        <p className="display mt-3 text-[2rem] xl:text-[2.4rem]">{item.role}</p>
        <p className="mt-2 text-sm font-semibold">{item.company}</p>
        <span aria-hidden="true" className="mt-4 block h-px bg-line" />
        <div className="mt-4 space-y-3 text-[0.82rem] leading-relaxed text-ink-soft">
          {item.bullets.map((bullet, index) => (
            <p key={index}>{bullet}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockFile({ item }: { item: ExperienceItem }) {
  switch (item.file.kind) {
    case "code":
      return <CodeFile item={item} />;
    case "sheet":
      return <SheetFile item={item} />;
    case "table":
      return <TableFile item={item} />;
    case "doc":
      return <DocFile item={item} />;
  }
}

/* ── Sticky file window (desktop) ─────────────────────────────────────── */

function FilePanel({
  active,
  reduced,
  onSelect,
}: {
  active: number;
  reduced: boolean;
  onSelect: (index: number) => void;
}) {
  const item = items[active];
  const tabsRef = useRef<HTMLDivElement>(null);

  // Keep the active tab visible inside the horizontally scrollable tab strip.
  useEffect(() => {
    const strip = tabsRef.current;
    const tab = strip?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!strip || !tab) return;
    strip.scrollTo({ left: Math.max(0, tab.offsetLeft - 24), behavior: reduced ? "auto" : "smooth" });
  }, [active, reduced]);

  const tabBase =
    "label-mono flex shrink-0 items-center gap-2 rounded-t-xl px-3.5 pt-2.5 pb-2 tracking-[0.06em] normal-case transition-colors duration-300";

  return (
    <div
      className="flex h-[min(70vh,42rem)] min-h-[27rem] flex-col overflow-hidden rounded-[2rem] border border-ink/10 shadow-lift transition-colors duration-700 ease-out-expo"
      style={{ backgroundColor: tintVar(item.tint) }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-4 px-5 pt-4 pb-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-accent" />
          <span className="size-2.5 rounded-full bg-butter ring-1 ring-ink/10" />
          <span className="size-2.5 rounded-full bg-sage" />
        </span>
        <span aria-hidden="true" className="label-mono min-w-0 flex-1 truncate text-center normal-case">
          {item.file.name}
        </span>
        <span aria-hidden="true" className="label-mono tabular-nums">
          {pad(active + 1)}
          <span className="text-ink-soft">/{pad(total)}</span>
        </span>
      </div>

      {/* File tabs */}
      <div
        ref={tabsRef}
        role="group"
        aria-label={experience.figLabel}
        className="flex gap-1 overflow-x-auto px-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((entry, index) => {
          const isActive = index === active;
          return (
            <button
              key={entry.file.name}
              type="button"
              data-tab={index}
              aria-current={isActive ? "step" : undefined}
              onClick={() => onSelect(index)}
              className={cn(
                tabBase,
                isActive ? "bg-card/80 text-ink" : "text-ink-soft hover:bg-card/40 hover:text-ink",
              )}
            >
              <KindIcon kind={entry.file.kind} className="size-3.5" />
              {entry.file.name}
            </button>
          );
        })}
        <a
          href={experience.cvFile.href}
          download
          aria-label={experience.cvFile.label}
          className={cn(tabBase, "text-ink-soft hover:bg-card/40 hover:text-ink")}
        >
          <KindIcon kind="download" className="size-3.5" />
          {experience.cvFile.name}
        </a>
      </div>

      {/* Body — a visual echo of the active step, hidden from assistive tech */}
      <div aria-hidden="true" className="relative min-h-0 flex-1 bg-card/80 p-4">
        {reduced ? (
          <div key={active} className="h-full">
            <MockFile item={item} />
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              className="h-full will-change-transform"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              <MockFile item={item} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Persistent CV row */}
      <div className="flex items-center justify-between gap-4 border-t border-ink/10 bg-card px-5 py-3.5">
        <span className="label-mono flex min-w-0 items-center gap-2.5 normal-case">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-bg">
            <KindIcon kind="doc" className="size-4" />
          </span>
          <span className="truncate">{experience.cvFile.name}</span>
        </span>
        <PillButton href={experience.cvFile.href} size="sm" download>
          {experience.cvFile.label}
        </PillButton>
      </div>
    </div>
  );
}

/* ── One numbered step ────────────────────────────────────────────────── */

function Step({
  item,
  index,
  active,
  reduced,
}: {
  item: ExperienceItem;
  index: number;
  active: boolean;
  reduced: boolean;
}) {
  const tint = tintVar(item.tint);

  return (
    <article
      className={cn(
        "max-lg:card relative max-lg:overflow-hidden max-lg:p-6 sm:max-lg:p-8",
        "lg:flex lg:min-h-[74vh] lg:flex-col lg:justify-center lg:py-10",
        "lg:transition-opacity lg:duration-500",
        !reduced && !active && "lg:opacity-35",
      )}
    >
      {/* Mobile: tinted strip behind the number row */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-28 sm:h-36 lg:hidden"
        style={{ backgroundColor: tint }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="relative inline-block">
          <span
            aria-hidden="true"
            className={cn(
              "absolute -inset-x-3 top-[18%] bottom-[8%] hidden origin-left -rotate-2 rounded-xl lg:block",
              "transition-transform duration-700 ease-out-expo",
              active || reduced ? "scale-x-100" : "scale-x-0",
            )}
            style={{ backgroundColor: tint }}
          />
          <span
            aria-hidden="true"
            className={cn(
              "display relative block text-[clamp(4rem,16vw,6rem)] transition-colors duration-500 lg:text-[clamp(6rem,10vw,10rem)]",
              active ? "lg:text-accent-ink" : "text-ink",
            )}
          >
            {pad(index + 1)}
          </span>
        </span>

        {/* Compact file chip (mobile / tablet) */}
        <span className="label-mono mt-1 inline-flex max-w-[60%] items-center gap-2 rounded-full border border-ink/10 bg-card px-3 py-1.5 normal-case shadow-soft lg:hidden">
          <KindIcon kind={item.file.kind} className="size-3.5 shrink-0" />
          <span className="truncate">{item.file.name}</span>
        </span>
      </div>

      <div className="relative mt-6 lg:mt-8">
        <span
          className="label-mono inline-flex items-center gap-2 rounded-full border border-ink/10 px-3 py-1"
          style={{ backgroundColor: tint }}
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-ink" />
          {item.badge}
        </span>

        <h3 className="display mt-4 text-[clamp(2.1rem,8vw,3.25rem)] lg:text-[clamp(2.75rem,4.4vw,4.5rem)]">
          {item.role}
        </h3>
        <p className="mt-3 text-base font-semibold sm:text-lg">{item.company}</p>

        <ul className="mt-6 max-w-xl space-y-3 border-t border-line pt-6 text-[0.95rem] leading-relaxed text-ink-soft lg:text-base">
          {item.bullets.map((bullet, bulletIndex) => (
            <li key={bulletIndex} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2">
              <span aria-hidden="true" className="label-mono pt-[0.3em] text-ink-soft/80">
                {pad(bulletIndex + 1)}
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ── Section ──────────────────────────────────────────────────────────── */

export default function Experience() {
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  // Active step = the one crossing the viewport's centre band.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const steps = Array.from(list.querySelectorAll<HTMLElement>("[data-step]"));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.step);
          setActive((current) => (current === index ? current : index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  const scrollToStep = useCallback(
    (index: number) => {
      document
        .getElementById(stepId(index))
        ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    },
    [reduced],
  );

  return (
    <section id="experience" className="overflow-x-clip py-[clamp(5rem,11vw,10rem)]">
      <div className="shell">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-16">
          <div>
            <Reveal>
              <FigLabel fig={experience.fig} label={experience.figLabel} />
            </Reveal>
            <RevealTitle
              lines={experience.heading}
              className="display mt-6 text-[clamp(3rem,11.5vw,10rem)]"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-md text-lg leading-relaxed text-ink-soft lg:pb-3 lg:text-xl">
              {experience.intro}
            </p>
          </Reveal>
        </header>

        <div className="mt-12 lg:mt-20 lg:grid lg:grid-cols-[minmax(0,1fr)_2px_minmax(0,1.05fr)] lg:gap-x-12 xl:gap-x-20">
          <ol ref={listRef} className="space-y-5 sm:space-y-6 lg:space-y-0">
            {items.map((item, index) => (
              <li key={item.file.name} id={stepId(index)} data-step={index}>
                <Reveal delay={0.04}>
                  <Step item={item} index={index} active={index === active} reduced={reduced} />
                </Reveal>
              </li>
            ))}
          </ol>

          {/* Progress rail */}
          <div aria-hidden="true" className="relative hidden rounded-full bg-line lg:block">
            <motion.span
              className="absolute inset-0 origin-top rounded-full bg-accent will-change-transform"
              style={{ scaleY: reduced ? scrollYProgress : smoothProgress }}
            />
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+1.5rem)]">
              <FilePanel active={active} reduced={reduced} onSelect={scrollToStep} />
            </div>
          </div>
        </div>

        {/* CV download for small screens (the panel footer is desktop-only) */}
        <Reveal className="mt-8 flex items-center justify-between gap-4 rounded-full border border-line bg-card py-2 pr-2 pl-5 shadow-soft lg:hidden">
          <span className="label-mono flex min-w-0 items-center gap-2 normal-case">
            <KindIcon kind="doc" className="size-4 shrink-0" />
            <span className="truncate">{experience.cvFile.name}</span>
          </span>
          <PillButton href={experience.cvFile.href} size="sm" download>
            {experience.cvFile.label}
          </PillButton>
        </Reveal>
      </div>
    </section>
  );
}
