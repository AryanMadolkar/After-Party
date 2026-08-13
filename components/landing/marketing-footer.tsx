import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer style={{ borderTop: "2px solid var(--ap-ink)", background: "var(--ap-ink)", color: "var(--ap-paper)" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "32px clamp(20px,5vw,56px)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 12,
          fontSize: 13,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
            fontWeight: 900,
            fontSize: 16,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          After Party
        </p>
        <div style={{ display: "flex", gap: 22 }}>
          <Link href="/sign-in" style={{ color: "var(--ap-paper)", textDecorationColor: "var(--ap-lime)" }}>
            sign in
          </Link>
          <Link href="/sign-up" style={{ color: "var(--ap-lime)", textDecorationColor: "var(--ap-lime)" }}>
            sign up
          </Link>
        </div>
      </div>
    </footer>
  );
}
