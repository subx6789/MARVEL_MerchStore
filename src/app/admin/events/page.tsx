"use client";
// ─────────────────────────────────────────────────────────
// Admin Events & QR Gate Management Page
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { Plus, QrCode, Calendar, MapPin } from "lucide-react";

const DEMO_EVENTS = [
  { id: "1", name: "MARVEL COMIC CON 2026", venue: "MMRDA Grounds, Mumbai", date: "Aug 15–17, 2026", active: true, passesScanned: 1420 },
  { id: "2", name: "AVENGERS EXPO DELHI", venue: "Pragati Maidan, New Delhi", date: "Sep 5–7, 2026", active: false, passesScanned: 0 },
];

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-marvel-white tracking-wide">EVENT CAMPAIGNS & QR GATES</h2>
          <p className="font-sans text-xs text-marvel-white-muted">Manage physical event gates, issue pass tokens, track scans</p>
        </div>
        <button className="btn-gold text-xs py-2.5 px-4 gap-2">
          <Plus size={14} /> Create Event Campaign
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {DEMO_EVENTS.map((e) => (
          <div key={e.id} className="bg-marvel-black-card border border-marvel-black-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                e.active ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-marvel-black-border text-marvel-white-muted"
              }`}>
                {e.active ? "Gate Open" : "Draft"}
              </span>
              <QrCode size={24} className="text-marvel-gold" />
            </div>

            <h3 className="font-display text-2xl text-marvel-white tracking-wide">{e.name}</h3>

            <div className="space-y-1 text-xs font-sans text-marvel-white-muted">
              <div className="flex items-center gap-2"><MapPin size={12} className="text-marvel-gold" /> {e.venue}</div>
              <div className="flex items-center gap-2"><Calendar size={12} className="text-marvel-gold" /> {e.date}</div>
            </div>

            <div className="pt-4 border-t border-marvel-black-border flex justify-between items-center text-xs font-sans">
              <span className="text-marvel-white-muted">Scanned Pass Tokens</span>
              <span className="font-display text-lg text-marvel-gold">{e.passesScanned} Scans</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
