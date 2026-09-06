export interface MonumentDef {
  id: string;
  name: string;
  country: string;
  region: string;
  /** Path under /public to a real photo of the monument. */
  image: string;
}

export const MONUMENTS: MonumentDef[] = [
  // Asia
  { id: "taj-mahal", name: "Taj Mahal", country: "India", region: "Asia", image: "/monuments/taj-mahal.jpg" },
  { id: "great-wall", name: "The Great Wall", country: "China", region: "Asia", image: "/monuments/great-wall.jpg" },
  { id: "angkor-wat", name: "Angkor Wat", country: "Cambodia", region: "Asia", image: "/monuments/angkor-wat.jpg" },
  { id: "mount-fuji", name: "Mount Fuji", country: "Japan", region: "Asia", image: "/monuments/mount-fuji.jpg" },
  { id: "borobudur", name: "Borobudur", country: "Indonesia", region: "Asia", image: "/monuments/borobudur.jpg" },
  { id: "forbidden-city", name: "The Forbidden City", country: "China", region: "Asia", image: "/monuments/forbidden-city.jpg" },
  { id: "himeji-castle", name: "Himeji Castle", country: "Japan", region: "Asia", image: "/monuments/himeji-castle.jpg" },
  { id: "potala-palace", name: "Potala Palace", country: "China", region: "Asia", image: "/monuments/potala-palace.jpg" },
  { id: "shwedagon", name: "Shwedagon Pagoda", country: "Myanmar", region: "Asia", image: "/monuments/shwedagon.jpg" },
  { id: "meenakshi-temple", name: "Meenakshi Temple", country: "India", region: "Asia", image: "/monuments/meenakshi-temple.jpg" },

  // Middle East
  { id: "petra", name: "Petra", country: "Jordan", region: "Middle East", image: "/monuments/petra.jpg" },
  { id: "dome-of-the-rock", name: "Dome of the Rock", country: "Jerusalem", region: "Middle East", image: "/monuments/dome-of-the-rock.jpg" },
  { id: "burj-khalifa", name: "Burj Khalifa", country: "United Arab Emirates", region: "Middle East", image: "/monuments/burj-khalifa.jpg" },
  { id: "sheikh-zayed-mosque", name: "Sheikh Zayed Mosque", country: "United Arab Emirates", region: "Middle East", image: "/monuments/sheikh-zayed-mosque.jpg" },
  { id: "blue-mosque", name: "The Blue Mosque", country: "Turkey", region: "Middle East", image: "/monuments/blue-mosque.jpg" },

  // Europe
  { id: "eiffel-tower", name: "The Eiffel Tower", country: "France", region: "Europe", image: "/monuments/eiffel-tower.jpg" },
  { id: "colosseum", name: "The Colosseum", country: "Italy", region: "Europe", image: "/monuments/colosseum.jpg" },
  { id: "big-ben", name: "Big Ben", country: "United Kingdom", region: "Europe", image: "/monuments/big-ben.jpg" },
  { id: "neuschwanstein", name: "Neuschwanstein Castle", country: "Germany", region: "Europe", image: "/monuments/neuschwanstein.jpg" },
  { id: "sagrada-familia", name: "The Sagrada Familia", country: "Spain", region: "Europe", image: "/monuments/sagrada-familia.jpg" },
  { id: "acropolis", name: "The Acropolis", country: "Greece", region: "Europe", image: "/monuments/acropolis.jpg" },
  { id: "stonehenge", name: "Stonehenge", country: "United Kingdom", region: "Europe", image: "/monuments/stonehenge.jpg" },
  { id: "pisa-tower", name: "The Leaning Tower of Pisa", country: "Italy", region: "Europe", image: "/monuments/pisa-tower.jpg" },
  { id: "arc-de-triomphe", name: "The Arc de Triomphe", country: "France", region: "Europe", image: "/monuments/arc-de-triomphe.jpg" },
  { id: "st-basils", name: "St. Basil's Cathedral", country: "Russia", region: "Europe", image: "/monuments/st-basils.jpg" },

  // Africa
  { id: "pyramids-giza", name: "The Pyramids of Giza", country: "Egypt", region: "Africa", image: "/monuments/pyramids-giza.jpg" },
  { id: "sphinx", name: "The Great Sphinx", country: "Egypt", region: "Africa", image: "/monuments/sphinx.jpg" },
  { id: "table-mountain", name: "Table Mountain", country: "South Africa", region: "Africa", image: "/monuments/table-mountain.jpg" },
  { id: "victoria-falls", name: "Victoria Falls", country: "Zambia", region: "Africa", image: "/monuments/victoria-falls.jpg" },
  { id: "djenne-mosque", name: "The Great Mosque of Djenné", country: "Mali", region: "Africa", image: "/monuments/djenne-mosque.jpg" },
  { id: "lalibela", name: "The Rock Churches of Lalibela", country: "Ethiopia", region: "Africa", image: "/monuments/lalibela.jpg" },

  // Americas
  { id: "statue-of-liberty", name: "The Statue of Liberty", country: "United States", region: "Americas", image: "/monuments/statue-of-liberty.jpg" },
  { id: "christ-redeemer", name: "Christ the Redeemer", country: "Brazil", region: "Americas", image: "/monuments/christ-redeemer.jpg" },
  { id: "machu-picchu", name: "Machu Picchu", country: "Peru", region: "Americas", image: "/monuments/machu-picchu.jpg" },
  { id: "chichen-itza", name: "Chichen Itza", country: "Mexico", region: "Americas", image: "/monuments/chichen-itza.jpg" },
  { id: "golden-gate", name: "The Golden Gate Bridge", country: "United States", region: "Americas", image: "/monuments/golden-gate.jpg" },
  { id: "gateway-arch", name: "The Gateway Arch", country: "United States", region: "Americas", image: "/monuments/gateway-arch.jpg" },
  { id: "niagara-falls", name: "Niagara Falls", country: "Canada", region: "Americas", image: "/monuments/niagara-falls.jpg" },
  { id: "moai", name: "The Moai of Easter Island", country: "Chile", region: "Americas", image: "/monuments/moai.jpg" },
  { id: "teotihuacan", name: "Teotihuacan", country: "Mexico", region: "Americas", image: "/monuments/teotihuacan.jpg" },

  // Oceania
  { id: "sydney-opera-house", name: "The Sydney Opera House", country: "Australia", region: "Oceania", image: "/monuments/sydney-opera-house.jpg" },
  { id: "sydney-harbour-bridge", name: "The Sydney Harbour Bridge", country: "Australia", region: "Oceania", image: "/monuments/sydney-harbour-bridge.jpg" },
  { id: "uluru", name: "Uluru", country: "Australia", region: "Oceania", image: "/monuments/uluru.jpg" },
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
