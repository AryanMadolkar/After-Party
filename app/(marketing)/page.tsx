import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { CurationSection } from "@/components/landing/curation-section";
import { CarouselBuilderSection } from "@/components/landing/carousel-builder-section";
import { PhotoDumpSection } from "@/components/landing/photo-dump-section";
import { CaptionsSection } from "@/components/landing/captions-section";
import { EditingSection } from "@/components/landing/editing-section";
import { FullExperienceSection } from "@/components/landing/full-experience-section";
import { TasteSection } from "@/components/landing/taste-section";
import { Pricing } from "@/components/landing/pricing";
import { ClosingCta } from "@/components/landing/closing-cta";

export default function MarketingPage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <CurationSection />
      <CarouselBuilderSection />
      <PhotoDumpSection />
      <CaptionsSection />
      <EditingSection />
      <FullExperienceSection />
      <TasteSection />
      <Pricing />
      <ClosingCta />
    </>
  );
}
