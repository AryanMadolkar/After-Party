import { PhotoTile } from "@/components/landing/photo-tile";
import { pickLooks } from "@/lib/landing/photo-palette";

const CAROUSEL_LOOKS = pickLooks(4, 4);
const DUMP_LOOKS = pickLooks(7, 12);
const STYLES = ["Carousel", "Photo dump", "Friends", "Aesthetic", "Story"];

export function PhotoDumpSection() {
  return (
    <section style={{ padding: "72px 0", borderBottom: "2px solid var(--ap-ink)" }}>
      <h2
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(28px,4vw,50px)",
          letterSpacing: "-0.02em",
          margin: "0 0 32px",
          textTransform: "uppercase",
          maxWidth: "18ch",
        }}
      >
        Sometimes the bad photos are the good photos.
      </h2>

      <div className="ap-hero-grid" style={{ display: "grid", gap: 2, background: "var(--ap-ink)", border: "2px solid var(--ap-ink)" }}>
        <div style={{ background: "var(--ap-paper)", padding: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ap-ink-50)", margin: "0 0 14px" }}>
            carousel — curated
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            {CAROUSEL_LOOKS.map((look) => (
              <PhotoTile key={look.id} tone={look.tone} aspect="4/5" style={{ flex: 1 }} />
            ))}
          </div>
        </div>

        <div style={{ background: "var(--ap-paper)", padding: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ap-ink-50)", margin: "0 0 14px" }}>
            photo dump — raw
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {DUMP_LOOKS.map((look, i) => (
              <PhotoTile
                key={look.id}
                tone={look.tone}
                aspect={i % 3 === 0 ? "1/1" : i % 2 === 0 ? "3/4" : "4/5"}
                rotate={(i % 5) - 2}
                blurred={i === 2}
                style={{ width: i % 4 === 0 ? "30%" : "20%" }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
        {STYLES.map((style, i) => (
          <span
            key={style}
            style={{
              border: "2px solid var(--ap-ink)",
              background: i === 1 ? "var(--ap-lime)" : "transparent",
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {style}
          </span>
        ))}
      </div>
    </section>
  );
}
