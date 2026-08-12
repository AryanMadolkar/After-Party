"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateCaptionsAction } from "@/app/app/project/[id]/actions";
import type { CaptionStyle } from "@/db/schema";

const STYLES: Array<{ value: CaptionStyle; label: string }> = [
  { value: "minimal", label: "Minimal" },
  { value: "funny", label: "Funny" },
  { value: "story", label: "Story" },
  { value: "casual", label: "Casual" },
  { value: "romantic", label: "Romantic" },
  { value: "none", label: "No Caption" },
];

export function CaptionPicker({
  projectId,
  value,
  onChange,
}: {
  projectId: string;
  value: { style: CaptionStyle; text: string };
  onChange: (value: { style: CaptionStyle; text: string }) => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleStyleChange(style: CaptionStyle) {
    onChange({ style, text: style === "none" ? "" : value.text });
    setSuggestions([]);
    if (style === "none") return;

    setLoading(true);
    try {
      const results = await generateCaptionsAction({ projectId, style });
      setSuggestions(results);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="font-medium">Caption</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {STYLES.map((style) => (
          <button
            key={style.value}
            type="button"
            onClick={() => handleStyleChange(style.value)}
            className={cn(
              "rounded-full border border-border/60 px-3.5 py-1.5 text-sm transition-colors hover:border-foreground/30",
              value.style === style.value && "border-foreground bg-foreground text-background",
            )}
          >
            {style.label}
          </button>
        ))}
      </div>

      {value.style !== "none" && (
        <div className="mt-4 space-y-3">
          {loading && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> Generating captions...
            </p>
          )}

          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onChange({ style: value.style, text: suggestion })}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border border-border/60 px-3.5 py-1.5 text-left text-sm transition-colors hover:border-foreground/30",
                    value.text === suggestion && "border-foreground/60 bg-accent",
                  )}
                >
                  <Sparkles className="size-3 text-muted-foreground" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <Textarea
            value={value.text}
            onChange={(e) => onChange({ style: value.style, text: e.target.value })}
            placeholder="Write your own caption..."
            className="max-w-xl"
            rows={3}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleStyleChange(value.style)}
            disabled={loading}
          >
            Regenerate suggestions
          </Button>
        </div>
      )}
    </div>
  );
}
