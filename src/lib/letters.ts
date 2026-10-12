import { dayIndexOf } from "@/lib/date";

export interface Letter {
  body: string;
  /** One tiny, doable thing — never homework. */
  tryThis: string;
}

/** For days that feel heavy, tired, or unclear. Soft, never pushy, never
 * "look on the bright side". */
export const GENTLE_LETTERS: Letter[] = [
  {
    body: "Today might feel heavy, and you still showed up to open this. That counts for more than you think. You don't have to be okay to be welcome here.",
    tryThis: "Put one hand on your chest and take three slow breaths.",
  },
  {
    body: "Some days the kindest thing is to lower the bar until it's easy to step over. Water, a snack, a window — that's a full day's work for a tender heart.",
    tryThis: "Drink a glass of water, slowly.",
  },
  {
    body: "Feelings are weather, not verdicts. This one is real, and it will also move on — it just can't be rushed.",
    tryThis: "Name the feeling quietly: \"I notice I'm feeling…\"",
  },
  {
    body: "You've gotten through every hard day so far — that's a perfect record. Be as gentle with yourself as you'd be with a friend in your shoes.",
    tryThis: "Think of what you'd say to a friend feeling this way, and say it to yourself.",
  },
  {
    body: "Rest isn't something you earn by finishing everything. It's allowed right now, exactly as things are.",
    tryThis: "Close your eyes for one full minute. Nothing to do.",
  },
  {
    body: "If your mind feels like a crowded room, you don't have to clear it — just open one window. A slow breath is a window.",
    tryThis: "Breathe in for 4, out for 6. Three rounds.",
  },
  {
    body: "Not knowing how you feel is a feeling, too. You can sit in the fog without solving it.",
    tryThis: "Look around and find five things you can see.",
  },
  {
    body: "Small steps are still steps. If the only thing you did today was be kind to yourself for a moment, the day isn't wasted.",
    tryThis: "Do one tiny, easy thing — make the bed, wash a cup — and let it be enough.",
  },
  {
    body: "Your energy isn't a character flaw; it's a battery. It's okay to recharge for as long as it takes.",
    tryThis: "Step away from screens for five minutes.",
  },
  {
    body: "You're allowed to take up space here, exactly as you are today. No performance, no cheerfulness required.",
    tryThis: "Unclench your jaw and let your shoulders drop.",
  },
  {
    body: "Hard days can't take away the good ones you've already had. They're still yours.",
    tryThis: "Remember one small good moment from this week and stay with it for a breath.",
  },
  {
    body: "Sometimes the bravest sentence is \"I'm not okay today.\" Said to someone you trust, it gets lighter. If you're not ready yet, saying it here is a start.",
    tryThis: "Picture one person who would listen. You don't have to message them — just picture them.",
  },
  {
    body: "The world will keep turning while you pause. You're allowed to step off for a minute.",
    tryThis: "Stretch your arms overhead, then let them fall.",
  },
  {
    body: "Be patient with the slow parts. Roots grow in the dark long before anything shows above the soil.",
    tryThis: "Put both feet flat on the floor and notice the ground holding you.",
  },
  {
    body: "Tonight the goal is small: get through it softly. Tomorrow gets to be a fresh page.",
    tryThis: "Set out something comforting for later — a blanket, a warm drink.",
  },
];

/** For ordinary, calm, or good days. Warm and light. */
export const BRIGHT_LETTERS: Letter[] = [
  {
    body: "Good things are easy to rush past. Let this one be noticed — you earned this feeling just by being here.",
    tryThis: "Smile at something small, on purpose.",
  },
  {
    body: "A calm day is a gift to your future self: you're storing steadiness right now.",
    tryThis: "Take one slow breath and enjoy how nice that is.",
  },
  {
    body: "You don't need a reason to be happy, and you don't need a reason to rest. Both are fine.",
    tryThis: "Put on a song you love and listen to the whole thing.",
  },
  {
    body: "Curiosity is a kind of gentleness. What small thing would you like to find out today?",
    tryThis: "Learn one new word or fact, just for fun.",
  },
  {
    body: "Notice what's going right, even if it's quiet — a warm drink, a soft light, a message from someone who cares.",
    tryThis: "Name three tiny good things from today.",
  },
  {
    body: "Kindness travels. A little of yours might land exactly where it's needed today.",
    tryThis: "Send a short, kind message to someone you haven't spoken to in a while.",
  },
  {
    body: "Your ordinary days are the ones building you. This one counts.",
    tryThis: "Stretch, then take a tiny walk — even just around the room.",
  },
  {
    body: "Joy likes to be shared and savoured. Let yourself linger in the nice parts.",
    tryThis: "Tell someone about one good thing that happened this week.",
  },
  {
    body: "There's no scoreboard here. Just a room, a window, and you.",
    tryThis: "Look out of a real window for a full minute.",
  },
  {
    body: "Gratitude isn't about forcing positivity — it's noticing what's already soft in your life.",
    tryThis: "Write down one thing you're glad exists.",
  },
  {
    body: "You've been carrying a lot, and still you showed up. A little pride is allowed.",
    tryThis: "Tell yourself \"well done\", out loud or in your head.",
  },
  {
    body: "Slow mornings, quiet evenings, small wins — that's a good life, built in minutes.",
    tryThis: "Do one thing slowly today, on purpose.",
  },
  {
    body: "Today you get to choose one thing just because it's lovely.",
    tryThis: "Pick something small that delights you and give it your full attention.",
  },
  {
    body: "Check in with your body: what is it asking for? Water, movement, rest, sunshine?",
    tryThis: "Give your body exactly one thing it's asking for.",
  },
  {
    body: "Keep a little of today's light for a harder day — you can come back to it whenever you need.",
    tryThis: "Take a mental snapshot of this moment: the sounds, the colours, how you feel.",
  },
];

const HEAVY_MOODS = new Set(["Low", "Upset", "Tired", "Unsure"]);

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Today's letter: tender if the person said they're having a hard day,
 * light otherwise. Steps through the list one per calendar day (offset per
 * person), so consecutive days never repeat a letter. */
export function pickLetter(dateKey: string, mood: string | null, seed: string): Letter {
  const pool = mood && HEAVY_MOODS.has(mood) ? GENTLE_LETTERS : BRIGHT_LETTERS;
  const index = (dayIndexOf(dateKey) + hashSeed(seed)) % pool.length;
  return pool[index];
}
