"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";

import { PhotoTile } from "@/components/landing/photo-tile";
import { pickLooks } from "@/lib/landing/photo-palette";

const ROLES = ["Hero", "Candid", "Detail", "Candid", "Detail", "Candid", "Detail", "Closing shot"];

const INITIAL = pickLooks(8, 2).map((look, i) => ({ ...look, role: ROLES[i] }));

export function CarouselBuilderSection() {
  const [items, setItems] = useState(INITIAL);

  return (
    <section style={{ padding: "72px 0", borderBottom: "2px solid var(--ap-ink)" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(28px,3.8vw,46px)",
            letterSpacing: "-0.01em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          Your Tokyo carousel
        </h2>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ap-ink-50)", textTransform: "uppercase" }}>
          {items.length} photos · drag to reorder
        </span>
      </div>

      <Reorder.Group
        as="div"
        axis="x"
        values={items}
        onReorder={setItems}
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          padding: "24px 0 8px",
          listStyle: "none",
          margin: 0,
        }}
      >
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            as="div"
            whileDrag={{ scale: 1.04, zIndex: 5, boxShadow: "0 16px 32px rgba(0,0,0,0.2)" }}
            style={{ flexShrink: 0, cursor: "grab" }}
          >
            <PhotoTile tone={item.tone} aspect="4/5" style={{ width: "min(30vw, 190px)" }}>
              <span
                style={{
                  position: "absolute",
                  left: 8,
                  bottom: 8,
                  background: "var(--ap-paper)",
                  border: "1.5px solid var(--ap-ink)",
                  padding: "3px 8px",
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                {item.role}
              </span>
            </PhotoTile>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <p style={{ fontSize: 13, color: "var(--ap-ink-50)", marginTop: 4 }}>
        picked like a creative director would — not scored like a spreadsheet.
      </p>
    </section>
  );
}
