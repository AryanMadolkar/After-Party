import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/current-user";

const ARCHIVO: React.CSSProperties = { fontFamily: "var(--font-archivo), sans-serif" };

export async function MarketingNav() {
  const user = await getCurrentUser();
  const ctaHref = user ? "/app" : "/sign-up";
  const ctaLabel = user ? "go to dashboard" : "try after party";

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px clamp(20px,5vw,56px)",
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
            width: 12,
            height: 12,
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
            fontSize: 17,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "var(--ap-ink)",
          }}
        >
          after party
        </span>
      </Link>

      <div
        style={{
          display: "flex",
          gap: 26,
          fontWeight: 600,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.02em",
        }}
      >
        <Link href="#product">product</Link>
        <Link href="#how-it-works">how it works</Link>
        <Link href="#pricing">pricing</Link>
        {!user && <Link href="/sign-in">sign in</Link>}
      </div>

      <Link
        href={ctaHref}
        className="ap-flash"
        style={{
          background: "var(--ap-ink)",
          color: "var(--ap-paper)",
          border: "2px solid var(--ap-ink)",
          padding: "9px 18px",
          fontWeight: 800,
          fontSize: 12.5,
          textTransform: "uppercase",
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        {ctaLabel}
      </Link>
    </nav>
  );
}
