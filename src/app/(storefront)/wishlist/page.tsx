// ─────────────────────────────────────────────────────────
// Wishlist Page
// ─────────────────────────────────────────────────────────
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, X, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/motion/variants";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <Heart size={40} className="text-marvel-white-muted" />
        <h1 className="font-display text-4xl text-marvel-white tracking-widest">WISHLIST EMPTY</h1>
        <p className="font-sans text-marvel-white-muted text-center">Save your favorites here before they sell out.</p>
        <Link href="/shop" className="btn-marvel">Explore Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
      <h1 className="font-display text-hero-md text-marvel-white tracking-wide mb-10">WISHLIST</h1>
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {items.map((item) => (
          <motion.div key={item.productId} variants={staggerItemVariants} className="card-product">
            <Link href={`/product/${item.slug}`} className="block">
              <div className="relative aspect-square bg-marvel-black-border">
                <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="300px" />
                <button
                  onClick={(e) => { e.preventDefault(); removeItem(item.productId); toast("Removed from wishlist"); }}
                  className="absolute top-3 right-3 p-2 bg-marvel-black-card border border-marvel-black-border text-marvel-white-muted hover:text-marvel-red hover:border-marvel-red transition-all"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-sans text-sm font-600 text-marvel-white line-clamp-2 mb-2">{item.productName}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl text-marvel-red">{formatPrice(item.price)}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addItem({ id: `v-${item.productId}`, productId: item.productId, productName: item.productName, variantLabel: "One Size", price: item.price, imageUrl: item.imageUrl, maxStock: 99, slug: item.slug });
                      toast.success("Added to cart");
                    }}
                    className="p-2 bg-marvel-red text-white hover:bg-marvel-red-dark transition-colors"
                  >
                    <ShoppingBag size={14} />
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
