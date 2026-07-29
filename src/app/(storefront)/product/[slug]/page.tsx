"use client";

// ─────────────────────────────────────────────────────────
// Product Detail Page — Dynamic Per-Category Sizing & Stock
// ─────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Heart, Shield, Zap, Truck, RotateCcw, ArrowLeft, Package, Check } from "lucide-react";
import { toast } from "sonner";
import MarvelBadge from "@/components/shared/MarvelBadge";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useProductStore } from "@/stores/productStore";
import { useInventoryStore } from "@/stores/inventoryStore";
import { CATEGORY_SIZES } from "@/types/taxonomy";
import { formatPrice } from "@/lib/utils";
import { soundFx } from "@/lib/sound";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { products } = useProductStore();
  const { getStock } = useInventoryStore();

  // Find product by slug or ID
  const storeProduct = products.find((p) => p.slug === slug || p.id === slug);

  // Fallback product structure if empty
  const product = storeProduct || {
    id: slug || "demo-product",
    slug: slug || "marvel-merch-item",
    name: "Marvel Collector Merchandise Item",
    price: 1999,
    comparePrice: 2499,
    description: "Official Marvel merchandise piece. High quality collector item with authentic branding.",
    category: "topwear",
    stockCount: 25,
    sizeStocks: { XS: 5, S: 10, M: 15, L: 8, XL: 4 },
    badge: "new" as const,
    imageUrl: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800",
  };

  // Determine available category sizes
  const categoryKey = (product.category || "topwear").toLowerCase();
  const availableSizes = CATEGORY_SIZES[categoryKey] || [];
  const isAccessories = categoryKey === "accessories" || availableSizes.length === 0;

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "One Size");

  useEffect(() => {
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    } else {
      setSelectedSize("One Size");
    }
  }, [product.category]);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  // Selected size specific stock
  const sizeStockMap = product.sizeStocks as Record<string, number> | undefined;
  const sizeStock = sizeStockMap && sizeStockMap[selectedSize] !== undefined
    ? sizeStockMap[selectedSize]
    : product.stockCount;

  const isOutOfStock = isAccessories ? product.stockCount <= 0 : sizeStock <= 0;

  function handleAddToCart() {
    if (isOutOfStock) {
      toast.error("Selected size is currently out of stock!");
      return;
    }
    soundFx.playClick();
    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      productName: product.name,
      variantLabel: isAccessories ? "One Size" : `Size: ${selectedSize}`,
      price: product.price,
      imageUrl: product.imageUrl,
      maxStock: sizeStock > 0 ? sizeStock : 10,
      quantity: 1,
      slug: product.slug,
    });
    soundFx.playUnlock();
    toast.success(`${product.name} added to cart`, {
      description: isAccessories ? "One Size Fits All" : `Size: ${selectedSize}`,
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 text-white">
      <Link
        href="/shop"
        onClick={() => soundFx.playClick()}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Shop Catalog
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Main Image */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-[#14141c] border border-[#1e1e2a] overflow-hidden rounded-xs shadow-2xl">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <MarvelBadge variant={product.badge || "new"} />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-[#f0b429] uppercase tracking-widest mb-2 block">
              OFFICIAL MARVEL {product.category?.toUpperCase() || "MERCHANDISE"}
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-white tracking-wide leading-none mb-3 font-extrabold uppercase">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4">
              <span className="font-display text-3xl text-red-500 font-extrabold">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-sm text-gray-500 line-through font-mono">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-300 leading-relaxed">{product.description}</p>

          {/* Stock Meter */}
          <div className="bg-[#14141c] border border-[#1e1e2a] p-4 rounded-xs">
            <div className="flex justify-between text-xs font-sans mb-2">
              <span className="text-gray-400">
                {isAccessories ? "Total Stock" : `Stock for Size ${selectedSize}`}
              </span>
              <span className={`font-bold ${isOutOfStock ? "text-red-500" : "text-emerald-400"}`}>
                {isOutOfStock ? "OUT OF STOCK" : `${sizeStock} units available`}
              </span>
            </div>
            <div className="h-1.5 bg-[#1e1e2a] overflow-hidden rounded-full">
              <div
                className={`h-full transition-all ${isOutOfStock ? "bg-red-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.min(100, Math.max(5, (sizeStock / 20) * 100))}%` }}
              />
            </div>
          </div>

          {/* Category Specific Size Selector */}
          {!isAccessories ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                  SELECT {categoryKey === "footwear" ? "FOOTWEAR SIZE (UK)" : "CLOTHING SIZE"}
                </label>
                <span className="text-[10px] text-amber-400 font-bold uppercase">
                  Category: {product.category}
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {availableSizes.map((sz) => {
                  const qty = sizeStockMap ? sizeStockMap[sz] ?? 0 : product.stockCount;
                  const available = qty > 0;
                  const isSelected = selectedSize === sz;

                  return (
                    <button
                      key={sz}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedSize(sz);
                      }}
                      className={`py-2.5 border font-display text-sm tracking-wider transition-all relative cursor-pointer ${
                        isSelected
                          ? "border-amber-400 bg-amber-400 text-black font-extrabold shadow-md"
                          : available
                          ? "border-[#1e1e2a] bg-[#14141c] text-white hover:border-amber-400/60"
                          : "border-red-500/20 bg-red-500/5 text-red-400/60 cursor-not-allowed opacity-50"
                      }`}
                    >
                      {sz}
                      {product.sizeStocks && (
                        <span className="block text-[8px] font-mono font-normal">
                          {qty > 0 ? `${qty} left` : "Sold Out"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-[#14141c] border border-purple-500/30 p-3 rounded-xs flex items-center justify-between text-xs">
              <span className="text-purple-400 font-bold uppercase flex items-center gap-2">
                <Package size={14} /> One Size (Accessories)
              </span>
              <span className="text-gray-400 text-[10px]">Universal fit item</span>
            </div>
          )}

          {/* Add to Cart & Wishlist */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`btn-marvel flex-1 justify-center gap-3 py-4 text-sm font-black ${
                isOutOfStock ? "bg-gray-700 border-gray-700 text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              <ShoppingBag size={18} /> {isOutOfStock ? "Out of Stock" : "Add to Bag"}
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                toggle({
                  productId: product.id,
                  productName: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  slug: product.slug,
                });
              }}
              className={`p-4 border transition-colors cursor-pointer ${
                wishlisted ? "bg-red-500/20 border-red-500 text-red-500" : "border-[#1e1e2a] text-gray-400 hover:text-white"
              }`}
            >
              <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
