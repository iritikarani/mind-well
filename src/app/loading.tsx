import { PixelHeart } from "@/components/pixel/PixelArt";

export default function RootLoading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <PixelHeart size={40} className="animate-bob" />
      <p className="text-muted">
        Just a moment <span aria-hidden>♡</span>
      </p>
    </div>
  );
}
