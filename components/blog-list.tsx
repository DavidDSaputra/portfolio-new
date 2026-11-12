"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import FigLabel from "@/components/ui/fig-label";
import Marquee from "@/components/ui/marquee";
import PillButton, { ArrowIcon } from "@/components/ui/pill-button";
import { Reveal, RevealTitle } from "@/components/ui/reveal";
import { blogPage, blogPosts, getBlogPost, type BlogPost } from "@/lib/blog-content";
import { blog, tintVar } from "@/lib/content";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Article HTML helpers ─────────────────────────────────────────────────
   The legacy bodies are plain authored HTML. Code samples (<pre><code>) are
   lifted out so they can get a copy button and be rendered as literal text
   (the samples contain raw "<commit-hash>" style placeholders that would
   otherwise be swallowed as unknown tags). Everything else is injected as-is. */

type Segment = { kind: "html"; html: string } | { kind: "code"; code: string };

const CODE_BLOCK = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;

function decodeEntities(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function splitArticle(html: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;
  for (const match of html.matchAll(CODE_BLOCK)) {
    const start = match.index ?? 0;
    const before = html.slice(cursor, start);
    if (before.trim()) segments.push({ kind: "html", html: before });
    segments.push({ kind: "code", code: decodeEntities(match[1] ?? "") });
    cursor = start + match[0].length;
  }
  const rest = html.slice(cursor);
  if (rest.trim()) segments.push({ kind: "html", html: rest });
  return segments;
}

/** First code sample of a post, trimmed to a few lines for the card sticker. */
function firstSnippet(html: string, maxLines = 7): string[] {
  CODE_BLOCK.lastIndex = 0;
  const match = CODE_BLOCK.exec(html);
  CODE_BLOCK.lastIndex = 0;
  if (!match) return [];
  return decodeEntities(match[1] ?? "")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .slice(0, maxLines);
}

/* Scoped typography for injected article HTML. */
const PROSE = cn(
  "blog-prose text-[0.98rem] leading-[1.75] text-ink sm:text-[1.02rem]",
  "[&_h1]:display [&_h1]:mb-5 [&_h1]:text-[clamp(1.9rem,5.2vw,3.1rem)] [&_h1]:leading-[0.98] [&_h1]:text-balance",
  "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-sans [&_h2]:text-[1.3rem] [&_h2]:leading-snug [&_h2]:font-bold [&_h2]:tracking-[-0.01em] sm:[&_h2]:text-[1.45rem]",
  "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-mono [&_h3]:text-[0.74rem] [&_h3]:font-medium [&_h3]:tracking-[0.12em] [&_h3]:text-sage-ink [&_h3]:uppercase",
  "[&_p]:mb-4 [&_p]:text-ink-soft [&_h1+p]:text-[1.08rem] [&_h1+p]:text-ink",
  "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-ink-soft [&_ul]:marker:text-accent",
  "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_ol]:text-ink-soft [&_ol]:marker:font-mono [&_ol]:marker:text-[0.8em] [&_ol]:marker:text-sage-ink",
  "[&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink",
  "[&_code]:rounded-md [&_code]:border [&_code]:border-line [&_code]:bg-card [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.84em] [&_code]:break-words [&_code]:text-ink",
  "[&_a]:font-medium [&_a]:text-accent-ink [&_a]:underline [&_a]:decoration-accent [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a]:hover:text-ink",
  "[&_blockquote]:my-6 [&_blockquote]:rounded-2xl [&_blockquote]:border [&_blockquote]:border-line [&_blockquote]:bg-butter [&_blockquote]:px-5 [&_blockquote]:py-4",
  "[&_img]:my-6 [&_img]:h-auto [&_img]:rounded-2xl [&_img]:border [&_img]:border-line [&_img]:shadow-soft",
  "[&_hr]:my-8 [&_hr]:border-line",
  "[&_table]:my-6 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-[0.9rem]",
  "[&_th]:border-b [&_th]:border-line [&_th]:bg-card [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-mono [&_th]:text-[0.72rem] [&_th]:tracking-[0.1em] [&_th]:uppercase",
  "[&_td]:border-b [&_td]:border-line [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",
  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
);

/* ── Small icons ──────────────────────────────────────────────────────── */

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={d} />
    </svg>
  );
}

