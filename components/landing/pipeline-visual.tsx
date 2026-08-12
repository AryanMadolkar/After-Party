import { ArrowDown, Sparkle } from "lucide-react";

const DENSE_TONES = [
  "from-[#d8c3a5] to-[#8f7a63]",
  "from-[#9db4c0] to-[#5f7a8a]",
  "from-[#c9ada7] to-[#8a6f6a]",
  "from-[#e8d5b7] to-[#b99b6b]",
  "from-[#7d8597] to-[#4a5568]",
  "from-[#a3b18a] to-[#5f6f4f]",
  "from-[#c4a389] to-[#7a5c46]",
  "from-[#8d9db6] to-[#525f7a]",
  "from-[#d6c9b8] to-[#a08d76]",
  "from-[#9db4c0] to-[#5f7a8a]",
  "from-[#c9ada7] to-[#8a6f6a]",
  "from-[#a3b18a] to-[#5f6f4f]",
];

const SELECTED_TONES = [
  "from-[#e8d5b7] to-[#b99b6b]",
  "from-[#9db4c0] to-[#5f7a8a]",
  "from-[#c4a389] to-[#7a5c46]",
];

export function PipelineVisual() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
      <PipelineStage label="300 photos">
        <div className="grid w-56 grid-cols-6 gap-1">
          {DENSE_TONES.map((tone, i) => (
            <div key={i} className={`aspect-square rounded-sm bg-gradient-to-br ${tone}`} />
          ))}
        </div>
      </PipelineStage>

      <ArrowDown className="size-5 text-muted-foreground/50" strokeWidth={1.5} />

      <PipelineStage label="After Party">
        <div className="flex size-14 items-center justify-center rounded-full border border-border bg-card">
          <Sparkle className="size-5 text-foreground" strokeWidth={1.5} />
        </div>
      </PipelineStage>

      <ArrowDown className="size-5 text-muted-foreground/50" strokeWidth={1.5} />

      <PipelineStage label="10 photos">
        <div className="flex w-56 justify-center gap-1.5">
          {SELECTED_TONES.map((tone, i) => (
            <div
              key={i}
              className={`aspect-[4/5] w-16 rounded-md bg-gradient-to-br shadow-sm ${tone}`}
            />
          ))}
        </div>
      </PipelineStage>

      <ArrowDown className="size-5 text-muted-foreground/50" strokeWidth={1.5} />

      <PipelineStage label="Instagram carousel">
        <div className="relative">
          <div className="absolute -right-2 top-2 aspect-[4/5] w-36 rounded-lg border border-border bg-card shadow-sm" />
          <div className="relative aspect-[4/5] w-36 overflow-hidden rounded-lg border border-border bg-gradient-to-br from-[#e8d5b7] to-[#b99b6b] shadow-md">
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`size-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </PipelineStage>
    </div>
  );
}

function PipelineStage({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {children}
      <span className="text-sm font-medium tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}
