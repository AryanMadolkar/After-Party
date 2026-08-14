"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { PhotoTile } from "@/components/landing/photo-tile";
import { PHOTO_LOOKS, photoUrl } from "@/lib/landing/photo-palette";

const STYLES = [
  { label: "minimal", text: "tokyo lately." },
  { label: "funny", text: "327 photos and somehow these survived." },
  { label: "story", text: "four days, one suitcase, zero sleep." },
  { label: "no caption", text: "—" },
] as const;

// The caption reads "tokyo lately." — the photo should actually be Tokyo.
const PHOTO_TONE = PHOTO_LOOKS.find((l) => l.id === "night-neon")!.tone;
const PHOTO_SRC = photoUrl("tokyo", 7, 500, 625);

export function CaptionsSection() {
  const [active, setActive] = useState(0);

  return (
    <section style={{ padding: "72px 0", borderBottom: "2px solid var(--ap-ink)" }}>
      <h2
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(28px,4.2vw,54px)",
          letterSpacing: "-0.02em",
          margin: "0 0 32px",
          textTransform: "uppercase",
          maxWidth: "16ch",
        }}
      >
        You don&apos;t need to write the caption.
      </h2>

      <div className="ap-hero-grid" style={{ display: "grid", gap: 32, alignItems: "center" }}>
        <PhotoTile tone={PHOTO_TONE} src={PHOTO_SRC} aspect="4/5" style={{ maxWidth: 360 }} />

        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {STYLES.map((style, i) => (
              <button
                key={style.label}
                type="button"
                onClick={() => setActive(i)}
                style={{
                  border: "2px solid var(--ap-ink)",
                  background: active === i ? "var(--ap-ink)" : "transparent",
                  color: active === i ? "var(--ap-paper)" : "var(--ap-ink)",
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "var(--font-onest), sans-serif",
                }}
              >
                {style.label}
              </button>
            ))}
          </div>

          <div style={{ minHeight: 90, border: "2px solid var(--ap-ink)", padding: 24, display: "flex", alignItems: "center" }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily: "var(--font-archivo), sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(18px,2.2vw,26px)",
                  margin: 0,
                }}
              >
                {STYLES[active].text}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
