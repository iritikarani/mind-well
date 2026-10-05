export type CategoryKey =
  | "fruits"
  | "vegetables"
  | "flowers"
  | "colors"
  | "animals"
  | "birds"
  | "countries"
  | "sports"
  | "household"
  | "bollywood";

export interface CategoryDef {
  key: CategoryKey;
  label: string;
  /** Singular noun form, for phrasing like "Name one <singular>". */
  singular: string;
  emoji: string;
}

export const CATEGORIES: CategoryDef[] = [
  { key: "fruits", label: "Fruits", singular: "fruit", emoji: "🍎" },
  { key: "vegetables", label: "Vegetables", singular: "vegetable", emoji: "🥕" },
  { key: "flowers", label: "Flowers", singular: "flower", emoji: "🌸" },
  { key: "colors", label: "Colors", singular: "color", emoji: "🎨" },
  { key: "animals", label: "Animals", singular: "animal", emoji: "🦁" },
  { key: "birds", label: "Birds", singular: "bird", emoji: "🐦" },
  { key: "countries", label: "Countries", singular: "country", emoji: "🌍" },
  { key: "sports", label: "Sports", singular: "sport", emoji: "⚽" },
  { key: "household", label: "Household Objects", singular: "household object", emoji: "🪑" },
  {
    key: "bollywood",
    label: "Bollywood Hits (2000–2025)",
    singular: "Bollywood hit (2000–2025)",
    emoji: "🎬",
  },
];

export function categoryByKey(key: string): CategoryDef {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];
}

export const LETTERS = "ABCDEFGHIKLMNOPRSTUW".split("");

