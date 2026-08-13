const ITEMS = [
  "no scroll fatigue",
  "300 photos → 10 keepers",
  "built for the group chat",
  "caption written for you",
  "song pick included",
  "post in 3 minutes",
];

const DOUBLED = [...ITEMS, ...ITEMS];

export function Ticker() {
  return (
    <div
      style={{
        background: "var(--ap-ink)",
        color: "var(--ap-lime)",
        overflow: "hidden",
        padding: "9px 0",
        borderBottom: "2px solid var(--ap-ink)",
      }}
    >
      <div className="ap-marquee">
        {DOUBLED.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              padding: "0 20px",
              fontWeight: 900,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            {item} <span style={{ color: "var(--ap-pink)" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
