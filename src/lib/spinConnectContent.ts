export type CategoryKey =
  | "fruits"
  | "vegetables"
  | "flowers"
  | "colors"
  | "animals"
  | "birds"
  | "countries"
  | "cities"
  | "rivers"
  | "mountains"
  | "foods"
  | "drinks"
  | "sports"
  | "movies"
  | "music_genres"
  | "books"
  | "jobs"
  | "school_subjects"
  | "emotions"
  | "clothing"
  | "household"
  | "vehicles"
  | "games"
  | "instruments";

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
  { key: "cities", label: "Cities", emoji: "🏙️" },
  { key: "rivers", label: "Rivers", emoji: "🌊" },
  { key: "mountains", label: "Mountains", emoji: "⛰️" },
  { key: "foods", label: "Foods / Dishes", emoji: "🍜" },
  { key: "drinks", label: "Drinks", emoji: "🥤" },
  { key: "sports", label: "Sports", emoji: "⚽" },
  { key: "movies", label: "Movies", emoji: "🎬" },
  { key: "music_genres", label: "Music Genres", emoji: "🎵" },
  { key: "books", label: "Books", emoji: "📚" },
  { key: "jobs", label: "Jobs / Professions", emoji: "💼" },
  { key: "school_subjects", label: "School Subjects", emoji: "📐" },
  { key: "emotions", label: "Emotions / Feelings", emoji: "💛" },
  { key: "clothing", label: "Clothing Items", emoji: "👕" },
  { key: "household", label: "Household Objects", emoji: "🪑" },
  { key: "vehicles", label: "Vehicles / Transport", emoji: "🚗" },
  { key: "games", label: "Board / Card Games", emoji: "🎲" },
  { key: "instruments", label: "Musical Instruments", emoji: "🎸" },
];

export function categoryByKey(key: string): CategoryDef {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];
}

