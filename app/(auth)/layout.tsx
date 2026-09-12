import Link from "next/link";

import { CutRoomMark } from "@/components/brand/cutroom-mark";
import "@/app/cutroom.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cr-scope" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          padding: "16px clamp(20px, 4vw, 48px)",
          borderBottom: "1px solid var(--cr-border)",
          background: "var(--cr-paper)",
        }}
      >
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <CutRoomMark size={24} />
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.03em" }}>CutRoom</span>
        </Link>
      </header>
      <div
        style={{
          flex: 1,
          display: "grid",
          placeItems: "center",
          padding: "40px 20px",
          background: "var(--cr-paper)",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>{children}</div>
      </div>
    </div>
  );
}
