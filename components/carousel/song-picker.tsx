"use client";

import { useState } from "react";
import { Loader2, Music, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { recommendSongsAction } from "@/app/app/project/[id]/actions";
import type { SongRecommendation } from "@/lib/ai/types";

export function SongPicker({
  projectId,
  value,
  onChange,
}: {
  projectId: string;
  value: SongRecommendation | null;
  onChange: (song: SongRecommendation | null) => void;
}) {
  const [suggestions, setSuggestions] = useState<SongRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchSuggestions() {
    setLoading(true);
    try {
      const results = await recommendSongsAction({ projectId });
      setSuggestions(results);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Song</h3>
        <Button type="button" variant="ghost" size="sm" onClick={fetchSuggestions} disabled={loading}>
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          {suggestions.length > 0 ? "More ideas" : "Recommend songs"}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-3 space-y-2">
          {suggestions.map((song) => {
            const isSelected = value?.name === song.name && value?.artist === song.artist;
            return (
              <button
                key={`${song.name}-${song.artist}`}
                type="button"
                onClick={() => onChange(isSelected ? null : song)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border border-border/60 px-3.5 py-2.5 text-left transition-colors hover:border-foreground/30",
                  isSelected && "border-foreground/60 bg-accent",
                )}
              >
                <Music className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{song.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {song.artist} · {song.reason}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
