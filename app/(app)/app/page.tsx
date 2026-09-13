import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { EMPTY_STATE_THUMBS } from "@/lib/landing/hero-photos";

export const metadata: Metadata = {
  title: "Desk",
};

export default function AppHomePage() {
  return (
    <div style={{ maxWidth: 880 }}>
      <h1 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.03em", fontWeight: 700 }}>Desk</h1>
      <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 15, maxWidth: 48 + "ch" }}>
        Ship a client week of posts — brand kits, packed selects, EN/HI captions. Start with a
        client or open a new shoot.
      </p>

      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        <Link href="/app/clients" className="cr-card" style={{ padding: 16, display: "block" }}>
          <div className="cr-empty-collage">
            {EMPTY_STATE_THUMBS.map((t) => (
              <div key={t.src} className="cr-empty-collage-cell">
                <Image src={t.src} alt="" fill sizes="80px" className="cr-thumb-img" />
              </div>
            ))}
          </div>
          <div style={{ fontWeight: 650, fontSize: 15 }}>Create your first client</div>
          <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.45 }}>
            Lock the brand kit — identity, voice, guardrails, EN/HI.
          </p>
        </Link>
        <Link href="/app/shoots" className="cr-card" style={{ padding: 16, display: "block" }}>
          <div className="cr-empty-collage">
            {EMPTY_STATE_THUMBS.slice()
              .reverse()
              .map((t) => (
                <div key={`shoot-${t.src}`} className="cr-empty-collage-cell">
                  <Image src={t.src} alt="" fill sizes="80px" className="cr-thumb-img" />
                </div>
              ))}
          </div>
          <div style={{ fontWeight: 650, fontSize: 15 }}>New shoot</div>
          <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.45 }}>
            Drop the folder when upload ships.
          </p>
        </Link>
      </div>
    </div>
  );
}
