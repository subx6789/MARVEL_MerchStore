"use client";

// ─────────────────────────────────────────────────────────
// Event Merch Block — Dynamic VIP Event Access Block
// Powered by useProductStore — No static hardcoded mock data
// ─────────────────────────────────────────────────────────
import { motion } from "framer-motion";
import Link from "next/link";
import { QrCode, ArrowRight, MapPin, Calendar, Clock } from "lucide-react";
import { fadeUpVariants, staggerContainerVariants } from "@/lib/motion/variants";
import { useProductStore } from "@/stores/productStore";
import DropCountdown from "@/components/drops/DropCountdown";
import { soundFx } from "@/lib/sound";

export default function EventMerchBlock() {
  const { events } = useProductStore();

  if (events.length === 0) {
    return null; // Clean: Don't render block if no events created yet in Admin
  }

  return (
    <section className="bg-[#08080c] border-y border-[#1e1e2a] py-16 md:py-20 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUpVariants} className="flex items-baseline justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Event Exclusives</p>
              <h2 className="font-display text-4xl text-white tracking-wide uppercase font-extrabold">
                VIP ACCESS
              </h2>
            </div>
            <Link
              href="/events"
              onClick={() => soundFx.playClick()}
              className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1.5 group"
            >
              All Events <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <motion.div key={event.id} variants={fadeUpVariants}>
                <Link
                  href={`/events/${event.slug}`}
                  onClick={() => soundFx.playClick()}
                  className="block group"
                >
                  <div className="bg-[#14141c] border border-[#1e1e2a] hover:border-amber-400 transition-colors duration-300 relative overflow-hidden rounded-xs shadow-xl">
                    {event.bannerUrl && (
                      <div className="relative h-40 w-full overflow-hidden bg-[#08080c] border-b border-[#1e1e2a]">
                        <img
                          src={event.bannerUrl}
                          alt={event.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#14141c] via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        {event.status === "live" && (
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-500/30 uppercase tracking-widest mb-3 inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Active Gate
                          </span>
                        )}
                        <h3 className="font-display text-2xl md:text-3xl text-white tracking-wide font-extrabold leading-tight">
                          {event.name}
                        </h3>
                      </div>
                      <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                        <QrCode size={24} className="text-amber-400" />
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={14} className="text-amber-400 shrink-0" />
                        <span className="font-sans text-sm">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={14} className="text-amber-400 shrink-0" />
                        <span className="font-sans text-sm">{event.date}</span>
                      </div>
                      {event.startDate && (
                        <div className="pt-2 border-t border-[#1e1e2a]/60">
                          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                            <Clock size={12} /> Event Launch Countdown
                          </p>
                          <DropCountdown targetDate={event.startDate} size="sm" showLabels={true} />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-[#1e1e2a]">
                      <span className="bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] text-[10px] font-black px-2.5 py-0.5 tracking-widest uppercase">
                        {event.productsCount} Exclusive Products
                      </span>
                      <span className="text-xs font-bold text-gray-400 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                        Scan QR to Access <ArrowRight size={12} />
                      </span>
                    </div>
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
