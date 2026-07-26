"use client";
// ─────────────────────────────────────────────────────────
// ShopClient — Filtering, Sorting, Product Grid
// ─────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Search, X, ChevronDown } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

// Demo products
const ALL_PRODUCTS = [
  { id: "1", slug: "iron-man-repulsor-tee", name: "Iron Man Repulsor Tech Tee", price: 1799, comparePrice: 2499, imageUrl: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600", badge: "limited" as const, stockCount: 45, variantId: "v1", variantLabel: "L / Black", category: "iron-man" },
  { id: "2", slug: "spider-man-web-hoodie", name: "Spider-Man Web Shooter Hoodie", price: 3299, imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600", badge: "new" as const, stockCount: 120, variantId: "v2", variantLabel: "M / Red", category: "spider-man" },
  { id: "3", slug: "avengers-logo-cap", name: "Avengers Logo Cap", price: 899, imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600", badge: "exclusive" as const, stockCount: 8, variantId: "v3", variantLabel: "One Size", category: "avengers" },
  { id: "4", slug: "black-panther-wakanda-jacket", name: "Wakanda Forever Bomber", price: 5999, comparePrice: 7999, imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600", badge: "limited" as const, stockCount: 22, variantId: "v4", variantLabel: "L / Purple", category: "black-panther" },
  { id: "5", slug: "thor-mjolnir-mug", name: "Thor Mjolnir Collector Mug", price: 699, imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600", stockCount: 200, variantId: "v5", variantLabel: "One Size", category: "avengers" },
  { id: "6", slug: "captain-america-shield-tee", name: "Captain America Shield Tee", price: 1599, imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600", badge: "new" as const, stockCount: 75, variantId: "v6", variantLabel: "M / Blue", category: "avengers" },
  { id: "7", slug: "x-men-logo-hoodie", name: "X-Men Logo Oversized Hoodie", price: 2999, imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600", stockCount: 0, variantId: "v7", variantLabel: "XL / Yellow", category: "x-men" },
  { id: "8", slug: "doctor-strange-eye-tee", name: "Doctor Strange Eye of Agamotto Tee", price: 1899, imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600", badge: "exclusive" as const, stockCount: 33, variantId: "v8", variantLabel: "L / Black", category: "avengers" },
];

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Avengers", value: "avengers" },
  { label: "Iron Man", value: "iron-man" },
  { label: "Spider-Man", value: "spider-man" },
  { label: "Black Panther", value: "black-panther" },
  { label: "X-Men", value: "x-men" },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" },
];

export default function ShopClient({ searchParams }: { searchParams: any }) {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];
    if (category) list = list.filter((p) => p.category === category);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [category, sort, search]);

  return (
    <div>
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8 pb-8 border-b border-marvel-black-border">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-marvel-white-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-marvel pl-9 pr-4"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-marvel-white-muted hover:text-marvel-white">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  "font-sans text-xs font-600 tracking-widest uppercase px-3 py-2 border transition-all",
                  category === cat.value
                    ? "bg-marvel-red border-marvel-red text-white"
                    : "bg-transparent border-marvel-black-border text-marvel-white-dim hover:border-marvel-red hover:text-marvel-white"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-marvel pr-8 appearance-none cursor-pointer min-w-[160px]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-marvel-white-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="label-marvel mb-6">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
        {category && ` in ${CATEGORIES.find(c => c.value === category)?.label}`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl text-marvel-white-muted tracking-widest mb-4">NO PRODUCTS FOUND</p>
          <p className="font-sans text-sm text-marvel-white-muted mb-6">Try adjusting your filters or search term.</p>
          <button onClick={() => { setCategory(""); setSearch(""); }} className="btn-outline">Clear Filters</button>
        </div>
      ) : (
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filtered.map((product) => (
            <motion.div key={product.id} variants={staggerItemVariants}>
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
