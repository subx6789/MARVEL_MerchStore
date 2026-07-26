import type { Metadata } from "next";
export const metadata: Metadata = { title: "Cookie Policy — MARVEL MerchStore" };
export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
      <h1 className="font-display text-4xl text-marvel-white">COOKIE POLICY</h1>
      <p className="font-sans text-sm text-marvel-white-muted">Cookies used for session persistence, cart storage, and drop queue authentication.</p>
    </div>
  );
}
