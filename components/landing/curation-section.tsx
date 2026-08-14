import { PhotoTile } from "@/components/landing/photo-tile";
import { pickLooks, photoUrl } from "@/lib/landing/photo-palette";

const CONTEXT_TAGS = ["Eiffel Tower", "You", "Friends", "Café", "Street", "Dinner", "Night"];

const CAROUSEL = pickLooks(6, 8);

export function CurationSection() {
  return (
    <section id="product" style={{ padding: "72px 0", borderBottom: "2px solid var(--ap-ink)" }}>
      <div className="ap-hero-grid" style={{ display: "grid", gap: 40 }}>
        <div>
          <h2
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(30px,4.2vw,52px)",
              letterSpacing: "-0.02em",
              margin: 0,
              textTransform: "uppercase",
              lineHeight: 1.02,
            }}
          >
            Not the best photo.
            <br />
            The right photos.
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ap-ink-70)", marginTop: 18, maxWidth: "42ch" }}>
            After Party doesn&apos;t rank images one at a time. It reads the whole trip — where
            you were, who you were with, what the day felt like — and builds a sequence that
            tells that story.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
            {CONTEXT_TAGS.map((tag) => (
              <span
                key={tag}
                style={{
                  border: "2px solid var(--ap-ink)",
                  padding: "6px 14px",
                  fontSize: 12.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <p
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontWeight: 900,
              fontSize: 15,
              textTransform: "uppercase",
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ textDecoration: "line-through", color: "var(--ap-ink-50)" }}>
              best photo
            </span>
            <span>≠</span>
            <span style={{ background: "var(--ap-lime)", padding: "0 6px" }}>best carousel</span>
          </p>
        </div>

        <div style={{ border: "2px solid var(--ap-ink)", padding: 16 }}>
          <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            {CAROUSEL.map((look, i) => (
              <PhotoTile
                key={look.id}
                tone={look.tone}
                src={photoUrl(look.photoSeed, 400, 500)}
                aspect="4/5"
                style={{ width: "min(20vw, 130px)", flexShrink: 0 }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 6,
                    bottom: 6,
                    background: "var(--ap-paper)",
                    border: "1.5px solid var(--ap-ink)",
                    padding: "2px 6px",
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                >
                  {CONTEXT_TAGS[i]}
                </span>
              </PhotoTile>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
