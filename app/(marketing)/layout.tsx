import { MarketingNav } from "@/components/landing/marketing-nav";
import { Ticker } from "@/components/landing/ticker";
import { MarketingFooter } from "@/components/landing/marketing-footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ap-scope" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <MarketingNav />
      <Ticker />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,56px)" }}>{children}</div>
      <MarketingFooter />
    </div>
  );
}
