export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  // Marketing page owns its full-bleed chrome; keep the route group thin.
  return children;
}
