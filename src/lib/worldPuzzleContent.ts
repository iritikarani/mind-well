export type MonumentArchetype =
  | "tower"
  | "pyramid"
  | "dome"
  | "arch"
  | "statue"
  | "colosseum"
  | "skyscraper"
  | "temple"
  | "bridge"
  | "castle"
  | "clocktower"
  | "rock"
  | "mountain"
  | "shell"
  | "wall";

export interface MonumentDef {
  id: string;
  name: string;
  country: string;
  region: string;
  archetype: MonumentArchetype;
  primary: string;
  accent: string;
  sky: string;
}

export const MONUMENTS: MonumentDef[] = [
  // Asia
  { id: "taj-mahal", name: "Taj Mahal", country: "India", region: "Asia", archetype: "dome", primary: "#F3EEE6", accent: "#8FBF9F", sky: "#FCE8D8" },
  { id: "great-wall", name: "The Great Wall", country: "China", region: "Asia", archetype: "wall", primary: "#B99A73", accent: "#7A6248", sky: "#DCEAF5" },
  { id: "angkor-wat", name: "Angkor Wat", country: "Cambodia", region: "Asia", archetype: "temple", primary: "#C9A166", accent: "#8A6A3F", sky: "#F7D9B8" },
  { id: "mount-fuji", name: "Mount Fuji", country: "Japan", region: "Asia", archetype: "mountain", primary: "#7B93B0", accent: "#F5F5F5", sky: "#FBD9E3" },
  { id: "borobudur", name: "Borobudur", country: "Indonesia", region: "Asia", archetype: "temple", primary: "#8A8073", accent: "#5C554B", sky: "#F2E3C8" },
  { id: "forbidden-city", name: "The Forbidden City", country: "China", region: "Asia", archetype: "castle", primary: "#C0473F", accent: "#E8C15A", sky: "#DCEAF5" },
  { id: "himeji-castle", name: "Himeji Castle", country: "Japan", region: "Asia", archetype: "castle", primary: "#F5F3EE", accent: "#5C6B73", sky: "#F7D6E0" },
  { id: "potala-palace", name: "Potala Palace", country: "China", region: "Asia", archetype: "castle", primary: "#E7E1D4", accent: "#B23A2F", sky: "#CFE3F5" },
  { id: "shwedagon", name: "Shwedagon Pagoda", country: "Myanmar", region: "Asia", archetype: "temple", primary: "#E8C15A", accent: "#8A6A2B", sky: "#F7D9B8" },
  { id: "meenakshi-temple", name: "Meenakshi Temple", country: "India", region: "Asia", archetype: "temple", primary: "#D97B5B", accent: "#4A7FB5", sky: "#F7D9B8" },

  // Middle East
  { id: "petra", name: "Petra", country: "Jordan", region: "Middle East", archetype: "rock", primary: "#C97B5A", accent: "#8A4E36", sky: "#F7D9B8" },
  { id: "dome-of-the-rock", name: "Dome of the Rock", country: "Jerusalem", region: "Middle East", archetype: "dome", primary: "#E8C15A", accent: "#4A7FB5", sky: "#F0E6D2" },
  { id: "burj-khalifa", name: "Burj Khalifa", country: "United Arab Emirates", region: "Middle East", archetype: "skyscraper", primary: "#CFE3F5", accent: "#8FA6BF", sky: "#F5EADB" },
  { id: "sheikh-zayed-mosque", name: "Sheikh Zayed Mosque", country: "United Arab Emirates", region: "Middle East", archetype: "dome", primary: "#F5F3EE", accent: "#C9A166", sky: "#F7D9B8" },
  { id: "persepolis", name: "Persepolis", country: "Iran", region: "Middle East", archetype: "rock", primary: "#B99A73", accent: "#7A6248", sky: "#F0E6D2" },
  { id: "blue-mosque", name: "The Blue Mosque", country: "Turkey", region: "Middle East", archetype: "dome", primary: "#7FA8C9", accent: "#F5F3EE", sky: "#DCEAF5" },

  // Europe
  { id: "eiffel-tower", name: "The Eiffel Tower", country: "France", region: "Europe", archetype: "tower", primary: "#8A8073", accent: "#5C554B", sky: "#FBD9E3" },
  { id: "colosseum", name: "The Colosseum", country: "Italy", region: "Europe", archetype: "colosseum", primary: "#D9B98A", accent: "#B99A73", sky: "#F7D9B8" },
  { id: "big-ben", name: "Big Ben", country: "United Kingdom", region: "Europe", archetype: "clocktower", primary: "#C9A166", accent: "#F5F3EE", sky: "#CFE3F5" },
  { id: "neuschwanstein", name: "Neuschwanstein Castle", country: "Germany", region: "Europe", archetype: "castle", primary: "#E7E1D4", accent: "#7B93B0", sky: "#DCEAF5" },
  { id: "sagrada-familia", name: "The Sagrada Familia", country: "Spain", region: "Europe", archetype: "temple", primary: "#E8C15A", accent: "#D97B5B", sky: "#FBD9E3" },
  { id: "acropolis", name: "The Acropolis", country: "Greece", region: "Europe", archetype: "temple", primary: "#F5F3EE", accent: "#CFE3F5", sky: "#CFE3F5" },
  { id: "stonehenge", name: "Stonehenge", country: "United Kingdom", region: "Europe", archetype: "rock", primary: "#8A8073", accent: "#5C554B", sky: "#DCEAF5" },
  { id: "pisa-tower", name: "The Leaning Tower of Pisa", country: "Italy", region: "Europe", archetype: "tower", primary: "#F5F3EE", accent: "#CFE3F5", sky: "#FBD9E3" },
  { id: "arc-de-triomphe", name: "The Arc de Triomphe", country: "France", region: "Europe", archetype: "arch", primary: "#C9A166", accent: "#8A6A3F", sky: "#F7D9B8" },
  { id: "st-basils", name: "St. Basil's Cathedral", country: "Russia", region: "Europe", archetype: "dome", primary: "#D97B5B", accent: "#8FBF9F", sky: "#DCEAF5" },

  // Africa
  { id: "pyramids-giza", name: "The Pyramids of Giza", country: "Egypt", region: "Africa", archetype: "pyramid", primary: "#D9B98A", accent: "#B99A73", sky: "#F7D9B8" },
  { id: "sphinx", name: "The Great Sphinx", country: "Egypt", region: "Africa", archetype: "statue", primary: "#C9A166", accent: "#8A6A3F", sky: "#F7D9B8" },
  { id: "table-mountain", name: "Table Mountain", country: "South Africa", region: "Africa", archetype: "mountain", primary: "#8FA6BF", accent: "#F5F3EE", sky: "#FBD9E3" },
  { id: "victoria-falls", name: "Victoria Falls", country: "Zambia", region: "Africa", archetype: "rock", primary: "#7FA8C9", accent: "#F5F3EE", sky: "#DCEAF5" },
  { id: "djenne-mosque", name: "The Great Mosque of Djenné", country: "Mali", region: "Africa", archetype: "temple", primary: "#C9A166", accent: "#8A6A3F", sky: "#F7D9B8" },
  { id: "lalibela", name: "The Rock Churches of Lalibela", country: "Ethiopia", region: "Africa", archetype: "rock", primary: "#B99A73", accent: "#7A6248", sky: "#F0E6D2" },

  // Americas
  { id: "statue-of-liberty", name: "The Statue of Liberty", country: "United States", region: "Americas", archetype: "statue", primary: "#8FBF9F", accent: "#6BA37F", sky: "#CFE3F5" },
  { id: "christ-redeemer", name: "Christ the Redeemer", country: "Brazil", region: "Americas", archetype: "statue", primary: "#E7E1D4", accent: "#8FA6BF", sky: "#FBD9E3" },
  { id: "machu-picchu", name: "Machu Picchu", country: "Peru", region: "Americas", archetype: "mountain", primary: "#8FBF9F", accent: "#5C8A6A", sky: "#F7D9B8" },
  { id: "chichen-itza", name: "Chichen Itza", country: "Mexico", region: "Americas", archetype: "pyramid", primary: "#C9A166", accent: "#8A6A3F", sky: "#F7D9B8" },
  { id: "golden-gate", name: "The Golden Gate Bridge", country: "United States", region: "Americas", archetype: "bridge", primary: "#D9704A", accent: "#8A4E36", sky: "#DCEAF5" },
  { id: "gateway-arch", name: "The Gateway Arch", country: "United States", region: "Americas", archetype: "arch", primary: "#CFE3F5", accent: "#8FA6BF", sky: "#F7D9B8" },
  { id: "cn-tower", name: "The CN Tower", country: "Canada", region: "Americas", archetype: "tower", primary: "#8A8073", accent: "#5C554B", sky: "#DCEAF5" },
  { id: "niagara-falls", name: "Niagara Falls", country: "Canada", region: "Americas", archetype: "rock", primary: "#7FA8C9", accent: "#F5F3EE", sky: "#F7D9B8" },
  { id: "moai", name: "The Moai of Easter Island", country: "Chile", region: "Americas", archetype: "statue", primary: "#8A8073", accent: "#5C554B", sky: "#F7D9B8" },
  { id: "teotihuacan", name: "Teotihuacan", country: "Mexico", region: "Americas", archetype: "pyramid", primary: "#B99A73", accent: "#7A6248", sky: "#F7D9B8" },

  // Oceania
  { id: "sydney-opera-house", name: "The Sydney Opera House", country: "Australia", region: "Oceania", archetype: "shell", primary: "#F5F3EE", accent: "#CFE3F5", sky: "#CFE3F5" },
  { id: "sydney-harbour-bridge", name: "The Sydney Harbour Bridge", country: "Australia", region: "Oceania", archetype: "bridge", primary: "#7B93B0", accent: "#5C6B73", sky: "#FBD9E3" },
  { id: "uluru", name: "Uluru", country: "Australia", region: "Oceania", archetype: "rock", primary: "#D97B5B", accent: "#8A4E36", sky: "#F7D9B8" },
  { id: "sky-tower", name: "The Sky Tower", country: "New Zealand", region: "Oceania", archetype: "tower", primary: "#8FA6BF", accent: "#5C6B73", sky: "#DCEAF5" },
];

