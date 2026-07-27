"use client";

// ─────────────────────────────────────────────────────────
// QR Unlock / Comic-Con VIP Pass Access Page
// Scans or accepts VIP codes to unlock secret restricted drops
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Lock, Unlock, Sparkles, CheckCircle2, ArrowLeft, Zap } from "lucide-react";
import { toast } from "sonner";
import MarvelLogo from "@/components/shared/MarvelLogo";
import { soundFx } from "@/lib/sound";
import ProductCard from "@/components/product/ProductCard";

const SECRET_UNLOCKS: Record<string, { title: string; desc: string; product: any }> = {
  COMICCON2026: {
    title: "San Diego Comic-Con 2026 VIP Access",
    desc: "1:1 Vibranium Shield Replica (Prototype Serial #007)",
    product: {
      id: "secret-shield-01",
      slug: "vibranium-shield-replica-007",
      name: "1:1 Vibranium Shield Replica (Serial #007)",
      price: 14999,
      comparePrice: 19999,
      imageUrl: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&q=80&w=800",
      badge: "exclusive",
      stockCount: 3,
      variantId: "shield-var-007",
      variantLabel: "Collector Numbered #007",
    },
  },
  "STARK-VIP": {
    title: "Stark Industries Arc Reactor Keycard",
    desc: "Mark 85 Nano Tech Hoodie (Glow in Dark Edition)",
    product: {
      id: "secret-stark-hoodie",
      slug: "stark-nanotech-hoodie-glow",
      name: "Stark Tech Arc Reactor Glow Hoodie",
      price: 3499,
      comparePrice: 4499,
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800",
      badge: "vip",
      stockCount: 8,
      variantId: "stark-hoodie-l",
      variantLabel: "Large (Glow Print)",
    },
  },
  "AVENGERS-PASS": {
    title: "Avengers HQ Clearance Code Alpha",
    desc: "Thor Stormbreaker 1:1 Heavy Metal Replica",
    product: {
      id: "secret-stormbreaker",
      slug: "thor-stormbreaker-replica",
      name: "Thor 1:1 Metal Stormbreaker Replica",
      price: 18999,
      comparePrice: 24999,
      imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
      badge: "limited",
      stockCount: 2,
      variantId: "stormbreaker-v1",
      variantLabel: "Metal Alloy Edition",
    },
  },
};

export default function QrUnlockPage() {
  const [passCode, setPassCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [unlockedItem, setUnlockedItem] = useState<any>(null);

  const handleUnlock = (codeToTest?: string) => {
    const code = (codeToTest || passCode).toUpperCase().trim();
    if (!code) {
      toast.error("Please enter a valid badge pass code");
      return;
    }

    soundFx.playHover();
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      if (SECRET_UNLOCKS[code]) {
        soundFx.playUnlock();
        setUnlockedItem(SECRET_UNLOCKS[code]);
        toast.success("VIP Access Granted! Secret Vault Exclusive Unlocked!");
      } else {
        soundFx.playClick();
        toast.error("Invalid VIP Code", {
          description: "Try codes: COMICCON2026, STARK-VIP, or AVENGERS-PASS",
        });
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white pt-24 pb-16 px-4 md:px-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-175 h-87.5 bg-[#00f0ff]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto z-10 relative">
        {/* Back link */}
        <Link
          href="/"
          onClick={() => soundFx.playClick()}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Merch Store
        </Link>

        {/* Top Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] px-3 py-1 text-xs font-black tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <QrCode size={14} />
            CONVENTION VIP ACCESS
          </div>

          <div className="mb-4">
            <MarvelLogo size="lg" />
          </div>

          <p className="text-gray-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium">
            Scan your Comic-Con badge QR code or type your secret VIP access code below to unlock restricted event-only drops.
          </p>
        </div>

        {/* Scanner Terminal Card */}
        <div className="bg-[#14141c] border border-[#1e1e2a] p-8 md:p-12 shadow-2xl relative rounded-xs mb-12">
          {/* Scanner Visual Frame */}
          <div className="relative w-full max-w-md mx-auto aspect-video bg-[#08080c] border border-[#1e1e2a] mb-8 overflow-hidden flex flex-col items-center justify-center p-6 text-center group">
            {/* Animated Laser Scanning Line */}
            {isScanning && (
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-1 bg-[#00f0ff] shadow-[0_0_15px_#00f0ff] z-20"
              />
            )}

            {unlockedItem ? (
              <div className="z-10 flex flex-col items-center">
                <CheckCircle2 size={48} className="text-[#00f0ff] mb-2 animate-bounce" />
                <span className="font-display text-2xl text-white tracking-wide">
                  VIP ACCESS GRANTED
                </span>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-1">
                  {unlockedItem.title}
                </span>
              </div>
            ) : isScanning ? (
              <div className="z-10 flex flex-col items-center">
                <Sparkles size={40} className="text-[#00f0ff] animate-spin mb-2" />
                <span className="font-display text-xl text-gray-300 tracking-wider">
                  DECRYPTING BADGE PASS...
                </span>
              </div>
            ) : (
              <div className="z-10 flex flex-col items-center">
                <Lock size={40} className="text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-display text-xl text-gray-300 tracking-wider">
                  SCANNER READY
                </span>
                <span className="text-[11px] text-gray-500 font-mono tracking-widest mt-1">
                  ENTER VIP PASS CODE BELOW
                </span>
              </div>
            )}
          </div>

          {/* Form Input */}
          <div className="max-w-md mx-auto">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">
              ENTER VIP BADGE / EVENT CODE
            </label>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={passCode}
                onChange={(e) => setPassCode(e.target.value)}
                placeholder="e.g. COMICCON2026"
                className="input-marvel uppercase font-mono tracking-widest text-center text-lg py-3 focus:border-[#00f0ff]"
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              />
              <button
                onClick={() => handleUnlock()}
                disabled={isScanning}
                className="btn-gold px-6 py-3 shrink-0 flex items-center gap-2"
              >
                {unlockedItem ? <Unlock size={18} /> : <Zap size={18} />}
                <span>{isScanning ? "Scanning..." : "Unlock"}</span>
              </button>
            </div>

            {/* Quick Demo Test Buttons */}
            <div className="text-center pt-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                TEST DEMO PASS CODES:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {["COMICCON2026", "STARK-VIP", "AVENGERS-PASS"].map((demoCode) => (
                  <button
                    key={demoCode}
                    onClick={() => {
                      setPassCode(demoCode);
                      handleUnlock(demoCode);
                    }}
                    className="px-3 py-1 bg-[#08080c] border border-gray-800 hover:border-[#00f0ff] text-xs font-mono text-[#00f0ff] uppercase transition-colors"
                  >
                    {demoCode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Secret Item Display */}
        <AnimatePresence>
          {unlockedItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#14141c] border-2 border-[#00f0ff] p-8 shadow-[0_0_30px_rgba(0,240,255,0.3)] relative rounded-xs"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#00f0ff] text-black font-black text-xs px-3 py-1 uppercase tracking-widest">
                  SECRET ITEM UNLOCKED
                </span>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {unlockedItem.desc}
                </span>
              </div>

              <div className="max-w-xs mx-auto">
                <ProductCard {...unlockedItem.product} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
