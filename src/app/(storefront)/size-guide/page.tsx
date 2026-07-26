// ─────────────────────────────────────────────────────────
// Size Guide Page
// ─────────────────────────────────────────────────────────
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Size Guide — MARVEL MerchStore" };

export default function SizeGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-6">
      <h1 className="font-display text-hero-md text-marvel-white tracking-wide">SIZE GUIDE</h1>
      <div className="bg-marvel-black-card border border-marvel-black-border p-6 overflow-x-auto">
        <table className="w-full text-left font-sans text-xs">
          <thead className="bg-marvel-black-soft border-b border-marvel-black-border text-marvel-white-muted uppercase text-[10px]">
            <tr>
              <th className="p-3">Size</th>
              <th className="p-3">Chest (Inches)</th>
              <th className="p-3">Length (Inches)</th>
              <th className="p-3">Shoulder (Inches)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-marvel-black-border text-marvel-white-dim">
            <tr><td className="p-3 font-bold">S</td><td className="p-3">38"</td><td className="p-3">27"</td><td className="p-3">17.5"</td></tr>
            <tr><td className="p-3 font-bold">M</td><td className="p-3">40"</td><td className="p-3">28"</td><td className="p-3">18.5"</td></tr>
            <tr><td className="p-3 font-bold">L</td><td className="p-3">42"</td><td className="p-3">29"</td><td className="p-3">19.5"</td></tr>
            <tr><td className="p-3 font-bold">XL</td><td className="p-3">44"</td><td className="p-3">30"</td><td className="p-3">20.5"</td></tr>
            <tr><td className="p-3 font-bold">XXL</td><td className="p-3">46"</td><td className="p-3">31"</td><td className="p-3">21.5"</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
