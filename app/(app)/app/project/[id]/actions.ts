"use server";

/** Stubs — consumer project actions removed in Solo-P2. */
export async function recommendSongsAction(_input: { projectId: string }) {
  return [] as Array<{ name: string; artist: string; reason?: string }>;
}

export async function generateCaptionsAction(_input: unknown) {
  return [] as string[];
}

export async function applyAiEditAction(_input: unknown) {
  throw new Error("Consumer editor disabled in CutRoom.");
}

export async function deletePhotoAction(_input: unknown) {
  throw new Error("Consumer photo actions disabled in CutRoom.");
}

export async function updateSelectionAction(_input: unknown) {
  throw new Error("Consumer selection actions disabled in CutRoom.");
}

export async function createPostAction(_input: unknown) {
  throw new Error("Consumer post actions disabled in CutRoom.");
}

export async function saveCarouselAction(_input: unknown) {
  throw new Error("Consumer carousel actions disabled in CutRoom.");
}

export async function addToSelectionAction(_input: unknown) {
  throw new Error("Consumer selection actions disabled in CutRoom.");
}

export async function buildSelectionAction(_input: unknown) {
  throw new Error("Consumer selection actions disabled in CutRoom.");
}

export async function removeFromSelectionAction(_input: unknown) {
  throw new Error("Consumer selection actions disabled in CutRoom.");
}

export async function reorderSelectionAction(_input: unknown) {
  throw new Error("Consumer selection actions disabled in CutRoom.");
}
