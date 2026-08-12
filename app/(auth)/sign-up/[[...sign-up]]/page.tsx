import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "w-full max-w-sm",
          card: "shadow-none border border-border rounded-2xl",
        },
      }}
    />
  );
}
