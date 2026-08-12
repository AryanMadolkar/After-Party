/**
 * Perceptual hashing (difference hash / dHash). This is plain client-side
 * signal processing, not AI — it's the cheap pre-filter that runs on every
 * photo before anything gets sent to a vision model, per the pipeline:
 *
 *   thumbnails -> perceptual hashing -> duplicate detection -> vision
 *   analysis -> embeddings -> clustering -> ranking -> selection
 *
 * The hash is a 64-bit fingerprint (as a hex string) that's stable across
 * minor re-encodes/re-crops but differs a lot between genuinely different
 * photos, so near-duplicate bursts can be grouped by Hamming distance
 * before any expensive analysis runs.
 */

const HASH_SIZE = 8; // 8x8 -> 64-bit hash

export async function computePerceptualHash(file: File): Promise<string | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = HASH_SIZE + 1;
    canvas.height = HASH_SIZE;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      bitmap.close();
      return null;
    }

    ctx.drawImage(bitmap, 0, 0, HASH_SIZE + 1, HASH_SIZE);
    bitmap.close();

    const { data } = ctx.getImageData(0, 0, HASH_SIZE + 1, HASH_SIZE);
    const gray: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      gray.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }

    let bits = "";
    for (let row = 0; row < HASH_SIZE; row++) {
      for (let col = 0; col < HASH_SIZE; col++) {
        const left = gray[row * (HASH_SIZE + 1) + col];
        const right = gray[row * (HASH_SIZE + 1) + col + 1];
        bits += left > right ? "1" : "0";
      }
    }

    return bitsToHex(bits);
  } catch {
    return null;
  }
}

export function hammingDistance(hashA: string, hashB: string): number {
  const zero = BigInt(0);
  const one = BigInt(1);
  const a = BigInt(`0x${hashA}`);
  const b = BigInt(`0x${hashB}`);
  let xor = a ^ b;
  let distance = 0;
  while (xor > zero) {
    distance += Number(xor & one);
    xor >>= one;
  }
  return distance;
}

/**
 * Groups photo ids whose hashes are within `threshold` bits of each other.
 * Small threshold (default 6 of 64 bits) catches re-exports/burst shots
 * while leaving genuinely different photos alone.
 */
export function groupDuplicates(
  hashes: Array<{ id: string; hash: string }>,
  threshold = 6,
): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  const assigned = new Map<string, string>();

  for (let i = 0; i < hashes.length; i++) {
    const current = hashes[i];
    if (assigned.has(current.id)) continue;

    const groupId = current.id;
    const members = [current.id];
    assigned.set(current.id, groupId);

    for (let j = i + 1; j < hashes.length; j++) {
      const candidate = hashes[j];
      if (assigned.has(candidate.id)) continue;
      if (hammingDistance(current.hash, candidate.hash) <= threshold) {
        members.push(candidate.id);
        assigned.set(candidate.id, groupId);
      }
    }

    if (members.length > 1) {
      groups.set(groupId, members);
    }
  }

  return groups;
}

function bitsToHex(bits: string): string {
  let hex = "";
  for (let i = 0; i < bits.length; i += 4) {
    hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  }
  return hex;
}
