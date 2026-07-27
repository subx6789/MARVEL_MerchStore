"use client";

// ─────────────────────────────────────────────────────────
// Events Page — Dynamic Marvel Events & QR Exclusives
// Powered by useProductStore — No static hardcoded mock data
// ─────────────────────────────────────────────────────────
import Link from "next/link";
import { MapPin, Calendar, QrCode, ArrowRight, PackagePlus } from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { soundFx } from "@/lib/sound";

export default function EventsPage() {
  const { events } = useProductStore();

  return (
    <div className="text-white">
      <div className="bg-[#08080c] border-b border-[#1e1e2a] py-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-amber-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <span className="bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] text-[10px] font-black px-2.5 py-0.5 tracking-widest uppercase mb-4 inline-flex">
            VIP ACCESS
          </span>
          <h1 className="font-display text-4xl md:text-6xl text-white tracking-wide mb-4 uppercase font-bold">
            MARVEL EVENTS
          </h1>
          <p className="font-sans text-gray-400 text-sm max-w-xl leading-relaxed">
            Attend official Marvel events for exclusive merchandise unavailable anywhere else. Scan your ticket QR code for instant VIP collection access.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {events.length === 0 ? (
          <div className="py-20 text-center bg-[#14141c] border border-[#1e1e2a] rounded-xs p-8 max-w-xl mx-auto">
            <QrCode size={48} className="text-[#f0b429] mx-auto mb-4" />
            <h2 className="font-display text-3xl text-white tracking-widest uppercase mb-2">NO EVENTS REGISTERED</h2>
            <p className="font-sans text-sm text-gray-400 mb-6">
              There are currently no active or upcoming Marvel events. You can add and manage official events in the Admin Dashboard!
            </p>
            <Link
              href="/admin/events"
              onClick={() => soundFx.playClick()}
              className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-xs font-black"
            >
              <PackagePlus size={16} />
              Open Admin Events
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                onClick={() => soundFx.playClick()}
                className="block group"
              >
                <div className="bg-[#14141c] border border-[#1e1e2a] hover:border-amber-400 transition-colors duration-300 p-6 h-full flex flex-col rounded-xs shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <span className="font-sans text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {event.status}
                    </span>
                    <QrCode size={20} className="text-amber-400" />
                  </div>
                  <h2 className="font-display text-2xl text-white tracking-wide leading-tight mb-3 font-bold">
                    {event.name}
                  </h2>
                  <p className="font-sans text-xs text-gray-400 mb-4 leading-relaxed flex-1">{event.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={12} className="text-amber-400 shrink-0" />
                      <span className="font-sans text-xs">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={12} className="text-amber-400 shrink-0" />
                      <span className="font-sans text-xs">{event.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#1e1e2a]">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                      {event.productsCount} Exclusives
                    </span>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                      View Event <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* QR Info Banner */}
        <div className="mt-12 bg-[#14141c] border border-[#1e1e2a] p-8 flex flex-col md:flex-row items-center gap-6 rounded-xs shadow-xl">
          <QrCode size={48} className="text-amber-400 shrink-0" />
          <div>
            <h3 className="font-display text-2xl text-white tracking-wide uppercase font-bold mb-2">
              HOW QR ACCESS WORKS
            </h3>
            <p className="font-sans text-xs text-gray-400 leading-relaxed">
              When you purchase a Marvel event ticket, you receive a unique QR code. Scan it on arrival to unlock exclusive merch collections available only to event attendees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
