"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, RotateCw, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AdjustmentSlider } from "@/components/editor/adjustment-slider";
import { applyAiEditAction } from "@/app/app/project/[id]/actions";

type Photo = { id: string; thumbnailUrl: string; blobUrl: string };

type Adjustments = {
  brightness: number;
  contrast: number;
  highlights: number;
  shadows: number;
  saturation: number;
  temperature: number;
  sharpness: number;
  rotate: number;
};

const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  saturation: 0,
  temperature: 0,
  sharpness: 0,
  rotate: 0,
};

export function EditorShell({ projectId, photos }: { projectId: string; photos: Photo[] }) {
  const [activeId, setActiveId] = useState(photos[0]?.id);
  const [adjustments, setAdjustments] = useState<Adjustments>(DEFAULT_ADJUSTMENTS);
  const [prompt, setPrompt] = useState("");
  const [applying, setApplying] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const active = photos.find((p) => p.id === activeId) ?? photos[0];

  const filterStyle = useMemo(
    () =>
      [
        `brightness(${1 + adjustments.brightness / 150})`,
        `contrast(${1 + adjustments.contrast / 150})`,
        `saturate(${1 + adjustments.saturation / 100})`,
      ].join(" "),
    [adjustments.brightness, adjustments.contrast, adjustments.saturation],
  );

  const temperatureOverlay = adjustments.temperature !== 0 && (
    <div
      className="pointer-events-none absolute inset-0 mix-blend-overlay"
      style={{
        backgroundColor: adjustments.temperature > 0 ? "#ffb35c" : "#5c9bff",
        opacity: Math.min(Math.abs(adjustments.temperature) / 220, 0.45),
      }}
    />
  );

  function updateAdjustment<K extends keyof Adjustments>(key: K, value: number) {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
  }

  async function handleApplyAiEdit() {
    if (!active || !prompt.trim()) return;
    setApplying(true);
    setAiSummary(null);
    try {
      const result = await applyAiEditAction({ projectId, photoUrl: active.blobUrl, prompt });
      setAiSummary(result.summary);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't apply that edit.");
    } finally {
      setApplying(false);
    }
  }

  if (!active) {
    return <p className="py-24 text-center text-muted-foreground">No photos to edit yet.</p>;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden rounded-xl border border-border/60 bg-muted">
          <div
            className="absolute inset-0 transition-transform duration-200"
            style={{ transform: `rotate(${adjustments.rotate}deg)` }}
          >
            <Image
              src={active.blobUrl}
              alt=""
              fill
              sizes="512px"
              className="object-cover transition-[filter] duration-200"
              style={{ filter: filterStyle }}
              priority
            />
            {temperatureOverlay}
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2 overflow-x-auto">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => {
                setActiveId(photo.id);
                setAdjustments(DEFAULT_ADJUSTMENTS);
                setAiSummary(null);
              }}
              className={cn(
                "relative aspect-square w-14 shrink-0 overflow-hidden rounded-md border-2",
                photo.id === activeId ? "border-foreground" : "border-transparent opacity-70",
              )}
            >
              <Image src={photo.thumbnailUrl} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="mb-3 font-medium">Adjust</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Crop</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast("Cropping isn't available in this preview yet.")}
            >
              Crop
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rotate</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateAdjustment("rotate", (adjustments.rotate + 90) % 360)}
            >
              <RotateCw className="size-3.5" />
              Rotate
            </Button>
          </div>

          <div className="mt-5 space-y-4">
            <AdjustmentSlider
              label="Brightness"
              value={adjustments.brightness}
              onChange={(v) => updateAdjustment("brightness", v)}
            />
            <AdjustmentSlider
              label="Contrast"
              value={adjustments.contrast}
              onChange={(v) => updateAdjustment("contrast", v)}
            />
            <AdjustmentSlider
              label="Highlights"
              value={adjustments.highlights}
              onChange={(v) => updateAdjustment("highlights", v)}
            />
            <AdjustmentSlider
              label="Shadows"
              value={adjustments.shadows}
              onChange={(v) => updateAdjustment("shadows", v)}
            />
            <AdjustmentSlider
              label="Saturation"
              value={adjustments.saturation}
              onChange={(v) => updateAdjustment("saturation", v)}
            />
            <AdjustmentSlider
              label="Temperature"
              value={adjustments.temperature}
              onChange={(v) => updateAdjustment("temperature", v)}
            />
            <AdjustmentSlider
              label="Sharpness"
              value={adjustments.sharpness}
              onChange={(v) => updateAdjustment("sharpness", v)}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={() => setAdjustments(DEFAULT_ADJUSTMENTS)}
          >
            Reset
          </Button>
        </div>

        <div className="border-t border-border/60 pt-6">
          <h3 className="flex items-center gap-1.5 font-medium">
            <Sparkles className="size-4 text-muted-foreground" />
            AI edit
          </h3>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe an edit... e.g. 'Remove the person in the background.'"
            className="mt-3"
            rows={3}
          />
          <Button
            type="button"
            size="sm"
            className="mt-3"
            onClick={handleApplyAiEdit}
            disabled={applying || !prompt.trim()}
          >
            {applying && <Loader2 className="size-3.5 animate-spin" />}
            Apply
          </Button>
          {aiSummary && (
            <p className="mt-3 rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
              {aiSummary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
