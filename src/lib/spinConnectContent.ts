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
    "Amla", "Apple", "Apricot", "Avocado", "Bael", "Banana", "Ber", "Bergamot",
    "Blackberry", "Blackcurrant", "Blueberry", "Boysenberry", "Cantaloupe", "Cherry",
    "Chikoo", "Coconut", "Cranberry", "Custardapple", "Date", "Dragonfruit", "Durian",
    "Elderberry", "Falsa", "Fig", "Gooseberry", "Grape", "Grapefruit", "Guava",
    "Honeydew", "Jackfruit", "Jamun", "Jujube", "Karonda", "Khirni", "Kiwi", "Kumquat",
    "Lemon", "Lime", "Longan", "Loquat", "Lychee", "Mango", "Mangosteen", "Medlar",
    "Melon", "Mulberry", "Muskmelon", "Nectarine", "Olive", "Orange", "Papaya",
    "Passionfruit", "Peach", "Pear", "Persimmon", "Pineapple", "Plum", "Pomegranate",
    "Quince", "Rambutan", "Ramphal", "Raspberry", "Redcurrant", "Sapota", "Sitaphal",
    "Sloe", "Starfruit", "Strawberry", "Tamarillo", "Tamarind", "Tangerine", "Ugli",
    "Watermelon", "Woodapple", "Yuzu", "Zapote",
  ],
  vegetables: [
    "Amaranth", "Arrowroot", "Artichoke", "Asparagus", "Beet", "Beetroot", "Bhindi",
    "Bittergourd", "Bottlegourd", "Broadbeans", "Broccoli", "Cabbage", "Capsicum",
    "Carrot", "Cauliflower", "Celery", "Chayote", "Colocasia", "Corn", "Cucumber",
    "Drumstick", "Eggplant", "Fennel", "Fenugreek", "Frenchbeans", "Garlic", "Ginger",
    "Guar", "Horseradish", "Ivygourd", "Kale", "Kohlrabi", "Leek", "Lettuce",
    "Lotusstem", "Mushroom", "Mustardgreens", "Okra", "Onion", "Parsnip", "Parwal",
    "Pea", "Pepper", "Plantain", "Potato", "Pumpkin", "Radish", "Ridgegourd",
    "Snakegourd", "Spinach", "Squash", "Sweetpotato", "Taro", "Tinda", "Tomato",
    "Turnip", "Watercress", "Yam", "Zucchini",
  ],
  flowers: [
    "Alamanda", "Aster", "Azalea", "Balsam", "Begonia", "Bougainvillea", "Carnation",
    "Champa", "Champak", "Chrysanthemum", "Cosmos", "Daffodil", "Dahlia", "Daisy",
    "Frangipani", "Freesia", "Gardenia", "Geranium", "Gerbera", "Gladiolus", "Gulmohar",
    "Harsingar", "Hibiscus", "Hyacinth", "Iris", "Jasmine", "Kadamba", "Kaner",
    "Lantana", "Lavender", "Lilac", "Lily", "Lotus", "Magnolia", "Marigold", "Mimosa",
    "Mogra", "Nagkesar", "Nargis", "Nasturtium", "Oleander", "Orchid", "Palash", "Pansy",
    "Parijat", "Peony", "Periwinkle", "Petunia", "Plumeria", "Poppy", "Rajnigandha",
    "Ranunculus", "Rose", "Snapdragon", "Sunflower", "Tuberose", "Tulip", "Violet",
    "Wisteria", "Zinnia",
  ],
  colors: [
    "Alizarin", "Amber", "Aqua", "Basanti", "Beige", "Black", "Blue", "Bottlegreen",
    "Bronze", "Brown", "Burgundy", "Chestnut", "Chocolate", "Copper", "Coral", "Crimson",
    "Cyan", "Ecru", "Emerald", "Fuchsia", "Gold", "Gray", "Green", "Gulabi", "Henna",
    "Indigo", "Ivory", "Jade", "Khaki", "Lavender", "Lilac", "Lime", "Magenta",
    "Mahogany", "Maroon", "Mauve", "Mehendi", "Mint", "Mustard", "Navy", "Ochre",
    "Olive", "Orange", "Peach", "Pink", "Plum", "Purple", "Red", "Rose", "Ruby", "Rust",
    "Saffron", "Salmon", "Sandalwood", "Sapphire", "Scarlet", "Sepia", "Silver", "Slate",
    "Tan", "Teal", "Terracotta", "Turquoise", "Vermilion", "Violet", "White", "Wine",
    "Yellow",
  ],
  animals: [
    "Alligator", "Antelope", "Armadillo", "Barasingha", "Bat", "Bear", "Beaver", "Bison",
    "Blackbuck", "Buffalo", "Camel", "Chameleon", "Cheetah", "Chimpanzee", "Chinkara",
    "Civet", "Cobra", "Cow", "Coyote", "Crocodile", "Deer", "Dhole", "Dingo", "Dolphin",
    "Donkey", "Elephant", "Ferret", "Fishingcat", "Fox", "Gaur", "Gazelle", "Gecko",
    "Gharial", "Giraffe", "Goat", "Gorilla", "Hamster", "Hedgehog", "Hippopotamus",
    "Horse", "Hyena", "Iguana", "Jackal", "Jaguar", "Jerboa", "Kangaroo", "Koala",
    "Langur", "Lemur", "Leopard", "Lion", "Lizard", "Llama", "Lynx", "Macaque",
    "Markhor", "Meerkat", "Mole", "Mongoose", "Monkey", "Moose", "Mouse", "Mule",
    "Muntjac", "Muskdeer", "Newt", "Nilgai", "Ocelot", "Opossum", "Orangutan", "Otter",
    "Panda", "Pangolin", "Panther", "Pig", "Platypus", "Porcupine", "Puma", "Rabbit",
    "Raccoon", "Redpanda", "Rhinoceros", "Salamander", "Sambar", "Scorpion", "Seal",
    "Sheep", "Shrew", "Skunk", "Sloth", "Slothbear", "Snake", "Spider", "Squirrel",
    "Stoat", "Tapir", "Tiger", "Toad", "Turtle", "Vole", "Walrus", "Warthog", "Weasel",
    "Wildass", "Wildboar", "Wildcat", "Wolf", "Wolverine", "Wombat", "Yak", "Zebra",
  ],
  birds: [
    "Albatross", "Babbler", "Bittern", "Blackbird", "Bluebird", "Bulbul", "Bunting",
    "Canary", "Cardinal", "Chicken", "Condor", "Coot", "Cormorant", "Crane", "Crow",
    "Cuckoo", "Darter", "Dove", "Drongo", "Duck", "Eagle", "Egret", "Emu", "Falcon",
    "Fantail", "Finch", "Flamingo", "Goose", "Grebe", "Grosbeak", "Hawk", "Heron",
    "Hoopoe", "Hummingbird", "Ibis", "Indianroller", "Jacana", "Jay", "Kestrel",
    "Kingfisher", "Kite", "Kiwi", "Koel", "Lapwing", "Lark", "Lovebird", "Macaw",
    "Magpie", "Munia", "Myna", "Nightingale", "Nightjar", "Oriole", "Ostrich", "Owl",
    "Parakeet", "Parrot", "Partridge", "Peacock", "Pelican", "Penguin", "Pheasant",
    "Pigeon", "Pipit", "Plover", "Puffin", "Quail", "Raven", "Redstart", "Robin",
    "Rooster", "Sandpiper", "Seagull", "Shrike", "Skylark", "Sparrow", "Stork",
    "Sunbird", "Swallow", "Swan", "Swift", "Tailorbird", "Tern", "Thrush", "Toucan",
    "Turkey", "Vulture", "Wagtail", "Warbler", "Weaverbird", "Woodpecker", "Wren",
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
    "Archery", "Athletics", "Badminton", "Baseball", "Basketball", "Biathlon",
    "Billiards", "Bobsled", "Bowling", "Boxing", "Canoeing", "Carrom", "Chess",
    "Climbing", "Cricket", "Curling", "Cycling", "Darts", "Diving", "Fencing",
    "Football", "Gillidanda", "Golf", "Gymkhana", "Gymnastics", "Handball", "Hockey",
    "Judo", "Kabaddi", "Kalaripayattu", "Karate", "Kayaking", "Khokho", "Kiteflying",
    "Lacrosse", "Mallakhamb", "Marathon", "Motorracing", "Netball", "Pehlwani", "Polo",
    "Racewalking", "Rollerskating", "Rowing", "Rugby", "Sailing", "Sepaktakraw",
    "Shooting", "Silambam", "Skateboarding", "Skiing", "Snooker", "Snowboarding",
    "Soccer", "Softball", "Squash", "Surfing", "Swimming", "Taekwondo", "Tennis",
    "Trekking", "Triathlon", "Volleyball", "Weightlifting", "Wrestling", "Yachting",
    "Yoga",
  ],
  movies: [
    "Aandhi", "Agneepath", "Aladdin", "Alien", "Amadeus", "Amar", "Anand", "Andaz",
    "Avatar", "Awaara", "Baahubali", "Baazigar", "Babe", "Barfi", "Batman", "Bombay",
    "Border", "Braveheart", "Casablanca", "Chakdeindia", "Chandni", "Chennaiexpress",
    "Cinderella", "Coco", "Coolie", "Dabangg", "Dangal", "Devdas", "Dhadak", "Dhoom",
    "Dilwale", "Dostana", "Drishyam", "Dune", "Elf", "Encanto", "Fanaa", "Fargo",
    "Frozen", "Fukrey", "Gadar", "Gangubai", "Ghajini", "Ghost", "Gladiator",
    "Godfather", "Gravity", "Grease", "Guide", "Haider", "Hairspray", "Herapheri",
    "Hercules", "Highway", "Housefull", "Inception", "Interstellar", "Ishq", "Ittefaq",
    "Jaws", "Joker", "Josh", "Juno", "Jurassic", "Kaminey", "Karz", "Kesari", "Kranti",
    "Lagaan", "Lakshya", "Lootera", "Mardaani", "Masaan", "Matrix", "Mausam", "Moana",
    "Mom", "Nayak", "Neerja", "Newton", "October", "OMG", "Omkara", "Padmaavat",
    "Parasite", "Parmanu", "Pathaan", "Piku", "PK", "Queen", "Raazi", "Rambo",
    "Ratatouille", "Rio", "Rockstar", "Rocky", "Roja", "Sanju", "Sarfarosh", "Satya",
    "Sholay", "Shrek", "Split", "Sultan", "Swades", "Talaash", "Tamasha", "Tangled",
    "Ted", "Terminator", "Titanic", "Udaan", "Up", "Uri", "Vertigo", "Wazir", "Whiplash",
    "Yaadein", "Zanjeer", "Zero", "Zootopia",
  ],
  books: [
    "Beloved", "Beowulf", "Candide", "Carrie", "Devdas", "Discoveryofindia", "Dracula",
    "Dune", "Emma", "Fivepointsomeone", "Frankenstein", "Gaban", "Gitanjali", "Godaan",
    "Guide", "Hamlet", "Holes", "Iliad", "Ivanhoe", "Jaws", "Kanthapura", "Karmabhoomi",
    "Kim", "Mahabharata", "Malgudidays", "Matilda", "Midnightschildren", "Misery",
    "Nirmala", "Odyssey", "Outliers", "Panchatantra", "Persuasion", "Ramayana",
    "Rashmirathi", "Rebecca", "Room", "Sevasadan", "Shantaram", "Sybil", "Tamas",
    "Thegodofsmallthings", "Thewhitetiger", "Traintopakistan", "Ulysses", "Untamed",
    "Untouchable", "Verity", "Watchmen", "Wingsoffire", "Wonder", "Zorro",
  ],
  jobs: [
    "Accountant", "Actor", "Architect", "Artist", "Baker", "Barber", "Biologist",
    "Blacksmith", "Butcher", "Carpenter", "Cashier", "Chef", "Chemist", "Coach",
    "Cobbler", "Dentist", "Designer", "Detective", "Dhobi", "Doctor", "Driver", "Editor",
    "Electrician", "Engineer", "Farmer", "Firefighter", "Florist", "Gardener",
    "Geologist", "Goldsmith", "Hairdresser", "Illustrator", "Janitor", "Journalist",
    "Judge", "Lawyer", "Lecturer", "Librarian", "Lifeguard", "Locksmith", "Mechanic",
    "Musician", "Nurse", "Optician", "Painter", "Pharmacist", "Photographer", "Pilot",
    "Plumber", "Potter", "Priest", "Professor", "Programmer", "Psychologist",
    "Receptionist", "Rickshawdriver", "Sailor", "Scientist", "Sculptor", "Shepherd",
    "Singer", "Surgeon", "Tailor", "Teacher", "Translator", "Vendor", "Veterinarian",
    "Waiter", "Washerman", "Weaver", "Welder", "Writer", "Zoologist",
  ],
  school_subjects: [
    "Accountancy", "Agriculture", "Algebra", "Anthropology", "Art", "Astronomy",
    "Biology", "Botany", "Business", "Calculus", "Chemistry", "Civics", "Commerce",
    "Computerscience", "Dance", "Drama", "Economics", "English", "Environmentalscience",
    "Ethics", "Finance", "French", "Genetics", "Geography", "Geology", "Geometry",
    "German", "Government", "Grammar", "Gym", "Hindi", "History", "Journalism", "Latin",
    "Law", "Linguistics", "Literature", "Marketing", "Mathematics", "Meteorology",
    "Music", "Nutrition", "Philosophy", "Photography", "Physicaleducation", "Physics",
    "Politicalscience", "Psychology", "Reading", "Religion", "Robotics", "Sanskrit",
    "Science", "Sociology", "Spanish", "Statistics", "Theater", "Trigonometry", "Urdu",
    "Vedicmaths", "Woodworking", "Writing", "Zoology",
  ],
  emotions: [
    "Afraid", "Amazed", "Ambitious", "Amused", "Angry", "Annoyed", "Anxious",
    "Apologetic", "Ashamed", "Bitter", "Blissful", "Bold", "Bored", "Brave", "Calm",
    "Carefree", "Cheerful", "Compassionate", "Confident", "Confused", "Content",
    "Cranky", "Curious", "Delighted", "Depressed", "Determined", "Devastated",
    "Disappointed", "Disgusted", "Disheartened", "Eager", "Ecstatic", "Embarrassed",
    "Empathetic", "Enthusiastic", "Envious", "Excited", "Exhausted", "Fearful",
    "Frustrated", "Furious", "Glad", "Grateful", "Grumpy", "Guilty", "Happy",
    "Heartbroken", "Hopeful", "Hopeless", "Humiliated", "Hurt", "Impatient",
    "Indifferent", "Insecure", "Inspired", "Irritated", "Jealous", "Joyful", "Lonely",
    "Loved", "Melancholy", "Miserable", "Motivated", "Nervous", "Nostalgic", "Numb",
    "Offended", "Optimistic", "Overwhelmed", "Panicked", "Peaceful", "Proud", "Puzzled",
    "Regretful", "Relaxed", "Relieved", "Restless", "Sad", "Satisfied", "Scared",
    "Sentimental", "Shy", "Skeptical", "Stressed", "Surprised", "Tense", "Terrified",
    "Thankful", "Thrilled", "Timid", "Tired", "Uneasy", "Upset", "Vulnerable", "Weary",
    "Worried", "Zealous",
  ],
  clothing: [
    "Anarkali", "Angavastram", "Apron", "Bandhgala", "Bindi", "Blazer", "Blouse",
    "Boots", "Cape", "Cardigan", "Chunni", "Churidar", "Coat", "Dhoti", "Dress",
    "Dupatta", "Gamcha", "Ghagra", "Gloves", "Gown", "Hat", "Hoodie", "Jacket", "Jeans",
    "Jersey", "Jumpsuit", "Jutti", "Kediyu", "Kimono", "Kurta", "Leggings", "Lehenga",
    "Lungi", "Mittens", "Mundu", "Odhani", "Overalls", "Pagdi", "Pajamas", "Pants",
    "Parka", "Patiala", "Pheran", "Poncho", "Robe", "Romper", "Salwar", "Sandals",
    "Saree", "Sari", "Scarf", "Sherwani", "Shirt", "Shorts", "Skirt", "Slippers",
    "Socks", "Suit", "Sweater", "Swimsuit", "Tie", "Tights", "Topi", "Trousers", "Tunic",
    "Turtleneck", "Underwear", "Uniform", "Veshti", "Vest", "Windbreaker",
  ],
  household: [
    "Angeethi", "Armchair", "Basket", "Bed", "Belan", "Blanket", "Blender", "Bookshelf",
    "Bowl", "Broom", "Bucket", "Cabinet", "Calendar", "Candle", "Carpet", "Chair",
    "Chakla", "Charpai", "Chimta", "Chulha", "Clock", "Closet", "Couch", "Cup",
    "Curtain", "Cushion", "Cutlery", "Dabba", "Degchi", "Desk", "Diya", "Dresser", "Fan",
    "Fork", "Fridge", "Hammer", "Kadhai", "Kettle", "Ladder", "Lamp", "Lota",
    "Masaladabba", "Matka", "Mattress", "Microwave", "Mirror", "Mop", "Napkin", "Oven",
    "Palang", "Pan", "Parat", "Pillow", "Plate", "Pot", "Rug", "Shelf", "Silbatta",
    "Sofa", "Spoon", "Stool", "Table", "Tawa", "Television", "Thali", "Thermometer",
    "Tiffin", "Tijori", "Toaster", "Towel", "Uruli", "Vacuum", "Vase", "Wardrobe",
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