export function monumentById(id: string): MonumentDef | undefined {
  return MONUMENTS.find((m) => m.id === id);
}

export const UPLIFTING_QUOTES: string[] = [
  "Some things take time to come together — and that's exactly as it should be.",
  "Every piece you place is still progress, even the ones that take a few tries.",
  "There's no rush here. The view is just as beautiful at your own pace.",
  "What looks scattered now is closer to whole than you think.",
  "Patience isn't waiting — it's building something worth seeing.",
  "You don't have to rush toward finished. Finished will meet you when it's ready.",
  "Small, steady moves are still the ones that build something lasting.",
  "It's okay if it takes longer than you expected. It still came together.",
  "Some of the best things in the world were built one careful piece at a time.",
  "You showed up for something slow and quiet today. That counts for a lot.",
  "A little bit of care, placed again and again, becomes something whole.",
  "Nothing here was rushed, and neither should you be.",
  "The pieces fit eventually. They always do, when you give them room to.",
  "You didn't need to be fast. You only needed to keep going.",
  "This came together because you were willing to sit with it a while.",
  "Not every kind of progress feels urgent — some of it just feels peaceful.",
  "You built this the same way most good things get built: slowly, and on purpose.",
  "Take a breath. What you just finished, you finished at exactly the right pace.",
  "It's a good kind of quiet, the one that comes after finishing something gently.",
  "Some journeys are measured in miles. Others, in pieces fit together with care.",
];

export function randomQuote(): string {
  return UPLIFTING_QUOTES[Math.floor(Math.random() * UPLIFTING_QUOTES.length)];
}
