const BUTTON_STYLE: React.CSSProperties = {
  display: "block",
  textAlign: "center",
  background: "transparent",
  border: "2px solid var(--ap-ink)",
  color: "var(--ap-ink)",
  padding: 13,
  fontWeight: 700,
  fontSize: 13,
  textTransform: "uppercase",
  cursor: "pointer",
  textDecoration: "none",
  fontFamily: "var(--font-onest), sans-serif",
};

export function SocialButtons() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
      <a href="/api/auth/google" className="ap-flash" style={BUTTON_STYLE}>
        continue with google
      </a>
      <a href="/api/auth/apple" className="ap-flash" style={BUTTON_STYLE}>
        continue with apple
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0 0" }}>
        <span style={{ flex: 1, height: 1.5, background: "var(--ap-ink)", opacity: 0.15 }} />
        <span style={{ fontSize: 11, color: "var(--ap-ink-50)", textTransform: "uppercase" }}>or</span>
        <span style={{ flex: 1, height: 1.5, background: "var(--ap-ink)", opacity: 0.15 }} />
      </div>
    </div>
  );
}
