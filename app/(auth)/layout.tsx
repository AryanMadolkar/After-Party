import Link from "next/link";

import { PhotoCollage } from "@/components/auth/photo-collage";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ap-scope" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav style={{ padding: "18px clamp(20px,5vw,56px)", borderBottom: "2px solid var(--ap-ink)" }}>
        <Link
          href="/"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "fit-content",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              background: "var(--ap-lime)",
              border: "2px solid var(--ap-ink)",
              borderRadius: "50%",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontWeight: 900,
              fontSize: 19,
              textTransform: "uppercase",
              color: "var(--ap-ink)",
            }}
          >
            After Party
          </span>
        </Link>
      </nav>
      <div className="ap-auth-grid" style={{ flex: 1 }}>
        <div className="ap-auth-collage">
          <PhotoCollage />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40, minWidth: 0 }}>
          <div style={{ maxWidth: 360, width: "100%" }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
