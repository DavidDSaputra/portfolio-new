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

const variants: Record<Variant, { pill: string; circle: string }> = {
  ink: { pill: "bg-ink text-bg", circle: "bg-accent text-bg" },
  white: { pill: "bg-card text-ink border border-line", circle: "bg-ink text-bg" },
  accent: { pill: "bg-accent text-bg", circle: "bg-ink text-bg" },
};

const sizes = {
  sm: { pill: "h-10 pl-4 pr-1.5 text-sm gap-2.5", circle: "size-7", plain: "px-4" },
  md: { pill: "h-12 pl-5 pr-2 text-[0.95rem] gap-3", circle: "size-8", plain: "px-5" },
  lg: { pill: "h-16 pl-8 pr-2.5 text-lg gap-4", circle: "size-11", plain: "px-8" },
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

/* Pill link with an arrow circle that rotates + nudges on hover. External
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
        "group/pill inline-flex shrink-0 items-center rounded-full font-semibold whitespace-nowrap shadow-soft",
        "transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift",
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
          className={cn(
            "grid -rotate-45 place-items-center rounded-full",
            "transition-transform duration-500 ease-out-expo group-hover/pill:translate-x-0.5 group-hover/pill:rotate-0",
            "group-focus-visible/pill:rotate-0",
            v.circle,
            s.circle,
          )}
        >
          <ArrowIcon className="size-[45%]" />
        </span>
      )}
    </a>
  );
}
