import { SignUp } from "@clerk/nextjs";

import { AuthTabs } from "@/components/auth/auth-tabs";
import { authAppearance } from "@/components/auth/clerk-appearance";

export default function SignUpPage() {
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
        let&apos;s build your first post.
      </h2>
      <SignUp appearance={authAppearance} />
    </div>
  );
}
