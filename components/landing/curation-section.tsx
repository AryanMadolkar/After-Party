import { PhotoTile } from "@/components/landing/photo-tile";
import { PHOTO_LOOKS, photoUrl } from "@/lib/landing/photo-palette";

// Each tag pairs with a photo whose actual content matches it — the
// carousel below badges each tile with its tag, so the match has to be
// exact, not just "a travel-ish photo."
const MOMENTS = [
  { tag: "Eiffel Tower", keyword: "paris", tone: "city-dusk", lock: 4 },
  { tag: "You", keyword: "portrait", tone: "portrait-1", lock: 11 },
  { tag: "Friends", keyword: "friends", tone: "friends-1", lock: 6 },
  { tag: "Café", keyword: "coffee", tone: "cafe", lock: 2 },
  { tag: "Street", keyword: "street", tone: "street", lock: 9 },
  { tag: "Dinner", keyword: "dinner", tone: "food-2", lock: 3 },
  { tag: "Night", keyword: "night", tone: "night-bar", lock: 5 },
];

const toneOf = (id: string) => PHOTO_LOOKS.find((l) => l.id === id)?.tone ?? PHOTO_LOOKS[0].tone;

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
            {MOMENTS.map((moment) => (
              <span
                key={moment.tag}
                style={{
                  border: "2px solid var(--ap-ink)",
                  padding: "6px 14px",
                  fontSize: 12.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {moment.tag}
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
            {MOMENTS.map((moment) => (
              <PhotoTile
                key={moment.tag}
                tone={toneOf(moment.tone)}
                src={photoUrl(moment.keyword, moment.lock, 400, 500)}
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
                  {moment.tag}
                </span>
              </PhotoTile>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
