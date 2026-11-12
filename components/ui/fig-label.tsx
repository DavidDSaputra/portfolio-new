import { cn } from "@/lib/cn";

/* Technical caption: "Fig. 01 · About". */
export default function FigLabel({
  fig,
  label,
  className,
}: {
  fig: string;
  label: string;
  className?: string;
}) {
  return (
    <p className={cn("label-mono flex items-center gap-3 text-ink-soft", className)}>
      <span aria-hidden="true" className="inline-block size-2 rounded-full bg-accent" />
      <span>
        {fig} <span aria-hidden="true">·</span> {label}
      </span>
    </p>
  );
}
