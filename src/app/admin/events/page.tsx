"use client";

// ─────────────────────────────────────────────────────────
// Admin Events & QR Gate Management Page
// Dynamic Event Creation & Management via useProductStore
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Plus, QrCode, Calendar, MapPin, Trash2, Package, Upload, Check } from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/stores/productStore";
import { uploadToImageKit } from "@/lib/imagekit";

export default function AdminEventsPage() {
  const { events, addEvent, deleteEvent } = useProductStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<"upcoming" | "live" | "ended">("upcoming");

  // Dropzone setup for Event Banner
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      toast.loading("Uploading event banner to ImageKit...", { id: "evt-ik" });
      try {
        const res = await uploadToImageKit(file, "/marvel-events");
        setBannerUrl(res.url);
        toast.success("Event banner uploaded to ImageKit!", { id: "evt-ik" });
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
    });

    toast.success(`Event campaign "${name}" created live!`);
    setName("");
    setVenue("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setBannerUrl("");
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">START DATE & TIME</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-marvel py-2 bg-[#08080c] border-[#1e1e2a] text-gray-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">END DATE & TIME</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-marvel py-2 bg-[#08080c] border-[#1e1e2a] text-gray-300 text-xs"
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
