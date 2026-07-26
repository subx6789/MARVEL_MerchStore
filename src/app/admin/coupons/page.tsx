"use client";
import { Tag, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const DEMO_COUPONS = [
  { id: "1", code: "MARVEL10", type: "10% OFF", minOrder: 999, uses: "142 / 1000", active: true },
  { id: "2", code: "UNIVERSE20", type: "20% OFF", minOrder: 2999, uses: "88 / 500", active: true },
  { id: "3", code: "FIRST200", type: "₹200 OFF", minOrder: 1499, uses: "512 / 2000", active: true },
];

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-marvel-white tracking-wide">COUPONS & OFFERS</h2>
          <p className="font-sans text-xs text-marvel-white-muted">Create promotional discount codes and order rules</p>
        </div>
        <button className="btn-marvel text-xs py-2.5 px-4 gap-2">
          <Plus size={14} /> Create Coupon Code
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {DEMO_COUPONS.map((c) => (
          <div key={c.id} className="bg-marvel-black-card border border-marvel-black-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl font-bold text-marvel-gold tracking-wider">{c.code}</span>
              <Tag size={16} className="text-marvel-gold" />
            </div>
            <p className="font-display text-2xl text-marvel-white">{c.type}</p>
            <p className="font-sans text-xs text-marvel-white-muted">Min Order: {formatPrice(c.minOrder)}</p>
            <div className="pt-2 border-t border-marvel-black-border flex justify-between text-xs font-sans text-marvel-white-muted">
              <span>Redeemed</span>
              <span className="text-marvel-white">{c.uses}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
