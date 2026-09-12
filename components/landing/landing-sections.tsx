"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

import { HERO_THUMBS } from "@/lib/landing/hero-photos";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const METRICS = [
  { label: "<45 min", detail: "Client week shipped" },
  { label: "Multi-client", detail: "Brand kits locked" },
  { label: "EN + HI", detail: "Client-voice captions" },
  { label: "Buffer-ready", detail: "zip + captions.csv" },
];

const STEPS = [
  { title: "Drop folder", body: "Ingest the shoot dump — no manual cull theater." },
  { title: "Brand-aware selects", body: "Feed, Stories, LinkedIn crops against the kit." },
  { title: "Captions EN/HI", body: "Client voice, bilingual, ready to paste." },
  { title: "Export", body: "One zip + CSV — schedule in Buffer the same hour." },
];

const CLIENTS = [
  { name: "Northstar", swatch: "#0F766E" },
  { name: "Loom & Co", swatch: "#C45C26" },
  { name: "Pulse UGC", swatch: "#3A3F47" },
  { name: "Salt Theory", swatch: "#A16207" },
];

const PLANS = [
  { id: "studio", name: "Studio", price: "$49", blurb: "Solo producers, a few brands." },
  { id: "agency", name: "Agency", price: "$129", blurb: "Multi-client shoot weeks.", featured: true },
  { id: "agency_plus", name: "Agency+", price: "$249", blurb: "Heavier desks, more seats." },
];

function MetricStrip() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [shown, setShown] = useState(reduced);

  useEffect(() => {
    if (inView) setShown(true);
  }, [inView]);

  return (
    <section ref={ref} className="cr-metric-strip">
      {METRICS.map((m) => (
        <motion.div
          key={m.label}
          className="cr-metric-item"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={shown ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="cr-metric-value">{m.label}</div>
          <div className="cr-muted" style={{ fontSize: 13, marginTop: 4 }}>
            {m.detail}
          </div>
        </motion.div>
      ))}
    </section>
  );
}

