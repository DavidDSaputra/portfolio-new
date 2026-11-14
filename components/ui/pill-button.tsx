import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "ink" | "white" | "accent";

interface PillButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  /** Hide the arrow circle (plain pill). */
  plain?: boolean;
}

/* Ink buttons cast a mustard shadow so the offset still reads on a navy key. */
const variants: Record<Variant, { pill: string; circle: string }> = {
  ink: { pill: "bg-ink text-bg [--tab-shadow:var(--color-accent)]", circle: "bg-butter text-ink" },
  white: { pill: "bg-card text-ink", circle: "bg-ink text-bg" },
  accent: { pill: "bg-accent text-ink", circle: "bg-ink text-bg" },
};

const sizes = {
  sm: { pill: "h-10 pl-4 pr-1.5 text-sm gap-2.5", circle: "size-7", plain: "px-4" },
  md: { pill: "h-12 pl-5 pr-2 text-[0.95rem] gap-3", circle: "size-8", plain: "px-5" },
  lg: { pill: "h-16 pl-8 pr-2.5 text-lg gap-4 [--tab-depth:4px]", circle: "size-11", plain: "px-8" },
};

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Tab-shaped link with an arrow key whose arrow turns + nudges on hover. External
   links (http/https) open in a new tab automatically. */
export default function PillButton({
  href,
  children,
  variant = "ink",
  size = "md",
  plain = false,
  className,
  ...rest
}: PillButtonProps) {
  const external = /^https?:\/\//.test(href);
  const v = variants[variant];
  const s = sizes[size];

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
      className={cn(
        "tab tab-press group/pill inline-flex shrink-0 items-center font-semibold whitespace-nowrap",
        v.pill,
        s.pill,
        plain && s.plain,
        className,
      )}
    >
      <span>{children}</span>
      {!plain && (
        <span
          aria-hidden="true"
          className={cn("grid place-items-center rounded-[3px]", v.circle, s.circle)}
        >
          <ArrowIcon
            className={cn(
              "size-[45%] -rotate-45 transition-transform duration-300 ease-out-expo",
              "group-hover/pill:translate-x-0.5 group-hover/pill:rotate-0 group-focus-visible/pill:rotate-0",
            )}
          />
        </span>
      )}
    </a>
  );
}
