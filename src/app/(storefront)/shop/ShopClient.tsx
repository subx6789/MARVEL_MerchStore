"use client";

// ─────────────────────────────────────────────────────────
// ShopClient — E-Commerce Left Sidebar Filter Layout
// Dynamic category, family, price & search filters on left sidebar
// ─────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, PackagePlus, ShoppingBag, Filter, RotateCcw, Check, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/motion/variants";
import { useProductStore } from "@/stores/productStore";
import { MARVEL_FAMILIES, MERCH_CATEGORIES } from "@/types/taxonomy";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export default function ShopClient({ searchParams }: { searchParams: any }) {
  const { products } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFamily, setSelectedFamily] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const highestPriceInCatalog = useMemo(() => {
    if (products.length === 0) return 20000;
    return Math.max(...products.map((p) => p.price), 5000);
  }, [products]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedFamily) count++;
    if (search) count++;
    if (maxPrice < highestPriceInCatalog) count++;
    return count;
  }, [selectedCategory, selectedFamily, search, maxPrice, highestPriceInCatalog]);

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedFamily("");
    setSearch("");
    setMaxPrice(highestPriceInCatalog);
    setSort("featured");
  };

  const filtered = useMemo(() => {
    let list = [...products];

    // Category Filter
    if (selectedCategory) {
      const catTarget = selectedCategory.toLowerCase();
      list = list.filter((p) => p.category?.toLowerCase() === catTarget);
    }

    // Family Tag Filter
    if (selectedFamily) {
      const famTarget = selectedFamily.toLowerCase();
      list = list.filter(
        (p) =>
          p.families?.some((f) => f.toLowerCase() === famTarget) ||
          p.name?.toLowerCase().includes(famTarget.replace("-", " "))
      );
    }

    // Price Filter
    if (maxPrice < highestPriceInCatalog) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    // Search Query Filter
    if (search) {
      const query = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query)
      );
    }

    // Sort Logic
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, selectedCategory, selectedFamily, maxPrice, highestPriceInCatalog, search, sort]);

  const renderFilterSidebar = () => (
    <div className="space-y-6">
      {/* Header & Clear */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1e1e2a]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-red-500" />
          <h2 className="font-display text-sm font-extrabold tracking-widest text-white uppercase">
            FILTERS
          </h2>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-red-500 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-1 font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <RotateCcw size={12} /> Clear All
          </button>
        )}
      </div>

      {/* 1. Search Box */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
          Search Gear
        </label>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Name, SKU, tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-marvel pl-9 pr-8 text-xs bg-[#08080c] border-[#1e1e2a]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Merch Categories */}
      <div className="space-y-3 pt-2 border-t border-[#1e1e2a]">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
          Product Category
        </label>
        <div className="space-y-1.5">
          <button
            onClick={() => setSelectedCategory("")}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xs transition-all cursor-pointer",
              !selectedCategory
                ? "bg-red-500/15 text-red-500 border border-red-500/40 font-bold"
                : "text-gray-400 hover:text-white hover:bg-[#14141c]"
            )}
          >
            <span>All Categories</span>
            <span className="text-[10px] font-mono opacity-60">{products.length}</span>
          </button>

          {MERCH_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const count = products.filter((p) => p.category?.toLowerCase() === cat.slug).length;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(isSelected ? "" : cat.slug)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xs transition-all cursor-pointer",
                  isSelected
                    ? "bg-red-500/15 text-red-500 border border-red-500/40 font-bold"
                    : "text-gray-400 hover:text-white hover:bg-[#14141c]"
                )}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] font-mono opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Teams & Factions (Families) */}
      <div className="space-y-3 pt-4 border-t border-[#1e1e2a]">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
          Teams & Factions
        </label>
        <div className="flex flex-wrap gap-1.5">
          {MARVEL_FAMILIES.map((fam) => {
            const isSelected = selectedFamily === fam.slug;
            return (
              <button
                key={fam.slug}
                onClick={() => setSelectedFamily(isSelected ? "" : fam.slug)}
                className={cn(
                  "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer border flex items-center gap-1",
                  isSelected
                    ? "bg-red-500 text-white border-red-500 shadow-[0_0_10px_rgba(226,54,54,0.4)]"
                    : "bg-[#08080c] text-gray-400 border-[#1e1e2a] hover:border-red-500/50 hover:text-white"
                )}
              >
                {isSelected && <Check size={10} />}
                {fam.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Price Range */}
      <div className="space-y-3 pt-4 border-t border-[#1e1e2a]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
            Max Price
          </label>
          <span className="font-mono text-xs font-bold text-red-500">
            ₹{maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={highestPriceInCatalog}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-red-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-gray-500">
          <span>₹500</span>
          <span>₹{highestPriceInCatalog.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* ── Desktop Left Sidebar (Sticky) ── */}
      <aside className="hidden lg:block w-64 shrink-0 bg-[#14141c] border border-[#1e1e2a] p-5 rounded-xs sticky top-24 shadow-xl">
        {renderFilterSidebar()}
      </aside>

      {/* ── Mobile Filter Toggle Button & Drawer ── */}
      <div className="lg:hidden w-full flex items-center justify-between bg-[#14141c] border border-[#1e1e2a] p-4 rounded-xs mb-4">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 btn-marvel text-xs py-2 px-4"
        >
          <Filter size={14} />
          <span>Filters & Categories</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center ml-1">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Mobile Sort Dropdown */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-marvel pr-7 appearance-none cursor-pointer text-xs bg-[#08080c] border-[#1e1e2a] py-1.5"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="w-80 max-w-full bg-[#14141c] h-full p-6 overflow-y-auto border-l border-[#1e1e2a]"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1e1e2a]">
                <h3 className="font-display text-lg text-white font-bold uppercase tracking-wider">
                  Filter Catalog
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              {renderFilterSidebar()}
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full btn-marvel text-xs py-3 mt-8 font-bold uppercase"
              >
                Show Results ({filtered.length})
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Product Section (Right Side) ── */}
      <div className="flex-1 w-full space-y-6">
        {/* Desktop Top Toolbar */}
        <div className="hidden lg:flex items-center justify-between bg-[#14141c] border border-[#1e1e2a] p-4 rounded-xs">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-white font-extrabold">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "product" : "products"}
            {selectedCategory && ` in ${MERCH_CATEGORIES.find((c) => c.slug === selectedCategory)?.name || selectedCategory}`}
            {selectedFamily && ` tagged with "${selectedFamily.replace("-", " ")}"`}
          </p>

          <div className="flex items-center gap-3">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Sort By:
            </label>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-marvel pr-8 appearance-none cursor-pointer text-xs bg-[#08080c] border-[#1e1e2a] py-2"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center bg-[#14141c] border border-[#1e1e2a] rounded-xs p-8 max-w-xl mx-auto">
            <ShoppingBag size={48} className="text-gray-600 mx-auto mb-4" />
            <h2 className="font-display text-3xl text-white tracking-widest uppercase mb-2">
              NO PRODUCTS MATCHED
            </h2>
            <p className="font-sans text-sm text-gray-400 mb-6">
              {products.length === 0
                ? "The catalog is currently empty. Add merchandise in the Admin Dashboard!"
                : "Try widening your price range or clearing selected filter tags."}
            </p>
            {products.length === 0 ? (
              <Link href="/admin/products" className="btn-marvel inline-flex items-center gap-2 px-6 py-3 text-xs">
                <PackagePlus size={16} />
                Open Admin Dashboard
              </Link>
            ) : (
              <button
                onClick={clearAllFilters}
                className="btn-outline text-xs px-6 py-2.5 cursor-pointer border-gray-700"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
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
    </div>
  );
}

