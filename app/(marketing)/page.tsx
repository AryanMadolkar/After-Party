import Link from "next/link";
import type { Metadata } from "next";

import { CutRoomMark } from "@/components/brand/cutroom-mark";
import "@/app/cutroom.css";

export const metadata: Metadata = {
  title: "CutRoom — Social packaging for creator agencies",
  description:
    "Drop the shoot folder. Get on-brand selects, platform crops, and client-voice captions — ready for Buffer.",
};

const CLIENTS = [
  { name: "Northstar", active: true },
  { name: "Loom & Co", active: false },
  { name: "Pulse UGC", active: false },
];

const THUMBS: Array<{ tone: "warm" | "cool" | "stone"; channel?: string }> = [
  { tone: "warm", channel: "Feed" },
  { tone: "stone", channel: "Feed" },
  { tone: "cool", channel: "Stories" },
  { tone: "cool", channel: "Feed" },
  { tone: "warm", channel: "LinkedIn" },
  { tone: "stone" },
  { tone: "stone", channel: "Stories" },
  { tone: "warm" },
  { tone: "cool", channel: "Feed" },
];

function DeskPreview() {
  return (
    <div className="cr-hero-visual-wrap" aria-hidden>
      <div className="cr-hero-band" />
      <div className="cr-desk">
        <aside className="cr-desk-rail">
          <div
            style={{
              fontSize: 10,
              fontWeight: 650,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--cr-ink-muted)",
              marginBottom: 4,
            }}
          >
            Clients
          </div>
          {CLIENTS.map((c) => (
            <div key={c.name} className="cr-desk-client" data-active={c.active}>
              {c.name}
            </div>
          ))}
        </aside>

        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 650 }}>Northstar · Spring drop</div>
              <div className="cr-brand-lock">
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 99,
                    background: "var(--cr-brand-lock)",
                  }}
                />
                Brand lock
              </div>
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--cr-ink-muted)",
                border: "1px solid var(--cr-border)",
                borderRadius: 6,
                padding: "5px 8px",
                whiteSpace: "nowrap",
              }}
            >
              Export zip + CSV
            </div>
          </div>

          <div className="cr-select-grid">
            {THUMBS.map((t, i) => (
              <div key={i} className="cr-thumb" data-tone={t.tone}>
                {t.channel ? <span className="cr-thumb-badge">{t.channel}</span> : null}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              borderTop: "1px solid var(--cr-border)",
              paddingTop: 10,
            }}
          >
            <div
              style={{
                border: "1px solid var(--cr-border)",
                borderRadius: 6,
                padding: "8px 10px",
                background: "var(--cr-paper)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "var(--cr-ink-muted)",
                  marginBottom: 4,
                }}
              >
                Caption EN
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.4, color: "var(--cr-ink-secondary)" }}>
                Soft light, clean crop — ready for the feed.
              </div>
            </div>
            <div
              style={{
                border: "1px solid var(--cr-border)",
                borderRadius: 6,
                padding: "8px 10px",
                background: "var(--cr-paper)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "var(--cr-ink-muted)",
                  marginBottom: 4,
                }}
              >
                Caption HI
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.4, color: "var(--cr-ink-secondary)" }}>
                सॉफ्ट लाइट, साफ़ क्रॉप — फीड के लिए तैयार।
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketingPage() {
  return (
    <div className="cr-scope">
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px clamp(20px, 4vw, 48px)",
          borderBottom: "1px solid var(--cr-border)",
          background: "var(--cr-paper)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CutRoomMark size={26} />
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.03em" }}>CutRoom</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/login" className="cr-btn cr-btn-ghost">
            Log in
          </Link>
          <Link href="/signup" className="cr-btn cr-btn-primary">
            Create agency workspace
          </Link>
        </div>
      </header>

      <main>
        <section className="cr-hero">
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: "0 0 14px",
                fontSize: 12,
                fontWeight: 650,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--cr-ink-muted)",
              }}
            >
              Agency packaging desk
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(34px, 4.6vw, 46px)",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                fontWeight: 700,
                color: "var(--cr-ink)",
                maxWidth: 16 + "ch",
              }}
            >
              Drop the shoot folder. Get on-brand selects, platform crops, and client-voice captions —
              ready for Buffer.
            </h1>
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 16,
                lineHeight: 1.5,
                maxWidth: 40 + "ch",
                color: "var(--cr-ink-secondary)",
              }}
            >
              Premium production desk for creator and UGC agencies — brand kits, select boards, EN/HI
              captions, zip + CSV export.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 26 }}>
              <Link href="/signup" className="cr-btn cr-btn-primary" style={{ padding: "12px 18px" }}>
                Create agency workspace
              </Link>
              <Link href="/login" className="cr-btn cr-btn-secondary" style={{ padding: "12px 18px" }}>
                Log in
              </Link>
            </div>
          </div>

          <DeskPreview />
        </section>

        <section className="cr-feature-row">
          <div className="cr-feature-card">
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 650, letterSpacing: "-0.02em" }}>
              Brand kits
            </h2>
            <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.5 }}>
              Lock palette, voice, and crop rules per client so every select stays on-brand.
            </p>
          </div>
          <div className="cr-feature-card">
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 650, letterSpacing: "-0.02em" }}>
              Select board
            </h2>
            <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.5 }}>
              Dense Feed / Stories / LinkedIn grids — review like a cutting room, not a slideshow.
            </p>
          </div>
          <div className="cr-feature-card">
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 650, letterSpacing: "-0.02em" }}>
              Ship
            </h2>
            <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.5 }}>
              Export zip + captions.csv ready for Buffer — EN and HI in one package.
            </p>
          </div>
        </section>
      </main>

      <footer
        style={{
          padding: "24px clamp(20px, 4vw, 48px)",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          fontSize: 13,
          color: "var(--cr-ink-muted)",
          background: "var(--cr-paper)",
        }}
      >
        <span>© {new Date().getFullYear()} CutRoom</span>
        <span>Agency packaging desk</span>
      </footer>
    </div>
  );
}
