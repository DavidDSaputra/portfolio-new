"use client";

import { motion, useReducedMotion } from "motion/react";
import LocalTime from "@/components/ui/local-time";
import Marquee from "@/components/ui/marquee";
import { ArrowIcon } from "@/components/ui/pill-button";
import { Reveal } from "@/components/ui/reveal";
import { contact, contactCta, footer, nav, site } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Works on "/" and "/blog": scrolls the window instead of relying on a
   "#home" anchor that only exists on the home page. */
function BackToTop() {
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      className="group/top inline-flex h-12 shrink-0 items-center gap-3 rounded-full border border-line bg-card pr-2 pl-5 text-[0.95rem] font-semibold whitespace-nowrap text-ink shadow-soft transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span>{footer.backToTop}</span>
      <span
        aria-hidden="true"
        className="relative grid size-8 place-items-center overflow-hidden rounded-full bg-ink text-bg"
      >
        <ArrowIcon className="size-[45%] -rotate-90 transition-transform duration-500 ease-out-expo group-hover/top:-translate-y-[220%] group-focus-visible/top:-translate-y-[220%]" />
        <ArrowIcon className="absolute size-[45%] translate-y-[220%] -rotate-90 transition-transform duration-500 ease-out-expo group-hover/top:translate-y-0 group-focus-visible/top:translate-y-0" />
      </span>
    </button>
  );
}

/* Giant pastel wordmark cropped by the bottom page edge. */
function Wordmark() {
  const reduced = useReducedMotion();
  const className =
    "display block bg-linear-to-r from-pink via-peach to-lilac bg-clip-text text-[17.4vw] leading-[0.8] whitespace-nowrap text-transparent";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none flex justify-center overflow-hidden pt-[2vw] select-none"
    >
      {reduced ? (
        <span className={`${className} -mb-[0.16em]`}>{site.name}</span>
      ) : (
        <motion.span
          className={`${className} -mb-[0.16em] will-change-transform`}
          initial={{ y: "45%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "0px 0px -5% 0px" }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          {site.name}
        </motion.span>
      )}
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="relative overflow-x-clip bg-bg">
      {/* Closing ticker — decorative echo of the contact statement. */}
      <div aria-hidden="true" className="border-y border-line py-[clamp(0.9rem,2.2vw,2rem)]">
        <Marquee
          items={footer.marquee}
          duration={70}
          itemClassName="display text-[clamp(3rem,10vw,9rem)] text-ink"
          separatorClassName="mx-[0.45em] text-[clamp(2rem,6vw,5.5rem)] leading-none"
        />
      </div>

      <div className="shell pt-[clamp(3.5rem,7vw,6.5rem)]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12 md:gap-x-8">
          {/* Wordmark + credit */}
          <Reveal className="col-span-2 md:col-span-12 lg:col-span-5">
            <p className="display text-[clamp(2.75rem,6vw,5rem)] text-ink">
              {site.firstName}
              <br />
              {site.lastName}
              <span aria-hidden="true" className="text-accent">
                .
              </span>
            </p>
            <p className="mt-5 max-w-[26ch] text-ink-soft">{footer.credit}</p>
          </Reveal>

          {/* Site links */}
          <Reveal delay={0.08} className="col-span-1 md:col-span-3 lg:col-span-2">
            <nav aria-label="Footer">
              <p className="label-mono mb-5 text-ink-soft">{nav.menuLabel}</p>
              <ul className="flex flex-col items-start gap-2.5">
                {nav.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="link-sweep font-medium text-ink">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          {/* Socials */}
          <Reveal delay={0.16} className="col-span-1 md:col-span-4 lg:col-span-2">
            <p className="label-mono mb-5 text-ink-soft">{contactCta.kicker}</p>
            <ul className="flex flex-col items-start gap-2.5">
              {contact.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sweep group/social font-medium text-ink"
                  >
                    {social.label}
                    <ArrowIcon className="ml-1.5 inline-block size-3 -translate-y-px -rotate-45 text-ink-soft transition-transform duration-500 ease-out-expo group-hover/social:rotate-0" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Local time */}
          <Reveal delay={0.24} className="col-span-2 md:col-span-5 lg:col-span-3">
            <div className="card p-6">
              <p className="label-mono flex items-center gap-2.5 text-ink-soft">
                <span aria-hidden="true" className="relative grid size-2 place-items-center">
                  <span className="absolute inset-0 rounded-full bg-sage motion-safe:animate-ping" />
                  <span className="relative size-2 rounded-full bg-sage-ink" />
                </span>
                {footer.localTimeLabel}
              </p>
              <LocalTime
                withSeconds
                className="mt-4 block font-mono text-[clamp(1.375rem,2.1vw,2rem)] leading-none whitespace-nowrap font-medium tracking-tight text-ink tabular-nums"
              />
              <p className="mt-3 text-sm text-ink-soft">{footer.location}</p>
              <a
                href={footer.website.href}
                className="link-sweep mt-5 text-sm font-medium text-ink"
              >
                {footer.website.label}
              </a>
            </div>
          </Reveal>
        </div>

        {/* Bottom bar */}
        <div className="mt-[clamp(3rem,6vw,5rem)] flex flex-col items-start gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono text-ink-soft">{footer.copyright}</p>
          <BackToTop />
        </div>
      </div>

      <Wordmark />
    </footer>
  );
}
