import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  items: readonly string[];
  /** Separator glyph between items. */
  separator?: string;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;
}

/* Infinite ticker. The list is rendered twice and the track slides -50%;
   CSS stops it under prefers-reduced-motion (see globals.css). */
export default function Marquee({
  items,
  separator = "•",
  duration = 32,
  reverse = false,
  pauseOnHover = false,
  className,
  itemClassName,
  separatorClassName,
}: MarqueeProps) {
  // Repeat enough that one half always overflows wide screens.
  const repeated = Array.from({ length: 4 }, () => items).flat();

  const renderHalf = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {repeated.map((item, index) => (
        <li
          key={index}
          className="flex shrink-0 items-center"
          // Only the first run of the exposed half is announced; repeats are visual filler.
          aria-hidden={(!hidden && index >= items.length) || undefined}
        >
          <span className={cn("whitespace-nowrap", itemClassName)}>{item}</span>
          <span aria-hidden="true" className={cn("mx-[1.2em] text-accent", separatorClassName)}>
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div
        className="marquee-track"
        data-pause-on-hover={pauseOnHover}
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : undefined,
          } as CSSProperties
        }
      >
        {renderHalf(false)}
        {renderHalf(true)}
      </div>
    </div>
  );
}
