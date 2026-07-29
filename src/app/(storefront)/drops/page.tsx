// ─────────────────────────────────────────────────────────
// Drops Page — Live & Upcoming Limited Drops
// ─────────────────────────────────────────────────────────
import type { Metadata } from "next";
import { Suspense } from "react";
import DropsClient from "./DropsClient";
import { DropCardSkeleton } from "@/components/shared/Skeletons";

export const metadata: Metadata = {
  title: "Limited Drops — MARVEL MerchStore",
  description:
    "Live and upcoming MARVEL limited drops. Exclusive merchandise in limited quantities. Drop fast, move faster.",
};

export default function DropsPage() {
  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 md:px-8 pb-12">
      <Suspense
        fallback={
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <DropCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <DropsClient />
      </Suspense>
    </div>
  );
}