export const WORDBANK: Record<CategoryKey, string[]> = {
  fruits: [
    "Ackee", "Akebi", "Alphonso", "Ambarella", "Apple", "Apricot", "Avocado", "Bael",
    "Banana", "Banganapalle", "Bergamot", "Bignay", "Bilimbi", "Blackberry",
    "Blackcurrant", "Blueberry", "Boysenberry", "Breadfruit", "Buddhashand", "Canistel",
    "Cantaloupe", "Capegooseberry", "Cashewapple", "Cempedak", "Ceylongooseberry",
    "Cherimoya", "Cherry", "Cloudberry", "Coconut", "Cranberry", "Cupuacu", "Currant",
    "Custardapple", "Damson", "Dasheri", "Date", "Dates", "Dewberry", "Dragonfruit",
    "Durian", "Elderberry", "Elephantapple", "Falsa", "Feijoa", "Fig", "Genipap",
    "Gojiberry", "Gooseberry", "Governorsplum", "Grape", "Grapefruit", "Grapes", "Guava",
    "Hackberry", "Himsagar", "Honeydew", "Ilama", "Indiangooseberry", "Indianjujube",
    "Jaboticaba", "Jackfruit", "Javaplum", "Jocote", "Jujube", "Karonda", "Kesar",
    "Khirni", "Kinnow", "Kiwano", "Kiwi", "Kokum", "Kumquat", "Langra", "Langsat",
    "Lemon", "Lime", "Lingonberry", "Longan", "Loquat", "Lychee", "Mamey", "Mandarin",
    "Mango", "Mangosteen", "Marula", "Medlar", "Melon", "Miraclefruit", "Mulberry",
    "Muskmelon", "Naranjilla", "Nectarine", "Olive", "Orange", "Palmfruit", "Papaya",
    "Passionfruit", "Pawpaw", "Peach", "Pear", "Pepino", "Persimmon", "Physalis",
    "Pineapple", "Pitaya", "Plum", "Pomegranate", "Pulasan", "Quince", "Rambutan",
    "Ramphal", "Raspberry", "Rawmango", "Redcurrant", "Salak", "Santol", "Sapota",
    "Seabuckthorn", "Sloe", "Soursop", "Starfruit", "Strawberry", "Surinamcherry",
    "Sweetlime", "Tamarillo", "Tamarind", "Tangerine", "Tayberry", "Ugli", "Velvetapple",
    "Waterchestnut", "Watermelon", "Whitesapote", "Wineberry", "Woodapple", "Yuzu",
    "Zapote", "Ziziphus",
  ],
  vegetables: [
    "Amaranth", "Amaranthleaves", "Arrowroot", "Artichoke", "Arugula", "Ashgourd",
    "Asparagus", "Bananaflower", "Bananastem", "Beet", "Beetroot", "Bellpepper",
    "Bittergourd", "Bokchoy", "Bottlegourd", "Brinjal", "Broadbeans", "Broccoli",
    "Brusselssprouts", "Cabbage", "Capsicum", "Carrot", "Cauliflower", "Celeriac",
    "Celery", "Chard", "Chayote", "Chicory", "Clusterbeans", "Collardgreens",
    "Colocasia", "Colocasialeaves", "Corianderleaves", "Corn", "Cucumber", "Curryleaves",
    "Daikon", "Dillleaves", "Drumstick", "Eggplant", "Elephantfootyam", "Endive",
    "Escarole", "Fennel", "Fenugreek", "Fenugreekleaves", "Fiddlehead", "Frenchbeans",
    "Galangal", "Garlic", "Ginger", "Greenchili", "Guar", "Horseradish", "Ivygourd",
    "Jicama", "Kale", "Kohlrabi", "Ladysfinger", "Leek", "Lemongrass", "Lettuce",
    "Lotusstem", "Mizuna", "Morel", "Moringa", "Mushroom", "Mustardgreens", "Nopales",
    "Okra", "Onion", "Parsnip", "Pea", "Peas", "Pepper", "Plantain", "Pointedgourd",
    "Potato", "Pumpkin", "Purslane", "Radicchio", "Radish", "Rampion", "Rawbanana",
    "Ridgegourd", "Rocket", "Rutabaga", "Salsify", "Samphire", "Scallion", "Shallot",
    "Snakegourd", "Sorrel", "Spinach", "Squash", "Swede", "Sweetpotato", "Taro",
    "Taroroot", "Tinda", "Tomato", "Turnip", "Wasabi", "Waterchestnut", "Watercress",
    "Wintermelon", "Yam", "Yardlongbean", "Zucchini",
  ],
  flowers: [
    "Alamanda", "Amaryllis", "Anemone", "Anthurium", "Aquilegia", "Ashoktreeflower",
    "Aster", "Azalea", "Balsam", "Begonia", "Bellflower", "Birdofparadise", "Bluebell",
    "Bougainvillea", "Buttercup", "Butterflypea", "Callalily", "Camellia", "Cannalily",
    "Carnation", "Cherryblossom", "Chrysanthemum", "Clematis", "Columbine", "Cornflower",
    "Cosmos", "Crocus", "Crossandra", "Cyclamen", "Daffodil", "Dahlia", "Daisy",
    "Delphinium", "Edelweiss", "Flameoftheforest", "Foxglove", "Foxtailorchid",
    "Frangipani", "Freesia", "Fritillaria", "Gardenia", "Gentian", "Geranium", "Gerbera",
    "Gladiolus", "Glorylily", "Goldenshower", "Gulmohar", "Heather", "Hellebore",
    "Hibiscus", "Hollyhock", "Hyacinth", "Hydrangea", "Impatiens", "Iris", "Ixora",
    "Jasmine", "Kachnar", "Kadamba", "Lantana", "Larkspur", "Lavender", "Lilac", "Lily",
    "Lotus", "Lupine", "Madhavilata", "Magnolia", "Marguerite", "Marigold", "Mimosa",
    "Moonflower", "Morningglory", "Nagkesar", "Nasturtium", "Nightjasmine", "Oleander",
    "Orchid", "Pansy", "Passionflower", "Peony", "Periwinkle", "Petunia", "Plumeria",
    "Poppy", "Primrose", "Protea", "Ragwort", "Rangooncreeper", "Ranunculus",
    "Rhododendron", "Rose", "Sakura", "Saxifrage", "Siroilily", "Snapdragon",
    "Starjasmine", "Sunflower", "Sweetpea", "Swordlily", "Tuberose", "Tulip", "Verbena",
    "Violet", "Wallflower", "Waterlily", "Wisteria", "Yarrow", "Zinnia",
  ],
  colors: [
    "Alizarin", "Amaranth", "Amber", "Aqua", "Aquamarine", "Auburn", "Azure", "Beige",
    "Bistre", "Black", "Blue", "Bottlegreen", "Bronze", "Brown", "Burgundy", "Cardinal",
    "Cerise", "Cerulean", "Champagne", "Charcoal", "Chartreuse", "Chestnut", "Chocolate",
    "Cobalt", "Copper", "Coral", "Cream", "Crimson", "Cyan", "Damask", "Ecru",
    "Eggshell", "Emerald", "Fawn", "Flax", "Fuchsia", "Glaucous", "Gold", "Gray",
    "Green", "Heliotrope", "Henna", "Indigo", "Ivory", "Jade", "Jasper", "Jonquil",
    "Khaki", "Lavender", "Lilac", "Lime", "Magenta", "Mahogany", "Malachite", "Maroon",
    "Mauve", "Mehendigreen", "Mint", "Mintgreen", "Mustard", "Mustardyellow", "Navy",
    "Ochre", "Olive", "Onyx", "Opal", "Orange", "Peach", "Peacockblue", "Periwinkle",
    "Persimmon", "Pewter", "Pink", "Plum", "Puce", "Purple", "Red", "Rose", "Rosegold",
    "Ruby", "Russet", "Rust", "Sable", "Saffron", "Salmon", "Sandalwood", "Sapphire",
    "Scarlet", "Seagreen", "Sepia", "Sienna", "Silver", "Slate", "Smoke", "Tan", "Taupe",
    "Teal", "Terracotta", "Turquoise", "Ultramarine", "Umber", "Vermilion", "Vermillion",
    "Violet", "Viridian", "White", "Wine", "Xanadu", "Yellow", "Zaffre",
  ],
  animals: [
    "Aardvark", "Aardwolf", "Addax", "Agouti", "Alligator", "Alpaca", "Anteater",
    "Antelope", "Aoudad", "Armadillo", "Asiaticlion", "Babirusa", "Badger", "Bandicoot",
    "Barasingha", "Bat", "Batearedfox", "Bear", "Beaver", "Bengaltiger", "Binturong",
    "Bison", "Blackbuck", "Bongo", "Buffalo", "Camel", "Capybara", "Caracal", "Caribou",
    "Chameleon", "Cheetah", "Chimpanzee", "Chinkara", "Chinkaragazelle", "Chipmunk",
    "Chital", "Civet", "Cobra", "Cougar", "Cow", "Coyote", "Crocodile", "Deer", "Dhole",
    "Dingo", "Dolphin", "Donkey", "Dugong", "Echidna", "Elephant", "Fennecfox", "Ferret",
    "Fishingcat", "Fossa", "Fox", "Gangesriverdolphin", "Gaur", "Gazelle", "Gecko",
    "Gemsbok", "Gerenuk", "Gharial", "Gibbon", "Giraffe", "Goat", "Gorilla",
    "Graylangur", "Hamster", "Hartebeest", "Hedgehog", "Himalayantahr", "Hippopotamus",
    "Horse", "Hyena", "Hyrax", "Iguana", "Impala", "Indiancobra", "Indianelephant",
    "Indianfox", "Indiangiantsquirrel", "Indianmongoose", "Indianpangolin",
    "Indianrhinoceros", "Indianstartortoise", "Indianwolf", "Indri", "Jackal",
    "Jackrabbit", "Jaguar", "Jerboa", "Kangaroo", "Kinkajou", "Koala", "Kudu", "Langur",
    "Lemur", "Leopard", "Lion", "Liontailedmacaque", "Lizard", "Llama", "Lynx",
    "Macaque", "Manatee", "Mandrill", "Margay", "Markhor", "Meerkat", "Mole", "Mongoose",
    "Monkey", "Moose", "Mouse", "Mule", "Muntjac", "Muskdeer", "Newt", "Nilgai",
    "Nilgiritahr", "Numbat", "Ocelot", "Okapi", "Onager", "Opossum", "Orangutan", "Oryx",
    "Otter", "Panda", "Pangolin", "Panther", "Peccary", "Pig", "Pika", "Platypus",
    "Polarbear", "Porcupine", "Puma", "Quokka", "Quoll", "Rabbit", "Raccoon", "Redpanda",
    "Reindeer", "Rhino", "Rhinoceros", "Salamander", "Sambar", "Sambardeer", "Scorpion",
    "Seal", "Sealion", "Serval", "Sheep", "Shrew", "Skunk", "Slenderloris", "Sloth",
    "Slothbear", "Snake", "Snowleopard", "Spider", "Spotteddeer", "Springbok",
    "Squirrel", "Stoat", "Stripedhyena", "Tamarin", "Tapir", "Tarsier", "Tenrec",
    "Tiger", "Toad", "Turtle", "Uakari", "Vicuna", "Vole", "Wallaby", "Walrus",
    "Warthog", "Waterbuck", "Weasel", "Wildass", "Wildboar", "Wildcat", "Wildebeest",
    "Wolf", "Wolverine", "Wombat", "Yak", "Zebra", "Zorilla",
  ],
  birds: [
    "Accentor", "Albatross", "Avocet", "Babbler", "Baldeagle", "Bayaweaver", "Beeeater",
    "Bittern", "Blackbird", "Blackheadedibis", "Blackkite", "Bluebird", "Bluejay",
    "Bowerbird", "Brahminykite", "Brambling", "Bulbul", "Bunting", "Bustard", "Canary",
    "Capercaillie", "Cardinal", "Cassowary", "Catbird", "Cattleegret", "Chaffinch",
    "Chicken", "Cockatiel", "Cockatoo", "Commonmyna", "Condor", "Coot",
    "Coppersmithbarbet", "Cormorant", "Crane", "Crow", "Cuckoo", "Curlew", "Darter",
    "Dodo", "Dove", "Drongo", "Duck", "Dunnock", "Eagle", "Egret", "Emu", "Falcon",
    "Fantail", "Finch", "Flamingo", "Fulmar", "Gannet", "Godwit", "Goldfinch", "Goose",
    "Greatindianbustard", "Grebe", "Grosbeak", "Guillemot", "Guineafowl", "Hawk",
    "Heron", "Himalayanmonal", "Hobby", "Honeyeater", "Hoopoe", "Housesparrow",
    "Hummingbird", "Ibis", "Indiangreyhornbill", "Indianpeacock", "Indianpitta",
    "Indianroller", "Indianvulture", "Jacamar", "Jacana", "Jackdaw", "Jay",
    "Junglebabbler", "Kakapo", "Kea", "Kestrel", "Kingfisher", "Kite", "Kittiwake",
    "Kiwi", "Kiwibird", "Koel", "Kookaburra", "Lapwing", "Lark", "Lorikeet", "Lovebird",
    "Lyrebird", "Macaw", "Magpie", "Merganser", "Merlin", "Mockingbird", "Motmot",
    "Munia", "Myna", "Nightingale", "Nightjar", "Nuthatch", "Orientalmagpierobin",
    "Oriole", "Ostrich", "Owl", "Paintedstork", "Paradiseflycatcher", "Parakeet",
    "Pariahkite", "Parrot", "Partridge", "Peacock", "Pelican", "Penguin",
    "Peregrinefalcon", "Petrel", "Phalarope", "Pheasant", "Pigeon", "Pipit", "Plover",
    "Pratincole", "Ptarmigan", "Puffin", "Purplesunbird", "Quail", "Quetzal", "Raven",
    "Redstart", "Redventedbulbul", "Roadrunner", "Robin", "Rooster",
    "Roseringedparakeet", "Sanderling", "Sandpiper", "Saruscrane", "Seagull",
    "Secretarybird", "Shearwater", "Shoveler", "Shrike", "Siskin", "Skimmer", "Skua",
    "Skylark", "Snipe", "Sparrow", "Spoonbill", "Spottedowlet", "Starling", "Stork",
    "Sunbird", "Swallow", "Swan", "Swift", "Tailorbird", "Tanager", "Teal", "Tern",
    "Thrush", "Tit", "Toucan", "Treecreeper", "Trogon", "Turkey", "Turnstone", "Vulture",
    "Wagtail", "Warbler", "Waxwing", "Weaverbird", "Whimbrel", "Whitethroatedkingfisher",
    "Wigeon", "Woodcock", "Woodpecker", "Wren",
  ],
  countries: [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo",
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Czechia", "Denmark",
    "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
    "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
    "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
    "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
    "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
    "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
    "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
    "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
    "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
    "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "UAE",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
    "Zambia", "Zimbabwe",
  ],
  sports: [
    "Aikido", "Americanfootball", "Archery", "Athletics", "Badminton", "Baseball",
    "Basketball", "Biathlon", "Billiards", "Bobsled", "Bobsleigh", "Bocce", "Bowling",
    "Boxing", "Bullfighting", "Canoeing", "Carrom", "Chess", "Climbing", "Cricket",
    "Croquet", "Curling", "Cycling", "Darts", "Diving", "Dressage", "Falconry",
    "Fencing", "Fieldhockey", "Fives", "Football", "Formula1", "Gillidanda", "Golf",
    "Gymkhana", "Gymnastics", "Handball", "Hanggliding", "Hockey", "Hurling",
    "Icehockey", "Jaialai", "Jousting", "Judo", "Kabaddi", "Kalaripayattu", "Karate",
    "Kayaking", "Kendo", "Khokho", "Kiteflying", "Kitesurfing", "Lacrosse", "Luge",
    "Mallakhamb", "Marathon", "Modernpentathlon", "Motorracing", "Netball",
    "Orienteering", "Padel", "Parkour", "Pehlwani", "Petanque", "Polo", "Powerlifting",
    "Racewalking", "Racquetball", "Rappelling", "Rodeo", "Rollerskating", "Rowing",
    "Rugby", "Sailing", "Sambo", "Scubadiving", "Sepaktakraw", "Shinty", "Shooting",
    "Silambam", "Skateboarding", "Skiing", "Skijoring", "Sledding", "Snooker",
    "Snowboarding", "Soccer", "Softball", "Squash", "Sumo", "Sumowrestling", "Surfing",
    "Swimming", "Tabletennis", "Taekwondo", "Tennis", "Tobogganing", "Trekking",
    "Triathlon", "Vaulting", "Volleyball", "Waterpolo", "Weightlifting", "Windsurfing",
    "Wrestling", "Yachting", "Yoga",
  ],
  // Hindi-language commercial hits released 2000-2025 only — no Hollywood,
  // no other-language Indian cinema, and nothing older, since the category
  // promises a specific window and "Bollywood" specifically.
  bollywood: [
    "Aankhen", "Aashiqui2", "Abcd2", "Actionreplayy", "Aedilhaimushkil", "Agneepath",
    "Airlift", "Aitraaz", "Ajabpremkighazabkahani", "Ajnabee", "Amarsinghchamkila",
    "Andaaz", "Andhadhun", "Angrezimedium", "Animal", "Anjaanaanjaani", "Article15",
    "Article370", "Asoka", "Astitva", "Attack", "Awarapaagaldeewana", "Awednesday",
    "Baaghi", "Baaghi2", "Badhaaiho", "Badlapur", "Bajiraomastani", "Bajrangibhaijaan",
    "Bangbang", "Barfi", "Bellbottom", "Bhaagmilkhabhaag", "Bharat", "Bholaa",
    "Bhoolbhulaiyaa", "Bhoolbhulaiyaa2", "Bodyguard", "Brahmastrapartone",
    "Buntyaurbabli", "Chakdeindia", "Chandigarhkareaashiqui", "Chennaiexpress",
    "Chhaava", "Chhichhore", "Cocktail", "Coolieno1", "Crew", "Dabangg", "Dangal",
    "Delhibelly", "Devdas", "Dhadak", "Dhoom", "Dhoom2", "Dhoom3", "Dilbechara",
    "Dilwale", "Don", "Don2", "Dostana", "Drishyam", "Drishyam2", "Dunki", "Ekthatiger",
    "Ekvillain", "Englishvinglish", "Fan", "Fanaa", "Fashion", "Fighter", "Force",
    "Force2", "Fukrey", "Fukrey3", "Gadar", "Gadar2", "Gangubaikathiawadi", "Golmaal",
    "Golmaal3", "Golmaalagain", "Golmaalreturns", "Goodnewwz", "Gullyboy", "Haider",
    "Halfgirlfriend", "Happynewyear", "Herapheri", "Highway", "Housefull",
    "Housefull2", "Housefull4", "Housefull5", "Humtum", "Ishqiya", "Ittefaq",
    "Kabirsingh", "Kahaani", "Kalhonaaho", "Kaminey", "Kapoorandsons", "Kesari",
    "Khoobsurat", "Kick", "Kill", "Koimilgaya", "Krrish", "Krrish3", "Laalsinghchaddha",
    "Laapataaladies", "Lagaan", "Lootera", "Loveaajkal", "Luckbychance", "Ludo",
    "Maidaan", "Manmarziyaan", "Mardaani", "Marjaavaan", "Marykom", "Masaan", "Masti",
    "Mimi", "Missionmangal", "Mohabbatein", "Munjya", "Munnabhaimbbs", "Mynameiskhan",
    "Neerja", "Newton", "Nh10", "Noentry", "Omg2", "Omkara", "Omshantiom", "Padmaavat",
    "Padman", "Pathaan", "Piku", "Pink", "PK", "Raabta", "Raajneeti", "Raazi", "Race",
    "Race2", "Race3", "Raid", "Raid2", "Rangdebasanti", "Rockstar", "Rowdyrathore",
    "Runway34", "Rustom", "Saiyaara", "Sanju", "Satyapremkikatha", "Secretsuperstar",
    "Shamshera", "Sherni", "Shershaah", "Shubhmangalsaavdhan", "Simmba", "Singham",
    "Singhamagain", "Singhamreturns", "Sonuketitukisweety", "Sooryavanshi",
    "Special26", "Stree", "Stree2", "Studentoftheyear", "Sultan", "Super30", "Swades",
    "Talvar", "Tamasha", "Tanuwedsmanureturns", "Thappad", "Thekashmirfiles",
    "Thugsofhindostan", "Tigerzindahai", "Toofaan", "Totaldhamaal", "Udaan",
    "Udtapunjab", "Uri", "Wakeupsid", "War", "War2", "Welcome",
  ],
  household: [
    "Almirah", "Andiron", "Angeethi", "Armchair", "Basket", "Beanbag", "Bed", "Belan",
    "Belanchakla", "Bellows", "Blanket", "Blender", "Bookshelf", "Bowl", "Broom",
    "Bucket", "Bureau", "Cabinet", "Calendar", "Candelabra", "Candle", "Carpet",
    "Cauldron", "Ceilinglight", "Chair", "Chakla", "Chandelier", "Charpai", "Chatai",
    "Chest", "Chimta", "Cistern", "Clock", "Closet", "Couch", "Cradle", "Credenza",
    "Cup", "Cupboard", "Curtain", "Curtains", "Cushion", "Cutlery", "Dabba", "Decanter",
    "Degchi", "Desk", "Diningtable", "Diya", "Doily", "Dresser", "Ewer", "Fan",
    "Footstool", "Fork", "Fridge", "Hammer", "Hourglass", "Hutch", "Icebox", "Kadhai",
    "Kettle", "Ladder", "Lamp", "Lantern", "Loom", "Lota", "Masaladabba", "Matka",
    "Mattress", "Microwave", "Mirror", "Mixergrinder", "Mop", "Mortar", "Mug", "Napkin",
    "Ottoman", "Oven", "Palang", "Pan", "Parat", "Pestle", "Pillow", "Plate", "Pot",
    "Pressurecooker", "Pujathali", "Rangolitray", "Refrigerator", "Rockingchair", "Rug",
    "Samovar", "Scale", "Sconce", "Shelf", "Sideboard", "Silbatta", "Sofa",
    "Spinningwheel", "Spoon", "Stool", "Stove", "Strainer", "Table", "Tapestry", "Tawa",
    "Television", "Thali", "Thermometer", "Tiffin", "Tijori", "Toaster", "Towel",
    "Trunk", "Tureen", "Urn", "Uruli", "Vacuum", "Vacuumcleaner", "Vase", "Wardrobe",
    "Washboard", "Washingmachine", "Waterfilter", "Whisk", "Windchime",
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

// Every combination asks for exactly one answer, no matter how many words match.
export function tierFor(category: CategoryKey, letter: string): TierInfo {
  const matches = wordsFor(category, letter);
  const matchCount = matches.length;

  if (matchCount === 0) return { tier: "none", matchCount, required: 0 };
  return { tier: "rare", matchCount, required: 1 };
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

function wordMatches(reference: string, input: string): boolean {
  if (reference === input) return true;

  const refTokens = reference.split(" ");
  if (refTokens.length > 1) {
    // Multi-word answers (mostly country names) get a strict 1-edit-per-word
    // budget — a wider one is enough for a real name to drift into a
    // different one (e.g. "South America" sits only 2 edits from
    // "South Africa"), which would wrongly credit a different answer.
    const inputTokens = input.split(" ");
    if (refTokens.length === inputTokens.length) {
      return refTokens.every((t, i) => levenshtein(t, inputTokens[i]) <= 1);
    }
    // Token counts differ — most commonly a dropped space (e.g. "SouthAfrica").
    // Still allow exactly one edit against the space-free forms.
    return levenshtein(refTokens.join(""), input.replace(/ /g, "")) <= 1;
  }

  // A single-word answer can afford a slightly wider budget: common typos
  // like a misplaced double letter ("Brocolli" for "Broccoli") are 2 edits
  // apart but pose no real risk of drifting into an unrelated word.
  const maxDistance = reference.length <= 4 ? 1 : 2;
  return levenshtein(reference, input) <= maxDistance;
}

export function isValidAnswer(category: CategoryKey, letter: string, answer: string): boolean {
  const normalized = answer.trim().toLowerCase();
  if (!normalized) return false;

  return wordsFor(category, letter).some((w) => wordMatches(w.toLowerCase(), normalized));
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
  if (totalPossible === 0) return "You made it through all 5 rounds — that's the whole game.";
  const ratio = totalCorrect / totalPossible;

  if (ratio >= 0.75) {
    return "Your mind moves quickly when you let it. That was a strong, connected session.";
  }
  if (ratio >= 0.4) {
    return "You found real connections out there, one thread at a time.";
  }
  return "Some rounds are just harder combos — you kept going anyway, and that's what counts.";
}
