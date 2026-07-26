"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { QrCode, ArrowRight, MapPin, Calendar } from "lucide-react";
import { fadeUpVariants, staggerContainerVariants } from "@/lib/motion/variants";

const EVENTS = [
  { id: "1", name: "MARVEL COMIC CON 2026", venue: "MMRDA Grounds, Mumbai", date: "Aug 15–17, 2026", products: 24, slug: "comic-con-mumbai-2026", isActive: true },
  { id: "2", name: "AVENGERS EXPO DELHI", venue: "Pragati Maidan, New Delhi", date: "Sep 5–7, 2026", products: 18, slug: "avengers-expo-delhi", isActive: false },
];

export default function EventMerchBlock() {
  return (
    <section className="bg-marvel-black-soft border-y border-marvel-black-border py-16 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUpVariants} className="flex items-baseline justify-between mb-10">
            <div>
              <p className="label-marvel text-marvel-gold mb-2">Event Exclusives</p>
              <h2 className="font-display text-hero-md text-marvel-white tracking-wide">
                VIP ACCESS
              </h2>
            </div>
            <Link href="/events" className="label-marvel hover:text-marvel-white transition-colors flex items-center gap-1.5 group">
              All Events <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {EVENTS.map((event) => (
              <motion.div key={event.id} variants={fadeUpVariants}>
                <Link href={`/events/${event.slug}`} className="block group">
                  <div className="bg-marvel-black-card border border-marvel-black-border hover:border-marvel-gold transition-colors duration-300 p-8 relative overflow-hidden">
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-marvel-gold/5 blur-3xl rounded-full pointer-events-none" />

                    <div className="flex items-start justify-between mb-6">
                      <div>
                        {event.isActive && (
                          <span className="badge-live mb-3 inline-flex">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Active
                          </span>
                        )}
                        <h3 className="font-display text-2xl md:text-3xl text-marvel-white tracking-wide leading-tight">
                          {event.name}
                        </h3>
                      </div>
                      <div className="w-12 h-12 bg-marvel-gold/10 border border-marvel-gold/30 flex items-center justify-center shrink-0">
                        <QrCode size={24} className="text-marvel-gold" />
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-marvel-white-dim">
                        <MapPin size={14} className="text-marvel-gold shrink-0" />
                        <span className="font-sans text-sm">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-marvel-white-dim">
                        <Calendar size={14} className="text-marvel-gold shrink-0" />
                        <span className="font-sans text-sm">{event.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-marvel-black-border">
                      <span className="badge-vip">
                        {event.products} Exclusive Products
                      </span>
                      <span className="label-marvel group-hover:text-marvel-gold transition-colors flex items-center gap-1">
                        Scan QR to Access <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
