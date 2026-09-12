"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

import { HERO_THUMBS } from "@/lib/landing/hero-photos";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type Stage = "idle" | "folder" | "tiles" | "brand" | "caption" | "export" | "done";

const TABS = ["Feed", "Stories", "LinkedIn"] as const;

export function HeroDesk() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [stage, setStage] = useState<Stage>(reduced ? "done" : "idle");
  const [visibleCount, setVisibleCount] = useState(reduced ? HERO_THUMBS.length : 0);
  const [captionLocale, setCaptionLocale] = useState<"en" | "hi">("en");
  const [activeTab, setActiveTab] = useState(0);
  const [captionText, setCaptionText] = useState(
    reduced ? "Soft light, clean crop — ready for the feed." : "",
  );

  useEffect(() => {
    if (reduced) {
      setStage("done");
      setVisibleCount(HERO_THUMBS.length);
      setCaptionText("Soft light, clean crop — ready for the feed.");
      return;
    }
    if (!inView || started.current) return;
    started.current = true;

    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    (async () => {
      setStage("folder");
      await wait(320);
      if (cancelled) return;

      setStage("tiles");
      for (let i = 1; i <= HERO_THUMBS.length; i += 1) {
        if (cancelled) return;
        setVisibleCount(i);
        await wait(48);
      }
      await wait(220);
      if (cancelled) return;

      setStage("brand");
      await wait(280);
      if (cancelled) return;

      setStage("caption");
      const en = "Soft light, clean crop — ready for the feed.";
      for (let i = 1; i <= en.length; i += 1) {
        if (cancelled) return;
        setCaptionText(en.slice(0, i));
        await wait(14);
      }
      await wait(400);
      if (cancelled) return;
      setCaptionLocale("hi");
      setCaptionText("सॉफ्ट लाइट, साफ़ क्रॉप — फीड के लिए तैयार।");
      await wait(500);
      if (cancelled) return;
      setCaptionLocale("en");
      setCaptionText(en);
      await wait(200);
      if (cancelled) return;

      setStage("export");
      await wait(350);
      if (cancelled) return;
      setStage("done");
    })();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [inView, reduced]);

  useEffect(() => {
    if (reduced || stage === "idle" || stage === "folder") return;
    const id = window.setInterval(() => {
      setActiveTab((t) => (t + 1) % TABS.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [stage, reduced]);

  const showBrand = stage === "brand" || stage === "caption" || stage === "export" || stage === "done";
  const showExport = stage === "export" || stage === "done";
  const showFolder = stage === "folder" || (stage === "tiles" && visibleCount < 4);

  return (
    <div ref={ref} className="cr-hero-visual-wrap" style={{ transform: "rotate(-1.5deg)" }}>
      <div className="cr-hero-band" />
      <div className="cr-desk cr-desk-energy">
        <div className="cr-desk-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span className="cr-desk-chip">Clients ▾</span>
            <AnimatePresence>
              {showBrand ? (
                <motion.span
                  key="brand"
                  className="cr-brand-lock"
                  initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <span className="cr-brand-dot" />
                  Brand locked
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            {showExport ? (
              <motion.span
                key="export"
                className="cr-desk-chip cr-desk-chip-ready"
                initial={reduced ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                Export ready · zip + CSV
              </motion.span>
            ) : (
              <span key="title" className="cr-desk-chip">
                Northstar · Spring drop
              </span>
            )}
          </AnimatePresence>
        </div>

        <div className="cr-desk-tabs">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              className="cr-desk-tab"
              data-active={activeTab === i}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="cr-desk-body">
          <AnimatePresence>
            {showFolder ? (
              <motion.div
                key="folder"
                className="cr-folder-cue"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                Drop shoot folder
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="cr-select-grid cr-select-grid-dense">
            {HERO_THUMBS.map((thumb, i) => {
              const filled = i < visibleCount;
              return (
                <div
                  key={thumb.src}
                  className="cr-thumb cr-thumb-photo"
                  data-aspect={thumb.aspect ?? "square"}
                  style={{
                    opacity: filled ? 1 : 0,
                    transform: filled ? "scale(1)" : "scale(0.96)",
                    transition: "opacity 220ms ease-out, transform 220ms ease-out",
                  }}
                >
                  {filled ? (
                    <>
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        fill
                        sizes="(max-width: 960px) 30vw, 140px"
                        className="cr-thumb-img"
                        priority={i < 6}
                      />
                      {thumb.channel ? <span className="cr-thumb-badge">{thumb.channel}</span> : null}
                      {thumb.approved ? <span className="cr-thumb-check" aria-hidden>✓</span> : null}
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="cr-caption-row">
            <div className="cr-caption-card">
              <div className="cr-caption-tabs">
                <span data-active={captionLocale === "en"}>EN</span>
                <span data-active={captionLocale === "hi"}>HI</span>
              </div>
              <p className="cr-caption-text">
                {captionText || <span className="cr-muted">Generating client-voice caption…</span>}
                {stage === "caption" && captionLocale === "en" ? (
                  <span className="cr-caret" aria-hidden>
                    |
                  </span>
                ) : null}
              </p>
            </div>
            <div className="cr-export-card" data-ready={showExport}>
              <div style={{ fontWeight: 650, fontSize: 12 }}>Export</div>
              <div className="cr-muted" style={{ fontSize: 11, marginTop: 4 }}>
                zip + captions.csv
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
