import Link from "next/link";
import type { Metadata } from "next";

import { CutRoomMark } from "@/components/brand/cutroom-mark";
import { HeroDesk } from "@/components/landing/hero-desk";
import { LandingBody } from "@/components/landing/landing-sections";
import "@/app/cutroom.css";

export const metadata: Metadata = {
  title: "CutRoom — Ship a client week in under 45 minutes",
  description:
    "Drop the shoot folder. Get on-brand selects, platform crops, and client-voice captions — ready for Buffer.",
};

export default function MarketingPage() {
  return (
    <div className="cr-scope">
      <header className="cr-site-header">
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
        <section className="cr-hero cr-hero-energy">
          <div className="cr-hero-copy">
            <p className="cr-eyebrow">Agency packaging desk</p>
            <h1 className="cr-hero-h1">
              Drop the shoot folder. Get on-brand selects, platform crops, and client-voice captions —
              ready for Buffer.
            </h1>
            <p className="cr-hero-sub">
              Ship a client week of posts in under 45 minutes — brand kits locked, selects packed,
              EN/HI captions, zip + CSV out.
            </p>
            <div className="cr-proof-pill">Client week · &lt;45 min · EN/HI · zip+CSV</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
              <Link href="/signup" className="cr-btn cr-btn-primary" style={{ padding: "12px 18px" }}>
                Create agency workspace
              </Link>
              <Link href="/login" className="cr-btn cr-btn-secondary" style={{ padding: "12px 18px" }}>
                Log in
              </Link>
            </div>
          </div>
          <HeroDesk />
        </section>

        <LandingBody />
      </main>

      <footer className="cr-site-footer">
        <span>© {new Date().getFullYear()} CutRoom</span>
        <span>Ship the week · Lock the brand · Export to Buffer</span>
      </footer>
    </div>
  );
}
