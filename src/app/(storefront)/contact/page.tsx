// ─────────────────────────────────────────────────────────
// Contact Support Page
// ─────────────────────────────────────────────────────────
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Support — MARVEL MerchStore" };

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-12 space-y-6">
      <h1 className="font-display text-hero-md text-marvel-white tracking-wide">CONTACT SUPPORT</h1>
      <div className="bg-marvel-black-card border border-marvel-black-border p-6 space-y-4">
        <form className="space-y-4">
          <div>
            <label className="label-marvel block mb-1">Your Name</label>
            <input type="text" placeholder="Peter Parker" className="input-marvel" />
          </div>
          <div>
            <label className="label-marvel block mb-1">Your Email</label>
            <input type="email" placeholder="peter@dailybugle.com" className="input-marvel" />
          </div>
          <div>
            <label className="label-marvel block mb-1">Message / Order Query</label>
            <textarea rows={4} placeholder="How can we help you?" className="input-marvel" />
          </div>
          <button type="submit" className="btn-marvel w-full justify-center">Send Inquiry</button>
        </form>
      </div>
    </div>
  );
}
