const STATS = [
  { label: "photos per project", value: "300" },
  { label: "min to first picks", value: "~3" },
  { label: "post formats", value: "7" },
  { label: "caption rewrites", value: "0" },
];

export function StatBar() {
  return (
    <section
      className="ap-grid-4"
      style={{
        padding: 0,
        borderBottom: "2px solid var(--ap-ink)",
        display: "grid",
      }}
    >
      {STATS.map((stat) => (
        <div key={stat.label} style={{ padding: "26px 24px", borderRight: "2px solid var(--ap-ink)" }}>
          <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 900, fontSize: 38 }}>
            {stat.value}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--ap-ink-50)",
              marginTop: 4,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </section>
  );
}
