"use client";

// ─────────────────────────────────────────────────────────
// Admin Products Management Page
// Merchandising Taxonomy: Power Origins & Marvel Families Tagging
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Plus, Search, Trash2, Package, Check, Upload, Image as ImageIcon, Layers } from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/stores/productStore";
import { MARVEL_FAMILIES, POWER_ORIGINS, MERCH_CATEGORIES } from "@/types/taxonomy";
import { formatPrice } from "@/lib/utils";
import { uploadToImageKit } from "@/lib/imagekit";
import { broadcastRealtimeEvent } from "@/lib/supabase/realtime";

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
  const [category, setCategory] = useState("topwear");
  const [isUploading, setIsUploading] = useState(false);

  // react-dropzone configuration with live ImageKit upload
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      toast.loading("Uploading image to ImageKit CDN...", { id: "ik-upload" });
      try {
        const res = await uploadToImageKit(file);
        setImageUrl(res.url);
        toast.success("Image uploaded to ImageKit CDN!", { id: "ik-upload" });
      } catch (err: any) {
        toast.error("Failed to upload to ImageKit: " + (err.message || "Unknown error"), { id: "ik-upload" });
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

    const newProd = {
      name,
      slug: generatedSlug,
      price: priceNum,
      category: category,
      families: selectedFamilies,
      origins: selectedOrigins,
      stockCount: stockNum,
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600",
      status: "active" as const,
    };

    // Directly insert into Supabase Database via PostgreSQL Drizzle API
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProd),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.product) {
          const savedProd = { ...newProd, id: data.product.id };
          addProduct(savedProd);
          broadcastRealtimeEvent("product_created", { product: savedProd });
        }
      })
      .catch((err) => console.error("Supabase insert error:", err));

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
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-marvel text-xs bg-[#08080c] border-[#1e1e2a] !pl-10 pr-4 py-2"
          />
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{filtered.length} items</span>
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#14141c] border border-[#1e1e2a] p-6 md:p-8 w-full max-w-2xl rounded-xs shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1e1e2a] pb-3">
              <h2 className="font-display text-2xl text-white tracking-wide uppercase font-extrabold">
                ADD NEW MERCHANDISE PRODUCT
              </h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-white font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a] text-xs font-bold uppercase text-red-400"
                  >
                    {MERCH_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name} ({cat.tagline})
                      </option>
                    ))}
                  </select>
                </div>
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
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  PRODUCT IMAGE (IMAGEKIT DRAG & DROP)
                </label>
                
                {/* Drag and Drop Zone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xs p-5 text-center cursor-pointer transition-all duration-200 ${
                    isDragActive
                      ? "border-red-500 bg-red-500/10"
                      : imageUrl
                      ? "border-emerald-500/50 bg-[#08080c]"
                      : "border-[#1e1e2a] hover:border-gray-500 bg-[#08080c]"
                  }`}
                >
                  <input {...getInputProps()} />
                  {isUploading ? (
                    <div className="space-y-1.5 py-2 animate-pulse">
                      <Upload size={24} className="mx-auto text-marvel-gold animate-spin" />
                      <p className="font-bold text-marvel-gold text-xs">Uploading to ImageKit CDN...</p>
                    </div>
                  ) : imageUrl ? (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={imageUrl}
                          alt="Product Preview"
                          className="w-14 h-14 object-cover rounded-xs border border-[#1e1e2a]"
                        />
                        <div className="text-left">
                          <p className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                            <Check size={14} /> Image Selected
                          </p>
                          <p className="text-gray-500 text-[10px]">Drag a new image to replace</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageUrl("");
                        }}
                        className="text-gray-400 hover:text-red-400 text-xs uppercase font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 py-2">
                      <Upload size={24} className="mx-auto text-gray-400" />
                      <p className="font-bold text-gray-300 text-xs">
                        {isDragActive ? "Drop product image here..." : "Drag & drop product image here, or click to browse"}
                      </p>
                      <p className="text-gray-500 text-[10px]">Supports PNG, JPG, WEBP formats (ImageKit CDN)</p>
                    </div>
                  )}
                </div>
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
