"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";

import { PhotoTile } from "@/components/landing/photo-tile";
import { PHOTO_LOOKS, hashSeed, photoUrl } from "@/lib/landing/photo-palette";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type Tag = "dup-primary" | "dup-loser" | "blur" | "keep";

type Photo = {
  id: string;
  tone: string;
  keyword: string;
  /** Duplicate-group members share their primary's seed — same keyword
   *  AND same derived lock, so they resolve to the literal same photo.
   *  That reads as "duplicate" far more clearly than three merely
   *  similar-looking images of the same subject would. */
  photoSeed: string;
  tag: Tag;
  rotate: number;
  groupSize?: number;
  cut?: boolean; // dropped from the final 8, even though it survived curation
  role?: "Hero" | "Candid" | "Detail" | "Closing shot";
};

const look = (id: string) => PHOTO_LOOKS.find((l) => l.id === id)?.tone ?? PHOTO_LOOKS[0].tone;
const rot = (i: number) => (i % 5) - 2;

// 26 visible thumbnails standing in for "300 photos". Four duplicate
// bursts (3 shots each) collapse to one keeper apiece, eight blurry shots
// get rejected, leaving 10 curated photos — two of which don't make the
// cut for THIS post, leaving 8 for the carousel.
const PHOTOS: Photo[] = [
  { id: "sunset-1", tone: look("sunset-1"), keyword: "sunset", photoSeed: "hero-sunset", tag: "dup-loser", rotate: rot(0) },
  { id: "sunset-2", tone: look("sunset-2"), keyword: "sunset", photoSeed: "hero-sunset", tag: "dup-primary", rotate: rot(1), groupSize: 3, role: "Hero" },
  { id: "sunset-3", tone: look("sunset-3"), keyword: "sunset", photoSeed: "hero-sunset", tag: "dup-loser", rotate: rot(2) },
  { id: "night-flash", tone: look("night-flash"), keyword: "neon", photoSeed: "hero-night", tag: "dup-loser", rotate: rot(3) },
  { id: "night-neon", tone: look("night-neon"), keyword: "neon", photoSeed: "hero-night", tag: "dup-primary", rotate: rot(4), groupSize: 3, role: "Candid" },
  { id: "night-bar", tone: look("night-bar"), keyword: "neon", photoSeed: "hero-night", tag: "dup-loser", rotate: rot(5) },
  { id: "friends-a1", tone: look("friends-1"), keyword: "friends", photoSeed: "hero-friends", tag: "dup-loser", rotate: rot(6) },
  { id: "friends-a2", tone: look("friends-2"), keyword: "friends", photoSeed: "hero-friends", tag: "dup-primary", rotate: rot(7), groupSize: 3, role: "Candid" },
  { id: "friends-a3", tone: look("friends-1"), keyword: "friends", photoSeed: "hero-friends", tag: "dup-loser", rotate: rot(8) },
  { id: "food-a1", tone: look("food-1"), keyword: "food", photoSeed: "hero-food", tag: "dup-loser", rotate: rot(9) },
  { id: "food-a2", tone: look("food-2"), keyword: "food", photoSeed: "hero-food", tag: "dup-primary", rotate: rot(10), groupSize: 3, role: "Detail" },
  { id: "food-a3", tone: look("food-1"), keyword: "food", photoSeed: "hero-food", tag: "dup-loser", rotate: rot(11) },

  { id: "blur-1", tone: look("city-day"), keyword: "city", photoSeed: "hero-blur-1", tag: "blur", rotate: rot(12) },
  { id: "blur-2", tone: look("street"), keyword: "street", photoSeed: "hero-blur-2", tag: "blur", rotate: rot(13) },
  { id: "blur-3", tone: look("portrait-1"), keyword: "portrait", photoSeed: "hero-blur-3", tag: "blur", rotate: rot(14) },
  { id: "blur-4", tone: look("detail-1"), keyword: "architecture", photoSeed: "hero-blur-4", tag: "blur", rotate: rot(15) },
  { id: "blur-5", tone: look("beach"), keyword: "beach", photoSeed: "hero-blur-5", tag: "blur", rotate: rot(16) },
  { id: "blur-6", tone: look("cafe"), keyword: "coffee", photoSeed: "hero-blur-6", tag: "blur", rotate: rot(17) },
  { id: "blur-7", tone: look("mountain"), keyword: "mountain", photoSeed: "hero-blur-7", tag: "blur", rotate: rot(18) },
  { id: "blur-8", tone: look("greenery"), keyword: "forest", photoSeed: "hero-blur-8", tag: "blur", rotate: rot(19) },

  { id: "ocean", tone: look("ocean"), keyword: "ocean", photoSeed: "hero-ocean", tag: "keep", rotate: rot(20), role: "Detail" },
  { id: "city-dusk", tone: look("city-dusk"), keyword: "city", photoSeed: "hero-city-dusk", tag: "keep", rotate: rot(21), role: "Detail" },
  { id: "portrait-2", tone: look("portrait-2"), keyword: "portrait", photoSeed: "hero-portrait", tag: "keep", rotate: rot(22), role: "Candid" },
  { id: "film-fade", tone: look("film-fade"), keyword: "vintage", photoSeed: "hero-film-fade", tag: "keep", rotate: rot(23), cut: true },
  { id: "candid-1", tone: look("candid-1"), keyword: "people", photoSeed: "hero-candid-1", tag: "keep", rotate: rot(24), role: "Closing shot" },
  { id: "candid-2", tone: look("candid-2"), keyword: "people", photoSeed: "hero-candid-2", tag: "keep", rotate: rot(25), cut: true },
];

