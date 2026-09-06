import type { MonumentDef } from "@/lib/worldPuzzleContent";

export const ART_SIZE = 300;

export function MonumentArt({ def, size = ART_SIZE }: { def: MonumentDef; size?: number }) {
  return (
    <div style={{ width: size, height: size, overflow: "hidden" }}>
      {/* Fixed pixel box + object-fit: cover keeps every photo perfectly
          square, which the jigsaw's piece-slicing math depends on. This
          component is re-mounted many times per puzzle (one per piece), so
          a plain <img> is used intentionally instead of next/image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={def.image}
        alt={def.name}
        width={size}
        height={size}
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}
