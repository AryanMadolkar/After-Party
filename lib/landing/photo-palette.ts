/**
 * Placeholder photography for the landing page's photo-driven sections.
 * Real images come from LoremFlickr — a keyword-searchable placeholder
 * photo service backed by real Flickr photos — so a tile labeled "food"
 * actually shows food, a tile next to "Eiffel Tower" actually shows Paris,
 * and so on, instead of arbitrary random images.
 *
 * Two important constraints, verified directly against the service before
 * relying on them:
 *   - Combining multiple comma-separated keywords with the `lock` param
 *     (used for determinism) reliably 500s — every keyword below is a
 *     single word.
 *   - Not every plausible keyword has results; keywords here were checked
 *     one at a time and swapped for a working synonym where needed (e.g.
 *     "candid" and "selfie" 500 — "people" and "smile" don't).
 *
 * The duotone `tone` gradient is kept as the loading/fallback background.
 * Swap for real photography later by changing `photoUrl` to build URLs
 * from real assets — PhotoTile's `src` prop and every call site stay the
 * same.
 */
export type PhotoKind =
  | "landscape"
  | "portrait"
  | "city"
  | "food"
  | "night"
  | "candid"
  | "friends"
  | "detail";

export type PhotoLook = {
  id: string;
  tone: string; // CSS gradient — loading/fallback background
  kind: PhotoKind;
  /** Single-word LoremFlickr search term — keep it verified-working (see above). */
  keyword: string;
};

export type PickedLook = PhotoLook & { photoSeed: string; lock: number };

export const PHOTO_LOOKS: PhotoLook[] = [
  { id: "sunset-1", tone: "linear-gradient(160deg,#e8b06b,#c96a3f 55%,#7a3d2e)", kind: "landscape", keyword: "sunset" },
  { id: "sunset-2", tone: "linear-gradient(160deg,#eab873,#cf6f42 55%,#823f2b)", kind: "landscape", keyword: "sunset" },
  { id: "sunset-3", tone: "linear-gradient(155deg,#e2a862,#bd6339 55%,#6f3626)", kind: "landscape", keyword: "sunset" },
  { id: "ocean", tone: "linear-gradient(160deg,#9fd3d8,#4a8fa0 60%,#1f4b58)", kind: "landscape", keyword: "ocean" },
  { id: "mountain", tone: "linear-gradient(160deg,#b9c6d6,#6d7f96 55%,#374357)", kind: "landscape", keyword: "mountain" },
  { id: "greenery", tone: "linear-gradient(150deg,#a9c684,#6c8f4f 60%,#3d5429)", kind: "landscape", keyword: "forest" },
  { id: "city-day", tone: "linear-gradient(160deg,#c7ccd6,#8891a3 55%,#4c5568)", kind: "city", keyword: "city" },
  { id: "city-dusk", tone: "linear-gradient(160deg,#d9a5b0,#8a5b7a 55%,#3f2f52)", kind: "city", keyword: "city" },
  { id: "street", tone: "linear-gradient(155deg,#bcb3a8,#7d7267 55%,#453d35)", kind: "city", keyword: "street" },
  { id: "night-flash", tone: "linear-gradient(200deg,#f4ecd8,#c9a877 45%,#5c4a33)", kind: "night", keyword: "night" },
  { id: "night-neon", tone: "linear-gradient(165deg,#d98fc0,#7a4a8f 55%,#301f47)", kind: "night", keyword: "neon" },
  { id: "night-bar", tone: "linear-gradient(160deg,#caa5c9,#6d4870 55%,#2c1c31)", kind: "night", keyword: "night" },
  { id: "portrait-1", tone: "linear-gradient(150deg,#e9c9ab,#b98a68 55%,#6b4c37)", kind: "portrait", keyword: "portrait" },
  { id: "portrait-2", tone: "linear-gradient(150deg,#eccdb2,#c19173 55%,#71503a)", kind: "portrait", keyword: "portrait" },
  { id: "friends-1", tone: "linear-gradient(150deg,#e3b6a4,#af6f62 55%,#623a34)", kind: "friends", keyword: "friends" },
  { id: "friends-2", tone: "linear-gradient(150deg,#d9c2a8,#a68a68 55%,#5c4a35)", kind: "friends", keyword: "friends" },
  { id: "food-1", tone: "linear-gradient(155deg,#e8b477,#c17a3d 55%,#7a4620)", kind: "food", keyword: "food" },
  { id: "food-2", tone: "linear-gradient(155deg,#d99a6d,#a85f34 55%,#623414)", kind: "food", keyword: "food" },
  { id: "cafe", tone: "linear-gradient(155deg,#cbb392,#95795a 55%,#4f3d29)", kind: "detail", keyword: "coffee" },
  { id: "detail-1", tone: "linear-gradient(150deg,#c9beb3,#8f8175 55%,#4c4137)", kind: "detail", keyword: "architecture" },
  { id: "beach", tone: "linear-gradient(155deg,#e7dcc0,#c7b487 55%,#8a7a52)", kind: "landscape", keyword: "beach" },
  { id: "film-fade", tone: "linear-gradient(155deg,#d7c9b8,#a08f78 55%,#5c4f3d)", kind: "candid", keyword: "vintage" },
  { id: "candid-1", tone: "linear-gradient(150deg,#dcb9a0,#a97c63 55%,#5f4132)", kind: "candid", keyword: "people" },
  { id: "candid-2", tone: "linear-gradient(150deg,#cfc2b0,#95836c 55%,#544636)", kind: "candid", keyword: "people" },
];

/** Deterministic placeholder photo URL — same keyword+lock always returns the same image. */
export function photoUrl(keyword: string, lock: number, width = 600, height = 750): string {
  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(keyword)}?lock=${lock}`;
}

/** Stable string -> positive int hash, used to turn a seed into a `lock` value. */
export function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return (Math.abs(hash) % 9973) + 1;
}

/**
 * Picks `count` looks starting at `seed`, each tagged with a globally
 * unique `photoSeed` and a derived `lock` so different sections don't all
 * show the same handful of placeholder photos even when they share a
 * keyword.
 */
export function pickLooks(count: number, seed = 0): PickedLook[] {
  const out: PickedLook[] = [];
  for (let i = 0; i < count; i++) {
    const look = PHOTO_LOOKS[(i + seed) % PHOTO_LOOKS.length];
    const photoSeed = `${look.id}-s${seed}-${i}`;
    out.push({ ...look, photoSeed, lock: hashSeed(photoSeed) });
  }
  return out;
}