export const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const WORDBANK: Record<CategoryKey, string[]> = {
  fruits: [
    "Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Blueberry", "Cherry", "Cantaloupe",
    "Coconut", "Cranberry", "Date", "Dragonfruit", "Elderberry", "Fig", "Grape", "Grapefruit",
    "Guava", "Honeydew", "Jackfruit", "Kiwi", "Kumquat", "Lemon", "Lime", "Lychee", "Mango",
    "Melon", "Mulberry", "Nectarine", "Orange", "Papaya", "Passionfruit", "Peach", "Pear",
    "Persimmon", "Pineapple", "Plum", "Pomegranate", "Quince", "Raspberry", "Starfruit",
    "Strawberry", "Tangerine", "Watermelon",
  ],
  vegetables: [
    "Artichoke", "Asparagus", "Beet", "Broccoli", "Cabbage", "Carrot", "Cauliflower", "Celery",
    "Corn", "Cucumber", "Eggplant", "Fennel", "Garlic", "Ginger", "Kale", "Leek", "Lettuce",
    "Mushroom", "Okra", "Onion", "Parsnip", "Pea", "Pepper", "Potato", "Pumpkin", "Radish",
    "Spinach", "Squash", "Tomato", "Turnip", "Yam", "Zucchini",
  ],
  flowers: [
    "Aster", "Azalea", "Begonia", "Carnation", "Chrysanthemum", "Daffodil", "Dahlia", "Daisy",
    "Freesia", "Gardenia", "Geranium", "Hibiscus", "Hyacinth", "Iris", "Jasmine", "Lavender",
    "Lilac", "Lily", "Magnolia", "Marigold", "Orchid", "Pansy", "Peony", "Petunia", "Poppy",
    "Rose", "Snapdragon", "Sunflower", "Tulip", "Violet", "Wisteria", "Zinnia",
  ],
  colors: [
    "Amber", "Aqua", "Beige", "Black", "Blue", "Bronze", "Brown", "Burgundy", "Coral", "Crimson",
    "Cyan", "Emerald", "Gold", "Gray", "Green", "Indigo", "Ivory", "Jade", "Lavender", "Lilac",
    "Magenta", "Maroon", "Mint", "Navy", "Olive", "Orange", "Pink", "Purple", "Red", "Rose",
    "Ruby", "Salmon", "Sapphire", "Scarlet", "Silver", "Tan", "Teal", "Turquoise", "Violet",
    "White", "Yellow",
  ],
  animals: [
    "Alligator", "Antelope", "Bear", "Beaver", "Buffalo", "Camel", "Cheetah", "Cow", "Coyote",
    "Deer", "Dolphin", "Donkey", "Elephant", "Ferret", "Fox", "Giraffe", "Goat", "Gorilla",
    "Hedgehog", "Hippopotamus", "Horse", "Iguana", "Jaguar", "Kangaroo", "Koala", "Leopard",
    "Lion", "Llama", "Lynx", "Meerkat", "Mole", "Monkey", "Moose", "Mouse", "Ocelot", "Otter",
    "Panda", "Panther", "Pig", "Rabbit", "Raccoon", "Rhinoceros", "Seal", "Sheep", "Skunk",
    "Sloth", "Squirrel", "Tiger", "Turtle", "Walrus", "Weasel", "Wolf", "Wombat", "Yak", "Zebra",
  ],
  birds: [
    "Albatross", "Blackbird", "Bluebird", "Canary", "Cardinal", "Chicken", "Condor", "Crane",
    "Crow", "Cuckoo", "Dove", "Duck", "Eagle", "Egret", "Falcon", "Finch", "Flamingo", "Goose",
    "Hawk", "Heron", "Hummingbird", "Ibis", "Jay", "Kingfisher", "Kiwi", "Kestrel", "Lark",
    "Macaw", "Magpie", "Nightingale", "Ostrich", "Owl", "Parrot", "Peacock", "Pelican",
    "Penguin", "Pigeon", "Puffin", "Quail", "Raven", "Robin", "Rooster", "Seagull", "Sparrow",
    "Stork", "Swallow", "Swan", "Toucan", "Turkey", "Vulture", "Woodpecker", "Wren",
  ],
  countries: [
    "Afghanistan", "Albania", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium",
    "Bolivia", "Brazil", "Cambodia", "Canada", "Chile", "China", "Colombia", "Croatia", "Cuba",
    "Denmark", "Ecuador", "Egypt", "Ethiopia", "Fiji", "Finland", "France", "Germany", "Ghana",
    "Greece", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
    "Italy", "Jamaica", "Japan", "Jordan", "Kenya", "Kuwait", "Laos", "Lebanon", "Libya",
    "Madagascar", "Malaysia", "Mexico", "Mongolia", "Morocco", "Nepal", "Netherlands",
    "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Peru", "Philippines", "Poland",
    "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "Senegal", "Singapore",
    "Slovenia", "Somalia", "Spain", "Sweden", "Switzerland", "Syria", "Taiwan", "Tanzania",
    "Thailand", "Tunisia", "Turkey", "Uganda", "Ukraine", "Uruguay", "Venezuela", "Vietnam",
    "Yemen", "Zambia", "Zimbabwe",
  ],
  cities: [
    "Amsterdam", "Athens", "Atlanta", "Bangkok", "Barcelona", "Beijing", "Berlin", "Boston",
    "Brussels", "Budapest", "Cairo", "Chicago", "Copenhagen", "Dallas", "Delhi", "Denver",
    "Dubai", "Dublin", "Edinburgh", "Florence", "Geneva", "Hanoi", "Havana", "Helsinki",
    "Houston", "Istanbul", "Jakarta", "Kyoto", "Lagos", "Lima", "Lisbon", "London",
    "Madrid", "Manila", "Melbourne", "Miami", "Milan", "Montreal", "Moscow", "Mumbai",
    "Nairobi", "Naples", "Oslo", "Paris", "Prague", "Quebec", "Rome", "Seattle", "Seoul",
    "Shanghai", "Singapore", "Stockholm", "Sydney", "Tokyo", "Toronto", "Vancouver", "Venice",
    "Vienna", "Warsaw", "Zurich",
  ],
  rivers: [
    "Amazon", "Amur", "Brahmaputra", "Colorado", "Columbia", "Congo", "Danube", "Elbe",
    "Euphrates", "Ganges", "Indus", "Irrawaddy", "Jordan", "Lena", "Loire", "Mackenzie",
    "Mekong", "Mississippi", "Missouri", "Murray", "Niger", "Nile", "Ohio", "Orinoco",
    "Paraguay", "Parana", "Rhine", "Rhone", "Salween", "Seine", "Tagus", "Thames", "Tiber",
    "Tigris", "Ural", "Volga", "Volta", "Yangtze", "Yukon", "Zambezi",
  ],
  mountains: [
    "Aconcagua", "Annapurna", "Blanc", "Cotopaxi", "Denali", "Elbrus", "Etna", "Everest",
    "Fuji", "Himalaya", "Jungfrau", "Kilimanjaro", "Kosciuszko", "Logan", "Makalu",
    "Matterhorn", "McKinley", "Olympus", "Popocatepetl", "Rainier", "Shasta", "Vesuvius",
    "Whitney",
  ],
  foods: [
    "Baklava", "Biryani", "Bibimbap", "Burger", "Burrito", "Calzone", "Casserole", "Chowder",
    "Croissant", "Curry", "Dumpling", "Enchilada", "Falafel", "Fondue", "Goulash", "Gumbo",
    "Hummus", "Kebab", "Lasagna", "Meatloaf", "Moussaka", "Nachos", "Noodles", "Omelette",
    "Pancake", "Pasta", "Pierogi", "Pizza", "Quiche", "Ramen", "Risotto", "Salad", "Sandwich",
    "Sashimi", "Souffle", "Soup", "Spaghetti", "Stew", "Sushi", "Taco", "Tempura", "Waffle",
  ],
  drinks: [
    "Ale", "Beer", "Cappuccino", "Champagne", "Cider", "Cocoa", "Coffee", "Cola", "Cordial",
    "Daiquiri", "Eggnog", "Espresso", "Gin", "Kombucha", "Lassi", "Latte", "Lemonade",
    "Margarita", "Martini", "Milk", "Mocha", "Mojito", "Nectar", "Punch", "Rum", "Sake",
    "Sangria", "Seltzer", "Smoothie", "Soda", "Tea", "Tequila", "Vodka", "Water", "Whiskey",
    "Wine",
  ],
  sports: [
    "Archery", "Athletics", "Badminton", "Baseball", "Basketball", "Biathlon", "Billiards",
    "Bobsled", "Bowling", "Boxing", "Canoeing", "Climbing", "Cricket", "Curling", "Cycling",
    "Darts", "Diving", "Fencing", "Football", "Golf", "Gymnastics", "Handball", "Hockey",
    "Judo", "Karate", "Lacrosse", "Netball", "Polo", "Rowing", "Rugby", "Sailing",
    "Skateboarding", "Skiing", "Snowboarding", "Soccer", "Softball", "Squash", "Surfing",
    "Swimming", "Taekwondo", "Tennis", "Triathlon", "Volleyball", "Wrestling", "Yoga",
  ],
  movies: [
    "Aladdin", "Alien", "Amadeus", "Avatar", "Babe", "Batman", "Braveheart", "Casablanca",
    "Cinderella", "Coco", "Dune", "Elf", "Encanto", "Fargo", "Frozen", "Ghost", "Gladiator",
    "Grease", "Hairspray", "Hercules", "Inception", "Jaws", "Joker", "Juno", "Matrix",
    "Moana", "Ratatouille", "Rio", "Rocky", "Shrek", "Split", "Tangled", "Ted", "Titanic",
    "Up", "Vertigo", "Zootopia",
  ],
  music_genres: [
    "Afrobeat", "Alternative", "Ambient", "Ballad", "Bluegrass", "Blues", "Calypso", "Chanson",
    "Classical", "Country", "Dance", "Disco", "Dubstep", "Electronic", "Flamenco", "Folk",
    "Funk", "Gospel", "Grunge", "Hip hop", "House", "Indie", "Jazz", "Klezmer", "Latin",
    "Metal", "Motown", "Opera", "Pop", "Punk", "Ragtime", "Rap", "Reggae", "Reggaeton", "Rock",
    "Salsa", "Samba", "Ska", "Soul", "Swing", "Tango", "Techno", "Trance", "Zydeco",
  ],
  books: [
    "Beloved", "Beowulf", "Candide", "Carrie", "Dracula", "Dune", "Emma", "Frankenstein",
    "Hamlet", "Holes", "Ivanhoe", "Jaws", "Kim", "Matilda", "Misery", "Outliers", "Persuasion",
    "Rebecca", "Room", "Sybil", "Ulysses", "Untamed", "Verity", "Watchmen", "Wonder", "Zorro",
  ],
  jobs: [
    "Accountant", "Actor", "Architect", "Artist", "Baker", "Barber", "Biologist", "Butcher",
    "Carpenter", "Cashier", "Chef", "Chemist", "Coach", "Dentist", "Designer", "Detective",
    "Doctor", "Driver", "Editor", "Electrician", "Engineer", "Farmer", "Firefighter",
    "Florist", "Gardener", "Geologist", "Hairdresser", "Illustrator", "Janitor",
    "Journalist", "Judge", "Lawyer", "Lecturer", "Librarian", "Lifeguard", "Locksmith",
    "Mechanic", "Musician", "Nurse", "Optician", "Painter", "Pharmacist", "Photographer",
    "Pilot", "Plumber", "Professor", "Programmer", "Psychologist", "Receptionist", "Sailor",
    "Scientist", "Sculptor", "Singer", "Surgeon", "Tailor", "Teacher", "Translator",
    "Veterinarian", "Waiter", "Welder", "Writer", "Zoologist",
  ],
  school_subjects: [
    "Algebra", "Art", "Biology", "Business", "Calculus", "Chemistry", "Civics",
    "Dance", "Drama", "Economics", "English", "Finance", "French", "Geography", "Geology",
    "Geometry", "German", "Government", "Grammar", "Gym", "History", "Journalism", "Latin",
    "Law", "Linguistics", "Literature", "Marketing", "Mathematics", "Music", "Nutrition",
    "Philosophy", "Photography", "Physics", "Psychology", "Reading", "Religion", "Science",
    "Sociology", "Spanish", "Statistics", "Theater", "Woodworking", "Writing", "Zoology",
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
    "Apron", "Blazer", "Blouse", "Boots", "Cape", "Cardigan", "Coat", "Dress", "Gloves",
    "Gown", "Hat", "Hoodie", "Jacket", "Jeans", "Jersey", "Jumpsuit", "Kimono", "Leggings",
    "Mittens", "Overalls", "Pajamas", "Pants", "Parka", "Poncho", "Robe", "Romper",
    "Sandals", "Scarf", "Shirt", "Shorts", "Skirt", "Slippers", "Socks", "Suit", "Sweater",
    "Swimsuit", "Tie", "Tights", "Trousers", "Tunic", "Turtleneck", "Underwear", "Uniform",
    "Vest", "Windbreaker",
  ],
  household: [
    "Armchair", "Basket", "Bed", "Blanket", "Blender", "Bookshelf", "Bowl", "Broom",
    "Bucket", "Cabinet", "Calendar", "Candle", "Carpet", "Chair", "Clock", "Closet",
    "Couch", "Cup", "Curtain", "Cushion", "Cutlery", "Desk", "Dresser", "Fan", "Fork",
    "Fridge", "Hammer", "Kettle", "Ladder", "Lamp", "Mattress", "Microwave", "Mirror",
    "Mop", "Napkin", "Oven", "Pan", "Pillow", "Plate", "Pot", "Rug", "Shelf", "Sofa",
    "Spoon", "Stool", "Table", "Television", "Thermometer", "Toaster", "Towel", "Vacuum",
    "Vase", "Wardrobe",
  ],
  vehicles: [
    "Airplane", "Ambulance", "Bicycle", "Boat", "Bus", "Cab", "Canoe", "Car", "Caravan",
    "Carriage", "Cart", "Catamaran", "Coach", "Ferry", "Forklift", "Gondola", "Helicopter",
    "Jeep", "Jet", "Kayak", "Limousine", "Minivan", "Motorcycle", "Rickshaw", "Rocket",
    "Sailboat", "Scooter", "Sedan", "Ship", "Skateboard", "Sled", "Snowmobile", "Submarine",
    "Subway", "Tank", "Taxi", "Train", "Tram", "Trolley", "Truck", "Van", "Wagon", "Yacht",
  ],
  games: [
    "Backgammon", "Bingo", "Blackjack", "Bridge", "Canasta", "Checkers", "Chess", "Clue",
    "Cribbage", "Dominoes", "Euchre", "Go", "Hearts", "Jenga", "Life", "Ludo", "Mahjong",
    "Monopoly", "Othello", "Pictionary", "Poker", "Rummy", "Scrabble", "Solitaire", "Sorry",
    "Spades", "Uno", "War", "Yahtzee",
  ],
  instruments: [
    "Accordion", "Bagpipes", "Banjo", "Bassoon", "Bongo", "Cello", "Clarinet", "Cymbals",
    "Drums", "Dulcimer", "Flute", "Guitar", "Harmonica", "Harp", "Harpsichord", "Kazoo",
    "Keyboard", "Lute", "Mandolin", "Maracas", "Marimba", "Oboe", "Organ", "Piano",
    "Piccolo", "Recorder", "Saxophone", "Sitar", "Tambourine", "Timpani", "Triangle",
    "Trombone", "Trumpet", "Tuba", "Ukulele", "Viola", "Violin", "Xylophone", "Zither",
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

export function isValidAnswer(category: CategoryKey, letter: string, answer: string): boolean {
  const normalized = answer.trim().toLowerCase();
  if (!normalized) return false;
  return wordsFor(category, letter).some((w) => w.toLowerCase() === normalized);
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
