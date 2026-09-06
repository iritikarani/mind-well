export type Sentiment = "positive" | "negative";

export interface YesNoVariant {
  type: "yesno";
  prompt: string;
  yes: string;
  no: string;
}

export interface OpenVariant {
  type: "open";
  prompt: string;
  answered: string;
  skipped: string;
}

export type QuestionVariant = YesNoVariant | OpenVariant;

export interface WordDef {
  word: string;
  sentiment: Sentiment;
  questions: QuestionVariant[];
}

export const WORDS: WordDef[] = [
  {
    word: "SAD",
    sentiment: "negative",
    questions: [
      { type: "yesno", prompt: "Are you sad right now?", yes: "It's okay to be sad sometimes. You're still an amazing person.", no: "That's great — you shouldn't be sad." },
      { type: "yesno", prompt: "Has today felt heavy?", yes: "Heavy days happen. This one doesn't define you.", no: "Glad today didn't feel heavy." },
      { type: "yesno", prompt: "Do you feel sad more often than not lately?", yes: "That sounds tiring to carry. You deserve support, not just endurance.", no: "Good — steadier days are worth noticing." },
    ],
  },
  {
    word: "DEPRESSED",
    sentiment: "negative",
    questions: [
      { type: "open", prompt: "What's one thing that could make you feel depressed right now?", answered: "Thank you for naming that. Noticing it is the first step to loosening its grip.", skipped: "That's okay too — you don't have to name it to move forward." },
      { type: "open", prompt: "When depression shows up, what does it usually feel like?", answered: "That's a real and honest description. You don't have to carry it alone.", skipped: "No pressure to describe it today." },
      { type: "open", prompt: "What helps even a little when you feel depressed?", answered: "Hold onto that — it's worth remembering on harder days.", skipped: "That's fine — you can figure that out in your own time." },
    ],
  },
  {
    word: "HAPPY",
    sentiment: "positive",
    questions: [
      { type: "open", prompt: "What made you happy today?", answered: "Hold onto that feeling — you deserve moments like this.", skipped: "Even a quiet day can carry small happiness. Look for it." },
      { type: "open", prompt: "What's something that reliably makes you happy?", answered: "That's a good thing to know about yourself.", skipped: "That's okay — some days it's hard to think of one." },
      { type: "open", prompt: "When did you last feel truly happy?", answered: "Thank you for remembering that moment with us.", skipped: "No worries — it'll come to you eventually." },
    ],
  },
  {
    word: "ANXIOUS",
    sentiment: "negative",
    questions: [
      { type: "yesno", prompt: "Is something making you anxious right now?", yes: "That feeling is temporary. You've gotten through hard moments before.", no: "Good — hold onto that calm for as long as you can." },
      { type: "yesno", prompt: "Does your mind feel like it's racing today?", yes: "Racing thoughts slow down eventually. You don't have to chase them.", no: "Glad your mind feels steady right now." },
      { type: "yesno", prompt: "Do you feel anxious about tomorrow?", yes: "Tomorrow hasn't happened yet — you're allowed to stay in today.", no: "That's a good place to be." },
    ],
  },
  {
    word: "PROUD",
    sentiment: "positive",
    questions: [
      { type: "open", prompt: "What's something you're proud of today?", answered: "That's worth celebrating. Don't shrink it.", skipped: "Even small wins count — you might just need a moment to notice one." },
      { type: "open", prompt: "What's something you're proud of that no one else knows about?", answered: "That matters even if no one else sees it.", skipped: "That's okay — some pride is quiet and just for you." },
      { type: "open", prompt: "When did you last feel proud of yourself?", answered: "Hold onto that memory — you earned it.", skipped: "That's alright, it'll come to mind when you least expect it." },
    ],
  },
  {
    word: "ANGRY",
    sentiment: "negative",
    questions: [
      { type: "yesno", prompt: "Are you feeling angry about something right now?", yes: "Anger often means something mattered to you. That's worth listening to.", no: "Good — glad things feel calmer." },
      { type: "yesno", prompt: "Has something been building up your frustration lately?", yes: "That build-up deserves an outlet, not just patience.", no: "Glad nothing's been piling up." },
      { type: "yesno", prompt: "Do you feel angry more than you'd like to?", yes: "That's worth paying attention to, gently.", no: "That's a good sign." },
    ],
  },
  {
    word: "LONELY",
    sentiment: "negative",
    questions: [
      { type: "open", prompt: "What's one thing that makes loneliness feel lighter for you?", answered: "That's a good thing to remember for the next quiet moment.", skipped: "That's okay — you don't need an answer right now." },
      { type: "open", prompt: "Who's one person you could reach out to today?", answered: "That's a good first step, even if you don't take it yet.", skipped: "No pressure — the thought alone counts for something." },
      { type: "open", prompt: "When do you feel loneliest?", answered: "Thank you for being honest about that.", skipped: "That's fine to keep to yourself." },
    ],
  },
  {
    word: "AFRAID",
    sentiment: "negative",
    questions: [
      { type: "yesno", prompt: "Is there something you're afraid of right now?", yes: "Fear doesn't mean you're weak — it means you're paying attention.", no: "Good — glad nothing feels frightening right now." },
      { type: "yesno", prompt: "Does fear ever stop you from doing what you want?", yes: "That's worth noticing gently, not fighting all at once.", no: "That's a strong place to stand from." },
      { type: "yesno", prompt: "Are you afraid of how today might go?", yes: "You can only take today one piece at a time.", no: "That's a good, steady feeling." },
    ],
  },
  {
    word: "GUILTY",
    sentiment: "negative",
    questions: [
      { type: "open", prompt: "Is there something you feel guilty about right now?", answered: "Thank you for being honest. Guilt fades faster once it's named.", skipped: "That's okay — you don't owe anyone an explanation." },
      { type: "open", prompt: "What usually makes guilt stick around longest for you?", answered: "That's useful to know about yourself.", skipped: "No worries — that's a hard one to answer." },
      { type: "open", prompt: "Do you forgive yourself as easily as you forgive others?", answered: "That's worth sitting with — you deserve that same grace.", skipped: "That's okay — some questions take time." },
    ],
  },
  {
    word: "ASHAMED",
    sentiment: "negative",
    questions: [
      { type: "open", prompt: "Is there something you feel ashamed of right now?", answered: "Shame loses power once it's spoken, even quietly like this.", skipped: "You don't have to name it to release it." },
      { type: "open", prompt: "What would you tell a friend who felt ashamed like this?", answered: "Try offering yourself those same words.", skipped: "That's a good question to sit with later." },
      { type: "open", prompt: "Does shame usually come from something you did, or something you fear others think?", answered: "That distinction matters — thank you for exploring it.", skipped: "No pressure to untangle that today." },
    ],
  },
  {
    word: "JEALOUS",
    sentiment: "negative",
    questions: [
      { type: "yesno", prompt: "Are you feeling jealous of someone right now?", yes: "Jealousy often points to something you want for yourself, not against them.", no: "Good — that's a peaceful place to be." },
      { type: "yesno", prompt: "Does comparing yourself to others happen a lot lately?", yes: "Try noticing it without judging yourself for it.", no: "That's a healthy place to stand." },
      { type: "yesno", prompt: "Do you feel jealous of people close to you?", yes: "That's a hard feeling to admit — thank you for it.", no: "Glad that's not weighing on you." },
    ],
  },
  {
    word: "STRESSED",
    sentiment: "negative",
    questions: [
      { type: "open", prompt: "What's stressing you out the most right now?", answered: "Naming it is already a small weight lifted.", skipped: "That's fine — sometimes it's too much to name." },
      { type: "open", prompt: "What usually helps you when you're stressed?", answered: "Hold onto that — it's a good tool to have.", skipped: "No worries — you'll figure it out when you need to." },
      { type: "open", prompt: "How does stress usually show up in your body?", answered: "That's valuable to notice for next time.", skipped: "That's okay to skip for now." },
    ],
  },
  {
    word: "WORRIED",
    sentiment: "negative",
    questions: [
      { type: "yesno", prompt: "Are you worried about something right now?", yes: "Worry means you care. Try not to let it take over, though.", no: "Good — glad your mind feels at ease." },
      { type: "yesno", prompt: "Do you tend to worry about things before they happen?", yes: "That's common, but you don't have to live there.", no: "That's a great habit to have." },
      { type: "yesno", prompt: "Is there a worry you keep coming back to?", yes: "That's worth talking through with someone, when you're ready.", no: "Glad nothing keeps circling back." },
    ],
  },
  {
    word: "HOPELESS",
    sentiment: "negative",
    questions: [
      { type: "open", prompt: "What's making things feel hopeless right now?", answered: "Thank you for saying that out loud. It doesn't have to stay that way.", skipped: "That's okay — you don't need the words right now." },
      { type: "open", prompt: "What's one small thing that's ever helped, even a little?", answered: "Hold onto that — it's proof things can shift.", skipped: "No pressure — it can wait." },
      { type: "open", prompt: "Have you felt this way before and had it pass?", answered: "That's worth remembering on days like this.", skipped: "That's fine to leave unanswered." },
    ],
  },
  {
    word: "BITTER",
    sentiment: "negative",
    questions: [
      { type: "open", prompt: "Is there something you feel bitter about?", answered: "That's real. Bitterness usually means something hurt more than it should have.", skipped: "That's okay to keep to yourself." },
      { type: "open", prompt: "What would it take to feel less bitter about it?", answered: "That's a good place to start, even slowly.", skipped: "No rush on that one." },
      { type: "open", prompt: "Does this feeling come up often?", answered: "Thank you for tracking that about yourself.", skipped: "That's fine — no need to track it today." },
    ],
  },
  {
    word: "NUMB",
    sentiment: "negative",
    questions: [
      { type: "open", prompt: "Do you feel numb about something right now?", answered: "Numbness is often the mind protecting you. It's okay to feel that.", skipped: "That's alright — some things resist words." },
      { type: "open", prompt: "When did you start feeling this way?", answered: "Thank you for thinking back on that.", skipped: "No pressure to pinpoint it." },
      { type: "open", prompt: "What's one small thing you can still feel today?", answered: "Hold onto that — it's a thread back to feeling more.", skipped: "That's okay — it may come back on its own." },
    ],
  },
  {
    word: "EXHAUSTED",
    sentiment: "negative",
    questions: [
      { type: "yesno", prompt: "Do you feel exhausted right now?", yes: "Rest isn't a reward you have to earn — it's something you need.", no: "Good — glad you have some energy today." },
      { type: "yesno", prompt: "Has it been a long stretch without a real break?", yes: "You deserve a real pause, not just a shorter to-do list.", no: "Glad you've had room to breathe." },
      { type: "yesno", prompt: "Is it more physical or mental exhaustion?", yes: "Either way, it's real and it counts.", no: "That's a good place to be." },
    ],
  },
  {
    word: "INSECURE",
    sentiment: "negative",
    questions: [
      { type: "open", prompt: "What's making you feel insecure right now?", answered: "Thank you for naming that — insecurity gets quieter once it's out loud.", skipped: "That's fine — it can stay unspoken for now." },
      { type: "open", prompt: "What's something you're actually confident about?", answered: "Hold onto that — let it outweigh the doubt a little.", skipped: "That's okay, it can be hard to think of one in the moment." },
      { type: "open", prompt: "Do you compare yourself to others when this feeling shows up?", answered: "That's a very human thing to notice about yourself.", skipped: "No pressure to answer that today." },
    ],
  },
  {
    word: "GRATEFUL",
    sentiment: "positive",
    questions: [
      { type: "open", prompt: "What's one thing you're grateful for today?", answered: "That's a lovely thing to hold onto.", skipped: "That's okay — gratitude doesn't need to be forced." },
      { type: "open", prompt: "Who's someone you're grateful to have in your life?", answered: "They're lucky to have someone who notices that.", skipped: "No pressure — they can wait to be thought of." },
      { type: "open", prompt: "What's something small you'd usually overlook being grateful for?", answered: "Noticing the small things is its own kind of skill.", skipped: "That's fine — not every day needs that lens." },
    ],
  },
  {
    word: "EXCITED",
    sentiment: "positive",
    questions: [
      { type: "open", prompt: "What's something you're excited about right now?", answered: "That excitement is worth holding onto.", skipped: "That's okay — excitement doesn't have to be constant." },
      { type: "open", prompt: "What's something coming up that you're looking forward to?", answered: "That's a good thing to have on the horizon.", skipped: "No worries — today can just be today." },
      { type: "open", prompt: "When did you last feel really excited about something?", answered: "Thank you for remembering that with us.", skipped: "That's fine — it'll come back around." },
    ],
  },
  {
    word: "CALM",
    sentiment: "positive",
    questions: [
      { type: "yesno", prompt: "Do you feel calm right now?", yes: "Hold onto that. Calm moments are worth noticing.", no: "That's okay — calm can be worked toward, not just found." },
      { type: "yesno", prompt: "Has today felt more settled than most?", yes: "That's worth appreciating while it lasts.", no: "Even unsettled days pass." },
      { type: "yesno", prompt: "Is it easy for you to feel calm lately?", yes: "That's a great sign.", no: "That's okay — it can take practice." },
    ],
  },
  {
    word: "HOPEFUL",
    sentiment: "positive",
    questions: [
      { type: "open", prompt: "What's giving you hope right now?", answered: "That's worth holding onto, even loosely.", skipped: "That's fine — hope doesn't have to be pinned down today." },
      { type: "open", prompt: "What's something you're hopeful will improve?", answered: "That hope matters, even before anything changes.", skipped: "No pressure to name it right now." },
      { type: "open", prompt: "Do you feel more hopeful than you did a while ago?", answered: "That's real progress, however it happened.", skipped: "That's okay to sit with quietly." },
    ],
  },
  {
    word: "CONFIDENT",
    sentiment: "positive",
    questions: [
      { type: "yesno", prompt: "Do you feel confident today?", yes: "Hold onto that feeling — you earned it.", no: "That's okay — confidence comes and goes, it's not permanent either way." },
      { type: "yesno", prompt: "Is there something specific making you feel sure of yourself?", yes: "That's worth remembering the next time doubt shows up.", no: "That's fine — it doesn't have to be tied to one thing." },
      { type: "yesno", prompt: "Would people who know you say you seem confident?", yes: "That says something good about how you carry yourself.", no: "That's okay — how you feel inside matters more anyway." },
    ],
  },
  {
    word: "LOVED",
    sentiment: "positive",
    questions: [
      { type: "yesno", prompt: "Do you feel loved right now?", yes: "Hold onto that. You deserve to feel that way.", no: "You are loved, even on days it's hard to feel it." },
      { type: "yesno", prompt: "Is there someone who reminded you of that recently?", yes: "That's a good thing to carry with you today.", no: "That's okay — it doesn't make it less true." },
      { type: "yesno", prompt: "Do you feel like you show yourself the same love you give others?", yes: "That's a wonderful thing to practice.", no: "That's worth being gentler with yourself about." },
    ],
  },
  {
    word: "PEACEFUL",
    sentiment: "positive",
    questions: [
      { type: "yesno", prompt: "Do you feel peaceful right now?", yes: "Hold onto that stillness for as long as it lasts.", no: "That's okay — peace can be built moment by moment." },
      { type: "yesno", prompt: "Has anything helped you feel more at peace lately?", yes: "That's worth returning to again.", no: "That's fine — it can take some looking." },
      { type: "yesno", prompt: "Is your mind quiet right now?", yes: "That's a good place to rest in.", no: "That's okay — a quiet mind isn't the only kind of peace." },
    ],
  },
  {
    word: "JOYFUL",
    sentiment: "positive",
    questions: [
      { type: "open", prompt: "What's brought you joy recently?", answered: "That's worth savoring a little longer.", skipped: "That's okay — joy doesn't need to be explained." },
      { type: "open", prompt: "What's a small thing that reliably brings you joy?", answered: "That's a good one to keep close.", skipped: "No pressure — it'll come to mind eventually." },
      { type: "open", prompt: "When did you last laugh, really laugh?", answered: "That's a great thing to remember.", skipped: "That's fine — it'll happen again soon." },
    ],
  },
  {
    word: "CONTENT",
    sentiment: "positive",
    questions: [
      { type: "yesno", prompt: "Do you feel content with how things are right now?", yes: "That's a quiet kind of happiness — enjoy it.", no: "That's okay — contentment isn't something you owe anyone." },
      { type: "yesno", prompt: "Is there anything missing from feeling truly content?", yes: "That's worth naming for yourself, gently.", no: "That's a great place to be." },
      { type: "yesno", prompt: "Does contentment feel different from happiness to you?", yes: "That's a thoughtful distinction to notice.", no: "That's fine either way." },
    ],
  },
  {
    word: "INSPIRED",
    sentiment: "positive",
    questions: [
      { type: "open", prompt: "What's inspiring you lately?", answered: "That's worth following a little further.", skipped: "That's okay — inspiration comes and goes on its own schedule." },
      { type: "open", prompt: "Who's someone who inspires you?", answered: "That's a good person to think of today.", skipped: "No pressure to name someone right now." },
      { type: "open", prompt: "What's something you'd love to create or try?", answered: "That's worth keeping in mind.", skipped: "That's fine — it can wait until it's ready." },
    ],
  },
  {
    word: "RELAXED",
    sentiment: "positive",
    questions: [
      { type: "yesno", prompt: "Do you feel relaxed right now?", yes: "Enjoy that feeling for as long as it stays.", no: "That's okay — relaxation is worth making room for later." },
      { type: "yesno", prompt: "Has today given you any real downtime?", yes: "That's worth protecting more often.", no: "Even a few minutes today could help." },
      { type: "yesno", prompt: "Is your body feeling relaxed, or just your mind?", yes: "Either one counts.", no: "That's fine — they don't always match up." },
    ],
  },
  {
    word: "CHEERFUL",
    sentiment: "positive",
    questions: [
      { type: "open", prompt: "What's putting you in a cheerful mood?", answered: "That's a nice thing to hold onto today.", skipped: "That's okay — cheerfulness doesn't need a reason." },
      { type: "open", prompt: "What usually cheers you up on a dull day?", answered: "That's good to keep in your back pocket.", skipped: "No pressure — you'll find it when you need it." },
      { type: "open", prompt: "Do you feel more cheerful in the morning or at night?", answered: "That's a fun thing to know about yourself.", skipped: "That's fine either way." },
    ],
  },
  {
    word: "BRAVE",
    sentiment: "positive",
    questions: [
      { type: "open", prompt: "What's something brave you've done recently, even something small?", answered: "That counts more than you probably give it credit for.", skipped: "That's okay — bravery doesn't always announce itself." },
      { type: "open", prompt: "What's something that takes courage for you right now?", answered: "Thank you for naming it — that's brave on its own.", skipped: "No pressure — it can stay unspoken for now." },
      { type: "open", prompt: "Do you feel brave today?", answered: "Hold onto that.", skipped: "That's fine — bravery isn't a constant feeling." },
    ],
  },
  {
    word: "MOTIVATED",
    sentiment: "positive",
    questions: [
      { type: "yesno", prompt: "Do you feel motivated right now?", yes: "Ride that feeling as far as it'll take you today.", no: "That's okay — motivation isn't required to make progress." },
      { type: "yesno", prompt: "Is there something specific driving that motivation?", yes: "That's good to hold onto for harder days.", no: "That's fine — it doesn't need a reason." },
      { type: "yesno", prompt: "Do you feel more motivated than you did yesterday?", yes: "That's worth noticing and being proud of.", no: "That's okay too — some days are just quieter." },
    ],
  },
];

export function wordByName(word: string): WordDef | undefined {
  return WORDS.find((w) => w.word === word);
}

/** Picks `count` grid words, balanced as evenly as possible between sentiments. */
export function pickGridWords(count: number): WordDef[] {
  const positives = shuffle(WORDS.filter((w) => w.sentiment === "positive"));
  const negatives = shuffle(WORDS.filter((w) => w.sentiment === "negative"));
  const half = Math.ceil(count / 2);
  const picked = [...positives.slice(0, half), ...negatives.slice(0, count - half)];
  return shuffle(picked);
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Picks a variant index for `word`, avoiding `lastIndex` when more than one variant exists. */
export function pickVariantIndex(word: string, lastIndex: number | null): number {
  const def = wordByName(word);
  const count = def?.questions.length ?? 1;
  if (count <= 1) return 0;

  let next = Math.floor(Math.random() * count);
  while (next === lastIndex) {
    next = Math.floor(Math.random() * count);
  }
  return next;
}
