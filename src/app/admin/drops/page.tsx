"use client";

// ─────────────────────────────────────────────────────────
// Admin Drops Scheduler Page
// Schedule & Launch Limited Drops Dynamically
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Plus, Zap, Calendar, Clock, Trash2, Package, Upload, Check } from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/stores/productStore";
import { formatPrice } from "@/lib/utils";
import { uploadToImageKit } from "@/lib/imagekit";
import { broadcastRealtimeEvent } from "@/lib/supabase/realtime";

export default function AdminDropsPage() {
  const { drops, addDrop, deleteDrop } = useProductStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [totalStock, setTotalStock] = useState("");
  const [status, setStatus] = useState<"live" | "scheduled" | "ended">("live");
  const [startsAt, setStartsAt] = useState(new Date().toISOString().slice(0, 16));
  const [endsAt, setEndsAt] = useState(new Date(Date.now() + 24 * 3600000).toISOString().slice(0, 16));
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Dropzone setup for Drop Image
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      toast.loading("Uploading drop banner to ImageKit...", { id: "drop-ik" });
      try {
        const res = await uploadToImageKit(file, "/marvel-drops");
        setImageUrl(res.url);
        toast.success("Drop image uploaded to ImageKit!", { id: "drop-ik" });
      } catch (err: any) {
        toast.error("Upload failed: " + (err?.message || "Error"), { id: "drop-ik" });
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
    if (!name || !price || !totalStock) {
      toast.error("Please fill in required fields");
      return;
    }

    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const dropId = `drp_${generatedSlug}_${Date.now()}`;
    const newDrop = {
      id: dropId,
      name,
      description: description || "Limited Marvel collector drop release.",
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
      totalStock: parseInt(totalStock),
      soldCount: 0,
      status,
      startsAt: startsAt ? new Date(startsAt).toISOString() : new Date().toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : new Date(Date.now() + 24 * 3600000).toISOString(),
      slug: generatedSlug,
      imageUrl: imageUrl || undefined,
    };

    addDrop(newDrop);
    broadcastRealtimeEvent("drop_scheduled", { drop: newDrop });

    toast.success(`Drop "${name}" scheduled live!`);
    setName("");
    setDescription("");
    setPrice("");
    setComparePrice("");
    setTotalStock("");
    setImageUrl("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wide uppercase font-bold">
            LIMITED DROPS ORCHESTRATION
          </h1>
          <p className="text-xs text-gray-400">Schedule and launch real-time limited drops</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-gold text-xs py-2.5 px-4 gap-2 cursor-pointer font-black"
        >
          <Zap size={16} /> Schedule New Drop
        </button>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#14141c] border border-[#1e1e2a] p-6 md:p-8 w-full max-w-2xl rounded-xs shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1e1e2a] pb-3">
              <h2 className="font-display text-2xl text-white tracking-wide uppercase font-extrabold">
                SCHEDULE NEW DROP
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
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">DROP TITLE</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Iron Man Mark 85 Helmet Drop"
                  className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">DESCRIPTION</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Exclusive drop description..."
                  className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">DROP PRICE (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="4999"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">ORIGINAL PRICE (₹)</label>
                  <input
                    type="number"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                    placeholder="6999"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">STOCK ALLOCATION</label>
                  <input
                    type="number"
                    value={totalStock}
                    onChange={(e) => setTotalStock(e.target.value)}
                    placeholder="100"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">STATUS</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a] text-xs w-full"
                  >
                    <option value="live">Live Now</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
              </div>

              {/* Date & Time Range Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar size={12} className="text-red-500" /> START DATE & TIME
                  </label>
                  <input
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="input-marvel py-2 bg-[#08080c] border-[#1e1e2a] text-gray-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock size={12} className="text-[#f0b429]" /> END DATE & TIME
                  </label>
                  <input
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="input-marvel py-2 bg-[#08080c] border-[#1e1e2a] text-gray-300 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Drop Banner Image Dropzone */}
              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  DROP BANNER IMAGE (IMAGEKIT DRAG & DROP)
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xs p-4 text-center cursor-pointer transition-all duration-200 ${
                    isDragActive
                      ? "border-red-500 bg-red-500/10"
                      : imageUrl
                      ? "border-emerald-500/50 bg-[#08080c]"
                      : "border-[#1e1e2a] hover:border-gray-500 bg-[#08080c]"
                  }`}
                >
                  <input {...getInputProps()} />
                  {isUploading ? (
                    <div className="space-y-1 py-1 animate-pulse">
                      <Upload size={20} className="mx-auto text-yellow-400 animate-spin" />
                      <p className="font-bold text-yellow-400 text-xs">Uploading to ImageKit CDN...</p>
                    </div>
                  ) : imageUrl ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={imageUrl} alt="Drop Banner Preview" className="w-12 h-12 object-cover rounded-xs border border-[#1e1e2a]" />
                        <div className="text-left">
                          <p className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                            <Check size={14} /> Imagekit Image Uploaded
                          </p>
                          <p className="text-gray-500 text-[10px]">Drag new file to replace</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageUrl("");
                        }}
                        className="text-gray-400 hover:text-red-400 text-xs font-bold uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 py-1">
                      <Upload size={20} className="mx-auto text-gray-400" />
                      <p className="font-bold text-gray-300 text-xs">Drag & drop drop banner image here, or click to browse</p>
                      <p className="text-gray-500 text-[10px]">ImageKit CDN integration enabled</p>
                    </div>
                  )}
                </div>
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
                  Launch Drop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drops Grid or Empty State */}
      {drops.length === 0 ? (
        <div className="p-12 text-center bg-[#14141c] border border-[#1e1e2a] rounded-xs space-y-4">
          <Zap size={44} className="text-[#f0b429] mx-auto" />
          <h2 className="font-display text-2xl text-white uppercase tracking-wider">NO DROPS SCHEDULED</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Click "Schedule New Drop" above to launch limited drops live on the storefront!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {drops.map((drop) => {
            const discountPercent = drop.comparePrice && drop.comparePrice > drop.price
              ? Math.round(((drop.comparePrice - drop.price) / drop.comparePrice) * 100)
              : 0;

            return (
              <div key={drop.id} className="bg-[#14141c] border border-[#1e1e2a] p-6 rounded-xs space-y-4 shadow-xl relative overflow-hidden">
                {drop.imageUrl && (
                  <div className="h-32 -mx-6 -mt-6 mb-2 overflow-hidden relative">
                    <img src={drop.imageUrl} alt={drop.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14141c] via-[#14141c]/40 to-transparent" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                        drop.status === "live"
                          ? "bg-red-500 text-white"
                          : drop.status === "scheduled"
                          ? "bg-[#f0b429] text-black"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {drop.status}
                    </span>
                    {discountPercent > 0 && (
                      <span className="bg-emerald-500 text-black text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-display text-2xl text-red-500 font-bold">{formatPrice(drop.price)}</span>
                      {drop.comparePrice && (
                        <span className="font-sans text-xs text-gray-500 line-through block -mt-1">
                          {formatPrice(drop.comparePrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Delete drop "${drop.name}"?`)) {
                          deleteDrop(drop.id);
                          toast.success("Drop deleted");
                        }
                      }}
                      className="text-gray-500 hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="font-display text-2xl text-white tracking-wide font-extrabold">{drop.name}</h3>

                {/* Date & Time Range Info */}
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-gray-400 bg-[#08080c] p-2.5 border border-[#1e1e2a] rounded-xs">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-red-500" /> Start: {new Date(drop.startsAt).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-[#f0b429]" /> End: {new Date(drop.endsAt).toLocaleString()}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-xs font-sans mb-1.5">
                    <span className="text-gray-400">Stock Allocation</span>
                    <span className="text-white font-bold">
                      {drop.soldCount} / {drop.totalStock} sold
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#1e1e2a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${Math.round((drop.soldCount / drop.totalStock) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
