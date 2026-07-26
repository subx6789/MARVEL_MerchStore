"use client";
// ─────────────────────────────────────────────────────────
// Product Detail Page — High-status presentation
// Gallery, size picker, realtime stock indicator, add to cart
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Shield, Zap, Truck, RotateCcw, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import MarvelBadge from "@/components/shared/MarvelBadge";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { formatPrice } from "@/lib/utils";

// Demo Product Detail Data
const PRODUCT_DATA = {
  id: "iron-man-mark-85-armor-tee",
  slug: "iron-man-mark-85-armor-tee",
  name: "Iron Man Mark 85 Armor Tee",
  subtitle: "Limited Edition — 500 Pieces Worldwide",
  price: 2499,
  comparePrice: 3499,
  description:
    "Engineered with nanotech-inspired graphic precision. Screen-printed on 280 GSM heavyweight organic cotton. Each piece features a metallic gold hem label and an individually numbered collector plaque tag.",
  stockCount: 247,
  totalStock: 500,
  badge: "live" as const,
  type: "limited" as const,
  images: [
    "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: [
    { name: "Stealth Black", hex: "#0A0A0A" },
    { name: "Arc Red", hex: "#E23636" },
  ],
};

export default function ProductDetailPage() {
  const product = PRODUCT_DATA;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("Stealth Black");
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const stockPercent = Math.round(((product.totalStock - product.stockCount) / product.totalStock) * 100);

  function handleAddToCart() {
    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      productName: product.name,
      variantLabel: `${selectedSize} / ${selectedColor}`,
      price: product.price,
      imageUrl: product.images[0],
      maxStock: product.stockCount,
      quantity,
      slug: product.slug,
    });
    toast.success(`${product.name} added to cart`, {
      description: `Size: ${selectedSize} | Color: ${selectedColor}`,
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <Link href="/shop" className="inline-flex items-center gap-2 label-marvel text-marvel-white-muted hover:text-marvel-white mb-8 transition-colors">
        <ArrowLeft size={14} /> Back to Shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-marvel-black-card border border-marvel-black-border overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 left-4">
              <MarvelBadge variant={product.badge} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-square bg-marvel-black-card border ${
                  selectedImage === idx ? "border-marvel-red" : "border-marvel-black-border"
                } overflow-hidden transition-colors`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="label-marvel text-marvel-gold mb-2 block">{product.subtitle}</span>
            <h1 className="font-display text-4xl md:text-5xl text-marvel-white tracking-wide leading-none mb-3">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4">
              <span className="font-display text-3xl text-marvel-red">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="font-sans text-sm text-marvel-white-muted line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
          </div>

          {/* Stock Meter */}
          <div className="bg-marvel-black-card border border-marvel-black-border p-4">
            <div className="flex justify-between text-xs font-sans mb-2">
              <span className="text-marvel-white-muted">Collector Allocation</span>
              <span className="text-marvel-red font-bold">{product.stockCount} / {product.totalStock} left</span>
            </div>
            <div className="h-1.5 bg-marvel-black-border overflow-hidden">
              <div className="h-full bg-marvel-red transition-all" style={{ width: `${stockPercent}%` }} />
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="label-marvel block mb-3">Select Edition Color</label>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2 px-4 py-2 border text-xs font-sans uppercase tracking-widest ${
                    selectedColor === c.name ? "border-marvel-red bg-marvel-black-card text-white" : "border-marvel-black-border text-marvel-white-muted"
                  }`}
                >
                  <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label className="label-marvel block mb-3">Select Size</label>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-3 border font-display text-lg tracking-wider ${
                    selectedSize === s ? "border-marvel-red bg-marvel-red text-white" : "border-marvel-black-border text-marvel-white-muted hover:border-marvel-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button onClick={handleAddToCart} className="btn-marvel flex-1 justify-center gap-3 py-4">
              <ShoppingBag size={18} /> Add to Vault Cart
            </button>
            <button
              onClick={() => toggle({ productId: product.id, productName: product.name, price: product.price, imageUrl: product.images[0], slug: product.slug })}
              className={`p-4 border ${
                wishlisted ? "bg-marvel-red border-marvel-red text-white" : "border-marvel-black-border text-marvel-white-muted hover:border-marvel-white"
              }`}
            >
              <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-marvel-black-border text-center">
            <div className="space-y-1">
              <Shield size={20} className="mx-auto text-marvel-gold" />
              <p className="font-display text-sm">100% Authentic</p>
              <p className="font-sans text-[10px] text-marvel-white-muted">Official Marvel License</p>
            </div>
            <div className="space-y-1">
              <Truck size={20} className="mx-auto text-marvel-gold" />
              <p className="font-display text-sm">Fast Dispatch</p>
              <p className="font-sans text-[10px] text-marvel-white-muted">Insured Vault Shipping</p>
            </div>
            <div className="space-y-1">
              <RotateCcw size={20} className="mx-auto text-marvel-gold" />
              <p className="font-display text-sm">Collector Guarantee</p>
              <p className="font-sans text-[10px] text-marvel-white-muted">Sealed Packaging</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
