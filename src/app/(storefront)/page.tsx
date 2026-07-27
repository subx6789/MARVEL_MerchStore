// ─────────────────────────────────────────────────────────
// HOMEPAGE — MARVEL MerchStore & Vault Unified Experience
// Official Marvel Merch Store + Real-time Drops & Exclusives
// ─────────────────────────────────────────────────────────
import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import VaultGuarantees from "@/components/home/VaultGuarantees";
import DropSpotlight from "@/components/home/DropSpotlight";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import BestSellers from "@/components/home/BestSellers";
import EventMerchBlock from "@/components/home/EventMerchBlock";
import BrandManifesto from "@/components/home/BrandManifesto";
import { ProductGridSkeleton } from "@/components/shared/Skeletons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MARVEL MerchStore — Official Collector Drops & Event Exclusives",
  description:
    "Official MARVEL luxury merchandise, live drops, event-exclusive gear, and collector-grade apparel. Shop rare, wear rare.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Cinematic Hero with Official CSS Marvel Logo */}
      <HeroSection />

      {/* 2. Marvel Vault Standard Guarantees */}
      <VaultGuarantees />

      {/* 3. Live Drop Spotlight Terminal */}
      <Suspense fallback={<DropSpotlightSkeleton />}>
        <DropSpotlight />
      </Suspense>

      {/* 4. Superhero Factions & Categories Grid */}
      <FeaturedCollections />

      {/* 5. Best Sellers / Popular Collector Gear */}
      <section className="section-marvel">
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] block mb-1">
              FAN FAVOURITES
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-[#f5f5f0] tracking-wide uppercase">
              BEST SELLERS
            </h2>
          </div>
          <a
            href="/shop?sort=popular"
            className="text-xs font-bold uppercase tracking-widest text-amber-400 hover:text-white transition-colors"
          >
            Browse All Gear →
          </a>
        </div>
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <BestSellers />
        </Suspense>
      </section>

      {/* 6. Event Merch Block (Convention Floor Exclusives) */}
      <Suspense fallback={<div className="h-64 skeleton bg-gray-900" />}>
        <EventMerchBlock />
      </Suspense>

      {/* 7. Brand Manifesto / Collector Lore */}
      <BrandManifesto />
    </>
  );
}

// ── Local skeletons ──────────────────────────────────────
function DropSpotlightSkeleton() {
  return (
    <div className="section-marvel">
      <div className="h-80 skeleton bg-gray-900 border border-gray-800" />
    </div>
  );
}
