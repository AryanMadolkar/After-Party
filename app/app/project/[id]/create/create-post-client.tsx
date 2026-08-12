"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SelectionTypePicker } from "@/components/carousel/selection-type-picker";
import { CarouselEditor, type EditorPhoto } from "@/components/carousel/carousel-editor";
import { CaptionPicker } from "@/components/carousel/caption-picker";
import { SongPicker } from "@/components/carousel/song-picker";
import { buildSelectionAction, createPostAction } from "@/app/app/project/[id]/actions";
import type { CaptionStyle, SelectionType } from "@/db/schema";
import type { SongRecommendation } from "@/lib/ai/types";

export function CreatePostClient({
  projectId,
  poolPhotos,
  initialType,
}: {
  projectId: string;
  poolPhotos: EditorPhoto[];
  initialType?: SelectionType;
}) {
  const router = useRouter();
  const autoStarted = useRef(false);

  const [pendingType, setPendingType] = useState<SelectionType | null>(null);
  const [selection, setSelection] = useState<{
    id: string;
    type: SelectionType;
    photos: EditorPhoto[];
  } | null>(null);
  const [caption, setCaption] = useState<{ style: CaptionStyle; text: string }>({
    style: "minimal",
    text: "",
  });
  const [song, setSong] = useState<SongRecommendation | null>(null);
  const [publishing, setPublishing] = useState(false);

  async function handleSelect(type: SelectionType) {
    setPendingType(type);
    try {
      const result = await buildSelectionAction({ projectId, type });
      const photos = result.photoIds
        .map((id) => poolPhotos.find((p) => p.id === id))
        .filter((p): p is EditorPhoto => Boolean(p));
      setSelection({ id: result.selectionId, type, photos });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't build that selection.");
    } finally {
      setPendingType(null);
    }
  }

  useEffect(() => {
    if (initialType && !autoStarted.current) {
      autoStarted.current = true;
      handleSelect(initialType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialType]);

  async function handlePublish() {
    if (!selection) return;
    setPublishing(true);
    try {
      await createPostAction({
        projectId,
        type: selection.type,
        caption: caption.style === "none" ? null : caption.text || null,
        songName: song?.name ?? null,
        songArtist: song?.artist ?? null,
      });
      toast.success("Post created");
      router.push(`/app/project/${projectId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't create the post.");
    } finally {
      setPublishing(false);
    }
  }

  if (!selection) {
    return <SelectionTypePicker onSelect={handleSelect} pending={pendingType} />;
  }

  return (
    <div className="space-y-12">
      <CarouselEditor
        projectId={projectId}
        type={selection.type}
        selectionId={selection.id}
        initialPhotos={selection.photos}
        poolPhotos={poolPhotos}
        onSelectionChange={(id, photos) => setSelection({ id, type: selection.type, photos })}
      />

      <CaptionPicker projectId={projectId} value={caption} onChange={setCaption} />

      <SongPicker projectId={projectId} value={song} onChange={setSong} />

      <div className="flex justify-end gap-3 border-t border-border/60 pt-6">
        <Button variant="ghost" onClick={() => setSelection(null)} disabled={publishing}>
          Start over
        </Button>
        <Button onClick={handlePublish} disabled={publishing} className="rounded-full px-6">
          {publishing && <Loader2 className="size-4 animate-spin" />}
          Create post
        </Button>
      </div>
    </div>
  );
}
