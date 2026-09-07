export type CategoryKey =
  | "fruits"
  | "vegetables"
  | "flowers"
  | "colors"
  | "animals"
  | "birds"
  | "countries"
  | "sports"
  | "movies"
  | "books"
  | "jobs"
  | "school_subjects"
  | "emotions"
  | "clothing"
  | "household";

export interface CategoryDef {
  key: CategoryKey;
  label: string;
  emoji: string;
}

export const CATEGORIES: CategoryDef[] = [
  { key: "fruits", label: "Fruits", emoji: "🍎" },
  { key: "vegetables", label: "Vegetables", emoji: "🥕" },
  { key: "flowers", label: "Flowers", emoji: "🌸" },
  { key: "colors", label: "Colors", emoji: "🎨" },
  { key: "animals", label: "Animals", emoji: "🦁" },
  { key: "birds", label: "Birds", emoji: "🐦" },
  { key: "countries", label: "Countries", emoji: "🌍" },
  { key: "sports", label: "Sports", emoji: "⚽" },
  { key: "movies", label: "Movies", emoji: "🎬" },
  { key: "books", label: "Books", emoji: "📚" },
  { key: "jobs", label: "Jobs / Professions", emoji: "💼" },
  { key: "school_subjects", label: "School Subjects", emoji: "📐" },
  { key: "emotions", label: "Emotions / Feelings", emoji: "💛" },
  { key: "clothing", label: "Clothing Items", emoji: "👕" },
  { key: "household", label: "Household Objects", emoji: "🪑" },
];

export function categoryByKey(key: string): CategoryDef {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];
}

