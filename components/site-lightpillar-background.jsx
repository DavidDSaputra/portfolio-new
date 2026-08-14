"use client";

import { useEffect, useState } from "react";
import LightPillar from "./reactbits/LightPillar";

export default function SiteLightPillarBackground() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setEnabled(true), 220);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="site-lightpillar-bg" aria-hidden="true">
      <div className="site-lightpillar-base" />
      {enabled ? (
        <LightPillar
          topColor="#ea72d7"
          bottomColor="#da6490"
          intensity={0.72}
          rotationSpeed={0.16}
          glowAmount={0.008}
          pillarWidth={2.8}
          pillarHeight={0.46}
          noiseIntensity={0.2}
          pillarRotation={28}
          interactive={false}
          mixBlendMode="normal"
          quality="low"
          className="site-lightpillar-effect"
        />
      ) : null}
      <div className="site-lightpillar-vignette" />
    </div>
  );
}
