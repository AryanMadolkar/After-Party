/**
 * Placeholder "photo" looks for the landing page's photo-driven sections.
 * There's no real photography wired in yet — these are duotone gradients
 * tuned to read as camera-roll variety (warm sunset, flash-lit night,
 * daylight portrait, food, city, film-faded) rather than a single flat
 * brand gradient repeated everywhere.
 *
 * Swap for real photography by giving PhotoTile a `src` prop later — the
 * component/layout code doesn't need to change, only this data source.
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
  tone: string; // CSS gradient
  kind: PhotoKind;
};

export const PHOTO_LOOKS: PhotoLook[] = [
  { id: "sunset-1", tone: "linear-gradient(160deg,#e8b06b,#c96a3f 55%,#7a3d2e)", kind: "landscape" },
  { id: "sunset-2", tone: "linear-gradient(160deg,#eab873,#cf6f42 55%,#823f2b)", kind: "landscape" },
  { id: "sunset-3", tone: "linear-gradient(155deg,#e2a862,#bd6339 55%,#6f3626)", kind: "landscape" },
  { id: "ocean", tone: "linear-gradient(160deg,#9fd3d8,#4a8fa0 60%,#1f4b58)", kind: "landscape" },
  { id: "mountain", tone: "linear-gradient(160deg,#b9c6d6,#6d7f96 55%,#374357)", kind: "landscape" },
  { id: "greenery", tone: "linear-gradient(150deg,#a9c684,#6c8f4f 60%,#3d5429)", kind: "landscape" },
  { id: "city-day", tone: "linear-gradient(160deg,#c7ccd6,#8891a3 55%,#4c5568)", kind: "city" },
  { id: "city-dusk", tone: "linear-gradient(160deg,#d9a5b0,#8a5b7a 55%,#3f2f52)", kind: "city" },
  { id: "street", tone: "linear-gradient(155deg,#bcb3a8,#7d7267 55%,#453d35)", kind: "city" },
  { id: "night-flash", tone: "linear-gradient(200deg,#f4ecd8,#c9a877 45%,#5c4a33)", kind: "night" },
  { id: "night-neon", tone: "linear-gradient(165deg,#d98fc0,#7a4a8f 55%,#301f47)", kind: "night" },
  { id: "night-bar", tone: "linear-gradient(160deg,#caa5c9,#6d4870 55%,#2c1c31)", kind: "night" },
  { id: "portrait-1", tone: "linear-gradient(150deg,#e9c9ab,#b98a68 55%,#6b4c37)", kind: "portrait" },
  { id: "portrait-2", tone: "linear-gradient(150deg,#eccdb2,#c19173 55%,#71503a)", kind: "portrait" },
  { id: "friends-1", tone: "linear-gradient(150deg,#e3b6a4,#af6f62 55%,#623a34)", kind: "friends" },
  { id: "friends-2", tone: "linear-gradient(150deg,#d9c2a8,#a68a68 55%,#5c4a35)", kind: "friends" },
  { id: "food-1", tone: "linear-gradient(155deg,#e8b477,#c17a3d 55%,#7a4620)", kind: "food" },
  { id: "food-2", tone: "linear-gradient(155deg,#d99a6d,#a85f34 55%,#623414)", kind: "food" },
  { id: "cafe", tone: "linear-gradient(155deg,#cbb392,#95795a 55%,#4f3d29)", kind: "detail" },
  { id: "detail-1", tone: "linear-gradient(150deg,#c9beb3,#8f8175 55%,#4c4137)", kind: "detail" },
  { id: "beach", tone: "linear-gradient(155deg,#e7dcc0,#c7b487 55%,#8a7a52)", kind: "landscape" },
  { id: "film-fade", tone: "linear-gradient(155deg,#d7c9b8,#a08f78 55%,#5c4f3d)", kind: "candid" },
  { id: "candid-1", tone: "linear-gradient(150deg,#dcb9a0,#a97c63 55%,#5f4132)", kind: "candid" },
  { id: "candid-2", tone: "linear-gradient(150deg,#cfc2b0,#95836c 55%,#544636)", kind: "candid" },
];

export function pickLooks(count: number, seed = 0): PhotoLook[] {
  const out: PhotoLook[] = [];
  for (let i = 0; i < count; i++) {
    out.push(PHOTO_LOOKS[(i + seed) % PHOTO_LOOKS.length]);
  }
  return out;
}
