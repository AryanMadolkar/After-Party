import Link from "next/link";
import { Show } from "@clerk/nextjs";

const ARCHIVO: React.CSSProperties = { fontFamily: "var(--font-archivo), sans-serif" };

export function Hero() {
  return (
    <section
      style={{
        padding: "64px 0 0",
        borderBottom: "2px solid var(--ap-ink)",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 26 }}>
        <span className="ap-sticker" style={{ background: "var(--ap-lime)", transform: "rotate(-2deg)" }}>
          ✦ no cap
        </span>
        <span className="ap-sticker" style={{ background: "var(--ap-pink)", transform: "rotate(1.5deg)" }}>
          for the group chat
        </span>
        <span className="ap-sticker" style={{ background: "var(--ap-paper)", transform: "rotate(-1deg)" }}>
          300 → 10
        </span>
      </div>

      <h1
        style={{
          ...ARCHIVO,
          fontWeight: 900,
          fontSize: "clamp(52px,9vw,150px)",
          lineHeight: 0.88,
          letterSpacing: "-0.03em",
          margin: 0,
          textTransform: "uppercase",
        }}
      >
        300 photos.
        <br />
        <span style={{ background: "var(--ap-lime)", padding: "0 6px" }}>zero</span> idea.
      </h1>

      <div
        className="ap-hero-grid"
        style={{
          display: "grid",
          gap: 40,
          padding: "36px 0 56px",
          alignItems: "end",
        }}
      >
        <p style={{ fontSize: 19, lineHeight: 1.6, maxWidth: "42ch", color: "var(--ap-ink-70)", margin: 0 }}>
          Dump the whole camera roll in. We kill the duplicates, rank the keepers, build your
          carousel, and write the caption.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <Show when="signed-out">
            <Link
              href="/sign-up"
              className="ap-flash"
              style={{
                background: "var(--ap-pink)",
                color: "var(--ap-ink)",
                border: "2px solid var(--ap-ink)",
                padding: "18px 32px",
                fontWeight: 800,
                fontSize: 15,
                textTransform: "uppercase",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              create a post →
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/app/new"
              className="ap-flash"
              style={{
                background: "var(--ap-pink)",
                color: "var(--ap-ink)",
                border: "2px solid var(--ap-ink)",
                padding: "18px 32px",
                fontWeight: 800,
                fontSize: 15,
                textTransform: "uppercase",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              create a post →
            </Link>
          </Show>
        </div>
      </div>
    </section>
  );
}
