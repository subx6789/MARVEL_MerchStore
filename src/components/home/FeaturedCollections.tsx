"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Sparkles, Flame, Atom, Cpu, Wand2, Shirt, Footprints, Watch, Scissors } from "lucide-react";
import { staggerContainerVariants, staggerItemVariants, fadeUpVariants } from "@/lib/motion/variants";
import { useProductStore } from "@/stores/productStore";
import { MARVEL_FAMILIES, POWER_ORIGINS, MERCH_CATEGORIES } from "@/types/taxonomy";
import { soundFx } from "@/lib/sound";

const CATEGORY_ICONS: Record<string, any> = {
  topwear: Shirt,
  bottomwear: Scissors,
  footwear: Footprints,
  accessories: Watch,
};

const ORIGIN_ICONS: Record<string, any> = {
  mutant: Flame,
  cosmic: Sparkles,
  science: Atom,
  skill: Shield,
  tech: Cpu,
  mystic: Wand2,
};

export default function FeaturedCollections() {
  const { products } = useProductStore();

  return (
    <section className="section-marvel text-white space-y-16">
      {/* ── 0. CORE MERCH CATEGORIES (Topwear, Bottomwear, Footwear, Accessories) ── */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={fadeUpVariants} className="mb-8">
          <span className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] block mb-1">
            OFFICIAL APPAREL & MERCHANDISE
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide uppercase font-extrabold">
            PRODUCT CATEGORIES
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mt-1">
            Shop by core merchandise types — Topwear, Bottomwear, Footwear & Accessories.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MERCH_CATEGORIES.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.slug] || Shirt;
            const count = products.filter(
              (p) =>
                p.category?.toLowerCase() === cat.slug ||
                p.name?.toLowerCase().includes(cat.slug)
            ).length;

            return (
              <motion.div key={cat.slug} variants={staggerItemVariants}>
                <Link
                  href={`/shop?category=${cat.slug}`}
                  onClick={() => soundFx.playClick()}
                  className="block p-6 border border-[#1e1e2a] rounded-xs bg-[#14141c] hover:border-red-500 transition-all duration-300 group shadow-xl hover:scale-[1.02] relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xs">
                      <IconComponent size={26} className="text-red-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-400 bg-[#08080c] px-2.5 py-1 border border-[#1e1e2a]">
                      {count} Gear
                    </span>
                  </div>
                  <h3 className="font-display text-3xl font-black uppercase tracking-wide text-white group-hover:text-red-500 transition-colors mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-bold text-gray-300 mb-1">{cat.tagline}</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-normal">
                    {cat.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#1e1e2a] flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-white">
                    <span>Explore {cat.name}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      {/* ── 1. POWER ORIGINS (Hero Power Type Classifications) ── */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={fadeUpVariants} className="mb-8">
          <span className="text-xs font-bold text-[#00f0ff] uppercase tracking-[0.2em] block mb-1">
            HERO CLASSIFICATIONS
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide uppercase font-extrabold">
            POWER ORIGINS
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mt-1">
            Browse official merchandise by hero power origin — Mutant, Cosmic, Science, Skill, Tech & Mystic.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {POWER_ORIGINS.map((pOrigin) => {
            const IconComponent = ORIGIN_ICONS[pOrigin.slug] || Sparkles;
            const count = products.filter(
              (p) =>
                p.origins?.includes(pOrigin.slug) ||
                p.category?.toLowerCase() === pOrigin.slug ||
                p.name?.toLowerCase().includes(pOrigin.slug)
            ).length;

            return (
              <motion.div key={pOrigin.slug} variants={staggerItemVariants}>
                <Link
                  href={`/shop?origin=${pOrigin.slug}`}
                  onClick={() => soundFx.playClick()}
                  className="block p-5 border border-[#1e1e2a] rounded-xs bg-[#14141c] hover:border-[#00f0ff] transition-all duration-300 group shadow-xl hover:scale-[1.03]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <IconComponent size={24} className="text-[#00f0ff] group-hover:rotate-12 transition-transform" />
                    <span className="text-[10px] font-mono font-bold text-gray-400">{count} Gear</span>
                  </div>
                  <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white group-hover:text-[#00f0ff] transition-colors">
                    {pOrigin.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1 leading-snug font-normal line-clamp-1">
                    {pOrigin.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── 2. FAMILIES & FACTIONS (Teams, Organizations & Collections) ── */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={fadeUpVariants} className="flex items-baseline justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] block mb-1">
              MARVEL UNIVERSE TEAMS & FACTIONS
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide uppercase font-extrabold">
              FAMILIES & FACTIONS
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mt-1">
              Explore team gear, multi-character sets, and faction collections.
            </p>
          </div>
          <Link
            href="/shop"
            onClick={() => soundFx.playClick()}
            className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors group"
          >
            All Collections <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* 4-Column Grid for All 8 Marvel Families */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {MARVEL_FAMILIES.map((family) => {
            const count = products.filter(
              (p) =>
                p.families?.includes(family.slug) ||
                p.category?.toLowerCase() === family.slug ||
                p.name?.toLowerCase().includes(family.name.toLowerCase())
            ).length;

            return (
              <motion.div key={family.slug} variants={staggerItemVariants}>
                <Link
                  href={`/shop?family=${family.slug}`}
                  onClick={() => soundFx.playClick()}
                  className="relative block h-56 overflow-hidden bg-[#14141c] border border-[#1e1e2a] group cursor-pointer transition-all duration-300 rounded-xs shadow-xl hover:border-red-500"
                >
                  {/* Background Accent Gradient */}
                  <div
                    className={`absolute inset-0 opacity-30 group-hover:opacity-65 transition-opacity duration-300 bg-linear-to-br ${family.bgPattern}`}
                  />

                  {/* Top Badge Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="inline-flex items-center text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1"
                      style={{
                        background: `${family.accent}20`,
                        color: family.accent,
                        border: `1px solid ${family.accent}40`,
                      }}
                    >
                      {family.tag}
                    </span>
                  </div>

                  {/* Content Footer */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                    <h3 className="font-display text-2xl md:text-3xl text-white tracking-wide leading-tight mb-1 font-extrabold uppercase">
                      {family.name}
                    </h3>
                    <p className="font-sans text-xs text-gray-400 line-clamp-1">{family.description}</p>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                      <span className="font-sans text-xs font-bold text-gray-400">
                        {count} {count === 1 ? "Product" : "Products"}
                      </span>
                      <ArrowRight
                        size={18}
                        className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  </div>

                  {/* Hover Shimmer */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
