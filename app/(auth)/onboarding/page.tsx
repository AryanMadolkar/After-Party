import type { Metadata } from "next";

import { OnboardingForm } from "@/components/auth/onboarding-form";
import { requireOnboardingSession } from "@/components/layout/auth-gate";

export const metadata: Metadata = {
  title: "Set up your workspace",
};

export default async function OnboardingPage() {
  await requireOnboardingSession();

  return (
    <div className="cr-card" style={{ padding: 28, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 6px", fontSize: 24, letterSpacing: "-0.03em", fontWeight: 700 }}>
        Set up your agency
      </h1>
      <p className="cr-muted" style={{ margin: "0 0 22px", fontSize: 14 }}>
        Name the workspace, pick a plan, and land in CutRoom.
      </p>
      <OnboardingForm />
    </div>
  );
}
