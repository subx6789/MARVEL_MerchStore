// ─────────────────────────────────────────────────────────
// Footer — MARVEL MerchStore
// ─────────────────────────────────────────────────────────
import Link from "next/link";
import { Zap, Share2, Globe, Disc, Radio } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Limited Drops", href: "/drops" },
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "Best Sellers", href: "/shop?sort=popular" },
    { label: "Events", href: "/events" },
  ],
  Account: [
    { label: "Sign In", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "My Orders", href: "/orders" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Profile", href: "/profile" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { label: "Instagram", href: "#", icon: Share2 },
  { label: "Twitter / X", href: "#", icon: Globe },
  { label: "YouTube", href: "#", icon: Disc },
  { label: "Facebook", href: "#", icon: Radio },
];

export default function Footer() {
  return (
    <footer className="bg-marvel-black-soft border-t border-marvel-black-border mt-auto">
      {/* ── Top CTA Banner ── */}
      <div className="bg-marvel-red py-10 px-4 text-center">
        <p className="font-display text-display-sm text-white mb-2 tracking-widest">
          STAY IN THE UNIVERSE
        </p>
        <p className="font-sans text-sm text-white/80 mb-6">
          Get notified first for limited drops, event exclusives, and VIP offers
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/50 px-4 py-3 text-sm font-sans focus:outline-none"
          />
          <button type="submit" className="btn-gold shrink-0 py-3 px-6 text-xs">
            Join the Universe
          </button>
        </form>
      </div>

      {/* ── Main Footer ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-marvel-red flex items-center justify-center">
                <span className="font-display text-white text-[10px]">M</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-marvel-white text-xl tracking-[0.15em] uppercase">Marvel</span>
                <span className="font-sans text-[8px] font-600 tracking-[0.3em] uppercase text-marvel-white-muted">MerchStore</span>
              </div>
            </Link>
            <p className="font-sans text-sm text-marvel-white-muted leading-relaxed mb-6 max-w-xs">
              The official home of Marvel collector-grade merchandise. Rare drops, event exclusives, and premium gear.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-8 h-8 border border-marvel-black-border flex items-center justify-center text-marvel-white-muted hover:text-marvel-white hover:border-marvel-red transition-colors"
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
              <h4 className="label-marvel text-marvel-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-marvel-white-muted hover:text-marvel-white transition-colors"
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
      <div className="border-t border-marvel-black-border px-4 md:px-8 py-5 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-sans text-xs text-marvel-white-muted">
          © {new Date().getFullYear()} MARVEL MerchStore. All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-marvel-white-muted">
          <Zap size={12} className="text-marvel-red" />
          <span className="font-sans text-xs">Built for collectors. Powered by Supabase.</span>
        </div>
        <div className="flex items-center gap-4">
          {["Visa", "Mastercard", "UPI", "COD"].map((method) => (
            <span key={method} className="font-sans text-[10px] font-600 tracking-widest text-marvel-white-muted border border-marvel-black-border px-2 py-1">
              {method}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