const FINAL_ORDER = [
  "sunset-2",
  "friends-a2",
  "food-a2",
  "night-neon",
  "city-dusk",
  "portrait-2",
  "ocean",
  "candid-1",
];

type Stage = "idle" | "analyzing" | "duplicates" | "blur" | "carousel" | "post";

const STAGE_LABEL: Record<Stage, string> = {
  idle: "300 photos",
  analyzing: "analyzing",
  duplicates: "removing duplicates",
  blur: "finding the keepers",
  carousel: "10 photos",
  post: "your post",
};

const TIMINGS_MS: Record<Stage, number> = {
  idle: 0,
  analyzing: 900,
  duplicates: 1100,
  blur: 1100,
  carousel: 1000,
  post: 0,
};

const STAGE_ORDER: Stage[] = ["idle", "analyzing", "duplicates", "blur", "carousel", "post"];

export function HeroCuration() {
  const [stage, setStage] = useState<Stage>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function run() {
    clearTimers();
    if (reducedMotion) {
      setStage("post");
      return;
    }
    let elapsed = 0;
    const startFrom = STAGE_ORDER.indexOf("analyzing");
    for (let i = startFrom; i < STAGE_ORDER.length; i++) {
      elapsed += TIMINGS_MS[STAGE_ORDER[i - 1]] ?? 0;
      const t = setTimeout(() => setStage(STAGE_ORDER[i]), elapsed);
      timers.current.push(t);
    }
  }

  function reset() {
    clearTimers();
    setStage("idle");
  }

  const showDuplicateLosers = stage === "idle" || stage === "analyzing";
  const showBlurry = stage === "idle" || stage === "analyzing" || stage === "duplicates";
  const isCarouselStage = stage === "carousel" || stage === "post";

  const visible = PHOTOS.filter((p) => {
    if (p.tag === "dup-loser") return showDuplicateLosers;
    if (p.tag === "blur") return showBlurry;
    if (isCarouselStage) return FINAL_ORDER.includes(p.id);
    return true;
  });

  const ordered = isCarouselStage
    ? FINAL_ORDER.map((id) => visible.find((p) => p.id === id)).filter((p): p is Photo => Boolean(p))
    : visible;

  return (
    <MotionConfig reducedMotion="user">
      <div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <span
            key={stage}
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontWeight: 900,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {STAGE_LABEL[stage]}
          </span>
          {stage === "idle" && (
            <button
              type="button"
              onClick={run}
              className="ap-flash"
              style={{
                background: "var(--ap-ink)",
                color: "var(--ap-paper)",
                border: "2px solid var(--ap-ink)",
                padding: "9px 18px",
                fontWeight: 800,
                fontSize: 12,
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "var(--font-onest), sans-serif",
              }}
            >
              see it work →
            </button>
          )}
          {stage === "post" && (
            <button
              type="button"
              onClick={reset}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--ap-ink-50)",
                fontWeight: 700,
                fontSize: 12,
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "var(--font-onest), sans-serif",
                textDecoration: "underline",
                textDecorationColor: "var(--ap-lime)",
              }}
            >
              replay
            </button>
          )}
        </div>

        <div
          style={{
            position: "relative",
            border: "2px solid var(--ap-ink)",
            padding: isCarouselStage ? "28px" : "16px",
            minHeight: isCarouselStage ? 320 : undefined,
            background: "var(--ap-paper)",
          }}
        >
          {stage === "analyzing" && (
            <motion.div
              aria-hidden
              initial={{ x: "-30%" }}
              animate={{ x: "130%" }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: 0,
                width: "35%",
                background:
                  "linear-gradient(100deg, transparent, rgba(166,225,0,0.35), transparent)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
          )}

          <div
            style={{
              display: "flex",
              flexWrap: isCarouselStage ? "nowrap" : "wrap",
              gap: isCarouselStage ? 12 : 6,
              overflowX: isCarouselStage ? "auto" : "visible",
              alignItems: "flex-end",
            }}
          >
            <AnimatePresence mode="popLayout">
              {ordered.map((photo) => (
                <PhotoTile
                  key={photo.id}
                  layout
                  tone={photo.tone}
                  src={photoUrl(photo.keyword, hashSeed(photo.photoSeed), 400, 500)}
                  aspect="4/5"
                  blurred={photo.tag === "blur" && showBlurry}
                  flash={photo.id.startsWith("night-flash")}
                  rotate={isCarouselStage ? 0 : photo.rotate}
                  badge={
                    stage === "analyzing" && photo.groupSize ? `1/${photo.groupSize}` : undefined
                  }
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  style={{
                    width: isCarouselStage ? "min(22vw, 180px)" : "clamp(46px, 8vw, 78px)",
                    flexShrink: 0,
                    boxShadow: isCarouselStage ? "0 8px 20px rgba(0,0,0,0.12)" : undefined,
                  }}
                >
                  {isCarouselStage && photo.role && (
                    <span
                      style={{
                        position: "absolute",
                        left: 6,
                        bottom: 6,
                        background: "var(--ap-paper)",
                        border: "1.5px solid var(--ap-ink)",
                        padding: "2px 7px",
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {photo.role}
                    </span>
                  )}
                </PhotoTile>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {stage === "post" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                style={{
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop: "2px solid var(--ap-ink)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ap-ink-50)", textTransform: "uppercase", margin: 0 }}>
                    8 photos · caption
                  </p>
                  <p style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 900, fontSize: 20, margin: "4px 0 0" }}>
                    tokyo lately.
                  </p>
                  <p style={{ fontSize: 12, color: "var(--ap-ink-50)", margin: "6px 0 0" }}>
                    ♪ something that fits the mood
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    style={{
                      background: "transparent",
                      border: "2px solid var(--ap-ink)",
                      color: "var(--ap-ink)",
                      padding: "11px 20px",
                      fontWeight: 800,
                      fontSize: 12,
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontFamily: "var(--font-onest), sans-serif",
                    }}
                  >
                    edit
                  </button>
                  <button
                    type="button"
                    className="ap-flash"
                    style={{
                      background: "var(--ap-lime)",
                      border: "2px solid var(--ap-ink)",
                      color: "var(--ap-ink)",
                      padding: "11px 20px",
                      fontWeight: 800,
                      fontSize: 12,
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontFamily: "var(--font-onest), sans-serif",
                    }}
                  >
                    publish
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
