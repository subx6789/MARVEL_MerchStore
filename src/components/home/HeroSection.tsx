"use client";
// ─────────────────────────────────────────────────────────
// Hero Section — Cinematic homepage hero
// Full-viewport with animated typography
// ─────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { fadeUpVariants, staggerContainerVariants } from "@/lib/motion/variants";
import DropCountdown from "@/components/drops/DropCountdown";

// Hard-coded upcoming drop date (2 days from now for demo)
const DROP_DATE = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden bg-marvel-black"
      aria-label="Hero section"
    >
      {/* ── Background Grid Pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Red Gradient Accent ── */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-marvel-red/8 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-marvel-red/5 blur-3xl rounded-full pointer-events-none" />

      {/* ── Main Content ── */}
      <div className="flex-1 flex items-center px-4 md:px-8 lg:px-16 max-w-screen-2xl mx-auto w-full">
        <div className="w-full grid lg:grid-cols-2 gap-12 items-center pt-20 pb-12">

          {/* Left — Typography Block */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {/* Label */}
            <motion.div variants={fadeUpVariants} className="flex items-center gap-3 mb-6">
              <span className="badge-live">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Live Drop Active
              </span>
              <span className="label-marvel">Iron Man Collection 2026</span>
            </motion.div>

            {/* Main Headline */}
            <div className="overflow-hidden mb-2">
              <motion.h1
                variants={fadeUpVariants}
                className="font-display leading-none tracking-wide uppercase"
                style={{ fontSize: "clamp(4rem, 9vw, 9rem)" }}
              >
                <span className="text-marvel-white">WEAR</span>
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-2">
              <motion.div variants={fadeUpVariants}>
                <span
                  className="font-display leading-none tracking-wide uppercase text-gradient-marvel block"
                  style={{ fontSize: "clamp(4rem, 9vw, 9rem)" }}
                >
                  THE LEGEND
                </span>
              </motion.div>
            </div>

            {/* Sub copy */}
            <motion.p
              variants={fadeUpVariants}
              className="font-sans text-base md:text-lg text-marvel-white-dim mt-6 mb-8 max-w-md leading-relaxed"
            >
              Collector-grade apparel for true believers. Limited drops, event exclusives, and rare gear — crafted for those who live in the universe.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="/drops" className="btn-marvel gap-3">
                <Zap size={16} />
                Live Drops
              </Link>
              <Link href="/shop" className="btn-outline gap-3">
                Shop All
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={fadeUpVariants}
              className="flex items-center gap-8 mt-10 pt-8 border-t border-marvel-black-border"
            >
              {[
                { value: "500+", label: "Products" },
                { value: "12", label: "Active Drops" },
                { value: "50K+", label: "Collectors" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl text-marvel-white tracking-wide">{stat.value}</p>
                  <p className="label-marvel mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Product Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Card frame */}
            <div className="relative w-full max-w-md aspect-[3/4] bg-marvel-black-card border border-marvel-black-border overflow-hidden group">
              {/* Placeholder product image */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-marvel-black-card to-marvel-black"
                style={{
                  backgroundImage: `
                    linear-gradient(135deg, #1a0a0a 0%, #0A0A0A 60%, #1a0000 100%)
                  `,
                }}
              />

              {/* Iron Man silhouette placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-64 h-72 opacity-20"
                  style={{
                    background: `radial-gradient(ellipse at center, #E23636 0%, transparent 70%)`,
                  }}
                />
                <span
                  className="absolute font-display text-center leading-none"
                  style={{ fontSize: "180px", color: "rgba(226,54,54,0.08)" }}
                >
                  M
                </span>
              </div>

              {/* Product info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge-limited">Limited Edition</span>
                  <span className="badge-live">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Dropping Soon
                  </span>
                </div>
                <h3 className="font-display text-3xl text-marvel-white tracking-wide mb-1">
                  IRON MAN MARK 85
                </h3>
                <p className="font-sans text-sm text-marvel-white-dim mb-4">
                  Premium collector tee — limited to 500 pieces
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl text-marvel-red">₹2,499</span>
                  <span className="label-marvel text-marvel-gold">247 / 500 left</span>
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-marvel-red opacity-60" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-marvel-red opacity-60" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-marvel-red opacity-60" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-marvel-red opacity-60" />
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-marvel-red px-4 py-2 text-white font-display text-lg tracking-widest shadow-glow-red"
            >
              EXCLUSIVE
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-marvel-gold px-4 py-2 text-marvel-black font-display text-lg tracking-widest shadow-glow-gold"
            >
              DROP LIVE
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Countdown Strip ── */}
      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="border-t border-marvel-black-border bg-marvel-black-soft"
        >
          <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="label-marvel text-marvel-red mb-1">Next Drop In</p>
              <p className="font-sans text-sm text-marvel-white-muted">
                Iron Man Mark 85 Armor Tee — Limited 500 Pieces
              </p>
            </div>
            <DropCountdown targetDate={DROP_DATE} showLabels />
            <Link href="/drops" className="btn-marvel shrink-0">
              Get Notified
            </Link>
          </div>
        </motion.div>
      )}
    </section>
  );
}
