"use client";

import { Images, Layers, Sparkles, UsersRound, Heart, Wand2, Clapperboard } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SelectionType } from "@/db/schema";

const OPTIONS: Array<{
  type: SelectionType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}> = [
  { type: "best_photos", label: "Best Photos", description: "Your strongest shots overall", icon: Sparkles },
  { type: "carousel", label: "Carousel", description: "An ordered, swipeable post", icon: Layers },
  { type: "photo_dump", label: "Photo Dump", description: "A looser, larger set", icon: Images },
  { type: "friends", label: "Friends", description: "Group and friend moments", icon: UsersRound },
  { type: "couple", label: "Couple", description: "Just the two of you", icon: Heart },
  { type: "aesthetic", label: "Aesthetic", description: "Cohesive tone and color", icon: Wand2 },
  { type: "story", label: "Story", description: "A quick vertical sequence", icon: Clapperboard },
];

export function SelectionTypePicker({
  onSelect,
  pending,
}: {
  onSelect: (type: SelectionType) => void;
  pending: SelectionType | null;
}) {
  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight">What do you want to create?</h1>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {OPTIONS.map(({ type, label, description, icon: Icon }) => (
          <button
            key={type}
            type="button"
            disabled={pending !== null}
            onClick={() => onSelect(type)}
            className={cn(
              "flex flex-col items-start gap-3 rounded-xl border border-border/60 p-5 text-left transition-colors hover:border-foreground/30 hover:bg-accent/40 disabled:opacity-50",
              pending === type && "border-foreground/40 bg-accent/40",
            )}
          >
            <Icon className="size-5 text-muted-foreground" strokeWidth={1.5} />
            <div>
              <p className="font-medium">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
