"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import type { Variants } from "motion/react";
import LocalTime from "@/components/ui/local-time";
import PillButton, { ArrowIcon } from "@/components/ui/pill-button";
import { cn } from "@/lib/cn";
import { TINTS, contact, footer, nav, site, tintVar } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;
const MENU_ID = "site-menu";
const HOME_HREF = "/#home";
/* Header never hides above this scroll offset (px). */
const TOP_ZONE = 96;
/* Ignore sub-pixel / tiny scroll jitter. */
const DELTA = 6;

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Page content made inert while the menu is open (the header is outside both). */
const INERT_TARGETS = "main, footer";

const glassPill =
  "pointer-events-auto inline-flex h-10 shrink-0 items-center rounded-full border border-line bg-card/80 text-sm font-semibold text-ink shadow-soft backdrop-blur-md transition-[transform,box-shadow,background-color] duration-500 ease-out-expo";

type TintStyle = CSSProperties & { "--tint": string };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/* Two bars that cross into an "x" when the menu is open. */
function MenuGlyph({ open }: { open: boolean }) {
  const bar =
    "absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-500 ease-out-expo";
  return (
    <span aria-hidden="true" className="relative block h-2.5 w-4">
      <span className={cn(bar, "top-0", open && "translate-y-[4.25px] rotate-45")} />
      <span className={cn(bar, "bottom-0", open && "-translate-y-[4.25px] -rotate-45")} />
    </span>
  );
}

function AvailabilityDot({ animated }: { animated: boolean }) {
  return (
    <span aria-hidden="true" className="relative grid size-2 shrink-0 place-items-center">
      {animated && (
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-sage opacity-70" />
      )}
      <span className="relative size-2 rounded-full bg-sage-ink" />
    </span>
  );
}

