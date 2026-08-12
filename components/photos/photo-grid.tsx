"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Heart, Loader2, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { PhotoLightbox } from "@/components/photos/photo-lightbox";
import { deletePhotoAction } from "@/app/app/project/[id]/actions";
import type { Photo } from "@/db/schema";

export function PhotoGrid({ projectId, photos }: { projectId: string; photos: Photo[] }) {
  const [items, setItems] = useState(photos);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggleFavorite(photoId: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  }

  function handleDelete(photo: Photo) {
    setPendingDeleteId(photo.id);
    startTransition(async () => {
      try {
        await deletePhotoAction({ projectId, photoId: photo.id });
        setItems((prev) => prev.filter((p) => p.id !== photo.id));
        toast.success("Photo deleted");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Couldn't delete photo.");
      } finally {
        setPendingDeleteId(null);
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-24 text-center">
        <p className="text-muted-foreground">No photos yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {items.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-md bg-muted"
            onClick={() => setLightboxIndex(index)}
          >
            <Image
              src={photo.thumbnailUrl ?? photo.blobUrl}
              alt={photo.originalFilename ?? ""}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <IconButton
                label="Favorite"
                active={favorites.has(photo.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(photo.id);
                }}
              >
                <Heart
                  className={cn("size-3.5", favorites.has(photo.id) && "fill-current")}
                />
              </IconButton>
              <IconButton
                label="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(photo);
                }}
              >
                {pendingDeleteId === photo.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={items}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

function IconButton({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur-sm transition-colors hover:bg-background",
        active && "text-red-500",
      )}
    >
      {children}
    </button>
  );
}
