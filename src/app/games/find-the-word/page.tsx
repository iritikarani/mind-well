import { ComingSoonGamePage } from "@/components/games/ComingSoon";
import { GAMES } from "@/lib/games";

export default function FindTheWordPage() {
  return (
    <ComingSoonGamePage
      game={GAMES.find((g) => g.key === "FIND_THE_WORD")!}
      plannedMechanics={[
        "A word search grid mixing positive and negative emotion words",
        "The first 3 words you find each trigger a short, personal question",
        "Every answer gets a genuine, personalized remark — never a flat response",
        "Questions rotate on repeat plays, so finding a word again feels fresh",
      ]}
    />
  );
}
