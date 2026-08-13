const MODES = [
  { tag: "solo", title: "Best Photos", body: "the strongest individual shots, no sequencing required.", color: "var(--ap-lime)" },
  { tag: "feed", title: "Carousel", body: "5–10 photos ordered hero shot to closer.", color: "var(--ap-pink)" },
  { tag: "loose", title: "Photo Dump", body: "10–20 varied, less-polished shots. candid over curated.", color: "var(--ap-sand)" },
  { tag: "squad", title: "Friends", body: "prioritizes group moments, people you were actually there with.", color: "var(--ap-lime)" },
  { tag: "us", title: "Couple", body: "prioritizes photos featuring you and your person.", color: "var(--ap-pink)" },
  { tag: "feed check", title: "Aesthetic", body: "optimized for visual consistency — color, composition, feel.", color: "var(--ap-sand)" },
  { tag: "timeline", title: "Story", body: "chronological sequence, start to finish.", color: "var(--ap-lime)" },
];

export function Modes() {
  return (
    <section id="modes" style={{ padding: "60px 0", borderBottom: "2px solid var(--ap-ink)" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 36,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(28px,3.6vw,46px)",
            letterSpacing: "-0.01em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          pick your vibe
        </h2>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ap-ink-50)", textTransform: "uppercase" }}>
          7 formats
        </span>
      </div>
      <div
        className="ap-grid-4"
        style={{
          display: "grid",
          gap: 2,
          background: "var(--ap-ink)",
          border: "2px solid var(--ap-ink)",
        }}
      >
        {MODES.map((mode) => (
          <div key={mode.tag} style={{ background: "var(--ap-paper)", padding: "28px 22px" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                background: mode.color,
                padding: "2px 8px",
              }}
            >
              {mode.tag}
            </span>
            <h3
              style={{
                fontWeight: 800,
                fontSize: 22,
                margin: "14px 0 8px",
                textTransform: "uppercase",
              }}
            >
              {mode.title}
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ap-ink-70)", margin: 0 }}>{mode.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