export default function SiteHeader() {
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  /* Hide on scroll down, show on scroll up. Discrete, guarded setState only. */
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (reduce) return;
    const previous = scrollY.getPrevious() ?? latest;
    const delta = latest - previous;
    if (latest < TOP_ZONE) {
      if (hidden) setHidden(false);
    } else if (delta > DELTA) {
      if (!hidden) setHidden(true);
    } else if (delta < -DELTA) {
      if (hidden) setHidden(false);
    }
  });

  const unlockScroll = useCallback(() => {
    const root = document.documentElement;
    root.style.overflow = "";
    root.style.paddingRight = "";
    root.style.removeProperty("--sbw");
    document
      .querySelectorAll<HTMLElement>(INERT_TARGETS)
      .forEach((el) => el.removeAttribute("inert"));
  }, []);

  const closeMenu = useCallback(
    (returnFocus: boolean) => {
      /* Unlock synchronously so an in-page anchor can start scrolling
         within the same click. */
      unlockScroll();
      setOpen(false);
      if (returnFocus) toggleRef.current?.focus();
    },
    [unlockScroll],
  );

  /* Scroll lock (with scrollbar compensation so nothing jumps sideways). */
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const scrollbar = Math.max(0, window.innerWidth - root.clientWidth);
    root.style.overflow = "hidden";
    root.style.paddingRight = `${scrollbar}px`;
    root.style.setProperty("--sbw", `${scrollbar}px`);
    /* Take the page behind the menu out of the tab order and the
       accessibility tree while it is open. */
    document
      .querySelectorAll<HTMLElement>(INERT_TARGETS)
      .forEach((el) => el.setAttribute("inert", ""));
    return unlockScroll;
  }, [open, unlockScroll]);

  /* Escape to close + focus trap across [toggle, ...panel focusables]. */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }
      if (event.key !== "Tab") return;
      const inPanel = panelRef.current
        ? Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
        : [];
      const ring = toggleRef.current ? [toggleRef.current, ...inPanel] : inPanel;
      if (ring.length === 0) return;
      const active = document.activeElement;
      const index = ring.findIndex((el) => el === active);
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (index === -1) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && index === 0) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && index === ring.length - 1) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeMenu]);

  /* "/#home" falls back to a plain scroll-to-top when we are already on the
     home page and no #home target exists. */
  const onHomeClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (open) closeMenu(false);
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (window.location.pathname !== "/" || document.getElementById("home")) return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const barHidden = hidden && !open && !reduce;

  const overlayVariants: Variants = {
    closed: { opacity: 0, transition: { duration: reduce ? 0 : 0.35, ease: EASE } },
    open: { opacity: 1, transition: { duration: reduce ? 0 : 0.4, ease: EASE } },
  };
  const panelVariants: Variants = {
    closed: reduce
      ? { opacity: 0, transition: { duration: 0 } }
      : { opacity: 0, y: -24, scale: 0.98, transition: { duration: 0.35, ease: EASE } },
    open: reduce
      ? { opacity: 1, transition: { duration: 0 } }
      : {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.7, ease: EASE, staggerChildren: 0.055, delayChildren: 0.12 },
        },
  };
  const lineVariants: Variants = {
    closed: reduce ? { y: "0%" } : { y: "115%", rotate: 4 },
    open: reduce
      ? { y: "0%", transition: { duration: 0 } }
      : { y: "0%", rotate: 0, transition: { duration: 0.9, ease: EASE } },
  };
  const fadeVariants: Variants = {
    closed: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
    open: reduce
      ? { opacity: 1, transition: { duration: 0 } }
      : { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <header {...(open ? { "data-lenis-prevent": "" } : {})}>
      {/* ── Floating bar ─────────────────────────────────────────────── */}
      <motion.div
        className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4"
        style={{ paddingRight: "var(--sbw, 0px)" }}
        initial={false}
        animate={{ y: barHidden ? "-130%" : "0%" }}
        transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
        onFocusCapture={() => {
          if (hidden) setHidden(false);
        }}
      >
        <div className="shell grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          {/* Left: menu toggle + About pill */}
          <div className="flex min-w-0 items-center gap-2">
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls={MENU_ID}
              onClick={() => (open ? closeMenu(false) : setOpen(true))}
              className={cn(
                glassPill,
                "gap-2.5 px-3.5 hover:-translate-y-0.5 hover:bg-card hover:shadow-lift sm:px-4",
                open && "bg-card",
              )}
            >
              <MenuGlyph open={open} />
              <span>{open ? nav.closeLabel : nav.menuLabel}</span>
            </button>
            <a
              href={nav.aboutPill.href}
              onClick={() => {
                if (open) closeMenu(false);
              }}
              className={cn(
                glassPill,
                "hidden px-4 hover:-translate-y-0.5 hover:bg-butter hover:shadow-lift md:inline-flex",
              )}
            >
              {nav.aboutPill.label}
            </a>
          </div>

          {/* Center: wordmark */}
          <a
            href={HOME_HREF}
            onClick={onHomeClick}
            aria-label={site.name}
            className={cn(
              glassPill,
              "group/mark gap-2.5 p-1 hover:-translate-y-0.5 hover:bg-card hover:shadow-lift sm:pr-4",
            )}
          >
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-full bg-ink font-display text-[0.95rem] leading-none tracking-wide text-bg transition-transform duration-500 ease-out-expo group-hover/mark:-rotate-12 group-hover/mark:scale-105"
            >
              {site.initials}
            </span>
            <span aria-hidden="true" className="hidden sm:inline">
              {site.name}
            </span>
          </a>

          {/* Right: status + CTA */}
          <div className="flex min-w-0 items-center justify-end gap-2">
            <p
              className={cn(
                glassPill,
                "label-mono hidden gap-2.5 px-4 font-normal text-ink-soft xl:inline-flex",
              )}
            >
              <AvailabilityDot animated={!reduce} />
              <span className="text-ink">{site.availability}</span>
              <span aria-hidden="true" className="h-3 w-px bg-line" />
              <LocalTime className="tabular-nums" />
            </p>
            <PillButton
              href={nav.cta.href}
              variant="ink"
              size="sm"
              className="pointer-events-auto"
            >
              {nav.cta.label}
            </PillButton>
          </div>
        </div>
      </motion.div>

      {/* ── Menu overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            id={MENU_ID}
            data-lenis-prevent=""
            className="fixed inset-0 z-40 overflow-hidden"
            style={{ paddingRight: "var(--sbw, 0px)" }}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Backdrop */}
            <div
              aria-hidden="true"
              onClick={() => closeMenu(false)}
              className="absolute inset-0 bg-ink/25 backdrop-blur-sm"
            />

            <div className="shell pointer-events-none relative flex h-full flex-col pt-[calc(var(--header-h)+0.25rem)] pb-4 sm:pb-6">
              <motion.div
                ref={panelRef}
                variants={panelVariants}
                style={{ transformOrigin: "top left" }}
                className="pointer-events-auto grid max-h-full origin-top-left gap-4 overflow-x-hidden overflow-y-auto overscroll-contain rounded-[2rem] border border-line bg-card p-3 shadow-lift sm:p-4 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)] lg:gap-5 lg:p-5"
              >
                {/* Giant links */}
                <nav aria-label={nav.menuLabel} className="min-w-0">
                  <div className="label-mono flex items-center justify-between px-3 pt-2 pb-3 text-ink-soft sm:px-4">
                    <span>{nav.menuLabel}</span>
                    <span aria-hidden="true">
                      {pad(nav.links.length)} / {site.years}
                    </span>
                  </div>
                  <ul className="grid xl:grid-cols-2 xl:gap-x-2">
                    {nav.links.map((link, index) => {
                      const style: TintStyle = { "--tint": tintVar(TINTS[index % TINTS.length]) };
                      return (
                        <li key={link.href} className="@container border-t border-line">
                          <a
                            href={link.href}
                            onClick={() => closeMenu(false)}
                            style={style}
                            className="group/link flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors duration-500 ease-out-expo hover:bg-(--tint) focus-visible:bg-(--tint) sm:gap-4 sm:px-4 sm:py-3"
                          >
                            <span
                              aria-hidden="true"
                              className="label-mono w-6 shrink-0 self-start pt-2 text-ink-soft"
                            >
                              {pad(index + 1)}
                            </span>
                            <span className="block min-w-0 flex-1 overflow-hidden py-[0.06em]">
                              <motion.span
                                variants={lineVariants}
                                style={{ transformOrigin: "left bottom" }}
                                className="display block text-[clamp(1.75rem,min(10vw,6.6vh,calc((100cqi_-_7.75rem)_/_4.3)),4.25rem)] text-ink transition-transform duration-500 ease-out-expo group-hover/link:translate-x-1.5"
                              >
                                {link.label}
                              </motion.span>
                            </span>
                            <span
                              aria-hidden="true"
                              className="grid size-9 shrink-0 -rotate-45 scale-75 place-items-center rounded-full bg-ink text-bg opacity-0 transition-[transform,opacity] duration-500 ease-out-expo group-hover/link:scale-100 group-hover/link:rotate-0 group-hover/link:opacity-100 group-focus-visible/link:scale-100 group-focus-visible/link:rotate-0 group-focus-visible/link:opacity-100"
                            >
                              <ArrowIcon className="size-4" />
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Side card: status, contact, socials */}
                <motion.aside
                  variants={fadeVariants}
                  className="flex min-w-0 flex-col gap-6 rounded-3xl bg-butter p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="label-mono flex items-center gap-2.5 text-ink">
                      <AvailabilityDot animated={!reduce} />
                      {site.availability}
                    </p>
                    <span
                      aria-hidden="true"
                      className="grid size-11 shrink-0 rotate-6 place-items-center rounded-2xl bg-ink font-display text-lg leading-none tracking-wide text-bg shadow-soft"
                    >
                      {site.initials}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="label-mono text-ink-soft">{footer.localTimeLabel}</p>
                    <p className="font-display text-3xl leading-tight tracking-wide text-ink uppercase tabular-nums">
                      <LocalTime />
                    </p>
                    <p className="text-sm leading-snug font-medium text-ink">{site.location}</p>
                  </div>

                  <div className="mt-auto flex flex-col gap-4 border-t border-ink/10 pt-5">
                    <a
                      href={contact.emailHref}
                      className="link-sweep self-start text-[0.95rem] font-semibold break-all text-ink"
                    >
                      {contact.email}
                    </a>
                    <ul className="flex flex-wrap gap-2">
                      {contact.socials.map((social) => (
                        <li key={social.href}>
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="label-mono inline-flex h-8 items-center rounded-full border border-ink/15 bg-card/70 px-3 text-ink transition-[transform,background-color] duration-500 ease-out-expo hover:-translate-y-0.5 hover:bg-card"
                          >
                            {social.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <PillButton
                      href={nav.cta.href}
                      variant="ink"
                      size="md"
                      className="self-start"
                    >
                      {nav.cta.label}
                    </PillButton>
                  </div>
                </motion.aside>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
