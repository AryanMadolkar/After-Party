"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { Photo } from "@/db/schema";

export function PhotoLightbox({
  photos,
  index,
  onIndexChange,
  onClose,
}: {
  photos: Photo[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange(Math.min(index + 1, photos.length - 1));
      if (e.key === "ArrowLeft") onIndexChange(Math.max(index - 1, 0));
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, photos.length, onIndexChange, onClose]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="size-4" />
      </button>

      {index > 0 && (
        <NavButton
          side="left"
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange(index - 1);
          }}
        />
      )}
      {index < photos.length - 1 && (
        <NavButton
          side="right"
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange(index + 1);
          }}
        />
      )}

      <div
        className="relative h-[85vh] w-[90vw] max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.blobUrl}
          alt={photo.originalFilename ?? ""}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}

function NavButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      onClick={onClick}
      className={`absolute ${side === "left" ? "left-4" : "right-4"} flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20`}
    >
      <Icon className="size-5" />
    </button>
  );
}
