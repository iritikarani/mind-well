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

export const LETTERS = "ABCDEFGHIKLMNOPRSTUW".split("");

export const WORDBANK: Record<CategoryKey, string[]> = {
  fruits: [
    "Ackee", "Akebi", "Amla", "Apple", "Apricot", "Avocado", "Bael", "Banana", "Ber",
    "Bergamot", "Bilimbi", "Blackberry", "Blackcurrant", "Blueberry", "Boysenberry",
    "Breadfruit", "Canistel", "Cantaloupe", "Cempedak", "Cherimoya", "Cherry", "Chikoo",
    "Cloudberry", "Coconut", "Cranberry", "Cupuacu", "Custardapple", "Damson", "Date",
    "Dewberry", "Dragonfruit", "Durian", "Elderberry", "Falsa", "Feijoa", "Fig",
    "Genipap", "Gooseberry", "Grape", "Grapefruit", "Guava", "Hackberry", "Honeydew",
    "Ilama", "Jaboticaba", "Jackfruit", "Jamun", "Jocote", "Jujube", "Karonda", "Khirni",
    "Kiwano", "Kiwi", "Kumquat", "Langsat", "Lemon", "Lime", "Longan", "Loquat",
    "Lychee", "Mamey", "Mango", "Mangosteen", "Marula", "Medlar", "Melon",
    "Miraclefruit", "Mulberry", "Muskmelon", "Naranjilla", "Nectarine", "Olive",
    "Orange", "Papaya", "Passionfruit", "Pawpaw", "Peach", "Pear", "Pepino", "Persimmon",
    "Physalis", "Pineapple", "Pitaya", "Plum", "Pomegranate", "Pulasan", "Quince",
    "Rambutan", "Ramphal", "Raspberry", "Redcurrant", "Salak", "Santol", "Sapota",
    "Sitaphal", "Sloe", "Soursop", "Starfruit", "Strawberry", "Surinamcherry",
    "Tamarillo", "Tamarind", "Tangerine", "Tayberry", "Ugli", "Velvetapple",
    "Watermelon", "Whitesapote", "Wineberry", "Woodapple", "Yuzu", "Zapote", "Ziziphus",
  ],
  vegetables: [
    "Amaranth", "Arrowroot", "Artichoke", "Asparagus", "Beet", "Beetroot", "Bhindi",
    "Bittergourd", "Bokchoy", "Bottlegourd", "Broadbeans", "Broccoli", "Cabbage",
    "Capsicum", "Carrot", "Cauliflower", "Celeriac", "Celery", "Chard", "Chayote",
    "Chicory", "Collardgreens", "Colocasia", "Corn", "Cucumber", "Daikon", "Drumstick",
    "Eggplant", "Endive", "Escarole", "Fennel", "Fenugreek", "Fiddlehead", "Frenchbeans",
    "Galangal", "Garlic", "Ginger", "Guar", "Horseradish", "Ivygourd", "Jicama", "Kale",
    "Kohlrabi", "Leek", "Lemongrass", "Lettuce", "Lotusstem", "Mizuna", "Morel",
    "Mushroom", "Mustardgreens", "Nopales", "Okra", "Onion", "Parsnip", "Parwal", "Pea",
    "Pepper", "Plantain", "Potato", "Pumpkin", "Purslane", "Radicchio", "Radish",
    "Rampion", "Ridgegourd", "Rutabaga", "Salsify", "Samphire", "Scallion", "Shallot",
    "Snakegourd", "Sorrel", "Spinach", "Squash", "Sweetpotato", "Taro", "Tinda",
    "Tomato", "Turnip", "Wasabi", "Waterchestnut", "Watercress", "Yam", "Yardlongbean",
    "Zucchini",
  ],
  flowers: [
    "Alamanda", "Amaryllis", "Anemone", "Anthurium", "Aquilegia", "Aster", "Azalea",
    "Balsam", "Begonia", "Bellflower", "Bluebell", "Bougainvillea", "Buttercup",
    "Callalily", "Camellia", "Carnation", "Champa", "Champak", "Chrysanthemum",
    "Clematis", "Columbine", "Cornflower", "Cosmos", "Crocus", "Cyclamen", "Daffodil",
    "Dahlia", "Daisy", "Delphinium", "Edelweiss", "Foxglove", "Frangipani", "Freesia",
    "Fritillaria", "Gardenia", "Gentian", "Geranium", "Gerbera", "Gladiolus", "Gulmohar",
    "Harsingar", "Heather", "Hellebore", "Hibiscus", "Hollyhock", "Hyacinth",
    "Impatiens", "Iris", "Jasmine", "Kadamba", "Kaner", "Lantana", "Larkspur",
    "Lavender", "Lilac", "Lily", "Lotus", "Lupine", "Magnolia", "Marguerite", "Marigold",
    "Mimosa", "Mogra", "Moonflower", "Morningglory", "Nagkesar", "Nargis", "Nasturtium",
    "Oleander", "Orchid", "Palash", "Pansy", "Parijat", "Passionflower", "Peony",
    "Periwinkle", "Petunia", "Plumeria", "Poppy", "Primrose", "Protea", "Ragwort",
    "Rajnigandha", "Ranunculus", "Rose", "Saxifrage", "Snapdragon", "Sunflower",
    "Sweetpea", "Tuberose", "Tulip", "Verbena", "Violet", "Wallflower", "Wisteria",
    "Yarrow", "Zinnia",
  ],
  colors: [
    "Alizarin", "Amaranth", "Amber", "Aqua", "Aquamarine", "Auburn", "Azure", "Basanti",
    "Beige", "Bistre", "Black", "Blue", "Bottlegreen", "Bronze", "Brown", "Burgundy",
    "Cardinal", "Cerise", "Cerulean", "Champagne", "Chartreuse", "Chestnut", "Chocolate",
    "Cobalt", "Copper", "Coral", "Cream", "Crimson", "Cyan", "Damask", "Ecru",
    "Eggshell", "Emerald", "Fawn", "Flax", "Fuchsia", "Glaucous", "Gold", "Gray",
    "Green", "Gulabi", "Heliotrope", "Henna", "Indigo", "Ivory", "Jade", "Jasper",
    "Jonquil", "Khaki", "Lavender", "Lilac", "Lime", "Magenta", "Mahogany", "Malachite",
    "Maroon", "Mauve", "Mehendi", "Mint", "Mustard", "Navy", "Ochre", "Olive", "Onyx",
    "Opal", "Orange", "Peach", "Persimmon", "Pewter", "Pink", "Plum", "Puce", "Purple",
    "Red", "Rose", "Ruby", "Russet", "Rust", "Sable", "Saffron", "Salmon", "Sandalwood",
    "Sapphire", "Scarlet", "Seagreen", "Sepia", "Sienna", "Silver", "Slate", "Smoke",
    "Tan", "Taupe", "Teal", "Terracotta", "Turquoise", "Ultramarine", "Umber",
    "Vermilion", "Violet", "Viridian", "White", "Wine", "Xanadu", "Yellow", "Zaffre",
  ],
  animals: [
    "Aardvark", "Aardwolf", "Addax", "Agouti", "Alligator", "Alpaca", "Anteater",
    "Antelope", "Aoudad", "Armadillo", "Babirusa", "Badger", "Bandicoot", "Barasingha",
    "Bat", "Bear", "Beaver", "Binturong", "Bison", "Blackbuck", "Bongo", "Buffalo",
    "Camel", "Capybara", "Caracal", "Caribou", "Chameleon", "Cheetah", "Chimpanzee",
    "Chinkara", "Chipmunk", "Civet", "Cobra", "Cougar", "Cow", "Coyote", "Crocodile",
    "Deer", "Dhole", "Dingo", "Dolphin", "Donkey", "Dugong", "Echidna", "Elephant",
    "Fennecfox", "Ferret", "Fishingcat", "Fossa", "Fox", "Gaur", "Gazelle", "Gecko",
    "Gemsbok", "Gerenuk", "Gharial", "Gibbon", "Giraffe", "Goat", "Gorilla", "Hamster",
    "Hartebeest", "Hedgehog", "Hippopotamus", "Horse", "Hyena", "Hyrax", "Iguana",
    "Impala", "Indri", "Jackal", "Jackrabbit", "Jaguar", "Jerboa", "Kangaroo",
    "Kinkajou", "Koala", "Kudu", "Langur", "Lemur", "Leopard", "Lion", "Lizard", "Llama",
    "Lynx", "Macaque", "Manatee", "Mandrill", "Margay", "Markhor", "Meerkat", "Mole",
    "Mongoose", "Monkey", "Moose", "Mouse", "Mule", "Muntjac", "Muskdeer", "Newt",
    "Nilgai", "Numbat", "Ocelot", "Okapi", "Onager", "Opossum", "Orangutan", "Oryx",
    "Otter", "Panda", "Pangolin", "Panther", "Peccary", "Pig", "Pika", "Platypus",
    "Porcupine", "Puma", "Quokka", "Quoll", "Rabbit", "Raccoon", "Redpanda",
    "Rhinoceros", "Salamander", "Sambar", "Scorpion", "Seal", "Serval", "Sheep", "Shrew",
    "Skunk", "Sloth", "Slothbear", "Snake", "Spider", "Springbok", "Squirrel", "Stoat",
    "Tamarin", "Tapir", "Tarsier", "Tenrec", "Tiger", "Toad", "Turtle", "Uakari",
    "Vicuna", "Vole", "Wallaby", "Walrus", "Warthog", "Waterbuck", "Weasel", "Wildass",
    "Wildboar", "Wildcat", "Wildebeest", "Wolf", "Wolverine", "Wombat", "Yak", "Zebra",
    "Zorilla",
  ],
  birds: [
    "Accentor", "Albatross", "Avocet", "Babbler", "Beeeater", "Bittern", "Blackbird",
    "Bluebird", "Bowerbird", "Brambling", "Bulbul", "Bunting", "Bustard", "Canary",
    "Capercaillie", "Cardinal", "Catbird", "Chaffinch", "Chicken", "Cockatiel",
    "Cockatoo", "Condor", "Coot", "Cormorant", "Crane", "Crow", "Cuckoo", "Curlew",
    "Darter", "Dodo", "Dove", "Drongo", "Duck", "Dunnock", "Eagle", "Egret", "Emu",
    "Falcon", "Fantail", "Finch", "Flamingo", "Fulmar", "Gannet", "Godwit", "Goldfinch",
    "Goose", "Grebe", "Grosbeak", "Guillemot", "Guineafowl", "Hawk", "Heron", "Hobby",
    "Honeyeater", "Hoopoe", "Hummingbird", "Ibis", "Indianroller", "Jacamar", "Jacana",
    "Jackdaw", "Jay", "Kakapo", "Kea", "Kestrel", "Kingfisher", "Kite", "Kittiwake",
    "Kiwi", "Koel", "Lapwing", "Lark", "Lorikeet", "Lovebird", "Lyrebird", "Macaw",
    "Magpie", "Merganser", "Merlin", "Mockingbird", "Motmot", "Munia", "Myna",
    "Nightingale", "Nightjar", "Nuthatch", "Oriole", "Ostrich", "Owl", "Parakeet",
    "Parrot", "Partridge", "Peacock", "Pelican", "Penguin", "Petrel", "Phalarope",
    "Pheasant", "Pigeon", "Pipit", "Plover", "Pratincole", "Ptarmigan", "Puffin",
    "Quail", "Quetzal", "Raven", "Redstart", "Roadrunner", "Robin", "Rooster",
    "Sanderling", "Sandpiper", "Seagull", "Shearwater", "Shoveler", "Shrike", "Siskin",
    "Skimmer", "Skua", "Skylark", "Snipe", "Sparrow", "Spoonbill", "Starling", "Stork",
    "Sunbird", "Swallow", "Swan", "Swift", "Tailorbird", "Tanager", "Teal", "Tern",
    "Thrush", "Tit", "Toucan", "Treecreeper", "Trogon", "Turkey", "Turnstone", "Vulture",
    "Wagtail", "Warbler", "Waxwing", "Weaverbird", "Whimbrel", "Wigeon", "Woodcock",
    "Woodpecker", "Wren",
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
    "Aikido", "Archery", "Athletics", "Badminton", "Baseball", "Basketball", "Biathlon",
    "Billiards", "Bobsled", "Bocce", "Bowling", "Boxing", "Bullfighting", "Canoeing",
    "Carrom", "Chess", "Climbing", "Cricket", "Croquet", "Curling", "Cycling", "Darts",
    "Diving", "Dressage", "Falconry", "Fencing", "Fives", "Football", "Gillidanda",
    "Golf", "Gymkhana", "Gymnastics", "Handball", "Hanggliding", "Hockey", "Hurling",
    "Jaialai", "Jousting", "Judo", "Kabaddi", "Kalaripayattu", "Karate", "Kayaking",
    "Kendo", "Khokho", "Kiteflying", "Kitesurfing", "Lacrosse", "Luge", "Mallakhamb",
    "Marathon", "Modernpentathlon", "Motorracing", "Netball", "Orienteering", "Padel",
    "Parkour", "Pehlwani", "Petanque", "Polo", "Powerlifting", "Racewalking",
    "Racquetball", "Rappelling", "Rodeo", "Rollerskating", "Rowing", "Rugby", "Sailing",
    "Sambo", "Scubadiving", "Sepaktakraw", "Shinty", "Shooting", "Silambam",
    "Skateboarding", "Skiing", "Skijoring", "Sledding", "Snooker", "Snowboarding",
    "Soccer", "Softball", "Squash", "Sumo", "Surfing", "Swimming", "Taekwondo", "Tennis",
    "Tobogganing", "Trekking", "Triathlon", "Vaulting", "Volleyball", "Waterpolo",
    "Weightlifting", "Windsurfing", "Wrestling", "Yachting", "Yoga",
  ],
  movies: [
    "Aandhi", "Agneepath", "Aladdin", "Alien", "Amadeus", "Amar", "Amelie",
    "Amoresperros", "Anand", "Andaz", "Avatar", "Awaara", "Baahubali", "Baazigar",
    "Babe", "Barfi", "Batman", "Bombay", "Border", "Braveheart", "Brazil", "Casablanca",
    "Chakdeindia", "Chandni", "Chennaiexpress", "Cinderella", "Cinemaparadiso",
    "Cityofgod", "Coco", "Coolie", "Dabangg", "Dangal", "Delicatessen", "Devdas",
    "Dhadak", "Dhoom", "Dilwale", "Dostana", "Drishyam", "Dune", "Elf", "Encanto",
    "Fanaa", "Fargo", "Frozen", "Fukrey", "Gadar", "Gangubai", "Ghajini", "Ghost",
    "Gladiator", "Godfather", "Gravity", "Grease", "Guide", "Haider", "Hairspray",
    "Herapheri", "Hercules", "Highway", "Housefull", "Ikiru", "Inception",
    "Interstellar", "Ishq", "Ittefaq", "Jaws", "Joker", "Josh", "Juno", "Jurassic",
    "Kaminey", "Karz", "Kesari", "Kranti", "Lagaan", "Lakshya", "Lootera", "Mardaani",
    "Masaan", "Matrix", "Mausam", "Metropolis", "Moana", "Mom", "Nayak", "Neerja",
    "Newton", "Nosferatu", "Notorious", "October", "Oldboy", "OMG", "Omkara",
    "Padmaavat", "Panslabyrinth", "Parasite", "Parmanu", "Pathaan", "Persona", "Piku",
    "PK", "Queen", "Raazi", "Rambo", "Ran", "Rashomon", "Ratatouille", "Rearwindow",
    "Rio", "Rockstar", "Rocky", "Roja", "Sanju", "Sarfarosh", "Satya", "Sholay", "Shrek",
    "Solaris", "Split", "Stalker", "Sultan", "Swades", "Talaash", "Tamasha", "Tangled",
    "Ted", "Terminator", "Titanic", "Tokyostory", "Udaan", "Up", "Uri", "Vertigo",
    "Wazir", "Whiplash", "Wildstrawberries", "Yaadein", "Yojimbo", "Zanjeer", "Zero",
    "Zootopia",
  ],
  books: [
    "Alicesadventures", "Annakarenina", "Beloved", "Beowulf", "Bravenewworld", "Candide",
    "Carrie", "Catch22", "Crimeandpunishment", "Devdas", "Discoveryofindia",
    "Donquixote", "Dracula", "Dune", "Emma", "Faust", "Fivepointsomeone", "Frankenstein",
    "Gaban", "Gitanjali", "Godaan", "Guide", "Hamlet", "Holes", "Iliad", "Ivanhoe",
    "Jaws", "Kanthapura", "Karmabhoomi", "Kim", "Lolita", "Mahabharata", "Malgudidays",
    "Matilda", "Middlemarch", "Midnightschildren", "Misery", "Mobydick", "Nirmala",
    "Odyssey", "Outliers", "Panchatantra", "Persuasion", "Ramayana", "Rashmirathi",
    "Rebecca", "Room", "Sevasadan", "Shantaram", "Siddhartha", "Slaughterhousefive",
    "Sybil", "Tamas", "Thecatcherintherye", "Thegodofsmallthings", "Themetamorphosis",
    "Thestranger", "Thetrial", "Thewhitetiger", "Traintopakistan", "Ulysses", "Untamed",
    "Untouchable", "Vanityfair", "Verity", "Warandpeace", "Watchmen", "Wingsoffire",
    "Wonder", "Wutheringheights", "Zorro",
  ],
  jobs: [
    "Accountant", "Actor", "Actuary", "Anesthesiologist", "Architect", "Archivist",
    "Artist", "Astronaut", "Auctioneer", "Baker", "Barber", "Beekeeper", "Biologist",
    "Blacksmith", "Butcher", "Carpenter", "Cartographer", "Cashier", "Chef", "Chemist",
    "Choreographer", "Coach", "Cobbler", "Cryptographer", "Curator", "Dentist",
    "Designer", "Detective", "Dhobi", "Diplomat", "Doctor", "Driver", "Ecologist",
    "Editor", "Electrician", "Embalmer", "Engineer", "Ethnographer", "Falconer",
    "Farmer", "Farrier", "Firefighter", "Fisherman", "Florist", "Forester", "Gardener",
    "Genealogist", "Geologist", "Glassblower", "Goldsmith", "Hairdresser",
    "Herpetologist", "Horologist", "Ichthyologist", "Illustrator", "Janitor", "Jeweler",
    "Journalist", "Judge", "Landscaper", "Lawyer", "Lecturer", "Librarian", "Lifeguard",
    "Linguist", "Locksmith", "Lumberjack", "Mechanic", "Meteorologist", "Midwife",
    "Milliner", "Musician", "Numismatist", "Nurse", "Optician", "Ornithologist",
    "Painter", "Paleontologist", "Perfumer", "Pharmacist", "Photographer", "Pilot",
    "Plumber", "Potter", "Priest", "Professor", "Programmer", "Psychologist",
    "Puppeteer", "Receptionist", "Referee", "Rickshawdriver", "Sailor", "Scientist",
    "Screenwriter", "Sculptor", "Shepherd", "Singer", "Stenographer", "Surgeon",
    "Tailor", "Taxidermist", "Teacher", "Translator", "Upholsterer", "Vendor",
    "Veterinarian", "Vintner", "Vulcanologist", "Waiter", "Washerman", "Watchmaker",
    "Weaver", "Welder", "Writer", "Zookeeper", "Zoologist",
  ],
  school_subjects: [
    "Accountancy", "Aeronautics", "Agriculture", "Algebra", "Anatomy", "Anthropology",
    "Archaeology", "Art", "Astronomy", "Bioethics", "Biology", "Botany", "Business",
    "Calculus", "Calligraphy", "Cartography", "Ceramics", "Chemistry", "Civics",
    "Commerce", "Computerscience", "Cryptography", "Cybernetics", "Dance", "Drama",
    "Economics", "English", "Environmentalscience", "Epistemology", "Ergonomics",
    "Ethics", "Ethnomusicology", "Etymology", "Finance", "Forensics", "French",
    "Genetics", "Geography", "Geology", "Geometry", "German", "Government", "Grammar",
    "Gym", "Herpetology", "Hindi", "History", "Horticulture", "Ichthyology",
    "Journalism", "Kinesiology", "Latin", "Law", "Linguistics", "Literature", "Logic",
    "Marketing", "Mathematics", "Metallurgy", "Meteorology", "Microbiology",
    "Mineralogy", "Music", "Mythology", "Numismatics", "Nutrition", "Oceanography",
    "Ornithology", "Paleontology", "Pathology", "Petrology", "Pharmacology",
    "Philosophy", "Phonetics", "Photography", "Physicaleducation", "Physics",
    "Politicalscience", "Psychology", "Reading", "Religion", "Rhetoric", "Robotics",
    "Sanskrit", "Science", "Seismology", "Semantics", "Semiotics", "Sociology",
    "Spanish", "Speleology", "Statistics", "Taxonomy", "Theater", "Toxicology",
    "Trigonometry", "Urdu", "Vedicmaths", "Woodworking", "Writing", "Zoology",
  ],
  emotions: [
    "Afraid", "Amazed", "Ambitious", "Amused", "Angry", "Annoyed", "Anxious",
    "Apologetic", "Ashamed", "Awe", "Bemused", "Bitter", "Blissful", "Bold", "Bored",
    "Brave", "Calm", "Carefree", "Chagrin", "Cheerful", "Compassionate", "Confident",
    "Confused", "Contempt", "Content", "Cranky", "Craving", "Curious", "Defiant",
    "Delighted", "Depressed", "Despair", "Determined", "Devastated", "Disappointed",
    "Disdain", "Disgusted", "Disheartened", "Dread", "Eager", "Ebullient", "Ecstatic",
    "Elation", "Embarrassed", "Empathetic", "Enthusiastic", "Envious", "Euphoric",
    "Excited", "Exhausted", "Fearful", "Forlorn", "Frustrated", "Furious", "Glad",
    "Gloomy", "Grateful", "Grief", "Grumpy", "Guilty", "Gullible", "Happy",
    "Heartbroken", "Homesick", "Hopeful", "Hopeless", "Hostile", "Humiliated", "Hurt",
    "Impatient", "Indifferent", "Insecure", "Inspired", "Irritated", "Jealous", "Joyful",
    "Lonely", "Longing", "Loved", "Melancholy", "Mirthful", "Miserable", "Morose",
    "Motivated", "Nervous", "Nonchalant", "Nostalgic", "Numb", "Offended", "Optimistic",
    "Overwhelmed", "Panicked", "Peaceful", "Pensive", "Perplexed", "Proud", "Puzzled",
    "Rage", "Rapture", "Regretful", "Relaxed", "Relieved", "Remorse", "Resentment",
    "Restless", "Reverence", "Sad", "Sarcastic", "Satisfied", "Scared", "Sentimental",
    "Serene", "Shy", "Skeptical", "Smug", "Solemn", "Somber", "Spiteful", "Startled",
    "Stoic", "Stressed", "Sullen", "Surprised", "Suspicious", "Tense", "Terrified",
    "Thankful", "Thrilled", "Timid", "Tired", "Trepidation", "Triumphant", "Uneasy",
    "Upset", "Vulnerable", "Wary", "Weary", "Wistful", "Worried", "Yearning", "Zealous",
    "Zest",
  ],
  clothing: [
    "Anarkali", "Angavastram", "Apron", "Balaclava", "Bandana", "Bandhgala", "Beret",
    "Bindi", "Blazer", "Blouse", "Bodice", "Bolero", "Boots", "Bowtie", "Breeches",
    "Burqa", "Camisole", "Cape", "Capelet", "Cardigan", "Cassock", "Chaps", "Chunni",
    "Churidar", "Cloak", "Coat", "Cravat", "Culottes", "Cummerbund", "Dhoti", "Doublet",
    "Dress", "Dupatta", "Espadrilles", "Fedora", "Galoshes", "Gamcha", "Garter",
    "Gauntlet", "Ghagra", "Gloves", "Gown", "Hat", "Hijab", "Hoodie", "Jacket", "Jeans",
    "Jersey", "Jodhpurs", "Jumpsuit", "Jutti", "Kaftan", "Kediyu", "Kilt", "Kimono",
    "Kurta", "Leggings", "Lehenga", "Loafers", "Lungi", "Mittens", "Muffler", "Mundu",
    "Odhani", "Overalls", "Overcoat", "Pagdi", "Pajamas", "Pantaloons", "Pants", "Parka",
    "Patiala", "Peacoat", "Petticoat", "Pheran", "Pinafore", "Poncho", "Robe", "Romper",
    "Ruff", "Salwar", "Sandals", "Saree", "Sari", "Sash", "Scarf", "Shawl", "Sherwani",
    "Shirt", "Shorts", "Skirt", "Slippers", "Smock", "Socks", "Sombrero", "Stetson",
    "Stole", "Suit", "Suspenders", "Sweater", "Swimsuit", "Tie", "Tights", "Toga",
    "Topi", "Trousers", "Tunic", "Turtleneck", "Underwear", "Uniform", "Veshti", "Vest",
    "Waistcoat", "Wimple", "Windbreaker",
  ],
  household: [
    "Andiron", "Angeethi", "Armchair", "Basket", "Bed", "Belan", "Bellows", "Blanket",
    "Blender", "Bookshelf", "Bowl", "Broom", "Bucket", "Bureau", "Cabinet", "Calendar",
    "Candelabra", "Candle", "Carpet", "Cauldron", "Chair", "Chakla", "Chandelier",
    "Charpai", "Chest", "Chimta", "Chulha", "Cistern", "Clock", "Closet", "Couch",
    "Cradle", "Credenza", "Cup", "Cupboard", "Curtain", "Cushion", "Cutlery", "Dabba",
    "Decanter", "Degchi", "Desk", "Diya", "Doily", "Dresser", "Ewer", "Fan", "Footstool",
    "Fork", "Fridge", "Hammer", "Hourglass", "Hutch", "Icebox", "Kadhai", "Kettle",
    "Ladder", "Lamp", "Lantern", "Loom", "Lota", "Masaladabba", "Matka", "Mattress",
    "Microwave", "Mirror", "Mop", "Mortar", "Napkin", "Ottoman", "Oven", "Palang", "Pan",
    "Parat", "Pestle", "Pillow", "Plate", "Pot", "Rug", "Samovar", "Scale", "Sconce",
    "Shelf", "Sideboard", "Silbatta", "Sofa", "Spinningwheel", "Spoon", "Stool",
    "Strainer", "Table", "Tapestry", "Tawa", "Television", "Thali", "Thermometer",
    "Tiffin", "Tijori", "Toaster", "Towel", "Trunk", "Tureen", "Urn", "Uruli", "Vacuum",
    "Vase", "Wardrobe", "Washboard", "Whisk", "Windchime",
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
