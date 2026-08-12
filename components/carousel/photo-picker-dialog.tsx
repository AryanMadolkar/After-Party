"use client";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type PickablePhoto = {
  id: string;
  thumbnailUrl: string;
};

export function PhotoPickerDialog({
  open,
  onOpenChange,
  photos,
  onPick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photos: PickablePhoto[];
  onPick: (photoId: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a photo</DialogTitle>
        </DialogHeader>

        {photos.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No other photos available in this project.
          </p>
        ) : (
          <div className="grid max-h-[60vh] grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-5">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => onPick(photo.id)}
                className="relative aspect-square overflow-hidden rounded-md border border-transparent transition-colors hover:border-foreground/40"
              >
                <Image src={photo.thumbnailUrl} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
