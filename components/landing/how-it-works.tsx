import { PipelineVisual } from "@/components/landing/pipeline-visual";

const STEPS = [
  {
    title: "Understands your trip",
    body: "After Party looks at every photo together — not one at a time — to understand the story of your trip or event.",
  },
  {
    title: "Finds your best shots",
    body: "Duplicates and near-identical bursts are grouped automatically, and each photo is scored for quality, composition, and sharpness.",
  },
  {
    title: "Builds the post for you",
    body: "Carousels, photo dumps, and stories are assembled from your strongest photos — ready to reorder or fine-tune.",
  },
  {
    title: "Finishes the look",
    body: "Captions and song recommendations are generated to match the mood, with editing tools to polish the final frame.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
              From camera roll to caption, in one pass.
            </h2>

            <ol className="mt-10 space-y-8">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-5">
                  <span className="font-serif text-lg text-muted-foreground/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex items-center justify-center rounded-xl border border-border/60 bg-background py-16">
            <PipelineVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
