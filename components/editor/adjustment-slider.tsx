"use client";

import { Slider } from "@/components/ui/slider";

export function AdjustmentSlider({
  label,
  value,
  onChange,
  min = -100,
  max = 100,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground tabular-nums">{value}</span>
      </div>
      <Slider
        className="mt-2"
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={([next]) => onChange(next)}
      />
    </div>
  );
}
