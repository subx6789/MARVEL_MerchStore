"use client";
// ─────────────────────────────────────────────────────────
// Product Card — The collectible plaque card
// Used in grids, drops, wishlists
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { toast } from "sonner";
import MarvelBadge from "@/components/shared/MarvelBadge";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { BadgeVariant } from "@/types/database";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number | string;
  comparePrice?: number | string | null;
  imageUrl: string;
  badge?: BadgeVariant;
  stockCount?: number;
  variantId?: string;
  variantLabel?: string;
}

export default function ProductCard({
  id,
  slug,
  name,
  price,
  comparePrice,
  imageUrl,
  badge,
  stockCount = 99,
  variantId,
  variantLabel = "One Size",
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(id);

  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  const discountPercent = comparePrice
    ? getDiscountPercent(numPrice, comparePrice)
    : 0;

  const isSoldOut = stockCount === 0;
  const isLowStock = stockCount > 0 && stockCount <= 10;

  // Resolve badge — low stock and sold out override
  const activeBadge: BadgeVariant | undefined = isSoldOut
    ? "sold-out"
    : isLowStock
    ? "low-stock"
    : badge;

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (isSoldOut || !variantId) return;
    setAdding(true);
    addItem({
      id: variantId,
      productId: id,
      productName: name,
      variantLabel,
      price: numPrice,
      imageUrl,
      maxStock: stockCount,
      slug,
    });
    toast.success(`${name} added to cart`, {
      description: variantLabel,
    });
    setAdding(false);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggle({
      productId: id,
      productName: name,
      price: numPrice,
      imageUrl,
      slug,
    });
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="card-product"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-marvel-black-border">
          <Image
            src={imageUrl || "/images/placeholder-product.jpg"}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={cn(
              "object-cover transition-transform duration-500",
              isHovered ? "scale-105" : "scale-100"
            )}
          />

          {/* Overlay actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/20 flex items-end justify-center pb-4 gap-2"
          >
            <button
              onClick={handleWishlist}
              className={cn(
                "p-2.5 border transition-all duration-150",
                wishlisted
                  ? "bg-marvel-red border-marvel-red text-white"
                  : "bg-marvel-black-card/90 border-marvel-black-border text-marvel-white-dim hover:text-marvel-white hover:border-marvel-red"
              )}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/product/${slug}`;
              }}
              className="p-2.5 bg-marvel-black-card/90 border border-marvel-black-border text-marvel-white-dim hover:text-marvel-white hover:border-marvel-red transition-all duration-150"
              aria-label="View product"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isSoldOut || adding}
              className={cn(
                "p-2.5 border transition-all duration-150",
                isSoldOut
                  ? "bg-marvel-black-card/90 border-marvel-black-border text-marvel-white-muted cursor-not-allowed"
                  : "bg-marvel-red border-marvel-red text-white hover:bg-marvel-red-dark"
              )}
              aria-label={isSoldOut ? "Sold out" : "Add to cart"}
            >
              <ShoppingBag size={14} />
            </button>
          </motion.div>

          {/* Badge */}
          {activeBadge && (
            <div className="absolute top-3 left-3">
              <MarvelBadge variant={activeBadge} />
            </div>
          )}

          {/* Discount tag */}
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-marvel-gold text-marvel-black text-[10px] font-700 px-2 py-1">
              -{discountPercent}%
            </div>
          )}

          {/* Sold out overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="font-display text-2xl text-marvel-white-muted tracking-widest">
                SOLD OUT
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          <p className="label-marvel mb-1.5">
            {variantLabel !== "One Size" ? variantLabel : ""}
          </p>
          <h3 className="font-sans text-sm font-600 text-marvel-white leading-tight line-clamp-2 mb-3">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl text-marvel-red leading-none">
                {formatPrice(numPrice)}
              </span>
              {comparePrice && discountPercent > 0 && (
                <span className="font-sans text-xs text-marvel-white-muted line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>
            {isLowStock && (
              <span className="font-sans text-[9px] text-orange-400 font-600">
                {stockCount} left
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
