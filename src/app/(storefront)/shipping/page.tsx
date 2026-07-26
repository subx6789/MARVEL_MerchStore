// ─────────────────────────────────────────────────────────
// Shipping Policy Page
// ─────────────────────────────────────────────────────────
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping Policy — MARVEL MerchStore" };

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-6">
      <h1 className="font-display text-hero-md text-marvel-white tracking-wide">SHIPPING POLICY</h1>
      <div className="bg-marvel-black-card border border-marvel-black-border p-6 space-y-4 font-sans text-sm text-marvel-white-muted leading-relaxed">
        <p>All orders placed on the MARVEL MerchStore are packed in sealed collector-grade packaging and dispatched via insured air express logistics partners.</p>
        <h3 className="font-display text-xl text-marvel-white pt-2">Shipping Fees & Timelines</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Orders above ₹1,999: Free Insured Express Shipping (3–5 business days).</li>
          <li>Orders under ₹1,999: Flat ₹99 delivery fee.</li>
          <li>Limited drop items ship within 24 hours of drop completion.</li>
        </ul>
      </div>
    </div>
  );
}
