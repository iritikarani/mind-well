/**
 * A short, explicit validating line shown at the end of each game in the
 * "Validation?" category (Animal Runner, World Puzzle, Color Connection) —
 * distinct from each game's own result copy, since the category's whole
 * point ("Play • Reflect • Validate") is to end on an unconditional
 * statement that the player's feelings are valid, not just a message about
 * how the game itself went.
 */
export const VALIDATION_MESSAGES = [
  "Whatever you felt while playing — it's valid.",
  "Your feelings don't need a reason to count.",
  "However today has felt, that feeling is allowed to be here.",
  "You don't have to earn the way you feel. It's already valid.",
  "Nothing you felt just now needs fixing — it's simply valid.",
  "You're allowed to feel exactly how you feel right now.",
];

export function randomValidationMessage(): string {
  return VALIDATION_MESSAGES[Math.floor(Math.random() * VALIDATION_MESSAGES.length)];
}
