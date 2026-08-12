"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { validateFiles } from "@/lib/photos/upload";
import { MAX_PHOTOS_PER_PROJECT } from "@/lib/storage/blob";

export type SelectedFile = {
  id: string;
  file: File;
  previewUrl: string;
};

export function Dropzone({
  files,
  onFilesChange,
  disabled,
}: {
  files: SelectedFile[];
  onFilesChange: (files: SelectedFile[]) => void;
  disabled?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      const { valid, errors } = validateFiles(list);

      const remainingCapacity = MAX_PHOTOS_PER_PROJECT - files.length;
      const accepted = valid.slice(0, Math.max(remainingCapacity, 0));

      const next: SelectedFile[] = accepted.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      if (errors.length > 0 || valid.length > accepted.length) {
        const skipped = errors.length + (valid.length - accepted.length);
        toast.warning(`${skipped} ${skipped === 1 ? "file was" : "files were"} skipped`, {
          description: "Only JPG, PNG, HEIC, and WEBP files under 50MB are supported.",
        });
      }

      onFilesChange([...files, ...next]);
    },
    [files, onFilesChange],
  );

  function removeFile(id: string) {
    const target = files.find((f) => f.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    onFilesChange(files.filter((f) => f.id !== id));
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (disabled) return;
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center transition-colors",
          isDragging ? "border-foreground/50 bg-accent/50" : "border-border hover:bg-accent/30",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <ImagePlus className="size-7 text-muted-foreground/60" strokeWidth={1.25} />
        <div>
          <p className="text-sm font-medium">Drag and drop photos, or click to browse</p>
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG, HEIC, or WEBP · up to {MAX_PHOTOS_PER_PROJECT} photos
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">
            {files.length} / {MAX_PHOTOS_PER_PROJECT} photos selected
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {files.map((f) => (
              <div
                key={f.id}
                className="group relative aspect-square overflow-hidden rounded-md border border-border/60 bg-muted"
              >
                <Image
                  src={f.previewUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="120px"
                  className="object-cover"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(f.id);
                    }}
                    className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-background/90 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove photo"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
