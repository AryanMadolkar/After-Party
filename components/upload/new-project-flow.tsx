"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dropzone, type SelectedFile } from "@/components/upload/dropzone";
import { UploadProgress, type UploadPhase } from "@/components/upload/upload-progress";
import { uploadPhotoBatch } from "@/lib/photos/upload";
import {
  analyzeProjectAction,
  createPhotoAction,
  createProjectAction,
} from "@/app/app/new/actions";

const PROCESSING_STAGES = [
  "Preparing photos...",
  "Finding duplicates...",
  "Analyzing photos...",
  "Building your selections...",
];

export function NewProjectFlow({ userId }: { userId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [phase, setPhase] = useState<UploadPhase | null>(null);
  const [progressByFile, setProgressByFile] = useState<Record<string, number>>({});
  const [uploadedCount, setUploadedCount] = useState(0);
  const [failedFilenames, setFailedFilenames] = useState<string[]>([]);
  const [stageIndex, setStageIndex] = useState(0);
  const stageTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRunning = phase === "uploading" || phase === "processing";
  const overallPercentage =
    files.length === 0
      ? 0
      : Object.values(progressByFile).reduce((sum, p) => sum + p, 0) / files.length;

  async function handleAnalyze() {
    if (!name.trim()) {
      toast.error("Give your project a name first.");
      return;
    }
    if (files.length === 0) {
      toast.error("Add at least one photo.");
      return;
    }

    setPhase("uploading");

    try {
      const { id: projectId } = await createProjectAction({ name });

      // Persisting each photo's metadata row is fire-and-forget from the
      // upload worker's perspective, but analysis can't start until every
      // row exists — so every persist promise is collected here and
      // awaited as a batch before moving on.
      const pendingPersists: Promise<void>[] = [];
      let successCount = 0;

      await uploadPhotoBatch({
        projectId,
        userId,
        files: files.map((f) => ({ file: f.file, fileId: f.id })),
        onEvent: (event) => {
          if (event.type === "progress") {
            setProgressByFile((prev) => ({ ...prev, [event.fileId]: event.percentage }));
          }
          if (event.type === "processed") {
            setProgressByFile((prev) => ({ ...prev, [event.fileId]: 100 }));
            const persist = createPhotoAction({
              projectId,
              blobUrl: event.result.blobUrl,
              thumbnailUrl: event.result.thumbnailUrl,
              originalFilename: event.result.originalFilename,
              mimeType: event.result.mimeType,
              width: event.result.width,
              height: event.result.height,
              fileSize: event.result.fileSize,
              exifData: event.result.exifData,
            })
              .then(() => {
                successCount += 1;
                setUploadedCount((n) => n + 1);
              })
              .catch(() => {
                setFailedFilenames((prev) => [...prev, event.result.originalFilename]);
              });
            pendingPersists.push(persist);
          }
          if (event.type === "failed") {
            const source = files.find((f) => f.id === event.fileId);
            setFailedFilenames((prev) => [...prev, source?.file.name ?? "photo"]);
          }
        },
      });

      await Promise.all(pendingPersists);

      if (successCount === 0) {
        throw new Error("None of your photos could be uploaded. Please try again.");
      }

      setPhase("processing");
      stageTimer.current = setInterval(() => {
        setStageIndex((i) => Math.min(i + 1, PROCESSING_STAGES.length - 1));
      }, 900);

      await analyzeProjectAction({ projectId });

      if (stageTimer.current) clearInterval(stageTimer.current);
      setPhase("done");
      router.push(`/app/project/${projectId}`);
    } catch (error) {
      if (stageTimer.current) clearInterval(stageTimer.current);
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
      setPhase(null);
    }
  }

  if (isRunning || phase === "done") {
    return (
      <UploadProgress
        phase={phase ?? "uploading"}
        total={files.length}
        uploaded={uploadedCount}
        failed={failedFilenames.length}
        overallPercentage={phase === "processing" || phase === "done" ? 100 : overallPercentage}
        stageLabel={phase === "uploading" ? "Uploading..." : PROCESSING_STAGES[stageIndex]}
        failedFilenames={failedFilenames}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Label htmlFor="project-name">Project name</Label>
        <Input
          id="project-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tokyo, Goa, Birthday..."
          className="mt-2 max-w-sm"
        />
      </div>

      <Dropzone files={files} onFilesChange={setFiles} />

      <div className="flex justify-end">
        <Button size="lg" className="rounded-full px-6" onClick={handleAnalyze}>
          Analyze photos
        </Button>
      </div>
    </div>
  );
}
