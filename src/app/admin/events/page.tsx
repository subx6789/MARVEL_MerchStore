"use client";

// ─────────────────────────────────────────────────────────
// Admin Events & QR Gate Management Console
// Full Event CRUD, Seat Allocation, Financials & Attendee Roster
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Plus, QrCode, Calendar, MapPin, Trash2, Package, Upload, Check, DollarSign, Users, Ticket, CheckCircle2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/stores/productStore";
import { useEventStore } from "@/stores/eventStore";
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit";
import { formatPrice } from "@/lib/utils";

export default function AdminEventsPage() {
  const { events, addEvent, deleteEvent, drops } = useProductStore();
  const { bookings, checkInAttendee, cancelBooking, getTotalRevenue } = useEventStore();

  const [activeTab, setActiveTab] = useState<"campaigns" | "attendees" | "financials">("campaigns");

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ticketPrice, setTicketPrice] = useState("1499");
  const [totalSeats, setTotalSeats] = useState("200");
  const [accessCode, setAccessCode] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<"upcoming" | "live" | "ended">("upcoming");

  // Attendees Search State
  const [attendeeSearch, setAttendeeSearch] = useState("");

  // Dropzone setup for Event Cover
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      toast.loading("Uploading cover to ImageKit...", { id: "evt-ik" });
      try {
        const res = await uploadToImageKit(file, "/marvel-events");
        setBannerUrl(res.url);
        toast.success("Event cover uploaded!", { id: "evt-ik" });
      } catch (err: any) {
        toast.error("Upload failed: " + (err?.message || "Error"), { id: "evt-ik" });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !venue || !startDate) {
      toast.error("Please fill in required fields");
      return;
    }

    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const formattedDateRange = `${new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${
      endDate ? new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date(startDate).getFullYear()
    }`;

    addEvent({
      id: `evt_${generatedSlug}_${Date.now()}`,
      name,
      venue,
      date: formattedDateRange,
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : new Date(Date.now() + 3 * 24 * 3600000).toISOString(),
      description: description || "Official Marvel event campaign.",
      status,
      productsCount: 12,
      slug: generatedSlug,
      bannerUrl: bannerUrl || undefined,
      ticketPrice: parseFloat(ticketPrice) || 1499,
      totalSeats: parseInt(totalSeats) || 200,
      bookedSeats: 0,
      accessCode: accessCode || `${name.slice(0, 3).toUpperCase()}-VIP-2026`,
    });

    toast.success(`Event campaign "${name}" created live!`);
    setName("");
    setVenue("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setBannerUrl("");
    setAccessCode("");
    setIsAddOpen(false);
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.attendeeName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      b.email.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      b.qrCodeToken.toLowerCase().includes(attendeeSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e1e2a] pb-4">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wide uppercase font-bold">
            MARVEL EVENTS & QR ACCESS CONTROL
          </h1>
          <p className="text-xs text-gray-400">Manage event tickets, seats, gate check-in scanning & finances</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#08080c] p-1 border border-[#1e1e2a] rounded-xs text-xs font-bold uppercase">
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === "campaigns" ? "bg-amber-400 text-black font-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Event Campaigns
            </button>
            <button
              onClick={() => setActiveTab("attendees")}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === "attendees" ? "bg-amber-400 text-black font-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Attendees Roster ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab("financials")}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === "financials" ? "bg-amber-400 text-black font-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Finances
            </button>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="btn-gold text-xs py-2 px-4 gap-1.5 cursor-pointer font-black shrink-0"
          >
            <Plus size={15} /> New Event Campaign
          </button>
        </div>
      </div>

      {/* ── Tab 1: Event Campaigns ── */}
      {activeTab === "campaigns" && (
        <>
          {events.length === 0 ? (
            <div className="p-12 text-center bg-[#14141c] border border-[#1e1e2a] rounded-xs space-y-4">
              <QrCode size={44} className="text-[#f0b429] mx-auto" />
              <h2 className="font-display text-2xl text-white uppercase tracking-wider">NO EVENTS CREATED</h2>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Click "New Event Campaign" above to launch physical events, generate QR gates, and manage ticket sales!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((e) => {
                const eventBookings = bookings.filter((b) => b.eventId === e.id);
                const bookedSeats = eventBookings.reduce((sum, b) => sum + b.seatsCount, 0);
                const maxSeats = e.totalSeats || 200;
                const revenue = eventBookings.reduce((sum, b) => sum + b.totalPaid, 0);

                return (
                  <div key={e.id} className="bg-[#14141c] border border-[#1e1e2a] p-6 rounded-xs space-y-4 shadow-xl relative">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {e.status}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 border border-amber-500/30 font-bold">
                          GATE CODE: {e.accessCode || "MCC2026-VIP"}
                        </span>
                        <button
                          onClick={() => {
                            if (confirm(`Delete event "${e.name}"?`)) {
                              if (e.bannerUrl) deleteFromImageKit(e.bannerUrl);
                              deleteEvent(e.id);
                              toast.success("Event deleted");
                            }
                          }}
                          className="text-gray-500 hover:text-red-500 p-1 transition-colors ml-1 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {e.bannerUrl && (
                      <div className="h-32 -mx-6 -mt-2 mb-2 overflow-hidden relative">
                        <img src={e.bannerUrl} alt={e.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-linear-to-t from-[#14141c] via-[#14141c]/30 to-transparent" />
                      </div>
                    )}

                    <h3 className="font-display text-2xl text-white tracking-wide font-extrabold">{e.name}</h3>

                    <div className="space-y-1.5 text-xs text-gray-400 font-sans">
                      <div className="flex items-center gap-2"><MapPin size={14} className="text-[#f0b429]" /> {e.venue}</div>
                      <div className="flex items-center gap-2"><Calendar size={14} className="text-[#f0b429]" /> {e.date}</div>
                    </div>

                    {/* Stats strip */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#1e1e2a] text-center font-mono">
                      <div className="bg-[#08080c] p-2 rounded-xs border border-[#1e1e2a]">
                        <p className="text-[9px] text-gray-500 font-bold uppercase">TICKET PRICE</p>
                        <p className="text-xs font-bold text-white mt-0.5">{formatPrice(e.ticketPrice || 1499)}</p>
                      </div>
                      <div className="bg-[#08080c] p-2 rounded-xs border border-[#1e1e2a]">
                        <p className="text-[9px] text-gray-500 font-bold uppercase">SEATS BOOKED</p>
                        <p className="text-xs font-bold text-amber-400 mt-0.5">{bookedSeats} / {maxSeats}</p>
                      </div>
                      <div className="bg-[#08080c] p-2 rounded-xs border border-[#1e1e2a]">
                        <p className="text-[9px] text-gray-500 font-bold uppercase">REVENUE</p>
                        <p className="text-xs font-bold text-emerald-400 mt-0.5">{formatPrice(revenue)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Tab 2: Attendees Roster & Check-in ── */}
      {activeTab === "attendees" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#14141c] border border-[#1e1e2a] p-4 rounded-xs">
            <div className="relative w-full max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by attendee name, email, or QR pass code..."
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
                className="input-marvel pl-9 pr-4 text-xs bg-[#08080c] border-[#1e1e2a]"
              />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase font-mono">
              Total Attendees: <span className="text-white">{filteredBookings.length}</span>
            </p>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center bg-[#14141c] border border-[#1e1e2a] rounded-xs space-y-2">
              <Users size={36} className="text-gray-500 mx-auto" />
              <p className="text-sm font-bold text-gray-300 uppercase">NO BOOKING RECORDS FOUND</p>
            </div>
          ) : (
            <div className="bg-[#14141c] border border-[#1e1e2a] overflow-x-auto rounded-xs shadow-xl">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-[#08080c] border-b border-[#1e1e2a] text-gray-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Attendee Name</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">Pass Tier</th>
                    <th className="p-4">QR Token Pass</th>
                    <th className="p-4">Seats</th>
                    <th className="p-4">Paid</th>
                    <th className="p-4">Gate Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e2a] text-gray-300">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#1c1c28] transition-colors">
                      <td className="p-4 font-semibold text-white">
                        <p>{b.attendeeName}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{b.email}</p>
                      </td>
                      <td className="p-4 font-bold text-gray-300">{b.eventName}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {b.tier}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-amber-400 flex items-center gap-1.5">
                        <QrCode size={14} />
                        {b.qrCodeToken}
                      </td>
                      <td className="p-4 font-mono font-bold text-white">{b.seatsCount}</td>
                      <td className="p-4 font-mono text-emerald-400 font-bold">{formatPrice(b.totalPaid)}</td>
                      <td className="p-4">
                        {b.status === "checked_in" ? (
                          <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-black flex items-center gap-1 w-fit">
                            <CheckCircle2 size={12} /> Checked In
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-gray-800 text-gray-400 border border-gray-700 w-fit block">
                            Confirmed
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {b.status !== "checked_in" && (
                          <button
                            onClick={() => {
                              checkInAttendee(b.id);
                              toast.success(`Attendee ${b.attendeeName} checked in!`);
                            }}
                            className="btn-gold text-[10px] py-1 px-2.5 font-bold uppercase cursor-pointer"
                          >
                            Scan & Check In
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 3: Financials Dashboard ── */}
      {activeTab === "financials" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#14141c] border border-[#1e1e2a] p-6 rounded-xs space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">TOTAL TICKET REVENUE</p>
              <p className="font-display text-4xl font-black text-emerald-400">{formatPrice(getTotalRevenue())}</p>
            </div>
            <div className="bg-[#14141c] border border-[#1e1e2a] p-6 rounded-xs space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">TOTAL TICKETS SOLD</p>
              <p className="font-display text-4xl font-black text-amber-400">
                {bookings.reduce((sum, b) => sum + b.seatsCount, 0)} Seats
              </p>
            </div>
            <div className="bg-[#14141c] border border-[#1e1e2a] p-6 rounded-xs space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">GATE CHECK-IN RATE</p>
              <p className="font-display text-4xl font-black text-white">
                {bookings.length === 0
                  ? "0%"
                  : `${Math.round((bookings.filter((b) => b.status === "checked_in").length / bookings.length) * 100)}%`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#14141c] border border-[#1e1e2a] p-6 md:p-8 w-full max-w-2xl rounded-xs shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1e1e2a] pb-3">
              <h2 className="font-display text-2xl text-white tracking-wide uppercase font-extrabold">
                CREATE EVENT CAMPAIGN
              </h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-white font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">EVENT NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="MARVEL COMIC CON 2026"
                  className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">VENUE LOCATION</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="MMRDA Grounds, Mumbai"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">VIP GATE ACCESS CODE</label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="MCC2026-VIP"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a] font-mono text-amber-400 uppercase font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">START DATE</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-marvel py-2 bg-[#08080c] border-[#1e1e2a] text-gray-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">END DATE</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-marvel py-2 bg-[#08080c] border-[#1e1e2a] text-gray-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">TICKET PRICE (₹)</label>
                  <input
                    type="number"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    placeholder="1499"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">TOTAL SEATS</label>
                  <input
                    type="number"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    placeholder="200"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">DESCRIPTION</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Event details..."
                  className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                />
              </div>

              {/* Event Cover Image Dropzone */}
              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  EVENT COVER IMAGE (IMAGEKIT DRAG & DROP)
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xs p-4 text-center cursor-pointer transition-all duration-200 ${
                    isDragActive
                      ? "border-amber-500 bg-amber-500/10"
                      : bannerUrl
                      ? "border-emerald-500/50 bg-[#08080c]"
                      : "border-[#1e1e2a] hover:border-gray-500 bg-[#08080c]"
                  }`}
                >
                  <input {...getInputProps()} />
                  {isUploading ? (
                    <div className="space-y-1.5 py-2 animate-pulse">
                      <Upload size={20} className="mx-auto text-amber-400 animate-spin" />
                      <p className="font-bold text-amber-400 text-xs">Uploading cover to ImageKit CDN...</p>
                    </div>
                  ) : bannerUrl ? (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={bannerUrl}
                          alt="Cover Preview"
                          className="w-16 h-12 object-cover rounded-xs border border-[#1e1e2a]"
                        />
                        <div className="text-left">
                          <p className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                            <Check size={14} /> Cover Uploaded
                          </p>
                          <p className="text-gray-500 text-[10px]">Drag new image to replace</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBannerUrl("");
                        }}
                        className="text-gray-400 hover:text-red-400 text-xs uppercase font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 py-1.5">
                      <Upload size={20} className="mx-auto text-gray-400" />
                      <p className="font-bold text-gray-300 text-xs">
                        {isDragActive ? "Drop event cover image here..." : "Drag & drop event cover image here, or click to browse"}
                      </p>
                      <p className="text-gray-500 text-[10px]">Uploads automatically to ImageKit CDN</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">STATUS</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a] text-xs"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live Now</option>
                  <option value="ended">Ended</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1e1e2a]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="btn-outline text-xs px-4 py-2 border-gray-700"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold text-xs px-6 py-2 font-black">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
