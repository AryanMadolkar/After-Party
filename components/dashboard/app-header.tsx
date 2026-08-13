import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/current-user";
import { getInitials } from "@/lib/utils";
import { UserMenu } from "@/components/dashboard/user-menu";

export async function AppHeader() {
  const user = await getCurrentUser();

  return (
    <header
      className="ap-scope"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px clamp(20px,5vw,56px)",
        background: "var(--ap-paper)",
        borderBottom: "2px solid var(--ap-ink)",
      }}
    >
      <Link
        href="/app"
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
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

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Link
          href="/app/new"
          className="ap-flash"
          style={{
            background: "var(--ap-pink)",
            color: "var(--ap-ink)",
            border: "2px solid var(--ap-ink)",
            padding: "10px 20px",
            fontWeight: 800,
            fontSize: 13,
            textTransform: "uppercase",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          + new project
        </Link>
        {user && <UserMenu initials={getInitials(user.name, user.email)} email={user.email} />}
      </div>
    </header>
  );
}
