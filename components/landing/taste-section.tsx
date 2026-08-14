import { PhotoTile } from "@/components/landing/photo-tile";
import { PHOTO_LOOKS, photoUrl } from "@/lib/landing/photo-palette";

const TRAITS = ["Candid photos", "Dark tones", "Film colors", "Minimal captions"];

const toneOf = (id: string) => PHOTO_LOOKS.find((l) => l.id === id)?.tone ?? PHOTO_LOOKS[0].tone;

// One sample photo per trait, in order, so the row actually embodies the
// four traits listed above it — a candid people shot, a dark night shot,
// a vintage-toned shot, and a clean travel frame.
const SAMPLE = [
  { id: "s1", keyword: "people", tone: toneOf("candid-1"), lock: 41 },
  { id: "s2", keyword: "night", tone: toneOf("night-flash"), lock: 52 },
  { id: "s3", keyword: "vintage", tone: toneOf("film-fade"), lock: 63 },
  { id: "s4", keyword: "travel", tone: toneOf("beach"), lock: 74 },
];

export function TasteSection() {
  return (
    <section style={{ padding: "72px 0", borderBottom: "2px solid var(--ap-ink)" }}>
      <div className="ap-hero-grid" style={{ display: "grid", gap: 40, alignItems: "center" }}>
        <div>
          <h2
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(30px,4.2vw,52px)",
              letterSpacing: "-0.02em",
              margin: "0 0 20px",
              textTransform: "uppercase",
            }}
          >
            It gets to know your taste.
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ap-ink-70)", maxWidth: "44ch", margin: "0 0 28px" }}>
            The more you use After Party, the better it understands what you consider worth
            posting — not a generic idea of a good photo, yours.
          </p>

          <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "var(--ap-ink-50)", margin: "0 0 10px" }}>
            you usually choose
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {TRAITS.map((trait) => (
              <span
                key={trait}
                style={{
                  border: "2px solid var(--ap-ink)",
                  background: "var(--ap-lime)",
                  padding: "7px 14px",
                  fontSize: 12.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {trait}
              </span>
            ))}
          </div>

          <p
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontWeight: 900,
              fontSize: 20,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            After Party learns.
          </p>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {SAMPLE.map((look) => (
            <PhotoTile
              key={look.id}
              tone={look.tone}
              src={photoUrl(look.keyword, look.lock, 350, 465)}
              aspect="3/4"
              style={{ flex: 1, filter: "sepia(0.15) contrast(1.05) saturate(0.85)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