export const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const WORDBANK: Record<CategoryKey, string[]> = {
  fruits: [
    "Amla", "Apple", "Apricot", "Avocado", "Banana", "Ber", "Blackberry", "Blueberry",
    "Cantaloupe", "Cherry", "Chikoo", "Coconut", "Cranberry", "Custardapple", "Date",
    "Dragonfruit", "Elderberry", "Fig", "Grape", "Grapefruit", "Guava", "Honeydew",
    "Jackfruit", "Jamun", "Kiwi", "Kumquat", "Lemon", "Lime", "Lychee", "Mango", "Melon",
    "Mulberry", "Nectarine", "Orange", "Papaya", "Passionfruit", "Peach", "Pear",
    "Persimmon", "Pineapple", "Plum", "Pomegranate", "Quince", "Raspberry", "Sapota",
    "Starfruit", "Strawberry", "Tamarind", "Tangerine", "Watermelon",
  ],
  vegetables: [
    "Artichoke", "Asparagus", "Beet", "Bittergourd", "Bottlegourd", "Broccoli", "Cabbage",
    "Carrot", "Cauliflower", "Celery", "Colocasia", "Corn", "Cucumber", "Drumstick",
    "Eggplant", "Fennel", "Fenugreek", "Garlic", "Ginger", "Kale", "Leek", "Lettuce",
    "Mushroom", "Okra", "Onion", "Parsnip", "Pea", "Pepper", "Potato", "Pumpkin", "Radish",
    "Ridgegourd", "Spinach", "Squash", "Tomato", "Turnip", "Yam", "Zucchini",
  ],
  flowers: [
    "Aster", "Azalea", "Begonia", "Carnation", "Champa", "Chrysanthemum", "Daffodil",
    "Dahlia", "Daisy", "Freesia", "Gardenia", "Geranium", "Hibiscus", "Hyacinth", "Iris",
    "Jasmine", "Lavender", "Lilac", "Lily", "Lotus", "Magnolia", "Marigold", "Mogra",
    "Orchid", "Pansy", "Parijat", "Peony", "Petunia", "Poppy", "Rose", "Snapdragon",
    "Sunflower", "Tulip", "Violet", "Wisteria", "Zinnia",
  ],
  colors: [
    "Amber", "Aqua", "Beige", "Black", "Blue", "Bronze", "Brown", "Burgundy", "Coral", "Crimson",
    "Cyan", "Emerald", "Gold", "Gray", "Green", "Indigo", "Ivory", "Jade", "Lavender", "Lilac",
    "Magenta", "Maroon", "Mint", "Navy", "Olive", "Orange", "Pink", "Purple", "Red", "Rose",
    "Ruby", "Saffron", "Salmon", "Sapphire", "Scarlet", "Silver", "Tan", "Teal", "Turquoise",
    "Vermilion", "Violet", "White", "Yellow",
  ],
  animals: [
    "Alligator", "Antelope", "Bear", "Beaver", "Blackbuck", "Buffalo", "Camel", "Cheetah",
    "Cow", "Coyote", "Deer", "Dolphin", "Donkey", "Elephant", "Ferret", "Fox", "Gaur",
    "Giraffe", "Goat", "Gorilla", "Hedgehog", "Hippopotamus", "Horse", "Iguana", "Jaguar",
    "Kangaroo", "Koala", "Langur", "Leopard", "Lion", "Llama", "Lynx", "Meerkat", "Mole",
    "Mongoose", "Monkey", "Moose", "Mouse", "Nilgai", "Ocelot", "Otter", "Panda", "Panther",
    "Pig", "Rabbit", "Raccoon", "Rhinoceros", "Seal", "Sheep", "Skunk", "Sloth", "Squirrel",
    "Tiger", "Turtle", "Walrus", "Weasel", "Wolf", "Wombat", "Yak", "Zebra",
  ],
  birds: [
    "Albatross", "Blackbird", "Bluebird", "Bulbul", "Canary", "Cardinal", "Chicken", "Condor",
    "Crane", "Crow", "Cuckoo", "Dove", "Duck", "Eagle", "Egret", "Falcon", "Finch", "Flamingo",
    "Goose", "Hawk", "Heron", "Hoopoe", "Hummingbird", "Ibis", "Jay", "Kestrel", "Kingfisher",
    "Kiwi", "Koel", "Lark", "Macaw", "Magpie", "Myna", "Nightingale", "Ostrich", "Owl",
    "Parakeet", "Parrot", "Peacock", "Pelican", "Penguin", "Pigeon", "Puffin", "Quail",
    "Raven", "Robin", "Rooster", "Seagull", "Sparrow", "Stork", "Swallow", "Swan", "Toucan",
    "Turkey", "Vulture", "Woodpecker", "Wren",
  ],
  countries: [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso",
    "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia",
    "Cuba", "Cyprus", "Czech Republic", "Czechia", "Denmark", "Djibouti", "Dominica",
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea",
    "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia",
    "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
    "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
    "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica",
    "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
    "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
    "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
    "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
    "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
    "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
    "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
    "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
    "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan",
    "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
    "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
    "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
  ],
  sports: [
    "Archery", "Athletics", "Badminton", "Baseball", "Basketball", "Biathlon", "Billiards",
    "Bobsled", "Bowling", "Boxing", "Canoeing", "Climbing", "Cricket", "Curling", "Cycling",
    "Darts", "Diving", "Fencing", "Football", "Gillidanda", "Golf", "Gymnastics", "Handball",
    "Hockey", "Judo", "Kabaddi", "Karate", "Khokho", "Lacrosse", "Netball", "Polo", "Rowing",
    "Rugby", "Sailing", "Skateboarding", "Skiing", "Snowboarding", "Soccer", "Softball",
    "Squash", "Surfing", "Swimming", "Taekwondo", "Tennis", "Triathlon", "Volleyball",
    "Wrestling", "Yoga",
  ],
  movies: [
    "Aandhi", "Agneepath", "Aladdin", "Alien", "Amadeus", "Anand", "Andaz", "Avatar", "Awaara",
    "Baazigar", "Baahubali", "Babe", "Barfi", "Batman", "Bombay", "Braveheart",
    "Casablanca", "Chandni", "Cinderella", "Coco", "Coolie", "Dabangg", "Dangal", "Devdas",
    "Dhoom", "Dilwale", "Dostana", "Drishyam", "Dune", "Elf", "Encanto", "Fanaa", "Fargo",
    "Frozen", "Gadar", "Ghajini", "Ghost", "Gladiator", "Grease", "Guide", "Hairspray",
    "Hercules", "Herapheri", "Highway", "Housefull", "Inception", "Ishq", "Ittefaq", "Jaws",
    "Joker", "Josh", "Juno", "Karz", "Kranti", "Lagaan", "Lakshya", "Masaan", "Matrix", "Moana",
    "Mom", "Nayak", "Neerja", "Omkara", "Padmaavat", "Pathaan", "Piku", "PK", "Queen", "Raazi",
    "Ratatouille", "Rio", "Rockstar", "Rocky", "Roja", "Sarfarosh", "Satya", "Sholay", "Shrek",
    "Split", "Swades", "Talaash", "Tamasha", "Tangled", "Ted", "Titanic", "Udaan", "Up",
    "Vertigo", "Yaadein", "Zanjeer", "Zootopia",
  ],
  books: [
    "Beloved", "Beowulf", "Candide", "Carrie", "Dracula", "Dune", "Emma", "Frankenstein",
    "Gitanjali", "Godaan", "Hamlet", "Holes", "Ivanhoe", "Jaws", "Kim", "Malgudidays",
    "Matilda", "Misery", "Outliers", "Panchatantra", "Persuasion", "Ramayana", "Rebecca",
    "Room", "Sybil", "Ulysses", "Untamed", "Verity", "Watchmen", "Wonder", "Zorro",
  ],
  jobs: [
    "Accountant", "Actor", "Architect", "Artist", "Baker", "Barber", "Biologist", "Butcher",
    "Carpenter", "Cashier", "Chef", "Chemist", "Coach", "Dentist", "Designer", "Detective",
    "Doctor", "Driver", "Editor", "Electrician", "Engineer", "Farmer", "Firefighter",
    "Florist", "Gardener", "Geologist", "Hairdresser", "Illustrator", "Janitor",
    "Journalist", "Judge", "Lawyer", "Lecturer", "Librarian", "Lifeguard", "Locksmith",
    "Mechanic", "Musician", "Nurse", "Optician", "Painter", "Pharmacist", "Photographer",
    "Pilot", "Plumber", "Potter", "Priest", "Professor", "Programmer", "Psychologist",
    "Receptionist", "Sailor", "Scientist", "Sculptor", "Singer", "Surgeon", "Tailor",
    "Teacher", "Translator", "Veterinarian", "Waiter", "Welder", "Writer", "Zoologist",
  ],
  school_subjects: [
    "Algebra", "Art", "Biology", "Business", "Calculus", "Chemistry", "Civics",
    "Dance", "Drama", "Economics", "English", "Finance", "French", "Geography", "Geology",
    "Geometry", "German", "Government", "Grammar", "Gym", "Hindi", "History", "Journalism",
    "Latin", "Law", "Linguistics", "Literature", "Marketing", "Mathematics", "Music",
    "Nutrition", "Philosophy", "Photography", "Physics", "Psychology", "Reading",
    "Religion", "Sanskrit", "Science", "Sociology", "Spanish", "Statistics", "Theater",
    "Woodworking", "Writing", "Zoology",
  ],
  emotions: [
    "Afraid", "Amused", "Angry", "Annoyed", "Anxious", "Ashamed", "Bored", "Calm", "Confident",
    "Confused", "Content", "Curious", "Delighted", "Depressed", "Disappointed", "Disgusted",
    "Eager", "Ecstatic", "Embarrassed", "Envious", "Excited", "Fearful", "Frustrated",
    "Furious", "Glad", "Grateful", "Guilty", "Happy", "Hopeful", "Hurt", "Insecure",
    "Jealous", "Joyful", "Lonely", "Loved", "Miserable", "Nervous", "Nostalgic",
    "Optimistic", "Overwhelmed", "Panicked", "Peaceful", "Proud", "Relieved", "Sad",
    "Satisfied", "Scared", "Shy", "Surprised", "Tense", "Tired", "Uneasy", "Upset",
    "Vulnerable", "Worried",
  ],
  clothing: [
    "Apron", "Blazer", "Blouse", "Boots", "Cape", "Cardigan", "Churidar", "Coat", "Dhoti",
    "Dress", "Dupatta", "Gloves", "Gown", "Hat", "Hoodie", "Jacket", "Jeans", "Jersey",
    "Jumpsuit", "Jutti", "Kimono", "Kurta", "Leggings", "Lehenga", "Mittens", "Overalls",
    "Pajamas", "Pants", "Parka", "Poncho", "Robe", "Romper", "Salwar", "Sandals", "Saree",
    "Scarf", "Sherwani", "Shirt", "Shorts", "Skirt", "Slippers", "Socks", "Suit", "Sweater",
    "Swimsuit", "Tie", "Tights", "Trousers", "Tunic", "Turtleneck", "Underwear", "Uniform",
    "Vest", "Windbreaker",
  ],
  household: [
    "Armchair", "Basket", "Bed", "Blanket", "Blender", "Bookshelf", "Bowl", "Broom",
    "Bucket", "Cabinet", "Calendar", "Candle", "Carpet", "Chair", "Chulha", "Clock",
    "Closet", "Couch", "Cup", "Curtain", "Cushion", "Cutlery", "Desk", "Diya", "Dresser",
    "Fan", "Fork", "Fridge", "Hammer", "Kettle", "Ladder", "Lamp", "Matka", "Mattress",
    "Microwave", "Mirror", "Mop", "Napkin", "Oven", "Pan", "Pillow", "Plate", "Pot", "Rug",
    "Shelf", "Sofa", "Spoon", "Stool", "Table", "Tawa", "Television", "Thali",
    "Thermometer", "Tiffin", "Toaster", "Towel", "Vacuum", "Vase", "Wardrobe",
  ],
};

