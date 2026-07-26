"use client";
// ─────────────────────────────────────────────────────────
// Event Detail & QR Access Unlock Flow Page
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Lock, CheckCircle2, ShieldCheck, MapPin, Calendar, ArrowRight, Zap } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";

const EVENT_DETAILS = {
  name: "MARVEL COMIC CON 2026",
  slug: "comic-con-mumbai-2026",
  venue: "MMRDA Grounds, BKC, Mumbai",
  date: "August 15–17, 2026",
  description: "The premier Marvel event. Scan your ticket pass or enter your access code below to unlock event-exclusive merchandise.",
  products: [
    { id: "e1", slug: "comic-con-exclusive-bomber", name: "Comic Con 2026 Official Leather Bomber", price: 8999, comparePrice: 10999, imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600", badge: "event-only" as const, stockCount: 50, variantId: "ve1", variantLabel: "L / Black" },
    { id: "e2", slug: "comic-con-vip-pass-tee", name: "Comic Con Mumbai VIP Attendee Tee", price: 2999, imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600", badge: "vip" as const, stockCount: 100, variantId: "ve2", variantLabel: "M / Gold" },
  ],
};

export default function EventDetailPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [qrInput, setQrInput] = useState("");
  const [loading, setLoading] = useState(false);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!qrInput.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setUnlocked(true);
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Event Header Banner */}
      <div className="bg-marvel-black-card border border-marvel-gold/30 p-8 md:p-12 mb-12 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="badge-vip">Event Portal</span>
              <span className="badge-live"><span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Active Gate</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-marvel-white tracking-wide mb-3">
              {EVENT_DETAILS.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs font-sans text-marvel-white-muted">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-marvel-gold" /> {EVENT_DETAILS.venue}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-marvel-gold" /> {EVENT_DETAILS.date}</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-marvel-gold/10 border border-marvel-gold/40 flex items-center justify-center shrink-0">
            <QrCode size={36} className="text-marvel-gold" />
          </div>
        </div>
      </div>

      {/* Unlock Gate Flow */}
      {!unlocked ? (
        <div className="max-w-xl mx-auto bg-marvel-black-card border border-marvel-black-border p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-marvel-red/10 border border-marvel-red/30 flex items-center justify-center mx-auto">
            <Lock size={32} className="text-marvel-red" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-marvel-white tracking-wide mb-2">
              VIP EXCLUSIVE ACCESS GATE
            </h2>
            <p className="font-sans text-sm text-marvel-white-muted">
              Scan your ticket QR code or enter your 8-digit access pass token to view and purchase event-only merchandise.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="text"
              placeholder="Enter Access Token (e.g., MCC2026-VIP)"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              className="input-marvel text-center uppercase tracking-widest font-mono text-lg py-4"
              required
            />
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
              {loading ? "Validating Access Pass..." : "Unlock Event Exclusives"}
            </button>
          </form>
          <p className="font-sans text-xs text-marvel-white-muted">
            Need help? Visit the Marvel VIP Desk at the event venue.
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 flex items-center gap-3">
              <ShieldCheck size={24} className="text-emerald-400 shrink-0" />
              <div>
                <p className="font-display text-lg text-emerald-400">ACCESS GRANTED · VIP PASS VERIFIED</p>
                <p className="font-sans text-xs text-marvel-white-muted">You now have access to event-exclusive merchandise for {EVENT_DETAILS.name}.</p>
              </div>
            </div>

            <h2 className="font-display text-3xl text-marvel-white tracking-wide">EVENT EXCLUSIVE COLLECTION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EVENT_DETAILS.products.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
