"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A stand-in for real trip photography. Until the product has actual user
 * imagery to show on the marketing page, this renders a restrained grid of
 * tonal cards (varied warm/cool photographic gradients, not "AI gradient
 * soup") so the hero still reads as image-heavy. Swap for real photography
 * once available — see components/landing/hero.tsx.
 */
const TONES = [
  "from-[#d8c3a5] to-[#8f7a63]",
  "from-[#9db4c0] to-[#5f7a8a]",
  "from-[#c9ada7] to-[#8a6f6a]",
  "from-[#e8d5b7] to-[#b99b6b]",
  "from-[#7d8597] to-[#4a5568]",
  "from-[#d6c9b8] to-[#a08d76]",
  "from-[#a3b18a] to-[#5f6f4f]",
  "from-[#c4a389] to-[#7a5c46]",
  "from-[#8d9db6] to-[#525f7a]",
];

export function PhotoMosaic({
  count = 9,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const tiles = Array.from({ length: count }, (_, i) => TONES[i % TONES.length]);

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {tiles.map((tone, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.04, ease: "easeOut" }}
          className={cn(
            "aspect-[4/5] rounded-md bg-gradient-to-br shadow-sm",
            tone,
            i % 5 === 0 && "aspect-[4/3]",
          )}
        />
      ))}
    </div>
  );
}
