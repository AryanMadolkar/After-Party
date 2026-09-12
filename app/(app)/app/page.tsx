import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desk",
};

export default function AppHomePage() {
  return (
    <div style={{ maxWidth: 880 }}>
      <h1 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.03em", fontWeight: 700 }}>
        Desk
      </h1>
      <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 15, maxWidth: 48 + "ch" }}>
        Package client shoots into on-brand selects, crops, and captions. Start with a client or
        open a new shoot when you are ready.
      </p>

      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        <Link
          href="/app/clients"
          className="cr-card"
          style={{ padding: 20, display: "block" }}
        >
          <div style={{ fontWeight: 650, fontSize: 16 }}>Create your first client</div>
          <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.45 }}>
            Brand kits and client voice land in a later slice — this opens the Clients list.
          </p>
        </Link>
        <Link
          href="/app/shoots"
          className="cr-card"
          style={{ padding: 20, display: "block" }}
        >
          <div style={{ fontWeight: 650, fontSize: 16 }}>New shoot</div>
          <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.45 }}>
            Upload and packaging queue arrive in Solo-P3/P5. Stub entry point for now.
          </p>
        </Link>
      </div>
    </div>
  );
}
