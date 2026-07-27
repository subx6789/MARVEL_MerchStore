"use client";

// ─────────────────────────────────────────────────────────
// Admin Drops Scheduler Page
// Schedule & Launch Limited Drops Dynamically
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { Plus, Zap, Calendar, Clock, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/stores/productStore";
import { formatPrice } from "@/lib/utils";

export default function AdminDropsPage() {
  const { drops, addDrop, deleteDrop } = useProductStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [totalStock, setTotalStock] = useState("");
  const [status, setStatus] = useState<"live" | "scheduled" | "ended">("live");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !totalStock) {
      toast.error("Please fill in required fields");
      return;
    }

    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    addDrop({
      name,
      description: description || "Limited Marvel collector drop release.",
      price: parseFloat(price),
      totalStock: parseInt(totalStock),
      soldCount: 0,
      status,
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 24 * 3600000).toISOString(),
      slug: generatedSlug,
    });

    toast.success(`Drop "${name}" scheduled live!`);
    setName("");
    setDescription("");
    setPrice("");
    setTotalStock("");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14141c] border border-[#1e1e2a] p-6 md:p-8 w-full max-w-lg rounded-xs shadow-2xl space-y-4">
            <h2 className="font-display text-2xl text-white tracking-wide uppercase border-b border-[#1e1e2a] pb-3">
              SCHEDULE NEW DROP
            </h2>
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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">PRICE (₹)</label>
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
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">ALLOCATED STOCK</label>
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
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a] text-xs"
                  >
                    <option value="live">Live Now</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="ended">Ended</option>
                  </select>
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
          {drops.map((drop) => (
            <div key={drop.id} className="bg-[#14141c] border border-[#1e1e2a] p-6 rounded-xs space-y-4 shadow-xl relative">
              <div className="flex items-center justify-between">
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

                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl text-red-500 font-bold">{formatPrice(drop.price)}</span>
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
          ))}
        </div>
      )}
    </div>
  );
}
