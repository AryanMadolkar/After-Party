"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { updateBrandKitAction } from "@/app/(app)/app/clients/actions";
import {
  computeBrandKitCompleteness,
  type BrandKit,
  type BrandKitCompleteness,
  type CaptionLanguages,
} from "@/lib/contracts";

function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function listToLines(value: string[]): string {
  return value.join("\n");
}

const WARNING_COPY: Record<string, string> = {
  MISSING_LOGO: "Logo not set — scoring and exports will use a weaker identity signal.",
  MISSING_VOICE_NOTES: "Voice notes empty — captions may miss client tone.",
};

export function BrandKitEditor({
  clientId,
  clientName,
  initialKit,
  initialCompleteness,
  canEdit,
}: {
  clientId: string;
  clientName: string;
  initialKit: BrandKit;
  initialCompleteness: BrandKitCompleteness;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [primaryColor, setPrimaryColor] = useState(initialKit.primaryColor ?? "");
  const [secondaryColors, setSecondaryColors] = useState(listToLines(initialKit.secondaryColors));
  const [logoBlobKey, setLogoBlobKey] = useState(initialKit.logoBlobKey ?? "");
  const [voiceNotes, setVoiceNotes] = useState(initialKit.voiceNotes ?? "");
  const [dos, setDos] = useState(listToLines(initialKit.dos));
  const [donts, setDonts] = useState(listToLines(initialKit.donts));
  const [sampleCaptions, setSampleCaptions] = useState(listToLines(initialKit.sampleCaptions));
  const [hiEnabled, setHiEnabled] = useState(initialKit.captionLanguages.length > 1);
  const [forbiddenTopics, setForbiddenTopics] = useState(listToLines(initialKit.forbiddenTopics));
  const [mustIncludeHints, setMustIncludeHints] = useState(listToLines(initialKit.mustIncludeHints));
  const [completeness, setCompleteness] = useState(initialCompleteness);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const liveCompleteness = useMemo(() => {
    const captionLanguages: CaptionLanguages = hiEnabled ? ["en", "hi"] : ["en"];
    return computeBrandKitCompleteness({
      primaryColor: primaryColor.trim() || null,
      logoBlobKey: logoBlobKey.trim() || null,
      voiceNotes: voiceNotes.trim() || null,
      dos: linesToList(dos),
      donts: linesToList(donts),
      sampleCaptions: linesToList(sampleCaptions),
      captionLanguages,
      forbiddenTopics: linesToList(forbiddenTopics),
      mustIncludeHints: linesToList(mustIncludeHints),
    });
  }, [
    primaryColor,
    logoBlobKey,
    voiceNotes,
    dos,
    donts,
    sampleCaptions,
    hiEnabled,
    forbiddenTopics,
    mustIncludeHints,
  ]);

  const meter = saved ? completeness : liveCompleteness;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit) return;
    setError(null);
    setSaved(false);
    setPending(true);
    const captionLanguages: CaptionLanguages = hiEnabled ? ["en", "hi"] : ["en"];
    const result = await updateBrandKitAction(clientId, {
      primaryColor: primaryColor.trim() || null,
      secondaryColors: linesToList(secondaryColors),
      logoBlobKey: logoBlobKey.trim() || null,
      voiceNotes: voiceNotes.trim() || null,
      dos: linesToList(dos),
      donts: linesToList(donts),
      sampleCaptions: linesToList(sampleCaptions),
      captionLanguages,
      forbiddenTopics: linesToList(forbiddenTopics),
      mustIncludeHints: linesToList(mustIncludeHints),
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCompleteness(result.completeness);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} style={{ display: "grid", gap: 8, maxWidth: 720 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div>
          <p className="cr-brand-lock" style={{ width: "fit-content", marginBottom: 10 }}>
            <span className="cr-brand-dot" aria-hidden />
            Brand lock
          </p>
          <h1 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.03em", fontWeight: 700 }}>
            {clientName}
          </h1>
          <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 15 }}>
            Identity · Voice · Guardrails · Languages
          </p>
        </div>
        <Link href={`/app/clients/${clientId}`} className="cr-btn cr-btn-secondary">
          Back to client
        </Link>
      </div>

      <div className="cr-card" style={{ padding: 16, marginTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 650 }}>Completeness</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--cr-brand-lock)" }}>{meter.score}%</span>
        </div>
        <div className="cr-meter-track" aria-hidden>
          <div className="cr-meter-fill" style={{ width: `${meter.score}%` }} />
        </div>
      </div>

      {meter.softWarnings.length > 0 && (
        <div className="cr-soft-warn" role="status">
          <strong style={{ display: "block", marginBottom: 4 }}>Before create first shoot</strong>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {meter.softWarnings.map((code) => (
              <li key={code}>{WARNING_COPY[code] ?? code}</li>
            ))}
          </ul>
        </div>
      )}

      {!canEdit && (
        <p className="cr-muted" style={{ fontSize: 13, margin: 0 }}>
          Editors can view this kit but cannot edit. Ask an owner or producer to update brand lock.
        </p>
      )}

      <section className="cr-kit-section">
        <h2 className="cr-kit-section-title">Identity</h2>
        <div className="cr-field-stack">
          <label className="cr-label" htmlFor="primary-color">
            Primary color
          </label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(primaryColor) ? primaryColor : "#0F766E"}
              onChange={(e) => setPrimaryColor(e.target.value)}
              disabled={!canEdit || pending}
              aria-label="Pick primary color"
            />
            <input
              id="primary-color"
              className="cr-input"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              placeholder="#0F766E"
              disabled={!canEdit || pending}
            />
          </div>
        </div>
        <div className="cr-field-stack">
          <label className="cr-label" htmlFor="secondary-colors">
            Secondary colors <span className="cr-muted">(one per line)</span>
          </label>
          <textarea
            id="secondary-colors"
            className="cr-input"
            rows={3}
            value={secondaryColors}
            onChange={(e) => setSecondaryColors(e.target.value)}
            disabled={!canEdit || pending}
          />
        </div>
        <div className="cr-field-stack">
          <label className="cr-label" htmlFor="logo-key">
            Logo blob key
          </label>
          <input
            id="logo-key"
            className="cr-input"
            value={logoBlobKey}
            onChange={(e) => setLogoBlobKey(e.target.value)}
            placeholder="orgs/…/logo/…"
            disabled={!canEdit || pending}
          />
          <p className="cr-muted" style={{ margin: 0, fontSize: 12 }}>
            Upload signing ships with Blob in a later slice — paste a key for now.
          </p>
        </div>
      </section>

      <section className="cr-kit-section">
        <h2 className="cr-kit-section-title">Voice</h2>
        <div className="cr-field-stack">
          <label className="cr-label" htmlFor="voice-notes">
            Voice notes
          </label>
          <textarea
            id="voice-notes"
            className="cr-input"
            rows={4}
            value={voiceNotes}
            onChange={(e) => setVoiceNotes(e.target.value)}
            placeholder="Warm, concise, hospitality-forward. Avoid slang."
            disabled={!canEdit || pending}
          />
        </div>
        <div className="cr-field-stack">
          <label className="cr-label" htmlFor="dos">
            Dos <span className="cr-muted">(one per line)</span>
          </label>
          <textarea id="dos" className="cr-input" rows={3} value={dos} onChange={(e) => setDos(e.target.value)} disabled={!canEdit || pending} />
        </div>
        <div className="cr-field-stack">
          <label className="cr-label" htmlFor="donts">
            Don&apos;ts <span className="cr-muted">(one per line)</span>
          </label>
          <textarea id="donts" className="cr-input" rows={3} value={donts} onChange={(e) => setDonts(e.target.value)} disabled={!canEdit || pending} />
        </div>
        <div className="cr-field-stack">
          <label className="cr-label" htmlFor="samples">
            Sample captions <span className="cr-muted">(one per line)</span>
          </label>
          <textarea
            id="samples"
            className="cr-input"
            rows={4}
            value={sampleCaptions}
            onChange={(e) => setSampleCaptions(e.target.value)}
            disabled={!canEdit || pending}
          />
        </div>
      </section>

      <section className="cr-kit-section">
        <h2 className="cr-kit-section-title">Guardrails</h2>
        <div className="cr-field-stack">
          <label className="cr-label" htmlFor="forbidden">
            Forbidden topics
          </label>
          <textarea
            id="forbidden"
            className="cr-input"
            rows={3}
            value={forbiddenTopics}
            onChange={(e) => setForbiddenTopics(e.target.value)}
            disabled={!canEdit || pending}
          />
        </div>
        <div className="cr-field-stack">
          <label className="cr-label" htmlFor="must-include">
            Must-include hints
          </label>
          <textarea
            id="must-include"
            className="cr-input"
            rows={3}
            value={mustIncludeHints}
            onChange={(e) => setMustIncludeHints(e.target.value)}
            disabled={!canEdit || pending}
          />
        </div>
      </section>

      <section className="cr-kit-section">
        <h2 className="cr-kit-section-title">Languages</h2>
        <p className="cr-muted" style={{ margin: 0, fontSize: 13 }}>
          English is always on. Toggle Hindi for bilingual caption packs.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="cr-chip-toggle" data-on="true" aria-disabled>
            EN
          </span>
          <button
            type="button"
            className="cr-chip-toggle"
            data-on={hiEnabled ? "true" : "false"}
            disabled={!canEdit || pending}
            onClick={() => setHiEnabled((v) => !v)}
          >
            HI
          </button>
        </div>
        {hiEnabled && (
          <p className="cr-hi-sample cr-muted" style={{ margin: 0, fontSize: 14 }}>
            नमूना कैप्शन — client voice in Devanagari when HI is enabled.
          </p>
        )}
      </section>

      {error && (
        <p style={{ margin: 0, color: "var(--cr-reject)", fontSize: 13 }}>{error}</p>
      )}
      {saved && !error && (
        <p style={{ margin: 0, color: "var(--cr-approve)", fontSize: 13 }}>Brand kit saved.</p>
      )}

      {canEdit && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 8 }}>
          <button type="submit" className="cr-btn cr-btn-primary" disabled={pending}>
            {pending ? "Saving…" : "Save brand kit"}
          </button>
          <Link href="/app/shoots" className="cr-btn cr-btn-secondary">
            Create first shoot
          </Link>
        </div>
      )}
    </form>
  );
}
