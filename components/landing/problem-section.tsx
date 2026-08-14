"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence, MotionConfig } from "framer-motion";

import { PhotoTile } from "@/components/landing/photo-tile";
import { pickLooks } from "@/lib/landing/photo-palette";

const SCREENSHOT_TONE = "linear-gradient(160deg,#f2f1ea,#d8d5c8)";

type Tile = { id: string; tone: string; keep: boolean; rotate: number; blurred?: boolean };

const looks = pickLooks(42, 3);
const TILES: Tile[] = looks.map((look, i) => {
  // Every 4th tile is a "screenshot"; every 3rd a duplicate/blur reject.
  const isScreenshot = i % 9 === 0;
  const isReject = !isScreenshot && i % 3 === 0;
  return {
    id: `p-${i}`,
    tone: isScreenshot ? SCREENSHOT_TONE : look.tone,
    keep: !isScreenshot && !isReject,
    rotate: (i % 7) - 3,
    blurred: isReject && i % 2 === 0,
  };
});

export function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [cleaned, setCleaned] = useState(false);

  useEffect(() => {
    if (!inView || cleaned) return;
    // Defer the state flip slightly so the "messy" state is visible for a
    // beat before it resolves — otherwise the section reorganizes itself
    // the instant it's scrolled into view, which reads as a glitch, not a
    // demonstration.
    const t = setTimeout(() => setCleaned(true), 900);
    return () => clearTimeout(t);
  }, [inView, cleaned]);

  const visible = TILES.filter((t) => !cleaned || t.keep);

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
                  aspect="1/1"
                  rotate={cleaned ? 0 : tile.rotate}
                  blurred={tile.blurred && !cleaned}
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
        animate={cleaned ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
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
