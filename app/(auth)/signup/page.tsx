import { Suspense } from "react";
import type { Metadata } from "next";

import { CutRoomAuthForm } from "@/components/auth/cutroom-auth-form";
import { redirectIfAuthenticated } from "@/components/layout/auth-gate";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function SignupPage() {
  await redirectIfAuthenticated();

  return (
    <div className="cr-card" style={{ padding: 28 }}>
      <h1 style={{ margin: "0 0 6px", fontSize: 24, letterSpacing: "-0.03em", fontWeight: 700 }}>
        Create your CutRoom account
      </h1>
      <p className="cr-muted" style={{ margin: "0 0 22px", fontSize: 14 }}>
        Then set up your agency workspace.
      </p>
      <Suspense fallback={null}>
        <CutRoomAuthForm mode="signup" />
      </Suspense>
    </div>
  );
}
