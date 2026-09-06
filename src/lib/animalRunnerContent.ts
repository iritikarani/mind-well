export const POSITIVE_REMARKS = [
  "You're doing better than you think.",
  "Look how far you've come.",
  "You deserve rest, not guilt.",
  "Your feelings are valid.",
  "You are enough, exactly as you are.",
  "Someone is grateful you exist.",
  "You handled that hard day well.",
  "Small steps still count as progress.",
  "You're allowed to be proud of yourself.",
  "Your kindness matters more than you know.",
  "You're growing, even when it doesn't feel like it.",
  "It's okay to rest today.",
  "You showed up — that's enough.",
  "You are worthy of good things.",
  "You've survived every hard day so far.",
  "Your effort counts, even unseen.",
  "You bring something good into rooms.",
  "It's okay to ask for help.",
  "You're learning, not failing.",
  "Your pace is the right pace.",
];

export const NEGATIVE_REMARKS = [
  "You should have done more today.",
  "Everyone is judging you right now.",
  "You always mess things up.",
  "You're falling behind everyone else.",
  "Nobody really needs you.",
  "You're too much and not enough at the same time.",
  "You should be further along by now.",
  "You're just making excuses.",
  "You'll probably fail at this too.",
  "You're a burden to the people around you.",
  "You don't deserve to rest yet.",
  "Everyone else has it figured out but you.",
  "You're wasting your potential.",
  "You should have known better.",
  "You're not trying hard enough.",
  "People are only being nice to be polite.",
  "You'll never be good enough.",
  "You should feel bad about that.",
  "You're too sensitive about everything.",
  "You're letting everyone down.",
  "You always do this.",
  "Your best still isn't good enough.",
  "You have nothing worth saying.",
  "You're behind where you should be in life.",
  "You bring people down.",
  "You should be ashamed of that.",
  "Nobody would notice if you disappeared.",
  "You're just pretending to be okay.",
  "You ruin good things eventually.",
  "You're too broken to fix now.",
];

export const LOSE_QUOTE = "You should have thought about yourself.";

export function winRemark(positiveAbsorbed: number, negativeAbsorbed: number): string {
  const total = positiveAbsorbed + negativeAbsorbed;
  if (total === 0) {
    return "You let almost everything pass you by — that's a quiet kind of strength.";
  }

  const ratio = positiveAbsorbed / total;

  if (ratio >= 0.65) {
    return "You held onto the good and let the rest run past you. That's exactly how it should be.";
  }
  if (ratio >= 0.35) {
    return "You took the bad with the good today — but you're still here, still standing.";
  }
  return "You absorbed more than you should have. Be gentler with yourself next time — you deserve that gentleness now, too.";
}
