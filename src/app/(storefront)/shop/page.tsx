// ─────────────────────────────────────────────────────────
// Shop Page — Full product listing with filters
// ─────────────────────────────────────────────────────────
import type { Metadata } from "next";
import { Suspense } from "react";
import ShopClient from "./ShopClient";
import { ProductGridSkeleton } from "@/components/shared/Skeletons";

export const metadata: Metadata = {
  title: "Shop — All Marvel Merch",
  description: "Browse the complete MARVEL MerchStore collection. Apparel, accessories, collectibles, and event exclusives.",
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string; page?: string }>;
}) {
  return (
    <div>
      {/* Page Hero */}
      <div className="bg-marvel-black-soft border-b border-marvel-black-border py-16 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto">
          <p className="label-marvel text-marvel-red mb-3">The Collection</p>
          <h1 className="font-display text-hero-lg text-marvel-white tracking-wide">SHOP ALL</h1>
          <p className="font-sans text-marvel-white-dim mt-3">
            500+ collector-grade products. Limited drops. Event exclusives.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <ShopClient searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
