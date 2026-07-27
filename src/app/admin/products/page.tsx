"use client";

// ─────────────────────────────────────────────────────────
// Admin Products Management Page
// Merchandising Taxonomy: Power Origins & Marvel Families Tagging
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { Plus, Search, Trash2, Package, Check } from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/stores/productStore";
import { MARVEL_FAMILIES, POWER_ORIGINS } from "@/types/taxonomy";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const { products, addProduct, deleteProduct } = useProductStore();
  const [search, setSearch] = useState("");

  // New Product Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stockCount, setStockCount] = useState("");
  const [sku, setSku] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Taxonomy Tagging State
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const toggleTag = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stockCount) {
      toast.error("Please fill in required fields");
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stockCount);
    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    addProduct({
      name,
      slug: generatedSlug,
      price: priceNum,
      category: selectedFamilies[0] || selectedOrigins[0] || "general",
      families: selectedFamilies,
      origins: selectedOrigins,
      stockCount: stockNum,
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600",
      status: "active",
    });

    toast.success(`Product "${name}" created live with Families & Origins tagging!`);
    setName("");
    setPrice("");
    setStockCount("");
    setSku("");
    setImageUrl("");
    setSelectedFamilies([]);
    setSelectedOrigins([]);
    setIsAddOpen(false);
  };

  const handleDelete = (id: string, prodName: string) => {
    if (confirm(`Delete product "${prodName}" from catalog?`)) {
      deleteProduct(id);
      toast.success(`Product "${prodName}" deleted`);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wide uppercase font-bold">PRODUCTS MANAGEMENT</h1>
          <p className="text-xs text-gray-400">Merchandising Taxonomy: Power Origins & Marvel Families (Teams & Collections)</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-marvel text-xs py-2.5 px-4 gap-2 cursor-pointer shadow-lg"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-[#14141c] border border-[#1e1e2a] p-4 rounded-xs">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-marvel pl-9 pr-4 py-2 text-xs bg-[#08080c] border-[#1e1e2a]"
          />
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{filtered.length} items</span>
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#14141c] border border-[#1e1e2a] p-6 md:p-8 w-full max-w-2xl rounded-xs shadow-2xl space-y-4 my-8">
            <h2 className="font-display text-2xl text-white tracking-wide uppercase border-b border-[#1e1e2a] pb-3 font-extrabold">
              ADD NEW MERCHANDISE PRODUCT
            </h2>
            <form onSubmit={handleAddSubmit} className="space-y-5 text-xs font-sans">
              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">PRODUCT NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Iron Man Mark 85 Arc Tech Hoodie"
                  className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">PRICE (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2499"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">STOCK QUANTITY</label>
                  <input
                    type="number"
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                    placeholder="50"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="IM-85-HD"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">IMAGE URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                />
              </div>

              {/* ── 1. Families (Teams / Factions / Collections) ── */}
              <div className="bg-[#08080c] p-4 border border-[#1e1e2a] rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-red-500 font-bold uppercase tracking-wider">
                    FAMILIES & FACTIONS (Teams, Organizations & Collections)
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">Select 1 or more teams/collections</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {MARVEL_FAMILIES.map((fam) => {
                    const isSelected = selectedFamilies.includes(fam.slug);
                    return (
                      <button
                        type="button"
                        key={fam.slug}
                        onClick={() => toggleTag(selectedFamilies, setSelectedFamilies, fam.slug)}
                        className={`px-3 py-1.5 rounded-xs border text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-red-500 text-white border-red-500 shadow-[0_0_10px_rgba(226,54,54,0.5)]"
                            : "bg-[#14141c] text-gray-400 border-[#1e1e2a] hover:border-red-500 hover:text-white"
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        {fam.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── 2. Power Origins ── */}
              <div className="bg-[#08080c] p-4 border border-[#1e1e2a] rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[#00f0ff] font-bold uppercase tracking-wider">
                    POWER ORIGINS (Hero Classifications)
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">Select hero power origin</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {POWER_ORIGINS.map((org) => {
                    const isSelected = selectedOrigins.includes(org.slug);
                    return (
                      <button
                        type="button"
                        key={org.slug}
                        onClick={() => toggleTag(selectedOrigins, setSelectedOrigins, org.slug)}
                        className={`px-3 py-1.5 rounded-xs border text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-[#00f0ff] text-black border-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                            : "bg-[#14141c] text-gray-400 border-[#1e1e2a] hover:border-[#00f0ff] hover:text-white"
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        {org.name}
                      </button>
                    );
                  })}
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
                <button type="submit" className="btn-marvel text-xs px-6 py-2">
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table / Empty State */}
      {products.length === 0 ? (
        <div className="p-12 text-center bg-[#14141c] border border-[#1e1e2a] rounded-xs space-y-4">
          <Package size={44} className="text-gray-600 mx-auto" />
          <h2 className="font-display text-2xl text-white uppercase tracking-wider">NO PRODUCTS IN CATALOG</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Click "Add New Product" above to create merchandise with Families & Power Origins taxonomy tagging!
          </p>
        </div>
      ) : (
        <div className="bg-[#14141c] border border-[#1e1e2a] overflow-x-auto rounded-xs shadow-xl">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-[#08080c] border-b border-[#1e1e2a] text-gray-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Families & Teams</th>
                <th className="p-4">Power Origins</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2a] text-gray-300">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#1c1c28] transition-colors">
                  <td className="p-4 font-semibold text-white flex items-center gap-3">
                    <img src={p.imageUrl} alt={p.name} className="w-9 h-9 object-cover rounded-xs border border-[#1e1e2a]" />
                    <span>{p.name}</span>
                  </td>
                  <td className="p-4 font-mono text-gray-400">{p.sku}</td>
                  <td className="p-4">
                    {p.families && p.families.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {p.families.map((f) => (
                          <span key={f} className="px-2 py-0.5 text-[9px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                            {f}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {p.origins && p.origins.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {p.origins.map((o) => (
                          <span key={o} className="px-2 py-0.5 text-[9px] font-bold uppercase bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30">
                            {o}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="p-4 font-display text-sm text-red-500 font-bold">{formatPrice(p.price)}</td>
                  <td className="p-4 font-mono">{p.stockCount}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 hover:text-red-500 text-gray-400 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
