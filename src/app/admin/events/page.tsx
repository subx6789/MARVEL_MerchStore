"use client";

// ─────────────────────────────────────────────────────────
// Admin Events & QR Gate Management Page
// Dynamic Event Creation & Management via useProductStore
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { Plus, QrCode, Calendar, MapPin, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/stores/productStore";

export default function AdminEventsPage() {
  const { events, addEvent, deleteEvent } = useProductStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"upcoming" | "live" | "ended">("upcoming");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !venue || !date) {
      toast.error("Please fill in required fields");
      return;
    }

    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    addEvent({
      name,
      venue,
      date,
      description: description || "Official Marvel event campaign.",
      status,
      productsCount: 12,
      slug: generatedSlug,
    });

    toast.success(`Event campaign "${name}" created live!`);
    setName("");
    setVenue("");
    setDate("");
    setDescription("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wide uppercase font-bold">
            EVENT CAMPAIGNS & QR GATES
          </h1>
          <p className="text-xs text-gray-400">Manage physical event gates, issue pass tokens, and track scans</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-gold text-xs py-2.5 px-4 gap-2 cursor-pointer font-black"
        >
          <Plus size={16} /> Create Event Campaign
        </button>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14141c] border border-[#1e1e2a] p-6 md:p-8 w-full max-w-lg rounded-xs shadow-2xl space-y-4">
            <h2 className="font-display text-2xl text-white tracking-wide uppercase border-b border-[#1e1e2a] pb-3">
              CREATE EVENT CAMPAIGN
            </h2>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">VENUE</label>
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
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">EVENT DATES</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Aug 15–17, 2026"
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

      {/* Events Grid / Empty State */}
      {events.length === 0 ? (
        <div className="p-12 text-center bg-[#14141c] border border-[#1e1e2a] rounded-xs space-y-4">
          <QrCode size={44} className="text-[#f0b429] mx-auto" />
          <h2 className="font-display text-2xl text-white uppercase tracking-wider">NO EVENTS REGISTERED</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Click "Create Event Campaign" above to launch event campaigns live on the storefront!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((e) => (
            <div key={e.id} className="bg-[#14141c] border border-[#1e1e2a] p-6 rounded-xs space-y-4 shadow-xl relative">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {e.status}
                </span>

                <div className="flex items-center gap-2">
                  <QrCode size={22} className="text-[#f0b429]" />
                  <button
                    onClick={() => {
                      if (confirm(`Delete event "${e.name}"?`)) {
                        deleteEvent(e.id);
                        toast.success("Event deleted");
                      }
                    }}
                    className="text-gray-500 hover:text-red-500 p-1 transition-colors ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="font-display text-2xl text-white tracking-wide font-extrabold">{e.name}</h3>

              <div className="space-y-1.5 text-xs text-gray-400 font-sans">
                <div className="flex items-center gap-2"><MapPin size={14} className="text-[#f0b429]" /> {e.venue}</div>
                <div className="flex items-center gap-2"><Calendar size={14} className="text-[#f0b429]" /> {e.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
