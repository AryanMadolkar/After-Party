import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const fontSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const fontSerif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: {
    default: "After Party — Turn hundreds of photos into the perfect post",
    template: "%s · After Party",
  },
  description:
    "After Party uses AI to find the photos worth posting, build your carousel, write your caption, and finish the look.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} ${fontSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            signInFallbackRedirectUrl="/app"
            signUpFallbackRedirectUrl="/app"
            appearance={{
              variables: {
                colorPrimary: "oklch(0.19 0.006 60)",
                colorBackground: "oklch(0.995 0.002 75)",
                colorForeground: "oklch(0.19 0.006 60)",
                colorMutedForeground: "oklch(0.47 0.007 60)",
                borderRadius: "0.5rem",
                fontFamily: "var(--font-sans)",
              },
            }}
          >
            <TooltipProvider delayDuration={150}>
              {children}
              <Toaster position="bottom-right" />
            </TooltipProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
