"use client";

// ─────────────────────────────────────────────────────────
// Product Detail Page — Dynamic Presentation from ProductStore
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Heart, Shield, Zap, Truck, RotateCcw, ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";
import MarvelBadge from "@/components/shared/MarvelBadge";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useProductStore } from "@/stores/productStore";
import { useInventoryStore } from "@/stores/inventoryStore";
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
    stockCount: getStock(slug || "demo-product", 25),
    totalStock: 100,
    badge: "new" as const,
    imageUrl: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800",
  };

  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("Stealth Black");

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const currentStock = getStock(product.id, product.stockCount);
  const totalStock = product.stockCount > 0 ? product.stockCount * 2 : 100;
  const stockPercent = Math.round(((totalStock - currentStock) / totalStock) * 100);

  function handleAddToCart() {
    soundFx.playClick();
    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      productName: product.name,
      variantLabel: `${selectedSize} / ${selectedColor}`,
      price: product.price,
      imageUrl: product.imageUrl,
      maxStock: currentStock,
      quantity: 1,
      slug: product.slug,
    });
    soundFx.playUnlock();
    toast.success(`${product.name} added to cart`, {
      description: `Size: ${selectedSize} | Edition: ${selectedColor}`,
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
              OFFICIAL COLLECTOR MERCHANDISE
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
              <span className="text-gray-400">Stock Remaining</span>
              <span className="text-red-500 font-bold">{currentStock} remaining</span>
            </div>
            <div className="h-1.5 bg-[#1e1e2a] overflow-hidden rounded-full">
              <div className="h-full bg-red-500 transition-all" style={{ width: `${Math.min(100, Math.max(10, stockPercent))}%` }} />
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-3">SELECT SIZE</label>
            <div className="grid grid-cols-5 gap-2">
              {["S", "M", "L", "XL", "XXL"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedSize(s);
                  }}
                  className={`py-3 border font-display text-lg tracking-wider cursor-pointer ${
                    selectedSize === s
                      ? "border-red-500 bg-red-500 text-white shadow-[0_0_15px_rgba(226,54,54,0.5)]"
                      : "border-[#1e1e2a] text-gray-400 hover:border-white hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart & Wishlist */}
          <div className="flex gap-4 pt-4">
            <button onClick={handleAddToCart} className="btn-marvel flex-1 justify-center gap-3 py-4 text-sm">
              <ShoppingBag size={18} /> Add to Bag
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
              className={`p-4 border cursor-pointer ${
                wishlisted
                  ? "bg-red-500 border-red-500 text-white shadow-[0_0_15px_rgba(226,54,54,0.5)]"
                  : "border-[#1e1e2a] text-gray-400 hover:border-white hover:text-white"
              }`}
            >
              <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1e1e2a] text-center">
            <div className="space-y-1">
              <Shield size={20} className="mx-auto text-[#f0b429]" />
              <p className="font-display text-sm font-bold">100% Authentic</p>
              <p className="text-[10px] text-gray-400">Official Marvel License</p>
            </div>
            <div className="space-y-1">
              <Truck size={20} className="mx-auto text-[#f0b429]" />
              <p className="font-display text-sm font-bold">Fast Dispatch</p>
              <p className="text-[10px] text-gray-400">Fast Express Delivery</p>
            </div>
            <div className="space-y-1">
              <RotateCcw size={20} className="mx-auto text-[#f0b429]" />
              <p className="font-display text-sm font-bold">Collector Quality</p>
              <p className="text-[10px] text-gray-400">Mint Condition</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
