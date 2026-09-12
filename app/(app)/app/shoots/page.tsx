import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shoots",
};

export default function ShootsPage() {
  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.03em", fontWeight: 700 }}>Shoots</h1>
      <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 15 }}>
        New shoot uploads and the packaging queue land in later slices.
      </p>
      <button type="button" className="cr-btn cr-btn-primary" style={{ marginTop: 20 }} disabled>
        New shoot (soon)
      </button>
    </div>
  );
}
