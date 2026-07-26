"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/motion/variants";

const DELIVERY_FEE = 99;
const FREE_SHIPPING_THRESHOLD = 1999;

export default function CartPageClient() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();
  const sub = subtotal();
  const delivery = sub >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = sub + delivery;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 bg-marvel-black-card border border-marvel-black-border flex items-center justify-center">
          <ShoppingBag size={32} className="text-marvel-white-muted" />
        </div>
        <h1 className="font-display text-4xl text-marvel-white tracking-widest">EMPTY CART</h1>
        <p className="font-sans text-marvel-white-muted text-center max-w-sm">
          Your cart is empty. Limited drops are going fast — add yours before they sell out.
        </p>
        <Link href="/shop" className="btn-marvel">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="font-display text-hero-md text-marvel-white tracking-wide">YOUR CART</h1>
        <button onClick={clearCart} className="font-sans text-xs text-marvel-white-muted hover:text-marvel-red transition-colors">
          Clear All
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 space-y-0 divide-y divide-marvel-black-border border-t border-b border-marvel-black-border"
        >
          {items.map((item) => (
            <motion.div key={item.id} variants={staggerItemVariants} className="flex gap-5 py-6">
              <div className="relative w-24 h-24 shrink-0 bg-marvel-black-border">
                <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans font-600 text-marvel-white mb-1">{item.productName}</h3>
                <p className="font-sans text-xs text-marvel-white-muted mb-3">{item.variantLabel}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-marvel-black-border">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-marvel-white-muted hover:text-marvel-white hover:bg-marvel-black-hover">
                      <Minus size={12} />
                    </button>
                    <span className="px-4 font-sans text-sm text-marvel-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.maxStock} className="p-2 text-marvel-white-muted hover:text-marvel-white hover:bg-marvel-black-hover disabled:opacity-40">
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-display text-xl text-marvel-red">{formatPrice(item.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-marvel-white-muted hover:text-marvel-red transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Order Summary */}
        <div className="bg-marvel-black-card border border-marvel-black-border p-6 h-fit sticky top-24">
          <h2 className="font-display text-2xl text-marvel-white tracking-wide mb-6">ORDER SUMMARY</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between font-sans text-sm">
              <span className="text-marvel-white-muted">Subtotal</span>
              <span className="text-marvel-white">{formatPrice(sub)}</span>
            </div>
            <div className="flex justify-between font-sans text-sm">
              <span className="text-marvel-white-muted">Delivery</span>
              <span className={delivery === 0 ? "text-emerald-400" : "text-marvel-white"}>
                {delivery === 0 ? "FREE" : formatPrice(delivery)}
              </span>
            </div>
            {sub < FREE_SHIPPING_THRESHOLD && (
              <p className="font-sans text-xs text-marvel-white-muted">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - sub)} more for free shipping
              </p>
            )}
          </div>
          <div className="border-t border-marvel-black-border pt-4 mb-6">
            <div className="flex justify-between">
              <span className="font-sans font-600 text-marvel-white">Total</span>
              <span className="font-display text-3xl text-marvel-red">{formatPrice(total)}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-marvel w-full justify-between mb-3">
            Proceed to Checkout <ArrowRight size={16} />
          </Link>
          <Link href="/shop" className="btn-ghost w-full text-center text-sm">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
