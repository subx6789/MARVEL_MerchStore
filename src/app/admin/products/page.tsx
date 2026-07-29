"use client";

// ─────────────────────────────────────────────────────────
// Admin Products Management Page
// Dynamic Per-Category Size & Stock Management System
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Plus,
  Search,
  Trash2,
  Package,
  Check,
  Upload,
  Image as ImageIcon,
  Layers,
  Ruler,
} from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/stores/productStore";
import { MARVEL_FAMILIES, MERCH_CATEGORIES, CATEGORY_SIZES } from "@/types/taxonomy";
import { formatPrice } from "@/lib/utils";
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit";
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

  // Category Size-wise Stock Management State
  const [sizeStocks, setSizeStocks] = useState<Record<string, number>>({});

  // Dropzone setup for ImageKit upload
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
        toast.error(
          "Failed to upload to ImageKit: " + (err.message || "Unknown error"),
          { id: "ik-upload" }
        );
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

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTag = (
    list: string[],
    setList: (val: string[]) => void,
    item: string
  ) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Helper to calculate total stock from individual size quantities
  const availableSizes = CATEGORY_SIZES[category] || [];
  const hasSizes = availableSizes.length > 0;

  const handleSizeStockChange = (size: string, val: string) => {
    const qty = parseInt(val) || 0;
    const next = { ...sizeStocks, [size]: qty };
    setSizeStocks(next);

    // Auto calculate total stock from size quantities
    const sum = Object.values(next).reduce((acc, current) => acc + current, 0);
    setStockCount(sum.toString());
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      toast.error("Please fill in required fields");
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stockCount) || 0;
    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newProd = {
      name,
      slug: generatedSlug,
      price: priceNum,
      category: category,
      families: selectedFamilies,
      stockCount: stockNum,
      sizeStocks: hasSizes ? sizeStocks : undefined,
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      imageUrl:
        imageUrl ||
        "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600",
      status: "active" as const,
    };

    // Insert into Supabase Database via API
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

    toast.success(`Product "${name}" created live with size stock control!`);
    setName("");
    setPrice("");
    setStockCount("");
    setSku("");
    setImageUrl("");
    setSelectedFamilies([]);
    setSizeStocks({});
    setIsAddOpen(false);
  };

  const handleDelete = (id: string, prodName: string) => {
    if (confirm(`Delete product "${prodName}" from catalog?`)) {
      const prodToDelete = products.find((p) => p.id === id);
      if (prodToDelete?.imageUrl) {
        deleteFromImageKit(prodToDelete.imageUrl);
      }
      deleteProduct(id);
      fetch(`/api/products?id=${id}&type=product`, { method: "DELETE" }).catch(
        (err) => console.error("Failed to delete product from Supabase DB:", err)
      );
      toast.success(`Product "${prodName}" deleted`);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wide uppercase font-bold">
            PRODUCT CATALOG & SIZING
          </h1>
          <p className="text-xs text-gray-400">
            Manage clothing sizes, footwear UK sizes, and inventory stocks
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-marvel text-xs py-2.5 px-4 gap-2 cursor-pointer font-bold"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center gap-4 bg-[#14141c] border border-[#1e1e2a] p-4 rounded-xs">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-marvel pl-10 py-2 text-xs bg-[#08080c] border-[#1e1e2a]"
          />
        </div>
        <span className="text-xs text-gray-400 font-mono">
          Total Products:{" "}
          <strong className="text-white">{filtered.length}</strong>
        </span>
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#14141c] border border-[#1e1e2a] p-6 md:p-8 w-full max-w-2xl rounded-xs shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1e1e2a] pb-4">
              <h2 className="font-display text-2xl text-white tracking-wide uppercase font-bold">
                ADD NEW PRODUCT
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
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  PRODUCT TITLE
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Iron Man Mark 85 Oversized Tee"
                  className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSizeStocks({});
                    }}
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a] text-xs font-bold"
                  >
                    {MERCH_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    PRICE (₹)
                  </label>
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
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    TOTAL STOCK
                  </label>
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
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="IM-85-HD"
                    className="input-marvel py-2.5 bg-[#08080c] border-[#1e1e2a]"
                  />
                </div>
              </div>

              {/* Dynamic Size & Stock Breakdown Box */}
              {hasSizes ? (
                <div className="bg-[#08080c] border border-amber-500/30 p-4 rounded-xs space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px]">
                    <Ruler size={15} />
                    <span>PER-SIZE INVENTORY CONTROL ({category.toUpperCase()})</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Set specific stock quantities for each available size. Total stock will update automatically.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-1">
                    {availableSizes.map((sz) => (
                      <div key={sz} className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-300 text-center uppercase">
                          {sz}
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={sizeStocks[sz] !== undefined ? sizeStocks[sz] : ""}
                          onChange={(e) => handleSizeStockChange(sz, e.target.value)}
                          placeholder="0"
                          className="input-marvel py-1.5 px-2 text-center text-xs bg-[#14141c] border-[#1e1e2a] focus:border-amber-400 font-bold text-amber-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#08080c] border border-purple-500/30 p-3 rounded-xs flex items-center justify-between text-xs">
                  <span className="text-purple-400 font-bold uppercase flex items-center gap-2">
                    <Package size={14} /> Fixed Size Item (Accessories)
                  </span>
                  <span className="text-gray-400 text-[10px]">No sizes required — One size fits all</span>
                </div>
              )}

              {/* Product Image Dropzone */}
              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  PRODUCT IMAGE (IMAGEKIT DRAG & DROP)
                </label>
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
                    <div className="space-y-2 py-3 animate-pulse">
                      <Upload size={24} className="mx-auto text-red-500 animate-spin" />
                      <p className="font-bold text-red-400 text-xs">Uploading to ImageKit CDN...</p>
                    </div>
                  ) : imageUrl ? (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-xs border border-[#1e1e2a]"
                        />
                        <div className="text-left">
                          <p className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                            <Check size={14} /> Image Uploaded
                          </p>
                          <p className="text-gray-500 text-[10px]">Drag new image to replace</p>
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
                      <ImageIcon size={24} className="mx-auto text-gray-400" />
                      <p className="font-bold text-gray-300 text-xs">
                        {isDragActive ? "Drop image file here..." : "Drag & drop product image, or click to select"}
                      </p>
                      <p className="text-gray-500 text-[10px]">Supports PNG, JPG, WEBP formats (ImageKit CDN)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Taxonomy: Families */}
              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers size={14} className="text-red-500" /> MARVEL FAMILIES & FACTIONS
                </label>
                <div className="flex flex-wrap gap-2 bg-[#08080c] p-3 border border-[#1e1e2a] rounded-xs max-h-36 overflow-y-auto">
                  {MARVEL_FAMILIES.map((fam) => {
                    const isSelected = selectedFamilies.includes(fam.slug);
                    return (
                      <button
                        key={fam.id}
                        type="button"
                        onClick={() => toggleTag(selectedFamilies, setSelectedFamilies, fam.slug)}
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 transition-all rounded-xs cursor-pointer border ${
                          isSelected
                            ? "bg-red-500 text-white border-red-500 shadow-md"
                            : "bg-[#14141c] text-gray-400 border-[#1e1e2a] hover:border-gray-500"
                        }`}
                      >
                        {fam.name}
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-[#14141c] border border-[#1e1e2a] rounded-xs space-y-4">
          <Package size={44} className="text-gray-500 mx-auto" />
          <h2 className="font-display text-2xl text-white uppercase tracking-wider">
            NO PRODUCTS FOUND
          </h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Click "Add New Product" above to create items with category size breakdown!
          </p>
        </div>
      ) : (
        <div className="bg-[#14141c] border border-[#1e1e2a] overflow-x-auto rounded-xs shadow-xl">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-[#08080c] border-b border-[#1e1e2a] text-gray-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Size Breakdown</th>
                <th className="p-4">Price</th>
                <th className="p-4">Total Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2a] text-gray-300">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-[#1c1c28] transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-xs border border-[#1e1e2a]"
                    />
                    <div>
                      <p className="font-bold text-white">{product.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">
                        {product.sku}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 font-semibold capitalize text-amber-400">
                    {product.category}
                  </td>
                  <td className="p-4">
                    {product.sizeStocks && Object.keys(product.sizeStocks).length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-xs font-mono text-[10px]">
                        {Object.entries(product.sizeStocks).map(([sz, qty]) => (
                          <span
                            key={sz}
                            className={`px-1.5 py-0.5 rounded-xs border ${
                              qty > 0
                                ? "bg-[#08080c] text-amber-400 border-amber-500/30 font-bold"
                                : "bg-red-500/10 text-red-400 border-red-500/20 opacity-60"
                            }`}
                          >
                            {sz}: {qty}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-[10px] italic">
                        {product.category === "accessories" ? "One Size (Fixed)" : "Standard"}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-400">
                    {formatPrice(product.price)}
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {product.stockCount}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="text-gray-500 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
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
