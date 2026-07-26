import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy — MARVEL MerchStore" };
export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
      <h1 className="font-display text-4xl text-marvel-white">PRIVACY POLICY</h1>
      <p className="font-sans text-sm text-marvel-white-muted">How we handle your account data, order history, and event access tokens.</p>
    </div>
  );
}
