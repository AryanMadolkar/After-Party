const TILES = [
  { label: "beach day", tone: "linear-gradient(135deg,#d8c3a5,#8f7a63)" },
  { label: "concert night", tone: "linear-gradient(135deg,#7d8597,#4a5568)" },
  { label: "road trip", tone: "linear-gradient(135deg,#a3b18a,#5f6f4f)" },
  { label: "golden hour", tone: "linear-gradient(135deg,#e8d5b7,#b99b6b)" },
];

export function PhotoCollage() {
  return (
    <div
      style={{
        position: "relative",
        background: "var(--ap-sand)",
        borderRight: "2px solid var(--ap-ink)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "220px 220px",
        gap: 2,
        alignContent: "center",
        overflow: "hidden",
      }}
    >
      {TILES.map((tile) => (
        <div key={tile.label} style={{ overflow: "hidden", background: tile.tone }} title={tile.label} />
      ))}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          background: "var(--ap-paper)",
          border: "2px solid var(--ap-ink)",
          padding: "10px 16px",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        &quot;we&apos;ll pick the good ones&quot;
      </div>
    </div>
  );
}
