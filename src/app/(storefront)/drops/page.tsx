// ─────────────────────────────────────────────────────────
// Drops Page — Live & Upcoming Limited Drops
// ─────────────────────────────────────────────────────────
import type { Metadata } from "next";
import { Suspense } from "react";
import DropsClient from "./DropsClient";
import { DropCardSkeleton } from "@/components/shared/Skeletons";

export const metadata: Metadata = {
  title: "Limited Drops — MARVEL MerchStore",
  description: "Live and upcoming MARVEL limited drops. Exclusive merchandise in limited quantities. Drop fast, move faster.",
};

export default function DropsPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative bg-marvel-black-soft border-b border-marvel-black-border py-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-marvel-red/5 to-transparent" />
        <div className="max-w-screen-xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge-live">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Live Drops Active
            </span>
          </div>
          <h1 className="font-display text-hero-lg text-marvel-white tracking-wide mb-4">
            LIMITED DROPS
          </h1>
          <p className="font-sans text-marvel-white-dim max-w-xl">
            Exclusive releases in limited quantities. Once they&apos;re gone, they&apos;re history. No restocks. No exceptions.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
        <Suspense fallback={
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({length: 4}).map((_, i) => <DropCardSkeleton key={i} />)}
          </div>
        }>
          <DropsClient />
        </Suspense>
      </div>
    </div>
  );
}
