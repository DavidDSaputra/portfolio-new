"use client";

import { useEffect } from "react";

export default function BodyClass({ className }) {
  useEffect(() => {
    if (!className) {
      return undefined;
    }

    const classes = className.split(/\s+/).filter(Boolean);
    document.body.classList.add(...classes);

    return () => {
      document.body.classList.remove(...classes);
    };
  }, [className]);

  return null;
}
