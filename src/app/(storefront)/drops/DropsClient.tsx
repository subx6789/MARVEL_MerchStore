"use client";

// ─────────────────────────────────────────────────────────
// DropsClient — Live, Scheduled & Ended Drops
// Powered by useProductStore — No static hardcoded mock data
// ─────────────────────────────────────────────────────────
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, PackagePlus, ShieldAlert } from "lucide-react";
import DropCountdown from "@/components/drops/DropCountdown";
import MarvelBadge from "@/components/shared/MarvelBadge";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/motion/variants";
import { useProductStore, type DropItem } from "@/stores/productStore";
import { useAuthStore } from "@/stores/authStore";
import { formatPrice } from "@/lib/utils";

export default function DropsClient() {
  const { drops } = useProductStore();
  const { user } = useAuthStore();

  const live = drops.filter((d) => d.status === "live");
  const scheduled = drops.filter((d) => d.status === "scheduled");
  const ended = drops.filter((d) => d.status === "ended");

  if (drops.length === 0) {
    return (
      <div className="py-20 text-center bg-[#14141c] border border-[#1e1e2a] rounded-xs p-8 max-w-xl mx-auto text-white">
        <Zap size={48} className="text-[#f0b429] mx-auto mb-4 animate-bounce" />
        <h2 className="font-display text-3xl text-white tracking-widest uppercase mb-2">NO DROPS SCHEDULED</h2>
        <p className="font-sans text-sm text-gray-400 mb-6">
          There are currently no active or scheduled drop releases. Check back soon for exclusive MARVEL limited edition merchandise!
        </p>
        {user?.role === "admin" && (
          <Link href="/admin/drops" className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-xs font-black">
            <PackagePlus size={16} />
            Create New Drop in Admin
          </Link>
        )}
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
      {/* Live */}
      {live.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-3xl text-white tracking-wide uppercase font-extrabold">LIVE NOW</h2>
            <span className="bg-red-500 text-white text-xs font-black px-3 py-1 uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_12px_rgba(226,54,54,0.8)]">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Active
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {live.map((drop) => (
              <DropCard key={drop.id} drop={drop} />
            ))}
          </div>
        </div>
      )}

      {/* Scheduled */}
      {scheduled.length > 0 && (
        <div className="mb-12">
          <h2 className="font-display text-3xl text-white tracking-wide uppercase font-extrabold mb-6">COMING SOON</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {scheduled.map((drop) => (
              <DropCard key={drop.id} drop={drop} />
            ))}
          </div>
        </div>
      )}

      {/* Ended */}
      {ended.length > 0 && (
        <div>
          <h2 className="font-display text-3xl text-gray-500 tracking-wide uppercase font-extrabold mb-6">SOLD OUT</h2>
          <div className="grid md:grid-cols-2 gap-6 opacity-60">
            {ended.map((drop) => (
              <DropCard key={drop.id} drop={drop} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function DropCard({ drop }: { drop: DropItem }) {
  const remaining = Math.max(0, drop.totalStock - drop.soldCount);
  const soldPercent = drop.totalStock > 0 ? Math.round((drop.soldCount / drop.totalStock) * 100) : 0;
  const isLive = drop.status === "live";
  const isScheduled = drop.status === "scheduled";
  const isSoldOut = drop.status === "ended" || remaining === 0;

  const discountPercent = drop.comparePrice && drop.comparePrice > drop.price
    ? Math.round(((drop.comparePrice - drop.price) / drop.comparePrice) * 100)
    : 0;

  return (
    <motion.div variants={staggerItemVariants}>
      <div
        className={`bg-[#14141c] border ${
          isLive ? "border-red-500 shadow-[0_0_20px_rgba(226,54,54,0.3)]" : "border-[#1e1e2a]"
        } p-6 relative overflow-hidden group hover:border-red-500 transition-colors duration-300 rounded-xs`}
      >
        {isLive && <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 shadow-[0_0_12px_rgba(226,54,54,0.8)]" />}

        {/* Drop Banner Image */}
        {drop.imageUrl && (
          <div className="h-44 -mx-6 -mt-6 mb-4 overflow-hidden relative bg-[#08080c]">
            <img
              src={drop.imageUrl}
              alt={drop.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14141c] via-[#14141c]/30 to-transparent" />
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {isLive && <MarvelBadge variant="live" />}
              {isScheduled && <MarvelBadge variant="limited" />}
              {isSoldOut && <MarvelBadge variant="sold-out" />}
              {discountPercent > 0 && (
                <span className="bg-emerald-500 text-black text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <h3 className="font-display text-2xl text-white tracking-wide leading-tight font-extrabold">
              {drop.name}
            </h3>
          </div>
          <div className="text-right shrink-0 ml-4">
            <span className="font-display text-3xl text-red-500 font-extrabold block">
              {formatPrice(drop.price)}
            </span>
            {drop.comparePrice && discountPercent > 0 && (
              <span className="font-sans text-xs text-gray-500 line-through block -mt-1">
                {formatPrice(drop.comparePrice)}
              </span>
            )}
          </div>
        </div>

        <p className="font-sans text-xs text-gray-400 mb-6 leading-relaxed">
          {drop.description}
        </p>

        {/* Countdown */}
        {(isLive || isScheduled) && (
          <div className="mb-6">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">
              {isLive ? "Ends in" : "Starts in"}
            </p>
            <DropCountdown targetDate={new Date(isLive ? drop.endsAt : drop.startsAt)} showLabels size="sm" />
          </div>
        )}

        {/* Stock bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-sans mb-1.5">
            <span className="text-gray-400">{drop.soldCount} sold</span>
            <span className={remaining < 50 ? "text-red-500 font-bold" : "text-gray-400"}>
              {isSoldOut ? "Sold out" : `${remaining} remaining`}
            </span>
          </div>
          <div className="h-1 bg-[#1e1e2a] rounded-full overflow-hidden">
            <div className="h-full bg-red-500 transition-all" style={{ width: `${soldPercent}%` }} />
          </div>
        </div>

        <Link
          href={isSoldOut ? "#" : `/product/${drop.slug}`}
          className={
            isSoldOut
              ? "btn-outline w-full text-center opacity-50 cursor-not-allowed pointer-events-none text-xs"
              : "btn-marvel w-full justify-between text-xs py-3"
          }
        >
          {isSoldOut ? "Sold Out" : isScheduled ? "Notify Me" : "Buy Now"}
          {!isSoldOut && <ArrowRight size={16} />}
        </Link>
      </div>
    </motion.div>
  );
}
