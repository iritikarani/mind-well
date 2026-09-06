import { ComingSoonGamePage } from "@/components/games/ComingSoon";
import { GAMES } from "@/lib/games";

export default function WorldPuzzlePage() {
  return (
    <ComingSoonGamePage
      game={GAMES.find((g) => g.key === "WORLD_PUZZLE")!}
      plannedMechanics={[
        "Untimed jigsaw with no move-count or fail state — purely therapeutic",
        "See the reference monument first, then fit large, easy-to-handle pieces at your own pace",
        "Flip the finished puzzle to reveal an uplifting quote plus the monument's name and location",
        "314 real, globally recognized landmarks to cycle through over time",
      ]}
    />
  );
}
