// ─────────────────────────────────────────────────────────
// HOMEPAGE — MARVEL MerchStore
// The flagship launch experience
// ─────────────────────────────────────────────────────────
import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import DropSpotlight from "@/components/home/DropSpotlight";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import BestSellers from "@/components/home/BestSellers";
import EventMerchBlock from "@/components/home/EventMerchBlock";
import BrandManifesto from "@/components/home/BrandManifesto";
import { ProductGridSkeleton } from "@/components/shared/Skeletons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MARVEL MerchStore — Collector-Grade Drops & Event Exclusives",
  description:
    "Official MARVEL luxury merch. Limited drops, event-exclusive gear, and collector-grade apparel. Shop rare, wear rare.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Cinematic Hero */}
      <HeroSection />

      {/* 2. Live Drop Spotlight */}
      <Suspense fallback={<DropSpotlightSkeleton />}>
        <DropSpotlight />
      </Suspense>

      {/* 3. Featured Collections Grid */}
      <FeaturedCollections />

      {/* 4. Best Sellers */}
      <section className="section-marvel">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-hero-md text-marvel-white tracking-wide">
            BEST SELLERS
          </h2>
          <a href="/shop?sort=popular" className="label-marvel hover:text-marvel-red transition-colors">
            View All →
          </a>
        </div>
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <BestSellers />
        </Suspense>
      </section>

      {/* 5. Event Merch Block */}
      <Suspense fallback={<div className="h-64 skeleton" />}>
        <EventMerchBlock />
      </Suspense>

      {/* 6. Brand Manifesto / Story */}
      <BrandManifesto />
    </>
  );
}

// ── Local skeletons ──────────────────────────────────────
function DropSpotlightSkeleton() {
  return (
    <div className="section-marvel">
      <div className="h-80 skeleton" />
    </div>
  );
}
