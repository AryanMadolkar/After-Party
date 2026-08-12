import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "w-full max-w-sm",
          card: "shadow-none border border-border rounded-2xl",
        },
      }}
    />
  );
}
