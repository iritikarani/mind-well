import { PixelCloud, PixelStar, PixelFlower, PixelCat } from "@/components/pixel/PixelArt";

/**
 * The hero backdrop: handcrafted pixel sprites (not photos, not blurred
 * gradient blobs) gently drifting and twinkling. Every animation class is
 * disabled under prefers-reduced-motion via globals.css.
 */
export function HeroScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[6%] top-[12%] animate-drift">
        <PixelCloud size={64} color="#FFFFFF" />
      </div>
      <div className="absolute right-[10%] top-[20%] animate-float-slower">
        <PixelCloud size={44} color="#F3EEFC" />
      </div>
      <div className="absolute left-[20%] top-[55%] animate-float-slow">
        <PixelCloud size={36} color="#FFFFFF" />
      </div>

      <div className="absolute left-[14%] top-[30%] animate-twinkle">
        <PixelStar size={18} color="#FFD988" />
      </div>
      <div className="absolute right-[20%] top-[12%] animate-twinkle" style={{ animationDelay: "0.6s" }}>
        <PixelStar size={14} color="#C9AEF2" />
      </div>
      <div className="absolute right-[30%] bottom-[28%] animate-twinkle" style={{ animationDelay: "1.2s" }}>
        <PixelStar size={16} color="#FFABD4" />
      </div>

      <div className="absolute left-[10%] bottom-[16%] animate-bob">
        <PixelFlower size={22} />
      </div>
      <div className="absolute right-[12%] bottom-[20%] animate-bob" style={{ animationDelay: "0.8s" }}>
        <PixelFlower size={18} petal="#CDECFB" center="#FFD988" />
      </div>

      <div className="absolute bottom-[8%] left-1/2 -translate-x-[140%] animate-bob">
        <PixelCat size={32} />
      </div>
    </div>
  );
}
