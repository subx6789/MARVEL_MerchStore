// ─────────────────────────────────────────────────────────
// Shop Page — Full product listing with filters
// ─────────────────────────────────────────────────────────
import type { Metadata } from "next";
import { Suspense } from "react";
import ShopClient from "./ShopClient";
import { ProductGridSkeleton } from "@/components/shared/Skeletons";

export const metadata: Metadata = {
  title: "Shop — All Marvel Merch",
  description:
    "Browse the complete MARVEL MerchStore collection. Apparel, accessories, collectibles, and event exclusives.",
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
    page?: string;
  }>;
}) {
  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 md:px-8 pb-12">
      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <ShopClient searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
