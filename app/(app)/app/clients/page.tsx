import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients",
};

export default function ClientsPage() {
  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.03em", fontWeight: 700 }}>Clients</h1>
      <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 15 }}>
        Create your first client — brand kits and CRUD ship in Solo-P4.
      </p>
      <button type="button" className="cr-btn cr-btn-primary" style={{ marginTop: 20 }} disabled>
        Create client (soon)
      </button>
    </div>
  );
}
