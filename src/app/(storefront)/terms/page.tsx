import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms of Service — MARVEL MerchStore" };
export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
      <h1 className="font-display text-4xl text-marvel-white">TERMS OF SERVICE</h1>
      <p className="font-sans text-sm text-marvel-white-muted">Official terms governing limited drops, event purchases, and account usage.</p>
    </div>
  );
}
