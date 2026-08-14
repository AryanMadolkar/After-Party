"use client";

import { useState } from "react";

import { PhotoTile } from "@/components/landing/photo-tile";
import { pickLooks, photoUrl } from "@/lib/landing/photo-palette";

const BASE = pickLooks(4, 18);

const EXAMPLES = [
  { prompt: "Remove the guy in the background.", type: "object" },
  { prompt: "Make this look like film.", type: "film" },
  { prompt: "Fix the lighting.", type: "light" },
  { prompt: "Remove the trash can.", type: "object" },
] as const;

export function EditingSection() {
  const [active, setActive] = useState(0);
  const example = EXAMPLES[active];
  const photo = BASE[active];

  const afterFilter =
    example.type === "film"
      ? "sepia(0.35) contrast(1.1) saturate(0.8)"
      : example.type === "light"
        ? "brightness(1.1) contrast(1.05)"
        : undefined;
  const beforeFilter = example.type === "light" ? "brightness(0.65) saturate(0.8)" : undefined;

  return (
    <section style={{ padding: "72px 0", borderBottom: "2px solid var(--ap-ink)" }}>
      <h2
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(28px,4vw,50px)",
          letterSpacing: "-0.02em",
          margin: "0 0 12px",
          textTransform: "uppercase",
        }}
      >
        Your photos. Just better.
      </h2>
      <p style={{ fontSize: 15, color: "var(--ap-ink-70)", margin: "0 0 32px", maxWidth: "48ch" }}>
        Describe the edit. Not a filter preset — an actual instruction.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {EXAMPLES.map((ex, i) => (
          <button
            key={ex.prompt}
            type="button"
            onClick={() => setActive(i)}
            style={{
              border: "2px solid var(--ap-ink)",
              background: active === i ? "var(--ap-lime)" : "transparent",
              padding: "9px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-onest), sans-serif",
              color: "var(--ap-ink)",
            }}
          >
            &ldquo;{ex.prompt}&rdquo;
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, background: "var(--ap-ink)", border: "2px solid var(--ap-ink)" }}>
        <div style={{ background: "var(--ap-paper)", padding: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "var(--ap-ink-50)", margin: "0 0 10px" }}>
            before
          </p>
          <PhotoTile
            tone={photo.tone}
            src={photoUrl(photo.photoSeed, 500, 625)}
            aspect="4/5"
            style={{ filter: beforeFilter, maxWidth: 320 }}
          >
            {example.type === "object" && (
              <div
                style={{
                  position: "absolute",
                  right: "18%",
                  bottom: "12%",
                  width: "16%",
                  height: "34%",
                  background: "rgba(10,10,10,0.55)",
                  borderRadius: "40% 40% 10% 10%",
                }}
              />
            )}
          </PhotoTile>
        </div>
        <div style={{ background: "var(--ap-paper)", padding: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "var(--ap-ink-50)", margin: "0 0 10px" }}>
            after
          </p>
          <PhotoTile
            tone={photo.tone}
            src={photoUrl(photo.photoSeed, 500, 625)}
            aspect="4/5"
            style={{ filter: afterFilter, maxWidth: 320 }}
          />
        </div>
      </div>
    </section>
  );
}
