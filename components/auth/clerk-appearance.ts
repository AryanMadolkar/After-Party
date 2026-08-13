/**
 * Restyles Clerk's hosted SignIn/SignUp widgets to match the ap-scope
 * design system (flat ink/paper/lime, 2px borders, zero radius, Onest
 * type) instead of rebuilding the auth form from scratch. Our own heading
 * copy replaces Clerk's default header (hidden below), and the widget is
 * rendered inside an ".ap-scope" ancestor so these CSS custom properties
 * resolve correctly via inheritance.
 *
 * Typed structurally (no explicit Appearance import) — SignIn/SignUp's own
 * `appearance` prop type validates this at each call site.
 */
export const authAppearance = {
  elements: {
    rootBox: "w-full",
    card: "w-full !p-0 !shadow-none !border-0 !bg-transparent",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "!rounded-none !border-2 !border-[var(--ap-ink)] !bg-transparent !py-[13px] !text-[13px] !font-bold !uppercase !text-[var(--ap-ink)] hover:!bg-[var(--ap-ink)] hover:!text-[var(--ap-paper)]",
    socialButtonsBlockButtonText: "!font-[family-name:var(--font-onest)] !normal-case",
    socialButtonsProviderIcon: "!brightness-0",
    dividerRow: "!my-6",
    dividerLine: "!bg-[var(--ap-ink)] !opacity-15 !h-[1.5px]",
    dividerText: "!text-[11px] !uppercase !text-[var(--ap-ink-50,#5a5850)] !font-[family-name:var(--font-onest)]",
    formFieldLabel:
      "!text-[11px] !font-bold !uppercase !text-[var(--ap-ink-50,#5a5850)] !tracking-wide",
    formFieldInput:
      "!rounded-none !border-2 !border-[var(--ap-ink)] !bg-transparent !px-[14px] !py-[12px] !text-[14px] !shadow-none focus:!border-[var(--ap-ink)] focus:!ring-0",
    formFieldAction: "!text-[12.5px] !font-semibold !text-[var(--ap-ink-50,#5a5850)]",
    formButtonPrimary:
      "!rounded-none !border-2 !border-[var(--ap-ink)] !bg-[var(--ap-lime)] !text-[var(--ap-ink)] !py-[15px] !text-[14px] !font-extrabold !uppercase !shadow-none hover:!bg-[var(--ap-ink)] hover:!text-[var(--ap-paper)]",
    footerActionLink: "!font-bold !text-[var(--ap-ink)] !underline",
    footer: "!bg-transparent",
    footerActionText: "!text-[13px] !text-[var(--ap-ink-50,#5a5850)]",
    identityPreview: "!rounded-none !border-2 !border-[var(--ap-ink)] !bg-transparent",
    formResendCodeLink: "!font-bold !text-[var(--ap-ink)]",
    otpCodeFieldInput: "!rounded-none !border-2 !border-[var(--ap-ink)]",
  },
  variables: {
    colorPrimary: "#0A0A0A",
    colorBackground: "transparent",
    colorForeground: "#0A0A0A",
    colorMutedForeground: "#5a5850",
    borderRadius: "0px",
    fontFamily: "var(--font-onest), sans-serif",
  },
};
