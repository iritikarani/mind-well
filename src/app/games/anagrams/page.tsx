import { ComingSoonGamePage } from "@/components/games/ComingSoon";
import { GAMES } from "@/lib/games";

export default function AnagramsPage() {
  return (
    <ComingSoonGamePage
      game={GAMES.find((g) => g.key === "ANAGRAMS")!}
      plannedMechanics={[
        "Level 1: rearrange a 4-letter word into two different new 4-letter words",
        "Level 2: rearrange a 5-letter word into one new 5-letter word",
        "Level 3: form a 4-letter word and a 5-letter word, sharing letters freely",
        "A closing remark based on your speed and how creative your words were",
      ]}
    />
  );
}
