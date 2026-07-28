"use client";
// ─────────────────────────────────────────────────────────
// Admin Orders Page
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import { Search, Eye, Filter } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const DEMO_ORDERS: Array<{ id: string; customer: string; items: string; total: number; status: string; date: string }> = [];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-marvel-white tracking-wide">ORDERS MANAGEMENT</h2>
        <p className="font-sans text-xs text-marvel-white-muted">Monitor orders, track fulfillment, update shipping statuses</p>
      </div>

      <div className="bg-marvel-black-card border border-marvel-black-border overflow-x-auto">
        <table className="w-full text-left font-sans text-xs">
          <thead className="bg-marvel-black-soft border-b border-marvel-black-border text-marvel-white-muted uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items Summary</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-marvel-black-border text-marvel-white-dim">
            {DEMO_ORDERS.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-marvel-white-muted">
                  No orders placed yet. Real customer orders will appear here.
                </td>
              </tr>
            ) : (
              DEMO_ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-marvel-black-hover transition-colors">
                  <td className="p-4 font-mono font-bold text-marvel-white">{o.id}</td>
                  <td className="p-4">{o.customer}</td>
                  <td className="p-4">{o.items}</td>
                  <td className="p-4 text-marvel-white-muted">{o.date}</td>
                  <td className="p-4 font-display text-sm text-marvel-red">{formatPrice(o.total)}</td>
                  <td className="p-4"><span className="uppercase text-[9px] font-bold tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-400">{o.status}</span></td>
                  <td className="p-4 text-right"><button className="p-1.5 hover:text-marvel-white"><Eye size={14} /></button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
