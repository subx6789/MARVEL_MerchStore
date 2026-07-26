// ─────────────────────────────────────────────────────────
// FAQ & Help Page
// ─────────────────────────────────────────────────────────
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ — MARVEL MerchStore" };

const FAQS = [
  { q: "What makes MARVEL MerchStore products collector-grade?", a: "Every item is official Marvel licensed merch crafted from heavyweight organic fabrics, premium hardware, and screen-printed graphics with custom numbered collector tags." },
  { q: "How do limited drops work?", a: "Limited drops release at scheduled times in fixed quantities. Once a drop sells out, it will not be restocked." },
  { q: "How do I use my Marvel Event QR Pass?", a: "Visit the Event portal page or scan your physical event ticket QR code at the event gate to unlock exclusive products available only to attendees." },
  { q: "What are your shipping timelines?", a: "Insured vault delivery typically takes 3 to 5 business days across India. Orders above ₹1,999 qualify for free shipping." },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <h1 className="font-display text-hero-md text-marvel-white tracking-wide mb-8">FREQUENTLY ASKED QUESTIONS</h1>
      <div className="space-y-6">
        {FAQS.map((f, i) => (
          <div key={i} className="bg-marvel-black-card border border-marvel-black-border p-6 space-y-2">
            <h3 className="font-display text-xl text-marvel-white">{f.q}</h3>
            <p className="font-sans text-sm text-marvel-white-muted leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
