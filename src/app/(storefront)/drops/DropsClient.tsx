"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import DropCountdown from "@/components/drops/DropCountdown";
import MarvelBadge from "@/components/shared/MarvelBadge";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/motion/variants";
import { formatPrice } from "@/lib/utils";

const DROPS = [
  { id: "1", name: "Iron Man Mark 85 Armor Tee", description: "The ultimate Iron Man collectible tee. Screen-printed with the full Mark 85 suit schematic.", price: 2499, totalStock: 500, soldCount: 253, status: "live" as const, startsAt: new Date(Date.now() - 3 * 3600000), endsAt: new Date(Date.now() + 6 * 3600000), slug: "iron-man-mark-85-armor-tee" },
  { id: "2", name: "Spider-Man No Way Home Hoodie", description: "All three Spider-Men, one hoodie. Limited collector's edition.", price: 3999, totalStock: 300, soldCount: 0, status: "scheduled" as const, startsAt: new Date(Date.now() + 2 * 86400000), endsAt: new Date(Date.now() + 4 * 86400000), slug: "spider-man-no-way-home-hoodie" },
  { id: "3", name: "Avengers Endgame Legacy Set", description: "The complete set. Six collector pieces for the six original Avengers.", price: 12999, totalStock: 100, soldCount: 100, status: "ended" as const, startsAt: new Date(Date.now() - 10 * 86400000), endsAt: new Date(Date.now() - 3 * 86400000), slug: "avengers-endgame-legacy-set" },
  { id: "4", name: "Black Panther Vibranium Jacket", description: "Wakanda's finest. Limited to 150 pieces worldwide.", price: 8999, totalStock: 150, soldCount: 12, status: "scheduled" as const, startsAt: new Date(Date.now() + 7 * 86400000), endsAt: new Date(Date.now() + 10 * 86400000), slug: "black-panther-vibranium-jacket" },
];

export default function DropsClient() {
  const live = DROPS.filter((d) => d.status === "live");
  const scheduled = DROPS.filter((d) => d.status === "scheduled");
  const ended = DROPS.filter((d) => d.status === "ended");

  return (
    <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
      {/* Live */}
      {live.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-display-sm text-marvel-white tracking-wide">LIVE NOW</h2>
            <span className="badge-live"><span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Active</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {live.map((drop) => <DropCard key={drop.id} drop={drop} />)}
          </div>
        </div>
      )}

      {/* Scheduled */}
      {scheduled.length > 0 && (
        <div className="mb-12">
          <h2 className="font-display text-display-sm text-marvel-white tracking-wide mb-6">COMING SOON</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {scheduled.map((drop) => <DropCard key={drop.id} drop={drop} />)}
          </div>
        </div>
      )}

      {/* Ended */}
      {ended.length > 0 && (
        <div>
          <h2 className="font-display text-display-sm text-marvel-white-muted tracking-wide mb-6">SOLD OUT</h2>
          <div className="grid md:grid-cols-2 gap-6 opacity-60">
            {ended.map((drop) => <DropCard key={drop.id} drop={drop} />)}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function DropCard({ drop }: { drop: typeof DROPS[0] }) {
  const remaining = drop.totalStock - drop.soldCount;
  const soldPercent = Math.round((drop.soldCount / drop.totalStock) * 100);
  const isLive = drop.status === "live";
  const isScheduled = drop.status === "scheduled";
  const isSoldOut = drop.status === "ended" || remaining === 0;

  return (
    <motion.div variants={staggerItemVariants}>
      <div className={`bg-marvel-black-card border ${isLive ? "border-marvel-red" : "border-marvel-black-border"} p-6 relative overflow-hidden group hover:border-marvel-red transition-colors duration-300`}>
        {isLive && <div className="absolute top-0 left-0 right-0 h-0.5 bg-marvel-red glow-red" />}

        <div className="flex items-start justify-between mb-4">
          <div>
            {isLive && <MarvelBadge variant="live" className="mb-2" />}
            {isScheduled && <MarvelBadge variant="limited" className="mb-2" />}
            {isSoldOut && <MarvelBadge variant="sold-out" className="mb-2" />}
            <h3 className="font-display text-2xl text-marvel-white tracking-wide leading-tight">
              {drop.name}
            </h3>
          </div>
          <span className="font-display text-3xl text-marvel-red shrink-0 ml-4">
            {formatPrice(drop.price)}
          </span>
        </div>

        <p className="font-sans text-sm text-marvel-white-dim mb-6 leading-relaxed">
          {drop.description}
        </p>

        {/* Countdown */}
        {(isLive || isScheduled) && (
          <div className="mb-6">
            <p className="label-marvel text-marvel-red mb-2">
              {isLive ? "Ends in" : "Starts in"}
            </p>
            <DropCountdown targetDate={isLive ? drop.endsAt : drop.startsAt} showLabels size="sm" />
          </div>
        )}

        {/* Stock bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-sans mb-1.5">
            <span className="text-marvel-white-muted">{drop.soldCount} sold</span>
            <span className={remaining < 50 ? "text-marvel-red font-600" : "text-marvel-white-muted"}>
              {isSoldOut ? "Sold out" : `${remaining} remaining`}
            </span>
          </div>
          <div className="h-1 bg-marvel-black-border">
            <div className="h-full bg-marvel-red transition-all" style={{ width: `${soldPercent}%` }} />
          </div>
        </div>

        <Link
          href={isSoldOut ? "#" : `/product/${drop.slug}`}
          className={isSoldOut ? "btn-outline w-full text-center opacity-50 cursor-not-allowed pointer-events-none" : "btn-marvel w-full justify-between"}
        >
          {isSoldOut ? "Sold Out" : isScheduled ? "Notify Me" : "Buy Now"}
          {!isSoldOut && <ArrowRight size={16} />}
        </Link>
      </div>
    </motion.div>
  );
}
