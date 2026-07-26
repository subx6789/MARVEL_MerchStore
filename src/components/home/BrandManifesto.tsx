"use client";
import { motion } from "framer-motion";
import { Zap, Shield, Star } from "lucide-react";
import { fadeUpVariants, staggerContainerVariants } from "@/lib/motion/variants";

export default function BrandManifesto() {
  return (
    <section className="section-marvel">
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-4xl mx-auto text-center"
      >
        <motion.p variants={fadeUpVariants} className="label-marvel text-marvel-red mb-4">
          The Collector's Creed
        </motion.p>

        <motion.h2
          variants={fadeUpVariants}
          className="font-display text-hero-lg text-marvel-white tracking-wide leading-none mb-8"
        >
          NOT MERCH.
          <br />
          <span className="text-gradient-marvel">MYTHOLOGY.</span>
        </motion.h2>

        <motion.p
          variants={fadeUpVariants}
          className="font-sans text-lg text-marvel-white-dim leading-relaxed mb-12 max-w-2xl mx-auto"
        >
          Every piece in the MARVEL MerchStore is crafted with the weight of the universe behind it. These aren't products — they are artifacts. Collector-grade expressions of the stories that shaped a generation.
        </motion.p>

        {/* Pillars */}
        <motion.div variants={fadeUpVariants} className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: Zap,
              title: "RARE BY DESIGN",
              desc: "Limited drops guarantee scarcity. Once it's gone, it's part of history.",
              color: "text-marvel-red",
            },
            {
              icon: Shield,
              title: "BUILT TO LAST",
              desc: "Premium materials, obsessive quality control. Worthy of the vault.",
              color: "text-marvel-gold",
            },
            {
              icon: Star,
              title: "VIP FIRST",
              desc: "Event attendees get exclusive access. The rarest drops never go public.",
              color: "text-purple-400",
            },
          ].map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-marvel-black-card border border-marvel-black-border p-6 text-left group hover:border-marvel-red transition-colors"
              >
                <Icon size={28} className={`${pillar.color} mb-4`} />
                <h3 className="font-display text-xl text-marvel-white tracking-widest mb-3">
                  {pillar.title}
                </h3>
                <p className="font-sans text-sm text-marvel-white-muted leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
