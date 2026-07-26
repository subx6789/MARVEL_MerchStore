"use client";
// ─────────────────────────────────────────────────────────
// Navbar — MARVEL MerchStore
// Premium editorial navigation with cart, wishlist, auth
// ─────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Zap,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Drops", href: "/drops" },
  { label: "Events", href: "/events" },
  {
    label: "Collections",
    href: "#",
    children: [
      { label: "Avengers", href: "/shop?category=avengers" },
      { label: "Spider-Man", href: "/shop?category=spider-man" },
      { label: "Black Panther", href: "/shop?category=black-panther" },
      { label: "X-Men", href: "/shop?category=x-men" },
      { label: "Iron Man", href: "/shop?category=iron-man" },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const cartCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.count());
  const openCart = useCartStore((s) => s.openCart);

  // Track scroll for background blur
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-marvel-black/95 backdrop-blur-md border-b border-marvel-black-border"
            : "bg-transparent"
        )}
      >
        {/* ── Live Drop Ticker ── */}
        <div className="bg-marvel-red overflow-hidden h-8 flex items-center">
          <div className="flex animate-ticker whitespace-nowrap">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  className="flex items-center gap-6 px-8 text-[10px] font-sans font-700 tracking-[0.2em] uppercase text-white"
                >
                  <Zap size={10} className="shrink-0" />
                  <span>Limited Drop: Iron Man Mark 85 Armor — Live Now</span>
                  <Zap size={10} className="shrink-0" />
                  <span>Free Shipping on orders above ₹1,999</span>
                  <Zap size={10} className="shrink-0" />
                  <span>Comic Con Exclusive — Scan QR for VIP Access</span>
                </span>
              ))}
          </div>
        </div>

        {/* ── Main Nav Bar ── */}
        <nav className="px-4 md:px-8 h-16 flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 bg-marvel-red flex items-center justify-center shrink-0 group-hover:bg-marvel-red-dark transition-colors">
              <span className="font-display text-white text-[10px] leading-none">M</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-marvel-white text-xl tracking-[0.15em] uppercase">
                Marvel
              </span>
              <span className="font-sans text-[8px] font-600 tracking-[0.3em] uppercase text-marvel-white-muted">
                MerchStore
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label} className="relative">
                {link.children ? (
                  <button
                    className={cn(
                      "flex items-center gap-1 font-sans text-sm font-500 tracking-wide uppercase",
                      "text-marvel-white-dim hover:text-marvel-white transition-colors",
                      "focus:outline-none"
                    )}
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === link.label ? null : link.label
                      )
                    }
                  >
                    {link.label}
                    <ChevronDown size={12} className={cn(
                      "transition-transform",
                      activeDropdown === link.label && "rotate-180"
                    )} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "font-sans text-sm font-500 tracking-wide uppercase transition-colors",
                      pathname === link.href
                        ? "text-marvel-red"
                        : "text-marvel-white-dim hover:text-marvel-white"
                    )}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown */}
                {link.children && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 min-w-[180px] bg-marvel-black-card border border-marvel-black-border shadow-card"
                        onMouseEnter={() => setActiveDropdown(link.label)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-3 font-sans text-sm text-marvel-white-dim hover:text-marvel-white hover:bg-marvel-black-hover border-b border-marvel-black-border last:border-0 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            ))}
          </ul>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-3 text-marvel-white-dim hover:text-marvel-white transition-colors group"
              aria-label="Wishlist"
            >
              <Heart size={20} className="group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-marvel-red text-white text-[9px] font-700 flex items-center justify-center leading-none">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-3 text-marvel-white-dim hover:text-marvel-white transition-colors group"
              aria-label="Cart"
            >
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-4 h-4 bg-marvel-red text-white text-[9px] font-700 flex items-center justify-center leading-none"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
            </button>

            {/* Profile */}
            <Link
              href="/profile"
              className="p-3 text-marvel-white-dim hover:text-marvel-white transition-colors group"
              aria-label="Account"
            >
              <User size={20} className="group-hover:scale-110 transition-transform" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-3 text-marvel-white-dim hover:text-marvel-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/80"
              onClick={() => setMobileOpen(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-marvel-black-card border-l border-marvel-black-border flex flex-col"
            >
              {/* Close */}
              <div className="flex items-center justify-between p-6 border-b border-marvel-black-border">
                <span className="font-display text-xl tracking-widest text-marvel-white">MENU</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={20} className="text-marvel-white-dim hover:text-marvel-white" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto py-4">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      href={link.href === "#" ? "/shop" : link.href}
                      className="flex items-center justify-between px-6 py-4 font-sans text-sm font-500 tracking-widest uppercase text-marvel-white-dim hover:text-marvel-white hover:bg-marvel-black-hover transition-colors border-b border-marvel-black-border"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="bg-marvel-black-soft">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block pl-10 pr-6 py-3 font-sans text-xs text-marvel-white-muted hover:text-marvel-white transition-colors border-b border-marvel-black-border"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Bottom CTA */}
              <div className="p-6 border-t border-marvel-black-border">
                <Link
                  href="/login"
                  className="btn-marvel w-full text-center"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
