import Link from "next/link";

import "@/app/cutroom.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cr-scope" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          padding: "18px clamp(20px, 4vw, 48px)",
          borderBottom: "1px solid var(--cr-border)",
          background: "var(--cr-card)",
        }}
      >
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--cr-primary), var(--cr-primary-strong))",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            C
          </span>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }}>CutRoom</span>
        </Link>
      </header>
      <div
        style={{
          flex: 1,
          display: "grid",
          placeItems: "center",
          padding: "40px 20px",
          background:
            "radial-gradient(900px 420px at 50% 0%, rgba(94,106,210,0.12), transparent 60%), var(--cr-surface)",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>{children}</div>
      </div>
    </div>
  );
}
