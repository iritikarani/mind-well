import { ComingSoonGamePage } from "@/components/games/ComingSoon";
import { GAMES } from "@/lib/games";

export default function SpinAndConnectPage() {
  return (
    <ComingSoonGamePage
      game={GAMES.find((g) => g.key === "SPIN_AND_CONNECT")!}
      plannedMechanics={[
        "Spin a letter wheel and a category wheel across 24 categories",
        "Rare combos ask for 1 answer with hints available anytime — no penalty",
        "Common combos ask for up to 5 answers",
        "Re-spin one wheel if a combo has no valid answer at all",
        "At least 5 rounds per session, with a closing remark based on your overall performance",
      ]}
    />
  );
}
