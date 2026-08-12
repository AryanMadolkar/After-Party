"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Plus, RefreshCw, Repeat, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PhotoPickerDialog, type PickablePhoto } from "@/components/carousel/photo-picker-dialog";
import {
  addToSelectionAction,
  buildSelectionAction,
  removeFromSelectionAction,
  reorderSelectionAction,
} from "@/app/app/project/[id]/actions";
import type { SelectionType } from "@/db/schema";

export type EditorPhoto = {
  id: string;
  thumbnailUrl: string;
  blobUrl: string;
};

export function CarouselEditor({
  projectId,
  type,
  selectionId,
  initialPhotos,
  poolPhotos,
  onSelectionChange,
}: {
  projectId: string;
  type: SelectionType;
  selectionId: string;
  initialPhotos: EditorPhoto[];
  poolPhotos: EditorPhoto[];
  onSelectionChange: (selectionId: string, photos: EditorPhoto[]) => void;
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pickerMode, setPickerMode] = useState<"add" | { replaceId: string } | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const remainingPool: PickablePhoto[] = poolPhotos.filter(
    (p) => !photos.some((selected) => selected.id === p.id),
  );

  function persistOrder(next: EditorPhoto[]) {
    setPhotos(next);
    reorderSelectionAction({
      selectionId,
      projectId,
      photoIds: next.map((p) => p.id),
    }).catch(() => toast.error("Couldn't save the new order."));
  }

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const next = [...photos];
    const fromIndex = next.findIndex((p) => p.id === dragId);
    const toIndex = next.findIndex((p) => p.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    persistOrder(next);
    setDragId(null);
  }

  async function handleRemove(photoId: string) {
    const next = photos.filter((p) => p.id !== photoId);
    setPhotos(next);
    setActiveIndex((i) => Math.min(i, Math.max(next.length - 1, 0)));
    try {
      await removeFromSelectionAction({ selectionId, projectId, photoId });
    } catch {
      toast.error("Couldn't remove that photo.");
    }
  }

  async function handlePick(photoId: string) {
    const picked = poolPhotos.find((p) => p.id === photoId);
    if (!picked) return;

    if (pickerMode && pickerMode !== "add") {
      const replaceId = pickerMode.replaceId;
      const position = photos.findIndex((p) => p.id === replaceId);
      const next = photos.map((p) => (p.id === replaceId ? picked : p));
      setPhotos(next);
      setPickerMode(null);
      try {
        await removeFromSelectionAction({ selectionId, projectId, photoId: replaceId });
        await addToSelectionAction({ selectionId, projectId, photoId, position });
      } catch {
        toast.error("Couldn't replace that photo.");
      }
      return;
    }

    const next = [...photos, picked];
    setPhotos(next);
    setPickerMode(null);
    try {
      await addToSelectionAction({ selectionId, projectId, photoId, position: next.length - 1 });
    } catch {
      toast.error("Couldn't add that photo.");
    }
  }

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      const result = await buildSelectionAction({ projectId, type });
      const nextPhotos = result.photoIds
        .map((id) => poolPhotos.find((p) => p.id === id) ?? photos.find((p) => p.id === id))
        .filter((p): p is EditorPhoto => Boolean(p));
      setPhotos(nextPhotos);
      setActiveIndex(0);
      onSelectionChange(result.selectionId, nextPhotos);
      toast.success("Regenerated selection");
    } catch {
      toast.error("Couldn't regenerate the selection.");
    } finally {
      setRegenerating(false);
    }
  }

  const activePhoto = photos[activeIndex] ?? photos[0];

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {photos.length} {photos.length === 1 ? "photo" : "photos"}
        </p>
        <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={regenerating}>
          {regenerating ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          Regenerate
        </Button>
      </div>

      {activePhoto && (
        <div className="relative mt-5 aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl border border-border/60 bg-muted">
          <Image
            src={activePhoto.blobUrl}
            alt=""
            fill
            sizes="480px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            draggable
            onDragStart={() => setDragId(photo.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(photo.id)}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "group relative aspect-square w-20 shrink-0 cursor-grab overflow-hidden rounded-md border-2 bg-muted active:cursor-grabbing",
              index === activeIndex ? "border-foreground" : "border-transparent",
            )}
          >
            <Image src={photo.thumbnailUrl} alt="" fill sizes="80px" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between p-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                aria-label="Replace"
                onClick={(e) => {
                  e.stopPropagation();
                  setPickerMode({ replaceId: photo.id });
                }}
                className="flex size-5 items-center justify-center rounded-full bg-background/90"
              >
                <Repeat className="size-3" />
              </button>
              <button
                type="button"
                aria-label="Remove"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(photo.id);
                }}
                className="flex size-5 items-center justify-center rounded-full bg-background/90"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setPickerMode("add")}
          className="flex aspect-square w-20 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          aria-label="Add photo"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <PhotoPickerDialog
        open={pickerMode !== null}
        onOpenChange={(open) => !open && setPickerMode(null)}
        photos={remainingPool}
        onPick={handlePick}
      />
    </div>
  );
}
