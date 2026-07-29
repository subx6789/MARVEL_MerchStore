// ─────────────────────────────────────────────────────────
// Merchandising Taxonomy Types & Dictionaries
// Flexible taxonomy for:
// 1. Marvel Families & Factions (Avengers, Guardians, X-Men, F4, etc.)
// ─────────────────────────────────────────────────────────

export interface MerchCategory {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
}

// ── 4 Core Merchandising Categories (Topwear, Bottomwear, Footwear, Accessories) ──
export const MERCH_CATEGORIES: MerchCategory[] = [
  {
    id: "cat_topwear",
    slug: "topwear",
    name: "Topwear",
    tagline: "T-Shirts, Hoodies & Jackets",
    description: "Official Marvel Graphic Tees, Hoodies, Oversized Tops & Jackets",
    accent: "#E23636",
  },
  {
    id: "cat_bottomwear",
    slug: "bottomwear",
    name: "Bottomwear",
    tagline: "Joggers, Shorts & Cargo Pants",
    description: "Tactical Joggers, Superhero Shorts, Cargo Pants & Trackpants",
    accent: "#F0B429",
  },
  {
    id: "cat_footwear",
    slug: "footwear",
    name: "Footwear",
    tagline: "Sneakers, Sliders & Clogs",
    description: "Marvel Collector Sneakers, Comfort Sliders, Clogs & Boots",
    accent: "#00f0ff",
  },
  {
    id: "cat_accessories",
    slug: "accessories",
    name: "Accessories",
    tagline: "Caps, Backpacks & Phone Cases",
    description: "Caps, Tactical Backpacks, Phone Covers, Relics & Collectibles",
    accent: "#A855F7",
  },
];

export interface MarvelFamily {
  id: string;
  slug: string;
  name: string;
  tag: string;
  description: string;
  accent: string;
  bgPattern: string;
}


// ── Standard Marvel Families (Teams, Factions & Collections) ──
export const MARVEL_FAMILIES: MarvelFamily[] = [
  {
    id: "fam_avengers",
    slug: "avengers",
    name: "Avengers",
    tag: "Earth's Mightiest Heroes",
    description: "Assemble with official Stark & SHIELD tactical apparel",
    accent: "#E23636",
    bgPattern: "from-red-600/30 via-red-950/20 to-transparent",
  },
  {
    id: "fam_guardians",
    slug: "guardians-of-the-galaxy",
    name: "Guardians of the Galaxy",
    tag: "Cosmic Outlaws",
    description: "Knowhere & Star-Lord Retro Cassette Exclusives",
    accent: "#EC4899",
    bgPattern: "from-pink-600/30 via-pink-950/20 to-transparent",
  },
  {
    id: "fam_fantastic_four",
    slug: "fantastic-four",
    name: "Fantastic Four",
    tag: "Marvel's First Family",
    description: "Baxter Building & Quantum Relics",
    accent: "#3B82F6",
    bgPattern: "from-blue-600/30 via-transparent to-transparent",
  },
  {
    id: "fam_x_men",
    slug: "x-men",
    name: "X-Men",
    tag: "Children of the Atom",
    description: "Xavier Institute & Krakoan Era Apparel",
    accent: "#F59E0B",
    bgPattern: "from-amber-600/30 via-transparent to-transparent",
  },
  {
    id: "fam_midnight_sons",
    slug: "midnight-sons",
    name: "Midnight Sons",
    tag: "Supernatural Order",
    description: "Occult & Vampiric Collector Relics",
    accent: "#8B5CF6",
    bgPattern: "from-purple-600/30 via-transparent to-transparent",
  },
  {
    id: "fam_sinister_six",
    slug: "sinister-six",
    name: "Sinister Six",
    tag: "Villain Syndicate",
    description: "Rogue Tech & High-Voltage Syndicate Apparel",
    accent: "#10B981",
    bgPattern: "from-emerald-600/30 via-transparent to-transparent",
  },
  {
    id: "fam_defenders",
    slug: "defenders",
    name: "Defenders",
    tag: "Street Level Vigilantes",
    description: "Hell's Kitchen & Harlem Streetwear",
    accent: "#D97706",
    bgPattern: "from-amber-700/30 via-transparent to-transparent",
  },
  {
    id: "fam_inhumans",
    slug: "inhumans",
    name: "Inhumans",
    tag: "Terrigen Royal Family",
    description: "Attilan Royal Crest & Terrigenesis Relics",
    accent: "#06B6D4",
    bgPattern: "from-cyan-600/30 via-transparent to-transparent",
  },
];

// ── Category Size Options Map ──
export const CATEGORY_SIZES: Record<string, string[]> = {
  topwear: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  bottomwear: ["28", "30", "32", "34", "36", "38", "40"],
  footwear: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
  accessories: [], // Accessories are fixed one-size items
};
