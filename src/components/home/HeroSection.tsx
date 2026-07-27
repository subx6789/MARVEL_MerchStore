"use client";

// ─────────────────────────────────────────────────────────
// Hero Section — Official MARVEL MerchStore
// High-octane cyber aesthetics, live stock progress, sound SFX
// Powered dynamically by useProductStore
// ─────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, QrCode, Shield, Sparkles, PackagePlus } from "lucide-react";
import { fadeUpVariants, staggerContainerVariants } from "@/lib/motion/variants";
import DropCountdown from "@/components/drops/DropCountdown";
import MarvelLogo from "@/components/shared/MarvelLogo";
import { useProductStore } from "@/stores/productStore";
import { useInventoryStore } from "@/stores/inventoryStore";
import { formatPrice } from "@/lib/utils";
import { soundFx } from "@/lib/sound";

const DROP_DATE = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const { products } = useProductStore();
  const { getStock } = useInventoryStore();

  const featuredProduct = products[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="relative min-h-[92vh] flex flex-col overflow-hidden bg-[#08080c] pt-24 pb-12"
      aria-label="Hero section"
    >
      {/* ── Cyber Stark Tech Grid Pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Ambient Radial Glow Canvas Elements ── */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#00f0ff]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-150 h-75 bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* ── Main Content Container ── */}
      <div className="flex-1 flex items-center px-4 md:px-8 lg:px-16 max-w-screen-2xl mx-auto w-full z-10">
        <div className="w-full grid lg:grid-cols-12 gap-12 items-center">

          {/* Left Block (7 Cols) — Main Copy & CTAs */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col text-white"
          >
            {/* Top Badges Header */}
            <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-[#e23636] text-white px-3 py-1 text-xs font-black tracking-widest uppercase shadow-[0_0_12px_rgba(226,54,54,0.6)]">
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                <span>OFFICIAL MARVEL MERCH STORE</span>
              </div>
              <span className="bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles size={12} />
                Exclusive Limited Drops
              </span>
            </motion.div>

            {/* Official Marvel Typography Heading */}
            <motion.div variants={fadeUpVariants} className="mb-4">
              <span className="text-xs font-bold text-amber-400 tracking-[0.3em] block mb-2">
                OFFICIAL APPAREL & COLLECTOR MERCHANDISE
              </span>
              <h1
                className="font-display leading-none tracking-tight uppercase text-white font-extrabold"
                style={{ fontSize: "clamp(3.2rem, 7.5vw, 7rem)" }}
              >
                WEAR YOUR FAVORITE{" "}
                <span className="text-gradient-marvel block">MARVEL HEROES.</span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              variants={fadeUpVariants}
              className="font-sans text-base md:text-lg text-gray-300 mb-8 max-w-xl leading-relaxed font-normal"
            >
              Authentic tees, hoodies, jackets, and limited drops for fans of all ages. High quality, official Marvel merchandise.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <Link
                href="/drops"
                onClick={() => soundFx.playClick()}
                onMouseEnter={() => soundFx.playHover()}
                className="btn-marvel gap-3 text-base px-8 py-4 shadow-[0_0_25px_rgba(226,54,54,0.5)]"
              >
                <Zap size={18} className="fill-current" />
                See Live Drops
              </Link>
              <Link
                href="/shop"
                onClick={() => soundFx.playClick()}
                onMouseEnter={() => soundFx.playHover()}
                className="btn-outline gap-3 text-base px-8 py-4 bg-gray-900/60 backdrop-blur-md border-gray-700"
              >
                Browse All Merch
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/unlock"
                onClick={() => soundFx.playUnlock()}
                onMouseEnter={() => soundFx.playHover()}
                className="btn-gold gap-2.5 text-base px-6 py-4"
              >
                <QrCode size={18} />
                QR Unlock
              </Link>
            </motion.div>

            {/* Guarantees Ticker */}
            <motion.div
              variants={fadeUpVariants}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1e1e2a]"
            >
              <div>
                <p className="font-display text-2xl md:text-3xl text-white tracking-wide font-black">100%</p>
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  Official Marvel
                </p>
              </div>
              <div>
                <p className="font-display text-2xl md:text-3xl text-[#00f0ff] tracking-wide font-black">FAST</p>
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  Express Delivery
                </p>
              </div>
              <div>
                <p className="font-display text-2xl md:text-3xl text-amber-400 tracking-wide font-black">FREE</p>
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  Shipping over ₹1,999
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Block (5 Cols) — Dynamic Live Product Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-md bg-[#14141c]/90 border border-red-500/40 p-6 shadow-[0_0_40px_rgba(0,0,0,0.9)] backdrop-blur-xl rounded-xs overflow-hidden group text-white">

              {/* Glowing Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-500" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-500" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-500" />

              {/* Card Header Tag */}
              <div className="flex items-center justify-between mb-4 border-b border-[#1e1e2a] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                  <span className="text-xs font-black text-white tracking-widest uppercase">
                    FEATURED MARVEL MERCH
                  </span>
                </div>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-2 py-0.5 border border-amber-400/30">
                  {featuredProduct ? (featuredProduct.badge?.toUpperCase() || "FEATURED") : "STORE READY"}
                </span>
              </div>

              {/* Showcase Container */}
              {featuredProduct ? (
                <div>
                  <div className="relative aspect-4/3 bg-[#0b0b10] border border-[#1e1e2a] rounded-xs overflow-hidden flex items-center justify-center mb-6 group-hover:border-red-500/50 transition-colors">
                    <img src={featuredProduct.imageUrl} alt={featuredProduct.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/80 px-2.5 py-1 border border-gray-700 text-[10px] font-bold text-amber-400 uppercase">
                      SKU: {featuredProduct.sku}
                    </div>
                  </div>

                  <div className="mb-6 bg-[#08080c] p-3 border border-[#1e1e2a]">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-gray-300 uppercase flex items-center gap-1.5">
                        <Shield size={14} className="text-red-500" />
                        Live Stock Remaining
                      </span>
                      <span className="text-red-400 font-mono font-bold animate-pulse">
                        {getStock(featuredProduct.id, featuredProduct.stockCount)} LEFT
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-red-600 via-amber-500 to-red-500" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Official Price</p>
                      <p className="font-display text-3xl text-white font-black">{formatPrice(featuredProduct.price)}</p>
                    </div>
                    <Link
                      href={`/product/${featuredProduct.slug}`}
                      onClick={() => soundFx.playAddToCart()}
                      className="btn-marvel px-6 py-3 text-xs gap-2"
                    >
                      <Zap size={14} />
                      View Item
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <MarvelLogo size="md" />
                  <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                    MARVEL STORE READY FOR PRODUCTS
                  </p>
                  <p className="text-[11px] text-gray-500 max-w-xs mx-auto leading-relaxed">
                    No products added yet. Add merchandise in the Admin Dashboard to display them live in the hero showcase!
                  </p>
                  <Link
                    href="/admin/products"
                    onClick={() => soundFx.playClick()}
                    className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black"
                  >
                    <PackagePlus size={14} />
                    Add Product in Admin
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Live Countdown Strip Footer */}
      {mounted && (
        <div className="mt-12 border-t border-[#1e1e2a] bg-[#0f0f15]/80 backdrop-blur-md">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse" />
              <div>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">NEXT GLOBAL DROP COUNTDOWN</p>
                <p className="text-sm font-semibold text-gray-300">Avengers End Game Special Re-issue Collection</p>
              </div>
            </div>

            <DropCountdown targetDate={DROP_DATE} showLabels />

            <Link
              href="/drops"
              onClick={() => soundFx.playClick()}
              className="btn-outline text-xs px-6 py-2.5 border-gray-700 hover:border-red-500 shrink-0"
            >
              Notify Me
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
