"use client";
import { TrendingUp, BarChart2, DollarSign, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-marvel-white tracking-wide">ANALYTICS & DROP PERFORMANCE</h2>
        <p className="font-sans text-xs text-marvel-white-muted">Revenue breakdowns, drop velocity, conversion statistics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-stat">
          <span className="label-marvel">Gross Revenue</span>
          <p className="font-display text-3xl text-marvel-white">₹4,82,350</p>
          <span className="text-xs text-emerald-400 font-bold">+14.2%</span>
        </div>
        <div className="admin-stat">
          <span className="label-marvel">Drop Conversion Rate</span>
          <p className="font-display text-3xl text-marvel-gold">18.4%</p>
          <span className="text-xs text-emerald-400 font-bold">+3.1%</span>
        </div>
        <div className="admin-stat">
          <span className="label-marvel">Avg Order Value</span>
          <p className="font-display text-3xl text-marvel-white">₹2,868</p>
          <span className="text-xs text-emerald-400 font-bold">+5.8%</span>
        </div>
        <div className="admin-stat">
          <span className="label-marvel">Event Pass Scans</span>
          <p className="font-display text-3xl text-purple-400">1,420</p>
          <span className="text-xs text-purple-400 font-bold">Comic Con Mumbai</span>
        </div>
      </div>
    </div>
  );
}
