const STEPS = [
  {
    n: "01",
    title: "reads the whole trip",
    body: "every photo gets analyzed together, so it understands the story, not just one pic.",
    color: "var(--ap-lime)",
  },
  {
    n: "02",
    title: "kills the duplicates",
    body: "burst shots and repeat selfies get grouped automatically. bye, 12 sunsets.",
    color: "var(--ap-pink)",
  },
  {
    n: "03",
    title: "builds the post",
    body: "pick a format and it assembles the sequence from your strongest shots.",
    color: "var(--ap-lime)",
  },
  {
    n: "04",
    title: "finishes the vibe",
    body: "caption and a song pick, generated to match the mood. edit before you post.",
    color: "var(--ap-pink)",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "60px 0", borderBottom: "2px solid var(--ap-ink)" }}>
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
          how it works
        </h2>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ap-ink-50)", textTransform: "uppercase" }}>
          01 → 04
        </span>
      </div>
      <div>
        {STEPS.map((step) => (
          <div
            key={step.n}
            className="ap-row"
            style={{
              display: "flex",
              gap: 32,
              alignItems: "baseline",
              padding: "24px 0",
              borderTop: "1.5px solid var(--ap-ink)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-archivo), sans-serif",
                fontWeight: 900,
                fontSize: 16,
                background: step.color,
                padding: "2px 8px",
                minWidth: 20,
                textAlign: "center",
              }}
            >
              {step.n}
            </span>
            <h3 style={{ fontWeight: 700, fontSize: 20, margin: 0, minWidth: 260 }}>{step.title}</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ap-ink-70)", margin: 0, maxWidth: "52ch" }}>
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
