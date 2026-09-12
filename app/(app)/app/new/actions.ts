"use server";

/** Stubs — consumer new-project flow removed in Solo-P2. */
export async function createProjectAction(_input: unknown) {
  throw new Error("Consumer projects disabled in CutRoom. Use Shoots (coming soon).");
}

export async function createPhotoRecordsAction(_input: unknown) {
  throw new Error("Consumer projects disabled in CutRoom.");
}

export async function analyzeProjectAction(_input: unknown) {
  throw new Error("Consumer projects disabled in CutRoom.");
}
