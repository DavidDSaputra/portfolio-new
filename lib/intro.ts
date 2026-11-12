import { useSyncExternalStore } from "react";

/* Shared signal between the loading screen (components/preloader.tsx) and the
   hero (components/hero.tsx): the hero holds its entrance until the curtain
   starts to part, then times each element to the curtain's edge. */

/** "pending" until the visitor opens the curtain; "instant" when there is no
    curtain to wait for (repeat visit in the same tab session). */
export type IntroState = "pending" | "curtain" | "instant";

/** Geometry + timing of the curtain. The preloader animates with exactly these
    values, so the hero can work out when the edge uncovers a given spot. */
export const CURTAIN = {
  /** Seconds between the click and the panels starting to move. */
  delay: 0.12,
  /** Seconds the panels take to slide away. */
  duration: 1.7,
  /** cubic-bezier easing of the slide. */
  ease: [0.76, 0, 0.24, 1],
  /** Width of one panel, as a fraction of the viewport (they overlap slightly). */
  panel: 0.505,
  /** How far each panel travels, as a fraction of its own width. */
  travel: 1.01,
} as const;

let state: IntroState = "pending";
let openedAt = 0;
const listeners = new Set<() => void>();

/** Called by the preloader: "curtain" the moment the panels start to part,
    "instant" when the intro is skipped. Only the first call counts. */
export function openIntro(mode: Exclude<IntroState, "pending">) {
  if (state !== "pending") return;
  state = mode;
  openedAt = performance.now();
  listeners.forEach((listener) => listener());
}

/** True once the curtain has long finished, e.g. when the hero remounts after
    navigating to /blog and back: there is no curtain left to chase. */
export function curtainIsOver(): boolean {
  return state === "curtain" && performance.now() - openedAt > (CURTAIN.delay + CURTAIN.duration) * 1000 + 500;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;
/* The static HTML always renders the "pending" (hidden) hero. */
const getServerSnapshot = (): IntroState => "pending";

export function useIntroState(): IntroState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** One coordinate of a CSS cubic-bezier (0,0)-(a)-(b)-(1,1) at parameter s. */
const bezier = (s: number, a: number, b: number) =>
  3 * (1 - s) * (1 - s) * s * a + 3 * (1 - s) * s * s * b + s * s * s;

/** Seconds after the curtain is opened until its edge has moved `distance`
    away from the centre line (a fraction of the viewport width, 0 – 0.5). */
export function curtainRevealTime(distance: number): number {
  const [x1, y1, x2, y2] = CURTAIN.ease;
  const reach = CURTAIN.panel * CURTAIN.travel;
  const overlap = CURTAIN.panel - 0.5;
  const progress = Math.min(1, Math.max(0, (distance + overlap) / reach));

  // Invert the easing: bisect for the bezier parameter that yields `progress`.
  let low = 0;
  let high = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (bezier(mid, y1, y2) < progress) low = mid;
    else high = mid;
  }

  return CURTAIN.delay + CURTAIN.duration * bezier((low + high) / 2, x1, x2);
}
