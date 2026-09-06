import { ComingSoonGamePage } from "@/components/games/ComingSoon";
import { GAMES } from "@/lib/games";

export default function ColorTheoryPage() {
  return (
    <ComingSoonGamePage
      game={GAMES.find((g) => g.key === "COLOR_THEORY")!}
      plannedMechanics={[
        "Pick your favorite color from a basic palette",
        "Answer 7 short, reflective questions tied to that color",
        "A fixed starter set on your very first playthrough, then a fresh set every time after",
        "A personalized closing affirmation tied to your chosen color",
      ]}
    />
  );
}
