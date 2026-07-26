"use client";
// ─────────────────────────────────────────────────────────
// Drop Spotlight — Live/Upcoming drop feature block
// ─────────────────────────────────────────────────────────
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Shield } from "lucide-react";
import DropCountdown from "@/components/drops/DropCountdown";
import { fadeUpVariants, staggerContainerVariants } from "@/lib/motion/variants";

// Demo data — replace with Supabase query
const FEATURED_DROP = {
  id: "demo-drop-1",
  name: "IRON MAN MARK 85 ARMOR TEE",
  subtitle: "Limited Edition — 500 Pieces Only",
  price: 2499,
  totalStock: 500,
  remainingStock: 247,
  status: "live" as const,
  startsAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
  productSlug: "iron-man-mark-85-armor-tee",
};

export default function DropSpotlight() {
  const drop = FEATURED_DROP;
  const stockPercent = Math.round(
    ((drop.totalStock - drop.remainingStock) / drop.totalStock) * 100
  );

  return (
    <section className="bg-marvel-black-soft border-y border-marvel-black-border py-16 md:py-20 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
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
              <span className="badge-live">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Drop Live Now
              </span>
              <span className="badge-limited">Limited</span>
            </motion.div>

            <motion.h2
              variants={fadeUpVariants}
              className="font-display text-hero-lg text-marvel-white leading-none mb-4 tracking-wide"
            >
              {drop.name}
            </motion.h2>

            <motion.p
              variants={fadeUpVariants}
              className="font-sans text-marvel-white-dim mb-8"
            >
              {drop.subtitle}
            </motion.p>

            {/* Countdown */}
            <motion.div variants={fadeUpVariants} className="mb-8">
              <p className="label-marvel text-marvel-red mb-3">Drop Ends In</p>
              <DropCountdown targetDate={drop.endsAt} showLabels size="md" />
            </motion.div>

            {/* Stock Bar */}
            <motion.div variants={fadeUpVariants} className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs text-marvel-white-muted">
                  {drop.totalStock - drop.remainingStock} sold
                </span>
                <span className={`font-sans text-xs font-600 ${
                  drop.remainingStock < 50 ? "text-marvel-red" : "text-marvel-white-dim"
                }`}>
                  {drop.remainingStock} remaining
                </span>
              </div>
              <div className="h-1.5 bg-marvel-black-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${stockPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-marvel-red"
                />
              </div>
              {drop.remainingStock < 50 && (
                <p className="font-sans text-xs text-marvel-red mt-1.5 flex items-center gap-1.5">
                  <Zap size={10} />
                  Almost gone — move fast
                </p>
              )}
            </motion.div>

            {/* Price + CTA */}
            <motion.div variants={fadeUpVariants} className="flex items-center gap-6">
              <span className="font-display text-4xl text-marvel-red">
                ₹{drop.price.toLocaleString()}
              </span>
              <Link
                href={`/product/${drop.productSlug}`}
                className="btn-marvel gap-2"
              >
                <Zap size={14} />
                Buy Now
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Right — Visual Placeholder */}
          <motion.div
            variants={fadeUpVariants}
            className="relative"
          >
            <div className="relative aspect-square bg-marvel-black-card border border-marvel-black-border overflow-hidden group">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-marvel-red/10 via-transparent to-marvel-gold/5" />

              {/* Central graphic */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <Shield
                    size={180}
                    className="text-marvel-red/20"
                    strokeWidth={0.5}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-marvel-red/40" style={{ fontSize: "80px" }}>
                      IM
                    </span>
                  </div>
                </div>
              </div>

              {/* Shimmer on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              {/* Corner marks */}
              {[
                "top-4 left-4 border-t-2 border-l-2",
                "top-4 right-4 border-t-2 border-r-2",
                "bottom-4 left-4 border-b-2 border-l-2",
                "bottom-4 right-4 border-b-2 border-r-2",
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`absolute w-6 h-6 border-marvel-gold ${cls}`}
                />
              ))}

              {/* NEW label */}
              <div className="absolute top-0 left-0 bg-marvel-red px-4 py-2">
                <span className="font-display text-white text-sm tracking-widest">
                  NEW DROP
                </span>
              </div>
            </div>

            {/* Side stat */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-marvel-gold text-marvel-black p-4 flex flex-col items-center gap-1 shadow-glow-gold">
              <span className="font-display text-3xl leading-none">
                {drop.remainingStock}
              </span>
              <span className="font-sans text-[9px] font-700 tracking-wider uppercase">
                Left
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
