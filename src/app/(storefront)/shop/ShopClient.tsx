"use client";

// ─────────────────────────────────────────────────────────
// ShopClient — Dynamic Filtering & Merchandising Taxonomy
// Filters by Power Origins (Class) & Families (Teams/Collections)
// ─────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, X, ChevronDown, PackagePlus, ShoppingBag, Users, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/motion/variants";
import { useProductStore } from "@/stores/productStore";
import { MARVEL_FAMILIES, POWER_ORIGINS, MERCH_CATEGORIES } from "@/types/taxonomy";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export default function ShopClient({ searchParams }: { searchParams: any }) {
  const { products } = useProductStore();
  const [selectedTag, setSelectedTag] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "categories" | "families" | "origins">("categories");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedTag) {
      const target = selectedTag.toLowerCase();
      list = list.filter((p) => {
        const matchesCategory = p.category?.toLowerCase() === target;
        const matchesFamilies = p.families?.some((f) => f.toLowerCase() === target);
        const matchesOrigins = p.origins?.some((o) => o.toLowerCase() === target);
        const matchesName = p.name?.toLowerCase().includes(target.replace("-", " "));
        return matchesCategory || matchesFamilies || matchesOrigins || matchesName;
      });
    }
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, selectedTag, sort, search]);

  return (
    <div>
      {/* ── Taxonomy Dimension Tabs ── */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#1e1e2a] pb-4 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab("all");
            setSelectedTag("");
          }}
          className={cn(
            "px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-xs flex items-center gap-2 shrink-0",
            activeTab === "all" && !selectedTag
              ? "bg-red-500 text-white shadow-[0_0_12px_rgba(226,54,54,0.6)]"
              : "bg-[#14141c] text-gray-400 border border-[#1e1e2a] hover:text-white"
          )}
        >
          All Catalog
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={cn(
            "px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-xs flex items-center gap-2 shrink-0",
            activeTab === "categories"
              ? "bg-red-500 text-white shadow-[0_0_12px_rgba(226,54,54,0.6)]"
              : "bg-[#14141c] text-gray-400 border border-[#1e1e2a] hover:text-white"
          )}
        >
          <ShoppingBag size={14} />
          Merch Categories
        </button>

        <button
          onClick={() => setActiveTab("families")}
          className={cn(
            "px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-xs flex items-center gap-2 shrink-0",
            activeTab === "families"
              ? "bg-red-500 text-white shadow-[0_0_12px_rgba(226,54,54,0.6)]"
              : "bg-[#14141c] text-gray-400 border border-[#1e1e2a] hover:text-white"
          )}
        >
          <Users size={14} />
          Teams & Factions
        </button>

        <button
          onClick={() => setActiveTab("origins")}
          className={cn(
            "px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-xs flex items-center gap-2 shrink-0",
            activeTab === "origins"
              ? "bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.6)] font-black"
              : "bg-[#14141c] text-gray-400 border border-[#1e1e2a] hover:text-white"
          )}
        >
          <Sparkles size={14} />
          Power Origins
        </button>
      </div>

      {/* ── 4 Core Categories Filter Badges ── */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {MERCH_CATEGORIES.map((cat) => {
            const isSelected = selectedTag === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedTag(isSelected ? "" : cat.slug)}
                className={cn(
                  "p-3.5 border rounded-xs text-left transition-all cursor-pointer relative overflow-hidden group",
                  isSelected
                    ? "bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(226,54,54,0.4)]"
                    : "bg-[#14141c] border-[#1e1e2a] hover:border-red-500/60"
                )}
              >
                <p className="font-display text-lg text-white font-extrabold tracking-wide uppercase leading-tight">
                  {cat.name}
                </p>
                <p className="text-[10px] text-gray-400 font-sans tracking-wide mt-0.5 truncate">
                  {cat.tagline}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Sub-Category Filter Badges ── */}
      {activeTab === "families" && (
        <div className="flex items-center gap-2 flex-wrap mb-6 bg-[#08080c] p-3 border border-[#1e1e2a] rounded-xs">
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mr-2">FAMILIES:</span>
          {MARVEL_FAMILIES.map((fam) => (
            <button
              key={fam.slug}
              onClick={() => setSelectedTag(selectedTag === fam.slug ? "" : fam.slug)}
              className={cn(
                "px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-all rounded-xs cursor-pointer border",
                selectedTag === fam.slug
                  ? "bg-red-500 text-white border-red-500 shadow-[0_0_10px_rgba(226,54,54,0.5)]"
                  : "bg-[#14141c] text-gray-400 border-[#1e1e2a] hover:border-red-500 hover:text-white"
              )}
            >
              {fam.name}
            </button>
          ))}
        </div>
      )}

      {activeTab === "origins" && (
        <div className="flex items-center gap-2 flex-wrap mb-6 bg-[#08080c] p-3 border border-[#1e1e2a] rounded-xs">
          <span className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest mr-2">POWER ORIGINS:</span>
          {POWER_ORIGINS.map((org) => (
            <button
              key={org.slug}
              onClick={() => setSelectedTag(selectedTag === org.slug ? "" : org.slug)}
              className={cn(
                "px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-all rounded-xs cursor-pointer border",
                selectedTag === org.slug
                  ? "bg-[#00f0ff] text-black border-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                  : "bg-[#14141c] text-gray-400 border-[#1e1e2a] hover:border-[#00f0ff] hover:text-white"
              )}
            >
              {org.name}
            </button>
          ))}
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8 pb-6 border-b border-[#1e1e2a]">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-marvel pl-9 pr-4 text-xs bg-[#08080c] border-[#1e1e2a]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-marvel pr-8 appearance-none cursor-pointer min-w-45 text-xs bg-[#08080c] border-[#1e1e2a]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
        {selectedTag && ` tagged with "${selectedTag.replace("-", " ")}"`}
      </p>

      {/* Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-[#14141c] border border-[#1e1e2a] rounded-xs p-8 max-w-xl mx-auto">
          <ShoppingBag size={48} className="text-gray-600 mx-auto mb-4" />
          <h2 className="font-display text-3xl text-white tracking-widest uppercase mb-2">NO PRODUCTS FOUND</h2>
          <p className="font-sans text-sm text-gray-400 mb-6">
            {products.length === 0
              ? "The catalog is currently empty. Add merchandise in the Admin Dashboard with Families & Origins tags!"
              : "No products matched your search or selected filter tag."}
          </p>
          {products.length === 0 ? (
            <Link href="/admin/products" className="btn-marvel inline-flex items-center gap-2 px-6 py-3 text-xs">
              <PackagePlus size={16} />
              Open Admin Dashboard
            </Link>
          ) : (
            <button onClick={() => { setSelectedTag(""); setSearch(""); setActiveTab("all"); }} className="btn-outline text-xs px-6 py-2.5">
              Clear Search & Filters
            </button>
          )}
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
              <ProductCard
                id={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                comparePrice={product.comparePrice}
                imageUrl={product.imageUrl}
                badge={product.badge}
                stockCount={product.stockCount}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
