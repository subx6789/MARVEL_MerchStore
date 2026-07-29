"use client";

// ─────────────────────────────────────────────────────────
// Footer — MARVEL MerchStore & Vault Unified Footer
// Pure CSS Marvel Logo, Newsletter, Payment Badges
// ─────────────────────────────────────────────────────────
import Link from "next/link";
import { Zap, Share2, Globe, Disc, Radio } from "lucide-react";
import MarvelLogo from "@/components/shared/MarvelLogo";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Limited Drops", href: "/drops" },
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "Best Sellers", href: "/shop?sort=popular" },
    { label: "Events", href: "/events" },
  ],
  Vault: [
    { label: "VIP QR Unlock", href: "/unlock" },
    { label: "Live Drops", href: "/drops" },
    { label: "Convention Exclusives", href: "/events" },
    { label: "Comic Con Access", href: "/unlock" },
  ],
  Account: [
    { label: "Admin Portal", href: "/admin" },
    { label: "My Profile", href: "/profile" },
    { label: "My Orders", href: "/orders" },
    { label: "Wishlist", href: "/wishlist" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  { label: "Instagram", href: "#", icon: Share2 },
  { label: "Twitter / X", href: "#", icon: Globe },
  { label: "YouTube", href: "#", icon: Disc },
  { label: "Radio", href: "#", icon: Radio },
];

export default function Footer() {
  return (
    <footer className="bg-[#08080c] border-t border-[#1e1e2a] mt-auto">
      {/* ── Top CTA Banner ── */}
      <div className="bg-[#e23636] py-10 px-4 text-center">
        <p className="font-display text-3xl md:text-4xl text-white mb-2 tracking-widest uppercase">
          JOIN THE UNIVERSE
        </p>
        <p className="font-sans text-sm text-white/90 mb-6 font-medium">
          Get real-time drop alerts, Comic-Con QR unlock codes, and limited piece notifications
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-white/10 border border-white/30 text-white px-4 py-3 text-sm font-sans focus:outline-none"
          />
          <button type="submit" className="btn-gold shrink-0 py-3 px-6 text-xs">
            Subscribe
          </button>
        </form>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="mb-4">
              <MarvelLogo size="md" />
            </div>
            <p className="font-sans text-sm text-gray-400 leading-relaxed mb-6 max-w-xs font-normal">
              The official home of Marvel collector-grade merchandise, real-time live drops, event exclusives, and rare gear.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-8 h-8 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 transition-colors"
                  >
                    <Icon size={14} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Nav Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-sans text-xs font-extrabold uppercase tracking-widest text-white mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-[#1e1e2a] px-4 md:px-8 py-5 max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-sans text-xs text-gray-500">
          © {new Date().getFullYear()} MARVEL. All rights reserved. Official Licensed Store.
        </p>
        <div className="flex items-center gap-2 text-gray-400">
          <Zap size={12} className="text-red-500" />
          <span className="font-sans text-xs">Official Collector Vault System</span>
        </div>
        <div className="flex items-center gap-3">
          {["Visa", "Mastercard", "UPI", "Stripe"].map((method) => (
            <span key={method} className="font-sans text-[10px] font-bold tracking-widest text-gray-400 border border-gray-800 px-2 py-1">
              {method}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
