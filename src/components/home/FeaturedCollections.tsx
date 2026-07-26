"use client";
// ─────────────────────────────────────────────────────────
// Featured Collections — Editorial grid of categories
// ─────────────────────────────────────────────────────────
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/motion/variants";

const collections = [
  {
    name: "Avengers",
    slug: "avengers",
    description: "Earth's Mightiest Heroes",
    count: "87 Products",
    accent: "#E23636",
    label: "FEATURED",
    gridClass: "md:col-span-2 md:row-span-2",
    height: "h-72 md:h-full",
  },
  {
    name: "Spider-Man",
    slug: "spider-man",
    description: "Your Friendly Neighborhood",
    count: "54 Products",
    accent: "#1a6af5",
    label: "HOT",
    gridClass: "",
    height: "h-48",
  },
  {
    name: "Iron Man",
    slug: "iron-man",
    description: "Genius. Billionaire.",
    count: "43 Products",
    accent: "#F0B429",
    label: "LIMITED",
    gridClass: "",
    height: "h-48",
  },
  {
    name: "Black Panther",
    slug: "black-panther",
    description: "Wakanda Forever",
    count: "38 Products",
    accent: "#9333ea",
    label: "EXCLUSIVE",
    gridClass: "",
    height: "h-48",
  },
  {
    name: "X-Men",
    slug: "x-men",
    description: "Mutant Revolution",
    count: "61 Products",
    accent: "#F59E0B",
    label: "NEW",
    gridClass: "",
    height: "h-48",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="section-marvel">
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {/* Section Header */}
        <motion.div
          variants={staggerItemVariants}
          className="flex items-baseline justify-between mb-10"
        >
          <div>
            <p className="label-marvel text-marvel-red mb-2">Browse by Universe</p>
            <h2 className="font-display text-hero-md text-marvel-white tracking-wide">
              COLLECTIONS
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 label-marvel hover:text-marvel-white transition-colors group"
          >
            All Collections
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-4 gap-3">
          {collections.map((collection) => (
            <motion.div
              key={collection.slug}
              variants={staggerItemVariants}
              className={collection.gridClass}
            >
              <Link
                href={`/shop?category=${collection.slug}`}
                className={`
                  relative block overflow-hidden bg-marvel-black-card border border-marvel-black-border
                  group cursor-pointer transition-all duration-300
                  hover:border-[${collection.accent}] ${collection.height}
                `}
              >
                {/* Background */}
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(ellipse at 70% 50%, ${collection.accent} 0%, transparent 70%)`,
                  }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span
                    className="inline-flex items-center text-[9px] font-700 tracking-[0.2em] uppercase px-2 py-1 mb-3 w-fit"
                    style={{
                      background: `${collection.accent}20`,
                      color: collection.accent,
                      border: `1px solid ${collection.accent}40`,
                    }}
                  >
                    {collection.label}
                  </span>
                  <h3 className="font-display text-3xl md:text-4xl text-marvel-white tracking-wide leading-none mb-1">
                    {collection.name.toUpperCase()}
                  </h3>
                  <p className="font-sans text-sm text-marvel-white-dim">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <span className="font-sans text-xs text-marvel-white-muted">
                      {collection.count}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-marvel-white-muted group-hover:text-marvel-white group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>

                {/* Shimmer on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
