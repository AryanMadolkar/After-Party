import Link from "next/link";

export function DashboardEmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid var(--ap-ink)",
        padding: "112px 24px",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(28px,4vw,40px)",
          margin: 0,
          textTransform: "uppercase",
        }}
      >
        your next post starts here
      </h2>
      <p style={{ marginTop: 10, maxWidth: "40ch", fontSize: 14, color: "var(--ap-ink-70)" }}>
        Upload the photos from your trip or event and After Party will find the ones worth
        posting.
      </p>
      <Link
        href="/app/new"
        className="ap-flash"
        style={{
          marginTop: 28,
          background: "var(--ap-lime)",
          color: "var(--ap-ink)",
          border: "2px solid var(--ap-ink)",
          padding: "15px 28px",
          fontWeight: 800,
          fontSize: 13,
          textTransform: "uppercase",
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        create a project
      </Link>
    </div>
  );
}
