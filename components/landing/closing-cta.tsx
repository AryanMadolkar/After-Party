import Link from "next/link";
import { Show } from "@clerk/nextjs";

export function ClosingCta() {
  return (
    <section style={{ padding: "60px 0 80px" }}>
      <h3
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(34px,5vw,64px)",
          margin: 0,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
        }}
      >
        your next post starts here
      </h3>
      <div style={{ display: "flex", gap: 12, maxWidth: 460, marginTop: 28 }}>
        <input
          type="email"
          placeholder="you@example.com"
          aria-label="Email address"
          style={{
            flex: 1,
            background: "transparent",
            border: "2px solid var(--ap-ink)",
            color: "var(--ap-ink)",
            padding: "15px 18px",
            fontSize: 14,
            fontFamily: "var(--font-onest), sans-serif",
          }}
        />
        <Show when="signed-out">
          <Link
            href="/sign-up"
            className="ap-flash"
            style={{
              background: "var(--ap-lime)",
              color: "var(--ap-ink)",
              border: "2px solid var(--ap-ink)",
              padding: "15px 26px",
              fontWeight: 800,
              fontSize: 13,
              textTransform: "uppercase",
              cursor: "pointer",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            create a post
          </Link>
        </Show>
        <Show when="signed-in">
          <Link
            href="/app/new"
            className="ap-flash"
            style={{
              background: "var(--ap-lime)",
              color: "var(--ap-ink)",
              border: "2px solid var(--ap-ink)",
              padding: "15px 26px",
              fontWeight: 800,
              fontSize: 13,
              textTransform: "uppercase",
              cursor: "pointer",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            create a post
          </Link>
        </Show>
      </div>
    </section>
  );
}
