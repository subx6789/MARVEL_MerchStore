"use client";

// ─────────────────────────────────────────────────────────
// My Tickets Page — User Event Pass Management & Calendar/Wallet Sync
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Link from "next/link";
import { QrCode, Calendar, MapPin, Ticket, Download, Share2, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { useEventStore, EventBooking } from "@/stores/eventStore";
import { formatPrice } from "@/lib/utils";
import { soundFx } from "@/lib/sound";
import { toast } from "sonner";

export default function MyTicketsPage() {
  const { bookings } = useEventStore();
  const [selectedTicket, setSelectedTicket] = useState<EventBooking | null>(null);

  // Calendar Sync Helper: Generates Google Calendar Event Link
  function generateGoogleCalendarUrl(b: EventBooking) {
    const title = encodeURIComponent(`${b.eventName} — Marvel VIP Ticket`);
    const details = encodeURIComponent(
      `Official Marvel Event Pass\nHolder: ${b.attendeeName}\nTier: ${b.tier}\nQR Pass Code: ${b.qrCodeToken}`
    );
    const location = encodeURIComponent("MMRDA Grounds, BKC, Mumbai");
    const now = new Date();
    const startTime = new Date(now.getTime() + 86400000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endTime = new Date(now.getTime() + 86400000 + 4 * 3600000).toISOString().replace(/-|:|\.\d\d\d/g, "");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startTime}/${endTime}`;
  }

  // Wallet / ICS File Download Generator
  function downloadIcsCalendarFile(b: EventBooking) {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Marvel MerchStore//Event Pass//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${b.eventName} Pass`,
      `DESCRIPTION:Marvel Ticket Pass Code: ${b.qrCodeToken} (${b.tier})`,
      "LOCATION:MMRDA Grounds, BKC, Mumbai",
      `DTSTART:${new Date().toISOString().replace(/-|:|\.\d\d\d/g, "")}`,
      `DTEND:${new Date(Date.now() + 4 * 3600000).toISOString().replace(/-|:|\.\d\d\d/g, "")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${b.qrCodeToken}_marvel_ticket.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    soundFx.playUnlock();
    toast.success("Apple Wallet / iCal event file downloaded!");
  }

  return (
    <div className="pt-24 max-w-6xl mx-auto px-4 md:px-8 pb-16 text-white">
      {/* Header */}
      <div className="border-b border-[#1e1e2a] pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-amber-400 text-black text-[10px] font-black px-2.5 py-0.5 tracking-widest uppercase mb-2 inline-block">
            VIP PASSES & TICKET VAULT
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-wide uppercase">MY EVENT TICKETS</h1>
          <p className="font-sans text-xs text-gray-400 mt-1">
            Access your booked Marvel event tickets, QR gate codes, and sync passes to your calendar or wallet.
          </p>
        </div>

        <Link
          href="/events"
          onClick={() => soundFx.playClick()}
          className="btn-gold text-xs py-2.5 px-5 font-black uppercase inline-flex items-center gap-2 cursor-pointer w-fit"
        >
          <Ticket size={16} /> Explore Marvel Events
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="py-20 text-center bg-[#14141c] border border-[#1e1e2a] rounded-xs p-8 max-w-xl mx-auto space-y-4 shadow-2xl">
          <Ticket size={48} className="text-amber-400 mx-auto" />
          <h2 className="font-display text-2xl text-white tracking-wide uppercase font-bold">NO EVENT TICKETS FOUND</h2>
          <p className="font-sans text-xs text-gray-400 leading-relaxed">
            You haven't booked any Marvel event passes yet. Browse live comic-con & VIP fan experiences to book your ticket!
          </p>
          <Link
            href="/events"
            onClick={() => soundFx.playClick()}
            className="btn-marvel inline-flex items-center gap-2 px-6 py-3 text-xs font-black uppercase cursor-pointer"
          >
            Book Your First Event Ticket
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#14141c] border border-[#1e1e2a] hover:border-amber-400/60 transition-all duration-300 rounded-xs overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Ticket Top Banner */}
              <div className="bg-linear-to-r from-amber-500/20 via-[#14141c] to-[#14141c] p-6 border-b border-[#1e1e2a] space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-amber-400 text-black">
                    {b.tier}
                  </span>
                  {b.status === "checked_in" ? (
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/30 uppercase flex items-center gap-1">
                      <CheckCircle2 size={10} /> Gate Checked In
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 border border-amber-500/30 uppercase">
                      Pass Confirmed
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl font-black text-white tracking-wide">{b.eventName}</h3>
                <p className="font-sans text-xs text-gray-400 flex items-center gap-1.5">
                  <MapPin size={12} className="text-amber-400" /> MMRDA Grounds, BKC, Mumbai
                </p>
              </div>

              {/* QR Code Pass Section */}
              <div className="p-6 text-center bg-[#08080c] space-y-3 font-mono border-b border-[#1e1e2a]">
                <div className="w-28 h-28 bg-white p-2 mx-auto flex items-center justify-center rounded-xs shadow-md">
                  <QrCode size={95} className="text-black" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">QR PASS TOKEN</p>
                  <p className="text-sm font-black text-amber-400 tracking-wider">{b.qrCodeToken}</p>
                </div>
              </div>

              {/* Ticket Specs */}
              <div className="p-6 space-y-4 text-xs font-sans">
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#08080c] p-3 rounded-xs border border-[#1e1e2a]">
                  <div>
                    <p className="text-gray-500 text-[9px] uppercase font-bold">Attendee</p>
                    <p className="font-bold text-white truncate">{b.attendeeName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[9px] uppercase font-bold">Seats / Paid</p>
                    <p className="font-bold text-emerald-400">{b.seatsCount} Seats ({formatPrice(b.totalPaid)})</p>
                  </div>
                </div>

                {/* Calendar & Wallet Sync Buttons */}
                <div className="space-y-2 pt-2">
                  <a
                    href={generateGoogleCalendarUrl(b)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="w-full bg-[#1c1c28] hover:bg-[#252536] text-white border border-[#2a2a3d] py-2 px-3 rounded-xs text-[11px] font-bold uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Calendar size={14} className="text-amber-400" /> Add to Google Calendar
                  </a>

                  <button
                    onClick={() => downloadIcsCalendarFile(b)}
                    className="w-full bg-[#1c1c28] hover:bg-[#252536] text-white border border-[#2a2a3d] py-2 px-3 rounded-xs text-[11px] font-bold uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download size={14} className="text-emerald-400" /> Save to Apple Wallet / iCal
                  </button>

                  <Link
                    href={`/events/comic-con-mumbai-2026`}
                    onClick={() => soundFx.playClick()}
                    className="w-full btn-gold py-2 px-3 rounded-xs text-[11px] font-black uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer mt-1"
                  >
                    <Sparkles size={14} /> Unlock Event Drops with Pass
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
