// ─────────────────────────────────────────────────────────
// Returns & Exchange Policy Page
// ─────────────────────────────────────────────────────────
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns — MARVEL MerchStore" };

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-6">
      <h1 className="font-display text-hero-md text-marvel-white tracking-wide">RETURNS & EXCHANGES</h1>
      <div className="bg-marvel-black-card border border-marvel-black-border p-6 space-y-4 font-sans text-sm text-marvel-white-muted leading-relaxed">
        <p>Due to the limited and exclusive nature of our drops, size exchanges are subject to stock availability.</p>
        <h3 className="font-display text-xl text-marvel-white pt-2">7-Day Guarantee</h3>
        <p>If you receive a defective or damaged collector item, contact support within 7 days of delivery for an immediate replacement or full refund.</p>
      </div>
    </div>
  );
}
