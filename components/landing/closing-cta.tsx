import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/current-user";

export async function ClosingCta() {
  const user = await getCurrentUser();
  const ctaHref = user ? "/app/new" : "/sign-up";

  return (
    <section style={{ padding: "88px 0 96px", textAlign: "center" }}>
      <h2
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(30px,5vw,64px)",
          margin: 0,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          lineHeight: 1.05,
        }}
      >
        Stop scrolling through your camera roll.
      </h2>
      <p
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(22px,3.4vw,40px)",
          margin: "8px 0 0",
          textTransform: "uppercase",
          color: "var(--ap-ink-50)",
        }}
      >
        Let After Party pick.
      </p>

      <Link
        href={ctaHref}
        className="ap-flash"
        style={{
          display: "inline-block",
          marginTop: 36,
          background: "var(--ap-lime)",
          color: "var(--ap-ink)",
          border: "2px solid var(--ap-ink)",
          padding: "18px 34px",
          fontWeight: 800,
          fontSize: 14,
          textTransform: "uppercase",
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        create your first post
      </Link>

      <p style={{ marginTop: 18, fontSize: 13, color: "var(--ap-ink-50)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
        300 photos → 10 worth posting
      </p>
    </section>
  );
}
