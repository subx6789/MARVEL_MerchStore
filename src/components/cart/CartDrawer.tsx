"use client";
// ─────────────────────────────────────────────────────────
// Cart Drawer — Slides in from right
// Full cart management in a sidebar
// ─────────────────────────────────────────────────────────
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { sidebarVariants, overlayVariants } from "@/lib/motion/variants";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, formattedSubtotal, itemCount } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-marvel-black-card border-l border-marvel-black-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-marvel-black-border">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-marvel-red" />
                <span className="font-display text-xl tracking-widest text-marvel-white">
                  CART
                </span>
                {itemCount() > 0 && (
                  <span className="badge-live px-2 py-0.5 text-[9px]">
                    {itemCount()} items
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-marvel-white-muted hover:text-marvel-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
                  <div className="w-20 h-20 bg-marvel-black-border flex items-center justify-center">
                    <ShoppingBag size={32} className="text-marvel-white-muted" />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-2xl text-marvel-white mb-2 tracking-widest">
                      YOUR CART IS EMPTY
                    </p>
                    <p className="font-sans text-sm text-marvel-white-muted">
                      Limited drops move fast. Add your picks before they&apos;re gone.
                    </p>
                  </div>
                  <Link href="/shop" onClick={closeCart} className="btn-marvel">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-marvel-black-border">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 py-4 flex gap-4"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-20 shrink-0 bg-marvel-black-border overflow-hidden">
                          <Image
                            src={item.imageUrl || "/images/placeholder-product.jpg"}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm font-600 text-marvel-white truncate">
                            {item.productName}
                          </p>
                          <p className="font-sans text-xs text-marvel-white-muted mt-0.5">
                            {item.variantLabel}
                          </p>
                          <p className="font-display text-lg text-marvel-red mt-1">
                            {formatPrice(item.price)}
                          </p>

                          {/* Qty + Remove */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center border border-marvel-black-border">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="p-1.5 text-marvel-white-muted hover:text-marvel-white hover:bg-marvel-black-hover transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-3 font-sans text-sm text-marvel-white tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={item.quantity >= item.maxStock}
                                className="p-1.5 text-marvel-white-muted hover:text-marvel-white hover:bg-marvel-black-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-marvel-white-muted hover:text-marvel-red transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-marvel-black-border px-6 py-5 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-marvel-white-muted">Subtotal</span>
                  <span className="font-display text-2xl text-marvel-white">
                    {formattedSubtotal()}
                  </span>
                </div>
                <p className="font-sans text-xs text-marvel-white-muted">
                  Shipping and taxes calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-marvel w-full justify-between"
                >
                  Checkout
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="btn-outline w-full text-center"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
