"use client";
// ─────────────────────────────────────────────────────────
// Admin Layout — Operations Console
// ─────────────────────────────────────────────────────────
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Zap, ShoppingCart, Tag,
  Calendar, Users, BarChart2, Settings, ChevronLeft,
  ChevronRight, ExternalLink, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Drops", href: "/admin/drops", icon: Zap },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-marvel-black overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-marvel-black-card border-r border-marvel-black-border transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center border-b border-marvel-black-border h-14 px-4 shrink-0",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-marvel-red flex items-center justify-center shrink-0">
                <Shield size={12} className="text-white" />
              </div>
              <div>
                <div className="font-display text-sm text-marvel-white tracking-widest">ADMIN</div>
                <div className="font-sans text-[8px] text-marvel-white-muted tracking-widest uppercase">Operations</div>
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-marvel-white-muted hover:text-marvel-white hover:bg-marvel-black-hover transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-all duration-150 group relative",
                  isActive
                    ? "text-marvel-white bg-marvel-black-hover border-r-2 border-marvel-red"
                    : "text-marvel-white-muted hover:text-marvel-white hover:bg-marvel-black-hover"
                )}
              >
                <Icon size={16} className="shrink-0" />
                {!collapsed && (
                  <span className="font-sans text-sm font-500 truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-marvel-black-border p-3 shrink-0">
          <Link
            href="/"
            target="_blank"
            className={cn(
              "flex items-center gap-2 text-marvel-white-muted hover:text-marvel-white transition-colors px-1 py-2",
              collapsed && "justify-center"
            )}
          >
            <ExternalLink size={14} />
            {!collapsed && <span className="font-sans text-xs">View Store</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-marvel-black-border bg-marvel-black-soft flex items-center justify-between px-6 shrink-0">
          <h1 className="font-sans text-sm font-600 text-marvel-white capitalize">
            {pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="badge-live text-[9px] px-2 py-0.5">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Admin Active
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
