"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

export type UploadPhase = "uploading" | "processing" | "done";

export function UploadProgress({
  phase,
  total,
  uploaded,
  failed,
  overallPercentage,
  stageLabel,
  failedFilenames,
}: {
  phase: UploadPhase;
  total: number;
  uploaded: number;
  failed: number;
  overallPercentage: number;
  stageLabel: string;
  failedFilenames: string[];
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <div className="flex items-center gap-3">
        {phase !== "done" && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        {phase === "done" && <CheckCircle2 className="size-4 text-foreground" />}
        <p className="text-sm font-medium">{stageLabel}</p>
      </div>

      <Progress value={overallPercentage} className="mt-4" />

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {uploaded} of {total} photos uploaded
        </span>
        {failed > 0 && (
          <span className="flex items-center gap-1 text-destructive">
            <AlertCircle className="size-3.5" />
            {failed} failed
          </span>
        )}
      </div>

      {failedFilenames.length > 0 && (
        <ScrollArea className="mt-3 max-h-24 rounded-md border border-border/60 bg-muted/40 p-2">
          <ul className="space-y-0.5 text-xs text-muted-foreground">
            {failedFilenames.map((name) => (
              <li key={name} className="truncate">
                {name}
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
}
