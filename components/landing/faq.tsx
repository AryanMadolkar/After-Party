const FAQS = [
  {
    q: "How many photos can I upload?",
    a: "Up to 300 per project for now. We're building toward full camera-roll and multi-day trips.",
  },
  {
    q: "Does it post to Instagram for me?",
    a: "Not yet — After Party gets your post ready to go, then you export and post it yourself.",
  },
  {
    q: "What if I hate its picks?",
    a: "Swap, reorder, or remove anything before you export. The AI proposes, you decide.",
  },
  {
    q: "Will it learn my taste over time?",
    a: "That's the plan — using what you keep, swap, and reorder to get more personal with every trip.",
  },
  {
    q: "What do I actually get when I export?",
    a: "Your final images, the caption, and the song pick, ready to copy into whatever app you post from.",
  },
];

export function Faq() {
  return (
    <section id="faq" style={{ padding: "60px 0", borderBottom: "2px solid var(--ap-ink)" }}>
      <h2
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(28px,3.6vw,46px)",
          letterSpacing: "-0.01em",
          margin: "0 0 32px",
          textTransform: "uppercase",
        }}
      >
        faq
      </h2>
      <div style={{ maxWidth: 800 }}>
        {FAQS.map((faq) => (
          <details key={faq.q} style={{ borderTop: "1.5px solid var(--ap-ink)", padding: "20px 0" }}>
            <summary
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                fontWeight: 700,
                fontSize: 17,
              }}
            >
              {faq.q}
              <span style={{ fontSize: 20 }}>+</span>
            </summary>
            <p style={{ margin: "14px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "var(--ap-ink-70)", maxWidth: "60ch" }}>
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
