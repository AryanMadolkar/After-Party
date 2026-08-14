import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/current-user";
import { HeroCuration } from "@/components/landing/hero-curation";

const ARCHIVO: React.CSSProperties = { fontFamily: "var(--font-archivo), sans-serif" };

export async function Hero() {
  const user = await getCurrentUser();
  const ctaHref = user ? "/app/new" : "/sign-up";

  return (
    <section
      style={{
        padding: "56px 0 0",
        borderBottom: "2px solid var(--ap-ink)",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
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

      <div className="ap-hero-grid" style={{ display: "grid", gap: 24, alignItems: "end" }}>
        <h1
          style={{
            ...ARCHIVO,
            fontWeight: 900,
            fontSize: "clamp(46px,7.5vw,120px)",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          300 photos.
          <br />
          <span style={{ background: "var(--ap-lime)", padding: "0 6px" }}>zero</span> idea.
        </h1>

        <div>
          <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: "40ch", color: "var(--ap-ink-70)", margin: 0 }}>
            Dump the whole camera roll in. We kill the duplicates, rank the keepers, build your
            carousel, and write the caption.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 20, flexWrap: "wrap" }}>
            <Link
              href={ctaHref}
              className="ap-flash"
              style={{
                background: "var(--ap-pink)",
                color: "var(--ap-ink)",
                border: "2px solid var(--ap-ink)",
                padding: "16px 28px",
                fontWeight: 800,
                fontSize: 14,
                textTransform: "uppercase",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              create a post →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ margin: "40px 0 48px" }}>
        <HeroCuration />
      </div>
    </section>
  );
}
