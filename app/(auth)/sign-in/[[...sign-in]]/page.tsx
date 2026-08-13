import { SignIn } from "@clerk/nextjs";

import { AuthTabs } from "@/components/auth/auth-tabs";
import { authAppearance } from "@/components/auth/clerk-appearance";

export default function SignInPage() {
  return (
    <div>
      <AuthTabs />
      <h2
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: 26,
          margin: "0 0 24px",
          textTransform: "uppercase",
        }}
      >
        welcome back.
      </h2>
      <SignIn appearance={authAppearance} />
    </div>
  );
}
