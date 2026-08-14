"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence, MotionConfig } from "framer-motion";

import { PhotoTile } from "@/components/landing/photo-tile";
import { pickLooks, photoUrl } from "@/lib/landing/photo-palette";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const MESSY_DURATION_MS = 1400;
const CLEAN_DURATION_MS = 3000;

const SCREENSHOT_TONE = "linear-gradient(160deg,#f2f1ea,#d8d5c8)";

type Tile = {
  id: string;
  tone: string;
  src?: string;
  keep: boolean;
  rotate: number;
  blurred?: boolean;
};

const looks = pickLooks(42, 3);
const TILES: Tile[] = looks.map((look, i) => {
  // Every 4th tile is a "screenshot"; every 3rd a duplicate/blur reject.
  const isScreenshot = i % 9 === 0;
  const isReject = !isScreenshot && i % 3 === 0;
  return {
    id: `p-${i}`,
    // Screenshots stay a flat placeholder — a real photo behind them
    // would undercut the "this one's not even a photo" point.
    tone: isScreenshot ? SCREENSHOT_TONE : look.tone,
    src: isScreenshot ? undefined : photoUrl(look.keyword, look.lock, 160, 160),
    keep: !isScreenshot && !isReject,
    rotate: (i % 7) - 3,
    blurred: isReject && i % 2 === 0,
  };
});

export function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  // Not "once" — re-entering the viewport should resume the loop.
  const inView = useInView(ref, { amount: 0.4 });
  const reducedMotion = usePrefersReducedMotion();
  const [cleaned, setCleaned] = useState(false);

  useEffect(() => {
    // Reduced-motion users get the informative end state, not an
    // endlessly looping animation (that's exactly what the preference is
    // asking to avoid).
    if (!inView || reducedMotion) return;

    // Re-scheduling one timeout per `cleaned` change (rather than a
    // single setInterval) is what makes this loop instead of firing once:
    // each flip's effect cleanup clears the previous timer and schedules
    // the next one for the opposite state, alternating indefinitely for
    // as long as the section stays in view.
    const delay = cleaned ? CLEAN_DURATION_MS : MESSY_DURATION_MS;
    const t = setTimeout(() => setCleaned((c) => !c), delay);
    return () => clearTimeout(t);
  }, [inView, cleaned, reducedMotion]);

  const showCleaned = reducedMotion || cleaned;

  const visible = TILES.filter((t) => !showCleaned || t.keep);

  return (
    <section style={{ padding: "72px 0", borderBottom: "2px solid var(--ap-ink)" }}>
      <h2
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(30px,4.4vw,58px)",
          letterSpacing: "-0.02em",
          margin: "0 0 28px",
          textTransform: "uppercase",
          maxWidth: "16ch",
        }}
      >
        Your camera roll is a mess.
      </h2>

      <MotionConfig reducedMotion="user">
        <div ref={ref} style={{ border: "2px solid var(--ap-ink)", padding: 12 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
            }}
          >
            <AnimatePresence mode="popLayout">
              {visible.map((tile) => (
                <PhotoTile
                  key={tile.id}
                  layout
                  tone={tile.tone}
                  src={tile.src}
                  aspect="1/1"
                  rotate={showCleaned ? 0 : tile.rotate}
                  blurred={tile.blurred && !showCleaned}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 240, damping: 26 }}
                  style={{ width: "clamp(34px, 6vw, 58px)", flexShrink: 0 }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </MotionConfig>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={showCleaned ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(22px,3vw,34px)",
          textTransform: "uppercase",
          marginTop: 28,
          marginBottom: 0,
        }}
      >
        After Party knows what matters.
      </motion.p>
    </section>
  );
}