export type Tier = "none" | "rare" | "medium" | "common";

export interface TierInfo {
  tier: Tier;
  matchCount: number;
  required: number; // how many answer slots to show
}

function wordsFor(category: CategoryKey, letter: string): string[] {
  const upper = letter.toUpperCase();
  return WORDBANK[category].filter((w) => w[0].toUpperCase() === upper);
}

export function tierFor(category: CategoryKey, letter: string): TierInfo {
  const matches = wordsFor(category, letter);
  const matchCount = matches.length;

  if (matchCount === 0) return { tier: "none", matchCount, required: 0 };
  if (matchCount <= 2) return { tier: "rare", matchCount, required: 1 };
  if (matchCount <= 7) return { tier: "medium", matchCount, required: 3 };
  return { tier: "common", matchCount, required: 5 };
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prevRow = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const currentRow = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currentRow[j] = Math.min(
        currentRow[j - 1] + 1,
        prevRow[j] + 1,
        prevRow[j - 1] + cost,
      );
    }
    prevRow = currentRow;
  }
  return prevRow[b.length];
}

export function isValidAnswer(category: CategoryKey, letter: string, answer: string): boolean {
  const normalized = answer.trim().toLowerCase();
  if (!normalized) return false;

  // A small typo shouldn't cost a correct answer — allow exactly one
  // edit (insert/delete/substitute a letter), regardless of word length.
  // A wider budget sounds more forgiving but risks the opposite problem:
  // two edits is enough for one real word to drift into another (e.g.
  // "South America" sits only 2 edits from "South Africa"), which would
  // wrongly credit a genuinely different answer.
  const maxDistance = 1;
  return wordsFor(category, letter).some((w) => {
    const lower = w.toLowerCase();
    return lower === normalized || levenshtein(lower, normalized) <= maxDistance;
  });
}

export function getHint(category: CategoryKey, letter: string, exclude: string[]): string | null {
  const excludeSet = new Set(exclude.map((e) => e.trim().toLowerCase()));
  const options = wordsFor(category, letter).filter((w) => !excludeSet.has(w.toLowerCase()));
  if (options.length === 0) return null;
  return options[Math.floor(Math.random() * options.length)];
}

export function randomLetter(): string {
  return LETTERS[Math.floor(Math.random() * LETTERS.length)];
}

export function randomCategory(): CategoryKey {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].key;
}

export function closingRemark(totalCorrect: number, totalPossible: number): string {
  if (totalPossible === 0) return "You made it through five rounds — that's the whole game.";
  const ratio = totalCorrect / totalPossible;

  if (ratio >= 0.75) {
    return "Your mind moves quickly when you let it. That was a strong, connected session.";
  }
  if (ratio >= 0.4) {
    return "You found real connections out there, one thread at a time.";
  }
  return "Some rounds are just harder combos — you kept going anyway, and that's what counts.";
}
