import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Billing",
};

export default function BillingSettingsPage() {
  return (
    <div style={{ maxWidth: 560 }}>
      <Link href="/app/settings" className="cr-muted" style={{ fontSize: 13, textDecoration: "none" }}>
        ← Settings
      </Link>
      <h1 style={{ margin: "12px 0 0", fontSize: 28, letterSpacing: "-0.03em", fontWeight: 700 }}>
        Billing
      </h1>
      <p className="cr-muted" style={{ margin: "8px 0 20px", fontSize: 15 }}>
        Plan upgrades and Razorpay checkout ship in Solo-P8. This page is the upgrade CTA target
        for client plan limits.
      </p>
      <div className="cr-card" style={{ padding: 20 }}>
        <div style={{ fontWeight: 650 }}>Upgrade coming soon</div>
        <p className="cr-muted" style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.45 }}>
          Studio · 3 clients · Agency · 15 · Agency+ · 40. Checkout wiring lands with billing.
        </p>
      </div>
    </div>
  );
}
