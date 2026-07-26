"use client";
// ─────────────────────────────────────────────────────────
// Admin Products Management Page
// Table, status toggles, stock controls
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, Eye, ShieldAlert } from "lucide-react";
import MarvelBadge from "@/components/shared/MarvelBadge";
import { formatPrice } from "@/lib/utils";

const DEMO_PRODUCTS = [
  { id: "1", name: "Iron Man Mark 85 Armor Tee", category: "Iron Man", type: "limited", status: "active", price: 2499, stock: 247, sku: "IM-85-TEE" },
  { id: "2", name: "Spider-Man Web Shooter Hoodie", category: "Spider-Man", type: "standard", status: "active", price: 3299, stock: 120, sku: "SM-WEB-HD" },
  { id: "3", name: "Comic Con Official Bomber", category: "Events", type: "event_only", status: "active", price: 8999, stock: 50, sku: "CC-BOMBER" },
  { id: "4", name: "Thor Mjolnir Collector Mug", category: "Thor", type: "standard", status: "archived", price: 699, stock: 0, sku: "TH-MUG" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [search, setSearch] = useState("");

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-marvel-white tracking-wide">PRODUCTS</h2>
          <p className="font-sans text-xs text-marvel-white-muted">Manage product catalog, inventory levels, and drop statuses</p>
        </div>
        <Link href="/admin/products/new" className="btn-marvel text-xs py-2.5 px-4 gap-2">
          <Plus size={14} /> Add New Product
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-marvel-black-card border border-marvel-black-border p-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-marvel-white-muted" />
          <input
            type="text"
            placeholder="Filter by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-marvel pl-9 pr-4 py-2 text-xs"
          />
        </div>
        <span className="label-marvel">{filtered.length} items</span>
      </div>

      {/* Products Table */}
      <div className="bg-marvel-black-card border border-marvel-black-border overflow-x-auto">
        <table className="w-full text-left font-sans text-xs">
          <thead className="bg-marvel-black-soft border-b border-marvel-black-border text-marvel-white-muted uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4">Type</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-marvel-black-border text-marvel-white-dim">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-marvel-black-hover transition-colors">
                <td className="p-4 font-semibold text-marvel-white">{p.name}</td>
                <td className="p-4 font-mono text-marvel-white-muted">{p.sku}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4"><span className="uppercase text-[9px] font-bold tracking-wider">{p.type}</span></td>
                <td className="p-4 font-display text-sm text-marvel-red">{formatPrice(p.price)}</td>
                <td className="p-4 font-mono">{p.stock}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                    p.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-marvel-black-border text-marvel-white-muted"
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button className="p-1.5 hover:text-marvel-white"><Edit3 size={14} /></button>
                  <button className="p-1.5 hover:text-marvel-red"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
