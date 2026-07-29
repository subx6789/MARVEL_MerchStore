"use client";
// ─────────────────────────────────────────────────────────
// Dynamic Event Detail, Ticket Booking & QR Gate Unlock
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Lock, ShieldCheck, MapPin, Calendar, CheckCircle2, Ticket, Sparkles, User, Mail, Phone } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";
import { useProductStore } from "@/stores/productStore";
import { useEventStore, EventBooking } from "@/stores/eventStore";
import { soundFx } from "@/lib/sound";
import { toast } from "sonner";

export default function EventDetailPage() {
  const params = useParams();
  const eventSlug = params.eventId as string;

  const { events, products } = useProductStore();
  const { addBooking, bookings } = useEventStore();

  const currentEvent = events.find((e) => e.slug === eventSlug || e.id === eventSlug) || events[0] || null;

  const [unlocked, setUnlocked] = useState(false);
  const [qrInput, setQrInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Booking Modal
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [attendeeName, setAttendeeName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [seatsCount, setSeatsCount] = useState(1);
  const [tier, setTier] = useState<"General Pass" | "VIP Pass">("VIP Pass");
  const [newBooking, setNewBooking] = useState<EventBooking | null>(null);

  const eventBookings = currentEvent ? bookings.filter((b) => b.eventId === currentEvent.id) : [];
  const bookedSeats = eventBookings.reduce((sum, b) => sum + b.seatsCount, 0);
  const seatsRemaining = currentEvent ? Math.max(0, (currentEvent.totalSeats || 200) - bookedSeats) : 0;

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!qrInput.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const match =
        qrInput.trim().toUpperCase() === (currentEvent.accessCode || "MCC2026-VIP") ||
        bookings.some((b) => b.qrCodeToken.toUpperCase() === qrInput.trim().toUpperCase());

      if (match) {
        setUnlocked(true);
        soundFx.playUnlock();
        toast.success("VIP Gate Unlocked! VIP Exclusive drops unlocked.");
      } else {
        toast.error("Invalid QR Access Pass Code. Please check your ticket pass.");
      }
      setLoading(false);
    }, 600);
  }

  function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!attendeeName || !email) {
      toast.error("Please fill in attendee name and email.");
      return;
    }

    const pricePerSeat = tier === "VIP Pass" ? (currentEvent.ticketPrice || 1499) + 1000 : (currentEvent.ticketPrice || 1499);
    const totalPaid = pricePerSeat * seatsCount;

    const booked = addBooking({
      eventId: currentEvent.id,
      eventName: currentEvent.name,
      attendeeName,
      email,
      phone,
      tier,
      seatsCount,
      totalPaid,
    });

    setNewBooking(booked);
    soundFx.playUnlock();
    toast.success("Ticket Pass Confirmed! Unique QR Code generated.");
  }

  const exclusiveProducts = products.slice(0, 4);

  if (!currentEvent) {
    return (
      <div className="pt-24 max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <QrCode size={48} className="text-amber-400 mx-auto" />
        <h2 className="font-display text-3xl text-white uppercase font-bold">EVENT NOT FOUND</h2>
        <p className="text-xs text-gray-400">There are currently no registered Marvel event campaigns matching this ID.</p>
        <Link href="/events" className="btn-gold text-xs py-2.5 px-6 font-black uppercase inline-block">
          View All Marvel Events
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 md:px-8 pb-16">
      {/* Event Header Banner */}
      <div className="bg-[#14141c] border border-amber-500/30 p-8 md:p-12 mb-12 relative overflow-hidden rounded-xs shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-amber-400 text-black text-[10px] font-black px-2.5 py-0.5 tracking-widest uppercase">
                OFFICIAL EVENT PORTAL
              </span>
              <span className="badge-live">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Live Gate Gate Active
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-white tracking-wide mb-3 font-extrabold uppercase">
              {currentEvent.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs font-sans text-gray-400 mb-4">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-amber-400" /> {currentEvent.venue}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-amber-400" /> {currentEvent.date}</span>
              <span className="flex items-center gap-1.5"><Ticket size={14} className="text-emerald-400" /> {seatsRemaining} Seats Remaining</span>
            </div>
            <p className="font-sans text-xs text-gray-300 max-w-2xl leading-relaxed">{currentEvent.description}</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsBookModalOpen(true);
              }}
              className="btn-gold text-xs py-3 px-6 gap-2 font-black uppercase shadow-lg cursor-pointer"
            >
              <Ticket size={16} /> Book Event Pass (₹{currentEvent.ticketPrice || 1499})
            </button>
            <span className="text-[10px] text-gray-400 font-mono">Instant Gate QR Pass Issued</span>
          </div>
        </div>
      </div>

      {/* Unlock Gate Flow */}
      {!unlocked ? (
        <div className="max-w-xl mx-auto bg-[#14141c] border border-[#1e1e2a] p-8 text-center space-y-6 rounded-xs shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto rounded-full">
            <Lock size={32} className="text-amber-400" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-white tracking-wide mb-2 uppercase font-extrabold">
              GATE EXCLUSIVE DROPS UNLOCK
            </h2>
            <p className="font-sans text-xs text-gray-400 leading-relaxed">
              Scan your ticket pass or enter your access code (e.g. <span className="text-amber-400 font-mono font-bold">{currentEvent.accessCode || "MCC2026-VIP"}</span>) to unlock event-only drops!
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="text"
              placeholder={`Enter Gate Pass Code (${currentEvent.accessCode || "MCC2026-VIP"})`}
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              className="input-marvel text-center uppercase tracking-widest font-mono text-lg py-3.5 bg-[#08080c] border-[#1e1e2a] text-amber-400 font-bold"
              required
            />
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center font-black py-3">
              {loading ? "Validating QR Access Code..." : "Unlock Event Exclusives"}
            </button>
          </form>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 flex items-center gap-3 rounded-xs">
              <ShieldCheck size={24} className="text-emerald-400 shrink-0" />
              <div>
                <p className="font-display text-lg text-emerald-400 font-bold tracking-wide">GATE ACCESS GRANTED · VIP UNLOCKED</p>
                <p className="font-sans text-xs text-gray-400">You now have VIP clearance to order event-exclusive drops for {currentEvent.name}.</p>
              </div>
            </div>

            <h2 className="font-display text-3xl text-white tracking-wide uppercase font-extrabold">
              EVENT EXCLUSIVE MERCHANDISE DROPS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {exclusiveProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Ticket Booking Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14141c] border border-[#1e1e2a] p-6 md:p-8 w-full max-w-md rounded-xs shadow-2xl space-y-4">
            {!newBooking ? (
              <>
                <div className="flex items-center justify-between border-b border-[#1e1e2a] pb-3">
                  <h2 className="font-display text-2xl text-white tracking-wide uppercase font-extrabold">
                    BOOK EVENT TICKET
                  </h2>
                  <button onClick={() => setIsBookModalOpen(false)} className="text-gray-400 hover:text-white font-bold text-sm">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block text-gray-300 font-bold uppercase mb-1">FULL NAME</label>
                    <input
                      type="text"
                      placeholder="Tony Stark"
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-bold uppercase mb-1">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      placeholder="tony@stark.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-bold uppercase mb-1">PHONE NUMBER</label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 font-bold uppercase mb-1">PASS TIER</label>
                      <select
                        value={tier}
                        onChange={(e) => setTier(e.target.value as any)}
                        className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                      >
                        <option value="General Pass">General Pass (₹{currentEvent.ticketPrice || 1499})</option>
                        <option value="VIP Pass">VIP Pass (₹{(currentEvent.ticketPrice || 1499) + 1000})</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 font-bold uppercase mb-1">NO. OF SEATS</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={seatsCount}
                        onChange={(e) => setSeatsCount(parseInt(e.target.value) || 1)}
                        className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1e1e2a] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">TOTAL AMOUNT</p>
                      <p className="font-display text-2xl font-black text-emerald-400">
                        {formatPrice((tier === "VIP Pass" ? (currentEvent.ticketPrice || 1499) + 1000 : (currentEvent.ticketPrice || 1499)) * seatsCount)}
                      </p>
                    </div>
                    <button type="submit" className="btn-gold py-2.5 px-6 font-black uppercase text-xs">
                      Confirm & Get QR Pass
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* QR Ticket Output */
              <div className="text-center space-y-4 py-2">
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto" />
                <h3 className="font-display text-2xl text-white font-extrabold uppercase">TICKET BOOKED SUCCESSFULLY!</h3>
                <p className="text-xs text-gray-400">Present this QR Ticket Pass at the physical event gate or enter the code to unlock online drops.</p>

                <div className="bg-[#08080c] border border-amber-500/40 p-6 rounded-xs space-y-3 font-mono">
                  <div className="w-32 h-32 bg-white p-2 mx-auto flex items-center justify-center">
                    <QrCode size={110} className="text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold">QR TICKET CODE</p>
                    <p className="text-base font-black text-amber-400 tracking-wider">{newBooking.qrCodeToken}</p>
                  </div>
                  <div className="text-left text-[11px] text-gray-300 space-y-1 pt-2 border-t border-[#1e1e2a]">
                    <p><span className="text-gray-500">Holder:</span> {newBooking.attendeeName}</p>
                    <p><span className="text-gray-500">Tier:</span> {newBooking.tier} ({newBooking.seatsCount} Seats)</p>
                    <p><span className="text-gray-500">Paid:</span> {formatPrice(newBooking.totalPaid)}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setQrInput(newBooking.qrCodeToken);
                    setUnlocked(true);
                    setIsBookModalOpen(false);
                    setNewBooking(null);
                  }}
                  className="btn-gold w-full font-black text-xs py-2.5 uppercase"
                >
                  Use Pass To Unlock Event Drops Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
