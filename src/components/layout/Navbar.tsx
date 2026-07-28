"use client";

// ─────────────────────────────────────────────────────────
// Navbar — Official MARVEL Navigation Bar
// Official CSS MARVEL logo (clean), Live Ticker, Sound FX, User Avatar Badge
// ─────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Zap,
  Volume2,
  VolumeX,
  QrCode,
  Sparkles,
  Shield,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthModalStore } from "@/stores/authModalStore";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import MarvelLogo from "@/components/shared/MarvelLogo";
import { soundFx } from "@/lib/sound";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Drops", href: "/drops" },
  { label: "Events", href: "/events" },
  { label: "QR Unlock", href: "/unlock", badge: "VIP" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const cartCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.count());
  const openCart = useCartStore((s) => s.openCart);

  const openAuthModal = useAuthModalStore((s) => s.openModal);
  const { isAuthenticated, user } = useAuthStore();

  // Sync sound status on mount
  useEffect(() => {
    setSoundEnabled(soundFx.isEnabled());
  }, []);

  const handleSoundToggle = () => {
    const nextState = soundFx.toggleSound();
    setSoundEnabled(nextState);
  };

  // Track scroll for background blur
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (isAuthenticated) {
      router.push("/profile");
    } else {
      openAuthModal("login");
    }
  };

  // First letter of user's first name
  const userInitial = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "M";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#08080c]/95 backdrop-blur-md border-b border-[#1e1e2a]"
            : "bg-linear-to-b from-[#08080c]/90 via-[#08080c]/50 to-transparent"
        )}
      >
        {/* ── Live Ticker Strip ── */}
        <div className="bg-[#e23636] text-white overflow-hidden h-7 flex items-center shadow-md">
          <div className="flex animate-ticker whitespace-nowrap">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  className="flex items-center gap-6 px-8 text-[10px] font-sans font-bold tracking-[0.2em] uppercase"
                >
                  <Zap size={10} className="shrink-0 fill-current animate-bounce" />
                  <span>Official Marvel Merch Store</span>
                  <Sparkles size={10} className="shrink-0 fill-current" />
                  <span>Limited Drop: Iron Man Mark 85 Helmet — Restock Live</span>
                  <Zap size={10} className="shrink-0 fill-current" />
                  <span>Free Shipping on orders over ₹1,999</span>
                  <QrCode size={10} className="shrink-0" />
                  <span>Scan Comic-Con Badge QR to unlock secret exclusives</span>
                </span>
              ))}
          </div>
        </div>

        {/* ── Main Navigation Bar ── */}
        <nav className="px-4 md:px-8 h-18 flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Left: Pure CSS Official MARVEL Logo Only */}
          <div className="flex items-center gap-6">
            <MarvelLogo size="md" />
          </div>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label} className="relative">
                <Link
                  href={link.href}
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                  className={cn(
                    "flex items-center gap-2 font-sans text-sm font-semibold tracking-wide uppercase transition-all py-2",
                    pathname === link.href
                      ? "text-red-500 font-bold border-b-2 border-red-500"
                      : "text-gray-300 hover:text-white"
                  )}
                >
                  {link.label}
                  {link.badge && (
                    <span className="bg-[#00f0ff] text-black text-[9px] font-black px-1.5 py-0.5 rounded-xs tracking-widest shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Sound FX Toggle Button */}
            <button
              onClick={handleSoundToggle}
              className={cn(
                "p-2.5 rounded-full border transition-all duration-200 flex items-center justify-center",
                soundEnabled
                  ? "bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20"
                  : "bg-gray-800/40 border-gray-700 text-gray-400 hover:text-white"
              )}
              title={soundEnabled ? "Mute UI Sound SFX" : "Enable UI Sound SFX"}
              aria-label="Sound FX Toggle"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              onClick={() => soundFx.playClick()}
              className="relative p-2.5 text-gray-300 hover:text-white transition-colors group"
              aria-label="Wishlist"
            >
              <Heart size={20} className="group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                openCart();
              }}
              className="relative p-2.5 text-gray-300 hover:text-white transition-colors group"
              aria-label="Cart"
            >
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(226,54,54,0.8)]"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
            </button>

            {/* User Avatar / Admin Badge / Sign In Button */}
            {isAuthenticated ? (
              user?.role === "admin" || user?.email === "admin@marvel.com" ? (
                <Link
                  href="/admin"
                  onClick={() => soundFx.playClick()}
                  className="bg-red-600 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 border border-red-400/50 shadow-[0_0_15px_rgba(226,54,54,0.6)] flex items-center gap-1.5 transition-all"
                  title="Open Admin Operations Console"
                >
                  <Shield size={14} />
                  <span>ADMIN CONSOLE</span>
                </Link>
              ) : (
                <Link
                  href="/profile"
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                  className="group flex items-center gap-2 p-1"
                  title={`Logged in as ${user?.name || user?.email}`}
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || "User Avatar"}
                      className="w-8 h-8 rounded-full object-cover border-2 border-red-500 shadow-[0_0_10px_rgba(226,54,54,0.6)] group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-8.5 h-8.5 rounded-full bg-[#e23636] border-2 border-red-400 text-white font-display text-lg font-extrabold flex items-center justify-center shadow-[0_0_12px_rgba(226,54,54,0.6)] group-hover:scale-105 transition-transform">
                      {userInitial}
                    </div>
                  )}
                </Link>
              )
            ) : (
              <button
                onClick={handleAccountClick}
                className="btn-marvel text-xs px-4 py-2 font-black tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <User size={15} />
                <span>SIGN IN</span>
              </button>
            )}

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2.5 text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                soundFx.playClick();
                setMobileOpen(!mobileOpen);
              }}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile Menu Panel ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-[#14141c] border-l border-[#1e1e2a] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#1e1e2a]">
                <MarvelLogo size="sm" />
                <button onClick={() => setMobileOpen(false)}>
                  <X size={20} className="text-gray-400 hover:text-white" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => soundFx.playClick()}
                      className="flex items-center justify-between px-6 py-4 font-sans text-sm font-semibold tracking-widest uppercase text-gray-200 hover:text-white hover:bg-red-500/10 border-b border-[#1e1e2a] transition-colors"
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="bg-[#00f0ff] text-black text-[9px] font-black px-1.5 py-0.5 rounded-xs">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </div>
                ))}
              </nav>

              <div className="p-6 border-t border-[#1e1e2a]">
                {isAuthenticated ? (
                  <Link
                    href="/profile"
                    onClick={() => soundFx.playClick()}
                    className="btn-marvel w-full text-center flex items-center justify-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-white text-black font-bold flex items-center justify-center text-xs">
                      {userInitial}
                    </div>
                    <span>My Profile & Settings</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      openAuthModal("login");
                    }}
                    className="btn-marvel w-full text-center cursor-pointer"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
