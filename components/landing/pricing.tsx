import Link from "next/link";
import { Show } from "@clerk/nextjs";

export function Pricing() {
  return (
    <section id="pricing" style={{ padding: "60px 0", borderBottom: "2px solid var(--ap-ink)" }}>
      <h2
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(28px,3.6vw,46px)",
          letterSpacing: "-0.01em",
          margin: "0 0 36px",
          textTransform: "uppercase",
        }}
      >
        free to start
      </h2>
      <div className="ap-hero-grid" style={{ display: "grid" }}>
        <div style={{ padding: "32px 32px 32px 0", borderRight: "2px solid var(--ap-ink)" }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--ap-ink-50)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            free
          </span>
          <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 900, fontSize: 56, marginTop: 12 }}>
            $0
          </div>
          <p style={{ fontSize: 14, color: "var(--ap-ink-70)", margin: "16px 0 0", maxWidth: "34ch" }}>
            1 project a month. limited photos. basic curation. limited captions.
          </p>
        </div>
        <div style={{ padding: "32px 0 32px 32px", position: "relative" }}>
          <span
            className="ap-sticker"
            style={{
              position: "absolute",
              top: 14,
              right: 0,
              background: "var(--ap-pink)",
              transform: "rotate(-6deg)",
              fontSize: 11,
            }}
          >
            worth it fr
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              background: "var(--ap-lime)",
              padding: "2px 8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            pro
          </span>
          <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 900, fontSize: 56, marginTop: 12 }}>
            $10/mo
          </div>
          <p style={{ fontSize: 14, color: "var(--ap-ink-70)", margin: "16px 0 22px", maxWidth: "36ch" }}>
            unlimited projects, higher photo limits, ai editing, caption voice, high-res export.
          </p>
          <Show when="signed-out">
            <Link
              href="/sign-up"
              className="ap-flash"
              style={{
                background: "var(--ap-ink)",
                color: "var(--ap-paper)",
                border: "2px solid var(--ap-ink)",
                padding: "14px 26px",
                fontWeight: 800,
                fontSize: 14,
                textTransform: "uppercase",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              go pro
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/app/settings"
              className="ap-flash"
              style={{
                background: "var(--ap-ink)",
                color: "var(--ap-paper)",
                border: "2px solid var(--ap-ink)",
                padding: "14px 26px",
                fontWeight: 800,
                fontSize: 14,
                textTransform: "uppercase",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              go pro
            </Link>
          </Show>
        </div>
      </div>
    </section>
  );
}
