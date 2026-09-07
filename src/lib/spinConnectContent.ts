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
    "Ackee", "Akebi", "Alphonso", "Ambarella", "Amla", "Apple", "Apricot", "Avocado",
    "Bael", "Banana", "Banganapalle", "Ber", "Bergamot", "Bignay", "Bilimbi",
    "Blackberry", "Blackcurrant", "Blueberry", "Boysenberry", "Breadfruit",
    "Buddhashand", "Canistel", "Cantaloupe", "Capegooseberry", "Cashewapple", "Cempedak",
    "Ceylongooseberry", "Cherimoya", "Cherry", "Chikoo", "Cloudberry", "Coconut",
    "Cranberry", "Cupuacu", "Currant", "Custardapple", "Damson", "Dasheri", "Date",
    "Dates", "Dewberry", "Dragonfruit", "Durian", "Elderberry", "Elephantapple", "Falsa",
    "Feijoa", "Fig", "Genipap", "Gojiberry", "Gooseberry", "Governorsplum", "Grape",
    "Grapefruit", "Grapes", "Guava", "Hackberry", "Himsagar", "Honeydew", "Ilama",
    "Indiangooseberry", "Indianjujube", "Jaboticaba", "Jackfruit", "Jamun", "Javaplum",
    "Jocote", "Jujube", "Kairi", "Karonda", "Kesar", "Khirni", "Kinnow", "Kiwano",
    "Kiwi", "Kokum", "Kumquat", "Langra", "Langsat", "Lemon", "Lime", "Lingonberry",
    "Longan", "Loquat", "Lychee", "Mamey", "Mandarin", "Mango", "Mangosteen", "Marula",
    "Medlar", "Melon", "Miraclefruit", "Mosambi", "Mulberry", "Muskmelon", "Naranjilla",
    "Nectarine", "Olive", "Orange", "Palmfruit", "Papaya", "Passionfruit", "Pawpaw",
    "Peach", "Pear", "Pepino", "Persimmon", "Phalsa", "Physalis", "Pineapple", "Pitaya",
    "Plum", "Pomegranate", "Pulasan", "Quince", "Rambutan", "Ramphal", "Rasbhari",
    "Raspberry", "Rawmango", "Redcurrant", "Salak", "Santol", "Sapota", "Seabuckthorn",
    "Shahtoot", "Singhara", "Sitaphal", "Sloe", "Soursop", "Starfruit", "Strawberry",
    "Surinamcherry", "Sweetlime", "Tadgola", "Tamarillo", "Tamarind", "Tangerine",
    "Tayberry", "Ugli", "Velvetapple", "Waterchestnut", "Watermelon", "Whitesapote",
    "Wineberry", "Woodapple", "Yuzu", "Zapote", "Ziziphus",
  ],
  vegetables: [
    "Amaranth", "Amaranthleaves", "Arbi", "Arrowroot", "Artichoke", "Arugula",
    "Ashgourd", "Asparagus", "Baingan", "Bananaflower", "Bananastem", "Beet", "Beetroot",
    "Bellpepper", "Bhindi", "Bittergourd", "Bokchoy", "Bottlegourd", "Brinjal",
    "Broadbeans", "Broccoli", "Brusselssprouts", "Cabbage", "Capsicum", "Carrot",
    "Cauliflower", "Celeriac", "Celery", "Chard", "Chaulai", "Chayote", "Chicory",
    "Chukandar", "Clusterbeans", "Collardgreens", "Colocasia", "Colocasialeaves",
    "Corianderleaves", "Corn", "Cucumber", "Curryleaves", "Daikon", "Dhaniya",
    "Dillleaves", "Drumstick", "Dudhi", "Eggplant", "Elephantfootyam", "Endive",
    "Escarole", "Fansi", "Fennel", "Fenugreek", "Fenugreekleaves", "Fiddlehead",
    "Frenchbeans", "Galangal", "Garlic", "Gawar", "Ginger", "Greenchili", "Guar",
    "Hathichak", "Horseradish", "Ivygourd", "Jicama", "Kacchakela", "Kaddu", "Kale",
    "Karela", "Kohlrabi", "Kundru", "Ladysfinger", "Lauki", "Leek", "Lemongrass",
    "Lettuce", "Lotusstem", "Methi", "Mizuna", "Mooli", "Morel", "Moringa", "Mushroom",
    "Mustardgreens", "Nopales", "Okra", "Onion", "Palak", "Papdi", "Parsnip", "Parwal",
    "Patra", "Pea", "Peas", "Pepper", "Petha", "Plantain", "Pointedgourd", "Potato",
    "Pumpkin", "Purslane", "Radicchio", "Radish", "Rampion", "Rawbanana", "Ridgegourd",
    "Rocket", "Rutabaga", "Sahjan", "Salsify", "Samphire", "Sarson", "Scallion",
    "Shalgam", "Shallot", "Snakegourd", "Sorrel", "Soya", "Spinach", "Squash", "Suran",
    "Suva", "Swede", "Sweetpotato", "Taro", "Taroroot", "Tinda", "Tindora", "Tomato",
    "Turai", "Turnip", "Vaal", "Wasabi", "Waterchestnut", "Watercress", "Wintermelon",
    "Yam", "Yardlongbean", "Zucchini",
  ],
  flowers: [
    "Alamanda", "Amaltas", "Amaryllis", "Anemone", "Anthurium", "Aparajita", "Aquilegia",
    "Ashoktreeflower", "Aster", "Azalea", "Balsam", "Begonia", "Bellflower",
    "Birdofparadise", "Bluebell", "Bougainvillea", "Buttercup", "Butterflypea",
    "Callalily", "Camellia", "Cannalily", "Carnation", "Chameli", "Champa", "Champak",
    "Cherryblossom", "Chrysanthemum", "Clematis", "Columbine", "Cornflower", "Cosmos",
    "Crocus", "Crossandra", "Cyclamen", "Daffodil", "Dahlia", "Daisy", "Delphinium",
    "Edelweiss", "Flameoftheforest", "Foxglove", "Foxtailorchid", "Frangipani",
    "Freesia", "Fritillaria", "Gardenia", "Genda", "Gentian", "Geranium", "Gerbera",
    "Gladiolus", "Glorylily", "Goldenshower", "Gudhal", "Gulab", "Guldaudi",
    "Gulmehendi", "Gulmohar", "Harsingar", "Heather", "Hellebore", "Hibiscus",
    "Hollyhock", "Hyacinth", "Hydrangea", "Impatiens", "Iris", "Ixora", "Jasmine",
    "Kachnar", "Kadamba", "Kagazkaphool", "Kamal", "Kamlini", "Kanakambaram", "Kaner",
    "Konna", "Kund", "Lantana", "Larkspur", "Lavender", "Lilac", "Lily", "Lotus",
    "Lupine", "Madhavilata", "Magnolia", "Mallige", "Marguerite", "Marigold", "Mimosa",
    "Mogra", "Moonflower", "Morningglory", "Nagkesar", "Nargis", "Nasturtium",
    "Nightjasmine", "Oleander", "Orchid", "Palash", "Pansy", "Parijat", "Passionflower",
    "Peony", "Periwinkle", "Petunia", "Plumeria", "Poppy", "Primrose", "Protea",
    "Ragwort", "Rajnigandha", "Rangooncreeper", "Ranunculus", "Rhododendron", "Rose",
    "Sakura", "Saxifrage", "Siroilily", "Snapdragon", "Starjasmine", "Sunflower",
    "Sweetpea", "Swordlily", "Tuberose", "Tulip", "Verbena", "Violet", "Wallflower",
    "Waterlily", "Wisteria", "Yarrow", "Zinnia",
  ],
  colors: [
    "Alizarin", "Amaranth", "Amber", "Aqua", "Aquamarine", "Auburn", "Azure", "Basanti",
    "Beige", "Bistre", "Black", "Blue", "Bottlegreen", "Bronze", "Brown", "Burgundy",
    "Cardinal", "Cerise", "Cerulean", "Champagne", "Charcoal", "Chartreuse", "Chestnut",
    "Chocolate", "Cobalt", "Copper", "Coral", "Cream", "Crimson", "Cyan", "Damask",
    "Ecru", "Eggshell", "Emerald", "Fawn", "Flax", "Fuchsia", "Glaucous", "Gold", "Gray",
    "Green", "Gulabi", "Heliotrope", "Henna", "Indigo", "Ivory", "Jade", "Jasper",
    "Jonquil", "Kesari", "Khaki", "Lavender", "Lilac", "Lime", "Magenta", "Mahogany",
    "Malachite", "Maroon", "Mauve", "Mehendi", "Mehendigreen", "Mint", "Mintgreen",
    "Morpankhi", "Mustard", "Mustardyellow", "Navy", "Ochre", "Olive", "Onyx", "Opal",
    "Orange", "Peach", "Peacockblue", "Periwinkle", "Persimmon", "Pewter", "Pink",
    "Plum", "Puce", "Purple", "Red", "Rose", "Rosegold", "Ruby", "Russet", "Rust",
    "Sable", "Saffron", "Salmon", "Sandalwood", "Sapphire", "Scarlet", "Seagreen",
    "Sepia", "Sienna", "Silver", "Sindoorred", "Slate", "Smoke", "Tan", "Taupe", "Teal",
    "Terracotta", "Turquoise", "Ultramarine", "Umber", "Vermilion", "Vermillion",
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
    "Munia", "Myna", "Neelkanth", "Nightingale", "Nightjar", "Nuthatch",
    "Orientalmagpierobin", "Oriole", "Ostrich", "Owl", "Paintedstork",
    "Paradiseflycatcher", "Parakeet", "Pariahkite", "Parrot", "Partridge", "Peacock",
    "Pelican", "Penguin", "Peregrinefalcon", "Petrel", "Phalarope", "Pheasant", "Pigeon",
    "Pipit", "Plover", "Pratincole", "Ptarmigan", "Puffin", "Purplesunbird", "Quail",
    "Quetzal", "Raven", "Redstart", "Redventedbulbul", "Roadrunner", "Robin", "Rooster",
    "Roseringedparakeet", "Sanderling", "Sandpiper", "Saruscrane", "Seagull",
    "Secretarybird", "Shearwater", "Shoveler", "Shrike", "Siskin", "Skimmer", "Skua",
    "Skylark", "Snipe", "Sparrow", "Spoonbill", "Spottedowlet", "Starling", "Stork",
    "Sunbird", "Swallow", "Swan", "Swift", "Tailorbird", "Tanager", "Teal", "Tern",
    "Thrush", "Tit", "Titeehri", "Toucan", "Treecreeper", "Trogon", "Turkey",
    "Turnstone", "Vulture", "Wagtail", "Warbler", "Waxwing", "Weaverbird", "Whimbrel",
    "Whitethroatedkingfisher", "Wigeon", "Woodcock", "Woodpecker", "Wren",
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
    "Kayaking", "Kendo", "Khokho", "Kiteflying", "Kitesurfing", "Kushti", "Lacrosse",
    "Luge", "Mallakhamb", "Marathon", "Modernpentathlon", "Motorracing", "Netball",
    "Orienteering", "Padel", "Parkour", "Patang", "Pehlwani", "Petanque", "Polo",
    "Powerlifting", "Racewalking", "Racquetball", "Rappelling", "Rodeo", "Rollerskating",
    "Rowing", "Rugby", "Sailing", "Sambo", "Scubadiving", "Sepaktakraw", "Shinty",
    "Shooting", "Silambam", "Skateboarding", "Skiing", "Skijoring", "Sledding",
    "Snooker", "Snowboarding", "Soccer", "Softball", "Squash", "Sumo", "Sumowrestling",
    "Surfing", "Swimming", "Tabletennis", "Taekwondo", "Tennis", "Tobogganing",
    "Trekking", "Triathlon", "Vaulting", "Volleyball", "Waterpolo", "Weightlifting",
    "Windsurfing", "Wrestling", "Yachting", "Yoga",
  ],
  movies: [
    "Aabrakadaabra", "Aadmi", "Aajanachle", "Aajkaarjun", "Aandhi", "Aankhen", "Aashiq",
    "Aashiqui", "Aashiqui2", "Aatish", "Abcd2", "Actionreplayy", "Aedilhaimushkil",
    "Agneepath", "Agnisakshi", "Airlift", "Aitraaz", "Ajabpremkighazabkahani", "Ajnabee",
    "Ajooba", "Akvsak", "Aladdin", "Alavaikunthapurramuloo", "Alien", "Allthebest",
    "Amaanat", "Amadeus", "Amar", "Amaran", "Amarsinghchamkila", "Amelie",
    "Amoresperros", "Anand", "Anari", "Andaaz", "Andaz", "Andazapnaapna", "Andhadhun",
    "Andolan", "Angrezimedium", "Animal", "Anjaanaanjaani", "Antimnyay", "Arjunreddy",
    "Army", "Article15", "Article370", "Asoka", "Astitva", "Athadu", "Attack",
    "Auntyno1", "Auzaar", "Avatar", "Avengersendgame", "Awaara", "Awarapaagaldeewana",
    "Awednesday", "Baadshah", "Baaghi", "Baaghi2", "Baahubali",
    "Baahubali2theconclusion", "Baahubalithebeginning", "Baapnumbribetadusnumbri",
    "Baazigar", "Babe", "Baby", "Badal", "Bademiyanchotemiyan", "Badhaaiho", "Badlapur",
    "Baghban", "Bajiraomastani", "Bajrangibhaijaan", "Bandbaajabaaraat", "Bangbang",
    "Bareillykibarfi", "Barfi", "Barood", "Barsaat", "Batman", "Bellbottom", "Beta",
    "Bhaagmilkhabhaag", "Bharat", "Bharatanenenu", "Bholaa", "Bhoolbhulaiyaa",
    "Bhoolbhulaiyaa2", "Bhoolbhulaiyaa3", "Bhoot", "Biwino1", "Black", "Blue",
    "Bluffmaster", "Bobbyjasoos", "Bodyguard", "Bolradhabol", "Bombay", "Border",
    "Brahmastrapartone", "Braveheart", "Brazil", "Buntyaurbabli", "Casablanca",
    "Chaahat", "Chakdeindia", "Chalmerebhai", "Chaltechalte", "Chandigarhkareaashiqui",
    "Chandni", "Chanduchampion", "Cheenikum", "Chennaiexpress", "Chhaava", "Chhalaang",
    "Chhichhore", "Chillarparty", "Chinagate", "Chocolate", "Chorichorichupkechupke",
    "Cinderella", "Cinemaparadiso", "Cirkus", "Cityofgod", "Classof83", "Cocktail",
    "Coco", "Company", "Coolie", "Coolieno1", "Corporate", "Crew",
    "Crouchingtigerhiddendragon", "D", "Daag", "Dabangg", "Damini", "Dangal", "Daraar",
    "Darnamanahai", "Darr", "Dday", "Dearzindagi", "Dedanadan", "Deewana", "Deewangee",
    "Delhibelly", "Delicatessen", "Detectivebyomkeshbakshy", "Devarapart1", "Devd",
    "Devdas", "Dhadak", "Dhadkan", "Dhoom", "Dhoom2", "Dhoom3", "Dhurandhar", "Dil",
    "Dilaashnahai", "Dilbechara", "Dilchahtahai", "Dilhaibetaab", "Dilhaikemantanahin",
    "Dilhaitumhaara", "Diljale", "Dilkyakare", "Dillagi", "Diltopagalhai", "Dilwale",
    "Dilwaledulhanialejayenge", "Diyaaurtoofan", "Doctorg", "Don", "Don2", "Dostana",
    "Drishyam", "Drishyam2", "Dulheraja", "Dune", "Dunki", "Duplicate", "Dushmanzamana",
    "Eega", "Ekladkaekladki", "Eklavya", "Ekthatiger", "Ekvillain", "Elf", "Encanto",
    "Englishbabudesimem", "Englishvinglish", "Enthiran", "Fan", "Fanaa", "Fargo",
    "Fashion", "Fida", "Fighter", "Findingfanny", "Fiza", "Force", "Force2",
    "Forrestgump", "Frozen", "Fukrey", "Fukrey3", "Gadar", "Gadar2", "Gadarekpremkatha",
    "Gaddaar", "Gangsofwasseypur", "Gangubai", "Gangubaikathiawadi", "Garammasala",
    "Ghajini", "Gharhotoaisa", "Ghatak", "Ghayal", "Ghost", "Ghulam", "Gladiator",
    "Godfather", "Godmother", "Gold", "Goliyonkiraasleelaramleela", "Golmaal",
    "Golmaal3", "Golmaalagain", "Golmaalreturns", "Goodnewwz", "Grandmasti", "Gravity",
    "Grease", "Guddu", "Guide", "Gulabositabo", "Gullyboy", "Gumrah", "Gupt", "Guru",
    "Guzaarish", "Haider", "Hairspray", "Halfgirlfriend", "Happynewyear",
    "Haseenamaanjaayegi", "Hellobrother", "Henna", "Herapheri", "Hercules", "Highway",
    "Hindimedium", "Hindustani", "Holiday", "Housefull", "Housefull2", "Housefull4",
    "Housefull5", "Hum", "Humaapkehainkoun", "Humdildechukesanam",
    "Humptysharmakidulhania", "Humraaz", "Humsaathsaathhain", "Humsenatakrana", "Humtum",
    "I", "Ikiru", "Inception", "Indian", "Indrajeet", "Interstellar", "Iqbal", "Ishq",
    "Ishqiya", "Ishqvishk", "Iskitopiuskesarr", "Ittefaq", "Jaanetuyajaanena", "Jaanwar",
    "Jaat", "Jabharrymetsejal", "Jabpyarkisisehotahai", "Jabtakhaijaan", "Jabwemet",
    "Jaibhim", "Jailer", "Jaivikraanta", "Jannat", "Jawan", "Jaws", "Jersey", "Jism",
    "Jodhaaakbar", "Jojeetawohisikandar", "Joker", "Josh", "Judaai", "Judwaa2", "Jungle",
    "Juno", "Junoon", "Jurassic", "Jurm", "Kaal", "Kaala", "Kaante",
    "Kabhialvidanaakehna", "Kabhikhushikabhiegham", "Kabirsingh", "Kachchedhaage",
    "Kahaani", "Kahonaapyaarhai", "Kaipoche", "Kalhonaaho", "Kalki2898ad", "Kalyug",
    "Kambakkhtishq", "Kaminey", "Kanguva", "Kantara", "Kapoorandsons", "Karanarjun",
    "Kartikeya2", "Karz", "Kaththi", "Kesari", "Kesarichapter2", "Kgf", "Kgfchapter1",
    "Kgfchapter2", "Khalnayak", "Khamoshithemusical", "Khiladi", "Khoobsurat",
    "Khoonkakarz", "Khushi", "Kick", "Kill", "Kishenkanhaiya", "Kisikabhaikisikijaan",
    "Koimilgaya", "Koyla", "Kranti", "Krantiveer", "Krishnacottage", "Kroadh", "Krrish",
    "Krrish3", "Kuchkuchhotahai", "Kunwara", "Kurukshetra", "Kyakehna",
    "Kyayehipyaarhai", "Laadla", "Laalsinghchaddha", "Laapataaladies", "Lagaan",
    "Lagerahomunnabhai", "Lakshya", "Lalaland", "Lamhe", "Leo", "Lifeinametro",
    "Lifeisbeautiful", "Loafer", "Lockargil", "Lootera", "Loveaajkal", "Luckbychance",
    "Ludo", "Maachis", "Magadheera", "Mahasangram", "Maidaan", "Mainepyaarkyunkiya",
    "Mainhoonna", "Majorsaab", "Manmarziyaan", "Mardaani", "Marjaavaan", "Marykom",
    "Masaan", "Master", "Masti", "Matrix", "Mausam", "Meenaxi", "Meripyaaribindu",
    "Merrychristmas", "Metro", "Metroindino", "Metropolis", "Mimi", "Missionmajnu",
    "Missionmangal", "Moana", "Mohabbat", "Mohabbatein", "Mohra", "Mom", "Motherindia",
    "Mrazaad", "Mrityudand", "Msdhonitheuntoldstory", "Mughaleazam", "Munjya",
    "Munnabhaimbbs", "Murder", "Murder2", "Muskurahat", "Muthu", "Mynameiskhan",
    "Namasteylondon", "Narsimha", "Natumjaanonahum", "Nayak", "Neerja", "Newton",
    "Newyork", "Nh10", "Noentry", "Noonekilledjessica", "Noproblem", "Nosferatu",
    "Notorious", "October", "Oldboy", "OMG", "Omg2", "Omgohmygod", "Omkara",
    "Omshantiom", "Onceuponatimeinmumbaai", "One2ka4", "Paa", "Padmaavat", "Padman",
    "Page3", "Panipat", "Panslabyrinth", "Parasite", "Pardes", "Parineeta", "Parmanu",
    "Partner", "Pathaan", "Patharkeinsan", "Patherpanchali", "Peeplilive", "Persona",
    "Phirherapheri", "Phoolaurkaante", "Piku", "Pink", "PK", "Ponniyinselvani",
    "Ponniyinselvanii", "Posterboys", "Pratikar", "Premgranth", "Premratandhanpayo",
    "Premyog", "Pukar", "Pushpa", "Pushpa2therule", "Pushpatherise",
    "Pyaarkiyatodarnakya", "Qayamat", "Queen", "Raabta", "Raajneeti", "Raanjhanaa",
    "Raaz", "Raazi", "Rabnebanadijodi", "Race", "Race2", "Race3", "Rahul", "Raid",
    "Raid2", "Raja", "Rajababu", "Rajahindustani", "Rakshabandhan", "Rambo", "Ramjaane",
    "Ran", "Rang", "Rangasthalam", "Rangdebasanti", "Rangeela", "Rascals",
    "Rashmirocket", "Rashomon", "Ratatouille", "Ready", "Rearwindow", "Refugee", "Rio",
    "Rockon", "Rockstar", "Rocky", "Rockyaurranikiipremkahaani", "Roja", "Roma",
    "Roopkiranichoronkaraja", "Rowdyrathore", "Rrr", "Rudraksh", "Runway34", "Rustom",
    "Saathiya", "Sadak", "Sailaab", "Sainik", "Saiyaara", "Salaakhen", "Salaamnamaste",
    "Salaarpart1ceasefire", "Sambahadur", "Sangharsh", "Sanju", "Sapnesajanke", "Sapoot",
    "Sardarudham", "Sarfarosh", "Sarkar", "Sarkarraj", "Sarkaruvaaripaata", "Satya",
    "Satyapremkikatha", "Saudagar", "Secretsuperstar", "Selfiee", "Shahid", "Shaitaan",
    "Shakuntaladevi", "Shamshera", "Sherni", "Shershaah", "Shivaay", "Sholay", "Shrek",
    "Shubhmangalsaavdhan", "Sikandar", "Simmba", "Singham", "Singhamagain",
    "Singhamreturns", "Singhiskinng", "Sir", "Sitarezameenpar", "Sivajitheboss",
    "Skyforce", "Solaris", "Soldier", "Sonofsardaar2", "Sonuketitukisweety",
    "Sooryavanshi", "Special26", "Spiritedaway", "Split", "Srikanth", "Stalker", "Stree",
    "Stree2", "Studentoftheyear", "Suhaag", "Sultan", "Super30", "Sur", "Swades",
    "Swarg", "Syeraanarasimhareddy", "Taal", "Taarezameenpar", "Tahalka", "Talaash",
    "Talvar", "Tamasha", "Tangled", "Tanhajitheunsungwarrior", "Tanuwedsmanureturns",
    "Tarazu", "Taxino9211", "Ted", "Teesmaarkhan", "Temper", "Teremeresapne", "Terenaam",
    "Teribaatonmeinaisauljhajiya", "Terminator", "Thanedaar", "Thappad",
    "Thedirtypicture", "Thegodfather", "Thehero", "Thekashmirfiles", "Thelionking",
    "Theshawshankredemption", "Thugsofhindostan", "Tigerzindahai", "Titanic",
    "Toiletekpremkatha", "Tokyostory", "Toofaan", "Totaldhamaal", "Tujhoothimainmakkaar",
    "Udaan", "Udtapunjab", "Up", "Uri", "Urithesurgicalstrike", "Vaastav", "Vansh",
    "Veerzaara", "Vertigo", "Vickydonor", "Vickyvidyakawohwalavideo", "Vijaypath",
    "Vikram", "Vikramarkudu", "Vikramvedha", "Virasat", "Vishwatma", "Vivah",
    "Wakeupsid", "Wanted", "Waqthamarahai", "Waqttheraceagainsttime", "War", "War2",
    "Wazir", "Welcome", "Welcometosajjanpur", "Whiplash", "Wildstrawberries", "Yaadein",
    "Yaaradildara", "Yaargaddar", "Yahaan", "Yaraana", "Yehhaijalwa",
    "Yehjawaanihaideewani", "Yehzindagikasafar", "Yesboss", "Yodha", "Yojimbo", "Yuva",
    "Yuvvraaj", "Zakhm", "Zakhmidil", "Zamaanadeewana", "Zanjeer", "Zarahatkezarabachke",
    "Zero", "Zindaginamilegidobara", "Zootopia", "Zubeidaa",
  ],
  jobs: [
    "Accountant", "Actor", "Actuary", "Anesthesiologist", "Architect", "Archivist",
    "Artist", "Astronaut", "Auctioneer", "Badhai", "Baker", "Banker", "Barber",
    "Beekeeper", "Biologist", "Blacksmith", "Butcher", "Carpenter", "Cartographer",
    "Cashier", "Chaiwala", "Chef", "Chemist", "Choreographer", "Civilservant", "Coach",
    "Cobbler", "Cryptographer", "Curator", "Darzi", "Dataanalyst", "Dentist", "Designer",
    "Detective", "Dhobi", "Diplomat", "Doctor", "Driver", "Ecologist", "Editor",
    "Electrician", "Embalmer", "Engineer", "Ethnographer", "Falconer", "Farmer",
    "Farrier", "Firefighter", "Fisherman", "Florist", "Forester", "Gardener",
    "Genealogist", "Geologist", "Glassblower", "Goldsmith", "Gwala", "Hairdresser",
    "Herpetologist", "Horologist", "Hrmanager", "Ichthyologist", "Illustrator",
    "Janitor", "Jeweler", "Journalist", "Judge", "Julaha", "Kumhar", "Landscaper",
    "Lawyer", "Lecturer", "Librarian", "Lifeguard", "Linguist", "Locksmith", "Lohar",
    "Lumberjack", "Mechanic", "Meteorologist", "Midwife", "Milkman", "Milliner", "Mochi",
    "Musician", "Nai", "Numismatist", "Nurse", "Optician", "Ornithologist", "Painter",
    "Paleontologist", "Pandit", "Perfumer", "Pharmacist", "Photographer", "Pilot",
    "Plumber", "Policeofficer", "Postman", "Potter", "Priest", "Professor", "Programmer",
    "Psychologist", "Puppeteer", "Realestateagent", "Receptionist", "Referee",
    "Rickshawdriver", "Rickshawpuller", "Sailor", "Scientist", "Screenwriter",
    "Sculptor", "Securityguard", "Shepherd", "Shopkeeper", "Singer", "Softwaredeveloper",
    "Stenographer", "Surgeon", "Tailor", "Taxidermist", "Teacher", "Teaseller",
    "Translator", "Upholsterer", "Uxdesigner", "Vendor", "Veterinarian", "Vintner",
    "Vulcanologist", "Waiter", "Washerman", "Watchmaker", "Weaver", "Welder", "Writer",
    "Zookeeper", "Zoologist",
  ],
  school_subjects: [
    "Accountancy", "Aeronautics", "Agriculture", "Algebra", "Anatomy", "Anthropology",
    "Archaeology", "Art", "Artandcraft", "Astronomy", "Bengali", "Bioethics", "Biology",
    "Botany", "Business", "Businessstudies", "Calculus", "Calligraphy", "Cartography",
    "Ceramics", "Chemistry", "Civics", "Commerce", "Computerscience", "Cryptography",
    "Cybernetics", "Dance", "Drama", "Economics", "English", "Environmentalscience",
    "Epistemology", "Ergonomics", "Ethics", "Ethnomusicology", "Etymology", "Finance",
    "Foreignlanguage", "Forensics", "French", "Generalknowledge", "Genetics",
    "Geography", "Geology", "Geometry", "German", "Government", "Grammar", "Gujarati",
    "Gym", "Herpetology", "Hindi", "History", "Homescience", "Horticulture",
    "Ichthyology", "Journalism", "Kinesiology", "Latin", "Law", "Linguistics",
    "Literature", "Logic", "Marathi", "Marketing", "Mathematics", "Metallurgy",
    "Meteorology", "Microbiology", "Mineralogy", "Moralscience", "Music", "Mythology",
    "Numismatics", "Nutrition", "Oceanography", "Ornithology", "Paleontology",
    "Pathology", "Petrology", "Pharmacology", "Philosophy", "Phonetics", "Photography",
    "Physicaleducation", "Physics", "Politicalscience", "Psychology", "Reading",
    "Regionallanguage", "Religion", "Rhetoric", "Robotics", "Sanskrit", "Science",
    "Seismology", "Semantics", "Semiotics", "Socialstudies", "Sociology", "Spanish",
    "Speleology", "Statistics", "Tamil", "Taxonomy", "Telugu", "Theater", "Toxicology",
    "Trigonometry", "Urdu", "Valueeducation", "Vedicmaths", "Woodworking", "Writing",
    "Zoology",
  ],
  emotions: [
    "Afraid", "Amazed", "Ambitious", "Amused", "Angry", "Annoyed", "Anxious",
    "Apologetic", "Ashamed", "Awe", "Bemused", "Betrayed", "Bitter", "Blissful", "Bold",
    "Bored", "Brave", "Calm", "Carefree", "Chagrin", "Cheerful", "Compassionate",
    "Confident", "Confused", "Contempt", "Content", "Cranky", "Craving", "Curious",
    "Defiant", "Delighted", "Depressed", "Despair", "Determined", "Devastated",
    "Disappointed", "Disdain", "Disgusted", "Disheartened", "Dread", "Eager",
    "Ebullient", "Ecstatic", "Elation", "Embarrassed", "Empathetic", "Empowered",
    "Enthusiastic", "Envious", "Euphoric", "Excited", "Exhausted", "Fearful", "Forlorn",
    "Frustrated", "Furious", "Glad", "Gloomy", "Grateful", "Grief", "Grumpy", "Guilty",
    "Gullible", "Happy", "Heartbroken", "Homesick", "Hopeful", "Hopeless", "Hostile",
    "Humiliated", "Hurt", "Impatient", "Indifferent", "Insecure", "Inspired",
    "Irritated", "Jealous", "Joyful", "Lonely", "Longing", "Loved", "Melancholy",
    "Mirthful", "Miserable", "Morose", "Motivated", "Nervous", "Nonchalant", "Nostalgic",
    "Numb", "Offended", "Optimistic", "Overwhelmed", "Panicked", "Peaceful", "Pensive",
    "Perplexed", "Pessimistic", "Proud", "Puzzled", "Rage", "Rapture", "Regretful",
    "Relaxed", "Relieved", "Remorse", "Resentful", "Resentment", "Restless", "Reverence",
    "Sad", "Sarcastic", "Satisfied", "Scared", "Sentimental", "Serene", "Shy",
    "Skeptical", "Smug", "Solemn", "Somber", "Spiteful", "Startled", "Stoic", "Stressed",
    "Sullen", "Surprised", "Suspicious", "Sympathetic", "Tense", "Terrified", "Thankful",
    "Thrilled", "Timid", "Tired", "Trepidation", "Triumphant", "Uneasy", "Upset",
    "Vulnerable", "Wary", "Weary", "Wistful", "Worried", "Yearning", "Zealous", "Zest",
  ],
  clothing: [
    "Abaya", "Anarkali", "Anarkalisuit", "Angavastram", "Apron", "Balaclava", "Bandana",
    "Bandhanidress", "Bandhgala", "Beret", "Bindi", "Blazer", "Blouse", "Bodice",
    "Bolero", "Boots", "Bowtie", "Breeches", "Burqa", "Camisole", "Cape", "Capelet",
    "Cardigan", "Cassock", "Chaps", "Cheongsam", "Chunni", "Churidar", "Cloak", "Coat",
    "Cravat", "Culottes", "Cummerbund", "Dashiki", "Dhoti", "Dirndl", "Doublet", "Dress",
    "Dupatta", "Espadrilles", "Fedora", "Galoshes", "Gamcha", "Gamosa", "Garter",
    "Gauntlet", "Ghagra", "Gloves", "Gown", "Hanbok", "Hat", "Hijab", "Hoodie", "Jacket",
    "Jeans", "Jersey", "Jodhpurisuit", "Jodhpurs", "Jumpsuit", "Jutti", "Kaftan",
    "Kediyu", "Kilt", "Kimono", "Kurta", "Kurti", "Lederhosen", "Leggings", "Lehenga",
    "Lehengacholi", "Loafers", "Lungi", "Mekhelachador", "Mittens", "Muffler", "Mundu",
    "Nehrujacket", "Odhani", "Overalls", "Overcoat", "Pagdi", "Pajamakurta", "Pajamas",
    "Pantaloons", "Pants", "Parka", "Patiala", "Patialasalwar", "Peacoat", "Petticoat",
    "Pheran", "Phiran", "Phulkaridupatta", "Pinafore", "Poncho", "Qipao", "Robe",
    "Romper", "Ruff", "Salwar", "Salwarkameez", "Sandals", "Saree", "Sari", "Sarong",
    "Sash", "Scarf", "Shawl", "Sherwani", "Shirt", "Shorts", "Skirt", "Slippers",
    "Smock", "Socks", "Sombrero", "Stetson", "Stole", "Suit", "Suspenders", "Sweater",
    "Swimsuit", "Tie", "Tights", "Toga", "Topi", "Trousers", "Tshirt", "Tunic", "Turban",
    "Turtleneck", "Underwear", "Uniform", "Veshti", "Vest", "Waistcoat", "Wimple",
    "Windbreaker",
  ],
  household: [
    "Almirah", "Andiron", "Angeethi", "Armchair", "Basket", "Beanbag", "Bed", "Belan",
    "Belanchakla", "Bellows", "Blanket", "Blender", "Bookshelf", "Bowl", "Broom",
    "Bucket", "Bureau", "Cabinet", "Calendar", "Candelabra", "Candle", "Carpet",
    "Cauldron", "Ceilinglight", "Chair", "Chakla", "Chandelier", "Charpai", "Chatai",
    "Chest", "Chimta", "Chulha", "Cistern", "Clock", "Closet", "Couch", "Cradle",
    "Credenza", "Cup", "Cupboard", "Curtain", "Curtains", "Cushion", "Cutlery", "Dabba",
    "Decanter", "Degchi", "Desk", "Diningtable", "Diya", "Doily", "Dresser", "Ewer",
    "Fan", "Footstool", "Fork", "Fridge", "Hammer", "Hourglass", "Hutch", "Icebox",
    "Jhadu", "Kadhai", "Kettle", "Ladder", "Lamp", "Lantern", "Loom", "Lota",
    "Masaladabba", "Matka", "Mattress", "Microwave", "Mirror", "Mixergrinder", "Mop",
    "Mortar", "Mug", "Napkin", "Ottoman", "Oven", "Palang", "Pan", "Parat", "Pestle",
    "Pillow", "Plate", "Pot", "Pressurecooker", "Pujathali", "Rangolitray",
    "Refrigerator", "Rockingchair", "Rug", "Samovar", "Scale", "Sconce", "Shelf",
    "Sideboard", "Silbatta", "Sofa", "Spinningwheel", "Spoon", "Stool", "Stove",
    "Strainer", "Table", "Tapestry", "Tawa", "Television", "Thali", "Thermometer",
    "Tiffin", "Tijori", "Toaster", "Towel", "Trunk", "Tureen", "Urn", "Uruli", "Vacuum",
    "Vacuumcleaner", "Vase", "Wardrobe", "Washboard", "Washingmachine", "Waterfilter",
    "Whisk", "Windchime",
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

// Only these letters ever ask for more than one answer — everything else
// is a quick single-answer round, no matter how many words match.
const MULTI_ANSWER_LETTERS = new Set(["A", "B", "C", "M", "P", "S", "T"]);

export function tierFor(category: CategoryKey, letter: string): TierInfo {
  const matches = wordsFor(category, letter);
  const matchCount = matches.length;

  if (matchCount === 0) return { tier: "none", matchCount, required: 0 };
  if (!MULTI_ANSWER_LETTERS.has(letter.toUpperCase())) {
    return { tier: "rare", matchCount, required: 1 };
  }
  if (matchCount <= 7) return { tier: "medium", matchCount, required: 2 };
  return { tier: "common", matchCount, required: 3 };
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