const ICON_COPY =
  "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z";
const ICON_CHECK = "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z";

const SHARE_TARGETS = [
  {
    name: "X / Twitter",
    href: (url: string, text: string) => `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    name: "Facebook",
    href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    name: "LinkedIn",
    href: (url: string, text: string) =>
      `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`,
    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    name: "WhatsApp",
    href: (url: string, text: string) => `https://wa.me/?text=${text}%20${url}`,
    icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  },
] as const;

/* Copy-to-clipboard with a short "copied" state. */
function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback((text: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        if (timer.current !== null) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 2000);
      },
      () => undefined,
    );
  }, []);

  return { copied, copy };
}

/* ── Code block ("file tab" window, cream on ink) ─────────────────────── */

function CodeBlock({ code }: { code: string }) {
  const { copied, copy } = useCopy();

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-ink bg-ink text-bg shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-bg/10 py-2 pr-2 pl-4">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-pink" />
          <span className="size-2.5 rounded-full bg-butter" />
          <span className="size-2.5 rounded-full bg-mint" />
        </span>
        <button
          type="button"
          onClick={() => copy(code)}
          className={cn(
            "label-mono inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[0.64rem]",
            "transition-colors duration-300 focus-visible:outline-bg",
            copied
              ? "border-mint bg-mint text-ink"
              : "border-bg/25 bg-bg/10 text-bg hover:bg-bg hover:text-ink",
          )}
        >
          <Icon d={copied ? ICON_CHECK : ICON_COPY} className="size-3" />
          <span aria-live="polite">{copied ? blogPage.code.copiedLabel : blogPage.code.copyLabel}</span>
        </button>
      </div>
      <pre className="overflow-x-auto overscroll-x-contain px-4 py-4 font-mono text-[0.8rem] leading-[1.7] sm:px-5 sm:text-[0.84rem]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ── Share row ────────────────────────────────────────────────────────── */

function ShareRow({ post }: { post: BlogPost }) {
  const { copied, copy } = useCopy();
  // The dialog only ever mounts on the client, so window is available.
  const [pageUrl] = useState(
    () => `${window.location.origin}${window.location.pathname}#${post.id}`,
  );
  const url = encodeURIComponent(pageUrl);
  const text = encodeURIComponent(post.title + blogPage.share.textSuffix);

  const pill = cn(
    "label-mono inline-flex h-9 items-center gap-2 rounded-full border border-line bg-card px-3.5 text-[0.66rem] text-ink",
    "transition-[transform,border-color,box-shadow] duration-500 ease-out-expo",
    "hover:-translate-y-0.5 hover:border-ink hover:shadow-soft",
  );

  return (
    <ul className="mb-8 flex flex-wrap gap-2 border-b border-line pb-6">
      {SHARE_TARGETS.map((target) => (
        <li key={target.name}>
          <a
            href={target.href(url, text)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${blogPage.share.label} — ${target.name}`}
            className={pill}
          >
            <Icon d={target.icon} className="size-3.5" />
            {blogPage.share.label}
          </a>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={() => copy(pageUrl)}
          className={cn(pill, copied && "border-sage bg-mint")}
        >
          <Icon d={copied ? ICON_CHECK : ICON_COPY} className="size-3.5" />
          <span aria-live="polite">
            {copied ? blogPage.share.copiedLabel : blogPage.share.copyLabel}
          </span>
        </button>
      </li>
    </ul>
  );
}

/* ── Article dialog ───────────────────────────────────────────────────── */

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ArticleDialog({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  const reduced = useReducedMotion();
  // False as soon as the exit animation starts: the dialog is still mounted
  // but must stop locking scroll, trapping focus and swallowing clicks.
  const isPresent = useIsPresent();
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const segments = useMemo(() => splitArticle(post.html), [post.html]);

  const { scrollYProgress } = useScroll({ container: bodyRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });

  // Initial focus.
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  // Scroll lock (the overlay carries data-lenis-prevent, so Lenis ignores
  // wheel/touch inside it; this stops native + keyboard page scrolling).
  // Released when the exit starts, and cleared rather than restored from a
  // snapshot so overlapping locks can never leave the page stuck. --sbw keeps
  // the fixed header from shifting (same contract as the header menu lock).
  useEffect(() => {
    if (!isPresent) return;
    const root = document.documentElement;
    const scrollbar = Math.max(0, window.innerWidth - root.clientWidth);
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    root.style.setProperty("--sbw", `${scrollbar}px`);
    return () => {
      root.style.overflow = "";
      root.style.paddingRight = "";
      root.style.removeProperty("--sbw");
    };
  }, [isPresent]);

  // Escape + focus trap (only while open, not during the exit animation).
  useEffect(() => {
    if (!isPresent) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      const current = document.activeElement;
      if (!panel.contains(current)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, isPresent]);

  const instant = { duration: 0 };

  return (
    <div
      data-lenis-prevent
      className={cn(
        "fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6 lg:p-10",
        !isPresent && "pointer-events-none",
      )}
    >
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-ink/45 backdrop-blur-[6px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={reduced ? instant : { duration: 0.5, ease: EASE }}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={post.title}
        className={cn(
          "relative flex w-full max-w-[52rem] flex-col overflow-hidden border border-line bg-bg shadow-lift",
          "h-[94dvh] rounded-t-[1.75rem] sm:h-auto sm:max-h-[min(90dvh,60rem)] sm:rounded-[2rem]",
        )}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 64, scale: 0.97 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
        transition={reduced ? instant : { duration: 0.7, ease: EASE }}
      >
        <header
          className="relative flex shrink-0 items-center justify-between gap-3 border-b border-line py-3 pr-3 pl-5 sm:pl-7"
          style={{ backgroundColor: tintVar(post.tint) }}
        >
          <p className="label-mono flex min-w-0 items-center gap-2.5 text-ink">
            <span className="shrink-0">
              {blogPage.dialog.kicker} <span aria-hidden="true">·</span> {post.number}
            </span>
            <span className="truncate rounded-full border border-ink/15 bg-card/70 px-2.5 py-1 text-[0.64rem]">
              {post.tag}
            </span>
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={blogPage.dialog.closeLabel}
            className={cn(
              "group/close grid size-10 shrink-0 place-items-center rounded-full border border-ink/15 bg-card text-ink",
              "transition-colors duration-300 hover:bg-ink hover:text-bg",
            )}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="size-3.5 transition-transform duration-500 ease-out-expo group-hover/close:rotate-90"
            >
              <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          {/* Reading progress */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-px h-[3px] origin-left bg-accent"
            style={{ scaleX: reduced ? scrollYProgress : smoothProgress }}
          />
        </header>

        <div
          ref={bodyRef}
          data-lenis-prevent
          tabIndex={0}
          className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-5 pt-7 pb-12 focus-visible:outline-offset-[-4px] sm:px-10 sm:pt-9 sm:pb-14"
        >
          <ShareRow post={post} />
          <article>
            {segments.map((segment, index) =>
              segment.kind === "code" ? (
                <CodeBlock key={index} code={segment.code} />
              ) : (
                <div key={index} className={PROSE} dangerouslySetInnerHTML={{ __html: segment.html }} />
              ),
            )}
          </article>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Post card ────────────────────────────────────────────────────────── */

function PostCard({
  post,
  featured,
  onOpen,
  registerTrigger,
}: {
  post: BlogPost;
  featured: boolean;
  onOpen: (id: string) => void;
  registerTrigger: (id: string, node: HTMLButtonElement | null) => void;
}) {
  const snippet = useMemo(() => (featured ? firstSnippet(post.html) : []), [featured, post.html]);
  const tint = tintVar(post.tint);

  return (
    <article
      className={cn(
        "group card relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-8",
        "transition-[transform,box-shadow,border-color] duration-700 ease-out-expo",
        "hover:-translate-y-1.5 hover:border-ink/15 hover:shadow-lift motion-reduce:transform-none",
        featured && "md:min-h-[22rem] md:flex-row md:items-stretch md:gap-10 lg:p-10",
      )}
    >
      {/* Tint blob that swells on hover */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-20 -right-20 size-56 rounded-full",
          "transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.35] motion-reduce:transform-none",
        )}
        style={{ backgroundColor: tint }}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3">
          <span className="label-mono text-ink-soft">{post.number}</span>
          <span
            className="label-mono rounded-full border border-ink/10 px-3 py-1.5 text-[0.66rem] whitespace-nowrap text-ink"
            style={{ backgroundColor: tint }}
          >
            {post.tag}
          </span>
        </div>

        <h2
          className={cn(
            "display mt-8 text-[clamp(1.6rem,5.4vw,2.2rem)] leading-[1.02] text-balance sm:mt-10",
            featured && "md:text-[clamp(2.2rem,4vw,3.4rem)]",
          )}
        >
          <button
            ref={(node) => registerTrigger(post.id, node)}
            type="button"
            aria-haspopup="dialog"
            onClick={() => onOpen(post.id)}
            className={cn(
              "text-left uppercase after:absolute after:inset-0 after:rounded-[1.75rem]",
              "focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-ink",
            )}
          >
            {post.title}
          </button>
        </h2>

        <p className={cn("mt-4 max-w-[46ch] text-[0.98rem] leading-relaxed text-ink-soft", featured && "md:text-[1.05rem]")}>
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-8">
          <span className="label-mono text-ink">{blogPage.readLabel}</span>
          <span
            aria-hidden="true"
            className={cn(
              "grid size-11 -rotate-45 place-items-center rounded-full border border-ink/10 text-ink",
              "transition-[transform,background-color,color] duration-500 ease-out-expo",
              "group-hover:rotate-0 group-hover:bg-ink! group-hover:text-bg group-focus-within:rotate-0",
              "motion-reduce:rotate-0",
            )}
            style={{ backgroundColor: tint }}
          >
            <ArrowIcon className="size-4" />
          </span>
        </div>
      </div>

      {/* Featured card: tilted "file tab" window with the article's first snippet */}
      {featured && snippet.length > 0 && (
        <div aria-hidden="true" className="relative hidden w-[42%] max-w-[26rem] shrink-0 items-center md:flex">
          <div
            className={cn(
              "w-full rotate-[2.5deg] overflow-hidden rounded-2xl border border-ink bg-ink text-bg shadow-lift",
              "transition-transform duration-700 ease-out-expo group-hover:-translate-y-1 group-hover:rotate-[1deg] motion-reduce:transform-none",
            )}
          >
            <div className="flex items-center gap-3 border-b border-bg/10 px-4 py-2.5">
              <span className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-pink" />
                <span className="size-2.5 rounded-full bg-butter" />
                <span className="size-2.5 rounded-full bg-mint" />
              </span>
              <span className="label-mono truncate text-[0.62rem] text-bg/70">{post.tag}</span>
            </div>
            <pre className="overflow-hidden px-4 py-4 font-mono text-[0.74rem] leading-[1.75]">
              {snippet.map((line, index) => (
                <span key={index} className={cn("block truncate", line.trimStart().startsWith("#") && "text-bg/50")}>
                  {line}
                </span>
              ))}
            </pre>
          </div>
        </div>
      )}
    </article>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────── */

const STICKER_SPOTS = [
  "top-0 left-4 -rotate-6",
  "top-3 right-0 rotate-[5deg]",
  "top-[4.5rem] left-16 rotate-3",
  "top-[8.5rem] left-0 -rotate-3",
  "top-[8rem] right-4 rotate-[8deg]",
  "top-[12.5rem] left-24 -rotate-[5deg]",
];

function BlogHero() {
  const count = String(blogPosts.length).padStart(2, "0");

  return (
    <section className="overflow-hidden pt-[calc(var(--header-h)+clamp(2.5rem,7vw,5.5rem))] pb-[clamp(2.5rem,6vw,4.5rem)]">
      <div className="shell">
        <Reveal y={16}>
          <FigLabel fig={blogPage.kicker.fig} label={blogPage.kicker.label} />
        </Reveal>

        <RevealTitle
          as="h1"
          immediate
          delay={0.1}
          lines={blogPage.headingLines}
          className="display mt-6 text-[clamp(1.85rem,9vw,9rem)] sm:mt-8"
        />

        <div className="mt-8 grid items-start gap-10 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <Reveal delay={0.35} className="max-w-[38rem]">
            <p className="text-[clamp(1.05rem,1.6vw,1.3rem)] leading-relaxed text-ink">{blogPage.lede}</p>
            <p className="label-mono mt-7 inline-flex items-center gap-3 rounded-full border border-line bg-card py-2 pr-4 pl-2 text-ink shadow-soft">
              <span className="grid h-7 min-w-7 place-items-center rounded-full bg-butter px-2">{count}</span>
              <span>
                <span className="sr-only">{blogPosts.length} </span>
                {blogPage.countLabel}
              </span>
            </p>
          </Reveal>

          {/* Topic stickers */}
          <Reveal delay={0.5} className="hidden lg:block">
            <ul aria-hidden="true" className="relative h-[16rem] w-[24rem] xl:w-[27rem]">
              {blogPosts.map((post, index) => (
                <li
                  key={post.id}
                  className={cn("absolute", STICKER_SPOTS[index % STICKER_SPOTS.length])}
                >
                  <span
                    className="label-mono block animate-float rounded-full border border-ink/10 px-4 py-2.5 whitespace-nowrap text-ink shadow-soft"
                    style={{ backgroundColor: tintVar(post.tint), animationDelay: `${index * -1.3}s` }}
                  >
                    {post.tag}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Page body ────────────────────────────────────────────────────────── */

const hashToId = () => {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return "";
  }
};

export default function BlogList() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const activeRef = useRef<string | null>(null);
  /** True when the open article added its own history entry. */
  const pushedRef = useRef(false);
  const triggers = useRef(new Map<string, HTMLButtonElement>());

  const registerTrigger = useCallback((id: string, node: HTMLButtonElement | null) => {
    if (node) triggers.current.set(id, node);
    else triggers.current.delete(id);
  }, []);

  const show = useCallback((id: string | null) => {
    const previous = activeRef.current;
    activeRef.current = id;
    setActiveId(id);
    // Return focus to the card that opened the article.
    if (id === null && previous) triggers.current.get(previous)?.focus({ preventScroll: true });
  }, []);

  // Deep links: /blog#blog1 opens that article; back/forward keep in sync.
  useEffect(() => {
    setMounted(true);
    const sync = () => {
      const id = hashToId();
      const exists = Boolean(getBlogPost(id));
      if (!exists) pushedRef.current = false;
      show(exists ? id : null);
    };
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [show]);

  const open = useCallback(
    (id: string) => {
      if (activeRef.current === id) return;
      window.history.pushState(null, "", `#${id}`);
      pushedRef.current = true;
      show(id);
    },
    [show],
  );

  const close = useCallback(() => {
    if (activeRef.current === null) return;
    if (pushedRef.current) {
      // Pop our own entry so Back doesn't reopen the article.
      pushedRef.current = false;
      show(null);
      window.history.back();
    } else {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      show(null);
    }
  }, [show]);

  const activePost = activeId ? getBlogPost(activeId) : undefined;
  const tags = useMemo(() => blogPosts.map((post) => post.tag), []);

  let dialog: ReactNode = null;
  if (mounted) {
    dialog = createPortal(
      <AnimatePresence>
        {activePost && <ArticleDialog key={activePost.id} post={activePost} onClose={close} />}
      </AnimatePresence>,
      document.body,
    );
  }

  return (
    <>
      <BlogHero />

      <Marquee
        items={tags}
        duration={36}
        className="border-y border-line bg-card py-4 sm:py-5"
        itemClassName="display text-[clamp(1.4rem,3.2vw,2.4rem)] leading-none text-ink"
        separatorClassName="text-[clamp(1.1rem,2.4vw,1.8rem)]"
      />

      <section aria-label={blogPage.kicker.label} className="py-[clamp(3rem,7vw,6rem)]">
        <div className="shell">
          <ul className="grid gap-5 md:grid-cols-2 lg:gap-7">
            {blogPosts.map((post, index) => (
              <Reveal
                as="li"
                key={post.id}
                delay={(index % 2) * 0.08}
                className={cn(index === 0 && "md:col-span-2")}
              >
                <PostCard
                  post={post}
                  featured={index === 0}
                  onOpen={open}
                  registerTrigger={registerTrigger}
                />
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-[clamp(2.5rem,6vw,4.5rem)] flex justify-center border-t border-line pt-[clamp(2rem,5vw,3.5rem)]">
            <PillButton href={blog.backHome.href} variant="white">
              {blog.backHome.label}
            </PillButton>
          </Reveal>
        </div>
      </section>

      {dialog}
    </>
  );
}
