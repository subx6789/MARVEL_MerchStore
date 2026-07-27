// ─────────────────────────────────────────────────────────
// Merchandising Taxonomy Types & Dictionaries
// Flexible two-level taxonomy for:
// 1. Power Origins (Mutant, Cosmic, Science, Skill, Tech, Mystic)
// 2. Marvel Families & Factions (Avengers, Guardians, X-Men, F4, etc.)
// ─────────────────────────────────────────────────────────

export interface MarvelFamily {
  id: string;
  slug: string;
  name: string;
  tag: string;
  description: string;
  accent: string;
  bgPattern: string;
}

export interface PowerOrigin {
  id: string;
  slug: string;
  name: string;
  description: string;
  accent: string;
}

// ── Standard Power Origins (Hero Power Classifications) ──
export const POWER_ORIGINS: PowerOrigin[] = [
  { id: "org_mutant", slug: "mutant", name: "Mutant", description: "X-Gene & Evolutionary Powers", accent: "#F59E0B" },
  { id: "org_cosmic", slug: "cosmic", name: "Cosmic", description: "Space & Celestial Energy", accent: "#00f0ff" },
  { id: "org_science", slug: "science", name: "Science", description: "Gamma & Super Soldier Tech", accent: "#10B981" },
  { id: "org_skill", slug: "skill", name: "Skill", description: "Master Tactical & Combat", accent: "#EF4444" },
  { id: "org_tech", slug: "tech", name: "Tech", description: "Stark Armor & Vibranium", accent: "#F0B429" },
  { id: "org_mystic", slug: "mystic", name: "Mystic", description: "Sorcery & Ancient Magic", accent: "#A855F7" },
];

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
