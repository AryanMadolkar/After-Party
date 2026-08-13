"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ACTIVE: React.CSSProperties = {
  flex: 1,
  padding: 12,
  fontFamily: "var(--font-onest), sans-serif",
  fontWeight: 800,
  fontSize: 13,
  textTransform: "uppercase",
  border: 0,
  cursor: "pointer",
  background: "var(--ap-ink)",
  color: "var(--ap-paper)",
  textAlign: "center",
  textDecoration: "none",
};

const INACTIVE: React.CSSProperties = {
  ...ACTIVE,
  fontWeight: 700,
  background: "transparent",
  color: "var(--ap-ink)",
};

export function AuthTabs() {
  const pathname = usePathname();
  const isSignIn = pathname.startsWith("/sign-in");

  return (
    <div style={{ display: "flex", borderBottom: "2px solid var(--ap-ink)", marginBottom: 30 }}>
      <Link href="/sign-in" style={isSignIn ? ACTIVE : INACTIVE}>
        sign in
      </Link>
      <Link href="/sign-up" style={!isSignIn ? ACTIVE : INACTIVE}>
        sign up
      </Link>
    </div>
  );
}
