const TILES = [
  { label: "carousel pick", tag: "carousel", react: "♥ 1.2k", reactBg: "var(--ap-pink)", tone: "linear-gradient(135deg,#d8c3a5,#8f7a63)" },
  { label: "photo dump pick", tag: "dump", react: "♥ 863", reactBg: "var(--ap-lime)", tone: "linear-gradient(135deg,#9db4c0,#5f7a8a)" },
  { label: "story pick", tag: "story", react: "♥ 2.4k", reactBg: "var(--ap-pink)", tone: "linear-gradient(135deg,#c9ada7,#8a6f6a)" },
  { label: "friends pick", tag: "friends", react: "♥ 940", reactBg: "var(--ap-lime)", tone: "linear-gradient(135deg,#e8d5b7,#b99b6b)" },
];

export function PhotoStrip() {
  return (
    <section style={{ padding: "36px 0", borderBottom: "2px solid var(--ap-ink)" }}>
      <div className="ap-grid-4" style={{ display: "grid", gap: 12 }}>
        {TILES.map((tile) => (
          <div
            key={tile.tag}
            className="ap-tile"
            style={{
              height: 190,
              overflow: "hidden",
              position: "relative",
              background: tile.tone,
              border: "2px solid var(--ap-ink)",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "var(--ap-paper)",
                border: "2px solid var(--ap-ink)",
                padding: "4px 10px",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                pointerEvents: "none",
              }}
            >
              {tile.tag}
            </span>
            <span
              className="ap-react"
              style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                background: tile.reactBg,
                border: "2px solid var(--ap-ink)",
                padding: "5px 12px",
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                pointerEvents: "none",
              }}
            >
              {tile.react}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
