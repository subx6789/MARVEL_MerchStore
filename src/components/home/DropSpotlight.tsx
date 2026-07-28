"use client";

// ─────────────────────────────────────────────────────────
// Drop Spotlight — Dynamic Live/Upcoming Drop Feature Block
// Powered by useProductStore — No static hardcoded mock data
// ─────────────────────────────────────────────────────────
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Shield } from "lucide-react";
import DropCountdown from "@/components/drops/DropCountdown";
import { fadeUpVariants, staggerContainerVariants } from "@/lib/motion/variants";
import { useProductStore } from "@/stores/productStore";
import { formatPrice } from "@/lib/utils";

export default function DropSpotlight() {
  const { drops } = useProductStore();

  // Find live drop or scheduled drop
  const drop = drops.find((d) => d.status === "live") || drops[0];

  if (!drop) {
    return null; // Don't show drop spotlight if no drops exist
  }

  const remaining = Math.max(0, drop.totalStock - drop.soldCount);
  const stockPercent = drop.totalStock > 0 ? Math.round((drop.soldCount / drop.totalStock) * 100) : 0;
  const isLive = drop.status === "live";

  return (
    <section className="bg-[#08080c] border-y border-[#1e1e2a] py-16 md:py-20 overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-10 items-center"
        >
          {/* Left — Drop Info */}
          <div>
            <motion.div variants={fadeUpVariants} className="flex items-center gap-3 mb-6">
              {isLive ? (
                <span className="bg-red-500 text-white text-xs font-black px-3 py-1 uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_12px_rgba(226,54,54,0.8)]">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Drop Live Now
                </span>
              ) : (
                <span className="bg-[#f0b429] text-black text-xs font-black px-3 py-1 uppercase tracking-widest">
                  Scheduled Drop
                </span>
              )}
            </motion.div>

            <motion.h2
              variants={fadeUpVariants}
              className="font-display text-4xl md:text-5xl text-white leading-none mb-4 tracking-wide font-black uppercase"
            >
              {drop.name}
            </motion.h2>

            <motion.p variants={fadeUpVariants} className="font-sans text-gray-400 text-sm mb-8 leading-relaxed">
              {drop.description}
            </motion.p>

            {/* Countdown */}
            <motion.div variants={fadeUpVariants} className="mb-8">
              <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">
                {isLive ? "Drop Ends In" : "Drop Starts In"}
              </p>
              <DropCountdown targetDate={new Date(isLive ? drop.endsAt : drop.startsAt)} showLabels size="md" />
            </motion.div>

            {/* Stock Bar */}
            <motion.div variants={fadeUpVariants} className="mb-8">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-gray-400">{drop.soldCount} sold</span>
                <span className={remaining < 50 ? "text-red-500 font-bold" : "text-gray-300"}>
                  {remaining} remaining
                </span>
              </div>
              <div className="h-1.5 bg-[#1e1e2a] overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${stockPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-red-500"
                />
              </div>
            </motion.div>

            {/* Price + CTA */}
            <motion.div variants={fadeUpVariants} className="flex items-center gap-6">
              <span className="font-display text-4xl text-red-500 font-black">
                {formatPrice(drop.price)}
              </span>
              <Link href={`/product/${drop.slug}`} className="btn-marvel gap-2 py-3 px-6 text-xs">
                <Zap size={14} />
                Buy Drop Now
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Right — Visual Graphic */}
          <motion.div variants={fadeUpVariants} className="relative">
            <div className="relative aspect-square bg-[#14141c] border border-[#1e1e2a] overflow-hidden group rounded-xs shadow-2xl">
              {drop.imageUrl ? (
                <img
                  src={drop.imageUrl}
                  alt={drop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-linear-to-br from-red-600/10 via-transparent to-amber-500/5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield size={180} className="text-red-500/20" strokeWidth={0.5} />
                  </div>
                </>
              )}
              <div className="absolute top-0 left-0 bg-red-600 px-4 py-2 z-10">
                <span className="font-display text-white text-xs tracking-widest font-black uppercase">
                  LIMITED DROP
                </span>
              </div>
            </div>

            <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-[#f0b429] text-black p-4 flex flex-col items-center gap-1 shadow-2xl">
              <span className="font-display text-3xl leading-none font-black">{remaining}</span>
              <span className="font-sans text-[9px] font-extrabold tracking-wider uppercase">Left</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
