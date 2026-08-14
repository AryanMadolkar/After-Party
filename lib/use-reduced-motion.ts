"use client";

import { useEffect, useState } from "react";

function getInitial(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Mirrors prefers-reduced-motion. Used by the hero curation animation and
 * other motion-heavy landing sections to skip staged/spring animations in
 * favor of an instant final state — the interaction stays fully
 * functional, just without the movement.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(getInitial);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}
