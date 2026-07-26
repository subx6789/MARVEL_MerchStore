"use client";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

const USER_ORDERS = [
  { id: "MVL-99A1B2", date: "Jul 26, 2026", items: "Iron Man Mark 85 Armor Tee (L)", total: 2499, status: "confirmed" },
  { id: "MVL-44C5D6", date: "Jul 15, 2026", items: "Spider-Man Web Shooter Hoodie (M)", total: 3299, status: "delivered" },
];

export default function UserOrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="font-display text-hero-md text-marvel-white tracking-wide mb-8">MY ORDERS</h1>

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
  );
}
