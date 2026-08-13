import { Hero } from "@/components/landing/hero";
import { StatBar } from "@/components/landing/stat-bar";
import { PhotoStrip } from "@/components/landing/photo-strip";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Modes } from "@/components/landing/modes";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { ClosingCta } from "@/components/landing/closing-cta";

export default function MarketingPage() {
  return (
    <>
      <Hero />
      <StatBar />
      <PhotoStrip />
      <HowItWorks />
      <Modes />
      <Pricing />
      <Faq />
      <ClosingCta />
    </>
  );
}
