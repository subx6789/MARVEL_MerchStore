"use client";
// ─────────────────────────────────────────────────────────
// Admin Dashboard — Command Center Overview
// ─────────────────────────────────────────────────────────
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Package, Users, Zap, ArrowUpRight, ArrowDownRight, Circle } from "lucide-react";
import { staggerContainerVariants, staggerItemVariants, fadeUpVariants } from "@/lib/motion/variants";
import { formatPrice, formatDateTime } from "@/lib/utils";

const STATS = [
  { label: "Total Revenue", value: "₹4,82,350", change: "+12.4%", up: true, icon: TrendingUp, color: "text-emerald-400" },
  { label: "Total Orders", value: "1,247", change: "+8.2%", up: true, icon: ShoppingBag, color: "text-marvel-red" },
  { label: "Active Products", value: "342", change: "+24", up: true, icon: Package, color: "text-marvel-gold" },
  { label: "Total Users", value: "52,891", change: "+3.1%", up: true, icon: Users, color: "text-purple-400" },
];

const RECENT_ORDERS = [
  { id: "MVL-ABC123", customer: "Arjun Sharma", product: "Iron Man Repulsor Tee", amount: 1799, status: "confirmed", time: "2 min ago" },
  { id: "MVL-DEF456", customer: "Priya Kapoor", product: "Spider-Man Hoodie", amount: 3299, status: "shipped", time: "15 min ago" },
  { id: "MVL-GHI789", customer: "Rahul Singh", product: "Wakanda Forever Jacket", amount: 5999, status: "pending", time: "1 hour ago" },
  { id: "MVL-JKL012", customer: "Neha Patel", product: "Avengers Cap", amount: 899, status: "delivered", time: "3 hours ago" },
];

const LIVE_DROPS = [
  { name: "Iron Man Mark 85 Tee", remaining: 247, total: 500, endsIn: "5h 32m" },
  { name: "Avengers Endgame Set", remaining: 18, total: 100, endsIn: "23h 10m" },
];

const statusColors: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10",
  confirmed: "text-blue-400 bg-blue-400/10",
  processing: "text-purple-400 bg-purple-400/10",
  shipped: "text-orange-400 bg-orange-400/10",
  delivered: "text-emerald-400 bg-emerald-400/10",
  cancelled: "text-marvel-red bg-marvel-red/10",
};

export default function AdminDashboard() {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stats Grid */}
      <motion.div variants={staggerItemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="admin-stat">
              <div className="flex items-center justify-between mb-3">
                <span className="label-marvel">{stat.label}</span>
                <Icon size={16} className={stat.color} />
              </div>
              <p className="font-display text-3xl text-marvel-white tracking-wide">{stat.value}</p>
              <div className={`flex items-center gap-1 mt-2 ${stat.up ? "text-emerald-400" : "text-marvel-red"}`}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span className="font-sans text-xs font-600">{stat.change}</span>
                <span className="font-sans text-xs text-marvel-white-muted ml-1">vs last month</span>
              </div>
            </div>
          );
        })}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div variants={staggerItemVariants} className="lg:col-span-2 admin-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl text-marvel-white tracking-wide">RECENT ORDERS</h3>
            <a href="/admin/orders" className="label-marvel hover:text-marvel-white transition-colors">View all →</a>
          </div>
          <div className="space-y-0 divide-y divide-marvel-black-border">
            {RECENT_ORDERS.map((order) => (
              <div key={order.id} className="flex items-center gap-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-sans text-xs font-600 text-marvel-white-muted font-mono">{order.id}</span>
                    <span className="font-sans text-xs text-marvel-white-muted">·</span>
                    <span className="font-sans text-xs text-marvel-white-muted">{order.time}</span>
                  </div>
                  <p className="font-sans text-sm text-marvel-white truncate">{order.customer}</p>
                  <p className="font-sans text-xs text-marvel-white-muted truncate">{order.product}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-lg text-marvel-red">₹{order.amount.toLocaleString()}</p>
                  <span className={`font-sans text-[9px] font-700 uppercase tracking-widest px-2 py-0.5 ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Drops Monitor */}
        <motion.div variants={staggerItemVariants} className="admin-card">
          <div className="flex items-center gap-2 mb-5">
            <Zap size={16} className="text-marvel-red" />
            <h3 className="font-display text-xl text-marvel-white tracking-wide">LIVE DROPS</h3>
          </div>
          <div className="space-y-5">
            {LIVE_DROPS.map((drop) => {
              const soldPercent = Math.round(((drop.total - drop.remaining) / drop.total) * 100);
              return (
                <div key={drop.name}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-sans text-sm text-marvel-white leading-tight">{drop.name}</p>
                    <span className="badge-live text-[8px] ml-2 shrink-0">LIVE</span>
                  </div>
                  <div className="flex justify-between text-xs font-sans mb-1.5">
                    <span className="text-marvel-white-muted">{drop.total - drop.remaining} sold</span>
                    <span className={drop.remaining < 50 ? "text-marvel-red font-600" : "text-marvel-white-muted"}>
                      {drop.remaining} left
                    </span>
                  </div>
                  <div className="h-1 bg-marvel-black-border mb-2">
                    <div className="h-full bg-marvel-red" style={{ width: `${soldPercent}%` }} />
                  </div>
                  <p className="font-sans text-xs text-marvel-white-muted">Ends in {drop.endsIn}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-marvel-black-border">
            <a href="/admin/drops" className="btn-outline w-full text-center text-xs py-2.5">
              Manage Drops
            </a>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={staggerItemVariants} className="admin-card">
        <h3 className="font-display text-xl text-marvel-white tracking-wide mb-4">QUICK ACTIONS</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Add Product", href: "/admin/products/new" },
            { label: "Create Drop", href: "/admin/drops/new" },
            { label: "Add Coupon", href: "/admin/coupons" },
            { label: "Create Event", href: "/admin/events" },
            { label: "View Analytics", href: "/admin/analytics" },
          ].map((action) => (
            <a key={action.label} href={action.href} className="btn-outline text-xs py-2.5 px-4">
              {action.label}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
