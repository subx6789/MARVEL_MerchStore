"use client";
// ─────────────────────────────────────────────────────────
// Profile & Account Vault Page
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Link from "next/link";
import { User, Package, MapPin, Heart, Shield, LogOut, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const USER_PROFILE = {
  name: "Tony Stark",
  email: "stark@avengers.org",
  role: "VIP Collector",
  joined: "July 2026",
  ordersCount: 4,
};

const USER_ORDERS = [
  { id: "MVL-99A1B2", date: "Jul 26, 2026", items: "Iron Man Mark 85 Armor Tee (L)", total: 2499, status: "confirmed" },
  { id: "MVL-44C5D6", date: "Jul 15, 2026", items: "Spider-Man Web Shooter Hoodie (M)", total: 3299, status: "delivered" },
];

export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-marvel-black-border mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-marvel-red text-white flex items-center justify-center font-display text-2xl font-bold">
            TS
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-3xl text-marvel-white tracking-wide">{USER_PROFILE.name}</h1>
              <span className="badge-vip">{USER_PROFILE.role}</span>
            </div>
            <p className="font-sans text-xs text-marvel-white-muted">{USER_PROFILE.email} · Member since {USER_PROFILE.joined}</p>
          </div>
        </div>

        <Link href="/login" className="btn-outline text-xs py-2.5 px-4 gap-2">
          <LogOut size={14} /> Sign Out
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order History */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-display text-2xl text-marvel-white tracking-wide">ORDER HISTORY</h2>

          <div className="space-y-4">
            {USER_ORDERS.map((o) => (
              <div key={o.id} className="bg-marvel-black-card border border-marvel-black-border p-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="font-mono font-bold text-marvel-gold">{o.id}</span>
                  <span className="text-marvel-white-muted">{o.date}</span>
                </div>
                <p className="font-sans text-sm font-semibold text-marvel-white">{o.items}</p>
                <div className="flex items-center justify-between pt-2 border-t border-marvel-black-border">
                  <span className="font-display text-xl text-marvel-red">{formatPrice(o.total)}</span>
                  <span className="uppercase text-[9px] font-bold tracking-widest px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Account Links */}
        <div className="space-y-6">
          <div className="bg-marvel-black-card border border-marvel-black-border p-6 space-y-4">
            <h3 className="font-display text-xl text-marvel-white">COLLECTOR VAULT</h3>
            <div className="space-y-2">
              <Link href="/wishlist" className="flex items-center justify-between p-3 bg-marvel-black-soft hover:bg-marvel-black-hover border border-marvel-black-border text-xs font-sans transition-colors">
                <span className="flex items-center gap-2 text-marvel-white"><Heart size={14} className="text-marvel-red" /> Wishlist Vault</span>
                <ExternalLink size={12} className="text-marvel-white-muted" />
              </Link>
              <Link href="/cart" className="flex items-center justify-between p-3 bg-marvel-black-soft hover:bg-marvel-black-hover border border-marvel-black-border text-xs font-sans transition-colors">
                <span className="flex items-center gap-2 text-marvel-white"><Package size={14} className="text-marvel-gold" /> Saved Cart</span>
                <ExternalLink size={12} className="text-marvel-white-muted" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
