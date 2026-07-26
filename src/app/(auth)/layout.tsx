// ─────────────────────────────────────────────────────────
// Auth Layout — Shared layout for login/register pages
// ─────────────────────────────────────────────────────────
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-marvel-black flex">
      {/* Left — Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-marvel-black-card border-r border-marvel-black-border flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-marvel-red/10 via-transparent to-marvel-gold/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-marvel-red/5 blur-3xl" />

        <div className="relative text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-marvel-red flex items-center justify-center">
              <span className="font-display text-white text-sm">M</span>
            </div>
            <div className="text-left">
              <div className="font-display text-2xl text-marvel-white tracking-widest">MARVEL</div>
              <div className="font-sans text-[9px] font-600 tracking-[0.3em] text-marvel-white-muted uppercase">MerchStore</div>
            </div>
          </Link>

          <h2 className="font-display text-hero-md text-marvel-white leading-none mb-6 tracking-wide">
            THE COLLECTOR&apos;S<br />VAULT
          </h2>
          <p className="font-sans text-marvel-white-dim max-w-sm leading-relaxed">
            Join the universe. Access limited drops, event exclusives, and VIP-only releases.
          </p>

          <div className="mt-12 flex flex-col gap-4">
            {["Limited Drop Access", "VIP Event Exclusives", "Order Tracking", "Wishlist & Collections"].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-left">
                <div className="w-1.5 h-1.5 bg-marvel-red" />
                <span className="font-sans text-sm text-marvel-white-dim">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-marvel-red flex items-center justify-center">
              <span className="font-display text-white text-xs">M</span>
            </div>
            <span className="font-display text-xl text-marvel-white tracking-widest">MARVEL MerchStore</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
