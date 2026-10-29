"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Terminal } from "./aceternity/terminal";

const CARD_SELECTOR = ".mn-dev-code";

/* enableSound is off: the source Terminal fetches /sounds/sound.ogg for its
   key-click audio, but this project ships no such asset, so the fetch would
   404 in the console. The typing animation is unaffected. To restore sound,
   add public/sounds/sound.ogg and set enableSound back to true. */
const COMMANDS = ["cd portfolio", "npm run dev", "git push origin main"];
const OUTPUTS = {
  0: ["~/portfolio-new"],
  1: ["▲ Next.js 16 — ready in 1.2s", "✔ Compiled / successfully"],
  2: ["✔ Deployed to davidsaputra.my.id"],
};

export default function HeroTerminalCard() {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const card = document.querySelector(CARD_SELECTOR);
    if (!card) return undefined;

    card.classList.add("mn-dev-code-terminal");
    setTarget(card);

    return () => {
      card.classList.remove("mn-dev-code-terminal");
    };
  }, []);

  if (!target) return null;

  return createPortal(
    <Terminal
      className="mn-hero-terminal"
      commands={COMMANDS}
      outputs={OUTPUTS}
      username="david-saputra"
      typingSpeed={45}
      delayBetweenCommands={1000}
      enableSound={false}
    />,
    target,
  );
}
