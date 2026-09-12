import { Suspense } from "react";
import type { Metadata } from "next";

import { CutRoomAuthForm } from "@/components/auth/cutroom-auth-form";
import { redirectIfAuthenticated } from "@/components/layout/auth-gate";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <div className="cr-card" style={{ padding: 28 }}>
      <h1 style={{ margin: "0 0 6px", fontSize: 24, letterSpacing: "-0.03em", fontWeight: 700 }}>
        Log in to CutRoom
      </h1>
      <p className="cr-muted" style={{ margin: "0 0 22px", fontSize: 14 }}>
        Access your agency packaging desk.
      </p>
      <Suspense fallback={null}>
        <CutRoomAuthForm mode="login" />
      </Suspense>
    </div>
  );
}
