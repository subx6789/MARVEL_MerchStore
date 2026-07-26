// ─────────────────────────────────────────────────────────
// Events Page
// ─────────────────────────────────────────────────────────
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Calendar, QrCode, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Events — MARVEL MerchStore",
  description: "Marvel event exclusive merchandise. Scan your QR code for VIP access to limited event collections.",
};

const EVENTS = [
  { id: "1", name: "MARVEL COMIC CON 2026", slug: "comic-con-mumbai-2026", venue: "MMRDA Grounds, Mumbai", date: "Aug 15–17, 2026", status: "upcoming", products: 24, description: "The biggest Marvel event in India. Exclusive merchandise, limited drops, and VIP panels." },
  { id: "2", name: "AVENGERS EXPO DELHI", slug: "avengers-expo-delhi", venue: "Pragati Maidan, New Delhi", date: "Sep 5–7, 2026", status: "upcoming", products: 18, description: "Assemble in Delhi. Event-exclusive Avengers gear, available only on-site." },
  { id: "3", name: "SPIDER-MAN FAN FEST BENGALURU", slug: "spiderman-fanfest-bengaluru", venue: "Palace Grounds, Bengaluru", date: "Oct 20, 2026", status: "announced", products: 12, description: "Swing into Bengaluru. Meet the Friendly Neighborhood Spider-Man in exclusive gear." },
];

export default function EventsPage() {
  return (
    <div>
      <div className="bg-marvel-black-soft border-b border-marvel-black-border py-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-marvel-gold/5 to-transparent" />
        <div className="max-w-screen-xl mx-auto relative">
          <span className="badge-vip mb-4 inline-flex">VIP Access</span>
          <h1 className="font-display text-hero-lg text-marvel-white tracking-wide mb-4">EVENTS</h1>
          <p className="font-sans text-marvel-white-dim max-w-xl">
            Attend Marvel events for exclusive merchandise unavailable anywhere else. Show your ticket QR code for instant VIP collection access.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENTS.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} className="block group">
              <div className="bg-marvel-black-card border border-marvel-black-border hover:border-marvel-gold transition-colors duration-300 p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <span className={`font-sans text-[9px] font-700 tracking-widest uppercase px-2 py-1 ${
                    event.status === "upcoming" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-marvel-black-border text-marvel-white-muted"
                  }`}>
                    {event.status}
                  </span>
                  <QrCode size={20} className="text-marvel-gold" />
                </div>
                <h2 className="font-display text-2xl text-marvel-white tracking-wide leading-tight mb-3">{event.name}</h2>
                <p className="font-sans text-sm text-marvel-white-dim mb-4 leading-relaxed flex-1">{event.description}</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-marvel-white-muted">
                    <MapPin size={12} className="text-marvel-gold shrink-0" />
                    <span className="font-sans text-xs">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-marvel-white-muted">
                    <Calendar size={12} className="text-marvel-gold shrink-0" />
                    <span className="font-sans text-xs">{event.date}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-marvel-black-border">
                  <span className="badge-event-only">{event.products} Exclusives</span>
                  <span className="label-marvel group-hover:text-marvel-gold transition-colors flex items-center gap-1">
                    View Event <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* QR Info Banner */}
        <div className="mt-12 bg-marvel-black-card border border-marvel-gold/30 p-8 flex flex-col md:flex-row items-center gap-6">
          <QrCode size={48} className="text-marvel-gold shrink-0" />
          <div>
            <h3 className="font-display text-2xl text-marvel-white tracking-wide mb-2">HOW QR ACCESS WORKS</h3>
            <p className="font-sans text-sm text-marvel-white-dim">
              When you purchase a Marvel event ticket, you receive a unique QR code. Scan it on arrival to unlock exclusive merch collections available only to event attendees. Your access is time-boxed to the event window.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
