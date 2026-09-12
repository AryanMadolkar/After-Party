import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CutRoom — Social packaging for creator agencies",
  description:
    "Drop the shoot folder. Get on-brand selects, platform crops, and client-voice captions — ready for Buffer.",
};

export default function MarketingPage() {
  return (
    <div className="cr-scope" style={{ background: "var(--cr-surface)" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px clamp(20px, 4vw, 48px)",
          borderBottom: "1px solid var(--cr-border)",
          background: "rgba(244,245,248,0.86)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--cr-primary), var(--cr-primary-strong))",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            C
          </span>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.03em" }}>CutRoom</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/login" className="cr-btn cr-btn-ghost">
            Log in
          </Link>
          <Link href="/signup" className="cr-btn cr-btn-primary">
            Start free
          </Link>
        </div>
      </header>

      <main>
        {/* Hero — brand + one headline + one sentence + CTAs + full-bleed visual plane */}
        <section
          style={{
            position: "relative",
            minHeight: "min(92vh, 820px)",
            display: "grid",
            alignItems: "end",
            overflow: "hidden",
            background:
              "radial-gradient(1200px 600px at 80% 10%, rgba(94,106,210,0.22), transparent 55%), linear-gradient(160deg, #eef0f7 0%, #f4f5f8 42%, #e8ebf4 100%)",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)), repeating-linear-gradient(90deg, transparent, transparent 72px, rgba(94,106,210,0.06) 72px, rgba(94,106,210,0.06) 73px), repeating-linear-gradient(0deg, transparent, transparent 72px, rgba(94,106,210,0.05) 72px, rgba(94,106,210,0.05) 73px)",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              right: "-8%",
              top: "8%",
              width: "min(58vw, 640px)",
              height: "min(70vh, 560px)",
              borderRadius: "28px 0 0 28px",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(238,240,247,0.7))",
              border: "1px solid rgba(229,231,235,0.9)",
              boxShadow: "0 30px 80px rgba(34,35,38,0.08)",
              transform: "rotate(-2deg)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 44,
                borderBottom: "1px solid var(--cr-border)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 16px",
                background: "#fff",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 99, background: "#E5E7EB" }} />
              <span style={{ width: 8, height: 8, borderRadius: 99, background: "#E5E7EB" }} />
              <span style={{ width: 120, height: 8, borderRadius: 99, background: "#F4F5F8", marginLeft: 8 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", height: "calc(100% - 44px)" }}>
              <div style={{ borderRight: "1px solid var(--cr-border)", background: "#fff", padding: 12 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: 28,
                      borderRadius: 6,
                      marginBottom: 8,
                      background: i === 0 ? "rgba(94,106,210,0.14)" : "#F4F5F8",
                    }}
                  />
                ))}
              </div>
              <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 10,
                      background:
                        i % 3 === 0
                          ? "linear-gradient(160deg,#d7dcf5,#c4c9e8)"
                          : i % 3 === 1
                            ? "linear-gradient(160deg,#e8e9ee,#d5d7df)"
                            : "linear-gradient(160deg,#f0f1f5,#dddfe6)",
                      minHeight: 72,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: "clamp(48px, 10vh, 96px) clamp(20px, 4vw, 48px) clamp(56px, 10vh, 88px)",
              maxWidth: 720,
            }}
          >
            <p
              style={{
                margin: "0 0 18px",
                fontSize: 13,
                fontWeight: 650,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--cr-primary-strong)",
              }}
            >
              CutRoom
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(36px, 5.4vw, 56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.045em",
                fontWeight: 700,
                color: "var(--cr-ink)",
                maxWidth: 14.5 + "ch",
              }}
            >
              Drop the shoot folder. Get on-brand selects, platform crops, and client-voice captions —
              ready for Buffer.
            </h1>
            <p
              className="cr-muted"
              style={{
                margin: "18px 0 0",
                fontSize: 17,
                lineHeight: 1.5,
                maxWidth: 42 + "ch",
              }}
            >
              The B2B packaging desk for creator and UGC agencies — EN/HI captions, client brand kits,
              zero consumer song fluff.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
              <Link href="/signup" className="cr-btn cr-btn-primary" style={{ padding: "12px 18px" }}>
                Create your agency workspace
              </Link>
              <Link href="/login" className="cr-btn cr-btn-secondary" style={{ padding: "12px 18px" }}>
                Log in
              </Link>
            </div>
          </div>
        </section>

        <section
          style={{
            padding: "72px clamp(20px, 4vw, 48px)",
            borderTop: "1px solid var(--cr-border)",
            background: "#fff",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.03em", fontWeight: 700, maxWidth: 16 + "ch" }}>
            Built for multi-client desks
          </h2>
          <p className="cr-muted" style={{ margin: "12px 0 0", maxWidth: 52 + "ch", fontSize: 16, lineHeight: 1.55 }}>
            Keep every client&apos;s brand kit, shoot queue, and export package in one workspace —
            so producers ship selects instead of sorting shoot dumps.
          </p>
        </section>
      </main>

      <footer
        style={{
          padding: "28px clamp(20px, 4vw, 48px)",
          borderTop: "1px solid var(--cr-border)",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          fontSize: 13,
          color: "var(--cr-ink-muted)",
        }}
      >
        <span>© {new Date().getFullYear()} CutRoom</span>
        <span>Agency packaging · not a consumer cull app</span>
      </footer>
    </div>
  );
}
