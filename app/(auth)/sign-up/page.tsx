import { AuthTabs } from "@/components/auth/auth-tabs";
import { SocialButtons } from "@/components/auth/social-buttons";
import { AuthForm } from "@/components/auth/auth-form";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

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
      <SocialButtons />
      <AuthForm mode="sign-up" initialError={error ?? null} />
      <p style={{ fontSize: 13, color: "var(--ap-ink-50)", marginTop: 22, textAlign: "center" }}>
        already have an account?{" "}
        <a href="/sign-in" style={{ fontWeight: 700 }}>
          sign in
        </a>
      </p>
    </div>
  );
}
