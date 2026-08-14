"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

type PhotoTileProps = Omit<HTMLMotionProps<"div">, "children"> & {
  tone: string;
  aspect?: string;
  blurred?: boolean;
  flash?: boolean;
  rotate?: number;
  badge?: React.ReactNode;
  children?: React.ReactNode;
};

/**
 * A single placeholder "photo" — a duotone gradient standing in for real
 * photography (see lib/landing/photo-palette.ts). Deliberately imperfect
 * by default (slight rotation, optional blur/flash) so a grid of these
 * reads as a real camera roll, not a tidy design-system swatch set.
 */
export function PhotoTile({
  tone,
  aspect = "4/5",
  blurred = false,
  flash = false,
  rotate = 0,
  badge,
  className,
  style,
  children,
  ...props
}: PhotoTileProps) {
  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      style={{
        aspectRatio: aspect,
        background: tone,
        border: "2px solid var(--ap-ink)",
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        filter: blurred ? "blur(2.5px)" : undefined,
        ...style,
      }}
      {...props}
    >
      {flash && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0) 60%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      )}
      {badge && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            background: "var(--ap-paper)",
            border: "1.5px solid var(--ap-ink)",
            padding: "1px 6px",
            fontSize: 10,
            fontWeight: 800,
            lineHeight: 1.4,
          }}
        >
          {badge}
        </div>
      )}
      {children}
    </motion.div>
  );
}
