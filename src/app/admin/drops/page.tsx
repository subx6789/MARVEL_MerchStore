"use client";
// ─────────────────────────────────────────────────────────
// Admin Drops Scheduler Page
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { Plus, Zap, Calendar, Clock, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const DEMO_DROPS = [
  { id: "1", name: "Iron Man Mark 85 Armor Tee", price: 2499, totalStock: 500, sold: 253, status: "live", startsAt: "Today, 12:00 PM", endsAt: "Today, 11:59 PM" },
  { id: "2", name: "Spider-Man No Way Home Hoodie", price: 3999, totalStock: 300, sold: 0, status: "scheduled", startsAt: "Tomorrow, 6:00 PM", endsAt: "Jul 28, 6:00 PM" },
];

export default function AdminDropsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-marvel-white tracking-wide">LIMITED DROPS ORCHESTRATION</h2>
          <p className="font-sans text-xs text-marvel-white-muted">Schedule and launch real-time limited drops</p>
        </div>
        <button className="btn-marvel text-xs py-2.5 px-4 gap-2">
          <Zap size={14} /> Schedule New Drop
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {DEMO_DROPS.map((drop) => (
          <div key={drop.id} className="bg-marvel-black-card border border-marvel-black-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                drop.status === "live" ? "bg-marvel-red text-white" : "bg-marvel-gold text-marvel-black"
              }`}>
                {drop.status}
              </span>
              <span className="font-display text-2xl text-marvel-red">{formatPrice(drop.price)}</span>
            </div>

            <h3 className="font-display text-2xl text-marvel-white tracking-wide">{drop.name}</h3>

            <div className="space-y-1 text-xs font-sans text-marvel-white-muted">
              <div className="flex items-center gap-2"><Calendar size={12} className="text-marvel-gold" /> Starts: {drop.startsAt}</div>
              <div className="flex items-center gap-2"><Clock size={12} className="text-marvel-gold" /> Ends: {drop.endsAt}</div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs font-sans mb-1">
                <span className="text-marvel-white-muted">Stock Allocation</span>
                <span className="text-marvel-white font-bold">{drop.sold} / {drop.totalStock} sold</span>
              </div>
              <div className="h-1.5 bg-marvel-black-border">
                <div className="h-full bg-marvel-red" style={{ width: `${(drop.sold / drop.totalStock) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
