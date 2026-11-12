"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";

/* Live clock in the site's time zone (WIB). Renders a stable placeholder on
   the server so hydration never mismatches. */
export default function LocalTime({
  className,
  withSeconds = false,
}: {
  className?: string;
  withSeconds?: boolean;
}) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      timeZone: site.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      ...(withSeconds ? { second: "2-digit" as const } : {}),
      hour12: false,
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, withSeconds ? 1000 : 15000);
    return () => window.clearInterval(id);
  }, [withSeconds]);

  return (
    <time className={className}>
      {time ?? (withSeconds ? "--:--:--" : "--:--")} {site.timeZoneLabel}
    </time>
  );
}
