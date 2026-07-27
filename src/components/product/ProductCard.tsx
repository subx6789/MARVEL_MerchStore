"use client";

// ─────────────────────────────────────────────────────────
// Product Card — Marvel MerchStore & Vault Collectible Card
// Sound effects, atomic stock indicator, rarity badges
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import MarvelBadge from "@/components/shared/MarvelBadge";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { soundFx } from "@/lib/sound";
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
  variantLabel = "Standard",
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
  const isLowStock = stockCount > 0 && stockCount <= 12;

  // Active badge
  const activeBadge: BadgeVariant | undefined = isSoldOut
    ? "sold-out"
    : isLowStock
    ? "low-stock"
    : badge;

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut || !variantId) return;

    soundFx.playAddToCart();
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
      description: "Stock reserved for 10 minutes",
    });
    setAdding(false);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    soundFx.playClick();
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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="card-product group"
      onMouseEnter={() => {
        setIsHovered(true);
        soundFx.playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${slug}`} className="block">
        {/* Image Frame */}
        <div className="relative aspect-square overflow-hidden bg-[#08080c] border-b border-[#1e1e2a]">
          <Image
            src={imageUrl || "/images/placeholder-product.jpg"}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={cn(
              "object-cover transition-transform duration-700 ease-out",
              isHovered ? "scale-108" : "scale-100"
            )}
          />

          {/* Glowing Red Corner Accents on Hover */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Overlay Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-end justify-center pb-4 gap-2"
          >
            <button
              onClick={handleWishlist}
              className={cn(
                "p-2.5 border transition-all duration-200 shadow-md",
                wishlisted
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-[#14141c]/90 border-[#1e1e2a] text-gray-300 hover:text-white hover:border-red-500"
              )}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                soundFx.playClick();
                window.location.href = `/product/${slug}`;
              }}
              className="p-2.5 bg-[#14141c]/90 border border-[#1e1e2a] text-gray-300 hover:text-white hover:border-red-500 transition-all duration-200 shadow-md"
              aria-label="View product details"
            >
              <Eye size={15} />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isSoldOut || adding}
              className={cn(
                "p-2.5 border transition-all duration-200 shadow-md flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider",
                isSoldOut
                  ? "bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 border-red-600 text-white hover:bg-red-700 shadow-[0_0_12px_rgba(226,54,54,0.6)]"
              )}
              aria-label={isSoldOut ? "Sold out" : "Add to cart"}
            >
              <ShoppingBag size={15} />
              <span>{isSoldOut ? "Sold Out" : "Cart"}</span>
            </button>
          </motion.div>

          {/* Badge Tag */}
          {activeBadge && (
            <div className="absolute top-3 left-3 z-10">
              <MarvelBadge variant={activeBadge} />
            </div>
          )}

          {/* Discount Tag */}
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-amber-400 text-black font-black text-[10px] px-2 py-0.5 tracking-wider">
              -{discountPercent}%
            </div>
          )}

          {/* Sold Out Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-4">
              <span className="font-display text-3xl text-gray-400 tracking-widest uppercase">
                SOLD OUT
              </span>
              <span className="text-[10px] text-gray-500 font-mono tracking-widest mt-1">
                VAULT ARCHIVED
              </span>
            </div>
          )}
        </div>

        {/* Card Info */}
        <div className="p-4 bg-[#14141c]">
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">
            <span>OFFICIAL MERCH</span>
            {isLowStock && (
              <span className="text-amber-400 flex items-center gap-1">
                <ShieldAlert size={10} />
                {stockCount} LEFT
              </span>
            )}
          </div>

          <h3 className="font-sans text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-3 leading-snug">
            {name}
          </h3>

          {/* Low Stock Bar */}
          {isLowStock && (
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-amber-400"
                style={{ width: `${(stockCount / 12) * 100}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl text-red-500 font-extrabold leading-none">
                {formatPrice(numPrice)}
              </span>
              {comparePrice && discountPercent > 0 && (
                <span className="font-sans text-xs text-gray-500 line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>

            <span className="text-[10px] font-mono text-gray-400 group-hover:text-gray-200 transition-colors">
              #ISSUE-001
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
