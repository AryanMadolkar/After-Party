const STEPS = [
  "camera roll",
  "300 photos",
  "ai curation",
  "best 10",
  "carousel",
  "edit",
  "caption",
  "song",
  "instagram",
];

export function FullExperienceSection() {
  return (
    <section id="how-it-works" style={{ padding: "72px 0", borderBottom: "2px solid var(--ap-ink)" }}>
      <h2
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(28px,4vw,50px)",
          letterSpacing: "-0.02em",
          margin: "0 0 36px",
          textTransform: "uppercase",
        }}
      >
        Camera roll to Instagram. One pass.
      </h2>

      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", minWidth: "max-content", padding: "8px 0" }}>
          {STEPS.map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  border: "2px solid var(--ap-ink)",
                  background: i === STEPS.length - 1 ? "var(--ap-lime)" : "var(--ap-paper)",
                  padding: "16px 22px",
                  textAlign: "center",
                  minWidth: 120,
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--ap-ink-50)",
                    marginBottom: 4,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-archivo), sans-serif",
                    fontWeight: 900,
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                  }}
                >
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span
                  style={{
                    width: 28,
                    height: 2,
                    background: "var(--ap-ink)",
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