function BeforeAfter() {
  return (
    <section className="cr-section">
      <div className="cr-section-head">
        <p className="cr-eyebrow">Before → After</p>
        <h2 className="cr-h2">Drive chaos in. On-brand week out.</h2>
      </div>
      <div className="cr-ba-grid">
        <div className="cr-ba-card">
          <div className="cr-ba-label">Before</div>
          <div className="cr-ba-chaos">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="cr-ba-mess"
                style={{
                  transform: `rotate(${(i % 5) * 3 - 6}deg) translateY(${(i % 3) * 4}px)`,
                  opacity: 0.55 + (i % 4) * 0.1,
                }}
              />
            ))}
          </div>
          <p className="cr-muted" style={{ marginTop: 12, fontSize: 13 }}>
            Untitled folders. Mixed crops. WhatsApp threads. No brand lock.
          </p>
        </div>
        <div className="cr-ba-card cr-ba-card-after">
          <div className="cr-ba-label">After</div>
          <div className="cr-ba-after-grid">
            {HERO_THUMBS.slice(0, 6).map((t) => (
              <div key={t.src} className="cr-ba-thumb">
                <Image src={t.src} alt="" fill sizes="120px" className="cr-thumb-img" />
                {t.channel ? <span className="cr-thumb-badge">{t.channel}</span> : null}
              </div>
            ))}
          </div>
          <p className="cr-muted" style={{ marginTop: 12, fontSize: 13 }}>
            Feed / Stories / LinkedIn selects + captions.csv — ready for Buffer.
          </p>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="cr-section cr-section-raised">
      <div className="cr-section-head">
        <p className="cr-eyebrow">How it works</p>
        <h2 className="cr-h2">Ship the week in four moves.</h2>
      </div>
      <div className="cr-steps">
        {STEPS.map((s, i) => (
          <div key={s.title} className="cr-step">
            <div className="cr-step-num">{i + 1}</div>
            <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 650 }}>{s.title}</h3>
            <p className="cr-muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MultiClient() {
  const [active, setActive] = useState(0);
  return (
    <section className="cr-section">
      <div className="cr-section-head">
        <p className="cr-eyebrow">Multi-client</p>
        <h2 className="cr-h2">Lock the brand. Switch the desk.</h2>
      </div>
      <div className="cr-client-switch">
        {CLIENTS.map((c, i) => (
          <button
            key={c.name}
            type="button"
            className="cr-client-pill"
            data-active={active === i}
            onClick={() => setActive(i)}
          >
            <span className="cr-swatch" style={{ background: c.swatch }} />
            {c.name}
          </button>
        ))}
      </div>
      <div className="cr-client-preview cr-card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span className="cr-swatch" style={{ background: CLIENTS[active].swatch, width: 14, height: 14 }} />
          <strong>{CLIENTS[active].name}</strong>
          <span className="cr-brand-lock" style={{ margin: 0 }}>
            <span className="cr-brand-dot" /> Brand locked
          </span>
        </div>
        <div className="cr-ba-after-grid">
          {HERO_THUMBS.slice(active * 3, active * 3 + 6).map((t) => (
            <div key={`${CLIENTS[active].name}-${t.src}`} className="cr-ba-thumb">
              <Image src={t.src} alt="" fill sizes="120px" className="cr-thumb-img" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SoftProof() {
  return (
    <section className="cr-section cr-section-raised">
      <div className="cr-section-head" style={{ textAlign: "center", marginInline: "auto" }}>
        <h2 className="cr-h2">Built for creator &amp; UGC houses</h2>
        <p className="cr-muted" style={{ marginTop: 10, maxWidth: 42 + "ch", marginInline: "auto" }}>
          Quiet chrome. Loud outcomes. The packaging desk your producers actually want open.
        </p>
      </div>
      <div className="cr-logo-row">
        {["ATELIER", "FRAMEHOUSE", "KIT&CO", "NORTH DESK", "REELROOM", "STUDIO K"].map((name) => (
          <div key={name} className="cr-logo-ph">
            {name}
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingTeaser() {
  return (
    <section className="cr-section">
      <div className="cr-section-head">
        <p className="cr-eyebrow">Pricing</p>
        <h2 className="cr-h2">Pick the desk size. Ship this week.</h2>
      </div>
      <div className="cr-pricing-grid">
        {PLANS.map((p) => (
          <div key={p.id} className="cr-price-card" data-featured={!!p.featured}>
            <div style={{ fontWeight: 650, fontSize: 15 }}>{p.name}</div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginTop: 8 }}>
              {p.price}
              <span className="cr-muted" style={{ fontSize: 13, fontWeight: 500 }}>
                {" "}
                / mo
              </span>
            </div>
            <p className="cr-muted" style={{ fontSize: 13, marginTop: 8, lineHeight: 1.45 }}>
              {p.blurb}
            </p>
            {p.featured ? (
              <Link href="/signup" className="cr-btn cr-btn-primary" style={{ marginTop: 16, width: "100%" }}>
                Start Agency
              </Link>
            ) : (
              <Link href="/signup" className="cr-btn cr-btn-secondary" style={{ marginTop: 16, width: "100%" }}>
                Choose {p.name}
              </Link>
            )}
          </div>
        ))}
      </div>
      <p className="cr-muted" style={{ marginTop: 14, fontSize: 12 }}>
        USD list · INR billing available at checkout (coming soon).
      </p>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="cr-final-cta">
      <div>
        <h2 className="cr-h2" style={{ color: "#fff", maxWidth: 18 + "ch" }}>
          Ship a client week of posts in under 45 minutes.
        </h2>
        <p style={{ color: "rgba(255,255,255,0.78)", marginTop: 10, maxWidth: 40 + "ch", fontSize: 15 }}>
          Lock the brand. Pack the selects. Export to Buffer — EN and HI.
        </p>
      </div>
      <Link href="/signup" className="cr-btn cr-btn-final">
        Create your agency workspace
      </Link>
    </section>
  );
}

export function LandingBody() {
  return (
    <>
      <MetricStrip />
      <BeforeAfter />
      <HowItWorks />
      <MultiClient />
      <SoftProof />
      <PricingTeaser />
      <FinalCta />
    </>
  );
}
