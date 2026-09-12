export type HeroThumb = {
  src: string;
  alt: string;
  channel?: "Feed" | "Stories" | "LinkedIn";
  approved?: boolean;
  aspect?: "square" | "story";
};

/** Packed UGC select-grid — all cells are real photographs. */
export const HERO_THUMBS: HeroThumb[] = [
  { src: "/marketing/hero-grid/01.webp", alt: "Creator portrait select", channel: "Feed", approved: true },
  { src: "/marketing/hero-grid/02.webp", alt: "Apparel on-body select", channel: "Feed" },
  { src: "/marketing/hero-grid/03.webp", alt: "Fashion lifestyle frame", channel: "Stories", aspect: "story" },
  { src: "/marketing/hero-grid/04.webp", alt: "Beauty close-up", channel: "Feed", approved: true },
  { src: "/marketing/hero-grid/05.webp", alt: "Makeup flatlay", channel: "LinkedIn" },
  { src: "/marketing/hero-grid/06.webp", alt: "Food plating UGC", channel: "Feed" },
  { src: "/marketing/hero-grid/07.webp", alt: "Restaurant product shot", channel: "Stories", aspect: "story" },
  { src: "/marketing/hero-grid/08.webp", alt: "Fresh produce detail", channel: "Feed", approved: true },
  { src: "/marketing/hero-grid/09.webp", alt: "Product in hand", channel: "Feed" },
  { src: "/marketing/hero-grid/10.webp", alt: "Sunglasses product", channel: "LinkedIn" },
  { src: "/marketing/hero-grid/11.webp", alt: "Skincare routine still", channel: "Stories", aspect: "story" },
  { src: "/marketing/hero-grid/12.webp", alt: "Retail lifestyle", channel: "Feed" },
  { src: "/marketing/hero-grid/13.webp", alt: "Shopping bag moment", channel: "Feed" },
  { src: "/marketing/hero-grid/14.webp", alt: "Runway-adjacent fashion", channel: "Stories", aspect: "story" },
  { src: "/marketing/hero-grid/15.webp", alt: "Portrait beauty light", channel: "Feed", approved: true },
];

export const EMPTY_STATE_THUMBS = HERO_THUMBS.slice(0, 6);
