import Link from "next/link";
import { Show } from "@clerk/nextjs";

const ARCHIVO: React.CSSProperties = { fontFamily: "var(--font-archivo), sans-serif" };

export function MarketingNav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px clamp(20px,5vw,56px)",
        background: "var(--ap-paper)",
        borderBottom: "2px solid var(--ap-ink)",
      }}
    >
      <Link
        href="/"
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            background: "var(--ap-lime)",
            border: "2px solid var(--ap-ink)",
            borderRadius: "50%",
            flex: "none",
          }}
        />
        <span
          style={{
            ...ARCHIVO,
            fontWeight: 900,
            fontSize: 19,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "var(--ap-ink)",
          }}
        >
          After Party
        </span>
      </Link>

      <div
        style={{
          display: "flex",
          gap: 30,
          fontWeight: 600,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}
      >
        <Link href="#how-it-works">how it works</Link>
        <Link href="#modes">post types</Link>
        <Link href="#pricing">pricing</Link>
        <Link href="#faq">faq</Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Show when="signed-out">
          <Link
            href="/sign-in"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--ap-ink)",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            sign in
          </Link>
          <Link
            href="/sign-up"
            className="ap-flash"
            style={{
              background: "var(--ap-ink)",
              color: "var(--ap-paper)",
              border: "2px solid var(--ap-ink)",
              padding: "10px 22px",
              fontWeight: 800,
              fontSize: 13,
              textTransform: "uppercase",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            create a post
          </Link>
        </Show>
        <Show when="signed-in">
          <Link
            href="/app"
            className="ap-flash"
            style={{
              background: "var(--ap-ink)",
              color: "var(--ap-paper)",
              border: "2px solid var(--ap-ink)",
              padding: "10px 22px",
              fontWeight: 800,
              fontSize: 13,
              textTransform: "uppercase",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            go to dashboard
          </Link>
        </Show>
      </div>
    </nav>
  );
}
